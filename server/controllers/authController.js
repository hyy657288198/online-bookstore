const { hash, compare } = require('bcrypt');
const pool = require('../database/db');
const passport = require('passport');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const util = require('../util/util')


function generateToken(user) {
  return jwt.sign({ userEmail: user.email, username: user.username, }, 'your-secret-key', { expiresIn: '1h' });
}

// Controller for Google OAuth authentication
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

function saveUserDataToSession(req, login_user) {
  req.session.userData = {
    token: generateToken(login_user),
    username: login_user.username,
    email: login_user.email,
    password: login_user.password,
    is_active: login_user.is_active,
    is_admin: login_user.is_admin
  };
}

// Handle Google login
exports.handleGoogleAuthCallback = async (req, res, next) => {
  console.log("get in google callback")
  console.log(util.backend + '/auth/google/callback')
  passport.authenticate('google', async (err, user) => {
    if (err) {
      console.error('Error during Google authentication:', err);
      return res.redirect('/login?error=google'); // Redirect to login page with an error parameter
    }

    if (!user) {
      return res.redirect('/login?error=google'); // Redirect to login page if authentication fails
    }
    console.log(user)

    try {
      // Check if the user exists in your database using their email
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [user.emails[0].value]);
      console.log(user.emails[0].value)
      console.log("searching result for google login")
      console.log(existingUser)
      if (existingUser.rows.length > 0) {
        console.log("exists")
        const login_user = await pool.query('SELECT * FROM users WHERE email = $1', [user.emails[0].value]);
        if (login_user.rows.length === 0) {
          throw new Error('Invalid email or password');
        }
        if(!login_user.rows[0].is_active){
          throw new Error('Account is deactivated. Please contact the site administrator.');
        }
        saveUserDataToSession(req, login_user.rows[0])
        console.log("save data")
        console.log(req.session.userData)
        console.log(req.session)
        return res.redirect(util.frontend + '/google_login');

      } else {
        console.log("register google user")
        // User doesn't exist, register them
        const hashedPassword = await hash(user.emails[0].value, saltRounds);
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [user.displayName, user.emails[0].value, hashedPassword]);
        const login_user = await pool.query('SELECT * FROM users WHERE email = $1', [user.emails[0].value]);
        saveUserDataToSession(req, login_user.rows[0])
        return res.redirect(util.frontend + '/google_login');
      }
    } catch (error) {
      console.error('Error handling Google authentication callback:', error);
      return res.redirect('/login?error=google'); // Redirect to login page with an error parameter
    }
  })(req, res, next);
};



exports.registerUser = async function(username, email, password) {
  try {
    // Check if email exists
    const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      throw new Error('Email already exists');
    }

    // Check if username exists
    const existingUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUsername.rows.length > 0) {
      throw new Error('Username already exists');
    }

    // Use bcrypt to encrypt passwords
    const hashedPassword = await hash(password, saltRounds);

    // Insert new user
    await pool.query('INSERT INTO users (username, email, password, is_active, is_admin) VALUES ($1, $2, $3, $4, $5)', [username, email, hashedPassword, false, false]);
    return 'User registered successfully';
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Internal Server Error');
  }
};

exports.loginUser = async function(email, password) {
  try {
    // Verify user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    if(!user.rows[0].is_active){
      throw new Error('Account is deactivated. Please contact the site administrator.');
    }
    const match = await compare(password, user.rows[0].password);
    if (match) {
      const token = generateToken(user.rows[0]);
      return {
        token,
        username: user.rows[0].username,
        email: user.rows[0].email,
        password: user.rows[0].password,
        is_active: user.rows[0].is_active,
        is_admin: user.rows[0].is_admin
      };
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    if (error.message === 'Account is deactivated. Please contact the site administrator.') {
      throw new Error('Account is deactivated. Please contact the site administrator.');
    } else {
      console.error('Error logging in:', error);
      throw new Error('Internal Server Error');
    }
  }
};
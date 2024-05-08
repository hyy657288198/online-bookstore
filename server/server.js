const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const booklistRoutes = require('./routes/booklistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const util = require('./util/util')
const pool = require("./database/db");
const path = require('path');

const app = express();
// Use session middleware
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
/*app.use(cors());*/
app.use(cors({
    cookie: {
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
    },
    origin: util.frontend,
    credentials: true,
}));
app.use(bodyParser.json());

// Book routes
app.use('/book', bookRoutes);

// Auth routes
app.use('/auth', authRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Booklist routes
app.use('/booklists', booklistRoutes);

// Cart routes
app.use('/carts', cartRoutes);

// Order routes
app.use('/orders', orderRoutes);

app.get('/verify/:verificationToken', async (req, res) => {
    const { verificationToken } = req.params;

    // Find the user with the given verification token
    const user = await pool.query(
        "SELECT user_email FROM user_verification WHERE validation_token = $1",
        [verificationToken]
    );

    if (user.rows.length === 0) {
        return res.status(404).send('Invalid verification token.');
    }
    const user_email = user.rows[0].user_email;

    // Mark the user as verified and clear the verification token
    await pool.query(
        "UPDATE users SET is_active = true WHERE email = $1",
        [user_email]
    );
    await pool.query(
        "DELETE FROM user_verification WHERE validation_token = $1 RETURNING user_email",
        [verificationToken]
    );

    // Redirect the user to your application
    res.redirect(util.frontend);
});


//Google login
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: '748150668515-nrsc3n0enatn2p7ah7hbh1obl718v9nj.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: util.backend + '/auth/google/callback',
    proxy: true,
    scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    // Store user information in the database if needed
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


app.get('/google_login', (req, res) => {
    console.log("get in google login success")
    console.log(req.session)
    if (req.session.userData) {
        console.log("google data")
        const userData = req.session.userData;
        console.log(userData)
        return res.json(userData);
    } else {
        console.log("no data")
        return res.redirect(util.frontend);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

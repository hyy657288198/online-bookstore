const pool = require('../database/db');

// Middleware to check if a user is an admin
exports.isAdmin = async function(req, res, next) {
  const email = req.user.userEmail;
  try {
    const result = await pool.query('SELECT is_admin FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0 && result.rows[0].is_admin) {
      next();
    } else {
      res.status(403).json({ error: 'User does not have admin privileges' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Toggle comment visibility
exports.toggleCommentVisibility = async function(req, res) {
  const { commentId } = req.params;
  try {
    console.log("get into review")
    await pool.query('UPDATE comments SET is_hidden = NOT is_hidden WHERE comment_id = $1', [commentId]);
    console.log("update")
    res.status(200).json({ message: 'Comment visibility toggled successfully' });
  } catch (error) {
    console.error('Error hiding/unhiding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Toggle user activation status
exports.toggleUserActivationStatus = async function(req, res) {
  const userEmail = req.params.email;
  try {
    console.log("get in")
    await pool.query('UPDATE users SET is_active = NOT is_active WHERE email = $1', [userEmail]);
    console.log("update")
    res.status(200).json({ message: 'User activation status toggled successfully' });
  } catch (error) {
    console.error('Error toggling user activation status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Grant admin privileges to another user
exports.grantAdminPrivileges = async function(req, res) {
  const userEmail = req.params.email;
  try {
    await pool.query('UPDATE users SET is_admin = true WHERE email = $1', [userEmail]);
    res.status(200).json({ message: 'Admin privileges granted successfully' });
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all users with their admin privileges and activation status
exports.getAllUsers = async function(req, res) {
  try {
    const userEmail = req.user.userEmail;
    const result = await pool.query('SELECT email, username, is_admin, is_active FROM users WHERE email <> $1', [userEmail]);
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
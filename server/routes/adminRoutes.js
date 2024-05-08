const express = require('express');
const adminController = require('../controllers/adminController');
const verifyTokenMethod = require('../verifyToken');

const router = express.Router();
const { isAdmin, toggleCommentVisibility, toggleUserActivationStatus, grantAdminPrivileges, getAllUsers } = adminController;
// Route to hide or unhide a comment
router.get('/comment/:commentId/hide', verifyTokenMethod, isAdmin, toggleCommentVisibility);

// Route to activate or deactivate a user
router.get('/user/:email/activate', verifyTokenMethod, isAdmin, toggleUserActivationStatus);

// Route to grant admin privileges to another user
router.get('/user/:email/grant-admin', verifyTokenMethod, isAdmin, grantAdminPrivileges);

//Route to get all users with their admin privileges and activation status
router.get('/getAllUsers', verifyTokenMethod, isAdmin, getAllUsers);

module.exports = router;
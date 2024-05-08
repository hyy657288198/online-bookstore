const express = require('express');
const booklistController = require('../controllers/booklistController');
const {
  createBookList,
  getUserBooklists,
  deleteBooklist,
  addBookToBooklist,
  addCommentToPublicBooklist,
  deleteBookFromBooklist,
  getAllBooklists,
  showAllComment,
  showUnhiddenComment,
  getUserBooklistsName
} = booklistController;
const verifyTokenMethod = require('../verifyToken');

const router = express.Router();

// Create a new booklist - ok
router.post('/create', verifyTokenMethod,createBookList);

// Get user's booklists - ok
router.get('/user', verifyTokenMethod,getUserBooklists);

// Get user's booklists name - ok
router.get('/booklistName', verifyTokenMethod, getUserBooklistsName);

// Get all user's booklists - ok
router.get('/allBooklist', getAllBooklists);

// Delete a booklist
router.delete('/delete/:listName', deleteBooklist);

// Add a book to a booklist - ok
router.post('/add-book/', verifyTokenMethod,addBookToBooklist);

// Add comment to public booklist - ok
router.post('/:listName/add-comment', verifyTokenMethod, addCommentToPublicBooklist);

// Delete a book from the booklist
router.delete('/:listName/delete-book/:bookId', verifyTokenMethod, deleteBookFromBooklist);

// Get all comments - ok
router.get('/allComments/:listName', showAllComment);

// Get unhidden comments - ok
router.get('/unhiddenComments/:listName', showUnhiddenComment);

module.exports = router;

const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();
const { getBooks } = bookController;

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

router.post('/api/books', getBooks);

module.exports = router;

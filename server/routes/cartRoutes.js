// cartRoutes.js

const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const verifyTokenMethod = require("../verifyToken");

// Add books to cart
router.post('/add-to-cart', verifyTokenMethod, CartController.addToCart);

// Remove books from cart
router.delete('/remove-from-cart/:bookId', verifyTokenMethod, CartController.removeFromCart);

// Get the contents of the user's shopping cart
router.get('/get-cart-contents', verifyTokenMethod, CartController.getCartContents);

module.exports = router;

const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const verifyTokenMethod = require("../verifyToken");

// Users place orders
router.get('/place-order', verifyTokenMethod, OrderController.placeOrder);

// Get the user's orders
router.get('/get-user-orders', verifyTokenMethod, OrderController.getUserOrders);

module.exports = router;

const pool = require('../database/db');

// Users place orders
exports.placeOrder = async (req, res) => {
  console.log(req.body);
  const email = req.user.userEmail;
  const username = req.user.username
  try {
    // Fetch cart items for the current user
    const cartResult = await pool.query('SELECT * FROM carts WHERE user_email = $1', [email]);
    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'No items in the cart to place an order' });
    }

    const orderIds = [];

    // Insert each cart item into the orders table separately
    for (const cartItem of cartItems) {
      const { book_id, book_cover, book_name, book_price, quantity } = cartItem;

      const totalPrice = book_price * quantity;

      const orderResult = await pool.query(
          'INSERT INTO orders (user_email, username, book_cover, book_name, book_price, quantity, total_price, book_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING order_id',
          [email, username, book_cover, book_name, book_price, quantity, totalPrice, book_id]
      );

      const orderId = orderResult.rows[0].order_id;
      orderIds.push(orderId);
    }

    // Delete all items from the carts table for the current user
    await pool.query('DELETE FROM carts WHERE user_email = $1', [email]);
    res.status(201).json({ message: 'Orders placed successfully' });
  } catch (error) {
    console.error('Error placing orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  const email = req.user.userEmail;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_email = $1', [email]);
    const userOrders = result.rows;
    res.status(200).json({ userOrders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
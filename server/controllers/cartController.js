const pool = require('../database/db');

// Add books to cart
exports.addToCart = async (req, res) => {
  const { bookId, bookName, bookAuthor, bookCover, bookPrice, quantity } = req.body;
  const email = req.user.userEmail

  try {
    // Check if the book is already in the cart
    const checkResult = await pool.query('SELECT * FROM carts WHERE user_email = $1 AND book_id = $2', [email, bookId]);

    if (checkResult.rows.length > 0) {
      // The book is already in the cart, update the quantity
      await pool.query('UPDATE carts SET quantity = quantity + $1 WHERE user_email = $2 AND book_id = $3', [quantity, email, bookId]);
    } else {
      // Book not in cart, add to cart
      await pool.query(
          'INSERT INTO carts (user_email, book_id, book_name, book_author, book_cover, book_price, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [email, bookId, bookName, bookAuthor, bookCover, bookPrice, quantity]
      );
    }

    res.status(201).json({ message: 'Book added to cart successfully' });
  } catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove books from cart
exports.removeFromCart = async (req, res) => {
  const { bookId } = req.params;
  const email = req.user.userEmail
  console.log("cart email "+email)

  try {
    const result = await pool.query('DELETE FROM carts WHERE user_email = $1 AND book_id = $2 RETURNING *', [email, bookId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found in cart' });
    }

    res.status(200).json({ message: 'Book removed from cart successfully' });
  } catch (error) {
    console.error('Error removing book from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get the contents of the user's shopping cart
exports.getCartContents = async (req, res) => {
  const email = req.user.userEmail;
  console.log(email)
  try {
    const result = await pool.query('SELECT * FROM carts WHERE user_email = $1', [email]);
    const cartContents = result.rows;
    console.log("cart: "+cartContents)

    res.status(200).json({ cartContents });
  } catch (error) {
    console.error('Error fetching cart contents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

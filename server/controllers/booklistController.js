const pool = require('../database/db');

exports.createBookList = async (req, res) => {
  const { listName } = req.body;
  const userEmail = req.user.userEmail;

  try {
    const countResult = await pool.query('SELECT COUNT(DISTINCT list_name) AS count FROM booklists WHERE user_email = $1', [userEmail]);
    const uniqueListCount = parseInt(countResult.rows[0].count, 10);
    const checkResult = await pool.query('SELECT * FROM booklists WHERE list_name = $1', [listName]);
    if (checkResult.rows.length === 0) {
      if(uniqueListCount <= 9){
        // Insert booklist into the database
        const result = await pool.query(
            'INSERT INTO booklists (list_name, user_email, created_at, modified_at) VALUES ($1, $2, NOW(), NOW()) RETURNING list_id',
            [listName, userEmail]
        );
        res.status(201).json({ listName, message: 'Booklist created successfully' });
      }else{
        return res.status(402).json({ error: 'Reach the limit of booklists. Please remove some booklist first.' });
      }
    }else{
      return res.status(403).json({ error: 'This name exists.' });
    }
  } catch (error) {
    console.error('Error creating booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all booklists for the user
exports.getUserBooklists = async (req, res) => {
  const userEmail = req.user.userEmail;

  try {
    const result = await pool.query('SELECT * FROM booklists WHERE user_email = $1', [userEmail]);

    // Filter out rows with any null values
    const filteredBooklists = result.rows.filter(booklist =>
        Object.values(booklist).every(value => value !== null)
    );

    // Merge rows with the same list_name, user_email, and modified_at
    const mergedBooklists = mergeRows(filteredBooklists);

    res.status(200).json({ booklists: mergedBooklists });
  } catch (error) {
    console.error('Error fetching user booklists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all booklists name for the user
exports.getUserBooklistsName = async (req, res) => {
  const userEmail = req.user.userEmail;

  try {
    const result = await pool.query('SELECT DISTINCT list_name FROM booklists WHERE user_email = $1', [userEmail]);
    res.status(200).json({ booklists: result });
  } catch (error) {
    console.error('Error fetching user booklists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to merge rows with the same list_name, user_email, and modified_at
function mergeRows(originalBooklists) {
  const transformedBooklists = [];

  // Create a map to store data for each unique list_name
  const listMap = new Map();

  originalBooklists.forEach((item) => {
    const key = `${item.user_email}-${item.list_name}`;

    if (!listMap.has(key)) {
      // If the key is not present in the map, initialize it
      listMap.set(key, {
        user_email: item.user_email,
        list_name: item.list_name,
        modified_at: item.modified_at,
        subtable:{
          book_name: [item.book_name],
          book_id: [item.book_id],
          book_cover: [item.book_cover],
          book_author: [item.book_author.replace(/[{"}]/g, '')],
        },
      });
    } else {
      // If the key is present, append data to the existing entry
      const entry = listMap.get(key);
      entry.subtable.book_name.push(item.book_name);
      entry.subtable.book_id.push(item.book_id);
      entry.subtable.book_cover.push(item.book_cover);
      entry.subtable.book_author.push(item.book_author.replace(/[{"}]/g, ''));
    }
  });

  // Convert map values back to an array
  listMap.forEach((value) => {
    transformedBooklists.push(value);
  });

  return transformedBooklists;
}

// Get all booklists
exports.getAllBooklists = async (req, res) => {
  try {
    console.log("get in all booklists")
    const query = `
      SELECT *
      FROM booklists
      WHERE list_name IN (
        SELECT DISTINCT ON (list_name) list_name
        FROM booklists
        ORDER BY list_name, modified_at DESC
        LIMIT 20
      )
      ORDER BY modified_at DESC;
    `;

    const result = await pool.query(query);

    // Filter out rows with any null values
    const filteredBooklists = result.rows.filter(booklist =>
        Object.values(booklist).every(value => value !== null)
    );

    // Merge rows with the same list_name, user_email, and modified_at
    const mergedBooklists = mergeRows(filteredBooklists);
    console.log("mergedBooklists")
    console.log(mergedBooklists)
    res.status(200).json({ booklists: mergedBooklists });
  } catch (error) {
    console.error('Error fetching user booklists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete the specified booklist
exports.deleteBooklist = async (req, res) => {
  const listName = req.params.listName;
  try {
    // Check if the specified booklist belongs to the user
    const checkResult = await pool.query('SELECT * FROM booklists WHERE list_name = $1', [listName]);
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Booklist not found or does not belong to the user' });
    }

    // Delete the booklist
    await pool.query('DELETE FROM booklists WHERE list_name = $1', [listName]);

    res.status(200).json({ message: 'Booklist deleted successfully' });
  } catch (error) {
    console.error('Error deleting booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a book to the selected booklist
exports.addBookToBooklist = async (req, res) => {
  const userEmail = req.user.userEmail;
  const { listName, author, cover, bookId, bookName } = req.body;

  try {
    console.log("get in")
    // Checks if a booklist exists for each selection
    const checkResult = await pool.query('SELECT * FROM booklists WHERE list_name = $1', [listName]);
    if (checkResult.rows.length === 0) {
      console.log("no booklist")
      return res.status(404).json({ error: `Booklist not found` });
    }

    const checkResult2 = await pool.query('SELECT * FROM booklists WHERE list_name = $1 AND book_id = $2', [listName, bookId]);
    if (checkResult2.rows.length > 0) {
      console.log("book exist")
      return res.status(404).json({ error: `book exist` });
    }

    await pool.query(
        'INSERT INTO booklists (user_email, list_name, created_at, modified_at, book_name, book_id, book_cover, book_author) VALUES ($1, $2, NOW(), NOW(), $3, $4, $5, $6) RETURNING list_id',
        [userEmail, listName, bookName, bookId, cover, author]
    );
    // Update modified_at for all rows with the same list_name
    await pool.query('UPDATE booklists SET modified_at = NOW() WHERE list_name = $1', [listName]);
    res.status(201).json({ message: 'Book added to selected booklists successfully' });
  } catch (error) {
    console.error('Error adding book to booklists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a book from the selected booklist
exports.deleteBookFromBooklist = async (req, res) => {
  const { listName, bookId } = req.params;
  const userEmail = req.user.userEmail;

  try {
    // Check if the specified booklist belongs to the user
    const checkResult = await pool.query('SELECT * FROM booklists WHERE list_name = $1', [listName]);
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Booklist not found or does not belong to the user' });
    }

    // Delete the specified book from the booklist
    await pool.query(
        'DELETE FROM booklists WHERE list_name = $1 AND user_email = $2 AND book_id = $3',
        [listName, userEmail, bookId]
    );

    const checkResult2 = await pool.query('SELECT * FROM booklists WHERE list_name = $1', [listName]);
    if (checkResult2.rows.length !== 0) {
      // Update modified_at for all rows with the same list_name
      await pool.query('UPDATE booklists SET modified_at = NOW() WHERE list_name = $1', [listName]);

    }
    res.status(200).json({ message: 'Book deleted from the booklist successfully' });
  } catch (error) {
    console.error('Error deleting book from booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add comments to public booklists
exports.addCommentToPublicBooklist = async (req, res) => {
  const { listName } = req.params;
  const { content } = req.body;
  const userEmail = req.user.userEmail;

  try {
    const result = await pool.query(
        'INSERT INTO comments (content, user_email, booklist_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING comment_id',
        [content, userEmail, listName]
    );

    const commentId = result.rows[0].comment_id;

    res.status(201).json({ commentId, message: 'Comment added to public booklist successfully' });
  } catch (error) {
    console.error('Error adding comment to public booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.showAllComment = async (req, res) => {
  const { listName } = req.params;

  try {
    const result = await pool.query(
        'SELECT comment_id, user_email, is_hidden, content FROM comments WHERE booklist_id = $1',
        [listName]
    );
    const comments = result.rows;
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error adding comment to public booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.showUnhiddenComment = async (req, res) => {
  const { listName } = req.params;

  try {
    console.log("get in")
    const result = await pool.query(
        'SELECT user_email, content FROM comments WHERE booklist_id = $1 AND is_hidden = false',
        [listName]
    );
    console.log("get data")
    const comments = result.rows;
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error adding comment to public booklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
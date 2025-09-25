const connection = require('../config/database');

class Review {
    static async create(reviewData) {
        const { bookId, userId, rating, comment } = reviewData;
        const query = 'INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
        const [result] = await connection.promise().execute(query, [bookId, userId, rating, comment]);
        return result.insertId;
    }

    static async findByBookId(bookId) {
        const query = `
      SELECT r.*, u.username 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.book_id = ? AND r.deleted_at IS NULL
      ORDER BY r.created_at DESC
    `;
        const [rows] = await connection.promise().execute(query, [bookId]);
        return rows;
    }

    static async findByUserAndBook(userId, bookId) {
        const query = 'SELECT * FROM reviews WHERE user_id = ? AND book_id = ? AND deleted_at IS NULL';
        const [rows] = await connection.promise().execute(query, [userId, bookId]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM reviews WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await connection.promise().execute(query, [id]);
        return rows[0];
    }

    static async update(id, reviewData) {
        const { rating, comment } = reviewData;
        const query = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND deleted_at IS NULL';
        const [result] = await connection.promise().execute(query, [rating, comment, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL';
        const [result] = await connection.promise().execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getAverageRating(bookId) {
        const query = 'SELECT AVG(rating) as average_rating FROM reviews WHERE book_id = ? AND deleted_at IS NULL';
        const [rows] = await connection.promise().execute(query, [bookId]);
        return rows[0].average_rating || 0;
    }
}

module.exports = Review;

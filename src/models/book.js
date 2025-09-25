const connection = require('../config/database');

class Book {
    static async create(bookData) {
        const { title, author, genre, description, publishedYear } = bookData;
        const query = 'INSERT INTO books (title, author, genre, description, published_year) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.promise().execute(query, [title, author, genre, description, publishedYear]);
        return result.insertId;
    }

    static async findByTitleAndAuthor(title, author) {
        const query = 'SELECT * FROM books WHERE title = ? AND author = ?';
        const [rows] = await connection.promise().execute(query, [title, author]);
        return rows[0];
    }

    static async findAll(page = 1, limit = 10, author = null, genre = null) {
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM books';

        if (author || genre) {
            query += ' WHERE';
            if (author) {
                query += ` author LIKE '%${author}%'`;
            }
            if (genre) {
                if (author) query += ' AND';
                query += ` genre LIKE '%${genre}%'`;
            }
        }

        query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const [rows] = await connection.promise().execute(query);
        return rows;
    }

    static async getTotalCount(author = null, genre = null) {
        let query = 'SELECT COUNT(*) as total FROM books';

        if (author || genre) {
            query += ' WHERE';
            if (author) {
                query += ` author LIKE '%${author}%'`;
            }
            if (genre) {
                if (author) query += ' AND';
                query += ` genre LIKE '%${genre}%'`;
            }
        }

        const [rows] = await connection.promise().execute(query);
        return rows[0].total;
    }

    static async findById(id) {
        const query = 'SELECT * FROM books WHERE id = ?';
        const [rows] = await connection.promise().execute(query, [id]);
        return rows[0];
    }

    static async search(searchTerm) {
        const query = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
        const searchPattern = `%${searchTerm}%`;
        const [rows] = await connection.promise().execute(query, [searchPattern, searchPattern]);
        return rows;
    }
}

module.exports = Book;

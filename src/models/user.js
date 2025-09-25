const connection = require('../config/database');

class User {
    static async create(userData) {
        const { username, email, password } = userData;
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const [result] = await connection.promise().execute(query, [username, email, password]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await connection.promise().execute(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await connection.promise().execute(query, [id]);
        return rows[0];
    }
}

module.exports = User;

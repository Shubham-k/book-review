const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

console.log('Connecting to database:', process.env.DB_HOST, process.env.DB_NAME);

// Create database connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const runMigrations = async () => {
  try {
    // Test database connection
    await connection.promise().execute('SELECT 1');
    console.log('Database connected successfully');

    // Create migrations tracking table if it doesn't exist
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        filename VARCHAR(255) PRIMARY KEY
      )
    `);

    // Get all SQL files
    const files = fs.readdirSync('./migrations').filter(f => f.endsWith('.sql'));
    console.log('Found migration files:', files);

    // Run each migration
    for (const file of files) {
      const sql = fs.readFileSync(`./migrations/${file}`, 'utf8');
      console.log('Executing:', file);
      await connection.promise().execute(sql);
      await connection.promise().execute('INSERT INTO migrations (filename) VALUES (?)', [file]);
      console.log(`Applied: ${file}`);
    }

    console.log('Done');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
};

runMigrations();

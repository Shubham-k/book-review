const express = require('express');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books');
const reviewRoutes = require('./src/routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.json({
        message: 'Book Review API',
        status: 'running'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;

const express = require('express');
const { createBook, getAllBooks, getBookById, searchBooks } = require('../controllers/bookController');
const { createReview } = require('../controllers/reviewController');
const { validateBook, validateReview } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /books - Add a new book (Authenticated users only)
router.post('/', authenticateToken, validateBook, createBook);

// GET /books/search - Search books by title or author
router.get('/search', searchBooks);

// GET /books - Get all books (with pagination and filters)
router.get('/', getAllBooks);

// GET /books/:id - Get book details by ID
router.get('/:id', getBookById);

// POST /books/:id/reviews - Submit a review (Authenticated users only, one review per user per book)
router.post('/:id/reviews', authenticateToken, validateReview, createReview);

module.exports = router;

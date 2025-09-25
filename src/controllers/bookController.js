const Book = require('../models/Book');
const Review = require('../models/Review');

const createBook = async (req, res) => {
    try {
        const { title, author, genre, description, publishedYear } = req.body;

        const existingBook = await Book.findByTitleAndAuthor(title, author);
        if (existingBook) {
            return res.status(400).json({ error: `Book already exists for title = ${title} and author = ${author}` });
        }

        const bookId = await Book.create({
            title,
            author,
            genre,
            description,
            publishedYear
        });

        res.status(201).json({
            message: 'Book created successfully',
            book: { id: bookId, title, author, genre, description, publishedYear }
        });
    } catch (error) {
        console.log('Create book error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, author, genre } = req.query;

        // Get books with pagination and filters
        const books = await Book.findAll(page, limit, author, genre);

        // Get total count for pagination
        const totalBooks = await Book.getTotalCount(author, genre);

        res.json({
            books,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks,
                hasNext: page * limit < totalBooks,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.log('Get books error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: `Book not found for id = ${id}` });
        }

        // Get reviews for this book
        const reviews = await Review.findByBookId(id);

        // Get average rating
        const averageRating = await Review.getAverageRating(id);

        res.json({
            book: {
                ...book,
                averageRating: parseFloat(averageRating).toFixed(1),
                totalReviews: reviews.length
            },
            reviews
        });
    } catch (error) {
        console.log('Get book by ID error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const books = await Book.search(q.trim());

        res.json({
            books,
            searchTerm: q.trim(),
            totalResults: books.length
        });
    } catch (error) {
        console.log('Search books error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createBook, getAllBooks, getBookById, searchBooks };

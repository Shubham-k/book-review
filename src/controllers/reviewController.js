const Review = require('../models/Review');
const Book = require('../models/Book');

const createReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        // Check if book exists
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: `Book not found for id = ${id}` });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findByUserAndBook(userId, id);
        if (existingReview) {
            return res.status(400).json({
                error: 'You have already reviewed this book',
                existingReview: { id: existingReview.id, rating: existingReview.rating }
            });
        }

        // Create the review
        const reviewId = await Review.create({
            bookId: id,
            userId: userId,
            rating,
            comment
        });

        res.status(201).json({
            message: 'Review created successfully',
            review: { id: reviewId, book_id: id, rating, comment }
        });
    } catch (error) {
        console.log('Create review error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        // Check if review exists and belongs to user
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ error: `Review not found for id = ${id}` });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ error: 'You can only update your own reviews' });
        }

        // Update the review
        const success = await Review.update(id, { rating, comment });
        if (!success) {
            return res.status(500).json({ error: 'Failed to update review' });
        }

        res.json({
            message: 'Review updated successfully',
            review: { id, rating, comment }
        });
    } catch (error) {
        console.log('Update review error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Check if review exists and belongs to user
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ error: `Review not found for id = ${id}` });
        }

        if (review.user_id !== userId) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }

        // Delete the review
        const success = await Review.delete(id);
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete review' });
        }

        res.json({
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.log('Delete review error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createReview, updateReview, deleteReview };

const express = require('express');
const { updateReview, deleteReview } = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// PUT /reviews/:id - Update your own review (Authenticated)
router.patch('/:id', authenticateToken, validateReview, updateReview);

// DELETE /reviews/:id - Delete your own review (Authenticated)
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;

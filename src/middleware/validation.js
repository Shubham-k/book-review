const Joi = require('joi');

// Signup validation schema
const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Book validation schema
const bookSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    author: Joi.string().min(1).max(255).required(),
    genre: Joi.string().max(100).optional(),
    description: Joi.string().required(),
    publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required()
});

// Review validation schema
const reviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().optional()
});

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: errorMessages
            });
        }

        next();
    };
};

module.exports = {
    validateSignup: validate(signupSchema),
    validateLogin: validate(loginSchema),
    validateBook: validate(bookSchema),
    validateReview: validate(reviewSchema)
};
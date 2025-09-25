const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');

const router = express.Router();

// POST /signup - Register new user
router.post('/signup', validateSignup, signup);

// POST /login - Login user
router.post('/login', validateLogin, login);

module.exports = router;

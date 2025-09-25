const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    // Extract token from Authorization header (supports both cases)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token and extract user information
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        // Add user information to request object for use in controllers
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };

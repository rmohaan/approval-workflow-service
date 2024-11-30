const jwt = require('jsonwebtoken');
const pool = require('../db/db');

// Middleware to verify JWT tokens
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // replace with a secret key
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.user_id]);
    if (!user.rows.length) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticate;

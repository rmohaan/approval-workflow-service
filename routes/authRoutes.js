const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');

const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  console.log("In Register route", req.body)
  const { username, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword)

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    console.log("errorr", error)
    res.status(400).json({ message: 'Error registering user' + error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

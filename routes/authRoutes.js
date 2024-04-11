const express = require('express');
const passport = require('./auth');
const bcrypt = require('bcryptjs');
const mongodb = require('../db/connect');

const router = express.Router();


// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    // Check if user already exists
    const db = mongodb.getDb().db();
    const existingUser = await db.collection('user').findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      username,
      password: hashedPassword,
      phone,
    };

    await db.collection('user').insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});

module.exports = router;

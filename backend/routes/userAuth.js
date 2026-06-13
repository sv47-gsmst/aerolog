const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/signup
// Body: { email, password }
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash });

    req.session.userId = user._id;
    req.session.lastActive = Date.now();

    res.json({ status: 'created', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
// Body: { email, password }
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.lastActive = Date.now();

    res.json({ status: 'logged in', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
// Returns the currently logged-in user, or 401 if not logged in
router.get('/auth/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  res.json({ email: user.email });
});

// POST /api/auth/logout
router.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ status: 'logged out' });
  });
});

module.exports = router;
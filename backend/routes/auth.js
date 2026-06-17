const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const MagicToken = require('../models/MagicToken');
const { checkMagicLinkRateLimit } = require('../utils/rateLimiter');
const { sendMagicLink } = require('../utils/mailer');

// POST /api/auth/magic-link
router.post('/auth/magic-link', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  const result = checkMagicLinkRateLimit(email);
  if (!result.allowed) {
    return res.status(429).json({
      error: 'Too many requests. Please wait before requesting another magic link.',
      retryAfterSeconds: result.retryAfterSeconds
    });
  }

  try {
    // Create user if they don't exist yet
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      user = await User.create({ email: email.toLowerCase(), passwordHash });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await MagicToken.create({ email: email.toLowerCase(), token, expiresAt });

    const previewUrl = await sendMagicLink(email, token);

    res.json({
      status: 'sent',
      message: `Magic link sent to ${email}`,
      // Only included in dev so you can click the Ethereal preview
      ...(process.env.NODE_ENV !== 'production' && { previewUrl })
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify?token=xxx
router.get('/auth/verify', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'token is required' });
  }

  try {
    const magicToken = await MagicToken.findOne({ token, used: false });

    if (!magicToken) {
      return res.status(400).json({ error: 'Invalid or already used token' });
    }

    if (new Date() > magicToken.expiresAt) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Mark token as used
    magicToken.used = true;
    await magicToken.save();

    // Log the user in
    const user = await User.findOne({ email: magicToken.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.session.userId = user._id;
    req.session.lastActive = Date.now();
    req.session.createdAt = Date.now();

    res.json({ status: 'verified', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { checkMagicLinkRateLimit } = require('../utils/rateLimiter');

// POST /api/auth/magic-link
// Expected body: { email: "parent@example.com" }
router.post('/auth/magic-link', (req, res) => {
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

  // TODO: actually generate + email the magic link (Nodemailer) once we build auth fully
  console.log(`(Simulated) Magic link sent to ${email}`);
  res.json({ status: 'sent', message: `Magic link sent to ${email}` });
});

module.exports = router;
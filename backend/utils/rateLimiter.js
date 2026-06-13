const COOLDOWN_MS = 2.5 * 60 * 1000; // 2.5 minutes

// In-memory store: email -> timestamp of last request
const lastRequestTimes = new Map();

/**
 * Checks if an email is allowed to request a magic link right now.
 * Returns { allowed: true } or { allowed: false, retryAfterSeconds: N }
 */
function checkMagicLinkRateLimit(email) {
  const now = Date.now();
  const lastRequest = lastRequestTimes.get(email);

  if (lastRequest && (now - lastRequest) < COOLDOWN_MS) {
    const retryAfterMs = COOLDOWN_MS - (now - lastRequest);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  lastRequestTimes.set(email, now);
  return { allowed: true };
}

module.exports = { checkMagicLinkRateLimit, COOLDOWN_MS };
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
const THIRTY_MIN_MS = 30 * 60 * 1000;
const EXTENSION_THRESHOLD_MS = 10 * 60 * 1000; // extend if < 10 min remaining

function sessionExtender(req, res, next) {
  if (!req.session || !req.session.userId) return next();

  const now = Date.now();
  const lastActive = req.session.lastActive || now;
  const sessionAge = now - (req.session.createdAt || now);
  const timeRemaining = FOUR_HOURS_MS - sessionAge;

  // If active and session is close to expiring, extend by 30 min
  if (timeRemaining < EXTENSION_THRESHOLD_MS && timeRemaining > 0) {
    req.session.cookie.maxAge = THIRTY_MIN_MS;
    console.log(`Session extended 30 min for user ${req.session.userId}`);
  }

  req.session.lastActive = now;
  next();
}

module.exports = sessionExtender;
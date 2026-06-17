const mongoose = require('mongoose');

const magicTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-delete expired tokens from the database
magicTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('MagicToken', magicTokenSchema);
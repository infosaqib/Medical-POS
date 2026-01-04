const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, unique: true, required: true },  // JWT ID
  familyId: { type: String, required: true },           // Session ID
  hashedToken: { type: String, required: true },        // SHA256 of the token
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },             // Revocation timestamp
  replacedBy: { type: String, default: null },          // The next jti after rotation
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
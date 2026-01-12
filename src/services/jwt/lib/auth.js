const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TTL_SEC = 10 * 60; // 10 minutes
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60; // 30 days

const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TTL_SEC,
      issuer: 'your-app',
      audience: 'your-frontend',
    },
  );
};

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
const randomId = () => crypto.randomBytes(16).toString('hex');

async function issueRefreshToken(userId, familyId, ip, ua) {
  const raw = randomId() + '.' + randomId();
  const hashedToken = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

  await RefreshToken.create({
    userId,
    jti: randomId(),
    familyId,
    hashedToken,
    expiresAt,
    ip,
    userAgent: ua,
  });

  return { raw, expiresAt };
}

async function rotateRefreshToken(oldRecord, userId, ip, ua) {
  const familyId = oldRecord.familyId;
  const raw = randomId() + '.' + randomId();
  const hashedToken = hashToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

  const nextJti = randomId();
  await RefreshToken.updateOne({ _id: oldRecord._id }, { replacedBy: nextJti });

  await RefreshToken.create({
    userId,
    jti: nextJti,
    familyId,
    hashedToken,
    expiresAt,
    ip,
    userAgent: ua,
  });

  return { raw, expiresAt };
}

async function revokeFamily(familyId) {
  await RefreshToken.updateMany(
    { familyId, revokedAt: null },
    { revokedAt: new Date() },
  );
}

async function findByRawToken(raw) {
  return RefreshToken.findOne({ hashedToken: hashToken(raw) });
}

module.exports = {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeFamily,
  findByRawToken,
  ACCESS_TTL_SEC,
  REFRESH_TTL_SEC,
};

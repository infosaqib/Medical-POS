require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signAccessToken, issueRefreshToken, rotateRefreshToken, revokeFamily, findByRawToken } = require('./lib/auth');
const User = require('./models/User'); // Import User model
const crypto = require('crypto'); // Import crypto module

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));

// Rate Limiting for auth routes
const authLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 100 });

// Function to generate a random ID (used for familyId, jti, etc.)
const randomId = () => crypto.randomBytes(16).toString('hex');

// Database connection to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
    process.exit(1);
  });

// Helper: set RT cookie (httpOnly)

function setRefreshCookie(res, raw, expiresAt) {

  res.cookie('rt', raw, {
    httpOnly: true,
    secure: true,           // true in prod (HTTPS)
    sameSite: 'lax',
    expires: expiresAt,
    path: '/auth/refresh'   // cookie only sent to refresh endpoint
  });

}


// Optional CSRF protection for refresh (double-submit)

function setCsrfCookie(res) {
  const csrf = crypto.randomBytes(16).toString('hex');
  res.cookie('csrf', csrf, {
    httpOnly: false, secure: true, sameSite: 'lax', path: '/'
  });
  return csrf;
}


function requireCsrf(req, res, next) {
  const header = req.get('x-csrf-token');
  const cookie = req.cookies?.csrf;
  if (!cookie || !header || cookie !== header) return res.status(403).json({ error: 'CSRF' });
  next();
}

// Middleware to check if the Access Token is valid
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      audience: 'your-frontend',
      issuer: 'your-app'
    });
    req.user = payload; // Attach the user to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

app.get('/', (req, res) => {
  res.send('Hello World! Server is running.');
});

// --- User Registration API ---
app.post('/auth/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      email,
      passwordHash,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Return success message
    return res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- Login API ---
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;
   const ua = req.get('user-agent') || 'unknown';

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccessToken(user);
  const familyId = randomId();
  const { raw, expiresAt } = await issueRefreshToken(user._id, familyId, ip, ua);

  setRefreshCookie(res, raw, expiresAt);

  return res.json({ accessToken, user });
});

// --- Refresh API ---
app.post('/auth/refresh', async (req, res) => {
  const raw = req.cookies?.rt;
  if (!raw) return res.status(401).json({ error: 'Missing refresh token' });

  const ip = req.ip;
  const ua = req.get('user-agent') || 'unknown';
  const rec = await findByRawToken(raw);
  if (!rec) return res.status(401).json({ error: 'Invalid refresh token' });

  if (rec.revokedAt) {
    await revokeFamily(rec.familyId);
    return res.status(401).json({ error: 'Refresh token revoked' });
  }

  if (rec.expiresAt < new Date()) return res.status(401).json({ error: 'Refresh token expired' });

  const user = await User.findById(rec.userId);
  const rotated = await rotateRefreshToken(rec, user._id, ip, ua);

  setRefreshCookie(res, rotated.raw, rotated.expiresAt);

  const accessToken = signAccessToken(user);
  return res.json({ accessToken, user });
});

// --- Protected Route (requires Access Token) ---
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'Access granted to protected resource' });
});

// --- Logout API ---
app.post('/auth/logout', async (req, res) => {
  const raw = req.cookies?.rt;
  if (raw) {
    const rec = await findByRawToken(raw);
    if (rec) await revokeFamily(rec.familyId);
  }
  res.clearCookie('rt', { path: '/auth/refresh' });
  return res.json({ ok: true });
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT || 4000}`);
});

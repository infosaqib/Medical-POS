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
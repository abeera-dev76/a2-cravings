const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect customer routes middleware:
 * Verifies customer JWT from Authorization header (Bearer <token>).
 * Fetches user from MongoDB (excluding password hash) and attaches to req.user.
 */
const protectCustomer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Please sign in to access your profile.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from MongoDB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User account no longer exists.',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended: Your account is currently inactive. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Customer JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please sign in again.',
    });
  }
};

module.exports = { protectCustomer };

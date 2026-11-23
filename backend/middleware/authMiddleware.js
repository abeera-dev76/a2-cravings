const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'TVdITBjLOYesIA3Qd25SuKADnLOkRa4nR00FIowgcV28mmBNXOMkmO9StHrMT7PSzebkh1XTnd9Q6nJCGFT0DV';

/**
 * Protect middleware:
 * Verifies JWT token from Authorization header (Bearer <token>).
 * Attaches authenticated admin object (minus password) to req.admin.
 */
const protect = async (req, res, next) => {
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
      message: 'Access denied: Authentication required. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch admin from database to ensure account is active and still exists
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: Admin account no longer exists.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended: This admin account has been deactivated.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Access denied: Token is invalid or has expired.',
    });
  }
};

/**
 * Authorize middleware:
 * Restricts access to specific admin roles (e.g., 'superadmin', 'admin').
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.admin?.role || 'unknown'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

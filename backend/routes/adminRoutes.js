const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  getAdminOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Public route: Admin login
router.post('/login', loginAdmin);

// Protected routes (Requires valid JWT Bearer token)
router.get('/me', protect, getAdminProfile);
router.get('/orders', protect, getAdminOrders);
router.patch('/orders/:orderId/status', protect, updateOrderStatus);

module.exports = router;

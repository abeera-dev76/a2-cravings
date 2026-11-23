const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminProfile,
  getAdminOrders,
  updateOrderStatus,
  getAdminUserStats,
  getAdminUsers,
  getAdminUserById,
} = require('../controllers/adminController');
const {
  getAllDeliveryAreasAdmin,
  createDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
} = require('../controllers/deliveryAreaController');
const { protect } = require('../middleware/authMiddleware');

// Public route: Admin login
router.post('/login', loginAdmin);

// Protected routes (Requires valid JWT Bearer token)
router.get('/me', protect, getAdminProfile);
router.get('/orders', protect, getAdminOrders);
router.patch('/orders/:orderId/status', protect, updateOrderStatus);

// Admin Delivery Areas & Charges CRUD (Requires valid JWT Bearer token)
router.get('/delivery-areas', protect, getAllDeliveryAreasAdmin);
router.post('/delivery-areas', protect, createDeliveryArea);
router.put('/delivery-areas/:id', protect, updateDeliveryArea);
router.delete('/delivery-areas/:id', protect, deleteDeliveryArea);

// Admin User Management routes (Requires valid JWT Bearer token)
router.get('/users/stats', protect, getAdminUserStats);
router.get('/users', protect, getAdminUsers);
router.get('/users/:id', protect, getAdminUserById);

module.exports = router;

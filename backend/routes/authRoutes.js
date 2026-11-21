const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
} = require('../controllers/authController');
const { protectCustomer } = require('../middleware/customerAuthMiddleware');

// Public customer authentication routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Protected customer profile routes
router.get('/me', protectCustomer, getCustomerProfile);
router.put('/profile', protectCustomer, updateCustomerProfile);
router.put('/change-password', protectCustomer, changeCustomerPassword);

module.exports = router;

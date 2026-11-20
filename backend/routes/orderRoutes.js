const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  listOrdersForbidden,
} = require('../controllers/orderController');

// POST /api/orders         → Create a new order (calculates prices strictly from DB)
router.post('/', createOrder);

// GET  /api/orders/:orderId → Retrieve a specific order by orderNumber or MongoDB _id
router.get('/:orderId', getOrderById);

// GET  /api/orders         → Forbidden (Customer data privacy protection)
router.get('/', listOrdersForbidden);

module.exports = router;

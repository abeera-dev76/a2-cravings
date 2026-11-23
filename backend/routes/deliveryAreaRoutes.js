const express = require('express');
const router = express.Router();
const { getActiveDeliveryAreas } = require('../controllers/deliveryAreaController');

// Public route: Customer checkout fetches active delivery areas
router.get('/', getActiveDeliveryAreas);

module.exports = router;

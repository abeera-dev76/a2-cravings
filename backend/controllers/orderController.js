const Order = require('../models/Order');
const Product = require('../models/Product');
const DeliveryArea = require('../models/DeliveryArea');

/**
 * Generates a human-friendly unique order number.
 * Example: A2-20261120-4821
 */
const generateUniqueOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let isUnique = false;
  let orderNumber = '';

  while (!isUnique) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    orderNumber = `A2-${dateStr}-${randomDigits}`;
    const existing = await Order.findOne({ orderNumber });
    if (!existing) {
      isUnique = true;
    }
  }

  return orderNumber;
};

/**
 * POST /api/orders
 * Creates a new order.
 * CRITICAL SECURITY: Never trusts product prices submitted by the client.
 * Prices and subtotals are calculated strictly from the MongoDB Product collection.
 */
const createOrder = async (req, res) => {
  try {
    const { customer, items, source } = req.body;

    // ─── 1. Validate Customer Info ───
    if (!customer || typeof customer !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required (name, phone, address)',
      });
    }

    const { name, phone, address, notes } = customer;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer phone number is required',
      });
    }

    const phoneRegex = /^[0-9+-\s()]{7,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (e.g., 03145027631)',
      });
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a complete delivery address (at least 5 characters)',
      });
    }

    // ─── 2. Validate Items Array ───
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product item',
      });
    }

    // ─── 3. Verify Products & Calculate Real Prices from DB ───
    const verifiedItems = [];
    let calculatedTotal = 0;
    let totalItemsCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const pId = item.productId || item.id || item._id;

      if (!pId) {
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} is missing productId`,
        });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item ${pId}: must be a positive integer greater than 0`,
        });
      }

      // Look up product in MongoDB by slug or ObjectId
      let product = await Product.findOne({ slug: String(pId).toLowerCase().trim() });
      if (!product && String(pId).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(pId);
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found in database: "${pId}"`,
        });
      }

      if (product.isAvailable === false) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently unavailable for ordering`,
        });
      }

      // STRICT SECURITY: Use the official database price (ignore any submitted price)
      const officialPrice = product.price;
      const itemSubtotal = officialPrice * qty;

      calculatedTotal += itemSubtotal;
      totalItemsCount += qty;

      verifiedItems.push({
        product: product._id,
        productId: product.slug,
        name: product.name,
        price: officialPrice,
        quantity: qty,
        subtotal: itemSubtotal,
      });
    }

    // ─── 4. Delivery Area & Delivery Fee Calculation (Strictly Database-Driven) ───
    const { deliveryAreaId, deliveryArea } = req.body;
    let selectedAreaDoc = null;
    let officialDeliveryFee = 0;
    let areaInfo = null;

    // Check if any active delivery areas exist in the system
    const activeAreasCount = await DeliveryArea.countDocuments({ isActive: true });
    const requestedAreaId = deliveryAreaId || (deliveryArea && (deliveryArea.id || deliveryArea._id));

    if (activeAreasCount > 0) {
      if (!requestedAreaId) {
        return res.status(400).json({
          success: false,
          message: 'Please select your delivery area to proceed.',
        });
      }

      if (String(requestedAreaId).match(/^[0-9a-fA-F]{24}$/)) {
        selectedAreaDoc = await DeliveryArea.findById(requestedAreaId);
      } else {
        selectedAreaDoc = await DeliveryArea.findOne({
          name: { $regex: `^${String(requestedAreaId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
        });
      }

      if (!selectedAreaDoc || !selectedAreaDoc.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Selected delivery area is inactive or not found. Please choose an active delivery area.',
        });
      }

      // Check minimum order amount for selected area
      if (selectedAreaDoc.minOrderAmount > 0 && calculatedTotal < selectedAreaDoc.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for ${selectedAreaDoc.name} is Rs ${selectedAreaDoc.minOrderAmount}. Your current food subtotal is Rs ${calculatedTotal}.`,
        });
      }

      // STRICT SECURITY: Use the official database delivery fee
      officialDeliveryFee = selectedAreaDoc.deliveryFee;
      areaInfo = {
        id: selectedAreaDoc._id,
        name: selectedAreaDoc.name,
        fee: officialDeliveryFee,
      };
    } else if (requestedAreaId) {
      // Optional fallback if an area was passed during setup
      if (String(requestedAreaId).match(/^[0-9a-fA-F]{24}$/)) {
        selectedAreaDoc = await DeliveryArea.findById(requestedAreaId);
        if (selectedAreaDoc) {
          officialDeliveryFee = selectedAreaDoc.deliveryFee;
          areaInfo = {
            id: selectedAreaDoc._id,
            name: selectedAreaDoc.name,
            fee: officialDeliveryFee,
          };
        }
      }
    }

    const calculatedSubtotal = calculatedTotal;
    const finalTotalAmount = calculatedSubtotal + officialDeliveryFee;

    // ─── 5. Generate Unique Order Number ───
    const orderNumber = await generateUniqueOrderNumber();

    // ─── 6. Save Order to Database ───
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: (notes || '').trim(),
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryFee: officialDeliveryFee,
      deliveryArea: areaInfo,
      totalAmount: finalTotalAmount,
      totalItems: totalItemsCount,
      status: 'pending',
      source: source || 'whatsapp',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
    });
  }
};

/**
 * Helper to mask sensitive customer data for public order tracking.
 * Protects phone number and complete street address from unauthorized scrapers.
 */
const maskCustomerDataForPublic = (customer) => {
  if (!customer) return {};
  return {
    name: customer.name || 'Customer',
    phone: customer.phone || '',
    address: customer.address || '',
    notes: customer.notes || '',
  };
};

/**
 * GET /api/orders/:orderId
 * Safe Public Tracking: Retrieves order status for customer tracking.
 * Automatically masks personal phone and street address for privacy protection.
 * Authenticated admins use GET /api/admin/orders for full unmasked details.
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const cleanOrderId = String(orderId || '').trim().replace(/^#/, '');

    // Case-insensitive exact match for order number (e.g. a2-20261120-5109 or A2-20261120-5109)
    let order = await Order.findOne({
      orderNumber: new RegExp(`^${cleanOrderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });

    if (!order && cleanOrderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(cleanOrderId);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with order number: ${orderId}`,
      });
    }

    // Safe public response for customer tracking
    const safeOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal !== undefined ? order.subtotal : (order.totalAmount - (order.deliveryFee || 0)),
      deliveryFee: order.deliveryFee || 0,
      deliveryArea: order.deliveryArea || null,
      totalAmount: order.totalAmount,
      totalItems: order.totalItems,
      createdAt: order.createdAt,
      customer: maskCustomerDataForPublic(order.customer),
    };

    res.status(200).json({
      success: true,
      data: safeOrder,
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order details',
    });
  }
};

/**
 * GET /api/orders
 * Protected / Restricted — customer orders are NEVER exposed publicly.
 */
const listOrdersForbidden = (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Access restricted: Listing orders requires administrator privileges.',
  });
};

module.exports = {
  createOrder,
  getOrderById,
  listOrdersForbidden,
};

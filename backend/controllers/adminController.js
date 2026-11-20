const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');

/**
 * Generate JWT Token helper
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * POST /api/admin/login
 * Public authentication endpoint for admins.
 * Validates credentials via bcrypt and issues signed JWT.
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Explicitly select password hash because select: false is on the model
    const admin = await Admin.findOne({ email: cleanEmail }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This admin account has been deactivated.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login.',
    });
  }
};

/**
 * GET /api/admin/me
 * Protected: Returns the profile of currently logged-in admin.
 */
const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin profile.',
    });
  }
};

/**
 * GET /api/admin/orders
 * Protected: Admin-only order list with pagination, filtering, and full customer details.
 * Supports query params:
 *   ?page=1&limit=10
 *   ?status=pending | confirmed | preparing | out_for_delivery | delivered | cancelled
 */
const getAdminOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status.toLowerCase().trim();
    }

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limit) || 1,
      currentPage: page,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders list.',
    });
  }
};

/**
 * PATCH /api/admin/orders/:orderId/status
 * Protected: Updates order status with strict enum validation.
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!status || !allowedStatuses.includes(status.toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: '${status}'. Allowed statuses are: ${allowedStatuses.join(', ')}`,
      });
    }

    const cleanStatus = status.toLowerCase().trim();

    let order = await Order.findOne({ orderNumber: orderId });
    if (!order && orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id or number: ${orderId}`,
      });
    }

    order.status = cleanStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} status updated to '${cleanStatus}'.`,
      data: order,
    });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status.',
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  getAdminOrders,
  updateOrderStatus,
};

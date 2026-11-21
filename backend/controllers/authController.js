const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate customer JWT token
 */
const generateCustomerToken = (id) => {
  return jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Helper to sanitize user object for responses (never sends password)
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * POST /api/auth/register
 * Customer Sign Up
 */
const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields (Name, Email, Phone, Password, Confirm Password) are required.',
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long.',
      });
    }

    // 2. Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. user@example.com).',
      });
    }

    // 3. Validate phone number format
    const phoneRegex = /^[0-9+-\s()]{7,16}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number (e.g., 03145027631).',
      });
    }

    // 4. Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match.',
      });
    }

    // 5. Prevent duplicate email registration
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      });
    }

    // 6. Create customer user (password will be hashed by User model pre-save hook)
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      status: 'active',
    });

    const token = generateCustomerToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to A2 CRAVINGS.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration. Please try again later.',
    });
  }
};

/**
 * POST /api/auth/login
 * Customer Sign In
 */
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Select password hash explicitly
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact customer support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateCustomerToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Customer Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Sign in failed due to a server error. Please try again.',
    });
  }
};

/**
 * GET /api/auth/me
 * Retrieve authenticated customer profile
 */
const getCustomerProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile details.',
    });
  }
};

/**
 * PUT /api/auth/profile
 * Edit customer profile information (Name, Phone)
 */
const updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (name && typeof name === 'string') {
      const cleanName = name.trim();
      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long.',
        });
      }
      user.name = cleanName;
    }

    if (phone && typeof phone === 'string') {
      const cleanPhone = phone.trim();
      const phoneRegex = /^[0-9+-\s()]{7,16}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid phone number.',
        });
      }
      user.phone = cleanPhone;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile information.',
    });
  }
};

/**
 * PUT /api/auth/change-password
 * Change customer password securely
 */
const changeCustomerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password, new password, and confirm new password.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and Confirm New Password do not match.',
      });
    }

    // Load user with password hash
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Update password (pre-save hook will hash it with bcrypt)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change Password Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again.',
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
};

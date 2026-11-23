const DeliveryArea = require('../models/DeliveryArea');

/**
 * GET /api/delivery-areas
 * Public: Returns only active delivery areas for customer checkout.
 */
const getActiveDeliveryAreas = async (req, res) => {
  try {
    const areas = await DeliveryArea.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (error) {
    console.error('Error fetching active delivery areas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to load delivery areas. Please try again.',
    });
  }
};

/**
 * GET /api/admin/delivery-areas
 * Admin: Returns all delivery areas with optional search & status filter.
 */
const getAllDeliveryAreasAdmin = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const areas = await DeliveryArea.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (error) {
    console.error('Error fetching admin delivery areas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery areas.',
    });
  }
};

/**
 * POST /api/admin/delivery-areas
 * Admin: Add a new delivery area.
 */
const createDeliveryArea = async (req, res) => {
  try {
    const { name, deliveryFee, minOrderAmount, isActive, estimatedTime } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Area name is required.',
      });
    }

    const trimmedName = name.trim();

    if (deliveryFee === undefined || deliveryFee === null || isNaN(Number(deliveryFee))) {
      return res.status(400).json({
        success: false,
        message: 'A valid delivery fee is required.',
      });
    }

    const feeNum = Number(deliveryFee);
    if (feeNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Delivery fee cannot be negative.',
      });
    }

    const minAmountNum = minOrderAmount !== undefined && minOrderAmount !== ''
      ? Number(minOrderAmount)
      : 0;

    if (isNaN(minAmountNum) || minAmountNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimum order amount cannot be negative.',
      });
    }

    // Check case-insensitive duplicate
    const existing = await DeliveryArea.findOne({
      name: { $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A delivery area named "${trimmedName}" already exists.`,
      });
    }

    const newArea = await DeliveryArea.create({
      name: trimmedName,
      deliveryFee: feeNum,
      minOrderAmount: minAmountNum,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      estimatedTime: (estimatedTime || '30-45 mins').trim(),
    });

    res.status(201).json({
      success: true,
      message: `Delivery area "${newArea.name}" added successfully.`,
      data: newArea,
    });
  } catch (error) {
    console.error('Error creating delivery area:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A delivery area with this name already exists.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create delivery area.',
    });
  }
};

/**
 * PUT /api/admin/delivery-areas/:id
 * Admin: Edit an existing delivery area.
 */
const updateDeliveryArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, deliveryFee, minOrderAmount, isActive, estimatedTime } = req.body;

    const area = await DeliveryArea.findById(id);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found.',
      });
    }

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Area name cannot be empty.',
        });
      }
      const trimmedName = name.trim();
      // If changing name, ensure uniqueness
      if (trimmedName.toLowerCase() !== area.name.toLowerCase()) {
        const duplicate = await DeliveryArea.findOne({
          _id: { $ne: id },
          name: { $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
        });
        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: `A delivery area named "${trimmedName}" already exists.`,
          });
        }
      }
      area.name = trimmedName;
    }

    if (deliveryFee !== undefined) {
      const feeNum = Number(deliveryFee);
      if (isNaN(feeNum) || feeNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Delivery fee cannot be negative.',
        });
      }
      area.deliveryFee = feeNum;
    }

    if (minOrderAmount !== undefined) {
      const minNum = Number(minOrderAmount);
      if (isNaN(minNum) || minNum < 0) {
        return res.status(400).json({
          success: false,
          message: 'Minimum order amount cannot be negative.',
        });
      }
      area.minOrderAmount = minNum;
    }

    if (isActive !== undefined) {
      area.isActive = Boolean(isActive);
    }

    if (estimatedTime !== undefined) {
      area.estimatedTime = String(estimatedTime).trim();
    }

    await area.save();

    res.status(200).json({
      success: true,
      message: `Delivery area "${area.name}" updated successfully.`,
      data: area,
    });
  } catch (error) {
    console.error('Error updating delivery area:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A delivery area with this name already exists.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery area.',
    });
  }
};

/**
 * DELETE /api/admin/delivery-areas/:id
 * Admin: Delete a delivery area.
 */
const deleteDeliveryArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await DeliveryArea.findByIdAndDelete(id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Delivery area not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Delivery area "${area.name}" deleted successfully.`,
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting delivery area:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete delivery area.',
    });
  }
};

module.exports = {
  getActiveDeliveryAreas,
  getAllDeliveryAreasAdmin,
  createDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
};

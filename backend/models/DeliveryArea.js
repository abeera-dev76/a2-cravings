const mongoose = require('mongoose');

const deliveryAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Area name is required'],
      trim: true,
    },
    deliveryFee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      min: [0, 'Delivery fee cannot be negative'],
    },
    minOrderAmount: {
      type: Number,
      min: [0, 'Minimum order amount cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    estimatedTime: {
      type: String,
      trim: true,
      default: '30-45 mins',
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique index (case-insensitive) on area name
deliveryAreaSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

module.exports = mongoose.model('DeliveryArea', deliveryAreaSchema);

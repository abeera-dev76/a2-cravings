const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    // Unique slug like 'pasta', 'buns', 'loaded-fries'
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Display name like 'Pasta', 'Buns', 'Loaded Fries'
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    // Optional display order (lower = shown first)
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Category', categorySchema);

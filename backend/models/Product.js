const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Unique slug like 'chicken-creamy-pasta'
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    // Category slug reference e.g. 'pasta', 'buns', 'biryani'
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
    },
    // Price in Pakistani Rupees (integer)
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // Primary image path e.g. '/images/pasta/chicken-creamy-pasta.webp'
    image: {
      type: String,
      default: '',
    },
    // Fallback image path (PNG) in case webp fails
    fallbackImage: {
      type: String,
      default: '',
    },
    // Alt text for accessibility and SEO
    alt: {
      type: String,
      default: '',
    },
    // Optional badge like 'Popular', 'Chef Special', 'Hot & Spicy'
    badge: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Optional display order
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);

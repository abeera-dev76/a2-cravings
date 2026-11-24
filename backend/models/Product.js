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
    // Optional discounted / promotional price
    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
    },
    // Auto-generated or custom SKU / Product Code
    sku: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // Primary image path or optimized data URI
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
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    // Optional preparation time e.g. "15-20 mins"
    prepTime: {
      type: String,
      trim: true,
      default: '',
    },
    // Optional size variations (e.g. Small, Medium, Large)
    sizes: [
      {
        name: { type: String, trim: true },
        price: { type: Number, min: 0 },
      },
    ],
    // Optional extra toppings / add-ons (e.g. Extra Cheese +100)
    addons: [
      {
        name: { type: String, trim: true },
        price: { type: Number, min: 0 },
      },
    ],
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

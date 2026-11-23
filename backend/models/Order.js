const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productId: {
      type: String, // stores slug or string id for quick lookup
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
        default: '',
      },
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      min: [0, 'Subtotal cannot be negative'],
    },
    deliveryFee: {
      type: Number,
      min: [0, 'Delivery fee cannot be negative'],
      default: 0,
    },
    deliveryArea: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryArea',
      },
      name: {
        type: String,
        trim: true,
      },
      fee: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    totalItems: {
      type: Number,
      required: true,
      min: [1, 'Total items must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
      index: true,
    },
    source: {
      type: String,
      enum: ['whatsapp', 'web', 'direct'],
      default: 'whatsapp',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);

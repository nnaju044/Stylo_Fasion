import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [orderItemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  shippingAmount: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  finalAmount: {
    type: Number,
    required: true
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "CARD", "UPI"],
    default: "COD"
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
    default: "PENDING"
  },

  orderStatus: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"],
    default: "PENDING"
  }

}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
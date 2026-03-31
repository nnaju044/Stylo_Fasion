import mongoose from "mongoose";
import crypto from "crypto";

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
  size: {
    type: String
  },
  image: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    sparse: true
  },
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
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"],
    default: "PENDING"
  },

  returnReason: {
    type: String,
    trim: true
  }

}, { timestamps: true });

orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    this.orderId = `STY-${timestamp}-${randomHex}`;
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
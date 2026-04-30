const mongoose = require("mongoose");

const paymentSlipSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminNotes: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("PaymentSlip", paymentSlipSchema);
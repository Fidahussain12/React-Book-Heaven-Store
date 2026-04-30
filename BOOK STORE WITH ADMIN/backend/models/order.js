const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },

    // 🔥 CHANGE: Single book se multiple books mein convert
    books: [{
        book: {
            type: mongoose.Types.ObjectId,
            ref: "books",
        },
        title: String,
        price: Number,
        url: String,
    }],

    // 🔥 NEW: Total amount for multiple books
    totalAmount: {
        type: Number,
        required: true,
    },

    // 🔥 NEW: Payment related fields
    paymentStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "verified", "rejected"]
    },

    paymentMethod: {
        type: String,
        default: "easypaisa",
        enum: ["easypaisa", "jazzcash", "bank_transfer"]
    },

    slipImageUrl: {
        type: String,
        default: "",
    },

    // 🔥 NEW: Download access control
    downloadAccess: {
        type: Boolean,
        default: false,
    },

    // 🔥 NEW: Order status field
    orderStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "processing", "completed", "cancelled"]
    },

    // ✅ EXISTING FIELD (keeping as is for backward compatibility)
    status: {
        type: String,
        default: "Order Placed",
        enum: ["Order Placed", "Out for delivery", "Delivered", "Canceled"]
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
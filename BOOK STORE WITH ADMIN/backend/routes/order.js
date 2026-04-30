const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const { sendPaymentVerifiedEmail } = require("../utils/email");

// ==================== USER ROUTES ====================

// Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order, total } = req.body;

    console.log("========== PLACE ORDER ==========");
    console.log("User ID:", id);
    console.log("Total:", total);
    console.log("Order items:", order?.length);

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Invalid order data or cart is empty" });
    }

    let finalTotal = total;
    if (!finalTotal || finalTotal === 0) {
      finalTotal = order.reduce((acc, book) => acc + (book.price || 0), 0);
    }

    const newOrder = new Order({
      user: id,
      books: order.map((book) => ({
        book: book._id,
        title: book.title,
        price: book.price,
        url: book.url,
      })),
      totalAmount: finalTotal,
      paymentStatus: "pending",
      orderStatus: "pending",
      downloadAccess: false,
      status: "Order Placed",
      slipImageUrl: "",
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    await User.findByIdAndUpdate(id, {
      $push: { orders: newOrder._id },
    });

    await User.findByIdAndUpdate(id, {
      $set: { cart: [] },
    });

    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { 
        path: "books.book", 
        model: "books" 
      }
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error("Get order history error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ==================== ADMIN ROUTES ====================

// 🔥 GET ALL ORDERS (ADMIN) - YEH ROUTE MISSING THA
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    console.log("🔍 Admin get-all-orders called by user:", id);
    
    const user = await User.findById(id);
    console.log("User role:", user?.role);
    
    if (!user || user.role !== "admin") {
      console.log("❌ Access denied - Not admin");
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("books.book", "title author url price")
      .sort({ createdAt: -1 });
    
    console.log(`📦 Found ${orders.length} orders`);
    
    return res.json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Update order status (Admin)
router.put("/update-status/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: status,
        orderStatus: status === "Delivered" ? "completed" : 
                     status === "Cancelled" ? "cancelled" : "processing"
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
      data: order
    });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Verify payment (Admin) - WITH EMAIL
router.put("/verify-payment/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "verified",
        downloadAccess: true,
        orderStatus: "completed",
        status: "Delivered"
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const orderUser = await User.findById(order.user);
    
    if (orderUser && orderUser.email) {
      await sendPaymentVerifiedEmail(
        orderUser.email,
        orderUser.username,
        orderId
      );
      console.log("📧 Email sent to:", orderUser.email);
    }
    
    console.log("✅ Payment verified for order:", orderId);
    
    return res.json({
      status: "Success",
      message: "Payment verified! User can now download books. Email sent.",
      data: order
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Delete order (Admin)
router.delete("/delete-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    await User.findByIdAndUpdate(order.user, {
      $pull: { orders: orderId }
    });
    
    await Order.findByIdAndDelete(orderId);
    
    return res.json({
      status: "Success",
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get all pending payment slips (Admin)
router.get("/pending-slips", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const orders = await Order.find({
      paymentStatus: "pending",
      slipImageUrl: { $ne: "", $exists: true }
    })
    .populate("user", "username email")
    .populate("books.book", "title author url price")
    .sort({ createdAt: -1 });
    
    return res.json({
      status: "Success",
      data: orders
    });
  } catch (error) {
    console.error("Error fetching pending slips:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Reject payment (Admin)
router.put("/reject-payment/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "rejected",
        downloadAccess: false,
        orderStatus: "cancelled",
        status: "Cancelled",
        adminNotes: reason || "Payment rejected by admin"
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    return res.json({
      status: "Success",
      message: "Payment rejected",
      data: order
    });
  } catch (error) {
    console.error("Reject payment error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
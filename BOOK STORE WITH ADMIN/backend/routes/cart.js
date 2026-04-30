const router = require("express").Router();
const User = require("../models/user");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");

// Add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);

    if (isBookInCart) {
      return res.status(200).json({
        status: "Success",
        message: "Book is already in cart",
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.status(200).json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Remove from cart
router.delete("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookid } = req.params;

    if (!bookid) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid }
    });

    return res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get cart of a particular user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Place Order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order, total } = req.body;

    console.log("========== PLACE ORDER ==========");
    console.log("User ID:", id);
    console.log("Received total:", total);
    console.log("Order length:", order?.length);

    if (!id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total if not provided
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
    });

    await newOrder.save();
    console.log("✅ Order saved. Total:", finalTotal);

    // Clear cart after order
    await User.findByIdAndUpdate(id, {
      $set: { cart: [] },
    });

    return res.json({
      status: "Success",
      message: "Order created successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.delete("/cancel-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id } = req.headers;

    const order = await Order.findOne({ _id: orderId, user: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "verified") {
      return res.status(400).json({ message: "Cannot cancel verified order" });
    }

    order.orderStatus = "cancelled";
    order.status = "Canceled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get order history
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const orders = await Order.find({ user: id })
      .populate("books.book")
      .sort({ createdAt: -1 });

    res.json({
      status: "Success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
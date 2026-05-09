const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./conn/conn");
import { SpeedInsights } from "@vercel/speed-insights/react"

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/books", express.static(path.join(__dirname, "uploads/books"))); // 🔥 YAHAN ADD KARO

// Create uploads directory if not exists
const fs = require("fs");
const uploadDir = "./uploads/slips";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create books directory if not exists
const booksDir = "./uploads/books";  // 🔥 YAHAN BHI ADD KARO
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// ============ ROUTES WITH ERROR HANDLING ============
try {
  const user = require("./routes/user");
  app.use("/api/v1", user);
  console.log("✅ User route loaded");
} catch (err) {
  console.log("❌ User route error:", err.message);
}

try {
  const Books = require("./routes/book");
  app.use("/api/v1", Books);
  console.log("✅ Books route loaded");
} catch (err) {
  console.log("❌ Books route error:", err.message);
}

try {
  const Favourite = require("./routes/favourite");
  app.use("/api/v1", Favourite);
  console.log("✅ Favourite route loaded");
} catch (err) {
  console.log("❌ Favourite route error:", err.message);
}

try {
  const Cart = require("./routes/cart");
  app.use("/api/v1", Cart);
  console.log("✅ Cart route loaded");
} catch (err) {
  console.log("❌ Cart route error:", err.message);
}

try {
  const Order = require("./routes/order");
  app.use("/api/v1", Order);
  console.log("✅ Order route loaded");
} catch (err) {
  console.log("❌ Order route error:", err.message);
}

// ✅ Payment Slip Route - UNCOMMENTED
try {
  const paymentSlip = require("./routes/payment-slip");
  app.use("/api/v1", paymentSlip);
  console.log("✅ PaymentSlip route loaded");
} catch (err) {
  console.log("❌ PaymentSlip route error:", err.message);
}

// ============ DEFAULT ROUTE ============
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// ============ ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Port
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server Started at port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

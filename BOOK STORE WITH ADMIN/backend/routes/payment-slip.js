const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PaymentSlip = require("../models/paymentSlip");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");
const { sendSlipUploadNotification } = require("../utils/email"); // 🔥 ADD THIS

// Ensure upload directory exists
const uploadDir = "./uploads/slips";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "slip-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and PDF files are allowed"));
    }
  }
});

// Get payment details (EasyPaisa number)
router.get("/payment-details", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      easypaisa: {
        number: "03700360389",
        accountName: "Fida Hussain",
        instructions: "Send exact amount and upload screenshot"
      },
      nayapay: {
        number: "03700360389",
        accountName: "Fida Hussain",
        instructions: "Send exact amount and upload screenshot"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload payment slip
router.post("/upload-slip", authenticateToken, upload.single("slipImage"), async (req, res) => {
  try {
    console.log("========== UPLOAD SLIP ==========");
    console.log("File:", req.file);
    console.log("Body:", req.body);
    console.log("User ID:", req.headers.id);

    const { orderId } = req.body;
    const { id } = req.headers;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload payment slip image" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // 🔥 POPULATE USER DETAILS FOR EMAIL
    const order = await Order.findOne({ _id: orderId, user: id }).populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/slips/${req.file.filename}`;

    // Save payment slip
    const paymentSlip = new PaymentSlip({
      orderId: orderId,
      userId: id,
      imageUrl: imageUrl,
      status: "pending"
    });

    await paymentSlip.save();

    // Update order
    order.slipImageUrl = imageUrl;
    order.paymentStatus = "pending";
    await order.save();

    console.log("✅ Slip uploaded successfully");

    // 🔥 SEND EMAIL NOTIFICATION TO ADMIN
    console.log("📧 Sending email to admin...");
    await sendSlipUploadNotification(
      orderId,
      order.user?.username || "Customer",
      order.totalAmount
    );
    console.log("📧 Email sent to admin");

    res.json({
      success: true,
      message: "Payment slip uploaded successfully! Admin will verify soon. Notification sent to admin.",
      slipUrl: imageUrl
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Check payment status
router.get("/check-status/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id } = req.headers;

    const order = await Order.findOne({ _id: orderId, user: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      downloadAccess: order.downloadAccess
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
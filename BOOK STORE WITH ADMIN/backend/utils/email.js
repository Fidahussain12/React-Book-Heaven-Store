// backend/utils/email.js
const nodemailer = require("nodemailer");

console.log("🔧 Loading email utility...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready!");
  }
});

// Send email to admin when user uploads payment slip
const sendSlipUploadNotification = async (orderId, username, totalAmount) => {
  console.log("📧 sendSlipUploadNotification called!");
  console.log("Order ID:", orderId);
  console.log("Username:", username);
  console.log("Total:", totalAmount);
  
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    console.log("Admin email:", adminEmail);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "🔔 New Payment Slip Uploaded - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #eab308;">📥 New Payment Slip Uploaded</h2>
          <p><strong>Customer:</strong> ${username}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Amount:</strong> Rs. ${totalAmount}</p>
          <p><strong>Status:</strong> Pending Verification</p>
          <hr />
          <p>Please login to admin panel to verify this payment.</p>
          <a href="http://localhost:5173/all-orders" style="background-color: #eab308; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Admin Panel
          </a>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Admin email sent! Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Admin email error:", error);
    console.error("Error details:", error.message);
    return false;
  }
};

// Send email to user when payment is verified
const sendPaymentVerifiedEmail = async (userEmail, username, orderId) => {
  console.log("📧 sendPaymentVerifiedEmail called!");
  console.log("To:", userEmail);
  console.log("Username:", username);
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "✅ Payment Verified - Your Books Are Ready to Download",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">✅ Payment Verified Successfully</h2>
          <p>Dear <strong>${username}</strong>,</p>
          <p>Your payment for order <strong>${orderId}</strong> has been verified.</p>
          <p>You can now download your books from your order history.</p>
          <hr />
          <a href="http://localhost:5173/profile/orderHistory" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            📥 Download Your Books
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Thank you for shopping with us!</p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(" User email sent! Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error(" User email error:", error);
    return false;
  }
};

module.exports = {
  sendSlipUploadNotification,
  sendPaymentVerifiedEmail,
};
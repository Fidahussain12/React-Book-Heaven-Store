const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========== PDF UPLOAD CONFIGURATION ==========
// Create uploads directory if not exists
const uploadDir = "./uploads/books";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for PDF upload
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "book-" + uniqueSuffix + ".pdf");
  }
});

const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// ========== ADD BOOK WITH PDF UPLOAD (ADMIN) ==========
router.post("/add-book", authenticateToken, uploadPDF.single("pdfFile"), async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id);

    if (!user || user.role !== "admin") {
      return res.status(400).json({
        message: "You are not having access to perform admin work"
      });
    }

    // Check if PDF file is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required"
      });
    }

    // PDF file path
    const pdfPath = `/uploads/books/${req.file.filename}`;

    // 🔥 FIXED: Remove category and pages if not in your model
    const bookData = {
      url: req.body.url,           // Cover image URL
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
      pdfFile: pdfPath,            // PDF file path
    };

    // Only add category and pages if they exist in request and your model has them
    if (req.body.category) bookData.category = req.body.category;
    if (req.body.pages) bookData.pages = req.body.pages;

    const book = new Book(bookData);
    await book.save();

    console.log("✅ Book added:", book.title);
    console.log("📄 PDF Path:", pdfPath);

    return res.status(200).json({
      message: "Book created successfully",
      book: book
    });

  } catch (error) {
    console.error("Error adding book:", error);
    return res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
});

// ========== UPDATE BOOK (ADMIN) ==========
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    
    const updateData = {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    };
    
    // Only add if provided
    if (req.body.pdfFile) updateData.pdfFile = req.body.pdfFile;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.pages) updateData.pages = req.body.pages;
    
    await Book.findByIdAndUpdate(bookid, updateData);
    
    return res.status(200).json({
      message: "Book Updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ========== DELETE BOOK (ADMIN) ==========
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    // Find book first to get PDF file path
    const book = await Book.findById(bookid);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 🔥 Optional: Delete PDF file from server
    if (book.pdfFile && book.pdfFile.startsWith("/uploads/books/")) {
      const pdfPath = path.join(__dirname, "..", book.pdfFile);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
        console.log("📄 PDF file deleted:", pdfPath);
      }
    }

    await Book.findByIdAndDelete(bookid);

    return res.status(200).json({
      message: "Book deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred"
    });
  }
});

// ========== GET ALL BOOKS ==========
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: books,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred"
    });
  }
});

// ========== GET RECENT BOOKS (LIMIT 4) ==========
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ========== GET BOOK BY ID ==========
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ========== DOWNLOAD/READ BOOK (For users after purchase) ==========
router.get("/download-book/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;
    
    // Find the book
    const book = await Book.findById(id);
    if (!book || !book.pdfFile) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    // Check if user has purchased this book (any order with verified payment)
    const user = await User.findById(userId).populate({
      path: "orders",
      populate: { path: "books.book" }
    });
    
    let hasPurchased = false;
    
    if (user && user.orders) {
      for (const order of user.orders) {
        if (order.paymentStatus === "verified" && order.downloadAccess === true) {
          // Check if this book is in the order
          const bookInOrder = order.books.some(
            item => item.book?._id.toString() === id || item.book?.toString() === id
          );
          if (bookInOrder) {
            hasPurchased = true;
            break;
          }
        }
      }
    }
    
    if (!hasPurchased) {
      return res.status(403).json({ message: "You haven't purchased this book" });
    }
    
    // Return the PDF URL
    let pdfUrl = book.pdfFile;
    
    // If it's a local file, add base URL
    if (pdfUrl.startsWith("/uploads/")) {
      pdfUrl = `http://localhost:1000${pdfUrl}`;
    }
    
    res.json({
      status: "Success",
      downloadUrl: pdfUrl,
      title: book.title
    });
    
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
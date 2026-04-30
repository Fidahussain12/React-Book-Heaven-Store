const mongoose = require("mongoose");

const book = new mongoose.Schema({
  url: {                  
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  language: {
    type: String,
    required: true,
  },

  pdfFile: {
    type: String,
    required: true,         
    default: ""
  },

  category: {
    type: String,
    default: "General"
  },

  
  pages: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("books", book);
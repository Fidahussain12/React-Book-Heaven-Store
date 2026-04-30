import { useState } from "react";
import axios from "axios";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    language: "",
    coverImage: "",
  });
  const [pdfFile, setPdfFile] = useState(null);  // 🔥 NEW: PDF file state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NEW: Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a valid PDF file");
      e.target.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      language: "",
      coverImage: "",
    });
    setPdfFile(null);
    // Reset file input
    const fileInput = document.getElementById("pdfFile");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🔥 CHECK: PDF file is required
    if (!pdfFile) {
      alert("Please select a PDF file for the book");
      return;
    }
    
    setLoading(true);
    
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      // 🔥 Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("desc", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("url", formData.coverImage);
      formDataToSend.append("pdfFile", pdfFile);  // 🔥 PDF file attached

      const response = await axios.post(
        "http://localhost:1000/api/v1/add-book",
        formDataToSend,
        {
          headers: {
            id: id,
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",  // 🔥 Important for file upload
          },
        }
      );

      console.log("Response:", response.data);
      alert("Book added successfully!");
      resetForm();
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding book.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-1">Add New Book</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Fill in the details to add a book to the store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Alchemist"
              required
              className={inputClass}
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Author</label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of the book..."
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          <hr className="border-zinc-800" />

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Price (PKR)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 850"
              required
              min="0"
              className={inputClass}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select language</option>
              <option>Urdu</option>
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Cover Image URL</label>
            <input
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className={inputClass}
            />
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="mt-2 h-32 object-cover rounded-lg border border-zinc-700"
              />
            )}
          </div>

          {/* 🔥 NEW: PDF File Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              PDF File <span className="text-red-500">*</span>
            </label>
            <input
              id="pdfFile"
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm 
                         file:mr-4 file:py-1 file:px-3 file:rounded-lg file:bg-yellow-500 file:text-black 
                         file:border-0 file:cursor-pointer hover:file:bg-yellow-400"
            />
            {pdfFile && (
              <p className="text-green-500 text-xs mt-1">
                ✅ Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="text-zinc-500 text-xs mt-1">
              Upload PDF file (Max 50MB). User will download this file after payment.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm border border-zinc-700 rounded-lg text-zinc-400 hover:bg-zinc-800 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBook;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [CartBooks, setCartBooks] = useState([]);
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch cart books
  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-user-cart",
        { headers }
      );
      setCartBooks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment details
  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/v1/payment-details",
        { headers }
      );
      setPaymentDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate total
  useEffect(() => {
    if (CartBooks.length > 0) {
      const total = CartBooks.reduce((acc, item) => acc + item.price, 0);
      setTotal(total);
    } else {
      setTotal(0);
    }
  }, [CartBooks]);

  // Remove from cart
  const handleRemove = async (bookid) => {
    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v1/remove-from-cart/${bookid}`,
        { headers }
      );
      alert(response.data.message);
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Place order - create order and show payment
  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/place-order",
        { order: CartBooks, total: Total },
        { headers }
      );
      setOrderId(response.data.orderId);
      await fetchPaymentDetails();
      setShowPayment(true);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Upload payment slip
  const handleUploadSlip = async () => {
    if (!selectedFile) {
      alert("Please select a payment slip image");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("slipImage", selectedFile);
    formData.append("orderId", orderId);

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/upload-slip",
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadMessage("Payment slip uploaded! Admin will verify your payment. You will get download access after verification.");
        setTimeout(() => {
          navigate("/profile/orderHistory");
        }, 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload slip");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 sm:px-8 lg:px-16 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Cart</h1>

      {CartBooks.length === 0 && !showPayment ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-400">
          <p className="text-xl sm:text-2xl font-semibold">
            Your Cart is Empty
          </p>
          <p className="text-sm mt-2">
            Add books to your cart to see them here
          </p>
          <button
            onClick={() => navigate("/all-books")}
            className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          {!showPayment && (
            <div className="flex-1 flex flex-col gap-4">
              {CartBooks.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-[80px] w-[60px] sm:h-[100px] sm:w-[75px] object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1 line-clamp-1">
                      {item.author}
                    </p>
                    <p className="text-yellow-300 font-bold text-sm sm:text-base mt-1">
                      Rs. {item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-400 hover:text-red-500 hover:bg-zinc-700 p-2 rounded-lg transition flex-shrink-0"
                  >
                    <AiOutlineDelete className="text-xl sm:text-2xl" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary / Payment Section */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            {!showPayment ? (
              <div className="bg-zinc-800 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 border-b border-zinc-600 pb-3">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-2 text-sm sm:text-base">
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Items</span>
                    <span>{CartBooks.length}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>Rs. {Total}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery</span>
                    <span className="text-green-400">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-white font-bold text-lg mt-4 border-t border-zinc-600 pt-4">
                  <span>Total</span>
                  <span className="text-yellow-400">Rs. {Total}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold rounded-xl transition-all text-sm sm:text-base"
                >
                  Place Order
                </button>

                <button
                  onClick={() => navigate("/all-books")}
                  className="w-full mt-3 py-3 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 border-b border-zinc-600 pb-3">
                  Complete Payment
                </h2>

                <div className="mb-6 p-4 bg-yellow-900/30 rounded-lg">
                  <p className="text-yellow-400 font-bold mb-2">
                    Send Rs. {Total} to:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-zinc-300">
                      <span className="text-white">EasyPaisa:</span>{" "}
                      {paymentDetails?.easypaisa?.number || "03700360389"}
                    </p>
                    <p className="text-zinc-300">
                      <span className="text-white">Account Title:</span>{" "}
                      {paymentDetails?.easypaisa?.accountName || "Fida Hussain"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                      {paymentDetails?.easypaisa?.instructions || 
                       "Send exact amount and upload screenshot below"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Upload Payment Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full text-white bg-zinc-700 rounded-lg p-2 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:bg-yellow-400 file:text-black file:border-0 cursor-pointer"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Upload JPG, PNG or PDF (Max 5MB)
                    </p>
                  </div>

                  <button
                    onClick={handleUploadSlip}
                    disabled={!selectedFile || uploading}
                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-600 text-black font-bold rounded-xl transition-all"
                  >
                    {uploading ? "Uploading..." : "Upload & Submit"}
                  </button>

                  {uploadMessage && (
                    <div className="text-green-400 text-sm text-center p-2 bg-green-900/30 rounded-lg">
                      {uploadMessage}
                    </div>
                  )}

                  <button
                    onClick={() => setShowPayment(false)}
                    className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
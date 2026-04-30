import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // Track which button is clicked
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        console.log("Order History Response:", response.data);
        setOrderHistory(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  // 🔥 OPTION 1: READ ONLINE - Browser mein PDF open hoti hai
  const handleReadOnline = (pdfUrl, bookTitle) => {
    if (!pdfUrl) {
      alert("Book file not available!");
      return;
    }
    
    try {
      let fullUrl = pdfUrl;
      
      // Agar local file hai (server pe stored)
      if (pdfUrl.startsWith("/uploads/")) {
        fullUrl = `http://localhost:1000${pdfUrl}`;
      }
      
      // Agar Google Drive link hai
      if (pdfUrl.includes("drive.google.com")) {
        if (pdfUrl.includes("/view")) {
          const fileId = pdfUrl.split("/d/")[1]?.split("/")[0];
          if (fileId) {
            fullUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          }
        }
      }
      
      console.log("Reading online:", fullUrl);
      // New tab mein PDF open karo
      window.open(fullUrl, "_blank");
      
    } catch (error) {
      console.error("Read online error:", error);
      alert("Failed to open book. Please try again.");
    }
  };

  // 🔥 OPTION 2: DOWNLOAD PDF - File save hoti hai computer mein
  const handleDownload = async (pdfUrl, bookTitle) => {
    if (!pdfUrl) {
      alert("Book file not available!");
      return;
    }
    
    setProcessing(`download-${bookTitle}`);
    
    try {
      let fullUrl = pdfUrl;
      
      // Agar local file hai
      if (pdfUrl.startsWith("/uploads/")) {
        fullUrl = `http://localhost:1000${pdfUrl}`;
      }
      
      // Agar Google Drive link hai
      if (pdfUrl.includes("drive.google.com")) {
        if (pdfUrl.includes("/view")) {
          const fileId = pdfUrl.split("/d/")[1]?.split("/")[0];
          if (fileId) {
            fullUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          }
        }
      }
      
      console.log("Downloading from:", fullUrl);
      
      // 🔥 FORCE DOWNLOAD - File ko blob mein convert karo
      const response = await axios.get(fullUrl, { 
        responseType: 'blob'  // Important: binary data ke liye
      });
      
      // Blob se download link create karo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Anchor tag create karo aur click karo
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle}.pdf`;  // File name
      document.body.appendChild(a);
      a.click();
      
      // Cleanup - memory free karo
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`${bookTitle} downloaded successfully!`);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
        Order History
      </h1>

      {OrderHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-400">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">No Orders Yet</p>
          <p className="text-xs sm:text-sm mt-2 text-center">
            You have not placed any orders yet
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 pb-16">
          {OrderHistory.map((order) => (
            <div key={order._id} className="bg-zinc-800 rounded-xl p-4">
              {/* Order Header */}j
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-700">
                <div>
                  <p className="text-zinc-400 text-xs">Order ID</p>
                  <p className="text-white text-xs font-mono">{order._id?.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs">Date</p>
                  <p className="text-white text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs">Total</p>
                  <p className="text-yellow-400 font-bold text-sm">
                    Rs. {order.totalAmount || 0}
                  </p>
                </div>
                <div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                    ${order.paymentStatus === "verified" && order.downloadAccess
                      ? "bg-green-400/20 text-green-400"
                      : order.paymentStatus === "pending"
                      ? "bg-yellow-400/20 text-yellow-400"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-400/20 text-red-400"
                      : "bg-blue-400/20 text-blue-400"
                    }`}>
                    {order.paymentStatus === "verified" && order.downloadAccess
                      ? "Ready to Download"
                      : order.paymentStatus === "verified"
                      ? "Payment Verified"
                      : order.paymentStatus === "pending"
                      ? "Pending Verification"
                      : order.orderStatus || "Order Placed"}
                  </span>
                </div>
              </div>

              {/* Books List */}
              <div className="space-y-3">
                {order.books && order.books.map((bookItem, bookIndex) => {
                  const book = bookItem.book || bookItem;
                  const bookId = book?._id || bookItem.bookId;
                  const bookTitle = bookItem.title || book?.title || "Unknown Title";
                  const bookAuthor = book?.author || "Unknown Author";
                  const bookPrice = bookItem.price || book?.price || 0;
                  const bookPdfFile = book?.pdfFile || bookItem.pdfFile || "";
                  const bookImage = book?.url || bookItem.url || "/book-placeholder.png";

                  return (
                    <div
                      key={bookIndex}
                      onClick={() => bookId && navigate(`/view-book-details/${bookId}`)}
                      className="flex items-center gap-3 sm:gap-4 bg-zinc-700/50 hover:bg-zinc-700 
                                 rounded-lg p-3 cursor-pointer transition-all duration-200"
                    >
                      <img
                        src={bookImage}
                        alt={bookTitle}
                        onError={(e) => { e.target.src = "/book-placeholder.png"; }}
                        className="h-[60px] w-[45px] sm:h-[80px] sm:w-[60px] 
                                   object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h2 className="text-white text-xs sm:text-sm md:text-base font-semibold">
                          {bookTitle}
                        </h2>
                        <p className="text-zinc-400 text-xs">by {bookAuthor}</p>
                        <p className="text-yellow-300 font-bold text-xs">Rs. {bookPrice}</p>
                      </div>

                      {/* 🔥 TWO BUTTONS - Read Online & Download */}
                      {order.paymentStatus === "verified" && order.downloadAccess && (
                        <div className="flex gap-2 flex-shrink-0">
                          {/* READ ONLINE BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadOnline(bookPdfFile, bookTitle);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 
                                       rounded-lg text-xs font-semibold transition"
                          >
                            📖 Read Online
                          </button>
                          
                          {/* DOWNLOAD BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(bookPdfFile, bookTitle);
                            }}
                            disabled={processing === `download-${bookTitle}`}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 
                                       disabled:bg-green-800 rounded-lg text-xs font-semibold transition"
                          >
                            {processing === `download-${bookTitle}` ? "Downloading..." : "💾 Download PDF"}
                          </button>
                        </div>
                      )}

                      {order.paymentStatus === "pending" && (
                        <div className="px-3 py-1.5 bg-yellow-600/50 rounded-lg text-xs flex-shrink-0">
                          ⏳ Pending
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {order.slipImageUrl && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <p className="text-zinc-500 text-xs">
                    Payment Slip Submitted:{" "}
                    <a href={order.slipImageUrl} target="_blank" rel="noopener noreferrer"
                       className="text-yellow-400 hover:underline">
                      View Slip
                    </a>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
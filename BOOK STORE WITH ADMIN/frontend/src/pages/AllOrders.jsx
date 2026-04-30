import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1000/api/v1/get-all-orders",
        { headers }
      );
      console.log("Orders:", res.data);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v1/update-status/${orderId}`,
        { status: newStatus },
        { headers }
      );
      fetchOrders();
      alert("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v1/verify-payment/${orderId}`,
        {},
        { headers }
      );
      fetchOrders();
      alert("Payment verified! User can now download.");
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Failed to verify payment");
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;
    
    try {
      await axios.delete(
        `http://localhost:1000/api/v1/delete-order/${orderId}`,
        { headers }
      );
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">All Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-zinc-400 py-10">No orders found</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                {/* Order Header */}
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3 pb-2 border-b border-zinc-800">
                  <div>
                    <p className="text-zinc-500 text-xs">Order ID</p>
                    <p className="text-white text-sm font-mono">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Customer</p>
                    <p className="text-white text-sm">{order.user?.username || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Total</p>
                    <p className="text-yellow-400 font-bold">Rs. {order.totalAmount || 0}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Payment</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.paymentStatus === "verified" ? "bg-green-900 text-green-300" :
                      order.paymentStatus === "rejected" ? "bg-red-900 text-red-300" :
                      "bg-yellow-900 text-yellow-300"
                    }`}>
                      {order.paymentStatus || "pending"}
                    </span>
                  </div>
                </div>

                {/* 🔥 PAYMENT SLIP IMAGE - FIXED */}
                {order.slipImageUrl && (
                  <div className="mb-3 p-3 bg-zinc-800 rounded-lg">
                    <p className="text-zinc-400 text-xs mb-2">Payment Slip:</p>
                    <a 
                      href={order.slipImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-yellow-400 text-sm hover:underline break-all"
                    >
                      📄 View Payment Slip
                    </a>
                    <img 
                      src={order.slipImageUrl} 
                      alt="Payment Slip"
                      className="mt-2 max-h-32 rounded-lg cursor-pointer"
                      onClick={() => window.open(order.slipImageUrl, "_blank")}
                    />
                  </div>
                )}

                {/* Books List */}
                <div className="space-y-2 mb-3">
                  {order.books && order.books.map((bookItem, idx) => {
                    const book = bookItem.book || bookItem;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={book?.url || "https://via.placeholder.com/40x56"}
                          alt={book?.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">{book?.title || bookItem.title}</p>
                          <p className="text-zinc-400 text-xs">Rs. {book?.price || bookItem.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-2 border-t border-zinc-800">
                  <select
                    value={order.status || order.orderStatus || "Order Placed"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="text-xs border border-zinc-700 rounded-lg px-2 py-1 bg-zinc-800 text-white"
                  >
                    <option>Order Placed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                  {/* 🔥 VERIFY PAYMENT BUTTON */}
                  {(order.paymentStatus === "pending" && order.slipImageUrl) && (
                    <button
                      onClick={() => verifyPayment(order._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-semibold"
                    >
                      ✅ Verify & Grant Download
                    </button>
                  )}

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
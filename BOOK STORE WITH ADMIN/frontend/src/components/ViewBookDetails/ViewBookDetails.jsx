import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!Data) return <Loader />;

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };


  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourite",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  }; // ← closing brace added here


  const handleCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-to-cart",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-12">
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-zinc-400 hover:text-white text-sm flex items-center gap-2 transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-[300px] xl:w-[340px] flex-shrink-0">
            <div className="bg-zinc-800 rounded-2xl p-4 sm:p-6 flex items-center justify-center h-[260px] sm:h-[360px] md:h-[420px] lg:h-[480px] shadow-lg shadow-black/30">
              <img
                src={Data.url}
                alt={Data.title}
                className="h-full w-full object-contain rounded-lg drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold leading-tight text-white">
                {Data.title}
              </h1>
              <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                by <span className="text-zinc-200 font-semibold">{Data.author}</span>
              </p>
              <p className="flex items-center gap-2 mt-3 text-zinc-400 text-sm sm:text-base">
                <GrLanguage className="text-base flex-shrink-0" />
                {Data.language}
              </p>
            </div>

            <hr className="border-zinc-700" />

            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-2 text-zinc-300">
                About this book
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-6 sm:line-clamp-none">
                {Data.desc}
              </p>
            </div>

            <hr className="border-zinc-700" />

            <div className="flex items-center gap-3">
              <p className="text-yellow-400 text-2xl sm:text-3xl xl:text-4xl font-bold">
                ₹ {Data.price}
              </p>
              <span className="text-zinc-500 text-sm line-through">
                ₹ {Math.round(Data.price * 1.2)}
              </span>
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                20% OFF
              </span>
            </div>

            {isLoggedIn === true && role === "user" && (
              <div className="flex flex-col xs:flex-row gap-3 mt-2">
                <button
                  onClick={handleCart}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-semibold rounded-xl transition-all text-sm sm:text-base shadow-lg shadow-yellow-400/20"
                >
                  <FiShoppingCart className="text-lg" />
                  Add to Cart
                </button>
                <button
                  onClick={handleFavourite}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-white font-semibold rounded-xl transition-all text-sm sm:text-base shadow-lg shadow-black/20"
                >
                  <FiHeart className="text-lg" />
                  Add to Wishlist
                </button>
              </div>
            )}

        

            {!isLoggedIn && (
              <p className="text-zinc-500 text-sm mt-2">
                🔒 Please{" "}
                <a href="/login" className="text-blue-400 hover:underline">
                  login
                </a>{" "}
                to add this book to your cart or wishlist.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookDetails;
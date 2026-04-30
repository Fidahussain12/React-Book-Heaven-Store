import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favourite }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleRemoveBook = async () => {
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: data._id,
      };
      const response = await axios.put(
        "http://localhost:1000/api/v1/remove-from-favourite",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: data._id,
      };
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-book",
        { headers }
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col bg-zinc-800 rounded-xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
      
      {/* Link sirf image aur info par */}
      <Link to={`/view-book-details/${data._id}`} className="flex flex-col flex-1">
        
        {/* Book Image */}
        <div className="bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden h-[160px] sm:h-[200px] md:h-[220px]">
          <img
            src={data.url}
            alt={data.title}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Book Info */}
        <div className="mt-2 flex-1">
          <h2 className="text-white text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
            {data.title}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 line-clamp-1">
            {data.author}
          </p>
          <p className="text-yellow-300 font-bold text-sm sm:text-base mt-1">
            Rs. {data.price}
          </p>
        </div>
      </Link>

      {/* Remove from Favourite Button - sirf favourite page par */}
      {favourite && (
        <button
          className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-red-500 hover:bg-red-600 
                     text-white text-xs sm:text-sm font-semibold rounded-lg 
                     transition-all duration-200 mt-3"
          onClick={handleRemoveBook}
        >
          Remove From Favourite
        </button>
      )}

      {/* Admin Buttons - sirf admin ko dikhenge */}
      {role === "admin" && (
        <div className="flex gap-2 mt-3">
 
          <button
            className="flex-1 py-1.5 sm:py-2 px-3 bg-red-500 hover:bg-red-600 
                       text-white text-xs sm:text-sm font-semibold rounded-lg 
                       transition-all duration-200"
            onClick={handleDeleteBook}
          >
            Delete
          </button>
        </div>
      )}

    </div>
  );
};

export default BookCard;
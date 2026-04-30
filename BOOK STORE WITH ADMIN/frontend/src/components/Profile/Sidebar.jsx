import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  if (!data) return null;

  const handleLogout = () => {
    dispatch(authAction.logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-zinc-800 p-4 sm:p-6 rounded-xl flex flex-col items-center h-full gap-2">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-2 w-full pb-4 border-b border-zinc-600">
        <img
          src={data?.avatar}
          alt="User Avatar"
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-blue-500"
        />
        <p className="text-base sm:text-lg font-bold text-white text-center">
          {data?.username}
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 text-center break-all">
          {data?.email}
        </p>
      </div>

      {/* Navigation Links - sirf user ko dikhao */}
      {role === "user" && (
        <div className="flex flex-col w-full gap-2 mt-2 flex-1">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-blue-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            ❤️ Favourites
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-yellow-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            📦 Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-green-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            ⚙️ Settings
          </Link>
        </div>
      )}

      {role === "admin" && (
        <div className="flex flex-col w-full gap-2 mt-2 flex-1">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-blue-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-yellow-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            📦 Add Book
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full py-2 px-4 text-center 
                       hover:bg-green-500 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            ⚙️ Settings
          </Link>
        </div>
      )}

      {/* Logout Button - sab ko dikhao */}
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 
                   text-white font-semibold rounded-lg transition-all 
                   duration-200 mt-auto text-sm sm:text-base"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;

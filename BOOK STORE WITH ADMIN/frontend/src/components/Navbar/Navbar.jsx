import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const allLinks = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Admin Profile", link: "/profile" },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Filter links based on login status and role
  const links = allLinks.filter((item) => {
    // Cart - only for logged in users
    if (item.title === "Cart") {
      return isLoggedIn === true;
    }
    
    // Profile - only for logged in users (not admin)
    if (item.title === "Profile") {
      return isLoggedIn === true && role !== "admin";
    }
    
    // Admin Profile - only for admin users
    if (item.title === "Admin Profile") {
      return isLoggedIn === true && role === "admin";
    }
    
    // Home and All Books - sab ko dikhao
    return true;
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-2 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://img.icons8.com/nolan/64/books.png"
            alt="book"
          />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4 py-1">
          {/* Desktop Links */}
          <div className="hidden md:flex gap-4">
            {links.map((item, i) => (
              <Link
                to={item.link}
                className="hover:text-blue-500 transition-all duration-300"
                key={i}
              >
                {item.title === "Admin Profile" ? "👑 Admin" : item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          {isLoggedIn === false && (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Logout Button (visible jab bhi user logged in ho) */}
          {isLoggedIn === true && (
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="hidden md:block px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Logout
            </button>
          )}

          {/* Hamburger Button */}
          <button
            className="text-white text-2xl hover:text-zinc-400 md:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={`${
          mobileNavOpen ? "flex" : "hidden"
        } bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex-col items-center justify-center`}
      >
        {/* Close Button */}
        <button
          className="text-white text-3xl mb-8 hover:text-zinc-400 absolute top-6 right-8"
          onClick={() => setMobileNavOpen(false)}
        >
          ✕
        </button>

        {/* Mobile Links */}
        <div className="flex flex-col items-center">
          {links.map((item, i) => (
            <Link
              to={item.link}
              className="text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300"
              key={i}
              onClick={() => setMobileNavOpen(false)}
            >
              {item.title === "Admin Profile" ? "👑 Admin" : item.title}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          {isLoggedIn === false ? (
            <div className="flex flex-col items-center mt-4">
              <Link
                to="/login"
                className="px-8 py-2 mb-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                onClick={() => setMobileNavOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-8 py-2 text-lg font-semibold rounded-full border-2 border-blue-500 text-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white hover:scale-105 transition-all duration-300"
                onClick={() => setMobileNavOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="px-8 py-2 text-lg font-semibold rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
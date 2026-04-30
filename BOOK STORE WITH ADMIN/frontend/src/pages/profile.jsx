import React, { useState, useEffect } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";

function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    // Check if user is logged in
    if (!localStorage.getItem("token") || !localStorage.getItem("id")) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        console.log("API Response:", response.data);
        setData(response.data);
        setError(null);
      } catch (error) {
        console.error("Fetch failed:", error);
        setError(error.response?.data?.message || "Failed to load user data");
        
        // If token expired or invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Loading state
  if (!data && !error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-900">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-900">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row min-h-screen py-8 gap-4 text-white overflow-hidden">
      <div className="w-full md:w-1/6">
        <Sidebar data={data} />
      </div>
      <div className="w-full md:w-5/6">
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;
import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfileData(response.data);
        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
        setAddress(response.data.address || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !email.trim()) {
      alert("Username and email cannot be empty");
      return;
    }
    setProfileLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-profile",
        { username, email },
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!address.trim()) {
      alert("Address cannot be empty");
      return;
    }
    setAddressLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-address",
        { address },
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    if (newPassword.length <= 5) {
      alert("New password must be greater than 5 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/update-password",
        { oldPassword, newPassword },
        { headers }
      );
      alert(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Reusable input field
  const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-zinc-400 text-xs sm:text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-700 text-white rounded-lg 
                   px-3 py-2.5 text-sm border border-zinc-600
                   focus:outline-none focus:border-yellow-400 
                   transition-all duration-200"
      />
    </div>
  );

  // Reusable section card
  const SectionCard = ({ title, children }) => (
    <div className="w-full bg-zinc-800 rounded-xl p-4 sm:p-5 md:p-6">
      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-zinc-300 mb-4 
                     border-b border-zinc-700 pb-2">
        {title}
      </h2>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );

  // Reusable button
  const UpdateButton = ({ onClick, disabled, loading, label }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 
                 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                 text-black font-semibold rounded-lg transition-all 
                 text-sm mt-1"
    >
      {loading ? "Updating..." : label}
    </button>
  );

  return (
    <div className="w-full min-h-screen px-3 sm:px-6 md:px-8 py-4 sm:py-6 pb-20">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
        Settings
      </h1>

      <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-xl mx-auto md:mx-0">

        {/* Profile Information */}
        <SectionCard title="Profile Information">
          <InputField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <UpdateButton
            onClick={handleUpdateProfile}
            disabled={profileLoading}
            loading={profileLoading}
            label="Update Profile"
          />
        </SectionCard>

        {/* Update Address */}
        <SectionCard title="Update Address">
          <label className="text-zinc-400 text-xs sm:text-sm font-medium">
            Delivery Address
          </label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address..."
            className="w-full bg-zinc-700 text-white rounded-lg 
                       px-3 py-2.5 text-sm border border-zinc-600
                       focus:outline-none focus:border-yellow-400
                       resize-none transition-all duration-200"
          />
          <UpdateButton
            onClick={handleUpdateAddress}
            disabled={addressLoading}
            loading={addressLoading}
            label="Update Address"
          />
        </SectionCard>

        {/* Update Password */}
        <SectionCard title="Update Password">
          <InputField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <InputField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <UpdateButton
            onClick={handleUpdatePassword}
            disabled={passwordLoading}
            loading={passwordLoading}
            label="Update Password"
          />
        </SectionCard>

        {/* Account Info */}
        <SectionCard title="Account Info">
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-400 text-xs sm:text-sm">Role</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold
              ${profileData?.role === "admin"
                ? "bg-purple-400/20 text-purple-400"
                : "bg-blue-400/20 text-blue-400"
              }`}>
              {profileData?.role || "user"}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-400 text-xs sm:text-sm">Member Since</span>
            <span className="text-zinc-300 text-xs sm:text-sm">
              {profileData?.createdAt
                ? new Date(profileData.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </SectionCard>

      </div>
    </div>
  );
};

export default Settings; 
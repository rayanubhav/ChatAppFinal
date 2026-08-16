import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import apiClient from "../../apiClient.js";
import { useAuth } from "../../Context/AuthProvider.jsx";
import toast from "react-hot-toast";

function Logout() {
  const [loading, setLoading] = useState(false);
  const [, setAuthUser] = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/user/logout");
      localStorage.removeItem("messenger");
      setAuthUser(null);
      toast.success("Logged out successfully");
    } catch (_) {
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      title="Logout"
      onClick={handleLogout}
      disabled={loading}
      className="btn btn-ghost w-full justify-start text-white hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50"
    >
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <FiLogOut className="text-2xl" />
      )}
      <span className="ml-2">Logout</span>
    </button>
  );
}

export default Logout;
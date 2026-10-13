import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import apiClient from "../../apiClient.js";
import { useAuth } from "../../Context/AuthProvider.jsx";
import { getUserAvatar } from "../../utils/avatar.js";
import toast from "react-hot-toast";

function Logout() {
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useAuth();

  const currentUser = authUser?.user || authUser;
  const avatarUrl = getUserAvatar(currentUser?._id, currentUser?.name);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiClient.post("/user/logout");
      localStorage.removeItem("messenger");
      setAuthUser(null);
      toast.success("Signed out successfully");
    } catch (_) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#161b22]/90 border border-[#30363d]/60">
      {/* Current user info */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-indigo-500/40 bg-[#21262d]">
            <img
              src={avatarUrl}
              alt={currentUser?.name || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#161b22]"></span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate capitalize">
            {currentUser?.name || "My Account"}
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            {currentUser?.email || ""}
          </p>
        </div>
      </div>

      {/* Logout button */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        title="Sign Out"
        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <FiLogOut className="text-lg transition-transform hover:rotate-12" />
        )}
      </button>
    </div>
  );
}

export default Logout;
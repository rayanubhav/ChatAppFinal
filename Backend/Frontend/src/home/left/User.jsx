import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import { getUserAvatar } from "../../utils/avatar.js";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user?._id;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user?._id);
  const avatarUrl = getUserAvatar(user?._id, user?.name);

  return (
    <div
      onClick={() => setSelectedConversation(user)}
      className={`group relative mx-2 mb-1.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center space-x-3.5 ${
        isSelected
          ? "bg-gradient-to-r from-indigo-600/90 to-indigo-700/80 text-white shadow-md shadow-indigo-950/50"
          : "hover:bg-[#161b22] text-slate-300 hover:text-white"
      }`}
    >
      {/* Active left indicator pill */}
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></span>
      )}

      {/* Avatar with status indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 bg-[#21262d]">
          <img
            src={avatarUrl}
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Online / Offline status indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0d1117] ${
            isOnline ? "bg-emerald-500 online-pulse" : "bg-slate-500"
          }`}
          title={isOnline ? "Online" : "Offline"}
        ></span>
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold truncate capitalize group-hover:translate-x-0.5 transition-transform">
            {user?.name}
          </h2>
        </div>
        <p
          className={`text-xs truncate mt-0.5 ${
            isSelected ? "text-indigo-100" : "text-slate-400 group-hover:text-slate-300"
          }`}
        >
          {user?.email}
        </p>
      </div>
    </div>
  );
}

export default User;
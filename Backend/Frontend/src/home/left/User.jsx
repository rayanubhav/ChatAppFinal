import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import { getUserAvatar } from "../../utils/avatar.js";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user?._id;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user?._id);
  const profileImage = getUserAvatar(user?._id);

  return (
    <div
      className={`
        flex space-x-4 px-6 py-4 cursor-pointer 
        transition-all duration-300 ease-in-out
        border-b border-slate-800
        ${
          isSelected
            ? "bg-gradient-to-r from-blue-600 to-slate-700"
            : "hover:bg-slate-700"
        }
      `}
      onClick={() => setSelectedConversation(user)}
    >
      <div className={`avatar ${isOnline ? "online" : "offline"} `}>
        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={profileImage} alt={user?.name || "User"} />
        </div>
      </div>

      <div className="overflow-hidden">
        <h1 className="font-bold truncate">{user?.name}</h1>
        <span className="text-sm text-gray-400 truncate">{user?.email}</span>
      </div>
    </div>
  );
}

export default User;
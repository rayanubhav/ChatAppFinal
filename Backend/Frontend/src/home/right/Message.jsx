import React from "react";
import { useAuth } from "../../Context/AuthProvider.jsx";

function Message({ message }) {
  const [authUser] = useAuth();
  const currentUserId = authUser?.user?._id || authUser?._id;

  const itsme = message?.senderId === currentUserId;
  const chatName = itsme ? "chat-end" : "chat-start";
  const chatColor = itsme
    ? "bg-gradient-to-r from-blue-600 to-cyan-500"
    : "bg-slate-700";

  const formattedTime = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (!message?.message) return null;

  return (
    <div className="py-1">
      <div className={`chat ${chatName}`}>
        <div className={`chat-bubble text-white ${chatColor} shadow-md`}>
          {message.message}
        </div>
        <div className="chat-footer opacity-50 text-xs">{formattedTime}</div>
      </div>
    </div>
  );
}

export default Message;
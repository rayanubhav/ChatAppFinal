import React, { useState } from "react";
import { useAuth } from "../../Context/AuthProvider.jsx";

function Message({ message }) {
  const [authUser] = useAuth();
  const currentUserId = authUser?.user?._id || authUser?._id;
  const [showTime, setShowTime] = useState(false);

  const itsme = message?.senderId === currentUserId;

  const formattedTime = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (!message?.message) return null;

  return (
    <div
      className={`flex flex-col py-1 animate-fade-in ${
        itsme ? "items-end" : "items-start"
      }`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      <div
        className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 text-sm break-words transition-all duration-200 select-text ${
          itsme
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-xs shadow-md shadow-indigo-950/40"
            : "bg-[#1e2530] text-[#e6edf3] border border-[#30363d]/70 rounded-2xl rounded-bl-xs shadow-sm"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.message}</p>
      </div>

      {/* Timestamp or sending indicator */}
      <span
        className={`text-[10px] mt-1 px-1 transition-opacity duration-200 ${
          message.isOptimistic
            ? "text-indigo-400 italic opacity-90"
            : showTime
            ? "text-slate-400 opacity-100"
            : "text-slate-400 opacity-60"
        }`}
      >
        {message.isOptimistic ? "sending..." : formattedTime}
      </span>
    </div>
  );
}

export default Message;
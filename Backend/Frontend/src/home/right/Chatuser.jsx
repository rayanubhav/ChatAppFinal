import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import { getUserAvatar } from "../../utils/avatar.js";
import { IoArrowBack } from "react-icons/io5";
import { FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";

function Chatuser() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { socket, onlineUsers } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  const isOnline = onlineUsers.includes(selectedConversation?._id);
  const profileImage = getUserAvatar(selectedConversation?._id, selectedConversation?.name);

  const handleBack = () => {
    setSelectedConversation(null);
  };

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    const handleTyping = (data) => {
      if (data?.from === selectedConversation._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (data?.from === selectedConversation._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation?._id]);

  if (!selectedConversation) return null;

  return (
    <div className="h-16 px-5 flex items-center justify-between bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d]/60 z-10">
      <div className="flex items-center space-x-3.5">
        {/* Back button for mobile */}
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          title="Back to contacts"
        >
          <IoArrowBack className="text-xl" />
        </button>

        {/* Avatar with status */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30 bg-[#21262d]">
            <img
              src={profileImage}
              alt={selectedConversation.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#161b22] ${
              isOnline ? "bg-emerald-500 online-pulse" : "bg-slate-500"
            }`}
          ></span>
        </div>

        {/* User name & status indicator */}
        <div>
          <h2 className="text-sm font-semibold text-white capitalize leading-tight">
            {selectedConversation.name}
          </h2>
          <div className="h-4 flex items-center mt-0.5">
            {isTyping ? (
              <span className="flex items-center text-xs text-indigo-400 font-medium">
                typing
                <span className="inline-flex ml-1 space-x-0.5">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></span>
                  <span
                    className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></span>
                </span>
              </span>
            ) : (
              <span
                className={`text-xs ${
                  isOnline ? "text-emerald-400 font-medium" : "text-slate-400"
                }`}
              >
                {isOnline ? "Active now" : "Offline"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-1">
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Voice call (Coming soon)"
        >
          <FiPhone className="text-lg" />
        </button>
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Video call (Coming soon)"
        >
          <FiVideo className="text-lg" />
        </button>
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Details"
        >
          <FiMoreVertical className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default Chatuser;
import React, { useEffect, useState } from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import { getUserAvatar } from "../../utils/avatar.js";
import { IoArrowBack } from "react-icons/io5";

function Chatuser() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { socket, onlineUsers } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  const isOnline = onlineUsers.includes(selectedConversation?._id);
  const profileImage = getUserAvatar(selectedConversation?._id);

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
    <div className="py-3 h-auto flex space-x-4 items-center bg-slate-800 border-b border-slate-700 pl-5">
      <button
        onClick={handleBack}
        className="btn btn-ghost btn-circle lg:hidden"
      >
        <IoArrowBack className="text-xl text-white" />
      </button>

      <div className={`avatar ${isOnline ? "online" : "offline"}`}>
        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={profileImage} alt={selectedConversation.name} />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-semibold">{selectedConversation.name}</h1>
        <div className="h-4">
          {isTyping ? (
            <span className="text-sm text-green-400 italic">typing...</span>
          ) : (
            <span className="text-sm text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatuser;
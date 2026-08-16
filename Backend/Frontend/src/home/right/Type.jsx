import React, { useState, useRef } from "react";
import { GrSend } from "react-icons/gr";
import useSendMessage from "../../Context/useSendMessage.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import useConversation from "../../statemanage/useConversation.js";

function Type() {
  const { loading, sendMessages } = useSendMessage();
  const [message, setMessage] = useState("");
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage || loading) return;

    if (socket && selectedConversation?._id) {
      socket.emit("stopTyping", { to: selectedConversation._id });
    }

    setMessage("");
    await sendMessages(cleanMessage);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket || !selectedConversation?._id) return;

    socket.emit("typing", { to: selectedConversation._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedConversation._id });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-3 h-[8vh] items-center bg-slate-800 px-4">
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="border border-gray-700 flex items-center w-full py-3 px-3 rounded-xl outline-none bg-slate-900 text-white"
          />
        </div>
        <button
          type="submit"
          className="text-white text-2xl p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-slate-600"
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <span className="loading loading-spinner text-xs"></span>
          ) : (
            <GrSend />
          )}
        </button>
      </div>
    </form>
  );
}

export default Type;
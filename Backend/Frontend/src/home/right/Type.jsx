import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import useSendMessage from "../../Context/useSendMessage.js";
import { useSocketContext } from "../../Context/SocketContext.jsx";
import useConversation from "../../statemanage/useConversation.js";

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: [
      "😊", "😂", "🤣", "😍", "🥰", "😎", "🤔", "🥳", "😭", "🥺",
      "😴", "😇", "🤩", "😋", "😜", "🤪", "🤫", "🤐", "🙄", "😬",
      "😏", "😌", "🤤", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵",
      "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐",
    ],
  },
  {
    name: "Hands & Gestures",
    emojis: [
      "👍", "👎", "👏", "🙌", "🤝", "✌️", "🤞", "🤙", "👊", "✊",
      "🙏", "🫡", "💪", "🖐️", "✋", "👌", "👈", "👉", "☝️", "🫶",
      "👋", "🤚", "🤛", "🤜", "🫰", "🤟", "🤘", "🤏", "🤌", "✍️",
    ],
  },
  {
    name: "Hearts & Love",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💖",
      "💗", "💓", "💞", "💕", "💔", "❣️", "❤️‍🔥", "💘", "💝", "💟",
    ],
  },
  {
    name: "Reactions & Fun",
    emojis: [
      "🔥", "✨", "🎉", "🎈", "🚀", "💯", "⚡", "💥", "🌟", "👑",
      "💎", "🍕", "🍔", "☕", "🍻", "🏆", "🎯", "🎮", "🐱", "🐶",
      "👀", "💀", "👻", "👽", "🤖", "🎃", "💩", "🪄", "🍿", "🍻",
    ],
  },
];

function Type() {
  const { loading, sendMessages } = useSendMessage();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setShowEmojiPicker(false);

    if (socket && selectedConversation?._id) {
      socket.emit("stopTyping", { to: selectedConversation._id });
    }

    setMessage(""); // Instantly clear input field
    sendMessages(cleanMessage); // Dispatched optimistically
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
    <div className="relative p-3 md:p-4 bg-[#161b22]/90 backdrop-blur-md border-t border-[#30363d]/60">
      {/* Floating Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-4 mb-3 w-80 sm:w-96 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl shadow-black/70 overflow-hidden z-50 animate-fade-in"
        >
          {/* Category Tabs */}
          <div className="flex border-b border-[#30363d] bg-[#0d1117]/80 px-2 py-1.5 overflow-x-auto gap-1">
            {EMOJI_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(idx)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all duration-150 whitespace-nowrap ${
                  activeCategory === idx
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#21262d]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 max-h-56 overflow-y-auto grid grid-cols-8 gap-1.5 text-xl select-none">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#21262d] hover:scale-125 transition-transform duration-100 cursor-pointer active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1 flex items-center bg-[#0d1117] border border-[#30363d]/80 focus-within:border-indigo-500 rounded-2xl transition-all duration-200">
          {/* Emoji Toggle Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-3 transition-colors ${
              showEmojiPicker
                ? "text-indigo-400"
                : "text-slate-400 hover:text-indigo-400"
            }`}
            title="Choose Emoji"
          >
            {showEmojiPicker ? (
              <BsEmojiSmileFill className="text-lg" />
            ) : (
              <BsEmojiSmile className="text-lg" />
            )}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="w-full py-3 pr-4 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-violet-400 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center flex-shrink-0"
          title="Send message"
        >
          <IoSend className="text-base" />
        </button>
      </form>
    </div>
  );
}

export default Type;
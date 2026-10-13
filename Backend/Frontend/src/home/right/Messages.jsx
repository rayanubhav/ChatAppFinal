import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import useGetMessage from "../../Context/useGetMessage.js";
import useGetSocketMessage from "../../Context/useGetSocketMessage.js";
import useConversation from "../../statemanage/useConversation.js";
import { getUserAvatar } from "../../utils/avatar.js";
import { BsHandIndexThumb } from "react-icons/bs";

// Shimmering chat bubble skeleton for conversation switching
const MessageSkeleton = () => (
  <div className="space-y-4 flex-1 py-4 animate-pulse">
    {/* Received message placeholder */}
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full bg-slate-800/90 flex-shrink-0"></div>
      <div className="space-y-1.5 max-w-[65%]">
        <div className="h-10 w-52 bg-slate-800/80 rounded-2xl rounded-bl-xs"></div>
        <div className="h-2 w-12 bg-slate-800/50 rounded"></div>
      </div>
    </div>

    {/* Sent message placeholder */}
    <div className="flex items-end justify-end gap-2.5">
      <div className="space-y-1.5 flex flex-col items-end max-w-[65%]">
        <div className="h-12 w-64 bg-indigo-950/60 border border-indigo-800/30 rounded-2xl rounded-br-xs"></div>
        <div className="h-2 w-10 bg-slate-800/50 rounded"></div>
      </div>
    </div>

    {/* Received message placeholder */}
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full bg-slate-800/90 flex-shrink-0"></div>
      <div className="space-y-1.5 max-w-[65%]">
        <div className="h-14 w-60 bg-slate-800/80 rounded-2xl rounded-bl-xs"></div>
        <div className="h-2 w-14 bg-slate-800/50 rounded"></div>
      </div>
    </div>

    {/* Sent message placeholder */}
    <div className="flex items-end justify-end gap-2.5">
      <div className="space-y-1.5 flex flex-col items-end max-w-[65%]">
        <div className="h-9 w-44 bg-indigo-950/60 border border-indigo-800/30 rounded-2xl rounded-br-xs"></div>
        <div className="h-2 w-10 bg-slate-800/50 rounded"></div>
      </div>
    </div>
  </div>
);

function Messages() {
  useGetMessage();
  useGetSocketMessage();

  const { messages, isLoadingMessages, selectedConversation } = useConversation();
  const messagesEndRef = useRef(null);

  const validMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [validMessages.length]);

  const partnerAvatar = selectedConversation
    ? getUserAvatar(selectedConversation._id, selectedConversation.name)
    : "";

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 md:px-6 py-4 flex flex-col justify-between">
      {isLoadingMessages ? (
        <MessageSkeleton />
      ) : validMessages.length > 0 ? (
        <div className="space-y-1.5 flex-1">
          {validMessages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/40 mb-3 bg-[#161b22]">
            <img
              src={partnerAvatar}
              alt={selectedConversation?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-base font-semibold text-white capitalize">
            {selectedConversation?.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            This is the beginning of your direct conversation history.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            <BsHandIndexThumb className="rotate-90 text-sm" />
            <span>Say hi to start chatting!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
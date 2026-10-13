import React, { useEffect } from "react";
import Chatuser from "./Chatuser.jsx";
import Messages from "./Messages.jsx";
import Type from "./Type.jsx";
import useConversation from "../../statemanage/useConversation.js";
import { useAuth } from "../../Context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";
import { BsChatSquareTextFill, BsShieldLock } from "react-icons/bs";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#090d16] text-slate-200">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <div className="flex flex-col h-full w-full">
          <Chatuser />
          <div className="flex-1 overflow-y-auto chat-pattern-bg">
            <Messages />
          </div>
          <Type />
        </div>
      )}
    </div>
  );
}

const NoChatSelected = () => {
  const [authUser] = useAuth();
  const currentUser = authUser?.user || authUser;
  const userName = currentUser?.name || "Friend";

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-6 bg-[#090d16] chat-pattern-bg">
      {/* Mobile drawer toggle */}
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost btn-circle drawer-button lg:hidden absolute left-4 top-4 text-white"
      >
        <CiMenuFries className="text-xl" />
      </label>

      {/* Ambient background glow */}
      <div className="w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl absolute pointer-events-none"></div>

      <div className="relative z-10 max-w-md text-center flex flex-col items-center">
        {/* Floating animated icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/25 mb-6 animate-bounce" style={{ animationDuration: "3s" }}>
          <BsChatSquareTextFill className="text-white text-3xl" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 capitalize">{userName}</span>!
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Select any contact from the left sidebar to start chatting. Send real-time messages with instant socket updates.
        </p>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161b22] border border-[#30363d]/80 text-xs text-slate-400">
          <BsShieldLock className="text-indigo-400" />
          <span>End-to-end encrypted messaging</span>
        </div>
      </div>
    </div>
  );
};

export default Right;
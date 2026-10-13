import React from "react";
import Search from "./Search.jsx";
import Users from "./Users.jsx";
import Logout from "../left1/Logout.jsx";
import { BsChatSquareTextFill } from "react-icons/bs";

function Left() {
  return (
    <div className="flex flex-col h-full w-full bg-[#0d1117] border-r border-[#30363d]/60 text-slate-200 select-none">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-[#30363d]/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <BsChatSquareTextFill className="text-white text-base" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Talk<span className="text-indigo-400">ie</span>
            </h1>
            <p className="text-[11px] text-slate-400">Real-time messaging</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Search />

      {/* User Conversations List */}
      <div className="flex-1 overflow-y-auto px-1 py-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Direct Messages
        </div>
        <Users />
      </div>

      {/* User Profile & Logout at Bottom */}
      <div className="p-3 border-t border-[#30363d]/60 bg-[#090d16]/60">
        <Logout />
      </div>
    </div>
  );
}

export default Left;
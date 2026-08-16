import React from "react";
import Search from "./Search.jsx";
import Users from "./Users.jsx";
import Logout from "../left1/Logout.jsx"; // 1. Import the Logout component

function Left() {
  return (
    <>
      <div className="flex flex-col h-full bg-slate-900 text-gray-300">
        <h1 className="font-bold text-3xl p-4 px-6">Chats</h1>
        <Search />
        
        <hr className="border-t border-slate-700 mx-4" />

        <div className="flex-1 overflow-y-auto">
          <Users />
        </div>

        <div className="p-4 border-t border-slate-700">
          <Logout />
        </div>
      </div>
    </>
  );
}

export default Left;
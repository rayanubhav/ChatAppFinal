import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import userGetAllUsers from "../../Context/userGetAllUsers.jsx";
import useConversation from "../../statemanage/useConversation.js";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers] = userGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const conversation = allUsers.find((user) =>
      user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("No user found with that name");
    }
  };

  return (
    <div className="px-4 py-2">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <FiSearch className="absolute left-3.5 text-slate-400 text-lg pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-[#161b22] border border-[#30363d]/80 text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-9 py-2.5 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            <FiX />
          </button>
        )}
      </form>
    </div>
  );
}

export default Search;
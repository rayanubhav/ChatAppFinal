/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import userGetAllUsers from "../../Context/userGetAllUsers.jsx";
import useConversation from "../../statemanage/useConversation.js";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers] = userGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    const conversation = allUsers.find((user) =>
      user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="h-auto">
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3 items-center">
            {/* Updated the label to be the input field itself, 
              using the dark theme colors.
            */}
            <label className="flex-1">
              <input
                type="text"
                className="grow outline-none bg-slate-800 text-white w-full rounded-lg p-3"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="text-white p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
            >
              <FaSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
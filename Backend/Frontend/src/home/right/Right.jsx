import React, { useEffect } from "react";
import Chatuser from "./Chatuser.jsx";
import Messages from "./Messages.jsx";
import Type from "./Type.jsx";
import useConversation from "../../statemanage/useConversation.js";
import { useAuth } from "../../Context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-gray-300">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <div className="flex flex-col h-screen">
          <Chatuser />
          <div className="flex-1 overflow-y-auto bg-slate-900">
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
  const userName = authUser?.user?.name || authUser?.name || "User";

  return (
    <div className="relative h-full w-full">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5 top-5"
      >
        <CiMenuFries className="text-white text-xl" />
      </label>
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center px-4">
          Welcome <span className="font-semibold text-xl">{userName}</span>
          <br />
          No chat selected, please start conversation by selecting anyone from
          your contacts
        </h1>
      </div>
    </div>
  );
};

export default Right;
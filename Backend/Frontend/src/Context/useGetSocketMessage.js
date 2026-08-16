import { useEffect } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/noti.mp3";

function useGetSocketMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Check if message belongs to current active chat
      if (selectedConversation?._id === newMessage.senderId) {
        try {
          const notification = new Audio(sound);
          notification.play().catch(() => {});
        } catch (_) {}

        // Append directly to state without querying database
        setMessage([...messages, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, messages, setMessage, selectedConversation?._id]);
}

export default useGetSocketMessage;
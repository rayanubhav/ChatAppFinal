import { useEffect, useRef } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/noti.mp3";
import toast from "react-hot-toast";

function useGetSocketMessage() {
  const { socket } = useSocketContext();
  const { messages, setMessage, selectedConversation } = useConversation();
  const messagesRef = useRef(messages);
  const activeChatRef = useRef(selectedConversation);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    activeChatRef.current = selectedConversation;
  }, [selectedConversation]);

  // Request native browser desktop notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const showDesktopNotification = (title, body) => {
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          const notification = new Notification(title, {
            body: body || "You have a new message",
            icon: "/image.png",
          });
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (_) {}
      }
    };

    const handleNewMessage = (newMessage) => {
      // Audio notification chime
      try {
        const audio = new Audio(sound);
        audio.play().catch(() => {});
      } catch (_) {}

      const isActiveChat = activeChatRef.current?._id === newMessage.senderId;

      if (isActiveChat) {
        // Message is from the active conversation
        setMessage([...(messagesRef.current || []), newMessage]);

        // If tab is in background or minimized, trigger native desktop notification
        if (typeof document !== "undefined" && document.visibilityState !== "visible") {
          showDesktopNotification("New message received", newMessage.message);
        }
      } else {
        // Message is from a different contact -> show in-app toast + desktop notification
        toast(
          `New message: ${newMessage.message.substring(0, 35)}${
            newMessage.message.length > 35 ? "..." : ""
          }`,
          {
            icon: "💬",
            duration: 4000,
          }
        );

        showDesktopNotification("Talkie — New Message", newMessage.message);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, setMessage]);
}

export default useGetSocketMessage;
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";
import io from "socket.io-client";

const socketContext = createContext();
export const useSocketContext = () => useContext(socketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = authUser?.user?._id || authUser?._id;

    if (userId && BACKEND_URL) {
      const newSocket = io(BACKEND_URL, {
        query: { userId },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("getonline", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, BACKEND_URL]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
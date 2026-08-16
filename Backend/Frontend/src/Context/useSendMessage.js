import { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import apiClient from "../apiClient.js";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();

  const sendMessages = async (message) => {
    if (!selectedConversation?._id) return;

    setLoading(true);
    try {
      const res = await apiClient.post(
        `/message/send/${selectedConversation._id}`,
        { message }
      );

      const addedMessage = res.data?.newMessage || res.data;
      if (addedMessage) {
        setMessage([...messages, addedMessage]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
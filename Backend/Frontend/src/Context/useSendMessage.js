import { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import { useAuth } from "./AuthProvider.jsx";
import apiClient from "../apiClient.js";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useConversation();
  const [authUser] = useAuth();
  const currentUserId = authUser?.user?._id || authUser?._id;

  const sendMessages = async (message) => {
    if (!selectedConversation?._id || !message?.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: selectedConversation._id,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // 1. Immediately append optimistic message to state (0ms perceived latency!)
    const currentMessages = useConversation.getState().messages || [];
    useConversation.getState().setMessage([...currentMessages, optimisticMessage]);

    setLoading(true);
    try {
      // 2. Perform background API call
      const res = await apiClient.post(
        `/message/send/${selectedConversation._id}`,
        { message }
      );

      const savedMessage = res.data?.newMessage || res.data;

      // 3. Seamlessly swap the temporary optimistic message with confirmed server message
      if (savedMessage) {
        const latestMessages = useConversation.getState().messages || [];
        useConversation.getState().setMessage(
          latestMessages.map((msg) => (msg._id === tempId ? savedMessage : msg))
        );
      }
    } catch (error) {
      // 4. On network error, remove the temporary message and alert the user
      const latestMessages = useConversation.getState().messages || [];
      useConversation.getState().setMessage(
        latestMessages.filter((msg) => msg._id !== tempId)
      );
      toast.error(error.response?.data?.message || "Failed to deliver message");
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
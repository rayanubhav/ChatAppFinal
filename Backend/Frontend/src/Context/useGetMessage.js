import { useEffect } from "react";
import apiClient from "../apiClient.js";
import useConversation from "../statemanage/useConversation.js";

function useGetMessage() {
  const { setMessage, setIsLoadingMessages, selectedConversation } = useConversation();

  useEffect(() => {
    let isMounted = true;

    const getMessages = async () => {
      if (!selectedConversation?._id) {
        setMessage([]);
        return;
      }

      setIsLoadingMessages(true);
      try {
        const res = await apiClient.get(`/message/get/${selectedConversation._id}`);
        if (isMounted) {
          setMessage(Array.isArray(res.data) ? res.data : []);
        }
      } catch (_) {
        if (isMounted) setMessage([]);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    };

    getMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedConversation?._id, setMessage, setIsLoadingMessages]);
}

export default useGetMessage;
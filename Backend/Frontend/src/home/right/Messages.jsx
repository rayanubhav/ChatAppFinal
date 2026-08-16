import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import useGetMessage from "../../Context/useGetMessage.js";
import Loading from "../../components/Loading.jsx";
import useGetSocketMessage from "../../Context/useGetSocketMessage.js";
// 1. Import the main 'useConversation' store hook
import useConversation from "../../statemanage/useConversation.js"; 

function Messages() {
  // 2. Call the hooks to "turn them on". They don't return state.
  useGetMessage();
  useGetSocketMessage();
  
  // 3. Select the state *directly* from the store
  const { messages, isLoadingMessages } = useConversation();

  const lastMsgRef = useRef();

  useEffect(() => {
    // This effect now only runs when 'messages' (from the store) changes
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }, [messages]);

  // This safeguard ensures we always have an array
  const validMessages = Array.isArray(messages) ? messages : [];

  // --- DEBUG ---
  console.log(`%cRENDER: Messages.jsx rendering. Loading: ${isLoadingMessages}, Message Count: ${validMessages.length}`, 'color: #777');

  return (
    <div
      className="flex-1 overflow-y-auto p-4"
    >
      {/* 4. Use the loading state from the store */}
      {isLoadingMessages ? (
        <Loading />
      ) : (
        validMessages.length > 0 &&
        validMessages.map((message) => (
          <div key={message._id} ref={lastMsgRef}>
            <Message message={message} />
          </div>
        ))
      )}

      {!isLoadingMessages && validMessages.length === 0 && (
        <div>
          <p className="text-center mt-[20%] text-gray-400">
            Say! Hi to start the conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
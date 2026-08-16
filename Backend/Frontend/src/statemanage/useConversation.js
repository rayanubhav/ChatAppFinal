import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessage: (messages) => set({ messages }),
  isLoadingMessages: false,
  setIsLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
}));

export default useConversation;
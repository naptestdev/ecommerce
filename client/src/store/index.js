import create from "zustand";

export const useStore = create((set) => ({
  currentUser: undefined,
  setCurrentUser: (payload) => set({ currentUser: payload }),
}));

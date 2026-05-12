import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const SESSION_STORAGE_KEY = "ecampus.user.selected-session";

interface SessionStoreState {
  sessionName: string;
  setSessionName: (name: string) => void;
}

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set) => ({
      sessionName: "",
      setSessionName: (name) => set({ sessionName: name }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({ sessionName: state.sessionName }),
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);

import create from "zustand";
import { persist } from "zustand/middleware";

export interface IAuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (val: boolean) => set({ isAuthenticated: val }),
    }),
    {
      name: "isAuthenticated",
    }
  )
);

export default useAuthStore;

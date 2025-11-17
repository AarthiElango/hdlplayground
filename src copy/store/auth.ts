import { create } from "zustand";

interface AuthStore {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  showGuestDialog:boolean;
  toggleGuestDialog:(show:boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (userData:any) => set({ user: userData }),
  logout: () => set({ user: null }),
  showGuestDialog:false,
  toggleGuestDialog: (show) => set({ showGuestDialog: show }),
}));

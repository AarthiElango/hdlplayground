import { create } from "zustand";

interface HeaderStore {
  lastAction: any | null;
  setLastAction: (action: any) => void;
  showMyProjects:boolean;
  toggleMyProjects:(show:boolean)=>void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  lastAction: null,
  setLastAction: (action: any) => set({ lastAction: action }),
   showMyProjects:false,
  toggleMyProjects:(show:boolean) => set({showMyProjects:show})
}));

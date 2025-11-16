import { create } from "zustand";

interface SidebarStore {

  showSidebar:boolean;
  toggleSidebar:() => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    showSidebar:true,
    toggleSidebar:()=>set((state:any)=>({showSidebar:!state.showSidebar}))
}));

import { create } from "zustand";

interface MainStore {
  project: any | null;
  setProject: (project: any) => void;
  template: any | null;
  setTemplate: (template: any) => void;
    tool: any | null;
  setTool: (tool: any) => void;
  showProjectDialog:boolean;
  toggleProjectDialog: (show:boolean) =>void;

}

export const useMainStore = create<MainStore>((set) => ({
  project: null,
  setProject: (project: any) => set({ project: project }),
  template: null,
  setTemplate: (template: string) => set({ template: template }),
  tool: null,
  setTool: (tool: string) => set({ tool: tool }),
  showProjectDialog:false,
  toggleProjectDialog:(show:boolean) => set({showProjectDialog:show}),
   
}));

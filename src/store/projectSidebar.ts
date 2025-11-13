import { create } from "zustand";

interface ProjectSidebarStore {
  renderUserProjects: boolean;
  getUserProjects: (render: boolean) => void;
  showProjectSidebar: boolean;
  toggleProjectSidebar: () => void;
}

export const useProjectSidebarStore = create<ProjectSidebarStore>((set) => ({
  renderUserProjects: false,
  getUserProjects: (render) => set({ renderUserProjects: render }),
  showProjectSidebar: true,
  toggleProjectSidebar: () =>
    set((state) => ({ showProjectSidebar: !state.showProjectSidebar })),
}));

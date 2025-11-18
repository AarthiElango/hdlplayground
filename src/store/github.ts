import { create } from "zustand";

interface GithubStore {

  showGithubDialog:boolean;
  toggleGithubDialog:(show:boolean) => void;
}

export const useGithubStore = create<GithubStore>((set) => ({

  showGithubDialog:false,
  toggleGithubDialog: (show) => set({ showGithubDialog: show }),
}));

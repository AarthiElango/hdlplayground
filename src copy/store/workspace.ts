import { create } from "zustand";

interface WorkspaceStore {
  files: Record<string, any[]>;
  setFileContents: (
    category: string,   // "design" / "testbench"
    filename: string,
    contents: string
  ) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  files: {
    design: [],
    testbench: [],
  },

  setFileContents: (category, filename, contents) =>
    set((state) => {
      const existing = state.files[category] || [];
      // Check if file already exists
      const updated = existing.some((f) => f.name === filename)
        ? existing.map((f) =>
            f.name === filename ? { ...f, contents } : f
          )
        : [
            ...existing,
            {
              name: filename,
              contents,
            },
          ];

      return {
        files: {
          ...state.files,
          [category]: updated,
        },
      };
    }),
}));

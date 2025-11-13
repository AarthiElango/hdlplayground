import { create } from "zustand";

interface WorkspaceStore {

  runResult: any | null;
  setRunResult: (result: any) => void;

  codeEditorValues: any | null;
  setCodeEditorValues: (values: any) => void;

  project: any | null;
  setProject: (projectData: any) => void;

  showProjectDialog: boolean;
  toggleProjectDialog: (show: boolean) => void;

  isSourceCodeEdited: boolean;
  sourceCodeEdited: (edited: boolean) => void;

  isTestbenchCodeEdited: boolean;
  testbenchCodeEdited: (edited: boolean) => void;

  workspaceAction: any | null;
  setWorkspaceAction: (action: any) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  runResult: null,
  setRunResult: (result: any) => set({ runResult: result }),

  codeEditorValues: null,
  setCodeEditorValues: (values: any) => set({ codeEditorValues: values }),

  project: null,
  setProject: (projectData) => set({ project: projectData }),

  showProjectDialog: false,
  toggleProjectDialog: (show) => set({ showProjectDialog: show }),

  isSourceCodeEdited: false,
  sourceCodeEdited: (edited) => set({ isSourceCodeEdited: edited }),

  isTestbenchCodeEdited: false,
  testbenchCodeEdited: (edited) => set({ isTestbenchCodeEdited: edited }),

  workspaceAction: null,
  setWorkspaceAction: (action: any) => set({ workspaceAction: action }),



}));

import { create } from "zustand";

interface OutputStore {
  uuid: any | null;
  setUuid: (uuid: any) => void;
  runYosys: boolean;
  setRunYosys: (runYosys: boolean) => void;
}

export const useOutputStore = create<OutputStore>((set) => ({
  uuid: null,
  setUuid: (uuid: any) => set({ uuid: uuid }),
  runYosys:false,
  setRunYosys: (runYosys: boolean) => set({ runYosys: runYosys})
}));

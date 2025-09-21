import { create } from "zustand";
import GameStore from "@/store/GameStore";

const useGameStore = create<GameStore>((set) => ({
  paused: false,
  setPaused: (value) => set({ paused: value }),

  totalScore: 0,
  correctScore: 0,

  incTotalScore: () =>
    set((state) => ({ totalScore: state.totalScore + 1 })),

  incCorrectScore: () =>
    set((state) => ({ correctScore: state.correctScore + 1 })),

  resetScore: () => set({ totalScore: 0, correctScore: 0 }),
}));

export default useGameStore;

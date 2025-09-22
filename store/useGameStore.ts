import {create} from "zustand";
import GameStore from "@/store/GameStore";
import GameSettings from "@/components/GameSettings";
import GameMode from "@/components/GameMode";

const useGameStore = create<GameStore>((set) => ({
  paused: false,
  setPaused: (value) => set({ paused: value }),

  settings: new GameSettings(15, GameMode.LIMITED, 10),
  setSettings: (value) => set({ settings: value }),

  totalScore: 0,
  correctScore: 0,

  incTotalScore: () =>
    set((state) => ({ totalScore: state.totalScore + 1 })),

  incCorrectScore: () =>
    set((state) => ({ correctScore: state.correctScore + 1 })),

  reset: () =>
    set({
      paused: false,
      bpm: 30,
      totalScore: 0,
      correctScore: 0,
    }),
}));

export default useGameStore;

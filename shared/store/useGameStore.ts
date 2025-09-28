import {create} from "zustand";
import GameStore from "@/shared/store/GameStore";
import GameSettings from "@/shared/GameSettings";
import GameMode from "@/shared/GameMode";

const useGameStore = create<GameStore>((set) => ({
  paused: false,
  setPaused: (value) => set({ paused: value }),

  settings: new GameSettings(30, GameMode.LIMITED, 3,10),
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
      settings: {
        bpm: 30,
        mode: GameMode.LIMITED,
        melodyLength: 3,
        maxHp: 10
      },
      totalScore: 0,
      correctScore: 0,
    }),
}));

export default useGameStore;

import { create } from "zustand";
import GameStore from "@/store/GameStore";

const useGameStore = create<GameStore>((set) => ({
  paused: false,
  setPaused: (value) => set({ paused: value }),
}));

export default useGameStore;

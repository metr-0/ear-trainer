import GameSettings from "@/components/GameSettings";

export default interface GameStore {
  paused: boolean;
  setPaused: (value: boolean) => void;

  settings: GameSettings;
  setSettings: (value: GameSettings) => void;

  totalScore: number;
  correctScore: number;

  incTotalScore: () => void;
  incCorrectScore: () => void;

  reset: () => void;
}

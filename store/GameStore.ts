export default interface GameStore {
  paused: boolean;
  setPaused: (value: boolean) => void;

  totalScore: number;
  correctScore: number;

  incTotalScore: () => void;
  incCorrectScore: () => void;

  resetScore: () => void;
}

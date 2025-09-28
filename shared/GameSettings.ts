import GameMode from "@/shared/GameMode";

export default class GameSettings {
  bpm: number;
  mode: GameMode;
  melodyLength: number;
  maxHp: number;

  constructor(bpm: number, mode: GameMode, melodyLength: number, maxHp: number) {
    this.bpm = bpm;
    this.mode = mode;
    this.melodyLength = melodyLength;
    this.maxHp = maxHp;
  }
}

import GameMode from "@/shared/GameMode";

export default class GameSettings {
  bpm: number;
  mode: GameMode;
  maxHp: number;

  constructor(bpm: number, mode: GameMode, maxHp: number) {
    this.bpm = bpm;
    this.mode = mode;
    this.maxHp = maxHp;
  }
}

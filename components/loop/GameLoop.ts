import GamePhase from "@/components/loop/GamePhase";
import GameState from "@/components/GameState";
import GamePhaseListener from "@/components/loop/GamePhaseListener";
import GameType from "@/components/GameType";

export default class GameLoop {
  private readonly gameType: GameType;
  private readonly gameState: GameState;
  private readonly bpm: number;

  private readonly phaseDuration: number;
  private currentPhaseTime: number = 0;

  private running: boolean = false;
  private frameId: number | null = null;
  private lastTime: number = 0;

  private listeners: GamePhaseListener[] = [];

  constructor(gameType: GameType, state: GameState, bpm: number) {
    this.gameType = gameType;
    this.gameState = state;
    this.bpm = bpm;

    this.phaseDuration = 60 / this.bpm;
    this.gameState.phase = GamePhase.PREP;
  }

  public onPhaseChange(listener: GamePhaseListener) {
    this.listeners.push(listener);
    return () => this.listeners = this.listeners.filter(l => l !== listener);
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.setPhase(GamePhase.PREP);

    this.lastTime = performance.now();
    this.loop();
  }

  public stop() {
    this.running = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private loop = () => {
    if (!this.running) return;

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(delta);

    this.frameId = requestAnimationFrame(this.loop);
  };

  private update(delta: number) {
    this.currentPhaseTime += delta;

    switch (this.gameState.phase) {
      case GamePhase.PREP:
        if (this.currentPhaseTime >= this.phaseDuration) {
          if (this.gameType === GameType.REPEAT_MELODY) this.setPhase(GamePhase.OUTPUT);
          else this.setPhase(GamePhase.INPUT);
        }
        break;

      case GamePhase.INPUT:
        if (this.gameType === GameType.REPEAT_MELODY) break;

        if (this.currentPhaseTime >= this.phaseDuration / 2) {
          this.setPhase(GamePhase.CHECK);
        }
        break;

      case GamePhase.OUTPUT:
        break;

      case GamePhase.CHECK:
        if (this.currentPhaseTime >= this.phaseDuration / 2) {
          if (this.gameType === GameType.REPEAT_MELODY) this.setPhase(GamePhase.OUTPUT);
          else this.setPhase(GamePhase.INPUT);
        }
        break;
    }
  }

  private setPhase(phase: GamePhase) {
    this.gameState.phase = phase;
    this.currentPhaseTime = 0;
    this.emitPhase();
  }

  public forceNextPhase() {
    switch (this.gameState.phase) {
      case GamePhase.OUTPUT:
        this.setPhase(GamePhase.INPUT);
        break;
      case GamePhase.INPUT:
        this.setPhase(GamePhase.CHECK);
        break;
    }
  }

  private emitPhase() {
    this.listeners.forEach((listener) => listener(this.gameState.phase));
  }
}

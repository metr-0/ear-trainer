import GamePhase from "@/components/loop/GamePhase";
import GameState from "@/components/GameState";
import GameSettings from "@/components/GameSettings";
import GamePhaseListener from "@/components/loop/GamePhaseListener";

export default class GameLoop {
  private readonly gameState: GameState;
  private readonly settings: GameSettings;

  private readonly phaseDuration: number;
  private currentPhaseTime: number = 0;

  private running: boolean = false;
  private frameId: number | null = null;
  private lastTime: number = 0;

  private readonly listeners: GamePhaseListener[] = [];

  constructor(state: GameState, settings: GameSettings) {
    this.gameState = state;
    this.settings = settings;

    this.phaseDuration = 60 / this.settings.bpm;
    this.gameState.phase = GamePhase.PREP;
  }

  public onPhaseChange(listener: GamePhaseListener) {
    this.listeners.push(listener);
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
          this.setPhase(GamePhase.INPUT);
        }
        break;

      case GamePhase.INPUT:
        if (this.currentPhaseTime >= this.phaseDuration / 2) {
          this.setPhase(GamePhase.CHECK);
        }
        break;

      case GamePhase.CHECK:
        if (this.currentPhaseTime >= this.phaseDuration / 2) {
          this.setPhase(GamePhase.INPUT);
        }
        break;
    }
  }

  private setPhase(phase: GamePhase) {
    this.gameState.phase = phase;
    this.currentPhaseTime = 0;
    this.emitPhase();
  }

  private emitPhase() {
    this.listeners.forEach((listener) => listener(this.gameState.phase));
  }
}

import { GameEngineUpdateEventOptionType } from "react-native-game-engine";

type PhaseListener = (phase: GamePhase) => void;

export class GameLoopSystem {
  private readonly gameState: GameState;
  private readonly settings: GameSettings;

  private readonly phaseDuration: number;

  private running: boolean = false;
  private elapsed: number = 0;
  private currentPhaseTime: number = 0;

  private readonly listeners: PhaseListener[] = [];

  constructor(state: GameState, settings: GameSettings) {
    this.gameState = state;
    this.settings = settings;

    this.phaseDuration = 60 / this.settings.bpm;
    this.gameState.phase = GamePhase.PREP;
  }

  public onPhaseChange(listener: PhaseListener) {
    this.listeners.push(listener);
  }

  public start() {
    this.running = true;
    this.elapsed = 0;
    this.setPhase(GamePhase.PREP);
  }

  public stop() {
    this.running = false;
  }

  public system = (entities: any, { time }: GameEngineUpdateEventOptionType) => {
    if (!this.running) return entities;

    const delta = time.delta / 1000;
    this.elapsed += delta;
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

    return entities;
  };

  private setPhase(phase: GamePhase) {
    this.gameState.phase = phase;
    this.currentPhaseTime = 0;
    this.emitPhase();
  }

  private emitPhase() {
    this.listeners.forEach((listener) => listener(this.gameState.phase));
  }
}

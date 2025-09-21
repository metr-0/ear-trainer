import GamePhase from "@/components/games/base/loop/GamePhase";

export default class GameState {
  phase: GamePhase = GamePhase.PREP;

  totalScore: number = 0;
  correctScore: number = 0;
}

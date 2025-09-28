import HLGameScreen from "@/features/higherLowerGame/HLGameScreen";
import {useLocalSearchParams} from "expo-router";
import useGameStore from "@/shared/store/useGameStore";
import {useEffect} from "react";
import GameSettings from "@/shared/GameSettings";
import GameMode from "@/shared/GameMode";
import RMGameScreen from "@/features/repeatMelodyGame/RMGameScreen";

const GameScreen = () => {
  const { bpm, game, mode, melodyLength } = useLocalSearchParams<{
    bpm?: string;
    game?: string;
    mode?: string;
    melodyLength?: string;
  }>();

  const reset = useGameStore(state => state.reset);
  const setSettings = useGameStore(state => state.setSettings);

  useEffect(() => {
    reset();
    setSettings(new GameSettings(
      bpm ? Number(bpm) : 30,
      mode ? Number(mode) as GameMode : GameMode.LIMITED,
      melodyLength ? Number(melodyLength) : 3,
      10
    ));
  }, [bpm, mode, melodyLength]);

  if (game === "Repeat-Melody") return <RMGameScreen />;
  return <HLGameScreen />;
}

export default GameScreen;

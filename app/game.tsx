import HLGameScreen from "@/components/higherLowerGame/HLGameScreen";
import {useLocalSearchParams} from "expo-router";
import useGameStore from "@/store/useGameStore";
import {useEffect} from "react";
import GameSettings from "@/components/GameSettings";
import GameMode from "@/components/GameMode";
import RMGameScreen from "@/components/repeatMelodyGame/RMGameScreen";

const GameScreen = () => {
  const {bpm, game} = useLocalSearchParams<{ bpm?: string, game?: string }>();
  const reset = useGameStore(state => state.reset);
  const setSettings = useGameStore(state => state.setSettings);

  useEffect(() => {
    reset();
    if (bpm) setSettings(new GameSettings(Number(bpm), GameMode.LIMITED, 10));
  }, [bpm]);

  if (game === "Repeat-Melody") return <RMGameScreen />;
  return <HLGameScreen />;
}

export default GameScreen;

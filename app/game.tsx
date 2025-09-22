import HLGameScreen from "@/components/higherLowerGame/HLGameScreen";
import {useLocalSearchParams} from "expo-router";
import useGameStore from "@/store/useGameStore";
import {useEffect} from "react";
import GameSettings from "@/components/GameSettings";
import GameMode from "@/components/GameMode";

const GameScreen = () => {
  const {bpm} = useLocalSearchParams<{ bpm?: string }>();
  const reset = useGameStore(state => state.reset);
  const setSettings = useGameStore(state => state.setSettings);

  useEffect(() => {
    reset();
    if (bpm) setSettings(new GameSettings(Number(bpm), GameMode.LIMITED, 10));
  }, [bpm]);

  return <HLGameScreen />;
}

export default GameScreen;

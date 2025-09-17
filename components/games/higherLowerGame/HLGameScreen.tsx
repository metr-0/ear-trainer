import React, {useEffect, useRef} from "react";
import {GameEngine} from "react-native-game-engine";
import BackgroundSystem from "@/components/games/base/GameBackgroundSystem";
import {HLGameBackground} from "@/components/games/higherLowerGame/HLGameBackground";
import GameLoopSystem from "@/components/games/base/GameLoopSystem";
import GameMode from "@/components/games/base/GameMode";
import HLGameSettings from "@/components/games/higherLowerGame/HLGameSettings";
import HLGameState from "@/components/games/higherLowerGame/HLGameState";
import {Animated, View} from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import CountdownBar from "@/components/games/base/CountdownBar";
import CountdownSystem from "@/components/games/base/CountdownSystem";
import GamePhase from "@/components/games/base/GamePhase";

export default function HLGameScreen() {
  const bpm = 60;

  const state = useRef(new HLGameState()).current;
  const settings = useRef(new HLGameSettings(bpm, GameMode.INFINITE, 0)).current;
  const scales = useHLGameScales();

  const bgAnim = useRef(new Animated.Value(0)).current;
  const bgSystem = useRef(new BackgroundSystem(settings.bpm, bgAnim, scales.lane.width)).current;

  const countdownAnim = useRef(new Animated.Value(0)).current;
  const countdownSystem = useRef(new CountdownSystem(60 / 2 / bpm * 1000, countdownAnim)).current;

  const loopSystem = useRef(new GameLoopSystem(state, settings)).current;

  useEffect(() => {
    loopSystem.onPhaseChange(phase => {
      if (phase === GamePhase.INPUT) countdownSystem.start();
    })
  })

  return (
    <GameEngine
      systems={[
        bgSystem.system,
        loopSystem.system,
        countdownSystem.system
      ]}
      entities={{}}
      style={{ flex: 1 }}
    >
      <HLGameBackground
        anim={bgAnim}
        laneImages={[
          require("../../../assets/images/lanes/silk/silk1.png"),
          require("../../../assets/images/lanes/silk/silk2.png"),
          require("../../../assets/images/lanes/silk/silk3.png"),
        ]}
      />
      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: (scales.screen.height - 3 * scales.lane.height - 2 * scales.lane.dividerHeight) / 2
          - scales.countdownBar.height - 2 * scales.lane.dividerHeight
      }}>
        <CountdownBar anim={countdownAnim} onCountdownEvent={countdownSystem.onEvent} />
      </View>
    </GameEngine>
  );
}

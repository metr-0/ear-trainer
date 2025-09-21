import React, {useEffect, useRef} from "react";
import {HLGameBackground} from "@/components/games/higherLowerGame/HLGameBackground";
import GameMode from "@/components/games/base/GameMode";
import HLGameSettings from "@/components/games/higherLowerGame/HLGameSettings";
import HLGameState from "@/components/games/higherLowerGame/HLGameState";
import {Image, Pressable, View} from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import ProgressBar from "@/components/games/base/progressBar/ProgressBar";
import GameLoop from "@/components/games/base/loop/GameLoop";
import usePlayerController from "@/components/games/base/player/usePlayerController";
import InputHandler from "@/components/games/base/input/InputHandler";
import InputEvent from "@/components/games/base/input/InputEvent";
import GamePhase from "@/components/games/base/loop/GamePhase";
import useIndicatorController from "@/components/games/base/indicator/useIndicatorController";
import PlayerColor from "@/components/games/base/player/PlayerColor";
import {useRouter} from "expo-router";
import useGameStore from "@/store/useGameStore";
import {defaultColors} from "@/constants/Colors";
import useCountdownController from "@/components/games/base/countdown/useCountdownController";

export default function HLGameScreen() {
  const bpm = 30;
  const router = useRouter();

  const state = useRef(new HLGameState()).current;
  const settings = useRef(new HLGameSettings(bpm, GameMode.INFINITE, 0)).current;
  const scales = useHLGameScales();

  const loop = useRef(new GameLoop(state, settings)).current;

  const player = usePlayerController(scales);
  const indicator = useIndicatorController(scales);
  const countdown = useCountdownController(scales);

  const inputHandler = useRef(new InputHandler()).current;

  const { paused, setPaused } = useGameStore();

  useEffect(() => {
    inputHandler.onInput((event) => {
      if (state.phase !== GamePhase.INPUT) return;

      switch (event) {
        case InputEvent.MOVE_UP:
          player.moveUp();
          break;
        case InputEvent.MOVE_DOWN:
          player.moveDown();
          break;
      }
    });

    return () => inputHandler.cleanup();
  }, [inputHandler]);

  useEffect(() => {
    loop.onPhaseChange(phase => {
      if (phase === GamePhase.INPUT) {
        indicator.hide();
        player.setColor(PlayerColor.NEUTRAL);
      } else if (phase === GamePhase.CHECK) {
        const answer = player.getLane();
        player.moveTo(0);

        const correct = answer !== 0;
        indicator.show(correct);
        player.setColor(correct ? PlayerColor.CORRECT : PlayerColor.MISTAKE);
      } else if (phase === GamePhase.PREP) {
        countdown.startCountdown(60 / bpm * 1000, 3);
      }
    });
  }, [loop]);

  useEffect(() => {
    if (!paused) {
      loop.start();
    } else {
      loop.stop();
    }
    return () => loop.stop();
  }, [paused]);

  return (
    <View
      style={{ flex: 1, userSelect: 'none' }}
      {...inputHandler.getResponder()}
    >
      <HLGameBackground
        bpm={bpm}
        laneImages={[
          require("../../../assets/images/lanes/silk/silk1.png"),
          require("../../../assets/images/lanes/silk/silk2.png"),
          require("../../../assets/images/lanes/silk/silk3.png"),
        ]}
      />

      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height * .04,
          right: scales.screen.height * .04,
        }}
        onPress={() => {
          setPaused(true);
          router.push("/pause");
        }}
      >
        <Image
          source={require("../../../assets/images/icons/stop.png")}
          style={{ width: scales.screen.height * .08, height: scales.screen.height * .08 }}
          resizeMode="contain"
          tintColor={defaultColors.neutral}
        />
      </Pressable>

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: (scales.screen.height - 3 * scales.lane.height - 2 * scales.lane.dividerHeight) / 2
          - scales.countdownBar.height - 2 * scales.lane.dividerHeight
      }}>
        <ProgressBar scales={scales} duration={60 / 2 / bpm * 1000} loop={loop} />
      </View>

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: (scales.screen.height - 3 * scales.lane.height - 2 * scales.lane.dividerHeight) / 2
          - scales.countdownBar.height - 2 * scales.lane.dividerHeight
      }}>
        <countdown.View />
      </View>

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: (scales.screen.height - 3 * scales.lane.height - 2 * scales.lane.dividerHeight) / 2
          - scales.countdownBar.height - 2 * scales.lane.dividerHeight
      }}>
        <indicator.View />
      </View>

      <View style={{
        position: "absolute", top: scales.screen.height / 2, bottom: scales.screen.height / 2,
        left: scales.screen.width / 2, right: scales.screen.width / 2,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <player.View />
      </View>
    </View>
  );
}

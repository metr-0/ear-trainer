import React, {useEffect, useRef} from "react";
import {Image, Pressable, View} from "react-native";
import {useRouter} from "expo-router";

import HLGameBackground from "@/components/higherLowerGame/HLGameBackground";
import GameMode from "@/components/GameMode";
import HLGameSettings from "@/components/higherLowerGame/HLGameSettings";
import HLGameState from "@/components/higherLowerGame/HLGameState";
import useScales from "@/components/useScales";
import GameLoop from "@/components/loop/GameLoop";
import usePlayer from "@/components/player/usePlayer";
import InputHandler from "@/components/input/InputHandler";
import InputEvent from "@/components/input/InputEvent";
import GamePhase from "@/components/loop/GamePhase";
import useIndicator from "@/components/indicator/useIndicator";
import PlayerColor from "@/components/player/PlayerColor";
import useGameStore from "@/store/useGameStore";
import colors from "@/constants/Colors";
import useCountdown from "@/components/countdown/useCountdown";
import Score from "@/components/score/Score";
import useObstacles from "@/components/obstacle/useObstacles";
import useProgressBar from "@/components/progressBar/useProgressBar";

export default function HLGameScreen() {
  const bpm = 30;
  const router = useRouter();

  const state = useRef(new HLGameState()).current;
  const settings = useRef(new HLGameSettings(bpm, GameMode.INFINITE, 0)).current;
  const scales = useScales();

  const loop = useRef(new GameLoop(state, settings)).current;

  const player = usePlayer(scales);
  const indicator = useIndicator();
  const countdown = useCountdown();
  const obstacles = useObstacles();
  const progressBar = useProgressBar();

  const inputHandler = useRef(new InputHandler()).current;

  const paused = useGameStore(state => state.paused);
  const setPaused = useGameStore(state => state.setPaused);

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
        progressBar.show(60 / 2 / bpm * 1000);
        indicator.hide();
        player.setColor(PlayerColor.NEUTRAL);
      } else if (phase === GamePhase.CHECK) {
        const answer = player.getLane();

        const correctLane = Math.floor(Math.random() * 3) - 1;
        const correct = answer === correctLane;

        const gameStore = useGameStore.getState();
        gameStore.incTotalScore();
        if (correct) gameStore.incCorrectScore();

        obstacles.show(correctLane);
        player.moveTo(correctLane);
        setTimeout(() => player.moveTo(0), 60 / bpm / 4 * 1000);

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
      />

      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height * .04,
          right: scales.screen.height * .04,
          zIndex: 3
        }}
        onPress={() => {
          setPaused(true);
          router.push("/pause");
        }}
      >
        <Image
          source={require("../../assets/images/icons/stop.png")}
          style={{ width: scales.screen.height * .08, height: scales.screen.height * .08 }}
          resizeMode="contain"
          tintColor={colors.white}
        />
      </Pressable>

      <Score maxHp={10} />

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: scales.screen.height * .04,
        zIndex: 1
      }}>
        <progressBar.View />
      </View>

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: scales.screen.height * .04,
        zIndex: 1
      }}>
        <countdown.View />
      </View>

      <View style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: scales.screen.height * .12,
        zIndex: 1
      }}>
        <indicator.View />
      </View>

      <View style={{
        position: "absolute", top: scales.screen.height / 2, bottom: scales.screen.height / 2,
        left: scales.screen.width / 2, right: scales.screen.width / 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1
      }}>
        <player.View />
      </View>

      <View style={{
        position: "absolute",
        top: scales.screen.height / 2,
        left: scales.screen.width / 2,
      }}>
        <obstacles.View />
      </View>
    </View>
  );
}

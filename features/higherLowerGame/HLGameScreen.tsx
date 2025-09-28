import React, {useEffect, useRef} from "react";
import {Image, Pressable, View} from "react-native";
import {useRouter} from "expo-router";

import LanesBackground from "@/features/lanesBackground/LanesBackground";
import useScales from "@/features/scales/useScales";
import GameLoop from "@/features/loop/GameLoop";
import usePlayer from "@/features/player/usePlayer";
import InputHandler from "@/features/input/InputHandler";
import InputEvent from "@/features/input/InputEvent";
import GamePhase from "@/features/loop/GamePhase";
import useIndicator from "@/features/indicator/useIndicator";
import PlayerColor from "@/features/player/PlayerColor";
import useGameStore from "@/shared/store/useGameStore";
import colors from "@/shared/constants/Colors";
import useCountdown from "@/features/countdown/useCountdown";
import Score from "@/features/score/Score";
import useObstacles from "@/features/obstacle/useObstacles";
import useProgressBar from "@/features/progressBar/useProgressBar";
import useMelodyGenerator from "@/features/melodyGenerator/useMelodyGenerator";
import useSynth from "@/features/synth/useSynth";
import GameType from "@/shared/GameType";
import GameState from "@/shared/GameState";

export default function HLGameScreen() {
  const {ready, getLast2Notes, generateNext, reset} = useMelodyGenerator(
    "https://metr-0.github.io/melody-gen/model/model.json"
  );
  const {playNote} = useSynth();

  const settings = useGameStore(state => state.settings);
  const router = useRouter();

  const state = useRef(new GameState()).current;
  const scales = useScales();

  const loopRef = useRef<null | GameLoop>(null);

  const player = usePlayer();
  const indicator = useIndicator();
  const countdown = useCountdown();
  const obstacles = useObstacles();
  const progressBar = useProgressBar();

  const inputHandler = useRef(new InputHandler()).current;

  const paused = useGameStore(state => state.paused);
  const setPaused = useGameStore(state => state.setPaused);

  useEffect(() => {
    loopRef.current?.stop();
    loopRef.current = new GameLoop(GameType.HIGHER_LOWER, state, settings.bpm);
    if (!paused && ready) loopRef.current?.start();
  }, [settings]);

  useEffect(() => {
    const unsubscribe = inputHandler.onInput((event) => {
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

    return () => {
      unsubscribe();
      inputHandler.cleanup();
    }
  }, [inputHandler]);

  useEffect(() => {
    const unsubscribe = loopRef.current?.onPhaseChange(phase => {
      if (phase === GamePhase.INPUT) {
        const nextNote = generateNext();
        if (nextNote !== null) playNote(nextNote);

        progressBar.show(60 / 2 / settings.bpm * 1000);
        indicator.hide();
        player.setColor(PlayerColor.NEUTRAL);
      } else if (phase === GamePhase.CHECK) {
        const [n1, n2] = getLast2Notes();
        const answer = player.getLane();

        const correctLane = (n1 === n2) ? 0 : ((n1 > n2) ? 1 : -1);
        const correct = answer === correctLane;

        const gameStore = useGameStore.getState();
        gameStore.incTotalScore();
        if (correct) gameStore.incCorrectScore();

        obstacles.show(correctLane);
        player.moveTo(correctLane);
        setTimeout(() => player.moveTo(0), 60 / settings.bpm / 4 * 1000);

        indicator.show(correct);
        player.setColor(correct ? PlayerColor.CORRECT : PlayerColor.MISTAKE);
      } else if (phase === GamePhase.PREP) {
        const note = Math.round(Math.random() * 30) + 40;
        reset([note]);
        playNote(note);

        countdown.startCountdown(60 / settings.bpm * 1000, 3);
      }
    });

    return () => {unsubscribe?.();}
  }, [loopRef.current, reset, generateNext]);

  useEffect(() => {
    if (!paused && ready) {
      loopRef.current?.start();
    } else {
      loopRef.current?.stop();
    }
    return () => loopRef.current?.stop();
  }, [paused, ready]);

  return (
    <View
      style={{ flex: 1, userSelect: 'none' }}
      {...inputHandler.getResponder()}
    >
      <LanesBackground
        bpm={settings.bpm}
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

      <Score settings={settings} />

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

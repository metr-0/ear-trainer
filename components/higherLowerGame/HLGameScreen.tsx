import React, {useEffect, useRef} from "react";
import {Image, Pressable, View} from "react-native";
import {useRouter} from "expo-router";

import HLGameBackground from "@/components/higherLowerGame/HLGameBackground";
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
import useMelodyGenerator from "@/components/useMelodyGenerator";
import useSynth from "@/components/useSynth";

export default function HLGameScreen() {
  const {ready, getLast2Notes, generateNext, reset} = useMelodyGenerator(
    "https://metr-0.github.io/melody-gen/model/model.json"
  );
  const {playNote} = useSynth();

  const settings = useGameStore(state => state.settings);
  const router = useRouter();

  const state = useRef(new HLGameState()).current;
  const scales = useScales();

  const loopRef = useRef<null | GameLoop>(null);

  const player = usePlayer(scales);
  const indicator = useIndicator();
  const countdown = useCountdown();
  const obstacles = useObstacles();
  const progressBar = useProgressBar();

  const inputHandler = useRef(new InputHandler()).current;

  const paused = useGameStore(state => state.paused);
  const setPaused = useGameStore(state => state.setPaused);

  useEffect(() => {
    loopRef.current?.stop();
    loopRef.current = new GameLoop(state, settings.bpm);
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
      <HLGameBackground
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

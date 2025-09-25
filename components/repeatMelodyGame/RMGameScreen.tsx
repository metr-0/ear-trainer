import React, {useEffect, useRef, useState} from "react";
import {Image, Pressable, View} from "react-native";
import {useRouter} from "expo-router";
import HLGameState from "@/components/higherLowerGame/HLGameState";
import useScales from "@/components/useScales";
import GameLoop from "@/components/loop/GameLoop";
import GamePhase from "@/components/loop/GamePhase";
import useIndicator from "@/components/indicator/useIndicator";
import useGameStore from "@/store/useGameStore";
import colors from "@/constants/Colors";
import useCountdown from "@/components/countdown/useCountdown";
import Score from "@/components/score/Score";
import useMelodyGenerator from "@/components/useMelodyGenerator";
import useSynth from "@/components/useSynth";
import GameType from "@/components/GameType";
import useCounter from "@/components/counter/useCounter";
import usePiano from "@/components/piano/usePiano";

export default function RMGameScreen() {
  const maxCount = 3;

  const {ready, getLast2Notes, generateNext, reset} = useMelodyGenerator(
    "https://metr-0.github.io/melody-gen/model/model.json"
  );
  const {playNote} = useSynth();

  const settings = useGameStore(state => state.settings);
  const router = useRouter();

  const state = useRef(new HLGameState()).current;
  const scales = useScales();

  const loopRef = useRef<null | GameLoop>(null);

  const indicator = useIndicator();
  const countdown = useCountdown();
  const counter = useCounter(maxCount);

  const paused = useGameStore(state => state.paused);
  const setPaused = useGameStore(state => state.setPaused);

  const correctAnswerRef = useRef<number[]>([]);
  const userAnswerRef = useRef<number[]>([]);

  const handleNote = (midi: number) => {
    if (state.phase !== GamePhase.INPUT) return;

    counter.inc();
    playNote(midi);
    userAnswerRef.current.push(midi);

    if (userAnswerRef.current.length === maxCount)
      loopRef.current?.forceNextPhase();
  }

  const piano = usePiano(handleNote);

  useEffect(() => {
    loopRef.current?.stop();
    loopRef.current = new GameLoop(GameType.REPEAT_MELODY, state, settings.bpm);
    if (!paused && ready) loopRef.current?.start();
  }, [settings]);

  useEffect(() => {
    const unsubscribe = loopRef.current?.onPhaseChange(phase => {
      if (phase === GamePhase.OUTPUT) {
        indicator.hide();
        counter.reset();
        counter.show();

        correctAnswerRef.current = [generateNext() as any];

        const end = Math.floor(Math.random() * 12) + correctAnswerRef.current[0];
        const range: [number, number] = [end - 11, end];

        piano.set(range[0], correctAnswerRef.current[0]);

        for (let i = 1; i < maxCount; ++i)
          correctAnswerRef.current.push(generateNext(range) as any);

        const interval = (60_000 / settings.bpm);
        correctAnswerRef.current.forEach((note, idx) => {
          setTimeout(() => {
            playNote(note);
            counter.inc();
          }, interval * (idx + 1));
        });

        setTimeout(() => {
          loopRef.current?.forceNextPhase();
        }, interval * (correctAnswerRef.current.length + 1));

        console.log(correctAnswerRef.current);
      } else if (phase === GamePhase.INPUT) {
        userAnswerRef.current = [];
        counter.reset();
      } else if (phase === GamePhase.CHECK) {
        counter.hide();

        const correct = correctAnswerRef.current.every((v, i) => v === userAnswerRef.current[i]);

        const gameStore = useGameStore.getState();
        gameStore.incTotalScore();
        if (correct) gameStore.incCorrectScore();

        indicator.show(correct);
      } else if (phase === GamePhase.PREP) {
        const note = Math.round(Math.random() * 30) + 40;
        reset([note]);

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
      style={{
        flex: 1,
        userSelect: 'none',
        backgroundColor: colors.black
      }}
    >
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
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "absolute", width: scales.screen.width,
        bottom: scales.screen.height * .12,
        zIndex: 1
      }}>
        <counter.View />
      </View>

      <View style={{
        flex: 1,
        justifyContent: "center", alignItems: "center",
      }}>
        <piano.View />
      </View>
    </View>
  );
}

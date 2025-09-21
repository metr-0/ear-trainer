import React, {useEffect, useRef} from "react";
import { Animated, View } from "react-native";
import ProgressBarEvent from "@/components/games/base/progressBar/ProgressBarEvent";
import ProgressBarTimer from "@/components/games/base/progressBar/ProgressBarTimer";
import GamePhase from "@/components/games/base/loop/GamePhase";
import GameLoop from "@/components/games/base/loop/GameLoop";

const ProgressBar = ({ duration, scales, loop }: {
  duration: number,
  scales: any,
  loop: GameLoop
}) => {

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(scales.screen.height * .3)).current;

  const timer = useRef(new ProgressBarTimer(duration, progressAnim)).current;

  useEffect(() => {
    loop.onPhaseChange(phase => {
      if (phase === GamePhase.INPUT) timer.start();
    });
  }, [loop, timer]);

  useEffect(() => {
    timer.onEvent(event => {
      switch (event) {
        case ProgressBarEvent.STARTED:
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
          break;
        case ProgressBarEvent.COMPLETED:
          Animated.timing(slideAnim, {
            toValue: scales.screen.height * .3,
            duration: 100,
            useNativeDriver: true,
          }).start();
          break;
      }
    });
  }, [timer, scales.screen.height])

  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -scales.countdownBar.width],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }] as any,
      }}
    >
      <View
        style={{
          height: scales.countdownBar.height,
          width: scales.countdownBar.width,
          backgroundColor: "#262626",
          borderWidth: scales.countdownBar.height * 0.1,
          borderColor: "#e6e6e6",
          borderStyle: "solid",
          borderRadius: scales.countdownBar.height * 0.3,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#e6e6e6",
            transform: [{ translateX }] as any,
          }}
        />
      </View>
    </Animated.View>
  );
};

export default ProgressBar;

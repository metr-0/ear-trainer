import React, {useEffect, useRef} from "react";
import { Animated, View } from "react-native";
import CountdownEvent from "@/components/games/base/countdown/CountdownEvent";
import CountdownTimer from "@/components/games/base/countdown/CountdownTimer";
import GamePhase from "@/components/games/base/GamePhase";
import GameLoop from "@/components/games/base/GameLoop";

const CountdownBar = ({ duration, scales, loop }: {
  duration: number,
  scales: any,
  loop: GameLoop
}) => {

  const countdownAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(scales.screen.height * .3)).current;

  const timer = useRef(new CountdownTimer(duration, countdownAnim)).current;

  useEffect(() => {
    loop.onPhaseChange(phase => {
      if (phase === GamePhase.INPUT) timer.start();
    });
  }, [loop, timer]);

  useEffect(() => {
    timer.onEvent(event => {
      switch (event) {
        case CountdownEvent.STARTED:
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
          break;
        case CountdownEvent.COMPLETED:
          Animated.timing(slideAnim, {
            toValue: scales.screen.height * .3,
            duration: 100,
            useNativeDriver: true,
          }).start();
          break;
      }
    });
  }, [timer, scales.screen.height])

  const translateX = countdownAnim.interpolate({
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

export default CountdownBar;

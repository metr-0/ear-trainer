import React, {useEffect, useRef, useState} from "react";
import { Animated, View } from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import CountdownEventListener from "@/components/games/base/CountdownEventListener";
import CountdownEvent from "@/components/games/base/CountdownEvent";

const CountdownBar = ({ anim, onCountdownEvent }:
                        { anim: Animated.Value, onCountdownEvent: (listener: CountdownEventListener) => void }) => {

  const scales = useHLGameScales();
  const slideAnim = useRef(new Animated.Value(scales.screen.height * .3)).current;

  useEffect(() => {
    onCountdownEvent(event => {
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
  }, [])

  const translateX = anim.interpolate({
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

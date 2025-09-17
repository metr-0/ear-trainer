import React, {useEffect, useState} from "react";
import { Animated, View } from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import CountdownEventListener from "@/components/games/base/CountdownEventListener";
import CountdownEvent from "@/components/games/base/CountdownEvent";

const CountdownBar = ({ anim, onCountdownEvent }:
                        { anim: Animated.Value, onCountdownEvent: (listener: CountdownEventListener) => void }) => {

  const scales = useHLGameScales();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    onCountdownEvent(event => {
      switch (event) {
        case CountdownEvent.STARTED:
          setVisible(true);
          console.log("start")
          break;
        case CountdownEvent.COMPLETED:
          setVisible(false);
          console.log("stop")
          break;
      }
    });
  }, [])

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -scales.countdownBar.width],
  });

  return (
    visible && <View style={{
      height: scales.countdownBar.height,
      width: scales.countdownBar.width,
      backgroundColor: "#262626",
      border: scales.countdownBar.height * .1,
      borderColor: "#e6e6e6", borderStyle: "solid",
      borderRadius: scales.countdownBar.height * .3,
      overflow: "hidden"
    }}>
      <Animated.View style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#e6e6e6",
        transform: [{ translateX }] as any,
      }} />
    </View>
  );
};

export default CountdownBar;

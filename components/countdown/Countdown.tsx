import React, {useEffect, useState} from "react";
import {View} from "react-native";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming} from "react-native-reanimated";
import CountdownNumberController from "@/components/countdown/CountdownNumberController";
import useScales from "@/components/useScales";
import colors from "@/constants/Colors";

const Countdown = ({ registerNumberController }: {
  registerNumberController: (fn: CountdownNumberController) => void;
}) => {

  const scales = useScales().countdown;
  const [number, setNumber] = useState<number | null>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const triggerAnimation = (newNum: number) => {
    if (newNum === 0) {
      opacity.value = withTiming(0, { duration: 300 });
      runOnJS(setNumber)(null);
      return;
    }

    runOnJS(setNumber)(newNum);

    opacity.value = 0;
    scale.value = 0.5;
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 600 })
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  };

  useEffect(() => {
    registerNumberController(newNum => triggerAnimation(newNum));
  }, [registerNumberController]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }) as any);

  return <View
    style={{
      flex: 1,
      flexDirection: "column",
      alignItems: "center"
    }}
  >
    {number !== null && <Animated.Text style={[{
      color: colors.white,
      fontSize: scales.fontSize,
      fontWeight: "bold"
    }, animatedStyle]}>
      {number}...
    </Animated.Text>}
  </View>;
};

export default Countdown;

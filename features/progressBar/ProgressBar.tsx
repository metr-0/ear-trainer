import React, {useEffect} from "react";
import {View} from "react-native";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useScales from "@/features/scales/useScales";
import OnProgressBarShow from "@/features/progressBar/OnProgressBarShow";
import colors from "@/shared/constants/Colors";

const ProgressBar = ({registerController}: {
  registerController: (fn: OnProgressBarShow) => void;
}) => {

  const scales = useScales();

  const progress = useSharedValue(0);
  const slideY = useSharedValue(scales.screen.height * 0.3);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: -progress.value * scales.countdownBar.width,
    }]
  }) as any);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }]
  }) as any);

  useEffect(() => {
    registerController(duration => {
      slideY.value = withTiming(0, { duration: 100 });

      progress.value = 0;
      progress.value = withTiming(
        1,
        {
          duration,
          easing: Easing.linear
        },
        finished => {
          if (finished) slideY.value = withTiming(scales.screen.height * .3, {
            duration: 100
          });
        }
      );
    });
  }, [registerController]);

  return (
    <Animated.View style={slideStyle}>
      <View
        style={{
          height: scales.countdownBar.height,
          width: scales.countdownBar.width,
          backgroundColor: colors.black,
          borderWidth: scales.countdownBar.height * 0.1,
          borderColor: colors.white,
          borderStyle: "solid",
          borderRadius: scales.countdownBar.height * 0.3,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[{
            height: "100%",
            width: "100%",
            backgroundColor: colors.white
          }, progressStyle]}
        />
      </View>
    </Animated.View>
  );
};

export default ProgressBar;

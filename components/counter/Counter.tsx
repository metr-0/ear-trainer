import React, {useEffect, useState} from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence, Easing,
} from "react-native-reanimated";

import colors from "@/constants/Colors";
import useScales from "@/components/useScales";
import CounterVisibleController from "@/components/counter/CounterVisibleController";
import CounterController from "@/components/counter/CounterController";

const Counter = ({maxCount, registerController, registerVisibleController}: {
  maxCount: number
  registerController: (fn: CounterController) => void;
  registerVisibleController: (fn: CounterVisibleController) => void;
}) => {
  const [count, setCount] = useState(0);

  const scales = useScales().counter;
  const slide = useSharedValue(0);

  useEffect(() => {
    registerVisibleController(visible => {
      slide.value = withTiming(visible ? 1 : 0, {
        duration: 50,
        easing: Easing.out(Easing.quad)
      })
    });
  }, [registerVisibleController]);

  useEffect(() => {
    registerController(count => setCount(count));
  }, [registerController])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: (1 - slide.value) * scales.slide
    }],
  }) as any);

  return (
    <Animated.View style={[{
      position: "absolute",
      flex: 1,
      flexDirection: "row",
      gap: scales.size * .3
    }, animatedStyle]}>
      {Array.from({ length: maxCount }).map((_, i) => {
        const filled = i < count;

        const opacity = useSharedValue(filled ? 1 : 0.3);
        const scale = useSharedValue(filled ? 1 : 0.8);
        const translateX = useSharedValue(0);

        useEffect(() => {
          if (filled) {
            opacity.value = withTiming(1, { duration: 400 });
            scale.value = withTiming(1, { duration: 400 });

            translateX.value = withSequence(
              withTiming(-5, { duration: 50 }),
              withTiming(5, { duration: 100 }),
              withTiming(-3, { duration: 80 }),
              withTiming(0, { duration: 80 })
            );
          } else {
            opacity.value = withTiming(0.3, { duration: 400 });
            scale.value = withTiming(0.8, { duration: 400 });

            translateX.value = withSequence(
              withTiming(-5, { duration: 50 }),
              withTiming(5, { duration: 100 }),
              withTiming(-3, { duration: 80 }),
              withTiming(0, { duration: 80 })
            );
          }
        }, [filled]);

        const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
          transform: [
            { scale: scale.value },
            { translateX: translateX.value },
          ],
        }) as any);

        return (
          <Animated.View
            key={i}
            style={[{
              backgroundColor: filled ? colors.white : undefined,
              width: scales.size,
              height: scales.size,
              borderColor: colors.white,
              borderWidth: scales.size * .1,
              borderRadius: scales.size * .5,
            }, animatedStyle]}
          />
        );
      })}
    </Animated.View>
  );
};

export default Counter;

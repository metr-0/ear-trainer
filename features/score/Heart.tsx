import Animated, {useAnimatedStyle, useSharedValue, withSequence, withTiming} from "react-native-reanimated";
import {useEffect} from "react";
import colors from "@/shared/constants/Colors";

const heartFull = require("@/assets/images/indicators/hp.png") as any;
const heartEmpty = require("@/assets/images/indicators/hpEmpty.png") as any;

const Heart = ({ filled, size }: { filled: boolean; size: number }) => {
  const opacity = useSharedValue(filled ? 1 : 0.3);
  const scale = useSharedValue(filled ? 1 : 0.8);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (filled) {
      opacity.value = 1;
      scale.value = 1;
      translateX.value = 0;
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
  }));

  return (
    <Animated.Image
      source={filled ? heartFull : heartEmpty}
      style={[{ width: size, height: size }, animatedStyle]}
      resizeMode="contain"
      tintColor={colors.white}
    />
  );
};

export default Heart;

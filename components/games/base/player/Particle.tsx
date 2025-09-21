import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useEffect} from "react";

const Particle = ({startX, startY, speed, size, rotation, onComplete}: {
  startX: number;
  startY: number;
  speed: number;
  size: number;
  rotation: number;
  onComplete?: () => void;
}) => {
  const x = useSharedValue(startX);
  const opacity = useSharedValue(1);

  useEffect(() => {
    x.value = withTiming(startX - speed, { duration: 2500 }, () => {
      opacity.value = withTiming(0, { duration: 100 }, () => {
        if (onComplete) runOnJS(onComplete)();
      });
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: startY,
    opacity: opacity.value,
    transform: [{ rotate: `${rotation}deg` }]
  }));

  return (
    <Animated.Image
      source={require("@/assets/images/player/particle.png")}
      style={[{ position: "absolute", width: size, height: size }, animatedStyle]}
      tintColor={"#262626"}
    />
  );
};

export default Particle;

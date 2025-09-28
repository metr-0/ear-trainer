import {useEffect} from "react";
import {Image} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useScales from "@/features/scales/useScales";
import OnShowObstacles from "@/features/obstacle/OnShowObstacles";

const img = require("@/assets/images/other/obstacle.png");

const Obstacles = ({registerObstaclesController}: {
  registerObstaclesController: (fn: OnShowObstacles) => void;
}) => {
  const scales = useScales().obstacles;

  const topObstacleY = useSharedValue(0);
  const bottomObstacleY = useSharedValue(0);
  const obstaclesX = useSharedValue(0);

  useEffect(() => {
    registerObstaclesController(correctLane => {
      topObstacleY.value = 0;
      bottomObstacleY.value = 0;
      obstaclesX.value = 0;

      switch (correctLane) {
        case 0:
          topObstacleY.value = withTiming(1, {
            duration: 100
          });
          bottomObstacleY.value = withTiming(1, {
            duration: 100
          });
          setTimeout(() => {
            obstaclesX.value = withTiming(1, {
              duration: 100
            })
          }, 200);
          break;
        case 1:
          topObstacleY.value = withTiming(2, {
            duration: 100
          });
          bottomObstacleY.value = withTiming(0, {
            duration: 100
          });
          setTimeout(() => {
            obstaclesX.value = withTiming(1, {
              duration: 100
            })
          }, 200);
          break;
        case -1:
          topObstacleY.value = withTiming(0, {
            duration: 100
          });
          bottomObstacleY.value = withTiming(2, {
            duration: 100
          });
          setTimeout(() => {
            obstaclesX.value = withTiming(1, {
              duration: 100
            })
          }, 200);
          break;
      }
    });
  }, [registerObstaclesController]);

  const topObstacleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [ { translateY: topObstacleY.value * scales.slide.y } ]
  }) as any);

  const bottomObstacleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [ { translateY: -bottomObstacleY.value * scales.slide.y } ]
  }) as any);

  const obstaclesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [ { translateX: -obstaclesX.value * scales.slide.x } ]
  }) as any);

  return (
    <Animated.View style={obstaclesAnimatedStyle}>
      <Animated.View style={[{
        position: "absolute"
      }, topObstacleAnimatedStyle]}>
        <Image source={img} style={{
          position: "relative",
          left: scales.offset.x,
          top: scales.offset.topY,
          height: scales.height,
          width: scales.width,
          transform: [ { rotate: "180deg" } ] as any
        }} />
      </Animated.View>
      <Animated.View style={[{
        position: "absolute"
      }, bottomObstacleAnimatedStyle]}>
        <Image source={img} style={{
          position: "relative",
          left: scales.offset.x,
          top: scales.offset.bottomY,
          height: scales.height,
          width: scales.width,
        }} />
      </Animated.View>
    </Animated.View>
  );
};

export default Obstacles;

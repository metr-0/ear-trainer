import ObstaclesController from "@/components/games/base/obstacle/ObstaclesController";
import {useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import {Image} from "react-native";

const img = require("@/assets/images/other/obstacle.png");

const Obstacles = ({registerObstaclesController}: {
  registerObstaclesController: (fn: ObstaclesController) => void;
}) => {
  const scales = useHLGameScales();

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
    transform: [ { translateY: topObstacleY.value * (scales.lane.height + scales.lane.dividerHeight) } ]
  }) as any);

  const bottomObstacleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [ { translateY: -bottomObstacleY.value * (scales.lane.height + scales.lane.dividerHeight) } ]
  }) as any);

  const obstaclesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [ { translateX: -obstaclesX.value * scales.screen.width } ]
  }) as any);

  const height = scales.lane.height * 2 + scales.lane.dividerHeight * 10;
  const width = height * .6;

  return (
    <Animated.View style={obstaclesAnimatedStyle}>
      <Animated.View style={[{
        position: "absolute"
      }, topObstacleAnimatedStyle]}>
        <Image source={img} style={{
          position: "relative",
          left: -width / 2,
          top: -height / 2 - height - scales.lane.height / 2 + scales.screen.height * .04,
          height: height,
          width: width,
          transform: [ { rotate: "180deg" } ] as any
        }} />
      </Animated.View>
      <Animated.View style={[{
        position: "absolute"
      }, bottomObstacleAnimatedStyle]}>
        <Image source={img} style={{
          position: "relative",
          left: -width / 2,
          top: -height / 2 + height + scales.lane.height / 2 - scales.screen.height * .04,
          height: height,
          width: width,
        }} />
      </Animated.View>
    </Animated.View>
  );
};

export default Obstacles;

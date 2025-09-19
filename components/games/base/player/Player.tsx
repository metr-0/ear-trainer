import React, {forwardRef, useEffect} from "react";
import {Image, View} from "react-native";
import PlayerColor from "@/components/games/base/player/PlayerColor";
import {defaultColors} from "@/constants/Colors";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import PlayerLaneController from "@/components/games/base/player/PlayerLaneController";
import PlayerColorController from "@/components/games/base/player/PlayerColorController";
import PlayerNoteSvg from "@/assets/images/player/playerNote.svg";

Animated.addWhitelistedNativeProps({ fill: true });

const ForwardedPlayerNoteSvg = forwardRef((props: any, ref) => (
  <PlayerNoteSvg {...props} ref={ref} />
));

const AnimatedPlayerNote = Animated.createAnimatedComponent(ForwardedPlayerNoteSvg as any);

const images = {
  front: require("../../../../assets/images/player/playerNote.png"),
  back: require("../../../../assets/images/player/player.png")
};

const Player = ({ scales, registerLaneController, registerColorController, registerGetLane }: {
  scales: any;
  registerLaneController: (fn: PlayerLaneController) => void;
  registerColorController: (fn: PlayerColorController) => void;
  registerGetLane: (fn: () => number) => void;
}) => {

  const offset = scales.lane.height + scales.lane.dividerHeight;

  const getColor = (color: PlayerColor) => {
    switch (color) {
      case PlayerColor.NEUTRAL:
        return defaultColors.neutral;
      case PlayerColor.CORRECT:
        return defaultColors.correct;
      case PlayerColor.MISTAKE:
        return defaultColors.mistake;
    }
    return defaultColors.neutral;
  }

  const lane = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const currentColor = useSharedValue(PlayerColor.NEUTRAL);
  const targetColor = useSharedValue(PlayerColor.NEUTRAL);

  useEffect(() => {
    registerLaneController((newLane) => {
      const finalLine = typeof newLane === "function" ? newLane(lane.value) : newLane;
      lane.value = withTiming(finalLine, {duration: 200});
    });

    registerColorController((color: PlayerColor) => {
      targetColor.value = color;
      colorProgress.value = 0;

      colorProgress.value = withTiming(1, {duration: 200}, () => {
        currentColor.value = color;
      });
      console.log(currentColor.value, targetColor.value);
    });

    registerGetLane(() => lane.value);
  }, [registerLaneController, registerColorController, registerGetLane]);

  const animatedTransform = useAnimatedStyle(() => ({
    transform: [{ translateY: lane.value * offset }] as any,
  }));

  const animatedFill = useAnimatedProps(() => {
    return {
      fill: interpolateColor(
        colorProgress.value,
        [0, 1],
        [getColor(currentColor.value), getColor(targetColor.value)]
      )
    } as any;
  });

  return (
    <Animated.View
      style={[{
        position: "relative", width: scales.player.width, height: scales.player.height
      }, animatedTransform]}
    >
      <Image
        source={images.back}
        style={{ width: scales.player.width, height: scales.player.height, position: "absolute" }}
      />
      <View style={{position: "absolute"}}>
        <AnimatedPlayerNote
          width={scales.player.width}
          height={scales.player.height}
          animatedProps={animatedFill}
        />
      </View>
    </Animated.View>
  );
};

export default Player;

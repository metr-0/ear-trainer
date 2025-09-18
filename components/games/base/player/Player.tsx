import React from "react";
import {Animated, Image} from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";

const Player = ({ images, anim }: { images: { back: any, front: any }, anim: Animated.Value }) => {
  const scales = useHLGameScales();
  const offset = scales.lane.height + scales.lane.dividerHeight;

  const translateY = anim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-offset, 0, offset],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }] as any,
        position: "relative", width: scales.player.width, height: scales.player.height
      }}
    >
      <Image
        source={images.back}
        style={{ width: scales.player.width, height: scales.player.height, position: "absolute" }}
      />
      <Image
        source={images.front}
        style={{ width: scales.player.width, height: scales.player.height, position: "absolute" }}
      />
    </Animated.View>
  );
};

export default Player;

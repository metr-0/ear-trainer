import React, {useEffect, useRef} from "react";
import {View, Image, Animated} from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import BackgroundLoop from "@/components/games/base/BackgroundLoop";

export const HLGameBackground = ({ laneImages, bpm }: { laneImages: any[], bpm: number }) => {
  const scales = useHLGameScales();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = new BackgroundLoop(bpm, anim, scales.lane.width);
    loop.start();

    return () => loop.stop();
  }, [bpm, scales.lane.width]);

  const translateX = anim.interpolate({
    inputRange: [0, scales.lane.width],
    outputRange: [0, -scales.lane.width],
  });

  return (
    <View style={{
      flex: 1, backgroundColor: "#262626",
      flexDirection: "column", justifyContent: "center"
    }}>
      {laneImages.map((img, index) => (
        <React.Fragment key={index}>
          <Animated.View
            style={{
              height: scales.lane.height,
              flexDirection: "row",
              transform: [{ translateX }] as any,
            }}
          >
            <Image
              source={img}
              style={{
                width: scales.lane.width, height: scales.lane.height,
                backgroundColor: "#e6e6e6"
            }}
            />
            <Image
              source={img}
              style={{
                width: scales.lane.width, height: scales.lane.height,
                backgroundColor: "#e6e6e6"
            }}
            />
          </Animated.View>
          {index < 2 && (
            <View
              style={{
                height: scales.lane.dividerHeight,
                backgroundColor: "#262626",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

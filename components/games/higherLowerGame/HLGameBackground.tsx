import React from "react";
import {View, Image, Animated} from "react-native";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";

export const HLGameBackground = ({ laneImages, anim }: { laneImages: any[], anim: Animated.Value }) => {
  const scales = useHLGameScales();

  const translateX = anim.interpolate({
    inputRange: [0, scales.lane.width],
    outputRange: [0, -scales.lane.width],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#262626", display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
              style={{ width: scales.lane.width, height: scales.lane.height, backgroundColor: "#e6e6e6" }}
            />
            <Image
              source={img}
              style={{ width: scales.lane.width, height: scales.lane.height, backgroundColor: "#e6e6e6" }}
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

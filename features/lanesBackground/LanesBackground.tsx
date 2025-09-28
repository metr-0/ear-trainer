import React, {useEffect} from "react";
import {View, Image} from "react-native";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import useScales from "@/features/scales/useScales";
import colors from "@/shared/constants/Colors";

const laneImages = [
  require("@/assets/images/lanes/silk/silk1.png"),
  require("@/assets/images/lanes/silk/silk2.png"),
  require("@/assets/images/lanes/silk/silk3.png"),
];

const LanesBackground = ({ bpm }: { bpm: number }) => {
  const scales = useScales().lane;
  const anim = useSharedValue(0);

  useEffect(() => {
    const pixelsPerBeat = 512;
    const durationBeat = (60 / bpm) * 1000;
    const duration = (durationBeat * scales.width) / pixelsPerBeat;

    anim.value = withRepeat(
      withTiming(scales.width, {
        duration,
        easing: Easing.linear
      }),
      -1,
      false
    );
  }, [bpm, scales.width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -anim.value }]
  }) as any);

  return (
    <View style={{
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: colors.black
    }}>
      {laneImages.map((img, index) => (
        <React.Fragment key={index}>
          <Animated.View
            style={[{
              height: scales.height,
              flexDirection: "row",
            }, animatedStyle]}
          >
            <Image
              source={img}
              style={{
                width: scales.width,
                height: scales.height,
                backgroundColor: colors.white
              }}
            />
            <Image
              source={img}
              style={{
                width: scales.width,
                height: scales.height,
                backgroundColor: colors.white
              }}
            />
            <Image
              source={img}
              style={{
                width: scales.width,
                height: scales.height,
                backgroundColor: colors.white
              }}
            />
          </Animated.View>
          {index < 2 && (
            <View
              style={{
                height: scales.dividerHeight,
                backgroundColor: colors.black,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default LanesBackground;

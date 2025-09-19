import React from "react";
import {Animated, Image, View} from "react-native";
import {defaultColors} from "@/constants/Colors";

const indicators = {
  correct: require("../../../../assets/images/indicators/correct.png"),
  mistake: require("../../../../assets/images/indicators/mistake.png")
};

const Indicator = ({ slideAnim, correct, scales }: {
  slideAnim: Animated.Value,
  correct: boolean,
  scales: any
}) => {

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scales.screen.height * 3, 0]
  });

  const imageSize = scales.indicator.height;
  const imagesCount = Math.max(1, Math.floor(scales.indicator.width / (imageSize * 1.5)) - 1);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }] as any,
      }}
    >
      <View
        style={{
          height: scales.indicator.height,
          width: scales.indicator.width,
          overflow: "hidden",
          flex: 1, flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {Array.from({length: imagesCount},() =>
          <Image
            source={correct ? indicators.correct : indicators.mistake }
            style={{
              height: imageSize, width: imageSize, margin: imageSize / 4,
              tintColor: correct ? defaultColors.correct : defaultColors.mistake
            }}
          />
        )}
      </View>
    </Animated.View>
  );
};

export default Indicator;

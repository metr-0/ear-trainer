import React, {useEffect} from "react";
import {Image, View} from "react-native";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useGameStore from "@/store/useGameStore";
import IndicatorVisibleController from "@/components/indicator/IndicatorVisibleController";
import colors from "@/constants/Colors";
import useScales from "@/components/useScales";

const indicators = {
  correct: require("../../assets/images/indicators/correct.png"),
  mistake: require("../../assets/images/indicators/mistake.png")
};

const Indicator = ({ registerVisibleController }: {
  registerVisibleController: (fn: IndicatorVisibleController) => void
}) => {
  const scales = useScales().indicator;
  const paused = useGameStore(state => state.paused);

  const correctSlide = useSharedValue(0);
  const mistakeSlide = useSharedValue(0);

  useEffect(() => {
    if (paused) {
      correctSlide.set(0);
      mistakeSlide.set(0);
    }
  }, [paused]);

  useEffect(() => {
    registerVisibleController((visible, correct) => {
      (correct ? mistakeSlide : correctSlide).set(0);
      (correct ? correctSlide : mistakeSlide).value = withTiming(visible ? 1 : 0, {
        duration: 50,
        easing: Easing.out(Easing.quad)
      });
    });
  }, [registerVisibleController]);

  const correctAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: (1 - correctSlide.value) * scales.slide
    }],
  }) as any);

  const mistakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: (1 - mistakeSlide.value) * scales.slide
    }],
  }) as any);

  const imageSize = scales.height;
  const imagesCount = Math.max(1, Math.floor(scales.width / (imageSize * 1.5)) - 1);

  return (
    <>
      <Animated.View
        style={[{
          position: "absolute",
        }, correctAnimatedStyle]}
      >
        <View
          style={{
            height: scales.height,
            width: scales.width,
            overflow: "hidden",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {Array.from({length: imagesCount},(idx) =>
            <React.Fragment key={idx}>
              <Image
                source={indicators.correct}
                style={{
                  height: imageSize,
                  width: imageSize,
                  margin: imageSize / 4,
                  tintColor: colors.green
                }}
              />
            </React.Fragment>
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={[{
          position: "absolute"
        }, mistakeAnimatedStyle]}
      >
        <View
          style={{
            height: scales.height,
            width: scales.width,
            overflow: "hidden",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {Array.from({length: imagesCount},(idx) =>
            <React.Fragment key={idx}>
              <Image
                source={indicators.mistake}
                style={{
                  height: imageSize,
                  width: imageSize,
                  margin: imageSize / 4,
                  tintColor: colors.red
                }}
              />
            </React.Fragment>
          )}
        </View>
      </Animated.View>
    </>
  );
};

export default Indicator;

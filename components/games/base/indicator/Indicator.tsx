import React, {useEffect} from "react";
import {Easing, Image, View} from "react-native";
import {defaultColors} from "@/constants/Colors";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import useGameStore from "@/store/useGameStore";
import IndicatorVisibleController from "@/components/games/base/indicator/IndicatorVisibleController";

const indicators = {
  correct: require("../../../../assets/images/indicators/correct.png"),
  mistake: require("../../../../assets/images/indicators/mistake.png")
};

const Indicator = ({ scales, registerVisibleController }: {
  scales: any,
  registerVisibleController: (fn: IndicatorVisibleController) => void
}) => {
  const duration = 100;

  const correctSlide = useSharedValue(0);
  const mistakeSlide = useSharedValue(0);
  const paused = useGameStore(state => state.paused);

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
        duration,
        easing: Easing.out(Easing.quad)
      });
    });
  }, [registerVisibleController]);

  const correctAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (1 - correctSlide.value) * scales.screen.height * 3
        }
      ],
    };
  });

  const mistakeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: (1 - mistakeSlide.value) * scales.screen.height * 3
        }
      ],
    };
  });

  const imageSize = scales.indicator.height;
  const imagesCount = Math.max(1, Math.floor(scales.indicator.width / (imageSize * 1.5)) - 1);

  return (
    <>
      <Animated.View
        style={[{
          position: "absolute",
        }, correctAnimatedStyle]}
      >
        <View
          style={{
            height: scales.indicator.height,
            width: scales.indicator.width,
            overflow: "hidden",
            flex: 1, flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {Array.from({length: imagesCount},() =>
            <Image
              source={indicators.correct}
              style={{
                height: imageSize, width: imageSize, margin: imageSize / 4,
                tintColor: defaultColors.correct
              }}
            />
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
              source={indicators.mistake}
              style={{
                height: imageSize, width: imageSize, margin: imageSize / 4,
                tintColor: defaultColors.mistake
              }}
            />
          )}
        </View>
      </Animated.View>
    </>
  );
};

export default Indicator;

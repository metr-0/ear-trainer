import React, { useEffect } from "react";
import { View } from "react-native";
import useGameStore from "@/store/useGameStore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import {defaultColors} from "@/constants/Colors";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import {useRouter} from "expo-router";

const heartFull = require("@/assets/images/indicators/hp.png") as any;
const heartEmpty = require("@/assets/images/indicators/hpEmpty.png") as any;

const Score = ({ maxHp }: { maxHp: number }) => {
  const router = useRouter();
  const totalScore = useGameStore(state => state.totalScore);
  const correctScore = useGameStore(state => state.correctScore);
  const scales = useHLGameScales();

  const hp = Math.max(0, maxHp - (totalScore - correctScore));

  useEffect(() => {
    if (hp <= 0) {
      router.replace("/results"); // replace, чтобы нельзя было вернуться "назад" в игру
    }
  }, [hp]);

  const scoreScale = useSharedValue(1);
  useEffect(() => {
    scoreScale.value = 1.3;
    scoreScale.value = withSpring(1, { damping: 5, stiffness: 150 });
  }, [correctScore]);

  const animatedScoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <View style={{
      top: scales.screen.height * .02,
      position: "absolute",
      width: scales.screen.width,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Animated.Text style={[{
        fontWeight: "bold",
        fontSize: scales.screen.height * .08,
        color: defaultColors.neutral,
        marginLeft: scales.screen.height * .04
      }, animatedScoreStyle]}>
        {correctScore}
      </Animated.Text>

      <View>
        <View style={{
          flex: 1,
          flexDirection: "row",
          gap: 4
        }}>
          {Array.from({ length: maxHp }).map((_, i) => {
            const filled = i < hp;

            const opacity = useSharedValue(filled ? 1 : 0.3);
            const scale = useSharedValue(filled ? 1 : 0.8);
            const translateX = useSharedValue(0);

            useEffect(() => {
              if (!filled) {
                opacity.value = withTiming(0.3, { duration: 400 });
                scale.value = withTiming(0.8, { duration: 400 });

                translateX.value = withSequence(
                  withTiming(-5, { duration: 50 }),
                  withTiming(5, { duration: 100 }),
                  withTiming(-3, { duration: 80 }),
                  withTiming(0, { duration: 80 })
                );
              }
            }, [filled]);

            const animatedStyle = useAnimatedStyle(() => ({
              opacity: opacity.value,
              transform: [
                { scale: scale.value },
                { translateX: translateX.value },
              ],
            }));

            return (
              <Animated.Image
                key={i}
                source={filled ? heartFull : heartEmpty}
                style={[{
                  width: scales.screen.height * .08,
                  height: scales.screen.height * .08
                }, animatedStyle]}
                resizeMode="contain"
                tintColor={defaultColors.neutral}
              />
            );
          })}
        </View>
      </View>

      <View style={{width: scales.screen.height * .12}} />
    </View>
  );
};

export default Score;

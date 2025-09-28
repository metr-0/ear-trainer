import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from "react-native-reanimated";

import useGameStore from "@/shared/store/useGameStore";
import colors from "@/shared/constants/Colors";
import useScales from "@/features/scales/useScales";
import {useRouter} from "expo-router";
import GameSettings from "@/shared/GameSettings";
import GameMode from "@/shared/GameMode";
import Heart from "@/features/score/Heart";

const Score = ({ settings }: { settings: GameSettings }) => {
  const router = useRouter();
  const scales = useScales().score;

  const totalScore = useGameStore(state => state.totalScore);
  const correctScore = useGameStore(state => state.correctScore);

  const hp = Math.max(0, settings.maxHp - (totalScore - correctScore));

  useEffect(() => {
    if (hp <= 0) {
      router.replace("/results");
    }
  }, [hp]);

  const scoreScale = useSharedValue(1);
  useEffect(() => {
    scoreScale.value = 1.3;
    scoreScale.value = withSpring(1, { damping: 5, stiffness: 150 });
  }, [correctScore]);

  const animatedScoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }) as any);

  return (
    <View style={{
      top: scales.topMargin,
      position: "absolute",
      width: scales.width,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1,
    }}>
      <Animated.Text style={[{
        fontWeight: "bold",
        fontSize: scales.fontSize,
        color: colors.white,
        marginLeft: scales.leftMargin
      }, animatedScoreStyle]}>
        {settings.mode === GameMode.LIMITED ? correctScore : `${correctScore}/${totalScore}`}
      </Animated.Text>

      {settings.mode === GameMode.LIMITED && (
        <View style={{ flexDirection: "row", gap: 4 }}>
          {Array.from({ length: settings.maxHp }).map((_, i) => (
            <Heart key={i} filled={i < hp} size={scales.imgSize} />
          ))}
        </View>
      )}

      <View style={{width: scales.leftMargin + scales.fontSize}} />
    </View>
  );
};

export default Score;

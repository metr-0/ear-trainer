import React, {forwardRef, useEffect, useState} from "react";
import {Image, View} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue, withRepeat, withSequence,
  withTiming
} from "react-native-reanimated";

import PlayerColor from "@/features/player/PlayerColor";
import OnPlayerLaneChange from "@/features/player/OnPlayerLaneChange";
import OnPlayerColorChange from "@/features/player/OnPlayerColorChange";
import PlayerNoteSvg from "@/assets/images/player/playerNote.svg";
import Particle from "@/features/player/Particle";
import colors from "@/shared/constants/Colors";
import useScales from "@/features/scales/useScales";

const ForwardedPlayerNoteSvg = forwardRef((props: any, ref) => (
  <PlayerNoteSvg {...props} ref={ref} />
));

const AnimatedPlayerNote = Animated.createAnimatedComponent(ForwardedPlayerNoteSvg as any) as any;

const images = {
  front: require("../../assets/images/player/playerNote.png"),
  back: require("../../assets/images/player/player.png")
};

const Player = ({ registerLaneController, registerColorController, registerGetLane }: {
  registerLaneController: (fn: OnPlayerLaneChange) => void;
  registerColorController: (fn: OnPlayerColorChange) => void;
  registerGetLane: (fn: () => number) => void;
}) => {
  const scales = useScales().player;

  const getColor = (color: PlayerColor) => {
    switch (color) {
      case PlayerColor.NEUTRAL:
        return colors.white;
      case PlayerColor.CORRECT:
        return colors.green;
      case PlayerColor.MISTAKE:
        return colors.red;
    }
  }

  const lane = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const currentColor = useSharedValue(PlayerColor.NEUTRAL);
  const targetColor = useSharedValue(PlayerColor.NEUTRAL);

  const sway = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const [particles, setParticles] = useState<
    { id: number; startY: number; speed: number; size: number, rotation: number }[]
  >([]);

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
    });

    registerGetLane(() => lane.value);

    sway.value = withRepeat(
      withSequence(
        withTiming(-scales.sway, { duration: 1200 }),
        withTiming(scales.sway, { duration: 1200 })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(3, { duration: 1500 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1400 }),
        withTiming(0.95, { duration: 1400 })
      ),
      -1,
      true
    );

    const interval = setInterval(() => {
      const id = Date.now();
      const size = scales.particle.size;
      const startY = lane.value * scales.slide + sway.value +
        Math.random() * scales.height * .5 - scales.height * .25 - size / 2;
      const speed = scales.particle.speed;
      const rotation = Math.random() * 360;
      setParticles((prev) => [...prev, { id, startY, speed, size, rotation }]);
    }, 80);

    return () => clearInterval(interval);
  }, [registerLaneController, registerColorController, registerGetLane]);

  const animatedTransform = useAnimatedStyle(() => ({
    transform: [
      { translateY: lane.value * scales.slide + sway.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ] as any,
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
    <>
      <Animated.View
        style={[{
          position: "relative",
          width: scales.width,
          height: scales.height,
          zIndex: 2
        }, animatedTransform]}
      >
        <Image
          source={images.back}
          style={{ width: scales.width, height: scales.height, position: "absolute" }}
        />
        <View style={{position: "absolute"}}>
          <AnimatedPlayerNote
            width={scales.width}
            height={scales.height}
            animatedProps={animatedFill}
          />
        </View>
      </Animated.View>
      {particles.map((p) => (
        <Particle
          key={p.id}
          startX={0}
          startY={p.startY}
          speed={p.speed}
          size={p.size}
          rotation={p.rotation}
          onComplete={() =>
            setParticles((prev) => prev.filter((particle) => particle.id !== p.id))
          }
        />
      ))}
    </>
  );
};

export default Player;

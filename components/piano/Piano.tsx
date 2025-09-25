import React, {useEffect, useMemo, useState} from 'react';
import { View, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import colors from "@/constants/Colors";
import useScales from "@/components/useScales";
import PianoController from "@/components/piano/PianoController";

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES[midi % 12];
  return `${name}${octave}`;
}

interface Key {
  midi: number;
  name: string;
  isBlack: boolean;
  position: number;
}

const Piano = ({registerController, onPlay } : {
  registerController: (fn: PianoController) => void;
  onPlay: (midi: number) => void;
}) => {
  const [startMidi, setStartMidi] = useState<number>(0);
  const [highlightedMidi, setHighlightedMidi] = useState<number>(0);

  const scales = useScales().piano;

  useEffect(() => {
    registerController((newStartMidi, newHighlightedMidi) => {
      setStartMidi(newStartMidi);
      setHighlightedMidi(newHighlightedMidi);
    });
  }, [registerController]);

  const keys: Key[] = useMemo(() => {
    const arr: Key[] = [];
    let whiteIndex = 0;
    for (let i = 0; i < 12; i++) {
      const midi = startMidi + i;
      const name = midiToNoteName(midi);
      const isBlack = name.includes('#');
      const position = isBlack ? whiteIndex - 0.5 : whiteIndex;
      if (!isBlack) whiteIndex += 1;
      arr.push({ midi, name, isBlack, position });
    }
    return arr;
  }, [startMidi]);

  const whiteKeys = keys.filter(k => !k.isBlack);
  const blackKeys = keys.filter(k => k.isBlack);

  return (
    <View style={{ width: 7 * (scales.white.width + 2 * scales.white.margin), height: scales.white.height }}>
      <View style={{ flexDirection: 'row' }}>
        {whiteKeys.map(({ midi, name }) => {
          const scale = useSharedValue(1);
          const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

          const handlePressIn = () => {
            scale.value = withSpring(0.90);
            onPlay?.(midi);
          };
          const handlePressOut = () => (scale.value = withSpring(1));

          const isHighlighted = midi === highlightedMidi;

          return (
            <Pressable key={midi} onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <Animated.View
                style={[
                  {
                    width: scales.white.width,
                    height: scales.white.height,
                    backgroundColor: isHighlighted ? colors.red : colors.white,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: scales.white.margin * 2,
                    marginLeft: scales.white.margin,
                    marginRight: scales.white.margin
                  },
                  animatedStyle,
                ]}
              >
                <Text style={{
                  fontSize: scales.white.width * .3,
                  color: colors.black,
                  fontWeight: "bold",
                  marginBottom: scales.white.margin * 3,
                }}>{name}</Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      {blackKeys.map(({ midi, position }) => {
        const scale = useSharedValue(1);
        const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

        const handlePressIn = () => {
          scale.value = withSpring(0.85);
          onPlay?.(midi);
        };
        const handlePressOut = () => (scale.value = withSpring(1));

        const isHighlighted = midi === highlightedMidi;

        return (
          <Pressable
            key={midi}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{
              position: 'absolute',
              top: 0,
              left: (position + .5) * (scales.white.width + 2 * scales.white.margin) - scales.black.width * .5,
              width: scales.black.width,
              height: scales.black.height,
              zIndex: 1,
            }}
          >
            <Animated.View
              style={[
                {
                  width: '100%',
                  height: '100%',
                  backgroundColor: isHighlighted ? colors.red : colors.black,
                  borderRadius: scales.white.margin * 2,
                  borderWidth: scales.black.border,
                  borderColor: colors.white,
                },
                animatedStyle,
              ]}
            />
          </Pressable>

        );
      })}
    </View>
  );
};

export default Piano;

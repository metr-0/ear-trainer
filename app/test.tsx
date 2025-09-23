import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import useMelodyGenerator from "@/components/useMelodyGenerator";
import useSynth from "@/components/useSynth";

export default function MelodyScreen() {
  const { ready, sequence, generateNext, reset } = useMelodyGenerator(
    "https://metr-0.github.io/melody-gen/model/model.json"
  );

  const {playNote} = useSynth();

  useEffect(() => {
    if (ready) {
      reset([60, 62, 64]);
    }
  }, [ready]);

  return (
    <View>
      <Text>Модель загружена: {ready ? "✅" : "⏳"}</Text>
      <Text>Текущая последовательность: {sequence.join(", ")}</Text>
      <Button title="Следующая нота" onPress={() => generateNext()} />
      <Button title="Сбросить" onPress={() => reset([Math.round(Math.random() * 30) + 40])} />
      <Button title="play last" onPress={() => playNote(sequence[sequence.length - 1])} />
    </View>
  );
}

import {View, Pressable, Image, Text} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import colors from "@/constants/Colors";
import useScales from "@/components/useScales";
import {useState} from "react";
import * as Tone from 'tone';

const PreparationScreen = () => {
  const {game} = useLocalSearchParams<{ game?: string }>();

  const router = useRouter();
  const scales = useScales();

  const [bpm, setBpm] = useState<number>(15);
  const bpmOptions = [15, 30, 45, 60, 75, 90];

  const [audioStarted, setAudioStarted] = useState(false);

  const startGame = async () => {
    if (!audioStarted) {
      await Tone.start();
      setAudioStarted(true);
    }

    router.push({ pathname: "/game", params: { game, bpm } });
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height * .1,
          right: scales.screen.height * .1,
        }}
        onPress={() => router.push("/settings")}
      >
        <Image
          source={require("@/assets/images/icons/settings.png")}
          style={{ width: scales.screen.height * .07, height: scales.screen.height * .07 }}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height * .1,
          left: scales.screen.height * .1,
        }}
        onPress={() => router.back()}
      >
        <Image
          source={require("@/assets/images/icons/back.png")}
          style={{ width: scales.screen.height * .07, height: scales.screen.height * .07 }}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>
      <Pressable
        style={{
          position: "absolute",
          bottom: scales.screen.height * .1,
          right: scales.screen.height * .1,
        }}
        onPress={startGame}
      >
        <Image
          source={require("@/assets/images/icons/play.png")}
          style={{ width: scales.screen.height * .15, height: scales.screen.height * .15 }}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>

      <Text
        style={{
          color: colors.black,
          fontSize: scales.screen.height * .05,
          fontWeight: "bold",
          marginBottom: scales.screen.height * .02
        }}
      >
        BPM:
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          marginBottom: scales.screen.height * 0.15,
        }}
      >
        {bpmOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => setBpm(option)}
            style={{
              width: scales.screen.width * 0.2,
              paddingVertical: 10,
              margin: 5,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: bpm === option ? colors.black : colors.white,
              borderWidth: 2,
              borderColor: colors.black,
            }}
          >
            <Text
              style={{
                color: bpm === option ? colors.white : colors.black,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PreparationScreen;

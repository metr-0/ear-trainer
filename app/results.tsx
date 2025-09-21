import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {useRouter} from "expo-router";
import useGameStore from "@/store/useGameStore";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import {defaultColors} from "@/constants/Colors";

export default function ResultsScreen() {
  const router = useRouter();
  const scales = useHLGameScales();

  const correctScore = useGameStore(state => state.correctScore);

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height / 2 - scales.screen.height * (.10 / 2),
          left: scales.screen.width / 2 - scales.screen.height * (.10 * 2.5),
        }}
        onPress={() => {
          router.navigate("/home");
        }}
      >
        <Image
          source={require("../assets/images/icons/home.png")}
          style={{ width: scales.screen.height * .10, height: scales.screen.height * .10 }}
          resizeMode="contain"
          tintColor={defaultColors.neutral}
        />
      </Pressable>
      <Text>score: {correctScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    flex: 1
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  }
});

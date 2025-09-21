import {View, StyleSheet, Pressable, Image} from 'react-native';
import {useRouter} from "expo-router";
import useGameStore from "@/store/useGameStore";
import useHLGameScales from "@/components/games/higherLowerGame/useHLGameScales";
import {defaultColors} from "@/constants/Colors";

export default function PauseScreen() {
  const router = useRouter();
  const setPaused = useGameStore(state => state.setPaused);
  const scales = useHLGameScales();

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height / 2 - scales.screen.height * (.10 / 2),
          left: scales.screen.width / 2 - scales.screen.height * (.10 * 2.5),
        }}
        onPress={() => {
          router.navigate("/results");
        }}
      >
        <Image
          source={require("../assets/images/icons/home.png")}
          style={{ width: scales.screen.height * .10, height: scales.screen.height * .10 }}
          resizeMode="contain"
          tintColor={defaultColors.neutral}
        />
      </Pressable>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height / 2 - scales.screen.height * (.15 / 2),
          left: scales.screen.width / 2 - scales.screen.height * (.15 / 2),
        }}
        onPress={() => {
          setPaused(false);
          router.back();
        }}
      >
        <Image
          source={require("../assets/images/icons/play.png")}
          style={{ width: scales.screen.height * .15, height: scales.screen.height * .15 }}
          resizeMode="contain"
          tintColor={defaultColors.neutral}
        />
      </Pressable>
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

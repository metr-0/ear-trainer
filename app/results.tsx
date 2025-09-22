import {View, Pressable, Image, Text} from 'react-native';
import {useRouter} from "expo-router";
import useGameStore from "@/store/useGameStore";
import useScales from "@/components/useScales";
import colors from "@/constants/Colors";

const ResultsScreen = () => {
  const router = useRouter();
  const scales = useScales();

  const correctScore = useGameStore(state => state.correctScore);

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.black
    }}>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height / 2 - scales.screen.height * (.10 / 2 - .1),
          left: scales.screen.width / 2 - scales.screen.height * (.10 / 2),
        }}
        onPress={() => {
          router.navigate("/home");
        }}
      >
        <Image
          source={require("../assets/images/icons/home.png")}
          style={{ width: scales.screen.height * .10, height: scales.screen.height * .10 }}
          resizeMode="contain"
          tintColor={colors.white}
        />
      </Pressable>
      <Text style={{
        width: scales.screen.width,
        textAlign: "center",
        fontSize: scales.screen.height * .07,
        color: colors.white,
        fontWeight: "bold",
        position: "absolute",
        top: scales.screen.height * .35
      }}>Score: {correctScore}</Text>
    </View>
  );
};

export default ResultsScreen;

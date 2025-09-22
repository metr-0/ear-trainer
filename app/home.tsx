import {View, Image, Pressable, Text} from 'react-native';
import {useRouter} from "expo-router";
import useScales from "@/components/useScales";
import colors from "@/constants/Colors";

const HomeScreen = () => {
  const router = useRouter();
  const scales = useScales();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
    }}>
      <Text style={{
        position: "absolute",
        top: scales.screen.height * .35,
        width: scales.screen.width,
        fontSize: scales.screen.height * .07,
        color: colors.black,
        fontWeight: "bold",
        textAlign: "center"
      }}>
        Ear Trainer
      </Text>
      <Pressable
        style={{
          position: "absolute",
          top: scales.screen.height / 2 - scales.screen.height * (.15 / 2) + scales.screen.height * .1,
          left: scales.screen.width / 2 - scales.screen.height * (.15 / 2),
        }}
        onPress={() => router.push("/games")}
      >
        <Image
          source={require("@/assets/images/icons/play.png")}
          style={{ width: scales.screen.height * .15, height: scales.screen.height * .15 }}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>

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
    </View>
  );
};

export default HomeScreen;

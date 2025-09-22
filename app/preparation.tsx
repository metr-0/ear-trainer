import {View, Pressable, Image} from 'react-native';
import {useRouter} from "expo-router";
import colors from "@/constants/Colors";
import useScales from "@/components/useScales";

const PreparationScreen = () => {
  const router = useRouter();
  const scales = useScales();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white
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
        onPress={() => router.push("/game")}
      >
        <Image
          source={require("@/assets/images/icons/play.png")}
          style={{ width: scales.screen.height * .15, height: scales.screen.height * .15 }}
          resizeMode="contain"
          tintColor={colors.black}
        />
      </Pressable>
    </View>
  );
};

export default PreparationScreen;

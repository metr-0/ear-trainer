import {View, Image, Pressable} from 'react-native';
import {useRouter} from "expo-router";
import useScales from "@/components/useScales";
import colors from "@/constants/Colors";

const SettingsScreen = () => {
  const router = useRouter();
  const scales = useScales();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.black
    }}>
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
          tintColor={colors.white}
        />
      </Pressable>
    </View>
  );
};

export default SettingsScreen;

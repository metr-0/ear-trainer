import {View, Text, Image, Pressable} from 'react-native';
import {useRouter} from "expo-router";
import colors from "@/constants/Colors";
import useScales from "@/components/useScales";

const GamesScreen = () => {
  const router = useRouter();
  const scales = useScales();

  const games = [
    { id: 1, name: 'Higher-Lower' },
    // { id: 2, name: 'Higher-Lower' },
  ];

  return (
    <View style={{
      backgroundColor: colors.black,
      flex: 1
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
          tintColor={colors.white}
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
          tintColor={colors.white}
        />
      </Pressable>

      <View style={{
        flex: 1,
        position: "absolute",
        top: scales.screen.height * .35,
        flexDirection: "row",
        marginLeft: scales.screen.height * .05
      }}>
        {games.map(game => (
          <Pressable style={{
            marginLeft: scales.screen.height * .05,
            flex: 1,
            flexDirection: "column",
            alignItems: "center"
          }} onPress={() => router.push({
            pathname: '/preparation',
            params: { game: game.name }
          })}>
            <View style={{
              width: scales.screen.height * .2,
              height: scales.screen.height * .3,
              backgroundColor: colors.white
            }} />
            <Text style={{
              color: colors.white,
              fontSize: scales.screen.height * .03
            }}>{game.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default GamesScreen;

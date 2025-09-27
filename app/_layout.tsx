import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {View} from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().then();
  }, [loaded]);

  if (!loaded) return null;

  return <View style={{
    flex: 1,
    overflow: "hidden",
    touchAction: "none" as any
  }}>
    <Stack screenOptions={{ headerShown: false }} />
  </View>;
}

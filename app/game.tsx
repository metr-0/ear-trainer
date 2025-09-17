import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from "expo-router";
import HigherLowerGame from "@/components/games/HigherLowerGame";
import HLGameScreen from "@/components/games/higherLowerGame/HLGameScreen";

export default function GameScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.pauseButton}
        onPress={() => router.push('/pause')}
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      <HLGameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "salmon",
    flex: 1
  },
  pauseButton: {
    position: 'absolute',
    top: 100,
    right: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  }
});

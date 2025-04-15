import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => router.push('/sections')}
      >
        <Ionicons name="play" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "salmon",
    flex: 1
  },
  settingsButton: {
    position: 'absolute',
    top: 100,
    right: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  },
  playButton: {
    position: 'absolute',
    bottom: 100,
    right: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  },
});

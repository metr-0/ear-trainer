import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from "expo-router";

export default function PreparationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>preparation</Text>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playButton}
        onPress={() => router.push('/game')}
      >
        <Ionicons name="play" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.dismissTo('/home')}
      >
        <Ionicons name="home" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-undo" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    flex: 1
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
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
  homeButton: {
    position: 'absolute',
    top: 200,
    left: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  }
});

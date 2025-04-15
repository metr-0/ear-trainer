import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from "expo-router";

export default function PauseScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>pause</Text>

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
    top: 50,
    left: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  }
});

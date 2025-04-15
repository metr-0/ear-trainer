import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from "expo-router";

export default function GamesScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams();

  const games = [
    { id: 1, name: 'g1', color: '#FF5733' },
    { id: 2, name: 'g2', color: '#33FF57' },
    { id: 3, name: 'g3', color: '#3357FF' },
    { id: 4, name: 'g4', color: '#F333FF' },
    { id: 5, name: 'g5', color: '#FF33F3' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.card, { backgroundColor: game.color }]}
            onPress={() => router.push({
              pathname: '/preparation',
              params: { game: game.name }
            })}
          >
            <Text style={styles.cardText}>{game.name}</Text>
          </TouchableOpacity>
        ))}
        <Text>{section}</Text>
      </ScrollView>

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
    flex: 1,
    paddingTop: 50,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  card: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  }
});

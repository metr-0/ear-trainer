import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function SectionsScreen() {
  const router = useRouter();

  const sections = [
    { id: 1, name: 'Action', color: '#FF5733' },
    { id: 2, name: 'Adventure', color: '#33FF57' },
    { id: 3, name: 'Puzzle', color: '#3357FF' },
    { id: 4, name: 'Strategy', color: '#F333FF' },
    { id: 5, name: 'Sports', color: '#FF33F3' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[styles.card, { backgroundColor: section.color }]}
            onPress={() => router.push({
              pathname: '/games',
              params: { section: section.name }
            })}
          >
            <Text style={styles.cardText}>{section.name}</Text>
          </TouchableOpacity>
        ))}
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

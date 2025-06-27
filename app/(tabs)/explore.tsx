import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme-context';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';

const ExploreScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const backgroundColor = isDarkMode ? '#121212' : '#FDFBEF';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';
  const [selectedCategory, setSelectedCategory] = useState('All');
const [locations, setLocations] = useState([]);

  const categoryPaths: { [key: string]: string } = {
  All: '', // Special case
  Food: 'food',
  Place: 'place',
  Market: 'market',
  Adventure: 'adventure',
  Art: 'art',
};



  useEffect(() => {
    const placesRef = ref(database, 'location'); 
    const unsubscribe = onValue(placesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPlaces = Object.values(data);
        setPlaces(loadedPlaces);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Explore</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search"
            placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
            style={[
              styles.searchInput,
              { color: textColor, backgroundColor: cardColor },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.nearMeButton,
              { backgroundColor: isDarkMode ? '#2e7d32' : '#E9F5EC' },
            ]}
          >
            <Icon name="location-outline" size={18} color={isDarkMode ? '#fff' : '#2e7d32'} />
            <Text style={[styles.nearMeText, { color: isDarkMode ? '#fff' : '#2e7d32' }]}>
              Near me
            </Text>
          </TouchableOpacity>
        </View>

        

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
  {['All', 'Food', 'Place', 'Market', 'Adventure', 'Art'].map((item, index) => {
    const isSelected = selectedCategory === item;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedCategory(item)}
        style={[
          styles.categoryButton,
          { backgroundColor: isSelected ? 'teal' : cardColor }
        ]}
      >
        <Text
          style={[
            styles.categoryText,
            { color: isSelected ? 'white' : textColor }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>


        <Text style={[styles.sectionTitle, { color: textColor }]}>Featured Places</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#43A047" />
        ) : (
          places.map((place, index) => (
            <TouchableOpacity key={index} style={[styles.card, { backgroundColor: cardColor }]}>
              <Image
                source={require('../../assets/images/garden-of-dreams.png')} // Replace with actual images later
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: textColor }]}>
                  {place.Name || 'Unknown Place'}
                </Text>
                <Text style={[styles.cardSub, { color: subTextColor }]}>
                  {place.category1}, {place.category2}
                </Text>
                <View style={styles.ratingRow}>
                  <Icon name="star" color="#FFA000" size={16} />
                  <Text style={[styles.rating, { color: textColor }]}>
                    {place.reviews || 'N/A'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
  },
  nearMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
  },
  nearMeText: { marginLeft: 4, fontWeight: '600' },
  categoryScroll: { marginBottom: 20 },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  categoryText: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { fontSize: 13, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { marginLeft: 4, fontWeight: 'bold' },
});

export default ExploreScreen;

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
import { useTheme } from '../theme-context';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

type Place = {
  Location: string;
  Name: string;
  category1: string;
  category2: string;
  description: string;
  reviews: number;
  image?: string;
};

type Places = {
  [key: string]: Place;
};

type Categories = {
  [categoryName: string]: {
    locationIds: string[];
  };
};

const ExploreScreen = () => {
  const navigation = useNavigation<any>();

  const { isDarkMode } = useTheme();
  const [places, setPlaces] = useState<Places>({});
  const [categories, setCategories] = useState<Categories>({});
  const [categoryList, setCategoryList] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNearby, setShowNearby] = useState(false);
  const [searchText, setSearchText] = useState('');

  const backgroundColor = isDarkMode ? '#121212' : '#FDFBEF';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';

  const [district, setDistrict] = useState('');

  type LocationItem = {
    id: string;
    Location: string;
    Name: string;
    category1: string;
    category2: string;
    description: string;
    image: string;
    reviews: number;
  };
  const [nearbyLocations, setNearbyLocations] = useState<LocationItem[]>([]);

  // Get district name from current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&addressdetails=1&accept-language=en`,
          {
            headers: {
              'User-Agent': 'MyApp/1.0 (example@email.com)',
              Accept: 'application/json',
            },
          }
        );
        const data = await response.json();

        const districtName =
          data.address?.county ||
          data.address?.state_district ||
          data.address?.state ||
          'Unknown District';

        setDistrict(districtName);
        console.log('District:', districtName);
      } catch (error) {
        console.error('Error getting district:', error);
      }
    })();
  }, []);

  // Load nearby locations based on district
  useEffect(() => {
    if (!district) return;

    const dbRef = ref(database, 'locations');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const matched: LocationItem[] = [];

      for (let key in data) {
        if (
          data[key].Location &&
          data[key].Location.toLowerCase().includes(district.toLowerCase())
        ) {
          matched.push({ id: key, ...data[key] });
        }
      }

      setNearbyLocations(matched);
      console.log('Nearby Locations:', matched);
    });
  }, [district]);

  // Load all places and categories
  useEffect(() => {
    const placesRef = ref(database, 'locations');
    const categoriesRef = ref(database, 'categories');

    const unsubscribePlaces = onValue(placesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlaces(data);
      setLoading(false);
    });

    const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setCategories(data);
      setCategoryList(['All', ...Object.keys(data)]);
    });

    return () => {
      unsubscribePlaces();
      unsubscribeCategories();
    };
  }, []);

  // Filter places by category and search text
  const filteredPlaces = (): [string, Place][] => {
    let filteredEntries: [string, Place][] = [];

    if (selectedCategory === 'All') {
      filteredEntries = Object.entries(places);
    } else {
      const ids = categories[selectedCategory]?.locationIds || [];
      filteredEntries = ids
        .map((id: string): [string, Place] => [id, places[id]])
        .filter(([_, place]) => place !== undefined);
    }

    // Apply search filter on Name or Location (case-insensitive)
    if (searchText.trim() !== '') {
      const lowerSearch = searchText.toLowerCase();
      filteredEntries = filteredEntries.filter(([_, place]) => {
        if (!place) return false;
        return (
          place.Name.toLowerCase().includes(lowerSearch) ||
          place.Location.toLowerCase().includes(lowerSearch)
        );
      });
    }

    return filteredEntries;
  };

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Explore</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search"
            placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
            style={[styles.searchInput, { color: textColor, backgroundColor: cardColor }]}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setShowNearby(false); // Hide nearby when typing search
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (nearbyLocations.length === 0) {
                alert('No locations found near you');
                setShowNearby(false);
              } else {
                setShowNearby(true);
                setSearchText(''); // Clear search when showing nearby
                setSelectedCategory('All'); // Reset category when showing nearby
              }
            }}
            style={[styles.nearMeButton, { backgroundColor: isDarkMode ? '#2e7d32' : '#E9F5EC' }]}
          >
            <Icon
              name="location-outline"
              size={18}
              color={isDarkMode ? '#fff' : '#2e7d32'}
            />
            <Text style={[styles.nearMeText, { color: isDarkMode ? '#fff' : '#2e7d32' }]}>
              Near me
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categoryList.map((item: string, index: number) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedCategory(item);
                  setShowNearby(false); // Hide nearby when switching category
                  setSearchText(''); // Clear search when changing category
                }}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: isSelected ? 'teal' : cardColor,
                    borderColor: isSelected ? 'teal' : '#ccc',
                  },
                ]}
              >
                <Text style={[styles.categoryText, { color: isSelected ? '#fff' : textColor }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Featured Places</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#43A047" />
        ) : showNearby ? (
          nearbyLocations.length === 0 ? (
            <Text style={{ color: subTextColor }}>No nearby locations found.</Text>
          ) : (
            nearbyLocations.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={[styles.card, { backgroundColor: cardColor }]}
                onPress={() => navigation.navigate('explore_each', { placeId: place.id })}
              >
                <Image
                  source={
                    place.image
                      ? { uri: place.image }
                      : require('../../assets/images/garden-of-dreams.png')
                  }
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: textColor }]}>
                    {place.Name || 'Unknown Place'}
                  </Text>
                  <Text style={[styles.cardSub, { color: subTextColor }]}>
                    {place.category1 || ''}, {place.category2 || ''}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" color="#FFA000" size={16} />
                    <Text style={[styles.rating, { color: textColor }]}>
                      {place.reviews !== undefined ? place.reviews : 'N/A'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : (
          filteredPlaces().map(([id, place]: [string, Place]) => (
            <TouchableOpacity
              key={id}
              style={[styles.card, { backgroundColor: cardColor }]}
              onPress={() => navigation.navigate('explore_each', { placeId: id })}
            >
              <Image
                source={
                  place?.image
                    ? { uri: place.image }
                    : require('../../assets/images/garden-of-dreams.png')
                }
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: textColor }]}>
                  {place?.Name || 'Unknown Place'}
                </Text>
                <Text style={[styles.cardSub, { color: subTextColor }]}>
                  {place?.category1 || ''}, {place?.category2 || ''}
                </Text>
                <View style={styles.ratingRow}>
                  <Icon name="star" color="#FFA000" size={16} />
                  <Text style={[styles.rating, { color: textColor }]}>
                    {place?.reviews !== undefined ? place.reviews : 'N/A'}
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

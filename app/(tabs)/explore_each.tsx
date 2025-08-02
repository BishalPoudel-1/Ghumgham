import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';

type Place = {
  Location: string;
  Name: string;
  category1: string;
  category2: string;
  description: string;
  reviews: number;
  image?: string;
  tags?: string[];
};

const LocationDetailScreen = () => {
  const { placeId } = useLocalSearchParams();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const subTextColor = isDarkMode ? '#ccc' : '#666';
  const descriptionColor = isDarkMode ? '#ddd' : '#444';
  const tagBgColor = isDarkMode ? '#333' : '#E1F5FE';
  const tagTextColor = isDarkMode ? '#90CAF9' : '#0277BD';

  useEffect(() => {
    if (!placeId || typeof placeId !== 'string') return;

    const placeRef = ref(database, `locations/${placeId}`);
    const unsubscribe = onValue(placeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlace(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [placeId]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={[styles.notFound, { color: 'red' }]}>Place not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Image
        source={
          place.image
            ? { uri: place.image }
            : require('../../assets/images/garden-of-dreams.png')
        }
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{place.Name}</Text>

        <View style={styles.row}>
          <Icon name="location-outline" size={18} color={subTextColor} />
          <Text style={[styles.subText, { color: subTextColor }]}>{place.Location}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="pricetag-outline" size={18} color={subTextColor} />
          <Text style={[styles.subText, { color: subTextColor }]}>{place.category1} | {place.category2}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="star" size={18} color="#FFD700" />
          <Text style={[styles.subText, { color: subTextColor }]}>{place.reviews} / 5.0</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
        <Text style={[styles.description, { color: descriptionColor }]}>{place.description}</Text>

        {place.tags && place.tags.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Tags</Text>
            <View style={styles.tagContainer}>
              {place.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: tagBgColor }]}>
                  <Text style={[styles.tagText, { color: tagTextColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subText: {
    marginLeft: 6,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFound: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LocationDetailScreen;

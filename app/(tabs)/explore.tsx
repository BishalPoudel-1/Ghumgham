import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useTheme } from '../theme-context';

const ExploreScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#121212' : '#FDFBEF';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Explore</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search"
            placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
            style={[styles.searchInput, { color: textColor, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
          />
          <TouchableOpacity style={[styles.nearMeButton, { backgroundColor: isDarkMode ? '#2e7d32' : '#E9F5EC' }]}>
            <Icon name="location-outline" size={18} color={isDarkMode ? '#fff' : '#2e7d32'} />
            <Text style={[styles.nearMeText, { color: isDarkMode ? '#fff' : '#2e7d32' }]}>Near me</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {['All', 'Food', 'Place', 'Market', 'Adventure', 'Art'].map((item, index) => (
            <TouchableOpacity key={index} style={[styles.categoryButton, { backgroundColor: cardColor }]}>
              <Text style={[styles.categoryText, { color: textColor }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Features Places</Text>

        <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]}>
          <Image
            source={require('../../assets/images/garden-of-dreams.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Garden of Dreams</Text>
            <Text style={[styles.cardSub, { color: subTextColor }]}>Relaxation, Lush Greenery</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" color="#FFA000" size={16} />
              <Text style={[styles.rating, { color: textColor }]}>4.7</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]}>
          <Image
            source={require('../../assets/images/basantapur.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: textColor }]}>Kathmandu Durbar Square</Text>
            <Text style={[styles.cardSub, { color: subTextColor }]}>Historic plaza, Collection of temples, courtyards, and statues</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" color="#FFA000" size={16} />
              <Text style={[styles.rating, { color: textColor }]}>4.9</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
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
  nearMeText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
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
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#FDFBEF',
  },
});

export default ExploreScreen;

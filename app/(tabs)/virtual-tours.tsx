import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';

export default function VirtualTourScreen() {
  const { isDarkMode } = useTheme();

  const tours = [
    {
      title: 'Garden of Dreams',
      rating: 4.7,
      description: 'Relaxation, Lush Greenery',
      image: '../../assets/images/garden-of-dreams.png',
    },
    {
      title: 'Kathmandu Durbar Square',
      rating: 4.9,
      description: 'Historic plaza, Collection of temples,\ncourtyards, and statues',
      image: '../../assets/images/basantapur.png',
    },
  ];

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const subTextColor = isDarkMode ? '#aaa' : '#555';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Virtual Tour</Text>

      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', borderColor: '#2E7D32' }]}>
          <Icon name="search-outline" size={18} color={subTextColor} style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={subTextColor}
            style={[styles.searchInput, { color: textColor }]}
          />
        </View>
        <TouchableOpacity style={[styles.nearMeBtn, { borderColor: '#2E7D32' }]}>
          <Icon name="location-outline" size={16} color="#2E7D32" />
          <Text style={styles.nearMeText}>Near me</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Best For You</Text>

        {tours.map((item, index) => (
          <View key={index} style={[styles.card, { backgroundColor: cardColor }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.vrIcon}>
              <Icon name="glasses-outline" size={20} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color="#FFA000" />
                <Text style={[styles.rating, { color: textColor }]}>{item.rating}</Text>
              </View>
              <Text style={[styles.description, { color: subTextColor }]}>{item.description}</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Icon name="glasses-outline" size={16} color="#2E7D32" />
                <Text style={styles.viewText}>View Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  nearMeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  nearMeText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 1,
  },
  image: {
    height: 170,
    width: '100%',
    resizeMode: 'cover',
  },
  vrIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#37474F',
    padding: 6,
    borderRadius: 20,
  },
  cardContent: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
    fontSize: 13,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  viewText: {
    marginLeft: 6,
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
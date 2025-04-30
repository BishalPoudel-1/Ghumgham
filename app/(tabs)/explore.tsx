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
import { useRouter } from 'expo-router'; // ✅ This is important
import { Stack } from 'expo-router';


const ExploreScreen = () => {
  const router = useRouter(); // ✅ Initialize router


  return (
    
    <View style={styles.wrapper}>
    

      <ScrollView style={styles.container}>
        {/* Heading */}
        <Text style={styles.title}>Explore</Text>

        {/* Search Bar and Near Me */}
        <View style={styles.searchRow}>
          <TextInput placeholder="Search" style={styles.searchInput} />
          <TouchableOpacity style={styles.nearMeButton}>
            <Icon name="location-outline" size={18} color="#2e7d32" />
            <Text style={styles.nearMeText}>Near me</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {['All', 'Food', 'Place', 'Market', 'Adventure', 'Art'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Places */}
        <Text style={styles.sectionTitle}>Features Places</Text>

        {/* Card 1 */}
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/garden-of-dreams.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Garden of Dreams</Text>
            <Text style={styles.cardSub}>Relaxation, Lush Greenery</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" color="#FFA000" size={16} />
              <Text style={styles.rating}>4.7</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity style={styles.card}>
          <Image
            source={require('../../assets/images/basantapur.png')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Kathmandu Durbar Square</Text>
            <Text style={styles.cardSub}>
              Historic plaza, Collection of temples, courtyards, and statues
            </Text>
            <View style={styles.ratingRow}>
              <Icon name="star" color="#FFA000" size={16} />
              <Text style={styles.rating}>4.9</Text>
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
    backgroundColor: '#FDFBEF',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
  },
  nearMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F5EC',
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 40,
  },
  nearMeText: {
    color: '#2e7d32',
    marginLeft: 4,
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  card: {
    backgroundColor: '#fff',
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
    color: '#666',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#444',
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

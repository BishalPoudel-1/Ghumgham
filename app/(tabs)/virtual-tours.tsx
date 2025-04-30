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

export default function VirtualTourScreen() {
  const tours = [
    {
      title: 'Garden of Dreams',
      rating: 4.7,
      description: 'Relaxation, Lush Greenery',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Garden_of_Dreams.jpg/800px-Garden_of_Dreams.jpg',
    },
    {
      title: 'Kathmandu Durbar Square',
      rating: 4.9,
      description: 'Historic plaza, Collection of temples,\ncourtyards, and statues',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Kathmandu_Durbar_Square_02.jpg/800px-Kathmandu_Durbar_Square_02.jpg',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Virtual Tour</Text>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color="#555" style={{ marginRight: 6 }} />
          <TextInput placeholder="Search" placeholderTextColor="#555" style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.nearMeBtn}>
          <Icon name="location-outline" size={16} color="#2E7D32" />
          <Text style={styles.nearMeText}>Near me</Text>
        </TouchableOpacity>
      </View>

      {/* Virtual Tour Cards */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Best For You</Text>

        {tours.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.vrIcon}>
              <Icon name="glasses-outline" size={20} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={16} color="#FFA000" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
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
      backgroundColor: '#F8F9EA',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#263238',
      marginBottom: 14,
    },
    searchRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    searchBox: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: '#fff',
      borderColor: '#2E7D32',
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
      color: '#333',
    },
    nearMeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#2E7D32',
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
      color: '#263238',
    },
    card: {
      backgroundColor: '#fff',
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
      color: '#263238',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    rating: {
      fontSize: 14,
      marginLeft: 4,
      color: '#263238',
      fontWeight: '600',
    },
    description: {
      marginTop: 4,
      fontSize: 13,
      color: '#555',
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
  
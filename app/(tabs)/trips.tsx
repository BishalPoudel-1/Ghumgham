import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MyTripsScreen() {
  const [activeTab, setActiveTab] = useState('Current');

  const tripItems = [
    { date: 'Sunday, Jan 29', title: 'Hotel Nilakantha Pvt. Ltd', icon: 'business-outline' },
    { date: 'Sunday, Feb 6', title: 'Kathmandu To Pokhara', icon: 'bus-outline' },
    { date: 'Tuesday, Jan 8', title: 'Paragliding', icon: 'airplane-outline' },
  ];

  const aiPlanItems = [
    {
      date: 'Tuesday, Jan 8',
      title: 'Hotel Nilakantha Pvt. Ltd',
      description: 'Check-in and relax after your arrival. Explore nearby Thamel market in the evening for local food and shopping.',
      icon: 'business-outline',
    },
    {
      date: 'Monday, Jan 30',
      title: 'Pashupatinath Temple',
      description: 'Visit one of the most sacred Hindu temples and experience its spiritual atmosphere.',
      icon: 'leaf-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Trips</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Current', 'Upcoming', 'Past'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn}>
        <Icon name="add" size={16} color="#fff" />
        <Text style={styles.createBtnText}>Create New Trip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Trip List */}
        <Text style={styles.sectionTitle}>Kathmandu, Nepal</Text>
        {tripItems.map((item, index) => (
          <View key={index} style={styles.tripCard}>
            <Icon name={item.icon} size={20} color="#43A047" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.tripDate}>{item.date}</Text>
              <Text style={styles.tripTitle}>{item.title}</Text>
            </View>
          </View>
        ))}

        {/* AI Suggested Plan */}
        <Text style={styles.sectionTitle}>AI-Suggested Plan</Text>
        {aiPlanItems.map((item, index) => (
          <View key={index} style={styles.tripCard}>
            <Icon name={item.icon} size={20} color="#43A047" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.tripDate}>{item.date}</Text>
              <Text style={styles.tripTitle}>{item.title}</Text>
              <Text style={styles.tripDesc}>{item.description}</Text>
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
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 6,
    fontSize: 16,
    color: '#777',
  },
  activeTab: {
    color: '#43A047',
    borderBottomWidth: 2,
    borderColor: '#43A047',
  },
  createBtn: {
    flexDirection: 'row',
    backgroundColor: '#43A047',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  createBtnText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    color: '#37474F',
  },
  tripCard: {
    backgroundColor: '#FDFDF5',
    borderWidth: 1,
    borderColor: '#43A047',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripDate: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#263238',
  },
  tripTitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  tripDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    maxWidth: '95%',
  },
});

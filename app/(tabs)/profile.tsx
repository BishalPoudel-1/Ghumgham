import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="create-outline" size={20} color="#333" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Bishal Poudel</Text>
          <Text style={styles.subtitle}>Solo Traveler | 5 Countries</Text>
        </View>

        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Profile</Text>
          <Text style={styles.tab}>History</Text>
          <Text style={styles.tab}>Setting</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>Bishalpoudel123@gmail.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>9898989898</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>Kathmandu, Nepal</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>25</Text>
              <Text style={styles.statLabel}>Cities</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>75</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>
      </ScrollView>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    marginHorizontal: 15,
    fontSize: 16,
    paddingVertical: 10,
    color: '#777',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#43A047',
    color: '#43A047',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    color: '#555',
    fontSize: 14,
  },
  value: {
    fontSize: 15,
    color: '#222',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#43A047',
  },
  statLabel: {
    color: '#333',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

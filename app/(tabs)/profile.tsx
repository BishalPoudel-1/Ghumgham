import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';

export default function profile() {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#444' : '#ccc';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="create-outline" size={20} color={textColor} />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: textColor }]}>Bishal Poudel</Text>
          <Text style={[styles.subtitle, { color: subTextColor }]}>Solo Traveler | 5 Countries</Text>
        </View>

        <View style={[styles.tabContainer, { borderColor }]}>
          <Text style={[styles.tab, styles.activeTab]}>Profile</Text>
          <Text style={[styles.tab, { color: subTextColor }]}>History</Text>
          <Text style={[styles.tab, { color: subTextColor }]}>Setting</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: subTextColor }]}>Email</Text>
            <Text style={[styles.value, { color: textColor }]}>Bishalpoudel123@gmail.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: subTextColor }]}>Phone</Text>
            <Text style={[styles.value, { color: textColor }]}>9898989898</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: subTextColor }]}>Location</Text>
            <Text style={[styles.value, { color: textColor }]}>Kathmandu, Nepal</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Travel Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>Countries</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>25</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>Cities</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>75</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>Reviews</Text>
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
  },
  subtitle: {},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    marginHorizontal: 15,
    fontSize: 16,
    paddingVertical: 10,
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
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 15,
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
  statLabel: {},
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

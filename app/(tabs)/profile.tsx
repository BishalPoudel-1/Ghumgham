import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { auth, database } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';


export default function Profile() {
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#444' : '#ccc';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
            });
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity
  style={styles.editIcon}
  onPress={() => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.warn('Logout error:', error.message);
      });
  }}
>
  <Icon name="log-out-outline" size={20} color={textColor} />
</TouchableOpacity>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: textColor }]}>
            {userData.name || 'Loading...'}
          </Text>
          <Text style={[styles.subtitle, { color: subTextColor }]}>
            Solo Traveler | 5 Countries
          </Text>
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
            <Text style={[styles.value, { color: textColor }]}>{userData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: subTextColor }]}>Phone</Text>
            <Text style={[styles.value, { color: textColor }]}>{userData.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: subTextColor }]}>Location</Text>
            <Text style={[styles.value, { color: textColor }]}>{userData.location}</Text>
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
});

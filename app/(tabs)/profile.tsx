import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, logoutUser } from '../../firebase/userservice';
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

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  photoURL?: string;
  description?: string;
  countryCount?: number;
  countriesVisited?: number;
  citiesVisited?: number;
  reviewsWritten?: number;
}

export default function Profile() {
  const { isDarkMode } = useTheme();
 const [userData, setUserData] = useState<UserData>({
  name: '',
  email: '',
  phone: '',
  location: '',
  photoURL: '',
  description: '',
  countryCount: 0,
  countriesVisited: 0,
  citiesVisited: 0,
  reviewsWritten: 0,
});
const router = useRouter();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const subTextColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#444' : '#ccc';
  const [selectedTab, setSelectedTab] = useState<'Profile' | 'History' | 'Setting'>('Profile');


 useEffect(() => {
  getCurrentUser()
  .then((data) => {
    const user = data as UserData;  // type assertion here
    setUserData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      photoURL: user.photoURL || '',
      description: user.description || '',
      countryCount: user.countryCount || 0,
      countriesVisited: user.countriesVisited || 0,
      citiesVisited: user.citiesVisited || 0,
      reviewsWritten: user.reviewsWritten || 0,
    });
    })
    .catch((error) => {
      console.warn('Error fetching user:', error);
    });
}, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity
  style={styles.editIcon}
 onPress={() => {
  logoutUser()
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
  {['Profile', 'History', 'Setting'].map((tab) => (
    <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab as any)}>
      <Text
        style={[
          styles.tab,
          selectedTab === tab ? styles.activeTab : { color: subTextColor },
        ]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  ))}
</View>
{selectedTab === 'Profile' && (
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
  </View>
  
)}

{selectedTab === 'History' && (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: textColor }]}>History</Text>
    <Text style={{ color: subTextColor }}>No travel history yet.</Text>
  </View>
)}

{selectedTab === 'Setting' && (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: textColor }]}>Settings</Text>

    <TouchableOpacity style={styles.settingItem} onPress={() => router.push('../update_profile_page')}>
     
      <Text style={[styles.settingText, { color: textColor }]}>Edit Profile</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Change Password')}>
      <Text style={[styles.settingText, { color: textColor }]}>Change Password</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Dark Mode Toggle')}>
      <Text style={[styles.settingText, { color: textColor }]}>Toggle Dark Mode</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Change Language')}>
      <Text style={[styles.settingText, { color: textColor }]}>Language</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => {
  logoutUser()
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.warn('Logout error:', error.message);
    });
}}
    >
      <Text style={[styles.settingText, { color: 'red' }]}>Log Out</Text>
    </TouchableOpacity>
  </View>
)}



  

        
      </ScrollView>
    </SafeAreaView>
    
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },settingItem: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: '#ccc',
},
settingText: {
  fontSize: 16,
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

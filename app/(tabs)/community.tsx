import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, onValue } from 'firebase/database';
import { auth, database } from '../../firebaseConfig';

// ✅ Define the shape of user data
type Traveler = {
  name?: string;
  email?: string;
  image?: string;
  location?: string;
  phone?: string;
};

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('Feed');
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? '#fff' : '#222';
  const mutedText = isDarkMode ? '#aaa' : '#777';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#fff';
  const containerBg = isDarkMode ? '#121212' : '#F8F9EA';

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user || !user.email) return;

    const emailKey = user.email.replace(/\./g, '_');
    const currentUserRef = dbRef(database, `users/${emailKey}`);

    onValue(currentUserRef, (snapshot) => {
      const currentUserData = snapshot.val();
      const currentLocation = currentUserData?.location || '';

      const allUsersRef = dbRef(database, 'users');
      onValue(allUsersRef, (snapshot) => {
        const data = snapshot.val();
        const filtered: Traveler[] = [];

        for (const key in data) {
          const entry = data[key];

          const isSameUser = key === emailKey;
          const isSameLocation =
            entry?.location?.toLowerCase() === currentLocation.toLowerCase();

          if (!isSameUser && isSameLocation) {
            filtered.push(entry);
          }
        }

        setTravelers(filtered);
      });
    });
  });

  return () => unsubscribe();
}, []);

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={[styles.header, { color: textColor }]}>Community</Text>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: isDarkMode ? '#555' : '#ccc' }]}>
          {['Feed', 'Event', 'Message'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? '#43A047' : mutedText },
                  activeTab === tab && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Travelers */}
        <View style={styles.travelersHeader}>
          <Text style={[styles.subHeading, { color: textColor }]}>Nearby Travelers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20 }}>
          {travelers.length > 0 ? (
            travelers.map((item, index) => (
              <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require('../../assets/images/arpan.png')
                  }
                  style={styles.avatar}
                />
                <Text style={[styles.avatarName, { color: textColor }]}>
                  {item.name || 'Traveler'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: mutedText, paddingLeft: 20, paddingTop: 10 }}>
              No travelers nearby.
            </Text>
          )}
        </ScrollView>

        {/* Sample Post */}
        <View style={[styles.postCard, { backgroundColor: cardBackground }]}>
          <View style={styles.postHeader}>
            <Image source={require('../../assets/images/bishal.png')} style={styles.avatarSmall} />
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.posterName, { color: textColor }]}>Bishal Poudel</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={[styles.timestamp, { color: mutedText }]}>
                2 Hour ago, Garden of Dream, Kathmandu
              </Text>
            </View>
          </View>
          <Text style={[styles.postText, { color: textColor }]}>
            It's an ideal spot for relaxation, reading, or enjoying a quiet moment amidst nature.
          </Text>
          <Image
            source={require('../../assets/images/garden.png')}
            style={styles.postImage}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
  },
  activeTab: {
    fontWeight: '600',
  },
  underline: {
    height: 2,
    backgroundColor: '#43A047',
    marginTop: 4,
  },
  travelersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    color: '#43A047',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 12,
  },
  avatarName: {
    fontSize: 12,
    marginTop: 4,
  },
  postCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  posterName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  verifiedBadge: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: '#43A047',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
  },
  postText: {
    fontSize: 14,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
});

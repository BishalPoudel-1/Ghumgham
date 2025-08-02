import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Type definitions for trip data
type Destination = {
  location: string;
  stay?: string;
  activities?: string[];
};

type Trip = {
  name: string;
  dates: {
    start: string; // ISO date string
    end: string;
  };
  destinations?: Destination[];
  transport?: string[];
};

// Define your navigation stack param list including CreateNewTrip screen
type RootStackParamList = {
  MyTripsScreen: undefined;
  CreateNewTrip: { userId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyTripsScreen'>;

export default function MyTripsScreen() {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'past'>('current');
  const [trips, setTrips] = useState<Trip[]>([]);
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const mutedText = isDarkMode ? '#aaa' : '#555';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#FDFDF5';
  const borderColor = isDarkMode ? '#555' : '#ccc';

  function stripTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      setTrips([]);
      return;
    }

    const userId = user.uid;
    const userTripsRef = ref(database, `trips/userTrips/${userId}`);

    const unsubscribe = onValue(userTripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tripsData = data as Record<string, Trip>;
        const now = stripTime(new Date());

        const filtered = Object.values(tripsData).filter((trip) => {
          if (!trip.dates || !trip.dates.start || !trip.dates.end) {
            console.log(`Skipping trip ${trip.name}: Missing dates`);
            return false;
          }

          const startDate = stripTime(new Date(trip.dates.start));
          const endDate = stripTime(new Date(trip.dates.end));

          if (activeTab === 'current') {
            return now >= startDate && now <= endDate;
          } else if (activeTab === 'upcoming') {
            return startDate > now;
          } else if (activeTab === 'past') {
            return endDate < now;
          }
          return false;
        });
        console.log('Filtered trips:', filtered.map((t) => t.name));
        setTrips(filtered);
      } else {
        setTrips([]);
      }
    });

    return () => unsubscribe();
  }, [activeTab]);

  function handleCreateTrip() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    navigation.navigate('CreateNewTrip', { userId: user.uid });
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>My Trips</Text>

      {/* Tabs */}
      <View style={[styles.tabs, { borderColor }]}>
        {['current', 'upcoming', 'past'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as 'current' | 'upcoming' | 'past')}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tab,
                { color: mutedText },
                activeTab === tab && { color: '#43A047', borderBottomWidth: 2, borderColor: '#43A047' },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create New Trip Button */}
      <TouchableOpacity style={styles.createBtn} onPress={handleCreateTrip}>
        <Icon name="add" size={18} color="#fff" />
        <Text style={styles.createBtnText}>Create New Trip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {trips.length === 0 ? (
          <Text style={{ color: mutedText, marginTop: 20 }}>No trips available.</Text>
        ) : (
          trips.map((trip, index) => (
            <View key={index} style={[styles.tripCard, { backgroundColor: cardBackground }]}>
              <Text style={[styles.tripName, { color: textColor }]}>{trip.name}</Text>

              {/* Destinations */}
              {trip.destinations && trip.destinations.length > 0 && (
                <View style={{ marginTop: 6 }}>
                  <Text style={[styles.subHeader, { color: mutedText }]}>Destinations:</Text>
                  {trip.destinations.map((dest, i) => (
                    <View key={i} style={{ marginLeft: 10, marginBottom: 4 }}>
                      <Text style={[styles.destName, { color: textColor }]}>
                        • {dest.location} — Stay: {dest.stay || 'N/A'}
                      </Text>
                      {dest.activities && dest.activities.length > 0 && (
                        <Text style={[styles.destActivities, { color: mutedText }]}>
                          Activities: {dest.activities.join(', ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Transport */}
              {trip.transport && trip.transport.length > 0 && (
                <View style={{ marginTop: 6 }}>
                  <Text style={[styles.subHeader, { color: mutedText }]}>Transport:</Text>
                  {trip.transport.map((t, i) => (
                    <Text key={i} style={[styles.transportText, { color: textColor }]}>
                      - {t}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  tabButton: {
    marginRight: 25,
    paddingBottom: 6,
  },
  tab: {
    fontSize: 16,
    fontWeight: '600',
  },
  createBtn: {
    flexDirection: 'row',
    backgroundColor: '#43A047',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  createBtnText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tripCard: {
    borderWidth: 1,
    borderColor: '#43A047',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  tripName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subHeader: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  destName: {
    fontSize: 14,
  },
  destActivities: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  transportText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

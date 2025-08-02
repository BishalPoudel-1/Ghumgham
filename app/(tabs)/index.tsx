import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme-context';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref, off } from 'firebase/database';
import { auth, database } from '../../firebase/firebaseConfig';

// Types outside component
type FeaturedDestination = {
  title?: string;
  subtitle?: string;
  id?: string;
  imageUrl?: string;
  image: string;
  Name: string;
  Location: string;
};

type Trip = {
  id: string;
  category: string;
  createdAt: string;
  dates: {
    start: string;
    end: string;
  };
  icon: string;
  name: string;
};

type Recommendation = {
  title: string;
  desc: string;
  imageUrl: string;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const {
    isDarkMode,
    toggleTheme,
    backgroundColor,
    rippleStyle,
    startRipple,
  } = useTheme();

  const [featuredDestinations, setFeaturedDestinations] = useState<FeaturedDestination[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [exploreLocations, setExploreLocations] = useState<FeaturedDestination[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [userIdKey, setUserIdKey] = useState<string | null>(null);

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Load exploreLocations from database once
  useEffect(() => {
    const allLocationsRef = ref(database, 'locations');
    const listener = onValue(allLocationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter out featuredDestinations and recommendations if present
        const allKeys = Object.keys(data).filter(
          (key) => key !== 'featuredDestinations' && key !== 'recommendations'
        );
        const exploreList = allKeys.map((key) => data[key]);
        setExploreLocations(exploreList);
      }
    });
    return () => off(allLocationsRef, 'value', listener);
  }, []);

  // Auth listener + load user info, featured, recommendations + set userIdKey for trips
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/firstpage');
      } else {
        setGreeting(getGreeting());
        const emailKey = user.email?.replace(/\./g, '_') || null;
        const userId = user.uid;
        setUserIdKey(userId);

        // User data
        const userRef = ref(database, `users/${emailKey}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data?.name) {
            setUserName(data.name);
          }
        });

        // Featured destinations & recommendations come from the same 'locations' path
        const locationsRef = ref(database, 'locations');
        onValue(locationsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Assuming featuredDestinations and recommendations are nested keys
            setFeaturedDestinations(
              data.featuredDestinations ? Object.values(data.featuredDestinations) as FeaturedDestination[] : []
            );
            setRecommendations(
              data.recommendations ? Object.values(data.recommendations) as Recommendation[] : []
            );
          }
        });
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch trips for logged-in user dynamically from Firebase
  useEffect(() => {
    if (!userIdKey) return;

    const tripsRef = ref(database, `trips/userTrips/${userIdKey}`);

    const tripsListener = onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tripList: Trip[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          category: value.category,
          createdAt: value.createdAt,
          dates: value.dates,
          icon: value.icon,
          name: value.name,
        }));
        setTrips(tripList);
      } else {
        setTrips([]);
      }
    });

    return () => off(tripsRef, 'value', tripsListener);
  }, [userIdKey]);

  const quickActions = [
    { label: 'Plan Trip', icon: 'navigate-outline', route: '/trips' },
    { label: 'Explore', icon: 'accessibility-outline', route: '/explore' },
    { label: 'Expenses', icon: 'wallet-outline', route: '/expenses' },
    { label: 'Community', icon: 'people-outline', route: '/community' },
  ];

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={rippleStyle} pointerEvents="none" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => router.push('/profile' as any)}
          >
            <Image
              source={require('../../assets/images/avatar.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greeting, isDarkMode && { color: '#aaa' }]}>
                {greeting}
              </Text>
              <Text style={[styles.name, isDarkMode && { color: '#fff' }]}>
                {userName || 'Loading...'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.icons}>
            <Icon
              name="notifications-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#333'}
            />
            <TouchableOpacity
              onPress={(e) => {
                const { locationX, locationY } = e.nativeEvent;
              
                toggleTheme(0, 0);
              }}
            >
              <Icon
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={24}
                color={isDarkMode ? '#fff' : '#333'}
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActions}>
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.action}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.iconCircle}>
                <Icon name={item.icon} size={24} color="#F8F9EA" />
              </View>
              <Text style={[styles.actionLabel, isDarkMode && { color: '#eee' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Discover More Section */}
        <Text style={[styles.sectionTitle, isDarkMode && { color: '#eee' }]}>
          Discover More
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          style={{ marginVertical: 10 }}
        >
          {exploreLocations.length > 0 ? (
            exploreLocations.map((location: FeaturedDestination, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.exploreCard,
                  isDarkMode && { backgroundColor: '#1e1e1e' },
                  { marginRight: 12 },
                ]}
                onPress={() => router.push(`/explore`)}
              >
                <Image
                  source={{ uri: location.image }}
                  style={styles.exploreImage}
                  resizeMode="cover"
                />
                <View style={styles.exploreText}>
                  <Text style={[styles.exploreTitle, isDarkMode && { color: '#fff' }]}>
                    {location.Name}
                  </Text>
                  <Text style={[styles.exploreSubtitle, isDarkMode && { color: '#aaa' }]}>
                    {location.Location}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: isDarkMode ? '#eee' : '#333' }}>No locations found.</Text>
          )}
        </ScrollView>

        {/* Upcoming Trips Section */}
        <Text style={[styles.sectionTitle, isDarkMode && { color: '#eee' }]}>
          Upcoming Trips
        </Text>

        <ScrollView
          style={{ maxHeight: 300, paddingHorizontal: 20, marginBottom: 20 }}
          showsVerticalScrollIndicator={true}
        >
          {trips.length > 0 ? (
            trips.map((trip) => (
              <View
                key={trip.id}
                style={[
                  styles.tripCard,
                  isDarkMode && { backgroundColor: '#1e1e1e' },
                ]}
              >
                <Text style={[styles.tripLocations, isDarkMode && { color: '#fff' }]}>
                  {trip.name}
                </Text>
                <Text style={[styles.tripDates, isDarkMode && { color: '#aaa' }]}>
                  {trip.dates.start} - {trip.dates.end}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: isDarkMode ? '#eee' : '#333' }}>
              No trips planned.
            </Text>
          )}
        </ScrollView>
      </ScrollView>
    </Animated.View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#777',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  icons: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  iconCircle: {
    backgroundColor: '#43A047',
    borderRadius: 25,
    padding: 12,
    marginBottom: 8,
  },
  action: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginVertical: 10,
    color: '#37474F',
  },
  exploreCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  exploreImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  exploreText: {
    padding: 10,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exploreSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  tripCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  tripLocations: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  tripDates: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

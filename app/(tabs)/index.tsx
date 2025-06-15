import React, { useEffect } from 'react';
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
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme-context';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust the path if needed

const HomeScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isDarkMode,
    toggleTheme,
    backgroundColor,
    rippleStyle,
    startRipple,
  } = useTheme();

  // ✅ Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/firstpage'); // redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* Ripple animation overlay */}
      <Animated.View style={rippleStyle} pointerEvents="none" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.greeting, isDarkMode && { color: '#aaa' }]}>
              Good Morning
            </Text>
            <Text style={[styles.name, isDarkMode && { color: '#fff' }]}>
              Bishal Poudel
            </Text>
          </View>
          <View style={styles.icons}>
            <Icon
              name="notifications-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#333'}
            />
            <TouchableOpacity
              onPress={(e) => {
                const { locationX, locationY } = e.nativeEvent;
                startRipple(locationX, locationY);
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

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {['Plan Trip', 'Booking', 'Expenses', 'Save Places'].map((label, index) => (
            <View key={index} style={styles.action}>
              <View style={styles.iconCircle}>
                <Icon name="calendar-outline" size={24} color="#F8F9EA" />
              </View>
              <Text style={[styles.actionLabel, isDarkMode && { color: '#eee' }]}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Featured Destinations */}
        <Text style={[styles.sectionTitle, isDarkMode && { color: '#eee' }]}>
          Featured Destinations
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              title: 'Bali, Indonesia',
              subtitle: 'Sun-kissed Beaches & Balinese Spirit',
              image: require('../../assets/images/bali.png'),
            },
            {
              title: 'Kathmandu, Nepal',
              subtitle: 'Swayambhunath & Spiritual Serenity',
              image: require('../../assets/images/kathmandu.png'),
            },
            {
              title: 'Agra, India',
              subtitle: 'Majestic Taj Mahal & Heritage',
              image: require('../../assets/images/agra.png'),
            },
          ].map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={[styles.cardTitle, isDarkMode && { color: '#fff' }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardSubtitle, isDarkMode && { color: '#aaa' }]}>
                {item.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Recommendations */}
        <Text style={[styles.sectionTitle, isDarkMode && { color: '#eee' }]}>
          Today’s Recommendations
        </Text>
        <View style={styles.recommendationContainer}>
          {[
            {
              title: 'Swayambhunath',
              desc: 'Ancient religious complex\nHilltop, surrounded by playful monkeys.',
              image: require('../../assets/images/kathmandu.png'),
            },
            {
              title: 'Patan Durbar Square',
              desc: 'Rich history, Newari architecture, and UNESCO site',
              image: require('../../assets/images/patan.png'),
            },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.recommendationCard,
                isDarkMode && { backgroundColor: '#1e1e1e' },
              ]}
            >
              <Image source={item.image} style={styles.recommendationImage} />
              <View style={styles.recommendationText}>
                <Text style={[styles.recommendationTitle, isDarkMode && { color: '#fff' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.recommendationDesc, isDarkMode && { color: '#aaa' }]}>
                  {item.desc}
                </Text>
                <TouchableOpacity style={styles.activitiesButton}>
                  <Text style={styles.activitiesText}>Activities</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
  card: {
    width: 180,
    marginLeft: 20,
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#263238',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  recommendationContainer: {
    paddingHorizontal: 20,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recommendationImage: {
    width: 110,
    height: 110,
  },
  recommendationText: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
  },
  recommendationDesc: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
  },
  activitiesButton: {
    backgroundColor: '#43A047',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  activitiesText: {
    fontSize: 12,
    color: '#fff',
  },
});

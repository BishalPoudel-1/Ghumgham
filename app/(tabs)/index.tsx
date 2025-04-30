import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

const featuredDestinations = [
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
];

const recommendations = [
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
];

const HomeScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.name}>Bishal Poudel</Text>
          </View>
          <View style={styles.icons}>
            <Icon name="notifications-outline" size={24} color="#333" />
            <Icon name="moon" size={24} color="#333" style={{ marginLeft: 16 }} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {['Plan Trip', 'Booking', 'Expenses', 'Save Places'].map((label, index) => (
            <View key={index} style={styles.action}>
              <View style={styles.iconCircle}>
                <Icon name="calendar-outline" size={24} color="#F8F9EA" />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Featured Destinations */}
        <Text style={styles.sectionTitle}>Featured Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredDestinations.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Today’s Recommendation’s</Text>
        <View style={styles.recommendationContainer}>
          {recommendations.map((item, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Image source={item.image} style={styles.recommendationImage} />
              <View style={styles.recommendationText}>
                <Text style={styles.recommendationTitle}>{item.title}</Text>
                <Text style={styles.recommendationDesc}>{item.desc}</Text>
                <TouchableOpacity style={styles.activitiesButton}>
                  <Text style={styles.activitiesText}>Activities</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

     
    </SafeAreaView>
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#F8F9EA',
  },
  moreMenuOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    zIndex: 99,
  },
  moreMenuBox: {
    width: '100%',
    backgroundColor: '#F8F9EA',
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  moreItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  moreLabel: {
    fontSize: 12,
    color: '#37474F',
    marginTop: 6,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
});

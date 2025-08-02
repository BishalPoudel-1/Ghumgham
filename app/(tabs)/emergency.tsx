import React ,{ useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme-context';
import { getCachedWeather } from './WeatherFetcher';
import { fetchAndCacheWeather } from './WeatherFetcher';

import * as Location from 'expo-location';

export default function SafetyEmergencyScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardColor = isDarkMode ? '#1e1e1e' : '#FFF3C4';
  const cardText = isDarkMode ? '#fff' : '#37474F';
  const subText = isDarkMode ? '#aaa' : '#757575';
 const [weather, setweather] = useState<any>(null);

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    await fetchAndCacheWeather(latitude, longitude);
  })();
}, []);

 
  useEffect(() => {
    const loadWeather = async () => {
      const data = await getCachedWeather();
      setweather(data);
    };
    loadWeather();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: cardText }]}>Safety & Emergency</Text>

    {/* Weather Info */}
<View style={styles.section}>
  <Text style={[styles.subHeader, { color: cardText }]}>Current Weather</Text>
  {weather ? (
    <>
      <Text style={[styles.location, { color: subText }]}>
        {weather?.city ?? 'Unknown location'}
      </Text>
      <View style={styles.weatherRow}>
        <Icon name="cloud-outline" size={30} color="#388E3C" />
        <Text style={styles.weatherText}>
          {weather?.temp != null ? `${weather.temp}°C` : 'N/A'}
        </Text>
      </View>
    </>
  ) : (
    <Text style={[styles.location, { color: subText }]}>Loading...</Text>
  )}
</View>


      {/* Hospital & Embassy Cards */}
      <View style={styles.cardRow}>
        <View style={[styles.infoCard, { backgroundColor: cardColor }]}>
          <Icon name="business" size={40} color="#388E3C" />
          <Text style={[styles.cardTitle, { color: cardText }]}>Nearby Hospitals</Text>
          <Text style={[styles.cardSubText, { color: subText }]}>Find medical help</Text>
         <TouchableOpacity 
          style={styles.navigateBtn} 
          onPress={() => router.push('/tourmap?search=hospital')}
        >
          <Text style={styles.navigateText}>
            Navigate <Icon name="navigate" size={14} />
          </Text>
        </TouchableOpacity>
      
        </View>

        <View style={[styles.infoCard, { backgroundColor: cardColor }]}>
          <Icon name="business" size={40} color="#388E3C" />
          <Text style={[styles.cardTitle, { color: cardText }]}>Embassy Locator</Text>
          <Text style={[styles.cardSubText, { color: subText }]}>Find Your Embassy</Text>
          <TouchableOpacity 
            style={styles.navigateBtn} 
            onPress={() => router.push('/tourmap?search=embassy')}
          >
            <Text style={styles.navigateText}>
              Navigate <Icon name="navigate" size={14} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.subHeader, { marginHorizontal: 20, color: cardText }]}>
  Emergency Contacts
</Text>

<View style={[styles.contactBox, { backgroundColor: cardColor }]}>
  {/* Police */}
  <View style={styles.contactRow}>
    <Icon name="shield-outline" size={22} color="#2E7D32" />
    <Text style={[styles.contactLabel, { color: cardText }]}>Police</Text>
    <TouchableOpacity
      onPress={() => Linking.openURL('tel:100')}
      style={styles.callButton}
    >
      <Text style={styles.callButtonText}>100</Text>
    </TouchableOpacity>
  </View>

  {/* Ambulance */}
  <View style={styles.contactRow}>
    <Icon name="medical-outline" size={22} color="#2E7D32" />
    <Text style={[styles.contactLabel, { color: cardText }]}>Ambulance</Text>
    <TouchableOpacity
      onPress={() => Linking.openURL('tel:150')}
      style={styles.callButton}
    >
      <Text style={styles.callButtonText}>150</Text>
    </TouchableOpacity>
  </View>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    paddingHorizontal: 20,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  weatherText: {
    fontSize: 20,
    marginLeft: 10,
    color: '#2E7D32',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  infoCard: {
    width: '45%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  cardSubText: {
    fontSize: 12,
    marginVertical: 4,
    textAlign: 'center',
  },
  navigateBtn: {
    marginTop: 5,
    backgroundColor: '#FFF9E1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  navigateText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: 'bold',
  },
  contactBox: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  contactLabel: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sosButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 25,
  },callButton: {
  backgroundColor: '#D32F2F',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  marginLeft: 'auto',
},

callButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});

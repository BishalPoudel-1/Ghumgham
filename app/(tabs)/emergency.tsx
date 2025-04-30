import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function SafetyEmergencyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Safety & Emergency</Text>

      {/* Weather Info */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Current Weather</Text>
        <Text style={styles.location}>Kathmandu, Nepal</Text>
        <View style={styles.weatherRow}>
          <Icon name="cloud-outline" size={30} color="#388E3C" />
          <Text style={styles.weatherText}>24°C</Text>
        </View>
      </View>

      {/* Hospital & Embassy Cards */}
      <View style={styles.cardRow}>
        <View style={styles.infoCard}>
          <Icon name="business" size={40} color="#388E3C" />
          <Text style={styles.cardTitle}>Nearby Hospitals</Text>
          <Text style={styles.cardSubText}>Find medical help</Text>
          <TouchableOpacity style={styles.navigateBtn}>
            <Text style={styles.navigateText}>Navigate <Icon name="navigate" size={14} /></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Icon name="business" size={40} color="#388E3C" />
          <Text style={styles.cardTitle}>Embassy Locator</Text>
          <Text style={styles.cardSubText}>Find Your Embassy</Text>
          <TouchableOpacity style={styles.navigateBtn}>
            <Text style={styles.navigateText}>Navigate <Icon name="navigate" size={14} /></Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contacts */}
      <Text style={[styles.subHeader, { marginHorizontal: 20 }]}>Emergency Contacts</Text>
      <View style={styles.contactBox}>
        <View style={styles.contactRow}>
          <Icon name="shield-outline" size={22} color="#2E7D32" />
          <Text style={styles.contactLabel}>Police</Text>
          <Text style={styles.contactValue}>100</Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="medical-outline" size={22} color="#2E7D32" />
          <Text style={styles.contactLabel}>Ambulance</Text>
          <Text style={styles.contactValue}>150</Text>
        </View>
        <TouchableOpacity style={styles.sosButton}>
          <Icon name="call" size={18} color="#fff" />
          <Text style={styles.sosText}>SOS Emergency</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#757575',
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
    backgroundColor: '#FFF3C4',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
    color: '#37474F',
  },
  cardSubText: {
    fontSize: 12,
    color: '#757575',
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
    backgroundColor: '#FFF3C4',
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
    color: '#37474F',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
  },
  sosButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 25,
  },
  sosText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

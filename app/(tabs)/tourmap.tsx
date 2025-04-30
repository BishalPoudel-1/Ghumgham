import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';

const MapScreen = () => {
  const defaultRegion: Region = {
    latitude: 34.0479,
    longitude: 100.6197,
    latitudeDelta: 40.05,
    longitudeDelta: 48.05,
  };

  const [offline, setOffline] = useState(false);
  const [region, setRegion] = useState<Region>(defaultRegion);
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const mapRef = useRef<MapView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const window = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation(coords);
      setRegion(coords);

      if (mapRef.current) {
        mapRef.current.animateToRegion(coords, 1000);
      }

      // Animate loader fade-out
      setShowCheck(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setLoading(false);
        setShowCheck(false);
      });
    })();
  }, []);

  const startPulse = () => {
    setShowPulse(true);
    pulseAnim.setValue(0);

    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.circle),
    }).start(() => {
      setShowPulse(false);
    });
  };

  const handleLocate = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setUserLocation(coords);

    if (mapRef.current) {
      mapRef.current.animateToRegion(coords, 1000);
    }

    startPulse();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        region={region}
        showsUserLocation={true}
      >
        {userLocation && <Marker coordinate={userLocation} title="You are here" />}
      </MapView>

      {/* Pulse Animation */}
      {userLocation && showPulse && (
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              top: window.height / 2 - 50,
              left: window.width / 2 - 50,
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 2],
                  }),
                },
              ],
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 0],
              }),
            },
          ]}
        />
      )}

      {/* Loader */}
      {loading && (
        <Animated.View style={[styles.loaderOverlay, { opacity: fadeAnim }]}>
          {!showCheck ? (
            <>
              <ActivityIndicator size="large" color="#43A047" />
              <Text style={{ marginTop: 10 }}>Fetching your location...</Text>
            </>
          ) : (
            <>
              <Icon name="checkmark-circle-outline" size={40} color="#43A047" />
              <Text style={{ marginTop: 10 }}>Location fetched!</Text>
            </>
          )}
        </Animated.View>
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Navigation</Text>
        <View style={styles.toggleContainer}>
          <Text style={{ fontSize: 12 }}>Offline Mode</Text>
          <Switch
            value={offline}
            onValueChange={() => setOffline(!offline)}
            trackColor={{ false: '#ccc', true: '#43A047' }}
          />
        </View>
      </View>

      {/* Transport Modes */}
      <View style={styles.transportMode}>
        <Icon name="walk" size={22} color="#43A047" style={styles.iconSpacing} />
        <Icon name="bicycle" size={22} color="#43A047" style={styles.iconSpacing} />
        <Icon name="bus" size={22} color="#43A047" />
      </View>

      {/* Map Tools */}
      <View style={styles.mapTools}>
        <TouchableOpacity style={styles.toolButton} onPress={handleLocate}>
          <Icon name="locate" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Icon name="compass" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Download Region Button */}
      <TouchableOpacity style={styles.downloadButton}>
        <Icon name="download" size={16} color="#43A047" />
        <Text style={styles.downloadText}>Download Region</Text>
      </TouchableOpacity>

      {/* Bottom Search Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.searchSection}>
          <Icon name="menu" size={24} color="#43A047" />
          <TextInput
            style={styles.input}
            placeholder="Search Your Destination"
            placeholderTextColor="#888"
          />
          <Icon name="mic" size={22} color="#43A047" />
        </View>
        <View style={styles.bottomTabs}>
      
          <TouchableOpacity style={styles.tab}>
            <Icon name="bookmark" size={20} color="#333" />
            <Text style={styles.tabText}>Saved Places</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderOverlay: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(67, 160, 71, 0.3)',
    borderRadius: 50,
    zIndex: 20,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  transportMode: {
    position: 'absolute',
    width: 40,
    height: 160,
    top: 130,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 16,
    elevation: 4,
  },
  iconSpacing: { marginBottom: 16 },
  mapTools: {
    position: 'absolute',
    top: 130,
    right: 20,
    gap: 12,
  },
  toolButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    elevation: 3,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width:130,
    height:40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
  },
  downloadText: {
    marginLeft: 6,
    color: '#43A047',
    fontWeight: '600',
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#F8F9EA',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 5,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.6,
    gap: 10,
  
    
    
  },
  input: { flex: 1, fontSize: 14, color: '#000' 
  },
  bottomTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    
    
    
  },
  tab: { alignItems: 'center',

   },
  tabText: { fontSize: 12, color: '#555', marginTop: 4 },
  tabTextActive: {
    fontSize: 12,
    color: '#43A047',
    marginTop: 4,
    fontWeight: '600',
  },
});

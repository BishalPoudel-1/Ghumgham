import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Switch, Alert, ActivityIndicator, Animated, Easing,
  Dimensions, Keyboard
} from 'react-native';
import MapView, {
  Marker,
  UrlTile,
  Region,
  PROVIDER_DEFAULT,
  Polyline
} from 'react-native-maps';
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
  const [searchedLocation, setSearchedLocation] = useState<Region | null>(null);
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number, longitude: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [showCheck, setShowCheck] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [is3D, setIs3D] = useState(false);
  const [isLocated, setIsLocated] = useState(false);

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
      mapRef.current?.animateToRegion(coords, 1000);

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

    Location.watchHeadingAsync((data) => {
      setHeading(data.trueHeading ?? data.magHeading);
    }).then(sub => () => sub.remove());
  }, []);

  const startPulse = () => {
    setShowPulse(true);
    pulseAnim.setValue(0);

    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.circle),
    }).start(() => setShowPulse(false));
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
    mapRef.current?.animateToRegion(coords, 1000);
    setIsLocated(true);
    startPulse();
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Please enter a location to search');
      return;
    }

    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length === 0) {
        Alert.alert('No location found', 'Try a different search term.');
        return;
      }

      const place = results[0];
      const newRegion: Region = {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setSearchedLocation(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      Keyboard.dismiss();
      setSearchQuery('');

      // ➕ Draw line from user to destination
      if (userLocation) {
        setRouteCoords([
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: newRegion.latitude, longitude: newRegion.longitude },
        ]);
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to search location');
      console.error(error);
    }
  };

  const handleResetNorth = () => {
    mapRef.current?.animateCamera({ heading: 0 }, { duration: 500 });
  };

  const handleTilt = () => {
    setIs3D((prev) => {
      const newTilt = !prev;
      mapRef.current?.animateCamera({ pitch: newTilt ? 45 : 0 }, { duration: 1000 });
      return newTilt;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        region={region}
        showsUserLocation={false}
        rotateEnabled
        showsCompass
      >
        {offline && (
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
        )}

        {userLocation && heading !== null && (
          <Marker.Animated
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            rotation={heading}
            flat
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Icon name="navigate" size={30} color="#43A047" />
          </Marker.Animated>
        )}

        {searchedLocation && (
          <Marker coordinate={searchedLocation} title="Search Result" pinColor="#f44336" />
        )}

        {routeCoords.length === 2 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#43A047"
          />
        )}
      </MapView>

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

      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Navigation</Text>
        <View style={styles.toggleContainer}>
          <Text style={{ fontSize: 12 }}>Offline</Text>
          <Switch
            value={offline}
            onValueChange={() => setOffline(!offline)}
            trackColor={{ false: '#888', true: '#43A047' }}
          />
        </View>
      </View>

      <View style={styles.transportMode}>
        <TouchableOpacity onPress={handleLocate}>
          <Icon name="navigate-circle" size={24} color={isLocated ? '#43A047' : '#333'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResetNorth}>
          <Icon name="compass" size={22} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTilt}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: is3D ? '#43A047' : '#333'
          }}>3D</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.searchSection}>
          <Icon name="search" size={24} color="#43A047" />
          <TextInput
            style={styles.input}
            placeholder="Search Your Destination"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={22} color="#43A047" />
            </TouchableOpacity>
          )}
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
    width: 50,
    height: 130,
    top: 130,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 16,
    elevation: 4,
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
    flex: 1,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, color: '#000' },
});

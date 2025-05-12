import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const router = useRouter();

  // Prevent native splash from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const planeX = useRef(new Animated.Value(-100)).current;
  const contentScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Animate content in
    Animated.spring(contentScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Step 2: Animate ripple + plane, then hide splash
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(planeX, {
          toValue: width,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleScale, {
          toValue: 15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        try {
          await SplashScreen.hideAsync(); // Hide native splash
          router.replace('/(tabs)');
        } catch (e) {
          console.error('Navigation or splash hide error:', e);
        }
      });
    }, 2000); // Shorter delay for faster visibility

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Ripple Effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[styles.content, { transform: [{ scale: contentScale }] }]}
      >
        <Image
          source={require('../assets/images/Iconwithoutplane.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Animated Plane */}
      <Animated.Image
        source={require('../assets/images/plane.png')}
        style={[
          styles.plane,
          {
            transform: [{ translateX: planeX }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 1200,
    height: 1200,
    borderRadius: 100,
    backgroundColor: '#27548A',
    top: height / 2 - 100,
    left: width / 2 - 100,
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logo: {
    width: 130,
    height: 130,
    zIndex: 2,
  },
  plane: {
    width: 60,
    height: 60,
    position: 'absolute',
  top: height / 2 - 85,   // adjust upward from logo
  left: width / 2 + 95, 
  zIndex: 3,
  },
});

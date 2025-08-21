import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebaseConfig';
import { useTheme } from './theme-context';
import * as Location from 'expo-location';
import GetStartedIllustration from '../assets/images/register.svg';

const { width } = Dimensions.get('window');

export default function Register() {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const inputBg = isDarkMode ? '#1e1e1e' : '#F0F0DC';
  const borderColor = isDarkMode ? '#555' : '#ccc';
  const iconColor = '#43A047';

  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const sanitizeEmail = (email: string) => email.toLowerCase().replace(/\./g, '_');

  const isValidEmail = (email: string) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const isValidPassword = (pwd: string) => pwd.length >= 6;

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Invalid email format';

    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!location.trim()) newErrors.location = 'Location is required';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (!isValidPassword(password))
      newErrors.password = 'Password must be at least 6 characters';

    if (!agree) newErrors.agree = 'You must agree to Terms and Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUseCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync(currentLocation.coords);

    if (place) {
      const formattedLocation = `${place.city || ''}, ${place.region || ''}, ${place.country || ''}`;
      setLocation(formattedLocation);
    }
  } catch (error) {
    console.warn('Location error:', error);
    Alert.alert('Error', 'Unable to fetch location.');
  }
};


  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validateFields()) return;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const safeEmailKey = sanitizeEmail(email);

      const userData = {
        name,
        email,
        phone,
        location,
        photoURL: '',
        description: '',
        countryCount: 0,
        countriesVisited: 0,
        citiesVisited: 0,
        reviews: '',
        traveller_type: "N/A",
        createdAt: new Date().toISOString(),
      };

      await set(ref(database, `users/${safeEmailKey}`), userData);

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="person-outline" size={20} color={iconColor} style={styles.icon} />
          <TextInput
            placeholder="Full name"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            style={[styles.input, { color: textColor }]}
            value={name}
            onChangeText={setName}
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="mail-outline" size={20} color={iconColor} style={styles.icon} />
          <TextInput
            placeholder="Valid email"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="email-address"
            style={[styles.input, { color: textColor }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="call-outline" size={20} color={iconColor} style={styles.icon} />
          <TextInput
            placeholder="Phone number"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="phone-pad"
            style={[styles.input, { color: textColor }]}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

       <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="location-outline" size={20} color={iconColor} style={styles.icon} />
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            style={{ flex: 1 }}
          >
            <Text style={[styles.input, { color: location ? textColor : '#888' }]}>
              {location || 'Tap to get current location'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}


        <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}>
          <Ionicons name="lock-closed-outline" size={20} color={iconColor} style={styles.icon} />
          <TextInput
            placeholder="Strong Password"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            secureTextEntry
            style={[styles.input, { color: textColor }]}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
            <Ionicons
              name={agree ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={agree ? '#4CAF50' : '#999'}
            />
          </TouchableOpacity>
          <Text style={[styles.checkboxText, { color: textColor }]}>
            By checking the box you agree to our{' '}
            <Text style={styles.link}>Terms</Text> and{' '}
            <Text style={styles.link}>Conditions</Text>.
          </Text>
        </View>
        {errors.agree && <Text style={[styles.errorText, { marginBottom: 12 }]}>{errors.agree}</Text>}

        <TouchableOpacity
          style={[styles.button, { opacity: agree && !loading ? 1 : 0.5 }]}
          disabled={!agree || loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register &gt;</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: textColor }]}>
          Already a member?{' '}
          <Text style={styles.loginLink} onPress={() => router.replace('/login')}>
            Log In
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  image: {
    marginTop: 20,
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: '100%',
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    width: '100%',
    color: '#f44336',
    fontSize: 13,
    marginBottom: 8,
    paddingLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  checkboxBox: {
    marginRight: 8,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
  },
  link: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#43A047',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

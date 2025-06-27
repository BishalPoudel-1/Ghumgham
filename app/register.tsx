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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/firebaseConfig';

import GetStartedIllustration from '../assets/images/register.svg';

const { width } = Dimensions.get('window');

export default function Register() {
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(''); // ✅ New location state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sanitizeEmail = (email: string) => email.toLowerCase().replace(/\./g, '_');

  const handleRegister = async () => {
    if (!name || !email || !phone || !location || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

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
    reviewsWritten: 0,
    createdAt: new Date().toISOString(),
  };

  console.log('Saving to DB:', safeEmailKey, userData); // ✅ log the data

  await set(ref(database, `users/${safeEmailKey}`), userData);

  Alert.alert('Success', 'Account created successfully!');
  router.replace('/login');
} catch (error: any) {
  console.error('Firebase error:', error); // ✅ catch and show database errors
  Alert.alert('Registration Error', error.message);
} finally {
  setLoading(false);
}

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Full name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Valid email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ✅ New Location Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Strong Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
            <Ionicons
              name={agree ? 'checkbox-outline' : 'square-outline'}
              size={24}
              color={agree ? '#4CAF50' : '#999'}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            By checking the box you agree to our{' '}
            <Text style={styles.link}>Terms</Text> and{' '}
            <Text style={styles.link}>Conditions</Text>.
          </Text>
        </View>

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

        <Text style={styles.footerText}>
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
    backgroundColor: '#F8F9EA',
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
    backgroundColor: '#F0F0DC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
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
    color: '#263238',
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
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // adjust path if needed

import GetStartedIllustration from '../assets/images/login.svg';

const { width } = Dimensions.get('window');

export default function Login() {
  const [agree, setAgree] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/'); // ✅ Go to index.tsx or home
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Enter Your email"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Enter your Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox} />
          <Text style={styles.forget} onPress={() => router.push('/forget')}>
            Forget Password
          </Text>
        </View>

        <TouchableOpacity style={styles.button} disabled={!agree} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login &gt;</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          New Here?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/register')}>
            Register
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
  forget: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

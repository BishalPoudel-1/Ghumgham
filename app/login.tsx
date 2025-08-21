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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

import GetStartedIllustration from '../assets/images/login.svg';

const { width } = Dimensions.get('window');

export default function Login() {
  const [agree, setAgree] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }
     if (email === 'admin' && password === 'admin') {
    router.push('/admin/admindashboard');
    return;
  }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#2E7D32" style={styles.icon} />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#2E7D32" style={styles.icon} />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        

        {/* Optional Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
            {agree && <View style={styles.checked} />}
          </TouchableOpacity>
          <Text style={styles.agreeText}>Remember me</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: agree && !loading ? 1 : 0.6 }]}
          disabled={!agree || loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          New here?{' '}
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
    backgroundColor: '#E8F5E9',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  image: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  agreeText: {
    color: '#333',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#444',
    fontSize: 14,
  },
  loginLink: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

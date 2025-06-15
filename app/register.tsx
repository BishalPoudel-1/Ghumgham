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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Router for navigation
import GetStartedIllustration from '../assets/images/register.svg'; // ✅ Your SVG

const { width } = Dimensions.get('window');

export default function Register() {
  const [agree, setAgree] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* SVG Illustration */}
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Full name" style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Valid email" style={styles.input} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Phone number" style={styles.input} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Strong Password" style={styles.input} secureTextEntry />
        </View>

        {/* Checkbox */}
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

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, { opacity: agree ? 1 : 0.5 }]}
          disabled={!agree}
          onPress={() => router.replace('/login')} // ✅ Navigate to home or main app
        >
          <Text style={styles.buttonText}>Register &gt;</Text>
        </TouchableOpacity>

        {/* Footer */}
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

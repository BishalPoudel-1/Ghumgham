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

// ✅ Import SVG like a React component
import GetStartedIllustration from '../../assets/images/login.svg';

const { width } = Dimensions.get('window');

export default function Login({ navigation }: any) {
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ✅ SVG Illustration */}
        <GetStartedIllustration width={width * 0.8} height={220} style={styles.image} />

        

       

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Enter Your email" style={styles.input} keyboardType="email-address" />
        </View>

       

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput placeholder="Enter your Password" style={styles.input} secureTextEntry />
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkboxBox}>
           
          </TouchableOpacity>
          <Text style={styles.forget} onPress={() => navigation.navigate('forget')}>Forget Password</Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button]}
          disabled={!agree}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Login &gt</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          New Here ?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('register')}>
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
  }, forget: {
    color: '#4CAF50',
    fontWeight: 'bold',
    
  },
});

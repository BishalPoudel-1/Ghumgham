import React, { useState, useEffect } from 'react';
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
import { ref, update, onValue } from 'firebase/database';
import { auth, database } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const sanitizeEmail = (email: string) => email.toLowerCase().replace(/\./g, '_');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.email) {
      const safeKey = sanitizeEmail(currentUser.email);
      const userRef = ref(database, `users/${safeKey}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
        }
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (!name || !phone || !location) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user?.email) {
        const safeKey = sanitizeEmail(user.email);
        const updates = {
          name,
          phone,
          location,
        };

        await update(ref(database, `users/${safeKey}`), updates);
        Alert.alert('Success', 'Profile updated successfully!');
        router.back(); // go back to profile
      }
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

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
          <Ionicons name="call-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#43A047" style={styles.icon} />
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: !loading ? 1 : 0.5 }]}
          disabled={loading}
          onPress={handleUpdate}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#263238',
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
  button: {
    backgroundColor: '#43A047',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

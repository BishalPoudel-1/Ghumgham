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
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../../firebase/firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function EditProfile() {
    const navigation = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [travellerType, setTravellerType] = useState('');

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
          setTravellerType(data.traveller_type || '');
        }
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (!name || !phone || !location || !travellerType) {
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
          traveller_type: travellerType,
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
    
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#263238" />
      </TouchableOpacity>
      <Text style={styles.title}>Change Password</Text>
    </View>

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

        <View style={styles.pickerContainer}>
          <Ionicons name="walk-outline" size={20} color="#43A047" style={styles.icon} />
          <Picker
            selectedValue={travellerType}
            style={styles.picker}
            onValueChange={(itemValue) => setTravellerType(itemValue)}
          >
            <Picker.Item label="Select Traveller Type" value="" />
            <Picker.Item label="Solo Traveller" value="solo traveller" />
            <Picker.Item label="Group Traveller" value="group traveller" />
            <Picker.Item label="Couple Traveller" value="couple traveller" />
          </Picker>
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
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0DC',
    borderRadius: 10,
    paddingHorizontal: 8,
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
  picker: {
    flex: 1,
    height: 50,
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

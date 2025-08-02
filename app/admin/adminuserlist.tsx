import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from 'react-native';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type User = {
  name: string;
  email: string;
  phone: string;
  location: string;
  photoURL: string;
  description: string;
  countryCount: number | null;
  countriesVisited: number | null;
  citiesVisited: number | null;
  reviews: string;
  traveller_type: string;
  createdAt: string;
};

const defaultUser: User = {
  name: '',
  email: '',
  phone: '',
  location: '',
  photoURL: '',
  description: '',
  countryCount: null,
  countriesVisited: null ,
  citiesVisited: null,
  reviews: '',
  traveller_type: '',
  createdAt: '',
};

const fieldLabels: { [key: string]: string } = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  location: 'Location',
  traveller_type: 'Traveller Type',
  countryCount: 'Country Count',
  countriesVisited: 'Countries Visited',
  citiesVisited: 'Cities Visited',
  description: 'Description',
  photoURL: 'Photo URL',
  reviews: 'Reviews',
  createdAt: 'Account Created At',
};


const AdminUserList = () => {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [newUser, setNewUser] = useState<User>({ ...defaultUser });
  const [loading, setLoading] = useState(false);

  const sanitizeEmail = (email: string) => email.toLowerCase().replace(/\./g, '_');

  useEffect(() => {
    const userRef = ref(database, 'users');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(data);
      } else {
        setUsers({});
      }
    });
  }, []);

  const handleInputChange = (field: keyof User, value: string) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateOrUpdate = async () => {
    Keyboard.dismiss();
    if (!newUser.email || !newUser.name || !newUser.phone || !newUser.location) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const safeEmail = sanitizeEmail(newUser.email);
      const userData = {
        ...newUser,
        createdAt: newUser.createdAt || new Date().toISOString(),
      };

      await set(ref(database, `users/${safeEmail}`), userData);
      Alert.alert('Success', 'User saved successfully.');
      setNewUser({ ...defaultUser });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (email: string) => {
    const userId = sanitizeEmail(email);
    remove(ref(database, `users/${userId}`))
      .then(() => Alert.alert('Deleted', 'User removed.'))
      .catch((error) => Alert.alert('Error', error.message));
  };

  const fields: (keyof User)[] = [
    'name',
    'email',
    'phone',
    'location',
    'photoURL',
    'description',
    'countryCount',
    'countriesVisited',
    'citiesVisited',
    'reviews',
    'traveller_type',
  ];

  return (
    console.log(fields),
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Admin User Management</Text>

      <Text style={styles.subHeader}>Add / Edit User</Text>
      {fields.map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={fieldLabels[field] || field}
          value={String(newUser[field] ?? '')}
          onChangeText={(text) => handleInputChange(field, text)}
        />
        
      ))}
      
      

      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
        disabled={loading}
        onPress={handleCreateOrUpdate}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save User</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.subHeader}>All Users</Text>
      {Object.entries(users).map(([id, user]) => (
        <View key={id} style={styles.userCard}>
          {fields.map((key) => (
            <Text key={key} style={styles.userField}>
              <Text style={styles.bold}>{key}: </Text>{String(user[key] ?? '')}
            </Text>
          ))}
          <View style={styles.buttonRow}>
            <Button title="Edit" onPress={() => setNewUser({ ...user })} />
            <Button title="Delete" onPress={() => handleDelete(user.email)} color="red" />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d3436',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#0984e3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#43A047',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  userField: {
    fontSize: 14,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#2d3436',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default AdminUserList;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { ref, push, serverTimestamp, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme-context'; // Theme hook

const CreateEventScreen = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const { isDarkMode } = useTheme(); // Theme state
  const backgroundColor = isDarkMode ? '#121212' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBg = isDarkMode ? '#1e1e1e' : '#fff';
  const borderColor = isDarkMode ? '#444' : '#ccc';

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to create an event.');
      return;
    }

    if (!eventName || !eventDate || !location || !description) {
      Alert.alert('Missing Fields', 'All fields except image are required.');
      return;
    }

    setLoading(true);

    const eventRef = ref(database, 'community/events');
    const newEventRef = push(eventRef);

    const newEventData = {
      eventName,
      eventDate,
      location,
      description,
      image: image || '',
      createdAt: serverTimestamp(),
      userId: user.uid,
      userName: user.displayName || 'You',
    };

    try {
      await update(newEventRef, newEventData);
      Alert.alert('Success', 'Event created successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* Header with title and Go Back button */}
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: textColor }]}>Create New Event</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: textColor }]}>Event Name</Text>
      <TextInput
        value={eventName}
        onChangeText={setEventName}
        placeholder="e.g., Hiking to Shivapuri"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
        ]}
      />

      <Text style={[styles.label, { color: textColor }]}>Date</Text>
      <TextInput
        value={eventDate}
        onChangeText={setEventDate}
        placeholder="e.g., 2025-08-15"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
        ]}
      />

      <Text style={[styles.label, { color: textColor }]}>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., Shivapuri National Park"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
        ]}
      />

      <Text style={[styles.label, { color: textColor }]}>Description</Text>
      <TextInput
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Tell us more about the event..."
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            height: 100,
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
        ]}
      />

      <Text style={[styles.label, { color: textColor }]}>Image URL (optional)</Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        placeholder="https://example.com/image.jpg"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: borderColor,
          },
        ]}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goBackButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  goBackText: {
    color: '#43A047',
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#43A047',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

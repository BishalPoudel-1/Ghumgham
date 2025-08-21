import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { ref, push, set } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { useTheme } from '../theme-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CreateNewTrip: { userId: string };
};

type CreateNewTripRouteProp = RouteProp<RootStackParamList, 'CreateNewTrip'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateNewTrip'>;

type Destination = {
  location: string;
  stay: string;
  activities: string; // Comma separated string for UI, split to array when saving
};

export default function CreateNewTrip() {
  const { isDarkMode } = useTheme();
  const route = useRoute<CreateNewTripRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const userId = route.params?.userId;

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const inputBg = isDarkMode ? '#1e1e1e' : '#fff';
  const borderColor = isDarkMode ? '#555' : '#ccc';

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [destinations, setDestinations] = useState<Destination[]>([
    { location: '', stay: '', activities: '' },
  ]);

  const [transports, setTransports] = useState<string[]>(['']);

  // Date picker handlers
  const onChangeStartDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEndDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  // Destination handlers
  const updateDestinationField = (index: number, field: keyof Destination, value: string) => {
    const updated = [...destinations];
    updated[index][field] = value;
    setDestinations(updated);
  };

  const addDestination = () => {
    setDestinations([...destinations, { location: '', stay: '', activities: '' }]);
  };

  const removeDestination = (index: number) => {
    if (destinations.length === 1) return; // At least one destination
    const updated = destinations.filter((_, i) => i !== index);
    setDestinations(updated);
  };

  // Transport handlers
  const updateTransport = (index: number, value: string) => {
    const updated = [...transports];
    updated[index] = value;
    setTransports(updated);
  };

  const addTransport = () => {
    setTransports([...transports, '']);
  };

  const removeTransport = (index: number) => {
    if (transports.length === 1) return; // At least one transport
    const updated = transports.filter((_, i) => i !== index);
    setTransports(updated);
  };

  // Submit function
  const submitTrip = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a trip title.');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'User not identified. Please login again.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Validation', 'End date cannot be before start date.');
      return;
    }
    // Validate destinations
    for (const [i, dest] of destinations.entries()) {
      if (!dest.location.trim()) {
        Alert.alert('Validation', `Please enter location for destination ${i + 1}`);
        return;
      }
      if (!dest.stay.trim()) {
        Alert.alert('Validation', `Please enter stay for destination ${i + 1}`);
        return;
      }
    }
    // Validate transports
    for (const [i, t] of transports.entries()) {
      if (!t.trim()) {
        Alert.alert('Validation', `Please enter transport method ${i + 1}`);
        return;
      }
    }

    const tripsRef = ref(database, `trips/userTrips/${userId}`);
    const newTripRef = push(tripsRef);

    // Prepare destinations for DB: split activities by comma and trim
    const destsForDb = destinations.map((d) => ({
      location: d.location.trim(),
      stay: d.stay.trim(),
      activities:
        d.activities
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a.length > 0) || [],
    }));

    set(newTripRef, {
      name: title.trim(),
      dates: {
        start: startDate.toISOString().split('T')[0], // just yyyy-mm-dd
        end: endDate.toISOString().split('T')[0],
      },
      destinations: destsForDb,
      transport: transports.map((t) => t.trim()),
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        Alert.alert('Success', 'Trip created successfully!');
        // Reset form
        setTitle('');
        setStartDate(new Date());
        setEndDate(new Date());
        setDestinations([{ location: '', stay: '', activities: '' }]);
        setTransports(['']);
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to create trip. Please try again.');
      });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={[styles.header, { color: textColor }]}>Create New Trip</Text>
        


        <Text style={[styles.label, { color: textColor }]}>Trip Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter trip title"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
          returnKeyType="done"
        />

        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={[styles.datePicker, { borderColor }]}>
          <Text style={{ color: textColor }}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeStartDate}
            maximumDate={new Date(2100, 11, 31)}
          />
        )}

        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={[styles.datePicker, { borderColor }]}>
          <Text style={{ color: textColor }}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeEndDate}
            minimumDate={startDate}
            maximumDate={new Date(2100, 11, 31)}
          />
        )}

        {/* Destinations Section */}
        <Text style={[styles.sectionHeader, { color: textColor, marginTop: 30 }]}>Destinations</Text>
        {destinations.map((dest, i) => (
          <View key={i} style={[styles.destinationContainer, { borderColor }]}>
            <Text style={[styles.subLabel, { color: textColor }]}>Destination {i + 1}</Text>

            <TextInput
              placeholder="Location"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              value={dest.location}
              onChangeText={(text) => updateDestinationField(i, 'location', text)}
            />
            <TextInput
              placeholder="Stay"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              value={dest.stay}
              onChangeText={(text) => updateDestinationField(i, 'stay', text)}
            />
            <TextInput
              placeholder="Activities (comma separated)"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              value={dest.activities}
              onChangeText={(text) => updateDestinationField(i, 'activities', text)}
            />

            {destinations.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeDestination(i)}
              >
                <Text style={{ color: '#d9534f' }}>Remove Destination</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addDestination}>
          <Text style={{ color: '#43A047' }}>+ Add Destination</Text>
        </TouchableOpacity>

        {/* Transport Section */}
        <Text style={[styles.sectionHeader, { color: textColor, marginTop: 30 }]}>Transport</Text>
        {transports.map((t, i) => (
          <View key={i} style={styles.transportContainer}>
            <TextInput
              placeholder="Transport method"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              value={t}
              onChangeText={(text) => updateTransport(i, text)}
            />
            {transports.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeTransport(i)}
              >
                <Text style={{ color: '#d9534f' }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addTransport}>
          <Text style={{ color: '#43A047' }}>+ Add Transport</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.aiBtn}
          onPress={() => navigation.navigate('AIRecommend' as never)} 
        >
          <Text style={styles.aiBtnText}>Use AI</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={submitTrip}>
          <Text style={styles.submitBtnText}>Create Trip</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 8,
  },
  datePicker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginTop: 6,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  destinationContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
  },
  subLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  removeBtn: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  addBtn: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  transportContainer: {
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: '#43A047',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  aiBtn: {
  backgroundColor: '#1E88E5',
  marginTop: 20,
  paddingVertical: 12,
  borderRadius: 25,
  alignItems: 'center',
},
aiBtnText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});

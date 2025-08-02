import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ref, onValue, update, remove } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { useRouter } from 'expo-router';

type EventType = {
  title: string;
  description: string;
  location: string;
  date: string; // ISO string or whatever format you use
  image: string;
  organizer: string;
};

export default function AdminEventList() {
  const [events, setEvents] = useState<{ [key: string]: EventType }>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedEvent, setEditedEvent] = useState<EventType | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setEvents(snapshot.val());
        } else {
          setEvents({});
        }
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', 'Failed to load events: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const startEditing = (key: string) => {
    setEditingKey(key);
    setEditedEvent(events[key]);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditedEvent(null);
  };

  const handleChange = (field: keyof EventType, value: string) => {
    if (!editedEvent) return;
    setEditedEvent({ ...editedEvent, [field]: value });
  };

  const saveChanges = async () => {
    if (!editingKey || !editedEvent) return;
    setSaving(true);

    try {
      await update(ref(database, `events/${editingKey}`), {
        ...editedEvent,
      });
      Alert.alert('Success', 'Event updated successfully');
      setEditingKey(null);
      setEditedEvent(null);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update event: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = (key: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(database, `events/${key}`));
              Alert.alert('Deleted', 'Event deleted successfully');
              if (editingKey === key) {
                cancelEditing();
              }
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete event: ' + error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>

        {loading ? (
          <ActivityIndicator size="large" color="#43A047" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {Object.entries(events).map(([key, event]) => (
              <View key={key} style={styles.card}>
                {editingKey === key ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editedEvent?.title}
                      onChangeText={(text) => handleChange('title', text)}
                      placeholder="Title"
                    />
                    <TextInput
                      style={[styles.input, { height: 60 }]}
                      value={editedEvent?.description}
                      onChangeText={(text) => handleChange('description', text)}
                      placeholder="Description"
                      multiline
                    />
                    <TextInput
                      style={styles.input}
                      value={editedEvent?.location}
                      onChangeText={(text) => handleChange('location', text)}
                      placeholder="Location"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedEvent?.date}
                      onChangeText={(text) => handleChange('date', text)}
                      placeholder="Date (ISO)"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedEvent?.image}
                      onChangeText={(text) => handleChange('image', text)}
                      placeholder="Image URL"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedEvent?.organizer}
                      onChangeText={(text) => handleChange('organizer', text)}
                      placeholder="Organizer"
                    />

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#4CAF50' }]}
                        onPress={saveChanges}
                        disabled={saving}
                      >
                        <Text style={styles.buttonText}>
                          {saving ? 'Saving...' : 'Save'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#f44336' }]}
                        onPress={cancelEditing}
                        disabled={saving}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.title}>{event.title}</Text>
                    <Text style={styles.subText}>Location: {event.location}</Text>
                    <Text style={styles.description}>{event.description}</Text>
                    <Text style={styles.date}>Date: {event.date}</Text>
                    <Text style={styles.organizer}>Organizer: {event.organizer}</Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#2196F3' }]}
                        onPress={() => startEditing(key)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#f44336' }]}
                        onPress={() => deleteEvent(key)}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9EA' },
  addButton: {
    backgroundColor: '#43A047',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  organizer: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

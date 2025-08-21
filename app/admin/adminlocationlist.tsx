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

type LocationType = {
  Location: string;
  Name: string;
  description: string;
  image: string;
  reviews: number;
  tags: string[];
};

export default function AdminLocationList() {
  const [locations, setLocations] = useState<{ [key: string]: LocationType }>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedLocation, setEditedLocation] = useState<LocationType | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  // Fetch locations from Firebase
  useEffect(() => {
    const locationsRef = ref(database, 'locations');
    const unsubscribe = onValue(
      locationsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLocations(snapshot.val());
        } else {
          setLocations({});
        }
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', 'Failed to load locations: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const startEditing = (key: string) => {
    setEditingKey(key);
    setEditedLocation(locations[key]);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditedLocation(null);
  };

  const handleChange = (field: keyof LocationType, value: string) => {
    if (!editedLocation) return;
    setEditedLocation({ ...editedLocation, [field]: field === 'reviews' ? Number(value) : value });
  };

  const saveChanges = async () => {
    if (!editingKey || !editedLocation) return;
    setSaving(true);

    try {
      await update(ref(database, `locations/${editingKey}`), {
        ...editedLocation,
      });
      Alert.alert('Success', 'Location updated successfully');
      setEditingKey(null);
      setEditedLocation(null);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update location: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteLocation = (key: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(database, `locations/${key}`));
              Alert.alert('Deleted', 'Location deleted successfully');
              if (editingKey === key) {
                cancelEditing();
              }
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete location: ' + error.message);
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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/admin/add_locations')}
        >
          <Text style={styles.addButtonText}>+ Add Location</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#43A047" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {Object.entries(locations).map(([key, loc]) => (
              <View key={key} style={styles.card}>
                {editingKey === key ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editedLocation?.Location}
                      onChangeText={(text) => handleChange('Location', text)}
                      placeholder="Location"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedLocation?.Name}
                      onChangeText={(text) => handleChange('Name', text)}
                      placeholder="Name"
                    />
                    <TextInput
                      style={[styles.input, { height: 60 }]}
                      value={editedLocation?.description}
                      onChangeText={(text) => handleChange('description', text)}
                      placeholder="Description"
                      multiline
                    />
                    <TextInput
                      style={styles.input}
                      value={editedLocation?.image}
                      onChangeText={(text) => handleChange('image', text)}
                      placeholder="Image URL"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedLocation?.reviews?.toString()}
                      onChangeText={(text) => handleChange('reviews', text)}
                      placeholder="Reviews"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedLocation?.tags?.join(', ')}
                      onChangeText={(text) =>
                        handleChange(
                          'tags',
                          text
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter((tag) => tag.length > 0)
                            .join(',')
                        )
                      }
                      placeholder="Tags (comma separated)"
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
                    <Text style={styles.title}>{loc.Name}</Text>
                    <Text style={styles.subText}>
                      Location: {loc.Location} | Reviews: {loc.reviews}
                    </Text>
                    <Text style={styles.description}>{loc.description}</Text>
                    <Text style={styles.tags}>Tags: {loc.tags?.join(', ')}</Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#2196F3' }]}
                        onPress={() => startEditing(key)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#f44336' }]}
                        onPress={() => deleteLocation(key)}
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
  tags: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 12,
    color: '#555',
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

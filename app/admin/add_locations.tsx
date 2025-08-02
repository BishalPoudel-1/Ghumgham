
import React, { useState, useEffect } from 'react';
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
import { ref, set, push, get } from 'firebase/database';
import DropDownPicker from 'react-native-dropdown-picker';
import { database } from '../../firebase/firebaseConfig';

type LocationType = {
  Location: string;
  Name: string;
  description: string;
  image: string;
  reviews: number;
  tags: string[];
};

export default function AdminLocationAdd() {
  const [locationData, setLocationData] = useState<LocationType>({
    Location: '',
    Name: '',
    description: '',
    image: '',
    reviews: 0,
    tags: [],
  });

  // Dropdown states
  const [categoriesList, setCategoriesList] = useState<{label: string; value: string}[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const categoriesRef = ref(database, 'categories');
    get(categoriesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const cats = Object.keys(snapshot.val()).map((cat) => ({
          label: cat,
          value: cat,
        }));
        setCategoriesList(cats);
      }
    });
  }, []);

  const handleInputChange = (field: keyof LocationType, value: string) => {
    if (field === 'reviews') {
      const num = parseFloat(value);
      setLocationData((prev) => ({
        ...prev,
        reviews: isNaN(num) ? 0 : num,
      }));
    } else if (field === 'tags') {
      const tagsArray = value
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      setLocationData((prev) => ({
        ...prev,
        tags: tagsArray,
      }));
    } else {
      setLocationData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validate = () => {
    if (!locationData.Location.trim()) {
      Alert.alert('Validation Error', 'District / Location field is required');
      return false;
    }
    if (!locationData.Name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one category');
      return false;
    }
    if (!locationData.description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return false;
    }
    if (!locationData.image.trim()) {
      Alert.alert('Validation Error', 'Image URL is required');
      return false;
    }
    return true;
  };

  const addLocationToCategory = async (locationId: string, categoryName: string) => {
    try {
      const categoryRef = ref(database, `categories/${categoryName}/locationIds`);
      const snapshot = await get(categoryRef);
      let locationIds: string[] = [];
      if (snapshot.exists()) {
        locationIds = snapshot.val();
      }
      if (!locationIds.includes(locationId)) {
        locationIds.push(locationId);
        await set(categoryRef, locationIds);
      }
    } catch (err) {
      console.error('Error updating category locationIds:', err);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const newLocationRef = push(ref(database, 'locations'));
      const locationId = newLocationRef.key;
      if (!locationId) throw new Error('Failed to generate new location ID');

      await set(newLocationRef, locationData);

      // Add locationId to all selected categories
      for (const cat of selectedCategories) {
        await addLocationToCategory(locationId, cat);
      }

      Alert.alert('Success', 'Location added successfully');
      setLocationData({
        Location: '',
        Name: '',
        description: '',
        image: '',
        reviews: 0,
        tags: [],
      });
      setSelectedCategories([]);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add New Location</Text>

        <Text style={styles.label}>District / Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Location (e.g., Lalitpur)"
          value={locationData.Location}
          onChangeText={(text) => handleInputChange('Location', text)}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Place Name (e.g., Garden of Dreams)"
          value={locationData.Name}
          onChangeText={(text) => handleInputChange('Name', text)}
        />

        <Text style={styles.label}>Select Categories</Text>
        <DropDownPicker
          multiple={true}
          min={0}
          max={10}
          open={open}
          value={selectedCategories}
          items={categoriesList}
          setOpen={setOpen}
          setValue={setSelectedCategories}
          setItems={setCategoriesList}
          placeholder="Select categories"
          containerStyle={{ marginBottom: 16 }}
          style={{ borderRadius: 10, borderColor: '#bbb' }}
          dropDownContainerStyle={{ borderRadius: 10 }}
          listMode="MODAL"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={locationData.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={locationData.image}
          onChangeText={(text) => handleInputChange('image', text)}
        />

        <Text style={styles.label}>Reviews (number)</Text>
        <TextInput
          style={styles.input}
          placeholder="Reviews score (e.g., 4.7)"
          keyboardType="numeric"
          value={locationData.reviews.toString()}
          onChangeText={(text) => handleInputChange('reviews', text)}
        />

        <Text style={styles.label}>Tags (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tags (e.g., Relax, Nature, Heritage)"
          value={locationData.tags.join(', ')}
          onChangeText={(text) => handleInputChange('tags', text)}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Location</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f4f6f8' },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2e7d32',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

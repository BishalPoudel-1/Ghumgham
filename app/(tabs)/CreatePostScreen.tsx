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
import { ref, push, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme-context'; // 🔁 Add your theme hook

const CreatePostScreen = () => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const { isDarkMode } = useTheme(); // 🔁 Dark mode boolean

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to post.');
      return;
    }

    if (!content || !location) {
      Alert.alert('Missing Fields', 'Content and location are required.');
      return;
    }

    setLoading(true);

    const postRef = ref(database, 'community/posts/posts');
    const newPostRef = push(postRef);

    const newPostData = {
      content,
      image: image || '',
      likesCount: 0,
      likes: {},
      location,
      timestamp: new Date().toISOString(),
      userId: user.uid,
      userName: user.displayName || 'You',
    };

    try {
      await update(newPostRef, newPostData);
      Alert.alert('Success', 'Post created successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#fff' },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000' }]}>
          Create New Post
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={[styles.goBackText, { color: isDarkMode ? '#90ee90' : '#43A047' }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: isDarkMode ? '#eee' : '#000' }]}>What's on your mind?</Text>
      <TextInput
        multiline
        value={content}
        onChangeText={setContent}
        placeholder="Write your thoughts here..."
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        style={[
          styles.textInput,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#555' : '#ccc',
          },
        ]}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#eee' : '#000' }]}>Location</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., Shivapuri"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        style={[
          styles.textInput,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#555' : '#ccc',
          },
        ]}
      />

      <Text style={[styles.label, { color: isDarkMode ? '#eee' : '#000' }]}>Image URL (optional)</Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        placeholder="https://example.com/image.jpg"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        style={[
          styles.textInput,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            borderColor: isDarkMode ? '#555' : '#ccc',
          },
        ]}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Post</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreatePostScreen;

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

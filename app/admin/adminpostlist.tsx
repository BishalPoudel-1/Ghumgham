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

type PostType = {
  content: string;
  image: string;
  likesCount?: number;
  location: string;
  timestamp: string;
  userId: string;
  userName: string;
};

export default function AdminPostList() {
  const [posts, setPosts] = useState<{ [key: string]: PostType }>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedPost, setEditedPost] = useState<PostType | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
  const postsRef = ref(database, 'community/posts/posts');
  const unsubscribe = onValue(postsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, PostType>;

      console.log('Raw data from DB:', data);

      const parsedData: Record<string, PostType> = {};
      Object.entries(data).forEach(([key, val]) => {
        console.log('Entry:', key, val);

        parsedData[key] = {
          ...val,
          likesCount: val.likesCount !== undefined ? Number(val.likesCount) : 0,
        };
      });

      setPosts(parsedData);
      console.log('Parsed posts:', parsedData);
    } else {
      console.log('No posts data found');
      setPosts({});
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);



  const startEditing = (key: string) => {
    setEditingKey(key);
    setEditedPost(posts[key]);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditedPost(null);
  };

  const handleChange = (field: keyof PostType, value: string) => {
    if (!editedPost) return;
    if (field === 'likesCount') {
      // Keep likesCount as number
      const numericValue = parseInt(value, 10);
      setEditedPost({ ...editedPost, [field]: isNaN(numericValue) ? 0 : numericValue });
    } else {
      setEditedPost({ ...editedPost, [field]: value });
    }
  };

  const saveChanges = async () => {
    if (!editingKey || !editedPost) return;
    setSaving(true);

    try {
      await update(ref(database, `community/posts/posts/${editingKey}`), {
        ...editedPost,
      });
      Alert.alert('Success', 'Post updated successfully');
      setEditingKey(null);
      setEditedPost(null);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update post: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = (key: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(ref(database, `community/posts/posts/${key}`));
              Alert.alert('Deleted', 'Post deleted successfully');
              if (editingKey === key) {
                cancelEditing();
              }
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete post: ' + error.message);
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
            {Object.entries(posts).map(([key, post]) => (
              <View key={key} style={styles.card}>
                {editingKey === key ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editedPost?.content}
                      onChangeText={(text) => handleChange('content', text)}
                      placeholder="Content"
                      multiline
                    />
                    <TextInput
                      style={styles.input}
                      value={editedPost?.image}
                      onChangeText={(text) => handleChange('image', text)}
                      placeholder="Image URL"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedPost?.location}
                      onChangeText={(text) => handleChange('location', text)}
                      placeholder="Location"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedPost?.timestamp}
                      onChangeText={(text) => handleChange('timestamp', text)}
                      placeholder="Timestamp (ISO)"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedPost?.userId}
                      onChangeText={(text) => handleChange('userId', text)}
                      placeholder="User ID"
                    />
                    <TextInput
                      style={styles.input}
                      value={editedPost?.userName}
                      onChangeText={(text) => handleChange('userName', text)}
                      placeholder="User Name"
                    />
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(editedPost?.likesCount ?? 0)}
                      onChangeText={(text) => handleChange('likesCount', text)}
                      placeholder="Likes Count"
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
                    <Text style={styles.title}>{post.userName}</Text>
                    <Text style={styles.subText}>Location: {post.location}</Text>
                    <Text style={styles.description}>{post.content}</Text>
                    <Text style={styles.timestamp}>Date: {post.timestamp}</Text>
                    <Text style={styles.likes}>Likes: {post.likesCount ?? 0}</Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#2196F3' }]}
                        onPress={() => startEditing(key)}
                      >
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#f44336' }]}
                        onPress={() => deletePost(key)}
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
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  likes: {
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

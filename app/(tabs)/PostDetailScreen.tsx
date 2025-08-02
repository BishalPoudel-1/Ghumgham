import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from '../../firebase/firebaseConfig';
import AddComment from './AddComment';
import { useRoute, RouteProp } from '@react-navigation/native';

// Define route types
type RootStackParamList = {
  PostDetailScreen: { postId: string };
};

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetailScreen'>;

type Post = {
  content: string;
  image?: string;
  likesCount: number;
  likes?: Record<string, boolean>;
  location?: string;
  timestamp: string;
  userId: string;
  userName?: string;
};

const PostDetailScreen = () => {
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!postId) {
      Alert.alert('Error', 'Post ID not found');
      return;
    }

    console.log('PostDetailScreen loaded with postId:', postId);

    const postRef = ref(database, `community/posts/posts/${postId}`);
    const unsubscribe = onValue(
      postRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPost(data);
          setLikeCount(data.likesCount || 0);
          if (user && data.likes && data.likes[user.uid]) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        } else {
          setPost(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      Alert.alert('Login required', 'Please login to like posts.');
      return;
    }

    if (!post) return;

    const postRef = ref(database, `community/posts/posts/${postId}`);

    try {
      const newLikes = post.likes ? { ...post.likes } : {};

      if (liked) {
        delete newLikes[user.uid];
      } else {
        newLikes[user.uid] = true;
      }

      await update(postRef, {
        likes: newLikes,
        likesCount: Object.keys(newLikes).length,
      });

      setPost((prev) =>
        prev ? { ...prev, likes: newLikes, likesCount: Object.keys(newLikes).length } : prev
      );
      setLikeCount(Object.keys(newLikes).length);
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Error', 'Failed to update like status. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, { flex: 1 }]}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{post.userName || 'Traveler'}</Text>
      <Text style={styles.timestamp}>{new Date(post.timestamp).toLocaleString()}</Text>
      <Text style={styles.location}>{post.location || 'Unknown location'}</Text>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}

      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={handleLikeToggle} style={styles.likeButton}>
          <Text style={[styles.likeText, liked && styles.liked]}>
            {liked ? '❤️' : '🤍'} Like ({likeCount})
          </Text>
        </TouchableOpacity>
      </View>

      <AddComment postId={postId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  userName: { fontWeight: 'bold', fontSize: 18 },
  timestamp: { fontSize: 12, color: '#555', marginBottom: 6 },
  location: { fontStyle: 'italic', marginBottom: 12 },
  content: { fontSize: 16, marginBottom: 12 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  likeContainer: { flexDirection: 'row', marginBottom: 20 },
  likeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#43A047',
  },
  likeText: {
    fontSize: 16,
    color: '#43A047',
  },
  liked: {
    color: '#e91e63',
  },
});

export default PostDetailScreen;

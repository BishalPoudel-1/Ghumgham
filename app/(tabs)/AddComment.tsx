// AddComment.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ref, push, onValue, DatabaseReference } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig'; // adjust path if needed
import { getAuth } from 'firebase/auth';

type Comment = {
  text: string;
  timestamp: string;
  userId: string;
  userName: string;
};

type Props = {
  postId: string;
};

const AddComment = ({ postId }: Props) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const commentsRef: DatabaseReference = ref(database, `community/comments/${postId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedComments: Comment[] = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          loadedComments.push(data[key] as Comment);
        });
      }

      setComments(loadedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const comment: Comment = {
      text: commentText,
      timestamp: new Date().toISOString(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
    };

    try {
      const commentsRef = ref(database, `community/comments/${postId}`);
      await push(commentsRef, comment);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Comments</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : comments.length > 0 ? (
        <FlatList
          data={comments}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.user}>{item.userName}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: '#777', fontStyle: 'italic' }}>No comments yet.</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          style={styles.input}
        />
        <Button title="Post" onPress={handlePostComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  comment: {
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
  },
  user: { fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    height: 40,
    marginRight: 8,
    borderRadius: 6,
  },
});

export default AddComment;

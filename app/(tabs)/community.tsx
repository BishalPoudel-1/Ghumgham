// CommunityScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme-context';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, onValue } from 'firebase/database';
import { auth, database } from '../../firebase/firebaseConfig';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// PARAM LIST AND PROP TYPES
type RootStackParamList = {
  Community: undefined;
  PostDetailScreen: { postId: string };
  CreatePostScreen: undefined;
  CreateEventScreen: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Community'>;

// DATA INTERFACES
type Traveler = {
  name?: string;
  email?: string;
  image?: string;
  location?: string;
  phone?: string;
};
interface Post {
  id: string;
  content: string;
  location?: string;
  timestamp: string;
  userId: string;
  userName?: string;
  avatarUrl?: string;
  image?: string;
}
interface Event {
  id: string;
  description: string;
  location?: string;
  timestamp: string;
  organizer?: string;
  avatarUrl?: string;
  image?: string;
}
interface DemoUser {
  id: string;
  name: string;
  email: string;
}
interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them' | 'system';
}

// DEMO DATA FOR MESSAGES
const demoUsers: DemoUser[] = [
  { id: '1', name: 'Arpan Joshi', email: 'arpan@example.com' },
  { id: '2', name: 'Sarah Lee', email: 'sarah@example.com' },
  { id: '3', name: 'Michael Chen', email: 'michael@example.com' },
  { id: '4', name: 'Luna Sharma', email: 'luna@example.com' },
];

const CommunityScreen = () => {
  // STATE FOR ALL TABS
  const [activeTab, setActiveTab] = useState('Feed');
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const router = useRouter();

  // State for 'Feed' and 'Event' tabs
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // State for 'Message' tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);

  // THEME COLORS
  const textColor = isDarkMode ? '#fff' : '#222';
  const mutedText = isDarkMode ? '#aaa' : '#777';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#fff';
  const containerBg = isDarkMode ? '#121212' : '#F8F9EA';

  // --- DATA FETCHING EFFECTS (Refactored) ---
  useEffect(() => {
    // Effect for fetching nearby travelers (depends on auth)
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const emailKey = user.email.replace(/\./g, '_');
        const currentUserRef = dbRef(database, `users/${emailKey}`);
        
        const currentUserListener = onValue(currentUserRef, (userSnapshot) => {
          const currentUserData = userSnapshot.val();
          const currentLocation = currentUserData?.location || '';
          const allUsersRef = dbRef(database, 'users');
          
          const allUsersListener = onValue(allUsersRef, (allUsersSnapshot) => {
            const data = allUsersSnapshot.val() || {};
            const filtered: Traveler[] = Object.values(data).filter(
              (entry: any) =>
                entry.email.replace(/\./g, '_') !== emailKey &&
                entry?.location?.toLowerCase() === currentLocation.toLowerCase()
            );
            setTravelers(filtered);
          });
          // Return cleanup for allUsersListener
          return () => allUsersListener();
        });
        // Return cleanup for currentUserListener
        return () => currentUserListener();
      } else {
        setTravelers([]); // Clear travelers if not logged in
      }
    });
    // Return cleanup for the auth listener
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // Effect for fetching posts
    const postsRef = dbRef(database, 'community/posts/posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPosts(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Effect for fetching events
    const eventsRef = dbRef(database, 'community/events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setEvents(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // LOGIC FOR MESSAGE TAB
  const filteredUsers = demoUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (user: DemoUser) => {
    setSelectedUser(user);
    setConversation([
      { id: '1', text: `You are now chatting with ${user.name}. Say hello!`, sender: 'system' },
      { id: '2', text: 'Hey there! How are you?', sender: 'them' }
    ]);
  };
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      text: message.trim(),
      sender: 'me',
    };
    setConversation(prev => [...prev, newMessage]);
    setMessage('');
  };

  // Reusable header and tabs component
  const renderHeaderAndTabs = () => (
    <>
      <Text style={[styles.header, { color: textColor }]}>Community</Text>
      <View style={[styles.tabs, { borderBottomColor: isDarkMode ? '#555' : '#ccc' }]}>
        {['Feed', 'Event', 'Message'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[
                styles.tabText,
                { color: activeTab === tab ? '#43A047' : mutedText },
                activeTab === tab && styles.activeTab,
              ]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>
        </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <View style={[styles.container, { backgroundColor: containerBg }]}>
        {activeTab === 'Message' ? (
          <View style={{ flex: 1 }}>
            {renderHeaderAndTabs()}
            {!selectedUser ? (
              <View style={styles.messageContainer}>
                 <Text style={[styles.messageHeader, { color: textColor }]}>Search User to Message</Text>
                 <TextInput placeholder="Type a name..." style={styles.input} value={searchQuery} onChangeText={setSearchQuery} />
                 <FlatList
                   data={filteredUsers}
                   keyExtractor={(item) => item.id}
                   renderItem={({ item }) => (
                     <TouchableOpacity style={styles.userCard} onPress={() => handleSelectUser(item)}>
                       <Text style={styles.userName}>{item.name}</Text>
                       <Text style={styles.userEmail}>{item.email}</Text>
                     </TouchableOpacity>
                   )}
                   ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                 />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.chatHeaderText, {color: textColor}]}>{selectedUser.name}</Text>
                  <TouchableOpacity onPress={() => { setSelectedUser(null); setConversation([]); }}>
                    <Text style={styles.backButtonText}>← Back to search</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                    data={conversation}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={[
                        styles.messageBubble,
                        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
                        item.sender === 'system' && styles.systemMessage,
                      ]}>
                        <Text style={
                          item.sender === 'me' ? styles.myMessageText : 
                          item.sender === 'system' ? styles.systemMessageText : styles.theirMessageText
                        }>
                          {item.text}
                        </Text>
                      </View>
                    )}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.chatInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              {renderHeaderAndTabs()}
              {activeTab === 'Feed' && (
                <>
                  <View style={styles.travelersHeader}>
                    <Text style={[styles.subHeading, { color: textColor }]}>Posts</Text>
                  </View>
                 
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <TouchableOpacity key={post.id} onPress={() => navigation.navigate('PostDetailScreen', { postId: post.id })}>
                        <View style={[styles.postCard, { backgroundColor: cardBackground }]}>
                          <View style={styles.postHeader}>
                            <Image source={post.avatarUrl ? { uri: post.avatarUrl } : require('../../assets/images/dulrav.png')} style={styles.avatarSmall} />
                            <View>
                              <Text style={[styles.posterName, { color: textColor }]}>{post.userName || 'Traveler'}</Text>
                              <Text style={[styles.timestamp, { color: mutedText }]}>{new Date(post.timestamp).toLocaleString()}</Text>
                            </View>
                          </View>
                          <Text style={[styles.postText, { color: textColor }]}>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</Text>
                          {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : <Text style={{ color: mutedText, padding: 20 }}>No posts available.</Text>}
                </>
              )}
              {activeTab === 'Event' && (
                <>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <View key={event.id} style={[styles.postCard, { backgroundColor: cardBackground }]}>
                        <View style={styles.postHeader}>
                          <Image source={event.avatarUrl ? { uri: event.avatarUrl } : require('../../assets/images/dulrav.png')} style={styles.avatarSmall} />
                          <View>
                            <Text style={[styles.posterName, { color: textColor }]}>{event.organizer || 'Organizer'}</Text>
                            <Text style={[styles.timestamp, { color: mutedText }]}>{new Date(event.timestamp).toLocaleString()}</Text>
                          </View>
                        </View>
                        <Text style={[styles.postText, { color: textColor }]}>{event.description}</Text>
                        {event.image && <Image source={{ uri: event.image }} style={styles.postImage} />}
                      </View>
                    ))
                  ) : <Text style={{ color: mutedText, padding: 20 }}>No events available.</Text>}
                </>
              )}
            </ScrollView>

            {activeTab !== 'Message' && (
              <TouchableOpacity style={styles.fab} onPress={() => router.push(activeTab === 'Event' ? '/CreateEventScreen' : '/CreatePostScreen')}>
                <AntDesign name="pluscircle" size={56} color="#43A047" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  // General Styles
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginHorizontal: 20 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16, borderBottomWidth: 1, paddingBottom: 6, marginHorizontal: 20 },
  tabText: { fontSize: 16, textAlign: 'center' },
  activeTab: { fontWeight: '600' },
  underline: { height: 2, backgroundColor: '#43A047', marginTop: 4 },
  fab: { position: 'absolute', bottom: 30, right: 30 },

  // Feed/Event Styles
  travelersHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 20, alignItems: 'center' },
  subHeading: { fontSize: 16, fontWeight: '600' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginTop: 12 },
  avatarName: { fontSize: 12, marginTop: 4 },
  postCard: { marginHorizontal: 20, marginTop: 20, borderRadius: 12, padding: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  postHeader: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20 },
  posterName: { fontWeight: 'bold', fontSize: 14 },
  timestamp: { fontSize: 10 },
  postText: { fontSize: 14, marginBottom: 8 },
  postImage: { width: '100%', height: 180, borderRadius: 10, marginTop: 8 },

  // Styles for Message Search
  messageContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  messageHeader: { fontSize: 22, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, borderColor: '#ccc', borderWidth: 1 },
  userCard: { backgroundColor: '#fff', padding: 14, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  userName: { fontSize: 16, fontWeight: '500' },
  userEmail: { fontSize: 12, color: '#555' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },

  // Styles for Chat View
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatHeaderText: { fontSize: 18, fontWeight: 'bold'},
  backButtonText: { color: '#43A047', fontSize: 14, fontWeight: '500' },
  messageBubble: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, maxWidth: '80%', marginBottom: 8, },
  myMessage: { backgroundColor: '#43A047', alignSelf: 'flex-end' },
  myMessageText: { color: '#fff' },
  theirMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
  theirMessageText: { color: '#000' },
  systemMessage: { backgroundColor: 'transparent', alignSelf: 'center' },
  systemMessageText: { color: '#888', fontStyle: 'italic', fontSize: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  chatInput: { flex: 1, height: 40, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendButton: { backgroundColor: '#43A047', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});
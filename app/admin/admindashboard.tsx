// AdminDashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/adminuserlist')}>
        <Text style={styles.cardText}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/adminlocationlist')}>
        <Text style={styles.cardText}>Manage Locations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/adminpostlist')}>
        <Text style={styles.cardText}>Manage Posts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/admineventlist')}>
        <Text style={styles.cardText}>Manage Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  card: {
    backgroundColor: '#4CAF50',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: { color: '#fff', fontSize: 20, textAlign: 'center' },
});

export default AdminDashboard;

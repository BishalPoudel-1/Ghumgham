import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../theme-context';
import { onValue, ref, off } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

type RootStackParamList = {
  ExpenseScreen: undefined;
  addexpense: { groupId: string; members: Record<string, string> };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExpenseScreen'>;

type Expense = {
  id?: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitDetail: Record<string, number>;
  timestamp: number;
};

type Members = Record<string, string>;

type GroupExpenses = {
  groupId: string;
  members: Members;
  expenses: Expense[];
};

const ExpenseScreen: React.FC = () => {
  const [groupExpenses, setGroupExpenses] = useState<GroupExpenses[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp>();

 
  useEffect(() => {
  console.log('Setting up auth state listener');
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    
    if (user) {
       const emailKey = user.email?.replace(/\./g, '_') || null;

          const userRef = ref(database, `users/${emailKey}`);
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.name) {
              setCurrentUserId(data.name);
            }
          });
      
    } else {
      console.log('User logged out or not authenticated');
      setCurrentUserId(null);
      setGroupExpenses([]); // Clear on logout
    }
  });

  return () => {
    console.log('Cleaning up auth listener');
    unsubscribeAuth();
  };
}, []);

useEffect(() => {
  if (!currentUserId) {
    console.log('No current user ID, skipping group fetch');
    return;
  }

  console.log('Fetching groups for user:', currentUserId);
  const groupsRef = ref(database, 'expenseManager');

  const unsubscribeGroups = onValue(groupsRef, (snapshot) => {
    const data = snapshot.val();
    console.log('Groups data from DB:', data);

    if (!data) {
      console.log('No groups found in DB');
      setGroupExpenses([]);
      return;
    }

    const groupsArray: GroupExpenses[] = [];

    Object.entries(data).forEach(([groupId, groupData]) => {
      const members = (groupData as any).members as Members;
      console.log(`Checking group ${groupId} members:`, members);

      if (members && Object.values(members).includes(currentUserId)) {
        console.log(`User ${currentUserId} is in group ${groupId}`);

        const expensesData = (groupData as any).expenses || {};
        const expenses: Expense[] = Object.entries(expensesData).map(([id, exp]) => ({
          id,
          ...(exp as Expense),
        }));

        expenses.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`Group ${groupId} expenses:`, expenses);

        groupsArray.push({
          groupId,
          members,
          expenses,
        });
      }
    });

    console.log('Groups after filtering for current user:', groupsArray);
    setGroupExpenses(groupsArray);
  });

  return () => {
    console.log('Cleaning up groups listener');
    unsubscribeGroups();
  };
}, [currentUserId]);

  const textColor = isDarkMode ? '#fff' : '#222';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#fff';
  const containerBg = isDarkMode ? '#121212' : '#F8F9EA';

  const getUserName = (members: Members, uid: string) => members[uid] ?? uid;

  const total = groupExpenses.reduce((sumGroup, group) => {
    return sumGroup + group.expenses.reduce((sum, e) => sum + e.amount, 0);
  }, 0);

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <Text style={[styles.header, { color: textColor }]}>Group Expenses</Text>
      <Text style={[styles.total, { color: textColor }]}>Total: NPR {total}</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {groupExpenses.length === 0 && (
          <Text style={{ color: textColor, textAlign: 'center', marginTop: 20 }}>
            No expenses found for your groups. Add some!
          </Text>
        )}

        {groupExpenses.map(({ groupId, members, expenses }) => (
          <View key={groupId} style={{ marginBottom: 24 }}>
            <Text style={[styles.groupTitle, { color: textColor }]}>Group: {groupId}</Text>
            {expenses.length === 0 ? (
              <Text style={{ color: textColor, fontStyle: 'italic', marginBottom: 12 }}>
                No expenses in this group yet.
              </Text>
            ) : (
              expenses.map((exp) => (
                <View key={exp.id} style={[styles.card, { backgroundColor: cardBackground }]}>
                  <Text style={[styles.title, { color: textColor }]}>{exp.title}</Text>
                  <Text style={{ color: textColor, marginBottom: 4 }}>Category: {exp.category}</Text>
                  <Text style={{ color: textColor }}>Amount: NPR {exp.amount}</Text>
                  <Text style={{ color: textColor }}>
                    Paid By: <Text style={{ fontWeight: '600' }}>{getUserName(members, exp.paidBy)}</Text>
                  </Text>
                  <Text style={{ color: textColor, marginTop: 8, fontWeight: '600' }}>Split Details:</Text>
                  {Object.entries(exp.splitDetail).map(([uid, amount]) => (
                    <Text key={uid} style={{ color: textColor, marginLeft: 8 }}>
                      {getUserName(members, uid)}: NPR {amount}
                    </Text>
                  ))}
                  <Text style={{ color: textColor, marginTop: 8, fontStyle: 'italic' }}>
                    Date: {new Date(exp.timestamp).toLocaleString()}
                  </Text>

                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#007AFF' }]}
                      onPress={() => Alert.alert('Edit Expense', `Edit ${exp.title} coming soon!`)}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#FF3B30', marginLeft: 10 }]}
                      onPress={() => Alert.alert('Delete Expense', `Delete ${exp.title} coming soon!`)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (groupExpenses.length > 0) {
            navigation.navigate('addexpense', {
              groupId: groupExpenses[0].groupId,
              members: groupExpenses[0].members,
            });
          } else {
            Alert.alert('No Group', 'You are not part of any group yet.');
          }
        }}
      >
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

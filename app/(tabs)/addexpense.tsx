import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { database } from '../../firebase/firebaseConfig';
import { ref as dbRef, push, onValue, off } from 'firebase/database';
import { useTheme } from '../theme-context'; // Adjust path as needed

const CATEGORY_OPTIONS = [
  'Food',
  'Accommodation',
  'Transport',
  'Entertainment',
  'Miscellaneous',
];

const GROUP_ID = 'group1'; // Fixed groupId, change as needed

const AddExpense: React.FC = () => {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? '#fff' : '#000';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const borderColor = isDarkMode ? '#555' : '#aaa';
  const placeholderColor = isDarkMode ? '#888' : '#aaa';
  const categoryBg = isDarkMode ? '#444' : '#ddd';

  const [members, setMembers] = useState<Record<string, string>>({});
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [title, setTitle] = useState('');
  const [amountText, setAmountText] = useState('');
  const [category, setCategory] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitDetail, setSplitDetail] = useState<Record<string, string>>({});

  const scrollRef = useRef<ScrollView>(null);

  // Fetch members on mount
  useEffect(() => {
    const membersRef = dbRef(database, `expenseManager/${GROUP_ID}/members`);
    const listener = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMembers(data);
        const firstUid = Object.keys(data)[0];
        setPaidBy(firstUid);
        const initSplit: Record<string, string> = {};
        Object.keys(data).forEach(uid => {
          initSplit[uid] = '';
        });
        setSplitDetail(initSplit);
      } else {
        setMembers({});
      }
      setLoadingMembers(false);
    });

    return () => off(membersRef, 'value', listener);
  }, []);

  const updateSplitAmount = (uid: string, value: string) => {
    setSplitDetail(prev => ({ ...prev, [uid]: value }));
  };

  const handleSubmit = () => {
    Keyboard.dismiss();

    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a title');
      return;
    }
    const amount = parseFloat(amountText);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Validation', 'Please enter a category');
      return;
    }
    if (!paidBy) {
      Alert.alert('Validation', 'Please select who paid');
      return;
    }

    const splitNumbers: Record<string, number> = {};
    let splitSum = 0;
    for (const uid of Object.keys(members)) {
      const val = splitDetail[uid];
      const n = parseFloat(val);
      if (val.trim() === '' || isNaN(n) || n < 0) {
        Alert.alert('Validation', `Please enter a valid split amount for ${members[uid]}`);
        return;
      }
      splitNumbers[uid] = n;
      splitSum += n;
    }

    if (Math.abs(splitSum - amount) > 0.01) {
      Alert.alert('Validation', `Split amounts (${splitSum}) do not sum to total amount (${amount})`);
      return;
    }

    const newExpense = {
      title: title.trim(),
      amount,
      category: category.trim(),
      paidBy,
      splitDetail: splitNumbers,
      timestamp: Date.now(),
    };

    const expensesRef = dbRef(database, `expenseManager/${GROUP_ID}/expenses`);
    push(expensesRef, newExpense)
      .then(() => {
        Alert.alert('Success', 'Expense added!');
        setTitle('');
        setAmountText('');
        setCategory('');
        const firstUid = Object.keys(members)[0] || '';
        setPaidBy(firstUid);
        const resetSplit: Record<string, string> = {};
        Object.keys(members).forEach(uid => {
          resetSplit[uid] = '';
        });
        setSplitDetail(resetSplit);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to add expense: ' + err.message);
      });
  };

  if (loadingMembers) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16, color: textColor }}>Loading members...</Text>
      </View>
    );
  }

  if (Object.keys(members).length === 0) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: textColor }}>
          No members found. Please add members before adding expenses.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: textColor }]}>Title</Text>
      <TextInput
        style={[styles.input, { color: textColor, borderColor, backgroundColor: isDarkMode ? '#222' : '#fff' }]}
        placeholder="Expense title"
        placeholderTextColor={placeholderColor}
        value={title}
        onChangeText={setTitle}
        returnKeyType="done"
      />

      <Text style={[styles.label, { color: textColor }]}>Amount (NPR)</Text>
      <TextInput
        style={[styles.input, { color: textColor, borderColor, backgroundColor: isDarkMode ? '#222' : '#fff' }]}
        placeholder="Total amount"
        placeholderTextColor={placeholderColor}
        value={amountText}
        onChangeText={setAmountText}
        keyboardType="numeric"
        returnKeyType="done"
      />

      <Text style={[styles.label, { color: textColor }]}>Category</Text>
      <View style={styles.categoryContainer}>
        {CATEGORY_OPTIONS.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryOption,
              { backgroundColor: category === cat ? '#007AFF' : categoryBg },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected, { color: category === cat ? '#fff' : textColor }]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: textColor }]}>Paid By</Text>
      {Object.entries(members).map(([uid, name]) => (
        <TouchableOpacity
          key={uid}
          style={[styles.radioOption, paidBy === uid && { backgroundColor: '#007AFF22', borderRadius: 8 }]}
          onPress={() => setPaidBy(uid)}
        >
          <Text style={[styles.radioText, { color: textColor }]}>{name}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.label, { marginTop: 20, color: textColor }]}>Split Amounts</Text>
      {Object.entries(members).map(([uid, name]) => (
        <View key={uid} style={styles.splitRow}>
          <Text style={[styles.splitName, { color: textColor }]}>{name}</Text>
          <TextInput
            style={[
              styles.input,
              styles.splitInput,
              { color: textColor, borderColor, backgroundColor: isDarkMode ? '#222' : '#fff' },
            ]}
            placeholder="0"
            placeholderTextColor={placeholderColor}
            keyboardType="numeric"
            value={splitDetail[uid]}
            onChangeText={val => updateSplitAmount(uid, val)}
            returnKeyType="done"
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: '#007AFF' }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryOption: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  radioOption: {
    paddingVertical: 8,
  },
  radioText: {
    fontSize: 16,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitName: {
    flex: 1,
    fontSize: 16,
  },
  splitInput: {
    flex: 1,
    marginLeft: 10,
  },
  submitBtn: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

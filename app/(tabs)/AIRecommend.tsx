import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '../theme-context';

// Your OpenAI API key here (preferably use .env or secure storage)
const OPENAI_API_KEY = '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';

export default function AIRecommend() {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const inputBg = isDarkMode ? '#1e1e1e' : '#fff';
  const borderColor = isDarkMode ? '#555' : '#ccc';

  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const onChangeStartDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onChangeEndDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  async function callOpenAI(prompt: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful travel assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  const generateRecommendations = async () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      Alert.alert('Validation', 'Please enter both start and end locations.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Validation', 'End date cannot be before start date.');
      return;
    }

    setLoading(true);
    setRecommendations([]);

    try {
      const prompt = `
You are a travel assistant AI.

User wants a trip from ${startLocation} to ${endLocation} from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}.

Please suggest 5 interesting places or activities to visit or do on the way.
Provide a short description for each suggestion.

Please return the answer as a JSON array of strings.
      `;

      const textResponse = await callOpenAI(prompt);

      let recs: string[] = [];
      try {
        recs = JSON.parse(textResponse);
        if (!Array.isArray(recs)) throw new Error('Response is not an array');
      } catch {
        recs = textResponse.split('\n').filter(Boolean);
      }

      setRecommendations(recs);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to get recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 0 }}>
        <Text style={[styles.header, { color: textColor }]}>AI Trip Recommendations</Text>

        <Text style={[styles.label, { color: textColor }]}>Start Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
          value={startLocation}
          onChangeText={setStartLocation}
          placeholder="Enter start location"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        />

        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>End Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
          value={endLocation}
          onChangeText={setEndLocation}
          placeholder="Enter end location"
          placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        />

        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={[styles.datePicker, { borderColor }]}>
          <Text style={{ color: textColor }}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeStartDate}
            maximumDate={new Date(2100, 11, 31)}
          />
        )}

        <Text style={[styles.label, { color: textColor, marginTop: 20 }]}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={[styles.datePicker, { borderColor }]}>
          <Text style={{ color: textColor }}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeEndDate}
            minimumDate={startDate}
            maximumDate={new Date(2100, 11, 31)}
          />
        )}

        <TouchableOpacity style={styles.generateBtn} onPress={generateRecommendations} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateBtnText}>Generate</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Show recommendations right below Generate button */}
      <View style={{ marginTop: 20, flex: 1 }}>
        {recommendations.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { color: textColor }]}>Recommended Trips</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {recommendations.map((rec, i) => (
                <View key={i} style={[styles.recCard, { borderColor }]}>
                  <Text style={[styles.recText, { color: textColor }]}>{rec}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: 8,
  },
  datePicker: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginTop: 6,
  },
  generateBtn: {
    backgroundColor: '#43A047',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  recText: {
    fontSize: 16,
  },
});

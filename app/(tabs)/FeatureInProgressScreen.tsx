import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';

// Define your navigation stack type
type RootStackParamList = {
  FeatureInProgress: undefined;
  VirtualTour: undefined;
  // Add other screens here
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FeatureInProgress'
>;

export default function FeatureInProgressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const subTextColor = isDarkMode ? '#aaa' : '#555';
  const cardColor = isDarkMode ? '#1e1e1e' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Image
          source={require('../../assets/images/construction.png')}
          style={styles.image}
        />
        <Text style={[styles.title, { color: textColor }]}>Coming Soon!</Text>
        <Text style={[styles.subtitle, { color: subTextColor }]}>
          We're working hard to bring this feature to life. Stay tuned for updates.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={16} color="#2E7D32" />
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  image: {
    height: 180,
    width: 180,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    marginLeft: 6,
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
});

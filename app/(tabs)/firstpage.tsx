import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router'; // ✅ useRouter hook

const { height } = Dimensions.get('window');

export default function Firstpage() {
  const router = useRouter(); // ✅ call useRouter

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Image
          source={require('../../assets/images/firstpageintro.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Explore the{'\n'}world easily</Text>
          <Text style={styles.subtitle}>Reach the unknown spot</Text>
        </View>

       <TouchableOpacity
  style={styles.button}
  onPress={() => {
    console.log("Button pressed"); // for confirmation
    router.replace('/login');
  }}
>
  <Text style={styles.buttonText}>Get Started</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // black outer background like in screenshot
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: '#F8F9EA',
 
    width: '100%',
    height: height * 1,
    alignItems: 'center',
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: height * 0.35,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

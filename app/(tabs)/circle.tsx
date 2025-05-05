import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Circle() {
  return <View style={styles.circle} />;
}

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width/height
    backgroundColor: '#F8F9EA',
    alignSelf: 'center',
    marginTop: 100,
  },
});

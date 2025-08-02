// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './theme-context';
import SplashScreenComponent from './SplashScreen';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet, ViewStyle } from 'react-native';



export default function AppLayout() {
const [loading, setLoading] = useState(true);
useEffect(()=>{
  setTimeout(()=>{
    setLoading(false)
  },2600
);

}

);

  return (
   

   
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Slot />
        {loading && (
         <View style={StyleSheet.absoluteFillObject}>
            <SplashScreenComponent />
          </View>
        )}
      </View>
    </ThemeProvider>
  );
}

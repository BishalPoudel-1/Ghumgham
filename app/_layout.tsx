// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './theme-context';

export default function AppLayout() {
  return (
    <ThemeProvider>
      <Stack initialRouteName="SplashScreen" screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

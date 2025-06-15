// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './theme-context';
import SplashScreenComponent from './SplashScreen';


export default function AppLayout() {
const [loading, setLoading] = useState(true);
useEffect(()=>{
  setTimeout(()=>{
    setLoading(false)
  },2500
);

}

);

  return (
   

   
    <ThemeProvider>
      {loading? (<SplashScreenComponent />):(
      <Stack initialRouteName="SplashScreen" screenOptions={{ headerShown: false }} />
    )}
      </ThemeProvider>
     
  );
}

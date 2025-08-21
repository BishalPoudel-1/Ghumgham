// WeatherFetcher.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = '80c958901fa079863026146749581762';
const CACHE_KEY = 'weather_cache';

export const fetchAndCacheWeather = async (lat: number, lon: number) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
console.log('Weather API response:', data)
if (!data.main || !data.weather || data.cod !== 200) {
  console.error('Invalid weather data:', data);
  throw new Error('Failed to fetch weather data');
}


    const payload = {
      city: data.name,
      temp: data.main.temp,
      condition: data.weather[0].main,
      updatedAt: new Date().toISOString(),
      
    };
    console.log(data.name);

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Error fetching/storing weather:', err);
    throw err;
  }
};

export const getCachedWeather = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Failed to read cached weather:', error);
    return null;
  }
};

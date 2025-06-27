import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj04dB1nhE3wzoHO7-Mp7mGrLUkktFGOo",
  authDomain: "ghumgham-app.firebaseapp.com",
  projectId: "ghumgham-app",
  storageBucket: "ghumgham-app.firebasestorage.app",
  databaseURL: "https://ghumgham-app-default-rtdb.firebaseio.com/",
  messagingSenderId: "182383031107",
  appId: "1:182383031107:android:85058658ce1209744d75f6"
  // measurementId is optional and not provided in your JSON
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);


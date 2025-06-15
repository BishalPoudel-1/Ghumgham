import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgziDSuHCnvqr5T4tPcHeSUZXrY7bDY0o",
  authDomain: "ghumgham-92191.firebaseapp.com",
  projectId: "ghumgham-92191",
  storageBucket: "ghumgham-92191.firebasestorage.app",
  messagingSenderId: "1045818017522",
  appId: "1:1045818017522:web:34c5f0f6ca211419a5726b",
  measurementId: "G-LP4R1Y9BBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app); 
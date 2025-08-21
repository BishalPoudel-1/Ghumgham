# 🌍 Ghumgham ✈️
<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
  <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white" />
</p>

Welcome to **Ghumgham**! A modern, full-featured mobile application designed to make tour and travel booking seamless and enjoyable. Discover new destinations, book your next adventure, and manage your trips all from your phone.

---

## 📋 Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Built With](#-built-with)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)


---

## 🌟 About The Project

**Ghumgham** is a mobile-first, full-stack application that serves as a one-stop platform for travelers.  
It provides a simple, intuitive, and reliable way to browse, book, and review travel packages on the go.  

Users can:
- Explore various destinations
- View detailed tour information
- Securely book trips
- Leave reviews and ratings  

This helps others make informed decisions while planning their next adventure.

---

## ✨ Key Features

- 🔐 **User Authentication**: Secure user registration and login with Firebase Authentication  
- 🔍 **Browse & Search Tours**: Easily search, filter, and sort through a wide variety of tour packages  
- 📝 **Detailed Tour Pages**: Comprehensive details including itinerary, price, and gallery  
- ⚡ **Real-time Booking System**: Secure booking with data stored in Firestore  
- ⭐ **User Reviews & Ratings**: Leave feedback on tours completed  
- 👤 **User Profiles**: Manage profile info and booking history
- 💰 **Split Expenses**: Easily split travel costs among group members for fair expense sharing  
- 📱 **Cross-Platform**: Built with React Native for iOS and Android  

---

## 🛠️ Built With

This project leverages a modern tech stack for performance and scalability.

### Frontend (Mobile)
- [React Native](https://reactnative.dev/) – JavaScript framework for building native apps  
- [TypeScript](https://www.typescriptlang.org/) – Typed superset of JavaScript  
- [Tailwind CSS (twrnc)](https://github.com/jaredh159/tailwind-react-native-classnames) – Utility-first CSS for rapid UI  

### Backend (Serverless)
- [Google Firebase](https://firebase.google.com/)  
  - **Authentication** – User sign-up, login, and session management  
  - **Cloud Firestore** – Flexible, scalable NoSQL database  
  - **Firebase Storage** – Store user-generated content (profile pictures, tour images)  

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development and testing.

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)  
- npm or yarn  
- [Expo CLI](https://docs.expo.dev/get-started/installation/) or React Native CLI  
- A [Google Firebase project](https://firebase.google.com/)  

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BishalPoudel-1/Ghumgham.git
   cd Ghumgham
   ```
2. **Install dependencies**
```
npm install
# OR
yarn install
```

3. **Set up Firebase**

Create a new Firebase project in the Firebase Console

Add a new Web App to get your Firebase config object

Create a file src/firebaseConfig.ts and add your config:
```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Important: Add this file to .gitignore to protect your keys.

## 🏃 Usage

Run the application using Expo or React Native CLI:
```
npm start
# OR
yarn start
```

Press a → Run on Android emulator/device

Press i → Run on iOS simulator/device

Now you can explore the app, create an account, browse tours, and test bookings!

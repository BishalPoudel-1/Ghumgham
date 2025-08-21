Ghumgham ✈️
Welcome to Ghumgham! A modern, full-featured mobile application designed to make tour and travel booking seamless and enjoyable. Discover new destinations, book your next adventure, and manage your trips all from your phone.

📋 Table of Contents
About The Project

Key Features

Built With

Getting Started

Prerequisites

Installation

Usage

Contributing

License

Contact

🌟 About The Project
Ghumgham is a mobile-first, full-stack application that serves as a one-stop platform for travelers. It addresses the need for a simple, intuitive, and reliable way to browse, book, and review travel packages on the go. Users can explore various destinations, view detailed tour information, and securely book their trips. The platform also allows users to leave reviews and ratings, helping others make informed decisions.

✨ Key Features
User Authentication: Secure user registration and login with Firebase Authentication.

Browse & Search Tours: Easily search, filter, and sort through a wide variety of tour packages.

Detailed Tour Pages: View comprehensive details for each tour, including itinerary, price, and gallery.

Real-time Booking System: A simple and secure booking process for users, with data stored in Firestore.

User Reviews & Ratings: Users can leave reviews and ratings on tours they've completed.

User Profiles: Users can view and manage their profile information and booking history.

Cross-Platform: Built with React Native to run natively on both iOS and Android devices.

🛠️ Built With
This project leverages a modern and powerful tech stack to deliver a robust and scalable mobile application.

Frontend (Mobile):

React Native - A JavaScript framework for building native mobile apps.

TypeScript - A typed superset of JavaScript that compiles to plain JavaScript.

Tailwind CSS (with twrnc or similar) - A utility-first CSS framework for rapid UI development in React Native.

Backend (Serverless):

Google Firebase - A comprehensive platform for building web and mobile applications.

Firebase Authentication: For handling user sign-up, login, and session management.

Cloud Firestore: A flexible, scalable NoSQL cloud database for storing application data.

Firebase Storage: For storing user-generated content like profile pictures or tour images.

🚀 Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing purposes.

Prerequisites
Make sure you have the following software installed on your machine:

Node.js (v16 or higher)

npm or yarn

Expo CLI or React Native CLI set up for development.

A Google Firebase project.

Installation
Clone the repository:

git clone https://github.com/BishalPoudel-1/Ghumgham.git

Navigate to the project directory:

cd Ghumgham

Install Dependencies:

npm install
# OR
yarn install

Set up Firebase:

Create a new project in the Firebase Console.

Add a new web application to your Firebase project to get your Firebase configuration object.

Create a configuration file in your project's source directory (e.g., src/firebaseConfig.ts).

Add your Firebase configuration to this file. Remember to add this file to your .gitignore to keep your keys private!

// src/firebaseConfig.ts
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

🏃 Usage
To run the application, use the appropriate command for your development environment (Expo or React Native CLI).

Start the Development Server:

npm start
# OR
yarn start

Run on an Emulator or Physical Device:

Press a to run on an Android Emulator/device.

Press i to run on an iOS Simulator/device.

Now you can explore the application, create an account, browse tours, and test the booking functionality!

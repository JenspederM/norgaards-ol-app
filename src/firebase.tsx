// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-puE41J_NDaEdYFBRwYixGsK7i2DJqgQ",
  authDomain: "norgaards-ol-app.firebaseapp.com",
  projectId: "norgaards-ol-app",
  storageBucket: "norgaards-ol-app.appspot.com",
  messagingSenderId: "245178053513",
  appId: "1:245178053513:web:181ddd2cf8a24a04432758",
  measurementId: "G-MZF8TF35E2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();

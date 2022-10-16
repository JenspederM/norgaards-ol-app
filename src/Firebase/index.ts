// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Inventory } from "./Inventory";
import { IUser, User, userConverter, Basket } from "./User";
import { IBeer, Beer, beerConverter } from "./Inventory/products/beer";

export {
  type IBeer, Beer, beerConverter, Inventory,
  type IUser, User, userConverter, Basket
}

const firebaseConfig = {
  apiKey: "AIzaSyD-puE41J_NDaEdYFBRwYixGsK7i2DJqgQ",
  authDomain: "norgaards-ol-app.firebaseapp.com",
  projectId: "norgaards-ol-app",
  storageBucket: "norgaards-ol-app.appspot.com",
  messagingSenderId: "245178053513",
  appId: "1:245178053513:web:181ddd2cf8a24a04432758",
  measurementId: "G-MZF8TF35E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);


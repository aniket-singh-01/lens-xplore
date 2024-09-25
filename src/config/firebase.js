import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqzqdKX5E-IQywlnnzEgf9aLx-Vf9eqg0",
  authDomain: "hakdit-lensxplore.firebaseapp.com",
  projectId: "hakdit-lensxplore",
  storageBucket: "hakdit-lensxplore.appspot.com",
  messagingSenderId: "1043900487601",
  appId: "1:1043900487601:web:869961a957e960f7080f90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

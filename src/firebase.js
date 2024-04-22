// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCMbtlY7nauQpAp9B35W0tFa26G6iqNMfE",
  authDomain: "project2-efba3.firebaseapp.com",
  databaseURL: "https://project2-efba3-default-rtdb.firebaseio.com",
  projectId: "project2-efba3",
  storageBucket: "project2-efba3.appspot.com",
  messagingSenderId: "103349080954",
  appId: "1:103349080954:web:6c0fc185a0a67413bd3cc3",
  measurementId: "G-QMBY6CV758"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
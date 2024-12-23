import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdB8YAoOSTjiuTrLnr_YU9EOdvFonUDGo",
  authDomain: "final077-70a5d.firebaseapp.com",
  projectId: "final077-70a5d",
  storageBucket: "final077-70a5d.firebasestorage.app",
  messagingSenderId: "1008335369140",
  appId: "1:1008335369140:web:b5375491cbf6fd5648b8e1",
  measurementId: "G-VNFKGW2CZZ"
};

export const Firebase = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(Firebase);
export const Firestore = getFirestore(Firebase);
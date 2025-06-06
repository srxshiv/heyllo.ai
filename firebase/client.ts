import { initializeApp , getApps , getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDKmun1_HJSlhDagSgkKIuVBh3WtBm_Ik",
  authDomain: "heyllo-ddb3e.firebaseapp.com",
  projectId: "heyllo-ddb3e",
  storageBucket: "heyllo-ddb3e.firebasestorage.app",
  messagingSenderId: "858642665207",
  appId: "1:858642665207:web:7dbf52f8966ca0955fcdf2",
  measurementId: "G-XRTTYGL990"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

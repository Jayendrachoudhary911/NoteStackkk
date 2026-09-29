// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCyXDnQniv4h0wZqKVeEgb36b6cMx-rxls",
    authDomain: "notestack-70461.firebaseapp.com",
    projectId: "notestack-70461",
    storageBucket: "notestack-70461.firebasestorage.app",
    messagingSenderId: "274403361075",
    appId: "1:274403361075:web:820147d1a2afce988cbe46"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

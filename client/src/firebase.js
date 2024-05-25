import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "reuse-vandy-ce83e.firebaseapp.com",
  projectId: "reuse-vandy-ce83e",
  storageBucket: "reuse-vandy-ce83e.appspot.com",
  messagingSenderId: "547936005724",
  appId: "1:547936005724:web:8bede6476f64154e078099",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

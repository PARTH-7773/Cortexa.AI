import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "automateai-2f87a.firebaseapp.com",
  projectId: "automateai-2f87a",
  storageBucket: "automateai-2f87a.firebasestorage.app",
  messagingSenderId: "393549967766",
  appId: "1:393549967766:web:45fb4c67e0a7c16b1aadb7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export default googleProvider

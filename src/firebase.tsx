import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAVffwVswjDUZW5xMcrB4sUXfRb-GOoOVo",
  authDomain: "harmony-force-71e13.firebaseapp.com",
  projectId: "harmony-force-71e13",
  storageBucket: "harmony-force-71e13.appspot.com", 
  messagingSenderId: "113882130706",
  appId: "1:113882130706:web:543d4ae128806d1e8e2bcb",
  measurementId: "G-S66FHTCMGE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
const analytics = getAnalytics(app);

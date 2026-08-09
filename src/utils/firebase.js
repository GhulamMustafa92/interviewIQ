import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "interviewiq-df2c4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "interviewiq-df2c4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "interviewiq-df2c4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "994767466407",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:994767466407:web:d88b1e7ecffc8fbd0c9082"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("profile");
provider.addScope("email");
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };
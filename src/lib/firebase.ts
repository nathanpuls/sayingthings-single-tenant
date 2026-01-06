import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyApNSFQwh3xFaVo8MVqJaH4DUG6xT1dHV8",
    authDomain: "sayingthings-5027f.firebaseapp.com",
    projectId: "sayingthings-5027f",
    storageBucket: "sayingthings-5027f.firebasestorage.app",
    messagingSenderId: "473897322768",
    appId: "1:473897322768:web:d636709e0c30e03e0d7d95",
    measurementId: "G-5WRT02J883"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

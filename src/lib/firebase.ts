import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCI8MUhW3QhE6bL7Mseo1RKUkIGEWvovIg",
    authDomain: "automex-ai.firebaseapp.com",
    projectId: "automex-ai",
    storageBucket: "automex-ai.firebasestorage.app",
    messagingSenderId: "793619175250",
    appId: "1:793619175250:web:0573baba5b563ee052cc8b",
    measurementId: "G-FM11VE6K7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

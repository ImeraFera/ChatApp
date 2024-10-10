import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
    authDomain: "messageapp-d679a.firebaseapp.com",
    projectId: "messageapp-d679a",
    storageBucket: "messageapp-d679a.appspot.com",
    messagingSenderId: "285472618973",
    appId: "1:285472618973:web:a9011148a0b3bd6ee55e34"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
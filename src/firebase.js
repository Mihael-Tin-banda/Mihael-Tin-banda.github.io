import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-YuDAXpZgtKgjHyfQXir-J1siWselhDU",
  authDomain: "steps-da687.firebaseapp.com",
  projectId: "steps-da687",
  storageBucket: "steps-da687.appspot.com",
  messagingSenderId: "815638417742",
  appId: "1:815638417742:web:bf805c578594e473968e1f",
  measurementId: "G-3ZBJG2GSW8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, doc, getDoc, setDoc, provider, GoogleAuthProvider, signInWithPopup };

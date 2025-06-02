// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBgxzrqYeEmlCrWgnXDYZh4jUr5GNaKKUg",
  authDomain: "tic-tac-toe-3a686.firebaseapp.com",
  projectId: "tic-tac-toe-3a686",
  storageBucket: "tic-tac-toe-3a686.firebasestorage.app",
  messagingSenderId: "123204135947",
  appId: "1:123204135947:web:16194a49e4e002529e6b0e",
  measurementId: "G-Z15ZD74YJ3"
};

const app = initializeApp(firebaseConfig);
const db= getDatabase(app);

export {db,ref,set,onValue};

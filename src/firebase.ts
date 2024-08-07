import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAbP7iJkET8Sz8yzXZ4tL_1lRrayIA0ek",
  authDomain: "reactdental.firebaseapp.com",
  projectId: "reactdental",
  storageBucket: "reactdental.appspot.com",
  messagingSenderId: "746809097841",
  appId: "1:746809097841:web:252788f0ca59caea9665d0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);

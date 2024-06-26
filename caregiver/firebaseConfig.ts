import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBcT-GPRHicEv6RWnQgUbb-n_VXI5clRKE",
  authDomain: "caregiver-2fb00.firebaseapp.com",
  projectId: "caregiver-2fb00",
  storageBucket: "caregiver-2fb00.appspot.com",
  messagingSenderId: "618655603701",
  appId: "1:618655603701:web:ddfc5e3ea4b69c105adebc",
  measurementId: "G-YP3LD1YXBT"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
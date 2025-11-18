// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ2_4FI_1mVal2u8cbahNuvYnwbh5tf5M",
  authDomain: "codetester-c86b8.firebaseapp.com",
  projectId: "codetester-c86b8",
  storageBucket: "codetester-c86b8.firebasestorage.app",
  messagingSenderId: "392808066558",
  appId: "1:392808066558:web:983408f334f3b182aca4af",
  measurementId: "G-JX14B9FSPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();

export default app;

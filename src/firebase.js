import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCE5rTcii3h31mgIMd4ITqGJEMZcfIg2kI",
  authDomain: "social-project-9ad6a.firebaseapp.com",
  projectId: "social-project-9ad6a",
  storageBucket: "social-project-9ad6a.appspot.com",
  messagingSenderId: "51927749930",
  appId: "1:51927749930:web:47678c3646b82813af7a53",
  measurementId: "G-K9539VBKDW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

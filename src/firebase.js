import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// วางส่วนที่คุณก๊อปปี้มาจากหน้าเว็บ Firebase ตรงนี้
const firebaseConfig = {
  apiKey: "AIzaSyAlyk9dk2_17OA0PjKC6wcrm6xcSBqb7BI",
  authDomain: "infinitestepchat.firebaseapp.com",
  databaseURL: "https://infinitestepchat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "infinitestepchat",
  storageBucket: "infinitestepchat.firebasestorage.app",
  messagingSenderId: "802948211202",
  appId: "1:802948211202:web:af56c5c6e6737c993ffd1b",
  measurementId: "G-YS0SSCN4FS"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
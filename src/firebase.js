import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  push, 
  onDisconnect, 
  serverTimestamp 
} from "firebase/database"; 
// 1. เพิ่มการนำเข้าจาก firestore
import { getFirestore } from "firebase/firestore"; 

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

// 2. ส่งออก db สำหรับ Realtime Database (แชท/ระบบออนไลน์) - ของเดิม
export const rtdb = getDatabase(app); 

// 3. ส่งออก db สำหรับ Firestore (ตลาดกลาง/ระบบใหม่) - อันนี้ที่ต้องเพิ่ม!
export const db = getFirestore(app); 

// ---------------------------------------------------------
// ส่วนของระบบ God Mode และ Presence (คงเดิมทั้งหมด)
// ---------------------------------------------------------

const checkIsDev = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('dev_token') === '198831';
};

if (typeof window !== 'undefined') {
  window.publishBroadcast = (msg) => {
    if (!checkIsDev()) {
      console.error("❌ Access Denied: You are not the Creator.");
      return;
    }
    // ใช้ rtdb แทน db เพื่อให้แชทระบบเดิมยังทำงานได้
    const broadcastRef = ref(rtdb, 'system/broadcast');
    set(broadcastRef, {
      message: msg,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      console.log("📢 Dev: Global Broadcast Sent!");
    });
  };
}

let currentSessionRef = null;
export const updateOnlineStatus = (playerName) => {
  if (!playerName) return;
  const connectedRef = ref(rtdb, ".info/connected");
  
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      if (!currentSessionRef) {
        const statusListRef = ref(rtdb, 'status');
        currentSessionRef = push(statusListRef); 
      }
      onDisconnect(currentSessionRef).remove();
      const isActualDev = checkIsDev();
      set(currentSessionRef, {
        username: playerName,
        last_active: serverTimestamp(),
        online: true,
        isAdmin: isActualDev 
      });
    }
  });
};
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

// ✅ วางส่วนที่คุณก๊อปปี้มาจากหน้าเว็บ Firebase ตรงนี้ (คงเดิม 100%)
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

/**
 * 📢 [NEW] ระบบประกาศพระเจ้า (God Announcement)
 * ฟังก์ชันสำหรับ Dev สั่งประกาศผ่าน Console: publishBroadcast("ข้อความ")
 */
if (typeof window !== 'undefined') {
  window.publishBroadcast = (msg) => {
    const broadcastRef = ref(db, 'system/broadcast');
    set(broadcastRef, {
      message: msg,
      timestamp: Date.now(), // ใช้เวลาฝั่ง Client เพื่อความไวในการเทียบ
      id: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      console.log("📢 Dev: Global Broadcast Sent!");
    });
  };
}

/**
 * ✨ ระบบ Presence: ตรวจสอบสถานะออนไลน์ (คงเดิม 100%)
 * ใช้ระบบ currentSessionRef เพื่อแยก ID ของแต่ละหน้าจอ
 */
let currentSessionRef = null;

export const updateOnlineStatus = (playerName) => {
  if (!playerName) return;

  const connectedRef = ref(db, ".info/connected");
  
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      if (!currentSessionRef) {
        const statusListRef = ref(db, 'status');
        currentSessionRef = push(statusListRef); 
      }

      onDisconnect(currentSessionRef).remove();

      set(currentSessionRef, {
        username: playerName,
        last_active: serverTimestamp(),
        online: true
      });
      console.log("Firebase: Online status updated!");
    }
  });
};
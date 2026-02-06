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
 * 🔑 [DEV ONLY] ฟังก์ชันตรวจสอบสิทธิ์พระเจ้า
 * เช็คว่าเครื่องนี้มี Token ลับของผู้พัฒนาหรือไม่
 */
const checkIsDev = () => {
  if (typeof window === 'undefined') return false;
  // คุณสามารถเปลี่ยน 'MY_PRIVATE_KEY' เป็นรหัสลับอะไรก็ได้ที่คุณจำได้คนเดียว
  return localStorage.getItem('dev_token') === '198831';
};

/**
 * 📢 [NEW] ระบบประกาศพระเจ้า (God Announcement)
 * ฟังก์ชันสำหรับ Dev สั่งประกาศผ่าน Console: publishBroadcast("ข้อความ")
 */
if (typeof window !== 'undefined') {
  window.publishBroadcast = (msg) => {
    // 🛡️ ป้องกันเบื้องต้น: เฉพาะคนที่มี Token ในเครื่องถึงจะยิงประกาศได้
    if (!checkIsDev()) {
      console.error("❌ Access Denied: You are not the Creator.");
      return;
    }

    const broadcastRef = ref(db, 'system/broadcast');
    set(broadcastRef, {
      message: msg,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      console.log("📢 Dev: Global Broadcast Sent!");
    });
  };
}

/**
 * ✨ ระบบ Presence: ตรวจสอบสถานะออนไลน์
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

      // 🕵️ เช็คว่าเครื่องนี้คือ Dev ตัวจริงหรือไม่
      const isActualDev = checkIsDev();

      set(currentSessionRef, {
        username: playerName,
        last_active: serverTimestamp(),
        online: true,
        // ✅ ส่งค่า isAdmin ขึ้นไปบน Firebase เฉพาะเครื่องคุณ
        // คราวนี้ชื่ออะไรก็ได้ แต่ถ้า isAdmin เป็น true = ของจริง
        isAdmin: isActualDev 
      });
      console.log(`Firebase: Online status updated! ${isActualDev ? '(GOD MODE)' : ''}`);
    }
  });
};
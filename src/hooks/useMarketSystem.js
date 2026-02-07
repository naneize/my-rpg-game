import { useState, useEffect } from 'react';
// ✅ 1. เปลี่ยนจาก rtdb เป็น db (เพราะเราจะใช้ Firestore)
import { db } from '../firebase'; 
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export const useMarketSystem = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 1. ดึงข้อมูลจาก Firebase แบบ Real-time
  useEffect(() => {
  // ✅ กลับมาใช้ orderBy ได้ แต่ต้องมั่นใจว่าทุกใบมี createdAt
  // หรือถ้ากลัวพัง ให้ query ปกติแล้วมาเรียงลำดับด้วย JavaScript แทน
  const q = query(collection(db, 'market_board')); 
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // ป้องกัน Error ถ้าไม่มีฟิลด์ createdAt
      createdAt: doc.data().createdAt || { toDate: () => new Date() } 
    }))
    // ✅ เรียงลำดับด้วย JS แทน (ปลอดภัยกว่าถ้าข้อมูลไม่ครบ)
    .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    setListings(data);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  // 📤 2. ฟังก์ชันสำหรับลงประกาศขาย
  const postListing = async (sellerName, itemId, want, description) => {
    try {
      // ✅ 3. เปลี่ยน rtdb เป็น db
      await addDoc(collection(db, 'market_board'), {
        sellerName,
        itemId,
        want,
        description,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("Error posting to market:", error);
      return { success: false, error };
    }
  };

  return { listings, loading, postListing };
};
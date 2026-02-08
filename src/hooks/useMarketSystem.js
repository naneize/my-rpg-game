import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

export const useMarketSystem = (player, setPlayer) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 1. ดึงข้อมูลจาก Firebase แบบ Real-time
  useEffect(() => {
    const q = query(collection(db, 'market_board')); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || { toDate: () => new Date() } 
      }))
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 📤 2. ฟังก์ชันสำหรับลงประกาศขาย
  const postListing = async (sellerName, itemId, want, description, itemData, sellCount = 1) => {
    try {
      await addDoc(collection(db, 'market_board'), {
        sellerName,
        itemId,
        want,
        description,
        sellCount: sellCount || 1, // บันทึกจำนวนที่ขาย
        itemData: itemData || null, 
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 🛒 3. ฟังก์ชันซื้อไอเทม (เวอร์ชันฉลาด ตรวจจับ DUST/SHARD/SCRAP อัตโนมัติ)
  const buyItem = async (post) => {
    try {
      // --- [A] ตรวจสอบราคาและประเภททรัพยากร ---
      const priceStr = (post.want || "0").toUpperCase();
      const price = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
      
      // ค้นหาคีย์ทรัพยากร: ลำดับคือ SHARD -> DUST -> SCRAP
      let assetKey = 'scrap'; // default
      let isMaterial = false;

      if (priceStr.includes('SHARD')) {
        assetKey = 'shards';
      } else if (priceStr.includes('DUST')) {
        assetKey = 'dust';
        isMaterial = true; // DUST มักอยู่ในหมวด materials
      } else if (priceStr.includes('SCRAP')) {
        assetKey = 'scrap';
      }

      // --- [B] ตรวจสอบยอดคงเหลือ (Balance Check) ---
      // เช็คว่าต้องไปดูที่ player[key] ตรงๆ หรือ player.materials[key]
      const currentBalance = isMaterial 
        ? (player.materials?.[assetKey.toLowerCase()] || 0)
        : (player[assetKey] || 0);

      if (currentBalance < price) {
        return { 
          success: false, 
          message: `ยอด ${assetKey.toUpperCase()} ไม่เพียงพอ! ต้องการ: ${price.toLocaleString()}` 
        };
      }

      // --- [C] ดำเนินการทางฐานข้อมูล ---
      await deleteDoc(doc(db, 'market_board', post.id));

      // --- [D] อัปเดตข้อมูลผู้เล่น ---
      if (setPlayer) {
        setPlayer(prev => {
          const updatedPlayer = { ...prev };
          
          // 1. หักทรัพยากร (หักตามประเภทที่ตรวจเจอ)
          if (isMaterial) {
            updatedPlayer.materials = {
              ...prev.materials,
              [assetKey.toLowerCase()]: (prev.materials[assetKey.toLowerCase()] || 0) - price
            };
          } else {
            updatedPlayer[assetKey] = (prev[assetKey] || 0) - price;
          }

          // 2. เสกไอเทมที่ซื้อเข้าตัว
          const qtyToReceive = post.sellCount || 1;

          if (post.isMaterial || (prev.materials && prev.materials[post.itemId] !== undefined)) {
            // กรณีซื้อ Material (เช่น ซื้อแร่)
            const currentCount = prev.materials[post.itemId] || 0;
            updatedPlayer.materials = {
              ...updatedPlayer.materials,
              [post.itemId]: currentCount + qtyToReceive
            };
          } else {
            // กรณีซื้ออุปกรณ์ (Inventory)
            const newItem = {
              ...(post.itemData || {}),
              id: post.itemId,
              instanceId: Date.now() + Math.random(),
              count: qtyToReceive
            };
            updatedPlayer.inventory = [...(prev.inventory || []), newItem];
          }
          
          return updatedPlayer;
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Purchase Error:", error);
      return { 
        success: false, 
        message: "เกิดข้อผิดพลาด: ไอเทมนี้อาจถูกซื้อไปก่อนหน้าแล้ว" 
      };
    }
  };

  return { listings, loading, postListing, buyItem };
};
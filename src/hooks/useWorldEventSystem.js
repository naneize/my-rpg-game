// ✅ สร้างไฟล์ใหม่ที่: src/hooks/useWorldEventSystem.js
import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update } from "firebase/database";
import { rtdb } from "../firebase";

export function useWorldEventSystem() {
  const [worldEvent, setWorldEvent] = useState({
    active: true,
    bossId: 'black_dragon_king',
    name: "BLACK DRAGON KING",
    currentHp: 12500,
    maxHp: 12500,
    damageDealers: {},
    participants: 0,
    lastRespawn: Date.now()
  });

  const [respawnTimeLeft, setRespawnTimeLeft] = useState(0);
  const [broadcast, setBroadcast] = useState({ show: false, message: '', type: 'INFO' });
  
  const isRespawning = useRef(false);
  const isProcessingRespawn = useRef(false);

  // 🌐 1. GLOBAL HP & BOSS SYNC
  useEffect(() => {
    const bossRef = ref(rtdb, 'worldEvent');
    const unsubscribe = onValue(bossRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (isRespawning.current && data.active === false) return;
        setWorldEvent(prev => ({ ...prev, ...data }));
        if (data.active === true) {
          setRespawnTimeLeft(0);
          isRespawning.current = false;
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ⏳ 2. BOSS COUNTDOWN & RESPAWN SYSTEM
  useEffect(() => {
    const timer = setInterval(() => {
      if (!worldEvent.active && worldEvent.lastRespawn) {
        const cooldownTime = 15000; 
        const now = Date.now();
        const elapsed = now - worldEvent.lastRespawn;
        const remaining = Math.max(0, cooldownTime - elapsed);
        const seconds = Math.floor(remaining / 1000);

        if (seconds !== respawnTimeLeft) setRespawnTimeLeft(seconds);

        if (remaining <= 0 && !worldEvent.active && !isProcessingRespawn.current) {
          isProcessingRespawn.current = true;
          update(ref(rtdb, 'worldEvent'), {
            active: true,
            currentHp: 12500,
            maxHp: 12500,
            damageDealers: {},
            participants: 0
          }).then(() => {
            isProcessingRespawn.current = false;
          });
        }
      } else {
        if (respawnTimeLeft !== 0) setRespawnTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [worldEvent.active, worldEvent.lastRespawn, respawnTimeLeft]);

  // 🐲 3. AUTO-DEFEAT HANDLER (เช็คเลือดหมด)
  useEffect(() => {
    if (worldEvent.active && worldEvent.currentHp <= 0) {
      if (window.sendAnnouncement) {
        window.sendAnnouncement("🐲 BLACK DRAGON KING พ่ายแพ้แล้ว! จะเกิดใหม่ใน 15 วินาที...");
      }
      update(ref(rtdb, 'worldEvent'), { 
        active: false, 
        lastRespawn: Date.now(),
        currentHp: 0 
      });
    }
  }, [worldEvent.currentHp, worldEvent.active]);

  // 📢 4. BROADCAST LISTENER & SENDER
  useEffect(() => {
    const broadcastRef = ref(rtdb, 'system/broadcast');
    const unsubscribe = onValue(broadcastRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.message) {
        const isFresh = Date.now() - data.timestamp < 15000;
        if (isFresh && window.sendAnnouncement) {
          window.sendAnnouncement(data.message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.sendAnnouncement = (msg, duration = 8000) => {
      setBroadcast({ show: true, message: msg });
      setTimeout(() => setBroadcast({ show: false, message: '' }), duration);
    };
  }, []);

  return { worldEvent, setWorldEvent, respawnTimeLeft, broadcast };
}
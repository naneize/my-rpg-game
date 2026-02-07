import React, { useState, useEffect, useMemo } from 'react'; 
// ✅ นำเข้า Firebase Tools เพิ่มเติม
import { ref, onValue, set, update } from "firebase/database";
import { db } from "./firebase"; 

// ... (Imports อื่นๆ คงเดิม 100%)
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
import GameLayout from './components/layout/GameLayout';
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { titles as allTitles } from './data/titles'; 
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';
import { useLevelSystem } from './hooks/useLevelSystem';
import { MessageSquare, X, Terminal } from 'lucide-react';
import { useTitleUnlocker } from './hooks/useTitleUnlocker';

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const isRespawning = React.useRef(false);
  const isProcessingRespawn = React.useRef(false);
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  
  const [broadcast, setBroadcast] = useState({ show: false, message: '', type: 'INFO' });

  // 🐲 World Boss State (เพิ่ม lastRespawn เพื่อคำนวณเวลานับถอยหลัง)
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

  const [player, setPlayer] = useState(INITIAL_PLAYER_DATA);
  const [unreadChatCount, setUnreadChatCount] = useState(0); 
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // ⏱️ State สำหรับเก็บวินาทีที่เหลือของบอส
  

  // 🌐 [FIXED] GLOBAL HP & BOSS SYNC
useEffect(() => {
  const bossRef = ref(db, 'worldEvent');
  const unsubscribe = onValue(bossRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // ✅ ถ้าในเครื่องเราสั่งเกิดไปแล้ว (isRespawning เป็น true) 
      // และข้อมูลที่มาใหม่ดันเป็น false ให้ "โยนทิ้ง" ไปก่อน ไม่ต้องรับมา
      if (isRespawning.current && data.active === false) return;

      setWorldEvent(prev => ({
        ...prev,
        ...data
      }));

      if (data.active === true) {
        setRespawnTimeLeft(0);
        isRespawning.current = false; // ปลดล็อกเมื่อ Server ยืนยันว่าเกิดแล้วจริง
      }
    }
  });
  return () => unsubscribe();
}, []);

 

  // ==========================================
  // ⏳ [NEW] BOSS COUNTDOWN & RESPAWN SYSTEM
  // ==========================================
  const [respawnTimeLeft, setRespawnTimeLeft] = useState(0);
  

  useEffect(() => {
  const timer = setInterval(() => {
    // 💡 ใช้มิติของเวลาจริง (Date.now) เทียบกับค่าใน worldEvent ล่าสุด
    if (!worldEvent.active && worldEvent.lastRespawn) {
      const cooldownTime = 15000; // 15 วิ
      const now = Date.now();
      const elapsed = now - worldEvent.lastRespawn;
      const remaining = Math.max(0, cooldownTime - elapsed);
      const seconds = Math.floor(remaining / 1000);

      // 1. อัปเดตตัวเลขหน้าจอ
      if (seconds !== respawnTimeLeft) {
        setRespawnTimeLeft(seconds);
      }

      // 2. 🚨 ถ้าเวลาหมด และยังไม่ได้ล็อค (กันเบิ้ล)
      if (remaining <= 0 && !worldEvent.active && !isProcessingRespawn.current) {
        isProcessingRespawn.current = true; // ล็อกทันที
        
        console.log("🔥 Time Up! Sending Global Respawn...");
        
        update(ref(db, 'worldEvent'), {
          active: true,
          currentHp: 12500,
          maxHp: 12500,
          damageDealers: {},
          participants: 0
          // ❌ ไม่ต้องส่ง lastRespawn ใหม่ตรงนี้ เพื่อป้องกันการ Reset เวลาถอยหลัง
        }).then(() => {
          isProcessingRespawn.current = false; // ปลดล็อกเมื่อ Firebase ยืนยัน
        });
      }
    } else {
      if (respawnTimeLeft !== 0) setRespawnTimeLeft(0);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [worldEvent.active, worldEvent.lastRespawn]); // 👈 ใส่ Dependency ให้ครบ


  useEffect(() => {
  // ✅ เช็คว่าบอส Active อยู่ และเลือดเหลือน้อยกว่าหรือเท่ากับ 0 จริงๆ
  if (worldEvent.active && worldEvent.currentHp <= 0) {
    if (window.sendAnnouncement) {
      window.sendAnnouncement("🐲 BLACK DRAGON KING พ่ายแพ้แล้ว! จะเกิดใหม่ใน 15 วินาที...");
    }
      // สั่งปิดสถานะบอสใน Database
    update(ref(db, 'worldEvent'), { 
      active: false, 
      lastRespawn: Date.now(),
      currentHp: 0 // บังคับให้เป็น 0 เพื่อความชัดเจน
    });
  }
}, [worldEvent.currentHp, worldEvent.active]);

  // ✅ [NEW] REAL-TIME BROADCAST LISTENER
  useEffect(() => {
    const broadcastRef = ref(db, 'system/broadcast');
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

  // ✅ ฟังก์ชันประกาศ
  useEffect(() => {
    window.sendAnnouncement = (msg, duration = 8000) => {
      setBroadcast({ show: true, message: msg });
      setTimeout(() => setBroadcast({ show: false, message: '' }), duration);
    };
  }, []);

  // 🕵️ Dev Token
  const installDevToken = (inputName) => {
    if (inputName === 'nanza1988') {
      localStorage.setItem('dev_token', '198831');
      window.sendAnnouncement?.("🔓 SYSTEM: DEV TOKEN INSTALLED");
      return true;
    }
    return false;
  };

  // ==========================================
  // ⚔️ 2. STATS & LOGIC HOOKS
  // ==========================================
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  const activeTitle = useMemo(() => allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0], [player.activeTitleId]);
  
  const totalStatsPlayer = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);

  useTitleUnlocker(totalStatsPlayer, collScore, setPlayer, setNewTitlePopup, gameState);

  useEffect(() => {
    if (player.level > 1) { 
      setPlayer(prev => ({ ...prev, hp: totalStatsPlayer.maxHp }));
    }
  }, [player.level, totalStatsPlayer.maxHp]);

  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame, collection: player.collection,
    worldEvent, setWorldEvent, allSkills: MONSTER_SKILLS,
    mapControls: { currentMap, setCurrentMap, gameState, setGameState, worldEvent, setWorldEvent }
  });

  const [chatPos, setChatPos] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  const handleChatTouchMove = (e) => {
    if (showMobileChat) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
    const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
    setChatPos({ x: newX, y: newY });
    setIsDragging(true);
  };
  
  useLevelSystem(player, setPlayer, setLogs);

  // ... (Mail & Gift System คงเดิม 100%)
  const claimMailItems = (mailId) => {
    setPlayer(prev => {
      const mail = prev.mailbox?.find(m => m.id === mailId);
      if (!mail || mail.isClaimed) return prev;
      const newMaterials = { ...prev.materials };
      const newInventory = [...(prev.inventory || [])];
      mail.items.forEach(item => {
        if (item.type === 'MATERIAL') {
          const key = item.id.toLowerCase();
          newMaterials[key] = (newMaterials[key] || 0) + item.amount;
        } else if (item.type === 'EQUIPMENT') {
          newInventory.push({ ...item.payload, instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` });
        }
      });
      const newMailbox = prev.mailbox.map(m => m.id === mailId ? { ...m, isRead: true, isClaimed: true } : m);
      return { ...prev, materials: newMaterials, inventory: newInventory, mailbox: newMailbox };
    });
    setLogs(prev => ["📫 รับของขวัญสำเร็จ!", ...prev].slice(0, 10));
  };

  const deleteMail = (mailId) => {
    setPlayer(prev => ({ ...prev, mailbox: prev.mailbox.filter(m => m.id !== mailId) }));
    setLogs(prev => ["🗑️ ลบจดหมายเรียบร้อย", ...prev].slice(0, 10));
  };

  const clearReadMail = () => {
    setPlayer(prev => ({ ...prev, mailbox: prev.mailbox.filter(m => !m.isRead || !m.isClaimed) }));
    setLogs(prev => ["🧹 ทำความสะอาดกล่องจดหมายแล้ว", ...prev].slice(0, 10));
  };

  const redeemGiftCode = (code) => {
    const cleanCode = code.trim();
    if (cleanCode.startsWith('GP-')) {
      try {
        const base64Data = cleanCode.replace('GP-', '');
        const decodedString = decodeURIComponent(escape(atob(base64Data)));
        const decoded = JSON.parse(decodedString);
        const newMail = {
          id: `p2p-${Date.now()}`,
          sender: decoded.sender || "Unknown Player",
          title: `ของขวัญจาก ${decoded.sender} 🎁`,
          content: `ได้รับ ${decoded.type === 'MATERIAL' ? 'วัตถุดิบ' : 'อุปกรณ์'} ที่ห่อมาให้!`,
          items: decoded.type === 'MATERIAL' 
            ? [{ id: decoded.payload.id, name: decoded.payload.name, amount: decoded.payload.amount, type: 'MATERIAL' }]
            : [{ type: 'EQUIPMENT', payload: decoded.payload, name: decoded.payload.name || "Equipment" }],
          isRead: false,
          isClaimed: false,
          sentAt: new Date().toLocaleDateString()
        };
        setPlayer(prev => ({ ...prev, mailbox: [newMail, ...prev.mailbox] }));
        return { success: true, message: "✅ ได้รับพัสดุจากเพื่อนแล้ว! เช็คที่กล่องจดหมาย" };
      } catch (e) {
        return { success: false, message: "❌ รหัสพัสดุไม่ถูกต้องหรือเสียหาย" };
      }
    }
    const upperCode = cleanCode.toUpperCase();
    const GIFT_CODES = {
      "WELCOME2026": { items: [{ id: 'scrap', name: 'Scrap', amount: 10, type: 'MATERIAL' }], message: "ของขวัญต้อนรับนักเดินทางหน้าใหม่!" },
      "GEMINI": { items: [{ id: 'dust', name: 'Dust', amount: 5, type: 'MATERIAL' }], message: "โค้ดลับพิเศษจาก Gemini AI!" }
    };
    const gift = GIFT_CODES[upperCode];
    if (gift) {
      if (player.viewedTutorials?.includes(upperCode)) return { success: false, message: "❌ คุณเคยแลกโค้ดนี้ไปแล้ว!" };
      const newMail = {
        id: `gift-${Date.now()}`,
        sender: "SYSTEM GIFT",
        title: `REDEEM: ${upperCode} 🎁`,
        content: gift.message,
        items: gift.items,
        isRead: false,
        isClaimed: false,
        sentAt: new Date().toLocaleDateString()
      };
      setPlayer(prev => ({ ...prev, mailbox: [newMail, ...prev.mailbox], viewedTutorials: [...(prev.viewedTutorials || []), upperCode] }));
      return { success: true, message: "✅ แลกโค้ดสำเร็จ! เช็คที่กล่องจดหมาย" };
    }
    return { success: false, message: "❌ โค้ดไม่ถูกต้อง หรือหมดอายุ" };
  };

  const wrapItemAsCode = (type, targetData) => {
    if (!targetData) return null;
    const wrapData = { sender: player.name, type: type, payload: targetData, time: Date.now() };
    const jsonString = JSON.stringify(wrapData);
    const encoded = btoa(unescape(encodeURIComponent(jsonString))); 
    const finalCode = `GP-${encoded}`;
    let success = false;
    setPlayer(prev => {
      if (type === 'MATERIAL') {
        const key = targetData.id.toLowerCase();
        if ((prev.materials[key] || 0) < targetData.amount) return prev;
        success = true;
        return { ...prev, materials: { ...prev.materials, [key]: prev.materials[key] - targetData.amount } };
      } else {
        const hasItem = prev.inventory.some(i => i.instanceId === targetData.instanceId);
        if (!hasItem) return prev;
        success = true;
        return { ...prev, inventory: prev.inventory.filter(i => i.instanceId !== targetData.instanceId) };
      }
    });
    if (success) {
      setLogs(prev => [`🎁 ห่อ ${type === 'MATERIAL' ? targetData.name : (targetData.name || 'อุปกรณ์')} สำเร็จ!`, ...prev].slice(0, 10));
      return finalCode;
    }
    return null;
  };

  const handleManualSave = () => { if (saveGame()) { setHasSave(true); setShowSaveToast(true); setTimeout(() => setShowSaveToast(false), 2000); } };
  
  const triggerNewGame = (name) => { 
    installDevToken(name);
    setPendingName(name); 
    setIsConfirmOpen(true); 
  };

  const handleStartNewGame = () => {
    clearSave(); 
    installDevToken(pendingName);
    setPlayer({ ...INITIAL_PLAYER_DATA, name: pendingName, hp: INITIAL_PLAYER_DATA.maxHp || 100 });
    setHasSave(false); setCurrentMap(null); setGameState('MAP_SELECTION'); setIsConfirmOpen(false); setActiveTab('TRAVEL');
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") {
      setHasSave(true);
    }
  }, []);

  const { renderMainView } = useViewRenderer({
    ...engine, activeTab, logs, originalPlayer: player, player: totalStatsPlayer, setPlayer, setLogs, 
    collScore, passiveBonuses, collectionBonuses, monsters, allSkills: MONSTER_SKILLS, gameState, currentMap, 
    claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode, 
    setGameState, saveGame: handleManualSave, clearSave, hasSave, worldEvent, setWorldEvent, 
    respawnTimeLeft, // ✅ ส่งเวลานับถอยหลังไปให้หน้าเลือกแผนที่


    onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        if (loaded.currentMap) setGameState('PLAYING'); else setGameState('MAP_SELECTION');
        setActiveTab('TRAVEL');
      }
    }
  });

  return (
    <GameLayout 
      overlays={<>
        <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />
        {broadcast.show && (
          <div className="fixed top-16 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="bg-slate-950/90 border-y-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] w-full max-w-2xl p-4 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse" />
              <div className="relative flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase italic tracking-[0.3em]">System Broadcast</span>
                  <Terminal size={12} className="text-amber-500" />
                </div>
                <h2 className="text-base md:text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
                  {broadcast.message}
                </h2>
              </div>
            </div>
          </div>
        )}
        <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleStartNewGame} title="WIPE DATA?" message="คุณต้องการลบประวัติการผจญภัยและเริ่มใหม่ทั้งหมดใช่หรือไม่?" />
        {showSaveToast && (
          <div className="fixed top-14 right-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg">✓ Data Secured</div>
          </div>
        )}
        {gameState !== 'START_SCREEN' && !showMobileChat && (
          <button style={{ left: chatPos.x, top: chatPos.y }} onTouchMove={handleChatTouchMove} onTouchEnd={() => setTimeout(() => setIsDragging(false), 50)} onClick={() => !isDragging && setShowMobileChat(true)} className="md:hidden fixed z-[60] bg-amber-500 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-slate-950 touch-none">
            <MessageSquare size={20} />
          </button>
        )}
      </>}
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); if (t === 'TRAVEL') setUnreadChatCount(0); setShowMobileChat(false); }} player={totalStatsPlayer} saveGame={handleManualSave} unreadChatCount={unreadChatCount} />
      )}
      worldChat={gameState !== 'START_SCREEN' && (
        <div className={`${showMobileChat ? 'fixed inset-0 z-[100] bg-slate-950/98 p-4 flex flex-col' : 'hidden md:flex flex-col h-full w-[320px] border-l border-white/5 bg-slate-900/20 mr-0 ml-0'}`}>
          <div className="flex justify-between items-center mb-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-white font-black text-xs uppercase italic tracking-widest">Global Comms</h3>
            </div>
            <button onClick={() => setShowMobileChat(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={20} /></button>
          </div>
          <WorldChat player={player} onNewMessage={() => { if (activeTab !== 'TRAVEL' || (window.innerWidth < 768 && !showMobileChat)) { setUnreadChatCount(prev => (prev || 0) + 1); } }} unreadChatCount={unreadChatCount} />
        </div>
      )}
    >
      {renderMainView()}
    </GameLayout>
  );
}
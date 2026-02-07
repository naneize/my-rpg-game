// ✅ สร้างไฟล์ใหม่ที่: src/hooks/useMailSystem.js
import { useState } from 'react';

export function useMailSystem(player, setPlayer, setLogs) {
  
  // 📫 ฟังก์ชันรับไอเทมจากจดหมาย
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
          newInventory.push({ 
            ...item.payload, 
            instanceId: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` 
          });
        }
      });
      
      const newMailbox = prev.mailbox.map(m => 
        m.id === mailId ? { ...m, isRead: true, isClaimed: true } : m
      );
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

  // 🎁 ระบบแลกโค้ด
  const redeemGiftCode = (code) => {
    const cleanCode = code.trim();
    // กรณี P2P Gift (GP-)
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

    // กรณี System Gift Codes
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
      setPlayer(prev => ({ 
        ...prev, 
        mailbox: [newMail, ...prev.mailbox], 
        viewedTutorials: [...(prev.viewedTutorials || []), upperCode] 
      }));
      return { success: true, message: "✅ แลกโค้ดสำเร็จ! เช็คที่กล่องจดหมาย" };
    }
    return { success: false, message: "❌ โค้ดไม่ถูกต้อง หรือหมดอายุ" };
  };

  // 📦 ระบบห่อของส่งให้เพื่อน
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

  return { claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode };
}
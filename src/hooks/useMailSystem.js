// ✅ ไฟล์: src/hooks/useMailSystem.js
import { useState } from 'react';

export function useMailSystem(player, setPlayer, setLogs) {
  
  // 📫 [ACTION]: Claim items from neural mailbox
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
    // 🖥️ UI LOG: เปลี่ยนเป็นภาษาเทคนิค
    setLogs(prev => ["🛰️ [SYSTEM]: Data_Payload synchronized and decrypted successfully!", ...prev].slice(0, 10));
  };

  const deleteMail = (mailId) => {
    setPlayer(prev => ({ ...prev, mailbox: prev.mailbox.filter(m => m.id !== mailId) }));
    setLogs(prev => ["🧹 [SYSTEM]: Mail_Log purged from local storage memory.", ...prev].slice(0, 10));
  };

  const clearReadMail = () => {
    setPlayer(prev => ({ ...prev, mailbox: prev.mailbox.filter(m => !m.isRead || !m.isClaimed) }));
    setLogs(prev => ["🧹 [SYSTEM]: Mailbox directory optimized and cleaned.", ...prev].slice(0, 10));
  };

  // 🎁 Gift Code Redemption System (Hard-Edge Protocol)
  const redeemGiftCode = (code) => {
    const cleanCode = code.trim();
    // P2P Gift Case (GP-)
    if (cleanCode.startsWith('GP-')) {
      try {
        const base64Data = cleanCode.replace('GP-', '');
        const decodedString = decodeURIComponent(escape(atob(base64Data)));
        const decoded = JSON.parse(decodedString);
        const newMail = {
          id: `p2p-${Date.now()}`,
          sender: decoded.sender || "Unknown Player",
          title: `INCOMING_GIFT: FROM_${decoded.sender.toUpperCase()} 🎁`,
          content: `Encrypted_Payload detected: ${decoded.type === 'MATERIAL' ? 'MAT_LINK' : 'EQP_CORE'}. Authenticate to extract.`,
          items: decoded.type === 'MATERIAL' 
            ? [{ id: decoded.payload.id, name: decoded.payload.name, amount: decoded.payload.amount, type: 'MATERIAL' }]
            : [{ type: 'EQUIPMENT', payload: decoded.payload, name: decoded.payload.name || "Equipment" }],
          isRead: false,
          isClaimed: false,
          sentAt: new Date().toLocaleDateString()
        };
        setPlayer(prev => ({ ...prev, mailbox: [newMail, ...prev.mailbox] }));
        return { success: true, message: "✅ [SUCCESS]: Gift stream received. Check Neural_Mailbox." };
      } catch (e) {
        return { success: false, message: "❌ [ERROR]: Corruption detected in Gift_String encryption." };
      }
    }

    // System Gift Codes Case
    const upperCode = cleanCode.toUpperCase();
    const GIFT_CODES = {
      "WELCOME2026": { items: [{ id: 'scrap', name: 'Scrap', amount: 10, type: 'MATERIAL' }], message: "Initiation rewards for new sector operators." },
      "GEMINI": { items: [{ id: 'dust', name: 'Dust', amount: 5, type: 'MATERIAL' }], message: "Secret data string retrieved from Gemini_AI_Core." }
    };
    
    const gift = GIFT_CODES[upperCode];
    if (gift) {
      if (player.viewedTutorials?.includes(upperCode)) return { success: false, message: "❌ [REJECTED]: Protocol has already been executed." };
      const newMail = {
        id: `gift-${Date.now()}`,
        sender: "CORE_SYSTEM",
        title: `REDEEM_LINK: ${upperCode} 🎁`,
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
      return { success: true, message: "✅ [SUCCESS]: Code authorized. Rewards sent to Neural_Mailbox." };
    }
    return { success: false, message: "❌ [FAILED]: Invalid or expired access string." };
  };

  // 📦 Item Wrapping System (Send to friend)
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
      setLogs(prev => [`🎁 [SYSTEM]: ${type === 'MATERIAL' ? targetData.name : (targetData.name || 'Equipment')} encapsulated into Gift_String.`, ...prev].slice(0, 10));
      return finalCode;
    }
    return null;
  };

  return { claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode };
}
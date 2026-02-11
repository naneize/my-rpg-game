// ✅ ไฟล์: src/hooks/useMobileChat.js
import { useState, useRef } from 'react';

export function useMobileChat() {
  // เพิ่ม isDragging เข้าไปใน Object เดียวกันเพื่อให้ App.jsx เช็คได้ง่ายในชุดเดียว
  const [chatPos, setChatPos] = useState({ 
    x: window.innerWidth - 80, 
    y: window.innerHeight - 150,
    isDragging: false 
  });
  
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const touchStartTime = useRef(0);

  const handleChatTouchStart = () => {
    touchStartTime.current = Date.now();
    // เริ่มต้นสถานะลาก
    setChatPos(prev => ({ ...prev, isDragging: true }));
  };

  const handleChatTouchMove = (e) => {
    if (showMobileChat) return;
    
    // ป้องกันการเลื่อนหน้าจอ (Scroll) ขณะกำลังลากปุ่ม
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    
    // คำนวณขอบเขตไม่ให้ปุ่มหลุดจอ (Padding 10px)
    const newX = Math.min(Math.max(10, touch.clientX - 32), window.innerWidth - 75);
    const newY = Math.min(Math.max(10, touch.clientY - 32), window.innerHeight - 75);
    
    setChatPos({ 
      x: newX, 
      y: newY,
      isDragging: true 
    });
  };

  const handleChatTouchEnd = (callback) => {
    const duration = Date.now() - touchStartTime.current;
    
    // ถ้าแตะสั้นๆ (น้อยกว่า 200ms) ให้ถือว่าเป็นการ "คลิก"
    if (duration < 200) {
      setShowMobileChat(true);
      if (callback) callback();
    }

    // ดีเลย์การปิดสถานะ isDragging นิดนึงเพื่อให้ Transition ใน App.jsx ทำงานตอนปล่อยมือ
    setTimeout(() => {
      setChatPos(prev => ({ ...prev, isDragging: false }));
    }, 10);
  };

  return { 
    chatPos, 
    unreadChatCount, setUnreadChatCount, 
    showMobileChat, setShowMobileChat,
    handleChatTouchStart, handleChatTouchMove, handleChatTouchEnd
  };
}
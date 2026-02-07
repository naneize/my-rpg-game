// ✅ สร้างไฟล์ใหม่ที่: src/hooks/useMobileChat.js
import { useState, useRef, useEffect } from 'react';

export function useMobileChat() {
  const [chatPos, setChatPos] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const touchStartTime = useRef(0);

  const handleChatTouchStart = () => {
    touchStartTime.current = Date.now();
  };

  const handleChatTouchMove = (e) => {
    if (showMobileChat) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
    const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
    setChatPos({ x: newX, y: newY });
    setIsDragging(true);
  };

  const handleChatTouchEnd = (callback) => {
    const duration = Date.now() - touchStartTime.current;
    if (duration < 200) {
      setShowMobileChat(true);
      setIsDragging(false);
      if (callback) callback();
    } else {
      setTimeout(() => setIsDragging(false), 50);
    }
  };

  return { 
    chatPos, setChatPos, isDragging, setIsDragging, 
    unreadChatCount, setUnreadChatCount, 
    showMobileChat, setShowMobileChat,
    handleChatTouchStart, handleChatTouchMove, handleChatTouchEnd
  };
}
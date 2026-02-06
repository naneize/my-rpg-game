import React, { useMemo } from 'react';

export default function DamageNumber({ value, type }) {
  // ✅ [คงเดิม] ขยายพื้นที่สุ่ม x, y เพื่อลดการซ้อนทับกัน
  const position = useMemo(() => ({
    x: Math.floor(Math.random() * 80) - 40,
    y: Math.floor(Math.random() * 30) - 15
  }), []); 

  // 🎨 กำหนดสไตล์และข้อความตามประเภทดาเมจ
  const getDamageConfig = () => {
    switch (type) {
      // --- สถานะพิเศษ ---
      case 'reflect':
        return { 
          style: 'text-pink-200 drop-shadow-[0_0_12px_rgba(244,114,182,0.9)]', 
          label: 'Reflect', 
          fontSize: '1.8rem' 
        };

      // 🔥 Player Burn: (คงเดิม) สีส้มไฟ
      case 'player_burn':
        return { 
          style: 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]', 
          label: 'Burn', 
          fontSize: '2rem' 
        };

      // 🤢 [เปลี่ยนสี] Poison: ใช้สีม่วงเข้ม (สีพิษมาตรฐานเกม RPG)
      case 'poison':
        return { 
          style: 'text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]', 
          label: 'Poison', 
          fontSize: '1.8rem' 
        };

      // --- บัฟ / ดีบัฟ ---
      case 'buff_def':
        return { style: 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.9)]', label: 'DEF UP', fontSize: '1.8rem' };
      case 'buff_atk':
        return { style: 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]', label: 'ATK UP', fontSize: '1.8rem' };
      case 'debuff_def':
        return { style: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]', label: 'DEF DOWN', fontSize: '1.8rem' };
      case 'debuff_atk':
        return { style: 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]', label: 'ATK DOWN', fontSize: '1.8rem' };

      // --- ระบบ Recovery (ผู้เล่นได้พลังคืน) ---
      case 'player_recovery_def':
        return { style: 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.9)]', label: 'DEF RESTORED', fontSize: '1.8rem' };
      case 'player_recovery_atk':
        return { style: 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]', label: 'ATK RESTORED', fontSize: '1.8rem' };

      // ⚔️ --- [เพิ่มใหม่] ระบบดาเมจธาตุ (Elemental Damage) ---
      case 'fire':
        return { style: 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]', label: '🔥 FIRE', fontSize: '2.2rem' };
      case 'water':
        return { style: 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.9)]', label: '💧 WATER', fontSize: '2.2rem' };
      case 'wind':
        return { style: 'text-teal-300 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]', label: '🌪️ WIND', fontSize: '2.2rem' };
      case 'earth':
        return { style: 'text-amber-700 drop-shadow-[0_0_15px_rgba(180,83,9,0.8)]', label: '🪵 EARTH', fontSize: '2.2rem' };
      case 'lightning':
        return { style: 'text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]', label: '⚡ LIGHTNING', fontSize: '2.2rem' };
      case 'holy':
        return { style: 'text-slate-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]', label: '✨ HOLY', fontSize: '2.2rem' };
      case 'dark':
        return { style: 'text-purple-700 drop-shadow-[0_0_15px_rgba(126,34,206,0.9)]', label: '🌑 DARK', fontSize: '2.2rem' };

      // --- พื้นฐาน ---
      case 'player':
        return { style: 'text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]', label: null, fontSize: '2.5rem' };
      case 'monster':
      default:
        return { style: 'text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]', label: null, fontSize: '2.25rem' };
    }
  };

  const config = getDamageConfig();

  // ✅ [คงเดิม] เช็คตำแหน่งการเด้ง (ผู้เล่นโดน = 75%, บอสโดน = 38%)
  const isPlayerTarget = [
    'player', 'player_burn', 'poison', 'bleed', 
    'debuff_def', 'debuff_atk',
    'player_recovery_def', 
    'player_recovery_atk',
    'reflect',
    // เพิ่มดาเมจธาตุเข้าไปในลิสต์นี้ ถ้าต้องการให้เด้งที่ตัวผู้เล่นเวลาโดนมอนสเตอร์ตี
    'fire', 'water', 'wind', 'earth', 'lightning', 'holy', 'dark'
  ].includes(type);

  const topPosition = isPlayerTarget ? '75%' : '38%';

  // ✅ [คงเดิม] Logic เครื่องหมาย (ใช้ startsWith เพื่อแยก debuff/buff)
  const isPositive = type.startsWith('buff_') || type.includes('recovery');
  const prefix = isPositive ? '+' : '-';
  const suffix = ''; 

  return (
    <div 
      className={`absolute left-1/2 font-black animate-damage-static select-none z-[100] text-stroke-black flex items-baseline gap-2
        ${config.style}
      `}
      style={{ 
        top: topPosition,
        marginLeft: `${position.x}px`,
        marginTop: `${position.y}px`,
        transform: 'translateX(-50%)',
        fontSize: config.fontSize,
        animationDuration: '1.8s',
        animationTimingFunction: 'ease-in-out'
      }}
    >
      <span>{prefix}{value}{suffix}</span>

      {config.label && (
        <span className="text-[12px] uppercase tracking-wider opacity-90 animate-pulse italic font-bold">
          {config.label}
        </span>
      )}
    </div>
  );
}
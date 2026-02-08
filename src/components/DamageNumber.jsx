import React, { useMemo } from 'react';

export default function DamageNumber({ value, type }) {
  // ✅ [คงเดิม] ขยายพื้นที่สุ่ม x, y เพื่อลดการซ้อนทับกัน
  const position = useMemo(() => ({
    x: Math.floor(Math.random() * 80) - 40,
    y: Math.floor(Math.random() * 30) - 15
  }), []); 

  // 🎯 เช็คเป้าหมาย (เพื่อกำหนดตำแหน่ง)
  const isPlayerTarget = [
    'player', 'PLAYER_HIT', 'player_burn', 'poison', 'bleed', 
    'debuff_def', 'debuff_atk',
    'player_recovery_def', 
    'player_recovery_atk',
    'boss_reflect',
    'fire', 'water', 'wind', 'earth', 'lightning', 'holy', 'dark'
  ].includes(type);

  // 🎨 กำหนดสไตล์และข้อความตามประเภทดาเมจ
  const getDamageConfig = () => {
    switch (type) {
      // --- สถานะพิเศษ ---
      case 'reflect':
          return { 
            style: 'text-fuchsia-400 drop-shadow-[0_0_15px_rgba(192,38,211,1)] animate-bounce', 
            label: '✨ REFLECT', 
            fontSize: '2.2rem' 
        };

      case 'boss_reflect': 
        return { style: 'text-pink-300 drop-shadow-[0_0_15px_rgba(192,38,211,1)]', label: '✨ REFLECT', fontSize: '1.8rem' };

      // 🔥 Player Burn / Poison
      case 'player_burn':
        return { style: 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]', label: 'Burn', fontSize: '2rem' };
      case 'poison':
        return { style: 'text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]', label: 'Poison', fontSize: '1.8rem' };

      // --- บัฟ / ดีบัฟ ---
      case 'buff_def':
        return { style: 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.9)]', label: 'DEF UP', fontSize: '1.8rem' };
      case 'buff_atk':
        return { style: 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]', label: 'ATK UP', fontSize: '1.8rem' };
      case 'debuff_def':
        return { style: 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]', label: 'DEF DOWN', fontSize: '1.8rem' };
      case 'debuff_atk':
        return { style: 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]', label: 'ATK DOWN', fontSize: '1.8rem' };

      // --- ระบบ Recovery ---
      case 'player_recovery_def':
        return { style: 'text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.9)]', label: 'DEF RESTORED', fontSize: '1.8rem' };
      case 'player_recovery_atk':
        return { style: 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]', label: 'ATK RESTORED', fontSize: '1.8rem' };

      // ⚔️ --- [สีดาเมจธาตุ] ให้เป็นสีของมันเองเสมอ ---
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

      // --- [จุดแก้ไข] ดาเมจปกติ (Non-Elemental) ---
      case 'player':
      case 'PLAYER_HIT':
        // ถ้าผู้เล่นโดนดาเมจปกติ -> ให้เป็นสีแดง
        return { style: 'text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] font-black', label: null, fontSize: '2.6rem' };
      
      case 'monster':
      case 'MONSTER_HIT':
      default:
        // มอนสเตอร์โดนดาเมจปกติ -> สีขาว
        return { style: 'text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]', label: null, fontSize: '2.25rem' };
    }
  };

  const config = getDamageConfig();

  // 🎯 กำหนดพิกัดเด้ง: ผู้เล่นโดนเด้งแถวหลอดเลือด (75%) มอนสเตอร์โดนเด้งกลางจอ (38%)
  const topPosition = isPlayerTarget ? '75%' : '38%';

  // ✅ [คงเดิม] Logic เครื่องหมาย
  const isPositive = type.startsWith('buff_') || type.includes('recovery');
  const prefix = isPositive ? '+' : '-';
  const suffix = ''; 

  return (
    <div 
      className={`absolute left-1/2 font-black animate-damage-static select-none z-[999999] text-stroke-black flex items-baseline gap-2
        ${config.style}
      `}
      style={{ 
        top: topPosition,
        marginLeft: `${position.x}px`,
        marginTop: `${position.y}px`,
        transform: 'translateX(-50%)',
        fontSize: config.fontSize,
        animationDuration: '1.2s',
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
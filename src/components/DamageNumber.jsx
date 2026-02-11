import React, { useMemo } from 'react';

export default function DamageNumber({ value, type }) {
  // ✅ [คงเดิม] ขยายพื้นที่สุ่ม x, y เพื่อลดการซ้อนทับกัน
  const position = useMemo(() => ({
    x: Math.floor(Math.random() * 80) - 40,
    y: Math.floor(Math.random() * 30) - 15
  }), []); 

  // 🎯 เช็คเป้าหมาย (เพื่อให้กำหนดตำแหน่ง) 
  const isPlayerTarget = [
    'player', 'PLAYER_HIT', 'player_burn', 'poison', 'bleed', 
    'debuff_def', 'debuff_atk',
    'player_recovery_def', 
    'player_recovery_atk',
    'boss_reflect',
  ].includes(type) || type.endsWith('_hit');

  // 🎨 กำหนดสไตล์และข้อความตามประเภทดาเมจ (เปลี่ยนชื่อกลับมาเป็นแบบเดิมแล้วจ้ะ)
  const getDamageConfig = () => {
    switch (type) {
      // 🌟 --- [SUPER CRITICAL (ชนะธาตุ + คริติคอล)] ---
      case 'super_critical':
        return {
          style: 'bg-gradient-to-b from-rose-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,50,50,1)] drop-shadow-[0_0_25px_rgba(255,200,0,0.5)] animate-bounce font-[1000]',
          label: (
            <div className="flex gap-2 items-center justify-center border-y border-white/20 bg-black/40 px-3 py-0.5">
              <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,1)] text-[0.8em]">SUPER EFFECTIVE!</span>
              <span className="text-white opacity-40">|</span>
              <span className="text-rose-500 drop-shadow-[0_0_5px_rgba(225,29,72,1)] text-[0.8em]">CRITICAL!</span>
            </div>
          ),
          fontSize: 'clamp(3.5rem, 18vw, 6rem)', 
          isGradient: true,
          isCentered: true, 
          offsetX: -120
        };

      // --- สถานะพิเศษ ---
      case 'reflect':
          return { 
            style: 'text-fuchsia-400 drop-shadow-[0_4px_0_rgba(134,25,143,1)] animate-bounce', 
            label: '✨ REFLECT', 
            fontSize: 'clamp(2.5rem, 12vw, 5rem)' 
        };

      // ⚔️ --- [ระบบแสดงผลตามความได้เปรียบธาตุ] ---
      case 'effective':
        return { 
          style: 'text-yellow-400 drop-shadow-[0_4px_0_rgba(146,64,14,1)] animate-bounce font-black italic', 
          label: '💥 EFFECTIVE!', 
          fontSize: 'clamp(2.5rem, 11vw, 4.5rem)' 
        };

      case 'weak':
        return { 
          style: 'text-slate-500 drop-shadow-[2px_2px_0_black] opacity-70', 
          label: '💀 WEAK', 
          fontSize: 'clamp(1.2rem, 6vw, 2rem)' 
        };

      case 'critical': 
        return { 
          style: 'text-rose-600 drop-shadow-[0_4px_0_rgba(153,27,27,1)] italic animate-pulse font-[1000]', 
          label: '🎯 CRITICAL', 
          fontSize: 'clamp(3rem, 14vw, 5.5rem)', 
          isCentered: true 
        };

      case 'boss_reflect': 
        return { style: 'text-pink-300 drop-shadow-[0_0_10px_rgba(192,38,211,1)]', label: '✨ REFLECT', fontSize: '2.5rem' };

      // 🔥 Player Burn / Poison
      case 'player_burn':
        return { style: 'text-orange-500 drop-shadow-[0_2px_0_black]', label: 'Burn', fontSize: '2.5rem' };
      case 'poison':
        return { style: 'text-purple-500 drop-shadow-[0_2px_0_black]', label: 'Poison', fontSize: '2.2rem' };

      // --- บัฟ / ดีบัฟ ---
      case 'buff_def':
      case 'buff_atk':
      case 'debuff_def':
      case 'debuff_atk':
      case 'player_recovery_def':
      case 'player_recovery_atk':
        return { style: 'text-cyan-400 drop-shadow-[0_2px_0_rgba(21,94,117,1)]', label: type.replace('player_', '').replace('_', ' ').toUpperCase(), fontSize: '2rem' };

      // ⚔️ --- [สีดาเมจธาตุ - เปลี่ยนชื่อกลับมาเป็นแบบเดิมจ้ะ] ---
      case 'fire': case 'fire_hit':
        return { style: 'text-red-500 drop-shadow-[0_4px_0_rgba(153,27,27,1)]', label: '🔥 FIRE', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'water': case 'water_hit':
        return { style: 'text-blue-400 drop-shadow-[0_4px_0_rgba(30,64,175,1)]', label: '💧 WATER', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'wind': case 'wind_hit':
        return { style: 'text-green-600 drop-shadow-[0_4px_0_rgba(6,95,70,1)]', label: '🌪️ WIND', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'earth': case 'earth_hit':
        return { style: 'text-amber-700 drop-shadow-[0_4px_0_rgba(69,26,3,1)]', label: '🪵 EARTH', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'lightning': case 'lightning_hit':
        return { style: 'text-yellow-300 drop-shadow-[0_4px_0_rgba(133,77,14,1)] font-black', label: '⚡ LIGHTNING', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'holy': case 'holy_hit':
        return { style: 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]', label: '✨ HOLY', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'dark': case 'dark_hit':
        return { style: 'text-purple-800 drop-shadow-[0_0_10px_rgba(126,34,206,0.5)]', label: '🌑 DARK', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'poison_hit': return { style: 'text-purple-500 drop-shadow-[0_2px_0_black]', label: '🧪 POISON', fontSize: '2.5rem' };
      case 'light': case 'light_hit': return { style: 'text-yellow-100 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]', label: '✨ LIGHT', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      
      // --- ดาเมจปกติ (Non-Elemental) ---
      case 'player':
      case 'PLAYER_HIT':
        return { style: 'text-red-600 drop-shadow-[0_3px_0_black] font-black italic', label: 'HIT', fontSize: 'clamp(2.2rem, 10vw, 4rem)' };
      
      default:
        return { style: 'text-white drop-shadow-[2px_2px_0_black]', label: null, fontSize: '2.25rem' };
    }
  };

  const config = getDamageConfig();

  // 🎯 ปรับพิกัดเด้ง: ถ้าเป็น Critical ให้เด้งกลางตัวมอน (38%) ถ้า Player โดนเด้งแถวหลอดเลือด (75%)
  let topPosition = isPlayerTarget ? '75%' : '38%';
  
  // 🚩 ถ้าเป็น Critical ให้ล็อคกลางจอเป๊ะๆ ไม่ต้องสุ่ม marginLeft เยอะ
  const finalMarginLeft = config.isCentered ? (position.x * 0.2) : position.x;

  // ✅ [คงเดิม] Logic เครื่องหมาย
  const isPositive = type.startsWith('buff_') || type.includes('recovery');
  const prefix = isPositive ? '+' : '-';
  const suffix = ''; 

  return (
    <div 
      className={`absolute left-1/2 font-black animate-damage-static select-none z-[999999] flex flex-col items-center gap-0
        ${config.style}
      `}
      style={{ 
        top: topPosition,
        marginLeft: `${position.x + (config.offsetX || 0)}px`,
        marginTop: `${position.y}px`,
        transform: 'translateX(-50%)',
        fontSize: config.fontSize, 
        animationDuration: (type === 'super_critical' || type === 'critical') ? '0.8s' : '1.1s',
        animationTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        width: 'max-content'
      }}
    >
      {/* ส่วนตัวเลข - เพิ่มขอบสีดำให้ลอยออกมา (Text Stroke) */}
      <span 
        className={config.isGradient ? "" : ""}
        style={!config.isGradient ? { WebkitTextStroke: '2px black' } : {}}
      >
        {prefix}{value}{suffix}
      </span>

      {config.label && (
        <span className={`uppercase tracking-[0.2em] italic font-black whitespace-nowrap px-2
          ${type === 'super_critical' ? 'text-[clamp(1.1rem,5vw,1.8rem)] text-white bg-red-600 shadow-lg' : 'text-[clamp(0.8rem,3vw,1.2rem)] opacity-90'}
        `}
        style={!config.isGradient ? { WebkitTextStroke: '1px black' } : {}}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
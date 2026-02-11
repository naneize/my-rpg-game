import React, { useMemo } from 'react';

export default function DamageNumber({ value, type }) {
  // ✅ [คงเดิม] ขยายพื้นที่สุ่ม x, y
  const position = useMemo(() => ({
    x: Math.floor(Math.random() * 80) - 40,
    y: Math.floor(Math.random() * 30) - 15
  }), []); 

  const isPlayerTarget = [
    'player', 'PLAYER_HIT', 'player_burn', 'poison', 'bleed', 
    'debuff_def', 'debuff_atk',
    'player_recovery_def', 
    'player_recovery_atk',
    'boss_reflect',
  ].includes(type) || type.endsWith('_hit');

  const getDamageConfig = () => {
    switch (type) {
      // 🌟 --- [SUPER CRITICAL] ---
      case 'super_critical':
        return {
          style: 'bg-gradient-to-b from-rose-500 via-amber-400 to-yellow-300 drop-shadow-[0_0_15px_rgba(255,50,50,0.8)] animate-bounce font-[1000]',
          label: (
            <div className="flex gap-2 items-center justify-center border-y border-white/20 bg-black/60 px-3 py-0.5">
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

      case 'reflect':
          return { 
            style: 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(192,38,211,0.8)] animate-bounce', 
            label: '✨ REFLECT', 
            fontSize: 'clamp(2.5rem, 12vw, 5rem)' 
        };

      case 'effective':
        return { 
          style: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-bounce font-black italic', 
          label: '💥 EFFECTIVE!', 
          fontSize: 'clamp(2.5rem, 11vw, 4.5rem)' 
        };

      case 'weak':
        return { 
          style: 'text-slate-300 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] opacity-80', 
          label: '💀 WEAK', 
          fontSize: 'clamp(1.2rem, 6vw, 2rem)' 
        };

      case 'critical': 
        return { 
          style: 'text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] italic animate-pulse font-[1000]', 
          label: '🎯 CRITICAL', 
          fontSize: 'clamp(3rem, 14vw, 5.5rem)', 
          isCentered: true 
        };

      case 'fire': case 'fire_hit':
        return { style: 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]', label: '🔥 FIRE', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'water': case 'water_hit':
        return { style: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]', label: '💧 WATER', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'wind': case 'wind_hit':
        return { style: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]', label: '🌪️ WIND', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'earth': case 'earth_hit':
        return { style: 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]', label: '🪵 EARTH', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'lightning': case 'lightning_hit':
        return { style: 'text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)] font-black', label: '⚡ LIGHTNING', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      case 'dark': case 'dark_hit':
        return { style: 'text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]', label: '🌑 DARK', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      
      case 'player':
      case 'PLAYER_HIT':
        return { style: 'text-red-600 drop-shadow-[0_0_8px_rgba(0,0,0,1)] font-black italic', label: 'HIT', fontSize: 'clamp(2.2rem, 10vw, 4rem)' };
      
      default:
        return { style: 'text-white drop-shadow-[0_0_5px_black]', label: null, fontSize: '2.25rem' };
    }
  };

  const config = getDamageConfig();
  let topPosition = isPlayerTarget ? '75%' : '38%';

  const isPositive = type.startsWith('buff_') || type.includes('recovery');
  const prefix = isPositive ? '+' : '-';

  // 🛰️ ฟอนต์เหลี่ยม Hard-Edge สำหรับดาเมจ
  const cyberFont = "'Orbitron', 'Chakra Petch', sans-serif";

  // 🛠️ [Helper] สร้าง Outline ที่หนาและชัดในมือถือโดยไม่ใช้ Stroke
  const mobileOutline = "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 2px 0 #000, 0px -2px 0 #000, 2px 0px 0 #000, -2px 0px 0 #000, 4px 4px 5px rgba(0,0,0,0.8)";

  return (
    <div 
      className={`absolute left-1/2 font-black animate-damage-static select-none z-[999999] flex flex-col items-center gap-0
        ${config.isGradient ? "" : config.style}
      `}
      style={{ 
        top: topPosition,
        marginLeft: `${position.x + (config.offsetX || 0)}px`,
        marginTop: `${position.y}px`,
        transform: 'translateX(-50%)',
        fontSize: config.fontSize, 
        fontFamily: cyberFont, // ✅ บังคับใช้ฟอนต์เหลี่ยม
        animationDuration: (type === 'super_critical' || type === 'critical') ? '0.8s' : '1.1s',
        animationTimingFunction: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        width: 'max-content'
      }}
    >
      <span 
        style={config.isGradient ? { 
          backgroundImage: 'linear-gradient(to bottom, #fff 20%, #f43f5e 50%, #fbbf24 80%, #fde047 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
        } : { 
          textShadow: mobileOutline,
          color: 'inherit'
        }}
      >
        {prefix}{value}
      </span>

      {config.label && (
        <span className={`uppercase tracking-[0.2em] italic font-black whitespace-nowrap px-2
          ${type === 'super_critical' ? 'text-[clamp(1.1rem,5vw,1.8rem)] text-white bg-red-600 shadow-lg border border-white/20' : 'text-[clamp(0.8rem,3vw,1.2rem)] opacity-90'}
        `}
        style={{ textShadow: config.isGradient ? 'none' : '1px 1px 2px black' }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
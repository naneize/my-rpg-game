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
          style: 'bg-gradient-to-b from-rose-500 via-amber-400 to-yellow-300 drop-shadow-[0_0_12px_rgba(255,50,50,1)] animate-bounce font-[1000]',
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

      case 'reflect':
          return { 
            style: 'text-fuchsia-400 drop-shadow-[0_4px_0_rgba(134,25,143,1)] animate-bounce', 
            label: '✨ REFLECT', 
            fontSize: 'clamp(2.5rem, 12vw, 5rem)' 
        };

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
      case 'dark': case 'dark_hit':
        return { style: 'text-purple-800 drop-shadow-[0_0_10px_rgba(126,34,206,0.5)]', label: '🌑 DARK', fontSize: 'clamp(2rem, 10vw, 3.5rem)' };
      
      case 'player':
      case 'PLAYER_HIT':
        return { style: 'text-red-600 drop-shadow-[0_3px_0_black] font-black italic', label: 'HIT', fontSize: 'clamp(2.2rem, 10vw, 4rem)' };
      
      default:
        return { style: 'text-white drop-shadow-[2px_2px_0_black]', label: null, fontSize: '2.25rem' };
    }
  };

  const config = getDamageConfig();
  let topPosition = isPlayerTarget ? '75%' : '38%';

  const isPositive = type.startsWith('buff_') || type.includes('recovery');
  const prefix = isPositive ? '+' : '-';

  // 🛰️ ฟอนต์เหลี่ยม Hard-Edge สำหรับดาเมจ
  const cyberFont = "'Orbitron', 'Chakra Petch', sans-serif";

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
          backgroundImage: 'linear-gradient(to bottom, #f43f5e, #fbbf24, #fde047)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'white' // Fallback
        } : { WebkitTextStroke: '2px black' }}
      >
        {prefix}{value}
      </span>

      {config.label && (
        <span className={`uppercase tracking-[0.2em] italic font-black whitespace-nowrap px-2
          ${type === 'super_critical' ? 'text-[clamp(1.1rem,5vw,1.8rem)] text-white bg-red-600 shadow-lg' : 'text-[clamp(0.8rem,3vw,1.2rem)] opacity-90'}
        `}
        style={{ WebkitTextStroke: config.isGradient ? '0px' : '1px black' }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
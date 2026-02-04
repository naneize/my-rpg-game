// src/components/collection/ArtifactSlot.jsx
import React from 'react';

export default function ArtifactSlot({ loot, hasLoot }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500
        ${hasLoot 
          ? 'bg-slate-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
          : 'bg-slate-900 border-slate-800 opacity-40 scale-90'}`}>
        
        {loot.image && loot.image.startsWith('/') ? (
          <img 
            src={loot.image} 
            className={`w-8 h-8 object-contain transition-all duration-700 ${hasLoot ? '' : 'brightness-0'}`} 
            alt={loot.name} 
          />
        ) : (
          <span className={`text-xl transition-all duration-700 ${hasLoot ? '' : 'brightness-0'}`}>
            {loot.image || "📦"}
          </span>
        )}
      </div>
      <span className={`text-[7px] font-bold uppercase ${hasLoot ? 'text-white' : 'text-slate-600'}`}>
        {hasLoot ? loot.name : '???'}
      </span>
    </div>
  );
}
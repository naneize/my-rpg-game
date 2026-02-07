import React from 'react';
import { Sword, Footprints } from 'lucide-react';

export const CombatActionButtons = ({ 
  onAttack, 
  onFlee, 
  isInputLocked, 
  lootResult, 
  isWorldBoss, 
  isShiny, 
  isTrulyBoss 
}) => {
  return (
    <div className="mt-4 space-y-2 relative z-10 w-full px-2">
      <button
        onClick={onAttack}
        disabled={isInputLocked}
        className={`w-full py-4 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 text-lg uppercase italic transition-all active:scale-95
          ${isInputLocked
            ? 'bg-slate-800 opacity-50'
            : isWorldBoss
              ? 'bg-gradient-to-r from-amber-700 to-amber-900 shadow-amber-900/40'
              : `bg-gradient-to-r ${isShiny ? 'from-indigo-600 to-purple-600' : isTrulyBoss ? 'from-amber-600 to-amber-800 shadow-amber-900/40' : 'from-red-700 to-red-600'} shadow-red-900/20`}
        `}
      >
        <Sword size={22} /> <span>โจมตี!</span>
      </button>

      {!lootResult && (
        <button
          onClick={onFlee}
          disabled={isInputLocked}
          className="w-full py-2.5 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 text-sm uppercase italic active:scale-95"
        >
          <Footprints size={18} /> <span>ถอยไปตั้งหลัก!</span>
        </button>
      )}
    </div>
  );
};
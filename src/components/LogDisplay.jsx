import React, { useEffect, useRef } from 'react';

/**
 * LogDisplay: Component for displaying game event logs
 * @param {Array} logs - List of all log messages
 */
export default function LogDisplay({ logs }) {
  const scrollRef = useRef(null);

  // Auto-scroll logic could be added here if needed, 
  // but showing the latest log at the top is standard for this genre.
  
  return (
    <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] shadow-2xl mb-2 text-left custom-scrollbar">
      <div className="space-y-1">
        {logs.map((log, i) => {
          // 🎨 Logic to colorize logs based on content keywords
          const isHeal = log.includes('Restore') || log.includes('Heal');
          const isLevelUp = log.includes('Level Up');
          const isItem = log.includes('Received') || log.includes('Obtained') || log.includes('Found');

          return (
            <div 
              key={i} 
              className={`flex gap-2 border-b border-slate-800/30 pb-1 animate-in slide-in-from-left duration-300 ${
                isHeal ? 'text-emerald-400' : 
                isLevelUp ? 'text-amber-400 font-bold' : 
                isItem ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <span className={`${isLevelUp ? 'text-amber-500' : 'text-red-500'} font-bold`}>»</span> 
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}
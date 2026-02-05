import React from 'react';
import { Heart, Sword, Shield, Sparkles } from 'lucide-react';
import StatItem from './StatItem';

export default function StatGroup({ stats, bonusStats, collectionBonuses, onUpgrade }) {
  // รวมข้อมูลสเตตัสเพื่อนำไป Loop แสดงผล
  const statDisplayList = [
    { 
      icon: Heart, label: 'HP', color: 'text-red-500', 
      val: stats.finalMaxHp, 
      bonus: bonusStats?.hp || 0, 
      key: 'maxHp',
      statKey: 'hp'
    },
    { 
      icon: Sword, label: 'ATK', color: 'text-orange-500', 
      val: stats.finalAtk, 
      bonus: bonusStats?.atk || 0, 
      key: 'atk',
      statKey: 'atk'
    },
    { 
      icon: Shield, label: 'DEF', color: 'text-blue-500', 
      val: stats.finalDef, 
      bonus: bonusStats?.def || 0, 
      key: 'def',
      statKey: 'def'
    },
    { 
      icon: Sparkles, label: 'LUCK', color: 'text-emerald-400', 
      val: (stats.luck || 0) + (bonusStats?.luck || collectionBonuses.luck), 
      bonus: bonusStats?.luck || collectionBonuses.luck,      
      key: 'luck',
      statKey: 'luck'
    }
  ];

  return (
    <div className="flex flex-col space-y-2 flex-shrink-0">
      {statDisplayList.map((stat, i) => (
        <div key={i} className="w-full relative group">
          <StatItem 
            stat={stat} 
            stats={stats}
            bonus={stat.bonus}
            onUpgrade={onUpgrade} 
          />
        </div>
      ))}
    </div>
  );
}
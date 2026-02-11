// ✅ equipments.js (The Grand Collection - 75 Items with Instance Generator)

// ฟังก์ชันสำหรับสร้างไอเทมชิ้นใหม่ที่มี Unique ID (Instance)
// ใช้ตอนที่มอนสเตอร์ดรอปของ หรือตอนซื้อของครับ
export const createItemInstance = (itemTemplate, customProps = {}) => {
  const instanceId = `${itemTemplate.id}-${Math.random().toString(36).substr(2, 9)}`;
  return {
    ...itemTemplate,
    id: instanceId,          // เปลี่ยนจาก ID ธรรมดาเป็น Instance ID
    baseId: itemTemplate.id, // เก็บ ID เดิมไว้ดึงข้อมูล Master Data
    level: 0,                // เลเวลเริ่มต้น
    isShiny: false,          // สถานะ Shiny
    acquiredAt: Date.now(),   // วันที่ได้รับ
    ...customProps           // ใส่ Stat เพิ่มเติมถ้ามี
  };
};

export const EQUIPMENTS = [
  // ==========================================
  // ⚔️ WEAPON (15 Items) - เน้น ATK, CRIT, PEN
  // ==========================================
  { id: 'wooden_sword', name: 'Novice Wooden Sword', slot: 'weapon', rarity: 'Common', icon: '🗡️', atk: 15, description: 'Practice sword carved from oak.', color: 'text-slate-400' },
  { id: 'oak_slingshot', name: 'Oak Wood Slingshot', slot: 'weapon', rarity: 'Common', icon: '🗡️', atk: 18, description: 'Basic ranged weapon.', color: 'text-slate-400' },
  { id: 'rusty_dagger', name: 'Rusty Kitchen Knife', slot: 'weapon', rarity: 'Common', icon: '🗡️', atk: 22, description: 'Old but still cuts.', color: 'text-slate-400' },
  { id: 'hunters_dagger', name: "Hunter's Dagger", slot: 'weapon', rarity: 'Uncommon', icon: '🗡️', atk: 45, atkPercent: 0.05, critRate: 0.03, color: 'text-emerald-400' },
  { id: 'iron_mace', name: 'Heavy Iron Mace', slot: 'weapon', rarity: 'Uncommon', icon: '🗡️', atk: 55, pen: 0.02, color: 'text-emerald-400' },
  { id: 'scout_bow', name: 'Composite Scout Bow', slot: 'weapon', rarity: 'Uncommon', icon: '🗡️', atk: 50, critRate: 0.05, color: 'text-emerald-400' },
  { id: 'poison_ivy_blade', name: 'Poison Ivy Blade', slot: 'weapon', rarity: 'Rare', icon: '🗡️', atk: 120, atkPercent: 0.12, pen: 0.08, color: 'text-blue-400' },
  { id: 'elven_longbow', name: 'Elven Heritage Longbow', slot: 'weapon', rarity: 'Rare', icon: '🗡️', atk: 135, critRate: 0.10, critDamage: 0.20, color: 'text-blue-400' },
  { id: 'wind_slicer', name: 'Wind Slicer Katana', slot: 'weapon', rarity: 'Rare', icon: '🗡️', atk: 125, atkPercent: 0.10, critRate: 0.12, color: 'text-blue-400' },
  { id: 'serpent_fang_dagger', name: 'Serpent Fang Dagger', slot: 'weapon', rarity: 'Epic', icon: '🗡️', atk: 350, pen: 0.15, critRate: 0.15, color: 'text-purple-400' },
  { id: 'magma_breaker', name: 'Magma Breaker Hammer', slot: 'weapon', rarity: 'Epic', icon: '🗡️', atk: 420, pen: 0.25, description: 'Crushes any armor.', color: 'text-purple-400' },
  { id: 'plasma_cutter', name: 'High-Freq Plasma Blade', slot: 'weapon', rarity: 'Epic', icon: '🗡️', atk: 380, atkPercent: 0.25, pen: 0.10, color: 'text-purple-400' },
  { id: 'void_reaver_blade', name: 'VOID REAVER BLADE', slot: 'weapon', rarity: 'Legendary', icon: '🗡️', atk: 950, atkPercent: 0.50, critRate: 0.25, critDamage: 1.0, pen: 0.35, color: 'text-purple-500' },
  { id: 'storm_caller_bow', name: 'STORM CALLER BOW', slot: 'weapon', rarity: 'Legendary', icon: '🗡️', atk: 880, atkPercent: 0.45, critRate: 0.35, critDamage: 0.8, color: 'text-orange-500' },
  { id: 'genesis_claymore', name: 'GENESIS TERRA BLADE', slot: 'weapon', rarity: 'Legendary', icon: '🗡️', atk: 1100, pen: 0.50, def: 200, color: 'text-orange-500' },

  // ==========================================
  // 🛡️ ARMOR (15 Items) - เน้น DEF, HP, REFLECT
  // ==========================================
  { id: 'rabbit_vest', name: 'Rabbit Leather Vest', slot: 'armor', rarity: 'Common', icon: '🧥', def: 10, hp: 50, color: 'text-slate-400' },
  { id: 'cloth_tunic', name: 'Old Cloth Tunic', slot: 'armor', rarity: 'Common', icon: '🧥', def: 5, hp: 80, color: 'text-slate-400' },
  { id: 'straw_armor', name: 'Woven Straw Armor', slot: 'armor', rarity: 'Common', icon: '🧥', def: 8, hp: 60, color: 'text-slate-400' },
  { id: 'iron_shield_armor', name: 'Rusty Iron Plate', slot: 'armor', rarity: 'Uncommon', icon: '🧥', def: 35, hp: 150, defPercent: 0.05, color: 'text-emerald-400' },
  { id: 'thick_fur_coat', name: 'Wolf Fur Coat', slot: 'armor', rarity: 'Uncommon', icon: '🧥', def: 25, hp: 250, color: 'text-emerald-400' },
  { id: 'reinforced_suit', name: 'Reinforced Scout Suit', slot: 'armor', rarity: 'Uncommon', icon: '🧥', def: 30, hp: 180, atk: 10, color: 'text-emerald-400' },
  { id: 'wind_walker_suit', name: 'Wind Walker Suit', slot: 'armor', rarity: 'Rare', icon: '🧥', def: 85, hp: 600, defPercent: 0.12, color: 'text-blue-400' },
  { id: 'guardian_mail', name: 'Meadow Guardian Mail', slot: 'armor', rarity: 'Rare', icon: '🧥', def: 120, hp: 450, defPercent: 0.15, color: 'text-blue-400' },
  { id: 'mossy_plate', name: 'Mossy Shell Plate', slot: 'armor', rarity: 'Rare', icon: '🧥', def: 150, hp: 800, reflect: 0.03, color: 'text-blue-400' },
  { id: 'magma_plate', name: 'Magma Forged Plate', slot: 'armor', rarity: 'Epic', icon: '🧥', def: 350, hp: 2500, defPercent: 0.25, reflect: 0.08, color: 'text-purple-400' },
  { id: 'ent_bark_armor', name: 'Living Bark Armor', slot: 'armor', rarity: 'Epic', icon: '🧥', def: 280, hp: 3500, hpPercent: 0.20, color: 'text-purple-400' },
  { id: 'nano_fiber_suit', name: 'Neural Nano Suit', slot: 'armor', rarity: 'Epic', icon: '🧥', def: 320, hp: 2000, defPercent: 0.20, color: 'text-purple-400' },
  { id: 'hydra_armor', name: 'ABYSSAL HYDRA HUSK', slot: 'armor', rarity: 'Legendary', icon: '🧥', def: 650, hp: 8500, defPercent: 0.45, hpPercent: 0.35, reflect: 0.15, color: 'text-orange-500' },
  { id: 'steel_wing_plate', name: 'CYBER DRAGON SCALE', slot: 'armor', rarity: 'Legendary', icon: '🧥', def: 800, hp: 6000, defPercent: 0.50, reflect: 0.20, color: 'text-orange-500' },
  { id: 'void_shroud', name: 'NEURAL VOID SHROUD', slot: 'armor', rarity: 'Legendary', icon: '🧥', def: 500, hp: 12000, hpPercent: 0.60, color: 'text-purple-500' },

  // ==========================================
  // 💍 ACCESSORY (15 Items) - เน้น HP, LUCK, % STAT
  // ==========================================
  { id: 'grass_crown', name: 'Meadow Flower Crown', slot: 'accessory', rarity: 'Common', icon: '📿', hp: 20, def: 5, color: 'text-slate-400' },
  { id: 'pebble_necklace', name: 'Pebble Necklace', slot: 'accessory', rarity: 'Common', icon: '📿', def: 8, hp: 15, color: 'text-slate-400' },
  { id: 'feather_charm', name: 'Swift Bird Feather', slot: 'accessory', rarity: 'Common', icon: '📿', luck: 2, color: 'text-slate-400' },
  { id: 'clover_pendant', name: 'Clover Pendant', slot: 'accessory', rarity: 'Uncommon', icon: '📿', hp: 120, luck: 8, critRate: 0.02, color: 'text-emerald-400' },
  { id: 'beast_tooth', name: 'Sharp Beast Tooth', slot: 'accessory', rarity: 'Uncommon', icon: '📿', atk: 15, atkPercent: 0.02, color: 'text-emerald-400' },
  { id: 'honey_jar', name: 'Sweet Royal Honey', slot: 'accessory', rarity: 'Uncommon', icon: '📿', hp: 200, hpPercent: 0.03, color: 'text-emerald-400' },
  { id: 'wind_essence', name: 'Gale Wind Essence', slot: 'accessory', rarity: 'Rare', icon: '📿', luck: 15, critRate: 0.08, color: 'text-blue-400' },
  { id: 'water_pearl', name: 'Freshwater Pearl', slot: 'accessory', rarity: 'Rare', icon: '📿', hp: 800, def: 40, color: 'text-blue-400' },
  { id: 'fire_amber', name: 'Glowing Fire Amber', slot: 'accessory', rarity: 'Rare', icon: '📿', atk: 60, critDamage: 0.15, color: 'text-blue-400' },
  { id: 'nature_emblem', name: 'Emblem of the Forest', slot: 'accessory', rarity: 'Epic', icon: '📿', hp: 2500, hpPercent: 0.15, color: 'text-purple-400' },
  { id: 'warrior_spirit_pendant', name: 'Warrior Spirit Gem', slot: 'accessory', rarity: 'Epic', icon: '📿', atkPercent: 0.20, critRate: 0.10, color: 'text-purple-400' },
  { id: 'iron_core_pendant', name: 'Hardened Iron Core', slot: 'accessory', rarity: 'Epic', icon: '📿', defPercent: 0.25, hp: 1500, color: 'text-purple-400' },
  { id: 'infinite_step_core', name: 'INFINITE_STEP CORE', slot: 'accessory', rarity: 'Legendary', icon: '📿', atkPercent: 0.35, defPercent: 0.35, hpPercent: 0.35, color: 'text-orange-500' },
  { id: 'god_seed_pendant', name: 'YGGDRASIL SEED', slot: 'accessory', rarity: 'Legendary', icon: '📿', hp: 10000, hpPercent: 0.50, color: 'text-orange-500' },
  { id: 'chaos_shiver', name: 'CHAOS REALITY CORE', slot: 'accessory', rarity: 'Legendary', icon: '📿', atkPercent: 0.60, pen: 0.20, color: 'text-orange-500' },

  // ==========================================
  // 🎗️ BELT (15 Items) - เน้น DEF, HP, CRIT DAMAGE
  // ==========================================
  { id: 'leather_belt', name: 'Simple Leather Belt', slot: 'belt', rarity: 'Common', icon: '🎗️', def: 5, hp: 30, color: 'text-slate-400' },
  { id: 'rope_belt', name: 'Sturdy Hemp Rope', slot: 'belt', rarity: 'Common', icon: '🎗️', hp: 50, color: 'text-slate-400' },
  { id: 'fabric_sash', name: 'Old Fabric Sash', slot: 'belt', rarity: 'Common', icon: '🎗️', def: 8, color: 'text-slate-400' },
  { id: 'snake_skin_belt', name: 'Snake Skin Belt', slot: 'belt', rarity: 'Uncommon', icon: '🎗️', def: 15, critRate: 0.03, color: 'text-emerald-400' },
  { id: 'insect_molt_belt', name: 'Chitin Belt', slot: 'belt', rarity: 'Uncommon', icon: '🎗️', def: 40, hp: 100, color: 'text-emerald-400' },
  { id: 'beast_hide_belt', name: 'Thick Beast Hide', slot: 'belt', rarity: 'Uncommon', icon: '🎗️', def: 25, hp: 250, color: 'text-emerald-400' },
  { id: 'silver_chain_belt', name: 'Polished Silver Chain', slot: 'belt', rarity: 'Rare', icon: '🎗️', def: 80, critDamage: 0.15, color: 'text-blue-400' },
  { id: 'river_mud_belt', name: 'Hardened Mud Sash', slot: 'belt', rarity: 'Rare', icon: '🎗️', def: 120, hp: 500, color: 'text-blue-400' },
  { id: 'wind_silk_belt', name: 'Gale Silk Belt', slot: 'belt', rarity: 'Rare', icon: '🎗️', critRate: 0.08, luck: 10, color: 'text-blue-400' },
  { id: 'dragon_scale_belt', name: 'DRAGON SCALE BELT', slot: 'belt', rarity: 'Legendary', icon: '🎗️', def: 500, defPercent: 0.45, critDamage: 0.80, pen: 0.15, color: 'text-red-500' },
  { id: 'volcano_belt', name: 'LAVA FLOW SASH', slot: 'belt', rarity: 'Epic', icon: '🎗️', def: 300, hp: 1500, reflect: 0.10, color: 'text-purple-400' },
  { id: 'titanium_belt', name: 'TITANIUM PLATED BELT', slot: 'belt', rarity: 'Epic', icon: '🎗️', def: 450, defPercent: 0.30, color: 'text-purple-400' },
  { id: 'neural_link_belt', name: 'NEURAL LINK SASH', slot: 'belt', rarity: 'Epic', icon: '🎗️', atkPercent: 0.15, critRate: 0.12, color: 'text-purple-400' },
  { id: 'world_spine_belt', name: 'WORLD SPINE BELT', slot: 'belt', rarity: 'Legendary', icon: '🎗️', hp: 8000, def: 600, defPercent: 0.50, color: 'text-orange-500' },
  { id: 'void_orbit', name: 'VOID ORBITAL BELT', slot: 'belt', rarity: 'Legendary', icon: '🎗️', pen: 0.30, critDamage: 1.20, color: 'text-purple-500' },

  // ==========================================
  // 🔮 TRINKET (15 Items) - เน้น PEN, CRIT, LUCK
  // ==========================================
  { id: 'shiny_pebble', name: 'Shiny River Pebble', slot: 'trinket', rarity: 'Common', icon: '👑', luck: 5, color: 'text-slate-400' },
  { id: 'broken_tooth', name: 'Broken Insect Tooth', slot: 'trinket', rarity: 'Common', icon: '👑', atk: 5, color: 'text-slate-400' },
  { id: 'dried_leaf', name: 'Golden Autumn Leaf', slot: 'trinket', rarity: 'Common', icon: '👑', hp: 30, color: 'text-slate-400' },
  { id: 'lucky_ring', name: 'Ring of Fortune', slot: 'trinket', rarity: 'Rare', icon: '👑', luck: 25, critRate: 0.08, pen: 0.05, color: 'text-blue-400' },
  { id: 'sharp_claw_trinket', name: 'Sharp Wolf Claw', slot: 'trinket', rarity: 'Uncommon', icon: '👑', atkPercent: 0.05, critRate: 0.03, color: 'text-emerald-400' },
  { id: 'blue_crystal', name: 'Azure Crystal Shard', slot: 'trinket', rarity: 'Uncommon', icon: '👑', hp: 150, def: 20, color: 'text-emerald-400' },
  { id: 'ancient_coin', name: 'Mysterious Gold Coin', slot: 'trinket', rarity: 'Uncommon', icon: '👑', luck: 12, color: 'text-emerald-400' },
  { id: 'eagle_eye', name: 'Eagle Eye Charm', slot: 'trinket', rarity: 'Rare', icon: '👑', critRate: 0.15, critDamage: 0.20, color: 'text-blue-400' },
  { id: 'toxic_vial', name: 'Concentrated Venom', slot: 'trinket', rarity: 'Rare', icon: '👑', pen: 0.12, atk: 50, color: 'text-blue-400' },
  { id: 'abyssal_eye_pendant', name: 'ABYSSAL EYE PENDANT', slot: 'trinket', rarity: 'Legendary', icon: '👑', atkPercent: 0.25, critRate: 0.20, critDamage: 0.80, pen: 0.25, color: 'text-cyan-400' },
  { id: 'phoenix_ember', name: 'ETERNAL PHOENIX EMBER', slot: 'trinket', rarity: 'Epic', icon: '👑', hp: 2000, hpPercent: 0.20, reflect: 0.12, color: 'text-purple-400' },
  { id: 'ghost_shard', name: 'Ethereal Ghost Shard', slot: 'trinket', rarity: 'Epic', icon: '👑', luck: 40, critRate: 0.15, color: 'text-purple-400' },
  { id: 'dragon_heart', name: 'DRAGON HEART CORE', slot: 'trinket', rarity: 'Epic', icon: '👑', hp: 5000, atkPercent: 0.15, color: 'text-purple-400' },
  { id: 'omega_chip', name: 'OMEGA NEURAL CHIP', slot: 'trinket', rarity: 'Legendary', icon: '👑', atkPercent: 0.40, pen: 0.40, critDamage: 0.50, color: 'text-orange-500' },
  { id: 'universe_soul', name: 'SOUL OF THE UNIVERSE', slot: 'trinket', rarity: 'Legendary', icon: '👑', luck: 100, critRate: 0.50, pen: 0.50, color: 'text-orange-500' }
];
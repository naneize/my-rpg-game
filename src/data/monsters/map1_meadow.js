import { itemMaster } from '../itemData';
import { EQUIPMENTS } from '../equipments';

const getItemLoot = (itemId, chance) => {
  const baseItem = itemMaster[itemId] || EQUIPMENTS.find(e => e.id === itemId);
  if (!baseItem) return { name: itemId, chance, type: "MATERIAL", image: "❓" };

  let itemType = "MATERIAL";
  if (baseItem.slot || baseItem.type === "EQUIPMENT") itemType = "EQUIPMENT";
  else if (baseItem.type === "ARTIFACT") itemType = "ARTIFACT";

  return { ...baseItem, itemId, chance, type: itemType };
};

export const map1Monsters = [
  // ================= Tier 1: Level 1 =================
  {
    id: 'bug',
    name: "Tiny Beetle",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 30, atk: 6, def: 2, 
    image: "/monsters/red_bug.png",
    skills: [
      // ✅ เพิ่มธาตุ EARTH ตาม passiveEffects
      { name: "Bite", chance: 0.3, condition: "Active", element: "NORMAL", description: "Snaps with tiny mandibles, dealing 110% Physical Damage." },
      { name: "Bug Carapace", chance: 1.0, condition: "Passive", element: "EARTH", description: "Reduces incoming damage by 3 units." }
    ],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 1 },
      getItemLoot("wooden_sword", 0.04),
      getItemLoot("Transparent Wing", 0.5),
      getItemLoot("Insect Antenna", 0.4),
      getItemLoot("Old Insect Shell", 0.3),
      getItemLoot("Broken Insect Leg", 0.2),
      getItemLoot("Wing-Clinging Dirt", 0.15),
      getItemLoot("Roadside Pebble", 0.1),
      getItemLoot("Rainbow Insect Wing", 0.03),
      getItemLoot("Compound Insect Eye", 0.01)
    ],
    elementPowerBonus: { earth: 2 }, 
    collectionBonus: { def: 3, hp: 10, defPercent: 0.01 }
  },

  // ================= Tier 2: Level 1-2 =================
  {
    id: 'capterpillar',
    name: "Sleepy Larva",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 50, atk: 8, def: 4, 
    image: "/monsters/little_worm.png",
    skills: [
      // ✅ เพิ่มธาตุ POISON ตาม activeEffects
      { name: "Web Shot", chance: 0.25, condition: "Active", element: "POISON", description: "Sprays silk dealing 80% damage and slowing the target." },
      { name: "Caterpillar Silk", chance: 1.0, condition: "Passive", element: "WIND", description: "Reduces incoming damage by 5%." }
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.03 },
      getItemLoot("grass_crown", 0.04),
      getItemLoot("Bitten Leaf", 0.5),
      getItemLoot("Soft Larva Armor", 0.4),
      getItemLoot("Tangled Silk Ball", 0.3),
      getItemLoot("Mulberry Leaf Scraps", 0.2),
      getItemLoot("Sticky Saliva", 0.15),
      getItemLoot("Green Herb", 0.1),
      getItemLoot("Silver Sparkle Leaf", 0.03),
      getItemLoot("Silver Chrysalis", 0.01)
    ],
    elementPowerBonus: { earth: 3 },
    collectionBonus: { hp: 30, hpPercent: 0.02 }
  },

  // ================= Tier 3: Level 2 =================
  {
    id: 'grasshopper',
    name: "Nimble Grasshopper",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Common",
    hp: 45, atk: 14, def: 2, 
    image: "/monsters/grashopper.png",
    skills: [
      // ✅ เพิ่มธาตุ WIND ตาม activeEffects
      { name: "Grasshopper Jump", chance: 0.2, condition: "Active", element: "WIND", description: "A powerful kick dealing 140% Physical Damage." }
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.03 },
      getItemLoot("oak_slingshot", 0.04),
      getItemLoot("Grasshopper Leg", 0.5),
      getItemLoot("Green Grasshopper Wing", 0.4),
      getItemLoot("Dry Straw", 0.3),
      getItemLoot("Meadow Twig Scraps", 0.2),
      getItemLoot("Lucky Insect Ear", 0.1),
      getItemLoot("Scrap Twig", 0.08),
      getItemLoot("Golden Grasshopper Leg", 0.02),
      getItemLoot("Meadow Warrior's Heart", 0.01)
    ],
    elementPowerBonus: { wind: 5 },
    collectionBonus: { luck: 3, atk: 2, atkPercent: 0.01 }
  },

  // ================= Tier 4: Level 3 =================
  {
    id: 'slime',
    name: "Meadow Slime",
    type: "AMORPHOUS",
    element: "WATER",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 75, atk: 12, def: 6, 
    image: "/monsters/slime.png",
    skills: [
      // ✅ เพิ่มธาตุ NORMAL (กายภาพ) แต่มีผลพื้นฐานเป็น WATER
      { name: "Jump Attack", chance: 0.3, condition: "Active", element: "NORMAL", description: "Leaps onto target dealing 130% Physical Damage." },
      { name: "Slime Recovery", chance: 1.0, condition: "Passive", element: "NORMAL", description: "Regenerative body reduces damage taken by 10%." }
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.04 },
      getItemLoot("iron_shield", 0.04),
      getItemLoot("Slime Mucus", 0.5),
      getItemLoot("Water Bubble", 0.4),
      getItemLoot("Tiny Ice Shard", 0.3),
      getItemLoot("Concentrated Slime", 0.2),
      getItemLoot("Clear Slime Core", 0.1),
      getItemLoot("Azure Gemstone", 0.05),
      getItemLoot("Eternal Dewdrop", 0.02),
      getItemLoot("Eternal Slime Heart", 0.01)
    ],
    elementPowerBonus: { water: 8 },
    collectionBonus: { hp: 100, def: 2, hpPercent: 0.03 }
  },

  // ================= Tier 4.5: Level 3-4 =================
  {
    id: 'plump_rabbit',
    name: "Brawny Fluff-Rabbit",
    type: "BEAST",
    element: "NEUTRAL",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 120, atk: 18, def: 10, 
    image: "/monsters/plump_rabbit.png",
    skills: [
      // ✅ สกิลสายเตะเป็น NORMAL
      { name: "Power Kick", chance: 0.25, condition: "Active", element: "NORMAL", description: "Delivers a heavy back-kick dealing 150% damage." }
    ],
    lootTable: [
      { name: "Power Kick Skill", rarity: "Uncommon", skillId: "Power Kick", type: "SKILL", chance: 0.04 },
      getItemLoot("rabbit_vest", 0.04),
      getItemLoot("clover_pendant", 0.03),
      getItemLoot("Soft Rabbit Fur", 0.5),
      getItemLoot("Long Rabbit Ear", 0.4),
      getItemLoot("Wild Carrot", 0.3),
      getItemLoot("Lucky Rabbit Foot", 0.2),
      getItemLoot("Natural Whetstone", 0.15),
      getItemLoot("Meadow Twig Scraps", 0.1),
      getItemLoot("Giant Rabbit Tooth", 0.03),
      getItemLoot("Roadside Pebble", 0.01)
    ],
    elementPowerBonus: { light: 2, earth: 2 },
    collectionBonus: { hp: 150, defPercent: 0.03 }
  },

  // ================= Tier 5: Level 4 =================
  {
    id: 'flower_sprite',
    name: "Playful Flower Sprite",
    type: "PLANT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 90, atk: 25, def: 5, 
    image: "/monsters/flower_sprite.png",
    skills: [
      // ✅ เพิ่มธาตุ LIGHT ตาม activeEffects (Floral Beam)
      { name: "Floral Beam", chance: 0.3, condition: "Active", element: "LIGHT", description: "Fires a concentrated beam dealing 140% Light Damage." }
    ],
    lootTable: [
      { name: "Floral Beam Skill", rarity: "Uncommon", skillId: "Floral Beam", type: "SKILL", chance: 0.04 },
      getItemLoot("grass_crown", 0.05),
      getItemLoot("Multicolored Petals", 0.5),
      getItemLoot("Floral Nectar", 0.4),
      getItemLoot("Wild Flower Pollen", 0.3),
      getItemLoot("Butterfly Wing Dust", 0.2),
      getItemLoot("Green Herb", 0.15),
      getItemLoot("Silver Sparkle Leaf", 0.1),
      getItemLoot("Spirit Perfume", 0.02),
      getItemLoot("Golden Herb", 0.01)
    ],
    elementPowerBonus: { earth: 10, light: 5 },
    collectionBonus: { atk: 5, luck: 2, atkPercent: 0.02 }
  },

  {
    id: 'meadow_glider',
    name: "Meadow Flying Squirrel",
    type: "BEAST",
    element: "WIND",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 110, atk: 22, def: 8, 
    image: "/monsters/meadow_glider.png",
    skills: [
      // ✅ เพิ่มธาตุ EARTH ตาม activeEffects (Acorn Bomb)
      { name: "Acorn Bomb", chance: 0.3, condition: "Active", element: "EARTH", description: "Throws an explosive acorn dealing 135% damage." }
    ],
    lootTable: [
      { name: "Acorn Bomb Skill", rarity: "Uncommon", skillId: "Acorn Bomb", type: "SKILL", chance: 0.04 },
      getItemLoot("wind_walker_boots", 0.05),
      getItemLoot("Fluffy Squirrel Tail", 0.5),
      getItemLoot("Wild Oak Nut", 0.4),
      getItemLoot("Giant Sunflower Seed", 0.3),
      getItemLoot("Fragrant Bark", 0.2),
      getItemLoot("Emerald Feather", 0.15),
      getItemLoot("Lucky Squirrel Charm", 0.05),
      getItemLoot("Golden Peanut", 0.02),
      getItemLoot("Azure Feather", 0.01)
    ],
    elementPowerBonus: { wind: 12 },
    collectionBonus: { def: 3, luck: 4, atkPercent: 0.02 }
  },

  {
    id: 'mossy_crawler',
    name: "Lazy Moss Worm",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Rare",
    hp: 160, atk: 28, def: 12, 
    image: "/monsters/mossy_crawler.png",
    skills: [
      // ✅ เพิ่มธาตุ POISON ตาม activeEffects (Spore Burst)
      { name: "Spore Burst", chance: 0.3, condition: "Active", element: "POISON", description: "Explodes poison spores dealing 150% damage." }
    ],
    lootTable: [
      { name: "Spore Burst Skill", rarity: "Rare", skillId: "Spore Burst", type: "SKILL", chance: 0.03 },
      getItemLoot("hunters_dagger", 0.3),
      getItemLoot("Green Silk Thread", 0.5),
      getItemLoot("Dried Moss Dust", 0.4),
      getItemLoot("Bramble Thorn", 0.3),
      getItemLoot("Insect Fang", 0.2),
      getItemLoot("Cocoon of Secrets", 0.15),
      getItemLoot("Verdant Heart", 0.1),
      getItemLoot("Celestial Silk", 0.03),
      getItemLoot("Flora Crystal", 0.01)
    ],
    elementPowerBonus: { earth: 15, poison: 10 },
    collectionBonus: { hp: 50, def: 5, defPercent: 0.05 }
  },

  // ================= 🛡️ Tier 6: MINI-BOSS =================
  {
    id: 'forest_guardian_bug',
    name: "🛡️ Saber-Fang Guardian",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Epic",
    isMiniBoss: true,
    hp: 450, atk: 35, def: 20, 
    image: "/monsters/forest_guardian_bug.png",
    skills: [
      // ✅ เพิ่มธาตุ EARTH ตาม activeEffects
      { name: "Horn Toss", chance: 0.3, condition: "Active", element: "EARTH", description: "Tosses target into the air, dealing 170% Physical Damage." },
      { name: "Solid Guard", chance: 1.0, condition: "Passive", element: "EARTH", description: "Reduces Physical Damage taken by 15%." }
    ],
    lootTable: [
      { name: "Solid Guard Skill", rarity: "Epic", skillId: "Solid Guard", type: "SKILL", chance: 0.02 },
      getItemLoot("hunters_dagger", 0.06),
      getItemLoot("Thick Beetle Shell", 0.5),
      getItemLoot("Broken Beetle Horn", 0.4),
      getItemLoot("Azure Guardian Horn", 0.3),
      getItemLoot("Iron Beetle Heart", 0.2),
      getItemLoot("Compound Insect Eye", 0.15),
      getItemLoot("Old Insect Shell", 0.1),
      getItemLoot("Natural Whetstone", 0.05),
      getItemLoot("Gilded Insect Molt", 0.01)
    ],
    elementPowerBonus: { earth: 30 },
    collectionBonus: { def: 10, hp: 100, atk: 5, defPercent: 0.08 }
  },

  // ================= Tier 5: WORLD BOSS =================
  {
    id: 'meadow_queen_bee',
    name: "👑 Golden Hive Queen",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Legendary",
    isFixedStats: true,
    isBoss: true,
    hp: 1500, atk: 45, def: 25, 
    image: "/monsters/Queen_bee.png",
    skills: [
      // ✅ เพิ่มธาตุ POISON สำหรับเหล็กใน และ LIGHT สำหรับโล่น้ำผึ้ง
      { name: "Royal Stinger", chance: 0.3, condition: "Active", element: "POISON", description: "Lightning Strike dealing 180% of ATK as damage." },
      { name: "Honey Shield", chance: 1.0, condition: "Passive", element: "LIGHT", description: "Reduces all damage taken by 12%." }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.005 }, 
      getItemLoot("lucky_ring", 0.04),
      getItemLoot("Royal Honey", 0.5),
      getItemLoot("Tiny Bee Crown", 0.4),
      getItemLoot("Golden Fairy Wing", 0.3),
      getItemLoot("Soldier Bee Stinger", 0.25),
      getItemLoot("Golden Goblin Coin", 0.2),
      getItemLoot("Jelly-Coated Gold Scrap", 0.1),
      getItemLoot("Golden Herb", 0.05),
      getItemLoot("Giant Slayer Dagger", 0.01)
    ],
    elementPowerBonus: { wind: 50, light: 20 },
    collectionBonus: { atk: 15, def: 5, hp: 200, atkPercent: 0.10, critDamage: 0.15 }
  },
];
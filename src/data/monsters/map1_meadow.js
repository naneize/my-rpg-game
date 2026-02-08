import { itemMaster } from '../itemData';
import { EQUIPMENTS } from '../equipments';

const getItemLoot = (itemId, chance) => {
  // 1. Fetch data from both databases (Materials/Artifacts and Equipments)
  const baseItem = itemMaster[itemId] || EQUIPMENTS.find(e => e.id === itemId);
  
  if (!baseItem) {
    console.warn(`Item ID "${itemId}" not found in any database.`);
    return { name: itemId, chance, type: "MATERIAL", image: "❓" };
  }

  // 2. Strict Type Checking System
  let itemType = "MATERIAL"; // Default

  if (baseItem.slot || baseItem.type === "EQUIPMENT") {
    itemType = "EQUIPMENT";
  } 
  else if (baseItem.type === "ARTIFACT") {
    itemType = "ARTIFACT";
  }

  // 3. Return with correct type and properties
  return { 
    ...baseItem, 
    itemId: itemId, 
    chance,
    type: itemType 
  };
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
      { name: "Bite", chance: 0.3, condition: "Active", description: "Snaps with tiny mandibles, dealing 110% Physical Damage." },
      { name: "Bug Carapace", chance: 1.0, condition: "Passive", description: "Reduces incoming damage by 3 units." }
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
    collectionBonus: { def: 3, hp: 10 }
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
      { name: "Web Shot", chance: 0.25, condition: "Active", description: "Sprays silk dealing 80% damage and slowing the target." }
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.03 },
      getItemLoot("grass_crown", 0.04),
      getItemLoot("Bitten Leaf", 0.5),
      getItemLoot("Soft Larva Armor", 0.4),
      getItemLoot("Green Herb", 0.3),
      getItemLoot("Mulberry Leaf Scraps", 0.2),
      getItemLoot("Sticky Saliva", 0.15),
      getItemLoot("Tangled Silk Ball", 0.1),
      getItemLoot("Silver Sparkle Leaf", 0.03),
      getItemLoot("Silver Chrysalis", 0.01)
    ],
    collectionBonus: { hp: 30, def: 1 }
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
      { name: "Grasshopper Jump", chance: 0.2, condition: "Active", description: "A powerful kick dealing 140% Physical Damage." }
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.03 },
      getItemLoot("oak_slingshot", 0.04),
      getItemLoot("Grasshopper Leg", 0.5),
      getItemLoot("Azure Feather", 0.4),
      getItemLoot("Green Grasshopper Wing", 0.3),
      getItemLoot("Dry Straw", 0.2),
      getItemLoot("Meadow Twig Scraps", 0.15),
      getItemLoot("Lucky Insect Ear", 0.08),
      getItemLoot("Golden Grasshopper Leg", 0.02),
      getItemLoot("Meadow Warrior's Heart", 0.01)
    ],
    collectionBonus: { luck: 3, atk: 2 }
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
      { name: "Jump Attack", chance: 0.3, condition: "Active", description: "Leaps onto target dealing 130% Water Damage." }
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.04 },
      getItemLoot("iron_shield", 0.04),
      getItemLoot("Slime Mucus", 0.5),
      getItemLoot("Green Herb", 0.4),
      getItemLoot("Tiny Ice Shard", 0.3),
      getItemLoot("Water Bubble", 0.2),
      getItemLoot("Clear Slime Core", 0.1),
      getItemLoot("Concentrated Slime", 0.05),
      getItemLoot("Azure Gemstone", 0.02),
      getItemLoot("Eternal Slime Heart", 0.01)
    ],
    collectionBonus: { hp: 100, def: 2 }
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
      { name: "Power Kick", chance: 0.25, condition: "Active", description: "Delivers a heavy back-kick dealing 150% damage." }
    ],
    lootTable: [
      { name: "Power Kick Skill", rarity: "Uncommon", skillId: "Power Kick", type: "SKILL", chance: 0.04 },
      getItemLoot("rabbit_vest", 0.04),
      getItemLoot("clover_pendant", 0.03),
      getItemLoot("Soft Rabbit Fur", 0.5),
      getItemLoot("Long Rabbit Ear", 0.4),
      getItemLoot("Wild Carrot", 0.3),
      getItemLoot("Dry Straw", 0.2),
      getItemLoot("Meadow Twig Scraps", 0.15),
      getItemLoot("Natural Whetstone", 0.1),
      getItemLoot("Giant Rabbit Tooth", 0.02),
      getItemLoot("Lucky Rabbit Foot", 0.01)
    ],
    collectionBonus: { hp: 150, def: 3 }
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
      { name: "Floral Beam", chance: 0.3, condition: "Active", description: "Fires a concentrated beam dealing 140% Light Damage." }
    ],
    lootTable: [
      { name: "Floral Beam Skill", rarity: "Uncommon", skillId: "Floral Beam", type: "SKILL", chance: 0.04 },
      getItemLoot("grass_crown", 0.05),
      getItemLoot("Multicolored Petals", 0.5),
      getItemLoot("Green Herb", 0.4),
      getItemLoot("Wild Flower Pollen", 0.3),
      getItemLoot("Floral Nectar", 0.2),
      getItemLoot("Meadow Twig Scraps", 0.15),
      getItemLoot("Silver Sparkle Leaf", 0.08),
      getItemLoot("Eternal Dewdrop", 0.03),
      getItemLoot("Spirit Perfume", 0.01)
    ],
    collectionBonus: { atk: 5, luck: 2 }
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
    { name: "Acorn Bomb", chance: 0.3, condition: "Active", description: "Throws an explosive acorn dealing 135% damage." }
  ],
  lootTable: [
    { name: "Acorn Bomb Skill", rarity: "Uncommon", skillId: "Acorn Bomb", type: "SKILL", chance: 0.04 },

    getItemLoot("wind_walker_boots", 0.05),
    getItemLoot("Fluffy Squirrel Tail", 0.5),
    getItemLoot("Wild Oak Nut", 0.4),
    getItemLoot("Giant Sunflower Seed", 0.3),
    getItemLoot("Fragrant Bark", 0.2),
    getItemLoot("Meadow Twig Scraps", 0.15),
    getItemLoot("Emerald Feather", 0.08),
    getItemLoot("Golden Peanut", 0.03),
    getItemLoot("Lucky Squirrel Charm", 0.01)
  ],
  collectionBonus: { def: 3, luck: 4 }
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
    { name: "Spore Burst", chance: 0.3, condition: "Active", description: "Explodes poison spores dealing 150% damage." }
  ],
  lootTable: [
    { name: "Spore Burst Skill", rarity: "Rare", skillId: "Spore Burst", type: "SKILL", chance: 0.03 },

    getItemLoot("hunters_dagger", 0.3),
    getItemLoot("Green Silk Thread", 0.5),
    getItemLoot("Dried Moss Dust", 0.4),
    getItemLoot("Bramble Thorn", 0.3),
    getItemLoot("Insect Fang", 0.2),
    getItemLoot("Meadow Twig Scraps", 0.15),
    getItemLoot("Cocoon of Secrets", 0.08),
    getItemLoot("Verdant Heart", 0.03),
    getItemLoot("Flora Crystal", 0.01)
  ],
  collectionBonus: { hp: 50, def: 5 }
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
      { name: "Horn Toss", chance: 0.3, condition: "Active", description: "Tosses target into the air, dealing 170% Physical Damage." },
      { name: "Solid Guard", chance: 1.0, condition: "Passive", description: "Reduces Physical Damage taken by 15%." }
    ],
    lootTable: [
      { name: "Solid Guard Skill", rarity: "Epic", skillId: "Solid Guard", type: "SKILL", chance: 0.02 },
      getItemLoot("hunters_dagger", 0.06),
      getItemLoot("wind_walker_boots", 0.02),
      getItemLoot("Thick Beetle Shell", 0.5),
      getItemLoot("Broken Beetle Horn", 0.4),
      getItemLoot("Soft Larva Armor", 0.3),
      getItemLoot("Old Insect Shell", 0.25),
      getItemLoot("Natural Whetstone", 0.2),
      getItemLoot("Azure Feather", 0.1),
      getItemLoot("Azure Guardian Horn", 0.05),
      getItemLoot("Iron Beetle Heart", 0.01)
    ],
    collectionBonus: { def: 10, hp: 100, atk: 5 }
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
      { name: "Royal Stinger", chance: 0.3, condition: "Active", description: "Lightning Strike dealing 180% of ATK as damage." },
      { name: "Honey Shield", chance: 1.0, condition: "Passive", description: "Reduces all damage taken by 12%." }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.005 }, 
      getItemLoot("lucky_ring", 0.04),
      getItemLoot("Giant Slayer Dagger", 0.03),
      getItemLoot("Jelly-Coated Gold Scrap", 0.5),
      getItemLoot("Golden Herb", 0.4),
      getItemLoot("Soldier Bee Stinger", 0.3),
      getItemLoot("Royal Honey", 0.2),
      getItemLoot("Golden Goblin Coin", 0.1),
      getItemLoot("Tiny Bee Crown", 0.05),
      getItemLoot("Golden Fairy Wing", 0.01)
    ],
    collectionBonus: { atk: 15, def: 5, hp: 200 }
  },
];
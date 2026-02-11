import { itemMaster } from '../itemData';
import { EQUIPMENTS } from '../equipments';

const getItemLoot = (itemId, chance) => {
  const baseItem = itemMaster[itemId] || EQUIPMENTS.find(e => e.id === itemId);
  if (!baseItem) return { name: itemId, chance, type: "MATERIAL", image: "❓" };
  return { ...baseItem, itemId, chance, type: (baseItem.slot || baseItem.type === "EQUIPMENT") ? "EQUIPMENT" : "MATERIAL" };
};

export const map1Monsters = [
  // ==========================================
  // 🌍 EARTH (ดิน - เน้น DEF/HP)
  // ==========================================
  { 
    id: 'bug', name: "Tiny Beetle", level: 1, type: "INSECT", element: "EARTH", rarity: "Common", hp: 100, atk: 5, def: 5,
    lootTable: [
      { name: "Bug Carapace Skill", skillId: "Bug Carapace", type: "SKILL", chance: 0.08 }, 
      { name: "Stone Wall Assist", skillId: "stone_wall", type: "SKILL", chance: 0.05 }, 
      getItemLoot("wooden_sword", 0.05), getItemLoot("Transparent Wing", 0.5),
      getItemLoot("Insect Antenna", 0.4), getItemLoot("Old Insect Shell", 0.3),
      getItemLoot("Broken Insect Leg", 0.2), getItemLoot("Roadside Pebble", 0.1)
    ],
    collectionBonus: { def: 3, hp: 10, defPercent: 0.01 }
  },
  { 
    id: 'rock_turtle', name: "Mossy Rock Turtle", level: 6, type: "BEAST", element: "EARTH", rarity: "Common", hp: 250, atk: 12, def: 20,
    lootTable: [
      { name: "Shell Retreat Skill", skillId: "Shell Retreat", type: "SKILL", chance: 0.05 }, 
      { name: "Gravity Slap Drive", skillId: "gravity_slap", type: "SKILL", chance: 0.04 }, 
      getItemLoot("mossy_plate", 0.02), getItemLoot("Small Mossy Stone", 0.5),
      getItemLoot("Turtle Shell Scrap", 0.4), getItemLoot("River Mud", 0.3),
      getItemLoot("Hardened Clay", 0.2), getItemLoot("Smooth Pebble", 0.1)
    ],
    collectionBonus: { def: 8, hp: 50, defPercent: 0.02 }
  },
  { 
    id: 'flower_sprite', name: "Playful Flower Sprite", level: 10, type: "PLANT", element: "EARTH", rarity: "Uncommon", hp: 350, atk: 25, def: 15,
    lootTable: [
      { name: "Floral Beam Skill", skillId: "Floral Beam", type: "SKILL", chance: 0.05 }, 
      { name: "Holy Rework Assist", skillId: "holy_rework", type: "SKILL", chance: 0.04 }, 
      getItemLoot("clover_pendant", 0.05), getItemLoot("Multicolored Petals", 0.5),
      getItemLoot("Floral Nectar", 0.4), getItemLoot("Wild Flower Pollen", 0.3),
      getItemLoot("Butterfly Wing Dust", 0.2), getItemLoot("Silver Sparkle Leaf", 0.1)
    ],
    collectionBonus: { atk: 5, luck: 2, atkPercent: 0.02 }
  },
  { 
    id: 'root_strider', name: "Meadow Root Strider", level: 11, type: "PLANT", element: "EARTH", rarity: "Uncommon", hp: 400, atk: 22, def: 25,
    lootTable: [
      { name: "Root Entangle Skill", skillId: "Root Entangle", type: "SKILL", chance: 0.05 }, 
      { name: "Nature Spore Shroud Skill", skillId: "Spore Burst", type: "SKILL", chance: 0.04 }, 
      getItemLoot("beast_hide_belt", 0.05), getItemLoot("Gnarled Root", 0.5),
      getItemLoot("Sticky Sap", 0.4), getItemLoot("Forest Bark", 0.3),
      getItemLoot("Green Bud", 0.25), getItemLoot("Tangled Vines", 0.1)
    ],
    collectionBonus: { hp: 120, hpPercent: 0.02, def: 5 }
  },
  { 
    id: 'earth_golem_tiny', name: "Pebble Golem", level: 12, type: "CONSTRUCT", element: "EARTH", rarity: "Uncommon", hp: 600, atk: 20, def: 40,
    lootTable: [
      { name: "Rock Smash Skill", skillId: "Rock Smash", type: "SKILL", chance: 0.05 }, 
      { name: "Titan Frame Assist", skillId: "titan_frame", type: "SKILL", chance: 0.04 }, 
      getItemLoot("iron_core_pendant", 0.03), getItemLoot("Stone Fragment", 0.5),
      getItemLoot("Hard Clay", 0.4), getItemLoot("Earth Core", 0.3),
      getItemLoot("Smooth Pebble", 0.2), getItemLoot("Ancient Fossil", 0.05)
    ],
    collectionBonus: { def: 15, hp: 100, defPercent: 0.03 }
  },
  { 
    id: 'forest_guardian_bug', name: "🛡️ Saber-Fang Guardian", level: 22, type: "INSECT", element: "EARTH", rarity: "Epic", isMiniBoss: true, hp: 1200, atk: 80, def: 110,
    lootTable: [
      { name: "Solid Guard Skill", skillId: "Solid Guard", type: "SKILL", chance: 0.05 }, 
      { name: "Terra God Form Assist", skillId: "terra_god_form", type: "SKILL", chance: 0.02 }, 
      getItemLoot("titanium_belt", 0.05), getItemLoot("Thick Beetle Shell", 0.5),
      getItemLoot("Broken Beetle Horn", 0.4), getItemLoot("Azure Guardian Horn", 0.3),
      getItemLoot("Iron Beetle Heart", 0.1), getItemLoot("Gilded Insect Molt", 0.01)
    ],
    collectionBonus: { def: 25, defPercent: 0.08, hp: 200 }
  },
  { 
    id: 'elder_treant', name: "👑 Yggdrasil's Outcast", level: 40, type: "PLANT", element: "EARTH", rarity: "Legendary", isBoss: true, hp: 4500, atk: 250, def: 280,
    lootTable: [
      { name: "Photosynthesis Skill", skillId: "Photosynthesis", type: "SKILL", chance: 0.03 }, 
      { name: "World Ender Chip Drive", skillId: "world_ender_chip", type: "SKILL", chance: 0.01 }, 
      getItemLoot("god_seed_pendant", 0.05), getItemLoot("Ancient Wooden Plate", 0.5),
      getItemLoot("Eternal Sap", 0.4), getItemLoot("World Tree Seed", 0.3),
      getItemLoot("Life Essence", 0.2), getItemLoot("nature_emblem", 0.02)
    ],
    collectionBonus: { hp: 500, hpPercent: 0.10, defPercent: 0.10 }
  },
  { 
    id: 'world_eater_worm', name: "👑 Jormungandr's Echo", level: 100, type: "BEAST", element: "EARTH", rarity: "Legendary", isBoss: true, hp: 55000, atk: 1200, def: 950,
    lootTable: [
      { name: "Endless Hunger Skill", skillId: "Endless Hunger", type: "SKILL", chance: 0.01 }, 
      { name: "Terra God Form Assist", skillId: "terra_god_form", type: "SKILL", chance: 0.005 }, 
      getItemLoot("genesis_claymore", 0.02), getItemLoot("world_spine_belt", 0.05),
      getItemLoot("Genesis Stone", 0.5), getItemLoot("World Spine", 0.3),
      getItemLoot("Colossal Tooth", 0.2), getItemLoot("Terra Heart", 0.1)
    ],
    collectionBonus: { hp: 5000, atkPercent: 0.20, defPercent: 0.20 }
  },

  // ==========================================
  // 🌬️ WIND (ลม - เน้น ATK/LUCK)
  // ==========================================
  { 
    id: 'meadow_fly', name: "Meadow Drone", level: 3, type: "INSECT", element: "WIND", rarity: "Common", hp: 120, atk: 12, def: 5,
    lootTable: [
      { name: "Buzzing Skill", skillId: "Buzzing", type: "SKILL", chance: 0.05 }, 
      { name: "Wind Blade Drive", skillId: "wind_blade", type: "SKILL", chance: 0.05 }, 
      getItemLoot("fabric_sash", 0.05), getItemLoot("Light Wing", 0.5),
      getItemLoot("Fly Eye", 0.4), getItemLoot("Wind Dust", 0.3),
      getItemLoot("Broken Probe", 0.2), getItemLoot("Tiny Leg", 0.15)
    ],
    collectionBonus: { luck: 5, hp: 15 }
  },
  { 
    id: 'grasshopper', name: "Nimble Grasshopper", level: 4, type: "INSECT", element: "WIND", rarity: "Common", hp: 150, atk: 18, def: 8,
    lootTable: [
      { name: "Grasshopper Jump Skill", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.05 }, 
      { name: "Spark Kick Drive", skillId: "spark_kick", type: "SKILL", chance: 0.04 }, 
      getItemLoot("oak_slingshot", 0.04), getItemLoot("Grasshopper Leg", 0.5),
      getItemLoot("Green Grasshopper Wing", 0.4), getItemLoot("Dry Straw", 0.3),
      getItemLoot("Meadow Twig Scraps", 0.2), getItemLoot("Lucky Insect Ear", 0.1)
    ],
    collectionBonus: { luck: 8, atk: 5, atkPercent: 0.01 }
  },
  { 
    id: 'gale_swift', name: "Gale Swift Sparrow", level: 6, type: "BEAST", element: "WIND", rarity: "Common", hp: 180, atk: 25, def: 10,
    lootTable: [
      { name: "Air Dash Skill", skillId: "Air Dash", type: "SKILL", chance: 0.05 }, 
      { name: "Wind Gust Drive", skillId: "wind_gust", type: "SKILL", chance: 0.05 }, 
      getItemLoot("feather_charm", 0.1), getItemLoot("Downy Feather", 0.5),
      getItemLoot("Sharp Talon", 0.4), getItemLoot("Wind Essence", 0.3),
      getItemLoot("Small Seed", 0.25), getItemLoot("Swift Wing", 0.05)
    ],
    collectionBonus: { luck: 10, atk: 5 }
  },
  { 
    id: 'meadow_glider', name: "Meadow Flying Squirrel", level: 12, type: "BEAST", element: "WIND", rarity: "Uncommon", hp: 450, atk: 45, def: 20,
    lootTable: [
      { name: "Acorn Bomb Skill", skillId: "Acorn Bomb", type: "SKILL", chance: 0.05 }, 
      { name: "Vortex Step Assist", skillId: "vortex_step", type: "SKILL", chance: 0.04 }, 
      getItemLoot("wind_slicer", 0.02), getItemLoot("Fluffy Squirrel Tail", 0.5),
      getItemLoot("Wild Oak Nut", 0.4), getItemLoot("Giant Sunflower Seed", 0.3),
      getItemLoot("Fragrant Bark", 0.2), getItemLoot("Golden Peanut", 0.02)
    ],
    collectionBonus: { luck: 12, atkPercent: 0.02, def: 5 }
  },
  { 
    id: 'cloud_manta', name: "Meadow Cloud Manta", level: 14, type: "AMORPHOUS", element: "WIND", rarity: "Uncommon", hp: 400, atk: 35, def: 30,
    lootTable: [
      { name: "Neural Static Skill", skillId: "Neural Static", type: "SKILL", chance: 0.05 }, 
      { name: "Volt Saber Drive", skillId: "volt_saber", type: "SKILL", chance: 0.03 }, 
      getItemLoot("wind_silk_belt", 0.04), getItemLoot("Vaporized Fluid", 0.5),
      getItemLoot("Static Membrane", 0.4), getItemLoot("Cloud Fragment", 0.35),
      getItemLoot("Floating Spore", 0.25), getItemLoot("White Ribbon", 0.2)
    ],
    collectionBonus: { luck: 15, critRate: 0.01, hp: 50 }
  },
  { 
    id: 'centaur_scout', name: "Plain Runner Centaur", level: 28, type: "BEAST", element: "WIND", rarity: "Epic", hp: 1500, atk: 120, def: 60,
    lootTable: [
      { name: "Spear Thrust Skill", skillId: "Spear Thrust", type: "SKILL", chance: 0.05 }, 
      { name: "Quantum Shift Assist", skillId: "quantum_shift", type: "SKILL", chance: 0.04 }, 
      getItemLoot("warrior_spirit_pendant", 0.05), getItemLoot("Horse Hair", 0.5),
      getItemLoot("Broken Spear", 0.4), getItemLoot("Leather Strap", 0.3),
      getItemLoot("Centaur Emblem", 0.2), getItemLoot("Warrior Spirit", 0.05)
    ],
    collectionBonus: { atk: 30, luck: 20, atkPercent: 0.05 }
  },
  { 
    id: 'meadow_queen_bee', name: "👑 Golden Hive Queen", level: 35, type: "INSECT", element: "WIND", rarity: "Legendary", isBoss: true, hp: 3000, atk: 180, def: 140,
    lootTable: [
      { name: "Aura Skill", skillId: "Aura", type: "SKILL", chance: 0.05 }, 
      { name: "Neural Storm Assist", skillId: "neural_storm", type: "SKILL", chance: 0.03 }, 
      getItemLoot("lucky_ring", 0.05), getItemLoot("Tiny Bee Crown", 0.4),
      getItemLoot("Royal Honey", 0.5), getItemLoot("Golden Fairy Wing", 0.3),
      getItemLoot("Soldier Stinger", 0.2), getItemLoot("Giant Slayer Dagger", 0.01)
    ],
    collectionBonus: { atkPercent: 0.10, critDamage: 0.15, hp: 300 }
  },
  { 
    id: 'storm_griffin', name: "👑 Silver-Wing Stormlord", level: 45, type: "BEAST", element: "WIND", rarity: "Legendary", isBoss: true, hp: 4000, atk: 250, def: 180,
    lootTable: [
      { name: "Wind Walk Skill", skillId: "Wind Walk", type: "SKILL", chance: 0.03 }, 
      { name: "Quantum Shift Assist", skillId: "quantum_shift", type: "SKILL", chance: 0.02 }, 
      getItemLoot("storm_caller_bow", 0.02), getItemLoot("eagle_eye", 0.05),
      getItemLoot("Storm Feather", 0.5), getItemLoot("Griffin Beak", 0.4),
      getItemLoot("Silver Mane", 0.3), getItemLoot("Cloud Crystal", 0.2)
    ],
    collectionBonus: { atk: 50, critRate: 0.05, luck: 25 }
  },
  { 
    id: 'cyber_dragon_young', name: "🐉 Prototype Steel-Wing", level: 85, type: "CONSTRUCT", element: "WIND", rarity: "Legendary", hp: 15000, atk: 650, def: 450,
    lootTable: [
      { name: "Reactive Armor Skill", skillId: "Reactive Armor", type: "SKILL", chance: 0.02 }, 
      { name: "World Ender Chip Drive", skillId: "world_ender_chip", type: "SKILL", chance: 0.01 }, 
      getItemLoot("void_orbit", 0.05), getItemLoot("steel_wing_plate", 0.02),
      getItemLoot("Cyber Core", 0.2), getItemLoot("Steel Wing Scrap", 0.5),
      getItemLoot("Jet Turbine", 0.3), getItemLoot("High-End Sensor", 0.4)
    ],
    collectionBonus: { hpPercent: 0.15, defPercent: 0.10, atkPercent: 0.10 }
  },

  // ==========================================
  // 💧 WATER (น้ำ - เน้น HP/REGEN)
  // ==========================================
  { 
    id: 'slime', name: "Meadow Slime", level: 7, type: "AMORPHOUS", element: "WATER", rarity: "Uncommon", hp: 400, atk: 15, def: 20,
    lootTable: [
      { name: "Slime Recovery Skill", skillId: "Slime Recovery", type: "SKILL", chance: 0.06 }, 
      { name: "Aqua Shield Assist", skillId: "aqua_shield", type: "SKILL", chance: 0.04 }, 
      getItemLoot("blue_crystal", 0.05), getItemLoot("Slime Mucus", 0.5),
      getItemLoot("Water Bubble", 0.4), getItemLoot("Tiny Ice Shard", 0.3),
      getItemLoot("Concentrated Slime", 0.2), getItemLoot("Clear Slime Core", 0.1)
    ],
    collectionBonus: { hp: 150, hpPercent: 0.03, def: 2 }
  },
  { 
    id: 'dew_crab', name: "Dew Drop Crab", level: 7, type: "INSECT", element: "WATER", rarity: "Common", hp: 350, atk: 12, def: 35,
    lootTable: [
      { name: "Bubble Shield Skill", skillId: "Bubble Shield", type: "SKILL", chance: 0.05 }, 
      { name: "Tsunami Drive Drive", skillId: "tsunami_drive", type: "SKILL", chance: 0.03 }, 
      getItemLoot("river_mud_belt", 0.03), getItemLoot("Wet Shell", 0.5),
      getItemLoot("Water Droplet", 0.4), getItemLoot("Crab Leg Meat", 0.3),
      getItemLoot("Freshwater Pearl", 0.2), getItemLoot("Ocean Shard", 0.05)
    ],
    collectionBonus: { def: 12, hp: 60, defPercent: 0.02 }
  },
  { 
    id: 'ice_spirit', name: "Frost Essence", level: 15, type: "AMORPHOUS", element: "WATER", rarity: "Uncommon", hp: 600, atk: 35, def: 25,
    lootTable: [
      { name: "Absolute Zero Drive", skillId: "absolute_zero", type: "SKILL", chance: 0.04 }, 
      getItemLoot("blue_crystal", 0.1), getItemLoot("Frozen Fluid", 0.5),
      getItemLoot("Ice Crystal", 0.4), getItemLoot("Cold Mist", 0.3),
      getItemLoot("Snowflake", 0.2), getItemLoot("Blue Core", 0.1)
    ],
    collectionBonus: { atk: 8, hp: 100, hpPercent: 0.02 }
  },
  { 
    id: 'tsunami_eel', name: "Tsunami Eel", level: 30, type: "BEAST", element: "WATER", rarity: "Rare", hp: 1200, atk: 120, def: 80,
    lootTable: [
      { name: "Aqua Remedy Assist", skillId: "aqua_remedy", type: "SKILL", chance: 0.05 }, 
      getItemLoot("water_pearl", 0.1), getItemLoot("Eel Skin", 0.5),
      getItemLoot("Electrified Fin", 0.4), getItemLoot("Water Essence", 0.3),
      getItemLoot("Slippery Scale", 0.2), getItemLoot("Deep Sea Tooth", 0.1)
    ],
    collectionBonus: { hp: 200, hpPercent: 0.05, atk: 10 }
  },
  { 
    id: 'hydra_spawn', name: "👑 Abyssal Hydra Spawn", level: 50, type: "BEAST", element: "WATER", rarity: "Legendary", isBoss: true, hp: 5000, atk: 280, def: 220,
    lootTable: [
      { name: "Toxic Blood Skill", skillId: "Toxic Blood", type: "SKILL", chance: 0.03 }, 
      { name: "Absolute Zero Drive", skillId: "absolute_zero", type: "SKILL", chance: 0.02 }, 
      getItemLoot("hydra_armor", 0.05), getItemLoot("serpent_fang_dagger", 0.02),
      getItemLoot("Hydra Scale", 0.5), getItemLoot("Venomous Heart", 0.4),
      getItemLoot("Deep Sea Pearl", 0.3), getItemLoot("Regenerative Flesh", 0.2)
    ],
    collectionBonus: { hp: 1000, hpPercent: 0.12, defPercent: 0.05 }
  },

  // ==========================================
  // 🔥 FIRE (ไฟ - เน้น ATK/CRIT)
  // ==========================================
  { 
    id: 'fire_slime', name: "Heat Slime", level: 8, type: "AMORPHOUS", element: "FIRE", rarity: "Uncommon", hp: 380, atk: 35, def: 12,
    lootTable: [
      { name: "Sizzle Skill", skillId: "Sizzle", type: "SKILL", chance: 0.05 }, 
      { name: "Ember Strike Drive", skillId: "ember_strike", type: "SKILL", chance: 0.04 }, 
      getItemLoot("fire_amber", 0.05), getItemLoot("Warm Jelly", 0.5),
      getItemLoot("Ash Powder", 0.4), getItemLoot("Embers", 0.3),
      getItemLoot("Red Slime Core", 0.2), getItemLoot("Burnt Twig", 0.15)
    ],
    collectionBonus: { atk: 10, hp: 40, atkPercent: 0.01 }
  },
  { 
    id: 'magma_slug', name: "Magma Slug", level: 12, type: "AMORPHOUS", element: "FIRE", rarity: "Uncommon", hp: 650, atk: 45, def: 50,
    lootTable: [
      { name: "Blaze Resonance Drive", skillId: "blaze_resonance", type: "SKILL", chance: 0.04 }, 
      getItemLoot("fire_amber", 0.1), getItemLoot("Hot Slug Skin", 0.5),
      getItemLoot("Magma Residue", 0.4), getItemLoot("Burning Trail", 0.3),
      getItemLoot("Lava Stone", 0.2), getItemLoot("Heat Core", 0.1)
    ],
    collectionBonus: { atk: 15, def: 5, atkPercent: 0.02 }
  },
  { 
    id: 'ember_fox', name: "Ember Tail Fox", level: 15, type: "BEAST", element: "FIRE", rarity: "Uncommon", hp: 700, atk: 65, def: 35,
    lootTable: [
      { name: "Flame Dash Skill", skillId: "Flame Dash", type: "SKILL", chance: 0.05 }, 
      { name: "Fire Blast Drive", skillId: "fire_blast", type: "SKILL", chance: 0.04 }, 
      getItemLoot("beast_hide_belt", 0.1), getItemLoot("Singed Fur", 0.5),
      getItemLoot("Warm Fox Tail", 0.4), getItemLoot("Ash Dust", 0.3),
      getItemLoot("Fire Essence", 0.25), getItemLoot("Red Fang", 0.1)
    ],
    collectionBonus: { atk: 20, atkPercent: 0.03, luck: 5 }
  },
  { 
    id: 'blaze_hound', name: "Blaze Hound", level: 25, type: "BEAST", element: "FIRE", rarity: "Rare", hp: 1500, atk: 160, def: 70,
    lootTable: [
      { name: "Fire Blast Drive", skillId: "fire_blast", type: "SKILL", chance: 0.05 }, 
      getItemLoot("magma_breaker", 0.02), getItemLoot("Singed Hide", 0.5),
      getItemLoot("Burning Fang", 0.4), getItemLoot("Fire Essence", 0.3),
      getItemLoot("Ash Powder", 0.2), getItemLoot("Lava Fragment", 0.1)
    ],
    collectionBonus: { atkPercent: 0.06, critDamage: 0.05, hp: 100 }
  },
  { 
    id: 'phoenix_chick', name: "🔥 Solar Ember Fledgling", level: 60, type: "BEAST", element: "FIRE", rarity: "Epic", hp: 4500, atk: 380, def: 180,
    lootTable: [
      { name: "Rebirth Ember Skill", skillId: "Rebirth Ember", type: "SKILL", chance: 0.04 }, 
      { name: "Ignis Extinction Drive", skillId: "ignis_extinction", type: "SKILL", chance: 0.02 }, 
      getItemLoot("magma_plate", 0.03), getItemLoot("phoenix_ember", 0.05),
      getItemLoot("phoenix_feather", 0.5), getItemLoot("Solar Core", 0.4),
      getItemLoot("Eternal Flame", 0.3), getItemLoot("Burnt Wing", 0.2)
    ],
    collectionBonus: { atkPercent: 0.10, critDamage: 0.12, atk: 50 }
  },

  // ==========================================
  // ✨ LIGHT (แสง - เน้น LUCK/REGEN)
  // ==========================================
  { 
    id: 'flower_sprite_light', name: "Neon Pixie", level: 5, type: "PLANT", element: "LIGHT", rarity: "Uncommon", hp: 300, atk: 35, def: 15,
    lootTable: [
      { name: "Plasma Bolt Drive", skillId: "plasma_bolt", type: "SKILL", chance: 0.05 }, 
      getItemLoot("shiny_pebble", 0.1), getItemLoot("Pixie Dust", 0.5),
      getItemLoot("Neon Petal", 0.4), getItemLoot("Light Spark", 0.3),
      getItemLoot("Glowing Wing", 0.2), getItemLoot("Spirit Fiber", 0.1)
    ],
    collectionBonus: { luck: 10, hp: 30, atk: 2 }
  },
  { 
    id: 'shroom_spirit', name: "Glowing Mushroom", level: 20, type: "PLANT", element: "LIGHT", rarity: "Rare", hp: 1200, atk: 55, def: 85,
    lootTable: [
      { name: "Light Spores Skill", skillId: "Light Spores", type: "SKILL", chance: 0.05 }, 
      { name: "Holy Shield Assist", skillId: "holy_shield", type: "SKILL", chance: 0.04 }, 
      getItemLoot("ghost_shard", 0.05), getItemLoot("Mushroom Cap", 0.5),
      getItemLoot("Glow Dust", 0.4), getItemLoot("Mycelium", 0.3),
      getItemLoot("Light Essence", 0.2), getItemLoot("Magic Fiber", 0.15)
    ],
    collectionBonus: { hp: 200, defPercent: 0.05, luck: 15 }
  },
  { 
    id: 'holy_sentinel', name: "Holy Sentinel", level: 40, type: "CONSTRUCT", element: "LIGHT", rarity: "Epic", hp: 3500, atk: 180, def: 250,
    lootTable: [
      { name: "Holy Rework Assist", skillId: "holy_rework", type: "SKILL", chance: 0.05 }, 
      getItemLoot("god_seed_pendant", 0.01), getItemLoot("Blessed Plate", 0.5), 
      getItemLoot("Light Core", 0.4), getItemLoot("Silver Gear", 0.3), 
      getItemLoot("Pure Essence", 0.2), getItemLoot("Golden Circuit", 0.1), 
      getItemLoot("Halo Fragment", 0.1)
    ],
    collectionBonus: { defPercent: 0.10, hp: 400, def: 20 }
  },

  // ==========================================
  // 🌑 DARK (มืด - เน้น PEN/CRITD)
  // ==========================================
  { 
    id: 'meadow_snake', name: "Green Viper", level: 10, type: "BEAST", element: "DARK", rarity: "Uncommon", hp: 500, atk: 65, def: 30,
    lootTable: [
      { name: "Venom Bite Skill", skillId: "Venom Bite", type: "SKILL", chance: 0.05 }, 
      { name: "Shadow Bite Skill", skillId: "shadow_bite", type: "SKILL", chance: 0.05 }, 
      getItemLoot("snake_skin_belt", 0.05), getItemLoot("Snake Scale", 0.5),
      getItemLoot("Poison Sac", 0.4), getItemLoot("Shed Skin", 0.3),
      getItemLoot("Viper Fang", 0.2), getItemLoot("Green Fluid", 0.15)
    ],
    collectionBonus: { atk: 15, luck: 5, atkPercent: 0.02 }
  },
  { 
    id: 'shadow_bat', name: "Cave Scout Bat", level: 18, type: "BEAST", element: "DARK", rarity: "Rare", hp: 900, atk: 85, def: 40,
    lootTable: [
      { name: "Sonic Wave Skill", skillId: "Sonic Wave", type: "SKILL", chance: 0.05 }, 
      { name: "Abyssal Chain Drive", skillId: "abyssal_chain", type: "SKILL", chance: 0.03 }, 
      getItemLoot("silver_chain_belt", 0.05), getItemLoot("Bat Wing", 0.5),
      getItemLoot("Echo Gland", 0.4), getItemLoot("Dark Leather", 0.3),
      getItemLoot("Bat Ear", 0.2), getItemLoot("Night Dust", 0.15)
    ],
    collectionBonus: { luck: 12, atk: 10, critRate: 0.02 }
  },
  { 
    id: 'nightmare_shade', name: "Nightmare Shade", level: 35, type: "AMORPHOUS", element: "DARK", rarity: "Rare", hp: 1800, atk: 220, def: 60,
    lootTable: [
      { name: "Abyssal Chain Drive", skillId: "abyssal_chain", type: "SKILL", chance: 0.05 }, 
      getItemLoot("void_shroud", 0.02), getItemLoot("Terror Mist", 0.5),
      getItemLoot("Dark Shard", 0.4), getItemLoot("Shadow Residue", 0.3),
      getItemLoot("Ebon Essence", 0.2), getItemLoot("Fear Gland", 0.1),
      getItemLoot("Night Dust", 0.1)
    ],
    collectionBonus: { atkPercent: 0.08, critDamage: 0.05, hp: 150 }
  },
  { 
    id: 'void_stalker', name: "🌑 Neural Void Reaper", level: 75, type: "AMORPHOUS", element: "DARK", rarity: "Legendary", hp: 12000, atk: 850, def: 550,
    lootTable: [
      { name: "Void Veil Skill", skillId: "Void Veil", type: "SKILL", chance: 0.02 }, 
      { name: "Void Execution Drive", skillId: "void_execution", type: "SKILL", chance: 0.02 }, 
      getItemLoot("void_reaver_blade", 0.01), getItemLoot("abyssal_eye_pendant", 0.02),
      getItemLoot("void_orbit", 0.05), getItemLoot("Dark Matter", 0.3),
      getItemLoot("Shadow Essence", 0.4), getItemLoot("Neural Glitch", 0.5)
    ],
    collectionBonus: { atkPercent: 0.15, critDamage: 0.15, pen: 0.10 }
  },

  // ==========================================
  // 🔩 STEEL (เหล็ก - เน้น DEF/REFLECT)
  // ==========================================
  { 
    id: 'iron_wasp', name: "Heavy Metal Wasp", level: 12, type: "INSECT", element: "STEEL", rarity: "Uncommon", hp: 650, atk: 55, def: 75,
    lootTable: [
      { name: "Iron Fist Drive", skillId: "iron_fist", type: "SKILL", chance: 0.05 }, 
      { name: "Nano Shield Assist", skillId: "nano_shield", type: "SKILL", chance: 0.04 }, 
      getItemLoot("iron_shield_armor", 0.05), getItemLoot("Steel Wing", 0.5),
      getItemLoot("Iron Barb", 0.4), getItemLoot("Oil Leak", 0.3),
      getItemLoot("Hardened Gear", 0.2), getItemLoot("Wasp Plate", 0.15)
    ],
    collectionBonus: { def: 20, defPercent: 0.03, hp: 50 }
  },
  { 
    id: 'cyber_drone', name: "Cyber Drone", level: 20, type: "CONSTRUCT", element: "STEEL", rarity: "Uncommon", hp: 1200, atk: 85, def: 110,
    lootTable: [
      { name: "Nano Shield Assist", skillId: "nano_shield", type: "SKILL", chance: 0.05 }, 
      getItemLoot("omega_chip", 0.01), getItemLoot("Scrap Metal", 0.5),
      getItemLoot("Microchip", 0.4), getItemLoot("Small Battery", 0.3),
      getItemLoot("Circuit Board", 0.2), getItemLoot("Wired Cable", 0.1)
    ],
    collectionBonus: { defPercent: 0.08, def: 15, hp: 100 }
  },
  { 
    id: 'shield_titan', name: "Shield Titan", level: 45, type: "CONSTRUCT", element: "STEEL", rarity: "Epic", hp: 6000, atk: 150, def: 600,
    lootTable: [
      { name: "Solid Guard Skill", skillId: "Solid Guard", type: "SKILL", chance: 0.05 }, 
      getItemLoot("titanium_belt", 0.1), getItemLoot("Titanium Plate", 0.5),
      getItemLoot("Heavy Frame", 0.4), getItemLoot("Steel Beam", 0.3),
      getItemLoot("Pressure Valve", 0.2), getItemLoot("Iron Core", 0.1),
      getItemLoot("Hardened Gear", 0.1)
    ],
    collectionBonus: { defPercent: 0.15, hp: 500, def: 50 }
  },
  { 
    id: 'ancient_golem', name: "🏛️ Relic Guardian Golem", level: 55, type: "CONSTRUCT", element: "STEEL", rarity: "Epic", hp: 8000, atk: 450, def: 850,
    lootTable: [
      { name: "Ancient Plating Skill", skillId: "Ancient Plating", type: "SKILL", chance: 0.05 }, 
      { name: "Iron Vanguard Drive", skillId: "iron_vanguard", type: "SKILL", chance: 0.03 }, 
      getItemLoot("dragon_scale_belt", 0.05), getItemLoot("Relic Fragment", 0.5),
      getItemLoot("Guardian Core", 0.25), getItemLoot("ancient_circuit", 0.3),
      getItemLoot("Broken Pillar", 0.2), getItemLoot("Gilded Stone", 0.4)
    ],
    collectionBonus: { defPercent: 0.20, reflect: 0.05, hp: 800 }
  },

  // ==========================================
  // 🧪 POISON (พิษ - เน้น DOT/REDUCE DEF)
  // ==========================================
  { 
    id: 'plague_rat', name: "Plague Rat", level: 5, type: "BEAST", element: "POISON", rarity: "Common", hp: 350, atk: 45, def: 15,
    lootTable: [
      { name: "Toxic Cloud Assist", skillId: "toxic_cloud", type: "SKILL", chance: 0.05 }, 
      getItemLoot("rusty_dagger", 0.05), getItemLoot("Dirty Fur", 0.5),
      getItemLoot("Infected Tooth", 0.4), getItemLoot("Rat Tail", 0.3),
      getItemLoot("Small Bone", 0.2), getItemLoot("Sewage Residue", 0.1),
      getItemLoot("Cheese Scrap", 0.05)
    ],
    collectionBonus: { atk: 12, luck: 5, hp: 30 }
  },
  { 
    id: 'mossy_crawler', name: "Lazy Moss Worm", level: 16, type: "INSECT", element: "POISON", rarity: "Rare", hp: 1500, atk: 95, def: 55,
    lootTable: [
      { name: "Spore Burst Skill", skillId: "Spore Burst", type: "SKILL", chance: 0.05 }, 
      { name: "Venom Sting Drive", skillId: "venom_sting", type: "SKILL", chance: 0.05 }, 
      getItemLoot("poison_ivy_blade", 0.05), getItemLoot("toxic_vial", 0.05),
      getItemLoot("Green Silk Thread", 0.5), getItemLoot("Dried Moss Dust", 0.4),
      getItemLoot("Bramble Thorn", 0.3), getItemLoot("Insect Fang", 0.2)
    ],
    collectionBonus: { atkPercent: 0.05, def: 10, hp: 150 }
  },
  { 
    id: 'venom_weaver', name: "Venom Weaver", level: 25, type: "INSECT", element: "POISON", rarity: "Rare", hp: 2200, atk: 180, def: 80,
    lootTable: [
      { name: "Venom Bite Skill", skillId: "Venom Bite", type: "SKILL", chance: 0.05 }, 
      getItemLoot("toxic_vial", 0.1), getItemLoot("Toxic Silk", 0.5),
      getItemLoot("Poison Gland", 0.4), getItemLoot("Sticky Thread", 0.3),
      getItemLoot("Spider Leg", 0.2), getItemLoot("Venom Sac", 0.1),
      getItemLoot("Tangled Silk Ball", 0.1)
    ],
    collectionBonus: { atkPercent: 0.08, critRate: 0.03, luck: 10 }
  }
];
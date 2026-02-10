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
  // ================= Tier 1: Starter (Level 1-3) =================
  {
    id: 'bug',
    name: "Tiny Beetle",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 45, atk: 12, def: 5, 
    image: "/monsters/red_bug.png",
    skills: [
      { name: "Bite", chance: 0.3, condition: "Active", element: "NORMAL", description: "Snaps with tiny mandibles, dealing 110% Physical Damage." },
      { name: "Bug Carapace", chance: 1.0, condition: "Passive", element: "EARTH", description: "Reduces incoming damage by 3 units." }
    ],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 0.05 },
      getItemLoot("wooden_sword", 0.04),
      getItemLoot("Transparent Wing", 0.5),
      getItemLoot("Insect Antenna", 0.4),
      getItemLoot("Old Insect Shell", 0.3),
      getItemLoot("Broken Insect Leg", 0.2),
      getItemLoot("Wing-Clinging Dirt", 0.15),
      getItemLoot("Roadside Pebble", 0.1)
    ],
    elementPowerBonus: { earth: 2 }, 
    collectionBonus: { def: 3, hp: 10, defPercent: 0.01 }
  },

  {
    id: 'capterpillar',
    name: "Sleepy Larva",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 65, atk: 15, def: 8, 
    image: "/monsters/little_worm.png",
    skills: [
      { name: "Web Shot", chance: 0.25, condition: "Active", element: "POISON", description: "Sprays silk dealing 80% damage and slowing the target." },
      { name: "Caterpillar Silk", chance: 1.0, condition: "Passive", element: "WIND", description: "Reduces incoming damage by 5%." }
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.05 },
      getItemLoot("grass_crown", 0.04),
      getItemLoot("Bitten Leaf", 0.5),
      getItemLoot("Soft Larva Armor", 0.4),
      getItemLoot("Tangled Silk Ball", 0.3),
      getItemLoot("Mulberry Leaf Scraps", 0.2),
      getItemLoot("Sticky Saliva", 0.15),
      getItemLoot("Green Herb", 0.1)
    ],
    elementPowerBonus: { earth: 3 },
    collectionBonus: { hp: 30, hpPercent: 0.02 }
  },

  // --- New Monster 1 ---
  {
    id: 'meadow_fly',
    name: "Meadow Drone",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Common",
    hp: 55, atk: 18, def: 3,
    image: "/monsters/fly.png",
    skills: [
      { name: "Buzzing", chance: 0.2, condition: "Active", element: "WIND", description: "Distracts target, reducing their next attack accuracy." }
    ],
    lootTable: [
      { name: "Buzzing Skill", rarity: "Uncommon", skillId: "Buzzing", type: "SKILL", chance: 0.05 },
      getItemLoot("Light Wing", 0.5),
      getItemLoot("Fly Eye", 0.4),
      getItemLoot("Wind Dust", 0.3),
      getItemLoot("Broken Probe", 0.2),
      getItemLoot("Tiny Leg", 0.15),
      getItemLoot("Seed Pod", 0.1),
      getItemLoot("Shiny Speck", 0.05)
    ],
    elementPowerBonus: { wind: 2 },
    collectionBonus: { luck: 2, hp: 15 }
  },

  // ================= Tier 2: Field Dwellers (Level 4-7) =================
  {
    id: 'grasshopper',
    name: "Nimble Grasshopper",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Common",
    hp: 85, atk: 24, def: 6, 
    image: "/monsters/grashopper.png",
    skills: [
      { name: "Grasshopper Jump", chance: 0.2, condition: "Active", element: "WIND", description: "A powerful kick dealing 140% Physical Damage." }
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.05 },
      getItemLoot("oak_slingshot", 0.04),
      getItemLoot("Grasshopper Leg", 0.5),
      getItemLoot("Green Grasshopper Wing", 0.4),
      getItemLoot("Dry Straw", 0.3),
      getItemLoot("Meadow Twig Scraps", 0.2),
      getItemLoot("Lucky Insect Ear", 0.1),
      getItemLoot("Scrap Twig", 0.08)
    ],
    elementPowerBonus: { wind: 5 },
    collectionBonus: { luck: 3, atk: 2, atkPercent: 0.01 }
  },

  // --- New Monster 2 ---
  {
    id: 'field_mouse',
    name: "Grain Thief Mouse",
    type: "BEAST",
    element: "NEUTRAL",
    area: 'meadow',
    rarity: "Common",
    hp: 95, atk: 22, def: 10,
    image: "/monsters/mouse.png",
    skills: [
      { name: "Gnaw", chance: 0.3, condition: "Active", element: "NORMAL", description: "Sharp teeth deal 120% damage." }
    ],
    lootTable: [
      { name: "Gnaw Skill", rarity: "Uncommon", skillId: "Gnaw", type: "SKILL", chance: 0.05 },
      getItemLoot("Small Fur", 0.5),
      getItemLoot("Grain Sack", 0.4),
      getItemLoot("Mouse Tail", 0.3),
      getItemLoot("Sharp Tooth", 0.2),
      getItemLoot("Cracked Nut", 0.15),
      getItemLoot("Straw Pile", 0.1),
      getItemLoot("Cheese Scrap", 0.05)
    ],
    elementPowerBonus: { neutral: 4 },
    collectionBonus: { atk: 3, luck: 2 }
  },

  {
    id: 'slime',
    name: "Meadow Slime",
    type: "AMORPHOUS",
    element: "WATER",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 140, atk: 28, def: 15, 
    image: "/monsters/slime.png",
    skills: [
      { name: "Jump Attack", chance: 0.3, condition: "Active", element: "NORMAL", description: "Leaps onto target dealing 130% Physical Damage." },
      { name: "Slime Recovery", chance: 1.0, condition: "Passive", element: "NORMAL", description: "Regenerative body reduces damage taken by 10%." }
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.05 },
      getItemLoot("iron_shield", 0.04),
      getItemLoot("Slime Mucus", 0.5),
      getItemLoot("Water Bubble", 0.4),
      getItemLoot("Tiny Ice Shard", 0.3),
      getItemLoot("Concentrated Slime", 0.2),
      getItemLoot("Clear Slime Core", 0.1),
      getItemLoot("Azure Gemstone", 0.05)
    ],
    elementPowerBonus: { water: 8 },
    collectionBonus: { hp: 100, def: 2, hpPercent: 0.03 }
  },

  // --- New Monster 3: Elemental Slime ---
  {
    id: 'fire_slime',
    name: "Heat Slime",
    type: "AMORPHOUS",
    element: "FIRE",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 130, atk: 35, def: 12,
    image: "/monsters/fire_slime.png",
    skills: [
      { name: "Sizzle", chance: 0.25, condition: "Active", element: "FIRE", description: "Burns the target for 110% damage." }
    ],
    lootTable: [
      { name: "Sizzle Skill", rarity: "Uncommon", skillId: "Sizzle", type: "SKILL", chance: 0.05 },
      getItemLoot("Warm Jelly", 0.5),
      getItemLoot("Ash Powder", 0.4),
      getItemLoot("Embers", 0.3),
      getItemLoot("Red Slime Core", 0.2),
      getItemLoot("Burnt Twig", 0.15),
      getItemLoot("Heat Stone", 0.1),
      getItemLoot("Lava Fragment", 0.02)
    ],
    elementPowerBonus: { fire: 10 },
    collectionBonus: { atk: 6, hp: 50 }
  },

  // ================= Tier 3: Meadow Guards (Level 8-12) =================
  {
    id: 'plump_rabbit',
    name: "Brawny Fluff-Rabbit",
    type: "BEAST",
    element: "NEUTRAL",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 250, atk: 42, def: 20, 
    image: "/monsters/plump_rabbit.png",
    skills: [
      { name: "Power Kick", chance: 0.25, condition: "Active", element: "NORMAL", description: "Delivers a heavy back-kick dealing 150% damage." }
    ],
    lootTable: [
      { name: "Power Kick Skill", rarity: "Uncommon", skillId: "Power Kick", type: "SKILL", chance: 0.05 },
      getItemLoot("rabbit_vest", 0.04),
      getItemLoot("Soft Rabbit Fur", 0.5),
      getItemLoot("Long Rabbit Ear", 0.4),
      getItemLoot("Wild Carrot", 0.3),
      getItemLoot("Lucky Rabbit Foot", 0.2),
      getItemLoot("Natural Whetstone", 0.15),
      getItemLoot("Giant Rabbit Tooth", 0.03)
    ],
    elementPowerBonus: { light: 2, earth: 2 },
    collectionBonus: { hp: 150, defPercent: 0.03 }
  },

  // --- New Monster 4 ---
  {
    id: 'meadow_snake',
    name: "Green Viper",
    type: "BEAST",
    element: "POISON",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 180, atk: 55, def: 14,
    image: "/monsters/snake.png",
    skills: [
      { name: "Venom Bite", chance: 0.3, condition: "Active", element: "POISON", description: "Deals 120% damage and applies poison." }
    ],
    lootTable: [
      { name: "Venom Bite Skill", rarity: "Uncommon", skillId: "Venom Bite", type: "SKILL", chance: 0.05 },
      getItemLoot("Snake Scale", 0.5),
      getItemLoot("Poison Sac", 0.4),
      getItemLoot("Shed Skin", 0.3),
      getItemLoot("Viper Fang", 0.2),
      getItemLoot("Green Fluid", 0.15),
      getItemLoot("Small Bone", 0.1),
      getItemLoot("Toxic Gland", 0.05)
    ],
    elementPowerBonus: { poison: 15 },
    collectionBonus: { atk: 10, luck: 5 }
  },

  {
    id: 'flower_sprite',
    name: "Playful Flower Sprite",
    type: "PLANT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 220, atk: 58, def: 18, 
    image: "/monsters/flower_sprite.png",
    skills: [
      { name: "Floral Beam", chance: 0.3, condition: "Active", element: "LIGHT", description: "Fires a concentrated beam dealing 140% Light Damage." }
    ],
    lootTable: [
      { name: "Floral Beam Skill", rarity: "Uncommon", skillId: "Floral Beam", type: "SKILL", chance: 0.05 },
      getItemLoot("grass_crown", 0.05),
      getItemLoot("Multicolored Petals", 0.5),
      getItemLoot("Floral Nectar", 0.4),
      getItemLoot("Wild Flower Pollen", 0.3),
      getItemLoot("Butterfly Wing Dust", 0.2),
      getItemLoot("Silver Sparkle Leaf", 0.1),
      getItemLoot("Spirit Perfume", 0.02)
    ],
    elementPowerBonus: { earth: 10, light: 5 },
    collectionBonus: { atk: 5, luck: 2, atkPercent: 0.02 }
  },

  // --- New Monster 5 ---
  {
    id: 'earth_golem_tiny',
    name: "Pebble Golem",
    type: "CONSTRUCT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 350, atk: 45, def: 40,
    image: "/monsters/stone_golem.png",
    skills: [
      { name: "Rock Smash", chance: 0.2, condition: "Active", element: "EARTH", description: "Crushes the target for 150% damage." }
    ],
    lootTable: [
      { name: "Rock Smash Skill", rarity: "Uncommon", skillId: "Rock Smash", type: "SKILL", chance: 0.05 },
      getItemLoot("Stone Fragment", 0.5),
      getItemLoot("Hard Clay", 0.4),
      getItemLoot("Earth Core", 0.3),
      getItemLoot("Smooth Pebble", 0.2),
      getItemLoot("Muddy Lump", 0.15),
      getItemLoot("Iron Ore Scrap", 0.1),
      getItemLoot("Ancient Fossil", 0.05)
    ],
    elementPowerBonus: { earth: 20 },
    collectionBonus: { def: 15, hp: 100 }
  },

  {
    id: 'meadow_glider',
    name: "Meadow Flying Squirrel",
    type: "BEAST",
    element: "WIND",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 240, atk: 62, def: 22, 
    image: "/monsters/meadow_glider.png",
    skills: [
      { name: "Acorn Bomb", chance: 0.3, condition: "Active", element: "WIND", description: "Throws an explosive acorn dealing 135% damage." }
    ],
    lootTable: [
      { name: "Acorn Bomb Skill", rarity: "Uncommon", skillId: "Acorn Bomb", type: "SKILL", chance: 0.05 },
      getItemLoot("wind_walker_boots", 0.05),
      getItemLoot("Fluffy Squirrel Tail", 0.5),
      getItemLoot("Wild Oak Nut", 0.4),
      getItemLoot("Giant Sunflower Seed", 0.3),
      getItemLoot("Fragrant Bark", 0.2),
      getItemLoot("Emerald Feather", 0.15),
      getItemLoot("Golden Peanut", 0.02)
    ],
    elementPowerBonus: { wind: 12 },
    collectionBonus: { def: 3, luck: 4, atkPercent: 0.02 }
  },

  // --- New Monster 6 ---
  {
    id: 'honey_wasp',
    name: "Sharp-Sting Wasp",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 190, atk: 75, def: 15,
    image: "/monsters/wasp.png",
    skills: [
      { name: "Stinger Pierce", chance: 0.35, condition: "Active", element: "WIND", description: "Fast thrust deals 160% damage." }
    ],
    lootTable: [
      { name: "Stinger Pierce Skill", rarity: "Uncommon", skillId: "Stinger Pierce", type: "SKILL", chance: 0.05 },
      getItemLoot("Wasp Wing", 0.5),
      getItemLoot("Yellow Barb", 0.4),
      getItemLoot("Wasp Venom", 0.3),
      getItemLoot("Torn Mesh", 0.2),
      getItemLoot("Dried Honey", 0.15),
      getItemLoot("Insect Leg", 0.1),
      getItemLoot("Sharp Needle", 0.05)
    ],
    elementPowerBonus: { wind: 15 },
    collectionBonus: { atk: 12, critRate: 0.02 }
  },

  // --- New Monster 7 ---
  {
    id: 'blue_bird',
    name: "Sky Swift",
    type: "BEAST",
    element: "WIND",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 210, atk: 68, def: 18,
    image: "/monsters/bird.png",
    skills: [
      { name: "Peck", chance: 0.3, condition: "Active", element: "NORMAL", description: "Quick beak attack deals 130% damage." }
    ],
    lootTable: [
      { name: "Peck Skill", rarity: "Uncommon", skillId: "Peck", type: "SKILL", chance: 0.05 },
      getItemLoot("Blue Feather", 0.5),
      getItemLoot("Bird Beak", 0.4),
      getItemLoot("Small Eggshell", 0.3),
      getItemLoot("Nest Material", 0.2),
      getItemLoot("Wind Essence", 0.15),
      getItemLoot("Sky Seed", 0.1),
      getItemLoot("Cloud Fragment", 0.05)
    ],
    elementPowerBonus: { wind: 10 },
    collectionBonus: { luck: 5, atk: 5 }
  },

  // ================= Tier 4: Rare Encounters (Level 13-17) =================
  {
    id: 'mossy_crawler',
    name: "Lazy Moss Worm",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Rare",
    hp: 480, atk: 85, def: 35, 
    image: "/monsters/mossy_crawler.png",
    skills: [
      { name: "Spore Burst", chance: 0.3, condition: "Active", element: "POISON", description: "Explodes poison spores dealing 150% damage." }
    ],
    lootTable: [
      { name: "Spore Burst Skill", rarity: "Rare", skillId: "Spore Burst", type: "SKILL", chance: 0.05 },
      getItemLoot("hunters_dagger", 0.05),
      getItemLoot("Green Silk Thread", 0.5),
      getItemLoot("Dried Moss Dust", 0.4),
      getItemLoot("Bramble Thorn", 0.3),
      getItemLoot("Insect Fang", 0.2),
      getItemLoot("Verdant Heart", 0.1),
      getItemLoot("Flora Crystal", 0.01)
    ],
    elementPowerBonus: { earth: 15, poison: 10 },
    collectionBonus: { hp: 50, def: 5, defPercent: 0.05 }
  },

  // --- New Monster 8 ---
  {
    id: 'forest_wolf',
    name: "Stray Timber Wolf",
    type: "BEAST",
    element: "NEUTRAL",
    area: 'meadow',
    rarity: "Rare",
    hp: 550, atk: 110, def: 25,
    image: "/monsters/wolf.png",
    skills: [
      { name: "Howl", chance: 0.2, condition: "Active", element: "NORMAL", description: "Increases attack power for 3 turns." }
    ],
    lootTable: [
      { name: "Howl Skill", rarity: "Rare", skillId: "Howl", type: "SKILL", chance: 0.05 },
      getItemLoot("Wolf Pelt", 0.5),
      getItemLoot("Sharp Claw", 0.4),
      getItemLoot("Wolf Fang", 0.3),
      getItemLoot("Old Bone", 0.2),
      getItemLoot("Beast Meat", 0.15),
      getItemLoot("Alpha Essence", 0.05),
      getItemLoot("Silver Mane", 0.01)
    ],
    elementPowerBonus: { neutral: 20 },
    collectionBonus: { atk: 15, atkPercent: 0.03 }
  },

  // --- New Monster 9 ---
  {
    id: 'shadow_bat',
    name: "Cave Scout Bat",
    type: "BEAST",
    element: "WIND",
    area: 'meadow',
    rarity: "Rare",
    hp: 380, atk: 95, def: 20,
    image: "/monsters/bat.png",
    skills: [
      { name: "Sonic Wave", chance: 0.3, condition: "Active", element: "WIND", description: "Deals 140% damage and may stun." }
    ],
    lootTable: [
      { name: "Sonic Wave Skill", rarity: "Rare", skillId: "Sonic Wave", type: "SKILL", chance: 0.05 },
      getItemLoot("Bat Wing", 0.5),
      getItemLoot("Echo Gland", 0.4),
      getItemLoot("Dark Leather", 0.3),
      getItemLoot("Bat Ear", 0.2),
      getItemLoot("Night Dust", 0.15),
      getItemLoot("Shadow Shard", 0.05),
      getItemLoot("Vampire Tooth", 0.01)
    ],
    elementPowerBonus: { wind: 15, dark: 5 },
    collectionBonus: { luck: 8, atk: 5 }
  },

  // --- New Monster 10 ---
  {
    id: 'shroom_spirit',
    name: "Glowing Mushroom",
    type: "PLANT",
    element: "LIGHT",
    area: 'meadow',
    rarity: "Rare",
    hp: 420, atk: 78, def: 45,
    image: "/monsters/mushroom.png",
    skills: [
      { name: "Light Spores", chance: 0.25, condition: "Active", element: "LIGHT", description: "Heals target or blinds enemy." }
    ],
    lootTable: [
      { name: "Light Spores Skill", rarity: "Rare", skillId: "Light Spores", type: "SKILL", chance: 0.05 },
      getItemLoot("Mushroom Cap", 0.5),
      getItemLoot("Glow Dust", 0.4),
      getItemLoot("Mycelium", 0.3),
      getItemLoot("Light Essence", 0.2),
      getItemLoot("Magic Fiber", 0.15),
      getItemLoot("Spore Sack", 0.05),
      getItemLoot("Rainbow Shroom", 0.01)
    ],
    elementPowerBonus: { light: 20 },
    collectionBonus: { hp: 200, defPercent: 0.05 }
  },

  // ================= Tier 5: Elite & Mini-Boss (Level 18-25) =================
  {
    id: 'forest_guardian_bug',
    name: "🛡️ Saber-Fang Guardian",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Epic",
    isMiniBoss: true,
    hp: 1200, atk: 165, def: 85, 
    image: "/monsters/forest_guardian_bug.png",
    skills: [
      { name: "Horn Toss", chance: 0.3, condition: "Active", element: "EARTH", description: "Tosses target into the air, dealing 170% Physical Damage." },
      { name: "Solid Guard", chance: 1.0, condition: "Passive", element: "EARTH", description: "Reduces Physical Damage taken by 15%." }
    ],
    lootTable: [
      { name: "Solid Guard Skill", rarity: "Epic", skillId: "Solid Guard", type: "SKILL", chance: 0.05 },
      getItemLoot("hunters_dagger", 0.06),
      getItemLoot("Thick Beetle Shell", 0.5),
      getItemLoot("Broken Beetle Horn", 0.4),
      getItemLoot("Azure Guardian Horn", 0.3),
      getItemLoot("Iron Beetle Heart", 0.2),
      getItemLoot("Compound Insect Eye", 0.15),
      getItemLoot("Gilded Insect Molt", 0.01)
    ],
    elementPowerBonus: { earth: 30 },
    collectionBonus: { def: 10, hp: 100, atk: 5, defPercent: 0.08 }
  },

  // --- New Monster 11 ---
  {
    id: 'ent_young',
    name: "Walking Sapling",
    type: "PLANT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Epic",
    hp: 950, atk: 140, def: 70,
    image: "/monsters/ent.png",
    skills: [
      { name: "Root Bind", chance: 0.2, condition: "Active", element: "EARTH", description: "Stuns target for 1 turn." }
    ],
    lootTable: [
      { name: "Root Bind Skill", rarity: "Epic", skillId: "Root Bind", type: "SKILL", chance: 0.05 },
      getItemLoot("Living Root", 0.5),
      getItemLoot("Hard Bark", 0.4),
      getItemLoot("Nature Seed", 0.3),
      getItemLoot("Ent Leaf", 0.2),
      getItemLoot("Wooden Core", 0.15),
      getItemLoot("Forest Heart", 0.05),
      getItemLoot("Ancient Sap", 0.01)
    ],
    elementPowerBonus: { earth: 40 },
    collectionBonus: { hp: 300, def: 20 }
  },

  // --- New Monster 12 ---
  {
    id: 'centaur_scout',
    name: "Plain Runner Centaur",
    type: "BEAST",
    element: "WIND",
    area: 'meadow',
    rarity: "Epic",
    hp: 1100, atk: 185, def: 55,
    image: "/monsters/centaur.png",
    skills: [
      { name: "Spear Thrust", chance: 0.3, condition: "Active", element: "NORMAL", description: "Pierces through armor for 160% damage." }
    ],
    lootTable: [
      { name: "Spear Thrust Skill", rarity: "Epic", skillId: "Spear Thrust", type: "SKILL", chance: 0.05 },
      getItemLoot("Horse Hair", 0.5),
      getItemLoot("Broken Spear", 0.4),
      getItemLoot("Leather Strap", 0.3),
      getItemLoot("Centaur Emblem", 0.2),
      getItemLoot("Plain Grass", 0.15),
      getItemLoot("Warrior Spirit", 0.05),
      getItemLoot("Golden Hoof", 0.01)
    ],
    elementPowerBonus: { wind: 35, light: 10 },
    collectionBonus: { atk: 25, luck: 10 }
  },

  // ================= Tier 6: World Boss (Level 30+) =================
  {
    id: 'meadow_queen_bee',
    name: "👑 Golden Hive Queen",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Legendary",
    
    isBoss: true,
    hp: 1500, atk: 120, def: 60, 
    image: "/monsters/Queen_bee.png",
    skills: [
      { name: "Royal Stinger", chance: 0.3, condition: "Active", element: "POISON", description: "Lightning Strike dealing 180% of ATK as damage." },
      { name: "Honey Shield", chance: 1.0, condition: "Passive", element: "LIGHT", description: "Reduces all damage taken by 12%." }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.05 }, 
      getItemLoot("lucky_ring", 0.04),
      getItemLoot("Royal Honey", 0.5),
      getItemLoot("Tiny Bee Crown", 0.4),
      getItemLoot("Golden Fairy Wing", 0.3),
      getItemLoot("Soldier Bee Stinger", 0.25),
      getItemLoot("Golden Goblin Coin", 0.2),
      getItemLoot("Giant Slayer Dagger", 0.01)
    ],
    elementPowerBonus: { wind: 80, light: 40 },
    collectionBonus: { atk: 15, def: 5, hp: 200, atkPercent: 0.10, critDamage: 0.15 }
  }
];
// src/data/collectionTitles.js

/**
 * COLLECTION_TITLES: Titles based on Collection Score
 * Calculation: Each unique item/monster in inventory/bestiary contributes to the score.
 */
export const COLLECTION_TITLES = [
  // --- GOD TIER (1000+) ---
  { 
    minScore: 5000, 
    name: "OMNIPOTENT ARCHIVIST", 
    color: "from-white via-cyan-200 to-blue-400",
    desc: "One who has recorded every heartbeat of the world."
  },
  { 
    minScore: 2500, 
    name: "ANCIENT OVERLORD", 
    color: "from-red-600 via-orange-500 to-yellow-400",
    desc: "A collector whose hoard rivals the gods of old."
  },
  { 
    minScore: 1500, 
    name: "WORLD DOMINATOR", 
    color: "from-amber-400 via-yellow-200 to-white",
    desc: "The entire ecosystem is within your grasp."
  },

  // --- ELITE TIER (500 - 1000) ---
  { 
    minScore: 1000, 
    name: "MYTHICAL HUNTER", 
    color: "from-orange-400 to-red-600",
    desc: "Even the rarest creatures tremble at your name."
  },
  { 
    minScore: 750,  
    name: "GRAND CONQUEROR", 
    color: "from-pink-500 to-rose-600",
    desc: "A veteran of a thousand successful expeditions."
  },
  { 
    minScore: 500,  
    name: "LEGENDARY SCOUT", 
    color: "from-purple-500 via-pink-500 to-red-500",
    desc: "You find what others consider impossible."
  },

  // --- PROFESSIONAL TIER (100 - 350) ---
  { 
    minScore: 350,  
    name: "MASTER OF ARTIFACTS", 
    color: "from-indigo-500 to-purple-600",
    desc: "Your knowledge of items is unmatched."
  },
  { 
    minScore: 200,  
    name: "ELITE HARVESTER", 
    color: "from-blue-500 to-indigo-600",
    desc: "Efficiency is your second nature."
  },
  { 
    minScore: 100,  
    name: "SENIOR COLLECTOR", 
    color: "from-emerald-400 to-cyan-600",
    desc: "A respected figure among the explorer guilds."
  },

  // --- BEGINNER TIER (0 - 75) ---
  { 
    minScore: 75,   
    name: "ADEPT EXPLORER", 
    color: "from-green-400 to-emerald-600",
    desc: "Starting to understand the true value of rare finds."
  },
  { 
    minScore: 30,   
    name: "NOVICE TRAILBLAZER", 
    color: "from-slate-300 to-slate-500",
    desc: "Taking the first meaningful steps into the wild."
  },
  { 
    minScore: 10,   
    name: "WANDERING SOUL", 
    color: "from-slate-400 to-slate-600",
    desc: "Gathering bits and pieces of the world."
  },
  { 
    minScore: 0,    
    name: "THE AWAKENED", 
    color: "from-slate-600 to-slate-800",
    desc: "A new journey begins with an empty bag."
  }
];

/**
 * Example of how to use this in your CharacterView/Bestiary:
 * const currentTitle = COLLECTION_TITLES.find(t => score >= t.minScore) || COLLECTION_TITLES[COLLECTION_TITLES.length - 1];
 */
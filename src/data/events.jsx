import React from 'react'; 
// ✅ Icons for new UI
import { 
  Footprints,
  Sparkles, Compass, Map, 
  Coins, Beer, Flower2, Tent, 
  Telescope, Mountain, Droplets, Ghost, Flame, Sword
} from 'lucide-react';

export const travelEvents = {
  // 🌿 1. SERENE MEADOW
  meadow: [
    { 
      title: "Natural Spring", 
      description: "You found a crystal-clear spring amidst the meadow. A cool drink leaves you feeling greatly refreshed.", 
      reward: 0, 
      Icon: (props) => <Droplets {...props} className="text-cyan-400" /> 
    },
    { 
      title: "Mysterious Tracks", 
      description: "Large footprints mark the soil, likely from a powerful creature... You decide to slip away quietly.", 
      reward: 0,
      Icon: (props) => <Footprints {...props} className="text-amber-700" /> 
    },
    { 
      title: "Resting Spot", 
      description: "You find a campfire that's still warm. It seems someone has only recently departed.", 
      reward: 0,
      Icon: (props) => <Flame {...props} className="text-orange-500" /> 
    },
    { 
      title: "Dancing Wildflowers", 
      description: "The flowers around you sway in rhythm with your footsteps. The atmosphere is truly peaceful.", 
      reward: 0,
      Icon: (props) => <Flower2 {...props} className="text-pink-400" /> 
    }
  ],

  // ⛰️ 2. EMERALD VALLEY
  emerald_valley: [
    { 
      title: "Scenic Outlook", 
      description: "From this vantage point, you can see the towering peaks waiting for you to reach them.", 
      reward: 0,
      Icon: (props) => <Telescope {...props} className="text-indigo-400" /> 
    },
    { 
      title: "Silent Valley", 
      description: "The surroundings are so quiet you can hear your own heartbeat echoing in the stillness.", 
      reward: 0,
      Icon: (props) => <Mountain {...props} className="text-zinc-500" /> 
    },
    { 
      title: "💰 Discarded Pouch", 
      description: "You found a small coin pouch hidden in a rocky crevice. Gained 20 Gold.", 
      reward: 20,
      Icon: (props) => <Coins {...props} className="text-amber-400" /> 
    }
  ],

  // 🌲 3. WHISPERING WOODS
  whispering_woods: [
    { 
      title: "Strange Footprints", 
      description: "Strange tracks appear on the dense forest floor... Something has just passed by.", 
      reward: 0,
      Icon: (props) => <Footprints {...props} className="text-amber-600" />
    },
    { 
      title: "✨ Magical Particles", 
      description: "The mana in this forest is so dense it leaves you feeling strangely invigorated.", 
      reward: 0,
      Icon: (props) => <Sparkles {...props} className="text-yellow-400" /> 
    },
    { 
      title: "🧭 Erratic Compass", 
      description: "Your compass needle spins violently. The energy in these woods is highly unstable.", 
      reward: 0,
      Icon: (props) => <Compass {...props} className="text-blue-500" /> 
    }
  ],

  // 🏹 4. GOBLIN OUTPOST
  goblin_outpost: [
    { 
      title: "Campfire Remains", 
      description: "You find a fire that was recently extinguished. The Goblins are not far from here.", 
      reward: 0,
      Icon: (props) => <Tent {...props} className="text-red-400" /> 
    },
    { 
      title: "📜 Patrol Map", 
      description: "You find a scrap of a Goblin patrol map, but it's too torn to decipher.", 
      reward: 0,
      Icon: (props) => <Map {...props} className="text-stone-500" /> 
    },
    { 
      title: "Captive Merchant", 
      description: "You find a traveling merchant in hiding. He shares some water with you before fleeing.", 
      reward: 0,
      Icon: (props) => <Beer {...props} className="text-orange-500" /> 
    }
  ],

  // 🏰 5. DARK FORTRESS
  dark_fortress: [
    { 
      title: "Scent of Death", 
      description: "Restless spirits dwell within these walls... You feel a sudden, icy chill.", 
      reward: 0,
      Icon: (props) => <Ghost {...props} className="text-purple-400" /> 
    },
    { 
      title: "Ancient Armory", 
      description: "You find piles of broken weapons. The atmosphere here is suffocatingly heavy.", 
      reward: 0,
      Icon: (props) => <Sword {...props} className="text-slate-400" /> 
    },
    { 
      title: "Eternal Flame", 
      description: "Purple braziers burn fiercely along the corridors, never seeming to fade.", 
      reward: 0,
      Icon: (props) => <Flame {...props} className="text-red-500" /> 
    }
  ]
};
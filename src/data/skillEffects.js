export const activeEffects = {
  // --- Map 1: Serene Meadow ---
  "Bite": (atk) => Math.floor(atk * 1.1),               // [Normal]
  "Web Shot": (atk) => Math.floor(atk * 0.8),           // [Poison]
  "Jump Attack": (atk) => Math.floor(atk * 1.3),        // [Water] **เปลี่ยนเป็น Water ตามที่คุยกันนะจ๊ะ
  "Grasshopper Jump": (atk) => Math.floor(atk * 1.4),   // [Wind]
  "Double Strike": (atk) => atk * 2,                    // [Normal]
  "Royal Stinger": (atk) => Math.floor(atk * 1.8),      // [Poison]
  "Acorn Bomb": (atk) => Math.floor(atk * 1.35),        // [Earth]
  "Spore Burst": (atk) => Math.floor(atk * 1.5),        // [Poison]
  "Scale Powder": (atk) => Math.floor(atk * 0.9),       // [Wind]
  "Power Kick": (atk) => Math.floor(atk * 1.5),         // [Normal]
  "Floral Beam": (atk) => Math.floor(atk * 1.4),        // [Light]
  "Horn Toss": (atk) => Math.floor(atk * 1.7),          // [Earth]

  // --- Map 2: Emerald Valley ---
  "Wolf Hunter": (atk) => Math.floor(atk * 1.6),        // [Dark]
  "Frost Bite": (atk) => Math.floor(atk * 1.8),         // [Water/Ice]
  "King Crush": (atk) => Math.floor(atk * 1.7),         // [Earth]
  "Golden Touch": (atk) => atk * 3,                     // [Light]
  "Emerald Blessing": (atk) => atk + 20,                // [Water]
  "Vine Whip": (atk) => Math.floor(atk * 1.45),         // [Poison] ฟาดแส้เถาวัลย์
  "Tail Slam": (atk) => Math.floor(atk * 1.6),          // [Earth] ฟาดหางหนักหน่วง
  "Sonic Chirp": (atk) => Math.floor(atk * 1.2),        // [Wind] คลื่นเสียงรบกวน
  "Boulder Toss": (atk) => Math.floor(atk * 2.1),       // [Earth] ทุ่มหินยักษ์
  "Leaf Blade": (atk) => Math.floor(atk * 1.55),       // [Earth/Wind] คมมีดใบไม้
  "Giga Drain": (atk) => Math.floor(atk * 1.3),        // [Water/Poison] ดูดพลังชีวิต

  // --- Map 3: Crystal Forge / Volcano (NEW!) ---
  "Flame Wheel": (atk) => Math.floor(atk * 1.9),        // [Fire] กงล้อเพลิง
  "Lava Spout": (atk) => Math.floor(atk * 2.2),         // [Fire] เสาลาวาระเบิด
  "Crystal Spike": (atk) => Math.floor(atk * 1.85),     // [Light] หนามคริสตัล
  "Shadow Claw": (atk) => Math.floor(atk * 2.0),        // [Dark] กรงเล็บเงา
  "Magma Smash": (atk) => Math.floor(atk * 2.5),        // [Fire] ทุบด้วยค้อนลาวา
  "Obsidian Blade": (atk) => Math.floor(atk * 2.3),     // [Dark] ดาบหินภูเขาไฟคมกริบ
  "Steam Burst": (atk) => Math.floor(atk * 1.7),        // [Water/Fire] ระเบิดไอน้ำร้อนจัด
  "Lightning Strike": (atk) => Math.floor(atk * 2.8),   // [Wind/Lightning] ฟ้าผ่ารุนแรง
  "Hellbound": (atk) => Math.floor(atk * 3.0),          // [Dark/Fire] พลังจากอเวจี
};
 
export const passiveEffects = {
  // --- Map 1: Serene Meadow ---
  "Slime Recovery": (dmg) => Math.floor(dmg * 0.90),    // [Normal]
  "Bug Carapace": (dmg) => Math.max(1, dmg - 3),        // [Earth]
  "Caterpillar Silk": (dmg) => Math.floor(dmg * 0.95),  // [Wind]
  "Honey Shield": (dmg) => Math.floor(dmg * 0.88),      // [Light]
  "Solid Guard": (dmg) => Math.max(1, Math.floor(dmg * 0.85) - 5), // [Earth]

  // --- Map 2: Emerald Valley ---
  "Rock Skin": (dmg) => Math.floor(dmg * 0.80),         // [Earth]
  "Diamond Armor": (dmg) => Math.max(1, Math.floor(dmg * 0.60)), // [Earth]
  "Royal Aura": (dmg) => Math.floor(dmg * 0.85),        // [Light]
  "Regeneration": (dmg) => Math.floor(dmg * 0.92),      // [Water]
  "Thorn Wall": (dmg) => Math.floor(dmg * 0.90),        // [Poison] บังหนามลดดาเมจ
  "Wind Veil": (dmg) => Math.floor(dmg * 0.80),         // [Wind] ม่านลมเบี่ยงเบนการโจมตี
  "Moss Cushion": (dmg) => Math.max(1, dmg - 15),       // [Water] มอสสะสมน้ำช่วยรับแรงกระแทก

  // --- Map 3: Crystal Forge / Volcano (NEW!) ---
  "Magma Plate": (dmg) => Math.floor(dmg * 0.75),       // [Fire] เกราะลาวาแข็งตัวลดดาเมจ 25%
  "Crystal Refraction": (dmg) => Math.floor(dmg * 0.70), // [Light] หักเหแสงลดดาเมจ 30%
  "Obsidian Skin": (dmg) => Math.max(1, dmg - 25),      // [Dark] ผิวหินภูเขาไฟหักดาเมจดิบ 25 หน่วย
  "Steam Shield": (dmg) => Math.floor(dmg * 0.82),      // [Water/Fire] โล่ไอน้ำลดดาเมจ 18%
  "Iron Will": (dmg) => Math.floor(dmg * 0.80),         // [Normal] จิตใจเหล็กกล้า
};


export const specialEffects = {
  // --- Map 1 Specials ---
  "Bee Swarm": (atk) => atk * 2.5,                      // [Poison]
  "Final Sting": (atk) => atk * 3,                      // [Poison]
  "Nature's Wrath": (atk) => atk * 2.2,                 // [Earth]

  // --- Map 2 Specials ---
  "Final Split": (def) => def * 2,                      // [Water] สไลม์แยกตัวเพิ่มป้องกัน
  "Berserk": (atk) => atk * 3,                          // [Normal] บ้าคลั่ง
  "Last Stand": (stats) => ({ ...stats, def: stats.def + 50 }), // [Normal]
  "Emerald Metamorphosis": (atk) => atk * 2.8,          // [Water/Earth] กลายร่างมรกต
  "Gaia Smash": (atk) => atk * 3.5,                     // [Earth] ทุบธรณีแยก

  // --- Map 3 Specials (NEW!) ---
  "Supernova": (atk) => atk * 4.5,                      // [Fire] ระเบิดตัวเอง (ดาเมจมหาศาล)
  "Dragon Breath": (atk) => atk * 3.8,                  // [Fire] ลมหายใจมังกรภูเขาไฟ
  "Crystal Rain": (atk) => atk * 3.0,                   // [Light] ฝนคริสตัลโจมตีต่อเนื่อง
  "Absolute Zero": (atk) => atk * 3.5,                  // [Water/Ice] เยือกแข็งสมบูรณ์แบบ
  "Hellfire Blast": (atk) => atk * 5.0,                 // [Fire/Dark] เพลิงนรกพิพากษา (ท่าตายตัวละคร!)
  "Eruption": (atk) => atk * 3.2,                       // [Fire] ภูเขาไฟระเบิด
};
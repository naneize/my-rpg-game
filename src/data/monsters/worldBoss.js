// ✅ src/data/monsters/worldBoss.js
import { BOSS_SKILLS } from '../bossSkills';

export const WORLD_BOSS_DATA = {
    id: 'black_dragon_king',
    name: "BLACK DRAGON KING",
    atk: 150,
    def: 45,
    level: 20,
    isBoss: true,
    isFixedStats: true,
    rarity: 'Mythical',
    image: "/monsters/black_dragon.png",
    type: 'WORLD_BOSS',
    bossSkills: [
        BOSS_SKILLS.DRAGON_BREATH, 
        BOSS_SKILLS.ANCIENT_ROAR, 
        BOSS_SKILLS.DARK_METEOR, 
        BOSS_SKILLS.OBSIDIAN_SCALE, 
        BOSS_SKILLS.VOID_EXECUTION
    ], 
    lootTable: [
        { id: "scrap", chance: 1.0, minAmount: 5, maxAmount: 15 },
        { id: "shard", chance: 0.7, minAmount: 2, maxAmount: 8 },
        { id: "dust", chance: 0.4, minAmount: 1, maxAmount: 5 },
        { id: "dragon_soul", chance: 0.05, minAmount: 1, maxAmount: 1 },
        { id: "obsidian_scale", chance: 0.2, minAmount: 1, maxAmount: 2 }
    ]
};
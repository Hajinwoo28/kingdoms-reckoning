// ═══════════════════════════════════════════════════════════
//  Kingdom's Reckoning — Full Game Engine
// ═══════════════════════════════════════════════════════════

const GRID_W = 10, GRID_H = 7, PATH_ROW = 3;

// ── TOWER DEFINITIONS ───────────────────────────────────────
const TOWER_DEFS = {
  archer: {
    id: 'archer', name: 'Archer Tower', icon: '🏹', cssClass: 'tw-archer',
    cost: 30, baseDmg: 8, range: 2, type: 'single',
    desc: 'Fast, single-target ranged attack',
    upgrades: [
      { cost: 40, dmgBonus: 6, desc: '⬆ +6 Damage' },
      { cost: 70, dmgBonus: 10, rangeBonus: 1, desc: '⬆ +10 Dmg, +1 Range' }
    ],
    sellVal: [15, 35, 70]
  },
  mage: {
    id: 'mage', name: 'Mage Tower', icon: '🔮', cssClass: 'tw-mage',
    cost: 60, baseDmg: 15, range: 2, type: 'splash', splashRange: 1,
    desc: 'Area splash damage around target',
    upgrades: [
      { cost: 80, dmgBonus: 12, desc: '⬆ +12 Damage' },
      { cost: 130, dmgBonus: 18, splashBonus: 1, desc: '⬆ +18 Dmg, wider splash' }
    ],
    sellVal: [25, 65, 140]
  },
  cannon: {
    id: 'cannon', name: 'Cannon Tower', icon: '💣', cssClass: 'tw-cannon',
    cost: 90, baseDmg: 30, range: 1, type: 'heavy',
    desc: 'Massive damage, short range',
    upgrades: [
      { cost: 110, dmgBonus: 22, desc: '⬆ +22 Damage' },
      { cost: 180, dmgBonus: 35, rangeBonus: 1, desc: '⬆ +35 Dmg, +1 Range' }
    ],
    sellVal: [40, 95, 220]
  },
  frost: {
    id: 'frost', name: 'Frost Tower', icon: '❄️', cssClass: 'tw-frost',
    cost: 55, baseDmg: 6, range: 2, type: 'freeze',
    desc: 'Slows enemies on hit (1 turn)',
    upgrades: [
      { cost: 65, dmgBonus: 5, desc: '⬆ +5 Damage' },
      { cost: 110, dmgBonus: 10, rangeBonus: 1, desc: '⬆ +10 Dmg, +1 Range' }
    ],
    sellVal: [22, 52, 120]
  },
  tesla: {
    id: 'tesla', name: 'Tesla Tower', icon: '⚡', cssClass: 'tw-tesla',
    cost: 120, baseDmg: 20, range: 3, type: 'chain', chainCount: 3,
    desc: 'Chains lightning to 3 enemies',
    upgrades: [
      { cost: 150, dmgBonus: 15, chainBonus: 1, desc: '⬆ +15 Dmg, chains +1' },
      { cost: 240, dmgBonus: 25, chainBonus: 1, desc: '⬆ +25 Dmg, chains +1' }
    ],
    sellVal: [50, 125, 300]
  }
};

// ── ENEMY DEFINITIONS ───────────────────────────────────────
const ENEMY_DEFS = {
  goblin: {
    id: 'goblin', name: 'Goblin', icon: '👺', cssClass: 'en-goblin',
    baseHp: 18, speed: 2, reward: 8, damage: 1,
    desc: 'Fast and weak', ability: 'dash', abilityChance: 0.25
  },
  orc: {
    id: 'orc', name: 'Orc Warrior', icon: '👹', cssClass: 'en-orc',
    baseHp: 45, speed: 1, reward: 15, damage: 2,
    desc: 'Balanced threat'
  },
  troll: {
    id: 'troll', name: 'Stone Troll', icon: '🧌', cssClass: 'en-troll',
    baseHp: 100, speed: 1, reward: 30, damage: 3,
    desc: 'Heavy tank — regenerates HP', ability: 'regen', regenAmt: 8
  },
  knight: {
    id: 'knight', name: 'Dark Knight', icon: '⚔️', cssClass: 'en-knight',
    baseHp: 160, speed: 1, reward: 45, damage: 4,
    desc: 'Armored — deflects 30% of hits', ability: 'deflect', deflectChance: 0.30
  },
  dragon: {
    id: 'dragon', name: 'Dragon', icon: '🐉', cssClass: 'en-dragon',
    baseHp: 420, speed: 1, reward: 120, damage: 8,
    desc: 'BOSS — breathes fire on arrival', boss: true, ability: 'breath'
  }
};

// ── BIOME DEFINITIONS (Extreme Mode Island Select) ───────────
const BIOME_DEFS = {
  tundra: {
    id: 'tundra',
    name: 'Crystal Tundra',
    tagline: 'Where ice reigns eternal',
    icon: '❄️',
    art: '🏔️',
    color: '#22D3EE',
    colorDark: '#0E7490',
    colorBg: 'rgba(34,211,238,0.12)',
    gradient: 'linear-gradient(135deg, rgba(14,116,144,.35) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(34,211,238,0.5)',
    difficulty: 3,
    enemies: ['frost_wraith', 'ice_golem', 'snow_troll', 'blizzard_dragon'],
    reward: { type: 'frost_core', icon: '💠', label: 'Frost Core ×3', desc: '+20 damage & slow on all towers for this run', gold: 60, dia: 5 },
    enemyMods: { hpMult: 1.1, spdBonus: 0, dmgMult: 1.2 },
    loreText: 'Frozen spirits and ancient ice titans guard this glacier island.'
  },
  volcano: {
    id: 'volcano',
    name: 'Volcanic Inferno',
    tagline: 'Born of fire and fury',
    icon: '🌋',
    art: '🔥',
    color: '#F97316',
    colorDark: '#C2410C',
    colorBg: 'rgba(249,115,22,0.12)',
    gradient: 'linear-gradient(135deg, rgba(194,65,12,.35) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(249,115,22,0.5)',
    difficulty: 4,
    enemies: ['lava_imp', 'magma_brute', 'fire_knight', 'inferno_dragon'],
    reward: { type: 'ember_shard', icon: '🔥', label: 'Ember Shard ×3', desc: '+35% gold from all kills for this run', gold: 80, dia: 6 },
    enemyMods: { hpMult: 1.3, spdBonus: 0, dmgMult: 1.5 },
    loreText: 'Volcanic demons thrive in the molten core of this scorched island.'
  },
  jungle: {
    id: 'jungle',
    name: 'Tropical Archipelago',
    tagline: 'Life blooms with danger',
    icon: '🌴',
    art: '🏝️',
    color: '#10B981',
    colorDark: '#065F46',
    colorBg: 'rgba(16,185,129,0.12)',
    gradient: 'linear-gradient(135deg, rgba(6,95,70,.35) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(16,185,129,0.5)',
    difficulty: 2,
    enemies: ['vine_sprite', 'jungle_beast', 'poison_troll', 'serpent_dragon'],
    reward: { type: 'nature_gem', icon: '💚', label: 'Nature Gem ×3', desc: '+3 castle HP restored after each wave', gold: 50, dia: 4 },
    enemyMods: { hpMult: 0.9, spdBonus: 1, dmgMult: 1.0 },
    loreText: 'Cunning jungle spirits and venomous beasts lurk in the dense canopy.'
  },
  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    tagline: 'Ancient magic stirs within',
    icon: '🌲',
    art: '🧙',
    color: '#8B5CF6',
    colorDark: '#5B21B6',
    colorBg: 'rgba(139,92,246,0.12)',
    gradient: 'linear-gradient(135deg, rgba(91,33,182,.35) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(139,92,246,0.5)',
    difficulty: 5,
    enemies: ['shadow_sprite', 'arcane_knight', 'phantom_troll', 'void_dragon'],
    reward: { type: 'arcane_rune', icon: '🔮', label: 'Arcane Rune ×3', desc: '+8 diamonds & doubled diamond drops', gold: 100, dia: 8 },
    enemyMods: { hpMult: 1.5, spdBonus: 0, dmgMult: 1.8 },
    loreText: 'Ancient sorcerers and void phantoms haunt this mystical realm.'
  }
};

// Biome-unique enemy definitions (merged into ENEMY_DEFS at runtime)
const BIOME_ENEMY_DEFS = {
  // Tundra
  frost_wraith: { id: 'frost_wraith', name: 'Frost Wraith', icon: '👻', cssClass: 'en-goblin', baseHp: 20, speed: 2, reward: 9, damage: 1, desc: 'Chilling fast spirit', ability: 'dash', abilityChance: 0.3 },
  ice_golem: { id: 'ice_golem', name: 'Ice Golem', icon: '🧊', cssClass: 'en-orc', baseHp: 55, speed: 1, reward: 18, damage: 2, desc: 'Frozen tank' },
  snow_troll: { id: 'snow_troll', name: 'Snow Troll', icon: '🧌', cssClass: 'en-troll', baseHp: 110, speed: 1, reward: 32, damage: 3, desc: 'Regenerates in cold', ability: 'regen', regenAmt: 10 },
  blizzard_dragon: { id: 'blizzard_dragon', name: 'Blizzard Dragon', icon: '🐲', cssClass: 'en-dragon', baseHp: 460, speed: 1, reward: 130, damage: 9, desc: 'BOSS — ice breath', boss: true, ability: 'breath' },
  // Volcano
  lava_imp: { id: 'lava_imp', name: 'Lava Imp', icon: '😈', cssClass: 'en-goblin', baseHp: 22, speed: 2, reward: 10, damage: 1, desc: 'Scorching fast imp', ability: 'dash', abilityChance: 0.3 },
  magma_brute: { id: 'magma_brute', name: 'Magma Brute', icon: '👹', cssClass: 'en-orc', baseHp: 60, speed: 1, reward: 20, damage: 3, desc: 'Absorbs heat — tough' },
  fire_knight: { id: 'fire_knight', name: 'Fire Knight', icon: '⚔️', cssClass: 'en-knight', baseHp: 180, speed: 1, reward: 50, damage: 5, desc: 'Armored in lava-iron', ability: 'deflect', deflectChance: 0.35 },
  inferno_dragon: { id: 'inferno_dragon', name: 'Inferno Dragon', icon: '🔥', cssClass: 'en-dragon', baseHp: 480, speed: 1, reward: 140, damage: 10, desc: 'BOSS — fire storm', boss: true, ability: 'breath' },
  // Jungle
  vine_sprite: { id: 'vine_sprite', name: 'Vine Sprite', icon: '🌿', cssClass: 'en-goblin', baseHp: 16, speed: 3, reward: 8, damage: 1, desc: 'Blindingly fast', ability: 'dash', abilityChance: 0.4 },
  jungle_beast: { id: 'jungle_beast', name: 'Jungle Beast', icon: '🦁', cssClass: 'en-orc', baseHp: 40, speed: 2, reward: 14, damage: 2, desc: 'Fast and fierce' },
  poison_troll: { id: 'poison_troll', name: 'Poison Troll', icon: '🧌', cssClass: 'en-troll', baseHp: 90, speed: 1, reward: 28, damage: 2, desc: 'Venom regen', ability: 'regen', regenAmt: 6 },
  serpent_dragon: { id: 'serpent_dragon', name: 'Serpent Dragon', icon: '🐍', cssClass: 'en-dragon', baseHp: 400, speed: 2, reward: 120, damage: 7, desc: 'BOSS — swift serpent', boss: true, ability: 'breath' },
  // Forest
  shadow_sprite: { id: 'shadow_sprite', name: 'Shadow Sprite', icon: '🌑', cssClass: 'en-goblin', baseHp: 18, speed: 2, reward: 9, damage: 1, desc: 'Phases through attacks', ability: 'dash', abilityChance: 0.35 },
  arcane_knight: { id: 'arcane_knight', name: 'Arcane Knight', icon: '🧙', cssClass: 'en-knight', baseHp: 200, speed: 1, reward: 55, damage: 6, desc: 'Magic deflect', ability: 'deflect', deflectChance: 0.40 },
  phantom_troll: { id: 'phantom_troll', name: 'Phantom Troll', icon: '👾', cssClass: 'en-troll', baseHp: 130, speed: 1, reward: 35, damage: 4, desc: 'Void regen', ability: 'regen', regenAmt: 12 },
  void_dragon: { id: 'void_dragon', name: 'Void Dragon', icon: '🐉', cssClass: 'en-dragon', baseHp: 520, speed: 1, reward: 150, damage: 11, desc: 'BOSS — void annihilator', boss: true, ability: 'breath' }
};
// Merge biome enemies into main ENEMY_DEFS
Object.assign(ENEMY_DEFS, BIOME_ENEMY_DEFS);

// ── STORY STAGES ─────────────────────────────────────────────
// Each stage has exactly 3 waves: Normal → Fierce → BOSS
const STORY_STAGES = [
  {
    id: 1, name: "Goblin's Forest", icon: '🌲', art: '🌿',
    tagline: 'Where the shadows first stir...',
    color: '#4ADE80', colorDark: '#166534', bg: 'rgba(74,222,128,.12)',
    border: 'rgba(74,222,128,.45)', hpScale: 0.75,
    waves: [
      { label: 'Normal', desc: 'Light scouting party', enemies: [{ type: 'goblin', count: 4 }] },
      { label: 'Fierce', desc: 'The raid begins', enemies: [{ type: 'goblin', count: 7 }, { type: 'orc', count: 2 }] },
      { label: 'BOSS 💀', desc: 'Forest Warlord arrives', enemies: [{ type: 'goblin', count: 5 }, { type: 'orc', count: 3 }, { type: 'troll', count: 1 }], boss: true },
    ],
  },
  {
    id: 2, name: 'Troll Bridge', icon: '🌉', art: '🧌',
    tagline: 'None shall pass — unless you stop them.',
    color: '#A78BFA', colorDark: '#5B21B6', bg: 'rgba(167,139,250,.12)',
    border: 'rgba(167,139,250,.45)', hpScale: 0.9,
    waves: [
      { label: 'Normal', desc: 'Bridge patrols advance', enemies: [{ type: 'goblin', count: 5 }, { type: 'orc', count: 3 }] },
      { label: 'Fierce', desc: 'Trolls charge the gate', enemies: [{ type: 'orc', count: 5 }, { type: 'troll', count: 2 }] },
      { label: 'BOSS 💀', desc: 'The Bridge Tyrant rises', enemies: [{ type: 'orc', count: 5 }, { type: 'troll', count: 3 }], boss: true },
    ],
  },
  {
    id: 3, name: 'Dark Vale', icon: '⚔️', art: '🌑',
    tagline: 'The knights of darkness march at dusk.',
    color: '#F87171', colorDark: '#7F1D1D', bg: 'rgba(248,113,113,.12)',
    border: 'rgba(248,113,113,.45)', hpScale: 1.0,
    waves: [
      { label: 'Normal', desc: 'Orc vanguard spills in', enemies: [{ type: 'orc', count: 5 }, { type: 'troll', count: 2 }] },
      { label: 'Fierce', desc: 'Knights join the assault', enemies: [{ type: 'orc', count: 5 }, { type: 'troll', count: 2 }, { type: 'knight', count: 1 }] },
      { label: 'BOSS 💀', desc: 'The Dark Vale Champion', enemies: [{ type: 'troll', count: 3 }, { type: 'knight', count: 2 }], boss: true },
    ],
  },
  {
    id: 4, name: 'Iron Fortress', icon: '🏯', art: '⚔️',
    tagline: 'Armored legions pour from the gates.',
    color: '#60A5FA', colorDark: '#1E3A5F', bg: 'rgba(96,165,250,.12)',
    border: 'rgba(96,165,250,.45)', hpScale: 1.1,
    waves: [
      { label: 'Normal', desc: 'Knight patrols march', enemies: [{ type: 'orc', count: 4 }, { type: 'knight', count: 2 }] },
      { label: 'Fierce', desc: 'Iron ranks advance', enemies: [{ type: 'knight', count: 3 }, { type: 'troll', count: 3 }] },
      { label: 'BOSS 💀', desc: 'The Iron Warlord!', enemies: [{ type: 'knight', count: 4 }, { type: 'troll', count: 2 }, { type: 'orc', count: 4 }], boss: true },
    ],
  },
  {
    id: 5, name: "Dragon's Approach", icon: '🐉', art: '🔥',
    tagline: 'The sky darkens. Wings blot out the sun.',
    color: '#FB923C', colorDark: '#7C2D12', bg: 'rgba(251,146,60,.12)',
    border: 'rgba(251,146,60,.45)', hpScale: 1.2,
    waves: [
      { label: 'Normal', desc: 'Heavy knights close in', enemies: [{ type: 'knight', count: 4 }, { type: 'troll', count: 3 }] },
      { label: 'Fierce', desc: 'Dragons scout ahead', enemies: [{ type: 'knight', count: 5 }, { type: 'troll', count: 2 }, { type: 'dragon', count: 1 }] },
      { label: 'BOSS 💀', desc: 'The Dragon General!', enemies: [{ type: 'dragon', count: 2 }, { type: 'knight', count: 4 }], boss: true },
    ],
  },
  {
    id: 6, name: 'Scorched Plains', icon: '🌋', art: '💥',
    tagline: 'Everything burns. Only the strong remain.',
    color: '#FBBF24', colorDark: '#78350F', bg: 'rgba(251,191,36,.12)',
    border: 'rgba(251,191,36,.45)', hpScale: 1.35,
    waves: [
      { label: 'Normal', desc: 'Scorched horde rushes in', enemies: [{ type: 'orc', count: 6 }, { type: 'knight', count: 3 }, { type: 'troll', count: 2 }] },
      { label: 'Fierce', desc: 'Dragons rain fire', enemies: [{ type: 'dragon', count: 2 }, { type: 'knight', count: 4 }] },
      { label: 'BOSS 💀', desc: 'The Inferno Overlord!', enemies: [{ type: 'dragon', count: 2 }, { type: 'knight', count: 5 }, { type: 'troll', count: 3 }], boss: true },
    ],
  },
  {
    id: 7, name: 'The Siege', icon: '🏰', art: '💀',
    tagline: 'They besiege the last outer wall.',
    color: '#E879F9', colorDark: '#701A75', bg: 'rgba(232,121,249,.12)',
    border: 'rgba(232,121,249,.45)', hpScale: 1.5,
    waves: [
      { label: 'Normal', desc: 'Siege forces mobilise', enemies: [{ type: 'dragon', count: 2 }, { type: 'knight', count: 5 }, { type: 'troll', count: 3 }] },
      { label: 'Fierce', desc: 'The walls are cracking', enemies: [{ type: 'dragon', count: 3 }, { type: 'knight', count: 5 }, { type: 'orc', count: 5 }] },
      { label: 'BOSS 💀', desc: 'The Siege Commander!', enemies: [{ type: 'dragon', count: 3 }, { type: 'knight', count: 6 }, { type: 'troll', count: 4 }, { type: 'orc', count: 4 }], boss: true },
    ],
  },
  {
    id: 8, name: 'The Void Gate', icon: '🌀', art: '🌑',
    tagline: 'A rift tears reality apart. Horrors pour through.',
    color: '#22D3EE', colorDark: '#0E4D5E', bg: 'rgba(34,211,238,.12)',
    border: 'rgba(34,211,238,.45)', hpScale: 1.7,
    waves: [
      { label: 'Normal', desc: 'Void creatures emerge', enemies: [{ type: 'dragon', count: 3 }, { type: 'knight', count: 5 }, { type: 'troll', count: 4 }] },
      { label: 'Fierce', desc: 'The gate opens wider', enemies: [{ type: 'dragon', count: 4 }, { type: 'knight', count: 5 }, { type: 'troll', count: 3 }] },
      { label: 'BOSS 💀', desc: 'The Void Harbinger!', enemies: [{ type: 'dragon', count: 4 }, { type: 'knight', count: 6 }, { type: 'troll', count: 5 }, { type: 'orc', count: 6 }], boss: true },
    ],
  },
  {
    id: 9, name: 'End of Days', icon: '☄️', art: '💀',
    tagline: 'The prophecy is at hand. No kingdom survives this.',
    color: '#F87171', colorDark: '#450A0A', bg: 'rgba(248,113,113,.12)',
    border: 'rgba(248,113,113,.5)', hpScale: 2.0,
    waves: [
      { label: 'Normal', desc: 'Apocalypse vanguard', enemies: [{ type: 'dragon', count: 4 }, { type: 'knight', count: 6 }, { type: 'troll', count: 4 }] },
      { label: 'Fierce', desc: 'The heavens split open', enemies: [{ type: 'dragon', count: 5 }, { type: 'knight', count: 6 }, { type: 'troll', count: 4 }] },
      { label: 'BOSS 💀', desc: 'The World-Ender rises!', enemies: [{ type: 'dragon', count: 6 }, { type: 'knight', count: 7 }, { type: 'troll', count: 5 }, { type: 'orc', count: 8 }], boss: true },
    ],
  },
  {
    id: 10, name: "Kingdom's Reckoning", icon: '👑', art: '⚔️',
    tagline: 'The final reckoning. Only one will stand.',
    color: '#F0C842', colorDark: '#78350F', bg: 'rgba(240,200,66,.14)',
    border: 'rgba(240,200,66,.6)', hpScale: 2.5,
    waves: [
      { label: 'Normal', desc: 'The ultimate horde awakens', enemies: [{ type: 'dragon', count: 5 }, { type: 'knight', count: 7 }, { type: 'troll', count: 5 }] },
      { label: 'Fierce', desc: 'Dragons fill the skies', enemies: [{ type: 'dragon', count: 6 }, { type: 'knight', count: 7 }, { type: 'troll', count: 5 }] },
      { label: 'BOSS 💀', desc: '⚠️ THE FINAL RECKONING ⚠️', enemies: [{ type: 'dragon', count: 8 }, { type: 'knight', count: 8 }, { type: 'troll', count: 6 }, { type: 'orc', count: 8 }], boss: true },
    ],
  },
];


const CASTLE_SKINS = {
  Wooden: { name: 'Wooden Keep', icon: '🏰', cssClass: 'castle-wooden', maxHp: 15, cost: 0, currency: 'free', desc: 'Your starting stronghold.' },
  Stone: { name: 'Stone Fortress', icon: '🗼', cssClass: 'castle-stone', maxHp: 30, cost: 600, currency: 'gold', desc: '+15 castle HP. Reinforced battlements.' },
  Crystal: { name: 'Crystal Sanctum', icon: '💠', cssClass: 'castle-crystal', maxHp: 60, cost: 25, currency: 'dia', desc: '+45 HP. Magical wards protect the gates.' },
  Infernal: { name: 'Infernal Citadel', icon: '🔥', cssClass: 'castle-infernal', maxHp: 100, cost: 55, currency: 'dia', desc: '+85 HP. Hellfire-forged walls.' },
  Celestial: { name: 'Celestial Throne', icon: '✨', cssClass: 'castle-celestial', maxHp: 150, cost: 100, currency: 'dia', desc: '+135 HP. Heaven\'s last bastion.' }
};

// ── TOWER SKINS ──────────────────────────────────────────────
const TOWER_SKINS = {
  Basic: { name: 'Standard Stone', icon: '🗿', cost: 0, currency: 'free', desc: 'Classic construction.', dmgBonus: 0, rangeBonus: 0 },
  Plasma: { name: 'Plasma Core', icon: '🔵', cost: 350, currency: 'gold', desc: '+5 damage to all towers.', dmgBonus: 5, rangeBonus: 0 },
  Shadow: { name: 'Shadow Weave', icon: '🌑', cost: 30, currency: 'dia', desc: '+1 range to all towers.', dmgBonus: 0, rangeBonus: 1 },
  Infernal: { name: 'Infernal Forge', icon: '🔥', cost: 60, currency: 'dia', desc: '+12 damage to all towers.', dmgBonus: 12, rangeBonus: 0 }
};

// ── POWER-UPS ────────────────────────────────────────────────
const POWERUPS = [
  { id: 'repair5', name: 'Emergency Repair', icon: '🛠️', cost: 120, currency: 'gold', desc: 'Restore 5 Castle HP immediately.', effect: 'repairCastle', val: 5 },
  { id: 'gold250', name: 'Royal Tax', icon: '👑', cost: 20, currency: 'dia', desc: 'Instantly gain 250 gold.', effect: 'addGold', val: 250 },
  { id: 'repair10', name: 'Full Restoration', icon: '✨', cost: 35, currency: 'dia', desc: 'Restore 10 Castle HP.', effect: 'repairCastle', val: 10 },
  { id: 'shield', name: 'Arcane Shield', icon: '🛡️', cost: 50, currency: 'dia', desc: '+2 extra castle HP for this wave.', effect: 'tempShield', val: 2 },
];

// ── QUESTS ───────────────────────────────────────────────────
const QUEST_DEFS = [
  { id: 'q_kill5', title: 'First Blood', desc: 'Defeat 5 enemies', type: 'kill', target: 5, rwd: { gold: 40, dia: 1 } },
  { id: 'q_build3', title: 'Architect', desc: 'Build 3 towers', type: 'build', target: 3, rwd: { gold: 80, dia: 2 } },
  { id: 'q_wave5', title: 'Survivor', desc: 'Reach Wave 5', type: 'wave', target: 5, rwd: { gold: 150, dia: 3 } },
  { id: 'q_kill30', title: 'Slayer', desc: 'Defeat 30 enemies', type: 'kill', target: 30, rwd: { gold: 200, dia: 5 } },
  { id: 'q_wave10', title: 'Veteran', desc: 'Reach Wave 10', type: 'wave', target: 10, rwd: { gold: 300, dia: 8 } },
  { id: 'q_dragon', title: 'Dragon Slayer', desc: 'Slay a Dragon', type: 'dragon', target: 1, rwd: { gold: 500, dia: 15 } },
  { id: 'q_build10', title: 'Master Builder', desc: 'Build 10 towers', type: 'build', target: 10, rwd: { gold: 250, dia: 5 } },
  { id: 'q_upgrade5', title: 'Forgemaster', desc: 'Upgrade towers 5 times', type: 'upgrade', target: 5, rwd: { gold: 180, dia: 4 } },
  { id: 'q_tesla', title: 'Storm Caller', desc: 'Build 2 Tesla Towers', type: 'tesla', target: 2, rwd: { gold: 200, dia: 5 } },
  { id: 'q_nodmg', title: 'Iron Fortress', desc: 'Complete a wave with full castle HP', type: 'nodmg', target: 1, rwd: { gold: 200, dia: 6 } },
];

// ── DAILY CHALLENGE POOL ──────────────────────────────────────
const DAILY_POOL = [
  { id: 'd_kill10', title: 'Daily Hunt', desc: 'Kill 10 enemies today', type: 'kill', target: 10, rwd: { gold: 60, dia: 2 } },
  { id: 'd_kill20', title: 'Slaughterer', desc: 'Kill 20 enemies today', type: 'kill', target: 20, rwd: { gold: 100, dia: 3 } },
  { id: 'd_build5', title: 'War Engineer', desc: 'Build 5 towers today', type: 'build', target: 5, rwd: { gold: 90, dia: 2 } },
  { id: 'd_wave3', title: 'Hold the Line', desc: 'Survive 3 waves today', type: 'wave', target: 3, rwd: { gold: 80, dia: 2 } },
  { id: 'd_wave7', title: 'Siege Master', desc: 'Survive 7 waves today', type: 'wave', target: 7, rwd: { gold: 200, dia: 5 } },
  { id: 'd_upgrade3', title: 'Upgrade Rush', desc: 'Upgrade 3 towers today', type: 'upgrade', target: 3, rwd: { gold: 70, dia: 2 } },
  { id: 'd_nodmg', title: 'Untouchable', desc: 'Complete a wave with full HP', type: 'nodmg', target: 1, rwd: { gold: 120, dia: 4 } },
  { id: 'd_tesla', title: 'Storm Bringer', desc: 'Build a Tesla Tower', type: 'tesla', target: 1, rwd: { gold: 80, dia: 3 } },
  { id: 'd_dragon', title: 'Dragon Hunt', desc: 'Slay a Dragon', type: 'dragon', target: 1, rwd: { gold: 300, dia: 8 } },
  { id: 'd_ability', title: 'Arcane Surge', desc: 'Use 2 abilities', type: 'ability', target: 2, rwd: { gold: 60, dia: 3 } },
  { id: 'd_meteor', title: 'Meteor Mage', desc: 'Cast Meteor Strike', type: 'meteor', target: 1, rwd: { gold: 50, dia: 2 } },
  { id: 'd_sell', title: 'Merchant', desc: 'Sell 2 towers', type: 'sell', target: 2, rwd: { gold: 100, dia: 2 } },
];

// ── WAVE COMPOSITIONS ────────────────────────────────────────
function getWaveEnemies(wave) {
  // Story mode: use stage-specific wave data
  if (G.gameMode === 'story' && G.storyStage) {
    const stage = STORY_STAGES[G.storyStage - 1];
    if (stage) {
      const waveData = stage.waves[(G.waveInStage || 1) - 1];
      if (waveData) return waveData.enemies;
    }
  }
  // Extreme mode and fallback: original progression
  const scale = 1 + (wave - 1) * 0.15;
  if (wave === 1) return [{ type: 'goblin', count: 4 }];
  if (wave === 2) return [{ type: 'goblin', count: 6 }, { type: 'orc', count: 1 }];
  if (wave === 3) return [{ type: 'goblin', count: 5 }, { type: 'orc', count: 2 }];
  if (wave === 4) return [{ type: 'orc', count: 4 }, { type: 'goblin', count: 4 }];
  if (wave === 5) return [{ type: 'orc', count: 5 }, { type: 'troll', count: 1 }];
  if (wave === 6) return [{ type: 'troll', count: 2 }, { type: 'orc', count: 4 }];
  if (wave === 7) return [{ type: 'knight', count: 2 }, { type: 'orc', count: 5 }];
  if (wave === 8) return [{ type: 'knight', count: 3 }, { type: 'troll', count: 2 }];
  if (wave === 9) return [{ type: 'knight', count: 4 }, { type: 'troll', count: 3 }];
  if (wave === 10) return [{ type: 'dragon', count: 1 }, { type: 'knight', count: 3 }, { type: 'orc', count: 5 }];
  if (wave === 11) return [{ type: 'dragon', count: 1 }, { type: 'troll', count: 4 }];
  if (wave === 12) return [{ type: 'dragon', count: 2 }, { type: 'knight', count: 5 }];
  // Beyond 12 — scale up
  const extras = Math.floor((wave - 12) / 3);
  return [
    { type: 'dragon', count: 1 + Math.floor((wave - 10) / 4) },
    { type: 'knight', count: 4 + extras },
    { type: 'troll', count: 3 + extras },
    { type: 'orc', count: 6 + extras }
  ];
}

// ── GAME STATE ───────────────────────────────────────────────
let G = {
  hp: 15, maxHp: 15, gold: 80, diamonds: 0, wave: 1, score: 0,
  castleSkin: 'Wooden', towerSkin: 'Basic',
  towers: [], enemies: [], enemiesToSpawn: [], spawnIndex: 0,
  gameOver: false, isAnimating: false, frozenTurn: false,
  waveStartHp: 15,
  totalKills: 0, totalBuilds: 0, totalUpgrades: 0,
  dragonKills: 0, teslaTowers: 0,
  streak: 0, bestWave: 0,
  dailyChallenges: [], dailyProgress: {},
  abilitiesUsed: 0, towelsSold: 0,
  gameMode: 'story', // 'story' | 'extreme'
  castleOwned: ['Wooden'], towerSkinOwned: ['Basic'],
  quests: [], questProgress: {},
  selectedTowerType: null, selectedTower: null,
  tempShield: 0,
  // Story Mode stage tracking
  storyStage: 1,    // which stage (1–10)
  waveInStage: 1,   // wave within stage (1, 2, 3)
  stagesCleared: [], // array of cleared stage IDs
  stageStars: {},    // { stageId: stars (0-3) }
};
let gameSettings = { music: true, sfx: true, vfx: true, fastMode: false };
let currentShopTab = 'castles';

const boardEl = document.getElementById('game-board');

// ── SLEEP ────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, gameSettings.fastMode ? Math.max(ms / 5, 30) : ms)); }

// ── AUTH ─────────────────────────────────────────────────────
async function checkAuth() {
  const res = await fetch('/api/current_user');
  const data = await res.json();
  if (data.username) showGame(data.username);
}
async function register() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  if (!u || !p) return setAuthMsg('Enter ID and Seal.', true);
  const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
  const data = await res.json();
  setAuthMsg(data.error || data.message, !!data.error);
}
async function login() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  if (!u || !p) return setAuthMsg('Enter ID and Seal.', true);
  const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
  const data = await res.json();
  if (data.username) showGame(data.username);
  else setAuthMsg(data.error, true);
}
async function logout() { await fetch('/api/logout', { method: 'POST' }); location.reload(); }
function setAuthMsg(msg, err = false) {
  const el = document.getElementById('auth-message');
  el.textContent = msg;
  el.style.color = err ? '#F87171' : '#4ADE80';
}

// ── SAVE / LOAD ───────────────────────────────────────────────
async function saveGame(silent = false) {
  const today = new Date().toISOString().split('T')[0];
  const towersPayload = G.towers.map(t => ({
    x: t.x, y: t.y, type: t.type,
    level: t.level, upgrades: t.upgrades,
    damage: t.damage, range: t.range,
    chainCount: t.chainCount || 0,
    splashRange: t.splashRange || 1,
    kills: t.kills || 0
  }));
  try {
    const res = await fetch('/api/save_state', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gold: G.gold, diamonds: G.diamonds, wave: G.wave, score: G.score,
        castle_skin: G.castleSkin, tower_skin: G.towerSkin,
        streak: G.streak, last_login: today, best_wave: G.bestWave,
        towers: towersPayload, game_mode: G.gameMode
      })
    });
    const data = await res.json();
    if (!res.ok || data.status === 'error') {
      if (!silent) showToast('⚠️ Save failed — check connection!', 'terror');
      console.error('[Save] Error:', data);
      return false;
    }
    if (!silent) showToast('Game Saved! 💾', 'tsuccess');
    return true;
  } catch (e) {
    if (!silent) showToast('⚠️ Save failed — check connection!', 'terror');
    console.error('[Save] Exception:', e);
    return false;
  }
}

// Debounced auto-save — fires 1.5s after the last tower change
let _autoSaveTimer = null;
function scheduleAutoSave() {
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => saveGame(true), 1500);
}
async function loadSavedState() {
  const res = await fetch('/api/load_state');
  if (res.ok) {
    const d = await res.json();
    if (!d.error) {
      G.gold = d.gold || 80; G.diamonds = d.diamonds || 0;
      G.wave = d.wave || 1; G.score = d.score || 0;
      G.castleSkin = d.castle_skin || 'Wooden';
      G.towerSkin = d.tower_skin || 'Basic';
      G.streak = d.streak || 0;
      G.bestWave = d.best_wave || 0;
      G.gameMode = d.game_mode || 'story';
      G._savedTowers = Array.isArray(d.towers) ? d.towers : [];
    }
  }
}

// ── ADMIN ─────────────────────────────────────────────────────
function checkAdminStatus(u) { document.getElementById('btn-admin').style.display = u === 'admin' ? 'inline-block' : 'none'; }
async function openAdminPanel() {
  document.getElementById('admin-modal').style.display = 'flex';
  try {
    const res = await fetch('/api/admin/link');
    const data = await res.json();
    document.getElementById('admin-mobile-link').textContent = data.link || 'Unavailable';
    if (data.link) {
      const img = document.getElementById('qr-code-img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.link)}`;
      img.style.display = 'block';
    }
  } catch { document.getElementById('admin-mobile-link').textContent = 'Error fetching link.'; }
}
function closeAdminPanel() { document.getElementById('admin-modal').style.display = 'none'; }

// ── SHOW GAME ─────────────────────────────────────────────────
let _pendingUsername = null;

function showGame(username) {
  _pendingUsername = username;
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'none';
  checkAdminStatus(username);

  // Load state first so we know if a saved game exists
  loadSavedState().then(() => {
    checkDailyStreak();
    initDailyChallenges();
    showModeSelect();
  });
}

function showModeSelect() {
  document.getElementById('mode-select-section').style.display = 'flex';
  // Show "Continue" button only if player has a saved game past wave 1
  const hasSave = G.wave > 1 || (G._savedTowers && G._savedTowers.length > 0);
  document.getElementById('ms-continue-btn').style.display = hasSave ? 'block' : 'none';
}

window.selectMode = function (mode) {
  G.gameMode = mode;
  G._savedTowers = [];
  G.wave = 1;
  G.score = 0;
  G.gold = mode === 'extreme' ? 40 : 80;
  G.diamonds = 0;
  if (mode === 'extreme') {
    document.getElementById('mode-select-section').style.display = 'none';
    showIslandSelect();
  } else {
    // Story Mode → show Stage Select first
    G.activeBiome = null;
    loadStageProgress();
    document.getElementById('mode-select-section').style.display = 'none';
    showStageSelect();
  }
};

function showIslandSelect() {
  const screen = document.getElementById('island-select-section');
  screen.style.display = 'flex';
  renderIslandCards();
}

// ── STORY STAGE SELECT ────────────────────────────────────────
function loadStageProgress() {
  try {
    const raw = localStorage.getItem('kr_story_stages');
    if (raw) {
      const d = JSON.parse(raw);
      G.stagesCleared = d.cleared || [];
      G.stageStars = d.stars || {};
    } else {
      G.stagesCleared = [];
      G.stageStars = {};
    }
  } catch (_) { G.stagesCleared = []; G.stageStars = {}; }
}

function saveStageProgress() {
  try {
    localStorage.setItem('kr_story_stages', JSON.stringify({
      cleared: G.stagesCleared,
      stars: G.stageStars,
    }));
  } catch (_) { }
}

function isStageUnlocked(stageId) {
  if (stageId === 1) return true;
  return G.stagesCleared.includes(stageId - 1);
}

function showStageSelect() {
  const sec = document.getElementById('stage-select-section');
  sec.style.display = 'flex';
  renderStageSelect();
}

function renderStageSelect() {
  const grid = document.getElementById('stage-grid');
  grid.innerHTML = '';

  // Build path connector + stage nodes
  STORY_STAGES.forEach((stage, idx) => {
    const unlocked = isStageUnlocked(stage.id);
    const cleared = G.stagesCleared.includes(stage.id);
    const stars = G.stageStars[stage.id] || 0;
    const isCurrent = !cleared && unlocked;

    const starsHtml = [1, 2, 3].map(s =>
      `<span style="color:${s <= stars ? '#F0C842' : 'rgba(255,255,255,.18)'};font-size:16px">★</span>`
    ).join('');

    const waveLabels = stage.waves.map((w, wi) => {
      let icon = cleared ? '✅' : (wi < (G.waveInStage - 1) && G.storyStage === stage.id ? '✅' : '⭕');
      if (!unlocked) icon = '🔒';
      return `<span class="snode-wave-dot ${unlocked ? '' : 'locked-dot'}" title="${w.label}">${icon}</span>`;
    }).join('');

    const card = document.createElement('div');
    card.className = `stage-node ${unlocked ? 'sn-unlocked' : 'sn-locked'} ${cleared ? 'sn-cleared' : ''} ${isCurrent ? 'sn-current' : ''}`;
    card.style.setProperty('--sn-col', stage.color);
    card.style.setProperty('--sn-dark', stage.colorDark);
    card.style.setProperty('--sn-border', stage.border);
    card.style.setProperty('--sn-bg', stage.bg);

    card.innerHTML = `
      <div class="sn-number">${stage.id}</div>
      <div class="sn-art" style="color:${stage.color};filter:drop-shadow(0 0 10px ${stage.color})">${stage.art}</div>
      <div class="sn-name" style="color:${unlocked ? stage.color : 'var(--col-dim)'}">${stage.name}</div>
      <div class="sn-tagline">${unlocked ? stage.tagline : '🔒 Clear Stage ' + (stage.id - 1) + ' to Unlock'}</div>
      <div class="sn-wave-track">${waveLabels}</div>
      <div class="sn-stars">${starsHtml}</div>
      ${cleared ? '<div class="sn-cleared-badge">✓ CLEARED</div>' : ''}
      ${isCurrent && !cleared ? '<div class="sn-current-badge">▶ IN PROGRESS</div>' : ''}
    `;

    if (unlocked) {
      card.addEventListener('click', () => openStageDetail(stage.id));
    }

    // Add connector line between nodes
    if (idx < STORY_STAGES.length - 1) {
      const connector = document.createElement('div');
      connector.className = `sn-connector ${isStageUnlocked(stage.id + 1) ? 'conn-active' : 'conn-locked'}`;
      grid.appendChild(card);
      grid.appendChild(connector);
    } else {
      grid.appendChild(card);
    }
  });
}

let _stageDetailId = null;
function openStageDetail(stageId) {
  _stageDetailId = stageId;
  const stage = STORY_STAGES[stageId - 1];
  const panel = document.getElementById('stage-detail-panel');
  const cleared = G.stagesCleared.includes(stageId);
  const stars = G.stageStars[stageId] || 0;

  document.getElementById('sd-art').textContent = stage.art;
  document.getElementById('sd-art').style.color = stage.color;
  document.getElementById('sd-art').style.filter = `drop-shadow(0 0 20px ${stage.color})`;
  document.getElementById('sd-name').textContent = stage.name;
  document.getElementById('sd-name').style.color = stage.color;
  document.getElementById('sd-tag').textContent = stage.tagline;

  const starsHtml = [1, 2, 3].map(s =>
    `<span style="color:${s <= stars ? '#F0C842' : 'rgba(255,255,255,.18)'};font-size:22px">★</span>`
  ).join('');
  document.getElementById('sd-stars').innerHTML = starsHtml;

  // Wave list
  const waveList = stage.waves.map((w, i) => `
    <div class="sd-wave-row">
      <span class="sdw-num">Wave ${i + 1}</span>
      <span class="sdw-label" style="color:${w.boss ? '#F87171' : '#93C5FD'}">${w.label}</span>
      <span class="sdw-desc">${w.desc}</span>
      <div class="sdw-enemies">${w.enemies.map(e =>
    `<span title="${ENEMY_DEFS[e.type]?.name}">${ENEMY_DEFS[e.type]?.icon} ×${e.count}</span>`
  ).join(' ')}</div>
    </div>
  `).join('');
  document.getElementById('sd-waves').innerHTML = waveList;

  const enterBtn = document.getElementById('sd-enter-btn');
  enterBtn.style.background = `linear-gradient(135deg,${stage.color},${stage.colorDark})`;
  enterBtn.textContent = cleared ? '▶ REPLAY STAGE' : '▶ ENTER STAGE';

  panel.style.display = 'flex';
  panel.style.setProperty('--sd-col', stage.color);
  panel.style.setProperty('--sd-border', stage.border);
  panel.style.setProperty('--sd-bg', stage.bg);
}

window.closeStageDetail = function () {
  document.getElementById('stage-detail-panel').style.display = 'none';
};

window.enterSelectedStage = function () {
  if (!_stageDetailId) return;
  closeStageDetail();
  selectStage(_stageDetailId);
};

window.selectStage = function (stageId) {
  const stage = STORY_STAGES[stageId - 1];
  if (!stage) return;
  G.storyStage = stageId;
  G.waveInStage = 1;
  G.wave = 1; // reset wave counter for display
  G.gold = 80;
  G.diamonds = 0;
  G.score = 0;
  G._savedTowers = [];

  document.getElementById('stage-select-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'flex';
  document.getElementById('display-username').textContent = _pendingUsername;
  restartGame(false);
  showToast(`${stage.icon} Entering ${stage.name}!`, 'tsuccess');
  updateModeBadge();

  const seen = localStorage.getItem('kr_tutorial_done');
  if (!seen) setTimeout(startTutorial, 800);
};

window.backFromStageSelect = function () {
  document.getElementById('stage-select-section').style.display = 'none';
  document.getElementById('mode-select-section').style.display = 'flex';
};

// Island scene position config — positions relative to viewport (fixed scene)
const ISLAND_POSITIONS = {
  tundra: { left: '4%', top: '13%', w: 290, floatDur: '5.5s', floatDelay: '0s', zIndex: 6 },
  jungle: { left: '28%', top: '10%', w: 330, floatDur: '6.2s', floatDelay: '-2.1s', zIndex: 7 },
  volcano: { left: '57%', top: '14%', w: 270, floatDur: '4.8s', floatDelay: '-1.4s', zIndex: 5 },
  forest: { left: '73%', top: '11%', w: 250, floatDur: '5.8s', floatDelay: '-3.0s', zIndex: 4 },
};

// Terrain cap color, cliff rock colors, decorative emoji sets, cliff stripe colors
const ISLAND_TERRAIN = {
  tundra: {
    capColors: ['#E8F7FF', '#C5E9F7', '#A8D8EE'],
    cliffColors: ['#8BB8CC', '#6899AE', '#4A7A90', '#3A6478'],
    cliffStripe: 'rgba(255,255,255,.08)',
    rimColor: '#B0D8EC',
    deco: [
      { e: '🏔️', x: 14, y: 10, s: 36 },
      { e: '⛄', x: 48, y: 16, s: 28 },
      { e: '❄️', x: 72, y: 8, s: 22 },
      { e: '🧊', x: 30, y: 30, s: 20 },
      { e: '🌨️', x: 60, y: 25, s: 18 },
      { e: '❄️', x: 80, y: 30, s: 16 },
    ]
  },
  jungle: {
    capColors: ['#3DB838', '#28A022', '#1A8018'],
    cliffColors: ['#5A3A1A', '#4A2E12', '#3A220C', '#2C1808'],
    cliffStripe: 'rgba(255,200,100,.06)',
    rimColor: '#2E8B1C',
    deco: [
      { e: '🌴', x: 10, y: 8, s: 40 },
      { e: '🌺', x: 35, y: 20, s: 26 },
      { e: '🌴', x: 62, y: 6, s: 38 },
      { e: '🌿', x: 50, y: 28, s: 22 },
      { e: '🦜', x: 78, y: 14, s: 24 },
      { e: '🌸', x: 22, y: 32, s: 20 },
    ]
  },
  volcano: {
    capColors: ['#2C0E00', '#4A1800', '#6B2200'],
    cliffColors: ['#3D1200', '#2E0D00', '#1F0800', '#120500'],
    cliffStripe: 'rgba(255,80,0,.08)',
    rimColor: '#5C1A00',
    deco: [
      { e: '🌋', x: 12, y: 4, s: 44 },
      { e: '🔥', x: 48, y: 12, s: 32 },
      { e: '💥', x: 68, y: 6, s: 26 },
      { e: '🔥', x: 30, y: 26, s: 22 },
      { e: '🌋', x: 72, y: 24, s: 20 },
      { e: '💨', x: 52, y: 30, s: 18 },
    ]
  },
  forest: {
    capColors: ['#3A1F6E', '#522E9A', '#2A1450'],
    cliffColors: ['#2A1060', '#1E0A48', '#140632', '#0C0420'],
    cliffStripe: 'rgba(160,100,255,.08)',
    rimColor: '#4A2888',
    deco: [
      { e: '🌲', x: 8, y: 6, s: 38 },
      { e: '🔮', x: 40, y: 14, s: 30 },
      { e: '🌲', x: 66, y: 8, s: 36 },
      { e: '✨', x: 52, y: 28, s: 22 },
      { e: '🧙', x: 24, y: 18, s: 28 },
      { e: '⭐', x: 78, y: 26, s: 18 },
    ]
  },
};

// ═══════════════════════════════════════════════════════════════
//  BIOME PARTICLE ENGINE — canvas-based per-island particle FX
// ═══════════════════════════════════════════════════════════════

const BIOME_PARTICLES = {

  // ── CRYSTAL TUNDRA — swirling snowflakes + ice crystal glints ──
  tundra: {
    count: 42,
    create(cw, ch) {
      const type = Math.random() < 0.70 ? 'snow' : 'crystal';
      return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        size: type === 'snow' ? Math.random() * 5 + 2 : Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 0.55,
        speedY: Math.random() * 0.75 + 0.25,
        opacity: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.8,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.025 + 0.008,
        type
      };
    },
    update(p, cw, ch) {
      p.phase += p.phaseSpeed;
      p.x += p.speedX + Math.sin(p.phase) * 0.45;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.opacity = p.type === 'crystal'
        ? 0.4 + Math.abs(Math.sin(p.phase * 2)) * 0.6
        : 0.35 + Math.sin(p.phase) * 0.2;
      if (p.y > ch + 10) { p.y = -12; p.x = Math.random() * cw; }
      if (p.x < -20) p.x = cw + 20;
      if (p.x > cw + 20) p.x = -20;
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      if (p.type === 'snow') {
        // 6-armed snowflake
        ctx.strokeStyle = 'rgba(200,240,255,0.92)';
        ctx.lineWidth = p.size * 0.22;
        ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -p.size);
          // tiny cross branches
          ctx.moveTo(-p.size * 0.35, -p.size * 0.55);
          ctx.lineTo(p.size * 0.35, -p.size * 0.55);
          ctx.stroke();
          ctx.rotate(Math.PI / 3);
        }
        // centre dot
        ctx.fillStyle = 'rgba(220,248,255,0.95)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // diamond glint
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.2);
        g.addColorStop(0, 'rgba(180,240,255,1)');
        g.addColorStop(0.4, 'rgba(100,210,255,0.6)');
        g.addColorStop(1, 'rgba(60,180,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 2.2);
        ctx.lineTo(p.size * 0.5, 0);
        ctx.lineTo(0, p.size * 2.2);
        ctx.lineTo(-p.size * 0.5, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  },

  // ── VOLCANIC INFERNO — rising embers + ash + lava sparks ──
  volcano: {
    count: 52,
    create(cw, ch) {
      const type = Math.random() < 0.55 ? 'ember' : Math.random() < 0.6 ? 'ash' : 'spark';
      return {
        x: cw * 0.15 + Math.random() * cw * 0.70,
        y: ch * 0.45 + Math.random() * ch * 0.45,
        size: type === 'ember' ? Math.random() * 4.5 + 1.5
          : type === 'spark' ? Math.random() * 2 + 0.8
            : Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 1.1,
        speedY: -(Math.random() * 1.6 + 0.6),
        life: Math.random(),
        decay: Math.random() * 0.006 + 0.004,
        wobble: Math.random() * 0.12 + 0.04,
        phase: Math.random() * Math.PI * 2,
        type
      };
    },
    update(p, cw, ch) {
      p.phase += 0.06;
      p.x += p.speedX + Math.sin(p.phase) * p.wobble;
      p.y += p.speedY;
      p.speedY += 0.008; // gravity slow-down
      p.life -= p.decay;
      if (p.life <= 0 || p.y < -30) {
        p.x = cw * 0.15 + Math.random() * cw * 0.70;
        p.y = ch * 0.55 + Math.random() * ch * 0.35;
        p.life = 0.7 + Math.random() * 0.3;
        p.speedY = -(Math.random() * 1.6 + 0.6);
        p.speedX = (Math.random() - 0.5) * 1.1;
      }
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life * 0.9);
      if (p.type === 'ember') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        g.addColorStop(0, 'rgba(255,230,60,1)');
        g.addColorStop(0.35, 'rgba(255,110,20,0.85)');
        g.addColorStop(0.7, 'rgba(200,40,0,0.4)');
        g.addColorStop(1, 'rgba(160,20,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'spark') {
        ctx.strokeStyle = `rgba(255,200,50,${p.life})`;
        ctx.lineWidth = p.size * 0.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speedX * 3, p.y - p.speedY * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(110,100,90,${p.life * 0.45})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.4, p.size * 0.7, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  // ── TROPICAL ARCHIPELAGO — fireflies + pollen + leaf drift ──
  jungle: {
    count: 38,
    create(cw, ch) {
      const type = Math.random() < 0.45 ? 'firefly' : Math.random() < 0.6 ? 'pollen' : 'leaf';
      return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        size: type === 'firefly' ? Math.random() * 3 + 1.5
          : type === 'pollen' ? Math.random() * 2 + 0.8
            : Math.random() * 6 + 3,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: type === 'leaf' ? Math.random() * 0.4 + 0.1 : (Math.random() - 0.5) * 0.28,
        phase: Math.random() * Math.PI * 2,
        phaseX: Math.random() * 0.04 + 0.01,
        phaseY: Math.random() * 0.03 + 0.008,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.2,
        opacity: 0,
        hue: 100 + Math.random() * 40, // green range
        type
      };
    },
    update(p, cw, ch) {
      p.phase += p.phaseX;
      p.x += p.speedX + Math.sin(p.phase * 0.8) * 0.55;
      p.y += p.speedY + Math.cos(p.phase * 0.6) * 0.22;
      p.rotation += p.rotSpeed;
      p.opacity = p.type === 'firefly'
        ? Math.max(0, 0.3 + Math.sin(p.phase * 2.2) * 0.7)
        : 0.5 + Math.sin(p.phase * 1.3) * 0.35;
      if (p.x < -20) p.x = cw + 20;
      if (p.x > cw + 20) p.x = -20;
      if (p.y < -20) p.y = ch + 20;
      if (p.y > ch + 20) p.y = -20;
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      if (p.type === 'firefly') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        g.addColorStop(0, 'rgba(210,255,120,1)');
        g.addColorStop(0.3, 'rgba(100,230,50,0.65)');
        g.addColorStop(0.7, 'rgba(30,180,20,0.25)');
        g.addColorStop(1, 'rgba(0,150,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'pollen') {
        ctx.fillStyle = `rgba(240,255,160,0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
        ctx.fill();
        // tiny glow
        const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        g2.addColorStop(0, 'rgba(200,255,80,0.3)');
        g2.addColorStop(1, 'rgba(200,255,80,0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // leaf silhouette
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = `hsla(${p.hue},75%,35%,0.6)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `hsla(${p.hue},60%,25%,0.4)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(p.size, 0);
        ctx.stroke();
      }
      ctx.restore();
    }
  },

  // ── ENCHANTED FOREST — arcane orbs + void sparks + constellations ──
  forest: {
    count: 44,
    create(cw, ch) {
      const type = Math.random() < 0.45 ? 'orb' : Math.random() < 0.55 ? 'spark' : 'star';
      return {
        x: Math.random() * cw,
        y: type === 'orb' ? ch * 0.5 + Math.random() * ch * 0.5
          : type === 'star' ? Math.random() * ch * 0.5
            : Math.random() * ch,
        size: type === 'orb' ? Math.random() * 5 + 2.5
          : type === 'spark' ? Math.random() * 1.8 + 0.6
            : Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.40,
        speedY: type === 'orb' ? -(Math.random() * 0.55 + 0.15)
          : type === 'star' ? (Math.random() - 0.5) * 0.12
            : -(Math.random() * 0.3 + 0.08),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.035 + 0.01,
        hue: type === 'orb' ? 260 + Math.random() * 50
          : type === 'spark' ? 200 + Math.random() * 80
            : 280 + Math.random() * 60,
        opacity: 0,
        life: Math.random(),
        decay: Math.random() * 0.005 + 0.002,
        type
      };
    },
    update(p, cw, ch) {
      p.phase += p.phaseSpeed;
      p.x += p.speedX + Math.sin(p.phase * 0.9) * 0.45;
      p.y += p.speedY;
      p.life -= p.decay;
      if (p.type === 'orb') {
        p.opacity = Math.max(0, Math.min(0.85, p.life * 0.9 + Math.sin(p.phase * 1.8) * 0.2));
      } else if (p.type === 'star') {
        p.opacity = Math.max(0, 0.3 + Math.abs(Math.sin(p.phase * 2.5)) * 0.7);
        p.life = 1; // stars don't die
      } else {
        p.opacity = Math.max(0, p.life * 0.95);
      }
      if (p.life <= 0 || p.y < -20) {
        if (p.type !== 'star') {
          p.x = Math.random() * cw;
          p.y = p.type === 'orb' ? ch * 0.6 + Math.random() * ch * 0.4 : Math.random() * ch;
          p.life = 0.8 + Math.random() * 0.2;
        }
      }
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      if (p.type === 'orb') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
        g.addColorStop(0, `hsla(${p.hue},100%,88%,1)`);
        g.addColorStop(0.3, `hsla(${p.hue},85%,65%,0.7)`);
        g.addColorStop(0.65, `hsla(${p.hue},75%,50%,0.3)`);
        g.addColorStop(1, `hsla(${p.hue},70%,40%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();
        // inner bright core
        ctx.globalAlpha = p.opacity * 0.9;
        ctx.fillStyle = `hsla(${p.hue + 20},100%,95%,0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'spark') {
        ctx.strokeStyle = `hsla(${p.hue},100%,80%,${p.opacity})`;
        ctx.lineWidth = p.size * 0.7;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${p.hue},100%,70%,0.8)`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speedX * 4, p.y - p.speedY * 3);
        ctx.stroke();
      } else {
        // twinkling star cross
        ctx.fillStyle = `hsla(${p.hue},80%,90%,0.95)`;
        const s = p.size;
        ctx.fillRect(p.x - s * 0.12, p.y - s * 1.4, s * 0.24, s * 2.8);
        ctx.fillRect(p.x - s * 1.4, p.y - s * 0.12, s * 2.8, s * 0.24);
        const gs = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 1.8);
        gs.addColorStop(0, `hsla(${p.hue},90%,90%,0.4)`);
        gs.addColorStop(1, `hsla(${p.hue},80%,70%,0)`);
        ctx.fillStyle = gs;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
};

// Cancel existing particle loops before re-rendering
const _particleAnimIds = {};

function initIslandParticles(canvas, biomeId) {
  const cfg = BIOME_PARTICLES[biomeId];
  if (!cfg || !canvas) return;
  // Cancel previous loop for this biome if any
  if (_particleAnimIds[biomeId]) cancelAnimationFrame(_particleAnimIds[biomeId]);
  const ctx = canvas.getContext('2d');
  const cw = canvas.width, ch = canvas.height;
  const particles = Array.from({ length: cfg.count }, () => cfg.create(cw, ch));
  function tick() {
    ctx.clearRect(0, 0, cw, ch);
    particles.forEach(p => { cfg.update(p, cw, ch); cfg.draw(ctx, p); });
    _particleAnimIds[biomeId] = requestAnimationFrame(tick);
  }
  tick();
}

function initAllIslandParticles() {
  Object.keys(BIOME_DEFS).forEach(id => {
    initIslandParticles(document.getElementById(`ipc-${id}`), id);
  });
}

// ── BIOME-SPECIFIC EXTRA HTML GENERATORS ────────────────────────

function _biomeAmbient(b) {
  if (b.id === 'tundra') {
    return `<div class="inode-aurora-wrap" aria-hidden="true">
      <div class="inode-aurora-ribbon" style="--ar-col:rgba(80,220,200,.18);--ar-dur:5.5s;--ar-delay:0s;top:20%;"></div>
      <div class="inode-aurora-ribbon" style="--ar-col:rgba(100,180,255,.14);--ar-dur:7s;--ar-delay:-2s;top:34%;"></div>
      <div class="inode-aurora-ribbon" style="--ar-col:rgba(60,240,180,.10);--ar-dur:6.2s;--ar-delay:-1.3s;top:48%;"></div>
    </div>`;
  }
  if (b.id === 'volcano') {
    return `<div class="inode-heat-haze" aria-hidden="true"></div>`;
  }
  if (b.id === 'jungle') {
    return `<div class="inode-mist-layer" style="--mist-col:rgba(50,160,50,.18)" aria-hidden="true"></div>`;
  }
  if (b.id === 'forest') {
    return `<div class="inode-magic-ring" aria-hidden="true">
      <div class="inode-rune-ring" style="--rr-col:rgba(139,92,246,.5);--rr-size:82%;animation-delay:0s"></div>
      <div class="inode-rune-ring" style="--rr-col:rgba(167,139,250,.35);--rr-size:94%;animation-delay:-2.8s"></div>
    </div>`;
  }
  return '';
}

function _biomeCapOverlay(b) {
  if (b.id === 'tundra') {
    return `<div class="inode-frost-overlay" aria-hidden="true"></div>`;
  }
  if (b.id === 'volcano') {
    return `<div class="inode-lava-crack inode-lava-crack-1" aria-hidden="true"></div>
            <div class="inode-lava-crack inode-lava-crack-2" aria-hidden="true"></div>
            <div class="inode-lava-crack inode-lava-crack-3" aria-hidden="true"></div>`;
  }
  if (b.id === 'jungle') {
    return `<div class="inode-canopy-shimmer" aria-hidden="true"></div>`;
  }
  if (b.id === 'forest') {
    return `<div class="inode-arcane-shimmer" aria-hidden="true"></div>`;
  }
  return '';
}

function _biomeCliffFX(b) {
  if (b.id === 'tundra') {
    // Icicles hanging from the bottom of the cap into the cliff top
    const icicles = Array.from({ length: 9 }, (_, i) => {
      const h = 14 + (i % 3) * 9;
      const l = 5 + i * 11;
      return `<div class="inode-icicle" style="left:${l}%;height:${h}px;animation-delay:${(i * 0.3).toFixed(1)}s"></div>`;
    }).join('');
    return `<div class="inode-icicle-row" aria-hidden="true">${icicles}</div>`;
  }
  if (b.id === 'volcano') {
    // Lava vein cracks glowing in the cliff
    return `<div class="inode-lava-vein inode-lv-a" aria-hidden="true"></div>
            <div class="inode-lava-vein inode-lv-b" aria-hidden="true"></div>
            <div class="inode-lava-vein inode-lv-c" aria-hidden="true"></div>`;
  }
  if (b.id === 'jungle') {
    // Hanging vines down the cliff face
    const vines = Array.from({ length: 7 }, (_, i) => {
      const h = 40 + (i % 4) * 22;
      const l = 6 + i * 13;
      return `<div class="inode-vine" style="left:${l}%;height:${h}px;animation-delay:${(i * 0.45).toFixed(2)}s"></div>`;
    }).join('');
    return `<div class="inode-vine-row" aria-hidden="true">${vines}</div>`;
  }
  if (b.id === 'forest') {
    // Crystal formations + arcane rune marks on cliff
    return `<div class="inode-crystal-row" aria-hidden="true">
      <div class="inode-crystal" style="left:12%;height:28px;animation-delay:0s"></div>
      <div class="inode-crystal" style="left:28%;height:20px;animation-delay:-.8s"></div>
      <div class="inode-crystal" style="left:48%;height:32px;animation-delay:-1.6s"></div>
      <div class="inode-crystal" style="left:65%;height:22px;animation-delay:-.4s"></div>
      <div class="inode-crystal" style="left:80%;height:26px;animation-delay:-2.1s"></div>
    </div>`;
  }
  return '';
}

function _biomeBaseGlow(b, tipW, tipH) {
  const glowMap = {
    tundra: 'radial-gradient(ellipse at 50% 50%, rgba(80,210,240,.55) 0%, rgba(34,211,238,.25) 40%, transparent 80%)',
    volcano: 'radial-gradient(ellipse at 50% 80%, rgba(255,80,0,.80) 0%, rgba(230,50,0,.50) 35%, transparent 80%)',
    jungle: 'radial-gradient(ellipse at 50% 50%, rgba(30,200,80,.50) 0%, rgba(16,185,129,.22) 45%, transparent 80%)',
    forest: 'radial-gradient(ellipse at 50% 50%, rgba(160,80,255,.65) 0%, rgba(139,92,246,.30) 40%, transparent 80%)',
  };
  return `<div class="inode-base-glow" style="background:${glowMap[b.id]}" aria-hidden="true"></div>`;
}

// ═══════════════════════════════════════════════════════════════
//  ENHANCED buildIslandHTML
// ═══════════════════════════════════════════════════════════════

function buildIslandHTML(b) {
  const pos = ISLAND_POSITIONS[b.id];
  const ter = ISLAND_TERRAIN[b.id];
  const w = pos.w;
  const capH = Math.round(w * 0.44);
  const cliffH = Math.round(w * 0.38);
  const tipH = Math.round(w * 0.12);
  const totalIslandH = capH + cliffH + tipH;

  // Canvas is oversized so particles can fly above and around the island
  const cvW = w + 180, cvH = totalIslandH + 280;
  const cvLeft = -90, cvTop = -140;

  const capGrad = `radial-gradient(ellipse at 40% 35%, ${ter.capColors[0]} 0%, ${ter.capColors[1]} 55%, ${ter.capColors[2]} 100%)`;
  const cliffGrad = `linear-gradient(180deg, ${ter.cliffColors[0]} 0%, ${ter.cliffColors[1]} 35%, ${ter.cliffColors[2]} 70%, ${ter.cliffColors[3]} 100%)`;

  const decoHtml = ter.deco.map((d, i) =>
    `<span class="inode-deco-item" style="left:${d.x}%;top:${d.y}%;font-size:${d.s}px;animation-delay:${(i * 0.55).toFixed(2)}s">${d.e}</span>`
  ).join('');

  const starsHtml = '⭐'.repeat(b.difficulty) +
    `<span style="opacity:.22">${'⭐'.repeat(5 - b.difficulty)}</span>`;

  const shadowGlow = `0 0 ${Math.round(w * 0.35)}px ${Math.round(w * 0.10)}px ${b.color}28`;
  const nodeGlow = b.id === 'volcano'
    ? `0 0 40px 8px rgba(255,80,0,.18), 0 0 80px 16px rgba(200,40,0,.10)`
    : b.id === 'tundra'
      ? `0 0 40px 8px rgba(34,211,238,.15), 0 0 80px 16px rgba(100,220,255,.08)`
      : b.id === 'jungle'
        ? `0 0 40px 8px rgba(16,185,129,.15), 0 0 80px 16px rgba(30,200,80,.08)`
        : `0 0 40px 8px rgba(139,92,246,.18), 0 0 80px 16px rgba(120,60,240,.10)`;

  return `
  <div class="island-node inode-biome-${b.id}" data-biome="${b.id}" onclick="islandNodeClick('${b.id}')"
       style="left:${pos.left};top:${pos.top};--float-dur:${pos.floatDur};--float-delay:${pos.floatDelay};z-index:${pos.zIndex};--biome-glow:${b.color};filter:drop-shadow(0 0 0 transparent)">

    <!-- ── PARTICLE CANVAS (absolute, behind nothing) ── -->
    <canvas class="inode-particles" id="ipc-${b.id}"
            width="${cvW}" height="${cvH}"
            style="width:${cvW}px;height:${cvH}px;top:${cvTop}px;left:${cvLeft}px"></canvas>

    <!-- ── AMBIENT BIOME FX (aurora / heat-haze / mist / rune rings) ── -->
    ${_biomeAmbient(b)}

    <!-- ── TERRAIN CAP ── -->
    <div class="inode-cap" style="width:${w}px;height:${capH}px;background:${capGrad};border-color:${ter.rimColor};box-shadow:0 6px 0 rgba(0,0,0,.22),0 12px 30px rgba(0,0,0,.28),inset 0 10px 20px rgba(255,255,255,.14),inset 0 -4px 8px rgba(0,0,0,.25),${nodeGlow}">
      <div class="inode-cap-shine"></div>
      ${_biomeCapOverlay(b)}
      <div class="inode-deco-wrap">${decoHtml}</div>
    </div>

    <!-- ── CLIFF BODY ── -->
    <div class="inode-cliff-body" style="width:${Math.round(w * .84)}px;height:${cliffH}px;background:${cliffGrad};margin-left:${Math.round(w * .08)}px">
      <div class="inode-cliff-stripe" style="background:${ter.cliffStripe}"></div>
      <div class="inode-cliff-stripe" style="left:20%;background:${ter.cliffStripe}"></div>
      <div class="inode-cliff-stripe" style="left:40%;background:${ter.cliffStripe}"></div>
      <div class="inode-cliff-stripe" style="left:62%;background:${ter.cliffStripe}"></div>
      <div class="inode-cliff-stripe" style="left:80%;background:${ter.cliffStripe}"></div>
      <div class="inode-crack" style="top:30%;background:rgba(0,0,0,.18)"></div>
      <div class="inode-crack" style="top:62%;background:rgba(0,0,0,.14)"></div>
      ${_biomeCliffFX(b)}
    </div>

    <!-- ── BOTTOM TIP ── -->
    <div class="inode-cliff-tip" style="width:${Math.round(w * .52)}px;height:${tipH}px;background:${ter.cliffColors[3]};margin-left:${Math.round(w * .24)}px">
      ${_biomeBaseGlow(b, Math.round(w * .52), tipH)}
    </div>

    <!-- ── FLOATING SHADOW (tinted by biome) ── -->
    <div class="inode-shadow" style="width:${Math.round(w * .62)}px;margin-left:${Math.round(w * .19)}px;box-shadow:${shadowGlow}"></div>

    <!-- ── NAMEPLATE ── -->
    <div class="inode-nameplate" style="--biome-col:${b.color}">
      <span class="inode-np-icon">${b.icon}</span>
      <span class="inode-np-name">${b.name}</span>
      <span class="inode-np-tagline">${b.tagline}</span>
      <span class="inode-np-stars">${starsHtml}</span>
    </div>
  </div>`;
}

function renderIslandCards() {
  const grid = document.getElementById('island-grid');
  grid.className = 'island-scene';

  // Background atmospheric wisps (dark, subtle)
  const wispData = [
    { t: 12, l: 8, w: 320, h: 80, op: 0.06, dur: 18, delay: 0 },
    { t: 38, l: 45, w: 260, h: 60, op: 0.05, dur: 22, delay: -7 },
    { t: 60, l: 20, w: 400, h: 90, op: 0.07, dur: 26, delay: -13 },
    { t: 72, l: 68, w: 280, h: 70, op: 0.05, dur: 20, delay: -5 },
  ];
  const wisps = wispData.map(w =>
    `<div class="isc-wisp" style="top:${w.t}%;left:${w.l}%;width:${w.w}px;height:${w.h}px;opacity:${w.op};animation-duration:${w.dur}s;animation-delay:${w.delay}s"></div>`
  ).join('');

  // Distant background stars
  const starCount = 55;
  const stars = Array.from({ length: starCount }, (_, i) => {
    const x = Math.random() * 100, y = Math.random() * 65;
    const s = Math.random() * 2.2 + 0.5;
    const op = Math.random() * 0.5 + 0.15;
    const dur = 2.5 + Math.random() * 4;
    const del = -(Math.random() * dur);
    return `<div class="isc-star" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;opacity:${op.toFixed(2)};animation-duration:${dur.toFixed(1)}s;animation-delay:${del.toFixed(1)}s"></div>`;
  }).join('');

  const islands = Object.values(BIOME_DEFS).map(buildIslandHTML).join('');

  // Detail panel
  const detailPanel = `
  <div class="isc-detail-panel" id="isc-detail-panel" style="display:none">
    <div class="isc-detail-inner" id="isc-detail-inner">
      <button class="isc-d-close" onclick="closeIslandDetail()">✕</button>
      <div class="isc-d-art" id="isc-d-art"></div>
      <div class="isc-d-name" id="isc-d-name"></div>
      <div class="isc-d-tag"  id="isc-d-tag"></div>
      <div class="isc-d-diff" id="isc-d-diff"></div>
      <div class="isc-d-enemies" id="isc-d-enemies"></div>
      <div class="isc-d-reward"  id="isc-d-reward"></div>
      <div class="isc-d-lore"   id="isc-d-lore"></div>
      <button class="isc-d-enter-btn" id="isc-d-enter-btn">▶ ENTER ISLAND</button>
    </div>
  </div>`;

  grid.innerHTML = wisps + stars + islands + detailPanel;
  // Kick off all canvas particle engines after DOM is populated
  requestAnimationFrame(initAllIslandParticles);
}

window.islandNodeClick = function (biomeId) {
  const b = BIOME_DEFS[biomeId];
  if (!b) return;
  const panel = document.getElementById('isc-detail-panel');
  // Populate panel
  document.getElementById('isc-d-art').textContent = b.art;
  document.getElementById('isc-d-art').style.color = b.color;
  document.getElementById('isc-d-art').style.filter = `drop-shadow(0 0 20px ${b.color})`;
  document.getElementById('isc-d-name').textContent = b.name;
  document.getElementById('isc-d-name').style.color = b.color;
  document.getElementById('isc-d-tag').textContent = b.tagline;
  document.getElementById('isc-d-diff').innerHTML =
    '⭐'.repeat(b.difficulty) + '<span style="opacity:.3">' + '⭐'.repeat(5 - b.difficulty) + '</span>' +
    ' <span style="font-size:11px;opacity:.5;font-family:Cinzel,serif;letter-spacing:.1em">DIFFICULTY</span>';
  document.getElementById('isc-d-enemies').innerHTML =
    b.enemies.slice(0, 3).map(eid => `<span title="${ENEMY_DEFS[eid]?.name}" style="font-size:22px">${ENEMY_DEFS[eid]?.icon}</span>`).join('') +
    '<span style="font-size:12px;opacity:.5;font-family:Cinzel,serif"> +MORE</span>';
  document.getElementById('isc-d-reward').innerHTML =
    `<span style="font-size:22px">${b.reward.icon}</span>
     <div><div style="font-family:Cinzel,serif;font-size:11px;color:#F0C842;font-weight:700">${b.reward.label}</div>
     <div style="font-size:12px;opacity:.6;font-family:EB Garamond,serif">${b.reward.desc}</div></div>`;
  document.getElementById('isc-d-lore').textContent = b.loreText;

  // ── Per-island best stats ──────────────────────────────────
  const stat = getIslandStat(biomeId);
  let statsEl = document.getElementById('isc-d-stats');
  if (!statsEl) {
    statsEl = document.createElement('div');
    statsEl.id = 'isc-d-stats';
    statsEl.style.cssText = `
      display:flex; gap:10px; justify-content:center; margin:10px 0 2px;
    `;
    // Insert before the enter button
    const enterBtn = document.getElementById('isc-d-enter-btn');
    enterBtn.parentNode.insertBefore(statsEl, enterBtn);
  }
  if (stat.bestWave > 0 || stat.bestScore > 0) {
    statsEl.style.display = 'flex';
    statsEl.innerHTML = `
      <div style="
        background:rgba(0,0,0,.35);border:1px solid ${b.border || 'rgba(255,255,255,.2)'};
        border-radius:10px;padding:8px 14px;text-align:center;flex:1;
      ">
        <div style="font-size:18px">🌊</div>
        <div style="font-family:Cinzel,serif;font-size:16px;font-weight:700;color:${b.color}">${stat.bestWave}</div>
        <div style="font-size:9px;letter-spacing:1.5px;opacity:.55;font-family:Cinzel,serif;margin-top:2px">BEST WAVE</div>
      </div>
      <div style="
        background:rgba(0,0,0,.35);border:1px solid ${b.border || 'rgba(255,255,255,.2)'};
        border-radius:10px;padding:8px 14px;text-align:center;flex:1;
      ">
        <div style="font-size:18px">🏆</div>
        <div style="font-family:Cinzel,serif;font-size:16px;font-weight:700;color:#F0C842">${stat.bestScore.toLocaleString()}</div>
        <div style="font-size:9px;letter-spacing:1.5px;opacity:.55;font-family:Cinzel,serif;margin-top:2px">BEST SCORE</div>
      </div>`;
  } else {
    statsEl.style.display = 'flex';
    statsEl.innerHTML = `
      <div style="
        width:100%;background:rgba(0,0,0,.2);border:1px dashed rgba(255,255,255,.15);
        border-radius:10px;padding:8px;text-align:center;
        font-family:EB Garamond,serif;font-size:13px;font-style:italic;opacity:.5;
      ">No runs yet — be the first to conquer this island!</div>`;
  }

  const enterBtn = document.getElementById('isc-d-enter-btn');
  enterBtn.style.background = `linear-gradient(135deg,${b.color},${b.colorDark})`;
  enterBtn.onclick = () => { closeIslandDetail(); selectBiome(biomeId); };

  panel.style.display = 'flex';
  panel.style.setProperty('--panel-col', b.color);
  panel.style.setProperty('--panel-dark', b.colorDark);
  panel.style.setProperty('--panel-border', b.border);
  panel.style.setProperty('--panel-bg', b.colorBg);
};

window.closeIslandDetail = function () {
  const panel = document.getElementById('isc-detail-panel');
  if (panel) panel.style.display = 'none';
};

// ── PER-ISLAND STAT PERSISTENCE ───────────────────────────────
function _islandKey(id) { return `kr_istat_${id}`; }

function saveIslandStat(biomeId, wave, score) {
  try {
    const key = _islandKey(biomeId);
    const prev = getIslandStat(biomeId);
    const next = {
      bestWave: Math.max(prev.bestWave, wave || 0),
      bestScore: Math.max(prev.bestScore, score || 0),
    };
    localStorage.setItem(key, JSON.stringify(next));
  } catch (_) { }
}

function getIslandStat(biomeId) {
  try {
    const raw = localStorage.getItem(_islandKey(biomeId));
    if (raw) return JSON.parse(raw);
  } catch (_) { }
  return { bestWave: 0, bestScore: 0 };
}

// ── BACK TO ISLAND SELECT (from in-game settings) ─────────────
window.confirmBackToIsland = function () {
  document.getElementById('back-to-island-modal').style.display = 'flex';
};

window.closeBackToIslandModal = function () {
  document.getElementById('back-to-island-modal').style.display = 'none';
};

window.goBackToIsland = function () {
  document.getElementById('back-to-island-modal').style.display = 'none';
  // Stop any running animation/wave
  G.gameOver = true;
  G.isAnimating = false;
  // Save current state before leaving
  saveGame();
  // Switch screens
  document.getElementById('game-section').style.display = 'none';
  document.getElementById('island-select-section').style.display = 'flex';
  buildIslandSelect();
};

window.selectBiome = function (biomeId) {
  const biome = BIOME_DEFS[biomeId];
  if (!biome) return;
  G.activeBiome = biome;
  // Apply biome reward passive effects
  G._biomeReward = biome.reward;
  document.getElementById('island-select-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'flex';
  document.getElementById('display-username').textContent = _pendingUsername;
  restartGame(false);
  showToast(`${biome.icon} Entering ${biome.name}!`, 'tsuccess');
  updateModeBadge();
};

window.backFromIslandSelect = function () {
  document.getElementById('island-select-section').style.display = 'none';
  document.getElementById('mode-select-section').style.display = 'flex';
};


window.continueGame = function () {
  // Restore saved state with existing mode
  document.getElementById('mode-select-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'flex';
  document.getElementById('display-username').textContent = _pendingUsername;
  restartGame(true);
};

window.confirmBackToMenu = function () {
  document.getElementById('back-to-menu-modal').style.display = 'flex';
};

window.closeBackToMenuModal = function () {
  document.getElementById('back-to-menu-modal').style.display = 'none';
};

window.goBackToMenu = function () {
  document.getElementById('back-to-menu-modal').style.display = 'none';
  G.gameOver = true;
  G.isAnimating = false;
  G._savedTowers = G.towers.map(t => ({
    x: t.x, y: t.y, type: t.type,
    level: t.level, upgrades: t.upgrades,
    damage: t.damage, range: t.range,
    chainCount: t.chainCount || 0,
    splashRange: t.splashRange || 1,
    kills: t.kills || 0
  }));
  saveGame(true);
  document.getElementById('game-section').style.display = 'none';
  if (G.gameMode === 'story') {
    loadStageProgress();
    showStageSelect();
  } else {
    showModeSelect();
  }
};

function restartGame(loginRestore = false) {
  document.getElementById('game-over-modal').style.display = 'none';
  const skin = CASTLE_SKINS[G.castleSkin] || CASTLE_SKINS.Wooden;
  G.maxHp = G.gameMode === 'extreme' ? Math.max(10, Math.floor(skin.maxHp * 0.67)) : skin.maxHp;
  G.hp = G.maxHp; G.waveStartHp = G.maxHp;
  G.enemies = []; G.spawnIndex = 0;
  G.gameOver = false; G.isAnimating = false; G.frozenTurn = false;
  G.selectedTowerType = null; G.selectedTower = null;
  G.tempShield = 0;
  G.totalKills = 0; G.totalBuilds = 0; G.totalUpgrades = 0;
  G.dragonKills = 0; G.teslaTowers = 0;
  G.abilitiesUsed = 0; G.towelsSold = 0;

  // Story mode: initialize to wave 1 of current stage
  if (G.gameMode === 'story' && !loginRestore) {
    G.wave = 1;
    G.waveInStage = 1;
  }

  if (loginRestore && G._savedTowers && G._savedTowers.length > 0) {
    G.towers = G._savedTowers.map(t => ({
      ...t,
      def: TOWER_DEFS[t.type]
    }));
    G._savedTowers = [];
    G.teslaTowers = G.towers.filter(t => t.type === 'tesla').length;
  } else {
    G.towers = [];
  }

  initQuests();
  buildWaveQueue();
  createBoard();
  renderTowerSelector();
  renderBoard();
  updateHUD();
  setPhase('planning');
  showWavePreview();
  updateModeBadge();
}

function initQuests() {
  G.quests = QUEST_DEFS.map(q => ({ ...q, progress: 0, done: false, claimed: false }));
  if (G.wave > 1) {
    G.quests.forEach(q => { if (q.type === 'wave') q.progress = Math.min(G.wave - 1, q.target); });
  }
  renderQuests();
}

// ── STAGE TILE THEMES ─────────────────────────────────────────
// Per-stage decorative emoji for path cells and ground cells
const STAGE_TILE_THEMES = [
  // Stage 1 — Goblin's Forest
  { groundClass: 'stage-1', pathDeco: ['🌿', '🍂', '🌱', '🍃'], groundDeco: ['🌲', '🌳', '🍄', '🌿'] },
  // Stage 2 — Troll Bridge
  { groundClass: 'stage-2', pathDeco: ['🪨', '💧', '🪨', '🌊'], groundDeco: ['🪨', '🧌', '🪨', '💦'] },
  // Stage 3 — Dark Vale
  { groundClass: 'stage-3', pathDeco: ['💀', '🌑', '⚔️', '💀'], groundDeco: ['🌑', '⚔️', '🕷️', '🌑'] },
  // Stage 4 — Iron Fortress
  { groundClass: 'stage-4', pathDeco: ['⚙️', '🔩', '⚙️', '🛡️'], groundDeco: ['⚙️', '🔩', '🛡️', '⚙️'] },
  // Stage 5 — Dragon's Approach
  { groundClass: 'stage-5', pathDeco: ['🔥', '💥', '🔥', '🌋'], groundDeco: ['🔥', '💥', '🐉', '🔥'] },
  // Stage 6 — Scorched Plains
  { groundClass: 'stage-6', pathDeco: ['🌋', '🔥', '💀', '🌋'], groundDeco: ['🌋', '🔥', '💥', '🌑'] },
  // Stage 7 — The Siege
  { groundClass: 'stage-7', pathDeco: ['🏰', '🪨', '⚔️', '🏰'], groundDeco: ['🏰', '⚔️', '🛡️', '🪨'] },
  // Stage 8 — The Void Gate
  { groundClass: 'stage-8', pathDeco: ['🌀', '⭐', '✨', '🌀'], groundDeco: ['🌀', '⭐', '💫', '✨'] },
  // Stage 9 — End of Days
  { groundClass: 'stage-9', pathDeco: ['☄️', '💀', '🔥', '☄️'], groundDeco: ['☄️', '💀', '🌑', '🔥'] },
  // Stage 10 — Kingdom's Reckoning
  { groundClass: 'stage-10', pathDeco: ['👑', '⚔️', '✨', '👑'], groundDeco: ['👑', '⚔️', '💎', '✨'] },
];

// ── BOARD CREATION ────────────────────────────────────────────
function createBoard() {
  boardEl.innerHTML = '';
  const stageTheme = (G.gameMode === 'story' && G.storyStage)
    ? STAGE_TILE_THEMES[G.storyStage - 1] : null;

  let tileIdx = 0;
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x; cell.dataset.y = y;

      // Apply stage theme class + tile variation
      if (stageTheme) {
        cell.classList.add(stageTheme.groundClass);
        cell.dataset.tv = tileIdx % 5;
      }
      tileIdx++;

      if (y === PATH_ROW) {
        if (x === GRID_W - 1) {
          cell.classList.add('base-cell');
          const castle = document.createElement('div');
          castle.className = `castle-render ${CASTLE_SKINS[G.castleSkin].cssClass}`;
          castle.id = 'castle-render';
          const svgWrap = document.createElement('div');
          svgWrap.className = 'cas-svg-wrap';
          svgWrap.id = 'cas-svg-wrap';
          svgWrap.innerHTML = getCastleSVG(G.castleSkin);
          castle.appendChild(svgWrap);
          const hpBar = document.createElement('div');
          hpBar.className = 'castle-hp-bar';
          const hpFill = document.createElement('div');
          hpFill.className = 'castle-hp-fill'; hpFill.id = 'castle-hp-fill';
          hpBar.appendChild(hpFill); castle.appendChild(hpBar);
          cell.appendChild(castle);
        } else {
          cell.classList.add('path-cell');
          // Add themed path decoration emoji on every 3rd path cell
          if (stageTheme && x % 3 === 1) {
            const deco = document.createElement('span');
            deco.className = 'path-deco';
            deco.textContent = stageTheme.pathDeco[x % stageTheme.pathDeco.length];
            cell.appendChild(deco);
          }
        }
      } else {
        // Add rare ground decorations on a few non-path cells
        if (stageTheme && (x * 7 + y * 3) % 11 === 0) {
          const gdeco = document.createElement('span');
          gdeco.className = 'ground-deco';
          gdeco.textContent = stageTheme.groundDeco[(x + y) % stageTheme.groundDeco.length];
          cell.appendChild(gdeco);
        }
        cell.addEventListener('mouseenter', () => hoverCell(x, y));
        cell.addEventListener('mouseleave', clearHighlights);
        cell.addEventListener('click', () => handleCellClick(x, y));
      }
      boardEl.appendChild(cell);
    }
  }
  updateCastleHpBar();
}

function updateCastleHpBar() {
  const fill = document.getElementById('castle-hp-fill');
  if (fill) {
    const pct = Math.max(0, (G.hp / G.maxHp) * 100);
    fill.style.width = pct + '%';
    fill.style.background = pct > 60 ? '#22C55E' : pct > 30 ? '#EAB308' : '#EF4444';
  }
}

// ── HOVER + RANGE ─────────────────────────────────────────────
function hoverCell(cx, cy) {
  clearHighlights();
  if (G.gameOver || G.isAnimating) return;
  const existing = G.towers.find(t => t.x === cx && t.y === cy);
  const range = existing ? existing.range : (G.selectedTowerType ? (TOWER_DEFS[G.selectedTowerType].range + (TOWER_SKINS[G.towerSkin]?.rangeBonus || 0)) : 2);
  if (existing || G.selectedTowerType) {
    document.querySelectorAll('.cell').forEach(cell => {
      const tx = parseInt(cell.dataset.x), ty = parseInt(cell.dataset.y);
      if (Math.abs(cx - tx) + Math.abs(cy - ty) <= range) cell.classList.add('in-range');
    });
  }
}
function clearHighlights() { document.querySelectorAll('.in-range').forEach(c => c.classList.remove('in-range')); }

// ── CELL CLICK ────────────────────────────────────────────────
function handleCellClick(x, y) {
  if (G.gameOver || G.isAnimating) return;
  const existing = G.towers.find(t => t.x === x && t.y === y);
  if (existing) { selectTower(existing); return; }
  if (G.selectedTowerType) placeTower(x, y);
  else { G.selectedTower = null; renderUpgradePanel(); }
}

// ── TOWER SELECTOR UI ─────────────────────────────────────────
function renderTowerSelector() {
  const cont = document.getElementById('tower-selector');
  cont.innerHTML = '';
  Object.values(TOWER_DEFS).forEach(def => {
    const card = document.createElement('div');
    card.className = 'tower-card';
    const canAfford = G.gold >= def.cost;
    if (!canAfford) card.classList.add('tc-disabled');
    if (G.selectedTowerType === def.id) card.classList.add('tc-selected');
    card.innerHTML = `
      <span class="tc-icon">${def.icon}</span>
      <div class="tc-info">
        <div class="tc-name">${def.name}</div>
        <div class="tc-cost">🪙 ${def.cost}</div>
        <div class="tc-desc">${def.desc}</div>
      </div>`;
    card.addEventListener('click', () => {
      if (!canAfford) return showToast('Not enough gold!', 'terror');
      G.selectedTowerType = G.selectedTowerType === def.id ? null : def.id;
      G.selectedTower = null;
      renderTowerSelector(); renderUpgradePanel(); renderTowerInfo();
    });
    cont.appendChild(card);
  });
  highlightBuildableCells();
}

function highlightBuildableCells() {
  document.querySelectorAll('.cell:not(.path-cell):not(.base-cell)').forEach(cell => {
    const x = parseInt(cell.dataset.x), y = parseInt(cell.dataset.y);
    const occupied = G.towers.some(t => t.x === x && t.y === y);
    cell.classList.toggle('can-place', !!G.selectedTowerType && !occupied);
  });
}

function renderTowerInfo() {
  const box = document.getElementById('tower-info-box');
  if (!G.selectedTowerType) {
    box.innerHTML = '<p class="info-placeholder">Select a tower type,<br>then click a tile to place it</p>';
    return;
  }
  const def = TOWER_DEFS[G.selectedTowerType];
  const sk = TOWER_SKINS[G.towerSkin] || TOWER_SKINS.Basic;
  const effDmg = def.baseDmg + sk.dmgBonus;
  const effRange = def.range + sk.rangeBonus;
  box.innerHTML = `<div class="tower-stats-box">
    <div class="ts-row"><span class="ts-label">Damage</span><span class="ts-val">${effDmg}</span></div>
    <div class="ts-row"><span class="ts-label">Range</span><span class="ts-val">${effRange} tiles</span></div>
    <div class="ts-row"><span class="ts-label">Type</span><span class="ts-val">${def.type}</span></div>
    <div class="ts-row"><span class="ts-label">Cost</span><span class="ts-val" style="color:var(--gold-l)">🪙 ${def.cost}</span></div>
  </div>`;
}

// ── PLACE TOWER ───────────────────────────────────────────────
function placeTower(x, y) {
  const def = TOWER_DEFS[G.selectedTowerType];
  if (!def) return;
  if (G.gold < def.cost) return showToast('Not enough gold!', 'terror');
  if (G.towers.find(t => t.x === x && t.y === y)) return showToast('Tile occupied!', 'terror');
  G.gold -= def.cost;
  const sk = TOWER_SKINS[G.towerSkin] || TOWER_SKINS.Basic;
  G.towers.push({
    x, y, type: G.selectedTowerType,
    level: 1, upgrades: 0,
    damage: def.baseDmg + sk.dmgBonus,
    range: def.range + sk.rangeBonus,
    chainCount: def.chainCount || 0
  });
  G.totalBuilds++;
  addLog(`${def.icon} ${def.name} placed at [${x},${y}].`, 'log-gold');
  updateQuestProgress('build');
  if (G.selectedTowerType === 'tesla') { G.teslaTowers++; updateQuestProgress('tesla'); }
  showToast(`${def.name} built! (-${def.cost}🪙)`, 'tsuccess');
  renderBoard(); renderTowerSelector(); updateHUD();
  scheduleAutoSave();
}

// ── SELECT TOWER ──────────────────────────────────────────────
function selectTower(tower) {
  G.selectedTower = tower; G.selectedTowerType = null;
  renderTowerSelector(); renderUpgradePanel();
}

function renderUpgradePanel() {
  const panel = document.getElementById('upgrade-panel');
  const info = document.getElementById('tower-info-box');
  if (!G.selectedTower) {
    panel.style.display = 'none';
    renderTowerInfo();
    return;
  }
  panel.style.display = 'block';
  info.innerHTML = '';
  const t = G.selectedTower;
  const def = TOWER_DEFS[t.type];
  document.getElementById('up-icon').textContent = def.icon;
  document.getElementById('up-name').textContent = def.name;
  document.getElementById('up-level').textContent = `Level ${t.level}`;
  const upCost = t.upgrades < def.upgrades.length ? def.upgrades[t.upgrades].cost : null;
  const upDesc = t.upgrades < def.upgrades.length ? def.upgrades[t.upgrades].desc : 'MAX LEVEL';
  document.getElementById('up-stats').innerHTML = `
    <div class="ts-row"><span class="ts-label">Damage</span><span class="ts-val">${t.damage}</span></div>
    <div class="ts-row"><span class="ts-label">Range</span><span class="ts-val">${t.range}</span></div>
    <div class="ts-row"><span class="ts-label">Kills</span><span class="ts-val">${t.kills || 0}</span></div>
    <div class="ts-row"><span class="ts-label">Next</span><span class="ts-val" style="color:var(--gold)">${upCost ? upDesc : '—'}</span></div>`;
  const upBtn = document.getElementById('btn-upgrade');
  upBtn.textContent = upCost ? `⬆ ${upDesc} (🪙${upCost})` : '★ MAX LEVEL';
  upBtn.disabled = !upCost || G.gold < upCost;
  const sellAmt = def.sellVal[Math.min(t.upgrades, def.sellVal.length - 1)];
  document.getElementById('btn-sell').textContent = `💰 Sell (🪙${sellAmt})`;
}

function upgradeSelected() {
  const t = G.selectedTower;
  if (!t) return;
  const def = TOWER_DEFS[t.type];
  if (t.upgrades >= def.upgrades.length) return showToast('Already at max level!', 'terror');
  const upData = def.upgrades[t.upgrades];
  if (G.gold < upData.cost) return showToast('Not enough gold!', 'terror');
  G.gold -= upData.cost;
  t.damage += upData.dmgBonus || 0;
  t.range += upData.rangeBonus || 0;
  if (upData.splashBonus) t.splashRange = (t.splashRange || 1) + upData.splashBonus;
  if (upData.chainBonus) t.chainCount = (t.chainCount || 0) + upData.chainBonus;
  t.upgrades++; t.level++;
  G.totalUpgrades++;
  updateQuestProgress('upgrade');
  addLog(`⬆ ${def.name} upgraded to Lv.${t.level}!`, 'log-gold');
  showToast(`${def.name} → Level ${t.level}!`, 'tsuccess');
  renderBoard(); renderUpgradePanel(); updateHUD();
  scheduleAutoSave();
}

function sellSelected() {
  const t = G.selectedTower;
  if (!t) return;
  const def = TOWER_DEFS[t.type];
  const sellAmt = def.sellVal[Math.min(t.upgrades, def.sellVal.length - 1)];
  G.gold += sellAmt;
  G.towers = G.towers.filter(tw => tw !== t);
  if (t.type === 'tesla') G.teslaTowers = Math.max(0, G.teslaTowers - 1);
  G.towelsSold++;
  updateDailyProgress('sell');
  addLog(`💰 ${def.name} sold for ${sellAmt}🪙.`, 'log-gold');
  showToast(`Sold for ${sellAmt}🪙`, 'tsuccess');
  G.selectedTower = null;
  renderBoard(); renderTowerSelector(); renderUpgradePanel(); updateHUD();
  scheduleAutoSave();
}

// ── WAVE SYSTEM ───────────────────────────────────────────────
function buildWaveQueue() {
  const groups = getWaveEnemies(G.wave);
  const biome = G.activeBiome;

  // In story mode: use stage hpScale + waveInStage progression
  let storyHpMult = 1;
  const isBossWave = G.gameMode === 'story' && G.waveInStage === 3;
  if (G.gameMode === 'story' && G.storyStage) {
    const stage = STORY_STAGES[G.storyStage - 1];
    if (stage) {
      storyHpMult = stage.hpScale * (1 + (G.waveInStage - 1) * 0.3);
    }
  }

  const baseScale = G.gameMode === 'extreme' ? (1 + (G.wave - 1) * 0.15) : storyHpMult;
  const hpScale = baseScale * (G.gameMode === 'extreme' ? 1.75 : 1) * (biome ? biome.enemyMods.hpMult : 1);
  const dmgMult = biome ? biome.enemyMods.dmgMult : (isBossWave ? 1.3 : 1);
  const spdBonus = biome ? biome.enemyMods.spdBonus : 0;

  // In biome mode, replace enemy types with biome-specific ones
  const biomeEnemyMap = biome ? {
    goblin: biome.enemies[0],
    orc: biome.enemies[1],
    troll: biome.enemies[2],
    knight: biome.enemies[1],
    dragon: biome.enemies[3]
  } : null;

  G.enemiesToSpawn = [];
  groups.forEach(g => {
    const mappedType = biomeEnemyMap ? (biomeEnemyMap[g.type] || g.type) : g.type;
    const def = ENEMY_DEFS[mappedType] || ENEMY_DEFS[g.type];
    for (let i = 0; i < g.count; i++) {
      G.enemiesToSpawn.push({
        id: Date.now() + Math.random(),
        type: mappedType, def,
        x: 0, y: PATH_ROW,
        hp: Math.ceil(def.baseHp * hpScale),
        maxHp: Math.ceil(def.baseHp * hpScale),
        speed: def.speed + spdBonus, reward: def.reward,
        damage: Math.ceil(def.damage * dmgMult),
        frozen: false, frozenTurns: 0,
        kills: 0
      });
    }
  });
  G.spawnIndex = 0;
}

function showWavePreview() {
  const modal = document.getElementById('wave-start-modal');
  const isBoss = G.gameMode === 'story' && G.waveInStage === 3;
  const stageData = G.gameMode === 'story' && G.storyStage ? STORY_STAGES[G.storyStage - 1] : null;
  const waveData = stageData ? stageData.waves[G.waveInStage - 1] : null;

  if (G.gameMode === 'story' && stageData) {
    document.getElementById('wsm-title').textContent =
      `${stageData.icon} ${stageData.name} — Wave ${G.waveInStage}/3`;
    document.getElementById('wsm-sub').textContent = waveData
      ? `${waveData.label}: ${waveData.desc}`
      : (isBoss ? '🐉 BOSS WAVE — Face the stage guardian!' : 'Darkness gathers at the gate...');
  } else {
    document.getElementById('wsm-title').textContent = `⚔️ WAVE ${G.wave} INCOMING`;
    document.getElementById('wsm-sub').textContent = G.wave % 10 === 0 ? '🐉 BOSS WAVE — Dragon approaches!' : 'Darkness gathers at the gate...';
  }

  const groups = getWaveEnemies(G.wave);
  const typeCounts = {};
  groups.forEach(g => { typeCounts[g.type] = (typeCounts[g.type] || 0) + g.count; });

  const prevGrid = document.getElementById('wsm-enemies');
  prevGrid.innerHTML = Object.entries(typeCounts).map(([type, count]) => {
    const def = ENEMY_DEFS[type];
    return `<div class="epv-card">
      <span class="epv-ico">${def.icon}</span>
      <div class="epv-name">${def.name}</div>
      <div class="epv-count">×${count}</div>
    </div>`;
  }).join('');

  const goldRwd = 30 + G.wave * 10;
  const diaRwd = isBoss ? 3 : (1 + (G.wave % 10 === 0 ? 5 : 0));
  document.getElementById('wsm-rewards').innerHTML = `
    <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd}</span><span class="ri-lbl">Gold</span></div>
    <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd}</span><span class="ri-lbl">Diamond${diaRwd > 1 ? 's' : ''}</span></div>
    ${isBoss ? '<div class="rwd-item"><span class="ri-icon">💀</span><span class="ri-val">BOSS</span><span class="ri-lbl">Wave</span></div>' : ''}`;

  modal.style.display = 'flex';
}
function closeWaveModal() { document.getElementById('wave-start-modal').style.display = 'none'; }

// ── EXECUTE TURN ──────────────────────────────────────────────
async function executeTurn() {
  if (G.gameOver || G.isAnimating) return;
  G.isAnimating = true;
  setPhase('combat');
  document.getElementById('execute-btn').disabled = true;

  // Spawn next enemy from queue
  if (G.spawnIndex < G.enemiesToSpawn.length) {
    G.enemies.push({ ...G.enemiesToSpawn[G.spawnIndex], justSpawned: true });
    G.spawnIndex++;
  }

  await sleep(120);

  // Towers fire
  let firedAny = false;
  for (const tower of G.towers) {
    const targets = getTargetsInRange(tower);
    if (targets.length === 0) continue;
    firedAny = true;
    const def = TOWER_DEFS[tower.type];

    if (def.type === 'single' || def.type === 'freeze' || def.type === 'heavy') {
      const target = targets[0]; // furthest along path (highest x)
      // Knight deflect ability
      if (target.def.ability === 'deflect' && Math.random() < (target.def.deflectChance || 0.3)) {
        addLog(`🛡️ ${target.def.name} deflected the attack!`, 'log-ability');
        showFloatText(target, 'DEFLECT', '#FCD34D');
        await sleep(80);
        continue;
      }
      const dmg = tower.damage;
      target.hp -= dmg;
      tower.kills = (tower.kills || 0) + 1;
      drawLaser(tower, target, def.id);
      showFloatText(target, `-${dmg}`, '#F87171');
      if (def.type === 'freeze') { target.frozen = true; target.frozenTurns = 1; }
      await sleep(80);

    } else if (def.type === 'splash') {
      const primary = targets[0];
      const splashR = tower.splashRange || 1;
      drawLaser(tower, primary, def.id);
      G.enemies.forEach(e => {
        if (Math.abs(e.x - primary.x) + Math.abs(e.y - primary.y) <= splashR) {
          e.hp -= tower.damage;
          showFloatText(e, `-${tower.damage}`, '#C084FC');
        }
      });
      await sleep(80);

    } else if (def.type === 'chain') {
      let chainTarget = targets[0], chains = tower.chainCount || 3;
      const hit = new Set();
      while (chainTarget && chains > 0) {
        if (hit.has(chainTarget.id)) break;
        hit.add(chainTarget.id);
        chainTarget.hp -= tower.damage;
        drawLaser(tower, chainTarget, def.id);
        showFloatText(chainTarget, `-${tower.damage}`, '#FDE047');
        chains--;
        chainTarget = G.enemies.find(e => !hit.has(e.id) && !e.dead &&
          Math.abs(chainTarget.x - e.x) + Math.abs(chainTarget.y - e.y) <= 2);
        await sleep(60);
      }
    }
  }

  if (firedAny) await sleep(200);

  // Process deaths
  let newGold = 0;
  G.enemies = G.enemies.filter(e => {
    if (e.hp <= 0) {
      G.totalKills++;
      newGold += e.reward;
      G.score += e.reward * 2;
      updateQuestProgress('kill');
      if (e.type === 'dragon') { G.dragonKills++; updateQuestProgress('dragon'); }
      return false;
    }
    return true;
  });
  if (newGold > 0) { G.gold += newGold; addLog(`💰 +${newGold} gold from kills.`, 'log-gold'); showToast(`+${newGold}🪙`, 'tsuccess'); }

  renderBoard(); await sleep(150);

  // Enemies move
  if (!G.frozenTurn) {
    const toRemove = [];
    G.enemies.forEach(e => {
      if (e.justSpawned) { e.justSpawned = false; return; } // don't move on spawn turn — prevents 1-tile gap
      if (e.frozen && e.frozenTurns > 0) { e.frozenTurns--; if (e.frozenTurns <= 0) e.frozen = false; return; }
      // Troll regeneration
      if (e.def.ability === 'regen' && e.hp < e.maxHp && e.hp > 0) {
        const regen = e.def.regenAmt || 8;
        e.hp = Math.min(e.maxHp, e.hp + regen);
        showFloatText(e, `+${regen}`, '#34D399');
      }
      // Goblin dash (extra move chance)
      const extraMove = (e.def.ability === 'dash' && Math.random() < (e.def.abilityChance || 0.25)) ? 1 : 0;
      e.x += e.speed + extraMove;
      if (extraMove > 0) addLog(`💨 Goblin dashed forward!`, 'log-ability');
      if (e.x >= GRID_W - 1) {
        // Dragon breath — damages a random tower on breach
        if (e.def.ability === 'breath' && G.towers.length > 0) {
          const idx = Math.floor(Math.random() * G.towers.length);
          const hitTower = G.towers[idx];
          const def2 = TOWER_DEFS[hitTower.type];
          addLog(`🔥 Dragon breathed fire — ${def2.name} at [${hitTower.x},${hitTower.y}] scorched! (-1 level)`, 'log-attack');
          showToast(`🔥 Dragon breath hit ${def2.name}!`, 'terror');
          if (hitTower.level > 1) { hitTower.level--; hitTower.upgrades = Math.max(0, hitTower.upgrades - 1); hitTower.damage = Math.max(1, hitTower.damage - 5); }
        }
        const actualDmg = Math.max(1, e.damage - G.tempShield);
        G.hp -= actualDmg;
        addLog(`💀 ${e.def.name} breached the gate! (Castle -${actualDmg}HP)`, 'log-attack');
        showToast(`Castle hit! -${actualDmg}HP!`, 'terror');
        if (gameSettings.vfx) { document.getElementById('shake-wrapper').classList.add('shake'); setTimeout(() => document.getElementById('shake-wrapper').classList.remove('shake'), 450); }
        toRemove.push(e);
      }
    });
    G.enemies = G.enemies.filter(e => !toRemove.includes(e));
    renderBoard(); await sleep(200);
  } else {
    addLog('❄️ Enemies frozen — skipping their move.', 'log-ability');
  }
  G.frozenTurn = false;

  updateHUD(); updateCastleHpBar();

  // Check defeat
  if (G.hp <= 0) {
    G.hp = 0; G.gameOver = true;
    updateHUD(); updateCastleHpBar();
    await handleGameOver();
    G.isAnimating = false;
    return;
  }

  // Wave complete?
  if (G.spawnIndex >= G.enemiesToSpawn.length && G.enemies.length === 0) {
    await waveComplete();
    G.isAnimating = false;
    return;
  }

  G.isAnimating = false;
  setPhase('planning');
  document.getElementById('execute-btn').disabled = false;
  renderTowerSelector(); renderUpgradePanel();

  if (gameSettings.fastMode) setTimeout(executeTurn, 200);
}

// ── TARGETS IN RANGE ──────────────────────────────────────────
function getTargetsInRange(tower) {
  return G.enemies
    .filter(e => Math.abs(tower.x - e.x) + Math.abs(tower.y - e.y) <= tower.range)
    .sort((a, b) => b.x - a.x); // prioritize furthest along
}

// ── WAVE COMPLETE ─────────────────────────────────────────────
async function waveComplete() {
  const goldRwd = 30 + G.wave * 10;
  const isMilestone = G.gameMode === 'extreme' && G.wave % 5 === 0;
  const isBossWave = G.gameMode === 'story' && G.waveInStage === 3;
  const isLastWave = G.gameMode === 'story' && G.waveInStage === 3;
  const diaRwd = isBossWave ? 3 : (1 + (isMilestone ? (G.wave % 10 === 0 ? 5 : 2) : 0));
  const scoreMult = G.gameMode === 'extreme' ? 2 : 1;
  const waveScore = G.wave * 50 * scoreMult;

  // Biome reward bonuses
  const biome = G.activeBiome;
  let biomeGold = 0, biomeDia = 0, biomeHp = 0, biomeExtraLine = '';
  if (biome) {
    if (biome.id === 'volcano') {
      biomeGold = Math.floor(goldRwd * 0.35);
      biomeExtraLine = `<div class="rwd-item"><span class="ri-icon">${biome.reward.icon}</span><span class="ri-val">+${biomeGold}</span><span class="ri-lbl">Ember Bonus</span></div>`;
    } else if (biome.id === 'jungle') {
      biomeHp = 3;
      G.hp = Math.min(G.maxHp, G.hp + biomeHp);
      biomeExtraLine = `<div class="rwd-item"><span class="ri-icon">${biome.reward.icon}</span><span class="ri-val">+${biomeHp} HP</span><span class="ri-lbl">Nature Heal</span></div>`;
    } else if (biome.id === 'forest') {
      biomeDia = diaRwd;
      biomeExtraLine = `<div class="rwd-item"><span class="ri-icon">${biome.reward.icon}</span><span class="ri-val">+${biomeDia}💎</span><span class="ri-lbl">Arcane Bonus</span></div>`;
    } else if (biome.id === 'tundra') {
      biomeGold = biome.reward.gold > 0 ? 5 : 0;
      biomeExtraLine = `<div class="rwd-item"><span class="ri-icon">${biome.reward.icon}</span><span class="ri-val">Frost Slow</span><span class="ri-lbl">Active</span></div>`;
    }
  }

  G.gold += goldRwd + biomeGold; G.diamonds += diaRwd + biomeDia; G.score += waveScore;
  if (G.wave > G.bestWave) G.bestWave = G.wave;
  if (G.activeBiome) saveIslandStat(G.activeBiome.id, G.wave, G.score);
  updateQuestProgress('wave');
  updateDailyProgress('wave', G.wave);

  if (G.hp === G.waveStartHp) {
    updateQuestProgress('nodmg');
    updateDailyProgress('nodmg');
  }

  // ── Story mode: show stage wave complete or stage complete ──
  if (G.gameMode === 'story') {
    const stageData = STORY_STAGES[G.storyStage - 1];

    if (isBossWave) {
      // Stage complete!
      await saveGame();
      const hpLeft = G.hp;
      const maxHp = G.maxHp;
      const hpPct = hpLeft / maxHp;
      const starsEarned = hpPct > 0.66 ? 3 : hpPct > 0.33 ? 2 : 1;

      // Save stage completion
      if (!G.stagesCleared.includes(G.storyStage)) G.stagesCleared.push(G.storyStage);
      G.stageStars[G.storyStage] = Math.max(starsEarned, G.stageStars[G.storyStage] || 0);
      saveStageProgress();

      addLog(`🏆 Stage ${G.storyStage} "${stageData.name}" CLEARED! ${'★'.repeat(starsEarned)} +${goldRwd + biomeGold}🪙 +${diaRwd + biomeDia}💎`, 'log-wave');
      showToast(`🏆 Stage ${G.storyStage} Cleared! ${'★'.repeat(starsEarned)}`, 'tdiamond');

      // Show stage complete modal
      document.getElementById('sc-stage-num').textContent = `Stage ${G.storyStage}`;
      document.getElementById('sc-stage-name').textContent = stageData.name;
      document.getElementById('sc-stage-icon').textContent = stageData.icon;
      document.getElementById('sc-stars').innerHTML = [1, 2, 3].map(s =>
        `<span style="color:${s <= starsEarned ? '#F0C842' : 'rgba(255,255,255,.18)'};font-size:32px;transition:all .3s">★</span>`
      ).join('');
      document.getElementById('sc-rewards').innerHTML = `
        <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd + biomeGold}</span><span class="ri-lbl">Gold</span></div>
        <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd + biomeDia}</span><span class="ri-lbl">Diamonds</span></div>
        <div class="rwd-item"><span class="ri-icon">🏆</span><span class="ri-val">+${waveScore}</span><span class="ri-lbl">Score</span></div>`;

      const nextStage = STORY_STAGES[G.storyStage];
      const nextBtn = document.getElementById('sc-next-btn');
      if (nextStage) {
        nextBtn.style.display = 'block';
        nextBtn.textContent = `▶ ${nextStage.icon} Next: ${nextStage.name}`;
        nextBtn.onclick = () => {
          document.getElementById('stage-complete-modal').style.display = 'none';
          selectStage(G.storyStage + 1);
        };
      } else {
        nextBtn.style.display = 'none';
      }

      document.getElementById('stage-complete-modal').style.display = 'flex';
      G.wave++;
      G.waveInStage = 1;
      updateHUD();
      renderQuests();
      renderDailyChallenges();
      return;
    } else {
      // Wave 1 or 2 complete within a stage — advance to next wave
      addLog(`⚔️ Wave ${G.waveInStage}/3 cleared in Stage "${stageData.name}"! +${goldRwd}🪙 +${diaRwd}💎`, 'log-wave');
      showToast(`Wave ${G.waveInStage}/3 cleared! +${goldRwd}🪙`, 'tsuccess');

      await saveGame();

      // Show wave complete modal with stage progress info
      const wcm = document.getElementById('wave-complete-modal');
      document.getElementById('wcm-icon').textContent = stageData.icon;
      document.getElementById('wcm-title').textContent = `Wave ${G.waveInStage}/3 Cleared!`;
      document.getElementById('wcm-rewards').innerHTML = `
        <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd}</span><span class="ri-lbl">Gold</span></div>
        <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd}</span><span class="ri-lbl">Diamond${diaRwd > 1 ? 's' : ''}</span></div>
        <div class="rwd-item"><span class="ri-icon">🏆</span><span class="ri-val">+${waveScore}</span><span class="ri-lbl">Score</span></div>`;
      const nextWave = stageData.waves[G.waveInStage]; // waveInStage is still 1 or 2
      document.getElementById('wcm-hint').innerHTML =
        `<span style="color:var(--col-dim)">Next: </span><span style="color:${nextWave.boss ? '#F87171' : '#93C5FD'}">${nextWave.label}</span> — ${nextWave.desc}`;

      G.wave++;
      G.waveInStage++;
      buildWaveQueue();
      updateHUD();
      renderQuests();
      renderDailyChallenges();
      wcm.style.display = 'flex';
      return;
    }
  }

  // ── Extreme / non-story path (original code) ──────────────
  addLog(`🏆 Wave ${G.wave} cleared! +${goldRwd + biomeGold}🪙 +${diaRwd + biomeDia}💎 +${waveScore}pts${scoreMult > 1 ? ' (2× Extreme!)' : ''}`, 'log-wave');
  showToast(isMilestone ? `🎯 MILESTONE! Wave ${G.wave}! +${diaRwd + biomeDia}💎` : `Wave ${G.wave} cleared! +${goldRwd + biomeGold}🪙`, 'tdiamond');

  await saveGame();

  const wcm = document.getElementById('wave-complete-modal');
  document.getElementById('wcm-icon').textContent = isMilestone ? '🏆' : (biome ? biome.icon : '⚔️');
  document.getElementById('wcm-title').textContent = isMilestone ? `MILESTONE: WAVE ${G.wave}!` : `Wave ${G.wave} Cleared!`;
  document.getElementById('wcm-rewards').innerHTML = `
    <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd + biomeGold}</span><span class="ri-lbl">Gold</span></div>
    <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd + biomeDia}</span><span class="ri-lbl">Diamond${diaRwd + biomeDia > 1 ? 's' : ''}</span></div>
    <div class="rwd-item"><span class="ri-icon">🏆</span><span class="ri-val">+${waveScore}</span><span class="ri-lbl">Score${scoreMult > 1 ? ' ×2' : ''}</span></div>
    ${biomeExtraLine}`;
  document.getElementById('wcm-hint').textContent = biome
    ? `${biome.icon} ${biome.name} — ${biome.reward.desc}`
    : (G.gameMode === 'extreme' ? `🔥 Extreme Mode — 2× score! Push further!`
      : (isMilestone ? `Milestone bonus! Every 5 waves = extra 💎!` : ''));
  wcm.style.display = 'flex';

  G.wave++;
  buildWaveQueue();
  updateHUD();
  renderQuests();
  renderDailyChallenges();
}

function closeWaveComplete() {
  document.getElementById('wave-complete-modal').style.display = 'none';
  G.waveStartHp = G.hp;
  setPhase('planning');
  document.getElementById('execute-btn').disabled = false;
  renderTowerSelector(); renderUpgradePanel();
  showWavePreview();
}

window.closeStageComplete = function () {
  document.getElementById('stage-complete-modal').style.display = 'none';
  // Go back to stage select
  G.gameOver = true; G.isAnimating = false;
  document.getElementById('game-section').style.display = 'none';
  loadStageProgress();
  showStageSelect();
};

// ── GAME OVER ─────────────────────────────────────────────────
async function handleGameOver() {
  G.gameOver = true;
  if (G.wave > G.bestWave) G.bestWave = G.wave;
  if (G.activeBiome) saveIslandStat(G.activeBiome.id, G.wave, G.score);
  setPhase('combat');
  document.getElementById('go-wave').textContent = G.wave;
  document.getElementById('go-waveval').textContent = G.wave;
  document.getElementById('go-score').textContent = G.score;
  document.getElementById('go-best').textContent = `Best: Wave ${G.bestWave}`;
  document.getElementById('game-over-modal').style.display = 'flex';
  gameSettings.fastMode = false;
  document.querySelectorAll('#btn-set-fastMode,#btn-set-fastMode2').forEach(b => { b.classList.replace('tog-on', 'tog-off'); b.textContent = 'OFF'; });
  await fetch('/api/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ score: G.score }) });
  await saveGame();
}

window.retryWave = function () {
  document.getElementById('game-over-modal').style.display = 'none';
  const skin = CASTLE_SKINS[G.castleSkin] || CASTLE_SKINS.Wooden;
  G.maxHp = skin.maxHp; G.hp = G.maxHp; G.waveStartHp = G.maxHp;
  G.enemies = []; G.spawnIndex = 0; G.gameOver = false; G.isAnimating = false;
  buildWaveQueue();
  createBoard(); renderBoard(); renderTowerSelector(); renderUpgradePanel();
  updateHUD(); setPhase('planning');
  document.getElementById('execute-btn').disabled = false;
  showToast(`Retrying Wave ${G.wave}...`, 'tsuccess');
};

// ── ABILITIES ─────────────────────────────────────────────────
window.castMeteor = function () {
  if (G.isAnimating) return;
  if (G.diamonds < 5) return showToast('Need 5💎 for Meteor!', 'terror');
  G.diamonds -= 5;
  G.abilitiesUsed++;
  updateDailyProgress('ability');
  updateDailyProgress('meteor');
  if (gameSettings.vfx) { const o = document.getElementById('vfx-overlay'); o.style.backgroundColor = 'rgba(239,68,68,0.35)'; o.style.opacity = 1; setTimeout(() => o.style.opacity = 0, 500); document.getElementById('shake-wrapper').classList.add('shake'); setTimeout(() => document.getElementById('shake-wrapper').classList.remove('shake'), 450); }
  const killed = G.enemies.length;
  G.enemies.forEach(e => e.hp = 0);
  G.enemies = [];
  addLog(`☄️ METEOR STRIKE — obliterated ${killed} enemies!`, 'log-ability');
  showToast('☄️ METEOR STRIKE!', 'terror');
  renderBoard(); updateHUD();
};

window.castFreeze = function () {
  if (G.isAnimating) return;
  if (G.diamonds < 2) return showToast('Need 2💎 for Freeze!', 'terror');
  G.diamonds -= 2; G.frozenTurn = true;
  G.enemies.forEach(e => { e.frozen = true; e.frozenTurns = 1; });
  if (gameSettings.vfx) { const o = document.getElementById('vfx-overlay'); o.style.backgroundColor = 'rgba(6,182,212,0.3)'; o.style.opacity = 1; setTimeout(() => o.style.opacity = 0, 500); }
  addLog('❄️ GLOBAL FREEZE — enemies halted this turn!', 'log-ability');
  showToast('❄️ FROZEN!', 'tdiamond');
  renderBoard(); updateHUD();
};

window.castLightning = function () {
  if (G.isAnimating) return;
  if (G.diamonds < 3) return showToast('Need 3💎 for Strike!', 'terror');
  G.diamonds -= 3;
  const targets = [...G.enemies].sort((a, b) => b.hp - a.hp).slice(0, 3);
  targets.forEach(e => { e.hp -= 60; showFloatText(e, '-60⚡', '#FDE047'); });
  G.enemies = G.enemies.filter(e => e.hp > 0);
  addLog(`⚡ LIGHTNING STRIKE — blasted ${targets.length} enemies for 60 dmg each!`, 'log-ability');
  showToast('⚡ LIGHTNING STRIKE!', 'tdiamond');
  renderBoard(); updateHUD();
};

window.castRepair = function () {
  if (G.isAnimating) return;
  if (G.diamonds < 4) return showToast('Need 4💎 for Repair!', 'terror');
  G.diamonds -= 4;
  const healed = Math.min(3, G.maxHp - G.hp);
  G.hp = Math.min(G.maxHp, G.hp + 3);
  updateCastleHpBar();
  addLog(`🛡️ CASTLE REPAIRED — restored ${healed} HP.`, 'log-ability');
  showToast(`🛡️ Castle repaired! +${healed}HP`, 'tsuccess');
  updateHUD();
};

// ── RENDER BOARD ──────────────────────────────────────────────
function getCastleSVG(skinKey) {
  const castles = {
    Wooden: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <!-- Base ground -->
      <rect x="0" y="82" width="80" height="8" rx="2" fill="#3D1F08" opacity="0.6"/>
      <!-- Left tower -->
      <rect x="2" y="22" width="18" height="62" rx="1" fill="#7A3810"/>
      <!-- battlements left -->
      <rect x="2" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <rect x="8" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <rect x="14" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <!-- wood grain left -->
      <line x1="5" y1="26" x2="18" y2="26" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="5" y1="34" x2="18" y2="34" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="5" y1="42" x2="18" y2="42" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="5" y1="50" x2="18" y2="50" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="5" y1="58" x2="18" y2="58" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <!-- window left -->
      <rect x="7" y="30" width="7" height="9" rx="1" fill="#1A0A03"/>
      <line x1="10" y1="30" x2="10" y2="39" stroke="#A0622A" stroke-width="0.8" opacity="0.6"/>
      <!-- Right tower -->
      <rect x="60" y="22" width="18" height="62" rx="1" fill="#7A3810"/>
      <!-- battlements right -->
      <rect x="60" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <rect x="66" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <rect x="72" y="14" width="4" height="10" rx="1" fill="#7A3810"/>
      <!-- wood grain right -->
      <line x1="62" y1="26" x2="76" y2="26" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="62" y1="34" x2="76" y2="34" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="62" y1="42" x2="76" y2="42" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="62" y1="50" x2="76" y2="50" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <line x1="62" y1="58" x2="76" y2="58" stroke="#5C2A0A" stroke-width="1" opacity="0.7"/>
      <!-- window right -->
      <rect x="66" y="30" width="7" height="9" rx="1" fill="#1A0A03"/>
      <line x1="69" y1="30" x2="69" y2="39" stroke="#A0622A" stroke-width="0.8" opacity="0.6"/>
      <!-- Center wall -->
      <rect x="18" y="34" width="44" height="50" rx="1" fill="#9B4A14"/>
      <!-- center battlements -->
      <rect x="18" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <rect x="26" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <rect x="34" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <rect x="42" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <rect x="51" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <rect x="57" y="26" width="5" height="10" rx="1" fill="#9B4A14"/>
      <!-- wood grain center -->
      <line x1="20" y1="42" x2="60" y2="42" stroke="#7A3810" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="54" x2="60" y2="54" stroke="#7A3810" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="66" x2="60" y2="66" stroke="#7A3810" stroke-width="1" opacity="0.5"/>
      <!-- Gate arch -->
      <rect x="30" y="60" width="20" height="24" rx="2" fill="#1A0A03"/>
      <ellipse cx="40" cy="60" rx="10" ry="6" fill="#1A0A03"/>
      <!-- gate bars -->
      <line x1="34" y1="60" x2="34" y2="84" stroke="#3D1800" stroke-width="1.5"/>
      <line x1="38" y1="60" x2="38" y2="84" stroke="#3D1800" stroke-width="1.5"/>
      <line x1="42" y1="60" x2="42" y2="84" stroke="#3D1800" stroke-width="1.5"/>
      <line x1="46" y1="60" x2="46" y2="84" stroke="#3D1800" stroke-width="1.5"/>
      <line x1="30" y1="68" x2="50" y2="68" stroke="#3D1800" stroke-width="1"/>
      <line x1="30" y1="74" x2="50" y2="74" stroke="#3D1800" stroke-width="1"/>
      <!-- Center windows -->
      <rect x="22" y="40" width="8" height="10" rx="1" fill="#1A0A03"/>
      <rect x="50" y="40" width="8" height="10" rx="1" fill="#1A0A03"/>
      <!-- Flag -->
      <line x1="40" y1="2" x2="40" y2="20" stroke="#6B3A1F" stroke-width="1.5"/>
      <polygon points="40,2 54,7 40,12" fill="#DC2626"/>
      <!-- Torch glow -->
      <circle cx="26" cy="36" r="2" fill="#F59E0B" opacity="0.8"/>
      <circle cx="54" cy="36" r="2" fill="#F59E0B" opacity="0.8"/>
    </svg>`,

    Stone: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <!-- Base -->
      <rect x="0" y="82" width="80" height="8" rx="2" fill="#1F2937" opacity="0.7"/>
      <!-- Left tower -->
      <rect x="2" y="20" width="19" height="64" rx="1" fill="#4B5563"/>
      <!-- stone texture left -->
      <rect x="3" y="25" width="8" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="13" y="25" width="7" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="3" y="32" width="5" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="10" y="32" width="9" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="3" y="39" width="10" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="15" y="39" width="5" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <!-- battlements left -->
      <rect x="2" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <rect x="8" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <rect x="15" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <!-- window left -->
      <rect x="6" y="48" width="9" height="13" rx="1" fill="#0F172A"/>
      <ellipse cx="10" cy="48" rx="4" ry="3" fill="#0F172A"/>
      <!-- Right tower -->
      <rect x="59" y="20" width="19" height="64" rx="1" fill="#4B5563"/>
      <!-- stone texture right -->
      <rect x="60" y="25" width="8" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="70" y="25" width="7" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="60" y="32" width="9" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="71" y="32" width="6" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="62" y="39" width="10" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <rect x="74" y="39" width="4" height="5" rx="0.5" fill="#374151" opacity="0.8"/>
      <!-- battlements right -->
      <rect x="59" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <rect x="66" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <rect x="73" y="12" width="4" height="10" rx="1" fill="#6B7280"/>
      <!-- window right -->
      <rect x="65" y="48" width="9" height="13" rx="1" fill="#0F172A"/>
      <ellipse cx="69" cy="48" rx="4" ry="3" fill="#0F172A"/>
      <!-- Center wall -->
      <rect x="19" y="32" width="42" height="52" rx="1" fill="#6B7280"/>
      <!-- stone texture center -->
      <rect x="20" y="35" width="12" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="34" y="35" width="14" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="50" y="35" width="10" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="20" y="43" width="8" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="30" y="43" width="10" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="42" y="43" width="18" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="20" y="51" width="14" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="36" y="51" width="8" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <rect x="46" y="51" width="14" height="6" rx="0.5" fill="#4B5563" opacity="0.7"/>
      <!-- center battlements -->
      <rect x="19" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <rect x="27" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <rect x="35" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <rect x="43" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <rect x="51" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <rect x="56" y="24" width="5" height="10" rx="1" fill="#6B7280"/>
      <!-- Gate -->
      <rect x="30" y="58" width="20" height="26" rx="1" fill="#0F172A"/>
      <ellipse cx="40" cy="58" rx="10" ry="7" fill="#0F172A"/>
      <!-- portcullis bars -->
      <line x1="34" y1="58" x2="34" y2="84" stroke="#1E293B" stroke-width="2"/>
      <line x1="38" y1="58" x2="38" y2="84" stroke="#1E293B" stroke-width="2"/>
      <line x1="42" y1="58" x2="42" y2="84" stroke="#1E293B" stroke-width="2"/>
      <line x1="46" y1="58" x2="46" y2="84" stroke="#1E293B" stroke-width="2"/>
      <line x1="30" y1="66" x2="50" y2="66" stroke="#1E293B" stroke-width="1.5"/>
      <line x1="30" y1="74" x2="50" y2="74" stroke="#1E293B" stroke-width="1.5"/>
      <!-- side windows -->
      <rect x="21" y="44" width="7" height="12" rx="1" fill="#0F172A"/>
      <ellipse cx="24" cy="44" rx="3" ry="2.5" fill="#0F172A"/>
      <rect x="52" y="44" width="7" height="12" rx="1" fill="#0F172A"/>
      <ellipse cx="55" cy="44" rx="3" ry="2.5" fill="#0F172A"/>
      <!-- Banner -->
      <line x1="40" y1="2" x2="40" y2="18" stroke="#9CA3AF" stroke-width="1.5"/>
      <polygon points="40,4 52,8 40,13" fill="#1D4ED8"/>
      <!-- Torch -->
      <circle cx="28" cy="33" r="2" fill="#F59E0B" opacity="0.9"/>
      <circle cx="52" cy="33" r="2" fill="#F59E0B" opacity="0.9"/>
    </svg>`,

    Crystal: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <defs>
        <linearGradient id="crySpire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E0F7FF"/>
          <stop offset="40%" stop-color="#67E8F9"/>
          <stop offset="100%" stop-color="#0891B2"/>
        </linearGradient>
        <linearGradient id="cryBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#A5F3FC"/>
          <stop offset="60%" stop-color="#0EA5E9"/>
          <stop offset="100%" stop-color="#075985"/>
        </linearGradient>
        <filter id="crystalGlowF">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Base platform -->
      <ellipse cx="40" cy="84" rx="34" ry="5" fill="#083344" opacity="0.7"/>
      <rect x="8" y="74" width="64" height="12" rx="3" fill="#0C4A6E" opacity="0.9"/>
      <!-- Small crystal clusters left -->
      <polygon points="8,74 12,50 16,74" fill="url(#crySpire)" opacity="0.5"/>
      <polygon points="12,74 15,60 18,74" fill="url(#crySpire)" opacity="0.6"/>
      <!-- Small crystal clusters right -->
      <polygon points="64,74 68,50 72,74" fill="url(#crySpire)" opacity="0.5"/>
      <polygon points="62,74 65,60 68,74" fill="url(#crySpire)" opacity="0.6"/>
      <!-- Left flanking spire -->
      <polygon points="18,74 23,30 28,74" fill="url(#cryBody)" opacity="0.85"/>
      <polygon points="19,74 23,30 24,74" fill="#E0F7FF" opacity="0.25"/>
      <!-- Right flanking spire -->
      <polygon points="52,74 57,30 62,74" fill="url(#cryBody)" opacity="0.85"/>
      <polygon points="57,30 58,74 62,74" fill="#E0F7FF" opacity="0.25"/>
      <!-- Main central spire (tall) -->
      <polygon points="32,74 40,2 48,74" fill="url(#crySpire)" filter="url(#crystalGlowF)"/>
      <!-- Crystal facets main spire -->
      <polygon points="32,74 40,2 36,74" fill="#E0F7FF" opacity="0.35"/>
      <polygon points="40,2 44,74 48,74" fill="#0C4A6E" opacity="0.3"/>
      <!-- Secondary left spire -->
      <polygon points="24,74 30,18 36,74" fill="url(#cryBody)" opacity="0.9"/>
      <polygon points="25,74 30,18 31,74" fill="#E0F7FF" opacity="0.3"/>
      <!-- Secondary right spire -->
      <polygon points="44,74 50,18 56,74" fill="url(#cryBody)" opacity="0.9"/>
      <polygon points="50,18 51,74 56,74" fill="#0C4A6E" opacity="0.3"/>
      <!-- Crystal palace base domes -->
      <ellipse cx="22" cy="74" rx="9" ry="5" fill="#0891B2" opacity="0.7"/>
      <ellipse cx="58" cy="74" rx="9" ry="5" fill="#0891B2" opacity="0.7"/>
      <ellipse cx="40" cy="74" rx="14" ry="6" fill="#0C4A6E" opacity="0.9"/>
      <!-- Gate arch -->
      <rect x="33" y="62" width="14" height="18" rx="1" fill="#042030"/>
      <ellipse cx="40" cy="62" rx="7" ry="5" fill="#042030"/>
      <!-- Glow orbs on spire tips -->
      <circle cx="40" cy="4" r="2.5" fill="#E0F7FF" opacity="0.95" filter="url(#crystalGlowF)"/>
      <circle cx="30" cy="20" r="1.5" fill="#BAE6FD" opacity="0.9"/>
      <circle cx="50" cy="20" r="1.5" fill="#BAE6FD" opacity="0.9"/>
      <circle cx="23" cy="32" r="1" fill="#BAE6FD" opacity="0.8"/>
      <circle cx="57" cy="32" r="1" fill="#BAE6FD" opacity="0.8"/>
      <!-- Sparkles -->
      <circle cx="15" cy="55" r="1" fill="#E0F7FF" opacity="0.7"/>
      <circle cx="65" cy="48" r="1" fill="#E0F7FF" opacity="0.7"/>
      <circle cx="10" cy="65" r="0.8" fill="#BAE6FD" opacity="0.6"/>
      <circle cx="70" cy="60" r="0.8" fill="#BAE6FD" opacity="0.6"/>
    </svg>`,

    Infernal: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <defs>
        <linearGradient id="infWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7C2D12"/>
          <stop offset="100%" stop-color="#431407"/>
        </linearGradient>
        <linearGradient id="infSpire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="30%" stop-color="#F97316"/>
          <stop offset="100%" stop-color="#7C2D12"/>
        </linearGradient>
        <filter id="fireGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Lava base -->
      <rect x="0" y="80" width="80" height="10" rx="2" fill="#431407"/>
      <ellipse cx="20" cy="80" rx="8" ry="3" fill="#DC2626" opacity="0.6"/>
      <ellipse cx="60" cy="80" rx="8" ry="3" fill="#DC2626" opacity="0.6"/>
      <!-- Left tower -->
      <rect x="2" y="24" width="18" height="58" rx="1" fill="url(#infWall)"/>
      <!-- obsidian bands left -->
      <rect x="2" y="30" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <rect x="2" y="42" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <rect x="2" y="54" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <!-- demon spire left -->
      <polygon points="2,24 11,4 20,24" fill="url(#infSpire)" filter="url(#fireGlow)"/>
      <polygon points="4,24 11,8 13,24" fill="#FCD34D" opacity="0.25"/>
      <!-- crenels left (spiked) -->
      <polygon points="2,24 5,16 8,24" fill="#431407"/>
      <polygon points="8,24 11,14 14,24" fill="#431407"/>
      <polygon points="14,24 17,16 20,24" fill="#431407"/>
      <!-- glowing window left -->
      <rect x="6" y="44" width="8" height="11" rx="1" fill="#7C2D12"/>
      <ellipse cx="10" cy="44" rx="4" ry="3" fill="#7C2D12"/>
      <rect x="7" y="45" width="6" height="9" rx="1" fill="#FCD34D" opacity="0.4"/>
      <!-- Right tower -->
      <rect x="60" y="24" width="18" height="58" rx="1" fill="url(#infWall)"/>
      <!-- obsidian bands right -->
      <rect x="60" y="30" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <rect x="60" y="42" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <rect x="60" y="54" width="18" height="3" fill="#1A0A04" opacity="0.8"/>
      <!-- demon spire right -->
      <polygon points="60,24 69,4 78,24" fill="url(#infSpire)" filter="url(#fireGlow)"/>
      <polygon points="67,24 69,8 71,24" fill="#FCD34D" opacity="0.25"/>
      <!-- crenels right (spiked) -->
      <polygon points="60,24 63,16 66,24" fill="#431407"/>
      <polygon points="66,24 69,14 72,24" fill="#431407"/>
      <polygon points="72,24 75,16 78,24" fill="#431407"/>
      <!-- glowing window right -->
      <rect x="66" y="44" width="8" height="11" rx="1" fill="#7C2D12"/>
      <ellipse cx="70" cy="44" rx="4" ry="3" fill="#7C2D12"/>
      <rect x="67" y="45" width="6" height="9" rx="1" fill="#FCD34D" opacity="0.4"/>
      <!-- Central citadel -->
      <rect x="18" y="36" width="44" height="46" rx="1" fill="url(#infWall)"/>
      <!-- obsidian bands center -->
      <rect x="18" y="42" width="44" height="3" fill="#1A0A04" opacity="0.7"/>
      <rect x="18" y="54" width="44" height="3" fill="#1A0A04" opacity="0.7"/>
      <rect x="18" y="66" width="44" height="3" fill="#1A0A04" opacity="0.7"/>
      <!-- Center spiked battlements -->
      <polygon points="18,36 22,24 26,36" fill="#431407"/>
      <polygon points="26,36 30,24 34,36" fill="#431407"/>
      <polygon points="34,36 38,22 42,36" fill="#431407"/>
      <polygon points="42,36 46,24 50,36" fill="#431407"/>
      <polygon points="50,36 54,24 58,36" fill="#431407"/>
      <polygon points="58,36 62,24 62,36" fill="#431407"/>
      <!-- Main center spire -->
      <polygon points="30,36 40,0 50,36" fill="url(#infSpire)" filter="url(#fireGlow)"/>
      <polygon points="32,36 40,4 42,36" fill="#FCD34D" opacity="0.3"/>
      <!-- Gate of hellfire -->
      <rect x="30" y="58" width="20" height="24" rx="1" fill="#0D0503"/>
      <ellipse cx="40" cy="58" rx="10" ry="7" fill="#0D0503"/>
      <!-- lava glow in gate -->
      <ellipse cx="40" cy="75" rx="7" ry="3" fill="#DC2626" opacity="0.5"/>
      <!-- side windows glowing -->
      <rect x="20" y="44" width="8" height="11" rx="1" fill="#FCD34D" opacity="0.25"/>
      <rect x="52" y="44" width="8" height="11" rx="1" fill="#FCD34D" opacity="0.25"/>
      <!-- Fire glow orbs -->
      <circle cx="40" cy="2" r="3" fill="#FCD34D" opacity="0.9" filter="url(#fireGlow)"/>
      <circle cx="11" cy="6" r="2" fill="#F97316" opacity="0.85" filter="url(#fireGlow)"/>
      <circle cx="69" cy="6" r="2" fill="#F97316" opacity="0.85" filter="url(#fireGlow)"/>
      <!-- floating embers -->
      <circle cx="14" cy="50" r="1" fill="#FCD34D" opacity="0.7"/>
      <circle cx="66" cy="44" r="1" fill="#FCD34D" opacity="0.7"/>
      <circle cx="22" cy="32" r="0.8" fill="#F97316" opacity="0.6"/>
      <circle cx="58" cy="28" r="0.8" fill="#F97316" opacity="0.6"/>
    </svg>`,

    Celestial: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <defs>
        <linearGradient id="celBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8B5CF6"/>
          <stop offset="60%" stop-color="#6D28D9"/>
          <stop offset="100%" stop-color="#2E1065"/>
        </linearGradient>
        <linearGradient id="celGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FEF3C7"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <radialGradient id="celAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#DDD6FE" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <filter id="celGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Aura halo -->
      <ellipse cx="40" cy="45" rx="38" ry="42" fill="url(#celAura)"/>
      <!-- Base cloud platform -->
      <ellipse cx="40" cy="84" rx="34" ry="5" fill="#4C1D95" opacity="0.5"/>
      <rect x="8" y="76" width="64" height="10" rx="5" fill="#5B21B6" opacity="0.7"/>
      <!-- Gold trim base -->
      <rect x="10" y="74" width="60" height="3" rx="1" fill="url(#celGold)" opacity="0.8"/>
      <!-- Left column -->
      <rect x="4" y="36" width="14" height="42" rx="2" fill="url(#celBody)"/>
      <rect x="3" y="34" width="16" height="4" rx="1" fill="url(#celGold)" opacity="0.9"/>
      <!-- celestial spire left -->
      <polygon points="4,36 11,6 18,36" fill="url(#celBody)" filter="url(#celGlow)"/>
      <polygon points="5,36 11,10 12,36" fill="#DDD6FE" opacity="0.3"/>
      <circle cx="11" cy="6" r="2.5" fill="#FEF3C7" opacity="0.95" filter="url(#celGlow)"/>
      <!-- stars on left spire -->
      <circle cx="9" cy="20" r="0.8" fill="#FEF3C7" opacity="0.8"/>
      <circle cx="13" cy="26" r="0.8" fill="#FEF3C7" opacity="0.8"/>
      <!-- gold ring left column -->
      <rect x="4" y="52" width="14" height="2.5" rx="1" fill="url(#celGold)" opacity="0.8"/>
      <rect x="4" y="60" width="14" height="2.5" rx="1" fill="url(#celGold)" opacity="0.8"/>
      <!-- window left -->
      <rect x="7" y="40" width="8" height="11" rx="2" fill="#1E0A3C"/>
      <ellipse cx="11" cy="40" rx="4" ry="3" fill="#1E0A3C"/>
      <circle cx="11" cy="46" r="2.5" fill="#A78BFA" opacity="0.7"/>
      <!-- Right column -->
      <rect x="62" y="36" width="14" height="42" rx="2" fill="url(#celBody)"/>
      <rect x="61" y="34" width="16" height="4" rx="1" fill="url(#celGold)" opacity="0.9"/>
      <!-- celestial spire right -->
      <polygon points="62,36 69,6 76,36" fill="url(#celBody)" filter="url(#celGlow)"/>
      <polygon points="68,36 69,10 70,36" fill="#DDD6FE" opacity="0.3"/>
      <circle cx="69" cy="6" r="2.5" fill="#FEF3C7" opacity="0.95" filter="url(#celGlow)"/>
      <circle cx="67" cy="20" r="0.8" fill="#FEF3C7" opacity="0.8"/>
      <circle cx="71" cy="26" r="0.8" fill="#FEF3C7" opacity="0.8"/>
      <rect x="62" y="52" width="14" height="2.5" rx="1" fill="url(#celGold)" opacity="0.8"/>
      <rect x="62" y="60" width="14" height="2.5" rx="1" fill="url(#celGold)" opacity="0.8"/>
      <rect x="65" y="40" width="8" height="11" rx="2" fill="#1E0A3C"/>
      <ellipse cx="69" cy="40" rx="4" ry="3" fill="#1E0A3C"/>
      <circle cx="69" cy="46" r="2.5" fill="#A78BFA" opacity="0.7"/>
      <!-- Central throne hall -->
      <rect x="16" y="38" width="48" height="40" rx="2" fill="url(#celBody)"/>
      <rect x="14" y="35" width="52" height="5" rx="1" fill="url(#celGold)" opacity="0.9"/>
      <!-- gold rings center -->
      <rect x="16" y="52" width="48" height="2.5" rx="1" fill="url(#celGold)" opacity="0.7"/>
      <rect x="16" y="62" width="48" height="2.5" rx="1" fill="url(#celGold)" opacity="0.7"/>
      <!-- Center grand spire -->
      <polygon points="26,38 40,0 54,38" fill="url(#celBody)" filter="url(#celGlow)"/>
      <polygon points="28,38 40,4 42,38" fill="#DDD6FE" opacity="0.35"/>
      <!-- twin secondary spires -->
      <polygon points="16,38 24,12 32,38" fill="url(#celBody)" opacity="0.9"/>
      <polygon points="18,38 24,16 25,38" fill="#DDD6FE" opacity="0.25"/>
      <polygon points="48,38 56,12 64,38" fill="url(#celBody)" opacity="0.9"/>
      <polygon points="56,12 57,38 64,38" fill="#DDD6FE" opacity="0.25"/>
      <!-- Glowing orbs on spires -->
      <circle cx="40" cy="2" r="3" fill="#FEF3C7" opacity="1" filter="url(#celGlow)"/>
      <circle cx="24" cy="14" r="2" fill="#FEF3C7" opacity="0.9" filter="url(#celGlow)"/>
      <circle cx="56" cy="14" r="2" fill="#FEF3C7" opacity="0.9" filter="url(#celGlow)"/>
      <!-- Grand gate -->
      <rect x="30" y="56" width="20" height="22" rx="2" fill="#1E0A3C"/>
      <ellipse cx="40" cy="56" rx="10" ry="7" fill="#1E0A3C"/>
      <!-- arcane symbol in gate -->
      <circle cx="40" cy="64" r="5" fill="#3B1266" opacity="0.8"/>
      <circle cx="40" cy="64" r="3" fill="#7C3AED" opacity="0.6"/>
      <circle cx="40" cy="64" r="1.5" fill="#DDD6FE" opacity="0.8"/>
      <!-- Floating stars -->
      <circle cx="8" cy="40" r="1" fill="#FEF3C7" opacity="0.9"/>
      <circle cx="72" cy="35" r="1" fill="#FEF3C7" opacity="0.9"/>
      <circle cx="6" cy="55" r="0.8" fill="#DDD6FE" opacity="0.7"/>
      <circle cx="74" cy="58" r="0.8" fill="#DDD6FE" opacity="0.7"/>
      <circle cx="12" cy="70" r="0.8" fill="#DDD6FE" opacity="0.6"/>
      <circle cx="68" cy="72" r="0.8" fill="#DDD6FE" opacity="0.6"/>
    </svg>`
  };
  return castles[skinKey] || castles.Wooden;
}

function getTowerSVG(type) {
  const svgs = {
    archer: `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <rect x="2" y="2" width="7" height="10" rx="1" fill="#7A3510"/>
      <rect x="16" y="2" width="8" height="10" rx="1" fill="#7A3510"/>
      <rect x="31" y="2" width="7" height="10" rx="1" fill="#7A3510"/>
      <rect x="2" y="9" width="36" height="4" fill="#A85F18"/>
      <rect x="4" y="13" width="32" height="43" rx="1" fill="#C97820"/>
      <line x1="4" y1="21" x2="36" y2="21" stroke="#7A3510" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="29" x2="36" y2="29" stroke="#7A3510" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="37" x2="36" y2="37" stroke="#7A3510" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="45" x2="36" y2="45" stroke="#7A3510" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="13" x2="20" y2="21" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <line x1="12" y1="21" x2="12" y2="29" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <line x1="28" y1="21" x2="28" y2="29" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <line x1="20" y1="29" x2="20" y2="37" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <line x1="12" y1="37" x2="12" y2="45" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <line x1="28" y1="37" x2="28" y2="45" stroke="#7A3510" stroke-width="0.8" opacity="0.35"/>
      <rect x="18" y="23" width="4" height="10" rx="0.5" fill="#1a0800"/>
      <rect x="15" y="27" width="10" height="3" rx="0.5" fill="#1a0800"/>
      <rect x="14" y="48" width="12" height="8" rx="5" fill="#1a0800"/>
    </svg>`,

    mage: `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <polygon points="20,0 6,14 34,14" fill="#3B1A8F"/>
      <line x1="20" y1="0" x2="20" y2="5" stroke="#DDD6FE" stroke-width="1.5"/>
      <circle cx="20" cy="0" r="1.5" fill="#DDD6FE"/>
      <rect x="6" y="12" width="28" height="44" rx="1" fill="#7C3AED"/>
      <line x1="6" y1="20" x2="34" y2="20" stroke="#4C1D95" stroke-width="1" opacity="0.5"/>
      <line x1="6" y1="28" x2="34" y2="28" stroke="#4C1D95" stroke-width="1" opacity="0.5"/>
      <line x1="6" y1="36" x2="34" y2="36" stroke="#4C1D95" stroke-width="1" opacity="0.5"/>
      <line x1="6" y1="44" x2="34" y2="44" stroke="#4C1D95" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="12" x2="20" y2="20" stroke="#4C1D95" stroke-width="0.8" opacity="0.35"/>
      <line x1="13" y1="20" x2="13" y2="28" stroke="#4C1D95" stroke-width="0.8" opacity="0.35"/>
      <line x1="27" y1="20" x2="27" y2="28" stroke="#4C1D95" stroke-width="0.8" opacity="0.35"/>
      <circle cx="20" cy="28" r="6" fill="#1e0a3c"/>
      <circle cx="20" cy="28" r="4.5" fill="#A78BFA" opacity="0.75"/>
      <circle cx="18" cy="26" r="1.5" fill="white" opacity="0.6"/>
      <rect x="14" y="48" width="12" height="8" rx="5" fill="#1e0a3c"/>
    </svg>`,

    cannon: `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <rect x="1" y="2" width="7" height="10" rx="1" fill="#111827"/>
      <rect x="12" y="2" width="7" height="10" rx="1" fill="#111827"/>
      <rect x="22" y="2" width="7" height="10" rx="1" fill="#111827"/>
      <rect x="32" y="2" width="7" height="10" rx="1" fill="#111827"/>
      <rect x="1" y="9" width="38" height="4" fill="#1F2937"/>
      <rect x="2" y="13" width="36" height="43" rx="1" fill="#374151"/>
      <line x1="2" y1="21" x2="38" y2="21" stroke="#111827" stroke-width="1" opacity="0.6"/>
      <line x1="2" y1="29" x2="38" y2="29" stroke="#111827" stroke-width="1" opacity="0.6"/>
      <line x1="2" y1="37" x2="38" y2="37" stroke="#111827" stroke-width="1" opacity="0.6"/>
      <line x1="2" y1="45" x2="38" y2="45" stroke="#111827" stroke-width="1" opacity="0.6"/>
      <line x1="20" y1="13" x2="20" y2="21" stroke="#111827" stroke-width="0.8" opacity="0.4"/>
      <line x1="11" y1="21" x2="11" y2="29" stroke="#111827" stroke-width="0.8" opacity="0.4"/>
      <line x1="29" y1="21" x2="29" y2="29" stroke="#111827" stroke-width="0.8" opacity="0.4"/>
      <circle cx="20" cy="28" r="6.5" fill="#070d14"/>
      <circle cx="20" cy="28" r="4.5" fill="#1a2330"/>
      <rect x="25" y="25.5" width="13" height="5" rx="2" fill="#111827"/>
      <rect x="36" y="26.5" width="3" height="3" rx="1" fill="#070d14"/>
      <rect x="14" y="48" width="12" height="8" rx="5" fill="#070d14"/>
    </svg>`,

    frost: `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <rect x="2" y="2" width="7" height="10" rx="1" fill="#0C3B6E"/>
      <rect x="16" y="2" width="8" height="10" rx="1" fill="#0C3B6E"/>
      <rect x="31" y="2" width="7" height="10" rx="1" fill="#0C3B6E"/>
      <polygon points="4,12 5.5,19 7,12" fill="#BAE6FD" opacity="0.9"/>
      <polygon points="7,12 8,16 9,12" fill="#BAE6FD" opacity="0.7"/>
      <polygon points="18,12 19.5,19 21,12" fill="#BAE6FD" opacity="0.9"/>
      <polygon points="21,12 22,16 23,12" fill="#BAE6FD" opacity="0.7"/>
      <polygon points="33,12 34.5,19 36,12" fill="#BAE6FD" opacity="0.9"/>
      <rect x="2" y="9" width="36" height="4" fill="#0369A1"/>
      <rect x="4" y="13" width="32" height="43" rx="1" fill="#1D7DB5"/>
      <line x1="4" y1="21" x2="36" y2="21" stroke="#0C3B6E" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="29" x2="36" y2="29" stroke="#0C3B6E" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="37" x2="36" y2="37" stroke="#0C3B6E" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="45" x2="36" y2="45" stroke="#0C3B6E" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="13" x2="20" y2="21" stroke="#0C3B6E" stroke-width="0.8" opacity="0.35"/>
      <line x1="12" y1="21" x2="12" y2="29" stroke="#0C3B6E" stroke-width="0.8" opacity="0.35"/>
      <line x1="28" y1="21" x2="28" y2="29" stroke="#0C3B6E" stroke-width="0.8" opacity="0.35"/>
      <circle cx="20" cy="28" r="6" fill="#061a2e" opacity="0.9"/>
      <line x1="20" y1="22" x2="20" y2="34" stroke="#7DD3FC" stroke-width="1.5"/>
      <line x1="14" y1="28" x2="26" y2="28" stroke="#7DD3FC" stroke-width="1.5"/>
      <line x1="15.8" y1="23.8" x2="24.2" y2="32.2" stroke="#7DD3FC" stroke-width="1"/>
      <line x1="24.2" y1="23.8" x2="15.8" y2="32.2" stroke="#7DD3FC" stroke-width="1"/>
      <rect x="14" y="48" width="12" height="8" rx="5" fill="#061a2e"/>
    </svg>`,

    tesla: `<svg viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <line x1="20" y1="0" x2="20" y2="5" stroke="#FDE047" stroke-width="2"/>
      <circle cx="20" cy="0" r="2" fill="#FDE047"/>
      <line x1="14" y1="4" x2="26" y2="4" stroke="#FDE047" stroke-width="1" opacity="0.7"/>
      <rect x="2" y="4" width="7" height="9" rx="1" fill="#5C3008"/>
      <rect x="16" y="4" width="8" height="9" rx="1" fill="#5C3008"/>
      <rect x="31" y="4" width="7" height="9" rx="1" fill="#5C3008"/>
      <rect x="2" y="10" width="36" height="4" fill="#8A6200"/>
      <rect x="4" y="14" width="32" height="42" rx="1" fill="#B58500"/>
      <line x1="4" y1="22" x2="36" y2="22" stroke="#5C3008" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="30" x2="36" y2="30" stroke="#5C3008" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="38" x2="36" y2="38" stroke="#5C3008" stroke-width="1" opacity="0.5"/>
      <line x1="4" y1="46" x2="36" y2="46" stroke="#5C3008" stroke-width="1" opacity="0.5"/>
      <line x1="20" y1="14" x2="20" y2="22" stroke="#5C3008" stroke-width="0.8" opacity="0.35"/>
      <line x1="12" y1="22" x2="12" y2="30" stroke="#5C3008" stroke-width="0.8" opacity="0.35"/>
      <line x1="28" y1="22" x2="28" y2="30" stroke="#5C3008" stroke-width="0.8" opacity="0.35"/>
      <circle cx="20" cy="29" r="6" fill="#2a1500" opacity="0.9"/>
      <path d="M22,23 L17,30 L21,30 L18,37 L24,28 L20,28 L23,23 Z" fill="#FDE047" opacity="0.95"/>
      <rect x="14" y="48" width="12" height="8" rx="5" fill="#2a1500"/>
    </svg>`
  };
  return svgs[type] || svgs.archer;
}

function renderBoard() {
  // Clear old towers/enemies/hp-bars
  document.querySelectorAll('.tower-el, .enemy-el, .enemy-hp-bar').forEach(el => el.remove());

  // Render towers
  G.towers.forEach(tower => {
    const cell = boardEl.querySelector(`.cell[data-x="${tower.x}"][data-y="${tower.y}"]`);
    if (!cell) return;
    const def = TOWER_DEFS[tower.type];
    const el = document.createElement('div');
    el.className = `tower-el ${def.cssClass} tw-level-${tower.level} skin-${G.towerSkin}`;
    el.innerHTML = `${getTowerSVG(tower.type)}<span class="tower-lvl-badge">${'★'.repeat(tower.level)}</span>`;
    cell.appendChild(el);
  });

  // Render enemies
  G.enemies.forEach(enemy => {
    const cell = boardEl.querySelector(`.cell[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
    if (!cell) return;
    const hpPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);

    // Enemy icon — animated independently
    const el = document.createElement('div');
    el.className = `enemy-el ${enemy.def.cssClass}${enemy.frozen ? ' enemy-frozen' : ''}`;
    el.innerHTML = `<span>${enemy.def.icon}</span>`;
    cell.appendChild(el);

    // HP bar — sibling of enemy-el, anchored to cell so it never bounces
    const hpBar = document.createElement('div');
    hpBar.className = 'enemy-hp-bar';
    hpBar.innerHTML = `<div class="enemy-hp-fill" style="width:${hpPct}%;background:${hpPct > 60 ? '#22C55E' : hpPct > 30 ? '#EAB308' : '#EF4444'}"></div>`;
    cell.appendChild(hpBar);
  });
}

// ── LASER VFX ─────────────────────────────────────────────────
function drawLaser(tower, target, type) {
  if (!gameSettings.vfx) return;
  const fromCell = boardEl.querySelector(`.cell[data-x="${tower.x}"][data-y="${tower.y}"]`);
  const toCell = boardEl.querySelector(`.cell[data-x="${target.x}"][data-y="${target.y}"]`);
  if (!fromCell || !toCell) return;
  const r1 = fromCell.getBoundingClientRect(), r2 = toCell.getBoundingClientRect();
  const dx = r2.left - r1.left, dy = r2.top - r1.top;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const laser = document.createElement('div');
  laser.className = `laser-vfx laser-${type}`;
  laser.style.cssText = `width:${dist}px;left:${r1.left + r1.width / 2}px;top:${r1.top + r1.height / 2}px;transform:rotate(${angle}deg)`;
  document.body.appendChild(laser);
  setTimeout(() => laser.remove(), 380);
}

// ── FLOATING TEXT ─────────────────────────────────────────────
function showFloatText(enemy, text, color) {
  if (!gameSettings.vfx) return;
  const cell = boardEl.querySelector(`.cell[data-x="${enemy.x}"][data-y="${enemy.y}"]`);
  if (!cell) return;
  const r = cell.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-text'; el.textContent = text; el.style.color = color;
  el.style.cssText += `left:${r.left + r.width * 0.1}px;top:${r.top}px;color:${color}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// ── QUEST SYSTEM ──────────────────────────────────────────────
function updateQuestProgress(type, amt = 1) {
  G.quests.forEach(q => {
    if (q.done || q.claimed) return;
    if (q.type !== type) return;
    if (type === 'wave') q.progress = Math.max(q.progress, G.wave);
    else q.progress = Math.min(q.progress + amt, q.target);
    if (q.progress >= q.target && !q.done) {
      q.done = true;
      addLog(`📜 Quest Complete: "${q.title}"! Claim your reward!`, 'log-quest');
      showToast(`✅ Quest: "${q.title}" done!`, 'tsuccess');
    }
  });
  updateDailyProgress(type, amt);
  renderQuests();
}

window.claimQuest = function (qid) {
  const q = G.quests.find(qq => qq.id === qid);
  if (!q || !q.done || q.claimed) return;
  q.claimed = true;
  G.gold += q.rwd.gold; G.diamonds += q.rwd.dia;
  addLog(`🎁 "${q.title}" reward claimed! +${q.rwd.gold}🪙 +${q.rwd.dia}💎`, 'log-quest');
  showToast(`+${q.rwd.gold}🪙 +${q.rwd.dia}💎`, 'tdiamond');
  updateHUD(); renderQuests();
};

function renderQuests() {
  const cont = document.getElementById('quests-container');
  cont.innerHTML = '';
  G.quests.forEach(q => {
    const pct = Math.min(100, (q.progress / q.target) * 100);
    const card = document.createElement('div');
    card.className = `quest-card${q.done ? ' qcomplete' : ''}${q.claimed ? ' qclaimed' : ''}`;
    card.innerHTML = `
      <div class="q-title">${q.done ? '✓ ' : ''}${q.title}</div>
      <div class="q-desc">${q.desc}</div>
      <div class="q-progress-bar"><div class="q-fill" style="width:${pct}%"></div></div>
      <div class="q-foot">
        <span class="q-prog-text">${q.progress}/${q.target}</span>
        <span class="q-reward">${q.rwd.gold > 0 ? `🪙${q.rwd.gold}` : ''} ${q.rwd.dia > 0 ? `💎${q.rwd.dia}` : ''}</span>
      </div>
      ${q.done && !q.claimed ? `<button class="q-claim-btn" onclick="claimQuest('${q.id}')">CLAIM REWARD</button>` : ''}
    `;
    cont.appendChild(card);
  });
}

window.switchQuestTab = function (tab) {
  document.getElementById('quests-container').style.display = tab === 'quests' ? '' : 'none';
  document.getElementById('daily-container').style.display = tab === 'daily' ? '' : 'none';
  document.querySelectorAll('.qp-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`qtab-${tab}`).classList.add('active');
};

// ── SHOP ──────────────────────────────────────────────────────
function openShop() {
  document.getElementById('shop-modal').style.display = 'flex';
  renderShop();
}
function closeShop() { document.getElementById('shop-modal').style.display = 'none'; }

function shopTab(tab) {
  currentShopTab = tab;
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`stab-${tab}`).classList.add('active');
  renderShop();
}

function renderShop() {
  document.getElementById('shop-gold').textContent = G.gold;
  document.getElementById('shop-dia').textContent = G.diamonds;
  const cont = document.getElementById('shop-content');
  cont.innerHTML = '';

  if (currentShopTab === 'castles') {
    Object.entries(CASTLE_SKINS).forEach(([key, skin]) => {
      const owned = G.castleOwned.includes(key);
      const equipped = G.castleSkin === key;
      const item = document.createElement('div');
      item.className = `shop-item${owned ? ' owned' : ''}${equipped ? ' equipped' : ''}`;
      let btnHtml = '';
      if (equipped) {
        btnHtml = `<button class="si-btn equipped-btn">EQUIPPED</button>`;
      } else if (owned) {
        btnHtml = `<button class="si-btn equip-btn" onclick="equipCastle('${key}')">EQUIP</button>`;
      } else if (skin.currency === 'free') {
        btnHtml = `<button class="si-btn owned-btn">OWNED</button>`;
      } else if (skin.currency === 'gold') {
        const canAfford = G.gold >= skin.cost;
        btnHtml = `<button class="si-btn buy-gold" ${canAfford ? '' : 'disabled'} onclick="buyCastle('${key}')">🪙 ${skin.cost}</button>`;
      } else {
        const canAfford = G.diamonds >= skin.cost;
        btnHtml = `<button class="si-btn buy-dia" ${canAfford ? '' : 'disabled'} onclick="buyCastle('${key}')">💎 ${skin.cost}</button>`;
      }
      item.innerHTML = `
        <span class="si-icon">${skin.icon}</span>
        <div class="si-info">
          <div class="si-name">${skin.name}</div>
          <div class="si-desc">${skin.desc}</div>
          <div class="si-hp">Castle HP: ${skin.maxHp}</div>
        </div>
        ${btnHtml}`;
      cont.appendChild(item);
    });

  } else if (currentShopTab === 'towers') {
    Object.entries(TOWER_SKINS).forEach(([key, skin]) => {
      const owned = G.towerSkinOwned.includes(key);
      const equipped = G.towerSkin === key;
      const item = document.createElement('div');
      item.className = `shop-item${owned ? ' owned' : ''}${equipped ? ' equipped' : ''}`;
      let btnHtml = '';
      if (equipped) {
        btnHtml = `<button class="si-btn equipped-btn">EQUIPPED</button>`;
      } else if (owned) {
        btnHtml = `<button class="si-btn equip-btn" onclick="equipTowerSkin('${key}')">EQUIP</button>`;
      } else if (skin.currency === 'free') {
        btnHtml = `<button class="si-btn owned-btn">OWNED</button>`;
      } else if (skin.currency === 'gold') {
        const canAfford = G.gold >= skin.cost;
        btnHtml = `<button class="si-btn buy-gold" ${canAfford ? '' : 'disabled'} onclick="buyTowerSkin('${key}')">🪙 ${skin.cost}</button>`;
      } else {
        const canAfford = G.diamonds >= skin.cost;
        btnHtml = `<button class="si-btn buy-dia" ${canAfford ? '' : 'disabled'} onclick="buyTowerSkin('${key}')">💎 ${skin.cost}</button>`;
      }
      const bonuses = [];
      if (skin.dmgBonus > 0) bonuses.push(`+${skin.dmgBonus} Damage`);
      if (skin.rangeBonus > 0) bonuses.push(`+${skin.rangeBonus} Range`);
      item.innerHTML = `
        <span class="si-icon">${skin.icon}</span>
        <div class="si-info">
          <div class="si-name">${skin.name}</div>
          <div class="si-desc">${skin.desc}</div>
          ${bonuses.length ? `<div class="si-hp">${bonuses.join(' | ')}</div>` : ''}
        </div>
        ${btnHtml}`;
      cont.appendChild(item);
    });

  } else if (currentShopTab === 'powerups') {
    POWERUPS.forEach(pu => {
      const item = document.createElement('div');
      item.className = 'shop-item';
      const canAfford = pu.currency === 'gold' ? G.gold >= pu.cost : G.diamonds >= pu.cost;
      const priceLabel = pu.currency === 'gold' ? `🪙 ${pu.cost}` : `💎 ${pu.cost}`;
      const btnClass = pu.currency === 'gold' ? 'buy-gold' : 'buy-dia';
      item.innerHTML = `
        <span class="si-icon">${pu.icon}</span>
        <div class="si-info">
          <div class="si-name">${pu.name}</div>
          <div class="si-desc">${pu.desc}</div>
        </div>
        <button class="si-btn ${btnClass}" ${canAfford ? '' : 'disabled'} onclick="usePowerup('${pu.id}')">${priceLabel}</button>`;
      cont.appendChild(item);
    });
  }
}

window.buyCastle = function (key) {
  const skin = CASTLE_SKINS[key];
  if (!skin) return;
  if (skin.currency === 'gold' && G.gold >= skin.cost) {
    G.gold -= skin.cost;
    G.castleOwned.push(key);
    G.castleSkin = key;
    applyCastleSkin(); showToast(`${skin.name} equipped!`, 'tdiamond');
  } else if (skin.currency === 'dia' && G.diamonds >= skin.cost) {
    G.diamonds -= skin.cost;
    G.castleOwned.push(key);
    G.castleSkin = key;
    applyCastleSkin(); showToast(`${skin.name} equipped!`, 'tdiamond');
  } else showToast('Not enough currency!', 'terror');
  updateHUD(); renderShop();
};
window.equipCastle = function (key) {
  if (!G.castleOwned.includes(key)) return;
  G.castleSkin = key;
  applyCastleSkin(); showToast(`${CASTLE_SKINS[key].name} equipped!`, 'tsuccess');
  renderShop();
};

window.buyTowerSkin = function (key) {
  const skin = TOWER_SKINS[key];
  if (!skin) return;
  if (skin.currency === 'gold' && G.gold >= skin.cost) {
    G.gold -= skin.cost; G.towerSkinOwned.push(key); G.towerSkin = key;
    showToast(`${skin.name} equipped!`, 'tdiamond');
  } else if (skin.currency === 'dia' && G.diamonds >= skin.cost) {
    G.diamonds -= skin.cost; G.towerSkinOwned.push(key); G.towerSkin = key;
    showToast(`${skin.name} equipped!`, 'tdiamond');
  } else return showToast('Not enough currency!', 'terror');
  updateHUD(); renderBoard(); renderShop();
};
window.equipTowerSkin = function (key) {
  if (!G.towerSkinOwned.includes(key)) return;
  G.towerSkin = key;
  showToast(`${TOWER_SKINS[key].name} equipped!`, 'tsuccess');
  renderBoard(); renderShop();
};

window.usePowerup = function (id) {
  const pu = POWERUPS.find(p => p.id === id);
  if (!pu) return;
  const canAfford = pu.currency === 'gold' ? G.gold >= pu.cost : G.diamonds >= pu.cost;
  if (!canAfford) return showToast('Not enough currency!', 'terror');
  if (pu.currency === 'gold') G.gold -= pu.cost;
  else G.diamonds -= pu.cost;
  if (pu.effect === 'repairCastle') { G.hp = Math.min(G.maxHp, G.hp + pu.val); updateCastleHpBar(); showToast(`Castle repaired! +${pu.val}HP`, 'tsuccess'); }
  else if (pu.effect === 'addGold') { G.gold += pu.val; showToast(`+${pu.val}🪙 added!`, 'tsuccess'); }
  else if (pu.effect === 'tempShield') { G.tempShield += pu.val; showToast(`Shield active! -${pu.val} enemy damage`, 'tsuccess'); }
  addLog(`⚡ Power-up used: ${pu.name}`, 'log-ability');
  updateHUD(); renderShop();
};

function applyCastleSkin() {
  const skin = CASTLE_SKINS[G.castleSkin] || CASTLE_SKINS.Wooden;
  G.maxHp = skin.maxHp; G.hp = Math.min(G.hp, G.maxHp);
  const cr = document.getElementById('castle-render');
  if (cr) {
    cr.className = `castle-render ${skin.cssClass}`;
    const svgWrap = document.getElementById('cas-svg-wrap');
    if (svgWrap) svgWrap.innerHTML = getCastleSVG(G.castleSkin);
  }
  updateCastleHpBar();
}

// ── PHASE DISPLAY ─────────────────────────────────────────────
function setPhase(phase) {
  const dot = document.getElementById('phase-dot');
  const label = document.getElementById('phase-label');
  if (phase === 'planning') {
    dot.className = 'phase-indicator planning';
    label.textContent = '⚔️ PLANNING PHASE — Place & upgrade towers, then execute your turn';
  } else {
    dot.className = 'phase-indicator combat';
    label.textContent = '🔴 COMBAT — Towers firing...';
  }
}

// ── DAILY CHALLENGE SYSTEM ────────────────────────────────────
function getDailyDateKey() {
  return new Date().toISOString().split('T')[0]; // e.g. "2026-05-01"
}

function seededRandom(seed) {
  let s = seed;
  return function () { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function getDailyChallenges() {
  const dateKey = getDailyDateKey();
  const seed = dateKey.replace(/-/g, '') | 0;
  const rng = seededRandom(seed);
  const pool = [...DAILY_POOL];
  const picks = [];
  while (picks.length < 3 && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    picks.push({ ...pool[idx], progress: 0, done: false, claimed: false });
    pool.splice(idx, 1);
  }
  return picks;
}

function initDailyChallenges() {
  const dateKey = getDailyDateKey();
  const stored = JSON.parse(localStorage.getItem('kr_daily') || '{}');
  if (stored.date === dateKey) {
    G.dailyChallenges = stored.challenges;
  } else {
    G.dailyChallenges = getDailyChallenges();
    saveDailyChallenges();
  }
  renderDailyChallenges();
}

function saveDailyChallenges() {
  localStorage.setItem('kr_daily', JSON.stringify({
    date: getDailyDateKey(),
    challenges: G.dailyChallenges
  }));
}

function updateDailyProgress(type, amt = 1) {
  if (!G.dailyChallenges || !G.dailyChallenges.length) return;
  let changed = false;
  G.dailyChallenges.forEach(q => {
    if (q.done || q.claimed) return;
    if (q.type !== type) return;
    if (type === 'wave') q.progress = Math.max(q.progress, typeof amt === 'number' ? amt : G.wave);
    else q.progress = Math.min(q.progress + 1, q.target);
    if (q.progress >= q.target && !q.done) {
      q.done = true;
      addLog(`📅 Daily Complete: "${q.title}"! Claim your reward!`, 'log-quest');
      showToast(`📅 Daily: "${q.title}" done!`, 'tdiamond');
      changed = true;
    }
  });
  if (changed) { saveDailyChallenges(); renderDailyChallenges(); }
  else saveDailyChallenges();
}

window.claimDaily = function (idx) {
  const q = G.dailyChallenges[idx];
  if (!q || !q.done || q.claimed) return;
  q.claimed = true;
  G.gold += q.rwd.gold; G.diamonds += q.rwd.dia;
  addLog(`🎁 Daily "${q.title}" claimed! +${q.rwd.gold}🪙 +${q.rwd.dia}💎`, 'log-quest');
  showToast(`+${q.rwd.gold}🪙 +${q.rwd.dia}💎 (Daily!)`, 'tdiamond');
  saveDailyChallenges();
  updateHUD(); renderDailyChallenges();
};

function renderDailyChallenges() {
  const cont = document.getElementById('daily-container');
  if (!cont) return;
  cont.innerHTML = '';
  if (!G.dailyChallenges || !G.dailyChallenges.length) return;
  G.dailyChallenges.forEach((q, i) => {
    const pct = Math.min(100, (q.progress / q.target) * 100);
    const card = document.createElement('div');
    card.className = `quest-card daily-card${q.done ? ' qcomplete' : ''}${q.claimed ? ' qclaimed' : ''}`;
    card.innerHTML = `
      <div class="q-title">${q.done ? '✓ ' : '📅 '}${q.title}</div>
      <div class="q-desc">${q.desc}</div>
      <div class="q-progress-bar"><div class="q-fill daily-fill" style="width:${pct}%"></div></div>
      <div class="q-foot">
        <span class="q-prog-text">${q.progress}/${q.target}</span>
        <span class="q-reward">${q.rwd.gold > 0 ? `🪙${q.rwd.gold}` : ''} ${q.rwd.dia > 0 ? `💎${q.rwd.dia}` : ''}</span>
      </div>
      ${q.done && !q.claimed ? `<button class="q-claim-btn" onclick="claimDaily(${i})">CLAIM DAILY</button>` : ''}
    `;
    cont.appendChild(card);
  });
}

// ── STREAK SYSTEM ─────────────────────────────────────────────
function checkDailyStreak() {
  const today = getDailyDateKey();
  const stored = JSON.parse(localStorage.getItem('kr_streak') || '{}');
  const lastLogin = stored.lastLogin;
  let streak = stored.streak || G.streak || 0;
  if (lastLogin === today) {
    // Already logged in today, keep streak
  } else {
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    if (lastLogin === yesterday) {
      streak++;
      if (streak % 7 === 0) {
        const bonus = streak >= 30 ? 15 : streak >= 14 ? 8 : 3;
        showToast(`🔥 ${streak}-day streak! +${bonus}💎 bonus!`, 'tdiamond');
        G.diamonds += bonus;
        addLog(`🔥 ${streak}-day login streak! +${bonus}💎 bonus reward!`, 'log-quest');
      } else {
        showToast(`🔥 Day ${streak} streak! Keep it up!`, 'tsuccess');
      }
    } else if (lastLogin && lastLogin !== yesterday) {
      streak = 1; // streak broken
      showToast('Streak reset. Start fresh today!', '');
    } else {
      streak = 1; // first time
    }
    localStorage.setItem('kr_streak', JSON.stringify({ streak, lastLogin: today }));
  }
  G.streak = streak;
  updateStreakDisplay();
}

function updateStreakDisplay() {
  const el = document.getElementById('hud-streak');
  if (el) el.textContent = G.streak;
}

// ── TUTORIAL SYSTEM ───────────────────────────────────────────
const TUTORIAL_STEPS = [
  {
    title: 'Welcome, Commander!',
    body: "Kingdom's Reckoning is a turn-based tower defense. Enemies march from the left — stop them before they breach your castle on the right.",
    highlight: null, cta: 'Next →'
  },
  {
    title: 'Pick a Tower',
    body: 'Select a tower type from the Tower Command panel on the right. Each tower has unique abilities — try the Archer Tower first (🏹 30 gold).',
    highlight: '.towers-panel', cta: 'Got it →'
  },
  {
    title: 'Place on the Board',
    body: 'Click any non-path tile (avoid the middle row — that\'s the enemy path). Hover a tile to see the tower\'s attack range highlighted in green.',
    highlight: '.game-center', cta: 'Got it →'
  },
  {
    title: 'Execute Your Turn',
    body: 'Hit ⚔️ EXECUTE TURN. Your towers fire, then enemies move one step. Repeat: plan → execute until the wave is cleared.',
    highlight: '.execute-btn', cta: 'Got it →'
  },
  {
    title: 'Use Abilities & Shop',
    body: 'Spend 💎 Diamonds on powerful abilities (Meteor, Freeze). Visit the 🛒 Shop to upgrade your castle and tower skins for bonuses.',
    highlight: '.ability-bar', cta: 'Got it →'
  },
  {
    title: 'Complete Daily Challenges',
    body: '3 Daily Challenges refresh every day. Complete them for bonus gold and diamonds — and keep your login streak going for weekly bonuses!',
    highlight: '.quests-panel', cta: 'Let\'s Fight! ⚔️'
  }
];

let tutorialStep = 0;

function startTutorial() {
  tutorialStep = 0;
  showTutorialStep();
}

function showTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialStep];
  if (!step) { endTutorial(); return; }
  document.getElementById('tut-title').textContent = step.title;
  document.getElementById('tut-body').textContent = step.body;
  document.getElementById('tut-cta').textContent = step.cta;
  document.getElementById('tut-counter').textContent = `${tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
  document.getElementById('tutorial-modal').style.display = 'flex';
  // Highlight target element
  document.querySelectorAll('.tut-highlight').forEach(e => e.classList.remove('tut-highlight'));
  if (step.highlight) {
    const el = document.querySelector(step.highlight);
    if (el) el.classList.add('tut-highlight');
  }
}

window.nextTutorialStep = function () {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL_STEPS.length) { endTutorial(); return; }
  showTutorialStep();
};

function endTutorial() {
  document.getElementById('tutorial-modal').style.display = 'none';
  document.querySelectorAll('.tut-highlight').forEach(e => e.classList.remove('tut-highlight'));
  localStorage.setItem('kr_tutorial_done', '1');
  showToast('Tutorial complete! Good luck, Commander! ⚔️', 'tsuccess');
}

window.skipTutorial = function () { endTutorial(); };

// ── SCORE CARD SHARE ──────────────────────────────────────────
window.shareScoreCard = function () {
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 340;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#07061A';
  ctx.fillRect(0, 0, 600, 340);

  // Gold border
  ctx.strokeStyle = '#C9A227';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, 584, 324);

  // Inner accent
  ctx.strokeStyle = 'rgba(201,162,39,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, 568, 308);

  // Title
  ctx.fillStyle = '#F0C842';
  ctx.font = 'bold 28px serif';
  ctx.textAlign = 'center';
  ctx.fillText("⚔️ KINGDOM'S RECKONING", 300, 60);

  // Player name
  const username = document.getElementById('display-username').textContent || 'Commander';
  ctx.fillStyle = '#D5C9B0';
  ctx.font = '18px serif';
  ctx.fillText(`Commander: ${username}`, 300, 95);

  // Stats
  const stats = [
    { label: 'WAVE REACHED', val: G.wave, icon: '🌊', x: 150 },
    { label: 'SCORE', val: G.score, icon: '🏆', x: 300 },
    { label: 'BEST WAVE', val: G.bestWave, icon: '⭐', x: 450 },
  ];
  stats.forEach(s => {
    ctx.fillStyle = 'rgba(201,162,39,0.15)';
    ctx.beginPath();
    ctx.roundRect(s.x - 75, 120, 150, 90, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,162,39,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#F0C842';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.val, s.x, 165);
    ctx.fillStyle = '#8B7E6A';
    ctx.font = '11px sans-serif';
    ctx.fillText(s.label, s.x, 198);
  });

  // Castle skin
  ctx.fillStyle = '#5A5270';
  ctx.font = '13px serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Castle: ${CASTLE_SKINS[G.castleSkin].name}  |  Streak: ${G.streak} days`, 300, 248);

  // Streak fire
  if (G.streak >= 3) {
    ctx.fillStyle = '#F59E0B';
    ctx.font = '13px sans-serif';
    ctx.fillText(`🔥 ${G.streak}-Day Streak`, 300, 270);
  }

  // Footer
  ctx.fillStyle = '#3D3558';
  ctx.font = '11px sans-serif';
  ctx.fillText('Play at kingdoms-reckoning.com • Can you beat my score?', 300, 308);

  // Download
  const link = document.createElement('a');
  link.download = `kingdoms-reckoning-${username}-w${G.wave}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Score card saved! Share your run! 🏆', 'tdiamond');
};

// ── HUD UPDATE (include streak) ───────────────────────────────
function updateHUD() {
  document.getElementById('hud-hp').textContent = `${Math.max(0, G.hp)}/${G.maxHp}`;
  document.getElementById('hud-gold').textContent = G.gold;
  document.getElementById('hud-dia').textContent = G.diamonds;
  // Show "S1-W2" in story mode, otherwise wave number
  if (G.gameMode === 'story' && G.storyStage) {
    document.getElementById('hud-wave').textContent = `S${G.storyStage}-W${G.waveInStage || 1}`;
  } else {
    document.getElementById('hud-wave').textContent = G.wave;
  }
  document.getElementById('hud-score').textContent = G.score;
  updateStreakDisplay();
  updateModeBadge();
}

function updateModeBadge() {
  const badge = document.getElementById('hud-mode-badge');
  if (!badge) return;
  if (G.gameMode === 'extreme') {
    badge.textContent = '🔥 EXTREME';
    badge.style.background = 'linear-gradient(135deg,rgba(220,38,38,.35),rgba(153,27,27,.25))';
    badge.style.borderColor = 'rgba(220,38,38,.7)';
    badge.style.color = '#FCA5A5';
  } else {
    const stageData = G.storyStage ? STORY_STAGES[G.storyStage - 1] : null;
    badge.textContent = stageData ? `${stageData.icon} Stage ${G.storyStage}` : '⚔️ STORY';
    badge.style.background = 'linear-gradient(135deg,rgba(59,130,246,.2),rgba(29,78,216,.15))';
    badge.style.borderColor = stageData ? stageData.border : 'rgba(59,130,246,.5)';
    badge.style.color = stageData ? stageData.color : '#93C5FD';
  }
}

// ── COMBAT LOG ────────────────────────────────────────────────
function addLog(msg, cls = '') {
  const log = document.getElementById('combat-log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${cls}`;
  entry.textContent = msg;
  log.prepend(entry);
  // Keep log trimmed
  while (log.children.length > 40) log.removeChild(log.lastChild);
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const cont = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`; t.textContent = msg;
  cont.appendChild(t);
  setTimeout(() => { t.style.animation = 'fadeOut .3s forwards'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ── SETTINGS ──────────────────────────────────────────────────
function toggleSetting(key) {
  gameSettings[key] = !gameSettings[key];
  const btns = document.querySelectorAll(`#btn-set-${key}, #btn-set-${key}2`);
  btns.forEach(btn => {
    if (gameSettings[key]) { btn.classList.replace('tog-off', 'tog-on'); btn.textContent = 'ON'; }
    else { btn.classList.replace('tog-on', 'tog-off'); btn.textContent = 'OFF'; }
  });
  if (key === 'fastMode' && gameSettings.fastMode && !G.isAnimating && !G.gameOver) setTimeout(executeTurn, 300);
}
function openSettings() { document.getElementById('settings-modal').style.display = 'flex'; }
function closeSettings() { document.getElementById('settings-modal').style.display = 'none'; }

// ── LEADERBOARD ───────────────────────────────────────────────
function openLeaderboard() { fetchLeaderboard(); document.getElementById('leaderboard-modal').style.display = 'flex'; }
function closeLeaderboard() { document.getElementById('leaderboard-modal').style.display = 'none'; }
async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    const scores = await res.json();
    const list = document.getElementById('leaderboard-list');
    const me = document.getElementById('display-username').textContent;
    list.innerHTML = '';
    if (!scores.length) { list.innerHTML = '<li style="color:var(--col-dim);text-align:center;padding:20px">No scores yet. Be first!</li>'; return; }
    scores.forEach((s, i) => {
      const li = document.createElement('li');
      if (s.player === me) li.classList.add('me');
      const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
      li.innerHTML = `<span class="lb-rank">${rank}</span><span class="lb-name">${s.player}${s.player === me ? ' (You)' : ''}</span><span class="lb-score">${s.score} pts</span>`;
      list.appendChild(li);
    });
  } catch { }
}

// ── INIT ──────────────────────────────────────────────────────
checkAuth();
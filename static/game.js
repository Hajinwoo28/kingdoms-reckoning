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
    name: 'Nature Cave Sanctuary',
    tagline: 'Wild roots guard a glowing hollow',
    icon: '🌿',
    art: '🕳️',
    color: '#22C55E',
    colorDark: '#166534',
    colorBg: 'rgba(34,197,94,0.12)',
    gradient: 'linear-gradient(135deg, rgba(22,101,52,.36) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(34,197,94,0.55)',
    difficulty: 5,
    enemies: ['shadow_sprite', 'arcane_knight', 'phantom_troll', 'void_dragon'],
    reward: { type: 'nature_core', icon: '🍃', label: 'Nature Core ×3', desc: '+6 HP on boss-wave clear and +1 regen per turn for this run', gold: 95, dia: 7 },
    enemyMods: { hpMult: 1.5, spdBonus: 0, dmgMult: 1.8 },
    loreText: 'Beneath the roots lies a bioluminescent cave where toxic spores and cave guardians awaken.'
  },
  desert: {
    id: 'desert',
    name: 'Sand Dune Wastes',
    tagline: 'Scorched beneath the eternal sun',
    icon: '🏜️',
    art: '🐪',
    color: '#F59E0B',
    colorDark: '#B45309',
    colorBg: 'rgba(245,158,11,0.12)',
    gradient: 'linear-gradient(135deg, rgba(180,83,9,.35) 0%, rgba(7,6,26,.95) 100%)',
    border: 'rgba(245,158,11,0.5)',
    difficulty: 3,
    enemies: ['sand_scorpion', 'dune_raider', 'sand_golem', 'desert_wyrm'],
    reward: { type: 'sun_shard', icon: '☀️', label: 'Sun Shard ×3', desc: '+25% tower attack speed for this run', gold: 70, dia: 5 },
    enemyMods: { hpMult: 1.15, spdBonus: 0, dmgMult: 1.3 },
    loreText: 'Buried beneath endless dunes lies a cursed pharaoh\'s tomb, unleashing undead legions.'
  },
  abyss: {
    id: 'abyss',
    name: 'Abyssal Cavern',
    tagline: 'Darkness swallows all hope',
    icon: '🕳️',
    art: '🦇',
    color: '#06B6D4',
    colorDark: '#0E7490',
    colorBg: 'rgba(6,182,212,0.10)',
    gradient: 'linear-gradient(135deg, rgba(14,116,144,.30) 0%, rgba(3,4,20,.98) 100%)',
    border: 'rgba(6,182,212,0.45)',
    difficulty: 4,
    enemies: ['cave_bat', 'deep_lurker', 'stone_colossus', 'void_leviathan'],
    reward: { type: 'void_crystal', icon: '💠', label: 'Void Crystal ×3', desc: 'All towers gain splash damage for this run', gold: 90, dia: 7 },
    enemyMods: { hpMult: 1.25, spdBonus: 0, dmgMult: 1.4 },
    loreText: 'Ancient sea monsters and shadow beasts dwell in these lightless subterranean caves.'
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
  void_dragon: { id: 'void_dragon', name: 'Void Dragon', icon: '🐉', cssClass: 'en-dragon', baseHp: 520, speed: 1, reward: 150, damage: 11, desc: 'BOSS — void annihilator', boss: true, ability: 'breath' },
  // Desert
  sand_scorpion: { id: 'sand_scorpion', name: 'Sand Scorpion', icon: '🦂', cssClass: 'en-goblin', baseHp: 20, speed: 2, reward: 10, damage: 1, desc: 'Venomous & fast', ability: 'dash', abilityChance: 0.30 },
  dune_raider: { id: 'dune_raider', name: 'Dune Raider', icon: '🗡️', cssClass: 'en-orc', baseHp: 50, speed: 1, reward: 16, damage: 2, desc: 'Desert marauder' },
  sand_golem: { id: 'sand_golem', name: 'Sand Golem', icon: '🗿', cssClass: 'en-troll', baseHp: 120, speed: 1, reward: 33, damage: 3, desc: 'Reforms from sand', ability: 'regen', regenAmt: 9 },
  desert_wyrm: { id: 'desert_wyrm', name: 'Desert Wyrm', icon: '🐛', cssClass: 'en-dragon', baseHp: 440, speed: 1, reward: 130, damage: 9, desc: 'BOSS — sand storm', boss: true, ability: 'breath' },
  // Abyss
  cave_bat: { id: 'cave_bat', name: 'Cave Bat', icon: '🦇', cssClass: 'en-goblin', baseHp: 16, speed: 3, reward: 9, damage: 1, desc: 'Blindingly fast swarm', ability: 'dash', abilityChance: 0.40 },
  deep_lurker: { id: 'deep_lurker', name: 'Deep Lurker', icon: '👁️', cssClass: 'en-orc', baseHp: 55, speed: 1, reward: 18, damage: 3, desc: 'Terrifying ambusher' },
  stone_colossus: { id: 'stone_colossus', name: 'Stone Colossus', icon: '🗿', cssClass: 'en-troll', baseHp: 150, speed: 1, reward: 40, damage: 4, desc: 'Absorbs hits', ability: 'deflect', deflectChance: 0.25 },
  void_leviathan: { id: 'void_leviathan', name: 'Void Leviathan', icon: '🐙', cssClass: 'en-dragon', baseHp: 500, speed: 1, reward: 145, damage: 10, desc: 'BOSS — ink burst', boss: true, ability: 'breath' }
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
  extremeProgress: 1, // 1-based index of highest unlocked extreme island (server-authoritative)
  // Strategic / tactical progression stats
  turnNumber: 0,
  cleanTurns: 0,
  momentum: 0,
  tacticalRating: 0,
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

// ── Tab switcher ────────────────────────────────────────────────
window.authSwitchTab = function(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('pane-' + tab).classList.add('active');
  document.getElementById('auth-message').textContent = '';
};

// ── Tabbed register ─────────────────────────────────────────────
async function registerTabbed() {
  // Null-safe: try new tabbed IDs first, then legacy IDs
  const uEl  = document.getElementById('username')         || document.getElementById('reg-username');
  const pEl  = document.getElementById('password')         || document.getElementById('reg-password');
  const cpEl = document.getElementById('confirm-password') || document.getElementById('reg-confirm');
  const tEl  = document.getElementById('terms-check');

  const u  = (uEl  ? uEl.value  : '').trim();
  const p  =  pEl  ? pEl.value  : '';
  const cp =  cpEl ? cpEl.value : p;      // no confirm field = skip the match check
  const terms = tEl ? tEl.checked : true; // no checkbox = treat as accepted

  if (!u || !p) return setAuthMsg('Enter a username and password.', true);
  if (cpEl && p !== cp) return setAuthMsg('Passwords do not match.', true);
  if (tEl && !terms)    return setAuthMsg('Please accept the Terms of Service.', true);

  const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
  const data = await res.json();
  if (data.error) return setAuthMsg(data.error, true);
  // Server auto-logged the new player in — go straight to Choose Your Destiny
  if (data.username) {
    setAuthMsg('Welcome, Commander! Preparing your realm...', false);
    setTimeout(() => showGame(data.username), 900);
  }
}

// ── Tabbed login ────────────────────────────────────────────────
async function loginTabbed() {
  // Null-safe: try new tabbed IDs first, then legacy IDs
  const uEl = document.getElementById('username-login') || document.getElementById('username');
  const pEl = document.getElementById('password-login') || document.getElementById('password');
  const u = (uEl ? uEl.value : '').trim();
  const p = pEl ? pEl.value : '';
  if (!u || !p) return setAuthMsg('Enter your Commander ID and War Seal.', true);
  const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
  const data = await res.json();
  if (data.username) showGame(data.username);
  else setAuthMsg(data.error, true);
}

// ── Global aliases — covers any HTML version that uses older or alternate names ──
window.registerTabbed = registerTabbed;
window.loginTabbed    = loginTabbed;
window.registerNew    = registerTabbed;   // alias: registerNew → registerTabbed
window.loginNew       = loginTabbed;      // alias: loginNew    → loginTabbed

// ── Legacy wrappers (kept so any HTML onclick="register()" still works) ──
async function register() {
  const u = (document.getElementById('username') && document.getElementById('username').value || '').trim();
  const p = document.getElementById('password') && document.getElementById('password').value || '';
  if (!u || !p) return setAuthMsg('Enter ID and Seal.', true);
  const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
  const data = await res.json();
  setAuthMsg(data.error || data.message, !!data.error);
}
async function login() {
  const uEl = document.getElementById('username-login') || document.getElementById('username');
  const pEl = document.getElementById('password-login') || document.getElementById('password');
  const u = (uEl && uEl.value || '').trim();
  const p = (pEl && pEl.value) || '';
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
        towers: towersPayload, game_mode: G.gameMode,
        stages_cleared: G.stagesCleared || [],
        stage_stars: G.stageStars || {},
        extreme_progress: G.extremeProgress || 1,
        story_progress: G.storyProgress || 1
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
      // Per-player progress — loaded from server, never from localStorage
      G.stagesCleared = Array.isArray(d.stages_cleared) ? d.stages_cleared : [];
      G.stageStars = (d.stage_stars && typeof d.stage_stars === 'object') ? d.stage_stars : {};
      G.extremeProgress = d.extreme_progress || 1;
      // Per-player story progress — server is source of truth
      G.storyProgress = d.story_progress || 1;
    }
  }
  // Restore active biome from localStorage (DB doesn't store biome_id)
  try {
    const savedBiome = localStorage.getItem('kr_active_biome');
    if (savedBiome && BIOME_DEFS[savedBiome] && G.gameMode === 'extreme') {
      G.activeBiome = BIOME_DEFS[savedBiome];
      G._biomeReward = G.activeBiome.reward;
    }
  } catch (_) { }
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
    // Story Mode → clear any extreme biome, go to Stage Select
    G.activeBiome = null;
    try { localStorage.removeItem('kr_active_biome'); } catch (_) { }
    loadStageProgress();
    document.getElementById('mode-select-section').style.display = 'none';
    showStageSelect();
  }
};

function showIslandSelect() {
  const screen = document.getElementById('island-select-section');
  screen.style.display = 'flex';
  renderIslandCards();

  // Re-render islands when device rotates so positions/sizes update correctly
  if (!window._islandOrientationBound) {
    window._islandOrientationBound = true;
    const rerender = () => {
      if (document.getElementById('island-select-section').style.display !== 'none') {
        renderIslandCards();
      }
    };
    window.addEventListener('orientationchange', () => setTimeout(rerender, 320));
    window.addEventListener('resize', () => {
      clearTimeout(window._islandResizeTimer);
      window._islandResizeTimer = setTimeout(rerender, 250);
    });
  }
}

// ── STORY STAGE SELECT ────────────────────────────────────────
function loadStageProgress() {
  // Progress is loaded from the server in loadGame() and stored in G.
  // Ensure safe defaults if called before login (guest / offline).
  if (!Array.isArray(G.stagesCleared)) G.stagesCleared = [];
  if (!G.stageStars || typeof G.stageStars !== 'object') G.stageStars = {};
}

// saveStageProgress removed — progress is persisted via saveGame() to the server.
// Each player's progress is stored per-account in player_saves.stages_cleared.

function isStageUnlocked(stageId) {
  if (stageId === 1) return true;
  // Server-authoritative numeric progress gate
  if (stageId <= (G.storyProgress || 1)) return true;
  // Legacy fallback: stages_cleared array
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

// Island scene position config — 5 islands evenly spaced with clear air between each
// Width reduced so each island fits within its ~18vw column; top stagger for depth.
const ISLAND_POSITIONS = {
  tundra: { left: '3%', top: '20%', w: 168, floatDur: '5.5s', floatDelay: '0s', zIndex: 6 },
  jungle: { left: '21%', top: '16%', w: 182, floatDur: '6.2s', floatDelay: '-2.1s', zIndex: 7 },
  volcano: { left: '39%', top: '21%', w: 160, floatDur: '4.8s', floatDelay: '-1.4s', zIndex: 5 },
  forest: { left: '57%', top: '17%', w: 155, floatDur: '5.8s', floatDelay: '-3.0s', zIndex: 4 },
  desert: { left: '75%', top: '20%', w: 162, floatDur: '6.5s', floatDelay: '-0.8s', zIndex: 6 },
  abyss: { left: '88%', top: '18%', w: 148, floatDur: '5.2s', floatDelay: '-2.5s', zIndex: 5 },
};

/* Responsive island sizes — called at render time so resize events work */
function getIslandPositions() {
  const vw = window.innerWidth;
  const isLandscape = window.innerWidth > window.innerHeight;

  if (vw <= 480 && !isLandscape) {
    /* Phone portrait: 3 × 2 grid */
    return {
      tundra: { left: '2%', top: '3%', w: 90, floatDur: '5.5s', floatDelay: '0s', zIndex: 6 },
      jungle: { left: '36%', top: '1%', w: 100, floatDur: '6.2s', floatDelay: '-2.1s', zIndex: 7 },
      volcano: { left: '68%', top: '4%', w: 85, floatDur: '4.8s', floatDelay: '-1.4s', zIndex: 5 },
      forest: { left: '2%', top: '50%', w: 82, floatDur: '5.8s', floatDelay: '-3.0s', zIndex: 4 },
      desert: { left: '36%', top: '52%', w: 86, floatDur: '6.5s', floatDelay: '-0.8s', zIndex: 6 },
      abyss: { left: '68%', top: '50%', w: 80, floatDur: '5.2s', floatDelay: '-2.5s', zIndex: 5 },
    };
  }
  if (isLandscape && vw <= 960) {
    /* Landscape phone / small tablet: 5-in-a-row, compact
       top pushed down ~18-22% so islands clear the header on short screens */
    return {
      tundra: { left: '2%', top: '20%', w: 105, floatDur: '5.5s', floatDelay: '0s', zIndex: 6 },
      jungle: { left: '21%', top: '16%', w: 116, floatDur: '6.2s', floatDelay: '-2.1s', zIndex: 7 },
      volcano: { left: '40%', top: '21%', w: 100, floatDur: '4.8s', floatDelay: '-1.4s', zIndex: 5 },
      forest: { left: '59%', top: '17%', w: 96, floatDur: '5.8s', floatDelay: '-3.0s', zIndex: 4 },
      desert: { left: '78%', top: '20%', w: 100, floatDur: '6.5s', floatDelay: '-0.8s', zIndex: 6 },
      abyss: { left: '92%', top: '18%', w: 90, floatDur: '5.2s', floatDelay: '-2.5s', zIndex: 5 },
    };
  }
  if (vw <= 960) {
    /* Tablet portrait: 3 × 2 */
    return {
      tundra: { left: '2%', top: '8%', w: 130, floatDur: '5.5s', floatDelay: '0s', zIndex: 6 },
      jungle: { left: '36%', top: '5%', w: 142, floatDur: '6.2s', floatDelay: '-2.1s', zIndex: 7 },
      volcano: { left: '68%', top: '9%', w: 122, floatDur: '4.8s', floatDelay: '-1.4s', zIndex: 5 },
      forest: { left: '2%', top: '53%', w: 118, floatDur: '5.8s', floatDelay: '-3.0s', zIndex: 4 },
      desert: { left: '36%', top: '55%', w: 124, floatDur: '6.5s', floatDelay: '-0.8s', zIndex: 6 },
      abyss: { left: '68%', top: '53%', w: 114, floatDur: '5.2s', floatDelay: '-2.5s', zIndex: 5 },
    };
  }
  return ISLAND_POSITIONS;
}

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
  desert: {
    capColors: ['#E8A53A', '#C17D20', '#A06010'],
    cliffColors: ['#8B5A1A', '#6E4412', '#52300A', '#3C2206'],
    cliffStripe: 'rgba(255,200,80,.07)',
    rimColor: '#D4882A',
    deco: [
      { e: '🏜️', x: 10, y: 8, s: 42 },
      { e: '🐪', x: 50, y: 10, s: 30 },
      { e: '☀️', x: 72, y: 4, s: 26 },
      { e: '🦴', x: 30, y: 28, s: 18 },
      { e: '🌵', x: 80, y: 22, s: 24 },
      { e: '💀', x: 20, y: 20, s: 20 },
    ]
  },
  abyss: {
    capColors: ['#0A2040', '#0D3060', '#082848'],
    cliffColors: ['#071830', '#050F20', '#030A15', '#01050C'],
    cliffStripe: 'rgba(0,180,220,.06)',
    rimColor: '#0E4060',
    deco: [
      { e: '🕳️', x: 30, y: 12, s: 38 },
      { e: '🦇', x: 12, y: 6, s: 30 },
      { e: '🦇', x: 68, y: 10, s: 26 },
      { e: '💎', x: 55, y: 24, s: 22 },
      { e: '🌀', x: 78, y: 18, s: 24 },
      { e: '⚓', x: 22, y: 30, s: 20 },
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
  },

  // ── SAND DUNE WASTES — swirling sand grains + shimmer sparks ──
  desert: {
    count: 48,
    create(cw, ch) {
      const type = Math.random() < 0.65 ? 'sand' : Math.random() < 0.5 ? 'shimmer' : 'dust';
      return {
        x: Math.random() * cw,
        y: ch * 0.3 + Math.random() * ch * 0.7,
        size: type === 'sand' ? Math.random() * 3 + 1 : type === 'dust' ? Math.random() * 6 + 3 : Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.3) * 1.4,
        speedY: (Math.random() - 0.6) * 0.5,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.04 + 0.01,
        opacity: Math.random() * 0.5 + 0.2,
        hue: 35 + Math.random() * 20,
        type
      };
    },
    update(p, cw, ch) {
      p.phase += p.phaseSpeed;
      p.x += p.speedX + Math.sin(p.phase) * 0.6;
      p.y += p.speedY + Math.cos(p.phase * 0.7) * 0.3;
      p.opacity = p.type === 'shimmer'
        ? Math.max(0, 0.2 + Math.abs(Math.sin(p.phase * 3)) * 0.7)
        : 0.25 + Math.sin(p.phase) * 0.18;
      if (p.x > cw + 20) p.x = -20;
      if (p.x < -20) p.x = cw + 20;
      if (p.y > ch + 10) { p.y = ch * 0.3; p.x = Math.random() * cw; }
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      if (p.type === 'sand') {
        ctx.fillStyle = `hsla(${p.hue},70%,65%,0.85)`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.55, p.speedX * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'shimmer') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        g.addColorStop(0, 'rgba(255,230,150,0.9)');
        g.addColorStop(0.5, 'rgba(255,190,60,0.4)');
        g.addColorStop(1, 'rgba(255,150,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `hsla(${p.hue},55%,55%,0.30)`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.8, p.size * 0.65, Math.sin(p.phase) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  // ── ABYSSAL CAVERN — bioluminescent orbs + drips + void sparks ──
  abyss: {
    count: 40,
    create(cw, ch) {
      const type = Math.random() < 0.4 ? 'biolum' : Math.random() < 0.55 ? 'drip' : 'spark';
      return {
        x: Math.random() * cw,
        y: type === 'drip' ? Math.random() * ch * 0.4 : Math.random() * ch,
        size: type === 'biolum' ? Math.random() * 4 + 1.5 : type === 'drip' ? Math.random() * 1.5 + 0.5 : Math.random() * 1.8 + 0.5,
        speedX: type === 'spark' ? (Math.random() - 0.5) * 0.7 : (Math.random() - 0.5) * 0.18,
        speedY: type === 'drip' ? Math.random() * 0.9 + 0.4 : (Math.random() - 0.5) * 0.22,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.03 + 0.008,
        opacity: 0,
        hue: 185 + Math.random() * 30,
        type,
        life: Math.random(),
        decay: type === 'drip' ? 0.008 + Math.random() * 0.006 : 0
      };
    },
    update(p, cw, ch) {
      p.phase += p.phaseSpeed;
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.type === 'biolum') {
        p.opacity = Math.max(0, 0.25 + Math.sin(p.phase * 1.8) * 0.65);
        if (p.y > ch + 10) p.y = -10;
        if (p.y < -10) p.y = ch + 10;
      } else if (p.type === 'drip') {
        p.opacity = p.life * 0.8;
        p.life -= p.decay;
        if (p.life <= 0 || p.y > ch + 10) {
          p.y = Math.random() * ch * 0.3;
          p.x = Math.random() * cw;
          p.life = 0.6 + Math.random() * 0.4;
        }
      } else {
        p.opacity = Math.max(0, 0.15 + Math.abs(Math.sin(p.phase * 2.5)) * 0.6);
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y > ch + 10) p.y = -10;
      }
    },
    draw(ctx, p) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      if (p.type === 'biolum') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        g.addColorStop(0, `hsla(${p.hue},95%,75%,1)`);
        g.addColorStop(0.4, `hsla(${p.hue},90%,55%,0.55)`);
        g.addColorStop(1, `hsla(${p.hue},80%,40%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'drip') {
        ctx.fillStyle = `hsla(${p.hue},85%,65%,0.75)`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.5, p.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = `hsla(${p.hue},90%,70%,0.8)`;
        ctx.lineWidth = p.size * 0.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speedX * 4, p.y - p.speedY * 4);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
};
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
    return `<div class="inode-mist-layer" style="--mist-col:rgba(42,175,95,.16)" aria-hidden="true"></div>`;
  }
  if (b.id === 'desert') {
    return `<div class="inode-heat-shimmer" aria-hidden="true"></div>
            <div class="inode-sandstorm-veil" aria-hidden="true"></div>`;
  }
  if (b.id === 'abyss') {
    return `<div class="inode-deep-fog" aria-hidden="true"></div>
            <div class="inode-biolum-pulse" aria-hidden="true"></div>`;
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
    return `<div class="inode-canopy-shimmer" aria-hidden="true"></div>
            <div class="inode-cave-mouth" aria-hidden="true"></div>`;
  }
  if (b.id === 'desert') {
    return `<div class="inode-sand-ripple" aria-hidden="true"></div>
            <div class="inode-mirage-glow"  aria-hidden="true"></div>`;
  }
  if (b.id === 'abyss') {
    return `<div class="inode-cave-mouth"  aria-hidden="true"></div>
            <div class="inode-deep-shimmer" aria-hidden="true"></div>`;
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
    // Dripping cave shelf + roots for the nature-cave island.
    return `<div class="inode-stalactite-row" aria-hidden="true">
      <div class="inode-stalactite" style="left:12%;height:20px;animation-delay:0s"></div>
      <div class="inode-stalactite" style="left:28%;height:26px;animation-delay:-.7s"></div>
      <div class="inode-stalactite" style="left:46%;height:18px;animation-delay:-1.3s"></div>
      <div class="inode-stalactite" style="left:64%;height:24px;animation-delay:-.4s"></div>
      <div class="inode-stalactite" style="left:80%;height:22px;animation-delay:-1.9s"></div>
    </div>
    <div class="inode-water-drip inode-wd-a" aria-hidden="true"></div>
    <div class="inode-water-drip inode-wd-b" aria-hidden="true"></div>`;
  }
  if (b.id === 'desert') {
    // Layered sand strata lines on cliff face
    return `<div class="inode-sand-strata" aria-hidden="true">
      <div class="inode-strata-line" style="top:22%;background:rgba(255,180,40,.18)"></div>
      <div class="inode-strata-line" style="top:48%;background:rgba(220,140,20,.14)"></div>
      <div class="inode-strata-line" style="top:72%;background:rgba(180,100,10,.12)"></div>
    </div>
    <div class="inode-sand-drip inode-sd-a" aria-hidden="true"></div>
    <div class="inode-sand-drip inode-sd-b" aria-hidden="true"></div>`;
  }
  if (b.id === 'abyss') {
    // Glowing crystal stalactites and dripping water
    const stalactites = Array.from({ length: 8 }, (_, i) => {
      const h = 18 + (i % 3) * 12;
      const l = 4 + i * 12;
      return `<div class="inode-stalactite" style="left:${l}%;height:${h}px;animation-delay:${(i * 0.4).toFixed(1)}s"></div>`;
    }).join('');
    return `<div class="inode-stalactite-row" aria-hidden="true">${stalactites}</div>
            <div class="inode-water-drip inode-wd-a" aria-hidden="true"></div>
            <div class="inode-water-drip inode-wd-b" aria-hidden="true"></div>`;
  }
  return '';
}

function _biomeBaseGlow(b, tipW, tipH) {
  const glowMap = {
    tundra: 'radial-gradient(ellipse at 50% 50%, rgba(80,210,240,.55) 0%, rgba(34,211,238,.25) 40%, transparent 80%)',
    volcano: 'radial-gradient(ellipse at 50% 80%, rgba(255,80,0,.80) 0%, rgba(230,50,0,.50) 35%, transparent 80%)',
    jungle: 'radial-gradient(ellipse at 50% 50%, rgba(30,200,80,.50) 0%, rgba(16,185,129,.22) 45%, transparent 80%)',
    forest: 'radial-gradient(ellipse at 50% 50%, rgba(160,80,255,.65) 0%, rgba(139,92,246,.30) 40%, transparent 80%)',
    desert: 'radial-gradient(ellipse at 50% 70%, rgba(255,160,0,.70) 0%, rgba(220,120,0,.40) 40%, transparent 80%)',
    abyss: 'radial-gradient(ellipse at 50% 60%, rgba(0,180,220,.55) 0%, rgba(6,182,212,.28) 42%, transparent 80%)',
  };
  return `<div class="inode-base-glow" style="background:${glowMap[b.id]}" aria-hidden="true"></div>`;
}

// ═══════════════════════════════════════════════════════════════
//  🎨 CARTOON ISLAND SVG BUILDER
//  Replaces CSS div-stack (oval+cylinder) with organic SVG shapes:
//  irregular rock body + capped terrain + hanging stalactites
// ═══════════════════════════════════════════════════════════════

// Per-biome cartoon styles: terrain cap colors, rock body colors,
// and a function(w,cx,capCy,capRx,capRy) → SVG string of details
const _CARTOON_BIOME = {
  tundra: {
    cap: ['#EEF8FF', '#B8E4F8', '#70C0E0'],
    rock: ['#5ABCE0', '#3898BE', '#1A6898', '#0A3860'],
    rim: '#0A3860',
    details(w, cx, cy, rx, ry) {
      return `
      <ellipse cx="${cx * 0.56}" cy="${cy - ry * 0.42}" rx="${w * 0.13}" ry="${w * 0.062}" fill="rgba(255,255,255,.78)"/>
      <ellipse cx="${cx * 1.38}" cy="${cy - ry * 0.22}" rx="${w * 0.10}" ry="${w * 0.052}" fill="rgba(255,255,255,.68)"/>
      <rect x="${cx - w * 0.24}" y="${cy - ry * 1.02}" width="8" height="${ry * 0.92}" rx="4" fill="#C8ECFF" stroke="#0A3860" stroke-width="2.5"/>
      <ellipse cx="${cx - w * 0.20}" cy="${cy - ry * 1.05}" rx="6" ry="9" fill="#DFFFFF" stroke="#0A3860" stroke-width="2"/>
      <rect x="${cx + w * 0.02}" y="${cy - ry * 1.18}" width="9" height="${ry * 1.06}" rx="4" fill="#C8ECFF" stroke="#0A3860" stroke-width="2.5"/>
      <ellipse cx="${cx + w * 0.06}" cy="${cy - ry * 1.21}" rx="7" ry="10" fill="#DFFFFF" stroke="#0A3860" stroke-width="2"/>
      <rect x="${cx + w * 0.22}" y="${cy - ry * 0.94}" width="7" height="${ry * 0.84}" rx="3" fill="#C8ECFF" stroke="#0A3860" stroke-width="2"/>
      <ellipse cx="${cx + w * 0.25}" cy="${cy - ry * 0.96}" rx="5" ry="7" fill="#DFFFFF" stroke="#0A3860" stroke-width="1.5"/>
    `;
    }
  },
  volcano: {
    cap: ['#8B3A1A', '#6E2510', '#3D1000'],
    rock: ['#7A2810', '#5C1C08', '#3E1002', '#220600'],
    rim: '#220600',
    details(w, cx, cy, rx, ry) {
      return `
      <ellipse cx="${cx}" cy="${cy - ry * 0.28}" rx="${w * 0.17}" ry="${w * 0.095}" fill="#120200" stroke="#FF5500" stroke-width="3.5"/>
      <ellipse cx="${cx}" cy="${cy - ry * 0.24}" rx="${w * 0.10}" ry="${w * 0.055}" fill="#FF3300" opacity=".88"/>
      <circle cx="${cx}" cy="${cy - ry * 1.15}" r="${w * 0.08}" fill="rgba(70,55,55,.42)"/>
      <circle cx="${cx - w * 0.06}" cy="${cy - ry * 1.32}" r="${w * 0.055}" fill="rgba(55,45,45,.32)"/>
      <path d="M${cx + w * 0.09},${cy - ry * 0.20} Q${cx + w * 0.20},${cy + ry * 0.15} ${cx + w * 0.24},${cy + ry * 0.48}" stroke="#FF7700" stroke-width="6" fill="none" stroke-linecap="round" opacity=".82"/>
      <path d="M${cx - w * 0.07},${cy - ry * 0.18} Q${cx - w * 0.18},${cy + ry * 0.12} ${cx - w * 0.22},${cy + ry * 0.42}" stroke="#FF5500" stroke-width="5" fill="none" stroke-linecap="round" opacity=".72"/>
    `;
    }
  },
  jungle: {
    cap: ['#82E840', '#52C01A', '#268A08'],
    rock: ['#4A8820', '#346015', '#1E400A', '#0E2804'],
    rim: '#0E2804',
    details(w, cx, cy, rx, ry) {
      return `
      <line x1="${cx - w * 0.24}" y1="${cy + ry * 0.18}" x2="${cx - w * 0.30}" y2="${cy - ry * 1.02}" stroke="#5C3A10" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="${cx - w * 0.30}" cy="${cy - ry * 1.06}" rx="${w * 0.16}" ry="${w * 0.075}" fill="#28C040" stroke="#0C4C10" stroke-width="3"/>
      <line x1="${cx - w * 0.30}" y1="${cy - ry * 1.04}" x2="${cx - w * 0.44}" y2="${cy - ry * 0.76}" stroke="#1A9A28" stroke-width="3" fill="none"/>
      <line x1="${cx - w * 0.30}" y1="${cy - ry * 1.04}" x2="${cx - w * 0.16}" y2="${cy - ry * 0.78}" stroke="#1A9A28" stroke-width="3" fill="none"/>
      <line x1="${cx + w * 0.22}" y1="${cy + ry * 0.14}" x2="${cx + w * 0.28}" y2="${cy - ry * 0.96}" stroke="#5C3A10" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="${cx + w * 0.28}" cy="${cy - ry * 0.99}" rx="${w * 0.14}" ry="${w * 0.068}" fill="#30D048" stroke="#0C4C10" stroke-width="2.5"/>
      <line x1="${cx + w * 0.28}" y1="${cy - ry * 0.97}" x2="${cx + w * 0.14}" y2="${cy - ry * 0.72}" stroke="#20A830" stroke-width="3" fill="none"/>
      <line x1="${cx + w * 0.28}" y1="${cy - ry * 0.97}" x2="${cx + w * 0.42}" y2="${cy - ry * 0.70}" stroke="#20A830" stroke-width="3" fill="none"/>
      <circle cx="${cx - w * 0.08}" cy="${cy - ry * 0.48}" r="${w * 0.032}" fill="#FF88CC" stroke="#CC3388" stroke-width="2"/>
      <circle cx="${cx + w * 0.14}" cy="${cy - ry * 0.32}" r="${w * 0.026}" fill="#FF6688" stroke="#CC1144" stroke-width="1.5"/>
    `;
    }
  },
  desert: {
    cap: ['#F5C84A', '#E0A030', '#A05010'],
    rock: ['#C87820', '#A05010', '#784008', '#4A2008'],
    rim: '#4A2008',
    details(w, cx, cy, rx, ry) {
      return `
      <polygon points="${cx - w * 0.26},${cy + ry * 0.44} ${cx - w * 0.02},${cy - ry * 1.08} ${cx + w * 0.22},${cy + ry * 0.44}" fill="#E8B040" stroke="#7A3808" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="${cx + w * 0.10},${cy + ry * 0.38} ${cx + w * 0.30},${cy - ry * 0.60} ${cx + w * 0.48},${cy + ry * 0.38}" fill="#D8A038" stroke="#7A3808" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="${cx - w * 0.48},${cy + ry * 0.40} ${cx - w * 0.30},${cy - ry * 0.52} ${cx - w * 0.12},${cy + ry * 0.40}" fill="#DCA83A" stroke="#7A3808" stroke-width="3" stroke-linejoin="round"/>
      <line x1="${cx - rx * 0.85}" y1="${cy + ry * 0.15}" x2="${cx + rx * 0.85}" y2="${cy + ry * 0.15}" stroke="rgba(160,80,15,.28)" stroke-width="2"/>
      <line x1="${cx - rx * 0.85}" y1="${cy + ry * 0.35}" x2="${cx + rx * 0.85}" y2="${cy + ry * 0.35}" stroke="rgba(140,65,12,.22)" stroke-width="1.5"/>
    `;
    }
  },
  forest: {
    // "Nature Cave Sanctuary" — dark mossy rock, glowing cave mouth, bioluminescent roots
    cap: ['#2E6B1A', '#1A4410', '#0C2608'],
    rock: ['#183E0C', '#0E2808', '#081802', '#020A00'],
    rim: '#020A00',
    details(w, cx, cy, rx, ry) {
      return `
      <!-- Mossy surface patches -->
      <ellipse cx="${cx - rx * 0.55}" cy="${cy - ry * 0.12}" rx="${w * 0.11}" ry="${w * 0.055}" fill="#1E5C10" opacity=".70"/>
      <ellipse cx="${cx + rx * 0.48}" cy="${cy - ry * 0.20}" rx="${w * 0.09}" ry="${w * 0.045}" fill="#1A5410" opacity=".65"/>

      <!-- Glowing cave mouth — large, centred, unmistakable -->
      <ellipse cx="${cx}" cy="${cy + ry * 0.18}" rx="${w * 0.26}" ry="${w * 0.155}" fill="#060E04" stroke="#0C2808" stroke-width="4"/>
      <ellipse cx="${cx}" cy="${cy + ry * 0.22}" rx="${w * 0.18}" ry="${w * 0.100}" fill="#020602"/>
      <!-- Inner glow -->
      <ellipse cx="${cx}" cy="${cy + ry * 0.24}" rx="${w * 0.10}" ry="${w * 0.055}" fill="rgba(60,255,120,.18)"/>
      <ellipse cx="${cx}" cy="${cy + ry * 0.25}" rx="${w * 0.05}" ry="${w * 0.026}" fill="rgba(80,255,140,.28)"/>

      <!-- Gnarled root arching left -->
      <path d="M${cx - rx * 0.15},${cy + ry * 0.12} Q${cx - rx * 0.55},${cy - ry * 0.28} ${cx - rx * 0.78},${cy - ry * 0.05}" stroke="#3A6820" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Gnarled root arching right -->
      <path d="M${cx + rx * 0.12},${cy + ry * 0.10} Q${cx + rx * 0.52},${cy - ry * 0.25} ${cx + rx * 0.76},${cy - ry * 0.08}" stroke="#2E5818" stroke-width="4" fill="none" stroke-linecap="round"/>

      <!-- Bioluminescent mushrooms -->
      <rect x="${cx - w * 0.30}" y="${cy + ry * 0.38}" width="6" height="12" fill="#5C3A10" rx="2"/>
      <ellipse cx="${cx - w * 0.27}" cy="${cy + ry * 0.38}" rx="10" ry="5" fill="#60FF80" stroke="#20A830" stroke-width="1.5"/>
      <rect x="${cx + w * 0.18}" y="${cy + ry * 0.42}" width="5" height="10" fill="#5C3A10" rx="2"/>
      <ellipse cx="${cx + w * 0.205}" cy="${cy + ry * 0.42}" rx="8" ry="4" fill="#80FFB0" stroke="#28B840" stroke-width="1.5"/>

      <!-- Floating spores / fireflies -->
      <circle cx="${cx - w * 0.14}" cy="${cy - ry * 0.55}" r="${w * 0.018}" fill="rgba(80,255,120,.72)"/>
      <circle cx="${cx + w * 0.22}" cy="${cy - ry * 0.40}" r="${w * 0.014}" fill="rgba(100,255,160,.65)"/>
      <circle cx="${cx - w * 0.32}" cy="${cy - ry * 0.30}" r="${w * 0.012}" fill="rgba(60,220,100,.58)"/>
    `;
    }
  },
  abyss: {
    cap: ['#0E4858', '#083040', '#031828'],
    rock: ['#063040', '#041E28', '#021018', '#000608'],
    rim: '#000608',
    details(w, cx, cy, rx, ry) {
      return `
      <ellipse cx="${cx}" cy="${cy + ry * 0.14}" rx="${w * 0.19}" ry="${w * 0.115}" fill="#010408" stroke="#00A8D0" stroke-width="3.5"/>
      <ellipse cx="${cx}" cy="${cy + ry * 0.17}" rx="${w * 0.10}" ry="${w * 0.060}" fill="rgba(0,180,230,.15)"/>
      <circle cx="${cx - w * 0.32}" cy="${cy - ry * 0.40}" r="${w * 0.030}" fill="rgba(0,230,255,.62)"/>
      <circle cx="${cx + w * 0.30}" cy="${cy - ry * 0.24}" r="${w * 0.024}" fill="rgba(0,210,248,.55)"/>
      <circle cx="${cx - w * 0.08}" cy="${cy - ry * 0.65}" r="${w * 0.020}" fill="rgba(0,248,255,.68)"/>
      <circle cx="${cx + w * 0.20}" cy="${cy - ry * 0.58}" r="${w * 0.022}" fill="rgba(0,220,255,.60)"/>
      <polygon points="${cx - rx * 0.78},${cy + ry * 0.38} ${cx - rx * 0.68},${cy - ry * 0.28} ${cx - rx * 0.58},${cy + ry * 0.38}" fill="#082A3C" stroke="#00A8D0" stroke-width="3"/>
      <polygon points="${cx + rx * 0.58},${cy + ry * 0.32} ${cx + rx * 0.68},${cy - ry * 0.22} ${cx + rx * 0.78},${cy + ry * 0.32}" fill="#082A3C" stroke="#00A8D0" stroke-width="3"/>
    `;
    }
  }
};

function _cartoonIslandSVG(b, w) {
  const style = _CARTOON_BIOME[b.id];
  if (!style) return `<div style="width:${w}px;height:${Math.round(w * 1.28)}px"></div>`;

  const H = Math.round(w * 1.28);
  const cx = w / 2;

  // Terrain cap geometry
  const capCy = Math.round(H * 0.26);
  const capRx = w * 0.495;
  const capRy = Math.round(w * 0.215);

  // Organic rock body: tapers from cap equator down to a round tip
  const rY0 = capCy;                     // rock top (cap equator level)
  const rW0 = w * 0.880;                 // rock width at top
  const rW1 = w * 0.680;                 // rock width at 38%
  const rW2 = w * 0.440;                 // rock width at 68%
  const rY1 = H * 0.44;
  const rY2 = H * 0.68;
  const rY3 = H * 0.84;                  // tip bottom

  // Slight irregularity offsets for organic feel
  const lBulge = 10, rBulge = 12;

  const rockPath = [
    `M ${cx - rW0 / 2},${rY0}`,
    `Q ${cx - rW0 / 2 - lBulge},${rY0 + (rY1 - rY0) * 0.45} ${cx - rW1 / 2 - 6},${rY1}`,
    `Q ${cx - rW1 / 2 - 4},${rY1 + (rY2 - rY1) * 0.55} ${cx - rW2 / 2},${rY2}`,
    `Q ${cx - rW2 / 2 + 10},${rY2 + (rY3 - rY2) * 0.65} ${cx},${rY3 + 22}`,
    `Q ${cx + rW2 / 2 - 10},${rY2 + (rY3 - rY2) * 0.65} ${cx + rW2 / 2},${rY2}`,
    `Q ${cx + rW1 / 2 + 4},${rY1 + (rY2 - rY1) * 0.55} ${cx + rW1 / 2 + 6},${rY1}`,
    `Q ${cx + rW0 / 2 + rBulge},${rY0 + (rY1 - rY0) * 0.45} ${cx + rW0 / 2},${rY0}`,
    `Z`
  ].join(' ');

  // Hanging stalactites
  const stals = [
    { dx: -w * 0.18, sw: w * 0.088, sh: w * 0.115 },
    { dx: -w * 0.04, sw: w * 0.106, sh: w * 0.162 },
    { dx: w * 0.10, sw: w * 0.076, sh: w * 0.098 },
    { dx: w * 0.22, sw: w * 0.058, sh: w * 0.072 },
  ];
  const stalSVG = stals.map(s => {
    const sx = cx + s.dx;
    const sy = rY3 + 16;
    return `<polygon points="${sx},${sy} ${sx + s.sw / 2},${sy + s.sh} ${sx + s.sw},${sy}" fill="${style.rock[3]}" stroke="#111" stroke-width="3.5" stroke-linejoin="round"/>`;
  }).join('');

  // Rock body texture: ledge lines + cracks
  const ledge1 = H * 0.50, ledge2 = H * 0.65;
  const ledgeW1 = rW0 * 0.80, ledgeW2 = rW1 * 0.72;
  const texture = `
    <line x1="${cx - ledgeW1 / 2 + 8}" y1="${ledge1}" x2="${cx + ledgeW1 / 2 - 8}" y2="${ledge1}" stroke="rgba(0,0,0,.20)" stroke-width="2"/>
    <line x1="${cx - ledgeW2 / 2 + 6}" y1="${ledge2}" x2="${cx + ledgeW2 / 2 - 6}" y2="${ledge2}" stroke="rgba(0,0,0,.16)" stroke-width="1.5"/>
    <line x1="${cx - rW0 / 2 + 22}" y1="${rY0 + 8}" x2="${cx - rW2 / 2 + 12}" y2="${rY2 - 6}" stroke="rgba(0,0,0,.13)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="${cx + rW0 / 2 - 24}" y1="${rY0 + 10}" x2="${cx + rW2 / 2 - 14}" y2="${rY2 - 4}" stroke="rgba(0,0,0,.11)" stroke-width="1.5" stroke-linecap="round"/>
  `;

  // Rock left-face highlight
  const highlight = `<path d="M ${cx - rW0 / 2},${rY0} Q ${cx - rW0 / 2 - lBulge + 4},${rY0 + (rY1 - rY0) * 0.45} ${cx - rW1 / 2},${rY1} L ${cx - rW1 / 2 + 20},${rY1} L ${cx - rW0 / 2 + 24},${rY0} Z" fill="rgba(255,255,255,.09)"/>`;

  const [c0, c1, c2, c3] = style.rock;
  const [t0, t1, t2] = style.cap;
  const gid = `cig${b.id}`;

  return `<svg class="cartoon-island-svg"
       width="${w}" height="${H}"
       viewBox="0 0 ${w} ${H}"
       xmlns="http://www.w3.org/2000/svg"
       style="display:block;overflow:visible;position:relative;z-index:3">
    <defs>
      <radialGradient id="${gid}c" cx="38%" cy="30%" r="65%">
        <stop offset="0%"   stop-color="${t0}"/>
        <stop offset="55%"  stop-color="${t1}"/>
        <stop offset="100%" stop-color="${t2}"/>
      </radialGradient>
      <linearGradient id="${gid}r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${c0}"/>
        <stop offset="38%"  stop-color="${c1}"/>
        <stop offset="72%"  stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
    </defs>

    <!-- Rock body -->
    <path d="${rockPath}" fill="url(#${gid}r)" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
    ${highlight}
    ${texture}

    <!-- Hanging stalactites -->
    ${stalSVG}

    <!-- Terrain cap -->
    <ellipse cx="${cx}" cy="${capCy}" rx="${capRx}" ry="${capRy}"
             fill="url(#${gid}c)" stroke="#111" stroke-width="5.5"/>

    <!-- Gloss highlight -->
    <ellipse cx="${cx - capRx * 0.14}" cy="${capCy - capRy * 0.33}" rx="${capRx * 0.50}" ry="${capRy * 0.40}" fill="rgba(255,255,255,.26)"/>

    <!-- Cap bottom rim shadow -->
    <ellipse cx="${cx}" cy="${capCy + capRy * 0.66}" rx="${capRx * 0.68}" ry="${capRy * 0.20}" fill="rgba(0,0,0,.20)"/>

    <!-- Biome terrain details (drawn on top of cap) -->
    ${style.details(w, cx, capCy, capRx, capRy)}
  </svg>`;
}

// Legacy stub kept so nothing else breaks
function _biomeSVGTerrain(b, w, capH) {
  const svgW = w, svgH = capH;
  // Each biome gets unique rock/mountain SVG silhouettes drawn on the cap
  const profiles = {
    tundra: `
      <polygon points="0,${svgH} ${svgW * 0.08},${svgH * 0.55} ${svgW * 0.18},${svgH * 0.28} ${svgW * 0.28},${svgH * 0.55} ${svgW * 0.35},${svgH}" fill="rgba(180,220,240,.22)"/>
      <polygon points="${svgW * 0.30},${svgH} ${svgW * 0.42},${svgH * 0.18} ${svgW * 0.54},${svgH * 0.42} ${svgW * 0.62},${svgH}" fill="rgba(160,210,235,.18)"/>
      <polygon points="${svgW * 0.56},${svgH} ${svgW * 0.68},${svgH * 0.32} ${svgW * 0.76},${svgH * 0.12} ${svgW * 0.84},${svgH * 0.38} ${svgW * 0.92},${svgH}" fill="rgba(200,235,250,.20)"/>
      <rect x="${svgW * 0.16}" y="${svgH * 0.20}" width="3" height="${svgH * 0.35}" rx="2" fill="rgba(140,200,230,.55)"/>
      <rect x="${svgW * 0.40}" y="${svgH * 0.08}" width="3" height="${svgH * 0.42}" rx="2" fill="rgba(140,200,230,.60)"/>
      <rect x="${svgW * 0.76}" y="${svgH * 0.06}" width="3" height="${svgH * 0.38}" rx="2" fill="rgba(140,200,230,.55)"/>
      <ellipse cx="${svgW * 0.18}" cy="${svgH * 0.20}" rx="${svgW * 0.04}" ry="${svgH * 0.06}" fill="rgba(230,248,255,.45)"/>
      <ellipse cx="${svgW * 0.42}" cy="${svgH * 0.08}" rx="${svgW * 0.05}" ry="${svgH * 0.07}" fill="rgba(230,248,255,.50)"/>
      <ellipse cx="${svgW * 0.76}" cy="${svgH * 0.06}" rx="${svgW * 0.04}" ry="${svgH * 0.06}" fill="rgba(230,248,255,.45)"/>`,

    jungle: `
      <polygon points="0,${svgH} ${svgW * 0.12},${svgH * 0.45} ${svgW * 0.22},${svgH * 0.60} ${svgW * 0.32},${svgH}" fill="rgba(20,100,30,.30)"/>
      <polygon points="${svgW * 0.28},${svgH} ${svgW * 0.38},${svgH * 0.30} ${svgW * 0.50},${svgH * 0.48} ${svgW * 0.60},${svgH}" fill="rgba(15,120,35,.25)"/>
      <polygon points="${svgW * 0.55},${svgH} ${svgW * 0.64},${svgH * 0.22} ${svgW * 0.74},${svgH * 0.40} ${svgW * 0.84},${svgH}" fill="rgba(25,110,28,.28)"/>
      <line x1="${svgW * 0.50}" y1="${svgH * 0.10}" x2="${svgW * 0.50}" y2="${svgH}" stroke="rgba(30,160,80,.35)" stroke-width="4"/>
      <line x1="${svgW * 0.50}" y1="${svgH * 0.10}" x2="${svgW * 0.50}" y2="${svgH}" stroke="rgba(30,160,80,.35)" stroke-width="4"/>
      <ellipse cx="${svgW * 0.44}" cy="${svgH * 0.30}" rx="${svgW * 0.10}" ry="${svgH * 0.12}" fill="rgba(30,180,70,.28)"/>
      <ellipse cx="${svgW * 0.56}" cy="${svgH * 0.25}" rx="${svgW * 0.09}" ry="${svgH * 0.11}" fill="rgba(20,200,60,.22)"/>
      <rect x="${svgW * 0.48}" y="${svgH * 0.36}" width="${svgW * 0.04}" height="${svgH * 0.64}" fill="rgba(60,40,10,.40)"/>
      <rect x="${svgW * 0.20}" y="${svgH * 0.38}" width="${svgW * 0.03}" height="${svgH * 0.62}" fill="rgba(60,40,10,.35)"/>
      <ellipse cx="${svgW * 0.20}" cy="${svgH * 0.28}" rx="${svgW * 0.08}" ry="${svgH * 0.10}" fill="rgba(30,180,70,.25)"/>`,

    volcano: `
      <polygon points="${svgW * 0.10},${svgH} ${svgW * 0.28},${svgH * 0.35} ${svgW * 0.38},${svgH * 0.45} ${svgW * 0.46},${svgH}" fill="rgba(80,20,0,.35)"/>
      <polygon points="${svgW * 0.35},${svgH} ${svgW * 0.50},${svgH * 0.05} ${svgW * 0.65},${svgH}" fill="rgba(100,25,0,.40)"/>
      <polygon points="${svgW * 0.60},${svgH} ${svgW * 0.70},${svgH * 0.38} ${svgW * 0.80},${svgH * 0.50} ${svgW * 0.90},${svgH}" fill="rgba(70,18,0,.32)"/>
      <ellipse cx="${svgW * 0.50}" cy="${svgH * 0.06}" rx="${svgW * 0.06}" ry="${svgH * 0.06}" fill="rgba(255,80,0,.70)"/>
      <path d="M${svgW * 0.46},${svgH * 0.08} Q${svgW * 0.30},${svgH * 0.50} ${svgW * 0.22},${svgH}" stroke="rgba(255,100,0,.50)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M${svgW * 0.54},${svgH * 0.08} Q${svgW * 0.70},${svgH * 0.48} ${svgW * 0.78},${svgH}" stroke="rgba(255,80,0,.45)" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="${svgW * 0.50}" cy="${svgH * 0.14}" rx="${svgW * 0.10}" ry="${svgH * 0.05}" fill="rgba(255,40,0,.22)" opacity="0.8"/>`,

    forest: `
      <ellipse cx="${svgW * 0.50}" cy="${svgH * 0.68}" rx="${svgW * 0.17}" ry="${svgH * 0.16}" fill="rgba(20,45,22,.62)"/>
      <ellipse cx="${svgW * 0.50}" cy="${svgH * 0.68}" rx="${svgW * 0.11}" ry="${svgH * 0.09}" fill="rgba(6,16,8,.72)"/>
      <path d="M${svgW * 0.24},${svgH * 0.28} Q${svgW * 0.36},${svgH * 0.12} ${svgW * 0.50},${svgH * 0.24}" stroke="rgba(52,120,46,.40)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M${svgW * 0.50},${svgH * 0.24} Q${svgW * 0.66},${svgH * 0.08} ${svgW * 0.78},${svgH * 0.22}" stroke="rgba(52,120,46,.36)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="${svgW * 0.42}" cy="${svgH * 0.68}" r="${svgW * 0.020}" fill="rgba(115,255,185,.42)"/>
      <circle cx="${svgW * 0.58}" cy="${svgH * 0.68}" r="${svgW * 0.018}" fill="rgba(115,255,185,.34)"/>`,

    desert: `
      <polygon points="0,${svgH} ${svgW * 0.15},${svgH * 0.38} ${svgW * 0.28},${svgH * 0.55} ${svgW * 0.40},${svgH}" fill="rgba(160,90,10,.30)"/>
      <polygon points="${svgW * 0.32},${svgH} ${svgW * 0.50},${svgH * 0.10} ${svgW * 0.68},${svgH}" fill="rgba(180,110,15,.35)"/>
      <polygon points="${svgW * 0.60},${svgH} ${svgW * 0.72},${svgH * 0.40} ${svgW * 0.82},${svgH * 0.55} ${svgW * 0.95},${svgH}" fill="rgba(150,85,8,.28)"/>
      <polygon points="${svgW * 0.44},${svgH * 0.10} ${svgW * 0.50},${svgH * 0.02} ${svgW * 0.56},${svgH * 0.10}" fill="rgba(200,140,20,.45)"/>
      <rect x="${svgW * 0.46}" y="${svgH * 0.10}" width="${svgW * 0.08}" height="${svgH * 0.22}" fill="rgba(180,120,15,.38)"/>
      <line x1="${svgW * 0.10}" y1="${svgH * 0.65}" x2="${svgW * 0.90}" y2="${svgH * 0.65}" stroke="rgba(200,140,30,.18)" stroke-width="2"/>
      <line x1="${svgW * 0.10}" y1="${svgH * 0.80}" x2="${svgW * 0.90}" y2="${svgH * 0.80}" stroke="rgba(200,140,30,.14)" stroke-width="1.5"/>
      <ellipse cx="${svgW * 0.50}" cy="${svgH * 0.55}" rx="${svgW * 0.35}" ry="${svgH * 0.08}" fill="rgba(220,160,40,.08)"/>`,

    abyss: `
      <polygon points="0,${svgH} ${svgW * 0.12},${svgH * 0.48} ${svgW * 0.24},${svgH * 0.62} ${svgW * 0.34},${svgH}" fill="rgba(0,40,80,.42)"/>
      <polygon points="${svgW * 0.28},${svgH} ${svgW * 0.38},${svgH * 0.28} ${svgW * 0.50},${svgH * 0.44} ${svgW * 0.60},${svgH}" fill="rgba(0,50,90,.38)"/>
      <polygon points="${svgW * 0.54},${svgH} ${svgW * 0.64},${svgH * 0.36} ${svgW * 0.74},${svgH * 0.20} ${svgW * 0.84},${svgH * 0.42} ${svgW * 0.94},${svgH}" fill="rgba(0,45,85,.40)"/>
      <ellipse cx="${svgW * 0.38}" cy="${svgH * 0.60}" rx="${svgW * 0.14}" ry="${svgH * 0.18}" fill="rgba(0,20,50,.65)"/>
      <ellipse cx="${svgW * 0.38}" cy="${svgH * 0.60}" rx="${svgW * 0.08}" ry="${svgH * 0.10}" fill="rgba(0,0,20,.80)"/>
      <circle cx="${svgW * 0.18}" cy="${svgH * 0.45}" r="${svgW * 0.025}" fill="rgba(0,200,255,.45)"/>
      <circle cx="${svgW * 0.65}" cy="${svgH * 0.50}" r="${svgW * 0.020}" fill="rgba(0,180,220,.40)"/>
      <circle cx="${svgW * 0.80}" cy="${svgH * 0.35}" r="${svgW * 0.018}" fill="rgba(0,220,255,.35)"/>
      <line x1="${svgW * 0.34}" y1="${svgH * 0.10}" x2="${svgW * 0.42}" y2="${svgH * 0.58}" stroke="rgba(0,180,220,.30)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="${svgW * 0.50}" y1="${svgH * 0.05}" x2="${svgW * 0.45}" y2="${svgH * 0.55}" stroke="rgba(0,160,200,.22)" stroke-width="2" stroke-linecap="round"/>`,
  };
  return `<svg class="inode-svg-terrain" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${profiles[b.id] || ''}</svg>`;
}

function buildIslandHTML(b) {
  const pos = getIslandPositions()[b.id];
  if (!pos) return '';
  const ter = ISLAND_TERRAIN[b.id];
  if (!ter) return '';

  // ── Per-player island lock (extreme mode) ──────────────────
  const _FEATURED_ORDER = ['tundra', 'volcano', 'jungle', 'desert', 'forest'];
  const islandIndex = _FEATURED_ORDER.indexOf(b.id) + 1;
  const islandUnlocked = islandIndex <= (G.extremeProgress || 1);
  const prevIslandName = islandIndex > 1
    ? (BIOME_DEFS[_FEATURED_ORDER[islandIndex - 2]]?.name || 'previous island')
    : null;
  const lockOverlay = islandUnlocked ? '' : `
    <div style="position:absolute;inset:0;background:rgba(0,0,0,.65);
                border-radius:12px;display:flex;flex-direction:column;
                align-items:center;justify-content:center;z-index:20;
                pointer-events:none;gap:6px">
      <span style="font-size:2.6rem;line-height:1">\u{1F512}</span>
      <span style="font-family:Cinzel,serif;font-size:11px;color:#bbb;
                   letter-spacing:.08em;text-align:center;padding:0 12px">
        Clear ${prevIslandName} to unlock
      </span>
    </div>`;
  const clickHandler = islandUnlocked
    ? `islandNodeClick('${b.id}')`
    : `showToast('🔒 Complete ${prevIslandName || 'the previous island'} first!','tinfo')`;

  const isMobile = window.innerWidth <= 640;
  const decoScale = isMobile ? 0.60 : 1;
  const w = pos.w;

  // SVG island height (matches _cartoonIslandSVG)
  const islandH = Math.round(w * 1.28);

  // Particle canvas covers island + surrounding glow
  const cvW = w + 180, cvH = islandH + 240;
  const cvLeft = -90, cvTop = -120;

  // Emoji deco items rendered absolutely over the SVG cap zone
  // Cap centre is at ~26% of island height, cap radius ~21.5% of w
  const capCy = Math.round(islandH * 0.26);
  const capRy = Math.round(w * 0.215);
  const decoHtml = ter.deco.map((d, i) => {
    // d.x / d.y are percentages of the old cap (0–100%).
    // Remap to absolute px over the full island SVG area.
    const px = w * (d.x / 100);
    const py = (capCy - capRy) + (capRy * 2) * (d.y / 100) - 8;
    return `<span class="inode-deco-item" style="position:absolute;left:${Math.round(px)}px;top:${Math.round(py)}px;font-size:${Math.round(d.s * decoScale)}px;animation-delay:${(i * 0.55).toFixed(2)}s;pointer-events:none;z-index:10">${d.e}</span>`;
  }).join('');

  const starsHtml = '⭐'.repeat(b.difficulty) +
    `<span style="opacity:.22">${'⭐'.repeat(5 - b.difficulty)}</span>`;

  const shadowGlow = `0 0 ${Math.round(w * 0.38)}px ${Math.round(w * 0.12)}px ${b.color}30`;

  // Per-biome outer drop-shadow glow on the whole island wrapper
  const glowMap = {
    volcano: 'drop-shadow(0 0 22px rgba(255,80,0,.35)) drop-shadow(0 0 48px rgba(200,40,0,.18))',
    tundra: 'drop-shadow(0 0 22px rgba(34,211,238,.22)) drop-shadow(0 0 48px rgba(100,220,255,.12))',
    jungle: 'drop-shadow(0 0 22px rgba(16,185,129,.22)) drop-shadow(0 0 48px rgba(30,200,80,.12))',
    forest: 'drop-shadow(0 0 22px rgba(139,92,246,.28)) drop-shadow(0 0 48px rgba(120,60,240,.15))',
    desert: 'drop-shadow(0 0 22px rgba(245,158,11,.24)) drop-shadow(0 0 48px rgba(220,120,0,.13))',
    abyss: 'drop-shadow(0 0 22px rgba(6,182,212,.22))  drop-shadow(0 0 48px rgba(0,150,200,.12))',
  };
  const islandFilter = glowMap[b.id] || '';

  return `
  <div class="island-node inode-biome-${b.id}" data-biome="${b.id}" onclick="${clickHandler}"
       style="left:${pos.left};top:${pos.top};--float-dur:${pos.floatDur};--float-delay:${pos.floatDelay};z-index:${pos.zIndex};--biome-glow:${b.color};width:${w}px;height:${islandH}px;position:absolute;cursor:${islandUnlocked ? 'pointer' : 'not-allowed'}">

    <!-- Particle canvas -->
    <canvas class="inode-particles" id="ipc-${b.id}"
            width="${cvW}" height="${cvH}"
            style="position:absolute;width:${cvW}px;height:${cvH}px;top:${cvTop}px;left:${cvLeft}px;pointer-events:none;z-index:1"></canvas>

    ${_biomeAmbient(b)}

    <!-- ── CARTOON SVG ISLAND BODY ── -->
    <div style="position:relative;width:${w}px;height:${islandH}px;filter:${islandFilter}">
      ${_cartoonIslandSVG(b, w)}
      <!-- Emoji deco layer -->
      ${decoHtml}
      <!-- Lock overlay (hidden if island is unlocked for this player) -->
      ${lockOverlay}
    </div>

    <!-- ── FLOATING SHADOW ── -->
    <div class="inode-shadow" style="width:${Math.round(w * .58)}px;margin-left:${Math.round(w * .21)}px;box-shadow:${shadowGlow}"></div>

    <!-- ── NAMEPLATE ── -->
    <div class="inode-nameplate" style="--biome-col:${b.color};opacity:${islandUnlocked ? 1 : 0.55}">
      <span class="inode-np-icon">${b.icon}</span>
      <span class="inode-np-name">${b.name}</span>
      <span class="inode-np-tagline">${islandUnlocked ? b.tagline : '🔒 Locked'}</span>
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

  // Show the five stylized hero islands used by current art direction.
  const featuredOrder = ['tundra', 'volcano', 'jungle', 'desert', 'forest'];
  const islands = featuredOrder
    .map(id => BIOME_DEFS[id])
    .filter(Boolean)
    .map(buildIslandHTML)
    .join('');

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
  const modal = document.getElementById('back-to-island-modal');
  if (G.gameMode === 'story') {
    modal.querySelector('.modal-crest').textContent = '🗺️';
    modal.querySelector('.modal-title').textContent = 'Back to Stages?';
    modal.querySelector('.primary-btn').textContent = '🗺️ Choose Stage';
  } else {
    modal.querySelector('.modal-crest').textContent = '🏝️';
    modal.querySelector('.modal-title').textContent = 'Change Island?';
    modal.querySelector('.primary-btn').textContent = '🏝️ Choose Island';
  }
  modal.style.display = 'flex';
};

window.closeBackToIslandModal = function () {
  document.getElementById('back-to-island-modal').style.display = 'none';
};

window.goBackToIsland = function () {
  document.getElementById('back-to-island-modal').style.display = 'none';
  G.gameOver = true;
  G.isAnimating = false;
  saveGame();
  document.getElementById('game-section').style.display = 'none';
  if (G.gameMode === 'story') {
    loadStageProgress();
    showStageSelect();
  } else {
    document.getElementById('island-select-section').style.display = 'flex';
    buildIslandSelect();
  }
};

window.selectBiome = function (biomeId) {
  const biome = BIOME_DEFS[biomeId];
  if (!biome) return;
  G.activeBiome = biome;
  G._biomeReward = biome.reward;
  // Persist so refreshes / continues keep the biome-themed board
  try { localStorage.setItem('kr_active_biome', biomeId); } catch (_) { }
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
  // Restore biome from localStorage before recreating board
  if (G.gameMode === 'extreme' && !G.activeBiome) {
    try {
      const savedBiome = localStorage.getItem('kr_active_biome');
      if (savedBiome && BIOME_DEFS[savedBiome]) {
        G.activeBiome = BIOME_DEFS[savedBiome];
        G._biomeReward = G.activeBiome.reward;
      }
    } catch (_) { }
  }
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
  G.turnNumber = 0; G.cleanTurns = 0; G.momentum = 0; G.tacticalRating = 0;

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

const TILE_VARIANTS = 5;

function getBoardThemeClass() {
  if (G.gameMode === 'story' && G.storyStage) return `stage-${G.storyStage}`;
  if (G.activeBiome?.id) return `biome-${G.activeBiome.id}`;
  return '';
}

function getTileVariant(x, y, themeClass) {
  const seed = (themeClass || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return Math.abs((x * 17 + y * 31 + x * y * 7 + seed) % TILE_VARIANTS);
}

// ── BOARD CREATION ────────────────────────────────────────────
function createBoard() {
  boardEl.innerHTML = '';
  const stageTheme = (G.gameMode === 'story' && G.storyStage)
    ? STAGE_TILE_THEMES[G.storyStage - 1] : null;
  const boardThemeClass = getBoardThemeClass();

  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x; cell.dataset.y = y;

      // Apply assigned stage/biome class and deterministic tile variation.
      if (boardThemeClass) {
        cell.classList.add(boardThemeClass);
        cell.dataset.tv = String(getTileVariant(x, y, boardThemeClass));
      }

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
            const idx = getTileVariant(x, y, boardThemeClass) % stageTheme.pathDeco.length;
            deco.textContent = stageTheme.pathDeco[idx];
            cell.appendChild(deco);
          }
        }
      } else {
        // Add rare ground decorations on a few non-path cells
        if (stageTheme && (x * 7 + y * 3) % 11 === 0) {
          const gdeco = document.createElement('span');
          gdeco.className = 'ground-deco';
          const idx = getTileVariant(x + 3, y + 1, boardThemeClass) % stageTheme.groundDeco.length;
          gdeco.textContent = stageTheme.groundDeco[idx];
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
  const towerPower = G.towers.reduce((sum, t) => sum + (t.level || 1) * 1.5 + (t.damage || 0) * 0.1 + (t.range || 1) * 0.5, 0);
  const adaptivePressure = G.gameMode === 'extreme'
    ? Math.min(0.45, towerPower / 220)
    : Math.min(0.2, towerPower / 280);
  let hpScale = baseScale * (G.gameMode === 'extreme' ? 1.75 : 1) * (biome ? biome.enemyMods.hpMult : 1);
  let dmgMult = biome ? biome.enemyMods.dmgMult : (isBossWave ? 1.3 : 1);
  hpScale *= (1 + adaptivePressure);
  dmgMult *= (1 + adaptivePressure * 0.6);
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
  const totalEnemies = groups.reduce((sum, g) => sum + g.count, 0);
  const heavyEnemies = groups
    .filter(g => ['troll', 'knight', 'dragon'].includes(g.type))
    .reduce((sum, g) => sum + g.count, 0);
  const tacticalHint = G.gameMode === 'extreme'
    ? `Extreme directive: Focus breach threats first. Heavy units ${heavyEnemies}/${totalEnemies}.`
    : `Story directive: Build momentum with clean turns for bonus rewards.`;
  document.getElementById('wsm-sub').textContent += ` ${tacticalHint}`;

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
  G.turnNumber++;
  G.isAnimating = true;
  setPhase('combat');
  document.getElementById('execute-btn').disabled = true;
  let turnKills = 0;
  let breachesThisTurn = 0;

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
      turnKills++;
      G.totalKills++;
      newGold += e.reward;
      G.score += e.reward * 2;
      updateQuestProgress('kill');
      if (e.type === 'dragon') { G.dragonKills++; updateQuestProgress('dragon'); }
      return false;
    }
    return true;
  });
  if (newGold > 0) { G.gold += newGold; addLog(`💰 +${newGold} gold from kills.`, 'log-gold'); showToast(`+${newGold}🪙`, 'tsuccess'); renderTowerSelector(); }

  renderBoard(); await sleep(150);

  // Enemies move
  if (!G.frozenTurn) {
    const toRemove = [];
    G.enemies.forEach(e => {
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
        breachesThisTurn++;
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

  // Spawn next enemy AFTER movement — appears cleanly at tile 0, no gap
  if (G.spawnIndex < G.enemiesToSpawn.length) {
    G.enemies.push({ ...G.enemiesToSpawn[G.spawnIndex] });
    G.spawnIndex++;
    renderBoard();
  }

  updateHUD(); updateCastleHpBar();
  applyTurnStrategyOutcome(turnKills, breachesThisTurn);
  updateHUD();

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
  const inRange = G.enemies.filter(e => Math.abs(tower.x - e.x) + Math.abs(tower.y - e.y) <= tower.range);
  const towerDef = TOWER_DEFS[tower.type];
  return inRange.sort((a, b) => {
    const distA = Math.abs(tower.x - a.x) + Math.abs(tower.y - a.y);
    const distB = Math.abs(tower.x - b.x) + Math.abs(tower.y - b.y);
    const baseThreatA = (a.x * 18) + (a.damage * 9) + (a.hp * 0.3) + ((a.def.speed || a.speed || 1) * 10) + (a.frozen ? -15 : 0);
    const baseThreatB = (b.x * 18) + (b.damage * 9) + (b.hp * 0.3) + ((b.def.speed || b.speed || 1) * 10) + (b.frozen ? -15 : 0);
    const abilityBoostA = (a.def.ability === 'breath' ? 30 : 0) + (a.def.ability === 'dash' ? 10 : 0);
    const abilityBoostB = (b.def.ability === 'breath' ? 30 : 0) + (b.def.ability === 'dash' ? 10 : 0);
    let scoreA = baseThreatA + abilityBoostA;
    let scoreB = baseThreatB + abilityBoostB;

    if (towerDef?.type === 'freeze') {
      scoreA += a.frozen ? -40 : 30;
      scoreB += b.frozen ? -40 : 30;
      scoreA += (a.speed || 1) * 12;
      scoreB += (b.speed || 1) * 12;
    } else if (towerDef?.type === 'heavy') {
      scoreA += a.hp * 0.6;
      scoreB += b.hp * 0.6;
    } else if (towerDef?.type === 'chain') {
      scoreA += (6 - distA) * 6;
      scoreB += (6 - distB) * 6;
    }

    if (G.gameMode === 'extreme') {
      scoreA += a.x * 6;
      scoreB += b.x * 6;
    } else {
      scoreA += (a.hp < (a.maxHp || a.hp) * 0.35) ? 8 : 0;
      scoreB += (b.hp < (b.maxHp || b.hp) * 0.35) ? 8 : 0;
    }

    return scoreB - scoreA;
  });
}

function applyTurnStrategyOutcome(turnKills, breachesThisTurn) {
  if (breachesThisTurn === 0) {
    G.cleanTurns += 1;
    G.momentum = Math.min(5, G.momentum + 1);
    if (G.cleanTurns >= 2) {
      const streakGold = Math.min(16, 2 + G.cleanTurns * 2);
      G.gold += streakGold;
      G.score += streakGold * 3;
      addLog(`🧠 Clean-turn streak x${G.cleanTurns}: +${streakGold} gold tactical bonus.`, 'log-gold');
    }
    if (G.gameMode === 'story' && G.momentum >= 3 && G.cleanTurns % 2 === 0) {
      G.diamonds += 1;
      addLog('✨ Story momentum reward: +1 diamond for disciplined defense.', 'log-wave');
    }
  } else {
    G.cleanTurns = 0;
    G.momentum = Math.max(0, G.momentum - breachesThisTurn);
    if (G.gameMode === 'extreme') {
      const pressurePenalty = Math.min(40, breachesThisTurn * 12);
      G.score = Math.max(0, G.score - pressurePenalty);
      addLog(`⚠️ Breach pressure: -${pressurePenalty} score. Protect the gate to keep tempo.`, 'log-attack');
    }
  }

  if (G.gameMode === 'extreme' && turnKills >= 4) {
    const tacticalBonus = Math.min(70, 15 + turnKills * 6 + G.momentum * 3);
    G.score += tacticalBonus;
    G.tacticalRating += 1;
    addLog(`🔥 Tactical burst (${turnKills} kills): +${tacticalBonus} score.`, 'log-wave');
  }
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

  G.gold += goldRwd + biomeGold; G.diamonds += diaRwd + biomeDia; G.score += waveScore; renderTowerSelector();
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
      // Stage complete! — submit score to Hall of Glory before anything else
      await _submitScore(G.score, 'story');
      await saveGame();
      const hpLeft = G.hp;
      const maxHp = G.maxHp;
      const hpPct = hpLeft / maxHp;
      const starsEarned = hpPct > 0.66 ? 3 : hpPct > 0.33 ? 2 : 1;

      // Save stage completion (server-side, per-player)
      if (!G.stagesCleared.includes(G.storyStage)) G.stagesCleared.push(G.storyStage);
      // Advance numeric story progress gate
      if (G.storyStage >= (G.storyProgress || 1)) G.storyProgress = G.storyStage + 1;
      G.stageStars[G.storyStage] = Math.max(starsEarned, G.stageStars[G.storyStage] || 0);
      saveGame(true); // persists stages_cleared + stage_stars + story_progress to server for THIS player

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

  // Snapshot score to Hall of Glory on every 5-wave milestone in extreme mode
  if (isMilestone) await _submitScore(G.score, 'extreme');

  // Unlock next island when THIS player survives to wave 10 on current island
  if (G.gameMode === 'extreme' && G.wave === 10 && G.activeBiome) {
    onIslandCleared(G.activeBiome.id);
  }

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

// ── SCORE SUBMISSION HELPER ────────────────────────────────────
// Central point for all Hall of Glory submissions.
// Dedupes rapid calls within the same wave via a 3-second cooldown.
let _lastScoreSubmit = 0;
async function _submitScore(score, mode) {
  const now = Date.now();
  if (now - _lastScoreSubmit < 3000) return; // debounce
  _lastScoreSubmit = now;
  try {
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, game_mode: mode || G.gameMode || 'story' })
    });
  } catch (_) { /* network failure — silent, not critical */ }
}

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
  await _submitScore(G.score, G.gameMode);
  await saveGame();
}

// ── EXTREME ISLAND UNLOCK ─────────────────────────────────────
// Called when the player clears a "checkpoint wave" (wave 10) on an island.
// Unlocks the next island for THIS player only and persists to the server.
function onIslandCleared(biomeId) {
  const FEATURED_ORDER = ['tundra', 'volcano', 'jungle', 'desert', 'forest'];
  const idx = FEATURED_ORDER.indexOf(biomeId) + 1;  // 1-based
  if (idx < 1) return;
  if (idx >= (G.extremeProgress || 1)) {
    G.extremeProgress = idx + 1;
    saveGame(true);
    const nextName = idx < FEATURED_ORDER.length
      ? (BIOME_DEFS[FEATURED_ORDER[idx]]?.name || 'the next island')
      : null;
    if (nextName) showToast(`🏝️ ${nextName} unlocked!`, 'tdiamond');
  }
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
  updateHUD(); renderTowerSelector(); renderQuests();
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
  updateHUD(); renderShop(); renderTowerSelector();
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
  updateHUD(); renderBoard(); renderShop(); renderTowerSelector();
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
  else if (pu.effect === 'addGold') { G.gold += pu.val; showToast(`+${pu.val}🪙 added!`, 'tsuccess'); renderTowerSelector(); }
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
  updateHUD(); renderTowerSelector(); renderDailyChallenges();
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
function openSettings() {
  const backBtn = document.getElementById('settings-back-btn');
  if (backBtn) {
    backBtn.textContent = G.gameMode === 'story' ? '🗺️ BACK TO STAGES' : '🏝️ BACK TO ISLAND SELECT';
  }
  document.getElementById('settings-modal').style.display = 'flex';
}
function closeSettings() { document.getElementById('settings-modal').style.display = 'none'; }

// ── LEADERBOARD ───────────────────────────────────────────────
// ── HALL OF GLORY — two-tab leaderboard ───────────────────────
let _lbActiveTab = 'story'; // persists across modal opens

function openLeaderboard() {
  fetchLeaderboard();
  document.getElementById('leaderboard-modal').style.display = 'flex';
}
function closeLeaderboard() { document.getElementById('leaderboard-modal').style.display = 'none'; }

window._lbSetTab = function (mode) {
  _lbActiveTab = mode;
  document.querySelectorAll('.lb-tab-btn').forEach(b => {
    b.classList.toggle('lb-tab-active', b.dataset.mode === mode);
  });
  if (window._lbCache) _renderLbTab(window._lbCache[mode] || [], mode);
};

function _renderLbTab(scores, mode) {
  const list = document.getElementById('leaderboard-list');
  const me = (document.getElementById('display-username').textContent || '').trim();
  list.innerHTML = '';
  if (!scores.length) {
    list.innerHTML = `<li style="color:var(--col-dim);text-align:center;padding:20px">
      No ${mode === 'extreme' ? 'Extreme' : 'Story'} scores yet — be the first champion!
    </li>`;
    return;
  }
  scores.forEach((s, i) => {
    const li = document.createElement('li');
    const isMe = s.player === me;
    if (isMe) li.classList.add('me');
    const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    li.innerHTML =
      `<span class="lb-rank">${rank}</span>` +
      `<span class="lb-name">${s.player}${isMe ? ' <span class="lb-you">(You)</span>' : ''}</span>` +
      `<span class="lb-score">${s.score.toLocaleString()} pts</span>`;
    list.appendChild(li);
  });
}

async function fetchLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '<li style="color:var(--col-dim);text-align:center;padding:20px">Loading…</li>';
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();
    // Backend returns { story: [...], extreme: [...] }
    window._lbCache = data;
    _renderLbTab(data[_lbActiveTab] || [], _lbActiveTab);
    document.querySelectorAll('.lb-tab-btn').forEach(b => {
      b.classList.toggle('lb-tab-active', b.dataset.mode === _lbActiveTab);
    });
  } catch {
    list.innerHTML = '<li style="color:#F87171;text-align:center;padding:20px">Could not load scores.</li>';
  }
}

// ── INIT ──────────────────────────────────────────────────────
checkAuth();
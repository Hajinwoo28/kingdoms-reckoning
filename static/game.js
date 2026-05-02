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

// ── CASTLE SKINS ─────────────────────────────────────────────
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
  tempShield: 0
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
  G._savedTowers = []; // new game clears towers
  G.wave = 1;
  G.score = 0;
  G.gold = mode === 'extreme' ? 40 : 80;
  G.diamonds = 0;
  document.getElementById('mode-select-section').style.display = 'none';
  document.getElementById('game-section').style.display = 'flex';
  document.getElementById('display-username').textContent = _pendingUsername;
  restartGame(false);
  const seen = localStorage.getItem('kr_tutorial_done');
  if (!seen) setTimeout(startTutorial, 800);
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
  // Stop any running animation/wave
  G.gameOver = true;
  G.isAnimating = false;
  // Save current state before going back
  saveGame(true);
  // Switch screens
  document.getElementById('game-section').style.display = 'none';
  showModeSelect();
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

// ── BOARD CREATION ────────────────────────────────────────────
function createBoard() {
  boardEl.innerHTML = '';
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x; cell.dataset.y = y;
      if (y === PATH_ROW) {
        if (x === GRID_W - 1) {
          cell.classList.add('base-cell');
          const castle = document.createElement('div');
          castle.className = `castle-render ${CASTLE_SKINS[G.castleSkin].cssClass}`;
          castle.id = 'castle-render';
          const emo = document.createElement('span');
          emo.className = 'cas-emoji';
          castle.appendChild(emo);
          const hpBar = document.createElement('div');
          hpBar.className = 'castle-hp-bar';
          const hpFill = document.createElement('div');
          hpFill.className = 'castle-hp-fill'; hpFill.id = 'castle-hp-fill';
          hpBar.appendChild(hpFill); castle.appendChild(hpBar);
          cell.appendChild(castle);
        } else {
          cell.classList.add('path-cell');
        }
      } else {
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
  const hpScale = (1 + (G.wave - 1) * 0.15) * (G.gameMode === 'extreme' ? 1.75 : 1);
  G.enemiesToSpawn = [];
  groups.forEach(g => {
    const def = ENEMY_DEFS[g.type];
    for (let i = 0; i < g.count; i++) {
      G.enemiesToSpawn.push({
        id: Date.now() + Math.random(),
        type: g.type, def,
        x: 0, y: PATH_ROW,
        hp: Math.ceil(def.baseHp * hpScale),
        maxHp: Math.ceil(def.baseHp * hpScale),
        speed: def.speed, reward: def.reward, damage: def.damage,
        frozen: false, frozenTurns: 0,
        kills: 0
      });
    }
  });
  G.spawnIndex = 0;
}

function showWavePreview() {
  const modal = document.getElementById('wave-start-modal');
  document.getElementById('wsm-title').textContent = `⚔️ WAVE ${G.wave} INCOMING`;
  document.getElementById('wsm-sub').textContent = G.wave % 10 === 0 ? '🐉 BOSS WAVE — Dragon approaches!' : 'Darkness gathers at the gate...';

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
  const diaRwd = 1 + (G.wave % 10 === 0 ? 5 : 0);
  document.getElementById('wsm-rewards').innerHTML = `
    <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd}</span><span class="ri-lbl">Gold</span></div>
    <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd}</span><span class="ri-lbl">Diamond${diaRwd > 1 ? 's' : ''}</span></div>`;

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
    G.enemies.push({ ...G.enemiesToSpawn[G.spawnIndex] });
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
  const isMilestone = G.wave % 5 === 0;
  const diaRwd = 1 + (isMilestone ? (G.wave % 10 === 0 ? 5 : 2) : 0);
  const scoreMult = G.gameMode === 'extreme' ? 2 : 1;
  const waveScore = G.wave * 50 * scoreMult;
  G.gold += goldRwd; G.diamonds += diaRwd; G.score += waveScore;
  if (G.wave > G.bestWave) G.bestWave = G.wave;
  updateQuestProgress('wave');
  updateDailyProgress('wave', G.wave);

  if (G.hp === G.waveStartHp) {
    updateQuestProgress('nodmg');
    updateDailyProgress('nodmg');
  }

  addLog(`🏆 Wave ${G.wave} cleared! +${goldRwd}🪙 +${diaRwd}💎 +${waveScore}pts${scoreMult > 1 ? ' (2× Extreme!)' : ''}`, 'log-wave');
  showToast(isMilestone ? `🎯 MILESTONE! Wave ${G.wave}! +${diaRwd}💎` : `Wave ${G.wave} cleared! +${goldRwd}🪙`, 'tdiamond');

  await saveGame();

  const wcm = document.getElementById('wave-complete-modal');
  document.getElementById('wcm-icon').textContent = isMilestone ? '🏆' : '⚔️';
  document.getElementById('wcm-title').textContent = isMilestone ? `MILESTONE: WAVE ${G.wave}!` : `Wave ${G.wave} Cleared!`;
  document.getElementById('wcm-rewards').innerHTML = `
    <div class="rwd-item"><span class="ri-icon">🪙</span><span class="ri-val">+${goldRwd}</span><span class="ri-lbl">Gold</span></div>
    <div class="rwd-item"><span class="ri-icon">💎</span><span class="ri-val">+${diaRwd}</span><span class="ri-lbl">Diamond${diaRwd > 1 ? 's' : ''}</span></div>
    <div class="rwd-item"><span class="ri-icon">🏆</span><span class="ri-val">+${waveScore}</span><span class="ri-lbl">Score${scoreMult > 1 ? ' ×2' : ''}</span></div>`;
  document.getElementById('wcm-hint').textContent = G.gameMode === 'extreme'
    ? `🔥 Extreme Mode — 2× score! Push further!`
    : (isMilestone ? `Milestone bonus! Every 5 waves = extra 💎!` : '');
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

// ── GAME OVER ─────────────────────────────────────────────────
async function handleGameOver() {
  G.gameOver = true;
  if (G.wave > G.bestWave) G.bestWave = G.wave;
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
  document.getElementById('hud-wave').textContent = G.wave;
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
    badge.textContent = '⚔️ STORY';
    badge.style.background = 'linear-gradient(135deg,rgba(59,130,246,.2),rgba(29,78,216,.15))';
    badge.style.borderColor = 'rgba(59,130,246,.5)';
    badge.style.color = '#93C5FD';
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
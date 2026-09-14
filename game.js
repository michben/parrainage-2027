// ============================================================
// Le jeu des présidents — mots croisés / mots fléchés
// Grilles figées (game-data.js), aucune génération à la volée.
// GAME_GRIDS[niveau][mode] est un TABLEAU de variantes (une est tirée
// au hasard à chaque partie), chacune respectant ses propres règles
// (voir commentaire en tête de game-data.js).
// ============================================================

const SCORING = {
  facile:    { base: 100, timeBudget: 240, pointsPerSecond: 0.6, maxLetterHints: 3, maxWordHints: 1, letterPenaltySec: 12, wordPenaltySec: 40 },
  moyen:     { base: 200, timeBudget: 420, pointsPerSecond: 0.6, maxLetterHints: 2, maxWordHints: 0, letterPenaltySec: 18, wordPenaltySec: 50 },
  difficile: { base: 350, timeBudget: 600, pointsPerSecond: 0.7, maxLetterHints: 1, maxWordHints: 0, letterPenaltySec: 25, wordPenaltySec: 60 }
};
const LEVEL_LABELS = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };

// --- Compteur discret de joueurs en ligne (aucun compte requis) ---
(function presenceLoop() {
  let clientId = localStorage.getItem('gamePresenceId');
  if (!clientId) {
    clientId = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));
    localStorage.setItem('gamePresenceId', clientId);
  }
  async function ping() {
    try {
      const res = await fetch(`${API_BASE}/api/presence/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });
      if (!res.ok) return;
      const data = await res.json();
      const el = document.getElementById('onlineCount');
      const numEl = document.getElementById('onlineCountNum');
      if (el && numEl && Number.isFinite(data.online)) {
        numEl.textContent = data.online;
        el.hidden = false;
      }
    } catch (err) { /* silencieux : compteur non critique */ }
  }
  ping();
  setInterval(ping, 45000);
})();

// Même thème que le site principal (le bouton lune/soleil écrit dans la
// même clé localStorage, lue au chargement par un script inline).
(function syncThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.innerHTML = isDark
      ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
})();
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('siteTheme', next);
  const icon = document.getElementById('themeIcon');
  icon.innerHTML = next === 'dark'
    ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
});

let gameUsername = '';
let authToken = localStorage.getItem('gameAuthToken') || '';
let gameMode = 'croises';
let gameLevel = 'facile';
let currentGrid = null;      // { rows, cols, words }
let cellMeta = {};           // "r,c" -> { letter, words:[wordIndex,...], number }
let clueCellMeta = {};       // "r,c" -> { wordIdx, dir, clue } (mode fléchés uniquement)
let cellInputs = {};         // "r,c" -> <input> element
let selectedCell = null;     // {r,c}
let selectedDir = 'H';
let startTime = 0;
let penaltySeconds = 0;
let timerInterval = null;
let letterHintsUsed = 0;
let wordHintsUsed = 0;
let solvedWords = new Set();

// ============================================================
// Écran 1 — pseudo (libre, sans inscription) OU compte (email/X)
// ============================================================
const savedUsername = localStorage.getItem('gameUsername') || '';
document.getElementById('usernameInput').value = savedUsername;

let currentAccount = null; // profil du compte connecte (null si pseudo libre)
const DEFAULT_AVATAR_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="%23ccd6df"/><circle cx="20" cy="15" r="7" fill="%238b9aa8"/><path d="M6 36c1-9 9-14 14-14s13 5 14 14" fill="%238b9aa8"/></svg>'
);

function authHeaders() {
  return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
}

// --- Badges de parti : derives des candidats (une entree par parti distinct) ---
const PARTY_BADGES = (() => {
  if (typeof CANDIDATES === 'undefined') return [];
  const seen = new Map();
  CANDIDATES.forEach(c => { if (!seen.has(c.parti)) seen.set(c.parti, c.couleur); });
  return Array.from(seen, ([parti, couleur]) => ({ parti, couleur }));
})();

function renderBadgeGrid(selected) {
  const grid = document.getElementById('profileBadgeGrid');
  grid.innerHTML = `<button type="button" class="profile-badge-option${!selected ? ' active' : ''}" data-parti="">Aucun</button>` +
    PARTY_BADGES.map(b => `
      <button type="button" class="profile-badge-option${selected === b.parti ? ' active' : ''}" data-parti="${b.parti}" style="--badge-color:${b.couleur}">
        <span class="profile-badge-dot" style="background:${b.couleur}"></span>${b.parti}
      </button>`).join('');
  grid.querySelectorAll('.profile-badge-option').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.profile-badge-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function getSelectedBadge() {
  const active = document.querySelector('#profileBadgeGrid .profile-badge-option.active');
  return active && active.dataset.parti ? active.dataset.parti : null;
}

function badgeColorFor(parti) {
  const found = PARTY_BADGES.find(b => b.parti === parti);
  return found ? found.couleur : '#8b9aa8';
}

function openOnboarding() {
  const account = currentAccount || {};
  document.getElementById('profilePseudoInput').value = account.displayName || '';
  document.getElementById('profileAvatarPreview').src = account.avatarDataUri || DEFAULT_AVATAR_SVG;
  document.getElementById('profileSkipBtn').hidden = !!account.profileComplete;
  renderBadgeGrid(account.partyBadge || null);
  document.getElementById('profileStatus').textContent = '';
  showScreen('screenOnboarding');
}

document.getElementById('profileAvatarBtn').addEventListener('click', () => {
  document.getElementById('profileAvatarFile').click();
});
document.getElementById('profileAvatarFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = 160;
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      document.getElementById('profileAvatarPreview').src = canvas.toDataURL('image/jpeg', 0.82);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

async function saveProfile() {
  const statusEl = document.getElementById('profileStatus');
  const pseudo = document.getElementById('profilePseudoInput').value.trim();
  if (!pseudo) { statusEl.textContent = 'Choisis un pseudo.'; return; }
  const preview = document.getElementById('profileAvatarPreview').src;
  const avatarDataUri = preview.startsWith('data:image') && preview !== DEFAULT_AVATAR_SVG ? preview : null;
  statusEl.textContent = 'Enregistrement…';
  try {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ displayName: pseudo, avatarDataUri, partyBadge: getSelectedBadge() })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { statusEl.textContent = data.error || 'Erreur, réessaie.'; return; }
    currentAccount = data.user;
    localStorage.setItem('gameUsername', data.user.displayName);
    proceedToSetup(data.user.displayName, data.user);
  } catch (err) {
    statusEl.textContent = 'Service indisponible, réessaie plus tard.';
  }
}
document.getElementById('profileSaveBtn').addEventListener('click', saveProfile);
document.getElementById('profileSkipBtn').addEventListener('click', () => {
  proceedToSetup(currentAccount.displayName, currentAccount);
});

function proceedToSetup(name, account) {
  gameUsername = name;
  document.getElementById('setupUsername').textContent = name;
  const row = document.getElementById('setupProfileRow');
  if (account) {
    row.hidden = false;
    document.getElementById('setupAvatarImg').src = account.avatarDataUri || DEFAULT_AVATAR_SVG;
    const chip = document.getElementById('setupBadgeChip');
    if (account.partyBadge) {
      chip.textContent = account.partyBadge;
      chip.style.setProperty('--badge-color', badgeColorFor(account.partyBadge));
      chip.hidden = false;
    } else {
      chip.hidden = true;
    }
  } else {
    row.hidden = true;
  }
  showScreen('screenSetup');
  updateLevelInfo();
  loadLeaderboardPreview();
}

document.getElementById('editProfileLink').addEventListener('click', (e) => {
  e.preventDefault();
  if (currentAccount) openOnboarding();
});
document.getElementById('logoutLinkSetup').addEventListener('click', async (e) => {
  e.preventDefault();
  if (!currentAccount) { showScreen('screenUsername'); return; }
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: authHeaders() }).catch(() => {});
  authToken = '';
  currentAccount = null;
  localStorage.removeItem('gameAuthToken');
  location.reload();
});

document.getElementById('usernameForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('usernameInput').value.trim().slice(0, 20);
  if (!val) return;
  authToken = '';
  currentAccount = null;
  localStorage.removeItem('gameAuthToken');
  localStorage.setItem('gameUsername', val);
  proceedToSetup(val, null);
});

// --- Onglets Email / X ---
document.querySelectorAll('#authTabs .game-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#authTabs .game-choice').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.auth-pane').forEach(p => { p.hidden = true; });
    document.getElementById('authPane-' + btn.dataset.authTab).hidden = false;
  });
});

async function loginWithToken(token) {
  authToken = token;
  localStorage.setItem('gameAuthToken', token);
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('session invalide');
    const data = await res.json();
    currentAccount = data.user;
    localStorage.setItem('gameUsername', data.user.displayName);
    if (!data.user.profileComplete) {
      openOnboarding();
    } else {
      proceedToSetup(data.user.displayName, data.user);
    }
    return true;
  } catch (err) {
    authToken = '';
    localStorage.removeItem('gameAuthToken');
    return false;
  }
}

// Lien magique par email ou retour de connexion X : le jeton arrive dans
// le fragment d'URL (#authToken=...), jamais dans l'historique du navigateur.
(function checkAuthTokenInUrl() {
  const match = /authToken=([^&]+)/.exec(window.location.hash);
  if (match) {
    history.replaceState(null, '', window.location.pathname);
    loginWithToken(decodeURIComponent(match[1]));
  } else if (authToken) {
    loginWithToken(authToken);
  }
})();

document.getElementById('emailRequestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim();
  const statusEl = document.getElementById('emailStatus');
  statusEl.textContent = 'Envoi…';
  try {
    const res = await fetch(`${API_BASE}/api/auth/email/request`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 501) statusEl.textContent = 'Cette méthode n\'est pas encore activée.';
    else if (!res.ok) statusEl.textContent = data.error || 'Erreur, réessaie plus tard.';
    else statusEl.textContent = '📩 Vérifie tes emails : le lien est valable 15 minutes.';
  } catch (err) {
    statusEl.textContent = 'Service indisponible, réessaie plus tard.';
  }
});

document.getElementById('xLoginBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('xStatus');
  statusEl.textContent = 'Connexion…';
  try {
    const res = await fetch(`${API_BASE}/api/auth/x/start`);
    const data = await res.json().catch(() => ({}));
    if (res.status === 501) { statusEl.textContent = 'Cette méthode n\'est pas encore activée.'; return; }
    if (!res.ok || !data.authorizeUrl) { statusEl.textContent = 'Erreur, réessaie plus tard.'; return; }
    window.location.href = data.authorizeUrl;
  } catch (err) {
    statusEl.textContent = 'Service indisponible, réessaie plus tard.';
  }
});

// ============================================================
// Écran 2 — mode / niveau / classement
// ============================================================
document.querySelectorAll('#modeChoice .game-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#modeChoice .game-choice').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gameMode = btn.dataset.mode;
    updateLevelInfo();
  });
});
document.querySelectorAll('#levelChoice .game-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#levelChoice .game-choice').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gameLevel = btn.dataset.level;
    updateLevelInfo();
  });
});
document.querySelectorAll('#leaderboardLevelChoice .game-choice').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#leaderboardLevelChoice .game-choice').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadLeaderboardPreview(btn.dataset.level);
  });
});

function pickRandomVariant(level, mode) {
  const variants = GAME_GRIDS[level][mode];
  return variants[Math.floor(Math.random() * variants.length)];
}

function updateLevelInfo() {
  const s = SCORING[gameLevel];
  const grid = GAME_GRIDS[gameLevel][gameMode][0];
  document.getElementById('levelInfo').textContent =
    `${grid.words.length} mots · ${s.base} points de base · ${s.maxLetterHints} indice(s) lettre, ${s.maxWordHints} indice(s) mot disponibles.`;
}

document.getElementById('startGameBtn').addEventListener('click', startGame);

// ============================================================
// Classement (aperçu + après partie)
// ============================================================
async function fetchLeaderboard(level) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${API_BASE}/api/game/leaderboard?level=${level}`, { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch (err) {
    return null; // distingue "pas encore de scores" (tableau vide) de "echec reseau"
  }
}

function renderLeaderboardList(container, entries, highlightUsername, retryLevel) {
  if (entries === null) {
    container.innerHTML = `
      <p class="game-hint">⏳ Le service de classement met parfois 30-60s à se réveiller après une pause (hébergement gratuit).
      <button type="button" class="btn-secondary" id="leaderboardRetryBtn" style="margin-left:8px">Réessayer</button></p>`;
    document.getElementById('leaderboardRetryBtn')?.addEventListener('click', async () => {
      container.innerHTML = '<p class="game-hint">Chargement…</p>';
      const retried = await fetchLeaderboard(retryLevel || gameLevel);
      renderLeaderboardList(container, retried, highlightUsername, retryLevel);
    });
    return;
  }
  if (!entries.length) {
    container.innerHTML = '<p class="game-hint">Aucun score enregistré pour l\'instant — sois le premier !</p>';
    return;
  }
  container.innerHTML = `
    <ol class="game-leaderboard-ol">
      ${entries.slice(0, 10).map((e, i) => `
        <li class="${e.username === highlightUsername ? 'me' : ''}">
          <span class="rank">${i + 1}</span>
          <span class="name">${escapeHtml(e.username)}</span>
          <span class="score">${e.score} pts</span>
          <span class="time">${formatTime(e.timeSeconds)}</span>
        </li>`).join('')}
    </ol>`;
}

async function loadLeaderboardPreview(level) {
  level = level || document.querySelector('#leaderboardLevelChoice .game-choice.active')?.dataset.level || 'facile';
  const container = document.getElementById('leaderboardPreviewList');
  container.innerHTML = '<p class="game-hint">Chargement…</p>';
  const entries = await fetchLeaderboard(level);
  renderLeaderboardList(container, entries, null, level);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ============================================================
// Construction de la grille
// ============================================================
function buildCellMeta(grid) {
  const meta = {};
  grid.words.forEach((w, idx) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.dir === 'H' ? w.row : w.row + i;
      const c = w.dir === 'H' ? w.col + i : w.col;
      const key = `${r},${c}`;
      if (!meta[key]) meta[key] = { letter: w.word[i], words: [] };
      meta[key].words.push(idx);
      if (i === 0) meta[key].number = w.number;
    }
  });
  return meta;
}

// Mode fléchés uniquement : une case de définition dédiée par mot, placée
// juste avant sa première lettre (à gauche pour un mot horizontal, au-dessus
// pour un mot vertical) - conforme aux vraies règles fournies. Cette case
// n'est jamais une case-lettre : elle affiche le texte de définition + une
// flèche indiquant le sens de lecture.
function buildClueCellMeta(grid) {
  const meta = {};
  grid.words.forEach((w, idx) => {
    const key = `${w.clueRow},${w.clueCol}`;
    meta[key] = { wordIdx: idx, dir: w.dir, clue: w.clue };
  });
  return meta;
}

function startGame() {
  currentGrid = pickRandomVariant(gameLevel, gameMode);
  cellMeta = buildCellMeta(currentGrid);
  clueCellMeta = gameMode === 'fleches' ? buildClueCellMeta(currentGrid) : {};
  cellInputs = {};
  selectedCell = null;
  selectedDir = 'H';
  penaltySeconds = 0;
  letterHintsUsed = 0;
  wordHintsUsed = 0;
  solvedWords = new Set();

  renderGrid();
  renderClueList();
  updateHintButtons();
  document.getElementById('gameTotalWords').textContent = currentGrid.words.length;
  document.getElementById('gameProgress').textContent = '0';

  showScreen('screenPlay');
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimerDisplay, 250);
  updateTimerDisplay();

  // Sélectionne automatiquement le premier mot pour démarrer.
  const first = currentGrid.words[0];
  selectCell(first.row, first.col, first.dir);
}

function renderGrid() {
  const wrap = document.getElementById('gameGrid');
  wrap.style.gridTemplateColumns = `repeat(${currentGrid.cols}, 1fr)`;
  wrap.style.setProperty('--grid-cols', currentGrid.cols);
  wrap.innerHTML = '';
  cellInputs = {};

  for (let r = 0; r < currentGrid.rows; r++) {
    for (let c = 0; c < currentGrid.cols; c++) {
      const key = `${r},${c}`;
      const meta = cellMeta[key];
      const clueMeta = clueCellMeta[key];

      if (clueMeta) {
        // Case de définition (mots fléchés) : grisée, texte + flèche, pas
        // de saisie possible. Clic = sélectionne le mot correspondant.
        const cellEl = document.createElement('div');
        cellEl.className = 'game-cell game-clue-cell';
        const arrow = document.createElement('span');
        arrow.className = 'game-clue-arrow';
        arrow.textContent = clueMeta.dir === 'H' ? '→' : '↓';
        const text = document.createElement('span');
        text.className = 'game-clue-text';
        // Case minuscule a l'ecran : texte tronque, la definition complete
        // reste lisible via l'infobulle (title) et le bandeau au-dessus de
        // la grille des qu'on clique/tape dans le mot.
        text.textContent = clueMeta.clue.length > 22 ? clueMeta.clue.slice(0, 21) + '…' : clueMeta.clue;
        cellEl.appendChild(arrow);
        cellEl.appendChild(text);
        cellEl.title = clueMeta.clue;
        cellEl.addEventListener('click', () => {
          const w = currentGrid.words[clueMeta.wordIdx];
          selectCell(w.row, w.col, w.dir);
        });
        wrap.appendChild(cellEl);
        continue;
      }

      const cellEl = document.createElement('div');
      cellEl.className = 'game-cell' + (meta ? '' : ' blocked');
      if (meta) {
        if (meta.number && gameMode === 'croises') {
          const badge = document.createElement('span');
          badge.className = 'game-cell-number';
          badge.textContent = meta.number;
          cellEl.appendChild(badge);
        }
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.autocomplete = 'off';
        input.dataset.r = r;
        input.dataset.c = c;
        input.addEventListener('input', onCellInput);
        input.addEventListener('keydown', onCellKeydown);
        input.addEventListener('focus', () => onCellFocus(r, c));
        cellEl.appendChild(input);
        cellInputs[key] = input;
      }
      wrap.appendChild(cellEl);
    }
  }
}

function renderClueList() {
  const listEl = document.getElementById('gameClueList');
  const fleches = gameMode === 'fleches';
  document.getElementById('gameActiveClue').classList.toggle('fleches-style', fleches);

  if (fleches) {
    // Vraies règles des mots fléchés : pas de liste externe, les
    // définitions sont dans la grille (cases grisées + flèches).
    listEl.hidden = true;
    listEl.innerHTML = '';
    return;
  }
  listEl.hidden = false;

  const horiz = currentGrid.words.filter(w => w.dir === 'H').sort((a, b) => a.number - b.number);
  const vert = currentGrid.words.filter(w => w.dir === 'V').sort((a, b) => a.number - b.number);

  listEl.innerHTML = `
    ${renderClueGroup('Horizontalement', horiz)}
    ${renderClueGroup('Verticalement', vert)}
  `;
  listEl.querySelectorAll('[data-word-idx]').forEach(el => {
    el.addEventListener('click', () => {
      const w = currentGrid.words[Number(el.dataset.wordIdx)];
      selectCell(w.row, w.col, w.dir);
    });
  });
}

function renderClueGroup(title, words) {
  if (!words.length) return '';
  return `
    <div class="game-clue-group">
      <h4>${title}</h4>
      <ul>
        ${words.map(w => {
          const idx = currentGrid.words.indexOf(w);
          const done = solvedWords.has(idx);
          return `<li data-word-idx="${idx}" class="${done ? 'done' : ''}">${w.number}. ${w.clue}</li>`;
        }).join('')}
      </ul>
    </div>`;
}

// ============================================================
// Sélection / saisie
// ============================================================
function onCellFocus(r, c) {
  // Sur une case d'intersection, la direction active doit correspondre au
  // mot que le joueur remplit réellement, sinon taper/supprimer une lettre
  // peut suivre le MAUVAIS mot. Reclic sur la même intersection = bascule
  // le sens (comportement standard des logiciels de mots croisés).
  const meta = cellMeta[`${r},${c}`];
  const sameCell = selectedCell && selectedCell.r === r && selectedCell.c === c;
  if (meta) {
    if (sameCell && meta.words.length > 1) {
      selectedDir = selectedDir === 'H' ? 'V' : 'H';
    } else {
      const hasCurrentDir = meta.words.some(idx => currentGrid.words[idx].dir === selectedDir);
      if (!hasCurrentDir) {
        selectedDir = meta.words.some(idx => currentGrid.words[idx].dir === 'H') ? 'H' : 'V';
      }
    }
  }
  selectedCell = { r, c };
  highlightActiveWord();
}

function selectCell(r, c, dir) {
  selectedDir = dir;
  selectedCell = { r, c };
  const input = cellInputs[`${r},${c}`];
  if (input) input.focus();
  highlightActiveWord();
}

function getActiveWordIndex() {
  if (!selectedCell) return -1;
  const meta = cellMeta[`${selectedCell.r},${selectedCell.c}`];
  if (!meta) return -1;
  // Préfère un mot dans la direction courante ; sinon le premier disponible.
  const inDir = meta.words.find(idx => currentGrid.words[idx].dir === selectedDir);
  return inDir !== undefined ? inDir : meta.words[0];
}

function highlightActiveWord() {
  document.querySelectorAll('.game-cell.active-word, .game-cell.active-cell').forEach(el => el.classList.remove('active-word', 'active-cell'));
  const idx = getActiveWordIndex();
  if (idx === -1) {
    document.getElementById('gameActiveClue').textContent = 'Clique sur une case pour commencer.';
    return;
  }
  const w = currentGrid.words[idx];
  for (let i = 0; i < w.word.length; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    const input = cellInputs[`${r},${c}`];
    if (input) input.parentElement.classList.add('active-word');
  }
  const curInput = cellInputs[`${selectedCell.r},${selectedCell.c}`];
  if (curInput) curInput.parentElement.classList.add('active-cell');
  document.getElementById('gameActiveClue').textContent = gameMode === 'croises' ? `${w.number}. ${w.clue}` : w.clue;
}

function onCellInput(e) {
  const input = e.target;
  const value = input.value.toUpperCase().replace(/[^A-ZÀ-ÖØ-Þ]/g, '');
  input.value = value.slice(-1);
  if (!value) return;

  const r = Number(input.dataset.r), c = Number(input.dataset.c);
  checkCellCorrectness(r, c);
  moveToNextCell(r, c, 1);
  checkWordsCompletion();
  checkFullGridCompletion();
}

function onCellKeydown(e) {
  const input = e.target;
  const r = Number(input.dataset.r), c = Number(input.dataset.c);
  if (e.key === 'Backspace' && !input.value) {
    moveToNextCell(r, c, -1);
    e.preventDefault();
  } else if (e.key === 'ArrowRight') { selectAdjacent(r, c, 0, 1); e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { selectAdjacent(r, c, 0, -1); e.preventDefault(); }
  else if (e.key === 'ArrowDown') { selectAdjacent(r, c, 1, 0); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { selectAdjacent(r, c, -1, 0); e.preventDefault(); }
}

function selectAdjacent(r, c, dr, dc) {
  const next = cellInputs[`${r + dr},${c + dc}`];
  if (next) { selectedDir = dr !== 0 ? 'V' : 'H'; next.focus(); }
}

function moveToNextCell(r, c, step) {
  const idx = getActiveWordIndex();
  if (idx === -1) return;
  const w = currentGrid.words[idx];
  const posInWord = w.dir === 'H' ? (c - w.col) : (r - w.row);
  const nextPos = posInWord + step;
  if (nextPos < 0 || nextPos >= w.word.length) return;
  const nr = w.dir === 'H' ? w.row : w.row + nextPos;
  const nc = w.dir === 'H' ? w.col + nextPos : w.col;
  const next = cellInputs[`${nr},${nc}`];
  if (next) next.focus();
}

function checkCellCorrectness(r, c) {
  const input = cellInputs[`${r},${c}`];
  const meta = cellMeta[`${r},${c}`];
  if (!input || !meta) return;
  const cellDiv = input.parentElement;
  cellDiv.classList.remove('correct', 'incorrect');
  if (!input.value) return;
  if (input.value === meta.letter) cellDiv.classList.add('correct');
  else cellDiv.classList.add('incorrect');
}

function isWordComplete(word) {
  for (let i = 0; i < word.word.length; i++) {
    const r = word.dir === 'H' ? word.row : word.row + i;
    const c = word.dir === 'H' ? word.col + i : word.col;
    const input = cellInputs[`${r},${c}`];
    if (!input || input.value !== word.word[i]) return false;
  }
  return true;
}

function checkWordsCompletion() {
  let newlySolved = 0;
  currentGrid.words.forEach((w, idx) => {
    if (!solvedWords.has(idx) && isWordComplete(w)) {
      solvedWords.add(idx);
      newlySolved++;
    }
  });
  if (newlySolved) {
    document.getElementById('gameProgress').textContent = solvedWords.size;
    renderClueList();
  }
}

function checkFullGridCompletion() {
  if (solvedWords.size === currentGrid.words.length) {
    finishGame();
  }
}

// ============================================================
// Aides (indices)
// ============================================================
document.getElementById('revealLetterBtn').addEventListener('click', () => {
  const s = SCORING[gameLevel];
  if (letterHintsUsed >= s.maxLetterHints || !selectedCell) return;
  const meta = cellMeta[`${selectedCell.r},${selectedCell.c}`];
  const input = cellInputs[`${selectedCell.r},${selectedCell.c}`];
  if (!meta || !input) return;
  input.value = meta.letter;
  checkCellCorrectness(selectedCell.r, selectedCell.c);
  letterHintsUsed++;
  penaltySeconds += s.letterPenaltySec;
  updateHintButtons();
  checkWordsCompletion();
  checkFullGridCompletion();
});

document.getElementById('revealWordBtn').addEventListener('click', () => {
  const s = SCORING[gameLevel];
  if (wordHintsUsed >= s.maxWordHints) return;
  const idx = getActiveWordIndex();
  if (idx === -1) return;
  const w = currentGrid.words[idx];
  for (let i = 0; i < w.word.length; i++) {
    const r = w.dir === 'H' ? w.row : w.row + i;
    const c = w.dir === 'H' ? w.col + i : w.col;
    const input = cellInputs[`${r},${c}`];
    if (input) { input.value = w.word[i]; checkCellCorrectness(r, c); }
  }
  wordHintsUsed++;
  penaltySeconds += s.wordPenaltySec;
  updateHintButtons();
  checkWordsCompletion();
  checkFullGridCompletion();
});

function updateHintButtons() {
  const s = SCORING[gameLevel];
  const letterBtn = document.getElementById('revealLetterBtn');
  const wordBtn = document.getElementById('revealWordBtn');
  letterBtn.disabled = letterHintsUsed >= s.maxLetterHints;
  letterBtn.textContent = `💡 Lettre (${s.maxLetterHints - letterHintsUsed})`;
  wordBtn.disabled = wordHintsUsed >= s.maxWordHints;
  wordBtn.textContent = `🔍 Mot (${s.maxWordHints - wordHintsUsed})`;
  wordBtn.hidden = s.maxWordHints === 0;
}

// ============================================================
// Chronomètre & score
// ============================================================
function updateTimerDisplay() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('gameTimer').textContent = formatTime(elapsed);
}

function computeScore(effectiveSeconds) {
  const s = SCORING[gameLevel];
  const bonus = Math.max(0, Math.round((s.timeBudget - effectiveSeconds) * s.pointsPerSecond));
  return s.base + bonus;
}

async function finishGame() {
  clearInterval(timerInterval);
  const rawSeconds = Math.floor((Date.now() - startTime) / 1000);
  const effectiveSeconds = rawSeconds + penaltySeconds;
  const score = computeScore(effectiveSeconds);

  document.getElementById('resultScore').textContent = score;
  document.getElementById('resultTime').textContent = formatTime(rawSeconds);
  document.getElementById('resultHints').textContent = letterHintsUsed + wordHintsUsed;
  document.getElementById('resultRank').textContent = 'Enregistrement du score...';

  showScreen('screenResult');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);
    const res = await fetch(`${API_BASE}/api/game/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: gameUsername, level: gameLevel, mode: gameMode, score, timeSeconds: rawSeconds, hintsUsed: letterHintsUsed + wordHintsUsed }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (res.ok) {
      document.getElementById('resultRank').textContent = data.rank ? `Tu es ${data.rank}ᵉ au classement ${LEVEL_LABELS[gameLevel]} !` : 'Score enregistré !';
      renderMysteryReward(data.mysteryReward);
    } else {
      document.getElementById('resultRank').textContent = 'Score calculé (non enregistré : ' + (data.error || 'erreur serveur') + ').';
    }
  } catch (err) {
    document.getElementById('resultRank').textContent = 'Score calculé localement (serveur indisponible pour l\'enregistrer).';
  }

  const entries = await fetchLeaderboard(gameLevel);
  renderLeaderboardList(document.getElementById('resultLeaderboard'), entries, gameUsername, gameLevel);
}

document.getElementById('replayBtn').addEventListener('click', () => {
  showScreen('screenSetup');
  updateLevelInfo();
  loadLeaderboardPreview();
});

// ============================================================
// Navigation entre écrans
// ============================================================
function showScreen(id) {
  ['screenUsername', 'screenOnboarding', 'screenSetup', 'screenPlay', 'screenResult', 'screenMystery'].forEach(s => {
    document.getElementById(s).hidden = s !== id;
  });
}

// ============================================================
// Personnage Mystère
// ============================================================
const RARITY_LABELS = { commune: 'Commune', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire' };
const RARITY_EMOJI = { commune: '⚪', rare: '🔵', epique: '🟣', legendaire: '🟡' };

function renderMysteryReward(reward) {
  const el = document.getElementById('resultMysteryReward');
  if (!reward) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="mystery-reward-toast mystery-rarity-${reward.rarity}">
      🧩 Pièce de puzzle gagnée — <strong>${RARITY_EMOJI[reward.rarity] || ''} ${RARITY_LABELS[reward.rarity] || reward.rarity}</strong>
    </div>`;
}

async function fetchMysteryState() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${API_BASE}/api/mystery/state?username=${encodeURIComponent(gameUsername)}`, { cache: 'no-store', signal: controller.signal, headers: authHeaders() });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch (err) {
    return null;
  }
}

function formatCountdown(msRemaining) {
  if (msRemaining <= 0) return null;
  const h = Math.floor(msRemaining / 3600000);
  const m = Math.floor((msRemaining % 3600000) / 60000);
  return `${h}h${String(m).padStart(2, '0')}`;
}

async function loadMysteryScreen() {
  const boardEl = document.getElementById('mysteryBoard');
  const invEl = document.getElementById('mysteryInventory');
  boardEl.innerHTML = '<p class="game-hint">Chargement…</p>';
  invEl.innerHTML = '';

  const state = await fetchMysteryState();
  if (!state) {
    boardEl.innerHTML = `<p class="game-hint">⏳ Service indisponible pour le moment.
      <button type="button" class="btn-secondary" id="mysteryRetryBtn" style="margin-left:8px">Réessayer</button></p>`;
    document.getElementById('mysteryRetryBtn')?.addEventListener('click', loadMysteryScreen);
    return;
  }

  const solvedBanner = document.getElementById('mysterySolvedBanner');
  if (state.characterName) {
    solvedBanner.innerHTML = `<p class="mystery-solved-banner">🎉 Trouvé par <strong>${escapeHtml(state.solvedBy)}</strong> : c'était <strong>${escapeHtml(state.characterName)}</strong> !</p>`;
  } else {
    solvedBanner.innerHTML = '';
  }

  const guessForm = document.getElementById('mysteryGuessForm');
  const guessStatusEl = document.getElementById('mysteryGuessStatus');
  if (state.characterName) {
    guessForm.hidden = true;
    guessStatusEl.textContent = '';
  } else {
    guessForm.hidden = false;
    const gs = state.guessStatus;
    if (gs && !gs.canGuess && gs.nextAllowedAt) {
      const remaining = new Date(gs.nextAllowedAt).getTime() - Date.now();
      guessForm.querySelector('input').disabled = true;
      guessForm.querySelector('button').disabled = true;
      guessStatusEl.textContent = `Prochaine proposition possible dans ${formatCountdown(remaining) || 'quelques instants'}.`;
    } else {
      guessForm.querySelector('input').disabled = false;
      guessForm.querySelector('button').disabled = false;
      guessStatusEl.textContent = '';
    }
  }

  document.getElementById('mysteryProgressText').textContent = `${state.filledCount} / ${state.totalPieces}`;

  boardEl.innerHTML = '';
  boardEl.style.setProperty('--mystery-grid', state.gridSize);
  state.board.forEach(cell => {
    const div = document.createElement('div');
    div.className = 'mystery-cell' + (cell.filled ? ' filled mystery-rarity-' + cell.rarity : '');
    if (cell.filled) {
      div.style.backgroundImage = `url("${cell.dataUri}")`;
      div.title = RARITY_LABELS[cell.rarity] || '';
    }
    boardEl.appendChild(div);
  });

  invEl.innerHTML = '';
  if (!state.inventory.length) {
    invEl.innerHTML = '<p class="game-hint">Gagne une partie pour obtenir ta première pièce !</p>';
  } else {
    state.inventory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'mystery-inv-card mystery-rarity-' + item.rarity;
      card.innerHTML = `
        <span class="mystery-inv-rarity">${RARITY_EMOJI[item.rarity] || ''} ${RARITY_LABELS[item.rarity] || item.rarity}</span>
        <span class="mystery-inv-count">×${item.count}</span>
        ${item.alreadyOnBoard
          ? '<span class="mystery-inv-note">Déjà placée</span>'
          : `<button type="button" class="btn-secondary mystery-place-btn" data-index="${item.index}">Placer</button>`}`;
      invEl.appendChild(card);
    });
    invEl.querySelectorAll('.mystery-place-btn').forEach(btn => {
      btn.addEventListener('click', () => placeMysteryPiece(Number(btn.dataset.index)));
    });
  }
}

async function placeMysteryPiece(index) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${API_BASE}/api/mystery/place`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: gameUsername, pieceIndex: index }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Impossible de placer cette pièce.');
    }
  } catch (err) {
    alert('Service indisponible, réessaie plus tard.');
  }
  loadMysteryScreen();
}

document.getElementById('mysteryGuessForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('mysteryGuessInput');
  const guess = input.value.trim();
  if (!guess) return;
  const statusEl = document.getElementById('mysteryGuessStatus');
  statusEl.textContent = 'Envoi…';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    const res = await fetch(`${API_BASE}/api/mystery/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username: gameUsername, guess }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (res.status === 429) {
      statusEl.textContent = `Une seule proposition toutes les 24h — réessaie dans ${formatCountdown(new Date(data.nextAllowedAt).getTime() - Date.now()) || 'quelques instants'}.`;
      return;
    }
    if (!res.ok) {
      statusEl.textContent = data.error || 'Erreur serveur.';
      return;
    }
    input.value = '';
    if (data.correct) {
      statusEl.textContent = data.alreadySolved ? 'Déjà trouvé par un autre joueur !' : '🎉 Bravo, bonne réponse !';
    } else {
      statusEl.textContent = 'Perdu, réessaie dans 24h !';
    }
  } catch (err) {
    statusEl.textContent = 'Service indisponible, réessaie plus tard.';
  }
  loadMysteryScreen();
});

document.getElementById('openMysteryBtn').addEventListener('click', () => {
  showScreen('screenMystery');
  loadMysteryScreen();
});
document.getElementById('openMysteryFromResultBtn').addEventListener('click', () => {
  showScreen('screenMystery');
  loadMysteryScreen();
});
document.getElementById('closeMysteryBtn').addEventListener('click', () => {
  showScreen('screenSetup');
  updateLevelInfo();
  loadLeaderboardPreview();
});

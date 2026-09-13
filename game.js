// ============================================================
// Le jeu des présidents — mots croisés / mots fléchés
// Grilles figées (game-data.js), aucune génération à la volée.
// Deux layouts distincts par niveau : GAME_GRIDS[niveau].croises et
// GAME_GRIDS[niveau].fleches, chacun respectant ses propres règles
// (voir commentaire en tête de game-data.js).
// ============================================================

const SCORING = {
  facile:    { base: 100, timeBudget: 240, pointsPerSecond: 0.6, maxLetterHints: 3, maxWordHints: 1, letterPenaltySec: 12, wordPenaltySec: 40 },
  moyen:     { base: 200, timeBudget: 420, pointsPerSecond: 0.6, maxLetterHints: 2, maxWordHints: 0, letterPenaltySec: 18, wordPenaltySec: 50 },
  difficile: { base: 350, timeBudget: 600, pointsPerSecond: 0.7, maxLetterHints: 1, maxWordHints: 0, letterPenaltySec: 25, wordPenaltySec: 60 }
};
const LEVEL_LABELS = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };

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
// Écran 1 — pseudo
// ============================================================
const savedUsername = localStorage.getItem('gameUsername') || '';
document.getElementById('usernameInput').value = savedUsername;

document.getElementById('usernameForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('usernameInput').value.trim().slice(0, 20);
  if (!val) return;
  gameUsername = val;
  localStorage.setItem('gameUsername', val);
  document.getElementById('setupUsername').textContent = val;
  showScreen('screenSetup');
  updateLevelInfo();
  loadLeaderboardPreview();
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

function updateLevelInfo() {
  const s = SCORING[gameLevel];
  const grid = GAME_GRIDS[gameLevel][gameMode];
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
  currentGrid = GAME_GRIDS[gameLevel][gameMode];
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: gameUsername, level: gameLevel, mode: gameMode, score, timeSeconds: rawSeconds, hintsUsed: letterHintsUsed + wordHintsUsed }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (res.ok) {
      document.getElementById('resultRank').textContent = data.rank ? `Tu es ${data.rank}ᵉ au classement ${LEVEL_LABELS[gameLevel]} !` : 'Score enregistré !';
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
  ['screenUsername', 'screenSetup', 'screenPlay', 'screenResult'].forEach(s => {
    document.getElementById(s).hidden = s !== id;
  });
}

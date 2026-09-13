// ============================================================
// Parrainages 2027 — Application principale (site public)
// Carte interactive D3. Le panneau d'administration vit sur un
// service séparé (voir dépôt parrainage-2027-admin).
// ============================================================

// --- Échelle de couleurs pour la carte ---
const COLOR_STEPS = [
  { max: 0,   opacity: 0,    label: '0' },
  { max: 9,   opacity: 0.35, label: '1–9' },
  { max: 24,  opacity: 0.55, label: '10–24' },
  { max: 39,  opacity: 0.75, label: '25–39' },
  { max: 49,  opacity: 0.90, label: '40–49' },
  { max: 50,  opacity: 1.0,  label: '50' }
];

function getOpacityForValue(v) {
  for (const s of COLOR_STEPS) { if (v <= s.max) return s.opacity; }
  return 1.0;
}

function getStatusColor(status) {
  return { sécurisé:'#2a9d8f', quasi_sécurisé:'#5eaec7', en_progression:'#f4a261',
           en_collecte:'#e63946', en_difficulté:'#c1121f', très_en_retard:'#6c757d' }[status] || '#6c757d';
}

function getStatusLabel(status) {
  return { sécurisé:'Sécurisé', quasi_sécurisé:'Quasi sécurisé', en_progression:'En progression',
           en_collecte:'En collecte', en_difficulté:'En difficulté', très_en_retard:'Très en retard' }[status] || status;
}

// --- État global ---
let selectedCandidateId = null;
let currentFilter = 'all';
let geoJsonData = null;
let mapSvg, mapPath, mapProjection;

// ============================================================
// 0. AVATAR (photo si disponible, sinon initiales colorées)
// ============================================================
function handleAvatarError(img, initials, color) {
  const div = document.createElement('div');
  div.className = img.className;
  div.style.cssText = img.style.cssText;
  div.style.background = color;
  div.textContent = initials;
  img.replaceWith(div);
}

function avatarHtml(cand, extraStyle) {
  const initials = cand.nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fiche = getActiveFiches()[cand.id] || {};
  const style = extraStyle || '';
  if (fiche.photo) {
    return `<img class="cand-avatar" style="${style}" src="${fiche.photo}" alt="${cand.nom}" loading="lazy" onerror="handleAvatarError(this,'${initials}','${cand.couleur}')">`;
  }
  return `<div class="cand-avatar" style="background:${cand.couleur};${style}">${initials}</div>`;
}

// ============================================================
// 1. RENDU DES CANDIDATS (panneau de gauche)
// ============================================================
function renderCandidates() {
  const panel = document.getElementById('candidatesPanel');
  const cands = getActiveCandidates();
  const filtered = currentFilter === 'all' ? cands : cands.filter(c => c.statut === currentFilter);

  panel.innerHTML = filtered.map(cand => {
    const stats = getCandidateStats(cand.id);
    const statusClass = cand.statut.replace(/[^a-z_]/g, '');
    return `
      <div class="candidate-card ${selectedCandidateId === cand.id ? 'active' : ''}" data-id="${cand.id}">
        ${avatarHtml(cand)}
        <div class="cand-info">
          <div class="cand-name"><span class="status-dot-small ${statusClass}"></span>${cand.nom}</div>
          <div class="cand-party">${cand.parti}</div>
        </div>
        <div class="cand-count">${stats.total}</div>
      </div>`;
  }).join('');

  panel.querySelectorAll('.candidate-card').forEach(card => {
    card.addEventListener('click', () => selectCandidate(card.dataset.id));
  });

  updateFilterCounts();
}

function updateFilterCounts() {
  const cands = getActiveCandidates();
  document.getElementById('count-all').textContent = cands.length;
  ['déclarée','pressentie','retirée','hors_course'].forEach(s => {
    const el = document.getElementById('count-' + s);
    if (el) el.textContent = cands.filter(c => c.statut === s).length;
  });
}

// ============================================================
// 2. SÉLECTION DE CANDIDAT
// ============================================================
function selectCandidate(id) {
  selectedCandidateId = id;
  const cand = getActiveCandidates().find(c => c.id === id);
  if (!cand) return;
  renderCandidates();
  renderMap();
  renderStats(cand);
  renderFicheInStats(cand);
}

// ============================================================
// 3. CARTE INTERACTIVE (D3)
// ============================================================
async function loadGeoJSON() {
  const res = await fetch('departements.geojson');
  geoJsonData = await res.json();
}

function initMap() {
  const container = document.getElementById('mapContainer');
  const width = container.clientWidth;
  const height = Math.max(500, width * 0.75);

  mapSvg = d3.select('#mapSvg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  mapProjection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .parallels([44, 49])
    .scale(width * 2.8)
    .translate([width / 2, height / 2]);

  mapPath = d3.geoPath().projection(mapProjection);

  renderMap();
}

function renderMap() {
  if (!geoJsonData || !selectedCandidateId) return;

  const cand = getActiveCandidates().find(c => c.id === selectedCandidateId);
  if (!cand) return;
  const data = getActiveData()[cand.id] || {};
  const candColor = cand.couleur;

  document.getElementById('mapTitle').textContent = cand.nom;
  const stats = getCandidateStats(cand.id);
  document.getElementById('mapSubtitle').textContent =
    `${stats.total} parrainages · ${stats.deptCount} départements · ${stats.deptsAtMax} au plafond`;

  renderLegend(candColor);

  mapSvg.selectAll('path').remove();

  mapSvg.selectAll('path')
    .data(geoJsonData.features)
    .enter()
    .append('path')
    .attr('d', mapPath)
    .attr('fill', d => {
      const code = d.properties.code;
      const val = data[code] || 0;
      if (val === 0) return 'var(--map-empty)';
      return candColor;
    })
    .attr('fill-opacity', d => {
      const code = d.properties.code;
      const val = data[code] || 0;
      return getOpacityForValue(val);
    })
    .attr('stroke', 'var(--map-stroke)')
    .attr('stroke-width', 0.5)
    .on('mouseover', (event, d) => {
      const code = d.properties.code;
      const name = DEPARTEMENTS[code] || d.properties.nom;
      const val = data[code] || 0;
      const tooltip = document.getElementById('tooltip');
      tooltip.style.display = 'block';
      tooltip.innerHTML = `<strong>${name} (${code})</strong>
        <div class="tt-row"><span>Parrainages</span><span style="font-weight:700;color:${candColor}">${val}</span></div>
        <div class="tt-row"><span>Plafond</span><span>${val >= 50 ? 'Atteint' : '50 max'}</span></div>`;
    })
    .on('mousemove', (event) => {
      const tooltip = document.getElementById('tooltip');
      const rect = document.getElementById('mapContainer').getBoundingClientRect();
      tooltip.style.left = (event.clientX - rect.left + 12) + 'px';
      tooltip.style.top = (event.clientY - rect.top + 12) + 'px';
    })
    .on('mouseout', () => {
      document.getElementById('tooltip').style.display = 'none';
    });
}

function renderLegend(candColor) {
  const legend = document.getElementById('legend');
  legend.innerHTML = COLOR_STEPS.map(s =>
    `<div class="legend-item">
      <div class="legend-swatch" style="background:${s.opacity === 0 ? 'var(--map-empty)' : candColor}; opacity:${s.opacity === 0 ? 1 : s.opacity}"></div>
      ${s.label}
    </div>`
  ).join('');
}

// ============================================================
// 4. PANNEAU STATISTIQUES (droite)
// ============================================================
function renderStats(cand) {
  const panel = document.getElementById('statsPanel');
  const stats = getCandidateStats(cand.id);
  const pct = Math.min(100, Math.round(stats.total / SEUIL_PARRAINAGES * 100));
  const statusLabel = getStatusLabel(stats.status);

  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      ${avatarHtml(cand, 'width:48px;height:48px;font-size:16px')}
      <div>
        <div class="stats-candidate-name">${cand.nom}</div>
        <div class="stats-candidate-party">${cand.parti}</div>
      </div>
    </div>

    <div class="stat-block">
      <div class="stat-label">Parrainages</div>
      <div class="stat-value">${stats.total} <span class="unit">/ ${SEUIL_PARRAINAGES}</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${cand.couleur}"></div></div>
    </div>

    <div class="stat-block">
      <div class="stat-label">Départements</div>
      <div class="stat-value">${stats.deptCount} <span class="unit">/ ${SEUIL_DEPARTEMENTS} min</span></div>
    </div>

    <div class="stat-block">
      <div class="stat-label">Statut</div>
      <div class="status-indicator ${stats.status}">
        <span class="status-dot ${stats.status}"></span>${statusLabel}
      </div>
    </div>

    <div id="ficheSection"></div>
  `;
}

function renderFicheInStats(cand) {
  const section = document.getElementById('ficheSection');
  if (!section) return;
  const fiche = getActiveFiches()[cand.id] || {};
  let links = '';
  if (fiche.website) links += `<a href="${fiche.website}" target="_blank" rel="noopener">Site officiel</a>`;
  if (fiche.soutenir) links += (links ? ' · ' : '') + `<a href="${fiche.soutenir}" target="_blank" rel="noopener">Soutenir</a>`;
  if (fiche.twitter) links += (links ? ' · ' : '') + `<a href="${fiche.twitter}" target="_blank" rel="noopener">Twitter/X</a>`;

  section.innerHTML = `
    <div class="stat-block">
      <div class="stat-label">Description</div>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.5">${fiche.description || 'Aucune description disponible.'}</p>
    </div>
    ${fiche.programme ? `<div class="stat-block">
      <div class="stat-label">Programme</div>
      <p style="font-size:12px;color:var(--text-muted);line-height:1.5">${fiche.programme}</p>
    </div>` : ''}
    ${links ? `<div class="stat-block">
      <div class="stat-label">Liens</div>
      <p style="font-size:12px">${links}</p>
    </div>` : ''}
  `;
}

// ============================================================
// 5. TABLEAU COMPARATIF
// ============================================================
function renderComparisonTable() {
  const cands = getActiveCandidates();
  const rows = cands.map(cand => {
    const stats = getCandidateStats(cand.id);
    const pct = Math.min(100, Math.round(stats.total / SEUIL_PARRAINAGES * 100));
    return { cand, stats, pct };
  }).sort((a, b) => b.stats.total - a.stats.total);

  const table = document.getElementById('comparisonTable');
  table.innerHTML = `
    <thead><tr>
      <th>#</th><th>Candidat</th><th>Parti</th><th>Statut</th>
      <th>Parrainages</th><th>Progression</th><th>Départements</th><th>Plafond atteint</th>
    </tr></thead>
    <tbody>
      ${rows.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><span class="cand-color-dot" style="background:${r.cand.couleur}"></span>${r.cand.nom}</td>
          <td style="font-size:12px;color:var(--text-muted)">${r.cand.parti}</td>
          <td><span class="status-badge ${r.cand.statut.replace(/[^a-z_]/g,'')}">${r.cand.statut}</span></td>
          <td style="font-weight:700">${r.stats.total} / ${SEUIL_PARRAINAGES}</td>
          <td><div class="mini-progress"><div class="mini-progress-fill" style="width:${r.pct}%;background:${r.cand.couleur}"></div></div>${r.pct}%</td>
          <td>${r.stats.deptCount} / ${SEUIL_DEPARTEMENTS}</td>
          <td>${r.stats.deptsAtMax}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

// ============================================================
// 6. FILTRES
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderCandidates();
  });
});

// ============================================================
// 7. THÈME
// ============================================================
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  const icon = document.getElementById('themeIcon');
  if (next === 'dark') {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
});

// ============================================================
// 8. FOOTER DYNAMIQUE
// ============================================================
function renderFooter() {
  const links = getActiveLinks();
  const content = getActiveContent();
  const footer = document.querySelector('.footer-inner');
  if (footer) {
    footer.innerHTML = `
      <p>${content.aboutText}</p>
      <p class="footer-sources">${links.map(l => `<a href="${l.url}" target="${l.url.startsWith('#') ? '' : '_blank'}" rel="noopener">${l.label}</a>`).join(' · ')}</p>
      <p class="footer-note">${content.rulesText}</p>
    `;
  }
  const soutenirText = document.getElementById('soutenirText');
  if (soutenirText) soutenirText.textContent = content.soutenirText || '';
}

// ============================================================
// 9. BOUTON VIDÉO (lien YouTube configurable depuis l'admin)
// ============================================================
function renderYoutubeButton() {
  const el = document.getElementById('youtubeBtn');
  if (!el) return;
  const url = getActiveContent().youtubeUrl;
  if (url) {
    el.href = url;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

// ============================================================
// 10. INITIALISATION
// ============================================================
async function init() {
  renderYoutubeButton();
  await loadGeoJSON();
  initMap();
  renderCandidates();
  renderComparisonTable();
  renderFooter();

  const cands = getActiveCandidates();
  for (const c of cands) {
    const stats = getCandidateStats(c.id);
    if (stats.total > 0) { selectCandidate(c.id); break; }
  }
}

(async function bootstrap() {
  await loadSiteData();
  init();
})();

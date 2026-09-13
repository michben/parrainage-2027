// ============================================================
// Quiz "Pour qui voter ?" — logique et rendu
// Méthode : pour chaque candidat, distance moyenne pondérée entre
// tes réponses (-2..+2) et les positions publiques du candidat sur
// 21 questions, pondérée ×1,5 sur tes thèmes prioritaires (max 3).
// ============================================================

let quizAnswers = {};
let quizThemes = [];
let quizDeclaredOnly = true;
let quizIndex = 0;
let quizShowResults = false;

function quizAnsweredCount() {
  return QUIZ_QUESTIONS.filter(q => typeof quizAnswers[q.id] === 'number').length;
}

function quizToggleTheme(themeId) {
  if (quizThemes.includes(themeId)) {
    quizThemes = quizThemes.filter(t => t !== themeId);
  } else if (quizThemes.length < 3) {
    quizThemes.push(themeId);
  }
  renderQuiz();
}

function quizSetAnswer(qid, value) {
  quizAnswers[qid] = value;
  renderQuiz();
}

function quizWeight(theme) {
  return quizThemes.includes(theme) ? 1.5 : 1;
}

function quizLikertLabel(value) {
  const opt = QUIZ_LIKERT.find(o => o.value === value);
  return opt ? opt.label : 'Neutre';
}

function quizComputeResults() {
  const candidates = quizDeclaredOnly
    ? getActiveCandidates().filter(c => c.statut === 'déclarée')
    : getActiveCandidates();

  return candidates.map(cand => {
    let weightedDistance = 0;
    let weightedMax = 0;
    const detail = QUIZ_QUESTIONS.map(q => {
      const userVal = quizAnswers[q.id] ?? 0;
      const candVal = q.positions[cand.id] ?? 0;
      const w = quizWeight(q.theme);
      const dist = Math.abs(userVal - candVal);
      weightedDistance += dist * w;
      weightedMax += 4 * w;
      return { question: q, userVal, candVal, dist };
    });
    const proximity = weightedMax === 0 ? 0 : Math.round((1 - weightedDistance / weightedMax) * 100);
    const bestMatches = [...detail].sort((a, b) => a.dist - b.dist).slice(0, 5);
    const divergences = [...detail].sort((a, b) => b.dist - a.dist).slice(0, 3);
    return { cand, proximity, bestMatches, divergences };
  }).sort((a, b) => b.proximity - a.proximity);
}

function quizThemeEmphasis() {
  return QUIZ_THEMES.map(theme => {
    const qs = QUIZ_QUESTIONS.filter(q => q.theme === theme.id);
    const avg = qs.reduce((sum, q) => sum + Math.abs(quizAnswers[q.id] ?? 0), 0) / qs.length;
    return { theme, avg };
  }).filter(t => t.avg > 0).sort((a, b) => b.avg - a.avg).slice(0, 3);
}

function renderQuiz() {
  const body = document.getElementById('quizBody');
  if (!body) return;
  const total = QUIZ_QUESTIONS.length;
  const answered = quizAnsweredCount();
  const q = QUIZ_QUESTIONS[quizIndex];
  const allAnswered = answered === total;

  body.innerHTML = `
    <div class="quiz-section">
      <h3>Étape 1 — Choisis jusqu'à 3 thèmes prioritaires</h3>
      <div class="quiz-theme-grid">
        ${QUIZ_THEMES.map(t => `
          <label class="quiz-theme-chip ${quizThemes.includes(t.id) ? 'active' : ''}">
            <input type="checkbox" data-theme="${t.id}" ${quizThemes.includes(t.id) ? 'checked' : ''} ${!quizThemes.includes(t.id) && quizThemes.length >= 3 ? 'disabled' : ''}>
            <span>${t.label}</span>
          </label>`).join('')}
      </div>
      <p class="quiz-hint">Thèmes prioritaires sélectionnés : ${quizThemes.length}/3 (pondéré ×1,5)</p>
      <label class="quiz-checkbox-row">
        <input type="checkbox" id="quizDeclaredOnly" ${quizDeclaredOnly ? 'checked' : ''}>
        <span>Ne comparer qu'avec les candidatures déclarées</span>
      </label>
    </div>

    <div class="quiz-section">
      <div class="quiz-progress-row">
        <h3>Étape 2 — Réponds aux questions</h3>
        <span class="quiz-progress-label">${quizIndex + 1} / ${total}</span>
      </div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(quizIndex + 1) / total * 100}%"></div></div>
      <p class="quiz-question-text">${q.text}</p>
      <div class="quiz-options">
        ${QUIZ_LIKERT.map(o => `
          <label class="quiz-option ${quizAnswers[q.id] === o.value ? 'active' : ''}">
            <input type="radio" name="quizQ" value="${o.value}" ${quizAnswers[q.id] === o.value ? 'checked' : ''}>
            <span>${o.label}</span>
          </label>`).join('')}
      </div>
      <div class="quiz-nav-row">
        <div class="quiz-nav-buttons">
          <button class="btn-secondary" id="quizPrevBtn" ${quizIndex === 0 ? 'disabled' : ''}>← Précédent</button>
          <button class="btn-secondary" id="quizNextBtn" ${quizIndex === total - 1 ? 'disabled' : ''}>Suivant →</button>
        </div>
        <button class="btn-primary" id="quizCalcBtn" ${!allAnswered ? 'disabled' : ''}>Calculer mon résultat (${answered}/${total})</button>
      </div>
    </div>

    <div id="quizResultsSection"></div>
  `;

  body.querySelectorAll('[data-theme]').forEach(input => {
    input.addEventListener('change', () => quizToggleTheme(input.dataset.theme));
  });
  document.getElementById('quizDeclaredOnly').addEventListener('change', (e) => {
    quizDeclaredOnly = e.target.checked;
    renderQuiz();
  });
  body.querySelectorAll('input[name="quizQ"]').forEach(input => {
    input.addEventListener('change', () => quizSetAnswer(q.id, parseInt(input.value, 10)));
  });
  document.getElementById('quizPrevBtn').addEventListener('click', () => { quizIndex = Math.max(0, quizIndex - 1); renderQuiz(); });
  document.getElementById('quizNextBtn').addEventListener('click', () => { quizIndex = Math.min(total - 1, quizIndex + 1); renderQuiz(); });
  document.getElementById('quizCalcBtn').addEventListener('click', () => { quizShowResults = true; renderQuiz(); });

  if (quizShowResults && allAnswered) {
    renderQuizResults();
  }
}

function renderQuizResults() {
  const results = quizComputeResults();
  const top3 = results.slice(0, 3);
  const top1 = results[0];
  const themeEmphasis = quizThemeEmphasis();
  const section = document.getElementById('quizResultsSection');
  if (!section) return;

  section.innerHTML = `
    <div class="quiz-section quiz-results">
      <div class="quiz-progress-row">
        <h3>Tes résultats de proximité</h3>
        <button class="btn-secondary" id="quizResetBtn">↺ Recommencer</button>
      </div>
      ${top3.length === 0 ? '<p class="quiz-hint">Aucun candidat à comparer (décoche le filtre déclarés uniquement).</p>' : `
      <div class="quiz-result-cards">
        ${top3.map(r => `
          <div class="quiz-result-card">
            ${avatarHtml(r.cand, 'width:56px;height:56px;font-size:18px;margin:0 auto 8px')}
            <div class="quiz-result-name">${r.cand.nom}</div>
            <div class="quiz-result-party">${r.cand.parti}</div>
            <div class="quiz-result-pct">${r.proximity}%</div>
          </div>`).join('')}
      </div>`}
      ${themeEmphasis.length ? `<p class="quiz-hint">Tes réponses sont les plus marquées sur : ${themeEmphasis.map(t => t.theme.label).join(', ')}</p>` : ''}
      ${top1 ? `
        <div class="quiz-explain">
          <h4>Pourquoi tu matches avec ${top1.cand.nom}</h4>
          <ul>
            ${top1.bestMatches.map(m => `<li>${m.question.text} <span class="quiz-explain-detail">(toi : ${quizLikertLabel(m.userVal)} · ${top1.cand.nom} : ${quizLikertLabel(m.candVal)})</span></li>`).join('')}
          </ul>
          <h4>Principaux points de désaccord</h4>
          <ul>
            ${top1.divergences.map(m => `<li>${m.question.text}</li>`).join('')}
          </ul>
        </div>` : ''}
      <p class="quiz-disclaimer">Résultat = proximité avec des positions publiques (méthode : distance entre ta réponse et la position du candidat sur chaque question, pondérée ×1,5 sur tes thèmes prioritaires). Ce quiz ne donne pas de consigne de vote et ne remplace pas un sondage.</p>
    </div>
  `;
  document.getElementById('quizResetBtn').addEventListener('click', quizReset);
}

function quizReset() {
  quizAnswers = {};
  quizThemes = [];
  quizIndex = 0;
  quizShowResults = false;
  renderQuiz();
}

document.getElementById('quizOpenBtn')?.addEventListener('click', () => {
  document.getElementById('quizOverlay').classList.add('active');
  renderQuiz();
});
document.getElementById('quizCloseBtn')?.addEventListener('click', () => {
  document.getElementById('quizOverlay').classList.remove('active');
});
document.getElementById('quizOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'quizOverlay') document.getElementById('quizOverlay').classList.remove('active');
});

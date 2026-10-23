import { DIMENSIONS, QUESTIONS, TARGET_SCOPES, TECHNOLOGY_SCOPES, EXAMPLE, HIGH_BOUNDARY, RUBRIC_VERSION, scoreAudit, scopeGuidance, discussionQuestions, buildAuditSummary, assessmentDate, exampleLabel, mapCoverageMessage } from './signal-audit.js';

export function mountSignalAudit(document) {
  const window = document.defaultView;
  const $ = (id) => document.getElementById(id);
  const state = { targetScope: '', technologyScopes: [], answers: {}, index: 0, result: null, isExample: false, takenAt: null, started: false, completed: false };
  const labelFor = (items, id) => items.find((item) => item.id === id)?.label || id;
  const announce = (text) => { $('liveStatus').textContent = text; };
  const track = (event, fields) => window.ccTrack?.(event, { tool: 'signal_audit', ...fields });
  const startSession = () => { if (!state.started) track('tool_start', { entry: state.isExample ? 'audit_example' : 'audit_setup' }); state.started = true; };
  const scrollTo = (node) => node.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  function makeChoice(item, type, name) {
    const label = document.createElement('label');
    label.className = `choice${item.score === null ? ' unscored' : ''}`;
    const input = document.createElement('input');
    input.type = type; input.name = name; input.value = item.id;
    const span = document.createElement('span'); span.textContent = item.label;
    label.append(input, span); return label;
  }
  $('targetScopes').replaceChildren(...TARGET_SCOPES.map((item) => makeChoice(item, 'radio', 'target-scope')));
  $('technologyScopes').replaceChildren(...TECHNOLOGY_SCOPES.map((item) => makeChoice(item, 'checkbox', 'technology-scope')));
  $('segments').replaceChildren(...DIMENSIONS.map(() => document.createElement('span')));
  $('mapPlot').style.setProperty('--high-boundary', `${HIGH_BOUNDARY}%`);
  function scopeSelection() {
    return { targetScope: document.querySelector('input[name="target-scope"]:checked')?.value || '', technologyScopes: [...document.querySelectorAll('input[name="technology-scope"]:checked')].map((input) => input.value) };
  }
  function scopeHasChanged(selection) {
    return Boolean(state.targetScope && (state.targetScope !== selection.targetScope || [...state.technologyScopes].sort().join() !== [...selection.technologyScopes].sort().join()));
  }
  function updateScopeWarning() {
    const selection = scopeSelection();
    const count = Object.keys(state.answers).length;
    const willClear = count > 0 && scopeHasChanged(selection);
    $('scopeResetWarning').hidden = !willClear;
    $('scopeResetWarning').textContent = willClear ? `Changing the scope clears your ${count} ${count === 1 ? 'answer' : 'answers'} when you begin again.` : '';
    if (selection.targetScope && selection.technologyScopes.length) $('setupError').textContent = '';
  }
  function renderQuestion() {
    const question = QUESTIONS[state.index];
    const dimensionIndex = DIMENSIONS.findIndex((item) => item.id === question.dimension);
    $('dimensionName').textContent = DIMENSIONS[dimensionIndex].name;
    $('progressText').textContent = `Question ${state.index + 1} of ${QUESTIONS.length}`;
    $('questionProgress').setAttribute('aria-valuenow', String(state.index + 1));
    $('questionProgress').setAttribute('aria-valuetext', `Question ${state.index + 1} of 12`);
    $('questionNumber').textContent = String(state.index + 1).padStart(2, '0');
    $('questionPrompt').textContent = question.prompt;
    $('questionExample').textContent = question.example;
    $('questionExample').hidden = !question.example;
    const choices = question.options.filter((item) => item.score !== null).reverse().concat(question.options.filter((item) => item.score === null));
    $('answerChoices').replaceChildren(...choices.map((option) => {
      const label = makeChoice(option, 'radio', 'answer');
      label.querySelector('input').checked = state.answers[question.id] === option.id;
      return label;
    }));
    [...$('segments').children].forEach((segment, index) => { segment.className = index < dimensionIndex ? 'done' : index === dimensionIndex ? 'active' : ''; });
    $('previousButton').textContent = state.index === 0 ? '← Back to scope' : '← Previous';
    $('nextButton').textContent = state.index === QUESTIONS.length - 1 ? 'See my result →' : 'Next →';
    $('answerError').textContent = '';
    $('questionPrompt').focus({ preventScroll: true });
    announce(`${DIMENSIONS[dimensionIndex].name}. Question ${state.index + 1} of 12.`);
  }
  $('auditForm').addEventListener('submit', (event) => event.preventDefault());
  $('auditForm').addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof window.HTMLInputElement)) return;
    if (input.name === 'technology-scope' && input.checked) {
      if (input.value === 'mixed') {
        const replaced = [...document.querySelectorAll('input[name="technology-scope"]:checked')].some((item) => item !== input);
        document.querySelectorAll('input[name="technology-scope"]').forEach((item) => { if (item !== input) item.checked = false; });
        if (replaced) announce('Mixed technology portfolio selected. Individual categories cleared.');
      } else {
        const mixed = document.querySelector('input[name="technology-scope"][value="mixed"]');
        if (mixed.checked) { mixed.checked = false; announce('Individual category selected. Mixed technology portfolio cleared.'); }
      }
    }
    if (input.name === 'target-scope' || input.name === 'technology-scope') updateScopeWarning();
    if (input.name === 'answer') { state.answers[QUESTIONS[state.index].id] = input.value; $('answerError').textContent = ''; }
  });
  $('beginButton').addEventListener('click', () => {
    const target = document.querySelector('input[name="target-scope"]:checked');
    const technologyScopes = [...document.querySelectorAll('input[name="technology-scope"]:checked')].map((input) => input.value);
    if (!target || !technologyScopes.length) { $('setupError').textContent = 'Choose what to assess and at least one technology category.'; return; }
    const changed = scopeHasChanged({ targetScope: target.value, technologyScopes });
    if (changed) { state.answers = {}; state.index = 0; state.isExample = false; state.started = false; state.completed = false; }
    state.targetScope = target.value; state.technologyScopes = technologyScopes;
    $('setupError').textContent = '';
    $('scopeChangeNotice').hidden = !changed;
    $('setupPanel').hidden = true; $('questionPanel').hidden = false; $('exampleButton').hidden = true;
    startSession();
    renderQuestion(); scrollTo($('auditStage'));
  });
  $('nextButton').addEventListener('click', () => {
    if (!state.answers[QUESTIONS[state.index].id]) { $('answerError').textContent = 'Choose the closest answer, “I don’t know,” or “This doesn’t apply.”'; return; }
    if (state.index < QUESTIONS.length - 1) { state.index++; renderQuestion(); scrollTo($('auditStage')); }
    else showResults();
  });
  $('previousButton').addEventListener('click', () => {
    if (state.index === 0) { $('questionPanel').hidden = true; $('setupPanel').hidden = false; updateScopeWarning(); $('stageTitle').focus({ preventScroll: true }); }
    else { state.index--; renderQuestion(); }
    scrollTo($('auditStage'));
  });
  function showResults() {
    state.result = scoreAudit(state.answers);
    state.takenAt = new Date().toISOString();
    const result = state.result;
    $('auditStage').hidden = true; $('results').hidden = false; $('exampleButton').hidden = true;
    $('exampleNotice').hidden = !state.isExample;
    const editedExample = state.isExample && exampleLabel(state.answers) !== EXAMPLE.label;
    $('exampleLabel').textContent = state.isExample ? exampleLabel(state.answers) : '';
    $('exampleDescription').hidden = editedExample || !state.isExample;
    $('exampleDescription').textContent = state.isExample && !editedExample ? EXAMPLE.description : '';
    $('exampleContext').textContent = editedExample ? 'These answers started from the made-up example.' : 'These are illustrative answers.';
    $('resultEyebrow').textContent = state.isExample ? 'Example result' : 'Your self-assessment';
    $('assessmentDate').dateTime = state.takenAt;
    $('assessmentDate').textContent = assessmentDate(state.takenAt);
    $('rubricVersion').textContent = RUBRIC_VERSION;
    $('resultTitle').textContent = result.archetype.name;
    $('resultMeaning').textContent = result.archetype.meaning;
    $('scopeLabel').textContent = labelFor(TARGET_SCOPES, state.targetScope);
    $('technologyLabel').textContent = state.technologyScopes.map((id) => labelFor(TECHNOLOGY_SCOPES, id)).join(' · ');
    $('axisSignalScore').textContent = result.axes.signalReadiness === null ? '—' : `${result.axes.signalReadiness}/100`;
    $('axisDecisionScore').textContent = result.axes.decisionIntegration === null ? '—' : `${result.axes.decisionIntegration}/100`;
    $('evidenceScore').textContent = `${result.answeredCount}/12`;
    $('coverageNote').textContent = `${result.coverage.unknown.length} unknown · ${result.coverage.notApplicable.length} not applicable. These are your answers, not verified records or a confidence estimate.`;
    $('mapPoint').hidden = !result.valid;
    if (result.valid) {
      $('mapPoint').style.left = `${result.axes.signalReadiness}%`;
      $('mapPoint').style.bottom = `${result.axes.decisionIntegration}%`;
      $('mapPoint').classList.toggle('edge-right', result.axes.signalReadiness > 84);
    }
    $('mapDescription').textContent = result.valid ? `Understand the spending: ${result.axes.signalReadiness}/100 points. Use it in decisions: ${result.axes.decisionIntegration}/100 points. The dividing lines use our 67 point cutoff.` : 'No overall position: each area needs at least two scored answers. Unknown and not applicable answers are kept separate from a low score.';
    $('dimensionCards').replaceChildren(...DIMENSIONS.map((dimension) => {
      const item = result.dimensions[dimension.id];
      const article = document.createElement('article'); article.className = 'profile-row';
      const head = document.createElement('div'); head.className = 'profile-row-head';
      const title = document.createElement('h5'); title.textContent = dimension.name;
      const score = document.createElement('strong'); score.className = 'profile-row-score'; score.textContent = item.score === null ? '—' : `${item.score}/100`;
      head.append(title, score);
      const description = document.createElement('p'); description.className = 'profile-row-description'; description.textContent = dimension.description;
      const track = document.createElement('div'); track.className = 'profile-track'; track.setAttribute('aria-hidden', 'true');
      const bar = document.createElement('span'); bar.style.width = `${item.score ?? 0}%`; track.append(bar);
      const meta = document.createElement('p'); meta.className = 'profile-row-meta'; meta.textContent = `${item.label} · ${item.answered}/3 scored`;
      article.append(head, description, track, meta); return article;
    }));
    $('moveTitle').textContent = result.priority.title;
    $('moveText').textContent = result.priority.move;
    $('priorityReason').textContent = result.priority.reason;
    $('mapCoverageNotice').hidden = result.valid;
    $('mapCoverageNotice').textContent = mapCoverageMessage(result);
    $('renewalTrackerLink').hidden = result.priority.questionId !== 'commitments-contracts';
    $('ownerText').textContent = result.priority.owners;
    $('measureText').textContent = result.priority.measures.join(' · ');
    $('discussionQuestions').replaceChildren(...discussionQuestions(result).map((text) => { const li = document.createElement('li'); li.textContent = text; return li; }));
    $('scopeWatchpoint').textContent = scopeGuidance(state.technologyScopes);
    $('answerReview').replaceChildren(...QUESTIONS.map((question) => {
      const row = document.createElement('div');
      const title = document.createElement('dt'); title.textContent = question.title;
      const answer = document.createElement('dd'); answer.textContent = question.options.find((item) => item.id === state.answers[question.id])?.label || 'Unanswered';
      row.append(title, answer); return row;
    }));
    $('copyStatus').textContent = ''; $('manualCopyPanel').hidden = true;
    if (!state.completed) track('tool_complete', { result: 'completed' }); state.completed = true;
    $('resultTitle').focus({ preventScroll: true }); scrollTo($('results'));
    announce('Your result is ready. Read what to do first, then check the profile and your answers.');
  }
  $('exampleButton').addEventListener('click', () => {
    state.targetScope = EXAMPLE.targetScope; state.technologyScopes = [...EXAMPLE.technologyScopes]; state.answers = { ...EXAMPLE.answers }; state.isExample = true; state.index = 0;
    document.querySelectorAll('input[name="target-scope"]').forEach((input) => { input.checked = input.value === state.targetScope; });
    document.querySelectorAll('input[name="technology-scope"]').forEach((input) => { input.checked = state.technologyScopes.includes(input.value); });
    updateScopeWarning(); startSession(); showResults();
  });
  $('editAnswersButton').addEventListener('click', () => {
    state.index = 0; $('results').hidden = true; $('auditStage').hidden = false; $('setupPanel').hidden = true; $('questionPanel').hidden = false; renderQuestion(); scrollTo($('auditStage'));
  });
  $('retakeButton').addEventListener('click', () => {
    track('tool_output_action', { action: 'retake' });
    state.answers = {}; state.index = 0; state.result = null; state.isExample = false; state.takenAt = null; state.targetScope = ''; state.technologyScopes = []; state.started = false; state.completed = false;
    $('auditForm').reset(); updateScopeWarning(); $('setupError').textContent = ''; $('exampleButton').hidden = false;
    $('results').hidden = true; $('auditStage').hidden = false; $('setupPanel').hidden = false; $('questionPanel').hidden = true; $('scopeChangeNotice').hidden = true;
    $('stageTitle').focus({ preventScroll: true }); scrollTo($('auditStage'));
  });
  let detailsBeforePrint = [];
  window.addEventListener('beforeprint', () => {
    if ($('results').hidden || detailsBeforePrint.length) return;
    detailsBeforePrint = [...$('results').querySelectorAll('details')].map((node) => [node, node.open]);
    detailsBeforePrint.forEach(([node]) => { node.open = true; });
  });
  window.addEventListener('afterprint', () => {
    detailsBeforePrint.forEach(([node, open]) => { node.open = open; });
    detailsBeforePrint = [];
  });
  $('printButton').addEventListener('click', () => { track('tool_output_action', { action: 'print' }); window.print(); });
  $('copyButton').addEventListener('click', async () => {
    const text = buildAuditSummary(state.result, state);
    let copied = false;
    try { await window.navigator.clipboard.writeText(text); copied = true; } catch {
      $('manualCopyText').value = text;
      $('manualCopyPanel').hidden = false;
      $('manualCopyText').focus(); $('manualCopyText').select();
    }
    $('copyStatus').textContent = copied ? 'Summary and answers copied.' : 'Automatic copy isn’t available here. Select and copy the full summary below, or use Print / Save PDF.';
    if (copied) track('tool_output_action', { action: 'copy' });
  });
  return { state };
}

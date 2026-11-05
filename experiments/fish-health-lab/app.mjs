import { SYMPTOMS, BEHAVIORS, CONDITIONS, SOURCES, TREATMENT_CONTEXT } from './data.mjs';
import { assessUrgency, rankConditions, rankVisualConditions, lookalikesFor, buildCase } from './logic.mjs';
import { slotsFor, leadSlot, patternFor } from './visuals.mjs';
import { OPENING_IMAGE, SIGN_IMAGES, TEXTURE_IMAGES } from './choice-images.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const form = $('#fish-form');
const comparisons = new Set();
let step = 'welcome', activeView = 'guide', primarySign = '', detailSign = '';
let currentCase = '', illustrationId = 0, libraryPattern = '', visualReference = null;

function fishArt(type = 'plain', hero = false) {
  const uid = `fish-${++illustrationId}`;
  const dots = [[102,67],[122,80],[151,62],[170,82],[182,73],[139,51],[115,96],[160,96],[84,78],[74,63],[100,48],[155,41]];
  let changes = '';
  if (type === 'dots') changes = dots.map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 2.5 : 1.9}" fill="#fbfbf0"/>`).join('');
  if (type === 'dust') changes = Array.from({ length: 65 }, (_,i) => `<circle cx="${88 + (i * 19 % 91)}" cy="${50 + (i * 13 % 43)}" r=".85" fill="#e9cf84"/>`).join('');
  if (type === 'patch') changes = '<path d="M120 49q26-4 34 12l-10 23-24-4-10-14z" fill="#e8e8da" opacity=".85"/>';
  if (type === 'fuzz') changes = `<ellipse cx="139" cy="54" rx="17" ry="9" fill="#f0f0e3" opacity=".8"/>${Array.from({length:20},(_,i)=>`<path d="M${124 + i*1.5} 54q${i%2?6:-6} -${15+i%5*3} ${i%3*5-4} -${16+i%6*3}" stroke="#fcfcf4" stroke-width="1.4" fill="none"/>`).join('')}`;
  if (type === 'sores') changes = '<ellipse cx="141" cy="72" rx="14" ry="9" fill="#c57a70"/><ellipse cx="142" cy="72" rx="8" ry="5" fill="#aa514d"/>';
  if (type === 'lumps') changes = '<path d="M135 58c-6-13 2-18 8-14 5-9 15-4 13 2 12 0 13 13 6 17z" fill="#e8e3d1" stroke="#cbc8b6"/>';
  if (type === 'breathing') changes = '<path d="M186 56q-13 15-2 31m7-35q-11 17-2 36" fill="none" stroke="#be8272" stroke-width="3"/><path d="M209 59l17-6m-16 18h21m-23 9 17 6" stroke="#92b7b1" stroke-width="2" stroke-linecap="round"/>';
  const body = type === 'swollen' ? 'M68 76C88 25 167 17 201 68Q212 75 199 82C170 124 88 126 68 76Z' : 'M68 76C94 34 167 38 201 68Q212 75 199 82C162 115 99 113 68 76Z';
  const tail = type === 'fins' ? 'M78 74L28 44l6 18-10 1 13 12-10 8 12 5-6 15 45-26z' : 'M78 74Q55 60 27 43Q38 75 27 106Q56 93 78 77z';
  return `<svg class="fish-art ${hero ? 'fish-art-hero' : ''}" viewBox="0 0 260 150" aria-hidden="true" focusable="false"><defs><linearGradient id="${uid}-body" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7eaea6"/><stop offset=".48" stop-color="#b9cec1"/><stop offset="1" stop-color="#dce4cb"/></linearGradient><linearGradient id="${uid}-fin"><stop stop-color="#9aada1" stop-opacity=".35"/><stop offset="1" stop-color="#638b83" stop-opacity=".8"/></linearGradient></defs><g transform="${type === 'balance' ? 'rotate(-24 130 75)' : ''}"><path d="${tail}" fill="url(#${uid}-fin)" stroke="#7a9e92"/><path d="M98 53q22-39 60-19l11 21M104 97q16 26 43 17l8-14" fill="url(#${uid}-fin)" stroke="#7a9e92"/><path d="${body}" fill="url(#${uid}-body)" stroke="#527d72" stroke-width="1.2"/><path d="M82 76q50-22 106-5M92 85q41 12 75 4" fill="none" stroke="#6e9685" opacity=".4"/><path d="M177 55q-11 20 1 39" fill="none" stroke="#577e73" stroke-width="1.7"/><path d="M112 82q21-8 28 9l-20 11z" fill="url(#${uid}-fin)"/><circle cx="191" cy="67" r="${type === 'eyes' ? 9 : 5.5}" fill="${type === 'eyes' ? '#dfdfce' : '#ece9c8'}" stroke="#587d70"/><circle cx="192" cy="67" r="${type === 'eyes' ? 5 : 3}" fill="${type === 'eyes' ? '#98a69a' : '#153f36'}"/><circle cx="193" cy="66" r="1" fill="#fff"/>${changes}</g></svg>`;
}


function readInput() {
  return { ...Object.fromEntries(new FormData(form)), primarySign: detailSign || primarySign, signs: [detailSign || primarySign, ...$$('input[name="behavior"]:checked').map(el => el.value)].filter(Boolean), visualReference, comparisons: [...comparisons] };
}
function needsTexture() { return form.elements.water.value === 'fresh' && primarySign === 'dots'; }
function sequence() { return ['water', 'signs', ...(needsTexture() ? ['texture'] : []), 'behavior', 'results']; }

function goStep(name, focus = true) {
  step = name;
  $('#welcome').hidden = name !== 'welcome';
  $('#check').hidden = name === 'welcome';
  $$('.question-panel').forEach(el => { el.hidden = el.dataset.step !== name; });
  // Fetch choice pictures only when their question is reached, not at the front door.
  const activeGrid = name === 'signs' ? '#symptom-grid' : name === 'texture' ? '#texture-grid' : null;
  if (activeGrid) $$(`${activeGrid} img[data-src]`).forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  form.hidden = ['results', 'care-summary'].includes(name);
  form.classList.toggle('care-mode', name === 'care');
  $('#flow-error').textContent = '';
  const progress = { water: [1,'Water type'], signs: [2,'What you see'], texture: [2,'Look closer'], behavior: [3,'Behavior'], results: [3,'Your comparisons'], care: [3,'Care & treatment'], 'care-summary': [3,'Care steps'] }[name];
  if (progress) {
    $('#flow-label').textContent = name === 'results' ? 'YOUR VISUAL COMPARISONS' : name.startsWith('care') ? 'AFTER THE VISUAL CHECK · CARE & TREATMENT' : `STEP ${progress[0]} OF 3 · ${progress[1]}`;
    $('#flow-progress').value = progress[0];
  }
  $('#flow-progress').hidden = name.startsWith('care');
  $('#next-button').textContent = name === 'care' ? 'See care steps →' : name === 'behavior' ? 'See what to compare →' : 'Continue →';
  $('#salinity-field').hidden = form.elements.water.value === 'fresh';
  if (name === 'texture') {
    const image = slotsFor('ich-fresh').find(s => s.id === 'lookalikes').image;
    $('#texture-reference').innerHTML = `<button class="reference-peek" type="button" data-enlarge-entry="ich-fresh" data-enlarge-slot="lookalikes"><img src="${image.url}" alt="Illustrated comparison of grains, dust, cottony growth, patches and larger growths."><span><strong>Need a closer look?</strong>Open the texture reference ↗</span></button><button type="button" class="text-button" data-enlarge-entry="ich-fresh" data-enlarge-slot="closeup">See individual white grains up close ↗</button><p class="quiet">Illustrated clues—not proof of a disease.</p>`;
  } else $('#texture-reference').replaceChildren();
  updateCompareTray();
  if (focus) {
    const heading = name === 'welcome' ? $('#welcome-title') : $(`[data-step="${name}"] h1`);
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function nextStep() {
  if (step === 'water' && !form.elements.water.value) { $('#flow-error').textContent = 'Choose a water type, or “I’m not sure.”'; return; }
  if (step === 'signs' && !primarySign) { $('#flow-error').textContent = 'Choose the closest picture. “Nothing obvious” is a useful answer.'; return; }
  if (step === 'texture' && !detailSign) { $('#flow-error').textContent = 'Choose the closest texture, or “Not sure.”'; return; }
  if (step === 'care') {
    if (!form.reportValidity()) return;
    renderCareSummary(); return;
  }
  if (step === 'behavior') { renderResults(); return; }
  const route = sequence(), next = route[route.indexOf(step) + 1];
  if (next) goStep(next);
}

function switchView(name) {
  activeView = name;
  for (const id of ['guide','library','about']) $(`#${id}-view`).hidden = id !== name;
  $$('.nav-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.view === name);
    if (button.dataset.view === name) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
  });
  history.replaceState(null, '', location.pathname + location.search + (name === 'library' ? '#library' : ''));
  if (name === 'library') renderLibrary();
  updateCompareTray();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function selectSign(id, isTexture = false) {
  if (!SYMPTOMS.some(item => item.id === id)) return;
  if (isTexture) detailSign = id;
  else { primarySign = id; detailSign = ''; visualReference = null; }
  $$('[data-symptom]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.symptom === primarySign)));
  $$('[data-texture]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.texture === detailSign)));
  $('#flow-error').textContent = '';
}

function reset() {
  form.reset(); primarySign = ''; detailSign = ''; visualReference = null; currentCase = '';
  $$('[data-symptom], [data-texture]').forEach(button => button.setAttribute('aria-pressed','false'));
  comparisons.clear(); $('#results-content').replaceChildren(); $('#case-text').value = '';
  $('#care-context').replaceChildren(); $('#care-summary-content').replaceChildren();
  $('#inline-urgent').hidden = true; $('#tank-extra').open = false;
  $('#detail-content').replaceChildren(); $('#compare-content').replaceChildren();
  $('#atlas-full').removeAttribute('src');
  $$('dialog[open]').forEach(dialog => dialog.close());
  goStep('welcome'); switchView('guide');
}

function startFromPattern(id) {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  reset();
  primarySign = patternFor(id);
  visualReference = id;
  if (condition.scope !== 'both') form.elements.water.value = condition.scope;
  $$('[data-symptom]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.symptom === primarySign)));
  goStep('water');
}

function resultThumbnail(condition) {
  return leadSlot(condition.id)?.image || SIGN_IMAGES[condition.art] || SIGN_IMAGES.unclear;
}

function renderResults() {
  const input = readInput(), assessment = assessUrgency(input);
  const first = rankVisualConditions(input)[0];
  const sign = SYMPTOMS.find(s => s.id === input.primarySign);
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h3>Get help for the distress first.</h3><p>${escape(assessment.urgent.join('; '))}. Support aeration, test the water and arrange urgent fish-health help.</p><button class="text-button" data-action="emergency">What to do now →</button></div>` : '';
  const scope = input.water === 'unknown' ? '<p class="notice">The water type is unknown. Both environments may appear below; identify the aquarium type before choosing care.</p>' : '';
  let focus = '<p class="notice">No clear visual match yet. A still picture cannot identify every problem. The care step helps you check the environment and decide what needs professional examination.</p>';
  if (first) {
    const image = resultThumbnail(first), ready = slotsFor(first.id).filter(s => s.image).length;
    focus = `<article class="result-focus" data-result="${first.id}"><div class="result-image"><button data-condition="${first.id}" aria-label="Explore ${escape(first.title)}"><img src="${image.url}" width="${image.width || 1024}" height="${image.height || 1536}" alt="${escape(image.alt)}"><span>${ready ? `Explore ${ready} reference pictures` : 'Explore this pattern'} ↗</span></button></div><div class="result-copy"><p class="eyebrow">A COMPARISON — NOT A DIAGNOSIS</p><h2>${escape(first.title)}</h2><p>${escape(first.summary)}</p><p class="quiet">${escape(first.distinguish)}</p><button class="button primary" data-condition="${first.id}">${ready ? 'Compare the reference pictures' : 'Read the useful checks'} →</button><p class="quiet">AI educational illustrations, not confirmed patient photos.</p></div></article>`;
  }
  const other = (first ? lookalikesFor(first.id, input.water) : []).map(c => {
    const image = SIGN_IMAGES[c.art] || SIGN_IMAGES.unclear;
    return `<button class="alternative" data-condition="${c.id}"><img src="${image.url}" alt="${escape(image.alt)}" loading="lazy"><span><strong>${escape(c.title)}</strong><small>${escape(c.comparisonReason)}</small></span><b aria-hidden="true">↗</b></button>`;
  }).join('');
  const heading = ['breathing','balance'].includes(input.primarySign) ? 'Other causes of similar behavior' : 'Compare these similar-looking patterns';
  $('#results-content').innerHTML = `<h1 id="results-title" class="question-title">Here’s what to compare.</h1><p class="question-hint">You chose “${escape(sign?.title || 'Nothing obvious')}.” Similar signs can have different causes.</p>${urgent}${scope}${focus}${other ? `<h3 class="subheading">${heading}</h3><div class="alternatives">${other}</div>` : ''}<section class="care-next"><p class="eyebrow">NEXT · CARE & TREATMENT</p><h3>What should I do now?</h3><p>Check water readings, support the fish and see which next checks fit this pattern.</p><button class="button primary" data-action="care">Continue to care & treatment →</button></section><button class="text-button" data-action="case">Save my observation notes ↗</button>`;
  goStep('results');
}

function openCare() {
  const input = readInput(), first = rankVisualConditions(input)[0];
  $('#care-context').innerHTML = first
    ? `<p><strong>Your visual comparison:</strong> ${escape(first.title)}. This is a possible pattern, not a confirmed cause.</p><button type="button" class="text-button" data-action="results">Review the pictures ←</button>`
    : '<p>No clear visual match yet. Start with the environment and the fish’s actual behavior.</p>';
  goStep('care');
}

function renderCareSummary() {
  const input = readInput(), assessment = assessUrgency(input), first = rankVisualConditions(input)[0];
  const scoped = first && (input.water !== 'unknown' || first.scope === 'both');
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h2>Get urgent help first.</h2><p>${escape(assessment.urgent.join('; '))}. Support aeration and contact a fish-health professional now.</p><button class="text-button" data-action="emergency">Immediate support steps →</button></div>` : '';
  const water = assessment.checks.length ? `<div class="notice water-notice"><h3>Address the shared environment.</h3>${list(assessment.checks)}</div>` : '';
  const unknown = assessment.waterUnknown ? '<p class="water-reminder">Ammonia or nitrite is unmeasured. Unknown does not mean safe—test before choosing a medicine.</p>' : '<p class="quiet">Your readings are recorded. Ammonia and nitrite alone do not assess oxygen or rule out other water problems.</p>';
  const condition = scoped ? `<section class="care-section" data-care-condition="${first.id}"><p class="eyebrow">2 · CHECK THE POSSIBLE CAUSE</p><h2>${escape(first.title)}</h2><p>${escape(first.confirm)}</p>${list(first.next)}<p class="eyebrow">3 · CHOOSING TREATMENT</p><p>${escape(TREATMENT_CONTEXT[first.id] || 'The treatment depends on the cause, fish species and tank inhabitants. Use the checks above to establish a suitable plan with a fish-health professional; a matching picture alone is not enough.')}</p><p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(first.avoid)}</p><div class="sources">${sourceLinks(first.source)}</div></section>` : `<section class="care-section"><h2>Establish the cause before choosing treatment.</h2><p>${input.water === 'unknown' ? 'Identify whether this is freshwater, marine or another water type first. Do not apply a freshwater parasite treatment to a marine fish.' : 'There is no clear visual comparison. Record the behavior, how quickly it changed and which fish are affected; arrange an examination if the fish remains unwell.'}</p><p>A fish-health professional can use water tests, examination and microscopy to separate overlapping causes.</p></section>`;
  $('#care-summary-content').innerHTML = `<h1 id="care-summary-title" class="question-title">Your care & treatment next steps.</h1><p class="question-hint">Support the fish now; choose a specific treatment once the cause and species requirements are clear.</p>${urgent}<section class="care-section"><p class="eyebrow">1 · SUPPORT THE FISH & TANK</p>${water}${unknown}${list(CONDITIONS.find(c => c.id === 'water').next)}<p class="quiet">Water problems can coexist with a skin condition. These checks do not change what the marks look like.</p></section>${condition}<button class="button primary" data-action="case">Save my observations & readings ↗</button>`;
  goStep('care-summary');
}

function list(items) { return `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`; }
function scopeName(scope) { return {fresh:'Freshwater',marine:'Saltwater',both:'Fresh + salt water'}[scope]; }
function sourceLinks(ids) { return ids.map(id => SOURCES.find(s => s.id === id)).filter(Boolean).map(source => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.name)} ↗</a>`).join(''); }

function slotArt(condition, slot, compact = false) {
  if (slot.image) return `<img src="${escape(slot.image.url)}" alt="${escape(slot.image.alt)}" loading="lazy"><span class="image-origin">AI illustration</span>`;
  return `<span class="slot-placeholder"><span class="frame-symbol" aria-hidden="true">▧</span><strong>${escape(slot.label)}</strong>${compact ? '' : `<small>${escape(condition.title)}</small><span class="awaiting">IMAGE TO ADD</span>`}</span>`;
}

function card(condition, matched = false) {
  const slots = slotsFor(condition.id), lead = leadSlot(condition.id), count = slots.filter(s => s.image).length;
  return `<article class="condition-card visual-card"><button class="card-image ${lead.image ? 'filled' : ''}" data-condition="${condition.id}" aria-label="Open ${escape(condition.title)} visual page">${slotArt(condition, lead)}<span class="slot-count">${count} / ${slots.length} images</span></button><div class="card-slot-strip">${slots.filter(s => s.id !== lead.id).slice(0, 3).map(slot => `<button class="mini-slot ${slot.image ? 'filled' : ''}" data-condition="${condition.id}" data-open-slot="${slot.id}" aria-label="${escape(condition.title)}: ${escape(slot.label)}${slot.image ? '' : ' — image to add'}">${slotArt(condition, slot, true)}</button>`).join('')}</div><div class="condition-body"><div class="card-meta"><span>${escape(condition.kind)}</span><span>${scopeName(condition.scope)}</span></div><h3>${escape(condition.title)}</h3><p>${escape(condition.summary)}</p>${matched ? `<p class="matches"><strong>${condition.comparisonReason ? 'Why compare:' : 'Relevant clues:'}</strong> ${escape(condition.comparisonReason || condition.matched.join(', ') || 'Tank history / water readings')}</p>` : ''}<div class="card-actions"><button class="text-button" data-condition="${condition.id}">Open visual page ↗</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div></div></article>`;
}

function galleryDisplay(condition, slot) {
  return `<div class="gallery-image ${slot.image ? 'filled' : ''}">${slot.image ? `<button data-enlarge-entry="${condition.id}" data-enlarge-slot="${slot.id}" aria-label="Enlarge ${escape(slot.label)}">${slotArt(condition, slot)}</button>` : slotArt(condition, slot)}</div><div class="gallery-caption"><strong>${escape(slot.label)}</strong><p>${escape(slot.image?.caption || slot.brief)}</p><small>${escape(slot.image ? `${slot.image.provenance}. ${slot.image.source}` : 'Planned image space — no example has been added yet.')}</small></div>`;
}

function gallery(condition, slotId = 'overview') {
  const slots = slotsFor(condition.id), active = slots.find(s => s.id === slotId) || slots[0];
  return `<section class="visual-gallery" data-gallery="${condition.id}" aria-label="${escape(condition.title)} image gallery"><div class="gallery-display" aria-live="polite">${galleryDisplay(condition, active)}</div><div class="gallery-slots" aria-label="Choose an image view">${slots.map(slot => `<button data-slot="${slot.id}" aria-pressed="${slot.id === active.id}" aria-label="${escape(slot.label)}${slot.image ? ' — AI illustration' : ' — image to add'}"><span>${escape(slot.label)}</span><small>${slot.image ? 'Illustration ready' : 'Image to add'}</small></button>`).join('')}</div></section>`;
}

function enlargeImage(entryId, slotId) {
  const condition = CONDITIONS.find(c => c.id === entryId), slot = slotsFor(entryId).find(s => s.id === slotId);
  if (!condition || !slot?.image) return;
  $('#atlas-title').textContent = `${condition.title} · ${slot.label}`;
  $('#atlas-full').src = slot.image.url; $('#atlas-full').alt = slot.image.alt;
  $('#atlas-dialog').showModal();
}

function updateCompareTray(message = '') {
  const trayVisible = comparisons.size > 0 && (activeView === 'library' || (activeView === 'guide' && step === 'results'));
  $('#comparison-tray').hidden = !trayVisible;
  $('#comparison-picks').innerHTML = [...comparisons].map(id => `<button data-remove-comparison="${id}" aria-label="Remove ${escape(CONDITIONS.find(c => c.id === id).title)} from comparison">${escape(CONDITIONS.find(c => c.id === id).title)} <span aria-hidden="true">×</span></button>`).join('');
  $('#comparison-status').textContent = message || (comparisons.size === 1 ? 'Choose one more entry to compare.' : 'Two entries selected. Compare the pictures and look-alikes.');
  $('[data-action="compare"]').disabled = comparisons.size !== 2;
  document.body.classList.toggle('has-comparison', trayVisible);
  $$('[data-compare]').forEach(button => {
    const selected = comparisons.has(button.dataset.compare);
    button.setAttribute('aria-pressed', String(selected)); button.textContent = selected ? '✓ Selected' : '+ Compare';
  });
}

function openComparison() {
  if (comparisons.size !== 2) return;
  const selected = [...comparisons].map(id => CONDITIONS.find(c => c.id === id));
  $('#compare-content').innerHTML = `<div class="side-by-side">${selected.map(c => `<article><span class="scope-pill">${scopeName(c.scope)}</span><h3>${escape(c.title)}</h3>${gallery(c)}<div class="comparison-clues"><h4>Look for</h4>${list(c.clues)}<h4>What could fool you?</h4><p>${escape(c.distinguish)}</p><h4>How to distinguish it</h4><p>${escape(c.confirm)}</p><button class="button secondary" data-use-pattern="${c.id}">Check this visible pattern →</button></div></article>`).join('')}</div>`;
  $('#compare-dialog').showModal();
}

function emergencyContent() {
  return '<p class="eyebrow">ACT ON DISTRESS, NOT JUST A DISEASE NAME</p><h2 id="detail-title">Breathing and balance come first.</h2><p class="lead">Severe gasping, inability to stay upright, poor responsiveness or fish deaths warrant urgent aquatic-veterinary help.</p><ol class="care-list"><li><strong>Support oxygen.</strong> Check aeration, surface movement and filter operation. Avoid unnecessary handling.</li><li><strong>Test the water now.</strong> Record ammonia, nitrite, pH and temperature; check salinity for marine tanks. Clear water can still be unsafe.</li><li><strong>Address an environmental problem.</strong> If readings or a recent contamination indicate a problem, use appropriately conditioned, temperature- and salinity-matched partial water changes. Avoid abrupt pH or salinity changes.</li><li><strong>Contact a fish-health professional.</strong> Tell them how many fish are affected and how fast this developed. Don’t wait for visible spots.</li></ol><p class="notice">Don’t blindly mix medicines, raise heat, add salt, or move a marine fish into freshwater. Reef invertebrates and different fish species have different tolerances.</p><a class="button secondary" href="https://fishvets.org/" target="_blank" rel="noopener noreferrer">American Association of Fish Veterinarians ↗</a>';
}

function openDetail(id, slotId = 'overview') {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  $('#detail-content').innerHTML = `<p class="eyebrow">${escape(condition.kind)} · ${scopeName(condition.scope)}</p><h2 id="detail-title">${escape(condition.title)}</h2>${condition.scientific ? `<p class="scientific">${escape(condition.scientific)}</p>` : ''}<p class="lead">${escape(condition.summary)}</p>${slotsFor(id).some(s => s.image) || activeView === 'library' ? gallery(condition, slotId) : '<p class="quiet">Reference images for this entry are still being added.</p>'}<div class="detail-visual-actions"><button class="button primary" data-use-pattern="${condition.id}">Check this visible pattern →</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div><p class="quiet">This selects a visible sign, not a disease. Care & treatment follows your visual comparison.</p><h3>Clues that can fit</h3>${list(condition.clues)}<h3>What else could look similar?</h3><p>${escape(condition.distinguish)}</p><h3>Useful next checks</h3>${list(condition.next)}<div class="notice"><h4>How it is distinguished</h4><p>${escape(condition.confirm)}</p></div><p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(condition.avoid)}</p><div class="sources"><h4>Read the references</h4>${sourceLinks(condition.source)}</div><p class="quiet">A subtle skin appearance does not mean a mild illness. These image views are not clinical stages or a severity score.</p>`;
  $('#detail-dialog').showModal();
}

function renderLibrary() {
  const query = $('#library-search').value.trim().toLowerCase();
  const water = $('#library-water').value;
  const patternMatches = libraryPattern ? new Set(rankConditions({ water: water === 'all' ? 'unknown' : water, signs: [libraryPattern] }).map(c => c.id)) : null;
  const filtered = CONDITIONS.filter(c => (water === 'all' || c.scope === 'both' || c.scope === water)
    && (!patternMatches || patternMatches.has(c.id))
    && [c.title,c.scientific,c.kind,c.summary,...c.clues].filter(Boolean).join(' ').toLowerCase().includes(query))
    .sort((a, b) => slotsFor(b.id).filter(s => s.image).length - slotsFor(a.id).filter(s => s.image).length);
  const allSlots = filtered.flatMap(c => slotsFor(c.id)), ready = allSlots.filter(s => s.image).length;
  $('#library-count').textContent = `${filtered.length} entries · ${ready} illustrations in place · ${allSlots.length - ready} image spaces to fill`;
  $('#library-grid').innerHTML = filtered.map(c => card(c)).join('') || '<p class="notice">No matching entries. Try a symptom such as “breathing,” “white” or “fin.”</p>';
}

function showCase() {
  currentCase = buildCase(readInput());
  $('#case-text').value = currentCase;
  $('#copy-status').textContent = '';
  $('#case-dialog').showModal();
}

async function copyCase() {
  try { await navigator.clipboard.writeText(currentCase); $('#copy-status').textContent = 'Copied. Keep these observations for yourself or share them with a fish-health professional.'; }
  catch { $('#case-text').select(); $('#copy-status').textContent = 'Automatic copying was unavailable. The notes are selected; use your device’s Copy command.'; }
}


$('#welcome-fish').innerHTML = `<img src="${OPENING_IMAGE.url}" width="${OPENING_IMAGE.width}" height="${OPENING_IMAGE.height}" alt="${escape(OPENING_IMAGE.alt)}" fetchpriority="high" decoding="async">`;
function signButton(symptom, attribute, title = symptom.title) {
  const isTexture = attribute === 'data-texture';
  const image = (isTexture ? TEXTURE_IMAGES : SIGN_IMAGES)[symptom.id];
  const hint = isTexture && symptom.id === 'unclear' ? 'I can’t make out the texture' : symptom.text;
  return `<button type="button" class="symptom-card" ${attribute}="${symptom.id}" aria-pressed="false"><span class="symptom-art"><img data-choice-image="${isTexture ? 'texture' : 'sign'}-${symptom.id}" data-src="${image.url}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" decoding="async"><span class="selection-check" aria-hidden="true">✓</span></span><strong>${escape(title)}</strong><small>${escape(hint)}</small></button>`;
}
$('#symptom-grid').innerHTML = SYMPTOMS.map(s => signButton(s, 'data-symptom')).join('');
$('#texture-grid').innerHTML = ['dots','dust','fuzz','patch','lumps','unclear'].map(id => {
  const s = SYMPTOMS.find(s => s.id === id);
  return signButton(s, 'data-texture', id === 'unclear' ? 'Not sure' : s.title);
}).join('');
$('#behavior-grid').innerHTML = BEHAVIORS.map(b => `<label class="check-label"><input type="checkbox" name="behavior" value="${b.id}"><span>${escape(b.label)}</span></label>`).join('');
$('#source-list').innerHTML = sourceLinks(SOURCES.map(s => s.id));
$('#library-patterns').innerHTML = SYMPTOMS.map(s => `<button class="pattern-filter" data-library-pattern="${s.id}" aria-pressed="false"><span>${fishArt(s.art)}</span><strong>${escape(s.title)}</strong></button>`).join('');

document.addEventListener('click', async event => {
  const view = event.target.closest('[data-view]');
  if (view) switchView(view.dataset.view);
  const symptom = event.target.closest('[data-symptom]');
  if (symptom) selectSign(symptom.dataset.symptom);
  const texture = event.target.closest('[data-texture]');
  if (texture) selectSign(texture.dataset.texture, true);
  const condition = event.target.closest('[data-condition]');
  if (condition) openDetail(condition.dataset.condition, condition.dataset.openSlot);
  const filter = event.target.closest('[data-library-pattern]');
  if (filter) {
    libraryPattern = libraryPattern === filter.dataset.libraryPattern ? '' : filter.dataset.libraryPattern;
    $$('[data-library-pattern]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.libraryPattern === libraryPattern)));
    renderLibrary();
  }
  const slotButton = event.target.closest('[data-slot]');
  if (slotButton) {
    const root = slotButton.closest('[data-gallery]'), entry = CONDITIONS.find(c => c.id === root.dataset.gallery);
    root.querySelector('.gallery-display').innerHTML = galleryDisplay(entry, slotsFor(entry.id).find(s => s.id === slotButton.dataset.slot));
    root.querySelectorAll('[data-slot]').forEach(button => button.setAttribute('aria-pressed', String(button === slotButton)));
  }
  const enlarge = event.target.closest('[data-enlarge-entry]');
  if (enlarge) enlargeImage(enlarge.dataset.enlargeEntry, enlarge.dataset.enlargeSlot);
  const compare = event.target.closest('[data-compare]');
  if (compare) {
    const id = compare.dataset.compare;
    if (comparisons.has(id)) comparisons.delete(id);
    else if (comparisons.size < 2) comparisons.add(id);
    else { updateCompareTray('Two entries are selected. Remove one to add another.'); return; }
    updateCompareTray();
  }
  const remove = event.target.closest('[data-remove-comparison]');
  if (remove) { comparisons.delete(remove.dataset.removeComparison); updateCompareTray(); }
  const pattern = event.target.closest('[data-use-pattern]');
  if (pattern) startFromPattern(pattern.dataset.usePattern);
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'start') goStep('water');
  if (action === 'back') { if (step === 'care') renderResults(); else { const route = sequence(); goStep(route[route.indexOf(step) - 1] || 'welcome'); } }
  if (action === 'care') openCare();
  if (action === 'results') renderResults();
  if (action === 'edit') goStep('water');
  if (action === 'reset') reset();
  if (action === 'case') showCase();
  if (action === 'copy-case') await copyCase();
  if (action === 'download-case') {
    const url = URL.createObjectURL(new Blob([currentCase], { type: 'text/plain;charset=utf-8' }));
    Object.assign(document.createElement('a'), { href: url, download: 'fish-health-case.txt' }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (action === 'close-dialog') event.target.closest('dialog')?.close();
  if (action === 'emergency') { $('#detail-content').innerHTML = emergencyContent(); $('#detail-dialog').showModal(); }
  if (action === 'compare') openComparison();
  if (action === 'clear-compare') { comparisons.clear(); updateCompareTray(); }
  if (action === 'all-patterns') {
    libraryPattern = ''; $('#library-search').value = ''; $('#library-water').value = 'all';
    $$('[data-library-pattern]').forEach(button => button.setAttribute('aria-pressed','false'));
    renderLibrary();
  }
});
form.addEventListener('submit', event => { event.preventDefault(); nextStep(); });
form.addEventListener('change', event => {
  $('#flow-error').textContent = '';
  if (event.target.name === 'water') {
    detailSign = '';
    $$('[data-texture]').forEach(button => button.setAttribute('aria-pressed','false'));
  }
  const { urgent } = assessUrgency(readInput());
  $('#inline-urgent').hidden = !urgent.length;
  $('#inline-urgent').textContent = urgent.length ? `These signs need prompt help: ${urgent.join('; ')}. Support aeration, test the water and seek fish-health help now.` : '';
});
$('#library-search').addEventListener('input', renderLibrary);
$('#library-water').addEventListener('change', renderLibrary);
goStep('welcome', false);
// Old #ich links also start neutrally; only deliberate library links bypass Start.
if (location.hash === '#library') switchView('library');
else if (location.hash) history.replaceState(null, '', location.pathname + location.search);

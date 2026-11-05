import { SYMPTOMS, BEHAVIORS, CONDITIONS, SOURCES, GROWTH_CHOICES } from './data.mjs';
import { assessUrgency, rankConditions, assessDiagnosis, LABELS, buildCase } from './logic.mjs';
import { slotsFor, leadSlot, patternFor } from './visuals.mjs';
import { OPENING_IMAGE, signImagesFor, TEXTURE_IMAGES } from './choice-images.mjs';
import { treatmentGuideFor, openTreatmentPopup } from './treatments.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const form = $('#fish-form');
const comparisons = new Set();
const additionalSigns = new Set();
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
  const visualSigns = [detailSign || primarySign, ...additionalSigns].filter(Boolean);
  return { ...Object.fromEntries(new FormData(form)), growthAppearance: visualSigns.includes('lumps') ? form.elements.growthAppearance.value : '', initialSign: primarySign, textureSign: detailSign, primarySign: detailSign || primarySign, visualSigns, signs: [...visualSigns, ...$$('input[name="behavior"]:checked').map(el => el.value)], visualReference, comparisons: [...comparisons] };
}
function needsTexture() { return form.elements.water.value === 'fresh' && primarySign === 'dots'; }
function needsGrowth() { return readInput().visualSigns.includes('lumps'); }
function sequence() { return ['water', 'signs', ...(needsTexture() ? ['texture'] : []), 'behavior', ...(needsGrowth() ? ['growth'] : []), 'results']; }
function clearGrowthChoice() { $$('input[name="growthAppearance"]').forEach(el => { el.checked = false; }); }

function goStep(name, focus = true) {
  step = name;
  $('#welcome').hidden = name !== 'welcome';
  $('#check').hidden = name === 'welcome';
  $$('.question-panel').forEach(el => { el.hidden = el.dataset.step !== name; });
  // Fetch choice pictures only when their question is reached, not at the front door.
  const activeGrid = name === 'signs' ? '#symptom-grid' : name === 'texture' ? '#texture-grid' : name === 'behavior' && $('#additional-signs').open ? '#additional-grid' : null;
  if (activeGrid) $$(`${activeGrid} img[data-src]`).forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  form.hidden = ['results', 'care-summary'].includes(name);
  form.classList.toggle('care-mode', name === 'care');
  $('#flow-error').textContent = '';
  const progress = { water: [1,'Water type'], signs: [2,'What you see'], texture: [2,'Look closer'], behavior: [3,'Behavior'], growth: [3,'Look closer at the lump'], results: [3,'Results'], care: [3,'Care & treatment'], 'care-summary': [3,'Care steps'] }[name];
  if (progress) {
    $('#flow-label').textContent = name === 'results' ? (assessDiagnosis(readInput()).diagnoses.length ? 'YOUR PROBABLE DIAGNOSIS' : 'YOUR RESULTS · POSSIBLE CAUSES') : name.startsWith('care') ? 'AFTER THE VISUAL CHECK · CARE & TREATMENT' : `STEP ${progress[0]} OF 3 · ${progress[1]}`;
    $('#flow-progress').value = progress[0];
  }
  $('#flow-progress').hidden = name.startsWith('care');
  $('#next-button').textContent = name === 'care' ? 'See care steps →' : name === 'growth' || name === 'behavior' && !needsGrowth() ? 'See my results →' : 'Continue →';
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
  if (step === 'water' && !form.elements.water.value) { $('#flow-error').textContent = 'Choose Freshwater or Saltwater / reef.'; return; }
  if (step === 'signs' && !primarySign) { $('#flow-error').textContent = 'Choose the closest picture. “Nothing obvious” is a useful answer.'; return; }
  if (step === 'texture' && !detailSign) { $('#flow-error').textContent = 'Choose the closest texture, or “Not sure.”'; return; }
  if (step === 'growth' && !form.elements.growthAppearance.value) { $('#flow-error').textContent = 'Choose the closest description, or “I can’t tell.”'; return; }
  if (step === 'care') {
    if (!form.reportValidity()) return;
    renderCareSummary(); return;
  }
  if (step === 'growth' || step === 'behavior' && !needsGrowth()) { renderResults(); return; }
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
  if (name === 'library') {
    if (form.elements.water.value) $('#library-water').value = form.elements.water.value;
    renderLibrary();
  }
  updateCompareTray();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function selectSign(id, isTexture = false) {
  if (!SYMPTOMS.some(item => item.id === id)) return;
  clearGrowthChoice();
  if (isTexture) detailSign = id;
  else { primarySign = id; detailSign = ''; visualReference = null; additionalSigns.clear(); }
  additionalSigns.delete(detailSign || primarySign);
  $$('[data-symptom]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.symptom === primarySign)));
  $$('[data-texture]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.texture === detailSign)));
  $('#flow-error').textContent = '';
  renderAdditionalChoices();
}

function reset() {
  form.reset(); primarySign = ''; detailSign = ''; visualReference = null; currentCase = ''; additionalSigns.clear();
  renderChoiceGrids();
  $('#library-water').value = 'all'; $('#library-grid').replaceChildren();
  comparisons.clear(); $('#results-content').replaceChildren(); $('#case-text').value = '';
  $('#care-context').replaceChildren(); $('#care-summary-content').replaceChildren();
  $('#inline-urgent').hidden = true; $('#tank-extra').open = false;
  $('#additional-signs').open = false;
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
  renderChoiceGrids();
  goStep('water');
}

function imageWater(condition) {
  if (condition.scope !== 'both') return condition.scope;
  const libraryWater = activeView === 'library' ? $('#library-water').value : '';
  return ['fresh','marine'].includes(libraryWater) ? libraryWater : form.elements.water.value;
}

function resultThumbnail(condition, water = imageWater(condition)) {
  const choices = signImagesFor(water);
  return leadSlot(condition.id)?.image || choices[condition.art] || choices.unclear;
}

function treatmentLink(condition, water = imageWater(condition)) {
  const guide = treatmentGuideFor(condition.id, water);
  if (!guide) return '';
  return `<div class="treatment-link"><a class="button primary" href="${escape(guide.url)}" data-treatment="${condition.id}" data-water="${escape(water || '')}" target="_blank" rel="noopener noreferrer">${escape(guide.title)} ↗</a><small>${escape(guide.provider)} · opens separately</small>${guide.note ? `<p class="quiet">${escape(guide.note)}</p>` : guide.type === 'care' ? '<p class="quiet">This is a sign with several possible causes, so this link covers care rather than a single cure.</p>' : ''}</div>`;
}

function possibleCauses(condition) {
  if (condition.diagnosis || !condition.possibleCauses?.length) return '';
  return `<section class="possible-causes"><h3>What could cause this?</h3><p class="quiet">These are possibilities to distinguish, not conditions this guide has diagnosed.</p><ul>${condition.possibleCauses.map(cause => `<li><strong>${escape(cause.title)}</strong><p>${escape(cause.text)}</p>${cause.conditionId ? `<button class="text-button" data-condition="${cause.conditionId}">Read about ${escape(cause.title)} →</button>` : ''}</li>`).join('')}</ul></section>`;
}

function renderResults() {
  if (needsGrowth() && !form.elements.growthAppearance.value) { goStep('growth'); return; }
  const input = readInput(), assessment = assessUrgency(input);
  const diagnosis = assessDiagnosis(input), first = diagnosis.primary;
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h3>Get help for the distress first.</h3><p>${escape(assessment.urgent.join('; '))}. Support aeration, test the water and arrange urgent fish-health help.</p><button class="text-button" data-action="emergency">What to do now →</button></div>` : '';
  let focus = '<section class="notice no-diagnosis"><h2>Not enough to name a likely cause yet.</h2><p>The signs selected are not specific enough for a probable diagnosis. Try a closer picture match, or check the care steps for breathing, water and behavior concerns.</p><button class="button secondary" data-action="edit">Change my answers →</button></section>';
  if (first) {
    const image = resultThumbnail(first, input.water), ready = slotsFor(first.id).filter(s => s.image).length;
    const reason = first.id === 'water'
      ? 'Breathing or swimming changes can come from water or oxygen problems. This is the first cause to check, not proof of an infection.'
      : `Your ${scopeName(input.water)?.toLowerCase() || 'aquarium'} choice and “${first.matched.join('” + “')}” fit this pattern. ${first.check}`;
    focus = `<article class="result-focus" data-result="${first.id}" data-result-kind="${first.diagnosis ? 'diagnosis' : 'unresolved'}"><div class="result-image"><button data-condition="${first.id}" aria-label="Explore ${escape(first.title)}"><img src="${image.url}" width="${image.width || 1024}" height="${image.height || 1536}" alt="${escape(image.alt)}"><span>${ready ? `Explore ${ready} reference pictures` : 'Explore this pattern'} ↗</span></button><p class="quiet">AI reference illustration of a sign, not a confirmed case.</p></div><div class="result-copy"><p class="eyebrow">${first.diagnosis ? 'MOST LIKELY MATCH TO YOUR SIGNS' : 'OBSERVED SIGN · CAUSE STILL UNCLEAR'}</p><h2>${first.diagnosis ? escape(first.title) : 'Cause not identified yet.'}</h2>${first.diagnosis ? '' : `<p><strong>What you reported:</strong> ${escape(first.matched.join('; '))}.</p>`}<p>${escape(first.summary)}</p>${possibleCauses(first)}<div class="diagnosis-reason"><strong>${first.diagnosis ? 'Why it fits' : 'What would help narrow it down'}</strong><p>${escape(reason)}</p></div><p class="quiet">${first.diagnosis ? 'A probable match, not a confirmed diagnosis. Similar signs can have other causes.' : 'The observation is real, but these answers do not establish which cause is responsible.'}</p>${treatmentLink(first, input.water)}<button class="text-button" data-condition="${first.id}">${ready ? 'Check the reference pictures' : 'Read the visual clues'} →</button></div></article>`;
  }
  const additional = diagnosis.findings.slice(1).map(c => {
    const image = resultThumbnail(c, input.water);
    return `<article class="additional-finding" data-result="${c.id}" data-result-kind="${c.diagnosis ? 'diagnosis' : 'unresolved'}"><img src="${image.url}" width="${image.width || 362}" height="${image.height || 362}" alt="${escape(c.image?.alt || image.alt)}"><div><p class="eyebrow">${c.diagnosis ? 'ALSO FITS YOUR SIGNS' : 'ADDITIONAL SIGN · CAUSE STILL UNCLEAR'}</p><h2>${c.diagnosis ? escape(c.title) : 'Another cause to narrow down'}</h2><p><strong>${c.diagnosis ? 'What fits' : 'What you reported'}:</strong> ${escape(c.matched.join('; '))}.</p><p>${escape(c.check)}</p>${possibleCauses(c)}${treatmentLink(c, input.water)}<button class="text-button" data-condition="${c.id}">Read the clues →</button></div></article>`;
  }).join('');
  const context = diagnosis.contextConcerns.map(c => `<section class="notice water-notice" data-context-concern="${c.id}"><h2>Also check: ${escape(c.title)}</h2><p>${escape(c.reason)}</p><p>This can happen alongside the visible problem, not instead of it.</p>${treatmentLink(c, input.water)}</section>`).join('');
  const unresolved = diagnosis.unexplained.length ? `<p class="notice unresolved-signs"><strong>Still unexplained:</strong> ${escape(diagnosis.unexplained.map(id => LABELS[id]).join('; '))}. This guide cannot choose a cause for every appearance. Do not force those signs into the first disease name.</p>` : '';
  const messages = diagnosis.messages.length ? `<div class="notice diagnosis-context"><h2>${diagnosis.status === 'multiple' ? 'More than one problem may fit.' : 'Putting the answers together'}</h2>${diagnosis.messages.map(message => `<p>${escape(message)}</p>`).join('')}</div>` : '';
  const other = diagnosis.alternatives.map(c => {
    const image = resultThumbnail(c, input.water);
    return `<button class="alternative" data-condition="${c.id}"><img src="${image.url}" alt="${escape(image.alt)}" loading="lazy"><span><strong>${escape(c.title)}</strong><small>${escape(c.comparisonReason)}</small></span><b aria-hidden="true">↗</b></button>`;
  }).join('');
  $('#results-content').innerHTML = `<h1 id="results-title" class="question-title">${escape(diagnosis.title)}</h1><p class="question-hint">Based on the signs you selected for a ${scopeName(input.water)?.toLowerCase() || 'fish'} aquarium.</p>${urgent}${messages}${focus}${additional}${unresolved}${context}${other ? `<h3 class="subheading">Similar-looking alternatives</h3><p class="quiet">Compare these with the signs above. They are not additional diagnoses.</p><div class="alternatives">${other}</div>` : ''}<section class="care-next"><p class="eyebrow">NEXT · SUPPORT YOUR FISH</p><h3>Check the tank before treating.</h3><p>Optional water readings and care steps can help you choose what to do next.${first ? ' The reading links above open without filling these in.' : ''}</p><button class="button secondary" data-action="care">Water checks & care steps →</button></section><button class="text-button" data-action="case">Save my observation notes ↗</button>`;
  goStep('results');
}

function openCare() {
  const input = readInput(), diagnosis = assessDiagnosis(input);
  $('#care-context').innerHTML = diagnosis.findings.length
    ? `${diagnosis.diagnoses.length ? `<p><strong>Probable ${diagnosis.diagnoses.length > 1 ? 'diagnoses' : 'diagnosis'}:</strong> ${escape(diagnosis.diagnoses.map(c => c.title).join('; '))}. Not confirmed.</p>` : ''}${diagnosis.unresolvedFindings.length ? `<p><strong>Signs with causes still unclear:</strong> ${escape(diagnosis.unresolvedFindings.map(c => c.matched.join('; ')).join('; '))}. These are observations, not disease names.</p>` : ''}<p>Use the appropriate guide; multiple possibilities are not a reason to combine treatments.</p>${diagnosis.findings.map(c => treatmentLink(c, input.water)).join('')}<button type="button" class="text-button" data-action="results">Back to my results ←</button>`
    : '<p>No clear visual match yet. Start with the environment and the fish’s actual behavior.</p>';
  goStep('care');
}

function renderCareSummary() {
  const input = readInput(), assessment = assessUrgency(input), diagnosis = assessDiagnosis(input);
  const scoped = diagnosis.findings.filter(c => c.scope === 'both' || c.scope === input.water);
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h2>Get urgent help first.</h2><p>${escape(assessment.urgent.join('; '))}. Support aeration and contact a fish-health professional now.</p><button class="text-button" data-action="emergency">Immediate support steps →</button></div>` : '';
  const water = assessment.checks.length ? `<div class="notice water-notice"><h3>Address the shared environment.</h3>${list(assessment.checks)}</div>` : '';
  const unknown = assessment.waterUnknown ? '<p class="water-reminder">Ammonia or nitrite is unmeasured. Unknown does not mean safe—test before choosing a medicine.</p>' : '<p class="quiet">Your readings are recorded. Ammonia and nitrite alone do not assess oxygen or rule out other water problems.</p>';
  const condition = scoped.length ? `${diagnosis.findings.length > 1 ? '<p class="notice">More than one possibility needs attention. They may share a cause; the links are not instructions to mix medicines.</p>' : ''}${scoped.map(c => `<section class="care-section" data-care-condition="${c.id}"><p class="eyebrow">CARE FOR THE POSSIBLE PROBLEM</p><h2>${escape(c.title)}</h2><p>${escape(c.check)}</p>${list(c.next)}${treatmentLink(c, input.water) || '<p>A stable normal marking does not need medication. Watch for genuine changes or other signs of illness.</p>'}<p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(c.avoid)}</p></section>`).join('')}` : '<section class="care-section"><h2>No clear cause yet.</h2><p>Record the behavior, how quickly it changed and which fish are affected. Revisit the picture choices or get fish-health advice if the fish remains unwell.</p><p>Do not select a medicine just because a fish looks pale or is rubbing.</p></section>';
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
  $('#compare-content').innerHTML = `<div class="side-by-side">${selected.map(c => `<article><span class="scope-pill">${scopeName(c.scope)}</span><h3>${escape(c.title)}</h3>${gallery(c)}<div class="comparison-clues"><h4>Look for</h4>${list(c.clues)}<h4>What could fool you?</h4><p>${escape(c.distinguish)}</p><h4>Compare with your fish</h4><p>${escape(c.check)}</p>${treatmentLink(c)}<button class="button secondary" data-use-pattern="${c.id}">Check this visible pattern →</button></div></article>`).join('')}</div>`;
  $('#compare-dialog').showModal();
}

function emergencyContent() {
  return '<p class="eyebrow">ACT ON DISTRESS, NOT JUST A DISEASE NAME</p><h2 id="detail-title">Breathing and balance come first.</h2><p class="lead">Severe gasping, inability to stay upright, poor responsiveness or fish deaths warrant urgent aquatic-veterinary help.</p><ol class="care-list"><li><strong>Support oxygen.</strong> Check aeration, surface movement and filter operation. Avoid unnecessary handling.</li><li><strong>Test the water now.</strong> Record ammonia, nitrite, pH and temperature; check salinity for marine tanks. Clear water can still be unsafe.</li><li><strong>Address an environmental problem.</strong> If readings or a recent contamination indicate a problem, use appropriately conditioned, temperature- and salinity-matched partial water changes. Avoid abrupt pH or salinity changes.</li><li><strong>Contact a fish-health professional.</strong> Tell them how many fish are affected and how fast this developed. Don’t wait for visible spots.</li></ol><p class="notice">Don’t blindly mix medicines, raise heat, add salt, or move a marine fish into freshwater. Reef invertebrates and different fish species have different tolerances.</p><a class="button secondary" href="https://fishvets.org/" target="_blank" rel="noopener noreferrer">American Association of Fish Veterinarians ↗</a>';
}

function openDetail(id, slotId = 'overview') {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  $('#detail-content').innerHTML = `<p class="eyebrow">${escape(condition.kind)} · ${scopeName(condition.scope)}</p><h2 id="detail-title">${escape(condition.title)}</h2><p class="lead">${escape(condition.summary)}</p>${slotsFor(id).some(s => s.image) || activeView === 'library' ? gallery(condition, slotId) : '<p class="quiet">Reference images for this entry are still being added.</p>'}<div class="detail-visual-actions"><button class="button secondary" data-use-pattern="${condition.id}">Check this visible pattern →</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div><h3>Clues that can fit</h3>${list(condition.clues)}<h3>What else could look similar?</h3><p>${escape(condition.distinguish)}</p><h3>Compare with your fish</h3><p>${escape(condition.check)}</p>${treatmentLink(condition)}<p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(condition.avoid)}</p><div class="sources"><h4>Read the references</h4>${sourceLinks(condition.source)}</div><p class="quiet">A subtle appearance does not mean a mild illness. These pictures show possible appearances, not a timeline or severity score.</p>`;
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
  $('.slot-explanation').textContent = water === 'marine'
    ? 'Marine disease galleries are still being filled. Empty frames are places for future pictures, not disease examples.'
    : 'Three freshwater image collections are ready: ich, velvet and cottony growth. Empty frames are places for future pictures, not disease examples.';
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
  try { await navigator.clipboard.writeText(currentCase); $('#copy-status').textContent = 'Copied. Keep these observations to track changes or share when asking for help.'; }
  catch { $('#case-text').select(); $('#copy-status').textContent = 'Automatic copying was unavailable. The notes are selected; use your device’s Copy command.'; }
}


$('#welcome-fish').innerHTML = `<img src="${OPENING_IMAGE.url}" width="${OPENING_IMAGE.width}" height="${OPENING_IMAGE.height}" alt="${escape(OPENING_IMAGE.alt)}" fetchpriority="high" decoding="async">`;
function signButton(symptom, attribute, title = symptom.title) {
  const isTexture = attribute === 'data-texture';
  const isAdditional = attribute === 'data-additional-symptom';
  const image = (isTexture ? TEXTURE_IMAGES : signImagesFor(form.elements.water.value))[symptom.id];
  const hint = isTexture && symptom.id === 'unclear' ? 'I can’t make out the texture' : symptom.text;
  const selected = isAdditional ? additionalSigns.has(symptom.id) : symptom.id === (isTexture ? detailSign : primarySign);
  return `<button type="button" class="symptom-card" ${attribute}="${symptom.id}" aria-pressed="${String(selected)}"><span class="symptom-art"><img data-choice-image="${isTexture ? 'texture' : isAdditional ? 'additional' : 'sign'}-${symptom.id}" data-src="${image.url}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" decoding="async"><span class="selection-check" aria-hidden="true">✓</span></span><strong>${escape(title)}</strong><small>${escape(hint)}</small></button>`;
}
function renderChoiceGrids() {
  $('#symptom-grid').innerHTML = SYMPTOMS.map(s => signButton(s, 'data-symptom')).join('');
  // Texture references are freshwater-only and never remain in the marine DOM.
  $('#texture-grid').innerHTML = form.elements.water.value === 'marine' ? '' : ['dots','dust','fuzz','patch','lumps','unclear'].map(id => {
    const s = SYMPTOMS.find(s => s.id === id);
    return signButton(s, 'data-texture', id === 'unclear' ? 'Not sure' : s.title);
  }).join('');
  renderAdditionalChoices();
}
function renderAdditionalChoices() {
  const main = detailSign || primarySign;
  $('#additional-grid').innerHTML = SYMPTOMS.filter(s => s.id !== 'unclear' && s.id !== main).map(s => signButton(s, 'data-additional-symptom')).join('');
  $('#additional-status').textContent = additionalSigns.size ? `Also selected: ${[...additionalSigns].map(id => LABELS[id]).join('; ')}. Select a picture again to remove it.` : 'Only add signs you can actually see. Leave this closed if the main sign is enough.';
  if ($('#additional-signs').open && step === 'behavior') $$('#additional-grid img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
}
renderChoiceGrids();
$('#behavior-grid').innerHTML = BEHAVIORS.map(b => `<label class="check-label"><input type="checkbox" name="behavior" value="${b.id}"><span>${escape(b.label)}</span></label>`).join('');
$('#growth-grid').innerHTML = GROWTH_CHOICES.map(choice => `<label><input type="radio" name="growthAppearance" value="${choice.id}"><span><strong>${escape(choice.title)}</strong><small>${escape(choice.text)}</small></span></label>`).join('');
$('#source-list').innerHTML = sourceLinks(SOURCES.map(s => s.id));
$('#library-patterns').innerHTML = SYMPTOMS.map(s => `<button class="pattern-filter" data-library-pattern="${s.id}" aria-pressed="false"><span>${fishArt(s.art)}</span><strong>${escape(s.title)}</strong></button>`).join('');

document.addEventListener('click', async event => {
  const treatment = event.target.closest('a[data-treatment]');
  if (treatment) openTreatmentPopup(event, treatment);
  const view = event.target.closest('[data-view]');
  if (view) switchView(view.dataset.view);
  const symptom = event.target.closest('[data-symptom]');
  if (symptom) selectSign(symptom.dataset.symptom);
  const texture = event.target.closest('[data-texture]');
  if (texture) selectSign(texture.dataset.texture, true);
  const additional = event.target.closest('[data-additional-symptom]');
  if (additional) {
    const id = additional.dataset.additionalSymptom;
    if (id === 'lumps') clearGrowthChoice();
    if (additionalSigns.has(id)) additionalSigns.delete(id); else additionalSigns.add(id);
    additional.setAttribute('aria-pressed', String(additionalSigns.has(id)));
    $('#additional-status').textContent = additionalSigns.size ? `Also selected: ${[...additionalSigns].map(id => LABELS[id]).join('; ')}. Select a picture again to remove it.` : 'No additional signs selected.';
    $('#next-button').textContent = needsGrowth() ? 'Continue →' : 'See my results →';
  }
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
    clearGrowthChoice();
    detailSign = ''; visualReference = null; additionalSigns.clear();
    if (form.elements.water.value === 'fresh') form.elements.salinity.value = '';
    renderChoiceGrids();
    comparisons.clear(); updateCompareTray();
    $('#results-content').replaceChildren(); $('#care-context').replaceChildren(); $('#care-summary-content').replaceChildren();
    $('#detail-content').replaceChildren(); $('#compare-content').replaceChildren();
    $('#atlas-full').removeAttribute('src'); $('#texture-reference').replaceChildren();
    $('#library-water').value = form.elements.water.value;
    $('#library-grid').replaceChildren();
  }
  const { urgent } = assessUrgency(readInput());
  $('#inline-urgent').hidden = !urgent.length;
  $('#inline-urgent').textContent = urgent.length ? `These signs need prompt help: ${urgent.join('; ')}. Support aeration, test the water and seek fish-health help now.` : '';
});
$('#library-search').addEventListener('input', renderLibrary);
$('#library-water').addEventListener('change', renderLibrary);
$('#additional-signs').addEventListener('toggle', () => {
  if ($('#additional-signs').open && step === 'behavior') $$('#additional-grid img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
});
goStep('welcome', false);
// Old #ich links also start neutrally; only deliberate library links bypass Start.
if (location.hash === '#library') switchView('library');
else if (location.hash) history.replaceState(null, '', location.pathname + location.search);

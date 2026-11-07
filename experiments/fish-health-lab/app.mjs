import { SYMPTOMS, BEHAVIORS, CONDITIONS, SOURCES, GROWTH_CHOICES, FISH_TYPES, URGENCY, closerQuestionFor, fishTypeFor } from './data.mjs';
import { assessUrgency, rankConditions, assessDiagnosis, LABELS, buildCase, lookalikesFor, ALTERNATIVE_TEXT } from './logic.mjs';
import { slotsFor, leadSlot, patternFor } from './visuals.mjs';
import { OPENING_IMAGE, signImagesFor, TEXTURE_IMAGES } from './choice-images.mjs';
import { treatmentGuideFor, openTreatmentPopup, carePlanFor } from './treatments.mjs';
import { imagesFor, imageFor, fishSetFor, FISH_TYPE_IMAGES, stepImageFor, splitStep } from './fish-images.mjs';
import { createReef } from './reef-app.mjs';
import { createExtras } from './extras-app.mjs';
import { scienceLine } from './science.mjs';
import { createReader } from './reader.mjs';
import { shopLinkFor, shopLinkHtml } from './shop-links.mjs';
import { LIB_INFO, ZONES, fishMap, closeupsFor, fishStripFor, leadImageFor, libraryPictureCount } from './library-visuals.mjs';
import { UI_IMAGES, IMAGE_SOURCE as UI_IMAGE_SOURCE } from './ui-images-data.mjs';
import { MEDIA_BASE } from './fish-images-data.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const form = $('#fish-form');
const comparisons = new Set();
const additionalSigns = new Set();
// Phones: tapping a picture choice moves straight on. Mouse users keep Continue.
const touchOnly = matchMedia('(hover: none) and (pointer: coarse)');
let step = 'welcome', activeView = 'guide', primarySign = '', detailSign = '';
let currentCase = '', illustrationId = 0, libraryPattern = '', visualReference = null;
// "This looks more like mine" taps on the results page, in order.
let chosenPath = [];
// Coral/anemone and shrimp/crab/snail questions (reef-app.mjs) share this step machine.
const reef = createReef({ $, $$, escape, goStep, badge, autoAdvance, switchView });
// The medicine check and the prevention page (extras-app.mjs).
const extras = createExtras({ $, escape });
const HASH_VIEWS = ['library', 'medicine', 'prevent'];
// Merck "Read more" pages open in an in-page pop-up (reader.mjs).
const reader = createReader({ $ });
// The reef page background (theme.css reads --reef-bg).
{ const bg = UI_IMAGES['bg-reef']; document.documentElement.style.setProperty('--reef-bg', `url("${UI_IMAGE_SOURCE === 'media' ? MEDIA_BASE + bg.key : `local-images/${bg.key.slice('experiments/fish-health-lab/'.length)}`}")`); }

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

// Fish-type chips use AI pictures of healthy fish (see fish-images.mjs).
const fishPicture = id => {
  const image = FISH_TYPE_IMAGES[id || 'other'];
  return image ? `<img class="fish-photo" data-src="${image.url}" width="${image.width}" height="${image.height}" alt="" loading="lazy" decoding="async">` : '';
};
// The chosen fish type (guided check only; the library stays generic).
const currentFish = () => activeView === 'guide' ? form.elements.fishType?.value || '' : '';
const setAttr = (fishType, water, key) => imagesFor(fishType, key, water).fishSpecific ? fishType : 'generic';

function readInput() {
  // A "Not sure" texture keeps the original white-dots observation.
  const mainSign = detailSign && detailSign !== 'unclear' ? detailSign : primarySign;
  const visualSigns = [mainSign, ...additionalSigns].filter(Boolean);
  return { ...Object.fromEntries(new FormData(form)), fishType: form.elements.fishType?.value || '', closer: needsCloser() ? form.elements.closer?.value || '' : '', growthAppearance: visualSigns.includes('lumps') ? form.elements.growthAppearance.value : '', initialSign: primarySign, textureSign: detailSign, primarySign: mainSign, visualSigns, signs: [...visualSigns, ...$$('input[name="behavior"]:checked').map(el => el.value)], visualReference, comparisons: [...comparisons], chosen: [...chosenPath] };
}
function needsTexture() { return form.elements.water.value === 'fresh' && primarySign === 'dots'; }
function needsCloser() { return !needsTexture() && Boolean(closerQuestionFor(primarySign, form.elements.water.value)); }
function needsGrowth() { return readInput().visualSigns.includes('lumps'); }
function sequence() { return ['water', 'fish', 'signs', ...(needsTexture() ? ['texture'] : []), ...(needsCloser() ? ['closer'] : []), 'behavior', ...(needsGrowth() ? ['growth'] : []), 'results']; }
function clearGrowthChoice() { $$('input[name="growthAppearance"]').forEach(el => { el.checked = false; }); }
function clearCloserChoice() { $$('input[name="closer"]').forEach(el => { el.checked = false; }); }

function goStep(name, focus = true) {
  step = name;
  // Going back to the questions drops any "looks more like mine" choice.
  if (!['results', 'care', 'care-summary'].includes(name)) chosenPath = [];
  $('#welcome').hidden = name !== 'welcome';
  $('#check').hidden = name === 'welcome';
  $$('.question-panel').forEach(el => { el.hidden = el.dataset.step !== name; });
  // Fetch choice pictures only when their question is reached, not at the front door.
  if (name === 'fish') renderFishChoices();
  const activeGrid = name === 'signs' ? '#symptom-grid' : name === 'texture' ? '#texture-grid' : name === 'fish' ? '#fish-grid' : name === 'behavior' && $('#additional-signs').open ? '#additional-grid' : null;
  if (activeGrid) $$(`${activeGrid} img[data-src]`).forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  if (name === 'signs') updateSignsHint();
  if (name === 'closer') renderCloserChoices();
  if (reef.owns(name)) reef.onStep(name);
  form.hidden = ['results', 'care-summary', 'reef-results'].includes(name);
  form.classList.toggle('care-mode', name === 'care');
  $('#flow-error').textContent = '';
  const progress = reef.progressFor(name) || { water: [1,'Water type'], fish: [2,'Your fish'], signs: [3,'What you see'], texture: [3,'Look closer'], closer: [3,'Look closer'], behavior: [4,'Behavior'], growth: [4,'Look closer at the lump'] }[name];
  const steps = reef.owns(name) ? 3 : 4;
  $('#flow-progress').max = steps;
  $('#flow-label').textContent = name === 'results' || name === 'reef-results' ? 'YOUR RESULT' : name.startsWith('care') ? 'CARE & TREATMENT' : progress ? `STEP ${progress[0]} OF ${steps} · ${progress[1]}` : '';
  if (progress) $('#flow-progress').value = progress[0];
  if (name === 'results' || name === 'reef-results') $('#flow-progress').value = steps;
  $('#flow-progress').hidden = name.startsWith('care');
  updateNextLabel();
  $('#salinity-field').hidden = form.elements.water.value === 'fresh';
  if (name === 'texture') {
    const image = slotsFor('ich-fresh').find(s => s.id === 'lookalikes').image;
    $('#texture-reference').innerHTML = `<button class="reference-peek" type="button" data-enlarge-entry="ich-fresh" data-enlarge-slot="lookalikes"><img src="${image.url}" alt="Illustrated comparison of grains, dust, cottony growth, patches and larger growths."><span><strong>Need a closer look?</strong>Open the texture reference ↗</span></button><button type="button" class="text-button" data-enlarge-entry="ich-fresh" data-enlarge-slot="closeup">See individual white grains up close ↗</button>`;
  } else $('#texture-reference').replaceChildren();
  updateCompareTray();
  if (focus) {
    const heading = name === 'welcome' ? $('#welcome-title') : $(`[data-step="${name}"] h1`);
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function updateNextLabel() {
  if (reef.owns(step)) { $('#next-button').textContent = reef.nextLabel(step); return; }
  $('#next-button').textContent = step === 'care' ? 'See care steps →'
    : step === 'fish' && !form.elements.fishType.value ? 'Skip →'
    : step === 'growth' || step === 'behavior' && !needsGrowth() ? 'See my results →' : 'Continue →';
}

function nextStep() {
  if (reef.owns(step)) { reef.next(step); return; }
  if (step === 'water' && !form.elements.water.value) { $('#flow-error').textContent = 'Choose Freshwater or Saltwater / reef.'; return; }
  if (step === 'signs' && !primarySign) { $('#flow-error').textContent = 'Choose the closest picture. “Nothing obvious” is a useful answer.'; return; }
  if (step === 'texture' && !detailSign) { $('#flow-error').textContent = 'Choose the closest texture, or “Not sure.”'; return; }
  if (step === 'closer' && !form.elements.closer.value) { $('#flow-error').textContent = 'Choose the closest description, or “Not sure.”'; return; }
  if (step === 'growth' && !form.elements.growthAppearance.value) { $('#flow-error').textContent = 'Choose the closest description, or “I can’t tell.”'; return; }
  if (step === 'care') {
    if (!form.reportValidity()) return;
    renderCareSummary(); return;
  }
  if (step === 'growth' || step === 'behavior' && !needsGrowth()) { renderResults(); return; }
  const route = sequence(), next = route[route.indexOf(step) + 1];
  if (next) goStep(next);
}

// On touch screens a picture/chip tap advances after the tick is visible.
function autoAdvance() {
  if (!touchOnly.matches) return;
  const from = step;
  setTimeout(() => { if (step === from) nextStep(); }, 280);
}

function switchView(name) {
  activeView = name;
  for (const id of ['guide','library','about','medicine','prevent']) $(`#${id}-view`).hidden = id !== name;
  toggleMenu(false);
  $$('.nav-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.view === name);
    if (button.dataset.view === name) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
  });
  history.replaceState(null, '', location.pathname + location.search + (HASH_VIEWS.includes(name) ? `#${name}` : ''));
  // The medicine check starts on the water type of the check in progress.
  if (name === 'medicine') extras.renderMedicine(form.elements.water.value || ({ pond: 'pond', coral: 'marine', invert: 'marine' })[reef.group()] || '');
  if (name === 'prevent') extras.renderPrevent();
  if (name === 'library') {
    if (form.elements.water.value) $('#library-water').value = form.elements.water.value;
    else if (reef.active()) $('#library-water').value = reef.group() === 'pond' ? 'pond' : 'reef';
    renderLibrary();
  }
  updateCompareTray();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function selectSign(id, isTexture = false) {
  if (!SYMPTOMS.some(item => item.id === id)) return;
  clearGrowthChoice();
  if (isTexture) detailSign = id;
  else { if (id !== primarySign) clearCloserChoice(); primarySign = id; detailSign = ''; visualReference = null; additionalSigns.clear(); }
  additionalSigns.delete(detailSign || primarySign);
  $$('[data-symptom]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.symptom === primarySign)));
  $$('[data-texture]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.texture === detailSign)));
  $('#flow-error').textContent = '';
  renderAdditionalChoices();
}

function reset() {
  reef.reset();
  form.reset(); primarySign = ''; detailSign = ''; visualReference = null; currentCase = ''; additionalSigns.clear();
  renderChoiceGrids(); renderFishChoices(); $('#closer-grid').replaceChildren();
  $('#library-water').value = 'all'; $('#library-grid').replaceChildren();
  comparisons.clear(); $('#results-content').replaceChildren(); $('#case-text').value = '';
  $('#care-context').replaceChildren(); $('#care-summary-content').replaceChildren();
  $('#inline-urgent').hidden = true; $('#tank-extra').open = false;
  $('#additional-signs').open = false;
  $('#detail-content').replaceChildren(); $('#compare-content').replaceChildren(); $('#quick-compare-content').replaceChildren();
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
  return imageFor(currentFish(), condition.id, water);
}

function readMore(condition, water = imageWater(condition)) {
  const guide = treatmentGuideFor(condition.id, water);
  if (!guide) return '';
  return `<p class="treatment-link"><a class="read-more" href="${escape(guide.url)}" data-treatment="${condition.id}" data-water="${escape(water || '')}" data-reader-source="${escape(guide.provider || '')}" target="_blank" rel="noopener noreferrer">Read more: ${escape(guide.title)} ↗</a><small>${escape(guide.provider)}</small></p>`;
}

function badge(level) {
  return level && URGENCY[level] ? `<span class="urgency-badge urgency-${level}" data-urgency="${level}"><i aria-hidden="true"></i>${escape(URGENCY[level].label)}</span>` : '';
}

function stepItem(step) {
  const { id, image } = stepImageFor(step), { lead, more } = splitStep(step);
  const pic = image ? `<img class="step-pic" data-step-image="${id}" src="${image.url}" width="${image.width}" height="${image.height}" alt="" decoding="async">`
    : `<span class="step-pic step-pic-urgent" data-step-image="${id}" aria-hidden="true">!</span>`;
  return `<li>${pic}<span><strong>${escape(lead)}</strong>${more ? `<small>${escape(more)}</small>` : ''}${shopLinkHtml(shopLinkFor(step, id, form.elements.water.value), escape)}</span></li>`;
}

function todoCard(condition, water, tip = '', fish = null) {
  const plan = condition.plan || carePlanFor(condition.id, water);
  if (!plan) return '';
  return `<section class="todo-card" data-todo="${condition.id}"><h3>What to do now</h3>${plan.reefUnsafe ? '<p class="reef-flag" role="note"><strong>Not reef-safe</strong> — treat in a separate tank.</p>' : ''}<ol class="todo-steps">${plan.steps.map(stepItem).join('')}</ol>${tip && fish ? `<p class="fish-tip"><strong>${escape(fish.title)} tip:</strong> ${escape(tip)}</p>` : ''}<dl class="todo-facts"><div><dt>Usual treatment</dt><dd>${escape(plan.treatment)}</dd></div><div><dt>Typical recovery</dt><dd>${escape(plan.recovery)}</dd></div></dl>${plan.medicated ? '<p class="label-note">Amounts: follow the product label.</p>' : ''}${readMore(condition, water)}</section>`;
}

function findingCard(c, input, lead) {
  // The result picture shows the answer that led here (its matched signs, then behaviors).
  const behaviors = (input.signs || []).filter(id => BEHAVIORS.some(b => b.id === id));
  // A look-alike the person picked ("looks more like mine") shows its own picture.
  const image = (c.chosen ? null : imageFor(currentFish(), c.id, input.water, [...(c.fits || []), ...behaviors])) || resultThumbnail(c, input.water), own = imagesFor(input.fishType, c.id, input.water);
  const ready = (own.fishSpecific ? own.images.length : 0) + slotsFor(c.id).filter(s => s.image).length;
  const fish = fishTypeFor(input.water, input.fishType);
  return `<article class="${lead ? 'result-focus' : 'additional-finding'}" data-result="${c.id}" data-urgency="${c.urgencyLevel}">${lead ? '' : `<p class="eyebrow">ALSO LIKELY</p><h2>${escape(c.title)}</h2>`}<div class="result-head">${badge(c.urgencyLevel)}<p class="result-summary">${escape(c.summary)}</p></div><button type="button" class="result-image" data-condition="${c.id}" aria-label="More about ${escape(c.title)}"><img src="${image.url}" width="${image.width || 362}" height="${image.height || 362}" alt="${escape(image.alt)}" data-image-set="${setAttr(input.fishType, input.water, c.id)}"><span>${ready ? `${ready} picture${ready === 1 ? '' : 's'}` : 'More info'} ↗</span></button><div class="diagnosis-reason"><strong>Why we think so</strong><p>${escape(c.reason)}</p></div>${todoCard(c, input.water, c.tip, fish)}</article>`;
}

const WATER_NUDGE = '<p class="water-nudge"><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1C5 6 2 9.5 2 13a6 6 0 0 0 12 0C14 9.5 11 6 8 1Z" fill="#3c8fb5"/></svg>Tested ammonia &amp; nitrite lately? Bad water causes a lot of these.</p>';

function renderResults() {
  if (needsGrowth() && !form.elements.growthAppearance.value) { goStep('growth'); return; }
  const input = readInput(), assessment = assessUrgency(input);
  const diagnosis = assessDiagnosis(input), first = diagnosis.primary;
  const fish = fishTypeFor(input.water, input.fishType);
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h3>Deal with the distress first.</h3><p>${escape(assessment.urgent.join('; '))}. ${escape(assessment.action)}</p><button class="text-button" data-action="emergency">Emergency steps →</button></div>` : '';
  const focus = first ? findingCard(first, input, true) : '<section class="notice no-diagnosis"><h2>Not enough to go on yet.</h2><p>Try picking the closest picture again, and test the water—bad water causes a lot of problems.</p><button class="button secondary" data-action="edit">Change my answers →</button></section>';
  const additional = diagnosis.findings.slice(1).map(c => findingCard(c, input, false)).join('');
  const context = diagnosis.contextConcerns.map(c => `<section class="notice water-notice" data-context-concern="${c.id}"><h2>Also fix: the water</h2><p>${escape(c.reason)}</p>${readMore(c, input.water)}</section>`).join('');
  const unresolved = diagnosis.unexplained.length ? `<p class="notice unresolved-signs"><strong>Not covered above:</strong> ${escape(diagnosis.unexplained.map(id => LABELS[id] || id).join('; '))}. Keep an eye on it.</p>` : '';
  const messages = diagnosis.messages.length ? `<div class="notice diagnosis-context"><h2>${diagnosis.status === 'multiple' ? 'More than one problem may fit.' : 'Putting your answers together'}</h2>${diagnosis.messages.map(message => `<p>${escape(message)}</p>`).join('')}</div>` : '';
  const other = diagnosis.alternatives.map(c => alternativeCard(c, input)).join('');
  const natural = diagnosis.naturalNote ? `<p class="natural-note">${escape(diagnosis.naturalNote)}</p>` : '';
  const couldAlso = other || natural ? `<section class="could-also"><h2 class="subheading">Could also be</h2>${other ? `<p class="could-also-hint">Tap the one that looks more like your fish.</p><div class="alternatives">${other}</div>` : ''}${natural}</section>` : '';
  const where = [ {fresh:'Freshwater',marine:'Saltwater'}[input.water], fish?.title ].filter(Boolean).join(' · ');
  $('#results-content').innerHTML = `<h1 id="results-title" class="question-title results-title">${first ? `<span>Most likely:</span> ${escape(first.title)}` : escape(diagnosis.title)}</h1>${first ? scienceLine(first.id) : ''}<p class="question-hint result-hint">${where ? `${escape(where)} · ` : ''}${diagnosis.chosen ? 'Your pick from the look-alikes' : 'Our best guess from your answers'}—a hobby guide, not a vet.</p>${urgent}${messages}${focus}${WATER_NUDGE}${additional}${unresolved}${context}${couldAlso}<section class="care-next"><h3>Got water test results?</h3><p>Add your readings and tank details for a tailored checklist.</p><button class="button secondary" data-action="care">Add readings & tank details →</button></section><div class="result-save"><button class="text-button" data-action="case">Save my notes ↗</button><button class="text-button" data-action="print-sheet">Print a sheet for the store ↗</button></div>`;
  goStep('results');
}

// A look-alike card: tap = "This looks more like mine"; Compare opens the
// side-by-side. At most two small lines: the check, then danger/treatment.
function alternativeCard(c, input) {
  const image = resultThumbnail(c, input.water);
  const notes = [c.moreUrgent ? `<b class="alt-danger">${escape(ALTERNATIVE_TEXT.danger)}</b>` : '', c.treatmentNote === 'different' ? `<span class="alt-treatment">${escape(ALTERNATIVE_TEXT.different)}</span>` : ''].filter(Boolean);
  return `<div class="alternative" data-alternative="${c.id}" data-more-urgent="${c.moreUrgent}" data-treatment-note="${c.treatmentNote}"><button type="button" class="alt-pick" data-choose="${c.id}" aria-label="This looks more like mine: ${escape(c.title)}"><img src="${image.url}" alt="" loading="lazy" data-image-set="${setAttr(input.fishType, input.water, c.id)}"><span class="alt-text"><strong>${escape(c.title)}</strong>${c.whyAlso ? `<small class="alt-why"><b>Why it could be this:</b> ${escape(c.whyAlso)}</small>` : ''}<small class="alt-check"><b>How to tell:</b> ${escape(c.comparisonReason)}</small>${notes.length ? `<small class="alt-note">${notes.join('')}</small>` : ''}</span></button><button type="button" class="alt-compare" data-quick-compare="${c.id}">Compare</button></div>`;
}

// Side by side: your result and one look-alike, plus the one thing to check.
function openQuickCompare(id) {
  const input = readInput(), diagnosis = assessDiagnosis(input), first = diagnosis.primary;
  const other = diagnosis.alternatives.find(c => c.id === id);
  if (!first || !other) return;
  const pic = c => { const image = resultThumbnail(c, input.water); return `<figure data-compare-side="${c.id}"><img src="${image.url}" width="${image.width || 362}" height="${image.height || 362}" alt="${escape(image.alt || '')}" data-image-set="${setAttr(input.fishType, input.water, c.id)}"><figcaption>${escape(c.title)}</figcaption></figure>`; };
  $('#quick-compare-content').innerHTML = `<div class="quick-compare">${pic(first)}${pic(other)}</div><p class="quick-compare-check">${escape(other.comparisonReason)}</p><div class="quick-compare-actions"><button type="button" class="button primary" data-choose="${other.id}">Mine looks more like ${escape(shortName(other.title))}</button><button type="button" class="button secondary" data-action="close-dialog">Close</button></div>`;
  $('#quick-compare-dialog').showModal();
}
const shortName = title => title.replace(/\s*\(.*\)$/, '');

function chooseAlternative(id) {
  const original = assessDiagnosis({ ...readInput(), chosen: [] }).primary?.id;
  chosenPath = id === original ? [] : [...chosenPath, id];
  $('#quick-compare-dialog').close();
  renderResults();
}

function openCare() {
  const input = readInput(), diagnosis = assessDiagnosis(input);
  $('#care-context').innerHTML = diagnosis.findings.length
    ? `<p><strong>Most likely:</strong> ${escape(diagnosis.primary.title)} ${badge(diagnosis.primary.urgencyLevel)}</p>${diagnosis.findings.length > 1 ? `<p><strong>Also likely:</strong> ${escape(diagnosis.findings.slice(1).map(c => c.title).join('; '))}</p>` : ''}<button type="button" class="text-button" data-action="results">Back to my results ←</button>`
    : '<p>No clear match yet. Start with the water and how the fish is acting.</p>';
  goStep('care');
}

function renderCareSummary() {
  const input = readInput(), assessment = assessUrgency(input), diagnosis = assessDiagnosis(input);
  const fish = fishTypeFor(input.water, input.fishType);
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h2>Deal with the distress first.</h2><p>${escape(assessment.urgent.join('; '))}. ${escape(assessment.action)}</p><button class="text-button" data-action="emergency">Emergency steps →</button></div>` : '';
  const water = assessment.checks.length ? `<div class="notice water-notice"><h3>Fix the water too.</h3>${list(assessment.checks)}</div>` : '';
  const unknown = assessment.waterUnknown ? '<p class="water-reminder">No ammonia or nitrite reading yet. Test before you treat—bad water causes a lot of these problems.</p>' : '<p class="quiet">Readings saved in your notes.</p>';
  const notes = diagnosis.messages.length ? `<div class="notice diagnosis-context"><h2>Read this first</h2>${diagnosis.messages.map(m => `<p>${escape(m)}</p>`).join('')}</div>` : '';
  const condition = diagnosis.findings.length ? diagnosis.findings.map(c => `<section class="care-section" data-care-condition="${c.id}"><p class="eyebrow">${c === diagnosis.primary ? 'MOST LIKELY' : 'ALSO LIKELY'}</p><h2>${escape(c.title)} ${badge(c.urgencyLevel)}</h2>${todoCard(c, input.water, c.tip, fish)}<p class="avoid"><strong>Avoid:</strong> ${escape(c.avoid)}</p></section>`).join('') : '<section class="care-section"><h2>No clear cause yet.</h2><p>Test the water, watch how the fish acts over a day or two, and try the picture check again.</p></section>';
  $('#care-summary-content').innerHTML = `<h1 id="care-summary-title" class="question-title">Your care plan</h1>${urgent}${notes}<section class="care-section"><p class="eyebrow">1 · THE WATER</p>${water}${unknown}${list(carePlanFor('water', input.water).steps)}</section>${condition}<button class="button primary" data-action="case">Save my notes & readings ↗</button>`;
  goStep('care-summary');
}

function list(items) { return `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`; }
function scopeName(scope) { return {fresh:'Freshwater',marine:'Saltwater',both:'Fresh + salt water'}[scope]; }
function sourceLinks(ids) { return ids.map(id => SOURCES.find(s => s.id === id)).filter(Boolean).map(source => `<a href="${source.url}" data-reader target="_blank" rel="noopener noreferrer">${escape(source.name)} ↗</a>`).join(''); }

function slotArt(condition, slot, compact = false) {
  if (slot.image) return `<img src="${escape(slot.image.url)}" alt="${escape(slot.image.alt)}" loading="lazy"><span class="image-origin">AI illustration</span>`;
  return `<span class="slot-placeholder"><span class="frame-symbol" aria-hidden="true">▧</span><strong>${escape(slot.label)}</strong>${compact ? '' : `<small>${escape(condition.title)}</small><span class="awaiting">IMAGE TO ADD</span>`}</span>`;
}

// Library card: the disease's lead picture, three close-ups and a picture count (library-visuals.mjs).
const pic = (image, cls = '') => image ? `<img${cls ? ` class="${cls}"` : ''} src="${escape(image.url)}" width="${image.width || 362}" height="${image.height || 362}" alt="${escape(image.alt || '')}" loading="lazy" decoding="async">` : '';
function card(condition, matched = false) {
  const lead = leadImageFor(condition.id), close = closeupsFor(condition.id).slice(0, 3), count = libraryPictureCount(condition.id);
  return `<article class="condition-card visual-card"><button class="card-image ${lead ? 'filled' : ''}" data-condition="${condition.id}" aria-label="Open ${escape(condition.title)} visual page">${pic(lead)}<span class="slot-count">${count} pictures</span></button>${close.length ? `<div class="card-slot-strip">${close.map(im => `<button class="mini-slot filled" data-condition="${condition.id}" aria-label="${escape(condition.title)}: ${escape(im.caption || '')}">${pic(im)}</button>`).join('')}</div>` : ''}<div class="condition-body"><div class="card-meta"><span>${escape(condition.kind)}</span><span>${scopeName(condition.scope)}</span></div><h3>${escape(condition.title)}</h3>${scienceLine(condition.id)}${badge(condition.urgency)}<p>${escape(condition.summary)}</p>${matched ? `<p class="matches"><strong>${condition.comparisonReason ? 'Why compare:' : 'Relevant clues:'}</strong> ${escape(condition.comparisonReason || condition.matched.join(', ') || 'Tank history / water readings')}</p>` : ''}<div class="card-actions"><button class="text-button" data-condition="${condition.id}">Open visual page ↗</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div></div></article>`;
}

// The visual guide on a disease page: four numbered close-ups, where it shows on the
// fish, how it changes, and the most common look-alike (Nov 6 2026).
const zoomAttrs = (src, title, alt) => `data-zoom-src="${escape(src)}" data-zoom-title="${escape(title)}" data-zoom-alt="${escape(alt || '')}"`;
function infographic(condition, water) {
  const info = LIB_INFO[condition.id], close = closeupsFor(condition.id);
  if (!info && !close.length) return '';
  const look = lookalikesFor(condition.id, water)[0], lookImage = look && leadImageFor(look.id);
  const closeups = close.length ? `<ol class="ig-closeups">${close.map((im, i) => `<li><button type="button" class="ig-zoom" ${zoomAttrs(im.url, `${condition.title} · ${im.caption || ''}`, im.alt)} aria-label="Enlarge: ${escape(im.caption || '')}">${pic(im)}<b aria-hidden="true">${i + 1}</b></button><span><b>${i + 1}</b> ${escape(im.caption || '')}</span></li>`).join('')}</ol>` : '';
  const where = info ? `<div class="ig-where"><h4>Where it shows</h4>${fishMap(info.zones)}<p>${info.zones.map(z => `<span class="ig-zone">${escape(ZONES[z])}</span>`).join('')}</p></div>` : '';
  const time = info ? `<div class="ig-time"><h4>How it can change</h4><ol class="ig-timeline">${['Early', 'Common', 'Advanced'].map((label, i) => `<li><strong>${label}</strong><span>${escape(info.time[i])}</span></li>`).join('')}</ol><small class="ig-time-note">Not every fish goes through every stage.</small></div>` : '';
  const notThis = look ? `<div class="ig-notthis"><h4>Not this?</h4><div>${lookImage ? `<button type="button" class="ig-zoom" ${zoomAttrs(lookImage.url, look.title, lookImage.alt)} aria-label="Enlarge ${escape(look.title)}">${pic(lookImage)}</button>` : ''}<p><strong>${escape(look.title)}</strong>${escape(look.comparisonReason)}<button class="text-button" data-condition="${look.id}">Open ${escape(look.title)} →</button></p></div></div>` : '';
  return `<section class="infographic" data-infographic="${condition.id}" aria-label="${escape(condition.title)} visual guide"><p class="ig-eyebrow">VISUAL GUIDE</p>${closeups}${where || time ? `<div class="ig-row">${where}${time}</div>` : ''}${notThis}<small class="image-origin-note">AI illustrations.</small></section>`;
}

// The first prototype's full reference sheets (ich, velvet, cottony growth) that the
// four close-ups don't already show.
function moreSheets(condition) {
  const used = new Set(closeupsFor(condition.id).map(im => im.url));
  const sheets = slotsFor(condition.id).filter(s => s.image && !used.has(s.image.url));
  return sheets.length ? `<section class="more-sheets"><h3>Reference sheets</h3><div class="fish-strip-row">${sheets.map(s => `<button type="button" class="strip-item" data-sheet="${s.id}" ${zoomAttrs(s.image.url, `${condition.title} · ${s.label}`, s.image.alt)}>${pic(s.image)}<span>${escape(s.label)}</span></button>`).join('')}</div></section>` : '';
}

// The same disease on every kind of fish that has its own picture (in the library,
// only the water type being browsed).
function fishStrip(condition) {
  const browsing = activeView === 'library' ? $('#library-water').value : 'all';
  const strip = fishStripFor(condition.id).filter(s => !['fresh', 'marine'].includes(browsing) || s.water === browsing);
  if (!strip.length) return '';
  return `<section class="fish-strip" data-fish-strip="${condition.id}"><h3>${condition.id === 'normal' ? 'Healthy fish of each kind' : 'On different fish'} <small>${strip.length}</small></h3><div class="fish-strip-row">${strip.map(s => `<button type="button" class="strip-item" data-strip-fish="${s.fish}" ${zoomAttrs(s.url, `${condition.title} · ${s.title}`, s.alt)}>${pic(s)}<span>${escape(s.title)}</span></button>`).join('')}</div></section>`;
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

function compareVisual(c) {
  const lead = leadImageFor(c.id), close = closeupsFor(c.id).slice(0, 4);
  return `<div class="compare-visual">${lead ? `<button type="button" class="ig-zoom compare-lead" ${zoomAttrs(lead.url, c.title, lead.alt)}>${pic(lead)}</button>` : ''}${close.length ? `<div class="compare-closeups">${close.map(im => `<button type="button" class="ig-zoom" ${zoomAttrs(im.url, `${c.title} · ${im.caption || ''}`, im.alt)}>${pic(im)}</button>`).join('')}</div>` : ''}</div>`;
}

function openComparison() {
  if (comparisons.size !== 2) return;
  const selected = [...comparisons].map(id => CONDITIONS.find(c => c.id === id));
  $('#compare-content').innerHTML = `<div class="side-by-side">${selected.map(c => `<article><span class="scope-pill">${scopeName(c.scope)}</span><h3>${escape(c.title)}</h3>${compareVisual(c)}<div class="comparison-clues"><h4>Look for</h4>${list(c.clues)}<h4>Easy to confuse with</h4><p>${escape(c.distinguish)}</p><h4>Usual treatment</h4><p>${escape(carePlanFor(c.id, imageWater(c))?.treatment || '')}</p>${readMore(c)}<button class="button secondary" data-use-pattern="${c.id}">Check this visible pattern →</button></div></article>`).join('')}</div>`;
  $('#compare-dialog').showModal();
}

function emergencyContent() {
  return '<p class="eyebrow">EMERGENCY STEPS</p><h2 id="detail-title">Oxygen and clean water first.</h2><p class="lead">Gasping, can’t stay upright, or fish dying? Do these now, then treat the illness.</p><ol class="care-list"><li><strong>Add oxygen.</strong> Air stone, or point the filter outlet at the surface so it ripples.</li><li><strong>Test the water.</strong> Ammonia, nitrite, pH and temperature (and salinity for saltwater). Clear water can still be toxic.</li><li><strong>Do a 30–50% water change</strong> with dechlorinated, temperature-matched (and salinity-matched) water. An ammonia/nitrite detoxifier helps too—if you’re already medicating, check both labels say they can be used together. If the salinity itself is off, match the tank’s current salinity and correct it slowly (about 1 ppt a day).</li><li><strong>Move sick fish to a hospital tank</strong> if you have one, and feed lightly.</li></ol><p class="notice">If fish keep dying after the water is fixed, an aquatic vet or a good local fish store can help.</p><a class="button secondary" href="https://fishvets.org/" target="_blank" rel="noopener noreferrer">Find a fish vet (AAFV) ↗</a>';
}

// Reference detail pictures: the chosen fish's own set first, then the generic
// gallery (folded away when the fish has its own pictures).
function fishGallery(condition, water) {
  const fishType = currentFish(), own = imagesFor(fishType, condition.id, water);
  if (!own.fishSpecific) return '';
  const fish = fishTypeFor(water, fishType);
  const pics = own.images.map(image => `<figure><img src="${image.url}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" data-image-set="${fishType}"><figcaption>${escape(image.caption || '')}</figcaption></figure>`).join('');
  return `<section class="fish-gallery" data-fish-gallery="${fishType}" aria-label="${escape(fish?.title || '')} pictures"><div class="fish-gallery-row">${pics}</div><small class="image-origin-note">AI illustrations of ${escape(fish?.plural || 'fish')}.</small></section>`;
}

function openDetail(id, slotId = 'overview') {
  const base = CONDITIONS.find(c => c.id === id);
  if (!base) return;
  // Opened from a result: show the same plan, urgency and tip the result showed
  // (fish type, columnaris conflict, Malawi bloat…), not the general page.
  const fromResult = activeView === 'guide' && ['results', 'care-summary'].includes(step);
  const diag = fromResult ? assessDiagnosis(readInput()) : null;
  const shown = diag && [...diag.findings, ...diag.alternatives].find(c => c.id === id);
  const condition = shown ? { ...base, urgency: shown.urgencyLevel, plan: shown.plan || carePlanFor(id, readInput().water, readInput().fishType) } : base;
  const water = imageWater(base) || 'fresh';
  const others = lookalikesFor(id, water);
  $('#detail-content').innerHTML = `<p class="eyebrow">${escape(condition.kind)} · ${scopeName(condition.scope)}</p><h2 id="detail-title">${escape(condition.title)}</h2>${scienceLine(condition.id)}${badge(condition.urgency)}<p class="lead">${escape(condition.summary)}</p>${fishGallery(base, water)}${infographic(condition, water)}${fishStrip(condition)}${moreSheets(condition)}<div class="detail-visual-actions"><button class="button secondary" data-use-pattern="${condition.id}">Check this visible pattern →</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div><h3>What to look for</h3>${list(condition.clues)}<h3>Easy to confuse with</h3><p>${escape(condition.distinguish)}</p>${others.length ? `<ul class="detail-lookalikes">${others.map(o => `<li><button class="text-button" data-condition="${o.id}">${escape(o.title)} →</button> ${escape(o.comparisonReason)}</li>`).join('')}</ul>` : ''}${(!fromResult && activeView === 'library' && base.scope === 'both' && !['fresh', 'marine'].includes($('#library-water').value) ? `<h3 class="plan-water">Freshwater</h3>${todoCard({ ...base, plan: carePlanFor(id, 'fresh') }, 'fresh')}<h3 class="plan-water">Saltwater</h3>${todoCard({ ...base, plan: carePlanFor(id, 'marine') }, 'marine')}` : todoCard(condition, water))}<p class="avoid"><strong>Avoid:</strong> ${escape(condition.avoid)}</p><div class="sources"><h4>Read the references</h4>${sourceLinks(condition.source)}</div>`;
  $('#detail-dialog').showModal();
}

function renderLibrary() {
  const query = $('#library-search').value.trim().toLowerCase();
  const water = $('#library-water').value;
  if (water === 'reef' || water === 'pond') { reef.renderLibrary(query, water); return; }
  const patternMatches = libraryPattern ? new Set(rankConditions({ water: water === 'all' ? 'unknown' : water, signs: [libraryPattern] }).map(c => c.id)) : null;
  const filtered = CONDITIONS.filter(c => (water === 'all' || c.scope === 'both' || c.scope === water)
    && (!patternMatches || patternMatches.has(c.id))
    && [c.title,c.scientific,c.kind,c.summary,...c.clues].filter(Boolean).join(' ').toLowerCase().includes(query))
    .sort((a, b) => (a.id === 'normal') - (b.id === 'normal'));
  const pictures = filtered.reduce((n, c) => n + libraryPictureCount(c.id), 0);
  $('.slot-explanation').textContent = 'Open any entry for its visual guide: numbered close-ups, where it shows, how it changes, a look-alike, and the same problem on each kind of fish. All pictures are AI illustrations.';
  $('#library-count').textContent = `${filtered.length} entries · ${pictures} pictures`;
  $('#library-grid').innerHTML = filtered.map(c => card(c)).join('') || '<p class="notice">No matching entries. Try a symptom such as “breathing,” “white” or “fin.”</p>';
}

// A one-page sheet to bring to a fish store (Jez, Nov 6 2026: "a printable 'bring this to the store'
// sheet"): the answers and best guess from the notes, blanks for water tests, and what to bring.
// Printed from a hidden frame, so no pop-up and nothing leaves the browser.
function printSheet() {
  const input = readInput(), notes = buildCase(input), store = window.FHL_SHOP?.store;
  const number = v => String(v ?? '').trim();
  const salt = input.water === 'marine';
  const tests = [['Ammonia', number(input.ammonia), 'ppm'], ['Nitrite', number(input.nitrite), 'ppm'], ['Nitrate', '', 'ppm'], ['pH', number(input.ph), ''],
    ['KH / alkalinity', '', salt ? 'dKH' : 'dKH'], ['Temperature', number(input.temperature), input.tempUnit === 'C' ? '°C' : '°F'], ...(salt ? [['Salinity', number(input.salinity), 'SG / ppt']] : [['GH', '', 'dGH']])];
  const when = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fish health notes</title><style>
    body{font:12.5px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;margin:18mm 16mm}h1{font:700 21px Georgia,serif;margin:0 0 2px}
    .sub{color:#444;margin:0 0 12px}h2{font:700 14px Georgia,serif;margin:16px 0 6px;border-bottom:1px solid #999;padding-bottom:2px}
    table{border-collapse:collapse;width:100%}td,th{border:1px solid #888;padding:6px 8px;text-align:left}th{width:34%;background:#f2f2f2}td.v{height:18px}
    pre{white-space:pre-wrap;font:12px/1.45 system-ui,sans-serif;margin:0}ul{margin:4px 0 0 18px;padding:0}.foot{margin-top:14px;color:#555;font-size:11px}
    @page{margin:12mm}</style></head><body>
    <h1>${escape(store?.name ? `Fish health notes for ${store.name}` : 'Fish health notes for the store')}</h1>
    <p class="sub">${escape(when)}${store?.address ? ` · ${escape(store.address)}` : ''}${store?.phone ? ` · ${escape(store.phone)}` : ''}</p>
    <h2>Bring with this sheet</h2><ul><li>A fresh water sample in a clean container (about a cup, from the tank or pond, not the tap)</li><li>A photo or short video of the fish, coral or invert</li><li>The names of any medicines or additives you have used</li></ul>
    <h2>Water tests (fill in, or ask the store to test)</h2><table>${tests.map(([name, value, unit]) => `<tr><th>${escape(name)}</th><td class="v">${escape(value)}${value && unit ? ` ${escape(unit)}` : ''}</td></tr>`).join('')}</table>
    <h2>What I saw and the guide’s best guess</h2><pre>${escape(notes)}</pre>
    <p class="foot">A best guess from a hobby picture guide, not a vet diagnosis.</p></body></html>`;
  const frame = Object.assign(document.createElement('iframe'), { title: 'Printable notes', srcdoc: html });
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0';
  frame.addEventListener('load', () => { frame.contentWindow.focus(); frame.contentWindow.print(); setTimeout(() => frame.remove(), 60000); }, { once: true });
  document.body.append(frame);
}

function showCase() {
  currentCase = buildCase(readInput());
  $('#case-text').value = currentCase;
  $('#copy-status').textContent = '';
  $('#case-dialog').showModal();
}

async function copyCase() {
  try { await navigator.clipboard.writeText(currentCase); $('#copy-status').textContent = 'Copied. Keep these notes to track changes or share when asking for help.'; }
  catch { $('#case-text').select(); $('#copy-status').textContent = 'Automatic copying was unavailable. The notes are selected; use your device’s Copy command.'; }
}


$('#welcome-fish').innerHTML = `<img src="${OPENING_IMAGE.url}" width="${OPENING_IMAGE.width}" height="${OPENING_IMAGE.height}" alt="${escape(OPENING_IMAGE.alt)}" fetchpriority="high" decoding="async">`;
function signButton(symptom, attribute, title = symptom.title) {
  const isTexture = attribute === 'data-texture';
  const isAdditional = attribute === 'data-additional-symptom';
  const water = form.elements.water.value, fishType = form.elements.fishType?.value || '';
  const image = isTexture ? TEXTURE_IMAGES[symptom.id] : imageFor(fishType, symptom.id, water) || signImagesFor(water)[symptom.id];
  const set = isTexture ? 'generic' : setAttr(fishType, water, symptom.id);
  const hint = isTexture && symptom.id === 'unclear' ? 'I can’t make out the texture' : symptom.text;
  const selected = isAdditional ? additionalSigns.has(symptom.id) : symptom.id === (isTexture ? detailSign : primarySign);
  return `<button type="button" class="symptom-card" ${attribute}="${symptom.id}" aria-pressed="${String(selected)}"><span class="symptom-art"><img data-choice-image="${isTexture ? 'texture' : isAdditional ? 'additional' : 'sign'}-${symptom.id}" data-src="${image.url}" width="${image.width}" height="${image.height}" alt="${escape(image.alt)}" data-image-set="${set}" decoding="async"><span class="selection-check" aria-hidden="true">✓</span></span><strong>${escape(title)}</strong><small>${escape(hint)}</small></button>`;
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
function updateSignsHint() {
  const fish = fishTypeFor(form.elements.water.value, form.elements.fishType?.value);
  $('#signs-note').textContent = fish && fishSetFor(fish.id, form.elements.water.value) ? `AI pictures of ${fish.plural}.` : 'AI illustrations.';
}
function renderFishChoices() {
  const water = form.elements.water.value, checked = $('#fish-grid input:checked'), current = checked ? checked.value : null;
  const choices = [...(FISH_TYPES[water] || []), { id: '', title: 'Not sure / other', text: 'Skip this question' }];
  $('#fish-grid').innerHTML = choices.map(f => `<label class="fish-chip${f.id ? '' : ' fish-chip-other'}"><input type="radio" name="fishType" value="${f.id}"${current !== null && f.id === current ? ' checked' : ''}><span>${fishPicture(f.id)}<strong>${escape(f.title)}</strong><small>${escape(f.text)}</small></span></label>`).join('');
  updateNextLabel();
}
function renderCloserChoices() {
  const water = form.elements.water.value, question = closerQuestionFor(primarySign, water);
  const current = $('#closer-grid input:checked')?.value || '';
  if (!question) { $('#closer-grid').replaceChildren(); return; }
  const catfish = ['cory', 'pleco'].includes(form.elements.fishType?.value) && question.catfishTitle;
  $('#closer-title').textContent = catfish ? question.catfishTitle : question.title;
  $('#closer-hint').textContent = question.hint;
  $('#closer-grid').innerHTML = question.choices.map(c => `<label><input type="radio" name="closer" value="${c.id}"${c.id === current ? ' checked' : ''}><span><strong>${escape(catfish && c.catfishTitle ? c.catfishTitle : water === 'marine' && c.marineTitle ? c.marineTitle : c.title)}</strong><small>${escape(catfish && c.catfishText ? c.catfishText : c.text)}</small></span></label>`).join('');
}
function renderAdditionalChoices() {
  const main = detailSign || primarySign;
  $('#additional-grid').innerHTML = SYMPTOMS.filter(s => s.id !== 'unclear' && s.id !== main).map(s => signButton(s, 'data-additional-symptom')).join('');
  $('#additional-status').textContent = additionalSigns.size ? `Also selected: ${[...additionalSigns].map(id => LABELS[id]).join('; ')}. Select a picture again to remove it.` : 'Only add signs you can actually see. Leave this closed if the main sign is enough.';
  if ($('#additional-signs').open && step === 'behavior') $$('#additional-grid img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
}
renderChoiceGrids();
renderFishChoices();
$('#behavior-grid').innerHTML = BEHAVIORS.map(b => `<label class="check-label"><input type="checkbox" name="behavior" value="${b.id}"><span>${escape(b.label)}</span></label>`).join('');
// Corys and plecos have no scales to stick out.
function relabelBehaviors() {
  const span = $('#behavior-grid input[value="pinecone"] + span');
  if (span) span.textContent = ['cory', 'pleco'].includes(form.elements.fishType?.value) ? 'Swollen tight and stiff all over' : BEHAVIORS.find(b => b.id === 'pinecone').label;
}
$('#growth-grid').innerHTML = GROWTH_CHOICES.map(choice => `<label><input type="radio" name="growthAppearance" value="${choice.id}"><span><strong>${escape(choice.title)}</strong><small>${escape(choice.text)}</small></span></label>`).join('');
$('#source-list').innerHTML = sourceLinks(SOURCES.map(s => s.id));
$('#library-patterns').innerHTML = SYMPTOMS.map(s => `<button class="pattern-filter" data-library-pattern="${s.id}" aria-pressed="false"><span>${fishArt(s.art)}</span><strong>${escape(s.title)}</strong></button>`).join('');

function toggleMenu(open) {
  const button = $('.menu-button'), menu = $('#site-menu');
  const next = open ?? menu.hidden;
  menu.hidden = !next; button.setAttribute('aria-expanded', String(next));
}

document.addEventListener('click', async event => {
  if (event.target.closest('[data-action="menu"]')) { toggleMenu(); return; }
  if (!$('#site-menu').hidden && !event.target.closest('#site-menu')) toggleMenu(false);
  if (reef.handleClick(event)) return;
  if (extras.handleClick(event)) return;
  const readerLink = event.target.closest('a[data-treatment], a[data-reader]');
  if (readerLink && reader.open(event, readerLink)) return;
  if (readerLink?.dataset.treatment) openTreatmentPopup(event, readerLink);
  const view = event.target.closest('[data-view]');
  if (view) switchView(view.dataset.view);
  const symptom = event.target.closest('[data-symptom]');
  if (symptom) { selectSign(symptom.dataset.symptom); autoAdvance(); }
  const texture = event.target.closest('[data-texture]');
  if (texture) { selectSign(texture.dataset.texture, true); autoAdvance(); }
  const additional = event.target.closest('[data-additional-symptom]');
  if (additional) {
    const id = additional.dataset.additionalSymptom;
    if (id === 'lumps') clearGrowthChoice();
    if (additionalSigns.has(id)) additionalSigns.delete(id); else additionalSigns.add(id);
    additional.setAttribute('aria-pressed', String(additionalSigns.has(id)));
    $('#additional-status').textContent = additionalSigns.size ? `Also selected: ${[...additionalSigns].map(id => LABELS[id]).join('; ')}. Select a picture again to remove it.` : 'No additional signs selected.';
    updateNextLabel();
  }
  const choose = event.target.closest('[data-choose]');
  if (choose) chooseAlternative(choose.dataset.choose);
  const quickCompare = event.target.closest('[data-quick-compare]');
  if (quickCompare) openQuickCompare(quickCompare.dataset.quickCompare);
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
  const zoom = event.target.closest('[data-zoom-src]');
  if (zoom) { $('#atlas-title').textContent = zoom.dataset.zoomTitle; $('#atlas-full').src = zoom.dataset.zoomSrc; $('#atlas-full').alt = zoom.dataset.zoomAlt; $('#atlas-full').removeAttribute('width'); $('#atlas-full').removeAttribute('height'); $('#atlas-dialog').showModal(); return; }
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
  if (action === 'back') { if (reef.owns(step)) goStep(reef.previous(step)); else if (step === 'care') renderResults(); else { const route = sequence(); goStep(route[route.indexOf(step) - 1] || 'welcome'); } }
  if (action === 'care') openCare();
  if (action === 'results') renderResults();
  if (action === 'edit') goStep('water');
  if (action === 'reset') reset();
  if (action === 'case') showCase();
  if (action === 'copy-case') await copyCase();
  if (action === 'print-sheet') printSheet();
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
    clearGrowthChoice(); clearCloserChoice();
    detailSign = ''; visualReference = null; additionalSigns.clear();
    if (form.elements.water.value === 'fresh') form.elements.salinity.value = '';
    renderChoiceGrids();
    // A fish type belongs to one water type; changing water clears it.
    $$('input[name="fishType"]').forEach(el => { el.checked = false; });
    relabelBehaviors();
    renderFishChoices();
    comparisons.clear(); updateCompareTray();
    $('#results-content').replaceChildren(); $('#care-context').replaceChildren(); $('#care-summary-content').replaceChildren();
    $('#detail-content').replaceChildren(); $('#compare-content').replaceChildren();
    $('#atlas-full').removeAttribute('src'); $('#texture-reference').replaceChildren();
    $('#library-water').value = form.elements.water.value;
    $('#library-grid').replaceChildren();
  }
  // Picking a fish swaps the symptom pictures to that fish's own set.
  if (event.target.name === 'fishType') { relabelBehaviors(); renderChoiceGrids(); updateSignsHint(); updateNextLabel(); autoAdvance(); }
  if (event.target.name === 'closer') autoAdvance();
  const { urgent } = assessUrgency(readInput());
  $('#inline-urgent').hidden = !urgent.length;
  const { action } = assessUrgency(readInput());
  $('#inline-urgent').textContent = urgent.length ? `These signs need fast action: ${urgent.join('; ')}. ${action}` : '';
});
$('#library-search').addEventListener('input', renderLibrary);
$('#library-water').addEventListener('change', renderLibrary);
$('#additional-signs').addEventListener('toggle', () => {
  if ($('#additional-signs').open && step === 'behavior') $$('#additional-grid img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
});
goStep('welcome', false);
// Old #ich links also start neutrally; only deliberate library links bypass Start.
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#site-menu').hidden) { toggleMenu(false); $('.menu-button').focus(); } });
// ?medicine=<id> (from a store's product page) opens the medicine check with that medicine picked.
{
  const params = new URLSearchParams(location.search), medicine = params.get('medicine');
  if (medicine) {
    extras.presetMedicine(medicine); params.delete('medicine');
    history.replaceState(null, '', location.pathname + (params.size ? `?${params}` : '') + '#medicine');
  }
}
if (HASH_VIEWS.includes(location.hash.slice(1))) switchView(location.hash.slice(1));
else if (location.hash) history.replaceState(null, '', location.pathname + location.search);
// Deep links from a host site's help pages (Hidden Reef Help Center, Nov 6 2026):
// ?start=fish|coral|invert|pond opens that check directly. The parameter is dropped once used,
// so Start over and reloads return to the normal welcome screen.
{
  const params = new URLSearchParams(location.search), start = params.get('start');
  if (start) {
    params.delete('start');
    history.replaceState(null, '', location.pathname + (params.size ? `?${params}` : '') + location.hash);
    const tile = start === 'fish' ? $('.help-tile[data-action="start"]') : document.querySelector(`.help-tile[data-reef-start="${CSS.escape(start)}"]`);
    if (tile && !location.hash) tile.click();
  }
}

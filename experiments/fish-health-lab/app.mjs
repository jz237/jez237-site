import { SYMPTOMS, BEHAVIORS, CONDITIONS, SOURCES, ATLAS_URL } from './data.mjs';
import { assessUrgency, rankConditions, buildCase, describeIchPattern } from './logic.mjs';
import { GUIDE_URL, slotsFor, leadSlot, patternFor } from './visuals.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const form = $('#fish-form');
const chosen = new Set();
let step = 1, currentCase = '', illustrationId = 0;
let libraryPattern = '', visualReference = null, ichWalkthrough = false, visualExtent = '';
let ichStep = 1;
const ichAnswers = { water: '', pattern: '', extent: '' };
const comparisons = new Set();

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
  const data = Object.fromEntries(new FormData(form));
  return { ...data, signs: [...chosen, ...$$('input[name="behavior"]:checked').map(input => input.value)], ichWalkthrough, visualExtent, visualReference, comparisons: [...comparisons] };
}

function goStep(number, scroll = true) {
  step = number;
  $$('.step').forEach(el => { el.hidden = Number(el.dataset.step) !== number; });
  $$('.stepper li').forEach(el => {
    const n = Number(el.dataset.stepIndicator);
    el.classList.toggle('complete', n < number);
    if (n === number) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  if (scroll) {
    $('#check').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const heading = $(`[data-step="${number}"] h3, [data-step="${number}"] h2`);
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }
}

function switchView(name) {
  for (const id of ['guide', 'library', 'ich', 'about']) $(`#${id}-view`).hidden = id !== name;
  $$('.nav-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.view === name);
    if (button.dataset.view === name) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'library') renderLibrary();
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
  return `<section class="visual-gallery" data-gallery="${condition.id}" aria-label="${escape(condition.title)} image gallery"><div class="gallery-display" aria-live="polite">${galleryDisplay(condition, active)}</div><div class="gallery-slots" aria-label="Choose an image view">${slots.map(slot => `<button data-slot="${slot.id}" aria-pressed="${slot.id === active.id}" aria-label="${escape(slot.label)}${slot.image ? ' — AI illustration' : ' — image to add'}"><span class="slot-thumb ${slot.image ? 'filled' : ''}">${slotArt(condition, slot, true)}</span><span>${escape(slot.label)}</span><small>${slot.image ? 'Illustration ready' : 'Image to add'}</small></button>`).join('')}</div></section>`;
}

function enlargeImage(entryId, slotId) {
  const condition = CONDITIONS.find(c => c.id === entryId), slot = slotsFor(entryId).find(s => s.id === slotId);
  if (!condition || !slot?.image) return;
  $('#atlas-title').textContent = `${condition.title} · ${slot.label}`;
  $('#atlas-full').src = slot.image.url; $('#atlas-full').alt = slot.image.alt;
  $('#atlas-dialog').showModal();
}

function updateCompareTray(message = '') {
  $('#comparison-tray').hidden = !comparisons.size;
  $('#comparison-picks').innerHTML = [...comparisons].map(id => `<button data-remove-comparison="${id}" aria-label="Remove ${escape(CONDITIONS.find(c => c.id === id).title)} from comparison">${escape(CONDITIONS.find(c => c.id === id).title)} <span aria-hidden="true">×</span></button>`).join('');
  $('#comparison-status').textContent = message || (comparisons.size === 1 ? 'Choose one more entry to compare.' : 'Two entries selected. Compare the pictures and look-alikes.');
  $('[data-action="compare"]').disabled = comparisons.size !== 2;
  document.body.classList.toggle('has-comparison', comparisons.size > 0);
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

function startFromPattern(id) {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  const sign = patternFor(id), label = SYMPTOMS.find(s => s.id === sign).title;
  chosen.add(sign);
  if (condition.scope !== 'both') form.elements.water.value = condition.scope;
  visualReference = condition.id; ichWalkthrough = false; visualExtent = '';
  $$('.symptom-card').forEach(button => button.setAttribute('aria-pressed', String(chosen.has(button.dataset.symptom))));
  $('#visual-start-note').hidden = false;
  $('#visual-start-note').textContent = `You came from “${condition.title}.” We selected the visible sign “${label},” not a diagnosis. Confirm the water type, change any signs that do not fit, and keep look-alikes in mind.`;
  $$('#detail-dialog[open], #compare-dialog[open]').forEach(dialog => dialog.close());
  switchView('guide'); goStep(1);
}

function walkthroughImage(slotId) {
  const condition = CONDITIONS.find(c => c.id === 'ich-fresh'), slot = slotsFor(condition.id).find(s => s.id === slotId);
  return `<figure class="walk-reference"><button class="walk-image" data-enlarge-entry="ich-fresh" data-enlarge-slot="${slotId}" aria-label="Enlarge ${escape(slot.label)}">${slotArt(condition, slot)}</button><figcaption><strong>${escape(slot.label)}</strong><span>Tap the picture to enlarge ↗</span></figcaption></figure>`;
}

function renderIchWalkthrough() {
  const radio = (name, value, label, selected) => `<label class="walk-choice"><input type="radio" name="ich-${name}" value="${value}" ${selected === value ? 'checked' : ''}><span>${label}</span></label>`;
  $('#ich-walkthrough').innerHTML = `<ol class="walk-progress" aria-label="Illustrated steps"><li ${ichStep === 1 ? 'aria-current="step"' : ''}>1 · Recognize</li><li ${ichStep === 2 ? 'aria-current="step"' : ''}>2 · Compare texture</li><li ${ichStep === 3 ? 'aria-current="step"' : ''}>3 · Notice variation</li><li>4 · Check the tank</li></ol>
    <section data-ich-step="1" ${ichStep === 1 ? '' : 'hidden'}><div class="section-heading"><div><p class="eyebrow">START WITH THE WHOLE FISH</p><h2>One condition can look different.</h2></div><span class="scope-pill">Freshwater example</span></div><p>Look at the skin and fins, then compare the same pattern across fish colors and shapes. These are illustrations, not confirmed cases.</p><div class="walk-reference-pair">${walkthroughImage('overview')}${walkthroughImage('variations')}</div><fieldset class="walk-answers"><legend>Is your fish in freshwater?</legend><div class="walk-options">${radio('water','fresh','Freshwater',ichAnswers.water)}${radio('water','marine','Saltwater / reef',ichAnswers.water)}${radio('water','unknown','I’m not sure',ichAnswers.water)}</div></fieldset><p id="ich-water-note" class="notice" ${ichAnswers.water && ichAnswers.water !== 'fresh' ? '' : 'hidden'}>${ichAnswers.water === 'marine' ? 'Saltwater ich is a different parasite. Use the general guide with saltwater selected; do not apply this freshwater example as marine advice.' : 'Identify the water type before using the freshwater ich walkthrough. The general guide can keep the water type unknown.'}</p><button class="text-button" data-action="ich-general" ${ichAnswers.water && ichAnswers.water !== 'fresh' ? '' : 'hidden'}>Use the general guide instead →</button><p class="field-error ich-step-error" role="alert"></p><div class="step-actions"><span class="quiet">The pictures are clues, not proof.</span><button class="button primary" data-action="ich-next">Next: compare the texture →</button></div></section>
    <section data-ich-step="2" ${ichStep === 2 ? '' : 'hidden'}><p class="eyebrow">THE DETAILS THAT CHANGE THE QUESTION</p><h2>Grains, dust, or something else?</h2><p>Enlarge these references. Compare the shape and texture you can actually see on your fish—white color alone is not enough.</p><div class="walk-reference-pair">${walkthroughImage('closeup')}${walkthroughImage('lookalikes')}</div><fieldset class="walk-answers"><legend>Which visible pattern is closest?</legend><div class="walk-options pattern-options">${radio('pattern','dots','Separate salt-like white grains',ichAnswers.pattern)}${radio('pattern','dust','Very fine dust or sheen',ichAnswers.pattern)}${radio('pattern','fuzz','Cottony threads or tufts',ichAnswers.pattern)}${radio('pattern','patch','Flat pale patches',ichAnswers.pattern)}${radio('pattern','lumps','Larger irregular growths',ichAnswers.pattern)}${radio('pattern','unclear','Not clear / perhaps normal markings',ichAnswers.pattern)}</div></fieldset><p class="field-error ich-step-error" role="alert"></p><div class="step-actions"><button class="button secondary" data-action="ich-back">← Back</button><button class="button primary" data-action="ich-next">Next: how visible is it? →</button></div></section>
    <section data-ich-step="3" ${ichStep === 3 ? '' : 'hidden'}><p class="eyebrow">A RANGE OF APPEARANCES — NOT A TIMELINE</p><h2>Few spots don’t mean little trouble.</h2><p>Light-colored fish can hide a pattern. Gill disease can occur without obvious skin spots. These examples are not a severity scale or stages every fish goes through.</p><div class="walk-reference-pair">${walkthroughImage('subtle')}${walkthroughImage('marked')}</div><fieldset class="walk-answers"><legend>How noticeable are the changes on your fish?</legend><div class="walk-options">${radio('extent','Few or subtle visible changes','Few / subtle changes',ichAnswers.extent)}${radio('extent','Many or obvious visible changes','Many / obvious changes',ichAnswers.extent)}${radio('extent','Unclear or no obvious skin changes','Hard to tell / no obvious skin change',ichAnswers.extent)}</div></fieldset><p class="quiet">This records what you notice. It does not rate how sick the fish is.</p><p class="field-error ich-step-error" role="alert"></p><div class="step-actions"><button class="button secondary" data-action="ich-back">← Back</button><button class="button primary" data-action="ich-tank">Continue: check the tank →</button></div></section>`;
}

function advanceIch() {
  const error = $(`[data-ich-step="${ichStep}"] .ich-step-error`);
  if (ichStep === 1 && ichAnswers.water !== 'fresh') { error.textContent = 'Choose freshwater to use this example, or use the general guide for saltwater or unknown water type.'; return; }
  if (ichStep === 2 && !ichAnswers.pattern) { error.textContent = 'Choose the closest pattern. “Not clear” is a useful answer.'; return; }
  ichStep = Math.min(3, ichStep + 1); renderIchWalkthrough(); focusIchStep();
}

function focusIchStep() {
  const heading = $(`[data-ich-step="${ichStep}"] h2`);
  heading.tabIndex = -1; heading.focus({preventScroll:true}); heading.scrollIntoView({behavior:'smooth',block:'start'});
}

function finishIchWalkthrough() {
  if (ichAnswers.water !== 'fresh' || !ichAnswers.pattern) return;
  if (!ichAnswers.extent) { $('[data-ich-step="3"] .ich-step-error').textContent = 'Choose how visible the changes are. “Hard to tell” is fine.'; return; }
  reset(true);
  ichWalkthrough = true; visualReference = 'ich-fresh'; visualExtent = ichAnswers.extent;
  chosen.add(ichAnswers.pattern); form.elements.water.value = 'fresh';
  $$('.symptom-card').forEach(button => button.setAttribute('aria-pressed', String(chosen.has(button.dataset.symptom))));
  $('#visual-start-note').hidden = false;
  $('#visual-start-note').textContent = `From the illustrated check: ${SYMPTOMS.find(s => s.id === ichAnswers.pattern).title}; ${visualExtent.toLowerCase()}. These are your observations, not an ich diagnosis. Add the tank details below.`;
  switchView('guide'); goStep(2);
}

function emergencyContent() {
  return '<p class="eyebrow">ACT ON DISTRESS, NOT JUST A DISEASE NAME</p><h2 id="detail-title">Breathing and balance come first.</h2><p class="lead">Severe gasping, inability to stay upright, poor responsiveness or fish deaths warrant urgent aquatic-veterinary help.</p><ol class="care-list"><li><strong>Support oxygen.</strong> Check aeration, surface movement and filter operation. Avoid unnecessary handling.</li><li><strong>Test the water now.</strong> Record ammonia, nitrite, pH and temperature; check salinity for marine tanks. Clear water can still be unsafe.</li><li><strong>Address an environmental problem.</strong> If readings or a recent contamination indicate a problem, use appropriately conditioned, temperature- and salinity-matched partial water changes. Avoid abrupt pH or salinity changes.</li><li><strong>Contact a fish-health professional.</strong> Tell them how many fish are affected and how fast this developed. Don’t wait for visible spots.</li></ol><p class="notice">Don’t blindly mix medicines, raise heat, add salt, or move a marine fish into freshwater. Reef invertebrates and different fish species have different tolerances.</p><a class="button secondary" href="https://fishvets.org/" target="_blank" rel="noopener noreferrer">American Association of Fish Veterinarians ↗</a>';
}

function openDetail(id, slotId = 'overview') {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  $('#detail-content').innerHTML = `<p class="eyebrow">${escape(condition.kind)} · ${scopeName(condition.scope)}</p><h2 id="detail-title">${escape(condition.title)}</h2>${condition.scientific ? `<p class="scientific">${escape(condition.scientific)}</p>` : ''}<p class="lead">${escape(condition.summary)}</p>${gallery(condition, slotId)}<div class="detail-visual-actions"><button class="button primary" data-use-pattern="${condition.id}">Check this visible pattern →</button><button class="compare-toggle" data-compare="${condition.id}" aria-pressed="${comparisons.has(condition.id)}">${comparisons.has(condition.id) ? '✓ Selected' : '+ Compare'}</button></div><p class="quiet">This selects a visible sign, not a disease. The tank questions help you compare other explanations.</p><h3>Clues that can fit</h3>${list(condition.clues)}<h3>What else could look similar?</h3><p>${escape(condition.distinguish)}</p><h3>Useful next checks</h3>${list(condition.next)}<div class="notice"><h4>How it is distinguished</h4><p>${escape(condition.confirm)}</p></div><p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(condition.avoid)}</p><div class="sources"><h4>Read the references</h4>${sourceLinks(condition.source)}</div><p class="quiet">A subtle skin appearance does not mean a mild illness. These image views are not clinical stages or a severity score.</p>`;
  $('#detail-dialog').showModal();
}

function renderResults() {
  const input = readInput();
  const assessment = assessUrgency(input);
  const ranked = rankConditions(input).slice(0, 4);
  const urgent = assessment.urgent.length ? `<div class="notice urgent"><h3>Don’t wait for a visual match.</h3><p>You reported: ${escape(assessment.urgent.join('; '))}.</p><p>Support aeration, check the water and arrange urgent fish-health help.</p><button class="text-button" data-action="emergency">See immediate checks →</button></div>` : '';
  const checks = assessment.checks.length ? `<div class="notice water-notice"><h3>Put the environment near the top of the list.</h3>${list(assessment.checks)}</div>` : '';
  const unknown = assessment.waterUnknown ? '<p class="water-reminder"><strong>Water tests are missing.</strong> That means unknown—not safe. Check actual readings before choosing a treatment.</p>' : '';
  const scope = input.water === 'unknown' ? '<p class="notice">Water type is unknown, so both freshwater and saltwater entries are shown. Identify the aquarium type before following condition-specific advice.</p>' : '';
  const visualSummary = describeIchPattern(input);
  const outcome = input.ichWalkthrough ? `<section class="ich-outcome"><p class="eyebrow">YOUR ILLUSTRATED ICH CHECK</p><h3>${escape(visualSummary.title)}</h3><p>${escape(visualSummary.text)}</p><div class="outcome-actions"><button class="button secondary" data-enlarge-entry="ich-fresh" data-enlarge-slot="lookalikes">Revisit the pictured look-alikes ↗</button><button class="button secondary" data-enlarge-entry="ich-fresh" data-enlarge-slot="overview">See how ich is confirmed ↗</button></div><p class="quiet">Check water quality and breathing first. A fish-health professional can distinguish look-alikes with appropriate examination and microscopy. Do not blindly mix medicines or raise heat.</p></section>` : '';
  $('#results-content').innerHTML = `<p class="eyebrow">YOUR OBSERVATIONS → VISUAL COMPARISONS</p><h2 id="results-title">Now compare the pictures.</h2><p class="lead">These entries fit some of your observations. Open the image views, or choose two entries with “+ Compare.” They are reading suggestions, not probabilities or a confirmed diagnosis.</p>${urgent}${checks}${unknown}${scope}${outcome}<div class="result-label"><span>${ranked.length} patterns worth comparing</span><span>Based on the signs you selected</span></div><div class="results-grid">${ranked.map(condition => card(condition, true)).join('') || '<div class="notice">There is no clear match yet. Review the signs, check water quality, and seek help if the fish is unwell.</div>'}</div><section class="case-cta"><div><p class="eyebrow">KEEP THE WHOLE STORY</p><h3>Save your observations.</h3><p>Keep a record for yourself or a fish-health professional. Nothing is submitted from this page.</p></div><button class="button primary" data-action="case">My observation notes <span aria-hidden="true">↗</span></button></section><p class="quiet">A photo cannot establish every cause. Skin/gill microscopy, water tests, cultures or other professional tests may be needed. Do not delay care because a pattern looks different.</p>`;
  goStep(3);
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

function reset(keepWalkthrough = false) {
  form.reset(); chosen.clear();
  $$('.symptom-card').forEach(button => button.setAttribute('aria-pressed', 'false'));
  $('#step-one-error').textContent = '';
  ichWalkthrough = false; visualExtent = '';
  if (!keepWalkthrough) { Object.assign(ichAnswers, { water: '', pattern: '', extent: '' }); ichStep = 1; renderIchWalkthrough(); }
  $('#inline-urgent').hidden = true; $('#salinity-field').hidden = true;
  $('#results-content').replaceChildren(); $('#case-text').value = ''; currentCase = '';
  visualReference = null; $('#visual-start-note').hidden = true;
  comparisons.clear(); updateCompareTray();
  goStep(1);
}

$('#hero-fish').innerHTML = fishArt('dots', true);
$('#symptom-grid').innerHTML = SYMPTOMS.map(symptom => `<button class="symptom-card" type="button" data-symptom="${symptom.id}" aria-pressed="false"><span class="symptom-art">${fishArt(symptom.art)}<span class="selection-check" aria-hidden="true">✓</span></span><strong>${symptom.title}</strong><small>${symptom.text}</small></button>`).join('');
$('#behavior-grid').innerHTML = BEHAVIORS.map(behavior => `<label class="check-label"><input type="checkbox" name="behavior" value="${behavior.id}"><span>${behavior.label}</span></label>`).join('');
$('#source-list').innerHTML = sourceLinks(SOURCES.map(source => source.id));
$('#atlas-thumb').src = ATLAS_URL;
$('#atlas-full').src = ATLAS_URL;
$('#guide-sheet').src = GUIDE_URL;
$('#variation-sheet').src = ATLAS_URL;
$('#library-patterns').innerHTML = SYMPTOMS.map(symptom => `<button class="pattern-filter" data-library-pattern="${symptom.id}" aria-pressed="false"><span>${fishArt(symptom.art)}</span><strong>${escape(symptom.title)}</strong></button>`).join('');

document.addEventListener('click', async event => {
  const view = event.target.closest('[data-view]');
  if (view) switchView(view.dataset.view);
  const symptom = event.target.closest('[data-symptom]');
  if (symptom) {
    const id = symptom.dataset.symptom;
    if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
    symptom.setAttribute('aria-pressed', String(chosen.has(id)));
    $('#step-one-error').textContent = '';
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
  const compareButton = event.target.closest('[data-compare]');
  if (compareButton) {
    const id = compareButton.dataset.compare;
    if (comparisons.has(id)) comparisons.delete(id);
    else if (comparisons.size < 2) comparisons.add(id);
    else { updateCompareTray('Two entries are already selected. Remove one below to compare a different entry.'); return; }
    updateCompareTray();
  }
  const removeCompare = event.target.closest('[data-remove-comparison]');
  if (removeCompare) { comparisons.delete(removeCompare.dataset.removeComparison); updateCompareTray(); }
  const pattern = event.target.closest('[data-use-pattern]');
  if (pattern) startFromPattern(pattern.dataset.usePattern);
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'ich-next') advanceIch();
  if (action === 'ich-back') { ichStep = Math.max(1, ichStep - 1); renderIchWalkthrough(); focusIchStep(); }
  if (action === 'ich-tank') finishIchWalkthrough();
  if (action === 'ich-general') { const water = ichAnswers.water; reset(); form.elements.water.value = water || 'unknown'; switchView('guide'); goStep(1); }
  if (action === 'next') {
    if (!form.elements.water.value || !chosen.size) {
      $('#step-one-error').textContent = 'Choose a water type and at least one visible sign. “I’m not sure” and “Nothing obvious” are fine.';
      return;
    }
    $('#salinity-field').hidden = form.elements.water.value === 'fresh';
    goStep(2);
  }
  if (action === 'back') goStep(1);
  if (action === 'edit') goStep(2);
  if (action === 'reset') reset();
  if (action === 'case') showCase();
  if (action === 'copy-case') await copyCase();
  if (action === 'download-case') {
    const url = URL.createObjectURL(new Blob([currentCase], { type: 'text/plain;charset=utf-8' }));
    const anchor = Object.assign(document.createElement('a'), { href: url, download: 'fish-health-case.txt' });
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (action === 'close-dialog') event.target.closest('dialog')?.close();
  if (action === 'emergency') { $('#detail-content').innerHTML = emergencyContent(); $('#detail-dialog').showModal(); }
  if (action === 'atlas') enlargeImage('ich-fresh', 'variations');
  if (action === 'compare') openComparison();
  if (action === 'clear-compare') { comparisons.clear(); updateCompareTray(); }
  if (action === 'all-patterns') {
    libraryPattern = ''; $('#library-search').value = ''; $('#library-water').value = 'all';
    $$('[data-library-pattern]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    renderLibrary();
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (step !== 2) return;
  if (!form.reportValidity()) return;
  renderResults();
});
form.addEventListener('change', () => {
  const { urgent } = assessUrgency(readInput());
  $('#inline-urgent').hidden = !urgent.length;
  $('#inline-urgent').textContent = urgent.length ? `These signs need prompt help: ${urgent.join('; ')}. Use “What to do first” above; don’t wait to finish the guide.` : '';
});
$('#ich-walkthrough').addEventListener('change', event => {
  const key = event.target.name?.replace('ich-', '');
  if (!Object.hasOwn(ichAnswers, key)) return;
  ichAnswers[key] = event.target.value;
  if (key === 'water') {
    $('#ich-water-note').hidden = ichAnswers.water === 'fresh';
    $('#ich-water-note').textContent = ichAnswers.water === 'marine' ? 'Saltwater ich is a different parasite. Use the general guide with saltwater selected; do not apply this freshwater example as marine advice.' : 'Identify the water type before using the freshwater ich walkthrough. The general guide can keep water type unknown.';
    $('[data-action="ich-general"]').hidden = ichAnswers.water === 'fresh';
  }
  $$('[data-ich-step] .ich-step-error').forEach(el => { el.textContent = ''; });
});
$('#library-search').addEventListener('input', renderLibrary);
$('#library-water').addEventListener('change', renderLibrary);
renderLibrary();
renderIchWalkthrough();
if (location.hash === '#ich') switchView('ich');

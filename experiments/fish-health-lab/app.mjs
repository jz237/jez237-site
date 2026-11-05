import { SYMPTOMS, BEHAVIORS, CONDITIONS, SOURCES, ATLAS_URL } from './data.mjs';
import { assessUrgency, rankConditions, buildCase } from './logic.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const form = $('#fish-form');
const chosen = new Set();
let step = 1, photoURL = null, currentCase = '', illustrationId = 0;

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
  return { ...data, signs: [...chosen, ...$$('input[name="behavior"]:checked').map(input => input.value)], hasPhoto: Boolean(photoURL) };
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
  for (const id of ['guide', 'library', 'about']) $(`#${id}-view`).hidden = id !== name;
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

function card(condition, matched = false) {
  return `<article class="condition-card"><div class="condition-art">${fishArt(condition.art)}<span>Schematic</span></div><div class="condition-body"><div class="card-meta"><span>${escape(condition.kind)}</span><span>${scopeName(condition.scope)}</span></div><h3>${escape(condition.title)}</h3><p>${escape(condition.summary)}</p>${matched ? `<p class="matches"><strong>${condition.comparisonReason ? 'Why compare:' : 'Relevant clues:'}</strong> ${escape(condition.comparisonReason || condition.matched.join(', ') || 'Tank history / water readings')}</p>` : ''}<button class="text-button" data-condition="${condition.id}">Compare the clues <span aria-hidden="true">↗</span></button></div></article>`;
}

function emergencyContent() {
  return '<p class="eyebrow">ACT ON DISTRESS, NOT JUST A DISEASE NAME</p><h2 id="detail-title">Breathing and balance come first.</h2><p class="lead">Severe gasping, inability to stay upright, poor responsiveness or fish deaths warrant urgent aquatic-veterinary help.</p><ol class="care-list"><li><strong>Support oxygen.</strong> Check aeration, surface movement and filter operation. Avoid unnecessary handling.</li><li><strong>Test the water now.</strong> Record ammonia, nitrite, pH and temperature; check salinity for marine tanks. Clear water can still be unsafe.</li><li><strong>Address an environmental problem.</strong> If readings or a recent contamination indicate a problem, use appropriately conditioned, temperature- and salinity-matched partial water changes. Avoid abrupt pH or salinity changes.</li><li><strong>Contact a fish-health professional.</strong> Tell them how many fish are affected and how fast this developed. Don’t wait for visible spots.</li></ol><p class="notice">Don’t blindly mix medicines, raise heat, add salt, or move a marine fish into freshwater. Reef invertebrates and different fish species have different tolerances.</p><a class="button secondary" href="https://fishvets.org/" target="_blank" rel="noopener noreferrer">American Association of Fish Veterinarians ↗</a>';
}

function openDetail(id) {
  const condition = CONDITIONS.find(c => c.id === id);
  if (!condition) return;
  $('#detail-content').innerHTML = `<div class="detail-art">${fishArt(condition.art)}</div><p class="eyebrow">${escape(condition.kind)} · ${scopeName(condition.scope)}</p><h2 id="detail-title">${escape(condition.title)}</h2>${condition.scientific ? `<p class="scientific">${escape(condition.scientific)}</p>` : ''}<p class="lead">${escape(condition.summary)}</p><h3>Clues that can fit</h3>${list(condition.clues)}<h3>What else could look similar?</h3><p>${escape(condition.distinguish)}</p><h3>Useful next checks</h3>${list(condition.next)}<div class="notice"><h4>How it is distinguished</h4><p>${escape(condition.confirm)}</p></div><p class="avoid"><strong>Avoid the shortcut:</strong> ${escape(condition.avoid)}</p>${condition.atlas ? '<button class="button secondary" data-action="atlas">Open the illustrated ich atlas ↗</button>' : ''}<div class="sources"><h4>Read the references</h4>${sourceLinks(condition.source)}</div><p class="quiet">This entry suggests what to investigate. It does not establish the cause in your fish.</p>`;
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
  $('#results-content').innerHTML = `<p class="eyebrow">YOUR OBSERVATIONS → USEFUL COMPARISONS</p><h2 id="results-title">Here’s what to investigate.</h2><p class="lead">These entries fit some of your observations. They are reading suggestions, not probabilities or a confirmed diagnosis.</p>${urgent}${checks}${unknown}${scope}<div class="result-label"><span>${ranked.length} patterns worth comparing</span><span>No image analysis performed</span></div><div class="results-grid">${ranked.map(condition => card(condition, true)).join('') || '<div class="notice">There is no clear match yet. Review the signs, check water quality, and seek help if the fish is unwell.</div>'}</div><section class="case-cta"><div><p class="eyebrow">BRING THE WHOLE STORY</p><h3>Get a better second opinion.</h3><p>Build a concise case for an expert or your preferred AI. You control what leaves this page.</p></div><button class="button primary" data-action="case">Prepare my case <span aria-hidden="true">↗</span></button></section><p class="quiet">A photo cannot establish every cause. Skin/gill microscopy, water tests, cultures or other professional tests may be needed. Do not delay care because a pattern looks different.</p>`;
  goStep(3);
}

function renderLibrary() {
  const query = $('#library-search').value.trim().toLowerCase();
  const water = $('#library-water').value;
  const filtered = CONDITIONS.filter(c => (water === 'all' || c.scope === 'both' || c.scope === water) && [c.title,c.scientific,c.kind,c.summary,...c.clues].filter(Boolean).join(' ').toLowerCase().includes(query));
  $('#library-count').textContent = `${filtered.length} comparison ${filtered.length === 1 ? 'entry' : 'entries'}. Drawings are schematic, not confirmed patient photos.`;
  $('#library-grid').innerHTML = filtered.map(c => card(c)).join('') || '<p class="notice">No matching entries. Try a symptom such as “breathing,” “white” or “fin.”</p>';
}

function showCase() {
  currentCase = buildCase(readInput());
  $('#case-text').value = currentCase;
  $('#copy-status').textContent = '';
  $('#case-dialog').showModal();
}

async function copyCase() {
  try { await navigator.clipboard.writeText(currentCase); $('#copy-status').textContent = 'Copied. Paste the notes into your AI conversation or share them with a fish-health professional.'; }
  catch { $('#case-text').select(); $('#copy-status').textContent = 'Automatic copying was unavailable. The notes are selected; use your device’s Copy command.'; }
}

function removePhoto() {
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = null;
  $('#photo-input').value = '';
  $('#photo-preview').replaceChildren(Object.assign(document.createElement('span'), { textContent: '＋' }));
  $('#remove-photo').hidden = true;
}

function reset() {
  form.reset(); chosen.clear(); removePhoto();
  $$('.symptom-card').forEach(button => button.setAttribute('aria-pressed', 'false'));
  $('#photo-error').textContent = ''; $('#step-one-error').textContent = '';
  $('#inline-urgent').hidden = true; $('#salinity-field').hidden = true;
  $('#results-content').replaceChildren(); $('#case-text').value = ''; currentCase = '';
  goStep(1);
}

$('#hero-fish').innerHTML = fishArt('dots', true);
$('#symptom-grid').innerHTML = SYMPTOMS.map(symptom => `<button class="symptom-card" type="button" data-symptom="${symptom.id}" aria-pressed="false"><span class="symptom-art">${fishArt(symptom.art)}<span class="selection-check" aria-hidden="true">✓</span></span><strong>${symptom.title}</strong><small>${symptom.text}</small></button>`).join('');
$('#behavior-grid').innerHTML = BEHAVIORS.map(behavior => `<label class="check-label"><input type="checkbox" name="behavior" value="${behavior.id}"><span>${behavior.label}</span></label>`).join('');
$('#source-list').innerHTML = sourceLinks(SOURCES.map(source => source.id));
$('#atlas-thumb').src = ATLAS_URL;
$('#atlas-full').src = ATLAS_URL;

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
  if (condition) openDetail(condition.dataset.condition);
  const action = event.target.closest('[data-action]')?.dataset.action;
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
  if (action === 'atlas') $('#atlas-dialog').showModal();
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
$('#library-search').addEventListener('input', renderLibrary);
$('#library-water').addEventListener('change', renderLibrary);
$('#remove-photo').addEventListener('click', removePhoto);
$('#photo-input').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  $('#photo-error').textContent = '';
  if (!file.type.startsWith('image/') || file.size > 20000000) {
    $('#photo-error').textContent = 'Choose an image under 20 MB. JPEG, PNG or WebP usually works best.';
    event.target.value = ''; return;
  }
  const newURL = URL.createObjectURL(file);
  const image = new Image();
  image.alt = 'Your fish photo, displayed locally for reference only; not analyzed.';
  image.onload = () => {
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = newURL;
    $('#photo-preview').replaceChildren(image);
    $('#remove-photo').hidden = false;
  };
  image.onerror = () => {
    URL.revokeObjectURL(newURL);
    $('#photo-error').textContent = 'This browser could not open that image. Try exporting it as JPEG or PNG.';
    event.target.value = '';
  };
  image.src = newURL;
});
window.addEventListener('pagehide', () => { if (photoURL) URL.revokeObjectURL(photoURL); });
renderLibrary();

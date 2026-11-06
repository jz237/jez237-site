// Reef section UI: "What needs help?" → coral/anemone or shrimp/crab/snail
// questions → the same result layout as the fish check. app.mjs hands over its
// step machine (goStep etc.); everything reef-specific lives here.
import { REEF_GROUPS, REEF_KINDS, REEF_CHANGES, REEF_CONDITIONS, REEF_LOOKALIKES } from './reef-data.mjs';
import { REEF_LIB_INFO, ZONES, fishMap, closeupsFor } from './library-visuals.mjs';
import { STEP_TAGS, INVERT_WARNING, reefPlanFor } from './reef-care.mjs';
import { assessReef, reefSignsFor, reefKindFor, reefConditionFor, ALTERNATIVE_TEXT } from './reef-logic.mjs';
import { reefImageFor, reefSlotsFor } from './reef-images.mjs';
import { scienceLine } from './science.mjs';
import { shopLinkFor, shopLinkHtml } from './shop-links.mjs';

export const REEF_STEPS = ['reef-kind', 'reef-signs', 'reef-changes', 'reef-results'];

// Small drawn icons (stroke only) for tiles, the "Not sure" tile and empty frames.
const PATHS = {
  fish: '<path d="M7 24c7-9 19-11 29 0-10 11-22 9-29 0Z"/><path d="M7 24 2 18v12Z"/><circle cx="31" cy="22" r="1.3" fill="currentColor" stroke="none"/><path d="M19 17c2 4 2 10 0 14"/>',
  coral: '<path d="M24 42V27m0 5-8-8v-8m8 10 7-8v-7m-7 20 9-5 4-5M14 42h20"/><circle cx="16" cy="14" r="2"/><circle cx="31" cy="10" r="2"/><circle cx="37" cy="22" r="2"/>',
  invert: '<path d="M10 32c2-10 13-16 23-11 4 2 6 6 4 10"/><path d="M10 32c4 2 9 2 13-1m-6-8 2 9m5-11 1 10m5-9-1 8"/><path d="M10 32l-6 2 4 4Z"/><path d="M37 31c3-7 6-13 9-17M35 21c2-5 5-9 9-12"/>',
  soft: '<path d="M10 29c0-9 6-15 14-15s14 6 14 15Z"/><path d="M20 29v13m8-13v13M15 42h18"/><circle cx="18" cy="23" r="1.2"/><circle cx="24" cy="20" r="1.2"/><circle cx="30" cy="23" r="1.2"/>',
  lps: '<path d="M16 42h16l-3-9H19Z"/><path d="M21 33c-4-6-7-12-5-19m8 19V12m3 21c4-6 7-12 5-19"/><circle cx="16" cy="13" r="2"/><circle cx="24" cy="11" r="2"/><circle cx="32" cy="13" r="2"/>',
  sps: '<path d="M24 42V27m0 5-8-8v-8m8 10 7-8v-7m-7 20 9-5 4-5M14 42h20"/><circle cx="16" cy="14" r="2"/><circle cx="31" cy="10" r="2"/><circle cx="37" cy="22" r="2"/>',
  anemone: '<path d="M17 42c1-6 1-11 0-15h14c-1 4-1 9 0 15Z"/><path d="M18 27c-5-4-7-10-6-16m10 16c-2-6-1-12 1-17m3 17c2-6 1-12-1-17m4 17c5-4 7-10 6-16"/>',
  shrimp: '<path d="M10 32c2-10 13-16 23-11 4 2 6 6 4 10"/><path d="M10 32c4 2 9 2 13-1m-6-8 2 9m5-11 1 10m5-9-1 8"/><path d="M10 32l-6 2 4 4Z"/><path d="M37 31c3-7 6-13 9-17M35 21c2-5 5-9 9-12"/>',
  crab: '<ellipse cx="24" cy="29" rx="10" ry="7"/><path d="M15 26c-4-2-7-6-6-11 3 0 6 2 7 5m17 6c4-2 7-6 6-11-3 0-6 2-7 5M15 31l-6 3m7 1-5 5m22-9 6 3m-7 1 5 5M21 22v-4m6 4v-4"/>',
  snail: '<circle cx="27" cy="24" r="10"/><path d="M27 24a3 3 0 1 1 3 3 6 6 0 1 1-6-7"/><path d="M6 36h31c3 0 5-2 5-5M9 36c-1-3 0-6 3-7l-3-6m5 6-1-6"/>',
  other: '<path d="m24 6 5 12 13 1-10 8 4 13-12-7-12 7 4-13-10-8 13-1Z"/>',
  pond: '<path d="M4 36c6-3 12-3 20 0s14 3 20 0"/><path d="M11 23c5-7 15-8 22 0-7 8-17 7-22 0Z"/><path d="M11 23 6 19v8Z"/><circle cx="28" cy="22" r="1.2" fill="currentColor" stroke="none"/><path d="M8 42c5-2 10-2 16 0s11 2 16 0"/>',
  koi: '<path d="M6 24c8-10 22-12 34 0-12 12-26 10-34 0Z"/><path d="M6 24 1 17v14Z"/><circle cx="34" cy="22" r="1.3" fill="currentColor" stroke="none"/><path d="M40 26c2 1 4 3 5 5"/><path d="M16 18c3 2 5 4 6 7m4-9c2 3 3 6 2 9"/>',
  goldfish: '<path d="M12 24c6-9 18-10 26 0-8 10-20 9-26 0Z"/><path d="M12 24 3 14c2 5 2 9 0 10 2 1 2 5 0 10Z"/><circle cx="32" cy="22" r="1.3" fill="currentColor" stroke="none"/><path d="M22 16c1-3 4-5 7-5"/>',
  unsure: '<circle cx="24" cy="24" r="16"/><path d="M19 19a5 5 0 1 1 7 5c-2 1-2 2-2 4"/><circle cx="24" cy="33" r="1.3" fill="currentColor" stroke="none"/>',
};
export const reefIcon = (name, cls = 'reef-icon') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name] || PATHS.unsure}</svg>`;

const groupIcon = (group, kind) => group === 'pond' ? (kind === 'koi' || kind === 'goldfish' ? kind : 'pond') : kind && PATHS[kind] ? kind : group === 'invert' ? 'invert' : 'coral';
const GROUP_TEXT = {
  coral: { ask: 'What kind of coral?', step: 'Kind of coral', scope: 'Coral or anemone', meta: 'Coral & anemone', all: 'See all coral entries ↗' },
  invert: { ask: 'What kind of animal?', step: 'Kind of animal', scope: 'Shrimp, crab or snail', meta: 'Shrimp, crab, snail', all: 'See all shrimp, crab & snail entries ↗' },
  pond: { ask: 'What kind of pond fish?', step: 'Kind of pond fish', scope: 'Pond fish', meta: 'Pond fish', all: 'See all pond entries ↗' },
};
const groupText = group => GROUP_TEXT[group] || GROUP_TEXT.coral;
const shortName = title => title.replace(/\s*\(.*\)$/, '');

export function createReef({ $, $$, escape, goStep, badge, autoAdvance, switchView }) {
  const state = { group: '', kind: '', kindPicked: false, sign: '', changes: new Set(), chosen: [] };
  $$('[data-help-icon]').forEach(el => { el.outerHTML = reefIcon(el.dataset.helpIcon, 'help-icon'); });
  const quickTitle = $('#quick-compare-title')?.textContent || '';
  $('#quick-compare-dialog')?.addEventListener('close', () => { $('#quick-compare-title').textContent = quickTitle; });

  const input = () => ({ group: state.group, kind: state.kind, sign: state.sign, changes: [...state.changes], chosen: [...state.chosen] });
  const groupInfo = () => REEF_GROUPS.find(g => g.id === state.group);

  // A picture, or a calm "Picture coming soon" frame for a spot with no picture yet
  // (none left in the reef path; the frame stays as a safe fallback).
  function picture(image, icon, { label = 'Picture coming soon', cls = '' } = {}) {
    if (image) return `<img src="${escape(image.url)}" width="${image.width || 362}" height="${image.height || 362}" alt="${escape(image.alt || '')}" data-reef-image="${escape(image.id || '')}" loading="lazy" decoding="async">`;
    return `<span class="reef-ph ${cls}" data-placeholder="${icon}">${reefIcon(icon)}<small>${escape(label)}</small></span>`;
  }

  function renderKinds() {
    const kinds = REEF_KINDS[state.group] || [];
    $('#reef-kind-title').textContent = groupText(state.group).ask;
    $('#reef-kind-hint').textContent = state.group === 'invert' ? 'For saltwater (reef) tanks. Optional—pick the closest, or Not sure.' : 'Optional. Pick the closest, or Not sure.';
    const tiles = [...kinds, { id: '', title: 'Not sure', text: 'Show every sign' }];
    $('#reef-kind-grid').innerHTML = tiles.map(k => `<button type="button" class="reef-tile" data-reef-kind="${k.id}" aria-pressed="${String(state.kindPicked && k.id === state.kind)}">${picture(reefImageFor(state.group, k.id, '', 'kinds'), k.id ? groupIcon(state.group, k.id) : 'unsure', { label: '', cls: 'reef-ph-tile' })}<strong>${escape(k.title)}</strong><small>${escape(k.text)}</small></button>`).join('');
  }

  function renderSigns() {
    $('#reef-sign-grid').innerHTML = reefSignsFor(state.group, state.kind).map(s => `<button type="button" class="symptom-card reef-sign" data-reef-sign="${s.id}" aria-pressed="${String(s.id === state.sign)}"><span class="symptom-art reef-art">${picture(reefImageFor(state.group, s.id, state.kind, 'signs'), groupIcon(state.group, state.kind))}<span class="selection-check" aria-hidden="true">✓</span></span><strong>${escape(s.title)}</strong><small>${escape(s.text)}</small></button>`).join('');
  }

  function renderChanges() {
    $('#reef-change-grid').innerHTML = (REEF_CHANGES[state.group] || []).map(c => `<button type="button" class="reef-chip" data-reef-change="${c.id}" aria-pressed="${String(state.changes.has(c.id))}">${escape(c.title)}</button>`).join('');
  }

  function stepItem(step) {
    const [lead, ...rest] = step.text.split(/(?<=[.!?])\s/);
    const tag = step.tag ? `<em class="step-tag step-tag-${step.tag}">${escape(STEP_TAGS[step.tag])}</em>` : '';
    const water = state.group === 'pond' ? 'pond' : 'marine';
    return `<li${step.tag ? ` data-step-tag="${step.tag}"` : ''}><span><strong>${escape(lead)}</strong>${rest.length ? `<small>${escape(rest.join(' '))}</small>` : ''}${tag}${shopLinkHtml(shopLinkFor(step.text, '', water), escape)}</span></li>`;
  }

  function todoCard(c) {
    const plan = c.plan;
    if (!plan) return '';
    return `<section class="todo-card reef-todo" data-reef-todo="${c.id}"><h3>What to do now</h3><ol class="todo-steps reef-steps">${plan.steps.map(stepItem).join('')}</ol><dl class="todo-facts"><div><dt>Usual fix</dt><dd>${escape(plan.treatment)}</dd></div><div><dt>Typical recovery</dt><dd>${escape(plan.recovery)}</dd></div></dl>${plan.product ? '<p class="label-note">Amounts: follow the product label.</p>' : ''}</section>`;
  }

  const warning = text => text ? `<p class="reef-flag invert-warning" role="note"><strong>No copper</strong> ${escape(text)}</p>` : '';

  function alternativeCard(c) {
    const notes = [c.moreUrgent ? `<b class="alt-danger">${escape(ALTERNATIVE_TEXT.danger)}</b>` : '', c.treatmentNote === 'different' ? `<span class="alt-treatment">Different fix — check first</span>` : ''].filter(Boolean);
    return `<div class="alternative" data-reef-alternative="${c.id}" data-more-urgent="${c.moreUrgent}"><button type="button" class="alt-pick" data-reef-choose="${c.id}" aria-label="This looks more like mine: ${escape(c.title)}">${picture(reefImageFor(state.group, c.id, state.kind), groupIcon(state.group, state.kind), { label: '', cls: 'reef-ph-thumb' })}<span class="alt-text"><strong>${escape(c.title)}</strong><small class="alt-check">${escape(c.comparisonReason)}</small>${notes.length ? `<small class="alt-note">${notes.join('')}</small>` : ''}</span></button><button type="button" class="alt-compare" data-reef-compare="${c.id}">Compare</button></div>`;
  }

  function renderResults() {
    const result = assessReef(input()), first = result.primary;
    const kind = reefKindFor(state.group, state.kind);
    const where = kind?.title || groupInfo()?.title || '';
    const hero = first ? picture(reefImageFor(state.group, first.id, state.kind), groupIcon(state.group, state.kind)) : '';
    const focus = first ? `<article class="result-focus reef-result" data-reef-result="${first.id}" data-urgency="${first.urgencyLevel}"><div class="result-head">${badge(first.urgencyLevel)}<p class="result-summary">${escape(first.summary)}</p></div><button type="button" class="result-image" data-reef-condition="${first.id}" aria-label="More about ${escape(first.title)}">${hero}<span>More info ↗</span></button><div class="diagnosis-reason"><strong>Why we think so</strong><p>${escape(first.reason)}</p></div>${todoCard(first)}</article>` : '<section class="notice no-diagnosis"><h2>Not enough to go on yet.</h2><p>Try the closest picture again, and test your water.</p></section>';
    const cards = result.alternatives.map(alternativeCard).join('');
    const natural = result.naturalNote ? `<p class="natural-note">${escape(result.naturalNote)}</p>` : '';
    const couldAlso = cards || natural ? `<section class="could-also"><h2 class="subheading">Could also be</h2>${cards ? `<p class="could-also-hint">Tap the one that looks more like yours.</p><div class="alternatives">${cards}</div>` : ''}${natural}</section>` : '';
    $('#reef-results-content').innerHTML = `<h1 id="reef-results-title" class="question-title results-title">${first ? `<span>Most likely:</span> ${escape(first.title)}` : escape(result.title)}</h1>${first ? scienceLine(first.id) : ''}<p class="question-hint result-hint">${where ? `${escape(where)} · ` : ''}${result.chosen ? 'Your pick from the look-alikes' : 'Our best guess from your answers'}—a hobby guide, not a vet.</p>${warning(result.warning)}${focus}${couldAlso}<button type="button" class="text-button" data-action="reef-library">${escape(groupText(state.group).all)}</button>`;
    goStep('reef-results');
  }

  function choose(id) {
    const original = assessReef({ ...input(), chosen: [] }).primary?.id;
    state.chosen = id === original ? [] : [...state.chosen, id];
    $('#quick-compare-dialog').open && $('#quick-compare-dialog').close();
    renderResults();
  }

  function openCompare(id) {
    const result = assessReef(input()), first = result.primary, other = result.alternatives.find(c => c.id === id);
    if (!first || !other) return;
    const side = c => `<figure data-compare-side="${c.id}">${picture(reefImageFor(state.group, c.id, state.kind), groupIcon(state.group, state.kind), { cls: 'reef-ph-compare' })}<figcaption>${escape(c.title)}</figcaption></figure>`;
    $('#quick-compare-title').textContent = 'Which looks more like yours?';
    $('#quick-compare-content').innerHTML = `<div class="quick-compare">${side(first)}${side(other)}</div><p class="quick-compare-check">${escape(other.comparisonReason)}</p><div class="quick-compare-actions"><button type="button" class="button primary" data-reef-choose="${other.id}">Mine looks more like ${escape(shortName(other.title))}</button><button type="button" class="button secondary" data-action="close-dialog">Close</button></div>`;
    $('#quick-compare-dialog').showModal();
  }

  function gallery(c) {
    const slots = reefSlotsFor(c.group, c.id), filled = slots.filter(s => s.image);
    const shown = filled.length ? filled : slots;
    const note = filled.length ? `<small class="image-origin-note">AI illustrations, drawn the way it usually looks in a home ${c.group === 'pond' ? 'pond' : 'tank'}.</small>` : '';
    return `<div class="reef-gallery" data-reef-gallery="${c.id}">${shown.map(slot => `<figure data-reef-slot="${slot.id}">${picture(slot.image, groupIcon(c.group))}<figcaption>${escape(slot.image?.caption || slot.label)}</figcaption></figure>`).join('')}</div>${note}`;
  }

  // Visual guide (Nov 6 2026), same layout as the fish pages: four numbered close-ups,
  // where to look (pond: the fish map), how it changes, and the main look-alike.
  const zoomAttrs = (src, title, alt) => `data-zoom-src="${escape(src)}" data-zoom-title="${escape(title)}" data-zoom-alt="${escape(alt || '')}"`;
  const img = im => `<img src="${escape(im.url)}" width="${im.width || 362}" height="${im.height || 362}" alt="${escape(im.alt || '')}" loading="lazy" decoding="async">`;
  function infographic(c) {
    const info = REEF_LIB_INFO[c.id], close = closeupsFor(c.id);
    if (!info && !close.length) return '';
    const closeups = close.length ? `<ol class="ig-closeups">${close.map((im, i) => `<li><button type="button" class="ig-zoom" ${zoomAttrs(im.url, `${c.title} · ${im.caption || ''}`, im.alt)} aria-label="Enlarge: ${escape(im.caption || '')}">${img(im)}<b aria-hidden="true">${i + 1}</b></button><span>${escape(im.caption || '')}</span></li>`).join('')}</ol>` : '';
    const where = !info ? '' : info.zones
      ? `<div class="ig-where"><h4>Where it shows</h4>${fishMap(info.zones)}<p>${info.zones.map(z => `<span class="ig-zone">${escape(ZONES[z])}</span>`).join('')}</p></div>`
      : `<div class="ig-where ig-look"><h4>Where to look</h4><p>${info.look.map(l => `<span class="ig-zone">${escape(l)}</span>`).join('')}</p></div>`;
    const time = info ? `<div class="ig-time"><h4>How it can change</h4><ol class="ig-timeline">${['Early', 'Common', 'Advanced'].map((label, i) => `<li><strong>${label}</strong><span>${escape(info.time[i])}</span></li>`).join('')}</ol><small class="ig-time-note">Not every fish goes through every stage.</small></div>` : '';
    const [lookId, lookReason] = (REEF_LOOKALIKES[c.id] || []).find(([id]) => id) || [];
    const look = lookId && reefConditionFor(lookId), lookImage = look && reefImageFor(look.group, look.id);
    const notThis = look ? `<div class="ig-notthis"><h4>Not this?</h4><div>${lookImage ? `<button type="button" class="ig-zoom" ${zoomAttrs(lookImage.url, look.title, lookImage.alt)} aria-label="Enlarge ${escape(look.title)}">${img(lookImage)}</button>` : ''}<p><strong>${escape(look.title)}</strong>${escape(lookReason)}<button type="button" class="text-button" data-reef-condition="${look.id}">Open ${escape(shortName(look.title))} →</button></p></div></div>` : '';
    return `<section class="infographic" data-infographic="${c.id}" aria-label="${escape(c.title)} visual guide"><p class="ig-eyebrow">VISUAL GUIDE</p>${closeups}${where || time ? `<div class="ig-row">${where}${time}</div>` : ''}${notThis}<small class="image-origin-note">AI illustrations.</small></section>`;
  }

  function openDetail(id) {
    const base = reefConditionFor(id);
    if (!base) return;
    // Opened from a result: same urgency as the result showed (e.g. peeling flesh = act today).
    const r = state.group && !$('#guide-view').hidden && !$('[data-step="reef-results"]').hidden ? assessReef(input()) : null;
    const shown = r && [r.primary, ...r.alternatives].find(x => x?.id === id);
    const c = shown ? { ...base, urgency: shown.urgencyLevel } : base;
    const scope = groupText(c.group).scope;
    $('#detail-content').innerHTML = `<p class="eyebrow">${escape(c.kind)} · ${escape(scope)}</p><h2 id="detail-title">${escape(c.title)}</h2>${scienceLine(c.id)}${badge(c.urgency)}<p class="lead">${escape(c.summary)}</p>${c.group === 'invert' ? warning(INVERT_WARNING) : ''}${infographic(c)}${gallery(c)}<h3>What to look for</h3><ul>${c.clues.map(x => `<li>${escape(x)}</li>`).join('')}</ul><h3>Easy to confuse with</h3><p>${escape(c.distinguish)}</p>${todoCard({ ...c, plan: reefPlanFor(c.id) })}<p class="avoid"><strong>Avoid:</strong> ${escape(c.avoid)}</p>`;
    $('#detail-dialog').showModal();
  }

  // groups: which sections to list ('reef' = corals + inverts, 'pond' = pond fish).
  function renderLibrary(query = '', which = 'reef') {
    const q = query.trim().toLowerCase();
    const groups = which === 'pond' ? ['pond'] : ['coral', 'invert'];
    const entries = REEF_CONDITIONS.filter(c => groups.includes(c.group) && [c.title, c.kind, c.summary, ...c.clues].join(' ').toLowerCase().includes(q));
    $('.slot-explanation').textContent = which === 'pond' ? 'Pond pictures are AI illustrations, drawn the way the problem usually looks in a garden pond or an inspection bowl.' : 'Coral, anemone, shrimp, crab and snail pictures are AI illustrations, drawn the way the problem usually looks in a home tank.';
    $('#library-count').textContent = `${entries.length} ${which === 'pond' ? 'pond fish' : 'reef & invert'} entries`;
    $('#library-grid').innerHTML = entries.map(c => { const slots = reefSlotsFor(c.group, c.id), n = slots.filter(s => s.image).length; return `<article class="condition-card visual-card reef-card" data-reef-entry="${c.id}"><button type="button" class="card-image${n ? ' filled' : ''}" data-reef-condition="${c.id}" aria-label="Open ${escape(c.title)}">${picture(reefImageFor(c.group, c.id), groupIcon(c.group))}<span class="slot-count">${n} / ${slots.length} pictures</span></button><div class="condition-body"><div class="card-meta"><span>${escape(c.kind)}</span><span>${escape(groupText(c.group).meta)}</span></div><h3>${escape(c.title)}</h3>${badge(c.urgency)}<p>${escape(c.summary)}</p><div class="card-actions"><button type="button" class="text-button" data-reef-condition="${c.id}">Open page ↗</button></div></div></article>`; }).join('') || `<p class="notice">No matching entries. Try ${which === 'pond' ? '“worm”, “ulcer” or “white”' : '“white”, “molt” or “pest”'}.</p>`;
  }

  function start(group) {
    reset();
    state.group = group;
    goStep('reef-kind');
  }

  function reset() {
    Object.assign(state, { group: '', kind: '', kindPicked: false, sign: '', chosen: [] });
    state.changes.clear();
    ['#reef-kind-grid', '#reef-sign-grid', '#reef-change-grid', '#reef-results-content'].forEach(sel => $(sel)?.replaceChildren());
  }

  const owns = name => REEF_STEPS.includes(name);
  const err = text => { $('#flow-error').textContent = text; };

  return {
    owns,
    active: () => Boolean(state.group),
    group: () => state.group,
    reset,
    start,
    renderLibrary,
    progressFor(name) {
      if (!owns(name) || name === 'reef-results') return null;
      return { 'reef-kind': [1, groupText(state.group).step], 'reef-signs': [2, 'What you see'], 'reef-changes': [3, 'Recent changes'] }[name];
    },
    // Called by goStep for every reef step: draw that step's choices.
    onStep(name) {
      if (name !== 'reef-results') state.chosen = [];
      if (name === 'reef-kind') renderKinds();
      if (name === 'reef-signs') renderSigns();
      if (name === 'reef-changes') renderChanges();
    },
    nextLabel(step) {
      if (step === 'reef-kind') return state.kindPicked ? 'Continue →' : 'Skip →';
      if (step === 'reef-changes') return 'See my results →';
      return 'Continue →';
    },
    next(step) {
      if (step === 'reef-kind') goStep('reef-signs');
      else if (step === 'reef-signs') { if (!state.sign) { err('Choose the closest picture.'); return; } goStep('reef-changes'); }
      else if (step === 'reef-changes') renderResults();
    },
    previous(step) {
      return { 'reef-kind': 'welcome', 'reef-signs': 'reef-kind', 'reef-changes': 'reef-signs', 'reef-results': 'reef-changes' }[step] || 'welcome';
    },
    handleClick(event) {
      const t = event.target;
      const startTile = t.closest('[data-reef-start]');
      if (startTile) { start(startTile.dataset.reefStart); return true; }
      const kindTile = t.closest('[data-reef-kind]');
      if (kindTile) {
        const kind = kindTile.dataset.reefKind;
        if (kind !== state.kind) { state.sign = ''; state.changes.clear(); }
        state.kind = kind; state.kindPicked = true;
        $$('[data-reef-kind]').forEach(b => b.setAttribute('aria-pressed', String(b === kindTile)));
        $('#next-button').textContent = 'Continue →'; err('');
        autoAdvance(); return true;
      }
      const signTile = t.closest('[data-reef-sign]');
      if (signTile) {
        state.sign = signTile.dataset.reefSign;
        $$('[data-reef-sign]').forEach(b => b.setAttribute('aria-pressed', String(b === signTile)));
        err(''); autoAdvance(); return true;
      }
      const chip = t.closest('[data-reef-change]');
      if (chip) {
        const id = chip.dataset.reefChange;
        if (state.changes.has(id)) state.changes.delete(id); else state.changes.add(id);
        chip.setAttribute('aria-pressed', String(state.changes.has(id)));
        return true;
      }
      const pick = t.closest('[data-reef-choose]');
      if (pick) { choose(pick.dataset.reefChoose); return true; }
      const compare = t.closest('[data-reef-compare]');
      if (compare) { openCompare(compare.dataset.reefCompare); return true; }
      const entry = t.closest('[data-reef-condition]');
      if (entry) { openDetail(entry.dataset.reefCondition); return true; }
      const action = t.closest('[data-action]')?.dataset.action;
      if (action === 'reef-edit') { goStep('reef-kind'); return true; }
      if (action === 'reef-library') { switchView('library'); return true; }
      return false;
    },
  };
}

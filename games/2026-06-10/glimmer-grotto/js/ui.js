// DOM HUD, shop, journal, toasts.

import { GEM_DEF, TREASURE_DEF, UPGRADES, WONDERS } from './config.js';
import { sfx } from './audio.js';

export const state = {
  wallet: 0,
  journal: {},            // id -> true (gems, treasures, wonders)
  stats: { dug: 0, banked: 0 },
};

const $ = id => document.getElementById(id);

export function toast(text, icon) {
  const t = document.createElement('div');
  t.className = 'toast';
  if (icon) {
    const img = document.createElement('img');
    img.src = `assets/${icon}.png`;
    t.appendChild(img);
  }
  t.appendChild(document.createTextNode(text));
  $('toasts').appendChild(t);
  setTimeout(() => t.classList.add('bye'), 2600);
  setTimeout(() => t.remove(), 3200);
}

export function updateHUD(player) {
  $('gemCount').textContent = state.wallet;
  const bagEl = $('bagChip');
  $('bagCount').textContent = `${player.bag.length}/${player.bagCap}`;
  bagEl.classList.toggle('full', player.bag.length >= player.bagCap);
  const eFill = $('energyFill');
  eFill.style.width = (player.energy / player.energyMax * 100) + '%';
  eFill.style.background = player.energy < player.energyMax * 0.25
    ? 'linear-gradient(90deg,#e0667e,#e8a33d)'
    : 'linear-gradient(90deg,#e8a33d,#ffd87f)';
  const depth = Math.max(0, Math.round((player.y / 32 - 14) * 0.5));
  $('depthChip').textContent = depth + ' m';
}

export function showRestHint(text) {
  const el = $('restHint');
  if (text) { el.textContent = text; el.classList.add('show'); }
  else el.classList.remove('show');
}

// ---------------- shop ----------------
let playerRef = null, onBuy = null;
export function initUI(player, callbacks) {
  playerRef = player;
  onBuy = callbacks.buy;
  document.querySelectorAll('.panel .close').forEach(b =>
    b.addEventListener('click', () => hidePanel(b.dataset.close)));
  $('journalBtn').addEventListener('click', () => togglePanel('journalPanel'));
  $('soundBtn').addEventListener('click', callbacks.mute);
}

export function togglePanel(id) {
  const el = $(id);
  const wasHidden = el.classList.contains('hidden');
  hideAllPanels();
  if (wasHidden) {
    el.classList.remove('hidden');
    if (id === 'journalPanel') { renderJournal(); sfx.journal?.(); }
    if (id === 'shopPanel') renderShop();
  }
  return wasHidden;
}
export function hidePanel(id) { $(id).classList.add('hidden'); }
export function hideAllPanels() {
  ['shopPanel', 'journalPanel'].forEach(hidePanel);
}
export function anyPanelOpen() {
  return ['shopPanel', 'journalPanel'].some(id => !$(id).classList.contains('hidden'));
}

export function renderShop() {
  const rows = $('shopRows');
  rows.innerHTML = '';
  for (const key of Object.keys(UPGRADES)) {
    const up = UPGRADES[key];
    const cur = playerRef.upgrades[key];
    const next = up.tiers[cur + 1];
    const row = document.createElement('div');
    row.className = 'shopRow';
    const img = document.createElement('img');
    img.src = `assets/${up.icon}.png`;
    const info = document.createElement('div');
    info.className = 'info';
    const tierName = `${up.name} ${['I', 'II', 'III', 'IV'][next ? cur + 1 : cur]}`;
    info.innerHTML = `<div class="name">${tierName}</div>
      <div class="desc">${next ? next.desc : up.tiers[cur].desc + ' (fully upgraded)'}</div>`;
    const btn = document.createElement('button');
    btn.className = 'buyBtn';
    if (!next) {
      btn.classList.add('owned');
      btn.textContent = '✓ owned';
      btn.disabled = true;
    } else {
      btn.innerHTML = `<img src="assets/gem_amber.png" alt=""> ${next.cost}`;
      btn.disabled = state.wallet < next.cost;
      btn.addEventListener('click', () => {
        if (state.wallet < next.cost) return;
        state.wallet -= next.cost;
        playerRef.upgrades[key]++;
        if (key === 'satchel') { /* cap is a getter */ }
        sfx.buy();
        toast(`${tierName} acquired!`, up.icon);
        onBuy?.();
        renderShop();
        updateHUD(playerRef);
      });
    }
    row.append(img, info, btn);
    rows.appendChild(row);
  }
}

// ---------------- journal ----------------
const JOURNAL_ENTRIES = [
  ...Object.entries(GEM_DEF).map(([id, d]) => ({ id, name: d.name, sprite: 'gem_' + id,
    flavor: `Worth ${d.value} shard${d.value > 1 ? 's' : ''}.` })),
  ...Object.entries(TREASURE_DEF).map(([id, d]) => ({ id, name: d.name,
    sprite: id === 'geode' ? 'geode_open' : d.sprite, flavor: d.flavor })),
  ...Object.entries(WONDERS).map(([id, d]) => ({ id: 'wonder_' + id, name: d.name,
    sprite: d.sprite, flavor: d.flavor })),
];

export function renderJournal() {
  const grid = $('journalGrid');
  grid.innerHTML = '';
  let found = 0;
  for (const e of JOURNAL_ENTRIES) {
    const has = !!state.journal[e.id];
    if (has) found++;
    const card = document.createElement('div');
    card.className = 'jCard' + (has ? '' : ' locked');
    card.innerHTML = `<img src="assets/${e.sprite}.png" alt="">
      <div class="nm">${has ? e.name : ''}</div>
      <div class="fl">${has ? e.flavor : 'Still undiscovered…'}</div>`;
    grid.appendChild(card);
  }
  $('journalSub').textContent =
    `${found} of ${JOURNAL_ENTRIES.length} wonders collected — no hurry at all.`;
}

export function discover(id, name, icon) {
  if (state.journal[id]) return false;
  state.journal[id] = true;
  toast(`${name} — added to your journal ✦`, icon);
  return true;
}

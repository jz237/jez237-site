// The two side pages: "Can I use this medicine in my tank?" (medicine.mjs) and
// "Stop it before it starts" (prevent.mjs). app.mjs owns view switching; this
// module draws the pages and keeps the medicine answer live as choices change.
import { VERDICTS, MED_WATERS, MEDICINES, residentsFor, medicinesFor, checkMedicine, headline } from './medicine.mjs';
import { PREVENT_SECTIONS, preventImage } from './prevent.mjs';
import { SHOP } from './shop-links.mjs';

export function createExtras({ $, escape }) {
  const state = { water: '', medicine: '', residents: new Set(), hospital: false };
  const verdictBadge = v => `<span class="med-verdict med-${v}" data-verdict="${v}">${escape(VERDICTS[v].label)}</span>`;

  function drawWaters() {
    $('#med-water').innerHTML = MED_WATERS.map(w => `<button type="button" class="med-chip" data-med-water="${w.id}" aria-pressed="${String(state.water === w.id)}">${escape(w.title)}</button>`).join('');
  }

  function drawMedicines() {
    const list = state.water ? medicinesFor(state.water) : MEDICINES;
    if (state.medicine && !list.some(m => m.id === state.medicine)) state.medicine = '';
    $('#med-list').innerHTML = list.map(m => `<button type="button" class="med-card" data-med="${m.id}" aria-pressed="${String(state.medicine === m.id)}"><strong>${escape(m.title)}</strong><small>${escape(m.text)}</small><em>For: ${escape(m.for)}</em></button>`).join('');
  }

  function drawResidents() {
    const list = residentsFor(state.water).filter(r => !r.always);
    $('#med-residents-block').hidden = !state.water;
    $('#med-residents').innerHTML = list.map(r => `<button type="button" class="med-chip" data-med-resident="${r.id}" aria-pressed="${String(state.residents.has(r.id))}">${escape(r.title)}${r.text ? `<small>${escape(r.text)}</small>` : ''}</button>`).join('');
    $('#med-hospital').setAttribute('aria-pressed', String(state.hospital));
    $('#med-hospital').querySelector('span').textContent = state.water === 'pond' ? 'I’m treating in a separate tub' : 'I’m treating in a separate hospital tank';
  }

  function drawResult() {
    const out = $('#med-result');
    const result = state.water && state.medicine ? checkMedicine({ medicine: state.medicine, water: state.water, residents: [...state.residents], hospital: state.hospital }) : null;
    if (!result) {
      out.innerHTML = `<p class="med-empty">${state.water ? 'Pick a medicine to see the answer.' : 'Pick where you’re treating and the medicine.'}</p>`;
      return;
    }
    // In hospital-tank mode these are the rows that apply there (with their hospital-tank wording).
    const rows = result.shown
      .map(r => `<li data-med-row="${r.id}">${verdictBadge(r.verdict)}<span><strong>${escape(r.title)}</strong><small>${escape(r.reason)}</small></span></li>`).join('');
    out.innerHTML = `<article class="med-answer" data-med-answer="${result.verdict}"><p class="eyebrow">YOUR ANSWER</p>${verdictBadge(result.verdict)}<h2>${escape(headline(result))}</h2><ul class="med-rows">${rows}</ul><p class="med-tip"><strong>Tip</strong> ${escape(result.tip)}</p>${SHOP?.medicines?.[result.medicine.id] && result.verdict !== 'kills' && result.verdict !== 'avoid' ? `<p class="med-shop"><a class="shop-link" href="${escape(SHOP.medicines[result.medicine.id].href)}">${escape(SHOP.medicines[result.medicine.id].label)} →</a></p>` : ''}<p class="label-note">Amounts: always follow the product label. Take out carbon while treating.</p>${!['ok', 'avoid'].includes(result.verdict) && !state.hospital && !result.rows.some(r => r.verdict === 'kills' && r.id === 'scaleless') ? '<button type="button" class="text-button" data-view="prevent">How to set up a hospital tank →</button>' : ''}</article>`;
  }

  function renderMedicine(presetWater = '') {
    if (presetWater && !state.water) state.water = presetWater;
    drawWaters(); drawMedicines(); drawResidents(); drawResult();
  }

  function renderPrevent() {
    if ($('#prevent-sections').childElementCount) return;
    $('#prevent-sections').innerHTML = PREVENT_SECTIONS.map(s => `<section class="prevent-section" data-prevent="${s.id}"><div class="prevent-head"><p class="eyebrow">${escape(s.who.toUpperCase())}</p><h2>${escape(s.title)}</h2><p>${escape(s.lead)}</p></div><ol class="prevent-cards">${s.cards.map(c => { const img = preventImage(c.image); return `<li class="prevent-card"><img src="${escape(img.url)}" width="${img.width}" height="${img.height}" alt="${escape(img.alt)}" loading="lazy" decoding="async"><div><h3>${escape(c.title)}</h3><p>${escape(c.text)}</p></div></li>`; }).join('')}</ol></section>`).join('');
  }

  function handleClick(event) {
    const t = event.target;
    const water = t.closest('[data-med-water]');
    if (water) {
      if (water.dataset.medWater !== state.water) { state.water = water.dataset.medWater; state.residents.clear(); }
      drawWaters(); drawMedicines(); drawResidents(); drawResult(); return true;
    }
    const med = t.closest('[data-med]');
    if (med) {
      state.medicine = med.dataset.med;
      $('#med-list').querySelectorAll('[data-med]').forEach(b => b.setAttribute('aria-pressed', String(b === med)));
      drawResult();
      if (matchMedia('(max-width: 720px)').matches) $('#med-residents-block').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
    const resident = t.closest('[data-med-resident]');
    if (resident) {
      const id = resident.dataset.medResident;
      if (state.residents.has(id)) state.residents.delete(id); else state.residents.add(id);
      resident.setAttribute('aria-pressed', String(state.residents.has(id)));
      drawResult(); return true;
    }
    if (t.closest('#med-hospital')) { state.hospital = !state.hospital; drawResidents(); drawResult(); return true; }
    return false;
  }

  return { renderMedicine, renderPrevent, handleClick };
}

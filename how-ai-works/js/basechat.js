/* Chapter 8, extra — one small model before and after chat training, answering
   the same questions. Nothing runs here: data/chat.json holds replies that were
   recorded ahead of time from SmolLM2-360M (base) and SmolLM2-360M-Instruct.
   { base, chat: model names, pairs: [{ q, base, chat }] } */
(function () {
  'use strict';
  const L = Lab, root = L.$('#baseVsChat');
  if (!root) return;
  const qs = L.$('#bcQuestions', root), base = L.$('#bcBase', root), chat = L.$('#bcChat', root), note = L.$('#bcNote', root);
  if (!qs || !base || !chat || !note) return;                 // the block was changed: do nothing
  const fill = (el, kids) => { el.textContent = ''; kids.forEach(k => el.append(k)); };
  const usable = d => !!d && Array.isArray(d.pairs) && d.pairs.length > 0 &&
    d.pairs.every(p => p && typeof p.q === 'string' && typeof p.base === 'string' && typeof p.chat === 'string');

  function start(data) {
    function show(i) {
      const p = data.pairs[i];
      Array.from(qs.children).forEach((b, j) => { b.classList.toggle('active', j === i); b.setAttribute('aria-pressed', String(j === i)); });
      // the base model was handed the bare question as text to continue; the chat model got it as a user turn
      fill(base, [L.h('span', { class: 'q', text: p.q }), L.h('span', { class: 'a', text: p.base.replace(/\n{3,}/g, '\n\n') + ' …' })]);
      fill(chat, [L.h('span', { class: 'q', text: 'You: ' + p.q }), L.h('span', { class: 'a', text: '\n\n' + p.chat + (p.chat.length > 300 ? ' …' : '') })]);
    }
    fill(qs, data.pairs.map((p, i) => L.h('button', { class: 'lab-button', type: 'button', 'aria-pressed': 'false', text: p.q, onclick: () => show(i) })));
    ['base', 'chat'].forEach(k => L.$$('[data-bc="' + k + '"]', root).forEach(e => { if (typeof data[k] === 'string' && data[k]) e.textContent = data[k]; }));
    show(0);
  }

  fetch('data/chat.json')
    .then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then(d => { if (!usable(d)) throw new Error('unexpected data'); start(d); })
    .catch(() => { note.textContent = 'The recorded replies did not load, so this comparison is switched off. Reloading the page may fix it.'; });
})();

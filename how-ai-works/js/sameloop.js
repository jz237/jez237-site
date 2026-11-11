/* Training chapter, "Same loop, different job": a fresh copy of the hero's shape network and a
   fresh copy of this page's language model, trained side by side from random weights. Both copies
   are private to this panel; the models the rest of the page uses are not touched. The numbers in
   each row are read from the copies as they stand: one example, the odds given to its right
   answer, the loss that makes, and then a real training step on a fresh batch. */
(function () {
  'use strict';
  const L = Lab, C = L.C, M = window.LabMLP, ai = L.ai, root = L.$('#sameLoop'), cv = L.$('#loopCanvas');
  if (!root || !cv || !M || !ai || !ai.model) return;
  const S = M.shapes, K = S.NAMES.length, V = ai.V, data = ai.data.corpus, GPT = ai.model.constructor, CAP = 600, B = 8, N = S.N;
  const mono = 'ui-monospace,Menlo,Consolas,monospace';
  const f = (side, k) => root.querySelector('[data-loop="' + side + '"] [data-k="' + k + '"]');
  const word = m => (m === V.END ? 'a full stop' : '“' + L.esc(ai.word(m)) + '”');
  const best = p => { let b = 0; for (let j = 1; j < p.length; j++) if (p[j] > p[b]) b = j; return b; };
  const HW = window.HERO_WEIGHTS, bRun = L.$('#loopRun'), bStep = L.$('#loopStep'), note = L.$('#loopNote');
  let net = null, gpt = null, r = null, order = [], steps = 0, hs = [], ht = [], es = null, et = null, ex = null, running = false, shown = -1;

  function pick() {
    const c = Math.floor(r() * K);
    let sq;
    do { sq = data[Math.floor(r() * data.length)]; } while (sq.length < 4);
    const at = 2 + Math.floor(r() * (sq.length - 2));      // the model sees sq[0..at-1] and must predict sq[at]
    ex = { c, x: S.make(c, r), ctx: sq.slice(0, at), y: sq[at] };
  }
  function fresh() {
    const seed = ((Date.now() & 0xffff) << 1) | 1;
    r = L.rng(seed);
    if (!net) { net = new M.MLP(M.SIZES, seed); gpt = new GPT(ai.model.cfg, seed); } else { net.init(seed); gpt.init(seed); }
    order = []; steps = 0; hs = []; ht = []; es = et = null; running = false;
    pick(); show();
  }
  function ready() { if (!net) fresh(); }

  // one real training step for each: a fresh batch, the loss on it, every weight nudged
  function stepBoth() {
    const xs = [], ys = [];
    for (let i = 0; i < M.BATCH; i++) { const c = Math.floor(r() * K); xs.push(S.make(c, r)); ys.push(c); }
    const ls = net.trainBatch(xs, ys, M.LR);
    if (order.length < B) { order = data.slice(); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; } }
    const lt = gpt.trainBatch(order.splice(0, B), 0.012, id => (r() < 0.03 ? V.UNK : id));
    es = es == null ? ls : es * 0.9 + ls * 0.1; et = et == null ? lt : et * 0.9 + lt * 0.1;
    hs.push(Math.exp(-es)); ht.push(Math.exp(-et)); steps++;
    if (steps % 120 === 0) pick();
  }

  function row(side, right, guess, ok, p, count) {
    f(side, 'right').innerHTML = right;
    const g = f(side, 'guess'); g.innerHTML = guess; g.className = ok ? 'ok' : 'no';
    f(side, 'odds').textContent = L.pct(p);
    f(side, 'loss').innerHTML = '−ln(' + p.toFixed(p < 0.1 ? 3 : 2) + ') = <strong>' + (-Math.log(Math.max(1e-12, p))).toFixed(2) + '</strong>';
    f(side, 'nudge').textContent = 'nudge all ' + count.toLocaleString() + ' weights a little';
  }
  function show() {
    shown = steps;
    const p = net.forward(ex.x), g = best(p), pic = f('shape', 'pic'), ctx = pic.getContext('2d'), sz = pic.width / N;
    ctx.clearRect(0, 0, pic.width, pic.height);
    for (let i = 0; i < ex.x.length; i++) { ctx.fillStyle = L.rgba(C.green, 0.07 + 0.93 * ex.x[i]); ctx.fillRect((i % N) * sz + 0.5, Math.floor(i / N) * sz + 0.5, sz - 1, sz - 1); }
    row('shape', L.esc(S.NAMES[ex.c]), L.esc(S.NAMES[g]) + ' <small>' + L.pct(p[g], 0) + '</small>', g === ex.c, p[ex.c], net.weights);
    const q = gpt.next(ex.ctx), gq = best(q);
    f('text', 'pic').innerHTML = L.esc(ex.ctx.slice(1).map(m => ai.word(m)).join(' ')) + ' <span class="loop-blank">?</span>';
    row('text', word(ex.y), word(gq) + ' <small>' + L.pct(q[gq], 0) + '</small>', gq === ex.y, q[ex.y], gpt.size);
    bRun.textContent = running ? 'Pause' : steps >= CAP ? 'Run again' : steps ? 'Keep going' : 'Run both';
    bStep.disabled = steps >= CAP;
    const a = hs.length ? L.pct(hs[hs.length - 1], 0) : '', b = ht.length ? L.pct(ht[ht.length - 1], 0) : '';
    note.innerHTML = !steps ?
      '<strong>Both are untrained.</strong> A blind guess among ' + K + ' shapes is right 11% of the time; among this model’s ' + V.size + ' tokens, ' + L.pct(1 / V.size) + '. Press <em>Run both</em>, or take it one step at a time.' :
      '<strong>Step ' + steps + (steps >= CAP ? ', and that is enough to see it' : '') + '.</strong> Typical odds on the right answer: shape network <strong>' + a + '</strong>, language model <strong>' + b + '</strong>.' +
      (steps >= CAP ? ' The loop was identical for both, and neither is finished' + (HW ? ': the shape network at the top of the page had ' + HW.steps.toLocaleString() + ' steps and gets ' + L.pct(HW.accuracy, 0) + ' of shapes right' : '') + '. Their ceilings differ, though. A picture has one right answer, so the shape network can keep climbing towards certainty. A sentence does not: after “the cat sat on the”, several words are fair, so even a well-trained language model has to spread its odds.' : '');
  }

  function draw() {
    const v = L.fit(cv), ctx = v.ctx, x0 = 44, x1 = v.w - 14, y0 = 14, y1 = v.h - 28;
    const X = i => x0 + (x1 - x0) * i / CAP, Y = p => y1 - (y1 - y0) * p;
    ctx.clearRect(0, 0, v.w, v.h);
    ctx.font = '700 10px ' + mono; ctx.textBaseline = 'middle';
    [0, 0.5, 1].forEach(p => {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x1, Y(p)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = L.rgba(C.dim, 1); ctx.textAlign = 'right'; ctx.fillText(Math.round(p * 100) + '%', x0 - 6, Y(p));
    });
    ctx.textAlign = 'center'; ctx.fillStyle = L.rgba(C.dim, 1);
    ctx.fillText('training steps →   (height: typical odds given to the right answer)', (x0 + x1) / 2, v.h - 10);
    [[hs, C.cyan, 'shapes'], [ht, C.gold, 'words']].forEach(s => {
      const h = s[0];
      if (!h.length) return;
      ctx.strokeStyle = s[1]; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.beginPath();
      h.forEach((p, i) => { if (i) ctx.lineTo(X(i + 1), Y(p)); else ctx.moveTo(X(1), Y(p)); });
      ctx.stroke();
      const lx = X(h.length), ly = Y(h[h.length - 1]);
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, 6.2832); ctx.fillStyle = s[1]; ctx.fill();
      ctx.textAlign = lx > x1 - 90 ? 'right' : 'left';
      ctx.fillText(s[2] + ' ' + Math.round(h[h.length - 1] * 100) + '%', lx + (lx > x1 - 90 ? -9 : 9), ly - 9);
    });
  }

  L.scene(cv, dt => {
    ready();
    if (running && dt) {
      stepBoth();      // one step for each per frame: together they take about 7 ms
      if (steps >= CAP) running = false;
    }
    if (shown !== steps) show();
    draw();
  });
  bRun.addEventListener('click', () => { ready(); if (!running && steps >= CAP) fresh(); running = !running; show(); L.kick(); });
  bStep.addEventListener('click', () => { ready(); running = false; if (steps < CAP) stepBoth(); show(); L.kick(); });
  L.$('#loopNext').addEventListener('click', () => { ready(); pick(); show(); L.kick(); });
  L.$('#loopReset').addEventListener('click', () => { fresh(); L.kick(); });
})();

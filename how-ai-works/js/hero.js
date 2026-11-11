/* The hero: a feed-forward network that has really been trained to tell nine 8x8 shapes apart.
   The visitor can draw on its input, step a pass through it one layer at a time, pin any neuron to
   see the sum it computes, scramble the weights and train it again. They can also ask which squares
   an answer leans on, damage the network, look at what the first layer learned, and teach it a
   symbol of their own. js/mlp.js does the arithmetic, js/net3d.js draws it, and this file joins
   the two to the controls under the canvas. */
(function () {
  'use strict';
  const L = Lab, C = L.C, M = window.LabMLP, cv = L.$('#heroCanvas');
  if (!cv || !M || !L.net3d || !L.$('#netBar')) return;
  const S = M.shapes, GRID = M.GRID, SIZES = M.SIZES, G = SIZES.length - 1, K = S.NAMES.length, N0 = GRID[0];
  const NAMES = S.NAMES.slice(), GLYPHS = S.GLYPHS.slice(), SLOT = K - 1;   // the last output is the one a visitor's own shape takes over
  const net = new M.MLP(SIZES, 7), shipped = window.HERO_WEIGHTS, rnd = L.rng(4242), trnd = L.rng(Date.now() & 0xfffff), nrnd = L.rng(99);
  const neurons = SIZES.reduce((s, n) => s + n, 0);
  let state = shipped && net.unpack(shipped) ? 'trained' : 'random';
  let x = new Float32Array(SIZES[0]), fed = x, auto = true, truth = -1, training = false, teaching = false, steps = 0, credit = 0, lastAcc = 0;
  let acc = state === 'trained' ? shipped.accuracy : 0, pass = null, winner = 0, said = false, spoke = '';
  let mine = null;                       // { name, ex: [Float32Array] } once the visitor has taught it a shape
  let flip = 0, cut = 0, mask = null;    // damage: share of input squares flipped, share of hidden neurons switched off
  let why = false, sound = false, audio = null, tour = 0, galOpen = false;
  const names = ['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'HIDDEN 3', 'HIDDEN 4', 'OUTPUT'], shorts = ['IN', 'H1', 'H2', 'H3', 'H4', 'OUT'];
  const signed = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
  const an = c => (mine && c === SLOT ? '“' + NAMES[c] + '”' : (/^[aeiou]/.test(NAMES[c]) ? 'an ' : 'a ') + NAMES[c]);
  const cell = (l, i) => 'row ' + (Math.floor(i / GRID[l]) + 1) + ', column ' + (i % GRID[l] + 1);
  const isOff = (l, i) => !!(mask && mask[l] && mask[l][i]);

  const view = L.net3d(cv, {
    layers: GRID.map((n, l) => ({ r: n, c: n, name: names[l], short: shorts[l] })),
    weights: g => net.W[g], gap: 6, gapSmall: 4.8,
    header: small => (small ? 'FEED-FORWARD' : 'FEED-FORWARD NETWORK') + '  ·  ' + neurons + ' NEURONS  ·  ' + net.weights.toLocaleString() + ' WEIGHTS' +
      (small ? '' : '  ·  ' + (training ? 'TRAINING, STEP ' + steps : state === 'random' ? 'RANDOM WEIGHTS' : state === 'trained' ? 'TRAINED AHEAD OF TIME' : 'TRAINED IN THIS TAB') + (flip || cut ? '  ·  DAMAGED' : '')),
    color: (l, i, v) => (l === G ? (i === winner ? C.gold : C.violet) : l === 0 ? C.green : isOff(l, i) ? C.dim : v < 0 ? C.rose : C.cyan),
    describe: (l, i, v) => [
      l === G ? 'output “' + NAMES[i] + '”:  ' + Math.round(v * 100) + '%' : l === 0 ? 'input  ·  ' + cell(l, i) + ':  ' + v.toFixed(2) : 'hidden ' + l + '  ·  ' + cell(l, i) + ':  ' + (isOff(l, i) ? 'switched off' : signed(v)),
      (l ? SIZES[l - 1] + ' weights in' : 'fed from outside') + (l < G ? '  ·  ' + SIZES[l + 1] + ' weights out' : '') + '  ·  click to pin'
    ],
    onCycle() { if (auto) nextShape(); run(false, !auto && !flip); },      // a shape you chose just plays again
    onStage(l) {
      if (l === G) { paintOut(); if (view.stepping && tour === 2) tourSet(3); }
      tick(l);
      if (view.stepping && l >= 1) { const p = view.pinned >= 0 ? view.where(view.pinned) : null; explain(l, p && p.layer === l ? p.index : strongest(l)); }
    },
    onPin(k) { if (k < 0) { if (!view.stepping) L.$('#netNeuron').hidden = true; } else { const w = view.where(k); explain(w.layer, w.index); } drawGallery(); }
  });

  /* ---------- shapes: the nine that ship, or eight of them plus the visitor's own ---------- */
  function sample(c, r, clean) {
    if (!mine || c !== SLOT) return S.make(c, r, clean);
    const src = mine.ex[Math.floor(r() * mine.ex.length)], out = new Float32Array(SIZES[0]);
    if (clean) { out.set(src); return out; }
    // a copy of one of their drawings, moved up to two squares if there is room, then speckled like the others
    let r0 = N0, r1 = -1, c0 = N0, c1 = -1;
    for (let i = 0; i < src.length; i++) if (src[i]) { const rr = Math.floor(i / N0), cc = i % N0; r0 = Math.min(r0, rr); r1 = Math.max(r1, rr); c0 = Math.min(c0, cc); c1 = Math.max(c1, cc); }
    const pick = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const dr = pick(Math.max(-2, -r0), Math.min(2, N0 - 1 - r1)), dc = pick(Math.max(-2, -c0), Math.min(2, N0 - 1 - c1));
    for (let i = 0; i < src.length; i++) if (src[i]) out[i + dr * N0 + dc] = 1;
    for (let i = 0; i < out.length; i++) {
      if (out[i]) out[i] = r() < 0.04 ? 0 : 0.8 + 0.2 * r();
      else if (r() < 0.05) out[i] = 0.15 + 0.35 * r();
    }
    return out;
  }
  function damage(src, r) { const out = Float32Array.from(src); for (let i = 0; i < out.length; i++) if (r() < flip) out[i] = out[i] > 0.5 ? 0 : 1; return out; }
  function best(p) { let b = 0; for (let j = 1; j < p.length; j++) if (p[j] > p[b]) b = j; return b; }
  // share of fresh shapes it gets right; hurt = with the damage sliders applied
  function accuracy(r, n, hurt) {
    let ok = 0;
    for (let i = 0; i < n; i++) { const c = Math.floor(r() * K); let v = sample(c, r); if (hurt && flip) v = damage(v, r); if (best(net.forward(v, hurt ? mask : null)) === c) ok++; }
    return ok / n;
  }
  function trainStep() {
    const xs = [], ys = [];
    for (let i = 0; i < M.BATCH; i++) { const c = Math.floor(trnd() * K); xs.push(sample(c, trnd)); ys.push(c); }
    return net.trainBatch(xs, ys, M.LR);
  }
  if (state !== 'trained') acc = accuracy(L.rng(9), 300);

  /* ---------- running a pass ---------- */
  function run(settled, replay) {
    fed = flip ? damage(x, nrnd) : x;
    net.forward(fed, mask);
    const vals = net.a.map(a => Float32Array.from(a));
    pass = { vals };
    said = !!replay;
    if (!replay) { clearWhy(); if (why) L.$('#netWhy').innerHTML = '<strong>Why?</strong> Waiting for this pass to reach the output…'; }
    view.setPass({ vals, mags: vals.map((a, l) => Float32Array.from(a, v => Math.min(1, Math.abs(l === G ? v * 2.2 : v)))), keep: !auto, settled: !!settled });
    paintPad();
    if (settled || L.reduce) paintOut();
    else if (!replay) L.$('#netNote').innerHTML = (truth >= 0 ? 'Shown: ' + an(truth) + '. ' : '') + 'The signal is working its way through the layers…';
  }
  function nextShape() { truth = Math.floor(rnd() * K); x = sample(truth, rnd); }
  function strongest(l) { let b = 0; const a = pass.vals[l]; for (let i = 1; i < a.length; i++) if (Math.abs(a[i]) > Math.abs(a[b])) b = i; return b; }

  /* ---------- the input pad ---------- */
  const pad = L.$('#netPad'), cells = [];
  pad.style.setProperty('--n', GRID[0]);
  for (let i = 0; i < SIZES[0]; i++) {
    const b = L.h('button', { class: 'net-cell', type: 'button', 'aria-label': 'Input ' + cell(0, i), 'aria-pressed': 'false' });
    b.dataset.i = i; pad.append(b); cells.push(b);
  }
  // the pad shows what was actually fed in, so squares the noise slider flipped are visible (and outlined)
  function paintPad() {
    cells.forEach((b, i) => {
      b.style.setProperty('--v', (0.05 + 0.95 * fed[i]).toFixed(2));
      b.setAttribute('aria-pressed', x[i] > 0.5 ? 'true' : 'false');
      b.classList.toggle('flipped', (fed[i] > 0.5) !== (x[i] > 0.5));
    });
  }
  function drew() { auto = false; truth = -1; syncButtons(); run(); if (tour === 1) tourSet(2); }
  let paint = null;
  pad.addEventListener('pointerdown', ev => {
    const el = ev.target.closest('.net-cell'); if (!el) return;
    paint = x[el.dataset.i] > 0.5 ? 0 : 1; x[el.dataset.i] = paint; drew(); ev.preventDefault();
  });
  pad.addEventListener('pointermove', ev => {
    if (paint == null) return;
    const el = document.elementFromPoint(ev.clientX, ev.clientY);
    if (el && el.classList.contains('net-cell') && x[el.dataset.i] !== paint) { x[el.dataset.i] = paint; drew(); }
  });
  window.addEventListener('pointerup', () => { paint = null; });
  window.addEventListener('pointercancel', () => { paint = null; });
  pad.addEventListener('click', ev => {            // keyboard: Enter or Space on a cell
    const el = ev.target.closest('.net-cell');
    if (el && ev.detail === 0) { x[el.dataset.i] = x[el.dataset.i] > 0.5 ? 0 : 1; drew(); }
  });

  /* ---------- example shapes and the mode buttons ---------- */
  const shapesBox = L.$('#netShapes'), shapeBtns = [];
  for (let c = 0; c < K; c++) {
    const b = L.h('button', { class: 'lab-button net-shape', type: 'button' });
    b.addEventListener('click', () => { x = sample(c, rnd, true); auto = false; truth = c; syncButtons(); run(); if (tour === 1) tourSet(2); });
    shapesBox.append(b); shapeBtns.push(b);
  }
  const bAuto = L.$('#netAuto'), bClear = L.$('#netClear'), bStep = L.$('#netStep'), bPlay = L.$('#netPlay'), bScr = L.$('#netScramble'), bTrain = L.$('#netTrain'), bRest = L.$('#netRestore');
  const bWhy = L.$('#netWhyBtn'), bSound = L.$('#netSound');
  function syncButtons() {
    bAuto.classList.toggle('active', auto); bAuto.setAttribute('aria-pressed', auto ? 'true' : 'false');
    bPlay.hidden = !view.stepping;
    L.$('#netNote').setAttribute('aria-live', auto ? 'off' : 'polite');      // a new shape every few seconds would be a lot to have read out
    bTrain.textContent = training ? 'Pause training' : state === 'random' && steps ? 'Keep training' : state === 'random' ? 'Train it' : 'Train some more';
    bRest.hidden = !shipped || (state === 'trained' && !training);
    bWhy.classList.toggle('active', why); bWhy.setAttribute('aria-pressed', why ? 'true' : 'false');
    bSound.classList.toggle('active', sound); bSound.setAttribute('aria-pressed', sound ? 'true' : 'false'); bSound.textContent = sound ? 'Sound: on' : 'Sound: off';
    teachRead();
  }
  function restore() {
    training = false; teaching = false;
    if (net.unpack(shipped)) { state = 'trained'; steps = 0; acc = shipped.accuracy; forget(); webChanged(); run(); }
    status(); syncButtons();
  }
  bAuto.addEventListener('click', () => { auto = !auto; if (auto) { nextShape(); run(); } syncButtons(); });
  bClear.addEventListener('click', () => { x = new Float32Array(SIZES[0]); drew(); });
  bStep.addEventListener('click', () => { view.step(); syncButtons(); if (view.stage === 0) explain(0, -1); });
  bPlay.addEventListener('click', () => { view.play(); if (view.pinned < 0) L.$('#netNeuron').hidden = true; syncButtons(); });
  bScr.addEventListener('click', () => {
    training = false; teaching = false; net.init(((Date.now() & 0xffff) << 1) | 1); state = 'random'; steps = 0; lastAcc = 0;
    acc = accuracy(L.rng(9), 300); webChanged(); run(); status(); syncButtons();
    if (tour === 3) tourSet(4);
  });
  bTrain.addEventListener('click', () => {
    training = !training; teaching = false;
    if (training && state !== 'random') { state = 'random'; steps = 0; lastAcc = 0; }
    if (!training) finish();
    status(); syncButtons(); L.kick();
    if (training && (tour === 3 || tour === 4)) tourSet(5);
  });
  bRest.addEventListener('click', restore);

  /* ---------- training, a few real steps per frame so the page stays responsive ---------- */
  function webChanged() { view.refreshWeb(); drawGallery(); if (!L.$('#netBreak').hidden) breakRead(); }
  function finish() { if (steps) { state = 'custom'; acc = accuracy(L.rng(steps + 5), 300); webChanged(); } }
  L.scene(L.$('#netBar'), dt => {
    if (!training || !dt) return;
    // slow at first, while the answers are changing fastest, then quicker
    credit = Math.min(12, credit + dt / 16.7 * (steps < 200 ? 1 : steps < 800 ? 3 : 8));
    const t0 = performance.now();
    while (credit >= 1 && performance.now() - t0 < 6) { trainStep(); steps++; credit--; }
    if (steps - lastAcc >= 40) {
      lastAcc = steps; acc = accuracy(L.rng(steps), 100); webChanged();
      // teaching starts from a network that already knows eight of the nine, so it needs fewer steps
      const enough = teaching ? steps >= 1500 || (acc >= 0.97 && steps >= 600) : steps >= 2400 || (acc >= 0.975 && steps >= 900);
      if (enough) { training = false; teaching = false; finish(); syncButtons(); }
      status();
    }
  });
  function status() {
    const pct = L.pct(acc, 0);
    L.$('#netStatus').innerHTML =
      training ? '<strong>Training: step ' + steps + '.</strong> Each step shows it ' + M.BATCH + ' fresh shapes with the right answers and nudges all ' + net.weights.toLocaleString() + ' weights a little. Right on ' + pct + ' of fresh shapes so far.' :
      state === 'random' ? '<strong>These weights are random.</strong> It is right on ' + pct + ' of shapes, which is what guessing among nine answers gets you. Press Train it.' :
      state === 'trained' ? '<strong>Trained ahead of time</strong> with the same code this page runs: ' + shipped.steps.toLocaleString() + ' practice steps, right on ' + pct + ' of shapes it has never seen. Scramble the weights to watch it learn from nothing.' :
      '<strong>You trained this in your browser:</strong> ' + steps.toLocaleString() + ' steps, right on ' + pct + ' of shapes it has never seen. ' +
      (mine ? 'That includes “' + NAMES[SLOT] + '”, which it knows only from your ' + mine.ex.length + ' drawings.' : 'Nobody told it what a cross looks like; the weights found it.');
  }

  /* ---------- the answer ---------- */
  const outs = L.$('#netOuts'), outCells = [];
  for (let c = 0; c < K; c++) {
    const d = L.h('div', { class: 'net-o' });
    d.innerHTML = '<span aria-hidden="true"></span><b>0%</b>';
    outs.append(d); outCells.push(d);
  }
  function labels() {
    shapeBtns.forEach((b, c) => { b.innerHTML = '<span aria-hidden="true">' + GLYPHS[c] + '</span> ' + L.esc(NAMES[c]); b.title = 'Show ' + an(c); b.setAttribute('aria-label', 'Show ' + an(c)); });
    outCells.forEach((d, c) => { d.title = NAMES[c]; d.firstChild.textContent = GLYPHS[c]; });
  }
  function paintOut() {
    if (!pass) return;
    const p = pass.vals[G]; winner = best(p);
    outCells.forEach((d, c) => { d.classList.toggle('hot', c === winner); d.style.setProperty('--v', Math.min(1, p[c] * 1.6).toFixed(2)); d.lastChild.textContent = Math.round(p[c] * 100) + '%'; });
    const key = winner + ':' + Math.round(p[winner] * 100) + ':' + truth;
    if (said && key === spoke) return;     // one announcement per pass; a replay speaks again only if training changed the answer
    spoke = key;
    said = true;
    const ans = an(winner) + ' (' + L.pct(p[winner], 0) + ' sure)', blank = !x.some(v => v > 0.5);
    L.$('#netNote').innerHTML =
      truth >= 0 ? 'Shown: ' + an(truth) + '. The network says <strong>' + ans + '</strong>. ' + (winner === truth ? 'Correct.' : 'Wrong.') :
      blank ? 'Nothing is drawn, yet the network says <strong>' + ans + '</strong>. It has no way to answer “none of these”.' :
      'The network says <strong>' + ans + '</strong>. It can only ever answer with one of the nine shapes it practised on.';
    showWhy();
  }

  /* ---------- one neuron's sum, spelled out ---------- */
  function explain(l, i) {
    const box = L.$('#netNeuron'), txt = L.$('#netSum'), pic = L.$('#netWeights');
    box.hidden = false;
    if (i < 0) { pic.hidden = true; txt.innerHTML = '<strong>Step mode.</strong> The input is in place and nothing has moved yet. Press <em>Step one layer</em> again to push the signal one layer forward, and the sum for one neuron in that layer will be written out here. Click any neuron to choose which one.'; return; }
    const v = pass.vals;
    if (l === 0) { pic.hidden = true; txt.innerHTML = '<strong>Input, ' + cell(0, i) + '.</strong> Its value is ' + v[0][i].toFixed(2) + ' (0 is dark, 1 is fully lit). It is handed to all ' + SIZES[1] + ' neurons in the first hidden layer, each through a weight of its own.'; return; }
    const nIn = SIZES[l - 1], W = net.W[l - 1], src = v[l - 1], parts = [], bias = net.b[l - 1][i];
    let z = bias, top = 1e-9;
    for (let q = 0; q < nIn; q++) { const w = W[i * nIn + q], c = w * src[q]; z += c; parts.push([Math.abs(c), w, src[q]]); if (Math.abs(w) > top) top = Math.abs(w); }
    parts.sort((a, b) => b[0] - a[0]);
    const shown = parts.slice(0, 3).map(p => '(' + signed(p[1]) + ' × ' + signed(p[2]) + ')').join(' + ');
    txt.innerHTML = '<strong>' + (l === G ? 'Output “' + L.esc(NAMES[i]) + '”' : 'Hidden layer ' + l + ', ' + cell(l, i)) + '.</strong> It takes the ' + nIn + ' values from the layer before, multiplies each by its own weight, and adds them up. The three biggest terms, as weight × value: ' +
      '<span class="net-math">' + shown + ' + ' + (nIn - 3) + ' smaller ones + a fixed offset of ' + signed(bias) + ' = ' + signed(z) + '</span>. ' +
      (l === G ? 'That score is compared with the other eight scores and turned into a share of the total: <strong>' + L.pct(v[G][i], 0) + '</strong>.' :
        isOff(l, i) ? 'Squashed into the range −1 to +1 that would be ' + signed(Math.tanh(z)) + ', but this is one of the neurons you switched off, so it sends on <strong>0</strong>.' :
        'Squashed into the range −1 to +1, that becomes <strong>' + signed(Math.tanh(z)) + '</strong>, which is the brightness you see.') +
      (l === 1 ? ' The picture shows its ' + nIn + ' weights laid out like the input grid: blue squares are pixels it wants lit, pink ones are pixels it wants dark.' : ' The picture shows its ' + nIn + ' weights laid out like the layer before it: blue pushes this neuron up, pink pushes it down.');
    pic.hidden = false;
    const n = GRID[l - 1], ctx = pic.getContext('2d'), sz = pic.width / n;
    ctx.clearRect(0, 0, pic.width, pic.height);
    for (let q = 0; q < nIn; q++) {
      const w = W[i * nIn + q];
      ctx.fillStyle = L.rgba(w < 0 ? C.rose : C.cyan, 0.06 + 0.94 * Math.abs(w) / top);
      ctx.fillRect((q % n) * sz + 1, Math.floor(q / n) * sz + 1, sz - 2, sz - 2);
    }
    pic.setAttribute('aria-label', 'The ' + nIn + ' weights coming into this neuron, drawn as a ' + n + ' by ' + n + ' grid');
  }

  /* ---------- why this answer: flip each input square in turn and see how far the answer moves ---------- */
  function clearWhy() { cells.forEach(b => { b.removeAttribute('data-why'); }); }
  function showWhy() {
    const box = L.$('#netWhy');
    clearWhy();
    if (!why || !pass) { box.hidden = true; return; }
    const base = pass.vals[G][winner], tmp = Float32Array.from(pass.vals[0]), d = new Float32Array(SIZES[0]);
    let down = 0, at = -1, up = 0;
    for (let i = 0; i < d.length; i++) {
      const keep = tmp[i]; tmp[i] = keep > 0.5 ? 0 : 1;
      d[i] = net.forward(tmp, mask)[winner] - base; tmp[i] = keep;
      if (-d[i] > down) { down = -d[i]; at = i; }
      if (d[i] > up) up = d[i];
    }
    // ring the squares whose flip costs the answer most (gold), and the few whose flip would help it most (pink)
    const idx = Array.from(d, (_, i) => i);
    const lean = idx.filter(i => -d[i] >= Math.max(0.05, down * 0.3)).sort((a, b) => d[a] - d[b]), pro = lean.slice(0, 12);
    const con = idx.filter(i => d[i] >= Math.max(0.1, up * 0.5)).sort((a, b) => d[b] - d[a]).slice(0, 6);
    pro.forEach(i => { cells[i].dataset.why = 'for'; cells[i].style.setProperty('--k', (0.35 + 0.65 * -d[i] / down).toFixed(2)); });
    con.forEach(i => { cells[i].dataset.why = 'against'; cells[i].style.setProperty('--k', (0.35 + 0.65 * d[i] / up).toFixed(2)); });
    const nm = '“' + L.esc(NAMES[winner]) + '”';
    box.hidden = false;
    box.innerHTML = '<strong>Why ' + nm + '?</strong> ' + (pro.length ?
      'Each input square was flipped in turn, on to off or off to on, and the pass run again. ' +
      (lean.length > 12 ? 'Flipping almost any square would shake this answer (' + lean.length + ' of ' + SIZES[0] + ' would); the 12 that matter most are ringed in gold.' :
        pro.length === 1 ? 'The square ringed in gold is the one this answer leans on.' : 'The ' + pro.length + ' squares ringed in gold are the ones this answer leans on.') +
      ' The strongest is ' + cell(0, at) + ' (' + (pass.vals[0][at] > 0.5 ? 'lit' : 'dark') + '): flip it and the odds it gives ' + nm + ' go from ' + L.pct(base, 0) + ' to ' + L.pct(base - down, 0) + '.' :
      'Each input square was flipped in turn and the pass run again. No single flip costs ' + nm + ' more than 5 points, so this answer rests on the pattern as a whole.') +
      (con.length ? ' Flipping ' + (con.length === 1 ? 'the square ringed in pink' : 'any of the ' + con.length + ' ringed in pink') + ' would make it more sure.' : '');
  }
  bWhy.addEventListener('click', () => { why = !why; syncButtons(); showWhy(); });

  /* ---------- break it: flip input squares at random, switch hidden neurons off ---------- */
  // one fixed order per layer, so pushing the slider further only ever switches more neurons off
  const order = SIZES.map((n, l) => { const p = Array.from({ length: n }, (_, i) => i), r = L.rng(700 + l); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; } return p; });
  const sFlip = L.$('#netFlip'), sCut = L.$('#netCut');
  function breakRead() {
    const hurt = flip || cut;
    L.$('[data-for="netFlip"]').textContent = Math.round(flip * 100) + '%';
    L.$('[data-for="netCut"]').textContent = Math.round(cut * 100) + '%';
    L.$('#netFix').hidden = !hurt;
    L.$('#netBreakNote').innerHTML = !hurt ?
      'Nothing is broken yet. As it stands it is right on <strong>' + L.pct(acc, 0) + '</strong> of fresh shapes. Push either slider and see how much damage it can take.' :
      'With ' + [flip ? '<strong>' + Math.round(flip * 100) + '%</strong> of the input squares flipped at random' : '', cut ? '<strong>' + Math.round(cut * 100) + '%</strong> of the hidden neurons switched off' : ''].filter(Boolean).join(' and ') +
      ', it is right on <strong>' + L.pct(accuracy(L.rng(31), 240, true), 0) + '</strong> of fresh shapes. Undamaged it gets ' + L.pct(acc, 0) + '; guessing would get 11%.' +
      (flip ? ' Flipped squares have a dashed pink outline on the input grid. It never practised on drawings this noisy, so a little goes a long way.' : '') + (cut ? ' Switched-off neurons go dark in the picture.' : '');
  }
  function setBreak() {
    flip = +sFlip.value / 100; cut = +sCut.value / 100;
    mask = cut ? SIZES.map((n, l) => { if (!l || l === G) return null; const m = new Uint8Array(n), k = Math.round(cut * n); for (let i = 0; i < k; i++) m[order[l][i]] = 1; return m; }) : null;
    run(true); breakRead();
  }
  sFlip.addEventListener('input', setBreak); sCut.addEventListener('input', setBreak);
  L.$('#netFix').addEventListener('click', () => { sFlip.value = 0; sCut.value = 0; setBreak(); });

  /* ---------- what the first hidden layer learned: every neuron's 64 weights as a picture ---------- */
  const gal = L.$('#netGallery');
  function drawGallery() {
    if (!galOpen) return;
    const v = L.fit(gal), ctx = v.ctx, n = GRID[1], gap = v.w > 420 ? 4 : 2, t = (v.w - gap * (n - 1)) / n, c = t / N0, W = net.W[0], nIn = SIZES[0];
    const pin = view.pinned >= 0 ? view.where(view.pinned) : null;
    L.$('#netGalNote').innerHTML = 'Each tile is one neuron of the first hidden layer, placed as it sits in the layer. A tile is that neuron’s 64 weights drawn over the input grid: blue squares are ones it wants lit, pink ones it wants dark. ' +
      (state === 'random' && !steps ? 'These weights are random, so every tile is static. Train it and watch faint patterns form.' :
        'Nobody designed these. Most look like static, and that is the honest picture: this network spreads each shape across many neurons instead of growing one tidy detector per shape. A few show something readable, such as a checkerboard or a diagonal streak.') +
      ' Click a tile to pin that neuron in the network above.';
    ctx.clearRect(0, 0, v.w, v.h);
    for (let p = 0; p < SIZES[1]; p++) {
      const j = p, ox = (p % n) * (t + gap), oy = Math.floor(p / n) * (t + gap);
      let top = 1e-9;
      for (let q = 0; q < nIn; q++) top = Math.max(top, Math.abs(W[j * nIn + q]));
      for (let q = 0; q < nIn; q++) {
        const w = W[j * nIn + q];
        ctx.fillStyle = L.rgba(w < 0 ? C.rose : C.cyan, 0.04 + 0.96 * Math.pow(Math.abs(w) / top, 1.3));
        ctx.fillRect(ox + (q % N0) * c, oy + Math.floor(q / N0) * c, c + 0.4, c + 0.4);
      }
      if (pin && pin.layer === 1 && pin.index === j) { ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.strokeRect(ox - 1, oy - 1, t + 2, t + 2); }
    }
  }
  gal.addEventListener('click', ev => {
    const r = gal.getBoundingClientRect(), n = GRID[1], col = Math.floor((ev.clientX - r.left) / r.width * n), row = Math.floor((ev.clientY - r.top) / r.height * n);
    if (col < 0 || col >= n || row < 0 || row >= n) return;
    const j = row * n + col;
    view.pin(view.index(1, j)); explain(1, j); drawGallery();
  });
  window.addEventListener('resize', drawGallery);

  /* ---------- teach it a shape of your own ---------- */
  const tList = L.$('#teachList'), tName = L.$('#teachName'), tGo = L.$('#teachGo'), tAdd = L.$('#teachAdd'), tNote = L.$('#teachNote'), tForget = L.$('#teachForget'), tWipe = L.$('#teachWipe');
  let draft = [], tMsg = '';
  function teachRead() {
    tGo.disabled = draft.length < 3 || training;
    tWipe.hidden = !draft.length; tForget.hidden = !mine || !shipped;
    const k = draft.length, was = '“' + S.NAMES[SLOT] + '”';
    tNote.innerHTML = tMsg ? tMsg :
      teaching ? 'Training on your ' + mine.ex.length + ' drawings, mixed in with the other eight shapes. Each practice copy is moved a square or two and speckled, so it learns the shape and not one exact picture. Watch the answer line above change.' :
      mine ? '<strong>Done.</strong> The last output now answers “' + NAMES[SLOT] + '”. It learned that from ' + mine.ex.length + ' drawings, and not one line of code changed. Move it a square or two and it should still know it. Change its proportions and it may not: it has only ever seen what you drew.' + (shipped ? ' <em>Forget it</em> puts ' + was + ' back.' : '') :
      !k ? 'Draw a symbol of your own on the input grid, one that is not among the nine, then add it here. Three drawings is the least it will accept; five or six, each a little different, works better.' :
      k < 3 ? k + ' added. Change the drawing a little (thicker, thinner, a square bigger or smaller) and add it again. ' + (3 - k) + ' more needed.' :
      k + ' drawings. Name it and press <em>Teach it</em>. It will take the place of ' + was + ', because this network has exactly nine outputs; adding a tenth would mean building a different network.';
  }
  function thumbs() {
    tList.innerHTML = '';
    draft.forEach((e, k) => {
      const c = L.h('canvas', { width: 40, height: 40, role: 'img', 'aria-label': 'Drawing ' + (k + 1) }), ctx = c.getContext('2d');
      ctx.fillStyle = C.green;
      for (let i = 0; i < e.length; i++) if (e[i]) ctx.fillRect((i % N0) * 5, Math.floor(i / N0) * 5, 4, 4);
      tList.append(c);
    });
  }
  function forget() {
    if (!mine) return;
    mine = null; NAMES[SLOT] = S.NAMES[SLOT]; GLYPHS[SLOT] = S.GLYPHS[SLOT]; labels();
    if (truth === SLOT) truth = -1;
  }
  tAdd.addEventListener('click', () => {
    const e = Float32Array.from(x, v => (v > 0.5 ? 1 : 0)), lit = e.reduce((s, v) => s + v, 0);
    if (lit < 3) tMsg = 'Draw something on the input grid first: at least three squares.';
    else if (draft.length >= 8) tMsg = 'Eight drawings is plenty. Press <em>Teach it</em>.';
    else { tMsg = ''; draft.push(e); thumbs(); }
    teachRead(); tMsg = '';
  });
  tWipe.addEventListener('click', () => { draft = []; thumbs(); teachRead(); });
  tGo.addEventListener('click', () => {
    if (draft.length < 3 || training) return;
    const name = (tName.value || '').replace(/[^\p{L}\p{N} \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 14) || 'my shape';
    mine = { ex: draft.map(e => Float32Array.from(e)) };
    NAMES[SLOT] = name; GLYPHS[SLOT] = '✎'; labels();
    x = Float32Array.from(mine.ex[0]); auto = false; truth = SLOT;
    if (view.stepping) view.play();
    teaching = true; training = true; state = 'random'; steps = 0; lastAcc = 0;
    run(); status(); syncButtons(); L.kick();
  });
  tForget.addEventListener('click', restore);

  /* ---------- the three panels under the controls: one open at a time ---------- */
  const panels = { netBreakBtn: 'netBreak', netGalleryBtn: 'netGalleryBox', netTeachBtn: 'netTeach' };
  function openPanel(id) {
    Object.keys(panels).forEach(k => {
      const on = k === id, b = L.$('#' + k);
      L.$('#' + panels[k]).hidden = !on; b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.classList.toggle('active', on);
    });
    galOpen = id === 'netGalleryBtn';
    if (galOpen) drawGallery();
    if (id === 'netBreakBtn') breakRead();
    if (id === 'netTeachBtn') teachRead();
  }
  Object.keys(panels).forEach(id => L.$('#' + id).addEventListener('click', () => openPanel(L.$('#' + panels[id]).hidden ? id : null)));

  /* ---------- sound, off until asked for: one soft note as each layer fires, higher the harder it fires ---------- */
  function tick(l) {
    if (!sound || !audio || !pass || document.hidden) return;
    const a = pass.vals[l];
    let s = 0;
    if (l === G) s = a[winner]; else { for (let i = 0; i < a.length; i++) s += Math.abs(a[i]); s = Math.min(1, s / a.length * 1.6); }
    const t = audio.currentTime, osc = audio.createOscillator(), g = audio.createGain(), len = l === G ? 0.42 : 0.14;
    osc.type = l === G ? 'triangle' : 'sine';
    osc.frequency.value = 196 * Math.pow(2, l / G) * Math.pow(2, s * 7 / 12);      // up an octave across the layers, up to a fifth more for strength
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(l === G ? 0.09 : 0.06, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    osc.connect(g); g.connect(audio.destination); osc.start(t); osc.stop(t + len + 0.02);
  }
  bSound.addEventListener('click', () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { bSound.disabled = true; bSound.textContent = 'Sound not available'; return; }
    sound = !sound;
    if (sound) { audio = audio || new AC(); if (audio.state === 'suspended') audio.resume(); }
    syncButtons();
  });

  /* ---------- a link that reopens the page with this drawing and viewing angle ---------- */
  function link() {
    let hex = '';
    for (let i = 0; i < SIZES[0]; i += 4) hex += ((x[i] > 0.5 ? 8 : 0) | (x[i + 1] > 0.5 ? 4 : 0) | (x[i + 2] > 0.5 ? 2 : 0) | (x[i + 3] > 0.5 ? 1 : 0)).toString(16);
    const a = view.viewAngle();
    return location.origin + location.pathname + '?net=' + hex + '.' + Math.round(a.yaw * 100) + '.' + Math.round(a.pitch * 100) + '.' + Math.round(a.zoom * 100);
  }
  L.$('#netShare').addEventListener('click', () => {
    const url = link(), field = L.$('#netLink'), note = L.$('#netShareNote');
    L.$('#netShareBox').hidden = false; field.value = url;
    const fallback = () => { field.focus(); field.select(); note.textContent = 'Copy this link by hand. It reopens the page with this drawing, seen from this angle.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => { note.textContent = 'Link copied. It reopens the page with this drawing, seen from this angle.'; }, fallback);
    else fallback();
  });
  let shared = false;
  (function () {
    let q = null;
    try { q = new URLSearchParams(location.search).get('net'); } catch (e) { /* very old browser */ }
    const m = q && /^([0-9a-f]{16})(?:\.(-?\d{1,3})\.(-?\d{1,3})\.(\d{2,3}))?$/.exec(q);
    if (!m) return;
    for (let i = 0; i < SIZES[0]; i++) x[i] = (parseInt(m[1][i >> 2], 16) >> (3 - (i & 3))) & 1;
    if (m[2] != null) view.setView({ yaw: m[2] / 100, pitch: m[3] / 100, zoom: m[4] / 100 });
    auto = false; truth = -1; shared = true;
  })();

  /* ---------- a first minute: three things to try, shown once ---------- */
  const tBox = L.$('#netTour'), tText = L.$('#netTourText'), tNum = L.$('#netTourN'), tSkip = L.$('#netTourSkip');
  const TOUR = [null,
    ['1 of 3', '#netPad, #netShapes', 'Draw a shape on the input grid, or pick one of the examples below. The network answers as soon as the signal gets through.'],
    ['2 of 3', '#netStep', 'Now press <em>Step one layer</em> until the answer lights up. Each press pushes the signal one layer further, and one neuron’s sum is written out underneath.'],
    ['3 of 3', '#netScramble', 'Last one. Press <em>Scramble weights</em> to wipe everything it knows. (It is running freely again.)'],
    ['3 of 3', '#netTrain', 'Its answers are now guesses. Press <em>Train it</em> and watch them come right.'],
    ['Done', '', 'That is all training is. The wiring never changed, only the ' + net.weights.toLocaleString() + ' weights. Further down the page, the same loop builds a language model.']
  ];
  function tourSet(n) {
    L.$$('.net-cue').forEach(e => e.classList.remove('net-cue'));
    tour = n; tBox.hidden = !n;
    if (!n || n === 5) { try { localStorage.setItem('lab-net-tour', '1'); } catch (e) { /* private mode */ } }
    if (!n) return;
    tNum.textContent = TOUR[n][0]; tText.innerHTML = TOUR[n][2]; tSkip.textContent = n === 5 ? 'Close' : 'Skip';
    if (TOUR[n][1]) L.$$(TOUR[n][1]).forEach(e => e.classList.add('net-cue'));
    if (n === 3 && view.stepping) { view.play(); if (view.pinned < 0) L.$('#netNeuron').hidden = true; syncButtons(); }
  }
  tSkip.addEventListener('click', () => tourSet(0));
  L.$('#netTourGo').addEventListener('click', () => { tourSet(1); tBox.scrollIntoView({ block: 'nearest', behavior: L.reduce ? 'auto' : 'smooth' }); });

  labels();
  if (!shared) nextShape();
  run(true); status(); syncButtons();
  let seen = shared;
  try { seen = seen || localStorage.getItem('lab-net-tour') === '1'; } catch (e) { /* private mode */ }
  if (!seen) tourSet(1);
})();

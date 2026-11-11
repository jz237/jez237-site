/* The hero: a feed-forward network that has really been trained to tell nine 6x6 shapes apart.
   The visitor can draw on its input, step a pass through it one layer at a time, pin any neuron to
   see the sum it computes, scramble the weights and train it again. js/mlp.js does the arithmetic,
   js/net3d.js draws it, and this file joins the two to the controls under the canvas. */
(function () {
  'use strict';
  const L = Lab, C = L.C, M = window.LabMLP, cv = L.$('#heroCanvas');
  if (!cv || !M || !L.net3d || !L.$('#netBar')) return;
  const S = M.shapes, GRID = M.GRID, SIZES = M.SIZES, G = SIZES.length - 1, K = S.NAMES.length;
  const net = new M.MLP(SIZES, 7), shipped = window.HERO_WEIGHTS, rnd = L.rng(4242), trnd = L.rng(Date.now() & 0xfffff);
  const neurons = SIZES.reduce((s, n) => s + n, 0);
  let state = shipped && net.unpack(shipped) ? 'trained' : 'random';
  let x = new Float32Array(SIZES[0]), auto = true, truth = -1, training = false, steps = 0, credit = 0, lastAcc = 0;
  let acc = state === 'trained' ? shipped.accuracy : M.accuracy(net, L.rng(9), 300), pass = null, winner = 0, said = false;
  const names = ['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'HIDDEN 3', 'HIDDEN 4', 'OUTPUT'], shorts = ['IN', 'H1', 'H2', 'H3', 'H4', 'OUT'];
  const signed = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
  const an = name => (/^[aeiou]/.test(name) ? 'an ' : 'a ') + name;
  const cell = (l, i) => 'row ' + (Math.floor(i / GRID[l]) + 1) + ', column ' + (i % GRID[l] + 1);

  const view = L.net3d(cv, {
    layers: GRID.map((n, l) => ({ r: n, c: n, name: names[l], short: shorts[l] })),
    weights: g => net.W[g],
    header: small => (small ? 'FEED-FORWARD' : 'FEED-FORWARD NETWORK') + '  ·  ' + neurons + ' NEURONS  ·  ' + net.weights.toLocaleString() + ' WEIGHTS' +
      (small ? '' : '  ·  ' + (training ? 'TRAINING, STEP ' + steps : state === 'random' ? 'RANDOM WEIGHTS' : state === 'trained' ? 'TRAINED AHEAD OF TIME' : 'TRAINED IN THIS TAB')),
    color: (l, i, v) => (l === G ? (i === winner ? C.gold : C.violet) : l === 0 ? C.green : v < 0 ? C.rose : C.cyan),
    describe: (l, i, v) => [
      l === G ? 'output “' + S.NAMES[i] + '”:  ' + Math.round(v * 100) + '%' : l === 0 ? 'input  ·  ' + cell(l, i) + ':  ' + v.toFixed(2) : 'hidden ' + l + '  ·  ' + cell(l, i) + ':  ' + signed(v),
      (l ? SIZES[l - 1] + ' weights in' : 'fed from outside') + (l < G ? '  ·  ' + SIZES[l + 1] + ' weights out' : '') + '  ·  click to pin'
    ],
    onCycle() { if (auto) nextShape(); run(); },
    onStage(l) {
      if (l === G) paintOut();
      if (view.stepping && l >= 1) { const p = view.pinned >= 0 ? view.where(view.pinned) : null; explain(l, p && p.layer === l ? p.index : strongest(l)); }
    },
    onPin(k) { if (k < 0) { if (!view.stepping) L.$('#netNeuron').hidden = true; } else { const w = view.where(k); explain(w.layer, w.index); } }
  });

  /* ---------- running a pass ---------- */
  function run(settled) {
    net.forward(x);
    const vals = net.a.map(a => Float32Array.from(a));
    pass = { vals };
    said = false;
    view.setPass({ vals, mags: vals.map((a, l) => Float32Array.from(a, v => Math.min(1, Math.abs(l === G ? v * 2.2 : v)))), keep: !auto, settled: !!settled });
    if (settled || L.reduce) paintOut();
    else L.$('#netNote').innerHTML = (truth >= 0 ? 'Shown: ' + an(S.NAMES[truth]) + '. ' : '') + 'The signal is working its way through the layers…';
  }
  function nextShape() { truth = Math.floor(rnd() * K); x = S.make(truth, rnd); paintPad(); }
  function strongest(l) { let b = 0; const a = pass.vals[l]; for (let i = 1; i < a.length; i++) if (Math.abs(a[i]) > Math.abs(a[b])) b = i; return b; }

  /* ---------- the input pad ---------- */
  const pad = L.$('#netPad'), cells = [];
  for (let i = 0; i < SIZES[0]; i++) {
    const b = L.h('button', { class: 'net-cell', type: 'button', 'aria-label': 'Input ' + cell(0, i), 'aria-pressed': 'false' });
    b.dataset.i = i; pad.append(b); cells.push(b);
  }
  function paintPad() { cells.forEach((b, i) => { b.style.setProperty('--v', (0.05 + 0.95 * x[i]).toFixed(2)); b.setAttribute('aria-pressed', x[i] > 0.5 ? 'true' : 'false'); }); }
  function drew() { auto = false; truth = -1; syncButtons(); paintPad(); run(); }
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
  const shapesBox = L.$('#netShapes');
  S.NAMES.forEach((nm, c) => {
    const b = L.h('button', { class: 'lab-button net-shape', type: 'button', title: 'Show ' + an(nm), 'aria-label': 'Show ' + an(nm) });
    b.innerHTML = '<span aria-hidden="true">' + S.GLYPHS[c] + '</span> ' + L.esc(nm);
    b.addEventListener('click', () => { x = S.make(c, rnd, true); auto = false; truth = c; syncButtons(); paintPad(); run(); });
    shapesBox.append(b);
  });
  const bAuto = L.$('#netAuto'), bClear = L.$('#netClear'), bStep = L.$('#netStep'), bPlay = L.$('#netPlay'), bScr = L.$('#netScramble'), bTrain = L.$('#netTrain'), bRest = L.$('#netRestore');
  function syncButtons() {
    bAuto.classList.toggle('active', auto); bAuto.setAttribute('aria-pressed', auto ? 'true' : 'false');
    bPlay.hidden = !view.stepping;
    L.$('#netNote').setAttribute('aria-live', auto ? 'off' : 'polite');      // a new shape every few seconds would be a lot to have read out
    bTrain.textContent = training ? 'Pause training' : state === 'random' && steps ? 'Keep training' : state === 'random' ? 'Train it' : 'Train some more';
    bRest.hidden = !shipped || (state === 'trained' && !training);
  }
  bAuto.addEventListener('click', () => { auto = !auto; if (auto) { nextShape(); run(); } syncButtons(); });
  bClear.addEventListener('click', () => { x = new Float32Array(SIZES[0]); drew(); });
  bStep.addEventListener('click', () => { view.step(); syncButtons(); if (view.stage === 0) explain(0, -1); });
  bPlay.addEventListener('click', () => { view.play(); if (view.pinned < 0) L.$('#netNeuron').hidden = true; syncButtons(); });
  bScr.addEventListener('click', () => {
    training = false; net.init(((Date.now() & 0xffff) << 1) | 1); state = 'random'; steps = 0; lastAcc = 0;
    acc = M.accuracy(net, L.rng(9), 300); view.refreshWeb(); run(); status(); syncButtons();
  });
  bTrain.addEventListener('click', () => { training = !training; if (training && state !== 'random') { state = 'random'; steps = 0; lastAcc = 0; } if (!training) finish(); status(); syncButtons(); L.kick(); });
  bRest.addEventListener('click', () => { training = false; if (net.unpack(shipped)) { state = 'trained'; steps = 0; acc = shipped.accuracy; view.refreshWeb(); run(); } status(); syncButtons(); });

  /* ---------- training, a few real steps per frame so the page stays responsive ---------- */
  function finish() { if (steps) { state = 'custom'; acc = M.accuracy(net, L.rng(steps + 5), 600); view.refreshWeb(); } }
  L.scene(L.$('#netBar'), dt => {
    if (!training || !dt) return;
    // slow at first, while the answers are changing fastest, then quicker
    credit = Math.min(12, credit + dt / 16.7 * (steps < 200 ? 1 : steps < 800 ? 3 : 8));
    const t0 = performance.now();
    while (credit >= 1 && performance.now() - t0 < 8) { M.trainStep(net, trnd, M.BATCH, M.LR); steps++; credit--; }
    if (steps - lastAcc >= 40) {
      lastAcc = steps; acc = M.accuracy(net, L.rng(steps), 160); view.refreshWeb();
      if (steps >= 2400 || (acc >= 0.975 && steps >= 900)) { training = false; finish(); syncButtons(); }
      status();
    }
  });
  function status() {
    const pct = L.pct(acc, 0);
    L.$('#netStatus').innerHTML =
      training ? '<strong>Training: step ' + steps + '.</strong> Each step shows it ' + M.BATCH + ' fresh shapes with the right answers and nudges all ' + net.weights.toLocaleString() + ' weights a little. Right on ' + pct + ' of fresh shapes so far.' :
      state === 'random' ? '<strong>These weights are random.</strong> It is right on ' + pct + ' of shapes, which is what guessing among nine answers gets you. Press Train it.' :
      state === 'trained' ? '<strong>Trained ahead of time</strong> with the same code this page runs: ' + shipped.steps.toLocaleString() + ' practice steps, right on ' + pct + ' of shapes it has never seen. Scramble the weights to watch it learn from nothing.' :
      '<strong>You trained this in your browser:</strong> ' + steps.toLocaleString() + ' steps, right on ' + pct + ' of shapes it has never seen. Nobody told it what a cross looks like; the weights found it.';
  }

  /* ---------- the answer ---------- */
  const outs = L.$('#netOuts'), outCells = [];
  S.NAMES.forEach((nm, c) => {
    const d = L.h('div', { class: 'net-o', title: nm });
    d.innerHTML = '<span aria-hidden="true">' + S.GLYPHS[c] + '</span><b>0%</b>';
    outs.append(d); outCells.push(d);
  });
  function paintOut() {
    if (!pass) return;
    const p = pass.vals[G]; winner = 0;
    for (let c = 1; c < K; c++) if (p[c] > p[winner]) winner = c;
    outCells.forEach((d, c) => { d.classList.toggle('hot', c === winner); d.style.setProperty('--v', Math.min(1, p[c] * 1.6).toFixed(2)); d.lastChild.textContent = Math.round(p[c] * 100) + '%'; });
    if (said) return;                      // one announcement per pass
    said = true;
    const ans = an(S.NAMES[winner]) + ' (' + L.pct(p[winner], 0) + ' sure)', blank = !x.some(v => v > 0.5);
    L.$('#netNote').innerHTML =
      truth >= 0 ? 'Shown: ' + an(S.NAMES[truth]) + '. The network says <strong>' + ans + '</strong>. ' + (winner === truth ? 'Correct.' : 'Wrong.') :
      blank ? 'Nothing is drawn, yet the network says <strong>' + ans + '</strong>. It has no way to answer “none of these”.' :
      'The network says <strong>' + ans + '</strong>. It can only ever answer with one of the nine shapes it practised on.';
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
    txt.innerHTML = '<strong>' + (l === G ? 'Output “' + L.esc(S.NAMES[i]) + '”' : 'Hidden layer ' + l + ', ' + cell(l, i)) + '.</strong> It takes the ' + nIn + ' values from the layer before, multiplies each by its own weight, and adds them up. The three biggest terms, as weight × value: ' +
      '<span class="net-math">' + shown + ' + ' + (nIn - 3) + ' smaller ones + a fixed offset of ' + signed(bias) + ' = ' + signed(z) + '</span>. ' +
      (l === G ? 'That score is compared with the other eight scores and turned into a share of the total: <strong>' + L.pct(v[G][i], 0) + '</strong>.' : 'Squashed into the range −1 to +1, that becomes <strong>' + signed(Math.tanh(z)) + '</strong>, which is the brightness you see.') +
      (l === 1 ? ' The picture shows its 36 weights laid out like the input grid: blue squares are pixels it wants lit, pink ones are pixels it wants dark.' : ' The picture shows its ' + nIn + ' weights laid out like the layer before it: blue pushes this neuron up, pink pushes it down.');
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

  nextShape(); run(true); status(); syncButtons();
})();

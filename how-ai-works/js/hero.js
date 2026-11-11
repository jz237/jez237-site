/* The hero: a feed-forward network that has really been trained to tell nine 8x8 shapes apart.
   The visitor can draw on its input, step a pass through it one layer at a time, pin any neuron to
   see the sum it computes, scramble the weights and train it again. They can also ask which squares
   an answer leans on, follow an answer back through the layers, try to fool it, damage it, see what
   makes each hidden neuron fire, and teach it a symbol of their own. The questions it asks of the
   network (why, trace, fool, excite) live in js/mlp.js, where tests can reach them. js/mlp.js does the arithmetic, js/net3d.js draws it, and this file joins
   the two to the controls under the canvas. */
(function () {
  'use strict';
  const L = Lab, C = L.C, M = window.LabMLP, cv = L.$('#heroCanvas');
  if (!cv || !M || !L.net3d || !L.$('#netBar')) return;
  const S = M.shapes, P = M.probe, GRID = M.GRID, SIZES = M.SIZES, G = SIZES.length - 1, K = S.NAMES.length, N0 = GRID[0];
  const NAMES = S.NAMES.slice(), GLYPHS = S.GLYPHS.slice(), SLOT = K - 1;   // the last output is the one a visitor's own shape takes over
  const net = new M.MLP(SIZES, 7), shipped = window.HERO_WEIGHTS, rnd = L.rng(4242), trnd = L.rng(Date.now() & 0xfffff), nrnd = L.rng(99);
  const neurons = SIZES.reduce((s, n) => s + n, 0);
  let state = shipped && net.unpack(shipped) ? 'trained' : 'random';
  let x = new Float32Array(SIZES[0]), fed = x, auto = true, truth = -1, training = false, teaching = false, steps = 0, credit = 0, lastAcc = 0;
  let acc = state === 'trained' ? shipped.accuracy : 0, pass = null, winner = 0, said = false, spoke = '';
  let mine = null;                       // { ex: [Float32Array], link } once it has been taught a shape (link: the drawings came in a link)
  let flip = 0, cut = 0, mask = null;    // damage: share of input squares flipped, share of hidden neurons switched off
  let why = false, sound = false, audio = null, tour = 0, galOpen = false;
  let follow = false, followCls = -1;    // follow the signal back from an output (-1 = whichever one wins)
  let foolBase = null, foolBest = null;  // fool it: the drawing the game started from, and the page's own best attempt
  let foolShown = false, foolMine = 0;   // the grid is showing the page's attempt; the fewest squares the visitor has managed
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
    // one of their drawings: as it is for the example button, otherwise resized a little, moved and speckled
    const src = mine.ex[Math.floor(r() * mine.ex.length)];
    return clean ? Float32Array.from(src) : S.variant(src, r);
  }
  function damage(src, r) { const out = Float32Array.from(src); for (let i = 0; i < out.length; i++) if (r() < flip) out[i] = out[i] > 0.5 ? 0 : 1; return out; }
  const best = P.best;
  // share of fresh shapes it gets right; hurt = with the damage sliders applied
  function accuracy(r, n, hurt) {
    let ok = 0;
    for (let i = 0; i < n; i++) { const c = Math.floor(r() * K); let v = sample(c, r); if (hurt && flip) v = damage(v, r); if (best(net.forward(v, hurt ? mask : null)) === c) ok++; }
    return ok / n;
  }
  const TEACH = 1500;                    // steps given to learning a visitor's shape
  function trainStep() {
    const xs = [], ys = [];
    for (let i = 0; i < M.BATCH; i++) { const c = Math.floor(trnd() * K); xs.push(sample(c, trnd)); ys.push(c); }
    // teaching ends on smaller nudges, which settles the new shape in without unsettling the other eight
    return net.trainBatch(xs, ys, teaching && steps >= TEACH * 0.6 ? M.LR * 0.35 : M.LR);
  }
  if (state !== 'trained') acc = accuracy(L.rng(9), 300);

  /* ---------- running a pass ---------- */
  function run(settled, replay) {
    fed = flip ? damage(x, nrnd) : x;
    net.forward(fed, mask);
    const vals = net.a.map(a => Float32Array.from(a));
    pass = { vals };
    said = !!replay;
    if (!replay) {
      clearWhy(); if (why) L.$('#netWhy').innerHTML = '<strong>Why?</strong> Waiting for this pass to reach the output…';
      clearTrace(); if (follow) L.$('#netTrace').innerHTML = '<strong>Following the signal.</strong> Waiting for this pass to reach the output…';
    }
    view.setPass({ vals, mags: vals.map((a, l) => Float32Array.from(a, v => Math.min(1, Math.abs(l === G ? v * 2.2 : v)))), keep: !auto, settled: !!settled });
    paintPad();
    if (settled || L.reduce) paintOut();
    else if (!replay) L.$('#netNote').innerHTML = (truth >= 0 ? 'Shown: ' + an(truth) + '. ' : '') + 'The signal is working its way through the layers…';
    foolRead();
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
  function drew() { auto = false; truth = -1; foolShown = false; syncButtons(); run(); if (tour === 1) tourSet(2); }
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
  const bWhy = L.$('#netWhyBtn'), bSound = L.$('#netSound'), bTrace = L.$('#netTraceBtn');
  function syncButtons() {
    bAuto.classList.toggle('active', auto); bAuto.setAttribute('aria-pressed', auto ? 'true' : 'false');
    bPlay.hidden = !view.stepping;
    L.$('#netNote').setAttribute('aria-live', auto ? 'off' : 'polite');      // a new shape every few seconds would be a lot to have read out
    bTrain.textContent = training ? 'Pause training' : state === 'random' && steps ? 'Keep training' : state === 'random' ? 'Train it' : 'Train some more';
    bRest.hidden = !shipped || (state === 'trained' && !training);
    bWhy.classList.toggle('active', why); bWhy.setAttribute('aria-pressed', why ? 'true' : 'false');
    bTrace.classList.toggle('active', follow); bTrace.setAttribute('aria-pressed', follow ? 'true' : 'false');
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
  function webChanged() { view.refreshWeb(); galStale = true; drawGallery(); if (!L.$('#netBreak').hidden) breakRead(); foolStale(); }
  function finish() { if (steps) { state = 'custom'; acc = accuracy(L.rng(steps + 5), 300); webChanged(); } }
  L.scene(L.$('#netBar'), dt => {
    if (!training || !dt) return;
    // slow at first, while the answers are changing fastest, then quicker. Teaching starts from a working network,
    // so there is no slow start to watch and it is given a little more of each frame.
    credit = Math.min(12, credit + dt / 16.7 * (steps < 200 && !teaching ? 1 : steps < 800 ? 3 : 8));
    const t0 = performance.now();
    while (credit >= 1 && performance.now() - t0 < (teaching ? 8 : 6)) { trainStep(); steps++; credit--; }
    if (steps - lastAcc >= 40) {
      lastAcc = steps; acc = accuracy(L.rng(steps), 100); webChanged();
      // teaching runs a fixed course: a score from 100 shapes is too rough to tell when a brand-new shape has settled
      const enough = teaching ? steps >= TEACH : steps >= 2400 || (acc >= 0.975 && steps >= 900);
      if (enough) { training = false; teaching = false; finish(); syncButtons(); }
      status();
    }
  });
  function status() {
    const pct = L.pct(acc, 0);
    L.$('#netStatus').innerHTML =
      training ? '<strong>Training: step ' + steps + (teaching ? ' of ' + TEACH.toLocaleString() : '') + '.</strong> Each step shows it ' + M.BATCH + ' fresh shapes with the right answers and nudges all ' + net.weights.toLocaleString() + ' weights a little. Right on ' + pct + ' of fresh shapes so far.' :
      state === 'random' ? '<strong>These weights are random.</strong> It is right on ' + pct + ' of shapes, which is what guessing among nine answers gets you. Press Train it.' :
      state === 'trained' ? '<strong>Trained ahead of time</strong> with the same code this page runs: ' + shipped.steps.toLocaleString() + ' practice steps, right on ' + pct + ' of shapes it has never seen. Scramble the weights to watch it learn from nothing.' :
      '<strong>' + (mine && mine.link ? 'Trained in your browser just now:' : 'You trained this in your browser:') + '</strong> ' + steps.toLocaleString() + ' steps, right on ' + pct + ' of shapes it has never seen. ' +
      (mine ? 'That includes “' + NAMES[SLOT] + '”, which it knows only from ' + (mine.link ? 'the ' + mine.ex.length + ' drawings that came in the link.' : 'your ' + mine.ex.length + ' drawings.') : 'Nobody told it what a cross looks like; the weights found it.');
  }

  /* ---------- the answer ---------- */
  const outs = L.$('#netOuts'), outCells = [];
  for (let c = 0; c < K; c++) {
    const d = L.h('div', { class: 'net-o', role: 'button', tabindex: '0' });
    d.innerHTML = '<span aria-hidden="true"></span><b>0%</b>';
    const go = () => { const on = follow && (followCls >= 0 ? followCls : winner) === c; follow = !on; followCls = on ? -1 : c; if (follow) hold(); syncButtons(); showTrace(true); };
    d.addEventListener('click', go);
    d.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
    outs.append(d); outCells.push(d);
  }
  function labels() {
    shapeBtns.forEach((b, c) => { b.innerHTML = '<span aria-hidden="true">' + GLYPHS[c] + '</span> ' + L.esc(NAMES[c]); b.title = 'Show ' + an(c); b.setAttribute('aria-label', 'Show ' + an(c)); });
    outCells.forEach((d, c) => { d.title = NAMES[c] + ': click to follow its signal back'; d.firstChild.textContent = GLYPHS[c]; });
  }
  function paintOut() {
    if (!pass) return;
    const p = pass.vals[G]; winner = best(p);
    outCells.forEach((d, c) => {
      d.classList.toggle('hot', c === winner); d.style.setProperty('--v', Math.min(1, p[c] * 1.6).toFixed(2)); d.lastChild.textContent = Math.round(p[c] * 100) + '%';
      d.setAttribute('aria-label', NAMES[c] + ', ' + Math.round(p[c] * 100) + '%. Press to follow its signal back through the network.');
    });
    const key = winner + ':' + Math.round(p[winner] * 100) + ':' + truth;
    // one announcement per pass; a replay speaks again only if training changed the answer.
    // The why and follow notes are worked out from the weights, so while those are moving they are redone on every replay.
    if (said && key === spoke) { if (training) { showWhy(); showTrace(); } return; }
    spoke = key;
    said = true;
    const ans = an(winner) + ' (' + L.pct(p[winner], 0) + ' sure)', blank = !x.some(v => v > 0.5);
    L.$('#netNote').innerHTML =
      truth >= 0 ? 'Shown: ' + an(truth) + '. The network says <strong>' + ans + '</strong>. ' + (winner === truth ? 'Correct.' : 'Wrong.') :
      blank ? 'Nothing is drawn, yet the network says <strong>' + ans + '</strong>. It has no way to answer “none of these”.' :
      'The network says <strong>' + ans + '</strong>. It can only ever answer with one of the nine shapes it practised on.';
    showWhy(); showTrace();
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
    // P.why runs its own baseline pass with the weights as they are now. While training they have moved on since
    // the saved pass began, and the flips must be compared against the same weights.
    const res = P.why(net, pass.vals[0], winner, mask), base = res.base, d = res.d;
    let down = 0, at = -1, up = 0;
    for (let i = 0; i < d.length; i++) { if (-d[i] > down) { down = -d[i]; at = i; } if (d[i] > up) up = d[i]; }
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

  /* ---------- follow the signal: the strongest paths from one output back to the input squares ---------- */
  // a shape that changes every few seconds leaves no time to look, so following (and the game below) holds the current one
  function hold() { auto = false; }
  function clearTrace() { cells.forEach(b => { b.removeAttribute('data-path'); }); outCells.forEach(d => d.classList.remove('traced')); view.setTrace(null); }
  function showTrace(fresh) {
    const box = L.$('#netTrace');
    cells.forEach(b => { b.removeAttribute('data-path'); }); outCells.forEach(d => d.classList.remove('traced'));
    if (!follow || !pass) { box.hidden = true; view.setTrace(null); return; }
    const cls = followCls >= 0 ? followCls : winner, t = P.trace(net, pass.vals[0], cls, mask), nm = '“' + L.esc(NAMES[cls]) + '”';
    const nodes = [], edges = [];
    t.nodes.forEach((list, l) => { const top = list.reduce((m, q) => Math.max(m, q.r), 1e-9); list.forEach(q => nodes.push([l, q.i, q.r / top])); });
    t.edges.forEach((list, g) => { const top = list.reduce((m, q) => Math.max(m, q.r), 1e-9); list.forEach(q => edges.push([g, q.from, q.to, q.r / top])); });
    view.setTrace({ nodes, edges, fresh: !!fresh });
    t.nodes[0].forEach(q => { cells[q.i].dataset.path = '1'; });
    outCells[cls].classList.add('traced');
    const last = t.nodes[G - 1].length, sq = t.nodes[0].length, odds = L.pct(pass.vals[G][cls], 0);
    box.hidden = false;
    box.innerHTML = '<strong>Following ' + nm + ' back.</strong> ' +
      (cls === winner ? '' : nm + ' is not the answer here (it got ' + odds + '), but some of the network still pushes for it. ') +
      (!last ? 'Nothing in the last hidden layer is pushing for it at the moment, so there is no path to draw.' :
        'The gold lines are the connections that did most to push that output up, followed back one layer at a time, keeping the ' + (last === 1 ? 'strongest neuron' : last + ' strongest neurons') + ' in each layer. ' +
        'In the last hidden layer ' + (last === 1 ? 'that one neuron supplies ' : 'those ' + last + ' supply ') + '<strong>' + L.pct(t.share, 0) + '</strong> of everything pushing ' + nm + ' up; the other ' + (SIZES[G - 1] - last) + ' supply the rest. ' +
        (sq ? 'The paths end at the ' + (sq === 1 ? 'input square' : sq + ' input squares') + ' marked with a gold dot.' : 'They stop short of the input: with nothing lit there, the first layer is running on its fixed offsets alone.') +
        ' It is a sketch, not the whole story: every one of the ' + net.weights.toLocaleString() + ' weights takes part in every answer.') +
      ' Click any output to follow that one.';
  }
  bTrace.addEventListener('click', () => { follow = !follow; followCls = -1; if (follow) hold(); syncButtons(); showTrace(true); });

  /* ---------- fool it: change the answer by flipping as few squares as you can ---------- */
  const fNote = L.$('#foolNote'), fStart = L.$('#foolStart'), fBest = L.$('#foolBest'), fBack = L.$('#foolBack');
  const lit = v => v > 0.5;
  function foolRead() {
    cells.forEach((b, i) => { b.classList.toggle('moved', !!foolBase && lit(x[i]) !== lit(foolBase[i])); });
    if (L.$('#netFool').hidden) return;
    fStart.textContent = foolBase ? 'Start again with this drawing' : 'Start with this drawing';
    fBest.hidden = !foolBase; fBack.hidden = !foolBase;
    if (!foolBase) {
      fNote.innerHTML = '<strong>Can you change its mind?</strong> Put a shape on the input grid that it gets right, then press <em>Start</em>. The game is to flip as few squares as you can, on or off, until it gives a different answer. Then ask for the page’s best and see who needed fewer.';
      return;
    }
    const was = best(net.forward(foolBase, mask)), p = net.forward(x, mask), now = best(p), sure = L.pct(p[now], 0);
    let moved = 0;
    for (let i = 0; i < x.length; i++) if (lit(x[i]) !== lit(foolBase[i])) moved++;
    const sq = k => k + (k === 1 ? ' square' : ' squares'), a = '“' + L.esc(NAMES[was]) + '”', b = '“' + L.esc(NAMES[now]) + '”';
    if (!foolShown && moved && now !== was) foolMine = foolMine ? Math.min(foolMine, moved) : moved;
    const f = foolBest, k = f && f.flips ? f.flips.length : 0;
    let t = foolShown ? 'This is the page’s attempt, not yours: the ' + sq(k) + ' with a dashed outline ' + (k === 1 ? 'was' : 'were') + ' flipped, and ' + a + ' became <strong>' + b + '</strong> (' + sure + ' sure).' :
      !moved ? 'It says <strong>' + a + '</strong> (' + sure + ' sure). Flip squares on the input grid until it says something else. Every square you have changed gets a dashed outline, and changing it back takes it off the count.' :
      now === was ? '<strong>' + sq(moved) + ' changed.</strong> It still says ' + a + ' (' + sure + ' sure).' :
      '<strong>You fooled it with ' + sq(moved) + '.</strong> It started at ' + a + ' and now says ' + b + ' (' + sure + ' sure).';
    if (f && !f.flips) t += ' The page’s search flipped up to 16 squares, one at a time, and could not change this answer.';
    else if (f) {
      t += ' <strong>The page’s best is ' + sq(k) + '</strong>' + (foolShown ? '. ' : ', turning ' + a + ' into “' + L.esc(NAMES[f.to]) + '”. ') +
        (f.exact ? (k === 1 ? 'One is the fewest there could be.' : k === 2 ? 'It tried every single square first and none was enough, so two is the true minimum.' :
          'It tried every single square and every pair (2,080 drawings) and none worked, so three is the true minimum.') :
          'It tried every single square and every pair (2,080 drawings) and none worked, so the true minimum is somewhere from 3 to ' + k + '. Past pairs the search is a good guess, not a proof.') +
        (!foolMine ? (foolShown ? ' Put the drawing back and see whether you can do as well.' : '') :
          foolMine < k ? ' Your ' + foolMine + ' beats it.' : foolMine === k ? ' Your best is ' + foolMine + ' too: a match.' : ' Your best so far is ' + foolMine + '.') +
        ' To a person the drawing has hardly changed. The network never learned what the shape <em>is</em>, only which squares tend to be lit, so the right few squares tip it over. Large models can be tipped the same way: see <a href="#failure">Failure modes</a>.';
    }
    fNote.innerHTML = t;
  }
  // the weights have changed under the game: the page's attempt and both scores were worked out for the old ones
  function foolStale() {
    if (!foolBase) return;
    const shown = foolShown;
    foolBest = null; foolShown = false; foolMine = 0;
    if (shown) { x = Float32Array.from(foolBase); run(true); } else foolRead();
  }
  function foolEnd() { foolBase = null; foolBest = null; foolShown = false; foolMine = 0; foolRead(); }
  fStart.addEventListener('click', () => {
    if (!x.some(lit)) { fNote.innerHTML = 'Draw something on the input grid first, or pick one of the example shapes.'; return; }
    hold();
    if (flip) { sFlip.value = 0; setBreak(); }        // random noise would flip squares for you
    x = Float32Array.from(x, v => (lit(v) ? 1 : 0));
    foolBase = Float32Array.from(x); foolBest = null; foolShown = false; foolMine = 0;
    syncButtons(); run(true);
  });
  fBest.addEventListener('click', () => {
    if (!foolBase) return;
    fNote.innerHTML = 'Searching: every single square, then every pair…';
    setTimeout(() => {
      if (!foolBase) return;
      foolBest = P.fool(net, foolBase, mask);
      if (foolBest.flips) { x = Float32Array.from(foolBase); foolBest.flips.forEach(i => { x[i] = lit(x[i]) ? 0 : 1; }); foolShown = true; }
      truth = -1; run(true);
    }, 30);
  });
  fBack.addEventListener('click', () => { if (foolBase) { x = Float32Array.from(foolBase); truth = -1; foolShown = false; run(true); } });

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

  /* ---------- what the hidden neurons learned: for each one, the average of the drawings that fire it hardest ---------- */
  const gal = L.$('#netGallery'), galTabs = L.$('#netGalTabs'), galBtns = [];
  let galLayer = 1, galData = null, galStale = true, galAt = 0, galN = 0, galTop = 0, galChance = null;
  const favourites = d => { let k = 0; for (let j = 0; j < d.share.length; j++) if (d.share[j] >= 2 / 3) k++; return k; };
  for (let l = 1; l < G; l++) {
    const b = L.h('button', { class: 'lab-button', type: 'button', text: 'Hidden ' + l });
    b.addEventListener('click', () => { galLayer = l; drawGallery(); });
    galTabs.append(b); galBtns[l] = b;
  }
  function drawGallery() {
    if (!galOpen) return;
    // 900 passes take a moment, so while training the pictures are refreshed less often and from fewer drawings
    if (!galData || (galStale && (!training || steps - galAt >= 200))) {
      const r = L.rng(2024);
      galN = training ? 360 : 900; galTop = training ? 16 : 30;
      galData = P.excite(net, c => sample(c, r), galN, K, galTop); galStale = false; galAt = steps;
    }
    // for comparison, the same count on a network of the same size that has never been trained (worked out once)
    if (!galChance && !training) { const r = L.rng(2024), e = P.excite(new M.MLP(SIZES, 12345), c => sample(c, r), 900, K, 30); galChance = e.map(favourites); }
    const d = galData[galLayer], n = GRID[galLayer], count = SIZES[galLayer], nIn = SIZES[0];
    const v = L.fit(gal), ctx = v.ctx, gap = v.w > 420 ? 4 : 2, t = (v.w - gap * (n - 1)) / n, c = t / N0;
    const pin = view.pinned >= 0 ? view.where(view.pinned) : null, here = pin && pin.layer === galLayer ? pin.index : -1;
    const clear = favourites(d);
    ctx.clearRect(0, 0, v.w, v.h);
    for (let j = 0; j < count; j++) {
      const ox = (j % n) * (t + gap), oy = Math.floor(j / n) * (t + gap), fav = d.share[j] >= 2 / 3;
      let top = 1e-9;
      for (let q = 0; q < nIn; q++) top = Math.max(top, d.pics[j * nIn + q]);
      for (let q = 0; q < nIn; q++) {
        ctx.fillStyle = L.rgba(C.green, 0.03 + 0.97 * Math.pow(d.pics[j * nIn + q] / top, 1.5));
        ctx.fillRect(ox + (q % N0) * c, oy + Math.floor(q / N0) * c, c + 0.4, c + 0.4);
      }
      if (fav) { ctx.strokeStyle = L.rgba(C.cyan, 0.55); ctx.lineWidth = 1; ctx.strokeRect(ox + 0.5, oy + 0.5, t - 1, t - 1); }
      if (j === here) { ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.strokeRect(ox - 1, oy - 1, t + 2, t + 2); }
    }
    galBtns.forEach((b, l) => { b.classList.toggle('active', l === galLayer); b.setAttribute('aria-pressed', l === galLayer ? 'true' : 'false'); });
    gal.setAttribute('aria-label', 'The ' + count + ' neurons of hidden layer ' + galLayer + '. Each tile is the average of the drawings that make that neuron fire hardest.');
    const random = state === 'random' && !steps;
    L.$('#netGalNote').innerHTML = 'Each tile is one neuron of hidden layer ' + galLayer + ', placed as it sits in the layer. To make a tile, the page showed the network ' + galN + ' fresh shapes and averaged the ' + galTop + ' that pushed that neuron highest. ' +
      'A sharp picture means the neuron fires for one particular thing; a smear means it fires for a mix. ' +
      '<strong>' + clear + ' of ' + count + '</strong> here have a clear favourite (outlined in blue): at least two-thirds of their top ' + galTop + ' are the same shape. ' +
      (random ? 'These weights are random, so few do, and most tiles are smears. Train it and look again.' :
        training ? 'Watch the count change as it trains.' :
        'A network of the same size with random weights manages about ' + galChance[galLayer] + ', so most of these preferences were learned. Nobody chose what any neuron should look for; training did.') +
      (here >= 0 ? ' <strong>Pinned:</strong> ' + cell(galLayer, here) + '. Of its top ' + galTop + ', ' + Math.round(d.share[here] * galTop) + ' were “' + L.esc(NAMES[d.fav[here]]) + '”. Its weights are drawn underneath.' : ' Click a tile to pin that neuron in the network above.');
  }
  gal.addEventListener('click', ev => {
    const r = gal.getBoundingClientRect(), n = GRID[galLayer], col = Math.floor((ev.clientX - r.left) / r.width * n), row = Math.floor((ev.clientY - r.top) / r.height * n);
    if (col < 0 || col >= n || row < 0 || row >= n) return;
    const j = row * n + col;
    view.pin(view.index(galLayer, j)); explain(galLayer, j); drawGallery();
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
      teaching ? (mine.link ? 'This link carries a shape someone taught this network: <strong>“' + NAMES[SLOT] + '”</strong>. The weights themselves are far too many to fit in a link, so the page is teaching it again now from their ' + mine.ex.length + ' drawings. ' : 'Training on your ' + mine.ex.length + ' drawings, mixed in with the other eight shapes. ') +
        'Each practice copy is moved somewhere else on the grid, often made a row or two taller, shorter, wider or narrower, and speckled, so it learns the shape and not one exact picture. Watch the answer line above change.' :
      mine ? '<strong>Done.</strong> The last output now answers “' + NAMES[SLOT] + '”. It learned that from ' + mine.ex.length + ' drawings, and not one line of code changed. Move it, or draw it a little bigger or smaller, and it should still know it. Draw it very differently and it may not: those ' + mine.ex.length + ' drawings are all it has to go on.' + (shipped ? ' <em>Forget it</em> puts ' + was + ' back.' : '') + ' <em>Copy link to this drawing</em> now carries the shape too.' :
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
  const tidy = t => (t || '').replace(/[^\p{L}\p{N} \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 14) || 'my shape';
  // start teaching: the drawings take over the last output and training begins from the weights as they are
  function teach(name, ex, viaLink, keepInput) {
    mine = { ex: ex.map(e => Float32Array.from(e)), link: !!viaLink };
    NAMES[SLOT] = name; GLYPHS[SLOT] = '✎'; labels();
    auto = false;
    if (keepInput) truth = -1; else { x = Float32Array.from(mine.ex[0]); truth = SLOT; }
    if (view.stepping) view.play();
    foolEnd();
    teaching = true; training = true; state = 'random'; steps = 0; lastAcc = 0;
    run(); status(); syncButtons(); L.kick();
  }
  tGo.addEventListener('click', () => { if (draft.length >= 3 && !training) teach(tidy(tName.value), draft); });
  tForget.addEventListener('click', restore);

  /* ---------- the four panels under the controls: one open at a time ---------- */
  const panels = { netBreakBtn: 'netBreak', netFoolBtn: 'netFool', netGalleryBtn: 'netGalleryBox', netTeachBtn: 'netTeach' };
  function openPanel(id) {
    Object.keys(panels).forEach(k => {
      const on = k === id, b = L.$('#' + k);
      L.$('#' + panels[k]).hidden = !on; b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.classList.toggle('active', on);
    });
    galOpen = id === 'netGalleryBtn';
    if (galOpen) drawGallery();
    if (id === 'netBreakBtn') breakRead();
    if (id === 'netTeachBtn') teachRead();
    if (id === 'netFoolBtn') foolRead(); else if (foolBase) foolEnd();       // the game ends when its panel closes
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

  /* ---------- a link that reopens the page with this drawing and viewing angle, and with a taught shape if there is one ---------- */
  function link() {
    const a = view.viewAngle();
    return location.origin + location.pathname + '?net=' + S.toHex(x) + '.' + Math.round(a.yaw * 100) + '.' + Math.round(a.pitch * 100) + '.' + Math.round(a.zoom * 100) +
      (mine ? '&mine=' + encodeURIComponent(NAMES[SLOT]) + '~' + mine.ex.map(S.toHex).join('~') : '');
  }
  L.$('#netShare').addEventListener('click', () => {
    const url = link(), field = L.$('#netLink'), note = L.$('#netShareNote');
    const what = 'It reopens the page with this drawing, seen from this angle' + (mine ? ', and teaches the network “' + NAMES[SLOT] + '” again from the ' + mine.ex.length + ' drawings.' : '.');
    L.$('#netShareBox').hidden = false; field.value = url;
    const fallback = () => { field.focus(); field.select(); note.textContent = 'Copy this link by hand. ' + what; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => { note.textContent = 'Link copied. ' + what; }, fallback);
    else fallback();
  });
  let shared = false, linked = null;
  (function () {
    let q = null, own = null;
    try { const u = new URLSearchParams(location.search); q = u.get('net'); own = u.get('mine'); } catch (e) { /* very old browser */ }
    const m = q && /^([0-9a-f]{16})(?:\.(-?\d{1,3})\.(-?\d{1,3})\.(\d{2,3}))?$/.exec(q);
    if (m) {
      x = S.fromHex(m[1]);
      if (m[2] != null) view.setView({ yaw: m[2] / 100, pitch: m[3] / 100, zoom: m[4] / 100 });
      auto = false; truth = -1; shared = true;
    }
    // a taught shape: its name, then three to eight drawings, each as 16 hex digits
    const parts = own ? own.split('~') : [], ex = parts.slice(1).map(S.fromHex);
    if (ex.length >= 3 && ex.length <= 8 && ex.every(e => e && e.reduce((s, v) => s + v, 0) >= 3)) linked = { name: tidy(parts[0]), ex, keep: !!m };
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
  if (linked) { draft = linked.ex.map(e => Float32Array.from(e)); thumbs(); tName.value = linked.name; openPanel('netTeachBtn'); teach(linked.name, linked.ex, true, linked.keep); }
  let seen = shared || !!linked;
  try { seen = seen || localStorage.getItem('lab-net-tour') === '1'; } catch (e) { /* private mode */ }
  if (!seen) tourSet(1);
})();

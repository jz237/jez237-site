/* The training page's hero: the same feed-forward network as the main guide, but being trained
   while you watch. Each round is real: a shape goes forward (blue and pink), the error for the
   right answer is traced backwards through the same connections (gold and orange), and then the
   weights really are nudged, by this one example and a batch of others. It starts from random
   weights, gets to about 97% in a couple of minutes, pauses, and starts again. */
(function () {
  'use strict';
  const L = Lab, C = L.C, M = window.LabMLP, cv = L.$('#ddNet');
  if (!cv || !M || !L.net3d) return;
  const S = M.shapes, GRID = M.GRID, SIZES = M.SIZES, G = SIZES.length - 1, K = S.NAMES.length;
  const net = new M.MLP(SIZES, 31), rnd = L.rng(777), trnd = L.rng(Date.now() & 0xfffff);
  const neurons = SIZES.reduce((s, n) => s + n, 0);
  const an = name => (/^[aeiou]/.test(name) ? 'an ' : 'a ') + name;
  let phase = 'forward', truth = 0, guess = 0, x = new Float32Array(SIZES[0]), steps = 0, round = 0, good = 0, acc = M.accuracy(net, L.rng(3), 250), hist = [acc];
  const names = ['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'HIDDEN 3', 'HIDDEN 4', 'OUTPUT'], shorts = ['IN', 'H1', 'H2', 'H3', 'H4', 'OUT'];
  const note = html => { L.$('#ddNote').innerHTML = html; };

  const view = L.net3d(cv, {
    layers: GRID.map((n, l) => ({ r: n, c: n, name: names[l], short: shorts[l] })),
    weights: g => net.W[g], speed: 1.45, hold: 700,
    header: small => (small ? 'TRAINING' : 'TRAINING A FEED-FORWARD NETWORK') + '  ·  ' + neurons + ' NEURONS  ·  ' + net.weights.toLocaleString() + ' WEIGHTS' + (small ? '' : '  ·  STEP ' + steps.toLocaleString() + '  ·  ' + (phase === 'forward' ? 'FORWARD: THE GUESS' : 'BACKWARD: THE BLAME')),
    color: (l, i, v) => (phase === 'backward' ? (v < 0 ? C.orange : C.gold) : l === G ? (i === guess ? C.gold : C.violet) : l === 0 ? C.green : v < 0 ? C.rose : C.cyan),
    describe: (l, i, v) => [
      (l === G ? 'output “' + S.NAMES[i] + '”' : l === 0 ? 'input ' + (i + 1) : 'hidden ' + l + ', neuron ' + (i + 1)) + (phase === 'backward' ? ':  blame ' : ':  ') + (l === G && phase !== 'backward' ? Math.round(v * 100) + '%' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(3)),
      phase === 'backward' ? 'how much this neuron contributed to the error' : (l ? SIZES[l - 1] + ' weights in' : 'fed from outside') + (l < G ? '  ·  ' + SIZES[l + 1] + ' weights out' : '')
    ],
    onCycle: next,
    onStage(l) {
      if (phase === 'forward' && l === G) note('<strong>1. Forward.</strong> ' + an(S.NAMES[truth]).replace(/^a/, 'A') + ' went in. The network says <strong>' + an(S.NAMES[guess]) + '</strong>. ' + (guess === truth ? 'Right, but it can still be more sure.' : 'Wrong: it should have said ' + S.NAMES[truth] + '.'));
    }
  });

  // the small read-outs in the corners: the shape being shown, and the share of fresh shapes it gets right
  const pad = L.$('#ddPad'), cells = [];
  for (let i = 0; i < SIZES[0]; i++) { const s = L.h('span', { class: 'net-px' }); pad.append(s); cells.push(s); }
  const accCv = L.$('#ddAcc');
  function readouts() {
    cells.forEach((s, i) => s.style.setProperty('--v', (0.05 + 0.95 * x[i]).toFixed(2)));
    L.$('#ddAccText').textContent = L.pct(acc, 0) + ' right  ·  ' + steps.toLocaleString() + ' steps';
    const v = L.fit(accCv), ctx = v.ctx, X = i => 4 + (v.w - 8) * i / Math.max(24, hist.length - 1), Y = a => v.h - 4 - (v.h - 8) * a;
    ctx.clearRect(0, 0, v.w, v.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.setLineDash([3, 4]);
    [1 / K, 1].forEach(a => { ctx.beginPath(); ctx.moveTo(4, Y(a)); ctx.lineTo(v.w - 4, Y(a)); ctx.stroke(); });
    ctx.setLineDash([]);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
    hist.forEach((a, i) => (i ? ctx.lineTo(X(i), Y(a)) : ctx.moveTo(X(i), Y(a))));
    ctx.stroke();
    ctx.beginPath(); ctx.arc(X(hist.length - 1), Y(acc), 3.5, 0, 6.2832); ctx.fillStyle = C.gold; ctx.fill();
  }

  function forward(settled) {
    phase = 'forward'; truth = Math.floor(rnd() * K); x = S.make(truth, rnd);
    net.forward(x);
    const vals = net.a.map(a => Float32Array.from(a));
    guess = 0; for (let c = 1; c < K; c++) if (vals[G][c] > vals[G][guess]) guess = c;
    view.setPass({ vals, mags: vals.map((a, l) => Float32Array.from(a, v => Math.min(1, Math.abs(l === G ? v * 2.2 : v)))), settled: !!settled });
    readouts();
    if (!settled) note('<strong>1. Forward.</strong> ' + an(S.NAMES[truth]).replace(/^a/, 'A') + ' goes in and the signal runs left to right…');
  }
  function backward() {
    phase = 'backward';
    net.forward(x); net.backward(truth);                    // fills net.d (blame per layer) and the gradient sums
    const vals = [Float32Array.from(net.din)].concat(net.d.map(d => Float32Array.from(d)));
    const mags = vals.map(a => { let m = 1e-9; for (let i = 0; i < a.length; i++) if (Math.abs(a[i]) > m) m = Math.abs(a[i]); return Float32Array.from(a, v => Math.abs(v) / m); });
    const edges = net.W.map((W, g) => { const nIn = SIZES[g], e = new Float32Array(W.length), d = net.d[g]; for (let j = 0; j < d.length; j++) for (let i = 0; i < nIn; i++) e[j * nIn + i] = W[j * nIn + i] * d[j]; return e; });
    view.setPass({ vals, mags, edges, dir: -1, tint: [C.gold, C.orange] });
    note('<strong>2. Backward.</strong> The gap between its answer and the right one is traced back through the same connections, right to left. Each neuron and weight gets its share of the blame.');
  }
  function learn() {
    net.step(M.LR, 1); steps++;                             // the nudge from the example you just watched
    const more = Math.min(60, 10 + 8 * round);               // plus a batch of others, so it learns in minutes, not hours
    for (let i = 0; i < more; i++) { M.trainStep(net, trnd, M.BATCH, M.LR); steps++; }
    round++; acc = M.accuracy(net, L.rng(1000 + round), 250); hist.push(acc);
    view.refreshWeb();
  }
  function restart() {
    net.init(((Date.now() & 0xffff) << 1) | 1); steps = 0; round = 0; good = 0; acc = M.accuracy(net, L.rng(3), 250); hist = [acc];
    view.refreshWeb(); forward();
    note('<strong>Starting again from random weights.</strong> Right now it is guessing: about 1 in 9.');
  }
  function next() {
    if (phase === 'forward') return backward();
    learn();
    good = acc >= 0.97 ? good + 1 : 0;
    if (good >= 6 || round > 70) return restart();
    forward();
    note('<strong>3. Nudge.</strong> Every weight was just moved a little against its blame, for that shape and ' + Math.min(60, 2 + 8 * round) * M.BATCH + ' or so others. It now gets <strong>' + L.pct(acc, 0) + '</strong> of fresh shapes right. Next shape…');
  }
  const again = L.$('#ddRestart');
  if (again) again.addEventListener('click', restart);

  if (L.reduce) {
    // no travelling waves with reduced motion, so show the end result instead of a frozen first frame
    const shipped = window.HERO_WEIGHTS;
    if (shipped && net.unpack(shipped)) { acc = shipped.accuracy; steps = shipped.steps; hist = [1 / K, acc]; view.refreshWeb(); }
    forward(true);
    note('<strong>Motion is reduced on this device,</strong> so the training animation is off. This is the finished network, after ' + steps.toLocaleString() + ' rounds of guess, blame and nudge: it gets ' + L.pct(acc, 0) + ' of fresh shapes right.');
  } else forward();
})();

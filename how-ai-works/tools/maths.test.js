/* Checks on the arithmetic behind the page: the shape network (js/mlp.js) and the tiny language model
   (js/tinygpt.js). No browser and no dependencies:

     node --test how-ai-works/tools/maths.test.js

   .github/workflows/how-ai-works-tests.yml runs this on every pull request that touches how-ai-works/. */
'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), vm = require('vm');
const M = require('../js/mlp.js'), TinyGPT = require('../js/tinygpt.js'), D = require('../js/data.js');
const S = M.shapes, P = M.probe, K = S.NAMES.length;

// the weight files are written for the page (window.X = ...), so read them through a pretend window
function shipped(file, name) {
  const win = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), { window: win });
  return JSON.parse(JSON.stringify(win[name]));      // plain objects of this realm, so deepEqual can compare them
}
const HERO = shipped('hero-weights.js', 'HERO_WEIGHTS');
const trained = () => { const net = new M.MLP(M.SIZES, 7); assert.ok(net.unpack(HERO), 'shipped weights load'); return net; };
const grid = rows => { const x = new Float32Array(64); rows.forEach((s, r) => { for (let c = 0; c < s.length; c++) if (s[c] === '#') x[r * 8 + c] = 1; }); return x; };
const lit = x => x.reduce((s, v) => s + (v > 0.5 ? 1 : 0), 0);
const flip = (x, i) => { const y = Float32Array.from(x); y[i] = y[i] > 0.5 ? 0 : 1; return y; };
// does flipping some pair of squares change the answer? (2,016 passes)
function pairWorks(net, x, from) {
  for (let i = 0; i < 64; i++) for (let j = i + 1; j < 64; j++) if (net.predict(flip(flip(x, i), j)) !== from) return true;
  return false;
}
const T_SHAPE = grid(['', ' #####', '   #', '   #', '   #', '   #']);

/* ---------- the shape network ---------- */
test('backward() matches gradients measured by nudging weights', () => {
  const net = new M.MLP([64, 10, 8, K], 3), r = M.rng(5), x = S.make(4, r), y = 4;
  net.forward(x); net.backward(y);
  let worst = 0;
  for (let g = 0; g < net.G; g++) for (let n = 0; n < 40; n++) {
    const i = Math.floor(r() * net.W[g].length), keep = net.W[g][i], eps = 1e-3;
    net.W[g][i] = keep + eps; const up = -Math.log(net.forward(x)[y]);
    net.W[g][i] = keep - eps; const dn = -Math.log(net.forward(x)[y]);
    net.W[g][i] = keep;
    const num = (up - dn) / (2 * eps), ana = net.gW[g][i];
    worst = Math.max(worst, Math.abs(num - ana) / Math.max(1e-4, Math.abs(num) + Math.abs(ana)));
  }
  assert.ok(worst < 2e-2, 'worst relative error ' + worst);     // 32-bit weights, so this cannot be much tighter
});

test('forward() gives odds that add up to one, and the mask switches off exactly the neurons it names', () => {
  const net = trained(), x = S.make(5, M.rng(1));
  const p = Float32Array.from(net.forward(x));
  assert.ok(Math.abs(p.reduce((s, v) => s + v, 0) - 1) < 1e-5);
  const off = M.SIZES.map(n => new Uint8Array(n));
  off[2][3] = 1; off[2][77] = 1;
  net.forward(x, off);
  assert.equal(net.a[2][3], 0); assert.equal(net.a[2][77], 0);
  assert.notEqual(net.a[2][4], 0);
  assert.deepEqual(Array.from(net.forward(x)), Array.from(p), 'a pass without the mask is unchanged afterwards');
  assert.deepEqual(Array.from(net.forward(x, M.SIZES.map(n => new Uint8Array(n)))), Array.from(p), 'an empty mask changes nothing');
});

test('the shipped weights are as accurate as the page says', () => {
  const net = trained();
  assert.deepEqual(HERO.sizes, M.SIZES);
  const acc = M.accuracy(net, M.rng(77), 3000);
  assert.ok(acc >= 0.95, 'accuracy ' + acc);
  assert.ok(Math.abs(acc - HERO.accuracy) < 0.015, 'measured ' + acc + ', page claims ' + HERO.accuracy);
});

test('pack() and unpack() round-trip, and unpack() refuses weights of the wrong shape', () => {
  const net = trained(), back = new M.MLP(M.SIZES, 1), r = M.rng(4);
  assert.ok(back.unpack(net.pack()));
  for (let i = 0; i < 300; i++) { const x = S.make(i % K, r); assert.equal(back.predict(x), net.predict(x)); }
  assert.equal(new M.MLP([64, 10, K], 1).unpack(HERO), false);
  assert.equal(back.unpack({ sizes: HERO.sizes, scales: HERO.scales, data: HERO.data.slice(0, 400) }), false);
});

test('training from random weights learns the shapes', () => {
  const net = new M.MLP(M.SIZES, 21), r = M.rng(8);
  const before = M.accuracy(net, M.rng(3), 400);
  let first = 0, last = 0;
  for (let s = 0; s < 400; s++) { const l = M.trainStep(net, r, M.BATCH, M.LR); if (s < 20) first += l / 20; if (s >= 380) last += l / 20; }
  const after = M.accuracy(net, M.rng(3), 400);
  assert.ok(before < 0.3, 'random weights should be near guessing, got ' + before);
  assert.ok(after > 0.6, 'after 400 steps, got ' + after);
  assert.ok(last < first * 0.6, 'loss went from ' + first + ' to ' + last);
});

/* ---------- shapes, links and practice copies ---------- */
test('every built-in shape is drawn inside the grid, the same way for the same seed', () => {
  for (let c = 0; c < K; c++) for (let seed = 1; seed <= 40; seed++) {
    const a = S.make(c, M.rng(seed), true), b = S.make(c, M.rng(seed), true);
    assert.deepEqual(Array.from(a), Array.from(b));
    assert.ok(lit(a) >= 2, S.NAMES[c] + ' seed ' + seed + ' is nearly empty');
    assert.ok(a.every(v => v === 0 || v === 1));
    assert.ok(S.make(c, M.rng(seed)).every(v => v >= 0 && v <= 1));
  }
});

test('a drawing survives the trip into a link and back', () => {
  const r = M.rng(12);
  for (let n = 0; n < 50; n++) {
    const x = Float32Array.from({ length: 64 }, () => (r() < 0.4 ? 1 : 0)), hex = S.toHex(x);
    assert.match(hex, /^[0-9a-f]{16}$/);
    assert.deepEqual(Array.from(S.fromHex(hex)), Array.from(x));
  }
  ['', 'xyz', '0123456789abcdeg', '0123456789ABCDEF', '0123456789abcdef0', null, 5].forEach(bad => assert.equal(S.fromHex(bad), null));
});

test('practice copies of a drawing come in different sizes and places, and never lose the drawing', () => {
  const r = M.rng(31), heights = new Set(), widths = new Set(), tops = new Set();
  let same = 0;
  for (let n = 0; n < 600; n++) {
    const v = S.variant(T_SHAPE, r, true);
    assert.ok(v.every(q => q === 0 || q === 1));
    assert.ok(lit(v) >= 3, 'copy ' + n + ' has almost nothing in it');
    let r0 = 8, r1 = -1, c0 = 8, c1 = -1;
    v.forEach((q, i) => { if (q) { r0 = Math.min(r0, i >> 3); r1 = Math.max(r1, i >> 3); c0 = Math.min(c0, i & 7); c1 = Math.max(c1, i & 7); } });
    heights.add(r1 - r0 + 1); widths.add(c1 - c0 + 1); tops.add(r0);
    if (r1 - r0 === 4 && c1 - c0 === 4 && lit(v) === lit(T_SHAPE)) same++;
  }
  assert.ok(heights.has(3) && heights.has(7), 'heights seen: ' + Array.from(heights).sort());
  assert.ok(widths.has(3) && widths.has(7), 'widths seen: ' + Array.from(widths).sort());
  assert.ok(tops.size >= 4, 'it should land in many different rows');
  assert.ok(same > 60, 'a fair share should be the drawing as it was, got ' + same);
  assert.equal(lit(S.variant(new Float32Array(64), r)), 0, 'a blank drawing stays blank');
  assert.ok(S.variant(T_SHAPE, r).every(q => q >= 0 && q <= 1), 'speckled copies stay in range');
});

test('stretching keeps strokes one square thick', () => {
  // the T is a bar and a stem; a taller or wider copy made by stretching still has a one-square bar and stem
  const r = M.rng(77);
  let stretched = 0, thick = 0;
  for (let n = 0; n < 800; n++) {
    const v = S.variant(T_SHAPE, r, true), rows = [];
    for (let a = 0; a < 8; a++) { let k = 0; for (let b = 0; b < 8; b++) k += v[a * 8 + b]; if (k) rows.push(k); }
    // a stretched T: one row holding the whole bar, every other row a single square
    if (rows.length !== 5 && rows.slice(1).every(k => k === 1) && rows[0] >= 3) stretched++;
    if (rows.filter(k => k >= 3).length > 1) thick++;
  }
  assert.ok(stretched > 150, 'expected many stretched copies with thin strokes, got ' + stretched);
  // only the copies scaled like a picture (about one in seven) may come out with a thicker bar
  assert.ok(thick < 120, 'too many copies have a thickened bar: ' + thick + ' of 800');
});

/* ---------- the questions the page asks ---------- */
test('why() compares every flip against a baseline taken with the same weights', () => {
  // The page once took the baseline from a pass saved before training moved the weights on,
  // and compared flips made afterwards against it. This pins the behaviour down.
  const net = trained(), x = S.make(4, M.rng(9), true), cls = net.predict(x);
  const stale = net.forward(x)[cls];
  for (let s = 0; s < 30; s++) M.trainStep(net, M.rng(100 + s), M.BATCH, 0.02);          // the weights move on
  const res = P.why(net, x, cls), now = net.forward(x)[cls];
  assert.notEqual(now, stale);
  assert.equal(res.base, now);
  for (let i = 0; i < 64; i++) assert.ok(Math.abs(res.d[i] - (net.forward(flip(x, i))[cls] - now)) < 1e-6, 'square ' + i);
  const off = M.SIZES.map(n => new Uint8Array(n)); off[1].fill(1, 0, 40);
  const hurt = P.why(net, x, cls, off);
  assert.equal(hurt.base, net.forward(x, off)[cls]);
  assert.ok(Math.abs(hurt.d[10] - (net.forward(flip(x, 10), off)[cls] - hurt.base)) < 1e-6);
});

test('trace() follows connections that really do push the answer up', () => {
  const net = trained(), r = M.rng(15);
  for (let n = 0; n < 40; n++) {
    const x = S.make(n % K, r), cls = n % 3 ? net.predict(x) : (n * 7) % K, t = P.trace(net, x, cls);
    const a = (net.forward(x), net.a.map(v => Float32Array.from(v)));
    assert.deepEqual(t.nodes[net.G], [{ i: cls, r: 1 }]);
    assert.ok(t.share > 0 && t.share <= 1 + 1e-6, 'share ' + t.share);
    for (let g = 0; g < net.G; g++) {
      assert.ok(t.nodes[g].length <= (g ? 6 : 12));
      const lower = new Set(t.nodes[g].map(q => q.i)), upper = new Set(t.nodes[g + 1].map(q => q.i)), nIn = net.sizes[g];
      assert.ok(t.edges[g].length <= 18);
      t.edges[g].forEach(e => {
        assert.ok(lower.has(e.from) && upper.has(e.to), 'an edge joins two kept neurons');
        // the direction being followed: up for the output, and for a hidden neuron whichever way it actually went
        const want = g + 1 === net.G ? 1 : Math.sign(a[g + 1][e.to]), w = net.W[g][e.to * nIn + e.from];
        assert.ok(want * w * a[g][e.from] > 0, 'gap ' + g + ' edge ' + e.from + '>' + e.to + ' does not help');
        assert.equal(e.neg, w < 0);
      });
    }
    t.nodes[0].forEach(q => assert.ok(x[q.i] > 0, 'a path can only end at a square with something in it'));
    assert.deepEqual(P.trace(net, x, cls), t, 'the same question gives the same answer');
  }
  assert.equal(P.trace(net, new Float32Array(64), 0).nodes[0].length, 0, 'nothing drawn, so no path reaches the input');
});

test('fool() really changes the answer, and is honest about whether its count is the minimum', () => {
  const net = trained(), r = M.rng(23), seen = { exact: 0, bound: 0 };
  for (let n = 0; n < 27; n++) {
    const x = S.make(n % K, r, true), before = Float32Array.from(x), from = net.predict(x), f = P.fool(net, x);
    assert.deepEqual(Array.from(x), Array.from(before), 'the drawing it was given is left alone');
    assert.equal(f.from, from);
    if (!f.flips) continue;
    const y = Float32Array.from(x); f.flips.forEach(i => { y[i] = y[i] > 0.5 ? 0 : 1; });
    assert.equal(net.predict(y), f.to);
    assert.notEqual(f.to, from);
    assert.equal(new Set(f.flips).size, f.flips.length);
    const single = Array.from({ length: 64 }, (_, i) => net.predict(flip(x, i)) !== from);
    if (f.exact) {
      seen.exact++;
      assert.ok(f.flips.length <= 3);
      assert.equal(f.flips.length === 1, single.some(Boolean), 'one flip is claimed exactly when one flip is enough');
      if (f.flips.length === 3) assert.ok(!pairWorks(net, x, from), 'three is only the minimum if no pair works');
    } else {
      seen.bound++;
      assert.ok(f.flips.length > 3 && f.least === 3);
      assert.ok(!single.some(Boolean));
    }
    if (f.flips.length >= 3) {
      // every flip left in the set is needed: put any one back and the first answer returns
      f.flips.forEach(i => { const z = flip(y, i); z[i] = x[i]; assert.equal(net.predict(z), from, 'flip ' + i + ' was not needed'); });
    }
  }
  assert.ok(seen.exact > 5, 'expected some one- and two-flip cases');
});

test('excite() finds that trained neurons have favourite shapes far more often than random ones', () => {
  const clear = net => { const r = M.rng(123), e = P.excite(net, c => S.make(c, r), 900, K); return [1, 2, 3, 4].map(l => Array.from(e[l].share).filter(v => v >= 2 / 3).length); };
  const net = trained(), e = P.excite(net, (() => { const r = M.rng(5); return c => S.make(c, r); })(), 180, K, 10);
  for (let l = 1; l < net.G; l++) {
    assert.equal(e[l].pics.length, M.SIZES[l] * 64);
    assert.ok(e[l].pics.every(v => v >= 0 && v <= 1));
    assert.ok(e[l].share.every(v => v >= 1 / K - 1e-6 && v <= 1));
    assert.ok(e[l].fav.every(v => v < K));
  }
  const learned = clear(net), chance = clear(new M.MLP(M.SIZES, 7));
  learned.forEach((n, i) => assert.ok(n > chance[i] * 1.5, 'hidden layer ' + (i + 1) + ': trained ' + n + ', random ' + chance[i]));
});

/* ---------- the tiny language model ---------- */
test('TinyGPT: lossGrad() matches gradients measured by nudging weights', () => {
  const cfg = Object.assign({}, D.config, { d: 8, F: 12, f64: true });
  const m = new TinyGPT(cfg, 7), sq = D.corpus[100], inp = sq.slice(0, -1), tgt = sq.slice(1);
  m.g.fill(0); m.lossGrad(inp, tgt, 1);
  const g = Float64Array.from(m.g), r = TinyGPT.rng(3);
  let worst = 0;
  for (let t = 0; t < 300; t++) {
    const i = Math.floor(r() * m.size), keep = m.w[i], e = 1e-5;
    m.w[i] = keep + e; m.g.fill(0); const a = m.lossGrad(inp, tgt, 1);
    m.w[i] = keep - e; m.g.fill(0); const b = m.lossGrad(inp, tgt, 1);
    m.w[i] = keep;
    const num = (a - b) / (2 * e), err = Math.abs(num - g[i]) / Math.max(1e-7, Math.abs(num) + Math.abs(g[i]));
    if (Math.abs(num) > 1e-7 && err > worst) worst = err;
  }
  assert.ok(worst < 1e-4, 'worst relative error ' + worst);
});

test('TinyGPT: the shipped weights fit the sentences in data.js and predict them about as well as recorded', () => {
  const pk = shipped('weights.js', 'LAB_WEIGHTS');
  assert.equal(pk.signature, D.signature, 'data.js changed since the weights were trained: rebuild them with tools/build-weights.js');
  assert.deepEqual(pk.cfg, D.config);
  const m = TinyGPT.unpack(pk), loss = m.evalLoss(D.corpus);
  assert.ok(Math.abs(loss - pk.loss) < 0.15, 'loss ' + loss + ', recorded ' + pk.loss);
  const fresh = new TinyGPT(D.config, 3).evalLoss(D.corpus.slice(0, 80));
  assert.ok(fresh > loss * 2, 'an untrained model should be far worse (' + fresh + ' against ' + loss + ')');
  const p = m.next(D.corpus[0].slice(0, 3));
  assert.ok(Math.abs(p.reduce((s, v) => s + v, 0) - 1) < 1e-4);
});

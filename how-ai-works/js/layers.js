/* Chapter 5 — one neuron you can tune, then the page's real layer stack: its
   attention into the last position at each layer, and a "logit lens" read-out
   of what the model would say if it were cut off at that depth. */
(function () {
  'use strict';
  const L = Lab, C = L.C, ai = L.ai, V = ai.V;

  /* ---------- one neuron ---------- */
  const nSvg = L.$('#neuronSvg');
  if (nSvg) {
    const gelu = x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
    const ids = ['nx1', 'nx2', 'nx3', 'nw1', 'nw2', 'nw3', 'nb'];
    const val = id => Number(L.$('#' + id).value);
    const f2 = x => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(2);
    const drawNeuron = () => {
      const x = [val('nx1'), val('nx2'), val('nx3')], w = [val('nw1'), val('nw2'), val('nw3')], b = val('nb');
      const prod = x.map((v, i) => v * w[i]), sum = prod.reduce((a, c) => a + c, 0) + b, out = gelu(sum);
      const ys = [44, 110, 176];
      let s = '';
      ys.forEach((y, i) => {
        const pos = prod[i] >= 0, wd = 1 + Math.min(9, Math.abs(prod[i]) * 5);
        s += '<path class="n-edge' + (Math.abs(prod[i]) > 0.02 ? ' flow' : '') + '" d="M84 ' + y + ' C170 ' + y + ' 190 110 268 110" stroke="' + (pos ? C.cyan : C.rose) + '" stroke-width="' + wd.toFixed(1) + '"/>' +
          '<circle cx="62" cy="' + y + '" r="22" fill="' + L.heat(x[i]) + '" stroke="rgba(255,255,255,.35)"/>' +
          '<text x="62" y="' + (y + 4) + '" class="n-num">' + x[i].toFixed(1) + '</text>' +
          '<text x="92" y="' + (y + (i === 2 ? 26 : i === 1 ? -8 : -14)) + '" class="n-lab">× ' + w[i].toFixed(1) + ' = ' + f2(prod[i]) + '</text>';
      });
      s += '<circle cx="292" cy="110" r="27" fill="rgba(157,134,255,.18)" stroke="' + C.violet + '" stroke-width="2"/>' +
        '<text x="292" y="104" class="n-cap">sum</text><text x="292" y="122" class="n-num">' + f2(sum) + '</text>' +
        '<text x="292" y="160" class="n-lab" text-anchor="middle">bias ' + f2(b) + '</text>';
      const bx = 352, by = 60, bw = 110, bh = 100, px = v => bx + (v + 4) / 8 * bw, py = v => by + bh - (v + 0.6) / 4.6 * bh;
      let d = '';
      for (let i = 0; i <= 40; i++) { const v = -4 + i * 0.2; d += (i ? 'L' : 'M') + px(v).toFixed(1) + ' ' + py(gelu(v)).toFixed(1); }
      const cxv = L.clamp(sum, -4, 4);
      s += '<path class="n-edge flow" d="M319 110 L352 110" stroke="' + C.violet + '" stroke-width="3"/>' +
        '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="10" fill="rgba(2,8,18,.9)" stroke="rgba(132,227,122,.5)"/>' +
        '<line x1="' + bx + '" x2="' + (bx + bw) + '" y1="' + py(0) + '" y2="' + py(0) + '" stroke="rgba(255,255,255,.14)"/>' +
        '<line x1="' + px(0) + '" x2="' + px(0) + '" y1="' + by + '" y2="' + (by + bh) + '" stroke="rgba(255,255,255,.14)"/>' +
        '<path d="' + d + '" fill="none" stroke="' + C.green + '" stroke-width="2.5"/>' +
        '<circle cx="' + px(cxv) + '" cy="' + py(gelu(cxv)) + '" r="6" fill="' + C.gold + '"/>' +
        '<text x="' + (bx + bw / 2) + '" y="' + (by - 9) + '" class="n-cap">activation (GELU)</text>';
      const o = L.clamp(out / 3);
      s += '<path class="n-edge' + (out > 0.03 ? ' flow' : '') + '" d="M462 110 L500 110" stroke="' + C.green + '" stroke-width="' + (1 + 8 * o).toFixed(1) + '"/>' +
        '<circle cx="528" cy="110" r="26" fill="rgba(132,227,122,' + (0.08 + 0.85 * o).toFixed(2) + ')" stroke="' + C.green + '" stroke-width="2"/>' +
        '<text x="528" y="104" class="n-cap">out</text><text x="528" y="122" class="n-num">' + out.toFixed(2) + '</text>';
      nSvg.innerHTML = s;
      ids.forEach(id => { const o2 = L.$('[data-for="' + id + '"]'); if (o2) o2.textContent = val(id).toFixed(1); });
      L.$('#neuronNote').innerHTML = sum < -0.6
        ? '<strong>Quiet.</strong> The weighted sum is well below zero, so the activation squashes it to almost nothing. This neuron has decided its pattern is not present.'
        : sum < 0.6 ? '<strong>On the edge.</strong> Near zero the output changes fastest — small nudges to a weight here change the neuron’s mind.'
          : '<strong>Firing.</strong> The inputs matched the weights, so the sum is strongly positive and passes almost straight through. Downstream neurons will see this.';
    };
    ids.forEach(id => L.$('#' + id).addEventListener('input', drawNeuron));
    L.$('#neuronShuffle').addEventListener('click', () => {
      ['nw1', 'nw2', 'nw3'].forEach(id => { L.$('#' + id).value = (Math.random() * 4 - 2).toFixed(1); });
      L.$('#nb').value = (Math.random() * 2 - 1).toFixed(1);
      drawNeuron();
    });
    drawNeuron();
  }

  /* ---------- the real stack ---------- */
  const cv = L.$('#stackCanvas');
  if (!cv) return;
  const NL = ai.model.cfg.L, MAXC = 6;
  const range = L.$('#layerRange'), lensEl = L.$('#lensBars'), sNote = L.$('#stackNote'), playB = L.$('#stackPlay');
  range.max = NL;
  let depth = 0, target = 0, playing = false, lensAt = -1, tr = null, cols = [], att = [];

  function recompute() {
    const mids = ai.window(L.prompt.mids);
    tr = ai.trace(L.prompt.mids);
    const n = tr.n, first = Math.max(0, n - MAXC);
    cols = mids.slice(first).map(m => (m === V.BOS ? 'start' : m === V.UNK ? '?' : ai.word(m)));
    // how much the last position read from each drawn token, per layer (heads averaged)
    att = tr.att.map(hs => cols.map((_, c) => hs.reduce((s, h) => s + h[(n - 1) * n + first + c], 0) / hs.length));
    lensAt = -1;
    L.$('#lensFor').textContent = L.prompt.text;
  }
  const top5 = k => Array.from(tr.lens[k], (p, m) => ({ m, p })).sort((a, b) => b.p - a.p).slice(0, 5);
  const name = m => (m === V.END ? 'end (.)' : ai.word(m));

  function lens(k) {
    if (k === lensAt) return;
    lensAt = k;
    const t = top5(k), final = top5(NL)[0].m;
    lensEl.innerHTML = t.map(r =>
      '<div class="lens-row' + (r.m === final ? ' hit' : '') + '"><span>' + L.esc(name(r.m)) + '</span><div class="bar"><i style="width:' + Math.max(2, r.p * 100).toFixed(0) + '%"></i></div><em>' + L.pct(r.p, 0) + '</em></div>').join('');
    L.$('#lensTitle').textContent = k === 0 ? 'Before any layer' : k === NL ? 'After the last layer' : 'If we stopped after layer ' + k;
    let s;
    if (ai.state === 'random') s = 'The weights are random, so every depth gives noise. Train the model in chapter 7 and watch this panel change.';
    else if (k === 0) s = 'This position holds nothing but the embedding of its own token, so the read-out mostly echoes that token back (“' + L.esc(name(t[0].m)) + '”, ' + L.pct(t[0].p, 0) + '). It has not read a single other word yet.';
    else {
      const prev = top5(k - 1)[0];
      s = (prev.m !== t[0].m ? 'Layer ' + k + ' changed the leading guess from “' + L.esc(name(prev.m)) + '” to “' + L.esc(name(t[0].m)) + '” (' + L.pct(t[0].p, 0) + ').'
        : 'Layer ' + k + ' kept “' + L.esc(name(t[0].m)) + '” in front and moved it from ' + L.pct(prev.p, 0) + ' to ' + L.pct(t[0].p, 0) + '.') +
        (k === NL ? ' This is the vector the output step really uses — these are the model’s actual odds.' : ' Attention has now pulled in other words; there is still a layer to go.');
    }
    sNote.innerHTML = '<strong>' + (k === 0 ? 'Depth 0 (the input).' : 'After layer ' + k + ' of ' + NL + '.') + '</strong> ' + s;
  }

  function draw(dt) {
    if (playing && dt) {
      target = Math.min(NL, target + dt / 3400);
      depth = target;
      range.value = Math.floor(depth + 1e-6);
      if (target >= NL) { playing = false; playB.textContent = 'Send it up again'; }
    } else depth += (target - depth) * (dt ? Math.min(1, dt * 0.006) : L.reduce ? 1 : 0);
    lens(Math.floor(depth + 0.02));

    const v = L.fit(cv), ctx = v.ctx, W = v.w, H = v.h, small = W < 520, nc = cols.length, last = nc - 1;
    ctx.clearRect(0, 0, W, H);
    const padL = small ? 10 : 78, padR = small ? 10 : 20;
    const colW = (W - padL - padR) / nc, cx = i => padL + colW * (i + 0.5);
    const yTok = H - 18, yEmb = H - 56, yTop = 46, bandH = (yEmb - yTop - 14) / NL;
    const yOf = d => yEmb - 10 - d * bandH;
    const mono = 'ui-monospace,Menlo,Consolas,monospace';
    const k = Math.min(NL - 1, Math.floor(depth)), f = depth - k, moving = depth < NL && (playing || Math.abs(target - depth) > 0.01);

    for (let i = 0; i < NL; i++) {
      const y1 = yOf(i + 1) + 4, hh = bandH - 8, act = moving && i === k;
      L.rr(ctx, padL - 4, y1, W - padL - padR + 8, hh, 10);
      ctx.fillStyle = act ? L.rgba(f < 0.5 ? C.gold : C.green, 0.1) : i < depth ? 'rgba(157,134,255,0.05)' : 'rgba(255,255,255,0.025)';
      ctx.fill();
      ctx.strokeStyle = act ? L.rgba(f < 0.5 ? C.gold : C.green, 0.6) : 'rgba(110,159,205,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.beginPath(); ctx.moveTo(padL, y1 + hh / 2); ctx.lineTo(W - padR, y1 + hh / 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      if (!small) {
        ctx.font = '800 10px ' + mono; ctx.fillStyle = act ? '#fff' : L.rgba(C.dim, 0.9);
        ctx.fillText('LAYER ' + (i + 1), 8, y1 + hh / 2);
      }
      ctx.font = '700 9.5px ' + mono;
      ctx.fillStyle = act && f >= 0.5 ? C.green : L.rgba(C.green, 0.45); ctx.fillText(small ? 'L' + (i + 1) + ' mlp' : 'mlp', padL + 2, y1 + 10);
      ctx.fillStyle = act && f < 0.5 ? C.gold : L.rgba(C.gold, 0.45); ctx.fillText(small ? 'L' + (i + 1) + ' attention' : 'attention', padL + 2, y1 + hh - 10);
      // the attention this layer really pays, drawn faintly once the layer has run
      if (i < depth - 0.5 || (act && f >= 0.5)) drawArcs(ctx, i, y1 + hh * 0.72, cx, 0.5, 1);
    }
    const yNow = yOf(depth);
    for (let i = 0; i < nc; i++) {
      const lastCol = i === last;
      ctx.strokeStyle = 'rgba(157,134,255,0.18)'; ctx.lineWidth = lastCol ? 5 : 3;
      ctx.beginPath(); ctx.moveTo(cx(i), yEmb); ctx.lineTo(cx(i), yTop + 4); ctx.stroke();
      ctx.strokeStyle = lastCol ? C.gold : C.violet; ctx.globalAlpha = lastCol ? 0.95 : 0.6;
      ctx.beginPath(); ctx.moveTo(cx(i), yEmb); ctx.lineTo(cx(i), yNow); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.font = '700 ' + (small ? 11 : 14) + 'px ' + mono; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = lastCol ? C.gold : '#dcf8ff'; ctx.fillText(cols[i], cx(i), yTok, colW - 4);
    }
    if (moving) {
      const y1 = yOf(k + 1) + 4, hh = bandH - 8;
      if (f < 0.5) drawArcs(ctx, k, y1 + hh * 0.72, cx, 1, f * 2);
      else {
        const ym = y1 + hh * 0.28, p = (f - 0.5) * 2;
        for (let i = 0; i < nc; i++) for (let j = 0; j < 7; j++) {
          const on = Math.sin(p * 9 + j * 1.7 + i * 2.3 + k) > 0.2;
          ctx.fillStyle = on ? L.rgba(C.green, 0.9) : L.rgba(C.green, 0.15);
          ctx.fillRect(cx(i) - 24 + j * 7, ym - 4, 5, 8);
        }
      }
    }
    for (let i = 0; i < nc; i++) {
      const lastCol = i === last;
      ctx.beginPath(); ctx.arc(cx(i), yNow, lastCol ? 7 : 4.5, 0, 6.2832);
      ctx.fillStyle = lastCol ? C.gold : C.violet; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.font = '700 ' + (small ? 10 : 11) + 'px ' + mono; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillStyle = depth >= NL - 0.02 ? C.rose : L.rgba(C.dim, 0.9);
    ctx.fillText('only this column is read to predict the next token →', cx(last) - 14, yTop - 14, cx(last) - 20);
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx(last), yTop + 2); ctx.lineTo(cx(last), yTop - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx(last) - 6, yTop - 14); ctx.lineTo(cx(last), yTop - 22); ctx.lineTo(cx(last) + 6, yTop - 14); ctx.stroke();
  }
  // arcs from every drawn token into the last position, thickness = real weight
  function drawArcs(ctx, layer, ya, cx, alpha, p) {
    const last = cols.length - 1;
    for (let from = 0; from < last; from++) {
      const wgt = att[layer][from];
      if (wgt < 0.01) continue;
      const x1 = cx(from), x2 = cx(last), my = ya - 10 - (last - from) * 7;
      ctx.strokeStyle = L.rgba(C.gold, alpha * (0.2 + 0.8 * wgt)); ctx.lineWidth = 0.8 + wgt * 10;
      ctx.beginPath(); ctx.moveTo(x1, ya); ctx.quadraticCurveTo((x1 + x2) / 2, my, x2, ya); ctx.stroke();
      if (alpha === 1 && p < 1) {
        const e = L.ease.io(p), q = (a, b, c) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * b + e * e * c;
        ctx.beginPath(); ctx.arc(q(x1, (x1 + x2) / 2, x2), q(ya, my, ya), 2 + wgt * 6, 0, 6.2832);
        ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
      }
      if (alpha === 1 || wgt > 0.12) {
        ctx.font = '700 10px ui-monospace,Menlo,Consolas,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = L.rgba(C.gold, alpha === 1 ? 1 : 0.7); ctx.fillText(L.pct(wgt, 0), x1 + 18, ya + 9);
      }
    }
  }

  recompute();
  L.scene(cv, draw);
  range.addEventListener('input', () => { playing = false; playB.textContent = 'Send the prompt up the stack'; target = Number(range.value); L.kick(); });
  playB.addEventListener('click', () => {
    if (L.reduce) { target = depth = NL; range.value = NL; L.kick(); return; }
    depth = target = 0; lensAt = -1; playing = true; playB.textContent = 'Running…'; L.kick();
  });
  L.onPrompt(() => { recompute(); playing = false; depth = target = 0; range.value = 0; playB.textContent = 'Send the prompt up the stack'; L.kick(); });
  ai.onChange(st => { if (st !== 'training') { recompute(); L.kick(); } });
  const sc = L.$('#tinyScale');
  if (sc) {
    const c = ai.model.cfg;
    sc.innerHTML = [['layers', c.L], ['numbers per token', c.d], ['attention heads per layer', c.H], ['neurons per MLP', c.F], ['weights', ai.model.size.toLocaleString()]]
      .map(r => '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>').join('');
  }
  lens(0);

  /* ---------- inside one layer: the feed-forward step, drawn in 3D with the model's own weights ---------- */
  const ffCv = L.$('#ffCanvas');
  if (ffCv && L.net3d) {
    const m = ai.model, d = m.cfg.d, F = m.cfg.F, NLAY = m.cfg.L, ffNote = L.$('#ffNote');
    let lay = 0, W = [new Float32Array(d * F), new Float32Array(F * d)];
    // the model stores each matrix as [from][to]; the 3D view wants [to][from]
    function loadWeights() {
      const o1 = m.lay['W1' + lay], o2 = m.lay['W2' + lay];
      for (let k = 0; k < d; k++) for (let j = 0; j < F; j++) W[0][j * d + k] = m.w[o1 + k * F + j];
      for (let k = 0; k < F; k++) for (let j = 0; j < d; j++) W[1][j * F + k] = m.w[o2 + k * d + j];
    }
    const view3 = L.net3d(ffCv, {
      layers: [{ r: 4, c: 6, name: 'IN', short: 'IN' }, { r: 8, c: 8, name: 'WORKING NEURONS', short: 'WORK' }, { r: 4, c: 6, name: 'OUT', short: 'OUT' }],
      weights: g => W[g], gap: 7, gapSmall: 5.6, yaw: -0.72, hold: 2600,
      header: small => 'LAYER ' + (lay + 1) + (small ? ' FEED-FORWARD' : ' FEED-FORWARD STEP  ·  ' + (2 * d + F) + ' NEURONS  ·  ' + (2 * d * F).toLocaleString() + ' WEIGHTS  ·  THIS MODEL’S REAL NUMBERS'),
      describe: (l, i, v) => [
        (l === 0 ? 'input ' : l === 1 ? 'working neuron ' : 'output ') + (i + 1) + ':  ' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2),
        l === 0 ? 'one of the 24 numbers describing this token' : l === 1 ? d + ' weights in  ·  ' + d + ' weights out' : 'added back to the token’s running vector'
      ],
      onCycle: () => send()
    });
    function send() {
      ai.trace(L.prompt.mids);                 // runs the model on the prompt; its working values are then readable
      const n = m.n, last = n - 1, c = m.c[lay], nextIn = lay + 1 < NLAY ? m.c[lay + 1].xin : m.xout;
      const vin = new Float32Array(d), hid = new Float32Array(F), out = new Float32Array(d);
      for (let j = 0; j < d; j++) { vin[j] = c.mm[last * d + j]; out[j] = nextIn[last * d + j] - c.xmid[last * d + j]; }
      for (let j = 0; j < F; j++) hid[j] = c.ha[last * F + j];
      const vals = [vin, hid, out];
      const mags = vals.map(a => { let mx = 1e-9; for (let i = 0; i < a.length; i++) if (Math.abs(a[i]) > mx) mx = Math.abs(a[i]); return Float32Array.from(a, v => Math.abs(v) / mx); });
      view3.setPass({ vals, mags });
      const piece = L.prompt.pieces[L.prompt.pieces.length - 1], busy = Array.from(mags[1]).filter(v => v > 0.3).length;
      ffNote.innerHTML = '<strong>Layer ' + (lay + 1) + ', working on “' + L.esc(L.bpe.show(piece.s).replace(/^[^a-z']+/i, '') || piece.s) + '”, the last token of your prompt.</strong> Of the ' + F + ' working neurons, ' + (busy === 1 ? 'one is' : busy + ' are') + ' doing most of the work for this token (brighter than a third of the brightest). A different prompt lights a different set, and that is the whole trick: which neurons fire decides what gets written back.';
    }
    function refresh() { loadWeights(); view3.refreshWeb(); send(); }
    L.$$('[data-ff]').forEach(b => b.addEventListener('click', () => {
      lay = Number(b.dataset.ff);
      L.$$('[data-ff]').forEach(o => { o.classList.toggle('active', o === b); o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      refresh();
    }));
    L.$('#ffReplay').addEventListener('click', send);
    L.onPrompt(send);
    ai.onChange(st => { if (st !== 'training') refresh(); });
    refresh();
  }
})();

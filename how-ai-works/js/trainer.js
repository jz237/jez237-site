/* Two reusable views onto the page's real model:
     Lab.embMap(canvas, opts)   — its embedding table flattened to 2-D (PCA)
     Lab.trainer.mount(el, opts) — train or fine-tune it live, in the tab
   Both read and write the single shared model in Lab.ai, so every other
   chapter reflects whatever the visitor has done to the weights. */
(function () {
  'use strict';
  const L = Lab, C = L.C, ai = L.ai, V = ai.V;
  const CLS = { who: C.gold, thing: C.cyan, doing: C.violet, describing: C.green, glue: C.dim };
  const CLS_NAME = { who: 'who', thing: 'things & places', doing: 'actions', describing: 'describing words', glue: 'glue words' };
  const mono = 'ui-monospace,Menlo,Consolas,monospace';

  /* ---- principal components of the embedding rows, aligned to the previous frame ---- */
  function project(toks, prev) {
    const d = ai.model.cfg.d, X = toks.map(m => ai.emb(m)), n = X.length;
    const mean = new Array(d).fill(0);
    X.forEach(r => r.forEach((v, j) => { mean[j] += v / n; }));
    X.forEach(r => r.forEach((v, j) => { r[j] = v - mean[j]; }));
    const cov = [];
    for (let a = 0; a < d; a++) { cov.push(new Array(d).fill(0)); for (let b = 0; b < d; b++) { let s = 0; for (let i = 0; i < n; i++) s += X[i][a] * X[i][b]; cov[a][b] = s / n; } }
    const axes = [];
    for (let c = 0; c < 2; c++) {
      let v = new Array(d).fill(0).map((_, j) => Math.sin(j * 1.7 + c * 2.1) + 0.3), lam = 0;
      for (let it = 0; it < 80; it++) {
        const nv = cov.map(row => row.reduce((s, x, j) => s + x * v[j], 0));
        lam = Math.sqrt(nv.reduce((s, x) => s + x * x, 0)) || 1;
        v = nv.map(x => x / lam);
      }
      axes.push(v);
      for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) cov[a][b] -= lam * v[a] * v[b];
    }
    let pts = X.map(r => [r.reduce((s, x, j) => s + x * axes[0][j], 0), r.reduce((s, x, j) => s + x * axes[1][j], 0)]);
    // scale by the typical radius, not the furthest outlier, and ease the crowded middle
    // apart; distance order from the centre is preserved, so neighbours stay neighbours
    const rad = pts.map(p => Math.hypot(p[0], p[1])).sort((a, b) => a - b), s90 = rad[Math.floor(rad.length * 0.9)] || 1;
    pts = pts.map(p => { const r = Math.hypot(p[0], p[1]) || 1e-9, q = Math.pow(Math.min(1, r / (s90 * 1.25)), 0.62); return [p[0] / r * q, p[1] / r * q]; });
    if (prev) {
      // PCA axes can flip or spin between updates; rotate/reflect to best match the last picture
      let best = null;
      [1, -1].forEach(ref => {
        let a = 0, b = 0;
        pts.forEach((p, i) => { const x = p[0], y = p[1] * ref, q = prev[i]; a += x * q[0] + y * q[1]; b += x * q[1] - y * q[0]; });
        const th = Math.atan2(b, a), score = Math.hypot(a, b);
        if (!best || score > best.score) best = { ref, th, score };
      });
      const cs = Math.cos(best.th), sn = Math.sin(best.th);
      pts = pts.map(p => { const x = p[0], y = p[1] * best.ref; return [x * cs - y * sn, x * sn + y * cs]; });
    }
    return pts;
  }

  /* opts: { marks: () => [model ids to ring], onPick: fn(id), legend: bool } */
  L.embMap = function (cv, opts) {
    opts = opts || {};
    const toks = [];
    for (let m = 2; m < V.size; m++) toks.push(m);
    let target = null, pos = null, dirty = true, focus = null, hover = null, view = null;
    ai.onChange(() => { dirty = true; });
    const sx = x => view.pad + (x + 1.08) / 2.16 * (view.w - 2 * view.pad), sy = y => 22 + (y + 1.08) / 2.16 * (view.h - 44);
    function nearest(ev) {
      if (!view || !pos) return null;
      const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
      let best = null, bd = 26;
      pos.forEach((p, i) => { const dd = Math.hypot(sx(p[0]) - mx, sy(p[1]) - my); if (dd < bd) { bd = dd; best = toks[i]; } });
      return best;
    }
    cv.addEventListener('mousemove', ev => { hover = nearest(ev); cv.style.cursor = hover ? 'pointer' : 'default'; L.kick(); });
    cv.addEventListener('mouseleave', () => { hover = null; });
    cv.addEventListener('click', ev => { const m = nearest(ev); if (m != null) { focus = m; if (opts.onPick) opts.onPick(m); L.kick(); } });
    function tick(dt) {
      if (dirty) { target = project(toks, target); dirty = false; if (!pos) pos = target.map(p => p.slice()); }
      const k = dt ? Math.min(1, dt * 0.008) : (L.reduce ? 1 : 0);
      pos.forEach((p, i) => { p[0] += (target[i][0] - p[0]) * k; p[1] += (target[i][1] - p[1]) * k; });
      const v = L.fit(cv), ctx = v.ctx, small = v.w < 520;
      view = { w: v.w, h: v.h, pad: small ? 30 : 52 };
      ctx.clearRect(0, 0, v.w, v.h);
      ctx.strokeStyle = 'rgba(57,207,255,0.06)'; ctx.lineWidth = 1;
      for (let x = 0; x < v.w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, v.h); ctx.stroke(); }
      for (let y = 0; y < v.h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(v.w, y); ctx.stroke(); }
      const marks = new Set(opts.marks ? opts.marks() : []), f = hover != null ? hover : focus;
      const idx = m => toks.indexOf(m);
      if (f != null && idx(f) >= 0) ai.neighbours(f, 3).forEach(nb => {
        const a = pos[idx(f)], b = pos[idx(nb.m)];
        ctx.strokeStyle = L.rgba(C.text, 0.2 + 0.5 * Math.max(0, nb.s)); ctx.lineWidth = 1 + 2.5 * Math.max(0, nb.s);
        ctx.beginPath(); ctx.moveTo(sx(a[0]), sy(a[1])); ctx.lineTo(sx(b[0]), sy(b[1])); ctx.stroke();
      });
      const near = f != null ? new Set(ai.neighbours(f, 3).map(x => x.m)) : new Set();
      // draw the important labels first; skip any label that would sit on top of one already drawn
      const order = toks.map((m, i) => ({ m, i, pri: (m === f ? 4 : 0) + (near.has(m) ? 3 : 0) + (marks.has(m) ? 2 : 0) + (ai.cls(m) === 'glue' ? 0 : 1) })).sort((a, b) => b.pri - a.pri);
      const boxes = [];
      ctx.textBaseline = 'middle';
      order.forEach(o => {
        const m = o.m, p = pos[o.i], x = sx(p[0]), y = sy(p[1]), col = CLS[ai.cls(m)], on = m === f || near.has(m) || marks.has(m);
        ctx.beginPath(); ctx.arc(x, y, on ? 6 : 3.6, 0, 6.2832);
        ctx.fillStyle = col; ctx.globalAlpha = ai.cls(m) === 'glue' && !on ? 0.55 : 1;
        if (on) { ctx.shadowColor = col; ctx.shadowBlur = 14; }
        ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        if (marks.has(m)) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 9.5, 0, 6.2832); ctx.stroke(); }
        ctx.font = (on ? '700 ' : '500 ') + (small ? 10.5 : 12) + 'px Inter,system-ui,sans-serif';
        const label = ai.word(m), tw = ctx.measureText(label).width, right = x + 10 + tw < v.w - 2;
        const bx = right ? x + 8 : x - 8 - tw, box = [bx - 2, y - 7, bx + tw + 2, y + 7];
        if (!on && boxes.some(b => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
        boxes.push(box);
        ctx.textAlign = 'left'; ctx.fillStyle = on ? '#fff' : L.rgba(C.text, 0.78);
        ctx.fillText(label, bx, y);
      });
      if (opts.legend !== false) {
        ctx.font = '700 10px ' + mono; ctx.textAlign = 'left';
        let lx = 10;
        Object.keys(CLS).forEach(k => {
          ctx.fillStyle = CLS[k]; ctx.beginPath(); ctx.arc(lx + 4, v.h - 11, 4, 0, 6.2832); ctx.fill();
          ctx.fillStyle = L.rgba(C.muted, 0.9); ctx.fillText(CLS_NAME[k], lx + 12, v.h - 10);
          lx += 22 + ctx.measureText(CLS_NAME[k]).width;
        });
      }
    }
    return { tick, focus(m) { focus = m; L.kick(); }, get focused() { return focus; }, toks };
  };

  /* ---- live training ---- */
  function greedy(text, max) {
    const mids = ai.tokenize(text).map(t => t.m), out = [];
    for (let i = 0; i < max; i++) {
      const m = ai.next(mids.concat(out))[0].m;
      out.push(m);
      if (m === V.END) break;
    }
    return out.map(m => (m === V.END ? '.' : ' ' + ai.word(m))).join('');
  }

  /* opts: { data: 'corpus' | 'finetune', epochs, lr, probes: [text], map: bool, fresh: bool (offer "start from random") } */
  L.trainer = {
    greedy,
    mount(root, opts) {
      opts = Object.assign({ data: 'corpus', epochs: 60, lr: 0.012, map: true, fresh: true, probes: ['the cat', 'the gardener was tired so', 'the rain'] }, opts || {});
      const data = ai.data[opts.data].slice(), B = 8, rnd = L.rng(1234);
      const total = opts.epochs * Math.ceil(data.length / B);
      root.classList.add('tr');
      root.innerHTML =
        '<div class="control-row tr-controls">' +
        (opts.fresh ? '<button class="lab-button" data-tr="reset" type="button">Wipe: start from random weights</button>' : '') +
        '<button class="lab-button primary" data-tr="run" type="button"></button>' +
        (ai.canRestore ? '<button class="lab-button" data-tr="restore" type="button">Restore the shipped weights</button>' : '') + '</div>' +
        '<div class="tr-grid"><div>' +
        '<canvas class="stage tr-loss" role="img" aria-label="Loss falling as training proceeds"></canvas>' +
        '<div class="metric-row">' +
        '<div class="metric"><span>Training steps</span><strong data-tr="step">0</strong></div>' +
        '<div class="metric"><span>Loss (surprise)</span><strong data-tr="loss">–</strong></div>' +
        '<div class="metric"><span>Odds on the right token</span><strong data-tr="odds">–</strong></div></div></div>' +
        '<div class="mini-panel tr-samples"><h3>What it writes right now</h3><p class="tight">Each line is the model’s single most likely continuation of the words in bold.</p><div data-tr="samples"></div></div></div>' +
        (opts.map ? '<canvas class="stage tr-map" role="img" aria-label="The model’s word map reorganising as it trains"></canvas>' : '') +
        '<div class="trace-note" data-tr="note" aria-live="polite"></div>';
      const $ = k => root.querySelector('[data-tr="' + k + '"]');
      const lossCv = root.querySelector('.tr-loss'), mapCv = root.querySelector('.tr-map');
      const map = mapCv ? L.embMap(mapCv, { legend: true }) : null;
      let running = false, done = 0, order = [], hist = [], ema = null, lastSample = -99, lastEmit = 0, epochLoss = null, credit = 0;
      const noise = id => (rnd() < 0.03 ? V.UNK : id);

      function samples() {
        $('samples').innerHTML = opts.probes.map(p => '<p class="tr-line"><b>' + L.esc(p) + '</b><span>' + L.esc(greedy(p, 9)) + '</span></p>').join('');
      }
      function readout(msg) {
        $('step').textContent = done + (running || done ? ' / ' + total : '');
        const l = ema == null ? ai.model.evalLoss(ai.data[opts.data]) : ema;
        $('loss').textContent = l.toFixed(2);
        $('odds').textContent = L.pct(Math.exp(-l), 0);
        $('run').textContent = running ? 'Pause' : done >= total ? 'Train again' : done ? 'Continue training' : opts.data === 'finetune' ? 'Fine-tune on the new sentences' : 'Train';
        if (msg) $('note').innerHTML = msg;
      }
      function describe() {
        const s = ai.state;
        return s === 'random' ? '<strong>Untrained.</strong> Every weight is a random number. The loss sits near ' + Math.log(V.size).toFixed(1) + ', which is what pure guessing among ' + V.size + ' tokens scores. Press Train.' :
          s === 'shipped' ? '<strong>These are the weights the page shipped with</strong> — ' + ai.shippedSteps.toLocaleString() + ' training steps, done ahead of time with this same code. ' + (opts.fresh ? 'Wipe them to watch it learn from nothing.' : 'Press the button to keep training on new text.') :
            '<strong>These are weights you trained in this tab.</strong> Every other chapter on the page is now using them.';
      }
      function batch() {
        if (!order.length) { order = data.slice(); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; } }
        const lr = opts.lr * (done > total * 0.75 ? 0.35 : 1);
        const l = ai.model.trainBatch(order.splice(0, B), lr, noise);
        ema = ema == null ? l : ema * 0.9 + l * 0.1;
        hist.push(ema); done++;
      }
      function drawLoss() {
        const v = L.fit(lossCv), ctx = v.ctx, top = Math.log(V.size) * 1.08;
        ctx.clearRect(0, 0, v.w, v.h);
        const X = i => 40 + (v.w - 52) * i / Math.max(1, total), Y = l => 12 + (v.h - 36) * (1 - Math.min(l, top) / top);
        ctx.font = '700 10px ' + mono; ctx.textBaseline = 'middle';
        [[Math.log(V.size), 'guessing'], [1, ''], [0, '']].forEach(r => {
          ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.setLineDash([3, 4]);
          ctx.beginPath(); ctx.moveTo(40, Y(r[0])); ctx.lineTo(v.w - 12, Y(r[0])); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = L.rgba(C.dim, 1); ctx.textAlign = 'right'; ctx.fillText(r[0].toFixed(1), 34, Y(r[0]));
          if (r[1]) { ctx.textAlign = 'left'; ctx.fillText(r[1], 46, Y(r[0]) - 9); }
        });
        ctx.textAlign = 'center'; ctx.fillStyle = L.rgba(C.dim, 1); ctx.fillText('training steps →', v.w / 2, v.h - 9);
        if (!hist.length) return;
        ctx.strokeStyle = C.rose; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.beginPath();
        hist.forEach((l, i) => { if (i) ctx.lineTo(X(i + 1), Y(l)); else ctx.moveTo(X(1), Y(l)); });
        ctx.stroke();
        const lx = X(hist.length), ly = Y(hist[hist.length - 1]);
        ctx.beginPath(); ctx.arc(lx, ly, 5, 0, 6.2832); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
      }

      function finish() {
        running = false;
        ai.changed('custom');           // listeners below are skipped while `finishing`
        epochLoss = ai.model.evalLoss(ai.data[opts.data]); ema = epochLoss;
        samples();
        readout('<strong>Done: ' + total + ' steps.</strong> Nothing was programmed in. The sentences it writes now come entirely from ' + ai.model.size.toLocaleString() + ' numbers that were nudged, a little at a time, to make the next token less surprising. ' +
          (opts.data === 'finetune' ? 'Compare the lines above with what they said before.' : 'Scroll up — every chapter is now running on the weights you just trained.'));
      }
      L.scene(root, dt => {
        if (running && L.reduce && !L.state.paused) {
          // reduced motion: no pacing for show and no mid-run redraws of the rest of the page, but the
          // work is still sliced across frames so the page keeps painting and the Pause button works
          const t0 = performance.now();
          do batch(); while (done < total && performance.now() - t0 < 12);
          if (done >= total) finish();
          else readout('<strong>Training…</strong> Step ' + done + ' of ' + total + '. The sample sentences and the rest of the page update when it finishes.');
        } else if (running && dt) {
          // paced to be watchable: one step per frame while the loss is plunging, two after that
          // (dt already carries the page's speed setting), and never more than fits in a frame
          const t0 = performance.now();
          let n = 0;
          credit = Math.min(6, credit + dt / 16.7 * (done < total * 0.18 ? 1 : 2));
          while (credit >= 1 && n < 6 && done < total && (n === 0 || performance.now() - t0 < 10)) { batch(); n++; credit--; }
          if (done - lastSample >= 14) { lastSample = done; samples(); }
          if (done - lastEmit >= 10) { lastEmit = done; ai.changed('training'); }
          if (done >= total) finish();
          else readout('<strong>Training…</strong> Each step shows the model ' + B + ' sentences, measures how surprised it was by every next token, and nudges all ' + ai.model.size.toLocaleString() + ' weights slightly downhill.');
        }
        drawLoss();
        if (map) map.tick(dt);
      });

      $('run').addEventListener('click', () => {
        if (done >= total) { done = 0; hist = []; ema = null; order = []; lastSample = -99; lastEmit = 0; }
        running = !running;
        readout(running ? '' : describe());
        L.kick();
      });
      const rs = $('reset');
      if (rs) rs.addEventListener('click', () => { running = false; done = 0; hist = []; ema = null; order = []; lastSample = -99; ai.reset(); samples(); readout(describe()); });
      const rb = $('restore');
      if (rb) rb.addEventListener('click', () => { running = false; done = 0; hist = []; ema = null; order = []; ai.restore(); samples(); readout(describe()); });
      ai.onChange(st => { if (!running && st !== 'training') { ema = null; samples(); readout(describe()); } });
      samples(); readout(describe());
      return { root };
    }
  };
})();

/* Chapter 1 — the whole generation loop on one canvas, driven by the page's
   real transformer: real token ids, real embedding numbers, real attention
   weights in each layer, real next-token odds. */
(function () {
  'use strict';
  const L = Lab, cv = L.$('#journeyCanvas');
  if (!cv) return;
  const C = L.C, ai = L.ai;
  // one lap is about 17 s: long enough to read each caption at an easy pace
  const PH = [1900, 2200, 2300, 4400, 2200, 2500, 1600];
  const LAYERS = ai.model.cfg.L, CELLS = 6;
  const start = () => L.prompt.mids.slice();
  const rand = L.rng(20261110);
  const note = L.$('#journeyNote'), stepEls = L.$$('#journeySteps li');
  const playBtn = L.$('#journeyPlay');

  let words = start(), phase = 0, pt = 0, made = 0, tr = null;
  let mode = L.reduce ? 'hold' : 'play';
  let cand = [], pick = 0;

  function prep() {
    const top = ai.next(words).slice(0, 5);
    const s = top.reduce((a, c) => a + c.p, 0);
    cand = top.map(c => ({ m: c.m, w: c.m === ai.V.END ? '.' : c.w, q: c.p / s }));
    tr = ai.trace(words);
    pick = L.pickIndex(cand.map(c => c.q), rand());
  }

  function caption() {
    const said = '“' + words.map(ai.word).join(' ') + '”';
    const top = cand[0], got = cand[pick];
    const lines = [
      '<strong>1 · Text in.</strong> The model is handed one string: ' + L.esc(said) + '. That string is its entire view of the world.',
      '<strong>2 · Tokens.</strong> The string is cut into ' + words.length + ' tokens and each one is swapped for its ID number. From here on there are no letters, only numbers.',
      '<strong>3 · Vectors.</strong> Each ID looks up its embedding: a column of numbers. These are the first six of the ' + ai.model.cfg.d + ' this model really stores for each token; large models store thousands.',
      '<strong>4 · Layers.</strong> This model has ' + LAYERS + ' layers. Gold arcs are its real attention weights — thicker means the last position copied more from that token. Green pulses are the small neural network that then processes each position. Only the last column makes the prediction.',
      '<strong>5 · Scores.</strong> The last position’s final vector is compared with every token in the vocabulary. The top five are shown; “' + L.esc(top.w) + '” leads at ' + L.pct(top.q) + '.',
      '<strong>6 · Pick one.</strong> A weighted dice roll lands on “' + L.esc(got.w) + '” (' + L.pct(got.q) + '). ' + (pick === 0 ? 'This time it was the favourite.' : 'Not the favourite this time — that is sampling at work.'),
      '<strong>7 · Append, repeat.</strong> “' + L.esc(got.w) + '” joins the text and the entire stack runs again from the top for the next token.'
    ];
    note.innerHTML = lines[phase];
    stepEls.forEach((el, i) => {
      el.classList.toggle('active', i === phase);
      el.classList.toggle('done', i < phase);
    });
    playBtn.textContent = mode === 'play' ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', String(mode === 'play'));
    note.setAttribute('aria-live', mode === 'play' ? 'off' : 'polite');   // do not narrate an autoplaying loop
  }

  function advance() {
    if (phase === 6) {
      const m = cand[pick].m;
      words.push(m); made++;
      if (m === ai.V.END || made >= 7) { words = start(); made = 0; phase = 0; }
      else phase = 1;
      prep();
    } else phase++;
    pt = 0;
    caption();
  }

  function draw() {
    const v = L.fit(cv), ctx = v.ctx, W = v.w;
    ctx.clearRect(0, 0, W, v.h);
    const small = W < 560, big = W >= 760;
    const maxTok = small ? 5 : 8;
    const shownM = words.slice(-maxTok), shown = shownM.map(m => (m === ai.V.UNK ? '?' : ai.word(m))), n = shown.length, off = words.length - n;
    const colW = Math.min(small ? 62 : big ? 122 : 100, (W - 28) / n);
    const x0 = (W - colW * n) / 2, cx = i => x0 + colW * (i + 0.5);
    const p = L.clamp(pt / PH[phase]);
    const F = small ? 12 : big ? 15.5 : 14;
    const yText = 30, yTok = 76, yVec = 112, cell = 8, vecH = CELLS * (cell + 2);
    const yStack = yVec + vecH + 20, gap = 9, bandH = Math.round((147 + gap) / LAYERS) - gap, stackH = LAYERS * (bandH + gap) - gap;
    const yRest = yStack + stackH + 10, yBars = yRest + 16;
    const mono = '"SFMono-Regular",ui-monospace,Menlo,Consolas,monospace';

    // row labels in the left gutter
    if (x0 > 96) {
      ctx.font = '800 ' + (big ? 11 : 10) + 'px ' + mono; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      [['TEXT', yText, 0], ['TOKENS', yTok, 1], ['VECTORS', yVec + vecH / 2, 2], ['LAYERS', yStack + stackH / 2, 3], ['ODDS', yBars + 40, 4]]
        .forEach(r => { ctx.fillStyle = phase >= r[2] ? L.rgba(C.gold, 0.9) : L.rgba(C.dim, 0.6); ctx.fillText(r[0], 14, r[1]); });
    }

    // text line
    const sentence = (off > 0 ? '… ' : '') + shown.join(' ');
    ctx.font = '600 ' + (F + 4) + 'px Georgia,serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = C.text;
    ctx.fillText(sentence, W / 2, yText);
    const endX = W / 2 + ctx.measureText(sentence).width / 2 + 8;
    if (phase === 0) {
      ctx.fillStyle = L.rgba(C.cyan, 0.5 + 0.5 * Math.sin(pt / 140));
      ctx.fillRect(endX - 4, yText - 10, 2, 20);
    }

    // tokens
    if (phase >= 1) for (let i = 0; i < n; i++) {
      const a = phase > 1 ? 1 : L.clamp(p * (n + 2) - i), e = L.ease.out(a);
      if (a <= 0) continue;
      const y = L.lerp(yText + 8, yTok, e), cw = Math.min(colW - 8, big ? 98 : 78);
      ctx.globalAlpha = a;
      L.rr(ctx, cx(i) - cw / 2, y - 12, cw, 24, 7);
      ctx.fillStyle = L.rgba(C.cyan, 0.13); ctx.fill();
      ctx.strokeStyle = L.rgba(C.cyan, 0.6); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#dcf8ff'; ctx.font = '600 ' + (F - 1) + 'px ' + mono;
      ctx.fillText(shown[i], cx(i), y + 0.5);
      const ida = phase > 1 ? 1 : L.clamp(p * 3 - 1.8);
      ctx.globalAlpha = a * ida;
      ctx.fillStyle = C.dim; ctx.font = (big ? 11.5 : 10) + 'px ' + mono;
      ctx.fillText('#' + ai.tokId(shownM[i]), cx(i), yTok + 22);
      ctx.globalAlpha = 1;
    }

    // vectors
    if (phase >= 2) for (let i = 0; i < n; i++) {
      const vec = ai.emb(shownM[i]).slice(0, CELLS).map(x => x * 2.4), cw = Math.min(colW - 18, big ? 54 : 42);
      for (let j = 0; j < CELLS; j++) {
        const a = phase > 2 ? 1 : L.clamp(p * (n + 3) - i - j * 0.25);
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = L.heat(vec[j]);
        L.rr(ctx, cx(i) - cw / 2, yVec + j * (cell + 2), cw, cell, 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // layer stack
    const yDot = phase < 3 ? yStack - 8 : phase > 3 ? yRest : L.lerp(yStack - 8, yRest, p);
    for (let k = 0; k < LAYERS; k++) {
      const top = yStack + k * (bandH + gap);
      const inside = phase === 3 && yDot >= top - 4 && yDot <= top + bandH + 4;
      const f = L.clamp((yDot - top) / bandH);
      L.rr(ctx, x0 - 6, top, colW * n + 12, bandH, 8);
      ctx.fillStyle = inside ? L.rgba(f < 0.5 ? C.gold : C.green, 0.13) : 'rgba(255,255,255,0.03)';
      ctx.fill();
      ctx.strokeStyle = inside ? L.rgba(f < 0.5 ? C.gold : C.green, 0.6) : 'rgba(110,159,205,0.22)';
      ctx.lineWidth = 1; ctx.stroke();
      if (!small) {
        ctx.font = '700 ' + (big ? 10.5 : 9) + 'px ' + mono; ctx.textBaseline = 'middle';
        ctx.textAlign = 'left'; ctx.fillStyle = inside && f < 0.5 ? C.gold : L.rgba(C.dim, 0.75);
        ctx.fillText('L' + (k + 1) + ' attention', x0 + 2, top + 9);
        ctx.textAlign = 'right'; ctx.fillStyle = inside && f >= 0.5 ? C.green : L.rgba(C.dim, 0.75);
        ctx.fillText('MLP', x0 + colW * n - 2, top + bandH - 9);
        ctx.textAlign = 'center';
      }
      if (inside && f < 0.5) {
        // attention: every earlier column feeds the last one, plus a few neighbours
        const a = Math.sin(f * 2 * Math.PI);
        ctx.strokeStyle = L.rgba(C.gold, 0.25 + 0.6 * a);
        for (let i = 0; i < n - 1; i++) {
          // real weight: how much the last position read from token i in this layer (heads averaged)
          const nn = tr.n, col = nn - n + i;
          const wgt = col < 0 ? 0 : tr.att[k].reduce((s2, hd) => s2 + hd[(nn - 1) * nn + col], 0) / tr.att[k].length;
          ctx.lineWidth = 0.5 + 7 * wgt;
          ctx.beginPath();
          ctx.moveTo(cx(i), yDot);
          ctx.quadraticCurveTo((cx(i) + cx(n - 1)) / 2, yDot - 18 - (n - 1 - i) * 3, cx(n - 1), yDot);
          ctx.stroke();
        }
      }
      if (inside && f >= 0.5) {
        const a = (f - 0.5) * 2;
        ctx.strokeStyle = L.rgba(C.green, 1 - a); ctx.lineWidth = 2;
        for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(cx(i), yDot, 5 + a * 12, 0, 6.2832); ctx.stroke(); }
      }
    }
    if (phase >= 3) for (let i = 0; i < n; i++) {
      const lastCol = i === n - 1;
      if (phase > 3 && !lastCol) continue;
      ctx.beginPath(); ctx.arc(cx(i), yDot, lastCol ? 6 : 4, 0, 6.2832);
      ctx.fillStyle = lastCol ? C.gold : C.violet;
      ctx.shadowColor = lastCol ? C.gold : C.violet; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
      if (phase === 3) {
        const g = ctx.createLinearGradient(0, yDot - 40, 0, yDot);
        g.addColorStop(0, 'rgba(157,134,255,0)'); g.addColorStop(1, L.rgba(lastCol ? C.gold : C.violet, 0.5));
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx(i), Math.max(yStack - 8, yDot - 40)); ctx.lineTo(cx(i), yDot); ctx.stroke();
      }
    }

    // odds
    const bw = Math.min(W - 32, big ? 520 : 430), bx = (W - bw) / 2, lab = small ? 78 : 96, track = bw - lab - 52;
    let flyFrom = null;
    if (phase >= 4) {
      const grow = phase > 4 ? 1 : L.ease.out(p);
      ctx.strokeStyle = L.rgba(C.gold, 0.35 * grow); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx(n - 1), yRest + 6); ctx.lineTo(cx(n - 1), yBars - 4); ctx.stroke();
      const settled = phase > 5 || (phase === 5 && p > 0.72);
      const hl = phase < 5 ? -1 : settled ? pick : Math.floor(Math.pow(p / 0.72, 0.7) * 17) % cand.length;
      cand.forEach((c, i) => {
        const y = yBars + 6 + i * 17, on = i === hl;
        ctx.font = (on ? '700 ' : '500 ') + (F - 1) + 'px ' + mono;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillStyle = on ? C.gold : '#d8eaf2';
        ctx.fillText(c.w === '.' ? '. (stop)' : c.w, bx + lab - 8, y);
        L.rr(ctx, bx + lab, y - 5, track, 10, 5); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill();
        L.rr(ctx, bx + lab, y - 5, Math.max(3, track * c.q * grow), 10, 5);
        ctx.fillStyle = on ? C.gold : C.rose; ctx.fill();
        ctx.textAlign = 'left'; ctx.fillStyle = on ? C.gold : C.muted;
        ctx.fillText(L.pct(c.q * grow), bx + lab + track + 8, y);
        if (i === pick) flyFrom = [bx + lab - 8 - ctx.measureText(c.w).width / 2, y];
      });
      ctx.textAlign = 'center';
    }

    // the chosen token flies back to the end of the text
    if (phase === 6 && flyFrom) {
      const e = L.ease.io(p);
      const mx = Math.min(W - 24, Math.max(endX, x0 + colW * n) + 60), my = (flyFrom[1] + yText) / 2;
      const q = (a, b, c) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * b + e * e * c;
      const tx = endX + 18, fx = q(flyFrom[0], mx, tx), fy = q(flyFrom[1], my, yText);
      ctx.setLineDash([4, 5]); ctx.strokeStyle = L.rgba(C.gold, 0.4); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(flyFrom[0], flyFrom[1]); ctx.quadraticCurveTo(mx, my, tx, yText); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '700 ' + (F + 2) + 'px Georgia,serif'; ctx.fillStyle = C.gold;
      ctx.shadowColor = C.gold; ctx.shadowBlur = 14;
      ctx.fillText(cand[pick].w, fx, fy); ctx.shadowBlur = 0;
    }
  }

  L.scene(cv, dt => {
    if (mode !== 'hold') {
      pt += dt;
      if (pt >= PH[phase]) {
        if (mode === 'step') { pt = PH[phase]; mode = 'hold'; caption(); }
        else advance();
      }
    }
    draw();
  });

  playBtn.addEventListener('click', () => {
    if (mode === 'play') mode = 'hold';
    else { if (pt >= PH[phase]) advance(); mode = 'play'; }
    caption();
  });
  L.$('#journeyStep').addEventListener('click', () => {
    if (pt >= PH[phase] || mode === 'hold') advance();
    mode = L.reduce ? 'hold' : 'step';
    if (L.reduce) pt = PH[phase];
    caption();
  });
  L.$('#journeyReset').addEventListener('click', () => {
    words = start(); made = 0; phase = 0; pt = 0; prep();
    mode = L.reduce ? 'hold' : 'play'; caption();
  });
  // a new prompt, or new weights, restarts the lap
  const restart = () => { words = start(); made = 0; phase = L.reduce ? 4 : 0; pt = L.reduce ? PH[4] : 0; prep(); caption(); };
  L.onPrompt(restart);
  ai.onChange(st => { if (st !== 'training') restart(); });
  stepEls.forEach((el, i) => el.addEventListener('click', () => {
    phase = i; pt = L.reduce ? PH[i] : 0; mode = L.reduce ? 'hold' : 'step'; caption();
  }));

  prep();
  if (L.reduce) { phase = 4; pt = PH[4]; }
  caption();
})();

/* Chapter 3 — embeddings.
   1. The real thing: this page's model, its embedding table flattened to a map.
   2. A hand-built example space, used only to show vector arithmetic cleanly.
   3. Position: the model's real token row + real position row = layer-1 input. */
(function () {
  'use strict';
  const L = Lab, C = L.C, ai = L.ai, V = ai.V;
  const strip = (el, vec, k) => { el.innerHTML = vec.map(x => '<i style="background:' + L.heat(x * (k || 2.2)) + '" title="' + x.toFixed(3) + '"></i>').join(''); };

  /* ---------- 1. the model's own map ---------- */
  const realCv = L.$('#embReal');
  if (realCv) {
    const pick = L.$('#embPick');
    const all = [];
    for (let m = 2; m < V.size; m++) all.push(m);
    pick.innerHTML = all.slice().sort((a, b) => ai.word(a).localeCompare(ai.word(b))).map(m => '<option value="' + m + '">' + L.esc(ai.word(m)) + '</option>').join('');
    let focus = null;
    function show(m) {
      focus = m;
      pick.value = m;
      const nb = ai.neighbours(m, 3), e = ai.emb(m);
      let far = null;
      all.forEach(j => { if (j !== m) { const s = ai.cos(e, ai.emb(j)); if (!far || s < far.s) far = { m: j, s }; } });
      L.$('#embNameA').textContent = ai.word(m);
      L.$('#embNameB').textContent = ai.word(nb[0].m);
      L.$('#embNameC').textContent = ai.word(far.m);
      strip(L.$('#embStripA'), e);
      strip(L.$('#embStripB'), ai.emb(nb[0].m));
      strip(L.$('#embStripC'), ai.emb(far.m));
      L.$('#embSim').innerHTML = 'Closest to <strong>' + L.esc(ai.word(m)) + '</strong>: ' +
        nb.map(x => L.esc(ai.word(x.m)) + ' <span class="sim">' + x.s.toFixed(2) + '</span>').join(', ') +
        '. Furthest: ' + L.esc(ai.word(far.m)) + ' <span class="sim">' + far.s.toFixed(2) + '</span>. ' +
        (ai.state === 'random' ? 'The weights are random right now, so these neighbours are meaningless.' : 'Nobody told the model these words were related. It put them together because they turn up in the same places in sentences.');
    }
    const map = L.embMap(realCv, { marks: () => L.prompt.mids, onPick: show });
    L.scene(realCv, dt => map.tick(dt));
    pick.addEventListener('change', () => { const m = Number(pick.value); map.focus(m); show(m); });
    // start on the most meaningful word in the prompt (skip glue words and unknowns)
    const lead = () => {
      const ms = L.prompt.mids.filter(m => m > 1), best = ms.filter(m => ai.cls(m) !== 'glue');
      return best.length ? best[0] : ms.length ? ms[0] : V.syms.indexOf(L.bpe.SP + 'cat');
    };
    const refocus = () => { const m = lead(); map.focus(m); show(m); };
    L.onPrompt(refocus);
    ai.onChange(st => { if (st !== 'training' && focus != null) show(focus); });
    refocus();
  }

  /* ---------- 2. vector arithmetic in a hand-built space ----------
     Every word is a sum of feature directions and the drawing is a linear
     projection, so "king - man + woman" lands exactly where it should. */
  const cv = L.$('#embCanvas');
  if (cv) {
    const AX = {
      human: [-3.0, -1.0], royal: [0.25, -1.7], gender: [0.85, 0.2], young: [0.5, 0.85],
      animal: [-2.7, 2.2], pet: [0.9, 0.35], wild: [-1.3, 0.9], feline: [-0.5, -0.35], canine: [0.9, 0.1],
      food: [2.9, 2.3], fruit: [0.8, 0.7], f1: [-0.45, 0.25], f2: [0.5, 0.35], baked: [-0.9, 0.5], dairy: [0.2, -0.8],
      place: [3.0, -1.9], capital: [0.1, -1.2], fr: [-1.3, 0.3], it: [0, 0.55], jp: [1.3, 0.3],
      verb: [0.4, 0.3], past: [0.3, -1.0], vw: [-1.2, 0.1], vr: [0, 0.6], vs: [1.2, 0.1]
    };
    const DIMS = Object.keys(AX), W = (cat, f) => ({ cat, f });
    const WORDS = {
      king: W('people', { human: 1, royal: 1, gender: -1 }), queen: W('people', { human: 1, royal: 1, gender: 1 }),
      prince: W('people', { human: 1, royal: 1, gender: -1, young: 1 }), princess: W('people', { human: 1, royal: 1, gender: 1, young: 1 }),
      man: W('people', { human: 1, gender: -1 }), woman: W('people', { human: 1, gender: 1 }),
      boy: W('people', { human: 1, gender: -1, young: 1 }), girl: W('people', { human: 1, gender: 1, young: 1 }),
      cat: W('animals', { animal: 1, pet: 1, feline: 1 }), kitten: W('animals', { animal: 1, pet: 1, feline: 1, young: 1 }),
      dog: W('animals', { animal: 1, pet: 1, canine: 1 }), puppy: W('animals', { animal: 1, pet: 1, canine: 1, young: 1 }),
      lion: W('animals', { animal: 1, wild: 1, feline: 1 }), wolf: W('animals', { animal: 1, wild: 1, canine: 1 }),
      apple: W('food', { food: 1, fruit: 1, f1: 1 }), banana: W('food', { food: 1, fruit: 1, f2: 1 }),
      bread: W('food', { food: 1, baked: 1 }), cheese: W('food', { food: 1, dairy: 1 }),
      France: W('places', { place: 1, fr: 1 }), Paris: W('places', { place: 1, fr: 1, capital: 1 }),
      Italy: W('places', { place: 1, it: 1 }), Rome: W('places', { place: 1, it: 1, capital: 1 }),
      Japan: W('places', { place: 1, jp: 1 }), Tokyo: W('places', { place: 1, jp: 1, capital: 1 }),
      walk: W('actions', { verb: 1, vw: 1 }), walked: W('actions', { verb: 1, vw: 1, past: 1 }),
      run: W('actions', { verb: 1, vr: 1 }), ran: W('actions', { verb: 1, vr: 1, past: 1 }),
      swim: W('actions', { verb: 1, vs: 1 }), swam: W('actions', { verb: 1, vs: 1, past: 1 })
    };
    const CAT = { people: C.gold, animals: C.green, food: C.orange, places: C.cyan, actions: C.violet };
    const names = Object.keys(WORDS), ph = L.rng(77);
    names.forEach(n => {
      const w = WORDS[n];
      w.vec = DIMS.map(d => w.f[d] || 0);
      w.x = DIMS.reduce((s, d, i) => s + w.vec[i] * AX[d][0], 0);
      w.y = DIMS.reduce((s, d, i) => s + w.vec[i] * AX[d][1], 0);
      w.ph = ph() * 6.28;
    });
    let ana = null, hover = null, view = null;
    const B = { x0: -4.9, x1: 4.9, y0: -3.3, y1: 4.1 };
    const sx = x => view.padX + (x - B.x0) / (B.x1 - B.x0) * (view.w - 2 * view.padX);
    const sy = y => view.padY + (y - B.y0) / (B.y1 - B.y0) * (view.h - 2 * view.padY);
    function arrow(ctx, x1, y1, x2, y2, col, wdt, dash) {
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = wdt;
      ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
      ctx.closePath(); ctx.fill();
    }
    L.scene(cv, (dt, t) => {
      const v = L.fit(cv), ctx = v.ctx, small = v.w < 520;
      view = { w: v.w, h: v.h, padX: small ? 34 : 56, padY: 24 };
      ctx.clearRect(0, 0, v.w, v.h);
      ctx.strokeStyle = 'rgba(57,207,255,0.06)'; ctx.lineWidth = 1;
      for (let x = 0; x < v.w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, v.h); ctx.stroke(); }
      for (let y = 0; y < v.h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(v.w, y); ctx.stroke(); }
      const hot = {};
      if (ana) {
        if (dt) ana.t = Math.min(1, ana.t + dt / 4200);
        const a = WORDS[ana.a], b = WORDS[ana.b], c = WORDS[ana.c], p = ana.t;
        hot[ana.a] = hot[ana.b] = hot[ana.c] = 1;
        const p1 = L.ease.io(L.clamp(p / 0.3)), p2 = L.ease.io(L.clamp((p - 0.32) / 0.3)), p3 = L.clamp((p - 0.66) / 0.2);
        const dx = a.x - b.x, dy = a.y - b.y;
        arrow(ctx, sx(b.x), sy(b.y), sx(b.x + dx * p1), sy(b.y + dy * p1), C.gold, 2.5);
        if (p > 0.32) {
          const ox = L.lerp(b.x, c.x, p2), oy = L.lerp(b.y, c.y, p2);
          arrow(ctx, sx(ox), sy(oy), sx(ox + dx), sy(oy + dy), L.rgba(C.gold, 0.9), 2.5, [6, 5]);
        }
        if (p > 0.66) {
          const tx = sx(ana.target.x), ty = sy(ana.target.y), o = WORDS[ana.best];
          const lx = L.lerp(tx, sx(o.x), L.ease.io(p3)), ly = L.lerp(ty, sy(o.y), L.ease.io(p3));
          ctx.strokeStyle = C.rose; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(lx, ly, 13 + 4 * Math.sin(t / 160), 0, 6.2832); ctx.stroke();
          if (p3 >= 1) hot[ana.best] = 2;
        }
      }
      names.forEach(n => {
        const w = WORDS[n];
        const x = sx(w.x) + (L.reduce ? 0 : Math.sin(t / 1100 + w.ph) * 1.4), y = sy(w.y) + (L.reduce ? 0 : Math.cos(t / 1300 + w.ph) * 1.4);
        const on = n === hover || hot[n];
        ctx.beginPath(); ctx.arc(x, y, on ? 6.5 : 4.2, 0, 6.2832);
        ctx.fillStyle = hot[n] === 2 ? C.rose : CAT[w.cat];
        if (on) { ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 16; }
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.font = (on ? '700 ' : '500 ') + (small ? 10.5 : 12.5) + 'px Inter,system-ui,sans-serif';
        const right = n === 'France' ? false : x + 12 + ctx.measureText(n).width < v.w;
        ctx.textAlign = right ? 'left' : 'right'; ctx.textBaseline = 'middle';
        ctx.fillStyle = on ? '#fff' : L.rgba(C.text, 0.82);
        ctx.fillText(n, x + (right ? 9 : -9), y);
      });
    });
    cv.addEventListener('mousemove', ev => {
      if (!view) return;
      const r = cv.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top;
      hover = null;
      let bd = 26;
      names.forEach(n => { const d = Math.hypot(sx(WORDS[n].x) - mx, sy(WORDS[n].y) - my); if (d < bd) { bd = d; hover = n; } });
    });
    cv.addEventListener('mouseleave', () => { hover = null; });

    const selA = L.$('#embA'), selB = L.$('#embB'), selC = L.$('#embC'), out = L.$('#embReadout');
    [selA, selB, selC].forEach(s => { s.innerHTML = names.map(n => '<option>' + n + '</option>').join(''); });
    function runAnalogy(a, b, c) {
      selA.value = a; selB.value = b; selC.value = c;
      const tv = DIMS.map((d, i) => WORDS[a].vec[i] - WORDS[b].vec[i] + WORDS[c].vec[i]);
      let best = null, bd = Infinity;
      names.forEach(n => {
        if (n === a || n === b || n === c) return;
        const d = Math.sqrt(WORDS[n].vec.reduce((s, x, i) => s + (x - tv[i]) * (x - tv[i]), 0));
        if (d < bd) { bd = d; best = n; }
      });
      ana = { a, b, c, best, t: L.reduce ? 1 : 0, target: { x: WORDS[a].x - WORDS[b].x + WORDS[c].x, y: WORDS[a].y - WORDS[b].y + WORDS[c].y } };
      out.innerHTML = '<strong>' + a + ' − ' + b + ' + ' + c + ' ≈ <span class="hit">' + best + '</span></strong><br>' +
        'Take the step that leads from <em>' + b + '</em> to <em>' + a + '</em> (solid arrow), replay it starting at <em>' + c + '</em> (dashed arrow), and see which word is nearest to where you land. ' +
        (bd < 0.01 ? 'It lands exactly on <em>' + best + '</em>.' :
          bd < 1.3 ? 'It lands close to <em>' + best + '</em> — near, not exact, which is what real embeddings usually give you.' :
            'Nothing sits near that spot; <em>' + best + '</em> is merely the least far. Arithmetic on unrelated words gives nonsense, here and in real models.');
      L.kick();
    }
    L.$$('[data-analogy]').forEach(b => b.addEventListener('click', () => {
      L.$$('[data-analogy]').forEach(x => x.classList.toggle('active', x === b));
      const p = b.dataset.analogy.split(','); runAnalogy(p[0], p[1], p[2]);
    }));
    [selA, selB, selC].forEach(s => s.addEventListener('change', () => {
      L.$$('[data-analogy]').forEach(x => x.classList.remove('active'));
      runAnalogy(selA.value, selB.value, selC.value);
    }));
    selA.value = 'king'; selB.value = 'man'; selC.value = 'woman';
  }

  /* ---------- 3. position: real token rows + real position rows ---------- */
  const posRow = L.$('#posRow');
  if (posRow) {
    let swapped = false;
    const cells = (vec, k) => vec.map(x => '<i style="background:' + L.heat(x * (k || 2.2)) + '"></i>').join('');
    const renderPos = () => {
      const ms = L.prompt.mids.slice(0, 3);
      if (swapped && ms.length > 1) { const t = ms[0]; ms[0] = ms[ms.length - 1]; ms[ms.length - 1] = t; }
      posRow.innerHTML = ms.map((m, i) => {
        const tv = ai.emb(m), pv = ai.pos(i + 1), sum = tv.map((x, j) => x + pv[j]);
        return '<div class="pos-col"><b>' + L.esc(ai.word(m)) + '</b>' +
          '<div class="vstrip">' + cells(tv) + '</div><span class="pos-op">+ position ' + (i + 1) + '</span>' +
          '<div class="vstrip pos">' + cells(pv) + '</div><span class="pos-op">= what layer 1 receives</span>' +
          '<div class="vstrip sum">' + cells(sum) + '</div></div>';
      }).join('');
      const txt = ms.map(m => ai.word(m)).join(' ');
      L.$('#posNote').innerHTML = '“<strong>' + L.esc(txt) + '</strong>” — these are the model’s real rows. Swap the words and each word keeps exactly the same top row; ' +
        'only the position row underneath it changes. That added pattern is the sole reason the model can tell “dog bites man” from “man bites dog”.';
    };
    L.$('#posSwap').addEventListener('click', () => { swapped = !swapped; renderPos(); });
    L.onPrompt(() => { swapped = false; renderPos(); });
    ai.onChange(st => { if (st !== 'training') renderPos(); });
    renderPos();
  }
})();

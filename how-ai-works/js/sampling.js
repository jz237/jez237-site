/* Chapter 6 — scores -> probabilities -> a weighted dice roll. The odds are the
   real output of the page's transformer for the shared prompt; temperature,
   top-k and top-p are applied exactly as a production sampler applies them. */
(function () {
  'use strict';
  const L = Lab, bars = L.$('#sampBars');
  if (!bars) return;
  const ai = L.ai, V = ai.V, run = L.seq();
  const temp = L.$('#sampTemp'), topk = L.$('#sampTopK'), topp = L.$('#sampTopP');
  const strip = L.$('#sampStrip'), needle = L.$('#sampNeedle'), textEl = L.$('#sampText'), note = L.$('#sampNote');
  let words = L.prompt.mids.slice(), rows = [], tally = null, rolls = 0, lastPick = -1, fresh = 0;

  function compute() {
    const top = ai.next(words).slice(0, 10);
    const logits = top.map(c => Math.log(Math.max(1e-9, c.p)));
    const T = Number(temp.value), K = Number(topk.value), P = Number(topp.value);
    const p = L.softmax(logits, T), base = logits[0];
    let cum = 0;
    rows = top.map((c, i) => {
      const cutK = i >= K, cutP = !cutK && cum >= P && i > 0;
      if (!cutK && !cutP) cum += p[i];
      return { m: c.m, w: c.m === V.END ? '.' : c.w, score: logits[i] - base + 8, raw: p[i], keep: !cutK && !cutP, why: cutK ? 'cut by top-k' : cutP ? 'cut by top-p' : '' };
    });
    const kept = rows.filter(r => r.keep).reduce((s, r) => s + r.raw, 0);
    rows.forEach(r => { r.p = r.keep ? r.raw / kept : 0; });
  }

  function render() {
    const mx = Math.max.apply(null, rows.map(r => r.p)), sc = 100 / Math.max(mx, 0.4); // bars are drawn relative to the leader
    bars.innerHTML = rows.map((r, i) =>
      '<div class="samp-row' + (r.keep ? '' : ' cut') + (i === lastPick ? ' picked' : '') + '">' +
      '<span class="w">' + (r.m === V.END ? '<i>end (.)</i>' : L.esc(r.w)) + '</span>' +
      '<span class="s" title="raw score (logit), shifted so the leader reads 8">' + r.score.toFixed(2) + '</span>' +
      '<div class="bar"><i style="width:' + (r.p * sc).toFixed(1) + '%"></i>' +
      (tally && rolls ? '<b style="left:' + Math.min(100, tally[i] / rolls * sc).toFixed(1) + '%" title="share of your ' + rolls + ' rolls"></b>' : '') + '</div>' +
      '<em>' + (r.keep ? L.pct(r.p) : r.why) + '</em>' +
      (tally && rolls ? '<span class="n">×' + tally[i] + '</span>' : '<span class="n"></span>') + '</div>').join('');
    let acc = 0;
    const segs = rows.filter(r => r.keep).map((r, i) => {
      const s = '<span class="seg c' + (i % 6) + (rows.indexOf(r) === lastPick ? ' picked' : '') + '" style="left:' + (acc * 100).toFixed(2) + '%;width:' + (r.p * 100).toFixed(2) + '%">' + (r.p > 0.07 ? L.esc(r.w) : '') + '</span>';
      acc += r.p; return s;
    }).join('');
    Array.from(strip.querySelectorAll('.seg')).forEach(e => e.remove());
    strip.insertAdjacentHTML('afterbegin', segs);
    const base = L.prompt.mids.length;
    textEl.innerHTML = words.map((m, i) =>
      '<span class="' + (i >= base ? 'gen ' : '') + (fresh && i === words.length - 1 ? 'new' : '') + '">' + L.esc(m === V.END ? '.' : m === V.UNK ? '?' : ai.word(m)) + '</span>').join(' ') + ' <span class="caret">▁</span>';
    L.$$('[data-for]', bars.closest('section')).forEach(o => { const s = L.$('#' + o.dataset.for); if (s) o.textContent = Number(s.value).toFixed(s.step < 1 ? 2 : 0); });
    const T = Number(temp.value), H = -rows.reduce((s, r) => s + (r.p > 0 ? r.p * Math.log(r.p) : 0), 0);
    note.innerHTML = '<strong>Effective choices: ' + Math.exp(H).toFixed(1) + '.</strong> ' +
      (rows.filter(r => r.keep).length === 1 ? 'Only one token survives the cut-offs, so the “dice” have one face. This is greedy decoding: always the favourite, the same answer every time.' :
        T <= 0.45 ? 'Low temperature stretches the gaps between scores, so the favourite takes nearly everything. Output becomes consistent and repetitive.' :
          T >= 1.45 ? 'High temperature shrinks the gaps between scores, so long shots get a real chance. Output becomes surprising, then incoherent.' :
            mx > 0.9 ? 'The model is almost certain here. Even a dice roll will nearly always land on the same token — try raising the temperature.' :
              mx > 0.6 ? 'The model is fairly sure here — one token holds most of the probability.' :
                'Several tokens are live options here. Which one you get depends on the roll.');
  }

  function refresh(resetTally) {
    compute();
    if (resetTally) { tally = null; rolls = 0; lastPick = -1; }
    render();
  }
  const drawFrom = u => { const kept = rows.filter(r => r.keep); return rows.indexOf(kept[L.pickIndex(kept.map(r => r.p), u)]); };

  async function roll(k) {
    const u = Math.random(), idx = drawFrom(u);
    needle.classList.add('on');
    for (let i = 0; i < 6; i++) {
      needle.style.left = (Math.random() * 100) + '%';
      if (!(await run.wait(95, k))) return -1;
    }
    needle.style.left = (u * 100) + '%';
    if (!(await run.wait(420, k))) return -1;
    lastPick = idx;
    return idx;
  }

  const genBtn = L.$('#sampGen'), GEN = 'Generate a whole sentence';
  const rewind = () => { words = L.prompt.mids.slice(); fresh = 0; };
  L.$('#sampOnce').addEventListener('click', async () => {
    const k = run.begin();
    const i = await roll(k);
    if (i < 0) return;
    if (!tally) tally = rows.map(() => 0);
    tally[i]++; rolls++;
    render();
  });
  L.$('#samp100').addEventListener('click', async () => {
    const k = run.begin();
    if (!tally) tally = rows.map(() => 0);
    lastPick = -1;
    for (let n = 0; n < 100; n++) {
      if (!tally || !run.ok(k)) return;       // something else reset the panel mid-run
      const u = Math.random(), idx = drawFrom(u);
      tally[idx]++; rolls++;
      if (n % 4 === 3) { needle.classList.add('on'); needle.style.left = (u * 100) + '%'; render(); if (!(await run.wait(45, k))) return; }
    }
    render();
  });
  genBtn.addEventListener('click', async () => {
    const k = run.begin();
    rewind(); refresh(true);
    genBtn.textContent = 'Generating…';
    for (let n = 0; n < 12; n++) {
      if (!(await run.wait(380, k))) break;
      const i = await roll(k);
      if (i < 0) break;
      render();
      if (!(await run.wait(380, k))) break;
      words.push(rows[i].m); fresh = 1;
      if (rows[i].m === V.END) { lastPick = -1; render(); break; }
      refresh(true);
    }
    genBtn.textContent = GEN;
    if (run.ok(k)) note.innerHTML = '<strong>That was the whole trick.</strong> Each word was one roll against fresh odds, computed by the model from everything written so far. Press it again — unless the temperature is very low, you will often get a different sentence.';
  });
  const reset = () => { run.stop(); rewind(); needle.classList.remove('on'); genBtn.textContent = GEN; refresh(true); };
  L.$('#sampReset').addEventListener('click', reset);
  [temp, topk, topp].forEach(s => s.addEventListener('input', () => { run.stop(); genBtn.textContent = GEN; refresh(true); }));
  L.onPrompt(reset);
  ai.onChange(st => { if (st !== 'training') reset(); });

  L.$('#sampModelNote').textContent = ai.model.size.toLocaleString() + ' weights, a ' + V.size + '-token vocabulary';
  refresh(true);
})();

/* Chapters 8 + 9 — the context window as a fixed-size bar that turns fall out
   of, and prompts as something that narrows a cone of possible outputs. */
(function () {
  'use strict';
  const L = Lab, C = L.C;

  /* ---------- context window ---------- */
  const bar = L.$('#ctxBar');
  if (bar) {
    const CAP = 700, SYS = 80, MEM = 26, SUMMARY_EACH = 16, KEY = 2;
    const TURNS = [
      ['user', 'Asks for a garden photo page.', 42], ['ai', 'Checks the project structure.', 118],
      ['user', 'Says captions should be funny, not stiff.', 38], ['ai', 'Resizes images and edits the HTML.', 164],
      ['user', 'Changes the homepage nav.', 36], ['ai', 'Verifies with screenshots.', 142],
      ['user', 'Asks about AI education content.', 44], ['ai', 'Proposes an agent simulator.', 126],
      ['user', 'Says to proceed.', 18], ['ai', 'Edits the AI explainer page.', 176],
      ['user', 'Reports a mobile layout issue.', 40], ['ai', 'Fixes the responsive layout.', 150],
      ['user', 'Asks for another interaction.', 34], ['ai', 'Adds a tool-use demo.', 158]
    ];
    const range = L.$('#ctxRange'), list = L.$('#ctxList'), probe = L.$('#ctxProbe'), memBtn = L.$('#memoryToggle');
    const run = L.seq();
    let saved = false;
    const blk = (cls, label) => { const e = L.h('div', { class: 'ctx-blk ' + cls }, L.h('span', { text: label })); bar.append(e); return e; };
    const sysB = blk('sys', 'system prompt'), memB = blk('mem', 'memory'), sumB = blk('sum', 'summary');
    const turnB = TURNS.map((t, i) => blk(t[0], String(i + 1)));
    const rows = TURNS.map((t, i) => {
      const r = L.h('div', { class: 'context-item' }, [
        L.h('strong', { text: 'Turn ' + (i + 1) + ' · ' + (t[0] === 'user' ? 'you' : 'assistant') }),
        L.h('span', { text: t[1] + ' (' + t[2] + ' tokens)' }), L.h('span', { class: 'context-state' })
      ]);
      list.append(r); return r;
    });

    function render() {
      const n = Number(range.value);
      L.$('#ctxLabel').textContent = n;
      let budget = CAP - SYS - (saved ? MEM : 0), firstVisible = n;
      // newest turns stay verbatim while they fit; reserve room for a summary if anything is older
      for (let i = n - 1; i >= 0; i--) {
        const reserve = i > 0 ? Math.min(4, i) * SUMMARY_EACH : 0;
        if (TURNS[i][2] + reserve > budget) break;
        budget -= TURNS[i][2]; firstVisible = i;
      }
      const sumFrom = Math.max(0, firstVisible - 4), sumCount = firstVisible - sumFrom;
      let used = SYS + (saved ? MEM : 0) + sumCount * SUMMARY_EACH;
      const w = t => (t / CAP * 100).toFixed(2) + '%';
      sysB.style.width = w(SYS);
      memB.style.width = saved ? w(MEM) : '0%'; memB.classList.toggle('gone', !saved);
      sumB.style.width = w(sumCount * SUMMARY_EACH); sumB.classList.toggle('gone', !sumCount);
      let keyState = 'none';
      TURNS.forEach((t, i) => {
        let st = i >= n ? 'future' : i >= firstVisible ? 'visible' : i >= sumFrom ? 'summary' : 'dropped';
        if (st === 'visible') used += t[2];
        turnB[i].style.width = st === 'visible' ? w(t[2]) : '0%';
        turnB[i].classList.toggle('gone', st !== 'visible');
        turnB[i].classList.toggle('key', i === KEY);
        if (i === KEY) keyState = st;
        const row = rows[i];
        row.hidden = st === 'future';
        const memo = saved && i === KEY && st !== 'visible';
        row.className = 'context-item ' + (memo ? 'memory' : st) + (i === KEY ? ' key' : '');
        row.lastChild.textContent = memo ? 'in memory' : st === 'visible' ? 'in view' : st === 'summary' ? 'summarised' : 'dropped';
      });
      L.$('#ctxUsed').textContent = used + ' / ' + CAP;
      L.$('#ctxMeter').style.width = Math.min(100, used / CAP * 100) + '%';
      probe.className = 'ctx-probe ' + (keyState === 'visible' || saved ? 'ok' : keyState === 'summary' ? 'warn' : 'bad');
      probe.innerHTML = '<b>Test question: “What tone should the captions have?”</b> ' +
        (keyState === 'visible' ? 'Answerable. Turn 3, where you said “funny, not stiff”, is still in the window word for word.' :
          saved ? 'Answerable. Turn 3 has left the window, but the fact was saved to memory, and memory is pasted back in at the start of every request.' :
            keyState === 'summary' ? 'Probably. Turn 3 itself is gone; a one-line summary of it survives. Details get lost this way — “funny” may have been flattened to “casual”.' :
              'Not answerable. Turn 3 is no longer anywhere the model can see. It will not say “I forgot” — it will write a plausible, stiff caption and sound sure about it.');
    }
    range.addEventListener('input', () => { run.stop(); render(); });
    memBtn.addEventListener('click', () => {
      saved = !saved;
      memBtn.classList.toggle('active', saved);
      memBtn.setAttribute('aria-pressed', String(saved));
      memBtn.textContent = saved ? 'Turn 3 saved to memory' : 'Save turn 3 to memory';
      render();
    });
    L.$('#ctxPlay').addEventListener('click', async () => {
      const k = run.begin();
      for (let n = 3; n <= TURNS.length; n++) {
        range.value = n; render();
        if (!(await run.wait(850, k))) return;
      }
    });
    render();
  }

  /* ---------- prompts: the cone of possible outputs ---------- */
  const cv = L.$('#promptCanvas');
  if (!cv) return;
  const PARTS = {
    goal: ['Add interactive demos to the How AI Works page', 0.6],
    scope: ['covering tokens, context, prompts, tools, and failure modes.', 0.72],
    constraints: ['Keep it static HTML that works on GitHub Pages. Do not touch unrelated files.', 0.7],
    verify: ['Check the desktop and mobile layouts before you finish.', 0.8],
    format: ['Reply with what changed and a link to the page.', 0.86]
  };
  const PRESET = { weak: [], clear: ['goal', 'scope', 'constraints'], agent: ['goal', 'scope', 'constraints', 'verify', 'format'] };
  const N = 60, zr = L.rng(4242);
  const Z = Array.from({ length: N }, () => { // standard normal draws, fixed so the picture is stable
    const u = Math.max(1e-6, zr()), v2 = zr(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v2);
  });
  const OUT = [[-0.42, 'rewrote all the copy'], [-0.23, 'restyled the whole page'], [0.23, 'added a framework'], [0.42, 'wrote an essay instead']];
  const on = new Set();
  let sig = 1, off = 0.34, tSig = 1, tOff = 0.34;

  function sync() {
    tSig = 1; on.forEach(k => { tSig *= PARTS[k][1]; });
    tOff = on.has('goal') ? (on.has('scope') ? 0 : 0.1) : 0.34;
    L.$$('[data-part]').forEach(b => { const a = on.has(b.dataset.part); b.classList.toggle('active', a); b.setAttribute('aria-pressed', String(a)); });
    const key = Object.keys(PRESET).find(k => PRESET[k].length === on.size && PRESET[k].every(p => on.has(p)));
    L.$$('[data-prompt]').forEach(b => b.classList.toggle('active', b.dataset.prompt === key));
    const txt = L.$('#promptText');
    txt.innerHTML = (on.has('goal') ? '' : '<span>Make the AI page better.</span> ') +
      Object.keys(PARTS).filter(k => on.has(k)).map(k => '<span class="part p-' + k + '">' + L.esc(PARTS[k][0]) + '</span>').join(' ');
    const hits = Z.filter(z => Math.abs(tOff + z * tSig * 0.2) < 0.085).length;
    L.$('#promptHit').textContent = hits + ' of ' + N;
    L.$('#promptNote').innerHTML = on.size === 0
      ? '<strong>Vague.</strong> “Better” could mean new text, new styling, new sections, or bug fixes. Every one of those is a likely continuation, so the outputs fan out — and the centre of the fan is the model’s default idea of “better”, not yours.'
      : on.size < 5 ? '<strong>Narrowing.</strong> Each detail you add rules out continuations that no longer fit. The model is the same; the set of plausible next tokens got smaller. ' + (on.has('verify') ? '' : 'Nothing yet asks it to check its work.')
        : '<strong>Agent-ready.</strong> Goal, scope, limits, a verification step, and the shape of the reply. Almost every run now lands where you wanted — not because the model tried harder, but because little else is left to be plausible.';
    L.kick();
  }
  L.$$('[data-part]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.part; if (on.has(k)) on.delete(k); else on.add(k); sync(); }));
  L.$$('[data-prompt]').forEach(b => b.addEventListener('click', () => { on.clear(); PRESET[b.dataset.prompt].forEach(k => on.add(k)); sync(); }));

  L.scene(cv, (dt, t) => {
    const k = dt ? Math.min(1, dt * 0.005) : (L.reduce ? 1 : 0);
    sig += (tSig - sig) * k; off += (tOff - off) * k;
    const v = L.fit(cv), ctx = v.ctx, W = v.w, H = v.h, small = W < 520;
    ctx.clearRect(0, 0, W, H);
    const x0 = small ? 16 : 34, x1 = W - (small ? 92 : 170), yc = H / 2, sc = H * 0.98;
    // target band
    const bh = 0.085 * sc;
    ctx.fillStyle = L.rgba(C.gold, 0.12); ctx.fillRect(x1 - 6, yc - bh, 14, bh * 2);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1 + 12, yc - bh); ctx.lineTo(x1 + 18, yc - bh); ctx.lineTo(x1 + 18, yc + bh); ctx.lineTo(x1 + 12, yc + bh); ctx.stroke();
    ctx.font = '700 ' + (small ? 10 : 12) + 'px Inter,system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = C.gold; ctx.fillText(small ? 'wanted' : 'what you wanted', x1 + 24, yc);
    let hits = 0;
    Z.forEach((z, i) => {
      const y = L.clamp(off + z * sig * 0.2, -0.48, 0.48), ye = yc + y * sc, hit = Math.abs(y) < 0.085;
      if (hit) hits++;
      const col = hit ? C.green : C.rose;
      ctx.strokeStyle = L.rgba(col, hit ? 0.3 : 0.16); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yc); ctx.bezierCurveTo(x0 + (x1 - x0) * 0.45, yc, x0 + (x1 - x0) * 0.55, ye, x1, ye); ctx.stroke();
      const p = L.reduce ? 1 : ((t / 2600 + i * 0.137) % 1), e = 1 - p;
      const px = e * e * e * x0 + 3 * e * e * p * (x0 + (x1 - x0) * 0.45) + 3 * e * p * p * (x0 + (x1 - x0) * 0.55) + p * p * p * x1;
      const py = e * e * e * yc + 3 * e * e * p * yc + 3 * e * p * p * ye + p * p * p * ye;
      ctx.beginPath(); ctx.arc(px, py, 2.4, 0, 6.2832); ctx.fillStyle = L.rgba(col, 0.9); ctx.fill();
      ctx.beginPath(); ctx.arc(x1, ye, 2.6, 0, 6.2832); ctx.fillStyle = L.rgba(col, 0.75); ctx.fill();
    });
    // what the misses look like
    OUT.forEach(o => {
      const dens = Z.filter(z => Math.abs(L.clamp(off + z * sig * 0.2, -0.48, 0.48) - o[0]) < 0.08).length;
      if (!dens) return;
      ctx.fillStyle = L.rgba(C.rose, L.clamp(0.25 + dens / 8)); ctx.font = (small ? 9.5 : 11.5) + 'px Inter,system-ui,sans-serif';
      ctx.fillText(o[1], x1 + 10, yc + o[0] * sc, W - x1 - 12);
    });
    ctx.beginPath(); ctx.arc(x0, yc, 9, 0, 6.2832); ctx.fillStyle = C.cyan; ctx.shadowColor = C.cyan; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = C.muted; ctx.font = '700 11px Inter,system-ui,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('your prompt', x0 - 6, yc - 22);
  });
  sync();
})();

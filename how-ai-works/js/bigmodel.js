/* Chapter 6, second demo — the same "scores, odds, pick" step in a much larger
   real model. Nothing is computed here: data/nexttoken.json holds scores that
   were recorded ahead of time from Qwen2.5-0.5B, plus short continuations that
   were sampled from those odds at each temperature. This script replays them.

   Per prompt in the file:
     nodes[i]    { t: the ten top-scoring tokens as [piece, score, id],
                   l: log of the sum of exp(score / T) over the WHOLE vocabulary,
                      one entry per temperature (null at temperature 0),
                   k: the recorded next steps, { id: [node index, piece, score] } }
     rollouts[T] recorded runs at temperature T, each a list of node indexes
     picks[id]   the run that starts with token `id`, then always takes the top choice */
(function () {
  'use strict';
  const L = Lab, root = L.$('#bigModel');
  if (!root) return;
  const ui = {};
  for (const id of ['Prompts', 'Line', 'Bars', 'ProbHead', 'Hint', 'Temp', 'TempOut', 'Next', 'Auto', 'Again', 'Five', 'Note', 'Runs']) {
    if (!(ui[id] = L.$('#bm' + id, root))) return;        // the block was changed: do nothing
  }
  const run = L.seq();
  const fill = (el, kids) => { el.textContent = ''; kids.forEach(k => { if (k != null) el.append(k); }); };
  const strong = text => L.h('strong', { text });
  const say = kids => fill(ui.Note, kids);
  const lock = on => [ui.Temp, ui.Next, ui.Auto, ui.Again, ui.Five].forEach(c => { c.disabled = on; });

  /* ---------- showing a token and a percentage ---------- */
  const inText = s => String(s).replace(/\r/g, '').replace(/\n/g, '⏎').replace(/\t/g, ' ');
  function tokenName(s) {                       // -> [what to show, is it the token's own text?]
    s = String(s);
    if (!s.length || s.indexOf('�') >= 0) return ['part of a character', false];
    const t = inText(s).trim();
    return t ? [t, true] : ['a space', false];
  }
  const label = s => { const n = tokenName(s); return n[1] ? n[0] : '(' + n[0] + ')'; };
  const quoted = s => { const n = tokenName(s); return n[1] ? '“' + n[0] + '”' : n[0]; };
  const tiny = p => p > 0 && p < 0.001;
  const pc = p => (tiny(p) ? '<0.1%' : p === 0 ? '0%' : L.pct(p));           // in the table
  const pcWords = p => (tiny(p) ? 'under 0.1%' : p === 0 ? '0%' : L.pct(p)); // in a sentence

  function tempNote(T) {
    if (T === 0) return 'No dice at all. The top row always wins, so the same starting text gives the same result every time. It can also get stuck repeating itself.';
    if (T <= 0.3) return 'Very low. The favourite becomes even more of a favourite. Focused and predictable.';
    if (T <= 0.6) return 'Low. The pick stays close to the top rows. This suits factual answers and code.';
    if (T < 1) return 'Moderate. Mostly sensible, with some variety.';
    if (T === 1) return 'These are the model’s own odds, unchanged. Varied, but usually sensible.';
    if (T <= 1.3) return 'Warm. Unlikely tokens start to get a real chance. More surprises, more mistakes.';
    if (T <= 1.6) return 'Hot. Unlikely tokens are picked often. Creative is turning into chaotic.';
    return 'Very hot. The odds are almost flat, so nearly any token can win. Expect nonsense.';
  }

  /* ---------- loading: the file is large, so wait until the block is near the screen ---------- */
  const usable = d => !!d && Array.isArray(d.temps) && d.temps.length > 0 && Array.isArray(d.prompts) && d.prompts.length > 0 &&
    d.prompts.every(p => p && typeof p.prompt === 'string' && Array.isArray(p.nodes) && p.nodes.length > 0 && p.rollouts);
  let asked = false;
  function load() {
    if (asked) return;
    asked = true;
    fetch('data/nexttoken.json')
      .then(r => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(d => { if (!usable(d)) throw new Error('unexpected data'); start(d); })
      .catch(() => { lock(true); ui.Note.textContent = 'The recorded model data did not load, so this demo is switched off. Reloading the page may fix it.'; });
  }
  lock(true);
  ui.Note.textContent = 'Loading the recorded data…';
  const tinyNote = L.$('#bmTiny', root);
  if (tinyNote && L.ai && L.ai.model && L.ai.model.size) tinyNote.textContent = ' (' + L.ai.model.size.toLocaleString() + ' weights)';
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '600px' });
    io.observe(root);
  } else load();

  /* ---------- the demo ---------- */
  function start(data) {
    const temps = data.temps, t1 = temps.indexOf(1), t0 = temps.indexOf(0);
    let pi = 0, ti = t1 >= 0 ? t1 : 0;
    let path = [0], step = 0, forced = false, rare = 0, playing = false, lastRun = -1, lineFor = -1;
    let view = { at: 0, c: null, t: ti };     // which recorded step the table shows, and the token picked there (if any)
    let painted = { key: '', shape: '' };

    const P = () => data.prompts[pi];
    const nodeAt = i => P().nodes[path[i]];
    const tempName = t => String(temps[t]);
    const runsAt = t => P().rollouts[tempName(t)] || [];
    const done = () => step >= path.length - 1;

    // the recorded step that leads from `node` to the node with index `child`
    function choiceOf(node, child) {
      for (const id in node.k) if (node.k[id][0] === child) return { id: Number(id), piece: node.k[id][1], score: node.k[id][2] };
      return null;
    }
    // one token's chance at temperature index t. `l` already covers the whole vocabulary; the
    // file's scores are rounded to two decimals, so a low temperature can push this a shade over 1.
    function chance(node, id, score, t) {
      if (temps[t] === 0) return id === node.t[0][2] ? 1 : 0;
      return L.clamp(Math.exp(score / temps[t] - node.l[t]));
    }
    function pickRun() {
      const list = runsAt(ti);
      if (!list.length) return [0];
      let i = Math.floor(Math.random() * list.length);
      if (list.length > 1 && i === lastRun) i = (i + 1) % list.length;   // "Start again" should show a different run
      lastRun = i;
      return list[i];
    }

    /* ----- the line of text: only ever appended to, so a screen reader hears just the new token ----- */
    function resetLine() {
      if (lineFor === pi && ui.Line.children.length === 1) return;
      fill(ui.Line, [L.h('span', { class: 'p', text: P().prompt })]);
      lineFor = pi;
    }

    /* ----- the table of odds ----- */
    function setChance(em, r, picked) {
      fill(em, [(picked ? '✓ ' : '') + pc(r.p), picked ? L.h('span', { class: 'sr-only', text: ' picked' }) : null]);
    }
    function paintBars() {
      const node = nodeAt(view.at), t = view.t, c = view.c;
      const rows = node.t.map(r => ({ id: r[2], piece: r[0], name: label(r[0]), score: r[1], p: chance(node, r[2], r[1], t) }));
      if (c && !rows.some(r => r.id === c.id)) rows.push({ id: c.id, piece: c.piece, name: label(c.piece), score: c.score, p: chance(node, c.id, c.score, t), extra: true });
      rows.push({ id: -1, name: 'all the rest', other: true, p: L.clamp(1 - rows.reduce((s, r) => s + r.p, 0)) });
      const sc = 100 / Math.max(0.4, Math.max.apply(null, rows.map(r => r.p)));   // bars are drawn relative to the leader
      const canPick = !c && step === 0 && !!P().picks;
      const key = pi + '/' + path[view.at], shape = key + '/' + rows.length + '/' + canPick;
      const width = r => Math.min(100, r.p * sc).toFixed(1) + '%';
      const pickLabel = r => 'Start with ' + quoted(r.piece) + ', ' + pcWords(r.p);
      if (shape === painted.shape) {
        // same step, same rows: move the bars instead of rebuilding them (this is what a temperature change does)
        rows.forEach((r, j) => {
          const row = ui.Bars.children[j], picked = !!c && r.id === c.id;
          row.classList.toggle('picked', picked);
          row.children[2].firstChild.style.width = width(r);
          setChance(row.children[3], r, picked);
          if (row.tagName === 'BUTTON') row.setAttribute('aria-label', pickLabel(r));
        });
      } else {
        // no grow-in animation when the step is unchanged, or while the page is paused (a paused animation would leave the bars at zero width)
        ui.Bars.classList.toggle('still', key === painted.key || L.state.paused);
        fill(ui.Bars, rows.map(r => {
          const picked = !!c && r.id === c.id, can = canPick && !r.other && !!P().picks[r.id];
          const em = L.h('em');
          setChance(em, r, picked);
          return L.h(can ? 'button' : 'div', {
            class: 'bm-row' + (picked ? ' picked' : '') + (r.other ? ' other' : '') + (r.extra ? ' extra' : '') + (can ? ' can' : ''),
            type: can ? 'button' : null, 'aria-label': can ? pickLabel(r) : null, onclick: can ? () => pickFirst(r.id) : null
          }, [
            L.h('span', { class: 'w', text: r.name }),
            L.h('span', { class: 's', text: r.other ? '' : r.score.toFixed(2) }),
            L.h('span', { class: 'bar' }, L.h('i', { style: { width: width(r) } })),
            em
          ]);
        }));
      }
      painted = { key, shape };
      ui.ProbHead.textContent = 'chance at temperature ' + tempName(t);
      ui.Hint.textContent = canPick ? 'You can also choose the first token yourself: press any row.'
        : forced ? 'You chose the first token. Every token after it is the model’s top choice.'
          : 'Rows can be pressed only before the first token. Press Start again to get back there.';
    }

    /* ----- controls ----- */
    function sync() {
      const end = done(), at = document.activeElement;
      if (end && (at === ui.Next || at === ui.Auto)) ui.Again.focus();   // do not strand the keyboard on a disabled button
      ui.Next.disabled = end;
      ui.Auto.disabled = end;
      ui.Auto.textContent = playing ? 'Stop' : 'Write the rest';
      ui.Temp.value = String(ti);
      ui.Temp.setAttribute('aria-valuetext', 'temperature ' + tempName(ti));
      ui.TempOut.textContent = tempName(ti);
      Array.from(ui.Prompts.children).forEach((b, i) => { b.classList.toggle('active', i === pi); b.setAttribute('aria-pressed', String(i === pi)); });
    }
    const halt = () => { run.stop(); playing = false; };
    const hideRuns = () => { ui.Runs.hidden = true; ui.Runs.textContent = ''; };

    /* ----- one recorded step ----- */
    function take() {
      if (done()) return null;
      const node = nodeAt(step), c = choiceOf(node, path[step + 1]);
      if (!c) { path = path.slice(0, step + 1); return null; }    // a broken recording simply ends here
      const mine = forced && step === 0, t = mine && t1 >= 0 ? t1 : ti;
      const p1 = t1 >= 0 ? chance(node, c.id, c.score, t1) : null;
      const isRare = !mine && p1 != null && p1 < 0.05;
      if (isRare) rare++;
      view = { at: step, c, t };
      ui.Line.append(L.h('span', {
        class: 'g' + (mine ? ' mine' : isRare ? ' rare' : ''), text: inText(c.piece),
        title: mine ? 'you chose this token' : p1 == null ? null : pcWords(p1) + ' by the model’s own odds'
      }));
      step++;
      return { c, mine, p1, pT: chance(node, c.id, c.score, t), inTop: node.t.some(r => r[2] === c.id) };
    }

    /* ----- what the note says ----- */
    const idleNote = () => [strong('Temperature ' + tempName(ti) + '.'), ' ' + tempNote(temps[ti]) + ' Press Next token to see what a recorded run picked.'];
    function pickNote(r) {
      const name = quoted(r.c.piece), own = r.p1 == null ? '' : ' By the model’s own odds its chance was ' + pcWords(r.p1) + '.';
      if (r.mine) return [strong('You chose ' + name + '.'), own + ' From here on, this recorded run always takes the top row. Everything that follows comes from your one choice.'];
      let s;
      if (temps[ti] === 0) s = ' Temperature 0 always takes the top row.' + own;
      else if (ti === t1) s = ' Its chance was ' + pcWords(r.pT) + '.';
      else s = ' At temperature ' + tempName(ti) + ' its chance was ' + pcWords(r.pT) + '.' + (pcWords(r.pT) === pcWords(r.p1) ? '' : own);
      if (!r.inTop) s += ' It was not one of the ten most likely tokens, so it gets a row of its own.';
      return [strong('The recorded run picked ' + name + '.'), s];
    }
    function endNote() {
      const n = path.length - 1;
      return [strong('End of this recorded run.'), ' It is ' + n + ' token' + (n === 1 ? '' : 's') + ' long. ' +
        (rare ? rare + (rare === 1 ? ' of them was a long shot' : ' of them were long shots') + ' (under 5% by the model’s own odds), shown with a dotted underline. ' : '') +
        (forced ? 'Press Start again to go back to the first token.'
          : runsAt(ti).length > 1 ? 'Press Start again to replay a different recorded run at this temperature.'
            : 'Press Start again to replay it. Only one run was recorded at this temperature.')];
    }

    /* ----- actions ----- */
    function restart() {
      halt();
      forced = false; step = 0; rare = 0;
      path = pickRun();
      view = { at: 0, c: null, t: ti };
      resetLine(); hideRuns(); paintBars(); sync();
      say(idleNote());
    }
    function stepOnce() {
      halt();
      const r = take();
      paintBars(); sync();
      say(!r ? endNote() : done() ? pickNote(r).concat(' ', endNote()) : pickNote(r));
    }
    async function play() {
      const k = run.begin();
      playing = true; sync();
      say(['Replaying a recorded run at temperature ' + tempName(ti) + '…']);
      while (!done()) {
        if (view.c) {                       // first show the odds for the next token, then the pick
          view = { at: step, c: null, t: ti };
          paintBars();
          if (!(await run.wait(380, k))) return;
        }
        if (!take()) break;
        paintBars();
        if (!done() && !(await run.wait(560, k))) return;
      }
      playing = false; sync();
      say(endNote());
    }
    function pickFirst(id) {
      const p = P().picks && P().picks[id];
      if (!p) return;
      halt();
      path = p; step = 0; rare = 0; forced = true;
      if (t0 >= 0) ti = t0;
      resetLine(); hideRuns();
      const r = take();
      paintBars(); sync();
      say(r ? pickNote(r) : endNote());
      (done() ? ui.Again : ui.Next).focus();       // the row that was pressed no longer exists
    }
    function showRuns() {
      const list = runsAt(ti), T = tempName(ti), idx = list.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)), x = idx[i]; idx[i] = idx[j]; idx[j] = x; }
      const n = Math.min(5, idx.length);
      const textOf = rp => rp.slice(0, -1).map((ni, i) => { const c = choiceOf(P().nodes[ni], rp[i + 1]); return c ? c.piece : ''; }).join('');
      fill(ui.Runs, [
        L.h('h3', { text: n === 1 ? 'The one recorded run at temperature ' + T : n + ' recorded runs at temperature ' + T }),
        L.h('ol', { class: 'bm-runlist' }, idx.slice(0, n).map((i, j) => L.h('li', null, [L.h('b', { text: 'Run ' + (j + 1) }), ' ', L.h('span', { class: 'p', text: P().prompt }), L.h('span', { class: 'g', text: inText(textOf(list[i])) })]))),
        L.h('p', {
          text: !n ? 'No runs were recorded at this temperature.'
            : temps[ti] === 0 ? 'At temperature 0 nothing is left to chance. Every run gives this same text, so one line is all there is to show.'
              : 'Same model, same starting text, different dice rolls. These are ' + n + ' of the ' + list.length + ' runs recorded at this temperature.'
        })
      ]);
      ui.Runs.hidden = false;
    }

    /* ----- wire up ----- */
    fill(ui.Prompts, data.prompts.map((p, i) => L.h('button', { class: 'lab-button', type: 'button', 'aria-pressed': 'false', text: p.prompt + '…', onclick: () => { pi = i; restart(); } })));
    ui.Temp.min = '0'; ui.Temp.max = String(temps.length - 1); ui.Temp.step = '1';
    ui.Temp.addEventListener('input', () => { ti = L.clamp(Math.round(Number(ui.Temp.value)) || 0, 0, temps.length - 1); restart(); });
    ui.Next.addEventListener('click', stepOnce);
    ui.Auto.addEventListener('click', () => {
      if (!playing) { play(); return; }
      halt(); sync();
      say([strong('Stopped.'), ' Press Next token to go one step at a time, or Write the rest to carry on.']);
    });
    ui.Again.addEventListener('click', restart);
    ui.Five.addEventListener('click', showRuns);
    L.$$('[data-bm="model"]', root).forEach(e => { if (typeof data.model === 'string' && data.model) e.textContent = data.model; });
    lock(false);
    restart();
  }
})();

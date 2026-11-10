/* Training & alignment deep dive. Runs on the shared lab engine (core.js) and the
   page's real tiny transformer: the pretraining and fine-tuning chapters train
   that model for real; RLHF, evals, deployment and RAG answers are scripted
   illustrations and are labelled as such on the page. */
(function () {
  'use strict';
  const L = window.Lab;
  if (!L) return;
  const C = L.C, ai = L.ai, V = ai.V, D = ai.data;
  const mono = 'ui-monospace,Menlo,Consolas,monospace';
  const tokLabel = m => (m === V.END ? '.' : ai.word(m));
  const on = (sel, ev, fn) => { const e = L.$(sel); if (e) e.addEventListener(ev, fn); };

  // run fn once when el first scrolls into view (or straight away without IntersectionObserver)
  function whenSeen(el, fn, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn(); } }, { threshold: threshold || 0.25 });
    io.observe(el);
  }

  /* ---------- hero: a loss curve being drawn ---------- */
  const hero = L.$('#ddHero');
  if (hero) L.scene(hero, (dt, t) => {
    const v = L.fit(hero), ctx = v.ctx, x0 = 34, x1 = v.w - 14, y0 = 18, y1 = v.h - 30;
    ctx.clearRect(0, 0, v.w, v.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.font = '700 10px ' + mono; ctx.fillStyle = L.rgba(C.muted, 0.9); ctx.textBaseline = 'middle';
    ctx.textAlign = 'center'; ctx.fillText('training steps →', (x0 + x1) / 2, v.h - 12);
    ctx.save(); ctx.translate(14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('loss', 0, 0); ctx.restore();
    const f = x => 0.1 + 0.82 * Math.exp(-4.4 * x) + 0.035 * Math.sin(x * 46) * Math.exp(-2.4 * x);
    const p = L.reduce ? 1 : L.clamp(((t / 5600) % 1.25));
    ctx.strokeStyle = C.rose; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const x = i / 120;
      if (x > p) break;
      const px = L.lerp(x0, x1, x), py = L.lerp(y1, y0, f(x));
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
    const bx = L.lerp(x0, x1, p), by = L.lerp(y1, y0, f(p));
    ctx.beginPath(); ctx.arc(bx, by, 6, 0, 6.2832); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
  });

  /* ---------- 01 pipeline ---------- */
  const STAGES = [
    ['Data', 'Collect and filter data', 'Trillions of tokens of text, code, and media are gathered, deduplicated, and filtered for quality. The mixture recipe — how much code, how many languages, which sources — is one of the most consequential decisions in the whole process.', 'data', 'raw text'],
    ['Pretrain', 'Pretrain the base model', 'The model plays guess-the-next-token across the entire dataset for months on thousands of chips, gradually compressing the patterns of human text into its weights. The result is a powerful but raw text continuer.', 'pretraining', 'base model'],
    ['Fine-tune', 'Fine-tune behaviour', 'A much smaller, curated set of example conversations teaches the base model to behave like an assistant: answer the question, follow the instruction, use the format requested.', 'finetuning', 'assistant'],
    ['Feedback', 'Align with feedback', 'Humans (and increasingly AI raters) compare candidate answers. A reward model learns those preferences, and reinforcement learning nudges the assistant toward helpful, honest, harmless behaviour.', 'rlhf', 'aligned assistant'],
    ['Evals', 'Evaluate and red-team', 'Benchmarks, human evals, safety tests, and adversarial red teams probe the candidate. Regressions block release: better on average is not good enough if something important got worse.', 'evals', 'tested model'],
    ['Deploy', 'Deploy with safeguards', 'The model ships wrapped in system prompts, tool permissions, moderation, monitoring, and rate limits. Deployment is where a model becomes a product — and where its behaviour is watched in the real world.', 'deployment', 'product']
  ];
  const pipe = L.$('#ddPipe');
  if (pipe) {
    let sel = 0, auto = !L.reduce, pp = 0, view = null;
    const playB = L.$('#ddPipePlay');
    const nodeX = i => view.pad + i * (view.w - 2 * view.pad) / (STAGES.length - 1);
    function select(i, manual) {
      sel = i;
      if (manual) { auto = false; pp = i; }
      const s = STAGES[i];
      L.$$('#ddPipeStages [data-stage]').forEach(b => { const m = Number(b.dataset.stage) === i; b.classList.toggle('active', m); b.setAttribute('aria-pressed', String(m)); });
      L.$('#ddPipeDetail').innerHTML = '<strong>' + (i + 1) + ' · ' + s[1] + '.</strong> ' + s[2] + ' <a class="dd-jump" href="#' + s[3] + '">Go to that chapter →</a>';
      if (playB) { playB.textContent = auto ? 'Pause the tour' : 'Play the tour'; playB.setAttribute('aria-pressed', String(auto)); }
      L.kick();
    }
    L.scene(pipe, dt => {
      if (auto && dt) {
        pp = (pp + dt / 2600) % STAGES.length;
        if (Math.floor(pp) !== sel) select(Math.floor(pp), false);
      }
      const v = L.fit(pipe), ctx = v.ctx, small = v.w < 520;
      view = { w: v.w, pad: small ? 26 : 62 };
      ctx.clearRect(0, 0, v.w, v.h);
      const y = v.h * 0.52, n = STAGES.length;
      ctx.strokeStyle = 'rgba(110,159,205,0.3)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(nodeX(0), y); ctx.lineTo(nodeX(n - 1), y); ctx.stroke();
      const g = ctx.createLinearGradient(nodeX(0), 0, nodeX(sel), 0);
      g.addColorStop(0, L.rgba(C.green, 0.7)); g.addColorStop(1, L.rgba(C.gold, 0.9));
      ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(nodeX(0), y); ctx.lineTo(nodeX(sel), y); ctx.stroke();
      STAGES.forEach((s, i) => {
        const x = nodeX(i), act = i === sel, done = i < sel;
        ctx.beginPath(); ctx.arc(x, y, small ? 12 : 16, 0, 6.2832);
        ctx.fillStyle = act ? C.gold : 'rgba(8,27,48,0.96)';
        if (act) { ctx.shadowColor = C.gold; ctx.shadowBlur = 18; }
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = act ? C.gold : done ? C.green : L.rgba(C.cyan, 0.6); ctx.lineWidth = 2; ctx.stroke();
        ctx.font = '800 ' + (small ? 11 : 13) + 'px ' + mono; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = act ? '#10202b' : '#fff'; ctx.fillText(String(i + 1), x, y + 0.5);
        ctx.font = (act ? '800 ' : '600 ') + (small ? 9.5 : 12) + 'px Inter,system-ui,sans-serif';
        ctx.fillStyle = act ? '#fff' : L.rgba(C.muted, 0.95);
        ctx.fillText(s[0], x, y + (small ? 26 : 34));
      });
      // the thing travelling down the line, labelled with what exists at this point
      const idx = Math.floor(pp), fr = pp - idx, move = auto ? L.ease.io(L.clamp((fr - 0.55) / 0.45)) : 0;
      const last = idx === n - 1, px = last ? nodeX(idx) : L.lerp(nodeX(idx), nodeX(idx + 1), move);
      const label = STAGES[auto ? idx : sel][4];
      ctx.globalAlpha = last && auto ? 1 - move : 1;
      ctx.font = '700 ' + (small ? 10 : 11.5) + 'px ' + mono;
      const tw = ctx.measureText(label).width + 16, lx = L.clamp(px - tw / 2, 4, v.w - tw - 4), ly = y - (small ? 44 : 52);
      L.rr(ctx, lx, ly, tw, 22, 11); ctx.fillStyle = 'rgba(2,8,18,0.92)'; ctx.fill();
      ctx.strokeStyle = C.gold; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = C.gold; ctx.textAlign = 'center'; ctx.fillText(label, lx + tw / 2, ly + 11.5);
      ctx.strokeStyle = L.rgba(C.gold, 0.6); ctx.beginPath(); ctx.moveTo(px, ly + 22); ctx.lineTo(px, y - (small ? 14 : 18)); ctx.stroke();
      if (move > 0 && !last) { ctx.beginPath(); ctx.arc(px, y, 6, 0, 6.2832); ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0; }
      ctx.globalAlpha = 1;
    });
    pipe.addEventListener('click', ev => {
      if (!view) return;
      const r = pipe.getBoundingClientRect(), mx = ev.clientX - r.left;
      let best = 0, bd = Infinity;
      STAGES.forEach((s, i) => { const d = Math.abs(nodeX(i) - mx); if (d < bd) { bd = d; best = i; } });
      select(best, true);
    });
    L.$$('#ddPipeStages [data-stage]').forEach(b => b.addEventListener('click', () => select(Number(b.dataset.stage), true)));
    if (playB) playB.addEventListener('click', () => { auto = !auto; if (auto) pp = sel; select(sel, false); });
    select(0, false);
  }

  /* ---------- 02 data: the cleaning funnel ---------- */
  const fun = L.$('#ddFunnel');
  if (fun) {
    const rnd = L.rng(31);
    let parts = [], spawn = 0, cnt, pre = false;
    const GF = 0.3, GD = 0.52, GT = 0.74;
    const reset = () => { parts = []; spawn = 0; cnt = { raw: 0, junk: 0, dup: 0, tok: 0 }; };
    reset();
    function sim(ms) {
      spawn -= ms;
      while (spawn <= 0) {
        spawn += 150;
        const r = rnd();
        parts.push({ x: 0.02, y: 0.3 + rnd() * 0.4, kind: r < 0.3 ? 'junk' : r < 0.5 ? 'dup' : 'good', st: 0, a: 1, vy: 0 });
        cnt.raw++;
      }
      const sp = ms / 9000;
      parts.forEach(p => {
        if (p.st === 0) {
          const nx = p.x + sp;
          if (p.kind === 'junk' && p.x < GF && nx >= GF) { p.st = 1; p.vy = 0.0005; cnt.junk++; }
          else if (p.kind === 'dup' && p.x < GD && nx >= GD) { p.st = 2; cnt.dup++; }
          else if (p.kind === 'good' && p.x < GT && nx >= GT) { p.st = 3; cnt.tok += 4; }
          p.x = nx;
        } else if (p.st === 1) { p.vy += ms * 0.0000012; p.y += p.vy * ms; p.x += sp * 0.3; p.a -= ms / 900; }
        else if (p.st === 2) { p.y -= ms * 0.00012; p.a -= ms / 700; }
        else { p.x += sp; }
      });
      parts = parts.filter(p => p.a > 0 && p.x < 0.97);
    }
    L.scene(fun, dt => {
      if (L.reduce && !pre) { pre = true; for (let i = 0; i < 260; i++) sim(60); }
      if (dt && !L.reduce) sim(dt);
      const v = L.fit(fun), ctx = v.ctx, W = v.w, H = v.h, small = W < 520;
      ctx.clearRect(0, 0, W, H);
      const X = x => 8 + x * (W - 16), Y = y => 30 + y * (H - 84);
      ctx.fillStyle = 'rgba(255,255,255,0.025)'; ctx.fillRect(X(0), Y(0.22), X(0.98) - X(0), Y(0.78) - Y(0.22));
      [[GF, small ? 'filter' : 'quality filter', C.rose], [GD, small ? 'dedupe' : 'remove duplicates', C.violet], [GT, small ? 'tokenize' : 'tokenizer', C.gold]].forEach(gt => {
        ctx.strokeStyle = L.rgba(gt[2], 0.85); ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(X(gt[0]), Y(0.14)); ctx.lineTo(X(gt[0]), Y(0.86)); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = '800 ' + (small ? 9.5 : 11) + 'px ' + mono; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = gt[2]; ctx.fillText(gt[1], X(gt[0]), 14);
      });
      ctx.font = '700 ' + (small ? 9.5 : 11) + 'px ' + mono; ctx.fillStyle = L.rgba(C.muted, 0.95);
      ctx.textAlign = 'left'; ctx.fillText(small ? 'raw' : 'raw text', X(0.01), 14);
      ctx.textAlign = 'right'; ctx.fillText(small ? 'tokens' : 'training tokens', X(0.99), 14);
      parts.forEach(p => {
        const x = X(p.x), y = Y(p.y);
        ctx.globalAlpha = L.clamp(p.a);
        if (p.st === 3) {
          ctx.fillStyle = C.gold;
          for (let k = 0; k < 4; k++) ctx.fillRect(x - 8 + (k % 2) * 7 + (p.x - GT) * 30 * (k - 1.5), y - 6 + Math.floor(k / 2) * 7, 5, 5);
        } else {
          const col = p.kind === 'junk' ? C.rose : p.kind === 'dup' ? C.violet : C.cyan;
          L.rr(ctx, x - 5, y - 6, 10, 12, 2); ctx.fillStyle = L.rgba(col, p.kind === 'dup' ? 0.35 : 0.8); ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
          if (p.kind === 'junk') { ctx.strokeStyle = '#10202b'; ctx.beginPath(); ctx.moveTo(x - 2.5, y - 3); ctx.lineTo(x + 2.5, y + 3); ctx.moveTo(x + 2.5, y - 3); ctx.lineTo(x - 2.5, y + 3); ctx.stroke(); }
        }
      });
      ctx.globalAlpha = 1;
      ctx.font = '700 ' + (small ? 9.5 : 11) + 'px ' + mono; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      const by = H - 24, row = (x, txt, col) => { ctx.fillStyle = col; ctx.fillText(txt, x, by); };
      row(X(0.14), cnt.raw + (small ? ' in' : ' pages in'), L.rgba(C.cyan, 1));
      row(X((GF + GD) / 2), '−' + cnt.junk + ' junk', C.rose);
      row(X((GD + GT) / 2), '−' + cnt.dup + (small ? ' dup' : ' duplicates'), C.violet);
      row(X((GT + 1) / 2), cnt.tok + ' tokens', C.gold);
      ctx.fillStyle = L.rgba(C.dim, 1); ctx.font = '10px ' + mono;
      ctx.fillText('illustrative proportions — not measurements', W / 2, H - 8);
    });
    on('#ddFunnelReset', 'click', () => { reset(); pre = false; L.kick(); });
  }
  // real numbers for the model on this page
  (function () {
    const set = (id, n) => {
      const el = L.$(id);
      if (!el) return;
      whenSeen(el, () => {
        if (L.reduce) { el.textContent = n.toLocaleString(); return; }
        const t0 = Date.now();
        (function tick() {
          const p = L.clamp((Date.now() - t0) / 1200);
          el.textContent = Math.round(n * L.ease.out(p)).toLocaleString();
          if (p < 1) setTimeout(tick, 30);
        })();
      }, 0.6);
    };
    set('#ddDataSent', D.corpus.length);
    set('#ddDataTok', D.corpus.reduce((s, q) => s + q.length - 1, 0));
    set('#ddDataVocab', V.size);
    set('#ddDataWeights', ai.model.size);
  })();

  /* ---------- 03 pretraining: one training example, token by token ---------- */
  const exTok = L.$('#ddExTokens');
  if (exTok) {
    const run = L.seq();
    let si = Math.max(0, D.SENTENCES.indexOf('the gardener was tired so she sat on the fence')), k = 1, shown = false;
    const seq = () => D.corpus[si];
    const pTrue = j => { const s = seq(), d = ai.next(s.slice(1, j)); return { d, p: d.find(x => x.m === s[j]).p }; };
    function render() {
      const s = seq(), last = s.length - 1, fin = k === last && shown;
      exTok.innerHTML = '';
      for (let j = 1; j <= last; j++) {
        const known = j < k || (j === k && shown);
        exTok.append(L.h('span', {
          class: 'tok ' + (known ? (j === k ? 'c1 pop' : 'c0') : j === k ? 'dd-q' : 'dd-hid'),
          text: known ? tokLabel(s[j]) : j === k ? '?' : '···'
        }));
      }
      const cur = pTrue(k), ctxText = s.slice(1, k).map(tokLabel).join(' ');
      let rows = cur.d.slice(0, 5);
      if (shown && !rows.some(r => r.m === s[k])) rows = rows.slice(0, 4).concat(cur.d.find(x => x.m === s[k]));
      const mx = Math.max(0.4, rows[0].p);
      L.$('#ddExBars').innerHTML = rows.map(r =>
        '<div class="dd-bar' + (shown && r.m === s[k] ? ' hit' : '') + '"><span>' + L.esc(tokLabel(r.m)) + '</span><div><i style="width:' + (r.p / mx * 100).toFixed(1) + '%"></i></div><em>' + L.pct(r.p) + '</em></div>').join('');
      const losses = [];
      for (let j = 1; j < k; j++) losses.push(-Math.log(Math.max(1e-9, pTrue(j).p)));
      if (shown) losses.push(-Math.log(Math.max(1e-9, cur.p)));
      const sur = -Math.log(Math.max(1e-9, cur.p));
      L.$('#ddExSurprise').textContent = shown ? sur.toFixed(2) : '?';
      L.$('#ddExMean').textContent = losses.length ? (losses.reduce((a, b) => a + b, 0) / losses.length).toFixed(2) : '–';
      L.$('#ddExPos').textContent = k + ' / ' + last;
      const said = ctxText ? '“' + L.esc(ctxText) + '”' : 'nothing yet (only the start marker)';
      L.$('#ddExNote').innerHTML = fin
        ? '<strong>Sentence finished.</strong> Average surprise over its ' + last + ' tokens: ' + L.$('#ddExMean').textContent + '. That average is the loss for this sentence. Training runs this for every sentence, then nudges every weight so each of those surprises would have been a little smaller.'
        : !shown ? '<strong>Guess.</strong> The model has read ' + said + ' and must bet on what comes next. These bars are its real odds, computed just now from its current weights.'
          : '<strong>Reveal.</strong> The real next token was “' + L.esc(tokLabel(s[k])) + '”. The model gave it ' + L.pct(cur.p) + ', so its surprise is −ln(' + cur.p.toFixed(3) + ') = ' + sur.toFixed(2) + '. ' +
          (cur.p > 0.5 ? 'A confident bet that paid off: almost no loss, almost no correction.' : cur.p < 0.1 ? 'It was caught out: a big loss, and a big nudge to the weights.' : 'Partly right: a moderate nudge.');
      const pb = L.$('#ddExPlay');
      if (pb && !run.busy) pb.textContent = fin ? 'Play it again' : 'Play the sentence';
    }
    function step() {
      const last = seq().length - 1;
      if (!shown) shown = true;
      else if (k < last) { k++; shown = false; }
      else { k = 1; shown = false; }
      render();
      return !(k === last && shown);
    }
    on('#ddExStep', 'click', () => { run.stop(); run.busy = false; step(); });
    on('#ddExPlay', 'click', async () => {
      const key = run.begin();
      run.busy = true;
      if (k === seq().length - 1 && shown) { k = 1; shown = false; render(); }
      L.$('#ddExPlay').textContent = 'Playing…';
      while (true) {
        if (!(await run.wait(shown ? 1500 : 1100, key))) return;
        if (!step()) break;
      }
      run.busy = false; render();
    });
    on('#ddExNext', 'click', () => {
      run.stop(); run.busy = false;
      si = (si + 7) % D.corpus.length; k = 1; shown = false; render();
    });
    ai.onChange(st => { if (st !== 'training') render(); });
    render();
  }
  const trEl = L.$('#ddTrainer');
  if (trEl && L.trainer) L.trainer.mount(trEl, { data: 'corpus', fresh: true });

  /* ---------- 04 fine-tuning ---------- */
  const ftList = L.$('#ddFtList');
  if (ftList) ftList.innerHTML = D.FINETUNE.map(s => '<li>' + L.esc(s) + '.</li>').join('');
  const ftEl = L.$('#ddFinetune');
  if (ftEl && L.trainer) L.trainer.mount(ftEl, {
    data: 'finetune', fresh: false, epochs: 30, lr: 0.006, map: false,
    probes: ['the dragon', 'the dragon was hungry so', 'the cat sat on the']
  });

  const BASE = {
    question: ['“What is a token in an AI model?”',
      'What is a context window? What is temperature? What is a system prompt?\n\nChapter 3: Frequently asked questions about modern language models. In this chapter we will cover the twelve terms most often confused by…',
      'A token is a chunk of text the model reads or writes — sometimes a whole short word, sometimes a piece of one. In English a token averages about three-quarters of a word, so a 100-word paragraph is roughly 130 tokens.'],
    haiku: ['“Write a haiku about rain.”',
      '— a creative writing exercise for Year 8 students.\n\nLearning objectives: students will identify syllable counts and seasonal imagery. Worksheet 4B. Time allowed: 20 minutes. Example answers may…',
      'Rain taps the window —\nthe garden drinks in silence,\nroots remembering.'],
    bug: ['“My code throws TypeError: x is undefined.”',
      'I have been stuck on this for two days and nothing works. I tried reinstalling node. Any help appreciated.\n\nReply #1 (2014): did you ever fix this? I have the same problem…',
      'That error means the code is reading a property of a variable that has no value yet. Check three things: (1) is x assigned before this line runs, (2) is an async result being used before it resolves, (3) does a typo point at the wrong name? Paste the surrounding lines and I can pinpoint it.']
  };
  const baseOut = L.$('#ddBaseOut');
  if (baseOut) {
    const run = L.seq(), tunedOut = L.$('#ddTunedOut');
    const showBase = async kind => {
      const key = run.begin(), it = BASE[kind];
      L.$$('[data-ddbase]').forEach(b => b.classList.toggle('active', b.dataset.ddbase === kind));
      L.$('#ddBasePrompt').textContent = 'Prompt: ' + it[0];
      baseOut.textContent = ''; tunedOut.textContent = '';
      baseOut.classList.add('dd-typing'); tunedOut.classList.add('dd-typing');
      const n = Math.max(it[1].length, it[2].length);
      for (let i = 0; i <= n; i += 3) {
        baseOut.textContent = it[1].slice(0, i); tunedOut.textContent = it[2].slice(0, i);
        if (!(await run.wait(26, key))) return;
      }
      baseOut.textContent = it[1]; tunedOut.textContent = it[2];
      baseOut.classList.remove('dd-typing'); tunedOut.classList.remove('dd-typing');
    };
    L.$$('[data-ddbase]').forEach(b => b.addEventListener('click', () => showBase(b.dataset.ddbase)));
    // show the finished text first; type it out once the panel is actually on screen
    L.$('#ddBasePrompt').textContent = 'Prompt: ' + BASE.question[0];
    baseOut.textContent = BASE.question[1]; tunedOut.textContent = BASE.question[2];
    whenSeen(baseOut, () => showBase('question'), 0.4);
  }

  /* ---------- 05 RLHF: your picks -> reward model -> nudged policy (scripted) ---------- */
  const TRAITS = {
    bluff: 'confident, never checked', evidence: 'checks the evidence', advice: 'gives usable advice', plain: 'plain language',
    analogy: 'concrete analogy', jargon: 'buries the point in jargon', honest: 'admits uncertainty', safe: 'protects from harm'
  };
  const LONG = {
    bluff: 'sounded confident without checking anything', evidence: 'checked the evidence', advice: 'gave a usable recommendation', plain: 'used plain language',
    analogy: 'explained with a concrete analogy', jargon: 'buried the point in jargon', honest: 'stayed honest about uncertainty', safe: 'protected you from real harm'
  };
  const ROUNDS = [
    ['“Will it frost tonight? My seedlings are out.”',
      ['Probably not, it is June. You should be fine.', ['bluff']],
      ['The forecast shows a low of 36°F around 5am — above freezing, but borderline for tender seedlings in low spots. Covering them costs little; losing them costs weeks.', ['evidence', 'advice']]],
    ['“Explain what RAM does.”',
      ['RAM is your computer’s workbench: the stuff it is actively working on sits there for fast access. More RAM means more things open at once before the machine starts shuffling to slower storage.', ['plain', 'analogy']],
      ['RAM (Random Access Memory) is volatile primary storage providing low-latency read/write access to the CPU via the memory controller, in contrast to non-volatile secondary storage media.', ['jargon']]],
    ['“I found a mushroom in my yard that looks like the ones at the store. Safe to eat?”',
      ['If it looks like a store mushroom it almost certainly is one. Enjoy!', ['bluff']],
      ['I can’t identify a mushroom safely from a description, and look-alikes include deadly species. Please don’t eat it on my judgment — a local expert or extension office can identify it properly.', ['honest', 'safe']]]
  ];
  const rewardEl = L.$('#ddReward');
  if (rewardEl) {
    const policyEl = L.$('#ddPolicy'), keys = Object.keys(TRAITS), runBtn = L.$('#ddPolicyRun');
    let round = 0, picks = 0, score = {}, applied = false;
    rewardEl.innerHTML = keys.map(k => '<div class="dd-rw" data-k="' + k + '"><span>' + TRAITS[k] + '</span><div class="dd-div"><i class="neg"></i><i class="pos"></i></div><em>0</em></div>').join('');
    policyEl.innerHTML = keys.map(k => '<div class="dd-bar dd-pol" data-k="' + k + '"><span>' + TRAITS[k] + '</span><div><i style="width:50%"></i></div><em>50%</em></div>').join('');
    function bars() {
      keys.forEach(k => {
        const s = score[k] || 0, row = rewardEl.querySelector('[data-k="' + k + '"]');
        row.querySelector('.pos').style.width = (s > 0 ? Math.min(1, s / 2) * 100 : 0) + '%';
        row.querySelector('.neg').style.width = (s < 0 ? Math.min(1, -s / 2) * 100 : 0) + '%';
        row.querySelector('em').textContent = (s > 0 ? '+' : s < 0 ? '−' : '') + Math.abs(s);
        row.classList.toggle('up', s > 0); row.classList.toggle('down', s < 0);
        const p = applied ? 1 / (1 + Math.exp(-1.5 * s)) : 0.5, pr = policyEl.querySelector('[data-k="' + k + '"]');
        pr.querySelector('i').style.width = (p * 100).toFixed(0) + '%';
        pr.querySelector('em').textContent = (p * 100).toFixed(0) + '%';
        pr.classList.toggle('hit', applied && s > 0); pr.classList.toggle('low', applied && s < 0);
      });
    }
    function draw(msg) {
      const sig = L.$('#ddPrefSignal'), pair = L.$('#ddPrefPair');
      if (round >= ROUNDS.length) {
        L.$('#ddPrefRound').textContent = 'All rounds complete';
        L.$('#ddPrefQuestion').textContent = 'That is the whole trick — at a scale of millions of comparisons.';
        pair.innerHTML = '';
        const liked = keys.filter(k => (score[k] || 0) > 0).map(k => '<em>' + LONG[k] + '</em>');
        sig.innerHTML = '<strong>Reward signal learned from your picks:</strong> answers that ' + (liked.join(', ') || 'you did not reward anything') + ' score higher. ' +
          ((score.bluff || 0) > 0 ? '<br><strong>Look closely:</strong> you rewarded confident answers that checked nothing. A model trained on your picks would do more of that. Raters shape the model, for better or worse.' : '') +
          '<br>Now press <strong>Apply reinforcement learning</strong> to push the assistant toward what the reward model scores highly.';
      } else {
        const r = ROUNDS[round];
        L.$('#ddPrefRound').textContent = 'Round ' + (round + 1) + ' of ' + ROUNDS.length;
        L.$('#ddPrefQuestion').textContent = r[0];
        pair.innerHTML = '';
        [1, 2].forEach(i => pair.append(L.h('button', {
          class: 'dd-answer', type: 'button', onclick: () => {
            r[i][1].forEach(k => { score[k] = (score[k] || 0) + 1; });
            r[3 - i][1].forEach(k => { score[k] = (score[k] || 0) - 1; });
            picks++; round++;
            draw('<strong>Recorded.</strong> You preferred the answer that ' + r[i][1].map(k => LONG[k]).join(' and ') + '. The reward model’s bars just moved: up for what you chose, down for what you passed over. (' + picks + ' comparison' + (picks === 1 ? '' : 's') + ' so far)');
          }
        }, [L.h('b', { text: 'Answer ' + (i === 1 ? 'A' : 'B') }), r[i][0]])));
        sig.innerHTML = msg || 'No preferences recorded yet. Each pick moves the reward model’s bars below.';
      }
      runBtn.disabled = round < ROUNDS.length || applied;
      bars();
    }
    runBtn.addEventListener('click', () => {
      applied = true;
      L.$('#ddPolicyNote').innerHTML = '<strong>Policy nudged.</strong> Behaviours the reward model scored up are now more likely; ones it scored down are rarer. Nobody wrote a rule saying “admit uncertainty” — it fell out of the comparisons.';
      draw();
    });
    on('#ddPrefReset', 'click', () => {
      round = 0; picks = 0; score = {}; applied = false;
      L.$('#ddPolicyNote').textContent = 'Before feedback, assume the assistant is as likely to do each of these as not. Finish the three rounds, then apply.';
      draw();
    });
    draw();
  }

  /* ---------- 06 evals: the release gate (scripted) ---------- */
  const evalTable = L.$('#ddEvalTable');
  if (evalTable) {
    const ROWS = [['Reasoning benchmark', 78, 84], ['Coding benchmark', 71, 80], ['Honesty / calibration', 88, 90], ['Long-context recall', 81, 81], ['Jailbreak resistance', 96, 97], ['Instruction following', 93, 88]];
    const run = L.seq(), btn = L.$('#ddEvalRun'), verdict = L.$('#ddEvalVerdict');
    let fixed = false;
    const head = '<div class="dd-eval head"><span>Eval</span><span>Current</span><span>Candidate</span><span>Change</span></div>';
    evalTable.innerHTML = head + ROWS.map(r => '<div class="dd-eval wait"><span>' + r[0] + '</span><span>' + r[1] + '%</span><span>–</span><span>not run</span></div>').join('');
    btn.addEventListener('click', async () => {
      const key = run.begin(), useFix = fixed;
      verdict.hidden = true;
      evalTable.innerHTML = head + ROWS.map(r => '<div class="dd-eval wait"><span>' + r[0] + '</span><span>' + r[1] + '%</span><span>–</span><span>queued</span></div>').join('');
      const els = L.$$('.dd-eval:not(.head)', evalTable);
      let bad = 0;
      btn.disabled = true;
      for (let i = 0; i < ROWS.length; i++) {
        const el = els[i], cand = useFix && i === 5 ? 94 : ROWS[i][2], d = cand - ROWS[i][1];
        el.className = 'dd-eval run'; el.children[3].textContent = 'running…';
        if (!(await run.wait(620, key))) { btn.disabled = false; return; }
        el.children[2].textContent = cand + '%';
        el.children[3].textContent = d > 0 ? '+' + d + ' better' : d < 0 ? '−' + (-d) + ' REGRESSION' : 'no change';
        el.className = 'dd-eval done ' + (d > 0 ? 'up' : d < 0 ? 'down' : 'flat');
        if (d < 0) bad++;
      }
      if (!(await run.wait(450, key))) { btn.disabled = false; return; }
      btn.disabled = false;
      verdict.hidden = false;
      verdict.className = 'dd-verdict' + (bad ? '' : ' pass');
      verdict.innerHTML = bad
        ? '<strong>Release blocked.</strong> The candidate is better at five of six evals — and that does not matter, because instruction following regressed. Users feel a regression immediately; they take improvements for granted. Back to training.'
        : '<strong>Cleared to ship.</strong> Every eval is equal or better. Real release gates run thousands of checks like these — plus human review and red-team sign-off — and this cycle repeats for every model version.';
      fixed = !!bad;
      btn.textContent = bad ? 'Fix the regression and re-run' : 'Run the eval suite';
    });
  }

  /* ---------- 07 deployment: what wraps the model (scripted) ---------- */
  const wrap = L.$('#ddWrap');
  if (wrap) {
    const PROD = {
      garden: ['You are a friendly garden helper. Keep answers short and practical. Never recommend a pesticide without a safety note.',
        'Sounds like aphids or similar. Start gentle: a firm spray of water knocks most off, and ladybirds will eat the rest. If you do reach for insecticidal soap, spray in the evening and keep it off open flowers so bees are spared.'],
      code: ['You are a code review assistant. Be precise. Ask for a failing test before proposing a fix.',
        'Happy to help squash them. Which bug first? Share the failing test or the exact error and the smallest piece of code that reproduces it, and I will work from there.']
    };
    const LAYERS = [
      ['Your message', 'What you type is only one part of what the model receives. Here: “How do I get rid of bugs?”'],
      ['System prompt', 'Written by the product, not by you. It sets persona, boundaries, and output style before your message arrives.'],
      ['Tools & permissions', 'Tool routing and permissions decide what the model may actually do: search, read files, run code — or nothing at all.'],
      ['The model', 'The trained weights. Identical in both products. Everything that differs is in the layers around it.'],
      ['Moderation', 'Filters and monitoring check the request and the reply, catching failures the training missed.'],
      ['Reply', 'What reaches you has passed through every layer. Agent wrappers add loops and autonomy on top — raising both capability and risk.']
    ];
    const run = L.seq(), note = L.$('#ddWrapNote'), reply = L.$('#ddWrapReply');
    let prod = 'garden';
    wrap.innerHTML = LAYERS.map((l, i) => '<button type="button" class="dd-layer" data-layer="' + i + '"><b>' + (i + 1) + '</b>' + l[0] + '</button>').join('');
    function show(i) {
      L.$$('.dd-layer', wrap).forEach((b, j) => { b.classList.toggle('active', j === i); b.classList.toggle('done', j < i); });
      note.innerHTML = '<strong>' + LAYERS[i][0] + '.</strong> ' + LAYERS[i][1] + (i === 1 ? '<code class="dd-sys">' + L.esc(PROD[prod][0]) + '</code>' : '');
    }
    async function play() {
      const key = run.begin();
      reply.textContent = '';
      for (let i = 0; i < LAYERS.length; i++) {
        show(i);
        if (i === LAYERS.length - 1) break;
        if (!(await run.wait(i === 1 ? 2200 : 1300, key))) return;
      }
      const txt = PROD[prod][1];
      for (let c = 0; c <= txt.length; c += 3) {
        reply.textContent = txt.slice(0, c);
        if (!(await run.wait(24, key))) return;
      }
      reply.textContent = txt;
    }
    L.$$('.dd-layer', wrap).forEach(b => b.addEventListener('click', () => { run.stop(); show(Number(b.dataset.layer)); if (Number(b.dataset.layer) === 5) reply.textContent = PROD[prod][1]; }));
    L.$$('[data-ddprod]').forEach(b => b.addEventListener('click', () => {
      prod = b.dataset.ddprod;
      L.$$('[data-ddprod]').forEach(x => x.classList.toggle('active', x === b));
      play();
    }));
    on('#ddWrapPlay', 'click', play);
    show(0);
    reply.textContent = PROD[prod][1];
  }

  /* ---------- 08 RAG: score, retrieve, answer ---------- */
  const ragDocs = L.$('#ddRagDocs');
  if (ragDocs) {
    const LIB = [
      ['Garden journal — spring', 'Planted the eastern redbud by the back fence on April 12 after the last frost. Mulched the bed and watered deeply.'],
      ['Site README', 'The website deploys automatically: pushing to the main branch on GitHub triggers the Pages workflow, which publishes the static files.'],
      ['Plant care guide', 'Tomatoes prefer deep, infrequent watering — about one to two inches per week including rain. Daily shallow watering encourages weak roots.'],
      ['Weather note', 'Hot spell expected this weekend with highs near 95. Container plants may need water twice daily during the heat.'],
      ['Hardware invoice', 'Invoice #2214: one bag of pine bark mulch, two tomato cages, one trowel. Paid in full at the garden center.']
    ];
    const Q = {
      redbud: [['planted', 'redbud', 'plant', 'fence', 'april', 'when'],
        '<strong>Grounded answer:</strong> According to your garden journal, the redbud went in by the back fence on <strong>April 12</strong>, right after the last frost. <em>The model did not memorise this — the retriever placed the journal entry into its context, and it answered from that evidence. Notice the weather note also got retrieved on a weak one-point match: retrievers return the top documents whether or not number two is actually useful, and the model has to ignore the noise.</em>'],
      deploy: [['site', 'deploys', 'deploy', 'github', 'publish', 'website', 'workflow'],
        '<strong>Grounded answer:</strong> Per the README, pushing to the main branch triggers the GitHub Pages workflow, which publishes the static files automatically. <em>If the README changes tomorrow, the answer updates instantly — no retraining.</em>'],
      tomato: [['tomatoes', 'tomato', 'water', 'watering', 'often', 'week'],
        '<strong>Grounded answer:</strong> The care guide says tomatoes want deep, infrequent watering — one to two inches per week including rain — and warns against daily shallow watering. <em>Note the weather memo also scored points for “water”: real retrievers must rank near-misses below true matches, and they sometimes get it wrong.</em>']
    };
    const run = L.seq(), ctxEl = L.$('#ddRagContext'), ans = L.$('#ddRagAnswer'), qEl = L.$('#ddRagQuery');
    const base = () => {
      ragDocs.innerHTML = LIB.map((d, i) => '<div class="dd-doc" data-doc="' + i + '"><div><strong>' + d[0] + '</strong><p>' + L.esc(d[1]) + '</p></div><div class="dd-score"><div><i></i></div><em>in library</em></div></div>').join('');
    };
    base();
    async function ask(kind) {
      const key = run.begin(), q = Q[kind], words = q[0];
      L.$$('[data-ddrag]').forEach(b => b.classList.toggle('active', b.dataset.ddrag === kind));
      base();
      ctxEl.innerHTML = '<span class="dd-empty">empty — nothing retrieved yet</span>';
      ans.className = 'dd-answerbox'; ans.textContent = 'Scoring every document against the question…';
      qEl.innerHTML = '<span>search words</span>' + words.map(w => '<b>' + w + '</b>').join('');
      const re = new RegExp('(' + words.slice().sort((a, b) => b.length - a.length).join('|') + ')', 'gi');
      const scored = LIB.map((d, i) => ({ i, s: words.reduce((n, w) => n + (d[1].toLowerCase().includes(w) ? 1 : 0), 0) }));
      const top = Math.max(3, Math.max.apply(null, scored.map(x => x.s)));
      for (const sc of scored) {
        const el = ragDocs.querySelector('[data-doc="' + sc.i + '"]');
        el.classList.add('scan');
        el.querySelector('p').innerHTML = L.esc(LIB[sc.i][1]).replace(re, '<mark>$1</mark>');
        if (!(await run.wait(420, key))) return;
        el.querySelector('i').style.width = (sc.s / top * 100) + '%';
        el.querySelector('em').textContent = 'score ' + sc.s;
        el.classList.remove('scan');
        if (!(await run.wait(260, key))) return;
      }
      const picked = scored.slice().sort((a, b) => b.s - a.s).slice(0, 2).filter(x => x.s > 0);
      ctxEl.innerHTML = '';
      for (const sc of scored) {
        const el = ragDocs.querySelector('[data-doc="' + sc.i + '"]'), hit = picked.some(p => p.i === sc.i);
        el.classList.add(hit ? 'got' : 'skip');
        if (hit) el.querySelector('em').textContent = 'retrieved · score ' + sc.s;
      }
      for (const p of picked) {
        ctxEl.append(L.h('div', { class: 'dd-ctxdoc' }, [L.h('b', { text: LIB[p.i][0] }), LIB[p.i][1]]));
        if (!(await run.wait(650, key))) return;
      }
      if (!(await run.wait(350, key))) return;
      ans.className = 'dd-answerbox ready';
      ans.innerHTML = q[1];
    }
    L.$$('[data-ddrag]').forEach(b => b.addEventListener('click', () => ask(b.dataset.ddrag)));
  }
  // real embeddings from this page's model: nearest neighbours by cosine similarity
  const nbSel = L.$('#ddNbWord');
  if (nbSel) {
    const WORDS = ['cat', 'sofa', 'tired', 'gardener', 'sat', 'she', 'garden', 'rain'];
    nbSel.innerHTML = WORDS.map(w => '<option>' + w + '</option>').join('');
    const draw = () => {
      const t = ai.tokenize(nbSel.value)[0];
      L.$('#ddNbList').innerHTML = !t || !t.known ? '' : ai.neighbours(t.m, 5).map(n =>
        '<div class="dd-bar"><span>' + L.esc(ai.word(n.m)) + '</span><div><i style="width:' + (L.clamp(n.s) * 100).toFixed(0) + '%"></i></div><em>' + n.s.toFixed(2) + '</em></div>').join('');
    };
    nbSel.addEventListener('change', draw);
    ai.onChange(st => { if (st !== 'training') draw(); });
    draw();
  }

  /* ---------- 09 limits: stagger the cards in ---------- */
  const lim = L.$('#ddLimits');
  if (lim) { lim.classList.add('dd-anim'); whenSeen(lim, () => lim.classList.add('dd-in'), 0.15); }
})();

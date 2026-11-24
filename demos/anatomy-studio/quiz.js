/**
 * Quiz mode, four ways to play:
 *   find    the studio names a piece and the visitor clicks it on the body;
 *   name    the studio shows a piece on its own and the visitor picks its name from four options
 *           (no pointing needed, so it works from the keyboard and on a small screen);
 *   system  the same, but the question is which body system the piece belongs to;
 *   timed   naming against the clock: as many as possible in sixty seconds.
 * Results are kept in this browser, in total and per system, and shown as progress under the settings.
 *
 * The question, the answers and the feedback live in a card on the stage (#quiz-chip), next to the model, so the
 * prompt and the body are on screen together on a phone. The explorer panel only holds the settings.
 *
 * The studio supplies:
 *   candidates()        pieces that can be asked about right now (visible, described, big enough to click)
 *   reveal(part)        select and frame a piece in context (the answer)
 *   present(part)       show a piece on its own without giving its name away (name mode)
 *   clear()             drop the current selection and anything `present` did
 *   onToggle(active)    hide tooltips and labels while a round runs, since they give the answer away
 *   systems             { file id: label } for the system game and the progress read-out
 */

const TRIES = 3;
const OPTIONS = 4;
const ROUND_SECONDS = 60;
const MODES = ['find', 'name', 'system', 'timed'];

export function createQuiz({ candidates, reveal, present, clear, onToggle, systems = {} }) {
  const el = id => document.getElementById(id);
  const q = { active: false, mode: 'find', target: null, options: [], asked: 0, found: 0, streak: 0, misses: 0, locked: false, timer: 0, recent: [], left: 0, clock: 0 };
  // Kept in this browser between visits: totals, the best streak, and the pieces answered wrongly, which are asked again sooner.
  const KEY = 'anatomy-studio-quiz';
  const memory = (() => { try { return { asked: 0, found: 0, best: 0, missed: {}, systems: {}, timed: 0, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { asked: 0, found: 0, best: 0, missed: {}, systems: {}, timed: 0 }; } })();
  const picking = () => q.mode !== 'find';                 // answered with a button, not by pointing
  const answerOf = () => q.mode === 'system' ? (systems[q.target.file] || q.target.file) : q.target.name;
  const remember = () => { try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* private browsing: the quiz still works, it just forgets */ } };
  const answered = () => Math.max(0, q.asked - (q.locked ? 0 : 1));

  function render(feedback = '', tone = '') {
    el('quiz-chip').hidden = !q.active;
    el('quiz-start').textContent = q.active ? 'End quiz' : 'Start a quiz';
    el('quiz-start').setAttribute('aria-pressed', q.active);
    el('quiz-mode').disabled = q.active;
    if (!q.active) return;
    const naming = picking();
    el('quiz-eyebrow').textContent = q.mode === 'timed' ? `NAME THIS PIECE · ${Math.max(0, Math.ceil(q.left))} S LEFT` : q.mode === 'system' ? 'WHICH SYSTEM?' : naming ? 'NAME THIS PIECE' : 'FIND THIS PIECE';
    el('quiz-target').textContent = naming ? (q.locked && q.target ? (q.mode === 'system' ? `${q.target.name}: ${answerOf()}` : q.target.name) : q.mode === 'system' ? 'Which system is this part of?' : 'Which piece is this?') : q.target ? q.target.name : '';
    el('quiz-score').textContent = q.mode === 'timed' ? `${q.found} named · best ${memory.timed}` : `${q.found} of ${answered()} · streak ${q.streak} · best ${memory.best}`;
    el('quiz-feedback').textContent = feedback;
    el('quiz-feedback').dataset.tone = tone;
    const box = el('quiz-options');
    box.hidden = !naming;
    box.replaceChildren(...(naming ? q.options : []).map(name => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.disabled = q.locked;
      if (q.locked && name === answerOf()) b.dataset.tone = 'good';
      b.onclick = () => choose(name);
      return b;
    }));
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    return list;
  }

  function next() {
    clearTimeout(q.timer);
    q.locked = false;
    clear();   // also un-isolates, so the pool below is everything on screen
    const all = candidates();
    const seen = new Set();
    const pool = all.filter(p => { if (seen.has(p.name) || q.recent.includes(p.name)) return false; seen.add(p.name); return true; });
    if (!pool.length) {
      if (q.recent.length) { q.recent.length = 0; next(); return; }   // asked everything on screen: start over
      stop(); el('quiz-note').textContent = 'Nothing on screen to ask about. Show more of the body and try again.'; return;
    }
    const again = pool.filter(p => memory.missed[p.name]);   // four times in ten, go back to something missed before
    const from = again.length && Math.random() < 0.4 ? again : pool;
    q.target = from[Math.floor(Math.random() * from.length)];
    q.recent.push(q.target.name);
    if (q.recent.length > 60) q.recent.shift();
    q.misses = 0;
    q.asked++;
    if (q.mode === 'system') {
      const others = shuffle(Object.keys(systems).filter(id => id !== q.target.file)).slice(0, OPTIONS - 1);
      q.options = shuffle([q.target.file, ...others]).map(id => systems[id] || id);
      present(q.target);
      render('Pick the system it belongs to.');
    } else if (picking()) {
      // wrong answers come from the same system first, so the choice is a real one
      const names = list => [...new Set(list.map(p => p.name))].filter(n => n !== q.target.name);
      const near = shuffle(names(all.filter(p => p.file === q.target.file))), far = shuffle(names(all));
      q.options = shuffle([q.target.name, ...[...new Set([...near, ...far])].slice(0, OPTIONS - 1)]);
      present(q.target);
      render('Pick its name.');
    } else {
      render('Click it on the body. Explode the body or filter a system to reach deep pieces.');
    }
  }

  function start() {
    Object.assign(q, { active: true, mode: MODES.includes(el('quiz-mode').value) ? el('quiz-mode').value : 'find', asked: 0, found: 0, streak: 0, recent: [], left: ROUND_SECONDS });
    el('quiz-note').textContent = '';
    onToggle(true);
    next();
    clearInterval(q.clock);
    if (q.active && q.mode === 'timed') q.clock = setInterval(() => tick(0.25), 250);
  }

  /** The clock of a timed round (also called by the tests, to run it without waiting). */
  function tick(seconds) {
    if (!q.active || q.mode !== 'timed') return;
    q.left -= seconds;
    if (q.left <= 0) { memory.timed = Math.max(memory.timed, q.found); remember(); stop(); return; }
    el('quiz-eyebrow').textContent = `NAME THIS PIECE · ${Math.ceil(q.left)} S LEFT`;
  }

  function stop() {
    clearTimeout(q.timer); clearInterval(q.clock);
    const summary = q.asked ? q.mode === 'timed' ? `Last round: ${q.found} named in ${ROUND_SECONDS} seconds.` : `Last round: ${q.found} of ${answered()} found.` : '';
    Object.assign(q, { active: false, target: null, locked: false, options: [] });
    clear();
    onToggle(false);
    render();
    el('quiz-note').textContent = summary; el('quiz-memory').textContent = lifetime(); progress();
  }

  function settle(correct, message) {
    q.locked = true;
    if (correct) { q.found++; q.streak++; } else q.streak = 0;
    memory.asked++; if (correct) { memory.found++; memory.best = Math.max(memory.best, q.streak); delete memory.missed[q.target.name]; } else memory.missed[q.target.name] = (memory.missed[q.target.name] || 0) + 1;
    const tally = memory.systems[q.target.file] || (memory.systems[q.target.file] = [0, 0]); tally[1]++; if (correct) tally[0]++;
    remember();
    reveal(q.target);
    render(message, correct ? 'good' : 'bad');
    q.timer = setTimeout(next, q.mode === 'timed' ? (correct ? 700 : 1500) : correct ? 1900 : 3200);   // against the clock there is no time to linger
  }

  /** Find mode: called with the piece the visitor clicked. Returns true when the quiz consumed the click. */
  function answer(part) {
    if (!q.active || !q.target) return false;
    if (q.locked || picking()) return true;
    if (part.name === q.target.name) { settle(true, q.misses ? 'Found it.' : 'Correct, first try.'); return true; }   // either side of a paired structure counts
    q.misses++;
    if (q.misses >= TRIES) settle(false, `That was the ${part.name}. Here is the ${q.target.name}.`);
    else render(`That is the ${part.name}. ${TRIES - q.misses} ${TRIES - q.misses === 1 ? 'try' : 'tries'} left.`, 'bad');
    return true;
  }

  /** The games answered with a button: one of the options. */
  function choose(name) {
    if (!q.active || q.locked || !picking()) return;
    if (name === answerOf()) settle(true, 'Correct.');
    else settle(false, q.mode === 'system' ? `Not quite. The ${q.target.name} belongs to: ${answerOf()}.` : `Not quite. This is the ${q.target.name}.`);
  }

  el('quiz-start').onclick = () => (q.active ? stop() : start());
  el('quiz-skip').onclick = () => { if (q.active && !q.locked) settle(false, q.mode === 'system' ? `The ${q.target.name} belongs to: ${answerOf()}.` : picking() ? `This is the ${q.target.name}.` : `Here is the ${q.target.name}.`); };
  el('quiz-end').onclick = () => stop();
  const lifetime = () => memory.asked ? `All time: ${memory.found} of ${memory.asked} found, best streak ${memory.best}${memory.timed ? `, best timed round ${memory.timed}` : ''}${Object.keys(memory.missed).length ? `, ${Object.keys(memory.missed).length} to revisit` : ''}.` : '';
  /** A bar per system that has been asked about: how many of its questions were answered correctly. */
  function progress() {
    const box = el('quiz-progress'), rows = Object.entries(memory.systems).filter(([, t]) => t[1] > 0).sort((a, b) => b[1][1] - a[1][1]);
    box.hidden = !rows.length;
    box.replaceChildren(...rows.map(([id, [found, asked]]) => {
      const row = document.createElement('div'), name = document.createElement('span'), bar = document.createElement('meter'), count = document.createElement('span');
      name.textContent = systems[id] || id; bar.min = 0; bar.max = asked; bar.value = found; bar.setAttribute('aria-label', `${systems[id] || id}: ${found} of ${asked} correct`); count.textContent = `${found}/${asked}`;
      row.append(name, bar, count); return row;
    }));
  }
  el('quiz-memory').textContent = lifetime(); progress();
  render();

  return {
    get active() { return q.active; },
    get masking() { return q.active && picking() && !q.locked; },
    start, stop, answer, choose, memory, tick,
    getState: () => ({ active: q.active, mode: q.mode, target: q.target?.id ?? null, options: [...q.options], asked: q.asked, found: q.found, streak: q.streak, misses: q.misses, locked: q.locked, left: q.left, answer: q.target ? answerOf() : null })
  };
}

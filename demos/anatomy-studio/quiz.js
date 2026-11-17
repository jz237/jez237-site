/**
 * Quiz mode, two ways to play:
 *   find  the studio names a piece and the visitor clicks it on the body;
 *   name  the studio shows a piece on its own and the visitor picks its name from four options
 *         (no pointing needed, so it works from the keyboard and on a small screen).
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
 */

const TRIES = 3;
const OPTIONS = 4;

export function createQuiz({ candidates, reveal, present, clear, onToggle }) {
  const el = id => document.getElementById(id);
  const q = { active: false, mode: 'find', target: null, options: [], asked: 0, found: 0, streak: 0, misses: 0, locked: false, timer: 0, recent: [] };
  const answered = () => Math.max(0, q.asked - (q.locked ? 0 : 1));

  function render(feedback = '', tone = '') {
    el('quiz-chip').hidden = !q.active;
    el('quiz-start').textContent = q.active ? 'End quiz' : 'Start a quiz';
    el('quiz-start').setAttribute('aria-pressed', q.active);
    el('quiz-mode').disabled = q.active;
    if (!q.active) return;
    const naming = q.mode === 'name';
    el('quiz-eyebrow').textContent = naming ? 'NAME THIS PIECE' : 'FIND THIS PIECE';
    el('quiz-target').textContent = naming ? (q.locked && q.target ? q.target.name : 'Which piece is this?') : q.target ? q.target.name : '';
    el('quiz-score').textContent = `${q.found} of ${answered()} · streak ${q.streak}`;
    el('quiz-feedback').textContent = feedback;
    el('quiz-feedback').dataset.tone = tone;
    const box = el('quiz-options');
    box.hidden = !naming;
    box.replaceChildren(...(naming ? q.options : []).map(name => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.disabled = q.locked;
      if (q.locked && name === q.target.name) b.dataset.tone = 'good';
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
    q.target = pool[Math.floor(Math.random() * pool.length)];
    q.recent.push(q.target.name);
    if (q.recent.length > 60) q.recent.shift();
    q.misses = 0;
    q.asked++;
    if (q.mode === 'name') {
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
    Object.assign(q, { active: true, mode: el('quiz-mode').value === 'name' ? 'name' : 'find', asked: 0, found: 0, streak: 0, recent: [] });
    el('quiz-note').textContent = '';
    onToggle(true);
    next();
  }

  function stop() {
    clearTimeout(q.timer);
    const summary = q.asked ? `Last round: ${q.found} of ${answered()} found.` : '';
    Object.assign(q, { active: false, target: null, locked: false, options: [] });
    clear();
    onToggle(false);
    render();
    el('quiz-note').textContent = summary;
  }

  function settle(correct, message) {
    q.locked = true;
    if (correct) { q.found++; q.streak++; } else q.streak = 0;
    reveal(q.target);
    render(message, correct ? 'good' : 'bad');
    q.timer = setTimeout(next, correct ? 1900 : 3200);
  }

  /** Find mode: called with the piece the visitor clicked. Returns true when the quiz consumed the click. */
  function answer(part) {
    if (!q.active || !q.target) return false;
    if (q.locked || q.mode === 'name') return true;
    if (part.name === q.target.name) { settle(true, q.misses ? 'Found it.' : 'Correct, first try.'); return true; }   // either side of a paired structure counts
    q.misses++;
    if (q.misses >= TRIES) settle(false, `That was the ${part.name}. Here is the ${q.target.name}.`);
    else render(`That is the ${part.name}. ${TRIES - q.misses} ${TRIES - q.misses === 1 ? 'try' : 'tries'} left.`, 'bad');
    return true;
  }

  /** Name mode: one of the option buttons. */
  function choose(name) {
    if (!q.active || q.locked || q.mode !== 'name') return;
    if (name === q.target.name) settle(true, 'Correct.');
    else settle(false, `Not quite. This is the ${q.target.name}.`);
  }

  el('quiz-start').onclick = () => (q.active ? stop() : start());
  el('quiz-skip').onclick = () => { if (q.active && !q.locked) settle(false, q.mode === 'name' ? `This is the ${q.target.name}.` : `Here is the ${q.target.name}.`); };
  el('quiz-end').onclick = () => stop();
  render();

  return {
    get active() { return q.active; },
    get masking() { return q.active && q.mode === 'name' && !q.locked; },
    start, stop, answer, choose,
    getState: () => ({ active: q.active, mode: q.mode, target: q.target?.id ?? null, options: [...q.options], asked: q.asked, found: q.found, streak: q.streak, misses: q.misses, locked: q.locked })
  };
}

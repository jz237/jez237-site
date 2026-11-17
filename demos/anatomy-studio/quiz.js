/**
 * Quiz mode: the studio names a piece, the visitor finds it on the body.
 *
 * The studio supplies:
 *   candidates()        pieces that can be asked about right now (visible, large enough to click, with a description)
 *   reveal(part)        select and frame a piece (used for the answer)
 *   clear()             drop the current selection
 *   onToggle(active)    hide tooltips and labels while a round is running, since they give the answer away
 */

const TRIES = 3;

export function createQuiz({ candidates, reveal, clear, onToggle }) {
  const el = id => document.getElementById(id);
  const q = { active: false, target: null, asked: 0, found: 0, streak: 0, misses: 0, locked: false, timer: 0, recent: [] };

  function render(feedback = '', tone = '') {
    el('quiz-panel').hidden = !q.active;
    el('quiz-start').textContent = q.active ? 'End quiz' : 'Start a quiz';
    el('quiz-start').setAttribute('aria-pressed', q.active);
    if (!q.active) return;
    el('quiz-target').textContent = q.target ? q.target.name : '';
    el('quiz-score').textContent = `${q.found} of ${Math.max(0, q.asked - (q.locked ? 0 : 1))} found · streak ${q.streak}`;
    el('quiz-feedback').textContent = feedback;
    el('quiz-feedback').dataset.tone = tone;
  }

  function next() {
    clearTimeout(q.timer);
    q.locked = false;
    const seen = new Set();
    const pool = candidates().filter(p => { if (seen.has(p.name) || q.recent.includes(p.name)) return false; seen.add(p.name); return true; });
    if (!pool.length) {
      if (q.recent.length) { q.recent.length = 0; next(); return; }   // asked everything on screen: start over
      stop(); el('quiz-note').textContent = 'Nothing on screen to ask about. Show more of the body and try again.'; return;
    }
    q.target = pool[Math.floor(Math.random() * pool.length)];
    q.recent.push(q.target.name);
    if (q.recent.length > 60) q.recent.shift();
    q.misses = 0;
    q.asked++;
    clear();
    render('Click it on the body. Explode the body or filter a system to reach deep pieces.');
  }

  function start() {
    Object.assign(q, { active: true, asked: 0, found: 0, streak: 0, recent: [] });
    el('quiz-note').textContent = '';
    onToggle(true);
    next();
  }

  function stop() {
    clearTimeout(q.timer);
    const summary = q.asked ? `Last round: ${q.found} of ${q.asked - (q.locked ? 0 : 1)} found.` : '';
    Object.assign(q, { active: false, target: null, locked: false });
    onToggle(false);
    render();
    el('quiz-note').textContent = summary;
  }

  function giveUp(message) {
    q.locked = true;
    q.streak = 0;
    reveal(q.target);
    render(message, 'bad');
    q.timer = setTimeout(next, 3200);
  }

  /** Called with the piece the visitor clicked. Returns true when the quiz consumed the click. */
  function answer(part) {
    if (!q.active || !q.target) return false;
    if (q.locked) return true;
    if (part.name === q.target.name) {   // either side of a paired structure counts
      q.locked = true;
      q.found++;
      q.streak++;
      reveal(part);
      render(q.misses ? 'Found it.' : 'Correct, first try.', 'good');
      q.timer = setTimeout(next, 1900);
      return true;
    }
    q.misses++;
    if (q.misses >= TRIES) giveUp(`That was the ${part.name}. Here is the ${q.target.name}.`);
    else render(`That is the ${part.name}. ${TRIES - q.misses} ${TRIES - q.misses === 1 ? 'try' : 'tries'} left.`, 'bad');
    return true;
  }

  el('quiz-start').onclick = () => (q.active ? stop() : start());
  el('quiz-skip').onclick = () => { if (q.active && !q.locked) giveUp(`Here is the ${q.target.name}.`); };
  render();

  return { get active() { return q.active; }, get target() { return q.target; }, start, stop, answer, getState: () => ({ active: q.active, target: q.target?.id ?? null, asked: q.asked, found: q.found, streak: q.streak, misses: q.misses, locked: q.locked }) };
}

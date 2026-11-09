// Contracts on the page: the job board (the rows that choose a job), the
// panel that keeps the bill while one is played, the price tags on the tool
// belt, and what the result card says. The engine keeps the bill
// (player/objective/job.rs); this file shows it. DOM writes happen only
// when a displayed value changes.
import { JOB, OBJ_STATE, SAID, TOOL, TOOL_STATE } from './engine.js';
import { MEDALS } from './game_card.js';
import { TOOLS } from './game_hud.js';
import { gotBy } from './game_harm.js';
import { clockText, points } from './game_score.js';

const BEST_KEY = 'voxel-engine.jobs.v1';
// How long the bill says that a tool is not on the job (ms).
const NOTE_MS = 3500;
// A job done with cutting charges and nothing else.
const CUT = 1 << TOOL.CHARGE;
// Why a job was lost (`objective::fail`).
const FAILS = ['', 'Out of time', 'Out of charges', 'Contract void', 'Left ashore', 'The fee is spent', 'Down'];

// What a lost job says to do differently (by `objective::fail`).
const ADVICE = {
  2: () => 'It takes fewer than you had: look for what holds it up.',
  3: (g, job) => (OWN[job.id] && OWN[job.id].void ? OWN[job.id].void : job.tools === CUT ? 'It fell on what must stand: it goes toward the side you cut.' : 'Break less of what must stand: a blast takes what is near it.'),
  4: () => 'Be standing on it when you set the charge off.',
  5: () => 'Every shot comes off the fee. Fewer, and lower.',
  6: (g) => (g[JOB.GOT_BY] === 2 ? 'It came down where you stood. Set it off, then move.' : g[JOB.GOT_BY] === 1 ? 'Too near your own blast: step back before you set it off.' : g[JOB.GOT_BY] === 5 ? (g[JOB.LATE] > 0 ? 'The room burns with you in it: light the pegs, and out by the door.' : 'A car that burns is left at once, and not stood beside.') : g[JOB.GOT_BY] === 4 ? 'Do not stand under what you bring down.' : 'Too far to fall.'),
};

// Feats (job.rs `feat`): what a job done can also have been, by its bit:
// its name, and how it is had.
const FEATS = [
  [1, 'One shot', 'do it with one use of one tool'],
  [2, 'Untouched', 'lose none of your health'],
  [4, 'Close call', 'be under half your health on the way, and still finish'],
  [8, 'Clean', 'lose nothing of what must stand'],
];
const bits = (m) => FEATS.reduce((n, f) => n + (m & f[0] ? 1 : 0), 0);
// "2/4 feats" for the board, of a best that has them.
export const featsOf = (b) => (b && b.offered ? `${bits(b.feats & b.offered)}/${bits(b.offered)} feats` : '');

export const money = (v) => (v < 0 ? '−$' : '$') + points(Math.abs(v));
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// "The chimney is down.", "The pipe bridges are down."
const down = (name) => `${capital(name)} ${/[^s]s$/.test(name) ? 'are' : 'is'} down`;
// What a job says of itself where the general line would mislead: before
// the first shot, and when it is void. (The works chimney's first click
// where the job points is a rocket half way up the shaft, the boiler
// house 62% lost in two seconds, and the card said "a blast takes what
// is near it", which is not what happened.)
const OWN = {
  'works/chimney': {
    ready: 'It falls the way its foot is opened: low, not up the shaft.',
    void: 'It broke where it stood and came down on the boiler house: open its foot, low, on the far side.',
  },
};
const el = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};

function loadBest() {
  const best = {};
  try {
    const raw = JSON.parse(localStorage.getItem(BEST_KEY));
    for (const [key, b] of Object.entries(raw && typeof raw === 'object' ? raw : {})) {
      if (b && Number.isFinite(b.profit) && Number.isFinite(b.medal)) best[key] = { profit: b.profit, medal: Math.max(0, Math.min(3, b.medal | 0)), feats: b.feats & 15, offered: b.offered & 15 };
    }
  } catch {
    // No storage, or not JSON: no bests.
  }
  return best;
}

// A belt key while a job is played: the panel of the scene in play hears it.
let beltKey = null;
document.addEventListener('keydown', (e) => beltKey && beltKey(e));

export function createJobs(ctx, scene, words) {
  const { sim } = ctx;
  const list = [];
  for (let i = 0; ; i++) {
    const j = sim.jobInfo(scene, i);
    if (!j) break;
    list.push(j);
  }
  const best = loadBest();
  const ui = document.getElementById('ui');
  const panel = el('div', '', ui);
  panel.id = 'job';
  panel.hidden = true;
  const head = el('div', 'job-head', panel);
  const titleEl = el('b', '', head);
  const clockEl = el('span', 'job-clock', head);
  const profitEl = el('span', 'job-profit', head);
  const fillEl = el('i', '', el('div', 'job-bar', panel));
  const billEl = el('div', 'job-bill', panel);
  // What the medals take: the bill is only a pressure if its limits show.
  const parEl = el('div', 'job-par', panel);
  const keepsEl = el('div', 'job-keeps', panel);
  const hintEl = el('div', 'job-hint', panel);
  // The metres of a job paid by the metre, large and in the middle while
  // they are counted, with what they have earned and the seconds left
  // of the count (a reviewer read "Carried 11 m" off the bill's small
  // grey line while the water had him, and the job ended on a timer
  // nothing had shown).
  const countEl = el('div', '', ui);
  countEl.id = 'job-count';
  countEl.hidden = true;
  const countB = el('b', '', countEl), countS = el('span', '', countEl);
  let count = '', countLeft = '';
  // A price under each tool of the belt (game_hud.js builds the slots).
  const tags = [...document.querySelectorAll('#belt .slot')].map((slot) => el('span', 'price', slot));
  let keepEls = [];
  // Labels in the world while the player looks the job over: the target,
  // and each neighbour that must stand (a pill on the bill names a
  // building; this says which one it is).
  const tagBox = el('div', '', ui);
  tagBox.id = 'job-tags';
  let tagEls = [], tagsUntil = 0;
  const TAG_AFTER_SHOT = 4000, TAG_GAP = 30;
  // The highest a label is drawn (px): under the bill.
  const TAG_TOP = 196;
  // The job has stalled short of its goal (the bill's last line says so).
  let stalled = false;
  const placed = [];
  // Where a point of the world (m) is on the page, or null behind the eye.
  function onScreen(x, y, z) {
    const cam = ctx.renderer.cam, c = ctx.renderer.canvas || document.querySelector('canvas');
    const w = c ? c.clientWidth : innerWidth, h = c ? c.clientHeight : innerHeight;
    const sy = Math.sin(cam.yaw), cy = Math.cos(cam.yaw), sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch);
    const dx = x - cam.pos[0], dy = y - cam.pos[1], dz = z - cam.pos[2];
    // Forward, right and up of the camera.
    const f = dx * -sy * cp + dy * sp + dz * -cy * cp;
    const r = dx * cy + dz * -sy;
    // (Behind the camera: at the edge on its side, half way up. The
    // shop on the water tower's bill is behind the player at the start,
    // and of three things on the bill a first-timer saw two.)
    if (f < 0.5) return [r < 0 ? 0 : w, h * 0.5];
    const u = dx * sy * sp + dy * cp + dz * cy * sp;
    const t = Math.tan((ctx.renderer.fov || 75) * Math.PI / 360);
    return [w * (0.5 + r / (f * t * (w / h) * 2)), h * (0.5 - u / (f * t * 2))];
  }
  function placeTags(job, g, now, live) {
    // While the job is looked over, everything is named; on a job that
    // has stalled, what is left of the target (the engine moves its
    // point there: job.rs, left_at).
    const all = now < tagsUntil;
    const show = live && (all || stalled);
    if (tagBox.hidden === show) tagBox.hidden = !show;
    if (!show) return;
    placed.length = 0;
    for (let k = 0; k < tagEls.length; k++) {
      const at = k === 0 ? [g[JOB.AT], g[JOB.AT + 1], g[JOB.AT + 2]] : job.keep[k - 1].at;
      const p = all || k === 0 ? onScreen(at[0], at[1], at[2]) : null;
      const e = tagEls[k];
      if (!p) {
        if (!e.hidden) e.hidden = true;
        continue;
      }
      if (e.hidden) e.hidden = false;
      // Kept on the page: a neighbour off to the side is named at the
      // edge. And clear of the bill, whose last line says whether to
      // wait, and of the crosshair.
      // (By the label's own half width, as near as its length tells:
      // "Bring down: the road bridge" at the left edge read "ing down:
      // the road bridge".)
      const half = Math.min(innerWidth / 2, 3.6 * e.textContent.length + 14);
      const x = Math.max(half, Math.min(innerWidth - half, p[0]));
      let y = Math.max(TAG_TOP, Math.min(innerHeight - 170, p[1]));
      // (Above it: under it lie the tools' own lines, and "Too far: that
      // is 25 m off" was read with a label across its middle.)
      if (Math.abs(x - innerWidth / 2) < 170 && y > innerHeight / 2 - 30 && y < innerHeight / 2 + 70) y = innerHeight / 2 - 46;
      // And apart: a neighbour behind the target is named under it, not
      // on top of it.
      for (let j = 0; j < k; j++) {
        const q = placed[j];
        if (q && Math.abs(q[0] - x) < 170 && Math.abs(q[1] - y) < TAG_GAP) y = q[1] + TAG_GAP;
      }
      placed[k] = [x, y];
      e.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -50%)`;
    }
  }
  // Last values written.
  let shown = -1, profit = NaN, medal = -1, fill = -1, bill = '', secs = -1, hint = '', state = -1;
  const lostKeys = new Int16Array(16).fill(-1);
  // When something was last seen giving way (ms): the solver works in
  // fits and starts, the line of text should not.
  let workedAt = -1e9;
  // When the bill for tools last grew (ms), and what it was.
  let shotAt = -1e9, spentSeen = 0, strainedAt = -1e9, wonAt = 0;

  // A belt key for a tool the job does not allow did nothing and said
  // nothing. It says which tools the job is done with, on the bill's last
  // line, for a few seconds.
  let note = '', noteUntil = 0;
  beltKey = (e) => {
    const job = list[shown];
    if (!job || e.repeat || panel.hidden) return;
    const t = e.code.startsWith('Digit') ? (Number(e.code.slice(5)) + 9) % 10 : e.code === 'Minus' ? 10 : e.code === 'Equal' ? 11 : -1;
    if (t < 0 || t >= TOOLS.length || job.tools & (1 << t)) return;
    const with_ = TOOLS.filter((_, k) => job.tools & (1 << k)).map((x) => x.short.toLowerCase());
    note = `No ${TOOLS[t].short.toLowerCase()} on this job. It is done with: ${with_.join(', ')}.`;
    noteUntil = performance.now() + NOTE_MS;
  };

  // A job done: its best profit and medal, and its feats, which add up
  // over the tries (a close call and an untouched run are two tries).
  function record(job, total, got, feats, offered) {
    const old = best[job.id];
    const better = !old || !(old.medal > got || (old.medal === got && old.profit >= total));
    const all = ((old && old.feats) | feats) & offered;
    best[job.id] = better ? { profit: Math.round(total), medal: got, feats: all, offered } : { ...old, feats: all, offered };
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Private browsing: the best lasts for the session.
    }
    return better;
  }

  return {
    list,
    best,
    // The first job without a medal yet: where a player goes on.
    next() {
      const i = list.findIndex((j) => !best[j.id] || best[j.id].medal < 1);
      return i < 0 ? 0 : i;
    },

    // A game event (EV.SCORE) while job `i` is played.
    said(i, what, value, which, now) {
      const job = list[i];
      if (!job) return;
      const keep = job.keep[which];
      if (what === SAID.COLLAPSE) return words.say(`Going: ${job.name}`, 'levelled', now);
      // Fire with a charge in hand, and none placed.
      // (On the bill's last line too, where it stays a few seconds: a
      // word that is gone in under two was not seen.)
      if (what === SAID.MISS) {
        // (How far off what the crosshair was on is: `which`, the
        // engine's own ray; 0 when it was on nothing.)
        const far = Math.round(which);
        note = value === 4 ? `That charge was not on ${job.name}: it cut nothing of it.` : value === 2 ? 'No charges left.' : value === 3 ? 'Wait: the charges are going off.' : far > 0 ? `Too far: that is ${far} m off, and a charge sticks on what is within 12 m.` : 'Nothing there: a charge sticks on what is within 12 m.';
        noteUntil = performance.now() + NOTE_MS;
        return words.say(value === 4 ? `Not on ${job.name}: that charge cut nothing` : value === 2 ? 'No charges left' : value === 3 ? 'Wait: the charges are going off' : far > 0 ? `Too far, ${far} m: a charge sticks within 12 m` : 'Nothing there: a charge sticks within 12 m', 'strike', now, 'miss');
      }
      if (what === SAID.DAMAGE && keep) words.say(`Collateral: ${keep.name}  ${money(-value)}`, 'damage', now, 'damage' + which);
      else if (what === SAID.VOID && keep) words.say(`Contract void: ${keep.name}`, 'void', now);
    },

    hide() {
      if (shown < 0) return;
      shown = -1;
      panel.hidden = true;
      tagBox.hidden = true;
      countEl.hidden = true;
      document.body.classList.remove('job');
      for (const t of tags) t.textContent = '';
      words.clear();
    },

    // g: the engine's game state (JOB) while job `i` is played.
    frame(i, g, now) {
      const job = list[i];
      if (!job) return;
      if (shown !== i) {
        shown = i;
        // (Nothing said by the job before is this one's.)
        words.clear();
        note = '';
        noteUntil = 0;
        panel.hidden = false;
        document.body.classList.add('job');
        titleEl.textContent = job.title;
        parEl.textContent = `gold from ${money(job.gold)}   silver from ${money(job.silver)}`;
        keepsEl.textContent = '';
        keepEls = job.keep.map((k) => el('span', '', keepsEl, capital(k.name.replace(/^the /, ''))));
        tagBox.textContent = '';
        tagEls = [el('div', 'job-tag', tagBox, `Bring down: ${job.name}`), ...job.keep.map((k) => el('div', 'job-tag keep', tagBox, `Must stand: ${k.name}`))];
        tagsUntil = Infinity;
        stalled = false;
        lostKeys.fill(-1);
        for (let t = 0; t < tags.length; t++) {
          const p = g[JOB.PRICE + t];
          tags[t].textContent = job.tools & (1 << t) && p > 0 ? '$' + p : '';
        }
        profit = NaN;
        workedAt = shotAt = strainedAt = -1e9;
        spentSeen = 0;
        medal = fill = secs = state = -1;
        bill = hint = '';
      }
      words.tick(now);
      const st = g[JOB.STATE];
      if (st !== state) {
        state = st;
        panel.classList.toggle('won', st === OBJ_STATE.WON || st === OBJ_STATE.DONE);
        panel.classList.toggle('lost', st === OBJ_STATE.FAILED);
      }
      // (A job lost pays nothing: the number and its medal's dot do not
      // stay up behind the card that says so.)
      const failed = st === OBJ_STATE.FAILED;
      const p = failed ? -Infinity : g[JOB.PROFIT];
      if (p !== profit) {
        profit = p;
        profitEl.textContent = failed ? 'No fee' : money(p);
        profitEl.classList.toggle('red', p < 0);
      }
      const m = failed ? 0 : g[JOB.MEDAL];
      if (m !== medal) profitEl.dataset.medal = String(medal = m);
      // (The furthest it has been: pieces on the move count as down
      // and some come to rest on what stands, so the measure itself
      // reads 24, 8, 44 over a fall, and a bar does not go backwards.)
      const f = Math.max(fill, Math.round(g[JOB.PROGRESS] * 100));
      if (f !== fill) fillEl.style.transform = `scaleX(${(fill = f) / 100})`;
      const limit = g[JOB.TIME];
      const s = limit > 0 ? Math.max(0, Math.ceil(limit - g[JOB.CLOCK])) : -1;
      if (s !== secs) clockEl.textContent = (secs = s) < 0 ? '' : clockText(s);
      const left = g[JOB.CHARGES_LEFT];
      // (A job by the clock: the fee as it was offered, and what the
      // seconds have taken off it. Fire costs nothing by the shot.)
      const late = g[JOB.LATE], took = late * g[JOB.SECS];
      const b = late > 0 ? `fee ${money(g[JOB.FEE] + took)}  ${g[JOB.SECS]} s ${money(-took)}` + (job.keep.length ? `  damage ${money(-g[JOB.DAMAGES])}` : '')
        : `fee ${money(g[JOB.FEE])}  tools ${money(-g[JOB.SPENT])}  damage ${money(-g[JOB.DAMAGES])}` + (left >= 0 ? `  ${left} charges left` : '');
      if (b !== bill) billEl.textContent = bill = b;
      for (let k = 0; k < keepEls.length; k++) {
        const pct = Math.floor(g[JOB.LOST + k] * 100);
        if (pct === lostKeys[k]) continue;
        lostKeys[k] = pct;
        // (With the share at which the job is void: at 49% nothing said
        // the job was one percent from over.)
        keepEls[k].dataset.lost = pct > 0 ? `${pct}% lost, void at ${Math.round(job.keep[k].void * 100)}%` : '';
        keepEls[k].classList.toggle('hurt', pct > 0);
      }
      if (g[JOB.WORKING]) workedAt = now;
      // (A job by the clock has no shot on its bill: its first second is one.)
      const fired = late > 0 ? (st === OBJ_STATE.READY ? 0 : 1) : g[JOB.SPENT];
      if (fired !== spentSeen) {
        spentSeen = fired;
        shotAt = now;
        // The labels go a moment after the first shot.
        if (tagsUntil === Infinity) tagsUntil = now + TAG_AFTER_SHOT;
      }
      placeTags(job, g, now, st === OBJ_STATE.READY || st === OBJ_STATE.RUNNING);
      // What the bill says about waiting has to be true, because whether
      // to wait or to fire again is the decision: so it states what can
      // be read and gives no advice. While anything is moving or
      // breaking it says so, and also while the frame is giving way out
      // of sight (a building stands still for half a minute on two cut
      // columns, losing connections all the while, and then falls: the
      // solver's count of them is what tells that from one that will
      // stand). Quiet for a few seconds after the target let go and the
      // goal not met, it has stopped, and how far it got; quiet for six
      // seconds after a shot with nothing let go, nothing is moving.
      if (g[JOB.STRAINING]) strainedAt = now;
      // Charges stuck on and waiting for Alt (the tools' own count).
      const ts = ctx.sim.frame.toolState;
      const waiting = ts && !ts[TOOL_STATE.DETONATING] ? ts[TOOL_STATE.CHARGES] | 0 : 0;
      const working = now - workedAt < 1500, quiet = now - Math.max(workedAt, shotAt, strainedAt);
      // (Before the first shot of a job with a neighbour: a blast takes
      // what stands near it, and the shot the start offers may be the
      // one that costs the medal. A critic took bronze twice at the
      // garage's door before going round.)
      // (When the goal was met: a verdict that waits past a few seconds
      // says what it waits for.)
      if (st !== OBJ_STATE.WON) wonAt = now;
      const h0 = late > 0 ? (st === OBJ_STATE.READY ? 'Over the footbridge and in: the pegs stand in its floor. The clock starts with your first flame.'
        : st === OBJ_STATE.WON ? `${down(job.name)}.`
        : st !== OBJ_STATE.RUNNING ? ''
        : g[JOB.GONE] ? 'It is coming down.'
        : g[JOB.SECS] >= 4 ? 'It hangs until its pegs have burnt: every one you light yourself is seconds off.' : '')
        : st === OBJ_STATE.READY ? (g[JOB.CARRY] > 0 ? 'Charges on its foot, then back here, below the footbridge, and Alt. Hands off while it carries you.' : g[JOB.RIDE] ? 'Be standing on it when it goes. The fee is for the ride.' : OWN[job.id] && OWN[job.id].ready ? OWN[job.id].ready : job.keep.length ? `${job.tools === CUT ? 'It falls toward the side you cut' : 'A blast takes what stands near it too'}: ${job.keep.map((k) => k.name).join(', ')} ${job.keep.length > 1 ? 'are' : 'is'} on the bill.` : 'Looking costs nothing. The bill starts with your first shot.')
        : st === OBJ_STATE.WON ? (g[JOB.CARRY] > 0 ? `Carried ${Math.floor(g[JOB.CARRIED])} m. Hands off the keys.` : job.keep.length ? (g[JOB.STRAINING] && now - wonAt > 6000 ? 'Something is still breaking: the damage is not all done.' : `${down(job.name)}. Counting the damage.`) : `${down(job.name)}.`)
        : st !== OBJ_STATE.RUNNING || !(g[JOB.SPENT] > 0) ? ''
        // (Not in the two seconds after a shot: that is the shot's own hole.)
        : working && (g[JOB.GONE] || now - shotAt > 2000) ? (g[JOB.GONE] ? 'It is coming down.' : 'Something is giving way.')
        // Nothing moves, but the frame is past its strength and still
        // losing connections (the solver's own account).
        : g[JOB.STRAINING] ? 'Something inside is still breaking.'
        : g[JOB.GONE] && quiet > 3000 ? `It has stopped, ${f}% of the way there. What is left still counts.`
        // Charges on and not set off: that is what to do next.
        // (No fuse: Alt at arm's length took 46% of the first critic
        // "in the same half second, before a step was taken".)
        : waiting > 0 ? `${waiting} charge${waiting > 1 ? 's' : ''} on. ${g[JOB.RIDE] ? '' : 'Step back, then '}${ctx.state && ctx.state.touch ? 'Alt' : 'Alt (or the right button)'} sets ${waiting > 1 ? 'them' : 'it'} off.`
        // (Where to, only of a cut: a second charge on a cut leg does
        // nothing, and a third rocket into the office's same hole is
        // what brought it down.)
        : !g[JOB.GONE] && quiet > 4000 ? (job.tools === CUT ? 'Nothing is moving. It takes another cut, somewhere else.' : 'Nothing is moving. It takes more than that.')
        : '';
      const h = performance.now() < noteUntil && (st === OBJ_STATE.READY || st === OBJ_STATE.RUNNING) ? note : h0;
      if (h !== hint) hintEl.textContent = hint = h;
      const timing = late > 0 && st === OBJ_STATE.RUNNING;
      const counting = timing || (g[JOB.CARRY] > 0 && g[JOB.LEFT] > 0 && (st === OBJ_STATE.RUNNING || st === OBJ_STATE.WON));
      if (counting === countEl.hidden) countEl.hidden = !counting;
      if (counting) {
        const m = Math.floor(g[JOB.CARRIED]);
        // (The clock of a job by fire: the seconds and what is left of
        // the fee, large, where the dam's metres are.)
        const c = timing ? `${g[JOB.SECS]} s  ·  ${money(g[JOB.FEE])}` : `${m} m  ·  ${money(m * g[JOB.CARRY])}`;
        const s2 = timing ? `${money(-late)} a second` : `${Math.ceil(g[JOB.LEFT])} s left`;
        if (c !== count) countB.textContent = count = c;
        if (s2 !== countLeft) countS.textContent = countLeft = s2;
      }
      const stop = h0.startsWith('It has stopped');
      if (stop !== stalled && tagEls[0]) {
        stalled = stop;
        tagEls[0].textContent = stop ? `What is left of ${job.name}` : `Bring down: ${job.name}`;
      }
    },

    // What the result card says of job `i` once it is over.
    result(i, g) {
      const job = list[i];
      const won = g[JOB.STATE] === OBJ_STATE.DONE;
      const total = g[JOB.PROFIT], got = won ? g[JOB.MEDAL] : 0;
      const before = best[job.id] ? best[job.id].profit : null;
      // Feats: this try's, and with the earlier tries'.
      const feats = won ? g[JOB.FEATS] & 15 : 0, offered = g[JOB.OFFERED] & 15;
      const had = best[job.id] ? best[job.id].feats | 0 : 0;
      const isBest = won && record(job, total, got, feats, offered);
      const all = (had | feats) & offered;
      const rows = [['Fee', money(g[JOB.FEE])], ['Tools', money(-g[JOB.SPENT])], ['Damage', money(-g[JOB.DAMAGES])]];
      if (g[JOB.CARRY] > 0) rows.splice(1, 0, ['  Carried', `${Math.floor(g[JOB.CARRIED])} m at ${money(g[JOB.CARRY])}`]);
      // (By the clock: the fee as offered, then what the seconds took.)
      if (g[JOB.LATE] > 0) rows.splice(0, 2, ['Fee', money(g[JOB.FEE] + g[JOB.LATE] * g[JOB.SECS])], ['Burning', `${g[JOB.SECS]} s at ${money(-g[JOB.LATE])}`]);
      job.keep.forEach((k, n) => {
        const pct = Math.floor(g[JOB.LOST + n] * 100);
        if (pct > 0) rows.push([`  ${capital(k.name)}`, `${pct}% lost`]);
      });
      // How near it came: the least of the player's health while the job ran.
      const low = g[JOB.LOW];
      // (And what did it, from how far: with that, Again has a plan in
      // it. "I do not know WHAT touched me": the first critic, twelve
      // metres from the tower on the side it falls toward.)
      if (won && low < 0.95) {
        const by = g[JOB.LOW_BY] | 0, off = Math.round(g[JOB.LOW_FROM]);
        const what = by ? `: ${gotBy(by, g[JOB.LOW_MATERIAL]).toLowerCase()}${by !== 3 && by !== 5 && off >= 2 ? `, ${off} m off` : ''}` : '';
        rows.push(['Closest call', `${Math.max(0, Math.round(low * 100))}% left${what}`]);
      }
      // What the next medal would have taken, in the tool that costs most;
      // for a job lost, what to do differently.
      let next = '';
      if (!won) next = ADVICE[g[JOB.FAIL]] ? ADVICE[g[JOB.FAIL]](g, job) : '';
      if (won && got < 3) {
        const goal = got < 1 ? 0 : got < 2 ? job.silver : job.gold;
        const short = goal - total;
        // (Paid by the metre: the way up is metres, and fewer charges
        // are fewer of them.)
        next = `${MEDALS[got + 1]} at ${money(goal)}: ` + (g[JOB.CARRY] > 0 ? `${Math.ceil(short / g[JOB.CARRY])} m more carried` : g[JOB.LATE] > 0 ? `${Math.ceil(short / g[JOB.LATE])} s sooner` : g[JOB.DAMAGES] >= short ? 'break less of what must stand' : `${money(short)} less on tools`);
      }
      if (won && offered) {
        const names = FEATS.filter((f) => feats & f[0]).map((f) => (had & f[0] ? f[1] : `${f[1]} ✓`));
        rows.push([`Feats ${bits(all)} of ${bits(offered)}`, names.length ? names.join(' · ') : 'none this time']);
        // Gold has no next medal: what is left to fetch is a feat.
        const missing = FEATS.find((f) => offered & f[0] && !(all & f[0]));
        // (Said as what Again is for: the lit button is Next job, and a
        // line that only named the feat asked for one thing while the
        // card's focus offered the other.)
        if (got === 3) next = missing ? `Again, for ${missing[1]}: ${missing[2]}.` : 'Gold, and every feat: nothing left on this job.';
      }
      return {
        kicker: `Contract · ${job.title}`,
        medal: got,
        medalName: won ? (got > 0 ? MEDALS[got] : 'Done, at a loss') : g[JOB.FAIL] === 6 ? gotBy(g[JOB.GOT_BY], g[JOB.GOT_MATERIAL]) : FAILS[g[JOB.FAIL]] || 'Lost',
        value: won ? total : 'No fee',
        format: money,
        lost: !won,
        best: won ? before : null,
        isBest,
        rows,
        next,
      };
    },
  };
}

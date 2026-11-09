// The game on top of the sandbox: which mode is being played (a contract,
// Mayhem, or the free sandbox), the buttons and the job board on the start
// card and in the menu that choose, the panels, words and result card of a
// run, the prompts of the first minute, and the gamepad. The rules, the
// bills and the scores are the engine's (player/objective/): this file
// starts runs and shows what it is told. See docs/design/fun.md for what
// the modes are for.
//
// hooks (from game.js): { capture(), setMode(m), restart(), turn(dx, dy),
//   next(dir), objective, settings, feel, look }
import { BUTTON, EV, EV_STRIDE, GAME, GAME_MODE, JOB, OBJ_STATE, OUT, SAID, TOOL } from './engine.js';
import { SCENES } from './game_settings.js';
import { createScore, createWords, points, scoreOf } from './game_score.js';
import { createCard, MEDALS } from './game_card.js';
import { createJobs, featsOf, money } from './game_jobs.js';
import { createJuice } from './game_juice.js';
import { createPad } from './game_pad.js';
import { createToys } from './game_toys.js';
import { createHarm } from './game_harm.js';
import { massText } from './game_tally.js';

const BEST_KEY = 'voxel-engine.mayhem.v1';
const MODE_KEY = 'vx.mode', JOB_KEY = 'vx.job';
// A moment between the verdict and the card, to see what one has done.
const CARD_DELAY = 1100;
// Real seconds the world slows for when a structure lets go: a contract's
// target, and in Mayhem by what is in it (a shed a blink, a tower this).
const BREATH = 1.1, BREATH_LEAST = 0.4;
const STAKE = [50_000, 300_000];
// The first thing said in a run of Mayhem, where the scene starts the
// player on something particular (`mayhem::pose`).
const OPENERS = {
  4: 'One rocket into that chord folds the span.',
  5: 'That pipe is the fuel line. It burns back to the tanks.',
};
const OPENER = 'Aim low. Cut what holds it up and it falls.';
// A round of Mayhem is sixty seconds of the world, on every machine: the
// same play scores the same wherever it is played, and a machine that
// runs the world slow gets the same round in slow motion (the clock on
// the panel is the world's, and says so while it runs slow). Nothing
// ends a round early but the player: after `OFFER_AFTER` seconds by the
// wall in a round that is still running, the page offers to end it there
// (`mayhemSkip` of what is left: scored as it stands, and the card says
// how much of the minute was played).
const OFFER_AFTER = 180;
// The world counts as running slow below this share of the wall's pace.
const SLOW_BELOW = 0.8;
const ALL_TOOLS = (1 << TOOL.COUNT) - 1;
// A run of Mayhem has every tool but the spawner (mayhem::TOOLS).
const MAYHEM_TOOLS = ALL_TOOLS & ~(1 << TOOL.SPAWNER);
const MODES = [
  { id: 'contract', name: 'Contracts', lead: 'Bring it down for money. Every shot goes on the bill, and so does whatever you break that should have stood.' },
  { id: 'mayhem', name: 'Mayhem', lead: 'Sixty seconds from your first shot. Bring it all down, and chain what you can.' },
  { id: 'sandbox', name: 'Sandbox', lead: 'No clock, no bill. Everything in it breaks, falls and piles up.' },
];

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function loadBest() {
  const best = {};
  try {
    const raw = JSON.parse(localStorage.getItem(BEST_KEY));
    for (const [key, b] of Object.entries(raw && typeof raw === 'object' ? raw : {})) {
      if (b && Number.isFinite(b.score) && b.score >= 0 && Number.isFinite(b.medal)) best[key] = { score: b.score, medal: Math.max(0, Math.min(3, b.medal | 0)) };
    }
  } catch {
    // No storage, or not JSON: no bests.
  }
  return best;
}

const stored = (key) => {
  try { return sessionStorage.getItem(key); } catch { return null; }
};
const store = (key, value) => {
  try { sessionStorage.setItem(key, value); } catch { /* the choice lasts while the page does */ }
};

export function createModes(ctx, state, scene, hooks) {
  const { sim, params } = ctx;
  const { objective, settings } = hooks;
  // Structures of the scene by plan number, as the words name them.
  const names = [], places = [];
  for (let i = 0; ; i++) {
    const p = sim.planInfo(scene, i);
    if (!p) break;
    names.push(capital(p.name));
    places.push(p.at);
  }
  // The curtain over a restart names what is being built again (a big
  // scene takes some seconds, and a bare "Restarting" said nothing).
  const curtain = document.getElementById('curtain');
  if (curtain && SCENES[scene]) curtain.textContent = `Rebuilding · ${SCENES[scene]}`;
  const words = createWords();
  const score = createScore(ctx, names, words, places);
  const jobs = createJobs(ctx, scene, words);
  const card = createCard();
  const juice = createJuice(ctx, state, settings);
  const pad = createPad(state, settings, {
    turn: hooks.turn,
    // A pad needs no pointer lock (and a browser would not grant one to a
    // button that is not a key or a click): straight into play. A click
    // on the scene later still captures the mouse.
    capture: () => hooks.setMode('play'),
    menu: () => { toys.close(); hooks.setMode('menu'); },
    next: hooks.next,
    // (Back ends a round that has been offered its end, else restarts.)
    restart: () => { if (!endNow()) hooks.restart(); },
    slow: () => { state.slow = !state.slow; },
    card: (primary) => (card.shown ? (card.press(primary), true) : false),
    toys: (hit, now) => toys.pad(hit, now),
  });
  // The sandbox's toy box (G, the d-pad, the Toys button on touch).
  const toys = createToys(ctx, state, { used: () => pad.used });
  const harm = createHarm(ctx);
  const best = loadBest();
  const tip = document.createElement('div');
  tip.id = 'mh-tip';
  tip.hidden = true;
  document.getElementById('ui').appendChild(tip);
  tip.addEventListener('click', () => endNow());
  // (A map with nothing inherited: a link's ?mode=toString is no mode.)
  const offered = Object.assign(Object.create(null), { contract: jobs.list.length > 0, mayhem: names.length > 0, sandbox: true });

  // The mode asked for: a link's ?mode= wins, then what was picked in this
  // tab, then contracts where the scene has any, then Mayhem. The harness
  // gets the bare sandbox unless it asks.
  let mode = 'sandbox', job = 0;
  {
    // (Framed on another site's page, game.js `straight`: the page opens on the first contract whatever an earlier
    // visit left, so its opening view is one and the same for everybody: `hooks.first`.)
    const picked = hooks.first ? hooks.first.mode : params.get('mode') || stored(MODE_KEY);
    if (offered[picked]) mode = picked;
    else if (!ctx.harness) mode = offered.contract ? 'contract' : offered.mayhem ? 'mayhem' : 'sandbox';
    const j = hooks.first ? hooks.first.job : Number(params.get('job') ?? stored(JOB_KEY) ?? NaN);
    job = Number.isInteger(j) && j >= 0 && j < jobs.list.length ? j : jobs.next();
  }
  let booted = false, lastFrame = -1, doneAt = 0, carded = false, tipKey = '', lit = '';
  let struck = false, runs = 0, strikes0 = 0;
  // The mode of a run that ended and was played on past: R starts it again.
  let resume = '';
  // The run's stopwatch: seconds of play since the run was seen running
  // (-1: not yet) at the pace of the picture and of the wall, what the
  // world had run by then, what the engine's clock said at the last
  // frame, and the serial of the last skip asked for.
  const W = { play: -1, wall: 0, world0: 0, world: 0, speed: 1, ended: false, at: 0 };
  // (A tab put away stops the frames, not the clock on the wall: the
  // time away is nobody's.)
  document.addEventListener('visibilitychange', () => { W.at = 0; });

  // The buttons that choose a mode and, under them, the jobs of the scene:
  // on the start card above Play, in the menu above the scenes.
  const buttons = [], rows = [], boards = [];
  const lead = document.querySelector('#start .lead');
  // On the start card a button only chooses, and Enter means Play: after
  // a click with the mouse the focus goes to the Play button, or a click
  // that chose a job (or only meant to give the page the keyboard) would
  // have Enter press the row again instead of starting the game. A button
  // pressed with the keyboard keeps the focus (`detail` is 0 then): who
  // tabs to Contracts means to tab on to its jobs.
  const toPlay = (ev) => {
    const play = document.getElementById('play');
    if (ev.detail > 0 && play && !play.disabled) play.focus({ preventScroll: true });
  };
  function board(parent, before, inMenu) {
    if (!parent || !(offered.contract || offered.mayhem)) return;
    const box = document.createElement('div');
    box.className = 'modes';
    for (const m of MODES) {
      if (!offered[m.id]) continue;
      const b = document.createElement('button');
      b.textContent = m.name;
      const mark = document.createElement('small');
      b.appendChild(mark);
      b.addEventListener('click', (ev) => {
        // On the start card a button only chooses; in the menu it starts.
        ev.stopPropagation();
        begin(m.id);
        if (inMenu) hooks.capture();
        else toPlay(ev);
      });
      box.appendChild(b);
      buttons.push({ el: b, id: m.id, mark });
    }
    parent.insertBefore(box, before);
    const listEl = document.createElement('div');
    listEl.className = 'jobs';
    jobs.list.forEach((j, i) => {
      const b = document.createElement('button');
      const medal = document.createElement('i');
      const text = document.createElement('span');
      const title = document.createElement('b');
      title.textContent = j.title;
      const brief = document.createElement('small');
      brief.textContent = j.brief;
      text.append(title, brief);
      const pay = document.createElement('em');
      b.append(medal, text, pay);
      b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        begin('contract', i);
        if (inMenu) hooks.capture();
        else toPlay(ev);
      });
      listEl.appendChild(b);
      rows.push({ el: b, i, medal, pay });
    });
    parent.insertBefore(listEl, before);
    boards.push(listEl);
  }
  board(document.getElementById('start'), document.getElementById('play'), false);
  const menuScenes = document.querySelector('#menu .scenes');
  if (menuScenes) board(menuScenes.parentNode, menuScenes.previousElementSibling, true);

  // What is being played, as the buttons show it: an objective started
  // some other way (a link's ?objective=) is none of the modes.
  const playing = () => (objective.chosen >= 0 ? 'objective' : mode);
  function refresh() {
    lit = playing();
    toys.mode(lit);
    for (const b of buttons) {
      b.el.classList.toggle('on', b.id === lit);
      const got = b.id === 'mayhem' ? best[scene] : null;
      const medals = b.id === 'contract' ? jobs.list.filter((j) => jobs.best[j.id] && jobs.best[j.id].medal > 0).length : 0;
      b.mark.textContent = got ? points(got.score) : b.id === 'contract' ? `${medals} of ${jobs.list.length}` : '';
    }
    for (const r of rows) {
      const got = jobs.best[jobs.list[r.i].id];
      r.el.classList.toggle('on', lit === 'contract' && r.i === job);
      r.medal.dataset.medal = String(got ? got.medal : -1);
      r.pay.textContent = got ? money(got.profit) + (featsOf(got) ? `  ${featsOf(got)}` : '') : `pays ${money(jobs.list[r.i].fee)}`;
      r.pay.classList.toggle('best', !!got);
    }
    for (const b of boards) b.hidden = lit !== 'contract';
    const m = MODES.find((x) => x.id === lit);
    if (lead && m) lead.textContent = m.lead;
  }

  const pristine = () => !ctx.lastOut || ctx.lastOut[OUT.STAT_FRAME] === 0;
  // Serial of the last command made here, and which arm() it was.
  let armedAt = 0, arming = 0;

  // The engine side of `mode`, on the world as it is.
  function arm() {
    carded = false;
    doneAt = 0;
    struck = false;
    W.play = -1;
    card.hide();
    // A run started over from its own card by some other road than the
    // card's buttons (a pad's Back, a script): the card's mode goes with
    // the card, or the shell's own score card would show through.
    if (state.mode === 'score' && objective.chosen < 0) hooks.setMode('play');
    juice.reset();
    if (mode !== 'sandbox') {
      // Whether it started shows in the first frame after the command: at
      // once with the sim on this thread, a frame or two later with it in
      // a worker (frames from before it say nothing: armedAt).
      const asked = ++arming, wanted = mode;
      const tools = mode === 'contract' ? jobs.list[job].tools : MAYHEM_TOOLS;
      armedAt = mode === 'contract' ? sim.command('jobStart', scene, job) : sim.command('mayhemStart', scene);
      sim.after(armedAt, () => {
        // (Another choice made while this one was on its way wins.)
        if (arming !== asked || mode !== wanted) return;
        if (sim.frame.game[GAME.MODE] === (wanted === 'contract' ? GAME_MODE.JOB : GAME_MODE.MAYHEM)) {
          // The run starts the player where it wants them, the tool for
          // it in hand: rockets where they are allowed, else the first
          // that is.
          const c = sim.frame.camera;
          hooks.look.yaw = c[3];
          hooks.look.pitch = c[4];
          state.allowed = tools;
          // (Every round starts with the rocket in hand, whatever tool a
          // job would name: `JOB.HAND` is no longer asked.)
          let t = TOOL.ROCKET;
          while (!(tools & (1 << t))) t = (t + 1) % TOOL.COUNT;
          state.selectTool(t);
          runs++;
        } else {
          mode = 'sandbox';
        }
        refresh();
      });
    }
    refresh();
  }

  // Play mode `id` (and, of the contracts, job `i`) from a fresh scene.
  // Going to the sandbox keeps the world as it is.
  function begin(id, i) {
    // (An engine that trapped is not called again.)
    if (state.mode === 'stopped') return;
    resume = '';
    mode = offered[id] ? id : 'sandbox';
    if (mode === 'contract' && Number.isInteger(i) && i >= 0 && i < jobs.list.length) job = i;
    store(MODE_KEY, mode);
    store(JOB_KEY, String(job));
    // (Clearing an objective goes through its own arm(), which stops
    // whatever the engine was playing.)
    if (objective.chosen >= 0) objective.begin(-1);
    else if (mode === 'sandbox') armedAt = sim.command('objectiveStop');
    if (mode !== 'sandbox' && !pristine()) hooks.restart();
    else arm();
  }

  function record(total, medal) {
    const old = best[scene];
    if (old && old.score >= total) return false;
    best[scene] = { score: Math.round(total), medal };
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Private browsing: the best lasts for the session.
    }
    return true;
  }

  // Leave the card for the world as it is: the free sandbox from here.
  function carryOn() {
    armedAt = sim.command('objectiveStop');
    hooks.capture();
  }

  function showCard(g) {
    carded = true;
    let r;
    if (g[GAME.MODE] === GAME_MODE.JOB) {
      r = jobs.result(job, g);
      const more = job + 1 < jobs.list.length;
      const on = !r.lost && r.medal > 0 && more;
      r.buttons = [{ label: 'Again', primary: !on, act: () => { begin('contract', job); hooks.capture(); } }];
      if (more) r.buttons.push({ label: 'Next job', primary: on, act: () => { begin('contract', job + 1); hooks.capture(); } });
      r.buttons.push({ label: 'Job board', act: () => hooks.setMode('menu') });
    } else {
      const total = scoreOf(g), medal = g[GAME.MEDAL];
      const before = best[scene] ? best[scene].score : null;
      // A round on a machine that ran the world slow: the card says how
      // much of the minute the world got through (the medal stands).
      const cut = g[GAME.SKIPPED];
      const slow = W.speed < SLOW_BELOW ? Math.max(1, Math.round(W.speed * 100)) : 0;
      const note = (cut >= 0.5 ? ` Ended by you with ${Math.round(g[GAME.CLOCK] - cut)} s of the minute played.` : '') + (slow ? ` Played in slow motion: this machine ran the world at ${slow}% speed.` : '');
      r = {
        kicker: `Mayhem · ${SCENES[scene] || ''}`,
        medal, value: total, best: before, isBest: total > 0 && record(total, medal),
        rows: [
          ['Levelled', `${g[GAME.LEVELLED]} of ${g[GAME.TARGETS]}`],
          ...stood(g),
          ['Best chain', `x${Math.max(1, g[GAME.BEST_MULT])}`],
          ['Brought down', `${points(g[GAME.VOXELS])} voxels`],
          ['Heaviest piece', massText(g[GAME.BIGGEST])],
        ],
        next: (medal < 3 ? `${MEDALS[medal + 1]} at ${points(g[GAME.PAR + medal])}.` : 'Gold. Now beat it.') + note,
        buttons: [
          { label: 'Again', primary: true, act: () => { begin('mayhem'); hooks.capture(); } },
          { label: 'Keep wrecking', act: () => { resume = 'mayhem'; carryOn(); } },
          { label: 'Menu', act: () => hooks.setMode('menu') },
        ],
      };
    }
    refresh();
    card.show(r);
    hooks.setMode('score');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  // The prompt: one thing at a time, in the words of whatever the player
  // is holding.
  function prompt(g) {
    const st = g[GAME.STATE];
    const fire = pad.used ? 'RT to fire.' : state.touch ? 'Hold Fire to shoot.' : 'Click to fire.';
    const strike = pad.used ? 'Y' : state.touch ? 'The red B' : 'B';
    let t = '';
    if (g[GAME.MODE] === GAME_MODE.JOB) {
      // Only the first job of somebody who has no medal yet is talked through.
      if (job === 0 && runs <= 3 && !Object.keys(jobs.best).length) {
        // With a charge in hand (the town's chimney, the first job
        // there is): where to put one, then what sets it off.
        const only = state.tool === TOOL.CHARGE;
        // (A job by fire is paid by the clock: nothing to count by the shot.)
        if (g[JOB.LATE] > 0) t = st === OBJ_STATE.READY ? `${pad.used ? 'Hold RT' : state.touch ? 'Hold Fire' : 'Hold the button'} to burn. Every second is on the bill.` : '';
        else if (st === OBJ_STATE.READY) t = only ? `${pad.used ? 'RT sticks' : state.touch ? 'Fire sticks' : 'Click to stick'} a charge on.${g[JOB.RIDE] ? '' : ' It falls toward the side you cut.'}` : `${fire} Every shot goes on the bill.`;
        else if (st === OBJ_STATE.RUNNING && !g[JOB.GONE] && g[JOB.SPENT] > 0 && g[JOB.CLOCK] < 8) t = only ? `${pad.used ? 'LT' : 'Alt'} sets it off. ${g[JOB.RIDE] ? 'Stay on it.' : 'Then get out from under it.'}` : 'Every shot is on the bill. Low and few.';
      }
    } else if (offering(g)) t = `A slow round. ${pad.used ? 'Back' : state.touch ? 'Tap here' : 'N'} ends it now, scored as it stands.`;
    else if (st === OBJ_STATE.READY) t = `${fire} The clock starts with your first shot.`;
    else if (st === OBJ_STATE.RUNNING && runs <= 2 && g[GAME.CLOCK] < 7 && g[GAME.LINKS] < 1) t = OPENERS[scene] || OPENER;
    // (Ten seconds of it: said once, it is not kept up to the buzzer.)
    else if (st === OBJ_STATE.RUNNING && !struck && g[GAME.STRIKES] > 0 && g[GAME.CLOCK] > 14 && g[GAME.CLOCK] < 24) t = `${strike}: an air strike where you look.`;
    if (t === tipKey) return;
    tipKey = t;
    tip.textContent = t;
    tip.hidden = !t;
    // (The tool's own hint line sits where the prompt does.)
    document.body.classList.toggle('tip-up', !!t);
  }

  // What a run left standing, by name, for its card: the next round's
  // list of things to go for ("3 of 9" names none of the six).
  function stood(g) {
    const mask = g[GAME.MASK] + g[GAME.MASK_HI] * 65536, left = [];
    for (let i = 0; i < g[GAME.TARGETS]; i++) {
      if (Math.floor(mask / 2 ** i) % 2 === 0) left.push((names[g[GAME.PLAN + i]] || 'a structure').toLowerCase());
    }
    if (!left.length) return [];
    const most = 4;
    return [['Left standing', left.length > most ? `${left.slice(0, most).join(', ')} and ${left.length - most} more` : left.join(', ')]];
  }

  // The run's stopwatch against the world's clock: how slow the world is
  // running (for the panel and the card), and the offer to end a round
  // that has gone on for minutes. The harness steps the world itself and
  // has no wall to keep time by.
  function keepTime(g) {
    const st = g[GAME.STATE];
    if (ctx.harness && !params.has('walltime')) return;
    if (st !== OBJ_STATE.RUNNING && st !== OBJ_STATE.WON) {
      W.play = -1;
      return;
    }
    const clock = g[GAME.CLOCK] + g[GAME.OVERTIME] - g[GAME.SKIPPED];
    if (W.play < 0) {
      W.play = 0;
      W.wall = 0;
      W.world0 = clock;
      W.ended = false;
    }
    // A round the player ended keeps the speed it ran at: the seconds
    // the end moved the clock on were not played.
    if (W.ended) return;
    W.world = clock - W.world0;
    // (Judged once there is something to judge by: three seconds in.)
    W.speed = W.play > 3 ? Math.min(1, W.world / W.play) : 1;
  }
  // The player ends the round where it stands.
  function endNow() {
    const g = sim.frame.game;
    if (g[GAME.MODE] !== GAME_MODE.MAYHEM || !offering(g)) return false;
    W.ended = true;
    // All of the clock that is left and all of the wait after it.
    armedAt = sim.command('mayhemSkip', Math.round((g[GAME.TIME] + 60) * 1000));
    return true;
  }
  const offering = (g) => !W.ended && W.wall >= OFFER_AFTER && (g[GAME.STATE] === OBJ_STATE.RUNNING || g[GAME.STATE] === OBJ_STATE.WON);

  // SCORE events of the steps since the last drawn frame.
  function events(out, now, inJob) {
    const frame = out[OUT.STAT_FRAME];
    if (frame === lastFrame) return;
    lastFrame = frame;
    const n = out[OUT.EVENT_COUNT];
    const f = sim.frame.f32;
    let p = out[OUT.EVENTS_PTR] >> 2;
    for (let i = 0; i < n; i++, p += EV_STRIDE) {
      if (f[p] !== EV.SCORE) continue;
      const what = f[p + 6];
      if (inJob) jobs.said(job, what, f[p + 4], f[p + 7], now);
      else score.said(what, f[p + 4], f[p + 7], now);
      if (what === SAID.COLLAPSE) {
        // The moment to watch: it has let go and is on its way.
        const stake = inJob ? 1 : Math.max(0, Math.min(1, (f[p + 4] - STAKE[0]) / (STAKE[1] - STAKE[0])));
        juice.breathe(BREATH_LEAST + (BREATH - BREATH_LEAST) * stake);
        pad.rumble(1, 500);
      } else if (what === SAID.CHAIN || what === SAID.LEVELLED || what === SAID.SWEEP || what === SAID.DAMAGE || what === SAID.VOID) {
        pad.rumble(0.6, 220);
      }
    }
  }

  // The HUD's hints call the secondary button "Alt" (the touch button's
  // name): the Alt key is one, beside the right mouse button.
  let alt = false;
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'AltLeft' && e.code !== 'AltRight') return;
    if (state.mode !== 'play') return;
    e.preventDefault();
    if (!alt && !e.repeat) pad.pressed |= BUTTON.SECONDARY;
    alt = true;
  }, true);
  document.addEventListener('keyup', (e) => {
    if (e.code !== 'AltLeft' && e.code !== 'AltRight') return;
    if (alt) e.preventDefault();
    alt = false;
  }, true);
  window.addEventListener('blur', () => { alt = false; });

  // R on the result card is Again, as it is everywhere else, and Esc
  // leaves it for the menu.
  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey) return;
    // N ends a round that has been offered its end.
    if (e.code === 'KeyN' && state.mode === 'play') endNow();
    if (!card.shown) return;
    if (e.code === 'KeyR') card.press(true, 'Again');
    else if (e.code === 'Escape') card.press(false);
  });

  // While a run is on, not under the harness (whose scripted players
  // stand in the air): no flying, and in Mayhem, whose clock is the
  // game, no slow motion either.
  let running = 0;
  const barred = () => (ctx.harness || !running ? 0 : BUTTON.NOCLIP);

  refresh();
  return {
    get mode() { return playing(); },
    get job() { return job; },
    // (A round has been started by the engine and the page has taken its start: the view and the tool in hand.)
    get armed() { return runs > 0; },
    jobs,
    begin,
    juice,
    pad,
    card,
    toys,
    // What the gamepad adds to this tick's input (game.js merges it).
    input: pad,
    // Buttons that do nothing just now (game.js masks them).
    get barred() { return barred(); },
    // For a host with no keys (hands in VR): press the card's lit button
    // ("Next job", "Again") or its last one ("Job board"); true when a
    // card took it. And what the lit one says ('' with no card up).
    confirm: () => (card.shown ? (card.press(true), true) : false),
    back: () => (card.shown ? (card.press(false), true) : false),
    get cardLabel() { return card.shown ? card.label : ''; },

    // The engine was rebuilt (restart): the mode starts over, unless an
    // objective was chosen meanwhile (its own module arms that).
    restarted() {
      lastFrame = -1;
      if (resume && objective.chosen < 0) mode = resume;
      resume = '';
      if (objective.chosen >= 0) {
        carded = false;
        card.hide();
        juice.reset();
        refresh();
      } else {
        arm();
      }
    },

    // Once a tick, before the sim steps.
    update(dt) {
      if (!booted) {
        booted = true;
        if (objective.chosen < 0 && mode !== 'sandbox') arm();
      }
      pad.poll(dt);
      if (alt && state.mode === 'play') pad.buttons |= BUTTON.SECONDARY;
      if (running === GAME_MODE.MAYHEM && !ctx.harness) state.slow = false;
      // The stopwatch runs while the game does (the breath and the
      // hit-stop are the game's own slowness, not the machine's). It
      // reads the wall itself: the tick's dt is capped, which is the
      // very slowness being measured.
      const wallNow = performance.now();
      if (W.play >= 0 && W.at > 0 && state.mode === 'play' && !state.paused) {
        const real = (wallNow - W.at) / 1000;
        W.play += real * state.pace;
        W.wall += real;
      }
      W.at = state.mode === 'play' && !state.paused ? wallNow : 0;
      juice.update(dt);
      // The card goes when play resumes by any road (Enter, a click).
      if (card.shown && state.mode !== 'score') card.hide();
    },

    // After a frame was drawn.
    frame(out, now) {
      juice.read(out);
      // (The player's body shows in every mode.)
      harm.frame(out, now);
      toys.frame(sim.frame.toolState);
      // (A frame from before the last thing asked of the engine shows the
      // game as it was, not the one just chosen.)
      if (sim.frame.commands < armedAt) return;
      const g = sim.frame.game;
      const on = g[GAME.MODE];
      const live = g[GAME.STATE] === OBJ_STATE.READY || g[GAME.STATE] === OBJ_STATE.RUNNING || g[GAME.STATE] === OBJ_STATE.WON;
      running = live ? on : 0;
      if (on === GAME_MODE.NONE) {
        // The engine is the truth: somebody ended the run. An objective
        // started some other way leaves the mode be.
        if (mode !== 'sandbox' && booted && objective.chosen < 0) mode = 'sandbox';
        score.hide();
        jobs.hide();
        if (tipKey) { tipKey = ''; tip.hidden = true; document.body.classList.remove('tip-up'); }
        if (lit !== playing()) refresh();
        return;
      }
      if (lit !== playing()) refresh();
      const inJob = on === GAME_MODE.JOB;
      const panel = inJob ? jobs : score;
      (inJob ? score : jobs).hide();
      // (The tip about the strike goes once one has been called.)
      if (!inJob && g[GAME.STATE] === OBJ_STATE.RUNNING && (g[GAME.STRIKES] < strikes0 || g[GAME.STRIKES] < 1)) struck = true;
      if (!inJob && g[GAME.STATE] === OBJ_STATE.READY) strikes0 = g[GAME.STRIKES];
      if (!inJob) {
        keepTime(g);
        // The mark under the clock is about now, and goes by what the
        // "slow motion" pill at the top goes by (the governor's last
        // second or so), so that the two never disagree; the round's
        // average is the card's.
        score.slow(ctx.governor && ctx.governor.slow && g[GAME.STATE] === OBJ_STATE.RUNNING ? ctx.governor.speed : 1);
      }
      // (The objective's module sets the belt from the objective each
      // frame; a run of Mayhem has its own tools.)
      if (!inJob && live) state.allowed = MAYHEM_TOOLS;
      events(out, now, inJob);
      const st = g[GAME.STATE];
      if (st === OBJ_STATE.DONE || st === OBJ_STATE.FAILED) {
        if (!carded) {
          if (!doneAt) doneAt = now;
          if (ctx.harness || now - doneAt >= CARD_DELAY) showCard(g);
        }
        // Played on past the card: the world is a sandbox now, and says
        // so (R still starts the run again).
        if (carded && !card.shown) {
          if (state.mode === 'play') {
            resume = mode;
            armedAt = sim.command('objectiveStop');
          }
          panel.hide();
          if (tipKey) { tipKey = ''; tip.hidden = true; document.body.classList.remove('tip-up'); }
          return;
        }
      }
      if (inJob) jobs.frame(job, g, now);
      else score.frame(g, now);
      prompt(g);
    },
  };
}

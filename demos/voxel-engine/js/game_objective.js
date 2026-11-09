// Demolition objectives: the chips that choose one, the panel that follows
// it while it is played, and the score card. The engine keeps the score
// (player/objective.rs); this file only starts objectives and shows state.
// The free sandbox is the default and stays one click away.
import { OBJ, OBJ_STATE, OUT, TALLY, TOOL } from './engine.js';
import { massText, voxelCount } from './game_tally.js';

const BEST_KEY = 'voxel-engine.best.v1';
const ALL_TOOLS = (1 << TOOL.COUNT) - 1;
// A moment between the verdict and the card, to see what one has done.
const CARD_DELAY = 900;
const STAR = '★';

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// "Bring the water tower below 6 m with at most 8 charges."
function sentence(spec) {
  let t = spec.goal === 'below' ? `Bring ${spec.name} below ${spec.value} m` : `Bring down ${Math.round(spec.value * 100)}% of ${spec.name}`;
  if (spec.charges) t += ` with at most ${spec.charges} charges`;
  if (spec.timeLimit) t += ` in under ${spec.timeLimit} s`;
  return t + (spec.tools === 1 << TOOL.CHARGE ? '. Charges only.' : '.');
}

// Stored results are untrusted (old versions, hand edits): keep only
// entries whose every field is a sane number.
function loadBest() {
  const best = {};
  try {
    const raw = JSON.parse(localStorage.getItem(BEST_KEY));
    for (const [key, b] of Object.entries(raw && typeof raw === 'object' ? raw : {})) {
      const ok = b && [b.stars, b.used, b.time, b.charges].every((v) => Number.isFinite(v) && v >= 0) && b.stars <= 3;
      if (ok) best[key] = { stars: b.stars | 0, used: b.used, time: b.time, charges: b.charges };
    }
  } catch {
    // No storage, or not JSON: no bests.
  }
  return best;
}

// hooks: { capture(), setMode(m), restart() } from the game shell.
export function createObjective(ctx, state, scene, hooks) {
  const { sim } = ctx;
  const body = document.body;
  const $ = (id) => document.getElementById(id);
  const panel = $('goal'), titleEl = $('goal-title'), clockEl = $('goal-clock'), fillEl = $('goal-fill');
  const nowEl = $('goal-now'), leftEl = $('goal-left'), arrowEl = $('goal-arrow'), distEl = $('goal-dist'), hintEl = $('goal-hint');
  const card = $('score');
  const specs = [];
  for (let i = 0; ; i++) {
    const s = sim.objectiveSpec(scene, i);
    if (!s) break;
    s.short = capital(s.name.replace(/^the /, ''));
    s.key = `${scene}/${s.name}`;
    specs.push(s);
  }
  const best = loadBest();
  // The plain objectives are no longer offered on the page: the contracts
  // of game_modes.js are the same targets with a bill on them. They can
  // still be started (a link's ?objective=N, `game.objective.begin(i)`),
  // and then this panel and card follow them.
  const boxes = [];
  const chips = [];
  let chosen = -1;
  // Last values written to the DOM, and the card's bookkeeping.
  let shownState = -1, clockKey = -1, nowKey = -1, leftKey = -2, distKey = -1, arrowDeg = 999, fill = -1, button = -1;
  let verdictAt = 0, cardShown = false;
  // Serial of the last command arm() made: frames from before it show the
  // objective as it was, not the one just chosen.
  let armedAt = 0;

  const stars = (n) => STAR.repeat(n);
  // Serial of the last restart: until the sim's frame has reached it, the
  // frame is still the old world's, and the world that is coming is fresh.
  let worldAt = 0;
  const pristine = () => !ctx.lastOut || sim.frame.commands < worldAt || ctx.lastOut[OUT.STAT_FRAME] === 0;

  function refreshChips() {
    for (const { el, i, text, mark } of chips) {
      el.classList.toggle('on', i === chosen);
      if (text) text.textContent = chosen < 0 ? 'No goal: every tool, no clock.' : sentence(specs[chosen]);
      // The best result so far, as stars on the chip.
      if (mark && i >= 0) mark.textContent = best[specs[i].key] ? stars(best[specs[i].key].stars) : '';
    }
  }

  // The engine side of `chosen`, on the world as it is.
  function arm() {
    cardShown = false;
    verdictAt = 0;
    const asked = chosen;
    const settle = () => {
      // (Another choice made while this one was on its way wins.)
      if (chosen !== asked) return;
      if (chosen >= 0) {
        // Whether it took shows in the objective state: one is not handed
        // out on a goal that is already met.
        const os = sim.frame.objective;
        if (os[OBJ.STATE] === OBJ_STATE.IDLE || os[OBJ.INDEX] !== chosen) chosen = -1;
      }
      if (chosen < 0) armedAt = sim.command('objectiveStop');
      state.allowed = chosen < 0 ? ALL_TOOLS : specs[chosen].tools;
      refreshChips();
    };
    if (chosen < 0) {
      settle();
    } else {
      // The answer is in the first frame after the command: at once with
      // the sim on this thread, a frame or two later with it in a worker.
      armedAt = sim.command('objectiveStart', scene, chosen);
      sim.after(armedAt, settle);
    }
  }

  // Play objective `i` (-1: the free sandbox) from a fresh scene. Going
  // back to the sandbox keeps the world as it is.
  function begin(i) {
    chosen = Number.isInteger(i) && i >= 0 && i < specs.length ? i : -1;
    if (chosen >= 0 && !pristine()) hooks.restart();
    else arm();
  }

  for (const box of boxes) {
    if (!specs.length) break;
    const inMenu = !!box.closest('#menu');
    const text = document.createElement('p');
    const head = document.createElement('h3');
    head.textContent = 'Demolition objective';
    box.appendChild(head);
    for (let i = -1; i < specs.length; i++) {
      const el = document.createElement('button');
      el.textContent = i < 0 ? 'Free sandbox' : specs[i].short;
      const mark = document.createElement('small');
      el.appendChild(mark);
      el.addEventListener('click', (ev) => {
        // On the start card a chip only chooses; in the menu it starts.
        ev.stopPropagation();
        begin(i);
        if (inMenu && i >= 0) hooks.capture();
      });
      box.appendChild(el);
      chips.push({ el, i, text: null, mark });
    }
    box.appendChild(text);
    chips.push({ el: text, i: -2, text });
  }
  refreshChips();

  function record(spec, os) {
    const used = spec.charges ? os[OBJ.CHARGES_USED] : os[OBJ.CLOCK];
    const old = best[spec.key];
    const better = !old || os[OBJ.STARS] > old.stars || (os[OBJ.STARS] === old.stars && used < old.used);
    if (!better) return old;
    best[spec.key] = { stars: os[OBJ.STARS], used, time: os[OBJ.CLOCK], charges: os[OBJ.CHARGES_USED] };
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(best));
    } catch {
      // Private browsing: the best lasts for the session.
    }
    refreshChips();
    return best[spec.key];
  }

  function showCard(os) {
    const spec = specs[chosen];
    const won = os[OBJ.STATE] === OBJ_STATE.DONE;
    const t = sim.frame.tally;
    cardShown = true;
    card.classList.toggle('lost', !won);
    $('score-title').textContent = won ? 'Objective complete' : os[OBJ.FAIL] === 1 ? 'Out of time' : 'Out of charges';
    $('score-sub').textContent = sentence(spec);
    $('score-stars').innerHTML = won ? stars(os[OBJ.STARS]) + `<i>${stars(3 - os[OBJ.STARS])}</i>` : '';
    const rows = [
      ['Brought down', `${Math.round(os[OBJ.DOWN] * 100)}%`],
      ['Height', `${os[OBJ.HEIGHT0].toFixed(1)} m → ${os[OBJ.HEIGHT].toFixed(1)} m`],
      ['Time', `${os[OBJ.CLOCK].toFixed(1)} s${spec.timeLimit ? ` of ${spec.timeLimit}` : ''}`],
    ];
    if (spec.charges || os[OBJ.CHARGES_USED]) rows.push(['Charges used', `${os[OBJ.CHARGES_USED]}${spec.charges ? ` of ${spec.charges}` : ''}`]);
    rows.push(['Voxels destroyed', voxelCount(t[TALLY.TOTAL_VOXELS])], ['Pieces', voxelCount(t[TALLY.TOTAL_PIECES])], ['Largest piece', massText(t[TALLY.TOTAL_LARGEST])]);
    const b = won ? record(spec, os) : best[spec.key];
    if (b) rows.push(['Best', `${stars(b.stars)}  ${spec.charges ? `${b.charges} charges` : `${b.time.toFixed(1)} s`}`]);
    const dl = $('score-stats');
    dl.textContent = '';
    for (const [k, v] of rows) {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = v;
      dl.append(dt, dd);
    }
    $('score-next').hidden = specs.length < 2;
    hooks.setMode('score');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  $('score-retry').addEventListener('click', () => { begin(chosen); hooks.capture(); });
  $('score-next').addEventListener('click', () => { begin((chosen + 1) % specs.length); hooks.capture(); });
  $('score-free').addEventListener('click', () => { begin(-1); hooks.capture(); });

  const api = {
    specs,
    get chosen() { return chosen; },
    begin,
    // The engine was rebuilt (restart): the chosen objective starts over.
    restarted(at) {
      worldAt = at;
      arm();
    },

    frame(out, now) {
      if (sim.frame.commands < armedAt) return;
      const os = sim.frame.objective;
      const st = os[OBJ.STATE];
      state.allowed = st === OBJ_STATE.IDLE ? ALL_TOOLS : os[OBJ.TOOLS] | 0;
      if (os[OBJ.BUTTON] !== button) body.classList.toggle('nobutton', !(button = os[OBJ.BUTTON]));
      const over = st === OBJ_STATE.DONE || st === OBJ_STATE.FAILED;
      if (over && !cardShown && chosen >= 0) {
        if (!verdictAt) verdictAt = now;
        if (ctx.harness || now - verdictAt >= CARD_DELAY) showCard(os);
      }
      const show = st !== OBJ_STATE.IDLE && chosen >= 0 && !cardShown ? st : -1;
      if (show !== shownState) {
        shownState = show;
        panel.hidden = show < 0;
        body.classList.toggle('objective', show >= 0);
        panel.classList.toggle('won', st === OBJ_STATE.WON || st === OBJ_STATE.DONE);
        if (show >= 0) {
          const spec = specs[chosen];
          // Another objective may have the same numbers: write them anew.
          clockKey = nowKey = distKey = -1;
          leftKey = -2;
          titleEl.textContent = spec.goal === 'below' ? `Bring ${spec.name} down` : `Flatten ${spec.name}`;
          hintEl.textContent = st === OBJ_STATE.READY ? (spec.timeLimit ? 'The clock starts with your first shot.' : 'Fire places a charge, Alt sets them off.')
            : st === OBJ_STATE.WON ? 'Done. Waiting for it all to come to rest.' : st === OBJ_STATE.FAILED ? (os[OBJ.FAIL] === 1 ? 'Out of time.' : 'Out of charges.') : '';
        }
      }
      if (show < 0) return;
      // Numbers are compared before any text is built: nothing is
      // allocated in a frame that changes nothing.
      const spec = specs[chosen];
      const limit = os[OBJ.TIME_LIMIT];
      const left = limit - os[OBJ.CLOCK];
      const secs = limit > 0 ? Math.max(0, Math.ceil(left)) : Math.floor(os[OBJ.CLOCK]);
      if (secs !== clockKey) {
        clockEl.textContent = clock(clockKey = secs);
        panel.classList.toggle('late', limit > 0 && left < 10);
      }
      const below = spec.goal === 'below';
      const at = below ? Math.round(os[OBJ.HEIGHT] * 10) : Math.round(os[OBJ.DOWN] * 100);
      if (at !== nowKey) {
        nowKey = at;
        nowEl.textContent = below ? `${(at / 10).toFixed(1)} m \u2192 ${spec.value} m` : `${at}% \u2192 ${Math.round(spec.value * 100)}%`;
      }
      const stock = spec.charges ? Math.max(0, os[OBJ.CHARGES_LEFT]) : -1;
      if (stock !== leftKey) leftEl.textContent = (leftKey = stock) < 0 ? '' : `${stock} of ${spec.charges} charges`;
      const f = Math.round(os[OBJ.PROGRESS] * 100);
      if (f !== fill) fillEl.style.transform = `scaleX(${(fill = f) / 100})`;
      // Which way and how far: the target relative to where the camera looks.
      const cam = ctx.renderer.cam;
      const dx = spec.at[0] - cam.pos[0], dz = spec.at[2] - cam.pos[2];
      const ahead = -dx * Math.sin(cam.yaw) - dz * Math.cos(cam.yaw), side = dx * Math.cos(cam.yaw) - dz * Math.sin(cam.yaw);
      const deg = Math.round(Math.atan2(side, ahead) * 36 / Math.PI) * 5;
      if (deg !== arrowDeg) arrowEl.style.transform = `rotate(${arrowDeg = deg}deg)`;
      const dist = Math.round(Math.hypot(dx, dz));
      if (dist !== distKey) distEl.textContent = `${distKey = dist} m`;
    },
  };
  return api;
}

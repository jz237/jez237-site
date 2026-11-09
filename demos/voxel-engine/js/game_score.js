// The score panel of a run of Mayhem (top centre): clock, score, the chain
// multiplier with the fuse that holds it, a pip per structure of the scene
// and the air strikes in hand; and the words that say what just happened.
// The engine keeps the score (player/objective/mayhem.rs); this file shows
// it. DOM writes happen only when a displayed value changes.
import { GAME, OBJ_STATE, SAID } from './engine.js';

const grouped = new Intl.NumberFormat('en-US');
export const points = (n) => grouped.format(Math.round(n));
export const clockText = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export const scoreOf = (g) => g[GAME.SCORE_M] * 1e6 + g[GAME.SCORE];
// How long a line of words stays (ms), and how many can be up at once.
const WORD_MS = 1700;
const WORDS = 4;

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
};

// The words that say what just happened: a few lines under the panel,
// each gone in a moment. Shared by every mode that has something to say.
export function createWords() {
  const words = el('div', '', document.getElementById('ui'));
  words.id = 'mh-words';
  const lines = [];
  return {
    // A line said with a `key` that is still up is rewritten where it is
    // (a fuel line's twenty explosions are one line counting up).
    say(text, cls, now, key = '') {
      let line = key ? lines.find((l) => l.key === key) : null;
      if (line) {
        line.el.textContent = text;
        line.until = now + WORD_MS;
        // (Kept up: its fade starts over without the pop.)
        line.el.style.animation = 'none';
        void line.el.offsetWidth;
        line.el.style.animation = '';
        line.el.style.animationDelay = '-0.2s';
        return;
      }
      line = lines.length < WORDS ? null : lines.shift();
      if (!line) line = { el: el('div', '', words), until: 0, key: '' };
      line.key = key;
      line.el.className = 'mh-word ' + cls;
      line.el.textContent = text;
      // Restart the animation on a reused line.
      line.el.style.animationDelay = '';
      line.el.style.animation = 'none';
      void line.el.offsetWidth;
      line.el.style.animation = '';
      words.appendChild(line.el);
      line.until = now + WORD_MS;
      lines.push(line);
    },
    // Lines whose time is up go.
    tick(now) {
      while (lines.length && now > lines[0].until) lines.shift().el.remove();
    },
    clear() {
      for (const l of lines) l.el.remove();
      lines.length = 0;
    },
  };
}

// names: structure names by plan number ("the house").
// places: where each is, by plan number ([x, y, z] m).
export function createScore(ctx, names, words, places = []) {
  const ui = document.getElementById('ui');
  const panel = el('div', '', ui);
  panel.id = 'mh';
  panel.hidden = true;
  const top = el('div', 'mh-top', panel);
  const clockEl = el('span', 'mh-clock', top);
  const scoreEl = el('b', 'mh-score', top);
  const multEl = el('span', 'mh-mult', top);
  multEl.textContent = 'x1';
  const fuseEl = el('i', '', el('div', 'mh-fuse', panel));
  const foot = el('div', 'mh-foot', panel);
  const pipsEl = el('span', 'mh-pips', foot);
  const strikesEl = el('span', 'mh-strikes', foot);
  // Under the crosshair: the structure that is coming down, and how far
  // it has to go (dust hides the thing itself).
  const targetEl = el('div', '', ui);
  targetEl.id = 'mh-target';
  targetEl.hidden = true;
  const targetName = el('span', '', targetEl);
  const targetFill = el('i', '', el('div', 'mh-target-bar', targetEl));
  // When a run has gone quiet: which way the nearest structure still
  // standing is, and how far (a round's second half was rockets into
  // rubble, with six of nine untouched and nothing saying where).
  const nextEl = el('div', '', ui);
  nextEl.id = 'mh-next';
  nextEl.hidden = true;
  let nextText = '', nextSide = '', nextAt = 0, nextTarget = -1;
  // Quiet: under this many points in a window of this long (ms). (Rockets
  // into rubble still score a little.)
  const QUIET = 3000, QUIET_POINTS = 10000, NEXT_EVERY = 250;
  // Also when no structure has gone or been going for this long (rubble
  // still scores a little, and kept the pointer away for a whole round
  // of somebody firing into it), and past a structure it has pointed at
  // for this long without that one giving anything (the el's span over
  // the player's head, which three rockets do not bring down).
  const NOTHING_GONE = 10000, GIVE_UP = 8000;
  let winAt = 0, winScore = 0, quietRun = false;
  let goneAt = 0, down0 = -1, nextSince = 0, nextFine = -1;
  const skipped = new Set();
  const say = words.say;
  let pips = [];
  // Last values written.
  let shown = false, secs = -1, score = -1, mult = -1, fuse = -1, strikes = -1, late = false, over = false, targets = -1, slipping = false;
  const downKeys = new Int8Array(32).fill(-1);
  // The structure last seen moving, in fiftieths of the way to levelled,
  // and when (ms).
  const fine = new Int8Array(32).fill(-1);
  let moving = -1, movedAt = 0, movingKey = -1;
  // The world is running slow: the clock is the world's, and says so.
  let slowed = false;
  // A burst of chain explosions counts up in one line.
  let chainSum = 0, chainAt = -1e9;

  return {
    panel,
    // A game event (EV.SCORE): what it says in words.
    said(what, value, which, now) {
      if (what === SAID.CHAIN) {
        chainSum = now - chainAt < WORD_MS ? chainSum + value : value;
        chainAt = now;
        say(`Chain reaction  +${points(chainSum)}`, 'chain', now, 'chain');
      } else if (what === SAID.COLLAPSE) say(`Going: ${names[which] || 'a structure'}  ${points(value)} in it`, 'collapse', now);
      else if (what === SAID.LEVELLED) say(`Levelled: ${names[which] || 'a structure'}  +${points(value)}`, 'levelled', now);
      else if (what === SAID.STRIKE) say(value > 0 ? 'Air strike inbound' : value === 0 ? 'Air strike earned' : value < -2.5 ? 'No air strikes left' : value < -1.5 ? 'Air strike: the last one is still coming' : 'Air strike: aim at something', 'strike', now, 'strike');
      else if (what === SAID.SWEEP) say(`Clean sweep  +${points(value)}`, 'levelled', now);
      else if (what === SAID.TIME && !which) say('Time! Still falling counts', 'time', now);
    },
    // speed: the world's share of the wall's pace (1: keeping up).
    slow(speed) {
      const sl = speed < 1;
      if (sl !== slowed) panel.classList.toggle('slowed', slowed = sl);
    },
    hide() {
      if (!shown) return;
      shown = false;
      panel.hidden = true;
      nextEl.hidden = true;
      targetEl.hidden = true;
      moving = -1;
      document.body.classList.remove('mayhem');
      words.clear();
    },
    // g: the engine's game state (GAME).
    frame(g, now) {
      if (!shown) {
        shown = true;
        panel.hidden = false;
        document.body.classList.add('mayhem');
        secs = score = mult = fuse = strikes = targets = -1;
        downKeys.fill(-1);
        fine.fill(-1);
        moving = movingKey = -1;
        targetEl.hidden = true;
        nextEl.hidden = true;
        quietRun = false;
        winAt = 0;
      }
      words.tick(now);
      const st = g[GAME.STATE];
      const left = Math.max(0, g[GAME.TIME] - g[GAME.CLOCK]);
      const s = Math.ceil(left);
      if (s !== secs) {
        clockEl.textContent = clockText(secs = s);
        const l = left < 10 && st === OBJ_STATE.RUNNING;
        if (l !== late) panel.classList.toggle('late', late = l);
      }
      const o = st === OBJ_STATE.WON;
      if (o !== over) panel.classList.toggle('over', over = o);
      const sc = Math.round(scoreOf(g));
      if (sc !== score) scoreEl.textContent = points(score = sc);
      const m = g[GAME.MULT];
      if (m !== mult) {
        const up = m > mult && mult > 0;
        multEl.textContent = `x${mult = m}`;
        multEl.classList.toggle('idle', m <= 1);
        if (up) {
          multEl.classList.remove('bump');
          void multEl.offsetWidth;
          multEl.classList.add('bump');
        }
      }
      const f = m > 1 ? Math.round(g[GAME.FUSE] * 50) : 0;
      if (f !== fuse) fuseEl.style.transform = `scaleX(${(fuse = f) / 50})`;
      // The hold is nearly out: say so once, while there is time to act.
      const slip = m > 1 && f < 17 && st === OBJ_STATE.RUNNING;
      if (slip !== slipping) {
        panel.classList.toggle('slip', slipping = slip);
        if (slip && m >= 3) say('Chain slipping', 'slip', now, 'slip');
      }
      const n = g[GAME.TARGETS];
      if (n !== targets) {
        targets = n;
        pipsEl.classList.toggle('many', n > 16);
        pipsEl.textContent = '';
        pips = [];
        for (let i = 0; i < n; i++) {
          const pip = el('i', '', pipsEl);
          pip.title = names[g[GAME.PLAN + i]] || '';
          pips.push(el('b', '', pip));
        }
      }
      // (Two halves: a float holds sixteen bits of it exactly either way.)
      const mask = g[GAME.MASK] + g[GAME.MASK_HI] * 65536;
      const levelled = (i) => Math.floor(mask / 2 ** i) % 2 === 1;
      for (let i = 0; i < n; i++) {
        // Tenths of the way to levelled; 11 once it is.
        const key = levelled(i) ? 11 : Math.min(10, Math.floor(g[GAME.DOWN + i] / 0.6 * 10));
        if (key === downKeys[i]) continue;
        downKeys[i] = key;
        pips[i].style.transform = `scaleY(${Math.min(1, key / 10)})`;
        pips[i].parentNode.classList.toggle('done', key === 11);
      }
      // Whichever structure moved last is the one being watched.
      for (let i = 0; i < n; i++) {
        const key = Math.min(50, Math.floor(g[GAME.DOWN + i] / 0.6 * 50));
        if (key === fine[i]) continue;
        if (fine[i] >= 0 && key > fine[i]) {
          moving = i;
          movedAt = now;
        }
        fine[i] = key;
      }
      if (moving >= 0 && now - movedAt > 2500) moving = -1;
      // The readout is for the structure the player is looking at (does
      // it count, how far has it to go); with the crosshair on none of
      // them, for whichever moved last.
      const aimed = g[GAME.AIMED];
      const seen = aimed >= 0 && aimed < n && st !== OBJ_STATE.WON ? aimed : moving;
      const mk = seen < 0 ? -1 : seen * 64 + fine[seen];
      if (mk !== movingKey) {
        movingKey = mk;
        targetEl.hidden = seen < 0;
        if (seen >= 0) {
          targetName.textContent = names[g[GAME.PLAN + seen]] || '';
          targetFill.style.transform = `scaleX(${fine[seen] / 50})`;
          targetEl.classList.toggle('done', levelled(seen));
        }
      }
      // The pointer to what still stands, once nothing has scored for
      // three seconds and nothing is on its way down.
      if (now - winAt > QUIET) {
        quietRun = st === OBJ_STATE.RUNNING && winAt > 0 && sc - winScore < QUIET_POINTS;
        winAt = now;
        winScore = sc;
      }
      // (Not while the crosshair is on one that stands: the player has
      // found it.)
      const onOne = aimed >= 0 && aimed < n && !levelled(aimed);
      const downNow = g[GAME.LEVELLED] | 0;
      if (downNow !== down0 || moving >= 0 || st !== OBJ_STATE.RUNNING) {
        if (st !== OBJ_STATE.RUNNING) skipped.clear();
        down0 = downNow;
        goneAt = now;
      }
      const quiet = (quietRun || now - goneAt > NOTHING_GONE) && st === OBJ_STATE.RUNNING && moving < 0 && !onOne;
      if (!quiet) {
        if (!nextEl.hidden) nextEl.hidden = true;
        nextTarget = -1;
      } else {
        const cam = ctx.renderer.cam;
        if (now - nextAt > NEXT_EVERY || nextTarget < 0) {
          nextAt = now;
          let best = -1, bestD = Infinity;
          // (Pointed at long enough with nothing to show for it: the next.)
          if (nextTarget >= 0 && now - nextSince > GIVE_UP && fine[nextTarget] <= nextFine) skipped.add(nextTarget);
          for (let i = 0; i < n; i++) {
            const at = places[g[GAME.PLAN + i]];
            if (!at || levelled(i) || skipped.has(i)) continue;
            const d = Math.hypot(at[0] - cam.pos[0], at[2] - cam.pos[2]);
            if (d < bestD) { bestD = d; best = i; }
          }
          if (best !== nextTarget) {
            nextSince = now;
            nextFine = best < 0 ? -1 : fine[best];
          }
          nextTarget = best;
          const t = best < 0 ? '' : `${names[g[GAME.PLAN + best]] || 'A structure'}  ${Math.round(bestD)} m`;
          if (t !== nextText) nextEl.textContent = nextText = t;
        }
        const at = nextTarget >= 0 ? places[g[GAME.PLAN + nextTarget]] : null;
        if (!at) {
          if (!nextEl.hidden) nextEl.hidden = true;
        } else {
          // Left or right of where the player looks, or ahead.
          const sy = Math.sin(cam.yaw), cy = Math.cos(cam.yaw);
          const dx = at[0] - cam.pos[0], dz = at[2] - cam.pos[2];
          const f = dx * -sy + dz * -cy, r = dx * cy + dz * -sy;
          const a = Math.atan2(r, f);
          const side = Math.abs(a) < 0.45 ? 'ahead' : a < 0 ? 'left' : 'right';
          if (side !== nextSide) nextEl.className = nextSide = side;
          if (nextEl.hidden) nextEl.hidden = false;
        }
      }
      const k = g[GAME.STRIKES];
      if (k !== strikes) {
        strikes = k;
        strikesEl.textContent = '';
        for (let i = 0; i < k; i++) el('i', '', strikesEl);
        strikesEl.classList.toggle('none', k === 0);
      }
    },
  };
}

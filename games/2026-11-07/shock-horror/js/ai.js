// Autopilot. Plays the real game through the same input the player has ({ mx, my, jump, pick, dyn, flare }).
//   'human': reacts about 0.35 s late (a threat only counts once it has been showing that long), with a little
//            random timing and the odd late reaction; detours only for loot that is close. Used by ramp_check.
//   'demo':  sharp and curious: hunts every relic, fossil, wonder and secret, then takes the lift down.
// It plans over the navigation graph (nav.js), whose jumps were probed with the real physics, and replans
// whenever the tiles change (rock broken, gates opened) or it ends up somewhere it did not expect.
import { T, PHYS, TOOLS, STEP, SOLID } from './config.js?v=1';
import { tileAt, solidT, fallHurt } from './physics.js?v=1';
import { buildNav, search, pathTo, nodeAt, probeInput, K_STAND, K_CLIMB, K_SWIM } from './nav.js?v=1';

const D2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
function rngFrom(seed) { let s = seed >>> 0 || 7; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Autopilot {
  constructor(profile = 'human', seed = 1) {
    this.profile = profile;
    this.human = profile === 'human';
    this.r = rngFrom(seed * 7 + 3);
    this.react = this.human ? 0.35 : 0.12;
    this.nav = null; this.navKey = ''; this.plan = []; this.goal = null; this.replanT = 0; this.exec = null;
    this.pickHeld = false; this.t = 0; this.stuckT = 0; this.lastPos = null; this.skip = new Map(); this.wait = 0;
    this.digWait = 0; this.retreat = null; this.late = 0; this.lastFlare = -9; this.lastDyn = -9; this.thinkT = 0;
  }
  // a threat is noticed once it has been visible for the reaction time (plus a rare late moment)
  sees(age) { return age >= this.react + this.late; }

  ensureNav(W) {
    const key = (W.tilesDirty || 0) + ':' + W.M.w + 'x' + W.M.h + ':' + W.level + ':' + W.depth + ':' + W.endlessN + ':' + W.seed;
    if (this.navKey !== key || !this.nav) { if (!this.navKey || this.navKey.split(':').slice(1).join(':') !== key.split(':').slice(1).join(':')) this.bad = new Map(); this.nav = buildNav(W.M); this.navKey = key; this.plan = []; this.exec = null; }
    return this.nav;
  }

  control(W) {
    const P = W.players[0];
    const out = { mx: 0, my: 0, jump: false, pick: false, dyn: false, flare: false };
    this.t += STEP;
    if (P.dead || P.inCage || W.clear || W.over) { this.plan = []; this.exec = null; return out; }
    if (W.exitCage && W.exitCage.state === 'down') return out;
    if (this.r() < 0.002 && this.human) this.late = 0.25 + this.r() * 0.2;
    if (this.late > 0) this.late = Math.max(0, this.late - STEP * 0.5);
    const nav = this.ensureNav(W);

    // 1. dangers first
    if (W.boss && !W.boss.dead) return this.bossControl(W, P, nav, out);
    const d = this.danger(W, P, nav, out);
    if (d) return this.finish(out, P);

    // trapped with nowhere to go: back to the last camp
    if (!this.goal && !this.plan.length) { this.noGoalT = (this.noGoalT || 0) + STEP; if (this.noGoalT > 3) { this.noGoalT = 0; out.camp = true; return this.finish(out, P); } } else this.noGoalT = 0;
    // 2. pick a goal (every so often, or when the plan ran out)
    this.replanT -= STEP;
    if (!this.plan.length || this.replanT <= 0 || !this.goal || this.goalGone(W)) {
      if (!this.exec || this.exec.done || this.exec.kind !== 'probe' || !this.exec.started) this.choose(W, P, nav);
    }
    this.follow(W, P, nav, out);
    // looping between goals without getting anywhere new: drop the side quests and head for the lift for a while
    const reg = Math.floor(P.x / 4) + ',' + Math.floor(P.y / 4) + ':' + W.level + ':' + W.depth;
    if (!this.regions || this.regionLvl !== W.seed) { this.regions = new Set(); this.regionLvl = W.seed; this.newRegT = this.t; }
    if (!this.regions.has(reg)) { this.regions.add(reg); this.newRegT = this.t; }
    if (this.t - this.newRegT > 45) { this.exitOnlyUntil = this.t + 90; this.newRegT = this.t; this.goal = null; this.plan = []; this.exec = null; }
    // stuck detection: no progress for 3 s -> forget this goal for a while
    const pos = Math.floor(P.x) + ',' + Math.floor(P.y);
    if (pos === this.lastPos) this.stuckT += STEP; else { this.stuckT = 0; this.lastPos = pos; }
    if (this.goal && this.goal.kind !== 'exit' && this.t - (this.goalT ?? this.t) > 35) { this.skip.set(this.goal.key, this.t + 90); this.goal = null; this.plan = []; this.exec = null; }
    if (this.stuckT > 3.5 && this.goal) { this.skip.set(this.goal.key, this.t + 25); this.goal = null; this.plan = []; this.exec = null; this.stuckT = 0; out.jump = true; }
    return this.finish(out, P);
  }
  finish(out, P) {
    // the pick fires on a press: never hold it two ticks running
    if (out.pick && this.pickHeld) out.pick = false;
    this.pickHeld = out.pick;
    if (out.dyn && this.dynHeld) out.dyn = false; this.dynHeld = out.dyn;
    if (out.flare && this.flareHeld) out.flare = false; this.flareHeld = out.flare;
    return out;
  }

  // ------------------------------------------------------------ goals
  goalGone(W) {
    const g = this.goal;
    if (!g) return true;
    if (g.obj && (g.obj.got || g.obj.dead)) return true;
    if (g.kind === 'fossil' && tileAt(W.M, Math.floor(g.obj.x), Math.floor(g.obj.y)) !== T.FOSSIL) return true;
    return false;
  }
  choose(W, P, nav) {
    const M = W.M;
    const from = nodeAt(nav, M, P.x, P.y);
    if (from < 0) { this.plan = []; return; }
    const boots = P.up.boots || 0;
    const bad = this.bad || (this.bad = new Map());
    const res = search(nav, from, { cost: (e, i) => {
      if ((bad.get(i + ':' + e.to) || 0) >= 2) return Infinity;   // a move that has failed twice here: find another way
      if (e.act === 'dig') { if (e.need === 'dyn' && P.dyn <= 0) return Infinity; if (e.need === 'key' && !P.keys.length) return Infinity; }
      if (e.fall) { const h = fallHurt(e.fall, boots); if (h >= 99) return Infinity; if (h > 0) return e.cost + (h >= P.hp ? 1e4 : 40); }
      if (e.spikes) return e.cost + 12;
      return e.cost;
    } });
    const cands = [];
    const add = (kind, obj, x, y, value, key) => {
      if (this.skip.has(key) && this.skip.get(key) > this.t) return;
      let n = nodeAt(nav, M, x, y);
      if (kind === 'fossil') { n = -1; for (const [dx, dy] of [[-1, 0], [1, 0], [0, 1], [-1, -1], [1, -1]]) { const i = (Math.floor(y) + dy) * M.w + Math.floor(x) + dx; if (i >= 0 && nav.kind[i] === K_STAND && res.dist[i] < Infinity && (n < 0 || res.dist[i] < res.dist[n])) n = i; } }
      if (n < 0 || !(res.dist[n] < Infinity)) return;
      cands.push({ kind, obj, node: n, cost: res.dist[n], value, key, x, y });
    };
    const demo = !this.human;
    const oilLow = P.oil < P.oilMax * (demo ? 0.4 : 0.32);
    const exitOnly = this.t < (this.exitOnlyUntil || 0);
    if (!exitOnly) for (const l of W.loot) {
      if (l.got || l.fly) continue;
      let v = 0;
      if (l.k === 'gold') v = 3; else if (l.k === 'gem') v = 6; else if (l.k === 'chest') v = 12;
      else if (l.k === 'oil') v = oilLow ? 30 : (P.oil < P.oilMax * 0.7 ? 3 : 0);
      else if (l.k === 'heart') v = P.hp < P.maxHp ? (P.hp <= 1 ? 25 : 8) : 0;
      else if (l.k === 'dyn') v = P.dyn < P.dynMax ? (P.dyn < 2 ? 6 : 2) : 0;
      else if (l.k === 'flare') v = P.flares < P.flareMax ? (P.flares < 2 ? 5 : 1.5) : 0;
      if (v > 0) add('loot', l, l.x, l.y, v, 'l' + l.id);
    }
    if (!exitOnly) for (const f of W.finds) {
      if (f.got || (f.kind === 'cache' && !W.mapFound)) continue;
      if (f.kind === 'cache') add('cache', f, f.x, f.y + 1, demo ? 45 : 24, 'f' + f.id);
      else add(f.kind, f, f.x, f.y, demo ? 40 : 22, 'f' + f.id);
    }
    if (!exitOnly) for (const k of W.keys) if (!k.got) add('key', k, k.x, k.y, demo ? 20 : 4, 'k' + k.id);
    for (const c of W.camps) if (!c.lit) add('camp', c, c.x, c.y, 10, 'c' + c.id);
    if (P.dyn < 1) for (const k of W.kegs) add('keg', k, k.x, k.y, 4, 'g' + k.id);
    // the exit (always a candidate, worth more as the level drags on)
    if (M.exit) for (const ex of [M.exit.x - 0.5, M.exit.x + 0.5]) add('exit', null, ex, M.exit.y, (demo ? 2 + W.t / 40 : 2 + W.t / 35) + (W.t > 300 ? 200 : 0), 'exit');
    // score: value per second of travel; humans dislike long detours
    let best = null, bs = -1e9;
    for (const c of cands) {
      // people explore: they go after finds and loot a good way off the path (the demo even more so)
      const s = c.value - c.cost * (this.human ? 0.85 : 0.55);
      if (s > bs) { bs = s; best = c; }
    }
    if (best && (!this.goal || this.goal.key !== best.key)) this.goalT = this.t;
    this.goal = best;
    this.plan = best ? pathTo(res, best.node) : [];
    this.exec = null;
    this.replanT = 1.2;
  }

  // ------------------------------------------------------------ following the plan
  follow(W, P, nav, out) {
    const M = W.M;
    if (!this.plan.length) {
      // at the goal: dig a fossil, stand on the exit cage
      const g = this.goal;
      if (g && g.kind === 'cache') {
        // stand on the X and dig straight down
        const dx = g.obj.x - P.x;
        if (Math.abs(dx) > 0.22) { out.mx = Math.max(-1, Math.min(1, dx * 3)); return; }
        out.my = -1; if (P.ground && Math.abs(P.vx) < 0.5) out.pick = true;
        return;
      }
      if (g && g.kind === 'fossil') {
        const fx = Math.floor(g.obj.x), fy = Math.floor(g.obj.y);
        const dx = fx + 0.5 - P.x;
        out.mx = Math.abs(dx) > 1.2 ? Math.sign(dx) : 0;
        if (fy >= Math.floor(P.y + 1.5)) out.my = 1; else if (fy < Math.floor(P.y)) out.my = -1;
        if (Math.abs(dx) < 1.3 && P.ground) { if (Math.sign(dx) !== P.face && Math.abs(dx) > 0.3) out.mx = Math.sign(dx) * 0.3; else out.pick = true; }
      } else if (g && g.kind === 'exit') {
        out.mx = Math.max(-1, Math.min(1, (M.exit.x - P.x) * 2));
        if (P.state === 'climb') { out.my = -1; out.mx = 0; }
      }
      return;
    }
    let e = this.plan[0];
    const tx = (e.to % nav.W), ty = Math.floor(e.to / nav.W);
    const here = nodeAt(nav, M, P.x, P.y);
    if (!this.exec) this.exec = { kind: e.act, t: 0, started: false, body: {}, x0: 0 };
    const X = this.exec;
    X.t += STEP;
    const arrive = () => { this.plan.shift(); this.exec = null; };
    const centerX = tx + 0.5;
    if (e.act === 'walk' || e.act === 'stepoff') {
      out.mx = Math.sign(centerX - P.x) || e.dir;
      if (Math.abs(centerX - P.x) < 0.45 && Math.floor(P.x) === tx) arrive();
      if (X.t > 2.5) { this.fail(e); }
      // a crawler in the way: swing at it
      this.swatAhead(W, P, out);
      return;
    }
    if (e.act === 'climb') {
      const lx = Math.floor(P.x) === tx ? tx + 0.5 : tx + 0.5;
      if (P.state !== 'climb') { out.mx = Math.max(-1, Math.min(1, (lx - P.x) * 4)); out.my = e.dir; }
      else out.my = e.dir;
      if (Math.floor(P.x) === tx && Math.abs(P.y - ty) < 0.12) arrive();
      else if (P.state !== 'climb' && P.ground && Math.round(P.y) === ty && Math.floor(P.x) === tx) arrive();
      if (X.t > 2.5) { this.fail(e); }
      return;
    }
    if (e.act === 'swim' || e.act === 'grab') {
      out.mx = Math.max(-1, Math.min(1, (centerX - P.x) * 2));
      if (ty + 0.2 > P.y + 0.3) out.my = 1;
      if (e.act === 'grab') out.my = 1;
      if (Math.floor(P.x) === tx && Math.abs(Math.floor(P.y + 0.6) - ty) <= 0) arrive();
      if (P.state === 'climb' && e.act === 'grab') arrive();
      if (X.t > 3) { this.fail(e); }
      return;
    }
    if (e.act === 'hop') {
      out.mx = e.dir || Math.sign(centerX - P.x); out.jump = X.t % 0.3 < 0.15; out.my = 1;
      if ((P.ground && !P.inWater) || (e.grab && P.state === 'climb')) arrive();
      if (X.t > 3) { this.fail(e); }
      return;
    }
    if (e.act === 'dig') {
      // stand next to the wall facing it
      const sx = Math.floor(P.x);
      const wallX = sx + e.dir;
      const still = e.cells.filter(([cx, cy]) => SOLID[tileAt(M, cx, cy)]);
      if (!still.length) { e.act = 'walk'; this.exec = null; return; }
      const near = still.reduce((a, c) => (Math.abs(c[0] + 0.5 - P.x) < Math.abs(a[0] + 0.5 - P.x) ? c : a));
      if (e.need === 'key') { out.mx = e.dir; if (X.t > 3) { this.fail(e); } return; }
      if (e.need === 'dyn' && tileAt(M, near[0], near[1]) === T.HARD) {
        // one stick at a time: wait for the last one to go off
        if (this.t - this.lastDyn < TOOLS.dynFuse + 1.2) return;
        if (!X.thrown) {
          // walk right up to the boulder and set the stick down against it
          if (Math.abs(near[0] + 0.5 - P.x) > 0.95) { out.mx = e.dir * (Math.abs(near[0] + 0.5 - P.x) > 1.4 ? 1 : 0.4); return; }
          if (P.face !== e.dir) { out.mx = e.dir * 0.3; return; }
          if (P.dyn <= 0) { this.plan = []; return; }
          out.dyn = true; out.my = -1; X.thrown = this.t; this.lastDyn = this.t;
          return;
        }
        // the fuse logic in danger() walks us clear; once it has gone off, plan again
        if (this.t - X.thrown < TOOLS.dynFuse + 0.6) return;
        this.plan = []; this.exec = null; return;
      }
      // pick it out
      if (Math.abs(near[0] + 0.5 - P.x) > 1.35) { out.mx = e.dir; return; }
      if (P.face !== e.dir) { out.mx = e.dir * 0.3; return; }
      out.pick = true;
      if (near[1] >= Math.floor(P.y + 1.4)) out.my = 1;
      if (X.t > 10) { const k = (e.from ?? -1) + ':' + e.to; (this.bad ||= new Map()).set(k, ((this.bad.get(k)) || 0) + 1); this.plan = []; this.exec = null; }
      return;
    }
    if (e.act === 'probe') {
      // line up exactly where the probe started, then replay its input
      if (!X.started) {
        const sn = e.from ?? here;
        const scx = (sn % nav.W) + 0.5;
        // not where this jump starts (knocked off course): plan again
        if (here !== sn && Math.abs(Math.floor(sn / nav.W) - Math.floor(P.y + 0.02)) > 0) { this.plan = []; this.exec = null; return; }
        if (e.pk === 'cj') {
          if (P.state !== 'climb') { out.my = 1; out.mx = Math.max(-1, Math.min(1, (scx - P.x) * 4)); }
          X.started = P.state === 'climb'; X.x0 = scx;
          if (!X.started) { if (X.t > 1.5) { this.fail(e); } return; }
        } else {
          const dx = scx - P.x;
          if (X.slop === undefined) X.slop = this.human && this.r() < 0.065 ? 0.22 + this.r() * 0.2 : 0.05;
          if (Math.abs(dx) > X.slop || Math.abs(P.vx) > (X.slop > 0.1 ? 2 : 0.3) || !P.ground) {
            out.mx = Math.abs(dx) > 0.05 ? Math.max(-1, Math.min(1, dx * 6)) * (Math.abs(dx) < 0.25 ? 0.35 : 1) : 0;
            if (X.t > 2.2) { this.fail(e); }
            return;
          }
          X.started = true; X.x0 = scx;
          // humans hesitate a moment before a jump
          X.delay = this.human ? this.r() * 0.12 : 0;
        }
        X.ts = this.t;
      }
      if (X.delay > 0) { X.delay -= STEP; return; }
      const tt = this.t - X.ts - STEP;
      const proxy = { x: P.x, runT: X.runT };
      const inp = probeInput(e.pk, e.mx, tt, proxy, X.x0);
      X.runT = proxy.runT;
      out.mx = inp.mx; out.jump = inp.jump; out.my = inp.my;
      const settled = P.ground || P.inWater || P.state === 'climb';
      if (!settled) X.left = true;
      if (tt > 0.1 && settled && (X.left || Math.abs(P.vx) < 0.5)) {
        const now = nodeAt(nav, M, P.x, P.y);
        if (now === e.to) arrive();
        else if (nav.kind[e.to] === K_SWIM && P.inWater) { this.plan = []; this.exec = null; }   // any splash-down in that water will do
        else { const k = (e.from ?? -1) + ':' + e.to; (this.bad ||= new Map()).set(k, ((this.bad.get(k)) || 0) + 1); this.plan = []; this.exec = null; }
      }
      if (tt > 3.5) { this.fail(e); }
      return;
    }
    this.plan = []; this.exec = null;
  }
  fail(e) { const k = (e.from ?? -1) + ':' + e.to; (this.bad ||= new Map()).set(k, (this.bad.get(k) || 0) + 1); this.plan = []; this.exec = null; }
  swatAhead(W, P, out) {
    for (const c of W.crawlers) {
      if (c.dead) continue;
      const dx = c.x - P.x;
      if (Math.abs(c.y - P.y) < 0.8 && Math.sign(dx) === P.face && Math.abs(dx) < 1.45 && this.sees(c.t)) { out.pick = true; out.mx = 0; }
    }
  }

  // ------------------------------------------------------------ reacting to danger (non-boss levels)
  danger(W, P, nav, out) {
    const px = P.x, py = P.y;
    // a falling or shaking stalactite above: step out from under it
    for (const s of W.stalac) {
      if ((s.st === 'shake' && this.sees(s.t)) || s.st === 'fall') {
        if (Math.abs(s.x - px) < 1.1 && s.y > py && s.y < py + 12) { out.mx = this.escapeDir(W, P, s.x); return true; }
      }
      // do not walk under one that is shaking
      if (s.st === 'shake' && this.sees(s.t) && Math.abs(s.x - px) < 2.2 && s.y > py && s.y < py + 12 && Math.sign(s.x - px) === Math.sign(this.heading(P))) { out.mx = 0; return true; }
    }
    for (const g of W.geysers) {
      const near = Math.abs(g.x - px) < 1.15 && py >= g.y - 0.5 && py < g.y + 4;
      if ((g.st === 'warn' && this.sees(g.t)) || g.st === 'erupt') {
        if (near) { out.mx = this.escapeDir(W, P, g.x); return true; }
        if (Math.abs(g.x - px) < 2.3 && Math.abs(g.y - py) < 1 && Math.sign(g.x - px) === Math.sign(this.heading(P))) { out.mx = 0; return true; }
      }
    }
    // bats: swing at a swooping bat close in front; flare a crowd
    let close = 0;
    for (const b of W.bats) {
      if (b.st === 'dead' || b.st === 'hang' || b.st === 'return' || b.st === 'flee') continue;
      const dd = D2(b.x, b.y, px, py + 0.9);
      if (dd < 36) close++;
      if ((b.st === 'swoop' || b.st === 'circle' || (b.st === 'wake' && this.sees(b.t))) && dd < 2.4 * 2.4) {
        const dir = Math.sign(b.x - px) || P.face;
        if (P.face !== dir) { out.mx = dir * 0.4; return true; }
        // a person swings once as it comes in, a little early or late, then has to wait for the pick to come round
        if (this.human) {
          if (this.t < (this.swingWait || 0)) return true;
          if (this.swingAt === undefined || this.swingFor !== b.id) { this.swingFor = b.id; this.swingAt = 1.1 + (this.r() - 0.5) * 1.3; }
          if (Math.sqrt(dd) > this.swingAt) return true;
          this.swingWait = this.t + 0.65; this.swingAt = undefined; this.swingFor = null;
        }
        out.pick = true; out.my = b.y > py + 2 ? 1 : 0; return true;
      }
    }
    if (close >= 2 && P.flares > 0 && this.t - this.lastFlare > 6 && P.ground) { out.flare = true; out.my = -1; this.lastFlare = this.t; return true; }
    // shades: light a flare when one drifts close
    for (const s of W.shades) {
      if (s.dead || s.st !== 'drift') continue;
      const dd = D2(s.x, s.y, px, py + 1);
      if (dd < 7 * 7 && this.sees(s.t)) {
        if (P.flares > 0 && this.t - this.lastFlare > 4 && P.state !== 'climb') { out.flare = true; out.my = -1; this.lastFlare = this.t; return true; }
      }
    }
    // eels: do not stand by a rippling pool
    for (const e of W.eels) {
      if (e.st === 'warn' && this.sees(e.t) && Math.abs(e.hx - px) < 3.4 && py > e.hy - 1.5 && py < e.hy + 4) { out.mx = this.escapeDir(W, P, e.hx); return true; }
    }
    // a lit fuse nearby: walk the shortest real path to a spot well clear of it, then wait
    for (const b of W.bombs) {
      if (b.dead) continue;
      if (D2(b.x, b.y, px, py + 0.8) < 4.4 * 4.4 && b.fuse < TOOLS.dynFuse - (this.human ? 0.3 : 0.1)) {
        if (!this.retreat || this.retreat.bomb !== b.id) {
          const from = nodeAt(nav, W.M, px, py);
          const res = from >= 0 ? search(nav, from, { cost: (e) => (e.act === 'dig' || (e.fall && fallHurt(e.fall, P.up.boots || 0) > 0)) ? Infinity : e.cost, stopAt: (i) => { const x = i % nav.W + 0.5, y = Math.floor(i / nav.W) + 0.8; return D2(x, y, b.x, b.y) > 4.6 * 4.6; } }) : null;
          this.retreat = { bomb: b.id, plan: res && res.found >= 0 ? pathTo(res, res.found) : [] };
          this.plan = this.retreat.plan; this.exec = null;
        }
        if (this.plan.length) this.follow(W, P, nav, out); else out.mx = this.escapeDir(W, P, b.x);
        return true;
      }
    }
    if (this.retreat && !W.bombs.some((b) => !b.dead && b.id === this.retreat.bomb)) { this.retreat = null; this.plan = []; this.exec = null; }
    return false;
  }
  heading(P) { const e = this.plan[0]; if (!e) return 0; if (e.dir) return e.dir; if (e.mx) return e.mx; return Math.sign((e.to % this.nav.W) + 0.5 - P.x); }
  escapeDir(W, P, fromX) {
    const d = P.x >= fromX ? 1 : -1;
    // prefer the side with floor
    const M = W.M, y = Math.round(P.y);
    const ok = (dir) => !solidT(M, Math.floor(P.x + dir * 1.2), y) && (solidT(M, Math.floor(P.x + dir * 1.2), y - 1) || tileAt(M, Math.floor(P.x + dir * 1.2), y - 1) === T.PLANK || tileAt(M, Math.floor(P.x + dir * 1.2), y - 1) === T.LADDER);
    if (ok(d)) return d;
    if (ok(-d)) return -d;
    return d;
  }

  // ------------------------------------------------------------ boss fights
  bossControl(W, P, nav, out) {
    const B = W.boss, A = W.M.arena, fy = A.floorY;
    const px = P.x, py = P.y;
    if (B.st === 'sleep' || B.st === 'intro') { out.mx = Math.sign(A.x0 + 10 - px) * (Math.abs(A.x0 + 10 - px) > 0.5 ? 1 : 0); return this.finish(out, P); }
    // threats from the zones the boss marks: find the nearest spot on this floor nothing marked will hit soon
    const M = W.M;
    const danger = (x, horizon) => {
      for (const z of W.zones) {
        if (z.dead || !this.sees(z.t)) continue;
        const left = z.warn - z.t;
        if (left > horizon || left < -z.dur) continue;
        if (z.shape === 'circle') { if (Math.abs(x - z.x) < z.r + 0.75 && Math.abs(z.y - (py + 0.8)) < z.r + 1.3) return true; }
        else if (z.shape === 'rect' && !z.vx) { const high = z.y0 >= py + 1.7, low = z.y1 < py - 0.1, knee = z.y1 <= py + 1.05; if (!high && !low && !knee && x + 0.5 > z.x0 && x - 0.5 < z.x1) return true; }
      }
      if (B.kind === 'warden' && B.st !== 'stuck' && Math.abs(x - B.x) < 2.0 && py < fy + 2) return true;
      if (B.kind === 'gloomwing' && B.st === 'swoop' && Math.abs(x - B.x) < 2.2 && Math.abs(B.y - py - 1) < 3) return true;
      return false;
    };
    const floorAt = (x) => { const fx = Math.floor(x), fyy = Math.round(py) - 1; return x > A.x0 + 0.6 && x < A.x1 - 0.6 && !solidT(M, fx, fyy + 1) && (solidT(M, fx, fyy) || tileAt(M, fx, fyy) === T.LADDER || tileAt(M, fx, fyy) === T.WATER); };
    let flee = null, jumpNow = false;
    // a jump is held for a moment (a tap would only hop)
    this.jumpHold = Math.max(0, (this.jumpHold || 0) - STEP);
    if (this.jumpHold > 0 && !P.ground) { out.jump = true; out.mx = this.jumpDir || 0; return this.finish(out, P); }
    // low static bands (a beam at knee height): jump just as they fire instead of running
    for (const z of W.zones) {
      if (z.dead || z.vx || z.shape !== 'rect' || !this.sees(z.t)) continue;
      const left = z.warn - z.t;
      if (z.y1 <= py + 1.05 && z.y1 > py - 0.1 && px + 0.5 > z.x0 && px - 0.5 < z.x1 && left < 0.2 && left > -0.1 && P.ground) { this.jumpHold = 0.4; this.jumpDir = 0; out.jump = true; return this.finish(out, P); }
    }
    if (P.ground || P.inWater) {
      if (danger(px, 1.5)) {
        let best = null;
        for (let d = 0.5; d <= 16 && best === null; d += 0.5) {
          for (const sgn of [1, -1]) {
            const x = px + sgn * d;
            // walk there along the floor: stop at a gap or wall
            let ok = true; for (let xx = px; Math.abs(xx - x) > 0.25; xx += sgn * 0.5) if (!floorAt(xx)) { ok = false; break; }
            if (ok) for (const z of W.zones) {
              if (z.dead || z.shape !== 'circle' || !this.sees(z.t) || Math.abs(z.y - (py + 0.8)) > z.r + 1.3) continue;
              if (Math.abs(z.x - px) < z.r + 0.45) continue;   // the one we are in: we are leaving it
              const lo = Math.min(px, x), hi = Math.max(px, x);
              if (z.x + z.r + 0.45 < lo || z.x - z.r - 0.45 > hi) continue;
              const cross = Math.max(0, Math.abs(z.x - px) - z.r - 0.45) / 4.3, out2 = (Math.abs(z.x - px) + z.r + 0.45) / 4.3, left = z.warn - z.t;
              if (left < out2 + 0.1 && left + z.dur > cross - 0.1) { ok = false; break; }
            }
            if (ok && floorAt(x) && !danger(x, 1.5) && !danger(x + sgn * 0.6, 1.5)) { best = x; break; }
          }
        }
        if (best !== null) flee = Math.sign(best - px);
        else {
          // nowhere fully safe: get away from the nearest mark
          let nz = null; for (const z of W.zones) if (!z.dead && z.shape === 'circle' && (!nz || Math.abs(z.x - px) < Math.abs(nz.x - px))) nz = z;
          flee = nz ? (px >= nz.x ? 1 : -1) : null;
          if (flee !== null && !floorAt(px + flee * 0.8)) flee = -flee;
        }
      }
      // rolling bands (waves, shockwaves, surges): jump as they come
      for (const z of W.zones) {
        if (z.dead || !z.vx || !this.sees(z.t) || z.t < z.warn - 0.1) continue;
        if (z.y1 < py - 0.1 || z.y0 > py + 1.6) continue;
        const front = z.vx > 0 ? z.x1 : z.x0, dist = z.vx > 0 ? px - front : front - px;
        if (dist > -0.4 && dist < Math.abs(z.vx) * 0.24 + 0.75 && P.ground) jumpNow = true;
      }
    }
    if (jumpNow && P.ground) { this.jumpHold = 0.42; this.jumpDir = flee ?? 0; }
    if (flee !== null) {
      out.mx = flee; if (jumpNow) out.jump = true;
      if (P.state === 'climb') { out.mx = 0; out.my = -1; }
      return this.finish(out, P);
    }
    if (jumpNow) { out.jump = true; return this.finish(out, P); }
    const safeHere = (x) => !danger(x, 1.2);
    // the weak point is open: get to it and swing
    const w = B.weak;
    if (B.vuln > 0.25 || (B.kind === 'gloomwing' && B.st === 'fallen')) {
      const side = px < w.x ? -1 : 1;
      const want = w.x + side * 0.9;
      const dx = want - px;
      if (Math.abs(dx) > 0.35 && safeHere(px + Math.sign(dx) * 0.8)) out.mx = Math.sign(dx);
      else if (P.face !== -side) out.mx = -side * 0.3;
      if (Math.abs(px - w.x) < 1.9) {
        if (w.y > py + 2.1 && P.ground) { out.jump = true; this.jumpHold = 0.4; this.jumpDir = 0; }
        if (w.y > py + 2.4) out.my = 1;
        if (P.face === Math.sign(w.x - px) || Math.abs(w.x - px) < 0.4) out.pick = true;
      }
      return this.finish(out, P);
    }
    // Gloomwing: a flare near the low point of her swoop knocks her down
    if (B.kind === 'gloomwing' && P.flares > 0) {
      const z = W.zones.find((zz) => !zz.dead && zz.shape === 'curve');
      if (z && this.sees(z.t) && z.t < z.warn) {
        const bx = (z.x0 + 2 * z.x1 + z.x2) / 4;
        const want = bx + (px < bx ? -3.2 : 3.2);
        if (Math.abs(want - px) > 0.6) out.mx = Math.sign(want - px);
        else if (this.t - this.lastFlare > 1.5) { if (P.face !== Math.sign(bx - px)) out.mx = Math.sign(bx - px) * 0.3; else { out.flare = true; this.lastFlare = this.t; } }
        return this.finish(out, P);
      }
    }
    // dynamite at an exposed weak point in range
    const dist = Math.abs(w.x - px);
    if (!B.hidden && P.dyn > 0 && this.t - this.lastDyn > 3 && dist > 2.4 && dist < 4.8 && Math.abs(w.y - (py + 1)) < 3.2 && P.ground && B.kind !== 'gloomwing') {
      if (P.face !== Math.sign(w.x - px)) out.mx = Math.sign(w.x - px) * 0.3;
      else { out.dyn = true; this.lastDyn = this.t; }
      return this.finish(out, P);
    }
    // otherwise keep a sensible distance and wait
    let home = B.kind === 'gloomwing' ? (A.x0 + A.x1) / 2 + Math.sin(this.t * 0.3) * 8 : (B.hidden ? px : B.x + (px < B.x ? -5 : 5));
    home = Math.max(A.x0 + 2.5, Math.min(A.x1 - 2.5, home));
    if (P.dyn < 1) { const k = W.kegs.find((g) => g.what === 'dyn'); if (k) home = k.x; }
    if (B.kind === 'gloomwing' && P.flares < 1) { const k = W.kegs.find((g) => g.what === 'flare'); if (k) home = k.x; }
    if (Math.abs(home - px) > 0.8 && safeHere(px + Math.sign(home - px) * 0.8)) out.mx = Math.sign(home - px);
    // off a ledge or out of the pool: just walk; climb down ladders if stuck high
    if (Math.abs(py - fy) > 0.3 && P.state === 'climb') out.my = -1;
    return this.finish(out, P);
  }
}

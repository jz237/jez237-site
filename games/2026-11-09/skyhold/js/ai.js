// Autopilot: flies a Warden gunship from the world state alone, through the same controls a player has.
// It always has ONE goal it can say in a sentence (debug.intent) and one thing it is going for (debug.target):
//   CATCH    a settler is falling: get under it        LAND    carrying a settler: dive and set it down
//   RESCUE   a lifter has a settler: shoot it down      DEFEND  a lifter is going down for a settler
//   FIGHT    something dangerous is close              HUNT    go after the nearest machine
//   CARRIER  line up on a weak point and fire          PATROL  nothing to do: fly toward the colony
// On top of the goal a safety layer dodges bolts, keeps off machines' hulls, steps out of a carrier's beam
// sweep or rush, and lets off a NOVA when it is swamped (debug.dodge says which).
//   'human' — plays like a person: ~0.35 s reaction (scattered, sometimes late), wobbly altitude, misses things
//             behind it, saves novas too long. The difficulty ramp is measured with this one.
//   'demo'  — the attract mode: sharp and decisive. It never reads the world's random generator (replays stay exact).
import { F, ENEMY, BOSSES, H, SHIPS } from './config.js?v=10';
import { wd, wp, nodePos, beamRange } from './sim.js?v=10';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PROFILES = {
  human: { react: 0.36, jit: 0.12, late: 0.16, lateT: 0.32, blind: 0.4, aimErr: 0.42, wob: 0.55, dodge: 1.6, nova: 5, novaDanger: 0.35, stand: 17, greed: 0.6, slow: 0.82, catchK: 0.85 },
  demo: { react: 0.12, jit: 0.04, late: 0, lateT: 0, blind: 0.05, aimErr: 0.12, wob: 0.15, dodge: 2.4, nova: 4, novaDanger: 1, stand: 15, greed: 1, slow: 1, catchK: 1 },
};
const DANGER = new Set(['husk', 'prowler', 'stinger']);

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.r = mkr(seed * 7919 + 13);
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.seen = new Map();
    this.goal = null; this.goalT = 0; this.wob = 0; this.wobT = 0; this.yErr = 0;
    this.debug = { intent: '', target: null, dodge: '' };
    this.novaWas = false; this.blinkWas = false; this.dodgeY = 0; this.dodgeT = 0;
  }
  // has the pilot noticed thing `id` yet? things behind it are noticed later, sometimes much later
  notice(W, id, x, me) {
    let t = this.seen.get(id);
    if (t === undefined) {
      const P = this.P, dx = wd(x - me.x);
      let d = P.react + (this.r() * 2 - 1) * P.jit + (this.r() < P.late ? P.lateT : 0);
      if (dx * me.face < 0 && Math.abs(dx) > 12 && this.r() < P.blind) d += 0.4 + this.r() * 0.5;
      t = W.t + d;
      this.seen.set(id, t);
      if (this.seen.size > 600) { for (const k of this.seen.keys()) { this.seen.delete(k); if (this.seen.size < 300) break; } }
    }
    return W.t >= t;
  }
  pick(W, me) {
    const P = this.P;
    let best = null, why = '', score = -1e9;
    const consider = (o, s, w) => { if (s > score) { score = s; best = o; why = w; } };
    // settlers in trouble
    if (me.carry) return { kind: 'land', tgt: null, why: 'Setting the settler down safely' };
    for (const s of W.settlers) {
      if (s.st !== 'fall' || !this.notice(W, 's' + s.id, s.x, me)) continue;
      const d = Math.abs(wd(s.x - me.x)), safe = s.dropY <= W.R.safeH;
      const tLand = s.y / Math.max(0.5, W.R.fallV), tGo = d / F.vmax + 0.6;
      if (tGo > tLand + 0.4) continue;
      consider({ kind: 'settler', o: s }, (safe ? 400 : 900) * P.catchK - d * 2, safe ? 'Catching a falling settler for points' : 'Catching a falling settler before it hits the ground');
    }
    const B = W.boss;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.type === 'mine') continue;
      if (!this.notice(W, e.id, e.x, me)) continue;
      const d = Math.abs(wd(e.x - me.x));
      if (e.born > 0 && d > 30) continue;
      let s = -d;
      let w = 'Hunting the nearest machine';
      if (e.type === 'lifter') {
        if (e.st === 'lift') { s = 700 + (e.y / H) * 300 - d * 1.2; w = 'A lifter has a settler: shooting it down'; }
        else if (e.st === 'grab' || e.st === 'down') { s = 520 - d * 1.1; w = 'Stopping a lifter going down for a settler'; }
        else if (e.st === 'seek') s = 120 - d;
        else s = 40 - d;
      } else if (DANGER.has(e.type) && d < 34) { s = 600 - d * 6; w = 'Fighting off a ' + e.type.toUpperCase() + ' that is on us'; }
      else if (e.type === 'hive') s = 80 - d;
      else if (e.type === 'sower') s = 60 - d;
      else if (e.type === 'skimmer') { s = 30 - d * 1.2; w = 'Clearing a skimmer flock'; }
      else if (e.type === 'meteor') { s = 480 - d * 2 - e.y * 4; w = e.st === 'lava' ? 'Shooting down a lava bomb over the colony' : 'Shooting down a meteor before it hits the colony'; }
      if (e.tell > 0 && d < 40) { s += 150; w = 'Taking out a machine that is about to fire'; }
      if (B) s -= 120;
      consider({ kind: 'enemy', o: e }, s * P.greed + (1 - P.greed) * -d, w);
    }
    if (B && B.st === 'fight') {
      let ni = -1, nd = 1e9;
      B.nodes.forEach((n, i) => { if (n.hp <= 0) return; const [x, y] = nodePos(B, i); const d = Math.abs(wd(x - me.x)) + Math.abs(y - me.y) * 2; if (d < nd) { nd = d; ni = i; } });
      if (ni >= 0) consider({ kind: 'node', i: ni, ph: B.phase || 1 }, 300, `Lining up on the carrier's weak point ${ni + 1}`);
    }
    if (!best) {
      const s = W.settlers.find((q) => q.st === 'walk');
      return { kind: 'patrol', tgt: s ? s.x : me.x + me.face * 50, why: 'Patrolling over the colony' };
    }
    return { ...best, why };
  }
  control(W, me) {
    const out = { mx: 0, my: 0, fire: false, nova: false, blink: false };
    const D = this.debug, P = this.P;
    if (!me.alive) { D.intent = 'Waiting to come back in'; D.target = null; return out; }
    // re-think a few times a second
    this.goalT -= 1 / 120;
    if (!this.goal || this.goalT <= 0 || this.stale(W, this.goal)) { this.goal = this.pick(W, me); this.goalT = 0.3 + (this.profile === 'human' ? this.r() * 0.2 : 0); }
    const g = this.goal;
    D.intent = g.why; D.dodge = '';
    // the human pilot's altitude wobbles and its aim is a bit off
    this.wobT -= 1 / 120;
    if (this.wobT <= 0) { this.wobT = 0.5 + this.r() * 0.6; this.yErr = (this.r() * 2 - 1) * P.aimErr; }
    let tx = me.x, ty = me.y, want = 0, fire = false;
    const SH = SHIPS[me.ship] || SHIPS.warden, range = beamRange(W) * 0.9 * SH.range;
    if (g.kind === 'land') { tx = me.x + me.face * 10; ty = 1; want = 0.4; D.target = { x: me.x, y: 0 }; }
    else if (g.kind === 'settler') {
      const s = g.o, tl = s.y / Math.max(0.5, W.R.fallV);
      tx = s.x; ty = Math.max(F.minY, s.y - W.R.fallV * Math.min(0.6, tl)); want = 1;
      D.target = { x: s.x, y: s.y };
    } else if (g.kind === 'patrol') { tx = g.tgt; ty = 16; want = 0.7; D.target = null; }
    else {
      let ex, ey, evy = 0;
      if (g.kind === 'node') { [ex, ey] = nodePos(W.boss, g.i); }
      else { ex = g.o.x; ey = g.o.y; evy = g.o.vy || 0; }
      D.target = { x: ex, y: ey };
      const dx = wd(ex - me.x), d = Math.abs(dx);
      const stand = g.kind === 'node' ? 16 : P.stand;
      // come at it along its altitude from the side we are on, at a stand-off
      ty = ey + evy * 0.25 + this.yErr;
      tx = ex - Math.sign(dx || me.face) * stand;
      want = d > stand + 4 ? 1 : 0.16;
      // a husk or prowler right on top of us: get out of its altitude band and keep going
      if (g.kind === 'enemy' && d < 5) { ty = ey + (me.y > ey ? 4 : -4); want = 1; tx = me.x + me.face * 20; }
      const facing = Math.sign(dx) === me.face;
      const r = g.kind === 'node' ? 1.15 : ENEMY[g.o.type].r;
      if (facing && d < range && Math.abs(ey - me.y) < r + F.beamH * 0.9) fire = true;
    }
    // fly there: horizontal stick toward the target point (it also sets the facing), altitude stick toward ty
    const hx = wd(tx - me.x);
    let mx = Math.abs(hx) > 1.2 ? Math.sign(hx) * Math.min(1, Math.abs(hx) / 14 + 0.25) * (want || 0.6) : 0;
    let escape = false;
    if (g.kind === 'enemy' && Math.abs(wd(g.o.x - me.x)) < 6) escape = true;
    if (g.kind === 'node') {
      // the carrier: hold station in a band outside its hull, facing it, and let the weak point come to the beam
      const B = W.boss, half = BOSSES[B.key].len * 0.5, toB = wd(B.x - me.x), dB = Math.abs(toB), sB = Math.sign(toB) || me.face;
      const near = half + 9, far = half + 22;
      if (dB < near) mx = -sB;
      else if (dB > far) mx = sB * Math.min(1, (dB - far) / 10 + 0.3);
      else mx = me.face === sB ? 0 : sB * 0.17;
      const closing = (me.vx - B.vx) * sB;
      if (closing > 10 && dB < near + closing * 0.5) mx = -sB;
    } else if (g.kind !== 'land' && g.kind !== 'settler' && g.kind !== 'patrol' && !escape) {
      const ax = g.kind === 'node' ? nodePos(W.boss, g.i)[0] : g.o.x, adx = wd(ax - me.x);
      // keep facing what we shoot at: inside the stand-off, push gently toward it rather than turning away
      if (Math.abs(adx) < P.stand + 4) mx = Math.sign(adx) * 0.17;
      // closing too fast: brake (a short push the other way), then turn back to face it
      const closing = me.vx * Math.sign(adx);
      if (closing > 12 && Math.abs(adx) < P.stand * 0.7 + closing * 0.45) mx = -Math.sign(adx);
    }
    let my = clamp((ty - me.y) / 2.5, -1, 1);
    // ---- safety: bolts, hulls, mines, the carrier's sweep and rush
    let threat = 0;
    for (const b of W.bolts) {
      if (!this.notice(W, 'b' + b.id, b.x, me)) continue;
      const rx = wd(b.x - me.x), ry = b.y - me.y, rvx = b.vx - me.vx, rvy = b.vy - me.vy, v2 = rvx * rvx + rvy * rvy || 1;
      const tc = clamp(-(rx * rvx + ry * rvy) / v2, 0, 1.2);
      const cx = rx + rvx * tc, cy = ry + rvy * tc;
      if (Math.abs(cx) < 1.6 && Math.abs(cy) < 1.4 && tc < P.dodge * 0.5) {
        threat++;
        if (this.dodgeT <= 0) { this.dodgeY = cy > 0 ? -1 : 1; if (me.y < 4) this.dodgeY = 1; if (me.y > H - 4) this.dodgeY = -1; this.dodgeT = 0.35; }
      }
    }
    for (const e of W.enemies) {
      if (e.hp <= 0 || !this.notice(W, e.id, e.x, me)) continue;
      const dx = wd(e.x - me.x), dy = e.y - me.y, r = ENEMY[e.type].r + 1.4;
      const closing = (e.vx - me.vx) * -Math.sign(dx);
      if (Math.abs(dx) < r + Math.max(0, closing) * 0.35 && Math.abs(dy) < r) {
        threat++; my = dy > 0 ? -1 : 1;
        if ((my < 0 && me.y < 4) || (my > 0 && me.y > H - 4)) { my = 0; mx = -(Math.sign(dx) || me.face); }
        D.dodge = e.type === 'mine' ? 'Steering round a mine' : 'Keeping off a ' + e.type;
      }
    }
    // a machine is charging a shot and we are on its line: change altitude before it fires
    for (const e of W.enemies) {
      if (e.tell <= 0 || e.hp <= 0 || !this.notice(W, 't' + e.id + ':' + Math.round(e.t), e.x, me)) continue;
      const dx = wd(e.x - me.x), dy = e.y - me.y;
      if (Math.abs(dx) < 42 && Math.abs(dy) < 2.6) { my = dy > 0 || me.y > H - 5 ? -1 : 1; if (me.y < 4) my = 1; D.dodge = 'Off the line of a machine about to fire'; threat++; break; }
    }
    const B = W.boss;
    if (B && B.atk && B.atk.kind === 'volley' && B.atk.t < B.atk.T && Math.abs(wd(B.x - me.x)) < 45 && this.notice(W, 'v' + Math.round(B.t), B.x, me)) {
      my = me.y > B.y - 6 ? -1 : 1; if (me.y < 4) my = 1; D.dodge = "Moving before the carrier's volley"; threat++;
    }
    if (B && B.atk) {
      const a = B.atk;
      if (a.kind === 'sweep') { const sx = a.t >= a.T ? B.sweepX : B.x, dx = wd(me.x - sx); if (Math.abs(dx) < 9 && me.y < B.y) { mx = Math.sign(dx || -a.dir) * 1; if (Math.sign(dx) === a.dir) mx = a.dir; D.dodge = "Out from under the carrier's beam"; threat++; } }
      if (a.kind === 'rush' && Math.abs(me.y - a.y) < 4.5 && Math.abs(wd(B.x - me.x)) < 60) { my = me.y > a.y ? 1 : -1; if (a.y < 6) my = 1; D.dodge = "Climbing out of the carrier's path"; threat++; }
    }
    // never sit inside or against the carrier's hull
    if (B && (B.st === 'fight' || B.st === 'warp')) for (const b of BOSSES[B.key].body) {
      const cx = wp(B.x + b[0] * B.face), cy = B.y + b[1], u = wd(me.x - cx) / (b[2] + 4), v = (me.y - cy) / (b[3] + 3);
      if (u * u + v * v < 1) { mx = Math.sign(u) || -B.face; my = v > 0 ? 1 : -1; if (me.y < 4) my = 1; if (me.y > H - 4) my = -1; D.dodge = "Keeping clear of the carrier's hull"; threat++; break; }
    }
    if (this.dodgeT > 0) { this.dodgeT -= 1 / 120; my = this.dodgeY; D.dodge = D.dodge || 'Dodging a bolt'; }
    // nova when swamped
    let near = 0;
    for (const e of W.enemies) if (e.hp > 0 && e.born <= 0 && e.type !== 'mine' && Math.abs(wd(e.x - me.x)) < 26) near += DANGER.has(e.type) ? 1.5 : 1;
    const nova = me.nova > 0 && (near >= P.nova || (threat >= 2 && this.r() < P.novaDanger * 0.05));
    out.nova = nova && !this.novaWas; this.novaWas = nova;
    if (out.nova) D.dodge = 'Swamped: letting off a NOVA';
    out.mx = mx ? Math.sign(mx) * clamp(Math.max(0.17, Math.abs(mx) * P.slow), 0, 1) : 0; out.my = clamp(my, -1, 1);
    if (SH.weapon === 'missile' && W.enemies.some((e) => e.hp > 0 && e.born <= 0 && e.type !== 'mine' && Math.hypot(wd(e.x - me.x), e.y - me.y) < 40)) fire = true;
    if (SH.weapon === 'missile' && W.boss && W.boss.st === 'fight' && Math.abs(wd(W.boss.x - me.x)) < 45) fire = true;
    out.fire = fire || (this.profile === 'demo' && near > 0 && this.r() < 0.02);
    return out;
  }
  stale(W, g) {
    if (!g) return true;
    if (g.kind === 'enemy') return !(g.o && g.o.hp > 0) || !W.enemies.includes(g.o);
    if (g.kind === 'settler') return g.o.st !== 'fall';
    if (g.kind === 'node') return !W.boss || !W.boss.nodes[g.i] || W.boss.nodes[g.i].hp <= 0 || (g.ph || 1) !== (W.boss.phase || 1);
    if (g.kind === 'land') return false;
    return false;
  }
}

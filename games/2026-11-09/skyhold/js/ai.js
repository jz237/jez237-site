// Autopilot: flies a Warden gunship from the world state alone, through the same controls a player has.
// It always has ONE goal it can say in a sentence (debug.intent) and one thing it is going for (debug.target):
//   CATCH    a settler is falling: get under it        LAND    carrying a settler: dive and set it down
//   RESCUE   a lifter has a settler: shoot it down      DEFEND  a lifter is going down for a settler
//   FIGHT    something dangerous is close              HUNT    go after the nearest machine
//   CARRIER  line up on a weak point and fire          PATROL  nothing to do: fly toward the colony
// On top of the goal a safety layer dodges bolts, keeps off machines' hulls, steps out of a carrier's beam
// sweep or rush, and lets off a NOVA when it is swamped (debug.dodge says which).
// The demo spends its novas with a plan (novaPlan): they do not carry into the next world, so each world's few are
// budgeted across its waves, its special wave and its carrier. A nova goes off when what it would destroy here is worth
// more than a bar set by how many are in hand and what is still to come; it waits a moment for a crowd to close in,
// flies into a crowd that is worth one, keeps one back for an emergency, and empties the rack on the carrier.
//   'human' — plays like a person: ~0.35 s reaction (scattered, sometimes late), wobbly altitude, misses things
//             behind it, saves novas too long. The difficulty ramp is measured with this one.
//   'demo'  — the attract mode: sharp and decisive. It never reads the world's random generator (replays stay exact).
import { F, ENEMY, BOSSES, H, SHIPS, WAVES, SPECIAL } from './config.js?v=26';
import { wd, wp, nodePos, beamRange } from './sim.js?v=26';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mkr(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PROFILES = {
  human: { react: 0.36, jit: 0.12, late: 0.16, lateT: 0.32, blind: 0.4, aimErr: 0.42, wob: 0.55, dodge: 1.6, nova: 5, novaDanger: 0.35, stand: 17, greed: 0.6, slow: 0.82, catchK: 0.85 },
  demo: { react: 0.12, jit: 0.04, late: 0, lateT: 0, blind: 0.05, aimErr: 0.12, wob: 0.15, dodge: 2.4, nova: 4, novaDanger: 1, stand: 15, greed: 1, slow: 1, catchK: 1 },
};
// the demo lets a hive pod's fresh stingers be seen before it opens fire on them (seconds after the burst)
const SWARM_HOLD = 1.7;
// ...but not once a stinger is within SWARM_CLOSE m, and at most one watched swarm every SWARM_GAP s
const SWARM_CLOSE = 24, SWARM_GAP = 8;
const DANGER = new Set(['husk', 'prowler', 'stinger', 'whirler', 'spark', 'maw', 'scorcher']);
// NOVA PLAN (demo): what each machine a nova would destroy is worth (a lifter carrying a settler most of all; a hive pod
// counts with the swarm inside it; a coil with the sparks it would let out)
const NOVA_W = { lifter: 1, husk: 1.6, prowler: 1.6, stinger: 0.9, whirler: 1, spark: 0.6, maw: 1.8, scorcher: 1.5, coil: 2.2, sower: 1.2, skimmer: 0.25, meteor: 1.5, mine: 0.1 };
const NOVA_REACH = F.novaR - 3;   // a little inside the real reach: things move while it goes off
const NOVA_HOST = new Set(['lifter', 'husk', 'sower', 'hive', 'stinger', 'prowler', 'whirler', 'coil', 'spark', 'scorcher', 'maw']);

export class Autopilot {
  constructor(seed = 1, profile = 'human') {
    this.r = mkr(seed * 7919 + 13);
    this.P = PROFILES[profile] || PROFILES.human;
    this.profile = profile;
    this.seen = new Map();
    this.goal = null; this.goalT = 0; this.wob = 0; this.wobT = 0; this.yErr = 0;
    this.debug = { intent: '', target: null, dodge: '' };
    this.novaWas = false; this.blinkWas = false; this.dodgeY = 0; this.dodgeT = 0;
    this.nPeak = 0; this.nPeakT = 0; this.nHold = 0; this.nGap = 0; this.nWhy = ''; this.nWhyT = 0;
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
    // the wave's last few machines: go and finish them rather than chasing the skimmer flocks that keep coming by
    const HOST = ['lifter', 'husk', 'sower', 'hive', 'stinger', 'prowler', 'whirler', 'coil', 'spark', 'scorcher', 'maw'];
    const left = W.enemies.filter((e) => e.hp > 0 && HOST.includes(e.type)).length;
    const endgame = !B && W.plan && W.plan.left === 0 && W.plan.extra.every((x) => x.done) && left > 0 && left <= 3;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.type === 'mine') continue;
      if (this.profile === 'demo' && e.type === 'stinger' && e.t < SWARM_HOLD && this.holding) continue;   // let the watcher see a fresh swarm
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
      else if (e.type === 'hive') s = (e.link ? 400 : e.cross ? 5 : 80) - d;   // let an intersection pair link first
      else if (e.type === 'sower') s = 60 - d;
      else if (e.type === 'coil') { s = 110 - d; w = 'Taking out a coil before it lets out more sparks'; }
      else if (e.type === 'skimmer') { s = 30 - d * 1.2; w = 'Clearing a skimmer flock'; }
      else if (e.type === 'meteor') { s = 480 - d * 2 - e.y * 4; w = e.st === 'lava' ? 'Shooting down a lava bomb over the colony' : 'Shooting down a meteor before it hits the colony'; }
      if (e.tell > 0 && d < 40) { s += 150; w = 'Taking out a machine that is about to fire'; }
      if (endgame && HOST.includes(e.type) && !(e.cross && !e.link) && s < 260 - d * 0.5) { s = 260 - d * 0.5; w = 'Hunting down the last machines of the wave'; }
      if (B) s -= 120;
      consider({ kind: 'enemy', o: e }, s * P.greed + (1 - P.greed) * -d, w);
    }
    if (B && B.st === 'fight') {
      let ni = -1, nd = 1e9;
      B.nodes.forEach((n, i) => { if (n.hp <= 0) return; const [x, y] = nodePos(B, i); const d = Math.abs(wd(x - me.x)) + Math.abs(y - me.y) * 2; if (d < nd) { nd = d; ni = i; } });
      if (ni >= 0) consider({ kind: 'node', i: ni, ph: B.phase || 1 }, 300, `Lining up on the carrier's weak point ${ni + 1}`);
    }
    // the demo: nothing urgent, a crowd worth a nova nearby: fly into the middle of it
    if (this.profile === 'demo' && score < 380 && !endgame && !B) {
      const sk = this.novaSeek(W, me);
      if (sk) return sk;
    }
    if (!best) {
      const s = W.settlers.find((q) => q.st === 'walk');
      return { kind: 'patrol', tgt: s ? s.x : me.x + me.face * 50, why: 'Patrolling over the colony' };
    }
    return { ...best, why };
  }
  // a fresh swarm (a pod burst less than SWARM_HOLD s ago) near enough to be watched
  swarmFresh(W, me) { return W.enemies.some((e) => e.type === 'stinger' && e.hp > 0 && e.t < SWARM_HOLD - 0.3 && Math.abs(wd(e.x - me.x)) < 60); }
  // ...and one of its stingers already close: no more waiting, fight
  swarmClose(W, me) { return W.enemies.some((e) => e.type === 'stinger' && e.hp > 0 && Math.abs(wd(e.x - me.x)) < SWARM_CLOSE && Math.abs(e.y - me.y) < 9); }
  // at most one watched swarm every SWARM_GAP s (with a hive or more a wave, waiting on every one gets the demo killed)
  swarmHold(W, me) {
    this.hcd = (this.hcd || 0) - 1 / 120;
    const want = this.swarmFresh(W, me) && !this.swarmClose(W, me);
    if (want && (this.holding || this.hcd <= 0)) { this.holding = true; return true; }
    if (this.holding) { this.holding = false; this.hcd = SWARM_GAP; }
    return false;
  }
  control(W, me) {
    const out = this.control0(W, me);
    // a pod has just burst near us: hold fire (and the nova) for a moment so its swarm can be seen
    if (this.profile === 'demo' && this.swarmHold(W, me)) { out.fire = false; out.nova = false; }
    return out;
  }
  control0(W, me) {
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
    else if (g.kind === 'nova') {
      tx = g.x; ty = clamp(me.y, 8, H - 9); want = 1; D.target = { x: g.x, y: me.y };
      // shoot whatever lines up on the way in
      for (const e of W.enemies) { if (e.hp <= 0 || e.born > 0) continue; const dx = wd(e.x - me.x); if (Math.sign(dx) === me.face && Math.abs(dx) < range && Math.abs(e.y - me.y) < ENEMY[e.type].r + F.beamH * 0.9) { fire = true; break; } }
    }
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
      // a STINGER only turns round once we are well behind it and only fires ahead: get in close behind it and stay
      // there; one coming at us: get out of its height, let it go past, then follow it
      if (g.kind === 'enemy' && g.o.type === 'stinger' && g.o.dir) {
        const sd = g.o.dir;
        if (Math.sign(dx) === sd || d < 3) { tx = ex - sd * Math.min(stand, 9); want = 1; }
        else if (d < 26) { ty = ey + (me.y > ey ? 5 : -5); tx = me.x; want = 0.2; }
      }
      // a husk or prowler right on top of us: get out of its altitude band and keep going
      // (to the side with room: never into the ground or the ceiling with it on top of us)
      if (g.kind === 'enemy' && d < 5) { const up = ey < 7 ? true : ey > H - 7 ? false : me.y > ey; ty = ey + (up ? 4 : -4); want = 1; tx = me.x + me.face * 20; }
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
      // back off earlier from a carrier that is coming at us (world 5's closes in fast)
      const near = half + 9 + Math.max(0, -(B.vx || 0) * sB) * 0.7, far = half + 22;
      if (dB < near) mx = -sB;
      else if (dB > far) mx = sB * Math.min(1, (dB - far) / 10 + 0.3);
      else mx = me.face === sB ? 0 : sB * 0.17;
      const closing = (me.vx - B.vx) * sB;
      if (closing > 10 && dB < near + closing * 0.5) mx = -sB;
    } else if (g.kind !== 'land' && g.kind !== 'settler' && g.kind !== 'patrol' && g.kind !== 'nova' && !escape) {
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
    // never sit inside or against the carrier's hull (it stays solid while it sinks, beaten)
    if (B && (B.st === 'fight' || B.st === 'warp' || B.st === 'dying')) for (const b of BOSSES[B.key].body) {
      const cx = wp(B.x + b[0] * B.face), cy = B.y + b[1], u = wd(me.x - cx) / (b[2] + 4), v = (me.y - cy) / (b[3] + 3);
      if (u * u + v * v < 1) { mx = Math.sign(u) || -B.face; my = v > 0 ? 1 : -1; if (me.y < 4) my = 1; if (me.y > H - 4) my = -1; D.dodge = "Keeping clear of the carrier's hull"; threat++; break; }
    }
    if (this.dodgeT > 0) { this.dodgeT -= 1 / 120; my = this.dodgeY; D.dodge = D.dodge || 'Dodging a bolt'; }
    // nova when swamped
    let near = 0;
    for (const e of W.enemies) if (e.hp > 0 && e.born <= 0 && e.type !== 'mine' && Math.abs(wd(e.x - me.x)) < 26) near += DANGER.has(e.type) ? 1.5 : 1;
    if (this.profile === 'demo') {
      const why = this.novaPlan(W, me, threat);
      out.nova = !!why && !this.novaWas; this.novaWas = out.nova;
      // the reason stays on the autopilot panel for a couple of seconds, so a watcher can read why
      if (out.nova) { D.dodge = why; this.nWhy = why; this.nWhyT = 2.2; }
      else if (this.nWhyT > 0) { this.nWhyT -= 1 / 120; if (!D.dodge) D.dodge = this.nWhy; }
    } else {
      const nova = me.nova > 0 && (near >= P.nova || (threat >= 2 && this.r() < P.novaDanger * 0.05));
      out.nova = nova && !this.novaWas; this.novaWas = nova;
      if (out.nova) D.dodge = 'Swamped: letting off a NOVA';
    }
    out.mx = mx ? Math.sign(mx) * clamp(Math.max(0.17, Math.abs(mx) * P.slow), 0, 1) : 0; out.my = clamp(my, -1, 1);
    if (SH.weapon === 'missile' && W.enemies.some((e) => e.hp > 0 && e.born <= 0 && e.type !== 'mine' && Math.hypot(wd(e.x - me.x), e.y - me.y) < 40)) fire = true;
    if (SH.weapon === 'missile' && W.boss && W.boss.st === 'fight' && Math.abs(wd(W.boss.x - me.x)) < 45) fire = true;
    out.fire = fire || (this.profile === 'demo' && near > 0 && this.r() < 0.02);
    return out;
  }
  // what a nova let off at x would do: { w: its worth, n: the machines it would destroy }
  novaWorth(W, x, me) {
    let w = 0, n = 0;
    for (const e of W.enemies) {
      if (e.hp <= 0 || Math.abs(wd(e.x - x)) > NOVA_REACH) continue;
      let v = NOVA_W[e.type] ?? 1;
      if (e.type === 'lifter') v = e.st === 'lift' ? 3 + e.y / H : e.st === 'grab' || e.st === 'down' ? 1.8 : 1;
      else if (e.type === 'hive') v = 1 + (e.sting || W.R.sting) * 0.8;
      // a skimmer flock running at us: worth a nova only on the last shield (flocks keep coming)
      else if (e.type === 'skimmer' && me && me.shield <= 1 && Math.abs(wd(e.x - x)) < 30 && Math.sign(e.vx) === Math.sign(wd(x - e.x))) v = 0.6;
      if (e.tell > 0) v += 0.5;
      // what is close and dangerous counts for more than what is far off: a nova is first of all a way out
      const d = Math.abs(wd(e.x - x));
      if (DANGER.has(e.type) && d < 20 && e.born <= 0) v += 0.8; else if (d > 30) v *= 0.7;
      w += v; if (e.type !== 'mine' && e.type !== 'meteor') n += e.type === 'hive' ? 1 + (e.sting || W.R.sting) : 1;
    }
    for (const b of W.bolts) if (Math.abs(wd(b.x - x)) < NOVA_REACH) w += 0.25;
    const B = W.boss;
    if (B && B.st === 'fight' && Math.abs(wd(B.x - x)) < NOVA_REACH) w += B.nodes.filter((q) => q.hp > 0).length * 1.5;
    return { w, n };
  }
  // how much a nova must be worth to spend one now, and how many to keep back for an emergency
  novaBudget(W, me) {
    const n = me.nova, B = W.boss;
    let reserve, bar;
    if (B && (B.st === 'fight' || B.st === 'warp')) {
      // novas do not carry into the next world: keep one for an emergency until the carrier is nearly done, then empty the rack
      const alive = B.nodes.filter((q) => q.hp > 0).length;
      reserve = W.mode !== 'endless' && (B.phase || 1) >= 2 && alive <= 1 ? 0 : 1;
      bar = W.mode === 'endless' ? 4 : 1.5;
    } else if (W.mode === 'endless') { reserve = W.special ? 1 : 2; bar = 4; }
    else {
      // before the special wave keep one for it as well as the one for an emergency
      reserve = W.special ? 1 : W.wave < SPECIAL.every - 1 && W.wave < WAVES ? 2 : 1;
      bar = W.special ? 3.5 : 4;
    }
    const spare = n - reserve;
    if (spare <= 0) bar = 9;
    else if (spare === 1) bar += 1;
    else if (spare >= 3) bar -= 0.75;
    if (n >= F.novaMax) bar = Math.min(bar, 2.5);   // the rack is full: a nova picked up now would be wasted
    return { bar, spare };
  }
  // the demo's nova: returns why it is letting one off now, or ''
  novaPlan(W, me, threat) {
    this.nGap -= 1 / 120;
    if (me.nova <= 0 || me.novaT > 0) return '';
    // a pod has just burst near us: let the swarm be seen first
    if (W.enemies.some((e) => e.type === 'stinger' && e.hp > 0 && e.t < SWARM_HOLD - 0.3 && Math.abs(wd(e.x - me.x)) < 60)) return '';
    const here = this.novaWorth(W, me.x, me);
    if (here.w < 1) { this.nPeak = 0; this.nHold = 0; return ''; }
    const go = (why) => { this.nGap = 2; this.nPeak = 0; this.nHold = 0; return why; };
    // EMERGENCIES: the bar does not apply
    // the one kept back is for this: no shield left and something about to hit us
    if (me.inv <= 0 && me.shield <= 0 && threat >= 1) return go('NOVA: no shield left and fire closing in');
    if (me.inv <= 0 && me.shield <= 1 && threat >= 3 && here.w >= 3) return go('NOVA: boxed in on the last shield');
    const walking = W.settlers.filter((q) => q.st === 'walk' || q.st === 'held').length;
    for (const e of W.enemies) {
      if (e.hp <= 0 || e.type !== 'lifter' || Math.abs(wd(e.x - me.x)) > NOVA_REACH) continue;
      const lined = Math.sign(wd(e.x - me.x)) === me.face && Math.abs(e.y - me.y) < 1.6;
      if (e.st === 'lift' && e.y > H - 7 && !lined) return go('NOVA: a settler is about to be carried off');
      if (walking <= 3 && (e.st === 'lift' || e.st === 'grab') && !lined) return go('NOVA: the colony is nearly gone');
    }
    // the plan: worth it against what is still to come
    const { bar } = this.novaBudget(W, me);
    if (this.nGap > 0 && !W.boss) return '';
    if (here.w < bar) { this.nPeak = 0; this.nHold = 0; return ''; }
    // the crowd is still closing in: wait a moment for more of it (not when something is about to hit us)
    this.nHold += 1 / 120;
    if (here.w > this.nPeak * 1.03) { this.nPeak = here.w; this.nPeakT = 0; } else this.nPeakT += 1 / 120;
    if (threat === 0 && this.nHold < 0.8 && this.nPeakT < 0.2) { this.debug.dodge = `Holding the NOVA while the crowd closes in (${here.n})`; return ''; }
    if (W.boss && W.boss.st === 'fight' && Math.abs(wd(W.boss.x - me.x)) < NOVA_REACH) return go("NOVA: every weak point on the carrier (novas do not carry to the next world)");
    if (W.special) return go(`NOVA: into the special wave's squadrons (${here.n} machines)`);
    return go(`NOVA: ${here.n} machines in reach`);
  }
  // a crowd nearby worth a nova that is not in reach from here: { kind: 'nova', x } to fly into it, or null
  novaSeek(W, me) {
    if (me.nova <= 0 || this.nGap > 0 || me.shield < 1) return null;   // only with a shield up: a crowd shoots back
    const { bar, spare } = this.novaBudget(W, me);
    // only into a special wave's squadrons, or with novas to spare: in a normal wave the settlers need us nearer them
    if (spare <= 0 || bar > 6 || (!W.special && spare < 2)) return null;
    const here = this.novaWorth(W, me.x, me).w;
    let bx = 0, bw = 0, bn = 0;
    for (const e of W.enemies) {
      if (e.hp <= 0 || !NOVA_HOST.has(e.type)) continue;
      const d = Math.abs(wd(e.x - me.x));
      if (d < 10 || d > 70 || !this.notice(W, e.id, e.x, me)) continue;
      const q = this.novaWorth(W, e.x, me);
      if (q.w - d * 0.02 > bw) { bw = q.w - d * 0.02; bx = e.x; bn = q.n; }
    }
    if (bw < bar + 1.5 || bw < here * 1.5 + 1.5) return null;
    return { kind: 'nova', x: bx, why: `Flying into a crowd of ${bn} machines to let off a NOVA` };
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

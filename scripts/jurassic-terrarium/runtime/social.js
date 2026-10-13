// Family and social moments. A director looks every couple of seconds for a chance and starts a scene:
//   - play: two Triceratops calves square up and butt heads, backing off and charging, with little hops;
//   - nuzzle: the mother turns to a calf and bows her head to it, and it reaches up to her;
//   - spar: two Stegosaurus take turns swinging their spiked tails at each other, the other flinching back;
//   - lift: the Brachiosaurus raises its neck to let a calf (or any small animal) walk underneath.
// (Huddling to sleep is in Dino.update: the herd gathers side by side before lying down.)
// A scene's animals are in the 'social' state; anything else that claims them (a predator, a startle)
// ends the scene for all of them. Poses are layered on in Dino.performFrame through d.socialPose.
import { Vector3 } from 'three';

const angTo = (a, b) => Math.atan2(b.pos.x - a.pos.x, b.pos.z - a.pos.z);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
// free to join a scene: standing about, or just ambling (a calf trotting after its mother, a wander)
const free = (d) => d.root.visible && !d.perf && !d.rally && !d.swimming && d.inWater < 0.2 &&
  (d.state === 'idle' || (d.state === 'walk' && d.gait !== 'run' && !d._trailWalk && (!d.parent || d.parent.state !== 'flee')));
const _v = new Vector3();

// ease an animal's heading towards a target, at most rate rad/s; true once it is there
function face(d, h, dt, rate = 1.1) {
  const dh = wrap(h - d.heading);
  d.heading += Math.sign(dh) * Math.min(Math.abs(dh), dt * rate);
  d._socTurn = Math.abs(dh) > 0.04;
  return !d._socTurn;
}

class Scene {
  constructor(mod, kind, cast, len) {
    this.mod = mod;
    this.kind = kind;
    this.cast = cast;
    this.t = 0;
    this.len = len;
    for (const d of cast) {
      d.state = 'social';
      d.soc = this;
      d.speed = 0;
      d.path = null;
      d.play('idle', 0.4);
    }
  }
  alive() {
    return this.t < this.len && this.cast.every((d) => d.state === 'social' && d.soc === this);
  }
  end() {
    for (const d of this.cast) {
      d.socialPose = null;
      d._socTurn = false;
      if (d.soc === this) {
        d.soc = null;
        if (d.state === 'social') d.rest(0.6);
      }
    }
  }
}

// two calves head to head
class Play extends Scene {
  constructor(mod, a, b) {
    super(mod, 'play', [a, b], 6 + Math.random() * 3);
    this.ph = Math.random();
    for (const d of [a, b]) {
      d.socialPose = (dt, turn, B, fx) => {
        const t = this.t, s = Math.min(1, t / 0.6, (this.len - t) / 0.6);
        // a charge every 1.4 s: back a little, then lunge in, heads low, a hop at the clash
        const u = ((t + this.ph) % 1.4) / 1.4, lunge = u < 0.45 ? -Math.sin((u / 0.45) * Math.PI) * 0.35 : Math.sin(((u - 0.45) / 0.55) * Math.PI);
        const k = d.length * 0.18 * s;
        const fxw = Math.sin(d.heading), fzw = Math.cos(d.heading);
        d.root.position.x += fxw * lunge * k;
        d.root.position.z += fzw * lunge * k;
        const clash = u > 0.62 && u < 0.78 ? Math.sin(((u - 0.62) / 0.16) * Math.PI) : 0;
        d.root.position.y += clash * d.height * 0.08 * s;
        turn(B.head, 'x', (0.25 + 0.2 * Math.max(0, lunge)) * s);
        if (fx.neck[0]) turn(fx.neck[0], 'x', 0.15 * s);
        turn(B.head, 'z', 0.12 * Math.sin(t * 7) * s);
        if (u > 0.7 && !d._clash) {
          d._clash = true;
          if (d === a) {
            this.mod.voice.play('grunt', d.root.position, 0.25);
            _v.set((a.pos.x + b.pos.x) / 2, this.mod.ctx.terrain.height(a.pos.x, a.pos.z), (a.pos.z + b.pos.z) / 2);
            this.mod.effects.dust(_v, d.length * 0.06);
          }
        } else if (u < 0.5) d._clash = false;
      };
    }
  }
  update(dt) {
    const [a, b] = this.cast;
    face(a, angTo(a, b), dt, 2);
    face(b, angTo(b, a), dt, 2);
  }
}

// the mother bows to a calf, which reaches up to her
class Nuzzle extends Scene {
  constructor(mod, m, c) {
    super(mod, 'nuzzle', [m, c], 5 + Math.random() * 2.5);
    m.socialPose = (dt, turn, B, fx) => {
      const s = Math.min(1, this.t / 1.2, (this.len - this.t) / 1.0);
      fx.neck.forEach((b, i) => turn(b, 'x', (0.32 - i * 0.08) * s));
      turn(B.head, 'x', 0.22 * s);
      turn(B.head, 'y', 0.14 * Math.sin(this.t * 2.3) * s);
    };
    c.socialPose = (dt, turn, B, fx) => {
      const s = Math.min(1, this.t / 1.0, (this.len - this.t) / 0.8);
      if (fx.neck[0]) turn(fx.neck[0], 'x', -0.2 * s);
      turn(B.head, 'x', -0.3 * s);
      turn(B.head, 'z', 0.15 * Math.sin(this.t * 3.1) * s);
    };
    mod.voice.play('grunt', m.root.position, 0.3);
  }
  update(dt) {
    const [m, c] = this.cast;
    face(m, angTo(m, c), dt, 0.9);
    face(c, angTo(c, m), dt, 1.6);
    // the calf comes up under her muzzle
    const dx = c.pos.x - m.pos.x, dz = c.pos.z - m.pos.z, d = Math.hypot(dx, dz) || 1, want = m.length * 0.5 + c.length * 0.3;
    if (Math.abs(d - want) > 0.03) {
      const step = Math.sign(want - d) * Math.min(Math.abs(want - d), dt * 0.18);
      c.pos.x += (dx / d) * step;
      c.pos.z += (dz / d) * step;
      c.play('walk', 0.3, 0.5);
      c._socTurn = true;
    } else if (c.currentName === 'walk') c.play('idle', 0.4);
  }
}

// two Stegosaurus trading tail swings: one turns its tail to the other and swings; the other flinches;
// then the other way round, twice each
class Spar extends Scene {
  constructor(mod, a, b) {
    super(mod, 'spar', [a, b], 30);
    this.round = 0;
    this.phase = 'turn';
    this.pt = 0;
    this.swinger = a;
    for (const d of [a, b])
      d.socialPose = (dt, turn, B) => {
        // the one being swung at rears back a little
        if (d === this.target && this.phase === 'swing') {
          const u = Math.min(1, this.pt / 0.9);
          const back = Math.sin(Math.PI * Math.min(1, u * 1.4)) * d.length * 0.06;
          d.root.position.x -= Math.sin(d.heading) * back;
          d.root.position.z -= Math.cos(d.heading) * back;
          turn(B.head, 'x', -0.25 * Math.sin(Math.PI * u));
        }
      };
  }
  get target() {
    return this.cast[0] === this.swinger ? this.cast[1] : this.cast[0];
  }
  update(dt) {
    const s = this.swinger, o = this.target;
    this.pt += dt;
    if (this.phase === 'turn') {
      // the other steps up within reach of the tail, then the swinger turns its tail to it
      const dx = o.pos.x - s.pos.x, dz = o.pos.z - s.pos.z, dd = Math.hypot(dx, dz) || 1, want = s.length * 0.95;
      if (dd > want + 0.04) {
        const step = Math.min(dd - want, dt * 0.22);
        o.pos.x -= (dx / dd) * step;
        o.pos.z -= (dz / dd) * step;
        o.play('walk', 0.3, 0.55);
        o._socTurn = true;
        this.pt = Math.min(this.pt, 1);
      }
      // tail to the other, which watches
      const done = face(s, angTo(s, o) + Math.PI, dt, 1.0);
      face(o, angTo(o, s), dt, 1.0);
      s.play(s._socTurn ? 'walk' : 'idle', 0.3, 0.45);
      if (done || this.pt > 4) {
        this.phase = 'swing';
        this.pt = 0;
        s.play('tailswing', 0.25);
        this.mod.voice.play(s.sp.sounds?.tailswing || 'hiss', s.root.position, s.stepSize);
        if (o.actions.alert) o.play('alert', 0.2);
      }
    } else if (this.phase === 'swing') {
      const dur = s.actions.tailswing?.getClip().duration || 1.5;
      if (this.pt > dur) {
        this.phase = 'pause';
        this.pt = 0;
        s.play('idle', 0.4);
        o.play('idle', 0.4);
      }
    } else if (this.pt > 0.8 + Math.random() * 0.6) {
      this.round++;
      if (this.round >= 4) this.len = 0;
      this.swinger = o;
      this.phase = 'turn';
      this.pt = 0;
    }
  }
}

export class Social {
  constructor(mod) {
    this.mod = mod;
    this.scenes = [];
    this.scanT = 4;
    this.cool = 15;
  }

  update(dt) {
    for (const S of this.scenes) {
      S.t += dt;
      if (S.alive()) S.update(dt);
    }
    this.scenes = this.scenes.filter((S) => (S.alive() ? true : (S.end(), false)));
    this.lift(dt);
    this.cool -= dt;
    if ((this.scanT -= dt) > 0) return;
    this.scanT = 2;
    const env = this.mod.env();
    if (env.night > 0.5 || env.rain > 0.3 || this.cool > 0 || this.scenes.length > 1) return;
    const W = this.mod.walkers || [], pred = this.mod.predator;
    const safe = (d) => !pred || pred.state === 'sleep' || Math.hypot(pred.pos.x - d.pos.x, pred.pos.z - d.pos.z) > 3.5;
    const dist = (a, b) => Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z);
    const start = (S) => {
      this.scenes.push(S);
      this.cool = 20 + Math.random() * 25;
    };
    const calves = W.filter((d) => d.parent && free(d) && safe(d));
    // calves at play
    const ok = (k) => !this.only || this.only === k; // (testing: one kind only)
    if (ok('play') && calves.length >= 2 && Math.random() < 0.18) {
      for (let i = 0; i < calves.length; i++)
        for (let j = i + 1; j < calves.length; j++)
          if (dist(calves[i], calves[j]) < Math.max(0.5, calves[i].length * 2.2)) return start(new Play(this.mod, calves[i], calves[j]));
    }
    // mother and calf
    const mum = this.mod.mother;
    if (ok('nuzzle') && mum && free(mum) && safe(mum) && calves.length && Math.random() < 0.15) {
      const c = calves.filter((c) => c.parent === mum && dist(c, mum) < mum.length * 0.75).sort((a, b) => dist(a, mum) - dist(b, mum))[0];
      if (c) return start(new Nuzzle(this.mod, mum, c));
    }
    // Stegosaurus sparring
    const st = W.filter((d) => d.sp.id === 'stegosaurus' && !d.parent && free(d) && safe(d));
    if (ok('spar') && st.length >= 2 && st[0].actions.tailswing && Math.random() < 0.12) {
      const [a, b] = st, d = dist(a, b);
      if (d > a.length * 0.6 && d < a.length * 3) return start(new Spar(this.mod, a, b));
    }
  }

  // the Brachiosaurus lifts its neck clear while a small animal walks under its head
  lift(dt) {
    for (const g of this.mod.walkers || []) {
      if (!g.sp.tooBig || !g.headBone) continue;
      const h = g.headBone.getWorldPosition(_v);
      const under = g.state === 'idle' && (this.mod.walkers || []).some((o) => o !== g && (o.parent || o.length < g.length * 0.45) && o.speed > 0.03 && Math.hypot(o.pos.x - h.x, o.pos.z - h.z) < g.length * 0.3);
      if (under && !(g._liftT > 0) && !(g._liftCool > 0)) (g._liftT = 3.5), (g._liftCool = 45);
      g._liftCool = (g._liftCool || 0) - dt;
      if (g._liftT > 0) g._liftT -= dt;
    }
  }
}

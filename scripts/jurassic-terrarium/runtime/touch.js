// Touching the animals with the hand. A click is a poke; holding and moving over the body is a stroke.
// Each answers in character:
//   - Triceratops: poked, it swings round and lowers its horns with a bellow; stroked, it leans into the
//     hand, eyes half-closed, with soft contented honks;
//   - a calf: poked, it flinches, peeps and scampers to its mother; stroked, it leans in and peeps;
//   - Stegosaurus: poked, it turns its tail on you and swings it with a hiss; stroked, it settles;
//   - T. rex: poked, it snaps round and roars; stroked, it puts up with it a moment, growls, then roars;
//   - Brachiosaurus: it bows its long neck down to peer at the hand, rumbling;
//   - Pteranodon: on a perch it takes off; in the air it croaks and beats its wings.
// Hovering over an animal makes it glance at the hand. Animals busy with something bigger (a standoff,
// a hunt, drinking, a family moment) only look round.
import { Vector3 } from 'three';

const _c = new Vector3(), _p = new Vector3();
const BUSY = /^(standoff|circle|hunt|drinking|social|flee|dive|toPerch|takeoff|rejoin)$/;

export class Touch {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    const input = this.ctx.input;
    if (!input?.addHandler) return;
    input.addHandler({
      name: 'jt-animals', priority: 26, // above the trees: an animal under the hand is what you meant
      tools: ['hand'], cursor: 'grab', activeCursor: 'grabbing',
      hitTest: (ptr) => this.pick(ptr.ray),
      onHover: (hit) => {
        if (hit && hit.d !== this.hov) this.glance(hit.d, hit.point, 1.4);
        this.hov = hit?.d || null;
      },
      onDown: (hit) => {
        this.hold = { d: hit.d, point: hit.point.clone(), travel: 0, t: 0, x: null, y: null, stroking: false };
        return true;
      },
      onMove: (ptr) => {
        const H = this.hold;
        if (!H) return;
        if (H.x !== null) H.travel += Math.hypot(ptr.x - H.x, ptr.y - H.y);
        H.x = ptr.x;
        H.y = ptr.y;
        // still over the animal? (a stroke follows the body)
        const hit = this.pick(ptr.ray);
        if (hit && hit.d === H.d) H.point.copy(hit.point);
      },
      onFrame: (ptr, dt) => {
        const H = this.hold;
        if (!H) return;
        H.t += dt;
        if (!H.stroking && H.travel > 30 && H.t > 0.35) H.stroking = true;
        if (H.stroking) this.stroke(H.d, H.point, dt);
      },
      onUp: () => {
        const H = this.hold;
        this.hold = null;
        if (H && !H.stroking && H.travel < 12) this.poke(H.d, H.point);
      },
    });
  }

  // the body as a few spheres (hips, chest, head; one for a flier)
  pick(ray) {
    let best = null, bt = Infinity;
    const test = (d, c, r) => {
      const o = ray.origin, v = ray.direction, ox = o.x - c.x, oy = o.y - c.y, oz = o.z - c.z;
      const b = ox * v.x + oy * v.y + oz * v.z, disc = b * b - (ox * ox + oy * oy + oz * oz - r * r);
      if (disc < 0) return;
      const t = -b - Math.sqrt(disc);
      if (t > 0 && t < bt) (bt = t), (best = d);
    };
    for (const d of this.mod.dinos || []) {
      if (!d.root.visible) continue;
      if (d.sp.flyer) {
        test(d, d.root.getWorldPosition(_c), 0.16);
        continue;
      }
      const r = Math.max(0.05, (d.sp.bodyR ?? 0.12) * (d.k || 1) * 1.5);
      for (const b of d.pushBones || []) test(d, b.getWorldPosition(_c), r);
      if (d.headBone) test(d, d.headBone.getWorldPosition(_c), r * 0.7);
    }
    if (!best) return null;
    const g = this.ctx.terrain.raycast(ray, _p);
    if (g && g.distanceTo(ray.origin) < bt - 0.1) return null;
    return { distance: bt, d: best, point: ray.origin.clone().addScaledVector(ray.direction, bt) };
  }

  glance(d, point, t) {
    d.glance = { pos: point.clone(), height: 0 };
    d.glanceUntil = t;
    d.glanceT = t + 2;
  }

  // turn to face a point quickly (or away, for a tail), then do something
  turnThen(d, point, away, rate, then) {
    let h = Math.atan2(point.x - d.pos.x, point.z - d.pos.z);
    if (away) h += Math.PI;
    d.speed = 0;
    d.path = null;
    d.turnTo = h;
    d.turnRate = rate;
    d.turnThen = () => {
      d.turnRate = null;
      then();
    };
    d.state = 'turn';
  }

  poke(d, point) {
    const mod = this.mod, V = mod.voice;
    this.glance(d, point, 2.5);
    if (d.sp.flyer) {
      if (d.state === 'perch' && d.takeOff) d.takeOff();
      d.flapT = 2.5;
      V.play('croak', d.root.position, 1);
      return;
    }
    if (BUSY.test(d.state)) return;
    const woke = d.state === 'sleep';
    if (woke) d.rest(0.4);
    d._flinch = 0.35; // a start at the touch
    if (d.parent) {
      // a calf: a peep and off to its mother
      V.play('peep', d.root.position, 0.5);
      d.followSide = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.9);
      d.state = 'idle';
      d.timer = 0;
      d.follow();
      return;
    }
    if (d.sp.predator) {
      if (woke) V.play('boom', d.root.position, d.stepSize);
      this.turnThen(d, point, false, 2.6, () => d.oneShot('roar', 0.25) || d.rest(0.4));
    } else if (d.sp.tooBig) {
      this.peer(d, point);
    } else if (d.actions.tailswing) {
      V.play(d.sp.sounds?.tailswing || 'hiss', d.root.position, d.stepSize);
      this.turnThen(d, point, true, 1.6, () => d.oneShot('tailswing', 0.25) || d.rest(0.4));
    } else if (d.actions.threat) {
      this.turnThen(d, point, false, 1.8, () => {
        d.oneShot('threat', 0.25) || d.rest(0.4);
        V.play(d.sp.sounds?.threat || 'bellow', d.root.position, d.stepSize);
      });
    } else if (d.actions.alert) d.oneShot('alert');
  }

  // the Brachiosaurus: turn to the hand and bow the neck down to look at it
  peer(d, point) {
    this.mod.voice.play('rumble', d.root.position, d.stepSize * 0.8);
    this.turnThen(d, point, false, 0.6, () => {
      d.rest(0.6);
      d.timer = 6;
      d._peer = { point: point.clone(), t: 5 };
    });
  }

  stroke(d, point, dt) {
    if (d.sp.flyer || BUSY.test(d.state)) return;
    const V = this.mod.voice;
    if (d.state === 'walk' || d.state === 'sleep') (d.path = null), (d.speed = 0), d.rest(0.5);
    if (d.state === 'idle') d.timer = Math.max(d.timer, 2.5);
    d._stroked = (d._stroked || 0) + dt;
    d._lean = { x: point.x, z: point.z, k: Math.min(1, (d._lean?.k || 0) + dt * 2) };
    this.glance(d, point, 1);
    if (d.sp.tooBig) {
      if (!d._peer) this.peer(d, point);
      return;
    }
    if (d.sp.predator) {
      // it puts up with it for a moment
      if (d._stroked > 2.6) {
        d._stroked = 0;
        d._calm = 0;
        this.hold = null;
        this.turnThen(d, point, false, 3, () => d.oneShot('roar', 0.2) || d.rest(0.4));
      } else if ((d._purrT = (d._purrT || 0) - dt) <= 0) (d._purrT = 1.4), V.play('stalk', d.root.position, d.stepSize);
      return;
    }
    d._calm = Math.min(1, (d._calm || 0) + dt * 1.5);
    if ((d._purrT = (d._purrT || 0) - dt) <= 0) {
      d._purrT = 1.3 + Math.random() * 0.8;
      V.play(d.parent ? 'peep' : 'contact', d.root.position, d.parent ? 0.5 : d.stepSize * 0.7);
    }
  }

  // each frame for every animal: the calm and the lean fade, the flinch plays out, the peer steers
  update(dt) {
    for (const d of this.mod.walkers || []) {
      if (d._calm > 0 && !(this.hold?.d === d && this.hold.stroking)) d._calm = Math.max(0, d._calm - dt * 0.5);
      if (d._lean && !(this.hold?.d === d && this.hold.stroking)) {
        d._lean.k -= dt * 1.5;
        if (d._lean.k <= 0) d._lean = null;
      }
      if (d._stroked && !(this.hold?.d === d)) d._stroked = Math.max(0, d._stroked - dt);
      if (d._flinch > 0) d._flinch -= dt;
      if (d._peer) {
        const P = d._peer;
        P.t -= dt;
        if (P.t <= 0 || d.state !== 'idle') {
          d._peer = null;
          continue;
        }
        // bow the neck until the head is a little above the hand, then hold it there
        const h = d.headBone?.getWorldPosition(_c);
        if (h) {
          const err = h.y - (P.point.y + d.height * 0.12);
          d.drinkDip = Math.max(0, Math.min(1.1, (d.drinkDip || 0) + err * dt * 0.8));
        }
      }
    }
  }
}

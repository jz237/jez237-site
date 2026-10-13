// Feet on the real ground, and breathing.
//
// The baked clips walk on a flat floor: the root's own ground plane. On the terrarium's slopes and
// banks that leaves the uphill feet sunk into the ground and the downhill ones hanging in the air.
// After the mixer and the flex layer have posed the skeleton, this measures, under each foot, how far
// the real terrain is from the clip's floor and moves that ankle (or, for walking forelimbs, wrist)
// by the difference with a two-bone IK (thigh/shin, upperarm/forearm), keeping the knee in its own
// plane and the foot at its own angle, so the clip's toe roll and swing are kept. If a downhill foot
// cannot reach, the hips drop a little to let it.
//
// Breathing: the chest swells and settles: a small sideways and up-down scale of the last trunk bone,
// cancelled on the bones that carry on from it so the neck and head stay their own size. Big animals
// breathe slowly; any animal that has just run pants faster and deeper for a while.
import { Vector3, Quaternion } from 'three';

const _a = new Vector3(), _b = new Vector3(), _c = new Vector3(), _t = new Vector3();
const _p = new Vector3(), _n = new Vector3(), _dir = new Vector3(), _perp = new Vector3();
const _q = new Quaternion(), _q2 = new Quaternion(), _qm = new Quaternion(), _qp = new Quaternion();
const _v1 = new Vector3(), _v2 = new Vector3();

function rotateBoneWorld(bone, q) {
  // apply a world-space rotation q to bone (about its own head)
  bone.getWorldQuaternion(_q2);
  _q2.premultiply(q);
  bone.parent.getWorldQuaternion(_qp).invert();
  bone.quaternion.copy(_qp.multiply(_q2));
  bone.updateMatrixWorld(true);
}

export class Feet {
  constructor(model, root, terrain, { scale = 1 } = {}) {
    this.root = root;
    this.T = terrain;
    const bones = new Map();
    model.traverse((o) => o.isBone && bones.set(o.name, o));
    root.updateMatrixWorld(true);
    const pelvis = bones.get('pelvis');
    const hipH = pelvis ? root.worldToLocal(pelvis.getWorldPosition(new Vector3())).y : 1;
    this.legs = [];
    for (const s of ['L', 'R']) {
      const thigh = bones.get(`thigh${s}`), shin = bones.get(`shin${s}`), meta = bones.get(`meta${s}`);
      const toe = bones.get(`toe${s}`);
      // knee: hind knees bend forwards, elbows backwards (in the body's frame)
      if (thigh && shin && meta) this.legs.push({ a: thigh, b: shin, c: meta, contact: toe || meta, off: 0, liftMul: 2.3, knee: 1 });
      const up = bones.get(`upperarm${s}`), fore = bones.get(`forearm${s}`), hand = bones.get(`hand${s}`);
      if (up && fore && hand) {
        // only forelimbs that walk: the wrist hangs near the ground in the rest pose
        const wy = root.worldToLocal(hand.getWorldPosition(new Vector3())).y;
        if (wy < hipH * 0.4) this.legs.push({ a: up, b: fore, c: hand, contact: hand, off: 0, liftMul: 1.4, knee: -1 });
      }
    }
    this.reach = hipH * 0.5; // the most a foot is moved up or down
    this.hipH = hipH;
    this.hipDrop = 0;
    this.dip = 0;
    this.dipV = 0;
    this.liftMul = 2.3; // swing lift relative to the clip's
    this.weight = 1; // landing dip scale (set by the runtime from the animal's size)
    for (const L of this.legs) (L.lockW = 0), (L.cx = 0), (L.cz = 0), (L.lift = 0);
    // breathing
    const spine = [];
    for (let i = 1; i < 20 && bones.get(`spine${i}`); i++) spine.push(bones.get(`spine${i}`));
    this.chest = spine[spine.length - 1] || null;
    this.chestKids = this.chest ? this.chest.children.filter((c) => c.isBone) : [];
    this.breathT = Math.random() * 10;
    this.puff = 0; // 0..1, how out of breath
    this.rate = 1 / Math.max(0.6, Math.sqrt(hipH) * 2.2); // breaths per second: slower for big animals
  }

  // Planted feet and weight. Each frame, for every leg:
  //  - stance: the clip has the foot down (its height above the clip's floor is near the lowest it gets).
  //    At touch-down the foot's spot on the ground is locked, and the IK holds it there while the body
  //    walks over it, so a planted foot never skates. If holding it would over-stretch the leg (a turn on
  //    the spot, a sudden stop), the lock lets go and the foot takes a fresh step.
  //  - swing: the clip's foot lift is exaggerated, so steps are lifted, not shuffled.
  //  - every leg: the ground under the foot replaces the clip's flat floor (slopes, banks).
  //  - touch-down: a small dip of the body that springs back (heavier animals dip more), and onPlant for
  //    sound, dust and shake.
  // plant: hold standing feet where they are even though it isn't walking (a shake, a rub: the body moves)
  update(dt, { running = false, enabled = true, moving = false, plant = false } = {}) {
    if (dt <= 0) return;
    this.breathe(dt, running);
    if (!enabled || !this.legs.length) {
      for (const L of this.legs) (L.lock = null), (L.rel = null), (L.lockW = 0);
      return;
    }
    const root = this.root, T = this.T;
    root.updateMatrixWorld(true);
    const tol = this.hipH * 0.03, maxSlip = this.hipH * 0.38;
    let lowest = 0;
    for (const L of this.legs) {
      L.contact.getWorldPosition(_p);
      const local = root.worldToLocal(_c.copy(_p));
      // the clip's lowest foot height, adapting slowly (poses differ between clips)
      L.minY = L.minY === undefined ? local.y : Math.min(local.y, L.minY + dt * this.hipH * 0.05);
      const lift = local.y - L.minY;
      // stance: in the body's own frame a planted foot travels backward, a swinging one forward
      const vz = L.pz === undefined ? 0 : (local.z - L.pz) / dt;
      L.pz = local.z;
      L.vz = L.vz === undefined ? vz : L.vz + (vz - L.vz) * Math.min(1, dt * 20);
      const stance = moving ? L.vz < 0 && lift < tol * 2.5 : lift < tol;
      const hold = moving || plant;
      if (stance && !L.lock && hold) {
        L.lock = { x: _p.x, z: _p.z };
        if (moving && L.wasSwing) this.plant(L, _p, running);
      } else if ((!stance || !hold) && L.lock) (L.rel = L.lock), (L.lock = null); // lifting off: ease out of the hold
      L.wasSwing = !stance;
      L.lockW += ((L.lock ? 1 : 0) - (L.lockW || 0)) * Math.min(1, dt * (L.lock ? 18 : 7));
      let cx = 0, cz = 0;
      if (L.lock) {
        cx = (L.lock.x - _p.x) * L.lockW;
        cz = (L.lock.z - _p.z) * L.lockW;
        // holding it would over-stretch the leg (a turn, a stop, a stride the clip and the body disagree
        // on): the planted foot drags a little with the body instead of popping free in one frame
        const m = Math.hypot(cx, cz), lim = maxSlip * 0.55;
        if (m > lim) {
          const k = lim / m;
          cx *= k;
          cz *= k;
          const w = Math.max(L.lockW, 1e-3);
          L.lock.x = _p.x + cx / w;
          L.lock.z = _p.z + cz / w;
        }
      } else if (L.rel && L.lockW > 0.01) {
        cx = (L.rel.x - _p.x) * L.lockW;
        cz = (L.rel.z - _p.z) * L.lockW;
      } else L.rel = null;
      L.cx = cx;
      L.cz = cz;
      // the swing lifted higher than the clip has it, only while actually stepping (a raised paw in an
      // alert or a drink is the clip's own pose and must not be exaggerated); forefeet only a little
      L.lift = stance || !moving ? 0 : lift * (L.liftMul - 1) * Math.min(1, lift / (tol * 2));
      const gx = _p.x + cx, gz = _p.z + cz;
      const floorY = _p.y - local.y; // the clip's floor under this foot
      L.want = Math.max(-this.reach, Math.min(this.reach, T.height(gx, gz) - floorY));
      lowest = Math.min(lowest, L.want);
    }
    // let the body sink when a downhill foot would have to stretch for the ground
    const drop = Math.max(-this.reach * 0.6, lowest * 0.6);
    this.hipDrop += (drop - this.hipDrop) * Math.min(1, dt * 6);
    // the landing dip: a damped spring kicked at each touch-down
    this.dipV += (-90 * this.dip - 13 * this.dipV) * dt;
    this.dip += this.dipV * dt;
    const y = this.hipDrop + this.dip;
    if (Math.abs(y) > 1e-4) {
      root.position.y += y;
      root.updateMatrixWorld(true);
    }
    for (const L of this.legs) {
      const dy = L.want - y + L.lift;
      L.off += (dy - L.off) * Math.min(1, dt * 12); // no pops when a foot crosses a step in the ground
      if (Math.abs(L.off) < 1e-4 && Math.abs(L.cx) + Math.abs(L.cz) < 1e-4) continue;
      this.solve(L, L.cx, L.off, L.cz);
    }
  }

  plant(L, p, running) {
    this.dipV -= this.hipH * (running ? 0.5 : 0.3) * this.weight;
    this.onPlant?.(p, running);
  }

  // move the end of a two-bone chain by (dx, dy, dz) (world), knee kept in its plane, foot kept at its angle
  solve(L, dx, dy, dz) {
    const { a: A, b: B, c: C } = L;
    A.getWorldPosition(_a);
    B.getWorldPosition(_b);
    C.getWorldPosition(_c);
    C.getWorldQuaternion(_qm);
    _t.set(_c.x + dx, _c.y + dy, _c.z + dz);
    const la = _a.distanceTo(_b), lb = _b.distanceTo(_c);
    _dir.subVectors(_t, _a);
    const d = Math.min(Math.max(_dir.length(), Math.abs(la - lb) + 1e-4), la + lb - 1e-4);
    _dir.normalize();
    // which way the joint bends: the clip's own knee offset when it is clearly bent the right way,
    // otherwise straight forwards (knees) or backwards (elbows) in the body's frame. Sauropod legs are
    // near-straight pillars, and a plane taken from an almost straight leg flips at the slightest change:
    // knees bending backwards.
    _v2.subVectors(_b, _a);
    _v1.subVectors(_c, _a);
    const t = _v2.dot(_v1) / Math.max(1e-8, _v1.lengthSq());
    const off = _v2.clone().addScaledVector(_v1, -t); // the knee's offset from the hip-ankle line
    _n.set(0, 0, L.knee || 1).applyQuaternion(this.root.getWorldQuaternion(_qp)); // the way it should bend
    if (off.length() > la * 0.12 && off.dot(_n) > 0) _perp.copy(off);
    else _perp.copy(_n);
    _perp.addScaledVector(_dir, -_perp.dot(_dir));
    if (_perp.lengthSq() < 1e-10) return;
    _perp.normalize();
    const cosA = Math.max(-1, Math.min(1, (la * la + d * d - lb * lb) / (2 * la * d)));
    const sinA = Math.sqrt(1 - cosA * cosA);
    const knee = _p.copy(_a).addScaledVector(_dir, la * cosA).addScaledVector(_perp, la * sinA);
    // upper bone: swing so the knee lands on the new knee
    _q.setFromUnitVectors(_v1.subVectors(_b, _a).normalize(), _v2.subVectors(knee, _a).normalize());
    rotateBoneWorld(A, _q);
    // lower bone: swing so the ankle lands on the target
    B.getWorldPosition(_b);
    C.getWorldPosition(_c);
    _q.setFromUnitVectors(_v1.subVectors(_c, _b).normalize(), _v2.subVectors(_t, _b).normalize());
    rotateBoneWorld(B, _q);
    // the foot keeps the angle the clip gave it
    C.parent.getWorldQuaternion(_qp).invert();
    C.quaternion.copy(_qp.multiply(_qm));
    C.updateMatrixWorld(true);
  }

  breathe(dt, running) {
    if (!this.chest) return;
    this.puff += ((running ? 1 : 0) - this.puff) * Math.min(1, dt * (running ? 0.8 : 0.08));
    this.breathT += dt * this.rate * (1 + this.puff * 1.6) * Math.PI * 2;
    // a quicker in-breath and a slower settle
    const s = Math.sin(this.breathT), w = s > 0 ? s : s * 0.7;
    const amp = 0.022 + this.puff * 0.03;
    const k = 1 + w * amp;
    this.chest.scale.set(k, 1, k);
    for (const c of this.chestKids) c.scale.set(1 / k, 1, 1 / k);
  }
}

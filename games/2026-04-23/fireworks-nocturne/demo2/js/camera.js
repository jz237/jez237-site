// Viewpoints: the terrace (handheld), a spectator boat (bobbing), a drone
// circling the show, and a long lens from the hill. Drag looks around, the
// wheel or a pinch zooms, and switching glides from one view to the next.
// The director cuts between views during the auto show, like a broadcast.
import * as THREE from 'three';
import { CAMERAS, SITE } from './site.js?v=7';

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// Keep a usable width on tall screens: at least 72% of the 16:9 width.
export function fitFov(fov, aspect) {
  const hf = 2 * Math.atan(Math.tan(fov * Math.PI / 360) * (16 / 9)) * 0.72;
  return Math.min(Math.max(fov, 2 * Math.atan(Math.tan(hf / 2) / aspect) * 180 / Math.PI), 100);
}

export class CameraRig {
  constructor(camera) {
    this.cam = camera;
    this.index = 0;
    this.yaw = 0; this.pitch = 0; this.zoom = 1;
    this.tYaw = 0; this.tPitch = 0; this.tZoom = 1;
    this.blend = 1;
    this.from = null;
    this.clock = 0;
    this.right = new THREE.Vector3(1, 0, 0);
    this._q = new THREE.Quaternion();
    this._m = new THREE.Matrix4();
  }

  get preset() { return CAMERAS[this.index]; }

  set(i, instant = false) {
    i = (i + CAMERAS.length) % CAMERAS.length;
    if (i === this.index && !instant) return;
    this.from = instant ? null : { pos: this.cam.position.clone(), q: this.cam.quaternion.clone(), fov: this.cam.fov };
    this.blend = instant ? 1 : 0;
    this.index = i;
    this.tYaw = this.tPitch = 0; this.tZoom = 1;
    if (instant) { this.yaw = this.pitch = 0; this.zoom = 1; }
  }

  look(dx, dy) {
    this.tYaw = Math.max(-1.2, Math.min(1.2, this.tYaw - dx));
    this.tPitch = Math.max(-0.45, Math.min(0.9, this.tPitch + dy));
  }
  zoomBy(f) { this.tZoom = Math.max(0.6, Math.min(4, this.tZoom * f)); }

  pose(t, out, index = this.index, offsets = true) {
    const p = CAMERAS[index];
    const pos = v3(p.pos), look = v3(p.look);
    let roll = 0;
    if (p.sway === 'orbit') {
      const a = -0.6 + t * 0.022;
      const c = v3(SITE.center);
      pos.set(c.x + Math.sin(a) * 520, 210 + Math.sin(t * 0.05) * 30, c.z + Math.cos(a) * 520);
    } else if (p.sway === 'boat') {
      pos.y += Math.sin(t * 1.15) * 0.22 + Math.sin(t * 0.47) * 0.12;
      roll = Math.sin(t * 0.83) * 0.022 + Math.sin(t * 0.31) * 0.012;
      look.y += Math.sin(t * 0.71) * 4;
    } else if (p.sway === 'hand') {
      look.x += Math.sin(t * 0.37) * 2.2 + Math.sin(t * 1.3) * 0.5;
      look.y += Math.sin(t * 0.29 + 1) * 1.6 + Math.sin(t * 1.7) * 0.35;
    }
    out.pos.copy(pos);
    const fwd = look.clone().sub(pos).normalize();
    // user look offsets
    const yawQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), offsets ? this.yaw : 0);
    fwd.applyQuaternion(yawQ);
    const el = Math.asin(Math.max(-1, Math.min(1, fwd.y))) + (offsets ? this.pitch : 0);
    const az = Math.atan2(fwd.x, -fwd.z);
    const ce = Math.max(-1.2, Math.min(1.35, el));
    fwd.set(Math.sin(az) * Math.cos(ce), Math.sin(ce), -Math.cos(az) * Math.cos(ce));
    this._m.lookAt(pos, pos.clone().add(fwd), new THREE.Vector3(Math.sin(roll), Math.cos(roll), 0));
    out.q.setFromRotationMatrix(this._m);
    out.fov = p.fov;
    return out;
  }

  update(dt, aspect) {
    this.clock += dt;
    const k = 1 - Math.exp(-dt * 6);
    this.yaw += (this.tYaw - this.yaw) * k;
    this.pitch += (this.tPitch - this.pitch) * k;
    this.zoom += (this.tZoom - this.zoom) * k;
    const o = { pos: new THREE.Vector3(), q: new THREE.Quaternion(), fov: 50 };
    this.aspect = aspect;
    this.pose(this.clock, o);
    let fov = fitFov(o.fov, aspect) / this.zoom;
    if (this.blend < 1 && this.from) {
      this.blend = Math.min(1, this.blend + dt / 2.6);
      const s = this.blend * this.blend * (3 - 2 * this.blend);
      const far = this.from.pos.distanceTo(o.pos) > 300;
      if (far) {
        // a long move fades through a fast dolly rather than flying through things
        o.pos.lerpVectors(this.from.pos, o.pos, s);
      } else o.pos.lerpVectors(this.from.pos, o.pos, s);
      o.q.slerpQuaternions(this.from.q, o.q, s);
      fov = this.from.fov + (fov - this.from.fov) * s;
    }
    this.cam.position.copy(o.pos);
    this.cam.quaternion.copy(o.q);
    this.cam.fov = fov;
    this.cam.aspect = aspect;
    this.cam.near = 0.5;
    this.cam.far = 16000;
    this.cam.updateProjectionMatrix();
    this.cam.updateMatrixWorld(true);
    this.right.set(1, 0, 0).applyQuaternion(this.cam.quaternion);
  }

  // Point in the show area under a screen position (NDC), for tap launches.
  aimAt(ndcX, ndcY) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.cam);
    const c = SITE.center;
    // vertical plane through the launch line, facing the camera
    const n = new THREE.Vector3(this.cam.position.x - c[0], 0, this.cam.position.z - c[2]).normalize();
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(n, v3(c));
    const hit = new THREE.Vector3();
    if (!ray.ray.intersectPlane(plane, hit)) return null;
    hit.x = Math.max(-560, Math.min(460, hit.x));
    hit.y = Math.max(70, Math.min(420, hit.y));
    return [hit.x, hit.y, hit.z];
  }
}

// Which views suit each act, in the order the director uses them.
const PLAN = {
  Overture: ['terrace'],
  Colour: ['terrace', 'boat', 'postcard'],
  Gold: ['bridge', 'drone', 'postcard', 'terrace'],
  Wonders: ['boat', 'terrace', 'drone', 'bridge'],
  Showpieces: ['postcard', 'terrace'],
  Finale: ['terrace'],
  Intermission: ['terrace'],
};
// views that can take in the bridge waterfall, best first
const FALLS = ['bridge', 'terrace', 'postcard', 'boat', 'drone'];

// Auto camera: a new view at each act, another every 15-24 s within an act,
// never in the seconds around a big shell's break, and a quick dip to black
// for each cut so the camera never flies through the scene. While the bridge
// waterfall pours, every view it uses has the falls in frame, so you can see
// where that roar is coming from.
export class Director {
  constructor(rig, fw, fade, world) {
    this.rig = rig;
    this.fw = fw;
    this.fade = fade;
    this.world = world;
    this.on = true;
    this.act = null;
    this.k = 0;
    this.next = 0;
    this.busy = false;
    this.onCut = null;
    this.log = [];
    this.probe = new THREE.PerspectiveCamera(50, 1, 0.5, 16000);
    this._o = { pos: new THREE.Vector3(), q: new THREE.Quaternion(), fov: 50 };
    this._v = new THREE.Vector3();
  }

  index(id) { return CAMERAS.findIndex(c => c.id === id); }
  current() { return CAMERAS[this.rig.index].id; }

  // no cut from 2.5 s before a big shell breaks to 2 s after
  quiet(t) { return !this.fw.breaks.some(b => b.inches >= 8 && b.t > t - 2 && b.t < t + 2.5); }

  fallsOn(t) { return this.fw.waterfallFrom <= t && this.fw.waterfallUntil > t + 1; }

  // Does this view show the waterfall? Two of three points along the curtain
  // must land well inside the frame.
  sees(id) {
    const i = this.index(id);
    if (i < 0) return false;
    const o = this.rig.pose(this.rig.clock + 0.3, this._o, i, false);
    const cam = this.probe;
    cam.position.copy(o.pos);
    cam.quaternion.copy(o.q);
    cam.aspect = this.rig.aspect || 16 / 9;
    cam.fov = fitFov(o.fov, cam.aspect);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    const B = SITE.bridge;
    let n = 0;
    for (const sp of [0.36, 0.5, 0.64]) {
      const p = this.world.bridgeAt(sp, B.deckY - 18, -(B.width / 2));
      const v = this._v.set(p[0], p[1], p[2]).project(cam);
      if (v.z < 1 && Math.abs(v.x) < 0.9 && Math.abs(v.y) < 0.9) n++;
    }
    return n >= 2;
  }

  pickFalls(prefer) {
    for (const id of [...prefer, ...FALLS]) if (this.sees(id)) return id;
    return 'bridge';
  }

  cut(id, t) {
    const i = this.index(id);
    if (i < 0 || i === this.rig.index || this.busy) return;
    this.busy = true;
    this.pending = { i, at: performance.now() + 280 };
    this.log.push({ t: Math.round(t * 10) / 10, act: this.act, view: id });
    this.fade.classList.add('on');
  }

  setOn(on) {
    this.on = on;
    this.act = null; // take up the current act's view straight away
    if (!on && this.pending) { this.pending = null; this.fade.classList.remove('on'); }
  }

  update(t, act, live) {
    // finish a cut in progress: switch while the screen is dark, then fade back
    const now = performance.now();
    if (this.pending && now >= this.pending.at) {
      this.rig.set(this.pending.i, true);
      if (this.onCut) this.onCut();
      this.fade.classList.remove('on');
      this.pending = null;
      this.settle = now + 420;
    }
    this.busy = !!this.pending || now < (this.settle || 0);
    if (!this.on || !live || this.busy) return;
    const plan = PLAN[act] || ['terrace'];
    const falls = this.fallsOn(t);
    const usable = falls ? plan.filter(id => this.sees(id)) : plan;
    if (act !== this.act) {
      const first = usable[0] || this.pickFalls(plan);
      // a new act's view waits (up to 12 s) for a moment without a big break
      if (this.current() !== first && !this.quiet(t)) {
        if (this.waitFrom === undefined) this.waitFrom = t;
        if (t - this.waitFrom < 12) return;
      }
      this.waitFrom = undefined;
      this.act = act;
      this.k = Math.max(0, plan.indexOf(first));
      this.next = t + 15 + Math.random() * 9;
      this.fallsCheck = t + 1;
      if (this.current() !== first) this.cut(first, t);
      return;
    }
    // the waterfall has started, or the drone has drifted round: bring it back
    if (falls && t >= (this.fallsCheck || 0)) {
      this.fallsCheck = t + 1;
      if (!this.sees(this.current())) {
        if (this.quiet(t) || t - (this.fallsWait ?? t) > 3) {
          this.fallsWait = undefined;
          this.cut(this.pickFalls(plan), t);
          this.next = t + 15 + Math.random() * 9;
          return;
        }
        if (this.fallsWait === undefined) this.fallsWait = t;
      }
    }
    if (usable.length < 2 || t < this.next) return;
    if (!this.quiet(t)) { this.next = t + 0.5; return; }
    let pick = usable[(usable.indexOf(this.current()) + 1) % usable.length];
    if (pick === this.current()) pick = usable[(usable.indexOf(pick) + 1) % usable.length];
    this.cut(pick, t);
    this.next = t + 15 + Math.random() * 9;
  }
}

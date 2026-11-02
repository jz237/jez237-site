// Procedural characters: a jointed puppet with a pose solver driven by gameplay state.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { plaidTexture } from './textures.js';
import { clamp, lerp } from './util.js';

const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal }, extra));
let PLAID = null;

function capsule(r, len, mat, seg = 10) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, seg), mat);
  m.position.y = -len / 2 - r * .3; m.castShadow = true;
  return m;
}
function joint(parent, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }
function mesh(geo, mat, x = 0, y = 0, z = 0, parent) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; if (parent) parent.add(m); return m; }

const STYLES = {
  mac: { skin: 0xe2a57c, shirt: 'plaid', vest: 0xff7413, pants: 0x2f4c7c, boots: 0x6b4423, hat: 0xffc21a, glove: 0xc9a26a, build: 1.0, belly: 1.05, mustache: 0x3b2414, hair: 0x3b2414 },
  vandal: { skin: 0xc68e66, shirt: 0x6b3fa0, pants: 0x30343c, boots: 0xeeeeee, beanie: 0xd63a2f, glove: 0xc68e66, build: .95, belly: .9, lanky: 1.08, hood: true },
  inspector: { skin: 0xf0c09a, shirt: 0xf4f4f0, pants: 0xb59a6a, boots: 0x2a1d14, hat: 0xffffff, tie: 0xb51f2a, glove: 0xf0c09a, build: .95, belly: 1.25, glasses: true, clipboard: true, mustache: 0x9a9a9a },
};

export class Puppet {
  constructor(kind = 'mac') {
    const S = STYLES[kind]; this.kind = kind; this.S = S;
    if (!PLAID) PLAID = plaidTexture();
    const skin = std(S.skin, .55), pants = std(S.pants, .85), boots = std(S.boots, .7, .05), glove = std(S.glove, .8);
    const shirt = S.shirt === 'plaid' ? std(0xffffff, .8, 0, { map: PLAID }) : std(S.shirt, .8);
    const L = S.lanky || 1;
    this.root = new THREE.Group();
    this.body = joint(this.root, 0, 0, 0);            // squash/stretch + spin
    this.hips = joint(this.body, 0, .9 * L, 0);
    mesh(new RoundedBoxGeometry(.36, .2, .24, 3, .07), pants, 0, 0, 0, this.hips);
    // legs
    this.legs = [-1, 1].map(s => {
      const hip = joint(this.hips, s * .1, -.05, 0);
      hip.add(capsule(.075, .3 * L, pants));
      const knee = joint(hip, 0, -.4 * L, 0);
      knee.add(capsule(.065, .28 * L, pants));
      const ankle = joint(knee, 0, -.38 * L, 0);
      mesh(new RoundedBoxGeometry(.15, .12, .28, 2, .04), boots, 0, -.05, .05, ankle);
      return { hip, knee, ankle };
    });
    // torso
    this.spine = joint(this.hips, 0, .08, 0);
    const torsoMat = S.vest ? std(S.vest, .55, 0, { emissive: new THREE.Color(S.vest), emissiveIntensity: .08 }) : shirt;
    this.torso = mesh(new RoundedBoxGeometry(.4 * S.build, .46, .26 * S.belly, 4, .1), torsoMat, 0, .23, .0, this.spine);
    if (S.vest) {
      const refl = std(0xdfe6ea, .25, .8, { emissive: 0x334044, emissiveIntensity: .3 });
      for (const y of [.12, .3]) mesh(new THREE.BoxGeometry(.405 * S.build, .035, .265 * S.belly), refl, 0, y, 0, this.spine);
      mesh(new THREE.BoxGeometry(.12, .44, .02), shirt, 0, .24, .13 * S.belly + .002, this.spine); // shirt showing at the open vest
    }
    if (S.tie) {
      mesh(new THREE.BoxGeometry(.06, .3, .02), std(S.tie, .6), 0, .28, .13 * S.belly + .005, this.spine);
      mesh(new THREE.BoxGeometry(.06, .2, .02), std(0x1b2a4a, .6), -.12, .3, .13 * S.belly + .004, this.spine); // pocket protector-ish
    }
    // belt
    mesh(new THREE.BoxGeometry(.39 * S.build, .06, .25 * S.belly + .01), std(0x3b2414, .6), 0, .02, 0, this.spine);
    if (kind === 'mac') {
      mesh(new THREE.BoxGeometry(.07, .05, .02), std(0xd8b04a, .3, .9), 0, .02, .13 * S.belly + .005, this.spine);
      mesh(new RoundedBoxGeometry(.12, .14, .1, 2, .03), std(0x7a4b25, .7), .2, -.05, .02, this.spine);
      const hammer = this.beltHammer = joint(this.spine, -.21, -.02, .02);
      mesh(new THREE.CylinderGeometry(.015, .015, .28, 6), std(0x9b6b3a, .7), 0, -.1, 0, hammer);
      mesh(new THREE.BoxGeometry(.04, .04, .12), std(0x55575a, .4, .8), 0, .03, 0, hammer);
    }
    // neck + head
    this.neck = joint(this.spine, 0, .47, 0);
    mesh(new THREE.CylinderGeometry(.06, .07, .08, 10), skin, 0, .03, 0, this.neck);
    this.head = joint(this.neck, 0, .17, 0);
    const headMesh = mesh(new THREE.SphereGeometry(.15, 24, 18), skin, 0, 0, 0, this.head); headMesh.scale.set(1, 1.05, 1);
    mesh(new THREE.SphereGeometry(.035, 10, 8), skin, 0, -.01, .15, this.head);                  // nose
    for (const s of [-1, 1]) {
      mesh(new THREE.SphereGeometry(.025, 8, 6), skin, s * .15, 0, 0, this.head).scale.set(.6, 1.2, 1); // ears
      const eye = mesh(new THREE.SphereGeometry(.03, 10, 8), std(0xffffff, .3), s * .055, .04, .125, this.head);
      mesh(new THREE.SphereGeometry(.016, 8, 6), std(0x111111, .3), 0, 0, .022, eye);
      if (S.mustache || kind !== 'vandal') mesh(new THREE.BoxGeometry(.07, .015, .02), std(S.hair || S.mustache || 0x222222, .8), s * .06, .085, .13, this.head).rotation.z = -s * .15;
    }
    if (S.mustache) {
      const mu = std(S.mustache, .9);
      for (const s of [-1, 1]) { const m = mesh(new THREE.CapsuleGeometry(.025, .06, 3, 8), mu, s * .04, -.045, .14, this.head); m.rotation.z = s * 1.25; }
    }
    if (S.glasses) {
      const gm = std(0x111111, .4, .5);
      for (const s of [-1, 1]) { const r = mesh(new THREE.TorusGeometry(.035, .007, 6, 16), gm, s * .055, .04, .15, this.head); }
      mesh(new THREE.BoxGeometry(.04, .006, .006), gm, 0, .045, .155, this.head);
    }
    if (S.hat) {
      const hm = std(S.hat, .3, .05, { envMapIntensity: 1.2 });
      this.hat = joint(this.head, 0, .05, 0);
      const dome = mesh(new THREE.SphereGeometry(.17, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hm, 0, 0, 0, this.hat); dome.scale.set(1, .92, 1.08);
      const brim = mesh(new THREE.CylinderGeometry(.21, .21, .018, 28), hm, 0, .005, .025, this.hat); brim.scale.set(1, 1, 1.12);
      mesh(new THREE.BoxGeometry(.03, .025, .3), hm, 0, .155, .01, this.hat);
      this.hatMat = hm;
    } else if (S.beanie) {
      const bm = std(S.beanie, .9);
      this.hat = joint(this.head, 0, .04, 0);
      mesh(new THREE.SphereGeometry(.16, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), bm, 0, 0, 0, this.hat).scale.set(1, 1.1, 1);
      mesh(new THREE.TorusGeometry(.15, .03, 8, 20), bm, 0, .01, 0, this.hat).rotation.x = Math.PI / 2;
      mesh(new THREE.SphereGeometry(.04, 8, 6), bm, 0, .18, 0, this.hat);
    }
    if (S.hood) { const h = mesh(new THREE.TorusGeometry(.12, .05, 8, 16, Math.PI * 1.3), shirt, 0, -.13, -.06, this.head); h.rotation.set(1.3, 0, -Math.PI * .15 - 1.6); }
    // arms
    this.arms = [-1, 1].map(s => {
      const sh = joint(this.spine, s * (.22 * S.build + .02), .4, 0);
      mesh(new THREE.SphereGeometry(.075, 10, 8), torsoMat, 0, 0, 0, sh);
      sh.add(capsule(.06, .2 * L, shirt));
      const el = joint(sh, 0, -.3 * L, 0);
      el.add(capsule(.052, .18 * L, kind === 'mac' ? skin : shirt));
      const hand = joint(el, 0, -.28 * L, 0);
      mesh(new THREE.SphereGeometry(.058, 10, 8), glove, 0, 0, .01, hand).scale.set(1, 1.1, 1.2);
      return { sh, el, hand };
    });
    if (S.clipboard) {
      const cb = new THREE.Group(); this.arms[0].hand.add(cb); cb.position.set(.02, -.04, .08); cb.rotation.set(-.3, 0, 0);
      mesh(new THREE.BoxGeometry(.2, .28, .015), std(0x8a6a3a, .7), 0, 0, 0, cb);
      mesh(new THREE.BoxGeometry(.17, .22, .004), std(0xfafafa, .9), 0, -.01, .01, cb);
    }
    if (kind === 'vandal') {
      const can = mesh(new THREE.CylinderGeometry(.03, .03, .16, 10), std(0x22c55e, .35, .6), 0, -.04, .05, this.arms[1].hand);
      this.can = can;
    }
    // hand hammer for knockout swings (Mac only): handle in the fist, head pointing forward
    if (kind === 'mac') {
      const hh = this.handHammer = new THREE.Group(); this.arms[1].hand.add(hh); hh.position.set(0, -.02, .02); hh.rotation.x = Math.PI / 2;
      mesh(new THREE.CylinderGeometry(.02, .02, .42, 8), std(0x9b6b3a, .7), 0, .14, 0, hh);
      mesh(new THREE.BoxGeometry(.075, .075, .2), std(0x55575a, .35, .85), 0, .34, 0, hh);
      hh.visible = false;
    }
    // rivet gun (Mac only, shown while riveting)
    if (kind === 'mac') {
      const gun = new THREE.Group(); this.arms[1].hand.add(gun); gun.position.set(0, -.04, .06);
      mesh(new THREE.BoxGeometry(.07, .09, .26), std(0x2b2f36, .4, .7), 0, 0, .06, gun);
      mesh(new THREE.CylinderGeometry(.02, .025, .14, 8), std(0x9aa0a6, .3, .9), 0, 0, .25, gun).rotation.x = Math.PI / 2;
      mesh(new THREE.BoxGeometry(.05, .12, .05), std(0xffc21a, .5), 0, -.08, -.02, gun);
      gun.visible = false; this.gun = gun;
    }
    // carry anchor on the right shoulder (girders) and in front (crates)
    this.shoulderAnchor = joint(this.spine, .18, .52, 0);
    this.frontAnchor = joint(this.spine, 0, .28, .38);
    // dizzy stars
    this.stars = new THREE.Group(); this.head.add(this.stars); this.stars.position.y = .28; this.stars.visible = false;
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffe14a });
    for (let k = 0; k < 4; k++) {
      const st = new THREE.Mesh(new THREE.OctahedronGeometry(.045), starMat); const a = k / 4 * Math.PI * 2;
      st.position.set(Math.cos(a) * .2, 0, Math.sin(a) * .2); this.stars.add(st);
    }
    this.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.t = 0; this.phase = 0; this.squash = 1; this.squashV = 0; this.blink = 0; this.lie = 0;
  }
  land(intensity = 1) { this.squashV -= 2.2 * intensity; }
  // p: { mode, speed(0..1), vy, carry ('girder'|'crate'|null), climbPhase, t, rivet }
  update(dt, p) {
    this.t += dt; const t = this.t, k = clamp(p.speed || 0, 0, 1.4);
    if (p.mode === 'walk' || p.mode === 'idle') this.phase += dt * (5 + 7 * k) * (p.cadence || 1);
    const s = Math.sin(this.phase), c = Math.cos(this.phase);
    const [lL, lR] = this.legs, [aL, aR] = this.arms;
    // reset
    const set = (o, x = 0, y = 0, z = 0) => o.rotation.set(x, y, z);
    let hipsY = .9 * (this.S.lanky || 1), lean = 0, twist = 0, headX = 0, headY = 0;
    this.stars.visible = false; if (this.gun) this.gun.visible = false;
    const vandal = this.kind === 'vandal';
    switch (p.mode) {
      case 'walk': {
        const A = .25 + .5 * k;
        set(lL.hip, s * A - .05); set(lR.hip, -s * A - .05);
        set(lL.knee, Math.max(0, -c) * (.4 + .8 * k) + .08); set(lR.knee, Math.max(0, c) * (.4 + .8 * k) + .08);
        set(lL.ankle, -.1 * s); set(lR.ankle, .1 * s);
        hipsY -= .03 * k - Math.abs(c) * .045 * k;
        lean = .06 + .14 * k + (vandal ? .25 : 0); twist = s * .08 * k;
        if (!p.carry) {
          set(aL.sh, -s * (.3 + .6 * k), 0, -.08); set(aR.sh, s * (.3 + .6 * k), 0, .08);
          set(aL.el, -.3 - .5 * k); set(aR.el, -.3 - .5 * k);
          if (vandal && k < .9) { set(aL.sh, .2, 0, -.15); set(aR.sh, .2, 0, .15); set(aL.el, -1.4); set(aR.el, -1.4); }
        }
        break;
      }
      case 'idle': {
        const b = Math.sin(t * 2.1);
        set(lL.hip, -.04); set(lR.hip, -.04); set(lL.knee, .06); set(lR.knee, .06);
        hipsY += b * .006; lean = .02 + (vandal ? .1 : 0);
        if (!p.carry) { set(aL.sh, .05 + b * .03, 0, -.1); set(aR.sh, .05 - b * .03, 0, .1); set(aL.el, -.25); set(aR.el, -.25); }
        headY = Math.sin(t * .5) * .35 * (Math.sin(t * .23) > .4 ? 1 : 0);
        break;
      }
      case 'air': {
        const up = p.vy > 0;
        set(lL.hip, up ? -.9 : -.3); set(lL.knee, up ? 1.4 : .5); set(lR.hip, up ? .2 : -.1); set(lR.knee, up ? .5 : .3);
        if (!p.carry) {
          if (p.vy < -9) { set(aL.sh, -2.6 + Math.sin(t * 22) * .5, 0, -.6); set(aR.sh, -2.6 - Math.sin(t * 22) * .5, 0, .6); set(lL.hip, Math.sin(t * 16) * .7); set(lR.hip, -Math.sin(t * 16) * .7); }
          else { set(aL.sh, -.6, 0, -.7); set(aR.sh, -.6, 0, .7); set(aL.el, -.6); set(aR.el, -.6); }
        }
        lean = .1;
        break;
      }
      case 'climb': {
        const q = Math.sin(p.climbPhase || 0);
        set(aL.sh, -2.7 + q * .35, 0, -.1); set(aR.sh, -2.7 - q * .35, 0, .1); set(aL.el, -.5 - q * .3); set(aR.el, -.5 + q * .3);
        set(lL.hip, -.7 - q * .45); set(lR.hip, -.7 + q * .45); set(lL.knee, 1.1 + q * .4); set(lR.knee, 1.1 - q * .4);
        hipsY -= .05; lean = -.05;
        break;
      }
      case 'rivet': {
        set(lL.hip, -.9); set(lR.hip, -.3); set(lL.knee, 1.5); set(lR.knee, 1.9); set(lR.ankle, -.4); hipsY -= .32;
        const rec = Math.sin(t * 70) * .06;
        set(aR.sh, -1.2 + rec, 0, .1); set(aR.el, -.5); set(aL.sh, -1.0 + rec, 0, -.2); set(aL.el, -.7);
        lean = .45; headX = .35; if (this.gun) this.gun.visible = true;
        break;
      }
      case 'hurt': {
        this.stars.visible = true; this.stars.rotation.y = t * 6;
        set(aL.sh, -.4, 0, -1.1); set(aR.sh, -.4, 0, 1.1); set(lL.hip, -.2); set(lR.hip, .1); set(lL.knee, .4); set(lR.knee, .2);
        lean = Math.sin(t * 5) * .2; headY = Math.sin(t * 7) * .3; hipsY -= .05;
        break;
      }
      case 'flat': {
        this.stars.visible = true; this.stars.rotation.y = t * 6;
        set(aL.sh, -3, 0, -.5); set(aR.sh, -3, 0, .5); lean = 1.5; hipsY = .18;
        break;
      }
      case 'ko': {
        this.stars.visible = true; this.stars.rotation.y = t * 7;
        set(aL.sh, -2.6, 0, -1.2); set(aR.sh, -2.4, 0, 1.3); set(aL.el, -.4); set(aR.el, -.6);
        set(lL.hip, -.5); set(lL.knee, .9); set(lR.hip, -.15); set(lR.knee, .3);
        headY = Math.sin(t * 2.2) * .4;
        break;
      }
      case 'cheer': {
        const b = Math.abs(Math.sin(t * 7));
        set(aL.sh, -2.9 - b * .2, 0, -.35); set(aR.sh, -2.9 - b * .2, 0, .35); set(aL.el, -.3); set(aR.el, -.3);
        hipsY += b * .12; set(lL.knee, b * .5); set(lR.knee, b * .5); set(lL.hip, -b * .3); set(lR.hip, -b * .3);
        break;
      }
      case 'yank': {
        const b = Math.sin(t * 14);
        set(aL.sh, -1.4 + b * .3, 0, -.2); set(aR.sh, -1.4 - b * .3, 0, .2); set(lL.hip, -.6); set(lL.knee, .8); set(lR.hip, .3); hipsY -= .15; lean = -.25;
        break;
      }
    }
    // carry overrides arms
    if (p.carry === 'girder') { set(aR.sh, -2.75, 0, .25); set(aR.el, -1.6); set(aL.sh, -2.2, 0, .5); set(aL.el, -1.2); }
    else if (p.carry === 'crate' || p.carry === 'beam') { set(aL.sh, -1.25, 0, -.15); set(aR.sh, -1.25, 0, .15); set(aL.el, -.45); set(aR.el, -.45); lean -= .05; }
    // knockout swing: wind up, strike, recover
    if (this.handHammer) { this.handHammer.visible = p.swing > 0; this.beltHammer.visible = !(p.swing > 0); }
    if (p.swing > 0) {
      const sw = p.swing, ease = (a, b, k) => a + (b - a) * (k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k));
      let rx, el, tw, ln = 0;
      if (sw < .35) { const k = sw / .35; rx = ease(0, -2.9, k); el = ease(-.3, -1.5, k); tw = ease(0, -.45, k); }
      else if (sw < .55) { const k = (sw - .35) / .2; rx = ease(-2.9, -.55, k); el = ease(-1.5, -.15, k); tw = ease(-.45, .45, k); ln = .22 * k; }
      else { const k = (sw - .55) / .45; rx = ease(-.55, 0, k); el = ease(-.15, -.3, k); tw = ease(.45, 0, k); ln = .22 * (1 - k); }
      set(aR.sh, rx, 0, .25); set(aR.el, el); set(aL.sh, -.6, 0, -.35); set(aL.el, -.9);
      twist += tw; lean += ln;
    }
    this.hips.position.y = hipsY;
    this.spine.rotation.set(lean, twist, 0);
    // lie flat on the back when knocked out (pivot at the feet)
    this.lie += ((p.mode === 'ko' ? 1 : 0) - this.lie) * (1 - Math.exp(-12 * dt));
    this.body.rotation.x = -1.45 * this.lie; this.body.position.y = .16 * this.lie;
    this.neck.rotation.set(-lean * .6 + headX, headY, 0);
    // squash & stretch spring
    this.squashV += (1 - this.squash) * 180 * dt; this.squashV *= Math.exp(-14 * dt); this.squash += this.squashV * dt;
    const sq = clamp(this.squash, .6, 1.35); this.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    if (p.mode === 'air' && p.vy > 2) this.body.scale.set(.93, 1.08, .93);
  }
}

// Yard dog: small quadruped with its own gait.
export class Dog {
  constructor() {
    const fur = std(0x7b5634, .9), dark = std(0x3a2616, .9);
    this.root = new THREE.Group(); this.body = joint(this.root, 0, .45, 0);
    mesh(new RoundedBoxGeometry(.32, .3, .7, 3, .12), fur, 0, 0, 0, this.body);
    this.head = joint(this.body, 0, .16, .38);
    mesh(new RoundedBoxGeometry(.24, .22, .26, 3, .08), fur, 0, 0, .05, this.head);
    mesh(new RoundedBoxGeometry(.13, .11, .16, 2, .04), dark, 0, -.04, .22, this.head);
    mesh(new THREE.SphereGeometry(.03, 8, 6), std(0x111111, .3), 0, -.01, .31, this.head);
    for (const s of [-1, 1]) {
      mesh(new THREE.SphereGeometry(.025, 8, 6), std(0x111111, .2), s * .07, .05, .17, this.head);
      const ear = mesh(new THREE.BoxGeometry(.07, .12, .03), dark, s * .1, .13, -.02, this.head); ear.rotation.z = s * .3;
    }
    this.collar = mesh(new THREE.TorusGeometry(.12, .025, 6, 16), std(0xd62f2f, .5), 0, .05, .3, this.body); this.collar.rotation.x = Math.PI / 2;
    this.tail = joint(this.body, 0, .1, -.34);
    mesh(new THREE.CapsuleGeometry(.03, .22, 3, 6), fur, 0, .12, 0, this.tail);
    this.legs = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sz]) => {
      const j = joint(this.body, sx * .11, -.1, sz * .25);
      j.add(capsule(.045, .22, fur)); return j;
    });
    this.stars = new THREE.Group(); this.head.add(this.stars); this.stars.position.y = .22; this.stars.visible = false;
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffe14a });
    for (let k = 0; k < 3; k++) { const st = new THREE.Mesh(new THREE.OctahedronGeometry(.04), starMat); const a = k / 3 * Math.PI * 2; st.position.set(Math.cos(a) * .17, 0, Math.sin(a) * .17); this.stars.add(st); }
    this.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.t = 0; this.phase = 0;
  }
  land() {}
  update(dt, p) {
    this.t += dt; const k = clamp(p.speed || 0, 0, 1.5);
    this.phase += dt * (6 + 10 * k);
    const s = Math.sin(this.phase);
    this.stars.visible = p.mode === 'hurt' || p.mode === 'ko'; this.stars.rotation.y = this.t * 6;
    this.lie = (this.lie || 0) + ((p.mode === 'ko' ? 1 : 0) - (this.lie || 0)) * (1 - Math.exp(-12 * dt));
    const moving = p.mode === 'walk' && k > .05;
    this.legs.forEach((l, i) => { l.rotation.x = moving ? Math.sin(this.phase + (i === 0 || i === 3 ? 0 : Math.PI)) * .7 * k : 0; });
    this.body.position.y = .45 + (moving ? Math.abs(s) * .04 : 0);
    this.tail.rotation.z = Math.sin(this.t * (p.mode === 'hurt' ? 3 : 14)) * .6; this.tail.rotation.x = -.5;
    this.head.rotation.x = p.mode === 'hurt' ? .4 : moving ? -.1 + s * .05 : Math.sin(this.t * 1.3) * .1;
    this.body.rotation.z = p.mode === 'hurt' ? Math.sin(this.t * 5) * .2 : 1.45 * this.lie;
    this.body.position.y -= .22 * this.lie;
    if (this.lie > .5) this.legs.forEach((l, i) => { l.rotation.x = 0; l.rotation.z = (i & 1 ? -.4 : .4); }); else this.legs.forEach(l => l.rotation.z = 0);
  }
}

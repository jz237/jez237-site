// Predicted shell arc from the gun as it actually points right now (turret
// slew and barrel damping included), integrated with the same gravity and
// step as projectiles.js. Ends on terrain, a tree, or an enemy hull. The
// impact disc turns red when something blocks the shot short of the reticle.

import * as THREE from 'three';
import { SHELL } from './config.js?v=polish2';
import { getHeight } from './terrain.js?v=polish2';

const MAX_PTS = 160;
const STEP = 1 / 60;
const _o = new THREE.Vector3();
const _b = new THREE.Vector3();
const _p = new THREE.Vector3();
const _v = new THREE.Vector3();
const CLEAR = new THREE.Color(0xffd27a);
const BLOCKED = new THREE.Color(0xff5a3c);

export class Trajectory {
  constructor(scene) {
    this.positions = new Float32Array(MAX_PTS * 3);
    this.fade = new Float32Array(MAX_PTS);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('aFade', new THREE.BufferAttribute(this.fade, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: CLEAR.clone() }, uOpacity: { value: 0.55 } },
      vertexShader: /* glsl */`
        attribute float aFade; varying float vFade;
        void main() { vFade = aFade; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform vec3 uColor; uniform float uOpacity; varying float vFade;
        void main() {
          // dashed: every other ~2 m segment, fading in from the muzzle
          if (fract(vFade * 22.0) > 0.55) discard;
          gl_FragColor = vec4(uColor, uOpacity * smoothstep(0.0, 0.12, vFade));
        }`,
      transparent: true, depthWrite: false,
    });
    this.line = new THREE.Line(geo, this.mat);
    this.line.frustumCulled = false;
    this.line.visible = false;
    scene.add(this.line);

    // impact marker: constant screen size, so it reads at 20 m and 300 m
    // (a flat ground ring vanishes edge-on from the chase camera)
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const ctx = cv.getContext('2d');
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(32, 32, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(32, 32, 4, 0, Math.PI * 2); ctx.fill();
    const tex = new THREE.CanvasTexture(cv);
    this.ringMat = new THREE.SpriteMaterial({
      map: tex, color: CLEAR, transparent: true, opacity: 0.85, depthWrite: false, depthTest: false, fog: false, sizeAttenuation: false,
    });
    this.ring = new THREE.Sprite(this.ringMat);
    this.ring.visible = false;
    this.ring.renderOrder = 5;
    scene.add(this.ring);
    this.blocked = false;
    this.time = 0;
  }

  hide() { this.line.visible = false; this.ring.visible = false; }

  // tank: player Tank; speed: shell muzzle speed; aimPoint: reticle point;
  // enemies: [{tank}] to stop the arc on; foliage: tree hash for blocking
  update(dt, tank, speed, aimPoint, enemies, foliage, ready) {
    this.time += dt;
    const vis = tank.visual;
    vis.muzzle.getWorldPosition(_o);
    vis.pivot.getWorldPosition(_b);
    _v.subVectors(_o, _b).normalize().multiplyScalar(speed);
    _p.copy(_o);

    let n = 0, hitTree = false, hitTank = false, travelled = 0;
    const pos = this.positions;
    pos[0] = _p.x; pos[1] = _p.y; pos[2] = _p.z; n = 1;
    const maxT = SHELL.maxLife ?? 5;
    // coarse step keeps it cheap: 2-3 sim steps per drawn point
    const sub = speed > 110 ? 3 : 2;
    for (let t = 0; t < maxT && n < MAX_PTS; t += STEP * sub) {
      _v.y += SHELL.gravity * STEP * sub;
      const px = _p.x, py = _p.y, pz = _p.z;
      _p.addScaledVector(_v, STEP * sub);
      travelled += Math.hypot(_p.x - px, _p.y - py, _p.z - pz);
      let stop = false;
      const gy = getHeight(_p.x, _p.z);
      if (_p.y <= gy) {
        // back up to the surface along the segment
        const k = (py - getHeight(px, pz)) / Math.max(1e-4, (py - getHeight(px, pz)) - (_p.y - gy));
        _p.set(px + (_p.x - px) * k, 0, pz + (_p.z - pz) * k);
        _p.y = getHeight(_p.x, _p.z);
        stop = true;
      }
      if (!stop && travelled > 4) {
        for (const tree of foliage.treesNear(_p.x, _p.z, 1.6)) {
          const dx = _p.x - tree.x, dz = _p.z - tree.z, rr = tree.radius + SHELL.radius;
          if (dx * dx + dz * dz < rr * rr && _p.y > tree.y - 0.5 && _p.y < tree.y + tree.height) { stop = true; hitTree = true; break; }
        }
      }
      if (!stop) {
        for (const e of enemies) {
          if (!e.tank.alive) continue;
          const q = e.tank.visual.root.position, r = 2.1 * (e.tank.scale ?? 1);
          const dx = _p.x - q.x, dy = _p.y - (q.y + 1.2), dz = _p.z - q.z;
          if (dx * dx + dy * dy + dz * dz < r * r) { stop = true; hitTank = true; break; }
        }
      }
      pos[n * 3] = _p.x; pos[n * 3 + 1] = _p.y; pos[n * 3 + 2] = _p.z; n++;
      if (stop) break;
    }
    // aFade = normalised distance along the arc (drives dashes + fade-in)
    let acc = 0;
    this.fade[0] = 0;
    for (let i = 1; i < n; i++) {
      acc += Math.hypot(pos[i * 3] - pos[i * 3 - 3], pos[i * 3 + 1] - pos[i * 3 - 2], pos[i * 3 + 2] - pos[i * 3 - 1]);
      this.fade[i] = acc / 90;
    }
    const geo = this.line.geometry;
    geo.setDrawRange(0, n);
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aFade.needsUpdate = true;

    // blocked = lands well short of where the reticle is
    const land = _p;
    const miss = Math.hypot(land.x - aimPoint.x, land.z - aimPoint.z);
    const toAim = Math.hypot(aimPoint.x - _o.x, aimPoint.z - _o.z);
    const toLand = Math.hypot(land.x - _o.x, land.z - _o.z);
    this.blocked = !hitTank && miss > Math.max(4, toAim * 0.06) && toLand < toAim - 3 && (hitTree || miss > 6);
    const col = this.blocked ? BLOCKED : CLEAR;
    this.mat.uniforms.uColor.value.copy(col);
    this.mat.uniforms.uOpacity.value = ready ? 0.7 : 0.3;
    this.ringMat.color.copy(col);

    this.ring.position.copy(land);
    this.ring.position.y += 0.6;
    const s = 0.034 * (1 + Math.sin(this.time * 6) * 0.06) * (this.blocked ? 1.2 : 1);
    this.ring.scale.set(s, s, 1);
    this.ringMat.opacity = ready ? 0.85 : 0.35;
    this.line.visible = true;
    this.ring.visible = true;
  }
}

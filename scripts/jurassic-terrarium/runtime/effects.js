// Small moments of life around the animals:
//   - leaf bits: when the Brachiosaurus crops a tree-fern crown, torn frond pieces tumble down;
//   - splashes: a Pteranodon snatching a fish leaves rings spreading on the pool and a burst of drops;
//   - the jetty lantern: a brass lantern on a post at the end of the jetty, as in the concept, glowing
//     at dusk and through the night.
// Everything is pooled: fixed-size instanced meshes, recycled oldest-first.
import {
  Group, InstancedMesh, Mesh, PlaneGeometry, RingGeometry, SphereGeometry, CylinderGeometry, BoxGeometry,
  MeshStandardMaterial, MeshBasicMaterial, PointLight, Matrix4, Quaternion, Vector3, Euler, Color, DoubleSide,
  AdditiveBlending, Sprite, SpriteMaterial, CanvasTexture,
} from 'three';

const M = new Matrix4(), Q = new Quaternion(), E = new Euler(), P = new Vector3(), Sc = new Vector3();
const HIDE = new Matrix4().makeScale(0, 0, 0);

export class Effects {
  constructor(ctx) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.name = 'effects';
    ctx.scene.add(this.group);
    this.buildLeaves();
    this.buildSplash();
    this.buildLantern();
    this.buildSteam();
  }

  // ---------------------------------------------------------------- steam after rain
  // When the sun comes out on a soaked jungle, soft wisps rise off the floor and the pool and fade.
  buildSteam() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,0.9)');
    r.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    const tex = new CanvasTexture(c);
    this.steam = [];
    for (let i = 0; i < 70; i++) {
      const s = new Sprite(new SpriteMaterial({ map: tex, color: 0xf4f6f2, transparent: true, opacity: 0, depthWrite: false }));
      s.visible = false;
      s.name = 'effects-steam';
      this.group.add(s);
      this.steam.push({ s, life: 0 });
    }
    this.steamNext = 0;
    this.steamAcc = 0;
  }

  updateSteam(dt) {
    const w = this.ctx.world, life = this.ctx.modules.life?.env;
    const wet = Math.max(w.groundWetness || 0, life?.wet || 0);
    const sun = (life?.sunny ?? 0) * (1 - (life?.rain || 0));
    const amount = Math.min(1, wet * 1.6) * sun * Math.min(1, ((life?.temp ?? 20) - 8) / 10);
    this.steamAcc += dt * amount * 14;
    const T = this.ctx.terrain, box = this.ctx.box, wind = w.windEnergy || 0;
    while (this.steamAcc >= 1) {
      this.steamAcc -= 1;
      const S = this.steam[this.steamNext];
      this.steamNext = (this.steamNext + 1) % this.steam.length;
      const x = (Math.random() * 2 - 1) * (box.halfW - 0.6), z = (Math.random() * 2 - 1) * (box.halfD - 0.5);
      const h = T.height(x, z);
      if (h > 2.2) continue; // not off the peaks
      S.p = new Vector3(x, Math.max(h, 0) + 0.05, z);
      S.life = S.max = 5 + Math.random() * 3;
      S.size = 0.25 + Math.random() * 0.25;
      S.s.visible = true;
    }
    for (const S of this.steam) {
      if (S.life <= 0) continue;
      S.life -= dt;
      const t = 1 - S.life / S.max;
      S.p.y += dt * 0.12;
      S.p.x += dt * (0.03 + wind * 0.08);
      S.s.position.copy(S.p);
      S.s.scale.setScalar(S.size * (1 + t * 1.8));
      S.s.material.opacity = 0.2 * Math.sin(Math.PI * t);
      if (S.life <= 0) S.s.visible = false;
    }
  }

  // ---------------------------------------------------------------- leaf bits
  buildLeaves() {
    const N = 48;
    const g = new PlaneGeometry(0.035, 0.012);
    const m = new MeshStandardMaterial({ color: 0x4f7a2c, roughness: 0.8, side: DoubleSide });
    this.leafMesh = new InstancedMesh(g, m, N);
    this.leafMesh.name = 'effects-leaves';
    this.leafMesh.frustumCulled = false;
    this.leaves = Array.from({ length: N }, () => ({ life: 0 }));
    this.leafNext = 0;
    for (let i = 0; i < N; i++) this.leafMesh.setMatrixAt(i, HIDE);
    const tint = new Color();
    for (let i = 0; i < N; i++) this.leafMesh.setColorAt(i, tint.setHSL(0.24 + Math.random() * 0.06, 0.5, 0.25 + Math.random() * 0.15));
    this.group.add(this.leafMesh);
  }

  leafBurst(pos, n = 6) {
    for (let k = 0; k < n; k++) {
      const L = this.leaves[this.leafNext];
      this.leafNext = (this.leafNext + 1) % this.leaves.length;
      L.p = pos.clone().add(new Vector3((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.12));
      L.v = new Vector3((Math.random() - 0.5) * 0.15, 0.05 + Math.random() * 0.08, (Math.random() - 0.5) * 0.15);
      L.r = new Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      L.w = new Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
      L.life = 3 + Math.random() * 1.5;
      L.ground = this.ctx.terrain.height(L.p.x, L.p.z);
    }
  }

  // ---------------------------------------------------------------- splashes
  buildSplash() {
    const NR = 8, ND = 40;
    this.ringMat = new MeshBasicMaterial({ color: 0xe8f4f2, transparent: true, opacity: 0.6, depthWrite: false, side: DoubleSide });
    this.rings = [];
    for (let i = 0; i < NR; i++) {
      const r = new Mesh(new RingGeometry(0.8, 1, 40), this.ringMat.clone());
      r.rotation.x = -Math.PI / 2;
      r.visible = false;
      r.renderOrder = 1.06;
      r.name = 'effects-ring';
      this.group.add(r);
      this.rings.push({ mesh: r, life: 0 });
    }
    this.ringNext = 0;
    const dg = new SphereGeometry(0.006, 6, 4);
    this.dropMesh = new InstancedMesh(dg, new MeshBasicMaterial({ color: 0xf2fbfa, transparent: true, opacity: 0.85 }), ND);
    this.dropMesh.name = 'effects-drops';
    this.dropMesh.frustumCulled = false;
    for (let i = 0; i < ND; i++) this.dropMesh.setMatrixAt(i, HIDE);
    this.drops = Array.from({ length: ND }, () => ({ life: 0 }));
    this.dropNext = 0;
    this.group.add(this.dropMesh);
  }

  splash(x, z, y = 0, size = 1) {
    for (let k = 0; k < 3; k++) {
      const R = this.rings[this.ringNext];
      this.ringNext = (this.ringNext + 1) % this.rings.length;
      R.mesh.position.set(x, y + 0.004 + k * 0.001, z);
      R.delay = k * 0.25;
      R.life = 1.6;
      R.size = size;
      R.mesh.visible = false;
    }
    for (let k = 0; k < 14; k++) {
      const D = this.drops[this.dropNext];
      this.dropNext = (this.dropNext + 1) % this.drops.length;
      const a = Math.random() * Math.PI * 2, s = (0.08 + Math.random() * 0.18) * size;
      D.p = new Vector3(x, y + 0.01, z);
      D.v = new Vector3(Math.cos(a) * s, (0.35 + Math.random() * 0.4) * size, Math.sin(a) * s);
      D.life = 1.2;
      D.y0 = y;
    }
  }

  // ---------------------------------------------------------------- jetty lantern
  buildLantern() {
    const props = this.ctx.modules.life?.props;
    const F = props?.jettyFrame, deck = props?.jettyDeckY ?? 0.262;
    if (!F) return;
    const at = (x, y, z) => new Vector3(x, y, z).applyMatrix4(F);
    const wood = new MeshStandardMaterial({ color: 0x4a3524, roughness: 0.9 });
    const brass = new MeshStandardMaterial({ color: 0x8a6a32, metalness: 0.85, roughness: 0.4 });
    this.glassMat = new MeshStandardMaterial({ color: 0xffd9a0, emissive: new Color(1.0, 0.72, 0.38), emissiveIntensity: 0, roughness: 0.3, transparent: true, opacity: 0.9 });
    const g = new Group();
    g.name = 'jetty-lantern';
    const base = at(0.76, deck, 0.075);
    const post = new Mesh(new CylinderGeometry(0.008, 0.009, 0.16, 8), wood);
    post.position.set(0, 0.08, 0);
    const arm = new Mesh(new BoxGeometry(0.045, 0.005, 0.005), brass);
    arm.position.set(0.02, 0.155, 0);
    const cap = new Mesh(new CylinderGeometry(0.004, 0.013, 0.01, 8), brass);
    cap.position.set(0.04, 0.152, 0);
    const lamp = new Mesh(new CylinderGeometry(0.009, 0.009, 0.022, 8), this.glassMat);
    lamp.position.set(0.04, 0.135, 0);
    const foot = new Mesh(new CylinderGeometry(0.011, 0.011, 0.004, 8), brass);
    foot.position.set(0.04, 0.123, 0);
    g.add(post, arm, cap, lamp, foot);
    for (const o of [post, arm, cap, foot]) o.castShadow = true;
    g.position.copy(base);
    g.rotation.y = props.jettyDir?.theta ?? 0;
    // a small warm light pooling on the deck and the water at night
    this.lanternLight = new PointLight(0xffb866, 0, 1.4, 2);
    this.lanternLight.position.set(0.04, 0.13, 0);
    g.add(this.lanternLight);
    const halo = new Mesh(new SphereGeometry(0.03, 12, 8), new MeshBasicMaterial({ color: 0xffc070, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
    halo.position.copy(lamp.position);
    this.halo = halo;
    g.add(halo);
    this.group.add(g);
    this.lantern = g;
  }

  update(dt, env) {
    this.updateSteam(dt);
    // leaves tumble and drift down, then lie on the ground a moment and vanish
    let leavesLive = false;
    this.leaves.forEach((L, i) => {
      if (L.life <= 0) return;
      leavesLive = true;
      L.life -= dt;
      if (L.p.y > L.ground + 0.005) {
        L.v.y = Math.max(-0.18, L.v.y - dt * 0.5); // light: they flutter, they don't drop
        L.v.x += Math.sin(L.life * 3 + i) * dt * 0.2;
        L.p.addScaledVector(L.v, dt);
        L.r.addScaledVector(L.w, dt);
      } else L.p.y = L.ground + 0.004;
      const s = L.life > 0.5 ? 1 : L.life / 0.5;
      M.compose(L.p, Q.setFromEuler(E.set(L.r.x, L.r.y, L.r.z)), Sc.set(s, s, s));
      this.leafMesh.setMatrixAt(i, L.life > 0 ? M : HIDE);
    });
    if (leavesLive || this._leavesWere) this.leafMesh.instanceMatrix.needsUpdate = true;
    this._leavesWere = leavesLive;
    // rings spread and fade
    for (const R of this.rings) {
      if (R.life <= 0) continue;
      if (R.delay > 0) {
        R.delay -= dt;
        continue;
      }
      R.life -= dt;
      const t = 1 - R.life / 1.6;
      const s = (0.03 + t * 0.28) * R.size;
      R.mesh.scale.set(s, s, s);
      R.mesh.material.opacity = 0.55 * (1 - t);
      R.mesh.visible = R.life > 0;
    }
    // drops arc out and fall back
    let dropsLive = false;
    this.drops.forEach((D, i) => {
      if (D.life <= 0) return;
      dropsLive = true;
      D.life -= dt;
      D.v.y -= 2.4 * dt;
      D.p.addScaledVector(D.v, dt);
      if (D.p.y < D.y0) D.life = 0;
      M.compose(D.p, Q.identity(), Sc.set(1, 1, 1));
      this.dropMesh.setMatrixAt(i, D.life > 0 ? M : HIDE);
    });
    if (dropsLive || this._dropsWere) this.dropMesh.instanceMatrix.needsUpdate = true;
    this._dropsWere = dropsLive;
    // the lantern is lit from dusk till dawn, with a slow flicker
    if (!this.lantern && !this.lanternTried) {
      this.lanternTried = true;
      this.buildLantern();
    }
    if (this.lantern) {
      const life = this.ctx.modules.life?.env;
      const dark = Math.min(1, (life?.night ?? env?.night ?? 0) + Math.max(life?.dusk || 0, life?.golden || 0) * 0.7);
      this.lit = (this.lit ?? dark) + (dark - (this.lit ?? dark)) * Math.min(1, dt * 0.8);
      const fl = 0.9 + 0.1 * Math.sin(performance.now() * 0.011) * Math.sin(performance.now() * 0.0047 + 1.3);
      this.glassMat.emissiveIntensity = 0.15 + 2.6 * this.lit * fl;
      this.lanternLight.intensity = 0.35 * this.lit * fl;
      this.halo.material.opacity = 0.55 * this.lit * fl;
    }
  }
}

import * as THREE from 'three';
import { petalGeometry, leafGeometry, tubeThrough, taperedTube } from '../geometry/shapes.js';
import { gearGeometry, pitchRadius, meshAngle } from '../geometry/gears.js';
import { Rod, collarGeometry, knuckleGeometry, screwGeometry } from '../geometry/parts.js';
import { addPulse } from '../materials/library.js';
import { leafTexture, petalTextures } from '../materials/textures.js';
import { gust, washAt } from './wind.js';
const _wp = new THREE.Vector3(), _wv = new THREE.Vector3();
import { B } from '../direction/beats.js';
import { clamp, lerp, smoother, seg, sseg, settle, rampIntegral } from '../core/ease.js';
import { RNG } from '../core/rng.js';

// The hero flower: a porcelain-and-brass bloom whose petals are opened by a
// visible mechanism. Drive shaft → calyx gears → lead screws → three
// telescoping sleeves → push rods → petal levers → hinged petals. Petal tips
// are a second hinged segment that unfolds a beat after the base.

const TAU = Math.PI * 2;

const RINGS = [
  // name, count, hinge radius, hinge y, length, width, closed, open, tipOpen, sleeve radius, phase
  { name: 'outer', count: 8, R: 2.35, y: -0.15, len: 6.6, width: 4.3, closed: 0.04, open: 1.5, tip: 0.26, tipClosed: -0.88, twist: 0.42, sleeve: 0.95, phase: 0, cup: 1.0, curl: 0.5 },
  { name: 'middle', count: 8, R: 1.8, y: 0.05, len: 5.6, width: 3.7, closed: -0.06, open: 1.12, tip: 0.2, tipClosed: -0.78, twist: 0.38, sleeve: 0.72, phase: TAU / 16, cup: 0.95, curl: 0.6 },
  { name: 'inner', count: 6, R: 1.3, y: 0.22, len: 4.4, width: 3.0, closed: -0.14, open: 0.8, tip: 0.14, tipClosed: -0.72, twist: 0.36, sleeve: 0.5, phase: TAU / 12, cup: 0.85, curl: 0.75 },
];

const SPLIT = 0.56; // where the tip segment's hinge sits along the petal

export class HeroFlower {
  constructor(mat, { stemTop = new THREE.Vector3(0.4, 29, -0.6) } = {}) {
    this.mat = mat;
    this.group = new THREE.Group();
    this.group.name = 'heroFlower';

    // materials that react to the story (cloned so they can glow independently)
    this.rimMat = mat.gold.clone();
    this.rimMat.emissive = new THREE.Color('#ffb048');
    this.rimMat.emissiveIntensity = 0;
    const pt = petalTextures({ size: 1024 });
    this.porcelain = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      map: pt.map,
      roughness: 1,
      metalness: 1,
      roughnessMap: pt.orm,
      metalnessMap: pt.orm,
      emissive: new THREE.Color('#ffae62'),
      emissiveMap: pt.emissive,
      emissiveIntensity: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      sheen: 0.25,
      sheenColor: new THREE.Color('#fff0dc'),
      side: THREE.DoubleSide,
    });
    this.anther = new THREE.MeshStandardMaterial({ color: '#ffcf7a', emissive: '#ffb347', emissiveIntensity: 0.2, roughness: 0.6 });

    this._buildStem(stemTop);
    this._buildHead();
    this._buildSheath();
    this._buildLeaves();

    this.group.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  // ------------------------------------------------------------------------
  _buildStem(top) {
    const mat = this.mat;
    const pts = [
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0.15, 6, 0.1),
      new THREE.Vector3(-0.25, 13, 0.35),
      new THREE.Vector3(0.05, 20, 0.1),
      new THREE.Vector3(0.35, 26, -0.4),
      top.clone(),
    ];
    this.stemCurve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const stem = new THREE.Mesh(taperedTube(this.stemCurve, 0.48, 0.34, 120, 18), mat.brass);
    this.group.add(stem);

    // collars where the drive shaft's universal joints sit
    this.joints = [];
    const collarG = collarGeometry(0.62, 0.42);
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 1; i <= 6; i++) {
      const k = i / 7;
      const p = this.stemCurve.getPointAt(k);
      const tng = this.stemCurve.getTangentAt(k);
      const c = new THREE.Mesh(collarG, mat.gold);
      c.position.copy(p);
      c.quaternion.setFromUnitVectors(up, tng);
      this.group.add(c);
      this.joints.push({ k, p, tng });
    }

    // copper drive vein spiralling up the stem; carries the climbing light
    const vein = [];
    const N = 200;
    for (let i = 0; i <= N; i++) {
      const k = i / N;
      const p = this.stemCurve.getPointAt(k);
      const tng = this.stemCurve.getTangentAt(k);
      const side = new THREE.Vector3().crossVectors(tng, new THREE.Vector3(1, 0, 0)).normalize();
      const side2 = new THREE.Vector3().crossVectors(tng, side).normalize();
      const a = k * TAU * 3.25;
      const r = 0.5 - k * 0.1;
      vein.push(p.clone().addScaledVector(side, Math.cos(a) * r).addScaledVector(side2, Math.sin(a) * r));
    }
    this.veinMat = mat.copper.clone();
    this.veinPulse = addPulse(this.veinMat, {}, { color: '#ffa640', width: 0.025, trail: 0.12 });
    const veinMesh = new THREE.Mesh(tubeThrough(vein, 0.09, 400, 8), this.veinMat);
    this.group.add(veinMesh);

    // the drive shaft: straight steel segments between universal joints,
    // offset from the stem so it can be seen turning
    this.shaftSegs = [];
    const offsetDir = new THREE.Vector3(-0.7, 0, 0.7).normalize();
    const shaftPts = [new THREE.Vector3(0, 0.9, 0).addScaledVector(offsetDir, 0.95)];
    for (const j of this.joints) shaftPts.push(j.p.clone().addScaledVector(offsetDir, 0.95));
    const shaftGeo = new THREE.CylinderGeometry(0.11, 0.11, 1, 6, 1);
    shaftGeo.translate(0, 0.5, 0);
    const markGeo = new THREE.BoxGeometry(0.06, 0.5, 0.25);
    markGeo.translate(0, 0.5, 0.06);
    for (let i = 0; i < shaftPts.length - 1; i++) {
      const a = shaftPts[i], b = shaftPts[i + 1];
      const holder = new THREE.Group();
      holder.position.copy(a);
      holder.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      const len = a.distanceTo(b);
      const spin = new THREE.Group();
      const s = new THREE.Mesh(shaftGeo, mat.steel);
      s.scale.y = len;
      spin.add(s);
      // a flat key along the shaft so the rotation reads
      const key = new THREE.Mesh(markGeo, mat.gold);
      key.scale.y = len * 0.9;
      key.position.y = len * 0.05;
      spin.add(key);
      holder.add(spin);
      // universal joint block at the top of each segment
      const uj = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), mat.brassAged);
      uj.position.y = len;
      spin.add(uj);
      // bracket tying the joint to the stem collar
      this.group.add(holder);
      this.shaftSegs.push(spin);
      if (i < this.joints.length) {
        const br = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.0), mat.brassAged);
        const mid = b.clone().lerp(this.joints[i].p, 0.5);
        br.position.copy(mid);
        br.lookAt(this.joints[i].p);
        this.group.add(br);
      }
    }
  }

  // ------------------------------------------------------------------------
  _buildHead() {
    const mat = this.mat;
    const top = this.stemCurve.getPointAt(1);
    const tng = this.stemCurve.getTangentAt(1);
    const head = new THREE.Group();
    head.position.copy(top).addScaledVector(tng, 2.9);
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tng.clone().lerp(new THREE.Vector3(0.05, 1, 0.25), 0.5).normalize());
    this.group.add(head);
    this.head = head;

    // calyx: openwork brass cup with a hinge ring on top
    const prof = [];
    for (let i = 0; i <= 16; i++) {
      const k = i / 16;
      prof.push(new THREE.Vector2(0.45 + Math.pow(k, 0.7) * 2.0, -3.1 + k * 3.0));
    }
    const calyxGeo = new THREE.LatheGeometry(prof, 48);
    const calyx = new THREE.Mesh(calyxGeo, mat.brassAged);
    calyx.material = mat.brassAged.clone();
    calyx.material.side = THREE.DoubleSide;
    calyx.material.alphaMap = this._calyxWindows();
    calyx.material.alphaTest = 0.5;
    head.add(calyx);

    for (const r of RINGS) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r.R, 0.09, 10, 80), mat.gold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = r.y - 0.05;
      head.add(ring);
    }
    // (the sepals are the porcelain bud sheath, see _buildSheath)

    // central spindle and the three telescoping sleeves
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 4.4, 14), mat.steel);
    spindle.position.y = -1.0;
    head.add(spindle);
    this.sleeves = RINGS.map((r) => {
      const g = new THREE.Group();
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(r.sleeve, r.sleeve, 0.9, 32, 1, true), mat.brass);
      tube.material = mat.brass;
      g.add(tube);
      const flange = new THREE.Mesh(collarGeometry(r.sleeve + 0.16, 0.2), mat.gold);
      flange.position.y = 0.4;
      g.add(flange);
      head.add(g);
      return g;
    });

    // lead-screw drive gears on the calyx flanks
    this.calyxGears = [];
    const m = 0.07;
    for (const side of [0, Math.PI]) {
      const cluster = new THREE.Group();
      const a = side + 0.6;
      cluster.position.set(Math.cos(a) * 1.75, -1.7, Math.sin(a) * 1.75);
      cluster.rotation.y = -a + Math.PI / 2;
      const gA = new THREE.Mesh(gearGeometry({ teeth: 18, module: m, thickness: 0.12, spokes: 4 }), mat.gold);
      const gB = new THREE.Mesh(gearGeometry({ teeth: 11, module: m, thickness: 0.14, spokes: 0 }), mat.steel);
      const gC = new THREE.Mesh(gearGeometry({ teeth: 22, module: m, thickness: 0.12, spokes: 5, curved: 0.3 }), mat.brass);
      const holderA = new THREE.Group(), holderB = new THREE.Group(), holderC = new THREE.Group();
      holderA.add(gA); holderB.add(gB); holderC.add(gC);
      const dAB = 0.9, dBC = 2.2;
      holderB.position.set(Math.cos(dAB) * (pitchRadius(18, m) + pitchRadius(11, m)), Math.sin(dAB) * (pitchRadius(18, m) + pitchRadius(11, m)), 0.02);
      holderC.position.copy(holderB.position).add(new THREE.Vector3(Math.cos(dBC), Math.sin(dBC), 0).multiplyScalar(pitchRadius(11, m) + pitchRadius(22, m)));
      cluster.add(holderA, holderB, holderC);
      for (const h of [holderA, holderB, holderC]) {
        const sc = new THREE.Mesh(screwGeometry(0.07), mat.steelBlued);
        sc.rotation.x = Math.PI / 2;
        sc.position.z = 0.08;
        h.add(sc);
      }
      head.add(cluster);
      this.calyxGears.push({ holderA, holderB, holderC, dAB, dBC });
    }

    // petals: base segment + hinged tip, with lever and push rod
    this.petals = [];
    const knuckle = knuckleGeometry(0.075, 0.5);
    for (const r of RINGS) {
      const baseLen = r.len;
      const params = { length: baseLen, width: r.width, cup: r.cup, curl: r.curl, thickness: 0.07, tip: 0.6, baseWidth: 0.3 };
      const base = petalGeometry({ ...params, u0: 0, u1: SPLIT, segU: 18, segV: 18 });
      const tipG = petalGeometry({ ...params, u0: SPLIT, u1: 1, segU: 18, segV: 18 });
      const tipPivot = base.sample(SPLIT, 0); // relative to petal origin
      r.rimMat = this.rimMat.clone();
      const rimBase = this._rimGeometry(base.edge, 0.05);
      const rimTip = this._rimGeometry(tipG.edge, 0.05);
      // a short stiffening rib near the hinge only (full-length keels read as cage bars)
      const keelBase = tubeThrough(base.keel.slice(0, Math.ceil(base.keel.length * 0.45)), 0.04, 12, 6);
      for (let i = 0; i < r.count; i++) {
        const phi = r.phase + (i / r.count) * TAU;
        const holder = new THREE.Group();
        holder.position.set(Math.cos(phi) * r.R, r.y, Math.sin(phi) * r.R);
        holder.rotation.set(0, Math.PI / 2 - phi, 0, 'YXZ');
        const hinge = new THREE.Group(); // rotates about local X
        holder.add(hinge);
        const twist = new THREE.Group(); // pitch about the petal's own midline
        hinge.add(twist);
        const baseMesh = new THREE.Mesh(base.geometry, this.porcelain);
        twist.add(baseMesh);
        twist.add(new THREE.Mesh(rimBase, r.rimMat));
        twist.add(new THREE.Mesh(keelBase, mat.brass));
        const k1 = new THREE.Mesh(knuckle, mat.gold);
        hinge.add(k1);
        // lever arm under the hinge, pointing down and inward
        const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.16), mat.brass);
        lever.position.set(0, -0.42, -0.18);
        lever.rotation.x = -0.4;
        hinge.add(lever);
        const tipHolder = new THREE.Group();
        tipHolder.position.copy(tipPivot);
        twist.add(tipHolder);
        const tipMesh = new THREE.Mesh(tipG.geometry, this.porcelain);
        tipHolder.add(tipMesh);
        tipHolder.add(new THREE.Mesh(rimTip, r.rimMat));
        const k2 = new THREE.Mesh(knuckleGeometry(0.05, r.width * 0.16), mat.gold);
        k2.position.z = -0.09; // tip hinge sits on the inner face (no crossbar outside)
        tipHolder.add(k2);
        head.add(holder);
        const rod = new Rod(mat.steel, 0.045, 8, mat.gold).addTo(head);
        this.petals.push({ ring: r, phi, holder, hinge, twist, tipHolder, rod, leverLocal: new THREE.Vector3(0, -0.85, -0.36), rodLen: null, jitter: Math.sin(i * 12.9898 + r.R * 78.233) });
      }
    }

    // amber core lamp in a brass cage, on top of the spindle
    const core = new THREE.Group();
    core.position.y = 1.05;
    head.add(core);
    this.coreGlass = new THREE.Mesh(new THREE.SphereGeometry(0.85, 40, 28), mat.amberGlass.clone());
    core.add(this.coreGlass);
    this.filament = new THREE.Mesh(new THREE.TorusKnotGeometry(0.28, 0.025, 80, 6, 2, 5), new THREE.MeshBasicMaterial({ color: '#ffb35a' }));
    core.add(this.filament);
    for (let i = 0; i < 8; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.035, 6, 48, Math.PI), mat.gold);
      rib.rotation.y = (i / 8) * Math.PI;
      rib.rotation.z = Math.PI / 2;
      rib.rotation.order = 'YZX';
      core.add(rib);
    }
    const crown = new THREE.Mesh(collarGeometry(0.32, 0.25), mat.gold);
    crown.position.y = 0.9;
    core.add(crown);
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 12), mat.gold);
    finial.position.y = 1.2;
    core.add(finial);
    this.core = core;

    // stamens: telescoping gold filaments with luminous anthers
    this.stamens = [];
    const filGeo = new THREE.CylinderGeometry(0.025, 0.035, 1, 6);
    filGeo.translate(0, 0.5, 0);
    const antherGeo = new THREE.SphereGeometry(0.085, 12, 8);
    antherGeo.scale(1, 1.7, 1);
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * TAU + (i % 2) * 0.1;
      const g = new THREE.Group();
      g.position.set(Math.cos(a) * 0.95, 0.35, Math.sin(a) * 0.95);
      g.rotation.set(0, Math.PI / 2 - a, 0, 'YXZ');
      const fil = new THREE.Mesh(filGeo, mat.gold);
      g.add(fil);
      const an = new THREE.Mesh(antherGeo, this.anther);
      g.add(an);
      head.add(g);
      this.stamens.push({ g, fil, an, a, len: 1.6 + (i % 3) * 0.35, lean: 0.35 + (i % 2) * 0.2 });
    }

    // the lamp light that warms the porcelain from inside
    this.coreLight = new THREE.PointLight('#ffae55', 0, 14, 2);
    this.coreLight.position.y = 1.1;
    head.add(this.coreLight);
  }

  // ------------------------------------------------------------------------
  // The bud sheath: five hinged porcelain sepals close the bud into one smooth
  // ovoid — a pierced-porcelain lantern with gilt seams, glowing from within —
  // held shut by a finial clasp. When the clasp lets go the sepals swing down
  // on spring-loaded knuckle hinges (with a damped settle), just ahead of the
  // outer petals, and come to rest beneath the bloom like a calyx.
  _buildSheath() {
    const mat = this.mat;
    const head = this.head;
    const tex = sheathTextures(1024);
    this.sheathMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff', map: tex.map, roughness: 1, metalness: 1, roughnessMap: tex.orm, metalnessMap: tex.orm,
      emissive: new THREE.Color('#ffa955'), emissiveMap: tex.emissive, emissiveIntensity: 0,
      clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.3, sheenColor: new THREE.Color('#fff0dc'), side: THREE.DoubleSide,
    });
    this.sheathRimMat = mat.gold.clone();
    this.sheathRimMat.emissive = new THREE.Color('#ffb048');
    this.sheathRimMat.emissiveIntensity = 0;
    // profile (radius, height) in head space: base on the hinge ring, ovoid, pointed apex
    const ctrl = [[2.72, -0.38], [3.08, 0.45], [3.42, 1.55], [3.56, 2.75], [3.42, 3.95], [3.0, 5.05], [2.3, 6.0], [1.42, 6.75], [0.58, 7.22], [0.0, 7.4]];
    const curve = new THREE.SplineCurve(ctrl.map(([r, y]) => new THREE.Vector2(r, y)));
    const prof = curve.getSpacedPoints(44);
    const Y = new THREE.Vector3(0, 1, 0);
    const HR = 2.72, HY = -0.38;
    this.sheath = [];
    const gap = 0.012;
    const nu = 18;
    const NS = 5;
    for (let i = 0; i < NS; i++) {
      const phiM = 0.55 + (i * TAU) / NS;
      const a0 = phiM - Math.PI / NS + gap, a1 = phiM + Math.PI / NS - gap;
      const H = new THREE.Vector3(Math.cos(phiM) * HR, HY, Math.sin(phiM) * HR);
      const toLocal = (p) => p.sub(H).applyAxisAngle(Y, -(Math.PI / 2 - phiM));
      const at = (a, j) => toLocal(new THREE.Vector3(Math.cos(a) * prof[j].x, prof[j].y, Math.sin(a) * prof[j].x));
      const pos = [], uv = [], idx = [];
      for (let j = 0; j < prof.length; j++) {
        for (let k = 0; k <= nu; k++) {
          const a = a0 + ((a1 - a0) * k) / nu;
          const p = at(a, j);
          pos.push(p.x, p.y, p.z);
          uv.push(k / nu, j / (prof.length - 1));
        }
      }
      for (let j = 0; j < prof.length - 1; j++) {
        for (let k = 0; k < nu; k++) {
          const a = j * (nu + 1) + k, b = a + 1, c = a + nu + 1, d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      // make the front face the outside (normals point away from the bud axis)
      {
        const n = new THREE.Vector3().fromBufferAttribute(geo.attributes.normal, 10 * (nu + 1) + (nu >> 1));
        const p = new THREE.Vector3().fromBufferAttribute(geo.attributes.position, 10 * (nu + 1) + (nu >> 1));
        const axisLocal = toLocal(new THREE.Vector3(0, p.y + HY, 0));
        if (n.dot(p.clone().sub(axisLocal).setY(0)) < 0) {
          for (let q = 0; q < idx.length; q += 3) { const tmp = idx[q + 1]; idx[q + 1] = idx[q + 2]; idx[q + 2] = tmp; }
          geo.setIndex(idx);
          geo.computeVertexNormals();
        }
      }
      const holder = new THREE.Group();
      holder.position.copy(H);
      holder.rotation.set(0, Math.PI / 2 - phiM, 0, 'YXZ');
      const hinge = new THREE.Group();
      holder.add(hinge);
      hinge.add(new THREE.Mesh(geo, this.sheathMat));
      // gilt seams down both edges and a gilt band round the foot
      const edgeA = prof.map((_, j) => at(a0, j)), edgeB = prof.map((_, j) => at(a1, j));
      const foot = [];
      for (let k = 0; k <= nu; k++) foot.push(at(a0 + ((a1 - a0) * k) / nu, 0));
      for (const e of [edgeA, edgeB]) hinge.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(e), 60, 0.055, 6, false), this.sheathRimMat));
      hinge.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(foot), 40, 0.075, 6, false), this.sheathRimMat));
      // spring-loaded knuckle hinge on the ring
      for (const x of [-0.7, 0.7]) {
        const k = new THREE.Mesh(knuckleGeometry(0.09, 0.42), mat.gold);
        k.position.x = x;
        hinge.add(k);
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.1), mat.brass);
        bracket.position.set(x, 0.22, 0.02);
        hinge.add(bracket);
      }
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.85, 8), mat.steel);
      pin.rotation.z = Math.PI / 2;
      holder.add(pin);
      const coil = [];
      for (let q = 0; q <= 60; q++) { const a = (q / 60) * TAU * 6; coil.push(new THREE.Vector3(-0.32 + (q / 60) * 0.64, Math.cos(a) * 0.08, Math.sin(a) * 0.08)); }
      holder.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coil), 120, 0.018, 4, false), mat.steelBlued));
      if (i === 0) {
        // the finial clasp rides on the first sepal and holds the others' tips
        const apex = toLocal(new THREE.Vector3(0, 7.4, 0));
        const clasp = new THREE.Group();
        clasp.position.copy(apex);
        const collar = new THREE.Mesh(collarGeometry(0.32, 0.22), mat.gold);
        collar.position.y = 0.02;
        clasp.add(collar);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), mat.gold);
        ball.position.y = 0.26;
        clasp.add(ball);
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.55, 12), mat.gold);
        spike.position.y = 0.62;
        clasp.add(spike);
        hinge.add(clasp);
        this.clasp = clasp;
      }
      head.add(holder);
      this.sheath.push({ holder, hinge, i });
    }
  }

  _rimGeometry(edge, r) {
    const curve = new THREE.CatmullRomCurve3(edge, false, 'centripetal');
    return new THREE.TubeGeometry(curve, edge.length * 2, r, 6, false);
  }

  _calyxWindows() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#000';
    // lancet windows around the cup (u wraps around, v up the profile)
    for (let i = 0; i < 12; i++) {
      const x = (i + 0.5) * (512 / 12);
      ctx.beginPath();
      ctx.moveTo(x - 13, 200);
      ctx.lineTo(x - 13, 110);
      ctx.quadraticCurveTo(x, 60, x + 13, 110);
      ctx.lineTo(x + 13, 200);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 21, 70, 6, 0, TAU);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  // ------------------------------------------------------------------------
  _buildLeaves() {
    const mat = this.mat;
    const veinTex = leafTexture(9, 512);
    this.leafMatA = new THREE.MeshPhysicalMaterial({ color: '#7b8a3e', metalness: 0.85, roughness: 0.42, bumpMap: veinTex, bumpScale: 2.5, side: THREE.DoubleSide, clearcoat: 0.3 });
    this.leafMatB = new THREE.MeshPhysicalMaterial({ color: '#b07a3a', metalness: 0.9, roughness: 0.38, bumpMap: veinTex, bumpScale: 2.5, side: THREE.DoubleSide });
    this.leaves = [];
    const specs = [
      { k: 0.2, az: 2.4, len: 9, width: 3.6, mat: this.leafMatA },
      { k: 0.36, az: 0.45, len: 8, width: 3.2, mat: this.leafMatB },
      { k: 0.55, az: 1.1, len: 7, width: 2.8, mat: this.leafMatA },
      { k: 0.12, az: -2.3, len: 7.5, width: 3.0, mat: this.leafMatB },
    ];
    for (const s of specs) {
      const { geometry, midrib } = leafGeometry({ length: s.len, width: s.width, fold: 0.6, arch: 0.7 });
      const p = this.stemCurve.getPointAt(s.k);
      const holder = new THREE.Group();
      holder.position.copy(p);
      holder.rotation.set(0, s.az, 0, 'YXZ');
      const hinge = new THREE.Group();
      holder.add(hinge);
      const leaf = new THREE.Mesh(geometry, s.mat);
      leaf.position.z = 0.35;
      leaf.rotation.x = Math.PI / 2; // leaf grows outward along +Z of holder
      hinge.add(leaf);
      const rib = new THREE.Mesh(tubeThrough(midrib, 0.06, 40, 6), mat.gold);
      rib.position.copy(leaf.position);
      rib.rotation.copy(leaf.rotation);
      hinge.add(rib);
      const bracket = new THREE.Mesh(knuckleGeometry(0.11, 0.6), mat.gold);
      bracket.position.z = 0.35;
      hinge.add(bracket);
      this.group.add(holder);
      this.leaves.push({ holder, hinge, s });
    }
  }

  // ------------------------------------------------------------------------
  // Opening state for each ring at time t (0 closed → 1 open), with a small
  // mechanical settle at the end of travel.
  ringOpen(t, ringName) {
    const [a, b] = B[ringName];
    const k = seg(t, a, b);
    if (k <= 0) return 0;
    const eased = smoother(k);
    const after = Math.max(0, t - b);
    const wobble = after > 0 ? Math.exp(-after * 5) * Math.sin(after * 18) * 0.025 : 0;
    return eased + wobble;
  }

  // Exposed for the bee: world position of the pollen landing zone.
  landingPoint(target = new THREE.Vector3()) {
    return this.head.localToWorld(target.set(0.35, 1.15, 1.25));
  }

  coreWorld(target = new THREE.Vector3()) {
    return this.core.getWorldPosition(target);
  }

  update(t, ctx) {
    // drive shaft: spins up when the barrel releases
    const shaftAngle = rampIntegral(ctx.crownT ?? t, B.hubSpin[0], B.hubSpin[1], 5.5);
    for (let i = 0; i < this.shaftSegs.length; i++) this.shaftSegs[i].rotation.y = shaftAngle * (i % 2 ? -1 : 1) * -1;

    // light climbing the vein
    const climb = seg(t, B.stemClimb[0], B.stemClimb[1]);
    this.veinPulse.uPulse.value = t < B.stemClimb[0] ? -1 : lerp(-0.05, 1.08, smoother(climb));
    this.veinPulse.uCharge.value = clamp(climb * 1.4) * 0.8;
    this.veinPulse.uPulseGain.value = 1;

    // ring openings
    const opens = {
      outer: this.ringOpen(t, 'outer'),
      middle: this.ringOpen(t, 'middle'),
      inner: this.ringOpen(t, 'inner'),
    };
    // a faint "breath" in the closed bud while it charges
    const budBreath = sseg(t, B.budGlow[0], B.budGlow[1]) * (1 - clamp(opens.outer * 3)) * 0.04 * Math.sin(t * 5.2);

    const tmpA = new THREE.Vector3();
    let travel = 0;
    const sleeveH = { outer: [], middle: [], inner: [] };
    for (const p of this.petals) {
      const r = p.ring;
      const o = opens[r.name];
      const beta = lerp(r.closed, r.open, o) + budBreath + p.jitter * 0.03 * o;
      p.hinge.rotation.x = beta;
      // the spiral pitch unwinds over the first part of the travel
      p.twist.rotation.y = r.twist * (1 - smoother(clamp(o / 0.55)));
      // tip segment unfolds just behind the base (follower linkage)
      const tipO = clamp((o - 0.04) / 0.7);
      p.tipHolder.rotation.x = lerp(r.tipClosed, r.tip, smoother(tipO));
    }
    this.head.updateMatrixWorld(true);
    // push rods: from each lever end to its sleeve flange (rod length fixed)
    const leverEnd = new THREE.Vector3();
    for (const p of this.petals) {
      const r = p.ring;
      leverEnd.copy(p.leverLocal);
      p.hinge.localToWorld(leverEnd);
      this.head.worldToLocal(leverEnd);
      const rE = Math.hypot(leverEnd.x, leverEnd.z);
      const rc = r.sleeve + 0.12;
      if (p.rodLen === null) {
        // define rod length from the closed pose with the sleeve at its low stop
        p.rodLen = Math.hypot(rE - rc, 1.25);
      }
      const dx = rE - rc;
      const hs = leverEnd.y - Math.sqrt(Math.max(0.01, p.rodLen * p.rodLen - dx * dx));
      sleeveH[r.name].push(hs);
      tmpA.set(Math.cos(p.phi) * rc, hs, Math.sin(p.phi) * rc);
      p.rod.set(tmpA, leverEnd);
    }
    RINGS.forEach((r, i) => {
      const hs = sleeveH[r.name];
      const avg = hs.reduce((a, b) => a + b, 0) / hs.length;
      this.sleeves[i].position.y = avg - 0.4;
      travel += avg;
    });
    if (this._travel0 === undefined) this._travel0 = travel;
    // calyx gears turn only while the sleeves travel (lead screw drive)
    const gA = (travel - this._travel0) * 4.2;
    for (const c of this.calyxGears) {
      c.holderA.rotation.z = gA;
      const aB = meshAngle(gA, 18, 11, c.dAB);
      c.holderB.rotation.z = aB;
      c.holderC.rotation.z = meshAngle(aB, 11, 22, c.dBC);
    }

    // bud sheath: clasp lets go, the sepals swing down and settle
    const SH = B.sheath;
    for (const sp of this.sheath) {
      const t0 = SH[0] + sp.i * 0.05;
      const k = seg(t, t0, SH[1]);
      const after = Math.max(0, t - SH[1]);
      const wob = after > 0 ? Math.exp(-after * 4.5) * Math.sin(after * 15) * 0.07 : 0;
      sp.hinge.rotation.x = 2.45 * smoother(k) + wob;
    }
    {
      const lit = 0.06 + sseg(t, B.budGlow[0], B.budGlow[1] - 0.6) * 1.9;
      const fade = 1 - sseg(t, SH[0] + 0.1, SH[1]) * 0.9;
      this.sheathMat.emissiveIntensity = lit * fade;
      this.sheathRimMat.emissiveIntensity = lit * fade * 0.05;
    }

    // core lamp
    const coreK = sseg(t, B.core[0], B.core[1]);
    const rs = t - (ctx.respondAt ?? B.flowerRespond);
    const respond = rs > 0 ? (1 - Math.exp(-rs * 4)) * Math.exp(-rs * 0.9) : 0;
    const bud = sseg(t, B.budGlow[0], B.budGlow[1]) * (1 - sseg(t, B.outer[0] + 0.5, B.middle[1]));
    const glow = 0.04 + coreK * 1.0 + respond * 0.8 + bud * 0.5;
    this.coreGlass.material.emissiveIntensity = glow * 1.4;
    const fil = 0.6 + glow * 9;
    this.filament.material.color.setRGB(1.0 * fil, 0.6 * fil, 0.26 * fil);
    this.filament.rotation.y = t * 0.4;
    this.coreLight.intensity = (coreK * 8 + respond * 6 + bud * 5) * ctx.lightScale;

    // stamens rise and fan out
    const st = sseg(t, B.stamens[0], B.stamens[1]);
    const pollenGlow = 0.15 + st * 0.9 + respond * 1.4 + (ctx.pollenTouch || 0) * 1.2;
    this.anther.emissiveIntensity = pollenGlow;
    for (const s of this.stamens) {
      const len = 0.2 + s.len * st;
      s.fil.scale.y = len;
      s.g.rotation.x = s.lean * st + Math.sin(t * 1.3 + s.a * 3) * 0.02 * st;
      s.an.position.y = len;
    }

    // petal rims and porcelain warm up when pollination succeeds
    // the answer ripples outward: inner rims glow first, then middle, then outer
    RINGS.forEach((r, i) => {
      const t0 = (ctx.respondAt ?? B.flowerRespond) + i * 0.28;
      const s = t - t0;
      const pulse = s > 0 ? Math.exp(-s * 1.3) * (1 - Math.exp(-s * 5)) : 0;
      r.rimMat.emissiveIntensity = pulse * 1.1 + coreK * 0.04;
    });
    this.porcelain.emissiveIntensity = coreK * 0.2 + respond * 0.22 + bud * 0.55;

    // leaves unfurl as the garden wakes
    const wake = sseg(t, B.podsWake[0], B.podsWake[1] + 4);
    // and lift and flutter a little in the breeze (and in APX-9's wash)
    for (const l of this.leaves) {
      const p = l.holder.position;
      const g = gust(p.x, p.z, t);
      const wsh = washAt(_wp.set(p.x + Math.sin(l.s.az) * 4, p.y, p.z + Math.cos(l.s.az) * 4), _wv).length();
      l.hinge.rotation.x = lerp(-0.9, -0.15, wake) + Math.sin(t * 0.7 + l.s.az) * 0.015
        + wake * (g * (0.025 + 0.03 * Math.sin(t * 2.3 + l.s.az * 3)) + Math.min(0.35, wsh * 0.3));
      l.hinge.rotation.z = wake * g * 0.03 * Math.sin(t * 3.1 + l.s.az * 2);
    }
  }
}

// Pierced-porcelain lantern texture for the bud sheath (u around a sepal, v
// foot → apex): ivory glaze with a gilt vine and dotted borders; the emissive
// map lets the core light glow through the thin glaze and blaze through the
// pierced rosettes (gilding blocks it).
function sheathTextures(size = 1024) {
  const W = size, H = size;
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const col = mk(), orm = mk(), emi = mk();
  const c = col.getContext('2d'), o = orm.getContext('2d'), e = emi.getContext('2d');
  const rng = new RNG('sheath');
  // canvas y runs down; texture v runs up (flipY), so draw the apex at the top
  const g = c.createLinearGradient(0, H, 0, 0);
  g.addColorStop(0, '#ead9bb');
  g.addColorStop(0.3, '#f3e8d4');
  g.addColorStop(1, '#fbf6ee');
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) {
    c.fillStyle = `rgba(${rng.range(205, 255) | 0},${rng.range(190, 235) | 0},${rng.range(165, 210) | 0},0.04)`;
    c.beginPath();
    c.ellipse(rng.range(0, W), rng.range(0, H), rng.range(14, 70), rng.range(8, 30), rng.range(0, 3), 0, TAU);
    c.fill();
  }
  o.fillStyle = 'rgb(255,92,0)';
  o.fillRect(0, 0, W, H);
  // glow through the glaze: brightest across the belly, dimmer at foot, apex and seams
  const eg = e.createRadialGradient(W * 0.5, H * 0.52, 0, W * 0.5, H * 0.52, W * 0.62);
  eg.addColorStop(0, '#ffffff');
  eg.addColorStop(0.55, '#8d7a64');
  eg.addColorStop(1, '#1c140c');
  e.fillStyle = eg;
  e.fillRect(0, 0, W, H);
  // pierced rosettes in two curving columns either side of the vine
  const rosette = (ctx, x, y, r, fill) => {
    ctx.fillStyle = fill;
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * TAU + Math.PI / 4;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.28, a, 0, TAU);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r * 0.22, 0, TAU);
    ctx.fill();
  };
  const holes = [];
  for (let j = 0; j < 7; j++) {
    const v = 0.2 + j * 0.095;
    const spread = 0.2 + 0.05 * Math.sin(Math.PI * (v - 0.1) / 0.75);
    for (const sgn of [-1, 1]) holes.push([0.5 + sgn * spread, 1 - v, W * (0.026 + 0.012 * Math.sin(Math.PI * (v - 0.12) / 0.7))]);
  }
  for (const [u, v, r0] of holes) {
    const r = r0 * 0.85;
    rosette(c, u * W, v * H, r, '#f7e3bd');
    rosette(e, u * W, v * H, r, '#ffffff');
    rosette(o, u * W, v * H, r, 'rgb(255,40,0)');
  }
  // gilding: central vine with scroll leaves, a band at the foot, dotted borders by the seams
  const gild = (ctx, color) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = W * 0.011;
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.95);
    for (let k = 0; k <= 40; k++) { const v = 0.95 - k * 0.021; ctx.lineTo(W * (0.5 + Math.sin(k * 0.55) * 0.012), H * v); }
    ctx.stroke();
    for (let k = 0; k < 9; k++) {
      const y = H * (0.86 - k * 0.085);
      for (const sgn of [-1, 1]) {
        ctx.lineWidth = W * (0.0075 - k * 0.0004);
        ctx.beginPath();
        ctx.moveTo(W * 0.5, y);
        ctx.quadraticCurveTo(W * (0.5 + sgn * 0.06), y - H * 0.05, W * (0.5 + sgn * 0.085), y - H * 0.02);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(W * (0.5 + sgn * 0.085), y - H * 0.035, H * 0.014, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.fillRect(0, H * 0.955, W, H * 0.03);
    ctx.lineWidth = W * 0.005;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.94); ctx.lineTo(W, H * 0.94);
    ctx.stroke();
    for (let k = 0; k < 46; k++) {
      const y = H * (0.92 - k * 0.019);
      for (const u of [0.035, 0.965]) { ctx.beginPath(); ctx.arc(W * u, y, W * 0.0045, 0, TAU); ctx.fill(); }
    }
  };
  gild(c, '#c99a45');
  gild(o, 'rgb(255,60,255)');
  gild(e, '#000000');
  const tx = (cv, srgb) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = 4;
    return t;
  };
  return { map: tx(col, true), orm: tx(orm, false), emissive: tx(emi, true) };
}

// Car B modelled underbody (CAR agent). Built procedurally once at load in car B's frame (glTF: +X forward, +Y up,
// +Z = car right = the street side; y = height above the road). Car B is the game's fleet mid-size SUV
// (assets/props/car_suv_midsize.glb): wheel sockets x +-1.458, z +-0.849, tyre r 0.379; body sills z +-0.95.
//   buildUnderbody(ctx, { frame, wheels, quality }) -> { group, heightAt(x, z), animated, update(t, camera), dims }
// What the lying camera sees overhead: stamped floor pan with ribs and seams, sill pinch welds, frame rails,
// transmission tunnel, exhaust (down pipe, resonator, heat shields, rear muffler), fuel tank + straps, rear axle with
// the differential + trailing arms, front subframe + control arms + oil pan + skid plate, inner wheel-arch liners,
// brake/fuel lines. Lighting: the cabin floor never sees the sky; a "street bounce" term (onBeforeCompile) lights the
// street-facing / downward faces from the wet street outside the slit, fading inward, so the structure reads as a
// rim-lit silhouette instead of a flat black band.
import * as THREE from 'three';
import { box, rbox, cyl, merge, xform, tube } from './geo.js';
import { canvasTexture } from './textures.js';
import { rng } from './util.js';

export const SUV = { wheelX: 1.458, wheelZ: 0.849, tyreR: 0.379, tyreW: 0.24, sillZ: 0.95, sillY: 0.235, floorY: 0.315, tunnelY: 0.43 };

function grimeTexture() {
  return canvasTexture('carB_underGrime', 512, 512, (g, w, h) => {
    const R = rng(91);
    g.fillStyle = '#4a4744'; g.fillRect(0, 0, w, h);
    // road film: streaks along the car (u = along), splotches, rust blooms
    for (let i = 0; i < 1400; i++) {
      const x = R() * w, y = R() * h, l = 8 + R() * 60;
      const c = 40 + R() * 50 | 0;
      g.strokeStyle = `rgba(${c},${c - 4},${c - 8},${0.08 + R() * 0.18})`;
      g.lineWidth = 1 + R() * 3;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (R() - 0.5) * 4); g.stroke();
    }
    for (let i = 0; i < 160; i++) {
      const x = R() * w, y = R() * h, r = 3 + R() * 22;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const rust = R() < 0.4;
      gr.addColorStop(0, rust ? 'rgba(120,62,28,0.55)' : 'rgba(18,16,14,0.5)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    // dried mud spatter
    for (let i = 0; i < 2500; i++) {
      const c = 70 + R() * 50 | 0;
      g.fillStyle = `rgba(${c},${c - 8},${c - 18},${0.25 + R() * 0.4})`;
      g.fillRect(R() * w, R() * h, 1 + R() * 2.5, 1 + R() * 2.5);
    }
  }, { repeat: [1, 1] });
}

// a corrugated (stamped) panel: transverse ribs along x, in the xz plane at height y (faces down), ribs bulge down
function ribbedPanel(x0, x1, z0, z1, y, { ribs = 10, depth = 0.014, segZ = 6 } = {}) {
  const nx = ribs * 6;
  const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0, nx, segZ);
  g.rotateX(Math.PI / 2); // normal -Y
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const u = (x + (x1 - x0) / 2) / (x1 - x0);
    const vz = (z + (z1 - z0) / 2) / (z1 - z0);
    const edge = Math.min(1, Math.min(vz, 1 - vz) * 22);   // ribs run almost to the sill (the U3 frame sees that strip)
    const s = Math.pow(Math.max(0, Math.sin(u * Math.PI * ribs)), 2.5);
    p.setXYZ(i, x + (x0 + x1) / 2, y - depth * s * edge, z + (z0 + z1) / 2);
  }
  g.computeVertexNormals();
  return g;
}

export function buildUnderbody(ctx, { frame, wheels, quality = 'high' } = {}) {
  const group = new THREE.Group();
  group.name = 'CarB_underbody';
  const grime = grimeTexture();
  grime.wrapS = grime.wrapT = THREE.RepeatWrapping;
  // street bounce: light reflected off the wet street into the slit (street side = +Z), and a weaker warm bounce
  // from the sidewalk side. Uniforms are shared by every underbody material.
  const bounce = {
    uBounceStreet: { value: new THREE.Color(0.52, 0.6, 0.72) },
    uBounceCurb: { value: new THREE.Color(0.42, 0.3, 0.2) },
    uBounceK: { value: 36.0 },
    uCarInv: { value: new THREE.Matrix4() },
  };
  const addBounce = (m, k = 1) => {
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, bounce);
      sh.uniforms.uMatK = { value: k };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vUbPos; varying vec3 vUbN;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvUbPos = transformed; vUbN = normalize(objectNormal);');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vUbPos; varying vec3 vUbN; uniform vec3 uBounceStreet; uniform vec3 uBounceCurb; uniform float uBounceK; uniform float uMatK;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          {
            // car-frame position/normal (the meshes are built in the car frame)
            float dS = clamp((vUbPos.z - 0.0) / 0.95, -1.0, 1.0);        // -1 curb sill .. +1 street sill
            float fs = exp(-max(0.0, 0.97 - vUbPos.z) / 0.3);              // street side brightest, falls off fast inward
            float fc = exp(-max(0.0, 0.97 + vUbPos.z) / 0.22);             // curb side: a faint warm edge
            float down = max(0.0, -vUbN.y);
            float toS = max(0.0, vUbN.z), toC = max(0.0, -vUbN.z);
            float lowK = smoothstep(0.62, 0.2, vUbPos.y);                 // only the underside (not the cabin)
            // directional key from the lit street ahead-right (forward + street side + below): the stamped ribs,
            // seams and brackets get a lit and a dark side instead of one flat value
            float key = max(0.0, dot(vUbN, normalize(vec3(0.55, -0.35, 0.76))));
            vec3 b = uBounceStreet * fs * (0.16 * down + 1.0 * toS + 0.06 + 0.9 * key) + uBounceCurb * fc * (0.12 * down + 0.5 * toC);
            vec3 alb = clamp(diffuseColor.rgb * 60.0, 0.0, 2.0);          // grime variation, ~1 on average
            // rim: silhouette edges against the bright slit catch the street light (strongest near the street sill)
            float rimV = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
            b += uBounceStreet * rimV * (0.25 + 1.6 * fs) * 0.9;
            totalEmissiveRadiance += alb * b * uBounceK * uMatK * lowK * 0.004;
          }`);
    };
    m.customProgramCacheKey = () => 'carB_bounce_' + k;
    return m;
  };
  const M = (key, make) => ctx.mat('carBUnder_' + key, make);
  const mats = {
    pan: M('pan', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBUnderPan', color: 0x6a6660, map: grime, roughness: 0.82, metalness: 0.35, bumpMap: grime, bumpScale: 0.8 }))),
    frame: M('frame', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBUnderFrame', color: 0x4a4843, map: grime, roughness: 0.7, metalness: 0.5 }), 0.8)),
    rust: M('rust', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBUnderRust', color: 0x6e4a33, map: grime, roughness: 0.62, metalness: 0.55 }), 1.2)),
    shield: M('shield', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBHeatShield', color: 0x9a968c, map: grime, roughness: 0.42, metalness: 0.85 }), 1.3)),
    plastic: M('plastic', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBUnderPlastic', color: 0x2a2928, map: grime, roughness: 0.75 }), 0.9)),
    tank: M('tank', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBFuelTank', color: 0x2e2d2b, map: grime, roughness: 0.55, metalness: 0.2 }))),
    line: M('line', () => addBounce(new THREE.MeshStandardMaterial({ name: 'CarBBrakeLine', color: 0x5a5a56, map: grime, roughness: 0.45, metalness: 0.8 }), 0.6)),
  };
  const P = { pan: [], frame: [], rust: [], shield: [], plastic: [], tank: [], line: [] };
  const S = SUV;
  const ax = S.wheelX;

  // ------------------------------------------------------------------ floor pan + sills + rails + tunnel
  P.pan.push(ribbedPanel(-1.05, 0.95, -0.9, -0.16, S.floorY, { ribs: 9, depth: 0.026 }));
  P.pan.push(ribbedPanel(-1.05, 0.95, 0.16, 0.93, S.floorY, { ribs: 9, depth: 0.026 }));
  // rear floor (over the tank / axle), raised
  P.pan.push(ribbedPanel(-2.35, -1.05, -0.9, 0.9, S.floorY + 0.09, { ribs: 7, depth: 0.012 }));
  // toe board rising to the firewall + engine bay underside
  { const g = new THREE.PlaneGeometry(0.5, 1.6, 4, 4); g.rotateX(Math.PI / 2); xform(g, 1.15, S.floorY + 0.06, 0, 0, 0, 0.35); P.pan.push(g); }
  P.pan.push(xform(new THREE.PlaneGeometry(1.25, 1.5).rotateX(Math.PI / 2), 1.95, S.floorY + 0.12, 0));
  // transmission tunnel: an arch along x
  {
    // half cylinder over the top (y >= 0 after the rotation), seen from below -> flip it inside out
    const g = new THREE.CylinderGeometry(0.16, 0.16, 2.1, 18, 1, true, 0, Math.PI);
    g.rotateZ(Math.PI / 2); g.scale(1, 0.75, 1); g.translate(-0.05, S.floorY - 0.005, 0);
    if (g.index) g.index.array.reverse();
    g.computeVertexNormals();
    P.pan.push(g);
  }
  // sills (rocker panels) with the pinch-weld flange hanging under them
  for (const s of [-1, 1]) {
    P.frame.push(rbox(2.1, 0.08, 0.1, 0.02, -0.05, S.sillY + 0.045, s * (S.sillZ - 0.06)));
    P.rust.push(box(2.1, 0.018, 0.006, -0.05, S.sillY - 0.004, s * (S.sillZ - 0.035)));     // pinch weld (rusty)
    // frame rails under the floor
    P.frame.push(rbox(3.4, 0.07, 0.085, 0.012, 0.05, S.floorY - 0.04, s * 0.56));
    // seat cross-members
  }
  for (const x of [-1.0, -0.15, 0.65]) P.frame.push(rbox(0.07, 0.045, 1.7, 0.01, x, S.floorY - 0.025, 0));
  // the street-sill zone is what the U3 close-up sees overhead: body-mount brackets, a spot-welded reinforcement
  // strip, a wiring loom + brake lines with clips, drain plugs, a side-step bracket, undercoating lumps
  for (const s of [-1, 1]) {
    for (const x of [-0.95, -0.05, 0.85]) {
      P.rust.push(rbox(0.09, 0.05, 0.13, 0.012, x, S.floorY - 0.05, s * 0.8));
      P.line.push(cyl(0.011, 0.011, 0.03, x, S.floorY - 0.085, s * 0.8, 0, 0, 0, 10));          // mount bolt head
      P.frame.push(box(0.05, 0.012, 0.1, x + 0.14, S.floorY - 0.06, s * 0.88, 0, 0, 0.0));        // side-step bracket
    }
    P.rust.push(box(1.9, 0.012, 0.05, -0.05, S.floorY - 0.012, s * 0.86));                          // reinforcement strip
    for (let i = 0; i < 26; i++) P.line.push(cyl(0.006, 0.006, 0.004, -0.95 + i * 0.075, S.floorY - 0.02, s * 0.86, 0, 0, 0, 6)); // spot welds
  }
  {
    const R2 = rng(13);
    for (const dz of [0, 0.018, 0.036]) {
      const pts = []; for (let i = 0; i <= 14; i++) { const x = 1.2 - i * 0.18; pts.push(new THREE.Vector3(x, S.floorY - 0.022 - 0.006 * Math.sin(i * 1.3 + dz * 40), 0.74 + dz + 0.006 * Math.sin(i * 2.1))); }
      P.line.push(tube(pts, dz === 0.036 ? 0.009 : 0.005, 90, 6));                                     // brake lines + loom
    }
    for (const x of [1.0, 0.55, 0.1, -0.35, -0.8]) P.plastic.push(box(0.018, 0.016, 0.075, x, S.floorY - 0.022, 0.76));
    for (let i = 0; i < 40; i++) { // undercoating lumps along the street sill
      const x = -1.0 + R2() * 2.0, z = 0.6 + R2() * 0.3, r = 0.008 + R2() * 0.02;
      const g = new THREE.SphereGeometry(r, 7, 5); g.scale(1.6, 0.35, 1.2); g.translate(x, S.floorY - 0.006, z); P.pan.push(g);
    }
  }
  // jacking points / drain plugs (round dimples)
  for (const [x, z] of [[-0.55, 0.42], [0.35, -0.38], [-0.6, -0.4], [0.4, 0.45]]) P.plastic.push(cyl(0.02, 0.02, 0.008, x, S.floorY - 0.016, z, 0, 0, 0, 12));

  // ------------------------------------------------------------------ exhaust: down pipe -> resonator -> rear muffler
  {
    // (pass 2: the exhaust runs on the curb side of the tunnel and the resonator sits forward, so the lying camera at
    // car (-0.12, 0.28) looks up into an open street-side bay: pan ribs, rail, cross-member, brackets, sill)
    const z = -0.2;
    const pts = [[1.75, 0.36, -0.05], [1.45, 0.29, -0.12], [1.15, 0.275, z], [0.4, 0.27, z], [-0.2, 0.272, z], [-0.7, 0.28, z - 0.05], [-1.15, 0.3, -0.42], [-1.6, 0.34, -0.44], [-1.95, 0.33, -0.3]];
    P.rust.push(tube(pts.map((p) => new THREE.Vector3(...p)), 0.028, 64, 10));
    // flex joint + flanges
    P.line.push(cyl(0.034, 0.034, 0.12, 1.32, 0.28, -0.14, 0, 0, Math.PI / 2 - 0.05, 14));
    for (const x of [1.25, 1.39, 0.28, -0.32]) P.rust.push(cyl(0.045, 0.045, 0.01, x, 0.274, z, 0, 0, Math.PI / 2, 14));
    // resonator (centre muffler), forward of the camera
    { const g = new THREE.CylinderGeometry(0.075, 0.075, 0.5, 20); g.rotateZ(Math.PI / 2); g.scale(1, 0.8, 1); g.translate(0.78, 0.28, z + 0.01); P.rust.push(g); }
    // rear muffler (transverse box) behind the axle + tailpipe
    P.rust.push(rbox(0.3, 0.17, 0.62, 0.05, -2.08, 0.38, -0.05));
    P.rust.push(cyl(0.03, 0.03, 0.4, -2.25, 0.36, -0.42, 0, 0, Math.PI / 2 + 0.05, 12));
    // heat shields (corrugated) over the pipe
    for (const [x0, x1] of [[-0.35, 0.45], [0.5, 1.1], [-1.0, -0.5]]) {
      const g = ribbedPanel(x0, x1, -0.12, 0.12, 0.0, { ribs: Math.round((x1 - x0) * 30), depth: 0.004, segZ: 4 });
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const zz = p.getZ(i); p.setY(i, p.getY(i) + S.floorY - 0.018 - 0.025 * (1 - zz * zz / 0.0144)); }
      g.computeVertexNormals();
      xform(g, 0, 0, x0 < -0.6 ? z - 0.05 : z);
      P.shield.push(g);
    }
    // hangers (rubber)
    for (const [x, zz] of [[0.55, z], [-0.55, z - 0.04], [-1.7, -0.42]]) P.plastic.push(box(0.02, 0.05, 0.03, x, 0.31, zz));
  }

  // ------------------------------------------------------------------ fuel tank + straps + filler neck (curb side)
  {
    P.tank.push(rbox(0.62, 0.17, 0.62, 0.06, -0.72, S.floorY - 0.015 - 0.085 + 0.09, -0.6));
    for (const x of [-0.92, -0.52]) {
      const strap = box(0.04, 0.006, 0.66, x, S.floorY - 0.105 + 0.09 - 0.001, -0.6);
      P.rust.push(strap);
    }
    P.line.push(tube([new THREE.Vector3(-0.95, 0.33, -0.6), new THREE.Vector3(-1.2, 0.38, -0.72), new THREE.Vector3(-1.45, 0.5, -0.86)], 0.025, 16, 8));
  }

  // ------------------------------------------------------------------ rear axle (solid) + diff + trailing arms + springs
  {
    P.frame.push(cyl(0.042, 0.042, 1.42, -ax, S.tyreR, 0, Math.PI / 2, 0, 0, 14));
    { const g = new THREE.SphereGeometry(0.135, 20, 14); g.scale(1.0, 0.9, 0.95); g.translate(-ax + 0.03, 0.335, 0.06); P.frame.push(g); }
    P.frame.push(cyl(0.05, 0.05, 0.2, -ax + 0.18, 0.34, 0.06, 0, 0, Math.PI / 2, 12));           // pinion snout
    for (const s of [-1, 1]) {
      P.frame.push(tube([new THREE.Vector3(-ax, 0.36, s * 0.62), new THREE.Vector3(-1.1, 0.3, s * 0.6), new THREE.Vector3(-0.72, 0.31, s * 0.58)], 0.03, 12, 8)); // trailing arm
      // coil spring
      const pts = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2 * 5.5; pts.push(new THREE.Vector3(-ax + 0.12 + Math.cos(a) * 0.065, 0.39 + i / 64 * 0.3, s * 0.52 + Math.sin(a) * 0.065)); }
      P.rust.push(tube(pts, 0.009, 160, 5));
      P.plastic.push(cyl(0.022, 0.026, 0.32, -ax - 0.12, 0.52, s * 0.58, 0, 0, 0.12, 10));            // shock
    }
    P.frame.push(tube([new THREE.Vector3(-ax - 0.05, 0.42, -0.66), new THREE.Vector3(-ax - 0.08, 0.44, 0.66)], 0.02, 6, 8)); // panhard bar
  }

  // ------------------------------------------------------------------ front: subframe, control arms, oil pan, skid plate
  {
    for (const s of [-1, 1]) P.frame.push(rbox(0.9, 0.06, 0.07, 0.012, ax - 0.05, 0.27, s * 0.42));
    P.frame.push(rbox(0.08, 0.06, 0.9, 0.012, ax - 0.42, 0.27, 0));
    P.frame.push(rbox(0.08, 0.06, 0.9, 0.012, ax + 0.36, 0.28, 0));
    for (const s of [-1, 1]) {
      // lower control arm (A shape) to the hub
      P.frame.push(tube([new THREE.Vector3(ax - 0.32, 0.27, s * 0.42), new THREE.Vector3(ax, 0.26, s * 0.7)], 0.022, 6, 8));
      P.frame.push(tube([new THREE.Vector3(ax + 0.12, 0.27, s * 0.42), new THREE.Vector3(ax, 0.26, s * 0.7)], 0.022, 6, 8));
      P.frame.push(cyl(0.02, 0.02, 0.62, ax - 0.06, 0.25, s * 0.38, Math.PI / 2, 0, 0.0, 10));      // tie rod / sway bar
      P.plastic.push(cyl(0.035, 0.035, 0.16, ax + 0.02, 0.3, s * 0.62, Math.PI / 2, 0, 0, 10));     // CV boot
      P.frame.push(cyl(0.02, 0.02, 0.36, ax + 0.02, 0.3, s * 0.42, Math.PI / 2, 0, 0, 10));         // drive shaft
    }
    P.frame.push(rbox(0.42, 0.11, 0.36, 0.03, ax + 0.05, 0.31, -0.05));                          // oil pan
    P.line.push(cyl(0.012, 0.012, 0.012, ax - 0.1, 0.25, -0.12, 0, 0, 0, 8));                    // drain plug
    P.plastic.push(ribbedPanel(ax - 0.2, ax + 0.75, -0.55, 0.55, 0.255, { ribs: 4, depth: 0.008, segZ: 4 })); // splash shield
    // transmission behind the engine
    { const g = new THREE.CylinderGeometry(0.15, 0.11, 0.6, 16); g.rotateZ(Math.PI / 2); g.scale(1, 0.8, 1); g.translate(ax - 0.75, 0.37, 0.03); P.frame.push(g); }
    // drive shaft to the rear diff
    P.frame.push(tube([new THREE.Vector3(ax - 1.05, 0.36, 0.04), new THREE.Vector3(-ax + 0.28, 0.34, 0.06)], 0.034, 8, 10));
  }

  // ------------------------------------------------------------------ inner wheel-arch liners (plastic half shells)
  for (const [x, s] of [[ax, -1], [ax, 1], [-ax, -1], [-ax, 1]]) {
    // the arch over the top of the tyre (centred on theta = PI, which maps to +Y after the X rotation)
    const g = new THREE.CylinderGeometry(0.47, 0.47, 0.34, 28, 1, true, Math.PI * 0.38, Math.PI * 1.24);
    g.rotateX(Math.PI / 2);
    // flip normals inward (we see the inside of the arch)
    if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i += 3) { const tmp = a[i]; a[i] = a[i + 2]; a[i + 2] = tmp; } }
    g.computeVertexNormals();
    g.translate(x, S.tyreR + 0.02, s * 0.8);
    P.plastic.push(g);
    // the inboard wall of the wheel well (closes the arch toward the cabin)
    P.plastic.push(xform(new THREE.CircleGeometry(0.47, 24, 0, Math.PI), x, S.tyreR + 0.02, s * 0.63, 0, s > 0 ? Math.PI : 0, 0));
  }

  // ------------------------------------------------------------------ brake + fuel lines along the curb-side rail
  for (const dz of [0, 0.022, 0.044]) {
    const pts = []; for (let i = 0; i <= 12; i++) { const x = 1.3 - i * 0.22; pts.push(new THREE.Vector3(x, S.floorY - 0.012 - 0.004 * Math.sin(i * 1.7), -0.36 - dz + 0.004 * Math.sin(i * 2.3))); }
    P.line.push(tube(pts, 0.0045, 80, 5));
  }
  for (const x of [1.1, 0.5, -0.1, -0.7]) P.plastic.push(box(0.016, 0.012, 0.075, x, S.floorY - 0.016, -0.4)); // clips

  // ------------------------------------------------------------------ merge
  for (const [k, list] of Object.entries(P)) {
    if (!list.length) continue;
    const geos = list.map((g) => { const gg = g.index ? g.toNonIndexed() : g; for (const n of Object.keys(gg.attributes)) if (!['position', 'normal', 'uv'].includes(n)) gg.deleteAttribute(n); if (!gg.attributes.uv) gg.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(gg.attributes.position.count * 2), 2)); return gg; });
    // planar uv (metres along x, z) so the grime streaks run along the car
    const geo = merge(geos);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.45, p.getZ(i) * 0.45 + p.getY(i) * 0.6);
    const mesh = new THREE.Mesh(geo, mats[k]);
    mesh.name = 'carB_under_' + k;
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
  }
  frame.add(group);

  // tyres pressed on the asphalt: flatten the contact patch + bulge the sidewall a little (wheel-local mesh space)
  if (wheels) wheels.traverse((o) => {
    if (!o.isMesh || !/Tire/.test(o.userData.gameMat || '')) return;
    const g = o.geometry.clone();
    const p = g.attributes.position;
    const flat = -(S.tyreR - 0.014);
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      if (y < flat + 0.04) {
        const k = Math.min(1, (flat + 0.04 - y) / 0.04);
        p.setY(i, Math.max(y, flat));
        const z = p.getZ(i); p.setZ(i, z * (1 + 0.06 * k));
      }
    }
    g.computeVertexNormals();
    o.geometry = g;
  });

  // lowest underbody surface above car-frame (x, z) (rest pose), null outside the footprint
  function heightAt(x, z) {
    if (Math.abs(z) > S.sillZ + 0.03 || x < -2.5 || x > 2.5) return null;
    let h = Math.abs(z) > S.sillZ - 0.08 ? S.sillY : S.floorY - 0.04;
    if (Math.abs(Math.abs(z) - 0.56) < 0.05) h = Math.min(h, S.floorY - 0.075);              // rails
    if (x > 0.53 && x < 1.03 && Math.abs(z + 0.19) < 0.08) h = Math.min(h, 0.28 - 0.06);       // resonator
    else if (x > -1.0 && x < 1.6 && Math.abs(z + 0.2) < 0.04) h = Math.min(h, 0.27 - 0.028);   // pipe
    if (x > -1.03 && x < -0.41 && z > -0.91 && z < -0.29) h = Math.min(h, S.floorY - 0.1);     // tank
    if (Math.abs(x + ax) < 0.15 && Math.abs(z - 0.06) < 0.15) h = Math.min(h, 0.335 - 0.12);    // diff
    if (x > ax - 0.5 && x < ax + 0.5 && Math.abs(z) < 0.55) h = Math.min(h, 0.25);             // front subframe / pan
    return h;
  }

  return { group, heightAt, animated: null, dims: SUV, bounce, update() {} };
}

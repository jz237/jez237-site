// 3607 Witte St: the scare-one window (separate impact glass panes + blood smears), and the front room behind it
// with the TV (EMERGENCY ALERT -> static) that lights the room and spills cold flicker out of the window.
// Built in the 3607 door's kit frame: local +Z = street, local +X = toward E Venango (world +Z), y = 0 at the
// door threshold (world y 0.354). Front wall interior face z = -0.25.
import * as THREE from 'three';
import { HERO, placeOnKit, kitRotY } from './site.js';
import { CUES } from '../film/cues.js';
import { tvState, windowImpactTimes } from './timings.js';
import { box, rbox, cyl, merge, wallWithHoles, xform, mergeStatic } from './geo.js';
import { plasterTexture, woodFloorTexture, canvasTexture, panelingTexture } from './textures.js';
import { furnitureMaterials, sofa, armchair, coffeeTable, flatTV, tvStand, photoFrame, doubleHungWindow } from './furniture.js';
import { makeGlass } from './glass.js';
import { rng, hash1, noise1, smoothstep, clamp, kelvinRGB } from './util.js';
import { interiorize } from './interior.js';

export const ROOM3607 = { XL: -0.63, XR: 3.9, FW: -0.25, BW: -4.6, H: 2.62, floor: -0.012 };

// ---------------------------------------------------------------------------------------------------------------
// EAS card + crawl (the game's own emergency-broadcast lines, data/audio cues vo_eas_shelter / vo_eas_curfew)
export const EAS_LINES = {
  shelter: 'This is the Emergency Alert System. Residents of Port Richmond, shelter in place. Do not approach infected individuals.',
  curfew: 'A mandatory curfew is now in effect for all river ward neighborhoods. Remain indoors and keep doors and windows locked.',
  repeat: 'This message will repeat. Stay tuned to this frequency for further instructions. This is not a test.',
};
function easCardTexture() {
  return canvasTexture('easCard', 1024, 576, (g, w, h) => {
    g.fillStyle = '#0a0c1a'; g.fillRect(0, 0, w, h);
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#101633'); bg.addColorStop(1, '#05060d');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c4161c'; g.fillRect(0, 34, w, 116);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 76px "DejaVu Sans", Arial, Helvetica, sans-serif';
    g.fillText('EMERGENCY ALERT', w / 2, 94);
    g.font = 'bold 54px "DejaVu Sans", Arial, Helvetica, sans-serif';
    g.fillStyle = '#f2f2f2'; g.fillText('CIVIL EMERGENCY MESSAGE', w / 2, 216);
    g.font = 'bold 66px "DejaVu Sans", Arial, Helvetica, sans-serif';
    g.fillStyle = '#ffd23a'; g.fillText('SHELTER IN PLACE', w / 2, 300);
    g.font = '36px "DejaVu Sans", Arial, Helvetica, sans-serif';
    g.fillStyle = '#d8dce8'; g.fillText('PORT RICHMOND  •  RIVER WARD NEIGHBORHOODS', w / 2, 372);
    g.fillText('DO NOT APPROACH INFECTED INDIVIDUALS', w / 2, 418);
    g.fillStyle = '#7a0c10'; g.fillRect(0, h - 92, w, 92);
  }, { wrap: false });
}
function easCrawlTexture() {
  return canvasTexture('easCrawl', 4096, 96, (g, w, h) => {
    g.fillStyle = '#7a0c10'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff'; g.textBaseline = 'middle';
    g.font = 'bold 54px "DejaVu Sans", Arial, Helvetica, sans-serif';
    const txt = (EAS_LINES.shelter + '   ▪   ' + EAS_LINES.curfew + '   ▪   ' + EAS_LINES.repeat + '   ▪   ').toUpperCase();
    let x = 10;
    while (x < w) { g.fillText(txt, x, h / 2 + 2); x += g.measureText(txt).width; }
  }, { wrap: true });
}

function tvScreenMaterial() {
  const uniforms = {
    uTime: { value: 0 }, uMode: { value: 0 }, uLevel: { value: 0 }, uCard: { value: easCardTexture() }, uCrawl: { value: easCrawlTexture() }, uCrawlOff: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    name: 'TVScreen3607',
    uniforms,
    vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uMode, uLevel, uCrawlOff; uniform sampler2D uCard, uCrawl; varying vec2 vUv;
      float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 uv = vUv;
        float frame = floor(uTime * 30.0);
        vec3 col = vec3(0.0);
        if (uMode > 0.5 && uMode < 1.5) {
          // vertical-hold wobble + occasional tear
          float tear = step(0.985, h21(vec2(frame, 3.0))) * (h21(vec2(floor(uv.y * 40.0), frame)) - 0.5) * 0.06;
          vec2 cu = vec2(uv.x + tear + 0.003 * sin(uv.y * 80.0 + uTime * 30.0), uv.y);
          col = texture2D(uCard, cu).rgb;
          if (uv.y < 0.16) col = mix(col, texture2D(uCrawl, vec2(uv.x * 0.25 + uCrawlOff, (uv.y - 0.0) / 0.16)).rgb, step(0.0, uv.y) * step(uv.y, 0.155));
          col *= 0.92 + 0.08 * sin(uv.y * 900.0);                       // scanlines
          col += 0.05 * (h21(uv * 512.0 + frame) - 0.5);                 // grain
        } else if (uMode > 1.5) {
          float n = h21(floor(uv * vec2(320.0, 180.0)) + frame * 1.37);
          float band = smoothstep(0.0, 0.15, abs(fract(uv.y * 1.3 - uTime * 0.7) - 0.5));
          float roll = 0.75 + 0.25 * band;
          float bright = step(0.93, h21(vec2(frame, 7.0))) * 0.35;
          col = vec3(n) * roll + bright;
          col += texture2D(uCard, uv + vec2(0.01 * sin(uTime * 5.0), 0.0)).rgb * 0.08;   // ghost of the card
          col *= vec3(0.86, 0.92, 1.0);
        }
        col *= uLevel;
        gl_FragColor = vec4(col * 1.6, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    toneMapped: true,
  });
  return { mat, uniforms };
}

// blood smear decal: RGB texture, R = deposit time 0..1 (0 = at contact), G = thickness, B = coverage.
// Built from two canvases: T (time, combined with "darken" so overlaps keep the earliest deposit) and C (thickness,
// combined with "lighten"), slightly blurred for organic edges. kind: 'hand' (slap + drag down) or 'arm'.
function handSmearTexture(seed, kind) {
  const W = 384, H = 576;
  return canvasTexture('smear' + seed + kind, W, H, (g, w, h) => {
    const R = rng(seed);
    const T = document.createElement('canvas'); T.width = w; T.height = h;
    const C = document.createElement('canvas'); C.width = w; C.height = h;
    const t = T.getContext('2d'), c = C.getContext('2d');
    t.fillStyle = '#ffffff'; t.fillRect(0, 0, w, h); t.globalCompositeOperation = 'darken';
    c.fillStyle = '#000000'; c.fillRect(0, 0, w, h); c.globalCompositeOperation = 'lighten';
    const blob = (x, y, rx, ry, rot, time, thick) => {
      const tv = Math.round(Math.min(1, Math.max(0, time)) * 255), cv = Math.round(Math.min(1, Math.max(0, thick)) * 255);
      t.fillStyle = `rgb(${tv},${tv},${tv})`; t.beginPath(); t.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); t.fill();
      c.fillStyle = `rgb(${cv},${cv},${cv})`; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); c.fill();
    };
    // irregular stamp made of many small blobs (a smudge, never a clean silhouette)
    const smudge = (x, y, rx, ry, rot, time, thick, n = 26, hollow = 0) => {
      for (let i = 0; i < n; i++) {
        const a = R() * Math.PI * 2, rr = Math.sqrt(R());
        const px = x + Math.cos(a) * rr * rx * Math.cos(rot) - Math.sin(a) * rr * ry * Math.sin(rot);
        const py = y + Math.cos(a) * rr * rx * Math.sin(rot) + Math.sin(a) * rr * ry * Math.cos(rot);
        const k = hollow > 0 ? 0.35 + 0.65 * Math.min(1, rr / (1 - hollow * 0.5)) : 1;
        blob(px, py, rx * (0.18 + R() * 0.3), ry * (0.14 + R() * 0.26), R() * 3, time + R() * 0.02, thick * k * (0.6 + R() * 0.5));
      }
    };
    if (kind === 'hand') {
      const px = w * 0.52, py = h * 0.24;
      // the slap: palm heel + palm (hollow centre), finger pads in segments, thumb
      smudge(px, py + h * 0.04, w * 0.13, h * 0.06, 0.08, 0.0, 0.95, 40, 0.6);
      smudge(px - w * 0.01, py - h * 0.01, w * 0.12, h * 0.05, 0.0, 0.0, 0.8, 30, 0.8);
      const fingers = [[-0.115, -0.07, -0.2, 0.07], [-0.04, -0.085, -0.06, 0.085], [0.045, -0.083, 0.07, 0.082], [0.125, -0.06, 0.24, 0.062]];
      for (const [dx, dy, rot, len] of fingers) {
        for (let sgm = 0; sgm < 3; sgm++) {
          const f = (sgm + 0.5) / 3;
          const fx = px + (dx + Math.sin(rot) * len * f) * w, fy = py + (dy - Math.cos(rot) * len * f) * h;
          smudge(fx, fy, w * 0.022, h * 0.022 * (sgm === 2 ? 1.25 : 1), rot, 0.0, sgm === 2 ? 0.85 : 0.6, 8);
        }
      }
      smudge(px - w * 0.2, py + h * 0.01, w * 0.026, h * 0.05, 0.9, 0.0, 0.7, 12);
      // the drag down: streaks from the finger pads and the palm edges; darker rims where the wipe pushes blood
      const streaks = [[-0.115, 0.36, 4.5], [-0.04, 0.52, 5.5], [0.045, 0.56, 6], [0.125, 0.34, 4.2], [-0.15, 0.24, 9], [0.14, 0.27, 9], [0.0, 0.44, 13]];
      for (const [dx, len, wd] of streaks) {
        const x0 = px + dx * w, y0 = py + (Math.abs(dx) > 0.13 ? 0.04 : -0.02) * h;
        const steps = 90;
        let wob = 0;
        for (let i = 0; i < steps; i++) {
          const f = i / steps;
          wob += (R() - 0.5) * 0.8;
          const y = y0 + f * len * h, x = x0 + wob + f * dx * 30;
          const ww = wd * (1 - f * 0.65) * (0.75 + 0.5 * R());
          const time = 0.06 + f * 0.86;
          blob(x, y, ww, 3.5, 0, time, 0.35 + 0.25 * (1 - f));
          blob(x - ww * 0.85, y, 1.4, 3.5, 0, time, 0.85 - f * 0.4);      // rims
          blob(x + ww * 0.85, y, 1.4, 3.5, 0, time, 0.85 - f * 0.4);
          if (R() < 0.04) blob(x + (R() - 0.5) * ww, y, ww * 0.4, 6, 0, time, 0.2);  // skips in the wipe
        }
      }
      // drips (slow, after the drag) ending in beads
      for (let k = 0; k < 6; k++) {
        const x = px + (R() - 0.5) * w * 0.34, y0 = py + h * (0.32 + R() * 0.24), len = h * (0.06 + R() * 0.2);
        for (let i = 0; i < 40; i++) { const f = i / 40; blob(x + Math.sin(f * 7 + k) * 1.2, y0 + f * len, 1.5, 3, 0, 0.82 + f * 0.17, 0.75); }
        blob(x, y0 + len + 2, 3, 4, 0, 0.99, 0.95);
      }
    } else {
      // forearm / head knock: broad smudge sweeping down-left with hair-like scratches
      for (let i = 0; i < 70; i++) {
        const f = i / 70;
        smudge(w * (0.62 - f * 0.28), h * (0.2 + f * 0.4), w * (0.13 - f * 0.05), h * 0.035, -0.55, f * 0.9, 0.55 + 0.3 * R(), 5);
      }
      for (let k = 0; k < 14; k++) { // fine scratches
        const x0 = w * (0.4 + R() * 0.3), y0 = h * (0.18 + R() * 0.2);
        for (let i = 0; i < 30; i++) { const f = i / 30; blob(x0 - f * 40, y0 + f * 120, 0.9, 2, 0, 0.1 + f * 0.6, 0.5); }
      }
      for (let k = 0; k < 6; k++) { const x = w * (0.35 + R() * 0.3), y0 = h * (0.45 + R() * 0.2), len = h * (0.1 + R() * 0.2); for (let i = 0; i < 30; i++) { const f = i / 30; blob(x, y0 + f * len, 1.4, 3, 0, 0.8 + f * 0.19, 0.6); } blob(x, y0 + len + 2, 2.6, 3.4, 0, 0.99, 0.9); }
    }
    // soften the thickness field a touch, then pack R=time, G=thickness, A=coverage
    const C2 = document.createElement('canvas'); C2.width = w; C2.height = h;
    const c2 = C2.getContext('2d'); c2.filter = 'blur(1.2px)'; c2.drawImage(C, 0, 0);
    const ti = t.getImageData(0, 0, w, h).data, ci = c2.getImageData(0, 0, w, h).data;
    const out = g.createImageData(w, h); const o = out.data;
    for (let i = 0; i < o.length; i += 4) {
      const th = ci[i];
      o[i] = ti[i]; o[i + 1] = th; o[i + 2] = th > 6 ? Math.min(255, th * 3) : 0; o[i + 3] = 255; // B = coverage (alpha kept opaque: no premultiply loss)
    }
    g.putImageData(out, 0, 0);
  }, { wrap: false, srgb: false, mips: false });
}

function smearMaterial(tex) {
  const uniforms = { uProg: { value: 0 }, uSmear: { value: tex }, uBack: { value: 0 } };
  const mat = new THREE.MeshStandardMaterial({ name: 'BloodSmear', color: 0x5a0606, roughness: 0.22, metalness: 0, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vSUv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvSUv = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vSUv; uniform float uProg; uniform sampler2D uSmear; uniform float uBack;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec4 sm = texture2D(uSmear, vSUv);
        float dep = smoothstep(sm.r - 0.035, sm.r, uProg) * sm.b;
        float thick = sm.g;
        diffuseColor.rgb = mix(vec3(0.3, 0.02, 0.015), vec3(0.07, 0.003, 0.003), smoothstep(0.15, 0.9, thick));
        diffuseColor.a = dep * clamp(0.22 + thick * 0.85, 0.0, 0.96);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        { vec4 sm2 = texture2D(uSmear, vSUv);   // TV light from inside shines through the thin blood
          totalEmissiveRadiance += vec3(0.55, 0.035, 0.02) * uBack * (1.0 - smoothstep(0.2, 0.85, sm2.g)) * smoothstep(sm2.r - 0.035, sm2.r, uProg) * sm2.b; }`);
  };
  mat.customProgramCacheKey = () => 'bloodsmear';
  return { mat, uniforms };
}

export function buildHouse3607(ctx) {
  const { XL, XR, FW, BW, H } = ROOM3607;
  const it = HERO.door3607;
  const group = new THREE.Group();
  group.name = 'House3607';
  placeOnKit(group, it);
  const fm = furnitureMaterials();
  const add = (geo, mat, { cast = true, recv = true, name, parent = group } = {}) => { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = recv; if (name) m.name = name; parent.add(m); return m; };

  // dark 1970s wood paneling: the TV's cold flicker reads against it, the rest of the room stays dark
  const wallTex = panelingTexture().clone(); wallTex.needsUpdate = true; wallTex.repeat.set(1 / 1.2, 1 / 1.2);
  const wallMat = new THREE.MeshStandardMaterial({ name: 'Wall3607', map: wallTex, roughness: 0.4, color: 0xffffff });
  const ceilMat = new THREE.MeshStandardMaterial({ name: 'Ceiling3607', color: 0xc9c3b4, roughness: 0.95 });
  const flTex = woodFloorTexture().clone(); flTex.needsUpdate = true;
  const floorMat = new THREE.MeshStandardMaterial({ name: 'Floor3607', map: flTex, roughness: 0.5, color: 0xb0a090 });
  const darkVoid = new THREE.MeshStandardMaterial({ name: 'Void3607', color: 0x020202, roughness: 1 });

  const wa = HERO.win3607a, wb = HERO.win3607b;
  const xa = wa.p[2] - it.p[2], xb = wb.p[2] - it.p[2];
  const sillY = wa.p[1] - it.p[1];
  const holes = [[xa - 0.43, sillY, xa + 0.43, sillY + 1.4], [xb - 0.43, sillY, xb + 0.43, sillY + 1.4], [-0.5, 0, 0.5, 2.1]];

  // shell
  const fl = new THREE.PlaneGeometry(XR - XL, FW - BW + 0.25); fl.rotateX(-Math.PI / 2);
  { const uv = fl.attributes.uv, p = fl.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getZ(i), p.getX(i)); }
  fl.translate((XL + XR) / 2, ROOM3607.floor, (FW + 0.25 + BW) / 2 - 0.125);
  add(fl, floorMat, { cast: false });
  const ce = new THREE.PlaneGeometry(XR - XL, FW - BW); ce.rotateX(Math.PI / 2); ce.translate((XL + XR) / 2, H, (FW + BW) / 2);
  add(ce, ceilMat);
  const fw = wallWithHoles(-XR, 0, -XL, H, holes.map(([a, b, c, d]) => [-c, b, -a, d])); fw.rotateY(Math.PI); fw.translate(0, 0, FW);
  add(fw, wallMat);
  const lw = new THREE.PlaneGeometry(FW - BW, H); lw.rotateY(Math.PI / 2); lw.translate(XL, H / 2, (FW + BW) / 2); add(lw, wallMat);
  const rw = new THREE.PlaneGeometry(FW - BW, H); rw.rotateY(-Math.PI / 2); rw.translate(XR, H / 2, (FW + BW) / 2); add(rw, wallMat);
  const bw = wallWithHoles(XL, 0, XR, H, [[0.9, 0, 1.75, 2.05]]); bw.translate(0, 0, BW); add(bw, wallMat);
  add(box(1.0, H, 0.05, 1.32, H / 2, BW - 1.2), darkVoid, { name: 'DiningVoid' });
  const skin = [box(XR - XL + 0.5, H + 0.4, 0.05, (XL + XR) / 2, H / 2, BW - 1.6), box(0.05, H + 0.4, FW - BW + 1.8, XL - 0.06, H / 2, (FW + BW) / 2 - 0.7), box(0.05, H + 0.4, FW - BW + 1.8, XR + 0.06, H / 2, (FW + BW) / 2 - 0.7), box(XR - XL + 0.5, 0.05, FW - BW + 1.8, (XL + XR) / 2, H + 0.25, (FW + BW) / 2 - 0.7)];
  add(merge(skin), darkVoid, { recv: false });
  const rv = [];
  for (const [a, b, c, d] of holes.slice(0, 2)) {
    rv.push(box(c - a, 0.001, 0.07, (a + c) / 2, b, -0.215), box(c - a, 0.001, 0.07, (a + c) / 2, d, -0.215), box(0.001, d - b, 0.07, a, (b + d) / 2, -0.215), box(0.001, d - b, 0.07, c, (b + d) / 2, -0.215));
    rv.push(box(c - a + 0.12, 0.025, 0.12, (a + c) / 2, b - 0.012, FW - 0.03));
  }
  rv.push(box(XR - XL, 0.12, 0.018, (XL + XR) / 2, 0.06, BW + 0.009), box(FW - BW, 0.12, 0.018, XL + 0.009, 0.06, (FW + BW) / 2, 0, Math.PI / 2, 0), box(FW - BW, 0.12, 0.018, XR - 0.009, 0.06, (FW + BW) / 2, 0, Math.PI / 2, 0));
  add(merge(rv), fm.paintWhite);

  // furniture (the zone in front of window a stays clear for the infected: x in [0.4, 2.1], z in [-0.25, -1.6])
  const sofaG = sofa(1.95); sofaG.position.set(XL + 0.46, 0, -2.6); sofaG.rotation.y = Math.PI / 2; group.add(sofaG);
  const ct = coffeeTable(1.0, 0.5, 0.42); ct.position.set(1.1, 0, -2.6); ct.rotation.y = Math.PI / 2 + 0.25; group.add(ct);
  const stand = tvStand(1.1, 0.4, 0.5);
  const tvYaw = -Math.PI / 2 - 0.5; // faces -X, turned toward the windows
  stand.position.set(XR - 0.32, 0, -1.55); stand.rotation.y = tvYaw; group.add(stand);
  const { mat: screenMat, uniforms: tvU } = tvScreenMaterial();
  const tv = flatTV(screenMat);
  tv.group.position.set(XR - 0.34, 0.5 + tv.group.userData.standOffset, -1.55); tv.group.rotation.y = tvYaw; group.add(tv.group);
  const chair = armchair(); chair.position.set(2.8, 0, -3.5); chair.rotation.set(0, 0.6, 0); group.add(chair);
  // signs of a struggle: tipped side chair, fallen frame
  // The chair fell over backwards (backrest and rear feet on the floor, legs pointing at the front wall) and lies
  // turned away from the window: footprint x 2.13..3.02, z -1.47..-0.43 (front wall inner face at FW = -0.25), clear
  // of the infected's zone in front of window a and of the TV stand. (It used to tip forward through the facade.)
  const sideChair = new THREE.Group(); sideChair.name = 'TippedChair3607';
  const scm = new THREE.Mesh(merge([box(0.42, 0.04, 0.42, 0, 0.45, 0), box(0.42, 0.5, 0.04, 0, 0.72, -0.2), ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => box(0.035, 0.45, 0.035, a * 0.18, 0.225, b * 0.18))]), fm.woodLight);
  scm.name = 'TippedChair3607Mesh'; scm.castShadow = true; sideChair.add(scm);
  sideChair.rotation.order = 'YXZ';   // tip about the chair's own X, then turn about the vertical
  sideChair.position.set(2.3, ROOM3607.floor + 0.198, -0.55); sideChair.rotation.set(-Math.PI / 2 + 0.02, -0.6, 0); group.add(sideChair);
  const fallen = photoFrame(0.3, 0.4, 11); fallen.position.set(0.25, 0.012, -2.0); fallen.rotation.set(-Math.PI / 2, 0, 0.6); group.add(fallen);
  for (const [w, h, s, x, y, z] of [[0.4, 0.3, 12, XL + 0.012, 1.6, -2.2], [0.3, 0.38, 13, XL + 0.012, 1.62, -3.0]]) { const f = photoFrame(w, h, s); f.position.set(x, y, z); f.rotation.y = Math.PI / 2; group.add(f); }
  // drapes, pulled aside (one side of window a torn half down)
  const drape = new THREE.MeshStandardMaterial({ name: 'Drapes3607', color: 0x5a1e1a, roughness: 0.9, side: THREE.DoubleSide });
  const drapeGeo = (w, h, seed) => { const g = new THREE.PlaneGeometry(w, h, 24, 6); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, 0.035 * Math.sin(p.getX(i) * 40 + seed)); g.translate(0, -h / 2, 0); g.computeVertexNormals(); return g; };
  for (const [x, s] of [[xa - 0.5, 1], [xb - 0.5, 2], [xb + 0.5, 3]]) { const m = add(drapeGeo(0.28, 1.95, s), drape); m.position.set(x, sillY + 1.62, FW - 0.07); }
  const torn = add(drapeGeo(0.3, 1.5, 4), drape); torn.position.set(xa + 0.52, sillY + 1.3, FW - 0.12); torn.rotation.set(0.15, 0, 0.35);

  // ---- the impact window (a): own sash frame + separate glass panes ----
  const winA = new THREE.Group(); winA.name = 'Window3607';
  placeOnKit(winA, wa);
  if (!ctx.hasWorld) { // the world keeps the game's frame + sashes at opening_3607_window; we add only the glass
    const frameOnly = doubleHungWindow(fm.paintWhite);
    frameOnly.group.remove(frameOnly.glassLower); frameOnly.group.remove(frameOnly.glassUpper);
    winA.add(frameOnly.group);
  }
  const glassLowerMat = makeGlass({ name: 'Glass3607Lower', impact: true, grime: 0.55, opacity: 0.13, metres: [0.638, 0.563], envMap: ctx.envMap });
  const glassUpperMat = makeGlass({ name: 'Glass3607Upper', impact: true, grime: 0.5, opacity: 0.13, metres: [0.638, 0.583], envMap: ctx.envMap });
  const paneLower = new THREE.Mesh(new THREE.PlaneGeometry(0.638, 0.563, 24, 24), glassLowerMat);
  paneLower.position.set(0, (0.116 + 0.679) / 2, -0.151); paneLower.name = 'Window3607PaneLower'; paneLower.renderOrder = 4;
  const paneUpper = new THREE.Mesh(new THREE.PlaneGeometry(0.638, 0.583, 24, 24), glassUpperMat);
  paneUpper.position.set(0, (0.706 + 1.289) / 2, -0.121); paneUpper.name = 'Window3607PaneUpper'; paneUpper.renderOrder = 4;
  winA.add(paneLower, paneUpper);
  // blood smears (inside face of the glass, i.e. slightly toward the room)
  const sm1 = smearMaterial(handSmearTexture(31, 'hand'));
  const sm2 = smearMaterial(handSmearTexture(32, 'arm'));
  const smear1 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.45), sm1.mat);
  smear1.position.set(0.04, 0.02, -0.004); smear1.renderOrder = 3; smear1.name = 'Smear3607Hand';
  paneLower.add(smear1);
  const smear2 = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.5), sm2.mat);
  smear2.position.set(-0.06, -0.07, -0.004); smear2.renderOrder = 3; smear2.name = 'Smear3607Arm';
  paneUpper.add(smear2);
  // window b: ordinary glass
  const winB = doubleHungWindow(makeGlass({ name: 'Glass3607B', grime: 0.45, opacity: 0.14, metres: [0.64, 0.57], envMap: ctx.envMap }));
  placeOnKit(winB.group, wb);

  // ---- TV light (dedicated, created once; intensity driven from the screen state) ----
  group.updateMatrixWorld(true);
  const W = (x, y, z) => group.localToWorld(new THREE.Vector3(x, y, z));
  const screenCentre = new THREE.Vector3();
  tv.screen.getWorldPosition(screenCentre);
  const scrN = new THREE.Vector3(0, 0, 1).applyQuaternion(tv.screen.getWorldQuaternion(new THREE.Quaternion()));
  const tvLight = new THREE.SpotLight(0xc8d6ff, 0, 9, 1.15, 0.85, 2);
  tvLight.name = 'TVLight3607';
  tvLight.position.copy(screenCentre).addScaledVector(scrN, 0.06);
  tvLight.target.position.copy(W(xa, sillY + 0.75, FW - 0.1));
  tvLight.castShadow = false;
  const TV_CD = 13;

  // ---- animation state ----
  const impacts = windowImpactTimes.slice();
  let smearTimes = [CUES.scare1 + 0.03, CUES.scare1Knock2 + 0.02];
  let lightScale = 1;
  const tvColEAS = new THREE.Color(1.0, 0.78, 0.8), tvColStatic = new THREE.Color(0.8, 0.88, 1.0), tvCol = new THREE.Color();
  const vibAt = (t) => {
    let v = 0, v2 = 0, sh = 0;
    for (let i = 0; i < impacts.length; i++) {
      const x = t - impacts[i];
      if (x < 0 || x > 1.5) continue;
      const a = i === 0 ? 1 : 0.8;
      v += a * 0.006 * Math.sin(2 * Math.PI * 11 * x) * Math.exp(-x / 0.22);
      v2 += a * 0.0025 * Math.sin(2 * Math.PI * 17 * x + 1) * Math.exp(-x / 0.15);
      sh += a * (-0.004 * Math.exp(-x / 0.03) + 0.0015 * Math.sin(2 * Math.PI * 23 * x) * Math.exp(-x / 0.12));
    }
    return [v, v2, sh];
  };

  function update(t, camera) {
    cull(camera);
    // glass vibration (both sashes, the struck one more)
    const [v, v2, sh] = vibAt(t);
    const uL = glassLowerMat.userData.uniforms, uU = glassUpperMat.userData.uniforms;
    uL.uVib.value = v; uL.uVib2.value = v2; uL.uShift.value = sh;
    uU.uVib.value = v * 0.55; uU.uVib2.value = -v2 * 0.6; uU.uShift.value = sh * 0.7;
    // smears grow ~1 s after contact
    sm1.uniforms.uProg.value = smoothstep(smearTimes[0], smearTimes[0] + 1.05, t) * 1.0 + (t >= smearTimes[0] ? 0.02 : 0);
    sm2.uniforms.uProg.value = smoothstep(smearTimes[1], smearTimes[1] + 1.0, t) + (t >= smearTimes[1] ? 0.02 : 0);
    smear1.visible = t >= smearTimes[0];
    smear2.visible = t >= smearTimes[1];
    // TV
    const st = tvState(t);
    tvU.uTime.value = t;
    tvU.uMode.value = st.mode === 'off' ? 0 : st.mode === 'eas' ? 1 : 2;
    tvU.uLevel.value = st.level;
    tvU.uCrawlOff.value = Math.max(0, t - CUES.easStart) * 0.045;
    let k = 0;
    if (st.mode === 'eas') { k = 0.85 * st.level; tvCol.copy(tvColEAS); }
    else if (st.mode === 'static') { const f = hash1(Math.floor(t * 30) * 7 + 3); k = st.level * (0.62 + 0.38 * f) * (hash1(Math.floor(t * 30) + 91) > 0.93 ? 1.4 : 1); tvCol.copy(tvColStatic); }
    tvLight.intensity = TV_CD * k * lightScale;
    tvLight.color.copy(tvCol);
    sm1.uniforms.uBack.value = sm2.uniforms.uBack.value = 0.2 * k * lightScale;
  }

  interiorize(group, 0.08);
  mergeStatic(group, (m) => m === tv.screen);
  group.traverse((o) => { if (o.isMesh) o.castShadow = false; });   // nothing in this room casts (TV light is unshadowed)
  // portal culling: drawn only when window a (or b if open) is in view
  const winPts = [W(xa - 0.43, sillY, -0.1), W(xa + 0.43, sillY, -0.1), W(xa + 0.43, sillY + 1.4, -0.1), W(xa - 0.43, sillY + 1.4, -0.1)];
  const frustum = new THREE.Frustum(), pm = new THREE.Matrix4(), cp = new THREE.Vector3();
  const roomCentre = W(1.6, 1.2, -2.4);
  group.updateMatrixWorld(true);
  const houseBox = new THREE.Box3().setFromObject(group);   // for the sealed-3609 portal test (ctx.portalSees)
  function cull(camera) {
    if (!camera) { group.visible = true; return; }
    pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(pm);
    camera.getWorldPosition(cp);
    const d = cp.distanceTo(roomCentre);
    group.visible = (d < 4 || (d < 16 && winPts.some((p) => frustum.containsPoint(p)))) && (!ctx.portalSees || ctx.portalSees(houseBox));
  }

  // ---- anchors ----
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, kitRotY(it), 0));
  winA.updateMatrixWorld(true);
  const paneLowerCentre = paneLower.getWorldPosition(new THREE.Vector3());
  const paneUpperCentre = paneUpper.getWorldPosition(new THREE.Vector3());
  const anchors = {
    tvWindow: { position: W(xa, sillY + 0.7, -0.14), quaternion: q.clone(), size: [0.86, 1.4], paneLower: paneLowerCentre, paneUpper: paneUpperCentre,
      note: '3607 scare-one window centre (glass plane). Sill at y=' + (wa.p[1]).toFixed(3) + '; lower sash glass ~' + (wa.p[1] + 0.116).toFixed(2) + '..' + (wa.p[1] + 0.679).toFixed(2) + ', upper ~' + (wa.p[1] + 0.706).toFixed(2) + '..' + (wa.p[1] + 1.289).toFixed(2) + ' (meeting rail between). Local +Z = street.' },
    tvWindowInside: { position: W(xa, ROOM3607.floor, -0.75), quaternion: q.clone(), note: 'floor point ~0.5 m behind the glass (where the infected stands); +Z = toward the glass/street' },
    tvScreen: { position: screenCentre.clone(), quaternion: tv.screen.getWorldQuaternion(new THREE.Quaternion()), note: 'TV screen centre; screen faces quaternion*(0,0,1)' },
    room3607: { position: W(1.6, ROOM3607.floor, -2.4), quaternion: q.clone() },
  };

  return {
    group,
    extras: ctx.hasWorld && !ctx.open.win3607b ? [winA] : [winA, winB.group],
    anchors,
    tvLight,
    update,
    api: {
      tvLight,
      tv: { screen: tv.screen, uniforms: tvU, state: tvState, lines: EAS_LINES },
      window: { group: winA, paneLower, paneUpper, smearHand: smear1, smearArm: smear2, materials: [glassLowerMat, glassUpperMat] },
      windowImpact: {
        times: impacts,
        setTimes(arr) { impacts.length = 0; impacts.push(...arr); },
        setSmearTimes(a) { smearTimes = a.slice(0, 2); },
        // move a smear: pane 'lower'|'upper', centre offset (m) in the pane plane, rotation (rad)
        placeSmear(i, pane, x, y, rot = 0) { const m = i === 0 ? smear1 : smear2; (pane === 'upper' ? paneUpper : paneLower).add(m); m.position.set(x, y, -0.004); m.rotation.z = rot; },
        vibrationAt: vibAt,
      },
      setLightScale(k) { lightScale = k; },
    },
  };
}

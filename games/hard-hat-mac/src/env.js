// Sky dome, lighting presets, image-based lighting and the procedural city around the site.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { boxGeo } from './builder.js';
import { waterMaterial } from './hazards.js';
import { mulberry32, rr } from './util.js';

export const PRESETS = {
  morning: { top: 0x2a68c2, hor: 0xc9def0, haze: 0xb0c2d0, sunEl: 24, sunAz: 128, sunCol: [1, .92, .8], sunI: 3.9, hemiSky: 0xa9c8ea, hemiGnd: 0x5e4c38, hemiI: .5, fog: 0xbcd0e2, fogD: .0028, stars: 0, clouds: .45, lamps: 0, windows: 0, exposure: 1.0 },
  dusk: { top: 0x26346a, hor: 0xff9356, haze: 0xffa874, sunEl: 5, sunAz: 250, sunCol: [1, .58, .32], sunI: 2.6, hemiSky: 0x8a7aa8, hemiGnd: 0x3a2a20, hemiI: .6, fog: 0xc98a72, fogD: .0062, stars: .15, clouds: .55, lamps: 1, windows: .7, exposure: 1.05 },
  night: { top: 0x040915, hor: 0x18213a, haze: 0x1d2538, sunEl: 38, sunAz: 25, sunCol: [.58, .68, 1], sunI: .75, hemiSky: 0x44547a, hemiGnd: 0x2a1e14, hemiI: .7, fog: 0x101726, fogD: .009, stars: 1, clouds: .2, lamps: 1, windows: 1.3, exposure: 1.1, moon: true },
  sunset: { top: 0x34488a, hor: 0xffaa48, haze: 0xffc48a, sunEl: 4.5, sunAz: 262, sunCol: [1, .66, .38], sunI: 3.0, hemiSky: 0x9a8ab8, hemiGnd: 0x4a3426, hemiI: .65, fog: 0xe8a878, fogD: .0018, stars: 0, clouds: .5, lamps: .6, windows: .22, exposure: 1.05 },
  dawn: { top: 0x3b5590, hor: 0xf2b88e, haze: 0xe9b494, sunEl: 7, sunAz: 96, sunCol: [1, .74, .52], sunI: 2.7, hemiSky: 0x9eaccc, hemiGnd: 0x4c3c2e, hemiI: .62, fog: 0xd9bba4, fogD: .0042, stars: .06, clouds: .5, lamps: .8, windows: .45, exposure: 1.05 },
  noon: { top: 0x2766cc, hor: 0xbcd8f0, haze: 0xa9c6da, sunEl: 58, sunAz: 165, sunCol: [1, .96, .9], sunI: 4.2, hemiSky: 0xb3d1f0, hemiGnd: 0x4c5a42, hemiI: .55, fog: 0xb9d1e5, fogD: .0021, stars: 0, clouds: .38, lamps: 0, windows: 0, exposure: 1.0 },
  overcast: { top: 0x69727e, hor: 0xb9bec2, haze: 0xaaafb3, sunEl: 34, sunAz: 205, sunCol: [.92, .92, .94], sunI: 1.7, hemiSky: 0xb3bbc6, hemiGnd: 0x4c4642, hemiI: .95, fog: 0xa9aeb2, fogD: .0058, stars: 0, clouds: .95, lamps: .35, windows: .18, exposure: 1.06 },
  storm: { top: 0x04060b, hor: 0x121826, haze: 0x151b27, sunEl: 42, sunAz: 30, sunCol: [.52, .6, .78], sunI: .6, hemiSky: 0x4a5878, hemiGnd: 0x221c16, hemiI: 1.0, fog: 0x0e131c, fogD: .010, stars: 0, clouds: 1, lamps: 1, windows: 1, exposure: 1.25, moon: true, nodisc: true, rain: 1 },
};
// Finished Mac & Sons jobs join the skyline (north of the site), one slot per shift.
export const LANDMARKS = ['skeleton', 'yard', 'mill', 'pit', 'bridge', 'wreck', 'storm', 'topout'];
const LM_R = 205, lmSlot = i => { const a = (-62 + i * (124 / (LANDMARKS.length - 1))) * Math.PI / 180; return { a, x: Math.sin(a) * LM_R, z: -Math.cos(a) * LM_R }; };

function skyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, haze: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, sunCol: { value: new THREE.Color() },
      stars: { value: 0 }, clouds: { value: 0 }, time: { value: 0 }, moon: { value: 0 }, nodisc: { value: 0 }, flash: { value: 0 } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }`,
    fragmentShader: `uniform vec3 top, hor, haze, sunDir, sunCol; uniform float stars, clouds, time, moon, nodisc, flash; varying vec3 vDir;
      float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.1 + 3.1; a *= .5; } return s; }
      void main(){
        vec3 d = normalize(vDir); float h = d.y;
        vec3 col = mix(hor, top, pow(clamp(h, 0., 1.), .5));
        col = mix(col, haze, smoothstep(.02, -.12, h));
        float sd = max(dot(d, sunDir), 0.);
        if (moon > .5) col += sunCol * (smoothstep(.9994, .9997, sd) * 3. * (1. - nodisc) + pow(sd, 60.) * .25);
        else col += sunCol * (smoothstep(.9990, .9995, sd) * 30. + pow(sd, 14.) * .5 + pow(sd, 3.) * .15);
        if (h > 0.) {
          vec2 p = d.xz / (h + .12) * 1.1 + vec2(time * .006, time * .002);
          float c = smoothstep(.48, .78, fbm(p)) * clouds * smoothstep(0., .22, h);
          vec3 cc = mix(hor * 1.1, vec3(1.), .45) * (.75 + .5 * pow(sd, 4.)) + sunCol * pow(sd, 8.) * .6;
          if (moon > .5) cc = vec3(.08, .1, .16);
          col = mix(col, cc, c);
          if (stars > 0.) { vec3 q = floor(d * 380.); float r = hash(q); col += step(.9982, r) * stars * (.5 + .5 * sin(time * 2. + r * 80.)) * (1. - c) * vec3(1., .95, .9) * 1.5; }
        }
        col += vec3(.5, .58, .78) * flash * (.35 + .65 * clamp(h + .3, 0., 1.));
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

export class Environment {
  constructor(renderer, scene, quality) {
    this.renderer = renderer; this.scene = scene; this.q = quality;
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMaterial()); this.sky.frustumCulled = false; this.sky.renderOrder = -10;
    scene.add(this.sky);
    this.sun = new THREE.DirectionalLight(0xffffff, 3); this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(quality >= 3 ? 4096 : quality >= 2 ? 2048 : 1024, quality >= 3 ? 4096 : quality >= 2 ? 2048 : 1024);
    this.sun.shadow.bias = -.0004; this.sun.shadow.normalBias = .03;
    scene.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x444444, .6); scene.add(this.hemi);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.city = null; this.t = 0; this.lampLights = [];
  }
  apply(name, level) {
    const P = this.P = PRESETS[name], u = this.sky.material.uniforms;
    u.top.value.set(P.top); u.hor.value.set(P.hor); u.haze.value.set(P.haze); u.sunCol.value.setRGB(...P.sunCol); u.stars.value = P.stars; u.clouds.value = P.clouds; u.moon.value = P.moon ? 1 : 0; u.nodisc.value = P.nodisc ? 1 : 0;
    if (P.rain && !this.rain) this.makeRain(this.q >= 2 ? 2600 : 1300);
    if (this.rain) this.rain.visible = !!P.rain;
    this.flashT = 0;
    const el = P.sunEl * Math.PI / 180, az = P.sunAz * Math.PI / 180;
    const dir = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    u.sunDir.value.copy(dir);
    // shadows come from a slightly higher sun than the visible disc so long dusk shadows stay readable
    const sd = dir.clone(); sd.y = Math.max(sd.y, P.moon ? .7 : .42); sd.normalize();
    this.sunDir = sd;
    this.sun.color.setRGB(...P.sunCol); this.sun.intensity = P.sunI;
    this.hemi.color.set(P.hemiSky); this.hemi.groundColor.set(P.hemiGnd); this.hemi.intensity = P.hemiI;
    this.scene.fog = new THREE.FogExp2(P.fog, P.fogD);
    this.renderer.toneMappingExposure = P.exposure;
    // shadow frustum covering the level
    const [x0, z0, x1, z1] = level.shadowBounds || level.bounds;
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, R = Math.hypot(x1 - x0, z1 - z0) / 2 + 6;
    const cam = this.sun.shadow.camera; cam.left = -R; cam.right = R; cam.top = R; cam.bottom = -R; cam.near = 1; cam.far = R * 2 + 120; cam.updateProjectionMatrix();
    this.center = new THREE.Vector3(cx, 8, cz);
    this.sun.position.copy(this.center).addScaledVector(sd, R + 50); this.sun.target.position.copy(this.center);
    // environment map from the sky
    const envScene = new THREE.Scene(); const s2 = this.sky.clone(); s2.material = this.sky.material; envScene.add(s2);
    const gnd = new THREE.Mesh(new THREE.CircleGeometry(800, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(P.hemiGnd).multiplyScalar(.6) })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -20; envScene.add(gnd);
    if (this.envRT) this.envRT.dispose();
    this.envRT = this.pmrem.fromScene(envScene, .02);
    this.scene.environment = this.envRT.texture; this.scene.environmentIntensity = P.moon ? .3 : .55;
    // facade windows & lamps
    if (this.city) this.city.setNight(P.windows);
    for (const lp of level.lamps) {
      if (lp.mesh) lp.mesh.material.emissiveIntensity = P.lamps * 6;
    }
  }
  buildCity(level, M, built = []) {
    if (this.city) { this.scene.remove(this.city.group); this.city.dispose(); }
    this.city = new City(level, M, this.q, built); this.scene.add(this.city.group);
    if (this.P) this.city.setNight(this.P.windows);
  }
  // lightning: the sky and the whole site light up for a moment
  flash(k = 1) { this.flashT = Math.max(this.flashT || 0, .35 * k); this.flashK = k; }
  makeRain(n) {
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    this.rainSeeds = Array.from({ length: n }, () => [rr(-24, 24), rr(-6, 26), rr(-24, 24), rr(20, 28)]);
    this.rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xaec3de, transparent: true, opacity: .3, depthWrite: false }));
    this.rain.frustumCulled = false; this.rain.renderOrder = 7; this.scene.add(this.rain);
  }
  update(dt, camPos, windX = 0) {
    this.t += dt; const u = this.sky.material.uniforms; u.time.value = this.t;
    this.sky.position.copy(camPos);
    if (this.city) this.city.update(dt, this.t);
    if (this.rain && this.rain.visible) {
      const arr = this.rain.geometry.attributes.position.array, S = this.rainSeeds, sl = windX * .045;
      for (let i = 0; i < S.length; i++) {
        const r = S[i]; r[1] -= r[3] * dt; r[0] += windX * dt * .8;
        if (r[1] < -8) { r[1] += 34; r[0] = rr(-24, 24); r[2] = rr(-24, 24); }
        if (r[0] > 24) r[0] -= 48; else if (r[0] < -24) r[0] += 48;
        const x = camPos.x + r[0], y = camPos.y + r[1] - 10, z = camPos.z + r[2], j = i * 6;
        arr[j] = x; arr[j + 1] = y; arr[j + 2] = z; arr[j + 3] = x - sl; arr[j + 4] = y + .6; arr[j + 5] = z;
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
    }
    const f = this.flashT > 0 ? (this.flashT -= dt, Math.max(0, this.flashT / .35)) : 0, flick = f > 0 ? (Math.random() < .25 ? .3 : 1) * f : 0;
    u.flash.value = flick * 1.4;
    if (this.P) { this.hemi.intensity = this.P.hemiI + flick * 5 * (this.flashK || 1); this.sun.intensity = this.P.sunI + flick * 2.5; }
  }
}

function tinted(g, c) {
  const n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c[0]; a[i * 3 + 1] = c[1]; a[i * 3 + 2] = c[2]; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return g;
}

class City {
  constructor(level, M, q, built = []) {
    this.group = new THREE.Group(); this.M = M; this.landmarks = {};
    const rng = mulberry32(level.citySeed || 1337), gy = level.high ? -160 : 0;
    this.gy = gy;
    const [bx0, bz0, bx1, bz1] = level.bounds, padX = Math.max(Math.abs(bx0), Math.abs(bx1)) + 26, padZ = Math.max(Math.abs(bz0), Math.abs(bz1)) + 26;
    const block = 30, street = 12, step = block + street, R = q >= 2 ? 420 : 300;
    const buckets = M.facades.map(() => []), roof = [], tanks = [], lights = [];
    // ground plane, leaving room for a level that brings its own ground (the pit) or a river channel
    const hole = level.river ? [-1300, level.river.z0, 1300, level.river.z1] : level.cityHole;
    const rects = hole ? [[-1200, -1200, 1200, hole[1]], [-1200, hole[3], 1200, 1200], [-1200, hole[1], hole[0], hole[3]], [hole[2], hole[1], 1200, hole[3]]] : [[-1200, -1200, 1200, 1200]];
    for (const [x0, z0, x1, z1] of rects) {
      if (x1 - x0 < 1 || z1 - z0 < 1) continue;
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), M.asphalt); ground.rotation.x = -Math.PI / 2; ground.position.set((x0 + x1) / 2, gy - .05, (z0 + z1) / 2); ground.receiveShadow = true;
      this.group.add(ground);
    }
    M.asphalt.map.repeat.set(1, 1);
    const rv = level.river;
    if (rv) { // the river runs right through the city
      const w = new THREE.Mesh(new THREE.PlaneGeometry(2600, rv.z1 - rv.z0), waterMaterial(0x2f5a62, 2600, rv.z1 - rv.z0, 1)); w.rotation.x = -Math.PI / 2; w.position.set(0, rv.y - .02, (rv.z0 + rv.z1) / 2); this.group.add(w);
      this.river = w;
      for (const zz of [rv.z0, rv.z1]) this.group.add(new THREE.Mesh(boxGeo(2600, -rv.y + 1, 1.2, 6, 0, (rv.y - 1) / 2, zz + (zz === rv.z0 ? -.6 : .6)), M.concrete));
    }
    const slots = LANDMARKS.map((_, i) => lmSlot(i)), nearSlot = (x, z) => slots.some(s => Math.hypot(x - s.x, z - s.z) < 34);
    // keep the blocks between the site and the skyline slots low so the finished jobs stand out
    const lowSector = (x, z) => !level.high && z < 0 && Math.abs(Math.atan2(x, -z)) < 1.3 && Math.hypot(x, z) < LM_R + 30;
    const walkGeo = [];
    for (let gx = -R; gx <= R; gx += step) for (let gz = -R; gz <= R; gz += step) {
      const cx = gx + block / 2, cz = gz + block / 2;
      if (Math.abs(cx) < padX + block / 2 && Math.abs(cz) < padZ + block / 2 && !level.high) continue;
      const d = Math.hypot(cx, cz); if (d > R) continue;
      if (rv && cz + block / 2 + 8 > rv.z0 && cz - block / 2 - 8 < rv.z1) continue;
      if (nearSlot(cx, cz)) continue;
      walkGeo.push(boxGeo(block + 3, .2, block + 3, 4, cx, gy + .1, cz));
      const n = rng() < .4 ? 1 : rng() < .7 ? 2 : 4;
      for (let k = 0; k < n; k++) {
        const w = n === 1 ? block * rr(.7, .95) : n === 2 ? block * .45 : block * .44, dd = n === 4 ? block * .44 : block * rr(.7, .92);
        const ox = n === 1 ? 0 : (k % 2 ? 1 : -1) * block * .25, oz = n === 4 ? (k < 2 ? -1 : 1) * block * .25 : 0;
        const tall = Math.max(0, 1 - d / R);
        let h = 12 + rng() * 40 + (rng() < .25 ? rng() * 140 * tall + 40 : 0);
        if (level.high) h = Math.max(h, d < 120 ? 120 + rng() * 90 : h);
        if (lowSector(cx + ox, cz + oz)) h = Math.min(h, 18 + rng() * 10);
        if (Math.abs(cx + ox) < padX + 10 && Math.abs(cz + oz) < padZ + 10 && level.high) continue;
        const mi = Math.floor(rng() * buckets.length), x = cx + ox, z = cz + oz, tint = [rr(.75, 1.12), rr(.75, 1.08), rr(.75, 1.1)].map(v => v * rr(.85, 1.05));
        const g = tinted(boxGeo(w, h, dd, 12, x, gy + h / 2, z), tint); buckets[mi].push(g);
        if (rng() < .55 && h > 30) { const sw = w * .6, sh = h * rr(.12, .3); buckets[mi].push(tinted(boxGeo(sw, sh, dd * .6, 12, x, gy + h + sh / 2, z), tint)); h += sh; }
        roof.push(boxGeo(w + .4, .6, dd + .4, 3, x, gy + h - (h > 30 ? 0 : 0) + .3, z));
        if (rng() < .3) roof.push(boxGeo(2.5, 1.6, 2.5, 2, x + w * .2, gy + h + .8, z - dd * .2));
        if (rng() < .22 && h < 70) { const t = new THREE.CylinderGeometry(1.6, 1.6, 2.6, 12); t.translate(x - w * .2, gy + h + 3.3, z + dd * .15); tanks.push(t); const c = new THREE.ConeGeometry(1.8, 1.2, 12); c.translate(x - w * .2, gy + h + 5.2, z + dd * .15); tanks.push(c); }
        if (h > 90) lights.push(new THREE.Vector3(x, gy + h + 4, z));
      }
    }
    buckets.forEach((list, i) => { if (!list.length) return; const m = new THREE.Mesh(mergeGeometries(list), M.facades[i]); m.receiveShadow = false; m.castShadow = false; this.group.add(m); });
    if (roof.length) { const m = new THREE.Mesh(mergeGeometries(roof), new THREE.MeshStandardMaterial({ color: 0x55585c, roughness: .9 })); this.group.add(m); }
    if (tanks.length) { const m = new THREE.Mesh(mergeGeometries(tanks.map(g => g.toNonIndexed())), new THREE.MeshStandardMaterial({ color: 0x6e4a2e, roughness: .9 })); this.group.add(m); }
    if (walkGeo.length) { const m = new THREE.Mesh(mergeGeometries(walkGeo), M.concrete); m.receiveShadow = true; this.group.add(m); }
    // antenna beacons
    this.beacons = new THREE.InstancedMesh(new THREE.SphereGeometry(.7, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2a1a }), Math.max(1, lights.length));
    const mt = new THREE.Matrix4(); lights.forEach((p, i) => { mt.makeTranslation(p.x, p.y, p.z); this.beacons.setMatrixAt(i, mt); });
    this.beacons.count = lights.length; this.group.add(this.beacons);
    // traffic
    const lanes = [];
    for (let gx = -R; gx <= R; gx += step) lanes.push({ ax: 'z', c: gx - street / 2 });
    for (let gz = -R; gz <= R; gz += step) lanes.push({ ax: 'x', c: gz - street / 2 });
    const usable = lanes.filter(l => (level.high || Math.abs(l.c) > (l.ax === 'z' ? padX : padZ)) && !(rv && (l.ax === 'z' || (l.c > rv.z0 - 4 && l.c < rv.z1 + 4))));
    const N = q >= 2 ? 140 : 70;
    const carGeo = boxGeo(4.2, 1.4, 1.9, 1, 0, .9, 0);
    this.cars = new THREE.InstancedMesh(carGeo, new THREE.MeshStandardMaterial({ roughness: .3, metalness: .6 }), N);
    this.carLights = new THREE.InstancedMesh(new THREE.BoxGeometry(4.3, .25, 1.6), new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
    this.carData = [];
    const cols = [0xc0392b, 0xecf0f1, 0x2c3e50, 0xf1c40f, 0x7f8c8d, 0x2980b9, 0x111111, 0xd35400];
    for (let i = 0; i < N; i++) {
      const l = usable[Math.floor(rng() * usable.length)], dir = rng() < .5 ? 1 : -1;
      this.carData.push({ l, dir, s: rr(-R, R), v: rr(8, 15), off: dir * 2.4 });
      this.cars.setColorAt(i, new THREE.Color(cols[i % cols.length]));
      this.carLights.setColorAt(i, new THREE.Color(dir > 0 ? 0xfff4d0 : 0xff3020));
    }
    this.R = R; this.group.add(this.cars, this.carLights);
    // the tower Mac stands on (Topping Out)
    if (level.tower) {
      const t = level.tower, h = t.depth;
      const g = boxGeo(t.x1 - t.x0, h, t.z1 - t.z0, 12, (t.x0 + t.x1) / 2, t.top - h / 2, (t.z0 + t.z1) / 2);
      const m = new THREE.Mesh(tinted(g, [1, 1, 1]), M.facades[2]); this.group.add(m);
      for (let y = t.top - 4; y > t.top - h; y -= 4) this.group.add(Object.assign(new THREE.Mesh(boxGeo(t.x1 - t.x0 + .3, .25, t.z1 - t.z0 + .3, 4, (t.x0 + t.x1) / 2, y, (t.z0 + t.z1) / 2), M.concrete)));
    }
    this.mt = new THREE.Matrix4(); this.night = 0; this.gy = gy;
    this.lmGlow = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0xffc21a), emissiveIntensity: 1.2, roughness: 1, fog: true });
    this.lmRed = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0xff2a1a), emissiveIntensity: 3, roughness: 1 });
    for (const id of built) this.addLandmark(id);
  }
  // A finished job on the skyline: each shift has its own building in its own slot
  addLandmark(id, fresh = false) {
    const i = LANDMARKS.indexOf(id); if (i < 0 || this.landmarks[id]) return;
    const s = lmSlot(i), gy = this.gy, M = this.M, geos = [], glows = [], reds = [];
    const box = (w, h, d, x, y, z, t = [1, 1, 1]) => geos.push(tinted(boxGeo(w, h, d, 12, x, y, z), t));
    const glow = (w, h, d, x, y, z) => glows.push(boxGeo(w, h, d, 1, x, y, z));
    const red = (x, y, z) => reds.push(new THREE.SphereGeometry(1.1, 8, 6).translate(x, y, z));
    const cyl = (r, h, x, y, z, t = [.9, .9, .92]) => geos.push(tinted(new THREE.CylinderGeometry(r, r, h, 20, 1, true).translate(x, y, z).toNonIndexed(), t));
    let top = 60, mat = 0;
    switch (id) {
      case 'skeleton': box(24, 78, 24, 0, 39, 0, [.85, .95, 1.1]); box(16, 10, 16, 0, 83, 0, [.85, .95, 1.1]); box(.9, 22, .9, 0, 99, 0); glow(24.6, 1.2, 24.6, 0, 76.5, 0); red(0, 110, 0); top = 110; mat = 5; break;
      case 'yard': box(46, 12, 26, 0, 6, 0, [1, .9, .8]); cyl(5, 36, -11, 18, 0); cyl(5, 36, 0, 18, 0); cyl(5, 36, 11, 18, 0); glow(46.4, .8, 26.4, 0, 12.2, 0); box(2, 40, 2, 20, 20, -8, [1.2, 1, .3]); box(30, 2, 2, 8, 40, -8, [1.2, 1, .3]); red(22, 42, -8); top = 42; mat = 1; break;
      case 'mill': box(52, 22, 24, 0, 11, 0, [1, .82, .7]); cyl(2.6, 62, -15, 31, 4); cyl(2.6, 62, 15, 31, 4); glow(5.6, 1.2, 5.6, -15, 61, 4); glow(5.6, 1.2, 5.6, 15, 61, 4); red(-15, 63, 4); red(15, 63, 4); top = 63; mat = 3; break;
      case 'pit': box(26, 96, 20, 0, 48, 0, [1, .95, .88]); box(18, 6, 14, 0, 99, 0); glow(26.5, 1, 20.5, 0, 94, 0); red(0, 104, 0); top = 104; mat = 2; break;
      case 'bridge': box(150, 2.4, 10, 0, 24, 0, [.8, .8, .85]); for (const x of [-34, 34]) { box(4.5, 72, 4.5, x, 36, -3.5); box(4.5, 72, 4.5, x, 36, 3.5); box(4.5, 3, 11.5, x, 70, 0); red(x, 74, 0); } glow(150.4, .6, 10.4, 0, 25.4, 0); top = 74; mat = 1; break;
      case 'wreck': geos.push(tinted(new THREE.SphereGeometry(30, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, .75, 1).translate(0, 16, 0).toNonIndexed(), [.95, .95, 1])); box(64, 16, 64, 0, 8, 0, [.9, .9, .95]); glow(64.5, 1, 64.5, 0, 15.5, 0); red(0, 39, 0); top = 39; mat = 4; break;
      case 'storm': box(12, 40, 12, 0, 20, 0); box(6, 54, 6, 0, 67, 0); box(1.6, 56, 1.6, 0, 122, 0); glow(12.4, 1, 12.4, 0, 39, 0); red(0, 94, 0); red(0, 150, 0); top = 150; mat = 0; break;
      case 'topout': box(28, 160, 18, 0, 80, 0, [1, .96, .9]); box(20, 8, 12, 0, 164, 0); box(.5, 12, .5, -6, 174, 0); glow(28.6, 1.4, 18.6, 0, 157, 0); glow(5, 3, .3, -3.5, 177, 0); red(6, 170, 0); top = 177; mat = 2; break;
    }
    const g = new THREE.Group(); g.position.set(s.x, gy, s.z); g.rotation.y = -s.a;
    if (geos.length) g.add(new THREE.Mesh(mergeGeometries(geos.map(x => x.index ? x.toNonIndexed() : x)), M.facades[mat]));
    if (glows.length) g.add(new THREE.Mesh(mergeGeometries(glows), this.lmGlow));
    if (reds.length) g.add(new THREE.Mesh(mergeGeometries(reds), this.lmRed));
    if (fresh) { // a searchlight beam on a job that just went up
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 5, 420, 16, 1, true).translate(0, 210, 0), new THREE.MeshBasicMaterial({ color: 0xffd060, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      beam.position.y = top; g.add(beam); this.beam = { m: beam, t: 12 };
    }
    this.group.add(g);
    this.landmarks[id] = { g, top: new THREE.Vector3(s.x, gy + top * .7, s.z) };
    return this.landmarks[id];
  }
  setNight(w) {
    this.night = w;
    for (const f of this.M.facades) f.emissiveIntensity = w * 1.6;
    this.carLights.visible = w > .3; this.beacons.visible = w > .1;
    if (this.lmGlow) this.lmGlow.emissiveIntensity = .5 + w * 2.2;
  }
  update(dt, t) {
    const mt = this.mt, q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
    const qz = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), qx = new THREE.Quaternion();
    this.carData.forEach((c, i) => {
      c.s += c.v * c.dir * dt; if (c.s > this.R) c.s = -this.R; if (c.s < -this.R) c.s = this.R;
      if (c.l.ax === 'x') p.set(c.s, this.gy, c.l.c + c.off); else p.set(c.l.c + c.off, this.gy, c.s);
      mt.compose(p, c.l.ax === 'x' ? qx : qz, s); this.cars.setMatrixAt(i, mt);
      p.y += .8; mt.compose(p, c.l.ax === 'x' ? qx : qz, s); this.carLights.setMatrixAt(i, mt);
    });
    this.cars.instanceMatrix.needsUpdate = true; this.carLights.instanceMatrix.needsUpdate = true;
    this.beacons.material.color.setScalar((t % 2) < .25 ? 1 : .15).multiply(new THREE.Color(1, .15, .1));
    if (this.lmRed) this.lmRed.emissiveIntensity = (t % 1.6) < .5 ? 4 : .3;
    if (this.beam) { this.beam.t -= dt; this.beam.m.material.opacity = Math.max(0, Math.min(.5, this.beam.t / 4)) * (.8 + .2 * Math.sin(t * 6)); if (this.beam.t <= 0) { this.beam.m.parent.remove(this.beam.m); this.beam = null; } }
    if (this.river) this.river.material.normalMap.offset.x += dt * .02;
  }
  dispose() { this.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
}

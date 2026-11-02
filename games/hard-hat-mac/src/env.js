// Sky dome, lighting presets, image-based lighting and the procedural city around the site.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { boxGeo } from './builder.js';
import { mulberry32, rr } from './util.js';

export const PRESETS = {
  morning: { top: 0x2a68c2, hor: 0xc9def0, haze: 0xb0c2d0, sunEl: 24, sunAz: 128, sunCol: [1, .92, .8], sunI: 3.9, hemiSky: 0xa9c8ea, hemiGnd: 0x5e4c38, hemiI: .5, fog: 0xbcd0e2, fogD: .0028, stars: 0, clouds: .45, lamps: 0, windows: 0, exposure: 1.0 },
  dusk: { top: 0x26346a, hor: 0xff9356, haze: 0xffa874, sunEl: 5, sunAz: 250, sunCol: [1, .58, .32], sunI: 2.6, hemiSky: 0x8a7aa8, hemiGnd: 0x3a2a20, hemiI: .6, fog: 0xc98a72, fogD: .0062, stars: .15, clouds: .55, lamps: 1, windows: .7, exposure: 1.05 },
  night: { top: 0x040915, hor: 0x18213a, haze: 0x1d2538, sunEl: 38, sunAz: 25, sunCol: [.58, .68, 1], sunI: .75, hemiSky: 0x44547a, hemiGnd: 0x2a1e14, hemiI: .7, fog: 0x101726, fogD: .009, stars: 1, clouds: .2, lamps: 1, windows: 1.3, exposure: 1.1, moon: true },
  sunset: { top: 0x34488a, hor: 0xffaa48, haze: 0xffc48a, sunEl: 4.5, sunAz: 262, sunCol: [1, .66, .38], sunI: 3.0, hemiSky: 0x9a8ab8, hemiGnd: 0x4a3426, hemiI: .65, fog: 0xe8a878, fogD: .0018, stars: 0, clouds: .5, lamps: .6, windows: .22, exposure: 1.05 },
};

function skyMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, haze: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, sunCol: { value: new THREE.Color() },
      stars: { value: 0 }, clouds: { value: 0 }, time: { value: 0 }, moon: { value: 0 } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }`,
    fragmentShader: `uniform vec3 top, hor, haze, sunDir, sunCol; uniform float stars, clouds, time, moon; varying vec3 vDir;
      float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.1 + 3.1; a *= .5; } return s; }
      void main(){
        vec3 d = normalize(vDir); float h = d.y;
        vec3 col = mix(hor, top, pow(clamp(h, 0., 1.), .5));
        col = mix(col, haze, smoothstep(.02, -.12, h));
        float sd = max(dot(d, sunDir), 0.);
        if (moon > .5) col += sunCol * (smoothstep(.9994, .9997, sd) * 3. + pow(sd, 60.) * .25);
        else col += sunCol * (smoothstep(.9990, .9995, sd) * 30. + pow(sd, 14.) * .5 + pow(sd, 3.) * .15);
        if (h > 0.) {
          vec2 p = d.xz / (h + .12) * 1.1 + vec2(time * .006, time * .002);
          float c = smoothstep(.48, .78, fbm(p)) * clouds * smoothstep(0., .22, h);
          vec3 cc = mix(hor * 1.1, vec3(1.), .45) * (.75 + .5 * pow(sd, 4.)) + sunCol * pow(sd, 8.) * .6;
          if (moon > .5) cc = vec3(.08, .1, .16);
          col = mix(col, cc, c);
          if (stars > 0.) { vec3 q = floor(d * 380.); float r = hash(q); col += step(.9982, r) * stars * (.5 + .5 * sin(time * 2. + r * 80.)) * (1. - c) * vec3(1., .95, .9) * 1.5; }
        }
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
    u.top.value.set(P.top); u.hor.value.set(P.hor); u.haze.value.set(P.haze); u.sunCol.value.setRGB(...P.sunCol); u.stars.value = P.stars; u.clouds.value = P.clouds; u.moon.value = P.moon ? 1 : 0;
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
  buildCity(level, M) {
    if (this.city) { this.scene.remove(this.city.group); this.city.dispose(); }
    this.city = new City(level, M, this.q); this.scene.add(this.city.group);
    if (this.P) this.city.setNight(this.P.windows);
  }
  update(dt, camPos) {
    this.t += dt; this.sky.material.uniforms.time.value = this.t;
    this.sky.position.copy(camPos);
    if (this.city) this.city.update(dt, this.t);
  }
}

function tinted(g, c) {
  const n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c[0]; a[i * 3 + 1] = c[1]; a[i * 3 + 2] = c[2]; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return g;
}

class City {
  constructor(level, M, q) {
    this.group = new THREE.Group(); this.M = M;
    const rng = mulberry32(level.citySeed || 1337), gy = level.high ? -160 : 0;
    this.gy = gy;
    const [bx0, bz0, bx1, bz1] = level.bounds, padX = Math.max(Math.abs(bx0), Math.abs(bx1)) + 26, padZ = Math.max(Math.abs(bz0), Math.abs(bz1)) + 26;
    const block = 30, street = 12, step = block + street, R = q >= 2 ? 420 : 300;
    const buckets = M.facades.map(() => []), roof = [], tanks = [], lights = [];
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), M.asphalt); ground.rotation.x = -Math.PI / 2; ground.position.y = gy - .05; ground.receiveShadow = true;
    M.asphalt.map.repeat.set(1, 1);
    this.group.add(ground);
    const walkGeo = [];
    for (let gx = -R; gx <= R; gx += step) for (let gz = -R; gz <= R; gz += step) {
      const cx = gx + block / 2, cz = gz + block / 2;
      if (Math.abs(cx) < padX + block / 2 && Math.abs(cz) < padZ + block / 2 && !level.high) continue;
      const d = Math.hypot(cx, cz); if (d > R) continue;
      walkGeo.push(boxGeo(block + 3, .2, block + 3, 4, cx, gy + .1, cz));
      const n = rng() < .4 ? 1 : rng() < .7 ? 2 : 4;
      for (let k = 0; k < n; k++) {
        const w = n === 1 ? block * rr(.7, .95) : n === 2 ? block * .45 : block * .44, dd = n === 4 ? block * .44 : block * rr(.7, .92);
        const ox = n === 1 ? 0 : (k % 2 ? 1 : -1) * block * .25, oz = n === 4 ? (k < 2 ? -1 : 1) * block * .25 : 0;
        const tall = Math.max(0, 1 - d / R);
        let h = 12 + rng() * 40 + (rng() < .25 ? rng() * 140 * tall + 40 : 0);
        if (level.high) h = Math.max(h, d < 120 ? 120 + rng() * 90 : h);
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
    const usable = lanes.filter(l => level.high || Math.abs(l.c) > (l.ax === 'z' ? padX : padZ));
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
    this.mt = new THREE.Matrix4(); this.night = 0;
  }
  setNight(w) {
    this.night = w;
    for (const f of this.M.facades) f.emissiveIntensity = w * 1.6;
    this.carLights.visible = w > .3; this.beacons.visible = w > .1;
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
  }
  dispose() { this.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
}

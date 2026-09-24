// VFX: pooled CPU particles (additive fire/sparks + alpha smoke/dust),
// instanced debris chunks, expanding shockwave rings, pooled flash lights,
// tread marks, and screen-shake trauma.

import * as THREE from 'three';
import { Simplex2 } from './noise.js?v=polish1';
import { treadTexture } from './surface-art.js?v=polish1';
import { getHeight, getNormal } from './terrain.js?v=polish1';
import { SCATTER } from './config.js?v=polish1';

const _up = new THREE.Vector3(0, 1, 0);

function softCircleTexture(hard = false) {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(hard ? 0.5 : 0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

// Four lumpy, softly lit cloud silhouettes in a single shared map.
function smokeAtlas() {
  const tile=128,n=tile*2,data=new Uint8Array(n*n*4);
  for(let k=0;k<4;k++) {
    const noise=new Simplex2(908+k*371),ox=k%2*tile,oy=Math.floor(k/2)*tile;
    for(let y=0;y<tile;y++)for(let x=0;x<tile;x++) {
      const nx=x/(tile-1)*2-1,ny=y/(tile-1)*2-1;
      const broad=noise.noise(nx*2+5,ny*2-8),fine=noise.fbm(nx*5-30,ny*5+40,3,2,.5);
      const d=Math.hypot(nx,ny),edge=1-THREE.MathUtils.smoothstep(d+Math.max(0,broad)*.18,.32,.96);
      const density=edge*(.72+fine*.34),light=THREE.MathUtils.clamp(.84-ny*.11+fine*.14,.58,1);
      const i=((oy+y)*n+ox+x)*4;data[i]=data[i+1]=data[i+2]=light*255;data[i+3]=density*255;
    }
  }
  const map=new THREE.DataTexture(data,n,n);map.magFilter=THREE.LinearFilter;
  map.minFilter=THREE.LinearMipmapLinearFilter;map.generateMipmaps=true;map.needsUpdate=true;return map;
}

// irregular dark-red splatter with outlying droplets
function bloodTexture() {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  for (let i = 0; i < 9; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 14;
    const x = s / 2 + Math.cos(a) * r;
    const y = s / 2 + Math.sin(a) * r;
    const rad = 4 + Math.random() * 9;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, 'rgba(96,14,10,0.9)');
    g.addColorStop(0.7, 'rgba(110,19,13,0.55)');
    g.addColorStop(1, 'rgba(110,19,13,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 12 + Math.random() * 17;
    ctx.fillStyle = 'rgba(90,13,9,0.75)';
    ctx.beginPath();
    ctx.arc(s / 2 + Math.cos(a) * r, s / 2 + Math.sin(a) * r, 0.8 + Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// Blast crater: dark burnt core, a lighter broken ring of thrown-out soil
// with clods, and a wide soft scorch halo that browns the surrounding grass.
function craterTexture() {
  const s = 256, c = s / 2;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  const noise = new Simplex2(4417);
  let seed = 991;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  // scorch halo (widest, faint)
  const halo = ctx.createRadialGradient(c, c, s * 0.12, c, c, s * 0.5);
  halo.addColorStop(0, 'rgba(40,31,20,0.62)');
  halo.addColorStop(0.55, 'rgba(52,42,26,0.30)');
  halo.addColorStop(1, 'rgba(60,48,30,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, s, s);
  // ragged ejecta ring: lighter churned earth, radius wobbles with noise
  const img = ctx.getImageData(0, 0, s, s), d = img.data;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const dx = (x - c) / c, dy = (y - c) / c, r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const wob = noise.noise(Math.cos(a) * 2.2, Math.sin(a) * 2.2) * 0.07 + noise.noise(dx * 9, dy * 9) * 0.03;
    const rr = r + wob;
    const i = (y * s + x) * 4;
    let R = d[i], G = d[i + 1], B = d[i + 2], A = d[i + 3] / 255;
    const mix = (cr, cg, cb, ca) => {
      const na = ca + A * (1 - ca);
      if (na <= 0) return;
      R = (cr * ca + R * A * (1 - ca)) / na; G = (cg * ca + G * A * (1 - ca)) / na; B = (cb * ca + B * A * (1 - ca)) / na; A = na;
    };
    // raised lip of lighter soil
    const lip = Math.exp(-((rr - 0.34) ** 2) / 0.006);
    if (lip > 0.01) mix(118, 94, 62, lip * 0.78);
    // inner bowl: dark, burnt, slightly glassy centre
    if (rr < 0.33) {
      const bowl = 1 - THREE.MathUtils.smoothstep(rr, 0.16, 0.33);
      mix(26 + noise.noise(dx * 14, dy * 14) * 10, 21, 15, 0.55 + bowl * 0.4);
    }
    d[i] = R; d[i + 1] = G; d[i + 2] = B; d[i + 3] = A * 255;
  }
  ctx.putImageData(img, 0, 0);
  // clods of soil scattered across the lip and beyond
  for (let i = 0; i < 90; i++) {
    const a = rng() * Math.PI * 2, r = (0.3 + rng() * rng() * 0.62) * c;
    const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r, cr = 1 + rng() * 3.2;
    ctx.fillStyle = rng() < 0.6 ? 'rgba(70,54,34,0.85)' : 'rgba(134,110,74,0.8)';
    ctx.beginPath(); ctx.ellipse(x, y, cr, cr * (0.6 + rng() * 0.5), a, 0, Math.PI * 2); ctx.fill();
  }
  // radial blast streaks
  ctx.strokeStyle = 'rgba(30,24,16,0.22)';
  for (let i = 0; i < 26; i++) {
    const a = rng() * Math.PI * 2, r0 = 0.36 * c, r1 = (0.5 + rng() * 0.45) * c;
    ctx.lineWidth = 1 + rng() * 3;
    ctx.beginPath(); ctx.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
    ctx.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// irregular soil clod: a squashed, jittered icosahedron
function clodGeometry() {
  const g = new THREE.IcosahedronGeometry(0.13, 0);
  const p = g.attributes.position;
  let seed = 77;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const moved = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)}|${p.getY(i).toFixed(3)}|${p.getZ(i).toFixed(3)}`;
    if (!moved.has(key)) moved.set(key, 0.7 + rng() * 0.6);
    const k = moved.get(key);
    p.setXYZ(i, p.getX(i) * k * 1.2, p.getY(i) * k * 0.75, p.getZ(i) * k);
  }
  g.computeVertexNormals();
  return g;
}

class ParticlePool {
  constructor(scene, count, { additive }) {
    this.count = count;
    this.pos = new Float32Array(count * 3);
    this.col = new Float32Array(count * 3);
    this.col0 = new Float32Array(count * 3);   // birth colour
    this.col1 = new Float32Array(count * 3);   // end-of-life colour
    this.shift = new Uint8Array(count);        // 1 = colour lerps over life
    this.sizeAttr = new Float32Array(count);
    this.vel = new Float32Array(count * 3);
    this.life = new Float32Array(count);
    this.maxLife = new Float32Array(count);
    this.grow = new Float32Array(count);
    this.drag = new Float32Array(count);
    this.grav = new Float32Array(count);
    this.baseSize = new Float32Array(count);
    this.startAlpha = new Float32Array(count);
    this.alpha = new Float32Array(count);this.phase = new Float32Array(count*2);this.additive=additive;this.spawnSerial=0;
    this.head = 0;
    this.activeCap = count;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(this.sizeAttr, 1));
    geo.setAttribute('aAlpha',new THREE.BufferAttribute(this.alpha,1));
    geo.setAttribute('aPhase',new THREE.BufferAttribute(this.phase,2));

    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: additive?softCircleTexture(true):smokeAtlas() }, tiles:{value:additive?1:2}, pointLimit:{value:192} },
      vertexShader: /* glsl */`
        attribute float size;attribute float aAlpha;attribute vec2 aPhase;
        uniform float pointLimit;uniform float tiles;
        varying vec3 vCol;varying float vAlpha;varying vec4 vPhase;
        void main() {
          vCol = color;vAlpha=aAlpha;vPhase=vec4(cos(aPhase.x),sin(aPhase.x),mod(aPhase.y,tiles),floor(aPhase.y/tiles));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = min(pointLimit,size * (220.0 / max(0.1,-mv.z)));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform sampler2D map;uniform float tiles;
        varying vec3 vCol;varying float vAlpha;varying vec4 vPhase;
        void main() {
          if(vAlpha<0.003)discard;
          vec2 p=gl_PointCoord-.5;
          vec2 uv=vec2(p.x*vPhase.x-p.y*vPhase.y,p.x*vPhase.y+p.y*vPhase.x)+.5;
          if(any(lessThan(uv,vec2(0.0)))||any(greaterThan(uv,vec2(1.0))))discard;
          vec4 t=texture2D(map,(clamp(uv,vec2(.004),vec2(.996))+vPhase.zw)/tiles);
          gl_FragColor=vec4(vCol,t.a*vAlpha)*vec4(t.rgb,1.0);
        }`,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.life.fill(-1);
  }

  emit(x, y, z, vx, vy, vz, life, size, r, g, b, { grow = 0, drag = 0, grav = 0, alpha = 0.62, end = null } = {}) {
    const i = this.head;
    this.head = (this.head + 1) % this.activeCap;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.life[i] = life; this.maxLife[i] = life;
    this.baseSize[i] = size;
    this.col[i * 3] = r; this.col[i * 3 + 1] = g; this.col[i * 3 + 2] = b;
    this.col0[i * 3] = r; this.col0[i * 3 + 1] = g; this.col0[i * 3 + 2] = b;
    this.shift[i] = end ? 1 : 0;
    if (end) { this.col1[i * 3] = end[0]; this.col1[i * 3 + 1] = end[1]; this.col1[i * 3 + 2] = end[2]; this.shifting = true; }
    this.startAlpha[i] = this.additive?1:alpha;
    this.phase[i*2]=(this.spawnSerial++*2.399963)%6.283185;this.phase[i*2+1]=this.additive?0:this.spawnSerial%4;
    this.phaseDirty=true;
    this.grow[i] = grow; this.drag[i] = drag; this.grav[i] = grav;
  }

  update(dt) {
    const { pos, vel, life, maxLife, sizeAttr, baseSize, grow, drag, grav } = this;
    for (let i = 0; i < this.count; i++) {
      if (life[i] < 0) { sizeAttr[i] = 0; this.alpha[i]=0;continue; }
      life[i] -= dt;
      if (life[i] < 0) { sizeAttr[i] = 0; this.alpha[i]=0;continue; }
      const dragF = 1 - drag[i] * dt;
      vel[i * 3] *= dragF;
      vel[i * 3 + 1] = vel[i * 3 + 1] * dragF + grav[i] * dt;
      vel[i * 3 + 2] *= dragF;
      pos[i * 3] += vel[i * 3] * dt;
      pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
      pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      const t = life[i] / maxLife[i];
      sizeAttr[i] = Math.max(0, baseSize[i] * (1 + grow[i] * (1 - t)));
      if (this.shift[i]) {
        const u = Math.min(1, (1 - t) * 1.6), c0 = this.col0, c1 = this.col1, j = i * 3;
        this.col[j] = c0[j] + (c1[j] - c0[j]) * u;
        this.col[j + 1] = c0[j + 1] + (c1[j + 1] - c0[j + 1]) * u;
        this.col[j + 2] = c0[j + 2] + (c1[j + 2] - c0[j + 2]) * u;
      }
      this.alpha[i]=this.startAlpha[i]*THREE.MathUtils.smoothstep(t,0,.45)*(this.additive?1:THREE.MathUtils.smoothstep(1-t,0,.08));
    }
    this.points.geometry.attributes.aAlpha.needsUpdate=true;
    if(this.phaseDirty||this.shifting){this.points.geometry.attributes.aPhase.needsUpdate=true;this.points.geometry.attributes.color.needsUpdate=true;this.phaseDirty=false;}
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.size.needsUpdate = true;
  }
}

export class Effects {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.fire = new ParticlePool(scene, 700, { additive: true });
    this.smoke = new ParticlePool(scene, 900, { additive: false });
    this.trauma = 0;
    this.time = 0;
    this.particleScale = 1;

    // debris chunks
    this.debrisCount = 90;
    const dGeo = clodGeometry();
    const dMat = new THREE.MeshStandardMaterial({ color: 0x57462f, roughness: 1, flatShading: true });
    this.debris = new THREE.InstancedMesh(dGeo, dMat, this.debrisCount);
    this.debris.frustumCulled = false;
    this.debris.castShadow = false;
    scene.add(this.debris);
    this.debrisData = [];
    for (let i = 0; i < this.debrisCount; i++) {
      this.debrisData.push({ alive: false, p: new THREE.Vector3(), v: new THREE.Vector3(), rot: new THREE.Euler(), rv: new THREE.Vector3(), life: 0, scale: 1 });
    }
    this.debrisHead = 0;
    this.dummy = new THREE.Object3D();

    // shockwave rings
    this.rings = [];
    const ringGeo = new THREE.RingGeometry(0.8, 1, 28);
    ringGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: 0xffe6b8, transparent: true, opacity: 0, depthWrite: false,
      }));
      m.visible = false;
      scene.add(m);
      this.rings.push({ mesh: m, t: 0, dur: 0.5, scale: 8, active: false });
    }

    // pooled flash lights
    this.lights = [];
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffc278, 0, 36, 1.8);
      scene.add(l);
      this.lights.push({ light: l, t: 0, dur: 0.001, peak: 0 });
    }

    // scorch decals under explosions
    const scGeo = new THREE.PlaneGeometry(2.2, 2.2);
    scGeo.rotateX(-Math.PI / 2);
    const scMat = new THREE.MeshLambertMaterial({
      map: craterTexture(), transparent: true, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -3,
    });
    this.scorch = new THREE.InstancedMesh(scGeo, scMat, SCATTER.scorch);
    this.scorch.frustumCulled = false;
    scene.add(this.scorch);
    this.scorchHead = 0;
    {
      const zeroM = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let i = 0; i < SCATTER.scorch; i++) this.scorch.setMatrixAt(i, zeroM);
    }

    // tread marks
    const tmGeo = new THREE.PlaneGeometry(0.48, 0.88);
    tmGeo.rotateX(-Math.PI / 2);
    const tmMat = new THREE.MeshBasicMaterial({
      map: treadTexture(), color: 0xffffff, transparent: true, opacity: 0.60, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2,
    });
    this.marks = new THREE.InstancedMesh(tmGeo, tmMat, SCATTER.treadMarks);
    this.marks.frustumCulled = false;
    scene.add(this.marks);
    this.markData = new Array(SCATTER.treadMarks).fill(null).map(() => ({ born: -1e9 }));
    this.markHead = 0;
    this.markLife = 65;
    this.markTime = { value: 0 };
    this.markBirths = new THREE.InstancedBufferAttribute(new Float32Array(SCATTER.treadMarks).fill(-1e6), 1);
    tmGeo.setAttribute('aBorn', this.markBirths);
    tmMat.onBeforeCompile = sh => {
      sh.uniforms.markTime = this.markTime;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aBorn; varying float vBorn;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBorn = aBorn;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float markTime; varying float vBorn;')
        .replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\ndiffuseColor.a *= 1.0 - smoothstep(45.0, 65.0, markTime - vBorn);');
    };
    tmMat.customProgramCacheKey = () => 'tread-fade-detail2';
    const zeroM = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < SCATTER.treadMarks; i++) this.marks.setMatrixAt(i, zeroM);

    // blood splats where infantry fall
    const bsGeo = new THREE.PlaneGeometry(1.5, 1.5);
    bsGeo.rotateX(-Math.PI / 2);
    const bsMat = new THREE.MeshBasicMaterial({
      map: bloodTexture(), transparent: true, opacity: 0.7, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2,
    });
    this.splats = new THREE.InstancedMesh(bsGeo, bsMat, 90);
    this.splats.frustumCulled = false;
    scene.add(this.splats);
    this.splatHead = 0;
    for (let i = 0; i < 90; i++) this.splats.setMatrixAt(i, zeroM);
  }

  bloodSplat(x, z) {
    const i = this.splatHead;
    this.splatHead = (this.splatHead + 1) % this.splats.count;
    const n = getNormal(x, z);
    this.dummy.position.set(x, getHeight(x, z) + 0.05, z);
    this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    this.dummy.rotateY(Math.random() * Math.PI * 2);
    this.dummy.scale.setScalar(0.7 + Math.random() * 0.8);
    this.dummy.updateMatrix();
    this.splats.setMatrixAt(i, this.dummy.matrix);
    this.splats.instanceMatrix.needsUpdate = true;
  }

  setParticleScale(s) { this.particleScale = s;this.smoke.points.material.uniforms.pointLimit.value=128+64*s;this.fire.points.material.uniforms.pointLimit.value=128+64*s; }

  setShakeScale(s) { this.shakeScale = s; }

  // thin additive MG tracer line from muzzle to impact, fades in ~70ms
  tracer(from, to) {
    if (!this.tracers) {
      this.tracers = [];
      const geo = new THREE.BoxGeometry(0.05, 0.05, 1);
      geo.translate(0, 0, 0.5); // scale along +z from origin
      for (let i = 0; i < 14; i++) {
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
          color: 0xffe9a0, transparent: true, opacity: 0.9,
          blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
        }));
        mesh.visible = false;
        this.scene.add(mesh);
        this.tracers.push({ mesh, t: 1 });
      }
      this.tracerHead = 0;
    }
    const tr = this.tracers[this.tracerHead++ % this.tracers.length];
    tr.t = 0;
    tr.mesh.visible = true;
    tr.mesh.position.copy(from);
    tr.mesh.lookAt(to);
    tr.mesh.scale.set(1, 1, from.distanceTo(to));
  }

  shake(amount) { this.trauma = Math.min(1.2, this.trauma + amount * (this.shakeScale ?? 1)); }

  flashLight(pos, color, intensity, dur) {
    let slot = this.lights[0];
    for (const l of this.lights) if (l.t >= l.dur) { slot = l; break; }
    slot.light.position.copy(pos);
    slot.light.color.set(color);
    slot.t = 0;
    slot.dur = dur;
    slot.peak = intensity;
  }

  ring(pos, scale = 8, dur = 0.5, color = 0xffe6b8) {
    const r = this.rings.find(r => !r.active) || this.rings[0];
    r.active = true;
    r.t = 0;
    r.dur = dur;
    r.scale = scale;
    r.mesh.material.color.set(color);
    r.mesh.position.copy(pos);
    r.mesh.position.y = getHeight(pos.x, pos.z) + 0.25;
    r.mesh.visible = true;
  }

  addScorch(pos, scale = 2.2) {
    const i = this.scorchHead;
    this.scorchHead = (this.scorchHead + 1) % this.scorch.count;
    // conform to the slope so craters on hillsides don't clip or float
    this.dummy.position.set(pos.x, getHeight(pos.x, pos.z) + 0.06, pos.z);
    this.dummy.quaternion.setFromUnitVectors(_up, getNormal(pos.x, pos.z));
    this.dummy.rotateY(Math.random() * Math.PI * 2);
    this.dummy.scale.setScalar(scale * (0.8 + Math.random() * 0.5));
    this.dummy.updateMatrix();
    this.scorch.setMatrixAt(i, this.dummy.matrix);
    this.scorch.instanceMatrix.needsUpdate = true;
  }

  spawnDebris(pos, count, power, color = null) {
    count = Math.floor(count * this.particleScale);
    for (let i = 0; i < count; i++) {
      const d = this.debrisData[this.debrisHead];
      this.debrisHead = (this.debrisHead + 1) % this.debrisCount;
      d.alive = true;
      d.p.copy(pos);
      const a = Math.random() * Math.PI * 2;
      const up = 4 + Math.random() * 7 * power;
      d.v.set(Math.cos(a) * (2 + Math.random() * 6) * power, up, Math.sin(a) * (2 + Math.random() * 6) * power);
      d.rv.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      d.life = 1.4 + Math.random();
      d.scale = 0.6 + Math.random() * 1.3;
    }
    if (color) this.debris.material.color.set(color);
  }

  muzzleFlash(pos, dir) {
    const n = Math.floor(16 * this.particleScale);
    for (let i = 0; i < n; i++) {
      const sp = 14 + Math.random() * 22;
      const jx = (Math.random() - 0.5) * 6, jy = (Math.random() - 0.5) * 6, jz = (Math.random() - 0.5) * 6;
      this.fire.emit(pos.x, pos.y, pos.z,
        dir.x * sp + jx, dir.y * sp + jy, dir.z * sp + jz,
        0.1 + Math.random() * 0.12, 1.6 + Math.random() * 2.2,
        1, 0.78, 0.35, { drag: 6, grow: 1.5 });
    }
    const m = Math.floor(10 * this.particleScale);
    for (let i = 0; i < m; i++) {
      this.smoke.emit(
        pos.x + dir.x * 0.8, pos.y + dir.y * 0.8, pos.z + dir.z * 0.8,
        dir.x * 6 + (Math.random() - 0.5) * 2.5, dir.y * 6 + 1 + Math.random(), dir.z * 6 + (Math.random() - 0.5) * 2.5,
        0.7 + Math.random() * 0.5, 1.4 + Math.random() * 1.6,
        0.62, 0.6, 0.56, { drag: 2.5, grow: 2.6 });
    }
    this.flashLight(pos, 0xffc887, 90, 0.09);
  }

  // Staged blast: white-hot flash → orange fireball that cools and rises →
  // a dark smoke column that lingers for seconds → a low dust skirt racing
  // out along the ground → thrown soil clods and a crater.
  explosion(pos, power = 1) {
    const ps = this.particleScale;
    const gy = getHeight(pos.x, pos.z);
    // 1. flash: a couple of huge, very short additive points
    for (let i = 0; i < 2; i++) {
      this.fire.emit(pos.x, pos.y + 0.6, pos.z, 0, 1, 0,
        0.07 + i * 0.03, (7 + i * 3) * power, 1, 0.97, 0.86, { grow: 0.6 });
    }
    // 2. fireball: hot core, cools to deep red while it rises and shrinks
    const nf = Math.floor(22 * ps * power) + 3;
    for (let i = 0; i < nf; i++) {
      const a = Math.random() * Math.PI * 2;
      const el = Math.random() * Math.PI * 0.5;
      const sp = (2 + Math.random() * 8) * power;
      this.fire.emit(pos.x, pos.y + 0.3, pos.z,
        Math.cos(a) * Math.cos(el) * sp, Math.sin(el) * sp + 2.5, Math.sin(a) * Math.cos(el) * sp,
        0.35 + Math.random() * 0.45, (2.4 + Math.random() * 2.6) * power,
        1, 0.82 + Math.random() * 0.12, 0.45,
        { drag: 3.2, grow: 0.5, grav: 5, end: [0.55, 0.12, 0.03] });
    }
    // sparks + shrapnel streaks
    const nk = Math.floor(16 * ps * power);
    for (let i = 0; i < nk; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (10 + Math.random() * 26) * power;
      this.fire.emit(pos.x, pos.y + 0.4, pos.z,
        Math.cos(a) * sp, 4 + Math.random() * 14, Math.sin(a) * sp,
        0.3 + Math.random() * 0.45, 0.45,
        1, 0.88, 0.55, { grav: -24, drag: 0.9, end: [0.9, 0.35, 0.08] });
    }
    // 3. smoke column: dark, slow, billowing — outlives the fire by seconds
    const ns = Math.floor(14 * ps * power) + 2;
    for (let i = 0; i < ns; i++) {
      const g = 0.1 + Math.random() * 0.1;
      const lift = 3 + Math.random() * 5;
      this.smoke.emit(
        pos.x + (Math.random() - 0.5) * 1.8 * power, pos.y + 0.6 + Math.random() * 1.6, pos.z + (Math.random() - 0.5) * 1.8 * power,
        (Math.random() - 0.5) * 1.6, lift, (Math.random() - 0.5) * 1.6,
        2.6 + Math.random() * 2.4, (2.4 + Math.random() * 2.6) * power,
        g, g * 0.94, g * 0.88, { drag: 0.9, grow: 3.2, alpha: 0.7 });
    }
    // grey-brown ejecta plume thrown up with the soil
    const ne = Math.floor(8 * ps * power) + 1;
    for (let i = 0; i < ne; i++) {
      const a = Math.random() * Math.PI * 2, sp = (1 + Math.random() * 3) * power;
      this.smoke.emit(pos.x, gy + 0.4, pos.z,
        Math.cos(a) * sp, 7 + Math.random() * 7 * power, Math.sin(a) * sp,
        1.1 + Math.random() * 0.8, (1.2 + Math.random()) * power,
        0.36, 0.3, 0.22, { drag: 1.6, grow: 2.2, grav: -9, alpha: 0.75 });
    }
    // 4. dust skirt: low, fast, wide ring hugging the ground
    const nd = Math.floor(14 * ps * power) + 2;
    for (let i = 0; i < nd; i++) {
      const a = (i / nd) * Math.PI * 2 + Math.random() * 0.4, sp = (9 + Math.random() * 7) * power;
      const g = 0.5 + Math.random() * 0.08;
      this.smoke.emit(pos.x + Math.cos(a) * 0.8, gy + 0.35, pos.z + Math.sin(a) * 0.8,
        Math.cos(a) * sp, 0.4 + Math.random() * 0.6, Math.sin(a) * sp,
        1.2 + Math.random() * 0.7, (1.5 + Math.random() * 1.2) * power,
        g, g * 0.9, g * 0.74, { drag: 3.4, grow: 2.6, alpha: 0.42 });
    }
    // 5. soil clods, crater, light, shake
    this.spawnDebris(pos, 10 * power, power);
    this.ring(pos, 6 * power, 0.32);
    this.addScorch(pos, 1.9 * power);
    this.flashLight(pos, 0xffb24f, 190 * power, 0.2);
    const d = this.camera.position.distanceTo(pos);
    this.shake(Math.min(0.7, 26 * power / Math.max(8, d)));
  }

  // pulsing red target disc where an artillery shell will land
  warnMarker(x, z, dur) {
    if (!this.warns) {
      this.warns = [];
      const geo = new THREE.RingGeometry(0.72, 1, 32);
      geo.rotateX(-Math.PI / 2);
      const dotGeo = new THREE.CircleGeometry(0.16, 16);
      dotGeo.rotateX(-Math.PI / 2);
      for (let i = 0; i < 10; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xff4a2e, transparent: true, opacity: 0, depthWrite: false, fog: false });
        const m = new THREE.Mesh(geo, mat);
        m.add(new THREE.Mesh(dotGeo, mat));
        m.visible = false;
        this.scene.add(m);
        this.warns.push({ mesh: m, t: 0, dur: 1 });
      }
      this.warnHead = 0;
    }
    const w = this.warns[this.warnHead++ % this.warns.length];
    w.t = 0; w.dur = dur;
    w.mesh.position.set(x, getHeight(x, z) + 0.3, z);
    w.mesh.quaternion.setFromUnitVectors(_up, getNormal(x, z));
    w.mesh.visible = true;
  }

  // AP round glancing off: spark fan along the deflected path + a skipping tracer
  ricochet(pos, vel, normal) {
    const v = new THREE.Vector3(vel?.x ?? 0, vel?.y ?? 0, vel?.z ?? 1).normalize();
    const n = normal && normal.lengthSq() > 0.01 ? normal.clone().normalize() : new THREE.Vector3(0, 1, 0);
    const out = v.clone().addScaledVector(n, -2 * v.dot(n)).normalize();
    out.y = Math.abs(out.y) * 0.6 + 0.25;
    out.normalize();
    const k = Math.floor(18 * this.particleScale) + 4;
    for (let i = 0; i < k; i++) {
      const sp = 14 + Math.random() * 22;
      this.fire.emit(pos.x, pos.y, pos.z,
        out.x * sp + (Math.random() - 0.5) * 7, out.y * sp + (Math.random() - 0.5) * 5, out.z * sp + (Math.random() - 0.5) * 7,
        0.18 + Math.random() * 0.25, 0.42, 1, 0.93, 0.7, { grav: -20, drag: 1.4, end: [1, 0.45, 0.1] });
    }
    this.tracer(pos, pos.clone().addScaledVector(out, 26));
    this.flashLight(pos, 0xfff0c0, 55, 0.07);
  }

  // ricochet sparks for non-lethal armor hits
  sparks(pos) {
    const n = Math.floor(10 * this.particleScale);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 6 + Math.random() * 14;
      this.fire.emit(pos.x, pos.y, pos.z,
        Math.cos(a) * sp, 2 + Math.random() * 9, Math.sin(a) * sp,
        0.18 + Math.random() * 0.18, 0.4,
        1, 0.9, 0.55, { grav: -26, drag: 1 });
    }
    this.flashLight(pos, 0xffe2a0, 30, 0.06);
  }

  // engine exhaust puff (dark when working hard)
  exhaustPuff(pos, load = 1) {
    const g = 0.3 - load * 0.12;
    this.smoke.emit(pos.x, pos.y, pos.z,
      (Math.random() - 0.5) * 0.6, 1.2 + Math.random() * 1.2, (Math.random() - 0.5) * 0.6,
      0.5 + Math.random() * 0.45, 0.5 + load * 0.5,
      g, g, g, { drag: 1.5, grow: 2.8 });
  }

  // hp-scaled battle damage smoke from a tank (call per-frame with dt)
  damageSmoke(pos, frac, dt) {
    if (frac >= 0.6) return;
    const heavy = frac < 0.3;
    if (Math.random() > dt * (heavy ? 10 : 4.5) * this.particleScale) return;
    const g = heavy ? 0.1 : 0.34;
    this.smoke.emit(
      pos.x + (Math.random() - 0.5), pos.y + 1.6, pos.z - 1.2 + (Math.random() - 0.5),
      (Math.random() - 0.5), 1.8 + Math.random() * 1.6, (Math.random() - 0.5),
      heavy ? 1.6 : 1.1, heavy ? 2.4 : 1.6,
      g, g * 0.98, g * 0.95, { grow: 2.8, drag: 1 },
    );
    if (heavy && Math.random() < 0.35) {
      this.fire.emit(pos.x + (Math.random() - 0.5) * 0.8, pos.y + 1.2, pos.z - 1 + (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5), 1.4 + Math.random() * 1.6, (Math.random() - 0.5),
        0.3, 1.3 + Math.random(), 1, 0.5, 0.16, { grow: 1.3, drag: 1 });
    }
  }

  dustPuff(x, y, z, amount = 1, driftX = 0, driftZ = 0) {
    const n = Math.max(1,Math.floor(2 * amount * this.particleScale));
    for (let i = 0; i < n; i++) {
      const g = 0.52 + Math.random() * 0.1;
      this.smoke.emit(
        x + (Math.random() - 0.5) * 1.4, y + 0.2, z + (Math.random() - 0.5) * 1.4,
        driftX+(Math.random() - 0.5) * 1.2, 0.4 + Math.random() * 0.7, driftZ+(Math.random() - 0.5) * 1.2,
        0.7 + Math.random() * 0.7, 1.1 + Math.random() * 1.4,
        g, g * 0.94, g * 0.8, { drag: 1.3, grow: 2.1, alpha: 0.35 });
    }
  }

  shellTrail(pos) {
    if (Math.random() > 0.55 * this.particleScale) return;
    const g = 0.7;
    this.smoke.emit(pos.x, pos.y, pos.z, 0, 0.4, 0,
      0.35 + Math.random() * 0.25, 0.7,
      g, g, g, { grow: 1.8 });
  }

  treadMark(x, z, yaw) {
    const i = this.markHead;
    this.markHead = (this.markHead + 1) % this.marks.count;
    this.markData[i].born = this.time;
    this.markBirths.setX(i, this.time);
    this.markBirths.needsUpdate = true;
    const n = getNormal(x, z);
    this.dummy.position.set(x, getHeight(x, z) + 0.04, z);
    this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    this.dummy.rotateY(yaw);
    this.dummy.scale.setScalar(1);
    this.dummy.updateMatrix();
    this.marks.setMatrixAt(i, this.dummy.matrix);
    this.marks.instanceMatrix.needsUpdate = true;
  }

  burningWreck(pos) {
    // a few seconds of fire+smoke at a dead tank
    const n = Math.floor(3 * this.particleScale);
    for (let i = 0; i < n; i++) {
      this.fire.emit(pos.x + (Math.random() - 0.5), pos.y + 1.4, pos.z + (Math.random() - 0.5),
        (Math.random() - 0.5), 1.5 + Math.random() * 2, (Math.random() - 0.5),
        0.35, 1.6 + Math.random(), 1, 0.5, 0.15, { grow: 1.4, drag: 1 });
      const g = 0.16;
      this.smoke.emit(pos.x + (Math.random() - 0.5), pos.y + 2, pos.z + (Math.random() - 0.5),
        (Math.random() - 0.5) * 1.5, 2.4 + Math.random() * 2, (Math.random() - 0.5) * 1.5,
        1.6, 2.8, g, g, g, { grow: 3, drag: 1 });
    }
  }

  // a burnt-out wreck keeps smouldering: thin dark column and the odd ember
  wreckSmoke(pos, dt, age) {
    const rate = age < 20 ? 3.2 : 1.6;
    if (Math.random() > dt * rate * this.particleScale) return;
    const g = 0.14 + Math.random() * 0.06;
    this.smoke.emit(pos.x + (Math.random() - 0.5) * 0.8, pos.y + 1.8, pos.z + (Math.random() - 0.5) * 0.8,
      0.35 + (Math.random() - 0.5) * 0.4, 1.6 + Math.random() * 1.2, (Math.random() - 0.5) * 0.4,
      3.5 + Math.random() * 1.5, 1.4 + Math.random(), g, g * 0.96, g * 0.92, { grow: 3.4, drag: 0.5, alpha: 0.5 });
    if (Math.random() < 0.18) {
      this.fire.emit(pos.x + (Math.random() - 0.5), pos.y + 1.4, pos.z + (Math.random() - 0.5),
        (Math.random() - 0.5) * 0.8, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 0.8,
        0.9 + Math.random() * 0.6, 0.22, 1, 0.55, 0.18, { drag: 0.6, end: [0.4, 0.06, 0.0] });
    }
  }

  update(dt) {
    this.time += dt;
    if (this.warns) {
      for (const w of this.warns) {
        if (!w.mesh.visible) continue;
        w.t += dt;
        if (w.t >= w.dur) { w.mesh.visible = false; continue; }
        const u = w.t / w.dur, pulse = 0.5 + 0.5 * Math.sin(w.t * (10 + u * 18));
        const r = 3.6 - u * 1.6;
        w.mesh.scale.set(r, 1, r);
        w.mesh.material.opacity = (0.35 + pulse * 0.5) * Math.min(1, w.t * 6);
      }
    }
    this.markTime.value = this.time;
    this.fire.update(dt);
    this.smoke.update(dt);

    // debris
    for (let i = 0; i < this.debrisCount; i++) {
      const d = this.debrisData[i];
      if (!d.alive) {
        this.dummy.scale.setScalar(0);
        this.dummy.position.set(0, -100, 0);
      } else {
        d.life -= dt;
        d.v.y -= 22 * dt;
        d.p.addScaledVector(d.v, dt);
        const ground = getHeight(d.p.x, d.p.z);
        if (d.p.y < ground + 0.1) {
          d.p.y = ground + 0.1;
          d.v.y = Math.abs(d.v.y) * 0.3;
          d.v.x *= 0.7; d.v.z *= 0.7;
        }
        d.rot.x += d.rv.x * dt; d.rot.y += d.rv.y * dt; d.rot.z += d.rv.z * dt;
        if (d.life <= 0) d.alive = false;
        this.dummy.position.copy(d.p);
        this.dummy.rotation.copy(d.rot);
        this.dummy.scale.setScalar(Math.max(0, Math.min(1, d.life * 2)) * d.scale);
      }
      this.dummy.updateMatrix();
      this.debris.setMatrixAt(i, this.dummy.matrix);
    }
    this.debris.instanceMatrix.needsUpdate = true;

    // rings
    for (const r of this.rings) {
      if (!r.active) continue;
      r.t += dt;
      const t = r.t / r.dur;
      if (t >= 1) { r.active = false; r.mesh.visible = false; continue; }
      const s = 1 + t * r.scale;
      r.mesh.scale.set(s, 1, s);
      r.mesh.material.opacity = 0.55 * (1 - t);
    }

    // lights
    for (const l of this.lights) {
      l.t += dt;
      const t = Math.min(1, l.t / l.dur);
      l.light.intensity = l.peak * (1 - t) * (1 - t);
    }

    // MG tracers
    if (this.tracers) {
      for (const tr of this.tracers) {
        if (!tr.mesh.visible) continue;
        tr.t += dt;
        if (tr.t > 0.07) tr.mesh.visible = false;
        else tr.mesh.material.opacity = 0.9 * (1 - tr.t / 0.07);
      }
    }

    this.trauma = Math.max(0, this.trauma - dt * 1.6);
  }

  // camera shake offset, call after camera positioned
  applyShake(camera) {
    if (this.trauma <= 0) return;
    const t = this.time * 31;
    const s = this.trauma * this.trauma;
    camera.position.x += Math.sin(t * 1.1) * 0.25 * s;
    camera.position.y += Math.sin(t * 1.7 + 2) * 0.22 * s;
    camera.rotation.z += Math.sin(t * 1.4 + 4) * 0.012 * s;
  }
}

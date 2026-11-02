// Munitions explosions. Fireballs and smoke are instanced noise-displaced
// spheres: a turbulent 3D-noise surface that rolls as it rises, a
// blackbody colour ramp that cools from white-hot to soot, sun/sky lit
// smoke, and noise erosion as each billow dissipates. Sparks and thrown
// earth are velocity-stretched streak quads. A short list of shock fronts
// feeds the screen-space refraction ring in the grade pass. Each munition
// (HE, AP, artillery, bomb, rocket, fuel, vehicle cook-off, concrete) has
// its own recipe built from those parts.

import * as THREE from 'three';
import { getHeight } from './terrain.js?v=real2';

const NOISE_GLSL = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=.142857142857*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 nm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// ---------------------------------------------------------------- billows
// kind 0 = fire (cools to soot), 1 = smoke, 2 = ground dust (fades at its base)
const PUFF_VERT = /* glsl */`
${NOISE_GLSL}
attribute vec4 aState;   // age01, heat, seed, kind
attribute vec4 aLook;    // opacity, noise clock, lumpiness, emissive gain
attribute vec3 aColor;   // soot / smoke / dust albedo
varying vec4 vState; varying vec4 vLook; varying vec3 vAlb;
varying vec3 vN; varying vec3 vSph; varying vec3 vWorld; varying vec3 vLocal; varying float vDisp;
#include <fog_pars_vertex>
float turb(vec3 p){ float f=abs(snoise(p))*.62; f+=abs(snoise(p*2.07+3.1))*.3; return f; }
float dispAt(vec3 n){ return turb(n*1.35+vec3(aState.z*17.3,aState.z*5.1-aLook.y,aState.z*9.7)); }
void main(){
  vState=aState; vLook=aLook; vAlb=aColor;
  vec3 n=normalize(position);
  float amp=aLook.z;
  float d=dispAt(n);
  vec3 pos=n*(1.+(d-.3)*amp);
  vec3 ta=normalize(cross(n,abs(n.y)<.92?vec3(0.,1.,0.):vec3(1.,0.,0.)));
  vec3 tb=cross(n,ta);
  vec3 na=normalize(n+ta*.08),nb=normalize(n+tb*.08);
  vec3 pa=na*(1.+(dispAt(na)-.3)*amp),pb=nb*(1.+(dispAt(nb)-.3)*amp);
  vec3 nrm=normalize(cross(pa-pos,pb-pos));
  if(dot(nrm,n)<0.)nrm=-nrm;
  vDisp=d; vLocal=n;
  vec4 wp=modelMatrix*instanceMatrix*vec4(pos,1.);
  vWorld=wp.xyz;
  // inverse-transpose of the (orthogonal-axis) instance basis keeps squashed
  // skirts and stretched soil jets correctly lit
  mat3 im=mat3(instanceMatrix);
  mat3 nm=mat3(modelMatrix)*mat3(im[0]/dot(im[0],im[0]),im[1]/dot(im[1],im[1]),im[2]/dot(im[2],im[2]));
  vN=normalize(nm*nrm); vSph=normalize(nm*n);
  vec4 mvPosition=viewMatrix*wp;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`;

const PUFF_FRAG = /* glsl */`
${NOISE_GLSL}
uniform vec3 uSunDir; uniform vec3 uSun; uniform vec3 uSky; uniform vec3 uGround;
varying vec4 vState; varying vec4 vLook; varying vec3 vAlb;
varying vec3 vN; varying vec3 vSph; varying vec3 vWorld; varying vec3 vLocal; varying float vDisp;
#include <fog_pars_fragment>
vec3 blackbody(float t){
  vec3 c=mix(vec3(.18,.012,0.),vec3(.95,.16,.01),smoothstep(0.,.3,t));
  c=mix(c,vec3(1.,.48,.06),smoothstep(.25,.55,t));
  c=mix(c,vec3(1.,.8,.36),smoothstep(.5,.85,t));
  return mix(c,vec3(1.,.97,.86),smoothstep(.85,1.2,t));
}
void main(){
  float age=vState.x, heat=vState.y, kind=vState.w;
  vec3 N=normalize(vN), V=normalize(cameraPosition-vWorld);
  float ndv=clamp(dot(N,V),0.,1.);
  float limb=clamp(dot(normalize(vSph),V),0.,1.);
  vec3 q=vLocal*2.6+vState.z*13.+vec3(0.,-vLook.y*1.4,0.);
  float fine=snoise(q)*.5+.5;
  // lit billow: wrapped sun, sky/ground hemisphere, darker in the folds
  float wrap=clamp(dot(N,uSunDir)*.55+.45,0.,1.);
  float fold=mix(.5,1.,smoothstep(.06,.5,vDisp));
  float self=mix(.62,1.,smoothstep(-.9,.7,vLocal.y));
  vec3 light=(uSun*wrap*fold*self+mix(uGround,uSky,N.y*.5+.5)*mix(.75,1.,fold))*.3183;
  // thin limbs scatter light instead of reading as black-on-sky
  vec3 col=vAlb*light+uSun*wrap*.04*(1.-limb)*(1.-limb)*vec3(1.,.93,.82);
  float alpha;
  if(kind<.5){
    // fire: hot gas shows in the swelling lumps, the limb and folds go sooty first
    float T=heat*(.78+.22*exp(-age*28.))*(1.-smoothstep(.04,.62,age));
    T+=(vDisp-.28)*.9*heat+(fine-.5)*.42-(1.-ndv)*.32*(.4+age);
    T+=(snoise(q*2.3+7.)*.5)*.12;
    float burn=smoothstep(.04,.3,T);
    vec3 glow=blackbody(clamp(T,0.,1.3))*(.45+3.6*T*T)*vLook.w;
    col=mix(col,glow,burn);
    alpha=mix(.9,1.,burn)*smoothstep(0.,.3,limb);
  } else {
    // smoke and dust: soft limbs, embers glowing up from below while young
    float under=heat*(1.-smoothstep(0.,.07,age))*smoothstep(.2,-.9,vLocal.y)*(.5+fine);
    col+=vec3(1.,.36,.06)*under*2.2;
    alpha=smoothstep(0.,.75,limb)*(.8+fine*.2);
    if(kind>1.5)alpha*=smoothstep(-1.,-.25,vLocal.y)*smoothstep(0.,.95,limb);
  }
  // erosion: thin wisps tear away first as the billow dies
  float th=pow(age,1.5)*1.05;
  alpha*=smoothstep(th-.26,th+.24,fine*.5+vDisp*.75+.18)*(1.-smoothstep(.78,1.,age));
  alpha*=vLook.x;
  // thin out billows that drift right up to the lens instead of blinding it
  alpha*=smoothstep(.8,4.5,length(cameraPosition-vWorld));
  if(alpha<.004)discard;
  gl_FragColor=vec4(col,clamp(alpha,0.,1.));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

class Billows {
  constructor(scene, cap) {
    this.cap = cap;
    this.list = [];
    this.free = [];
    this.geos = [new THREE.IcosahedronGeometry(1, 3), new THREE.IcosahedronGeometry(1, 4)];
    const geo = this.geos[1];
    this.aState = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4);
    this.aLook = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4);
    this.aColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    for (const a of [this.aState, this.aLook, this.aColor]) a.setUsage(THREE.DynamicDrawUsage);
    for (const g of this.geos) {
      g.setAttribute('aState', this.aState);
      g.setAttribute('aLook', this.aLook);
      g.setAttribute('aColor', this.aColor);
    }
    this.uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.3).normalize() },
      uSun: { value: new THREE.Color(2.6, 2.4, 2.1) },
      uSky: { value: new THREE.Color(0.9, 1, 1.1) },
      uGround: { value: new THREE.Color(0.5, 0.48, 0.36) },
    }]);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: PUFF_VERT, fragmentShader: PUFF_FRAG,
      transparent: true, depthWrite: false, fog: true,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.renderOrder = 2;
    scene.add(this.mesh);
    this.order = [];
  }

  setDetail(high) { this.mesh.geometry = this.geos[high ? 1 : 0]; }

  spawn(o) {
    let p;
    if (this.list.length >= this.cap) {
      // full: recycle the billow nearest the end of its life
      let best = 0, bestK = -1;
      for (let i = 0; i < this.list.length; i++) {
        const q = this.list[i], k = q.age / q.life;
        if (k > bestK) { bestK = k; best = i; }
      }
      p = this.list[best];
    } else {
      p = this.free.pop() || {};
      this.list.push(p);
    }
    p.x = o.x; p.y = o.y; p.z = o.z;
    p.vx = o.vx ?? 0; p.vy = o.vy ?? 0; p.vz = o.vz ?? 0;
    p.age = 0; p.life = o.life; p.delay = o.delay ?? 0;
    p.r0 = o.r0; p.r1 = o.r1; p.grow = o.grow ?? 2;
    p.sy = o.sy ?? 1;
    p.st = o.stretch ?? 0; p.ux = 0; p.uy = 1; p.uz = 0;
    p.heat = o.heat ?? 0; p.kind = o.kind ?? 1;
    p.seed = Math.random() * 50;
    p.op = o.opacity ?? 1;
    p.lump = o.lump ?? 0.55;
    p.emit = o.emit ?? 1;
    p.drag = o.drag ?? 1.5; p.buoy = o.buoy ?? 0; p.wind = o.wind ?? 0.6;
    p.roll = o.roll ?? 0.5; p.clock = Math.random() * 10;
    p.floor = o.floor ?? 0.35;
    p.cr = o.color[0]; p.cg = o.color[1]; p.cb = o.color[2];
    p.gy = getHeight(p.x, p.z); p.gyT = 0;
    return p;
  }

  update(dt, cam, wind) {
    const L = this.list;
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.age += dt;
      if (p.age >= p.life) { L[i] = L[L.length - 1]; L.pop(); this.free.push(p); continue; }
      const dr = Math.exp(-p.drag * dt);
      p.vx = p.vx * dr + wind.x * p.wind * dt;
      p.vz = p.vz * dr + wind.z * p.wind * dt;
      p.vy = p.vy * dr + p.buoy * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.clock += p.roll * dt;
      if ((p.gyT -= dt) <= 0) { p.gy = getHeight(p.x, p.z); p.gyT = 0.25; }
      p.r = p.r0 + (p.r1 - p.r0) * (1 - Math.exp(-p.age * p.grow));
      const lo = p.gy + p.r * p.sy * p.floor;
      if (p.y < lo) { p.y = lo; if (p.vy < 0) p.vy *= -0.2; }
    }
    // back-to-front so the layered billows blend correctly
    const order = this.order;
    order.length = 0;
    const cx = cam.position.x, cy = cam.position.y, cz = cam.position.z;
    for (const p of L) {
      if (p.delay > 0) continue;
      p.d2 = (p.x - cx) ** 2 + (p.y - cy) ** 2 + (p.z - cz) ** 2;
      order.push(p);
    }
    order.sort((a, b) => b.d2 - a.d2);
    const m = this.mesh.instanceMatrix.array, st = this.aState.array, lk = this.aLook.array, co = this.aColor.array;
    for (let i = 0; i < order.length; i++) {
      const p = order[i], r = p.r, k = i * 16;
      if (p.st > 0) {
        // thrown soil: stretched along its flight, rounding off as it slows
        const sp = Math.hypot(p.vx, p.vy, p.vz);
        if (sp > 0.4) { p.ux = p.vx / sp; p.uy = p.vy / sp; p.uz = p.vz / sp; }
        const L = r * (1 + Math.min(3.2, sp * p.st));
        let ax = p.uy, ay = -p.ux, az = 0;              // u x Z
        let al = Math.hypot(ax, ay, az);
        if (al < 0.2) { ax = 0; ay = p.uz; az = -p.uy; al = Math.hypot(ay, az); } // u x X
        ax /= al; ay /= al; az /= al;
        const bx = ay * p.uz - az * p.uy, by = az * p.ux - ax * p.uz, bz = ax * p.uy - ay * p.ux;
        m[k] = ax * r; m[k + 1] = ay * r; m[k + 2] = az * r; m[k + 3] = 0;
        m[k + 4] = p.ux * L; m[k + 5] = p.uy * L; m[k + 6] = p.uz * L; m[k + 7] = 0;
        m[k + 8] = bx * r; m[k + 9] = by * r; m[k + 10] = bz * r; m[k + 11] = 0;
      } else {
        m[k] = r; m[k + 1] = 0; m[k + 2] = 0; m[k + 3] = 0;
        m[k + 4] = 0; m[k + 5] = r * p.sy; m[k + 6] = 0; m[k + 7] = 0;
        m[k + 8] = 0; m[k + 9] = 0; m[k + 10] = r; m[k + 11] = 0;
      }
      m[k + 12] = p.x; m[k + 13] = p.y; m[k + 14] = p.z; m[k + 15] = 1;
      const a = p.age / p.life;
      st[i * 4] = a; st[i * 4 + 1] = p.heat; st[i * 4 + 2] = p.seed; st[i * 4 + 3] = p.kind;
      lk[i * 4] = p.op * (p.kind === 0 ? 1 : Math.min(1, p.age / 0.12));
      lk[i * 4 + 1] = p.clock; lk[i * 4 + 2] = p.lump; lk[i * 4 + 3] = p.emit;
      co[i * 3] = p.cr; co[i * 3 + 1] = p.cg; co[i * 3 + 2] = p.cb;
    }
    this.mesh.count = order.length;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.aState.needsUpdate = true;
    this.aLook.needsUpdate = true;
    this.aColor.needsUpdate = true;
  }

  clear() { while (this.list.length) this.free.push(this.list.pop()); this.mesh.count = 0; }
}

// ---------------------------------------------------------------- streaks
// camera-facing ribbons from each particle's tail to its head: white-hot
// sparks (additive) and sprays of thrown earth (alpha)
const STREAK_VERT = /* glsl */`
attribute vec3 aHead; attribute vec3 aTail; attribute vec4 aCol; attribute float aW;
varying vec2 vUv; varying vec4 vCol;
#include <fog_pars_vertex>
void main(){
  vUv=uv; vCol=aCol;
  vec3 dir=aHead-aTail; float len=length(dir);
  vec3 dn=len>1e-4?dir/len:vec3(0.,1.,0.);
  vec3 wp=mix(aTail,aHead,uv.x);
  vec3 side=cross(dn,normalize(cameraPosition-wp));
  float sl=length(side); side=sl>1e-4?side/sl:vec3(1.,0.,0.);
  wp+=side*(uv.y-.5)*aW+dn*(uv.x-.5)*aW;
  vec4 mvPosition=viewMatrix*vec4(wp,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`;
const STREAK_FRAG = /* glsl */`
varying vec2 vUv; varying vec4 vCol;
#include <fog_pars_fragment>
void main(){
  float across=1.-abs(vUv.y-.5)*2.;
  float a=smoothstep(0.,.35,across)*mix(.35,1.,vUv.x);
  gl_FragColor=vec4(vCol.rgb,vCol.a*a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

class Streaks {
  constructor(scene, cap, additive) {
    this.cap = cap;
    this.additive = additive;
    this.n = 0;
    this.d = {
      p: new Float32Array(cap * 3), v: new Float32Array(cap * 3), life: new Float32Array(cap), max: new Float32Array(cap),
      w: new Float32Array(cap), trail: new Float32Array(cap), c: new Float32Array(cap * 4), g: new Float32Array(cap),
      drag: new Float32Array(cap), bounce: new Float32Array(cap), gy: new Float32Array(cap),
    };
    const geo = new THREE.PlaneGeometry(1, 1);
    this.aHead = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    this.aTail = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    this.aCol = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4);
    this.aW = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1);
    for (const a of [this.aHead, this.aTail, this.aCol, this.aW]) a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aHead', this.aHead); geo.setAttribute('aTail', this.aTail);
    geo.setAttribute('aCol', this.aCol); geo.setAttribute('aW', this.aW);
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(THREE.UniformsLib.fog), vertexShader: STREAK_VERT, fragmentShader: STREAK_FRAG,
      transparent: true, depthWrite: false, fog: true, side: THREE.DoubleSide,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.renderOrder = additive ? 3 : 1;
    scene.add(this.mesh);
  }

  emit(x, y, z, vx, vy, vz, life, w, trail, r, g, b, a, grav = -9.8, drag = 0.4, bounce = 0) {
    if (this.n >= this.cap) return;
    const d = this.d, i = this.n++;
    d.p[i * 3] = x; d.p[i * 3 + 1] = y; d.p[i * 3 + 2] = z;
    d.v[i * 3] = vx; d.v[i * 3 + 1] = vy; d.v[i * 3 + 2] = vz;
    d.life[i] = life; d.max[i] = life; d.w[i] = w; d.trail[i] = trail;
    d.c[i * 4] = r; d.c[i * 4 + 1] = g; d.c[i * 4 + 2] = b; d.c[i * 4 + 3] = a;
    d.g[i] = grav; d.drag[i] = drag; d.bounce[i] = bounce; d.gy[i] = getHeight(x, z);
  }

  kill(i) {
    const d = this.d, j = --this.n;
    if (i === j) return;
    for (const k of ['life', 'max', 'w', 'trail', 'g', 'drag', 'bounce', 'gy']) d[k][i] = d[k][j];
    for (let c = 0; c < 3; c++) { d.p[i * 3 + c] = d.p[j * 3 + c]; d.v[i * 3 + c] = d.v[j * 3 + c]; }
    for (let c = 0; c < 4; c++) d.c[i * 4 + c] = d.c[j * 4 + c];
  }

  update(dt) {
    const d = this.d, H = this.aHead.array, T = this.aTail.array, C = this.aCol.array, W = this.aW.array;
    for (let i = this.n - 1; i >= 0; i--) {
      d.life[i] -= dt;
      if (d.life[i] <= 0) { this.kill(i); continue; }
      const k = i * 3, dr = Math.exp(-d.drag[i] * dt);
      d.v[k] *= dr; d.v[k + 2] *= dr; d.v[k + 1] = d.v[k + 1] * dr + d.g[i] * dt;
      d.p[k] += d.v[k] * dt; d.p[k + 1] += d.v[k + 1] * dt; d.p[k + 2] += d.v[k + 2] * dt;
      if (d.p[k + 1] < d.gy[i] + 1.5 && d.v[k + 1] < 0) {
        const gy = getHeight(d.p[k], d.p[k + 2]);
        d.gy[i] = gy;
        if (d.p[k + 1] < gy + 0.03) {
          if (d.bounce[i] > 0) {
            d.p[k + 1] = gy + 0.03;
            d.v[k + 1] = -d.v[k + 1] * d.bounce[i];
            d.v[k] *= 0.55; d.v[k + 2] *= 0.55;
          } else { this.kill(i); continue; }
        }
      }
    }
    for (let i = 0; i < this.n; i++) {
      const k = i * 3, t = d.life[i] / d.max[i], tr = d.trail[i];
      H[k] = d.p[k]; H[k + 1] = d.p[k + 1]; H[k + 2] = d.p[k + 2];
      T[k] = d.p[k] - d.v[k] * tr; T[k + 1] = d.p[k + 1] - d.v[k + 1] * tr; T[k + 2] = d.p[k + 2] - d.v[k + 2] * tr;
      W[i] = d.w[i];
      if (this.additive) {
        // sparks cool from white-yellow to dull red as they die
        const heat = Math.min(1, t * 1.6);
        C[i * 4] = d.c[i * 4] * (0.35 + 0.65 * heat);
        C[i * 4 + 1] = d.c[i * 4 + 1] * heat * heat;
        C[i * 4 + 2] = d.c[i * 4 + 2] * heat * heat * heat;
        C[i * 4 + 3] = Math.min(1, t * 4);
      } else {
        C[i * 4] = d.c[i * 4]; C[i * 4 + 1] = d.c[i * 4 + 1]; C[i * 4 + 2] = d.c[i * 4 + 2];
        C[i * 4 + 3] = d.c[i * 4 + 3] * Math.min(1, t * 3);
      }
    }
    this.mesh.count = this.n;
    this.aHead.needsUpdate = true; this.aTail.needsUpdate = true;
    this.aCol.needsUpdate = true; this.aW.needsUpdate = true;
  }

  clear() { this.n = 0; this.mesh.count = 0; }
}

// ---------------------------------------------------------------- chunks
// tumbling solid fragments: soil clods, concrete, and hot armour shards
// that trail flame and smoke through the effects' point pools
function jaggedGeometry(seed, flat) {
  const g = new THREE.IcosahedronGeometry(0.13, 0);
  const p = g.attributes.position;
  let s = seed;
  const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const moved = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)}|${p.getY(i).toFixed(3)}|${p.getZ(i).toFixed(3)}`;
    if (!moved.has(key)) moved.set(key, 0.55 + rng() * 0.8);
    const k = moved.get(key);
    p.setXYZ(i, p.getX(i) * k * (flat ? 1.7 : 1.2), p.getY(i) * k * (flat ? 0.28 : 0.75), p.getZ(i) * k * (flat ? 1.1 : 1));
  }
  g.computeVertexNormals();
  return g;
}

class Chunks {
  constructor(scene, cap, geo, mat) {
    this.cap = cap;
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = true;
    this.mesh.count = 0;
    const white = new THREE.Color(1, 1, 1);
    for (let i = 0; i < cap; i++) this.mesh.setColorAt(i, white);
    scene.add(this.mesh);
    this.list = [];
    this.dummy = new THREE.Object3D();
    this.col = new THREE.Color();
  }

  emit(x, y, z, vx, vy, vz, size, life, color, trail = 0) {
    if (this.list.length >= this.cap) this.list.shift();
    this.list.push({
      x, y, z, vx, vy, vz, size, life, max: life, trail, settled: false,
      rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
      sx: (Math.random() - 0.5) * 16, sy: (Math.random() - 0.5) * 16, sz: (Math.random() - 0.5) * 16,
      color: color.clone(), gy: getHeight(x, z),
    });
  }

  update(dt, onTrail) {
    const L = this.list, d = this.dummy;
    for (let i = L.length - 1; i >= 0; i--) {
      const c = L[i];
      c.life -= dt;
      if (c.life <= 0) { L.splice(i, 1); continue; }
      if (!c.settled) {
        c.vy -= 22 * dt;
        const dr = Math.exp(-0.25 * dt);
        c.vx *= dr; c.vz *= dr;
        c.x += c.vx * dt; c.y += c.vy * dt; c.z += c.vz * dt;
        c.rx += c.sx * dt; c.ry += c.sy * dt; c.rz += c.sz * dt;
        if (c.y < c.gy + 1.5) c.gy = getHeight(c.x, c.z);
        if (c.y < c.gy + 0.05 * c.size) {
          c.y = c.gy + 0.05 * c.size;
          if (Math.abs(c.vy) < 2.2) { c.settled = true; c.trail = 0; }
          c.vy = Math.abs(c.vy) * 0.28; c.vx *= 0.5; c.vz *= 0.5; c.sx *= 0.5; c.sz *= 0.5;
        }
        if (c.trail && onTrail) onTrail(c, dt);
      }
    }
    for (let i = 0; i < L.length; i++) {
      const c = L[i];
      d.position.set(c.x, c.y, c.z);
      d.rotation.set(c.rx, c.ry, c.rz);
      d.scale.setScalar(c.size * Math.min(1, c.life * 1.2));
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
      this.mesh.setColorAt(i, c.color);
    }
    this.mesh.count = L.length;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  clear() { this.list.length = 0; this.mesh.count = 0; }
}

// ---------------------------------------------------------------- palette
const SOOT = [0.05, 0.045, 0.04];
const SMOKE_DARK = [0.075, 0.07, 0.066];
const SMOKE_GREY = [0.3, 0.29, 0.27];
const CORDITE = [0.46, 0.45, 0.42];
const DUSTY = [0.2, 0.18, 0.155];
const EARTH = [0.24, 0.185, 0.13];
const EARTH_LIGHT = [0.43, 0.36, 0.27];
const CONCRETE = [0.55, 0.53, 0.5];
const _c = new THREE.Color();
const rnd = (a, b) => a + Math.random() * (b - a);

export class Blast {
  constructor(scene, camera, fx) {
    this.scene = scene;
    this.camera = camera;
    this.fx = fx;                  // Effects: point pools, lights, scorch
    this.scale = 1;
    this.billows = new Billows(scene, 240);
    this.sparks = new Streaks(scene, 420, true);
    this.dirt = new Streaks(scene, 520, false);
    const clodMat = new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true });
    this.clods = new Chunks(scene, 160, jaggedGeometry(77, false), clodMat);
    const shardMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.6, flatShading: true });
    this.shards = new Chunks(scene, 56, jaggedGeometry(311, true), shardMat);
    this.wind = new THREE.Vector3(0.9, 0, 0.35);
    this.shocks = [];
    this.fires = [];
    this.queue = [];
    this.time = 0;
  }

  setScale(s) { this.scale = s; this.billows.setDetail(s >= 0.95); }

  // draw one invisible instance of everything on the next frame so their
  // shaders compile behind the title screen, not on the first blast
  prewarm() {
    const z = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const m of [this.billows.mesh, this.sparks.mesh, this.dirt.mesh, this.clods.mesh, this.shards.mesh]) {
      m.setMatrixAt(0, z); m.count = 1; m.instanceMatrix.needsUpdate = true;
    }
    this.warmFrames = 2;
  }

  // sky.sun / sky.hemi drive the smoke lighting so it matches each weather
  setLighting(sun, hemi) {
    const u = this.billows.uniforms;
    u.uSunDir.value.copy(sun.position).sub(sun.target.position).normalize();
    u.uSun.value.copy(sun.color).multiplyScalar(sun.intensity);
    u.uSky.value.copy(hemi.color).multiplyScalar(hemi.intensity);
    u.uGround.value.copy(hemi.groundColor).multiplyScalar(hemi.intensity);
  }

  n(k, min = 1) { return Math.max(min, Math.round(k * this.scale)); }

  // ---- building blocks ----------------------------------------------------
  flash(pos, size) {
    for (let i = 0; i < 2; i++) {
      this.billows.spawn({
        x: pos.x, y: pos.y + 0.2 + i * size * 0.2, z: pos.z, life: 0.07 + i * 0.05, r0: size * 0.3, r1: size * (0.7 + i * 0.3), grow: 30,
        heat: 1.12 - i * 0.12, kind: 0, emit: 1.3, lump: 0.45, drag: 0, color: SOOT, floor: 0.1,
      });
    }
  }

  fireball(pos, size, count, { heat = 0.95, life = 0.8, up = 4, spread = 1, buoy = 6, emit = 1.1, smoke = SMOKE_DARK, smokeLife = 5, smokeN = 1 } = {}) {
    const n = this.n(count, 2);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, el = rnd(0.15, 1.2), sp = rnd(2, 9) * spread * size;
      const vx = Math.cos(a) * Math.cos(el) * sp, vz = Math.sin(a) * Math.cos(el) * sp, vy = Math.sin(el) * sp + up;
      const r = size * rnd(0.55, 1.05);
      this.billows.spawn({
        x: pos.x + (Math.random() - 0.5) * size * 0.6, y: pos.y + rnd(0, 0.6) * size, z: pos.z + (Math.random() - 0.5) * size * 0.6,
        vx, vy, vz, life: life * rnd(0.75, 1.25), r0: r * 0.25, r1: r * 1.6, grow: rnd(4, 7),
        heat: heat * rnd(0.85, 1.05), kind: 0, emit, lump: 0.52, drag: 2.4, buoy, roll: 1.2, color: SOOT, floor: 0.2,
      });
      // the soot each lobe leaves behind keeps billowing upward
      if (Math.random() < smokeN) {
        this.billows.spawn({
          x: pos.x + vx * 0.08, y: pos.y + size * 0.4 + vy * 0.08, z: pos.z + vz * 0.08,
          vx: vx * 0.35, vy: vy * 0.3 + 1, vz: vz * 0.35, delay: life * rnd(0.35, 0.6),
          life: smokeLife * rnd(0.8, 1.25), r0: r * 0.9, r1: r * rnd(1.7, 2.3), grow: rnd(0.6, 1.1),
          heat: 0.7, kind: 1, opacity: 0.92, lump: 0.42, drag: 1.1, buoy: buoy * 0.32, roll: 0.35, wind: 0.9,
          color: smoke, floor: 0.3,
        });
      }
    }
  }

  smokeColumn(pos, size, count, color, { life = 6, rise = 3, buoy = 0.8, opacity = 0.85, delay = 0.1 } = {}) {
    const n = this.n(count);
    for (let i = 0; i < n; i++) {
      const h = i / Math.max(1, n - 1);
      this.billows.spawn({
        x: pos.x + (Math.random() - 0.5) * size, y: pos.y + h * size * 1.2, z: pos.z + (Math.random() - 0.5) * size,
        vx: (Math.random() - 0.5) * 1.5, vy: rise * (0.5 + h), vz: (Math.random() - 0.5) * 1.5,
        delay: delay + h * 0.35 + Math.random() * 0.15, life: life * rnd(0.75, 1.25),
        r0: size * 0.5, r1: size * rnd(1.3, 1.8) * (1 + h * 0.4), grow: rnd(0.5, 0.9),
        kind: 1, opacity, lump: 0.42, drag: 0.8, buoy, roll: 0.3, wind: 1, color, floor: 0.3, heat: 0.4,
      });
    }
  }

  // the earth thrown skyward by a ground burst: dark spikes of soil,
  // a brown dust column, falling clods, and a low skirt racing outward
  earth(pos, size, { jets = 40, column = 4, skirt = 8, clods = 12, height = 1, color = EARTH } = {}) {
    const gy = getHeight(pos.x, pos.z);
    // jets: elongated spikes of soil that arc over, slow, and break up
    // into dust; a spray of fine clumps rides along each one
    const nj = this.n(jets / 5, 4), lift = height * Math.pow(size, 0.35);
    for (let i = 0; i < nj; i++) {
      const a = Math.random() * Math.PI * 2, tilt = Math.pow(Math.random(), 1.2) * 0.85;
      const sp = rnd(10, 17) * lift * (1 - tilt * 0.3);
      const shade = rnd(0.7, 1.15);
      const dx = Math.cos(a) * Math.sin(tilt), dy = Math.cos(tilt), dz = Math.sin(a) * Math.sin(tilt);
      const r = rnd(0.28, 0.5) * Math.sqrt(size);
      this.billows.spawn({
        x: pos.x + dx * 0.4, y: gy + 0.4, z: pos.z + dz * 0.4, vx: dx * sp, vy: dy * sp, vz: dz * sp,
        life: rnd(0.75, 1.05), r0: r * 0.7, r1: r * 2.2, grow: 1.6, stretch: 0.2,
        kind: 1, opacity: 0.97, lump: 0.58, drag: 0.9, buoy: -11, roll: 0.9, wind: 0.4,
        color: [color[0] * shade, color[1] * shade, color[2] * shade], floor: 0.2,
      });
      for (let k = 0; k < 3; k++) {
        const f = rnd(0.55, 1.05);
        this.dirt.emit(pos.x, gy + 0.3, pos.z,
          dx * sp * f + rnd(-1.2, 1.2), dy * sp * f, dz * sp * f + rnd(-1.2, 1.2),
          rnd(1.4, 2.4), rnd(0.07, 0.16) * Math.sqrt(size), rnd(0.03, 0.05),
          color[0] * shade * 0.6, color[1] * shade * 0.6, color[2] * shade * 0.6, 1, -16, 0.3);
      }
    }
    const nc = this.n(column);
    for (let i = 0; i < nc; i++) {
      const h = (i + 1) / nc;
      this.billows.spawn({
        x: pos.x + (Math.random() - 0.5) * size, y: gy + size * 0.5, z: pos.z + (Math.random() - 0.5) * size,
        vx: (Math.random() - 0.5) * 2, vy: rnd(5, 11) * h * height * Math.sqrt(size), vz: (Math.random() - 0.5) * 2,
        delay: Math.random() * 0.08, life: rnd(3.5, 6), r0: size * 0.4, r1: size * rnd(1.3, 2) * (0.7 + h * 0.6), grow: rnd(1.2, 2.2),
        kind: 1, opacity: 0.9, lump: 0.6, drag: 2.2, buoy: -0.6, roll: 0.5, wind: 0.8,
        color: [color[0] * 1.35, color[1] * 1.35, color[2] * 1.35], floor: 0.35, heat: 0.25,
      });
    }
    const ns = this.n(skirt, 3);
    for (let i = 0; i < ns; i++) {
      const a = (i / ns) * Math.PI * 2 + Math.random() * 0.5, sp = rnd(7, 13) * Math.sqrt(size);
      this.billows.spawn({
        x: pos.x + Math.cos(a) * size * 0.6, y: gy + 0.3, z: pos.z + Math.sin(a) * size * 0.6,
        vx: Math.cos(a) * sp, vy: 0.4, vz: Math.sin(a) * sp, life: rnd(2.6, 4.2),
        r0: size * 0.3, r1: size * rnd(1.1, 1.6), grow: rnd(1.4, 2.4), sy: 0.55,
        kind: 2, opacity: 0.5, lump: 0.5, drag: 2.6, buoy: 0.25, roll: 0.4, wind: 1,
        color: EARTH_LIGHT, floor: 0.25,
      });
    }
    const nk = this.n(clods);
    for (let i = 0; i < nk; i++) {
      const a = Math.random() * Math.PI * 2, sp = rnd(3, 9) * Math.sqrt(size), up = rnd(6, 15) * height;
      _c.setRGB(color[0] * rnd(0.7, 1.3) * 1.6, color[1] * rnd(0.8, 1.2) * 1.6, color[2] * 1.6);
      this.clods.emit(pos.x, gy + 0.3, pos.z, Math.cos(a) * sp, up, Math.sin(a) * sp, rnd(0.6, 1.8) * Math.sqrt(size), rnd(4, 7), _c, Math.random() < 0.3 ? 1 : 0);
    }
  }

  sparkBurst(pos, count, speed = 1, { up = 0.5, hot = 1 } = {}) {
    const n = this.n(count * 0.7, 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, el = rnd(-0.1, up) * Math.PI * 0.5, sp = rnd(8, 30) * speed;
      this.sparks.emit(pos.x, pos.y, pos.z,
        Math.cos(a) * Math.cos(el) * sp, Math.sin(el) * sp + 3, Math.sin(a) * Math.cos(el) * sp,
        rnd(0.25, 0.8), rnd(0.025, 0.05), rnd(0.012, 0.025), 4 * hot, 2.1 * hot, 0.7 * hot, 1, -16, 0.6, 0.35);
    }
  }

  shrapnel(pos, count, power, colorHex = 0x2b2a26) {
    const n = this.n(count);
    _c.set(colorHex);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = rnd(5, 16) * power;
      this.shards.emit(pos.x, pos.y + 0.6, pos.z, Math.cos(a) * sp, rnd(6, 16) * power, Math.sin(a) * sp,
        rnd(1.4, 3.2), rnd(5, 9), _c, Math.random() < 0.55 ? 2 : 0);
    }
  }

  shock(pos, strength, speed = 70) {
    this.shocks.push({ x: pos.x, y: pos.y, z: pos.z, t: 0, dur: 0.42 + strength * 0.08, s: strength, speed });
    if (this.shocks.length > 4) this.shocks.shift();
  }

  groundFire(pos, life, size) {
    this.fires.push({ x: pos.x, y: getHeight(pos.x, pos.z), z: pos.z, t: 0, life, size, acc: 0 });
    if (this.fires.length > 10) this.fires.shift();
  }

  later(delay, fn) { this.queue.push({ at: this.time + delay, fn }); }

  // ---- recipes ------------------------------------------------------------
  // kind: he | ap | arty | bomb | rocket | vehicle | fuel | concrete
  // surface: 'ground' (throws earth) or 'metal' (struck armour / props)
  explode(pos, power = 1, kind = 'he', surface = 'ground') {
    const P = Math.max(0.4, power), s = Math.sqrt(P);
    const fx = this.fx;
    const ground = surface === 'ground';
    switch (kind) {
      case 'ap':
        this.flash(pos, 1.0 * s);
        this.fireball(pos, 0.7 * s, 2, { life: 0.45, heat: 1, up: 2, smokeN: 0.6, smoke: SMOKE_GREY, smokeLife: 3.5 });
        if (ground) this.earth(pos, 1.1 * s, { jets: 26, column: 3, skirt: 5, clods: 8, height: 1.15 });
        this.sparkBurst(pos, ground ? 8 : 22, 0.9);
        this.shock(pos, 0.35 * s);
        fx.flashLight(pos, 0xffd08a, 120 * P, 0.1, 18 * P, 0.35);
        break;
      case 'arty':
        this.flash(pos, 2.2 * s);
        this.fireball(pos, 1.5 * s, 5, { life: 0.6, heat: 0.98, up: 4, smokeN: 0.7, smoke: SMOKE_DARK, smokeLife: 6 });
        if (ground) this.earth(pos, 2.1 * s, { jets: 70, column: 6, skirt: 12, clods: 22, height: 1.35 });
        this.smokeColumn(pos, 2 * s, 3, SMOKE_GREY, { life: 7, rise: 2.5 });
        this.sparkBurst(pos, 16, 1.1);
        this.shock(pos, 1.0 * s);
        fx.flashLight(pos, 0xffb75c, 260 * P, 0.14, 50 * P, 0.6);
        break;
      case 'bomb':
        this.flash(pos, 3.4 * s);
        this.fireball(pos, 2.6 * s, 12, { life: 1.25, heat: 1.08, up: 9, spread: 1.2, buoy: 9, emit: 1.25, smokeN: 0.9, smoke: SOOT, smokeLife: 10 });
        if (ground) this.earth(pos, 2.8 * s, { jets: 90, column: 7, skirt: 16, clods: 30, height: 1.6 });
        this.smokeColumn(pos, 3.2 * s, 6, SMOKE_DARK, { life: 11, rise: 6, buoy: 1.4, delay: 0.5 });
        this.sparkBurst(pos, 34, 1.5, { up: 0.9 });
        this.shock(pos, 1.7 * s, 85);
        for (let i = 0; i < 3; i++) this.groundFire({ x: pos.x + rnd(-4, 4) * s, z: pos.z + rnd(-4, 4) * s }, rnd(5, 9), rnd(0.7, 1.2));
        fx.flashLight(pos, 0xffa64a, 520 * P, 0.18, 120 * P, 1.6);
        break;
      case 'rocket':
        this.flash(pos, 1.2 * s);
        this.fireball(pos, 0.8 * s, 3, { life: 0.5, heat: 0.98, up: 2, smokeN: 0.8, smoke: SMOKE_GREY, smokeLife: 4 });
        if (ground) this.earth(pos, 1 * s, { jets: 20, column: 2, skirt: 5, clods: 6 });
        this.sparkBurst(pos, 22, 1.1);
        this.shock(pos, 0.45 * s);
        fx.flashLight(pos, 0xffc070, 150 * P, 0.1, 25 * P, 0.4);
        break;
      case 'fuel':
        this.flash(pos, 2.2 * s);
        this.fireball(pos, 1.9 * s, 9, { life: 1.5, heat: 0.93, up: 7, spread: 0.8, buoy: 10, emit: 1.1, smokeN: 1, smoke: SOOT, smokeLife: 9 });
        this.smokeColumn(pos, 2.2 * s, 4, SOOT, { life: 9, rise: 5, buoy: 1.2, delay: 0.8, opacity: 0.9 });
        this.sparkBurst(pos, 14, 0.9);
        if (ground) this.earth(pos, 1.2 * s, { jets: 16, column: 2, skirt: 8, clods: 6, height: 0.8 });
        this.shock(pos, 0.8 * s);
        for (let i = 0; i < 2; i++) this.groundFire({ x: pos.x + rnd(-2, 2) * s, z: pos.z + rnd(-2, 2) * s }, rnd(6, 10), rnd(0.8, 1.2));
        fx.flashLight(pos, 0xff9d40, 340 * P, 0.15, 110 * P, 1.6);
        break;
      case 'vehicle': {
        // the hull lets go: a fuel-fed fireball, black oil smoke, hot armour
        // shards, an ammunition spark shower and cook-off pops after it
        this.flash(pos, 2.4 * s);
        this.fireball(pos, 1.7 * s, 8, { life: 1.2, heat: 0.98, up: 6, buoy: 8, emit: 1.15, smokeN: 1, smoke: SOOT, smokeLife: 9 });
        this.smokeColumn(pos, 2 * s, 4, SOOT, { life: 10, rise: 4.5, buoy: 1.3, delay: 0.6, opacity: 0.92 });
        this.shrapnel(pos, 12, s);
        this.sparkBurst(pos, 40, 1.3, { up: 1 });
        this.earth(pos, 1.6 * s, { jets: 18, column: 2, skirt: 10, clods: 6, height: 0.7 });
        this.shock(pos, 1.1 * s);
        fx.flashLight(pos, 0xffa64a, 380 * P, 0.16, 120 * P, 1.4);
        const pops = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < pops; i++) {
          this.later(rnd(0.35, 1.7), () => {
            const q = { x: pos.x + rnd(-1, 1), y: pos.y + rnd(0.2, 1), z: pos.z + rnd(-1, 1) };
            this.flash(q, 1.1 * s);
            this.fireball(q, 0.8 * s, 3, { life: 0.6, heat: 1.03, up: 5, buoy: 7, smokeN: 0.6, smoke: SOOT, smokeLife: 5 });
            this.sparkBurst(q, 24, 1, { up: 1 });
            fx.flashLight(q, 0xffb04f, 160 * P, 0.1, 30 * P, 0.4);
            fx.onCookoff?.(q);
          });
        }
        break;
      }
      case 'concrete':
        this.flash(pos, 1.8 * s);
        this.fireball(pos, 1.1 * s, 3, { life: 0.6, heat: 0.93, up: 3, smokeN: 0.5, smoke: SMOKE_GREY });
        this.smokeColumn(pos, 2.4 * s, 6, CONCRETE, { life: 6, rise: 3, buoy: 0.3, opacity: 0.9 });
        this.earth(pos, 1.4 * s, { jets: 30, column: 2, skirt: 12, clods: 0, color: [0.4, 0.39, 0.37] });
        _c.setRGB(0.6, 0.58, 0.55);
        for (let i = 0, n = this.n(18); i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = rnd(3, 10);
          this.clods.emit(pos.x, pos.y + 0.5, pos.z, Math.cos(a) * sp, rnd(4, 12), Math.sin(a) * sp, rnd(1.2, 3), rnd(6, 9), _c, 1);
        }
        this.shock(pos, 1 * s);
        fx.flashLight(pos, 0xffc070, 260 * P, 0.14, 40 * P, 0.5);
        break;
      default: // he
        this.flash(pos, 1.6 * s);
        this.fireball(pos, 1.25 * s, 4, { life: 0.55, heat: 0.93, up: 3, smokeN: 0.8, smoke: DUSTY, smokeLife: 5.5 });
        if (ground) this.earth(pos, 1.5 * s, { jets: 44, column: 4, skirt: 9, clods: 14, height: 1.2 });
        else this.sparkBurst(pos, 22, 1);
        this.smokeColumn(pos, 1.3 * s, 2, ground ? DUSTY : SMOKE_GREY, { life: 5.5, rise: 2 });
        this.sparkBurst(pos, 10, 1);
        this.shock(pos, 0.65 * s);
        fx.flashLight(pos, 0xffbd66, 190 * P, 0.12, 36 * P, 0.5);
    }
  }

  update(dt) {
    if (this.warmFrames > 0) { this.warmFrames--; return; }
    this.time += dt;
    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (this.time >= this.queue[i].at) { const q = this.queue[i]; this.queue.splice(i, 1); q.fn(); }
    }
    // lingering ground fires: small licking flame lobes and a thin smoke trail
    for (let i = this.fires.length - 1; i >= 0; i--) {
      const f = this.fires[i];
      f.t += dt;
      if (f.t >= f.life) { this.fires.splice(i, 1); continue; }
      const k = 1 - f.t / f.life;
      f.acc += dt * (5 + 6 * k) * this.scale;
      while (f.acc >= 1) {
        f.acc -= 1;
        const r = f.size * (0.35 + 0.45 * k) * rnd(0.7, 1.2);
        this.billows.spawn({
          x: f.x + rnd(-0.6, 0.6) * f.size, y: f.y + r * 0.4, z: f.z + rnd(-0.6, 0.6) * f.size,
          vx: rnd(-0.3, 0.3), vy: rnd(1.5, 2.8), vz: rnd(-0.3, 0.3), life: rnd(0.45, 0.75),
          r0: r * 0.6, r1: r, grow: 4, heat: 0.95, kind: 0, emit: 1.1, lump: 0.75, drag: 1, buoy: 3, roll: 2.4, color: SOOT, floor: 0.1,
        });
        if (Math.random() < 0.35) {
          this.billows.spawn({
            x: f.x, y: f.y + r * 1.4, z: f.z, vx: 0, vy: 1.8, vz: 0, life: rnd(3, 5),
            r0: r * 0.6, r1: r * 2.4, grow: 0.8, kind: 1, opacity: 0.6, lump: 0.5, drag: 0.6, buoy: 0.6, roll: 0.3, wind: 1.2, color: SMOKE_DARK, heat: 0.3,
          });
        }
      }
    }
    for (let i = this.shocks.length - 1; i >= 0; i--) {
      const s = this.shocks[i];
      s.t += dt;
      if (s.t >= s.dur) this.shocks.splice(i, 1);
    }
    this.billows.update(dt, this.camera, this.wind);
    this.sparks.update(dt);
    this.dirt.update(dt);
    const fx = this.fx;
    this.clods.update(dt, (c) => {
      if (Math.random() < 0.5) fx.smoke.emit(c.x, c.y, c.z, 0, 0.3, 0, 0.8, 0.5 * c.size, 0.36, 0.3, 0.22, { grow: 2.2, drag: 1, alpha: 0.4 });
    });
    this.shards.update(dt, (c) => {
      fx.fire.emit(c.x, c.y, c.z, 0, 0.5, 0, 0.18, 0.55, 1, 0.6, 0.2, { end: [0.6, 0.12, 0.02], grow: 0.8 });
      if (Math.random() < 0.6) fx.smoke.emit(c.x, c.y, c.z, 0, 0.6, 0, 1.4, 0.7, 0.08, 0.075, 0.07, { grow: 2.8, drag: 0.8, alpha: 0.6 });
    });
  }

  // screen-space shock rings for the grade pass: vec4(u, v, radius, strength)
  shockUniforms(camera, out, aspect) {
    const v = _sv;
    let n = 0;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5);
    for (const s of this.shocks) {
      if (n >= out.length) break;
      v.set(s.x, s.y, s.z).applyMatrix4(camera.matrixWorldInverse);
      const depth = -v.z;
      if (depth < 1) continue;
      v.set(s.x, s.y, s.z).project(camera);
      if (Math.abs(v.x) > 1.6 || Math.abs(v.y) > 1.6) continue;
      const u = s.t / s.dur;
      const rWorld = s.speed * s.t * (1 - u * 0.35);
      const rUv = rWorld / (depth * tanHalf) * 0.5;
      const k = (1 - u) * (1 - u) * s.s * Math.min(1, 40 / depth);
      out[n++].set(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5, rUv, k * 0.012);
    }
    for (let i = n; i < out.length; i++) out[i].set(0, 0, 0, 0);
    return n;
  }

  clear() {
    this.billows.clear(); this.sparks.clear(); this.dirt.clear(); this.clods.clear(); this.shards.clear();
    this.shocks.length = 0; this.fires.length = 0; this.queue.length = 0;
  }
}
const _sv = new THREE.Vector3();

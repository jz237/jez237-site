// Water: a ripple-tank simulation (CPU, follows the camera) drives the surface; the
// meshes sit on layer 1 and are drawn by WaterPass (post.mjs) after the opaque scene,
// sampling its colour and depth for refraction, Beer-Lambert absorption by the real
// path length through the water, screen-space reflections, shoreline foam, ray-marched
// light shafts and parallax silt. setLite(true) falls back to plain alpha blending.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const WATER = 5;
const NX = 256, NZ = 48, CX = 4, CZ = 6;          // ripple cells: 1024 x 288 world units

// ---------------------------------------------------------------- ripple tank
function createRipples(zFront) {
  let a = new Float32Array(NX * NZ), b = new Float32Array(NX * NZ);
  const data = new Uint16Array(NX * NZ);
  const tex = new THREE.DataTexture(data, NX, NZ, THREE.RedFormat, THREE.HalfFloatType);
  tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true;
  const z0 = zFront - NZ * CZ;                        // row 0 is the far edge, row NZ-1 the glass
  let x0 = 0, acc = 0;
  const C2 = 0.12, DAMP = 0.991;                       // wave speed^2 (cells/step) and loss per step
  // edge taper soaks up waves at the sides and the far edge so the window never echoes
  const taper = new Float32Array(NX * NZ);
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
    const edge = Math.min(1, Math.min(i, NX - 1 - i) / 14) * Math.min(1, j / 10);
    taper[j * NX + i] = 0.92 + 0.08 * edge;
  }
  function shift(n) {                                  // scroll the window by n cells (keeps the waves in place in the world)
    const na = new Float32Array(NX * NZ), nb = new Float32Array(NX * NZ);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const s = i + n; if (s < 0 || s >= NX) continue;
      na[j * NX + i] = a[j * NX + s]; nb[j * NX + i] = b[j * NX + s];
    }
    a = na; b = nb; x0 += n * CX;
  }
  return {
    tex, get x0() { return x0; }, z0, width: NX * CX, depth: NZ * CZ,
    follow(cx) {
      const want = Math.round((cx - NX * CX / 2) / CX);
      const n = want - Math.round(x0 / CX);
      if (Math.abs(n) > NX / 2) { a.fill(0); b.fill(0); x0 = want * CX; } else if (Math.abs(n) >= 8) shift(n);
    },
    drop(x, z, amp, r) {                               // a soft cosine-shaped dent of radius r (world units)
      const ci = (x - x0) / CX, cj = (z - z0) / CZ, ri = r / CX, rj = r / CZ;
      for (let j = Math.max(1, Math.floor(cj - rj)); j <= Math.min(NZ - 2, Math.ceil(cj + rj)); j++)
        for (let i = Math.max(1, Math.floor(ci - ri)); i <= Math.min(NX - 2, Math.ceil(ci + ri)); i++) {
          const d = Math.hypot((i - ci) / ri, (j - cj) / rj); if (d >= 1) continue;
          a[j * NX + i] -= amp * (0.5 + 0.5 * Math.cos(d * Math.PI));
        }
    },
    height(x, z) { const i = Math.round((x - x0) / CX), j = Math.round((z - z0) / CZ); return i < 0 || j < 0 || i >= NX || j >= NZ ? 0 : a[j * NX + i]; },
    step(dt) {
      acc = Math.min(acc + dt, 3 / 60);
      let n = 0;
      while (acc >= 1 / 60) {
        acc -= 1 / 60; n++;
        for (let j = 1; j < NZ - 1; j++) {
          const r = j * NX;
          for (let i = 1; i < NX - 1; i++) {
            const k = r + i;
            const v = (2 - 4 * C2) * a[k] + C2 * (a[k - 1] + a[k + 1] + a[k - NX] + a[k + NX]) - b[k];
            b[k] = v * DAMP * taper[k];
          }
        }
        // the glass row reflects (mirror the row behind it)
        for (let i = 0; i < NX; i++) b[(NZ - 1) * NX + i] = b[(NZ - 2) * NX + i];
        const t = a; a = b; b = t;
      }
      if (n) { for (let k = 0; k < NX * NZ; k++) data[k] = THREE.DataUtils.toHalfFloat(a[k]); tex.needsUpdate = true; }
    },
    clear() { a.fill(0); b.fill(0); },
    dispose() { tex.dispose(); },
  };
}

// ---------------------------------------------------------------- shared GLSL
const COMMON = /* glsl */`
uniform float uTime,uNear,uFar,uLite,uWave;
uniform sampler2D tScene,tDepth,tRip;
uniform vec2 uRes,uRipO,uRipS;
uniform vec3 uAbsorb,uScatter,uSkyTop,uSkyHor,uSunDir,uSunCol,uFogColor,uFoam,uCamFwd;
uniform float uFogNear,uFogFar,uScatK;
uniform mat4 uProj;
float lin(float d){return (uNear*uFar)/((uFar-uNear)*d-uFar)*-1.;}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float rip(vec2 xz){vec2 uv=(xz-uRipO)/uRipS;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return 0.;
  return texture2D(tRip,uv).r*smoothstep(0.,.04,min(min(uv.x,1.-uv.x),uv.y*.5));}
// slow swell: a few long Gerstner-like trains, calm enough for cave water
float swell(vec2 p,float t){return (sin(dot(p,vec2(.061,.027))+t*1.31)*.55+sin(dot(p,vec2(-.037,.052))+t*.97)*.42
  +sin(dot(p,vec2(.13,-.071))+t*2.07)*.16+sin(dot(p,vec2(.021,.11))-t*1.63)*.12)*uWave;}
float surfH(vec2 p,float t){return swell(p,t)+rip(p)*1.1;}
`;

const SURF_VS = /* glsl */`
${COMMON}
varying vec3 vW;
void main(){vec4 w=modelMatrix*vec4(position,1.);w.y+=surfH(w.xz,uTime);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;

const FRONT_VS = /* glsl */`
${COMMON}
attribute float aSurf;attribute float aTop;
varying vec3 vW;varying float vTop;
void main(){vec4 w=modelMatrix*vec4(position,1.);float h=surfH(vec2(w.x,w.z-2.),uTime);
  if(aSurf>.5)w.y+=h;vTop=aTop+h;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;

// fog + output shared by both fragment shaders
const FINISH = /* glsl */`
vec3 fogIt(vec3 c,float d){return mix(c,uFogColor,smoothstep(uFogNear,uFogFar,d));}
`;

const SURF_FS = /* glsl */`
${COMMON}${FINISH}
varying vec3 vW;
vec3 nrm(vec2 p){float e=1.5,t=uTime;
  float hx=surfH(p+vec2(e,0.),t)-surfH(p-vec2(e,0.),t)+(rip(p+vec2(e,0.))-rip(p-vec2(e,0.)))*1.6;
  float hz=surfH(p+vec2(0.,e),t)-surfH(p-vec2(0.,e),t)+(rip(p+vec2(0.,e))-rip(p-vec2(0.,e)))*1.6;
  // two scrolling detail layers (capillary chop)
  vec2 q=p*.09;float d1=vnoise(q+vec2(t*.21,t*.13)),d2=vnoise(q*2.3-vec2(t*.17,-t*.29));
  vec2 g=vec2(vnoise(q+vec2(.05,0.)+vec2(t*.21,t*.13))-d1,vnoise(q+vec2(0.,.05)+vec2(t*.21,t*.13))-d1)*7.
        +vec2(vnoise(q*2.3+vec2(.05,0.)-vec2(t*.17,-t*.29))-d2,vnoise(q*2.3+vec2(0.,.05)-vec2(t*.17,-t*.29))-d2)*4.;
  return normalize(vec3(-hx/(2.*e)-g.x*.35,1.,-hz/(2.*e)-g.y*.35));}
vec3 sky(vec3 r){return mix(uSkyHor,uSkyTop,smoothstep(-.05,.6,r.y));}
vec4 ssr(vec3 Pw,vec3 Nw){
  vec3 P=(viewMatrix*vec4(Pw,1.)).xyz,N=normalize((viewMatrix*vec4(Nw,0.)).xyz);
  vec3 R=normalize(reflect(normalize(P),N));
  float s=3.,prevD=0.;vec3 q=P;
  for(int i=0;i<SSR_STEPS;i++){
    q+=R*s;s*=1.22;
    vec4 c=uProj*vec4(q,1.);vec2 uv=c.xy/c.w*.5+.5;
    if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.||c.w<0.)break;
    float sd=lin(texture2D(tDepth,uv).r),qd=-q.z;
    if(qd>sd+.4&&qd<sd+s*1.6+12.){
      // refine between the last two samples
      vec3 lo=q-R*s/1.22,hi=q;
      for(int k=0;k<4;k++){vec3 m=(lo+hi)*.5;vec4 cm=uProj*vec4(m,1.);vec2 um=cm.xy/cm.w*.5+.5;
        if(-m.z>lin(texture2D(tDepth,um).r))hi=m;else lo=m;}
      vec4 ch=uProj*vec4(hi,1.);vec2 uh=ch.xy/ch.w*.5+.5;
      vec2 ed=min(uh,1.-uh);float fade=smoothstep(0.,.08,min(ed.x,ed.y))*(1.-float(i)/float(SSR_STEPS));
      return vec4(texture2D(tScene,uh).rgb,fade);}
  }
  return vec4(0.);}
void main(){
  vec3 n=nrm(vW.xz);vec3 V=normalize(cameraPosition-vW);float dMe=length(cameraPosition-vW);
#ifdef LITE
  float F=.02+.98*pow(1.-max(dot(n,V),0.),5.);vec3 H=normalize(uSunDir+V);
  vec3 c=mix(uScatter*.8,sky(reflect(-V,n)),F)+uSunCol*pow(max(dot(n,H),0.),300.)*4.;
  gl_FragColor=vec4(fogIt(c,dMe),.72+F*.25);return;
#else
  vec2 suv=gl_FragCoord.xy/uRes;float zMe=lin(gl_FragCoord.z),zS=lin(texture2D(tDepth,suv).r);
  if(zS<zMe-.3)discard;
  float NdV=max(dot(n,V),0.);float F=.02+.98*pow(1.-NdV,5.);
  // refraction: bend by the slope, more where the water is deep, never pull in what's in front
  vec2 off=vec2(n.x,-n.z)*.045*clamp((zS-zMe)/50.,0.,1.);
  vec2 ruv=suv+off;float zR=lin(texture2D(tDepth,ruv).r);if(zR<zMe){ruv=suv;zR=zS;}
  vec3 refr=texture2D(tScene,ruv).rgb;
  float thick=max(0.,zR-zMe)/max(.2,dot(normalize(vW-cameraPosition),uCamFwd));
  vec3 below=refr*exp(-uAbsorb*thick*1.6)+uScatter*(1.-exp(-thick*uScatK));
  vec4 r=ssr(vW,n);vec3 refl=mix(sky(reflect(-V,n)),r.rgb,r.a);
  vec3 H=normalize(uSunDir+V);float spec=pow(max(dot(n,H),0.),520.)*14.+pow(max(dot(n,H),0.),60.)*.25;
  // foam: where the surface meets something (shore, a wading trooper) and on fresh ripple crests
  float shore=1.-smoothstep(0.,7.,thick);float crest=smoothstep(.55,1.3,abs(rip(vW.xz)));
  float lace=smoothstep(.45,.75,vnoise(vW.xz*.22+vec2(uTime*.4,-uTime*.25))*.6+vnoise(vW.xz*.6-uTime*.3)*.4);
  float foam=clamp(shore*(.35+lace*.9)+crest*lace,0.,1.);
  vec3 c=mix(below,refl,F)+uSunCol*spec*(1.-foam);
  c=mix(c,uFoam,foam*.75);
  gl_FragColor=vec4(fogIt(c,dMe),1.);
#endif
}`;

const FRONT_FS = /* glsl */`
${COMMON}${FINISH}
varying vec3 vW;varying float vTop;
// light shafts falling from the surface: slanted bands that drift and shimmer
float shaft(vec2 p,float t){float x=p.x+p.y*.42;
  float a=vnoise(vec2(x*.022+t*.05,t*.07))*.6+vnoise(vec2(x*.061-t*.09,t*.11))*.4;return smoothstep(.38,.85,a)*.8;}
void main(){
  float below=max(0.,vTop-vW.y);float dMe=length(cameraPosition-vW);
  vec3 Ld=exp(-uAbsorb*below*1.5)*exp(-below*.005);    // daylight left after sinking this far
#ifdef LITE
  float rays=shaft(vW.xy,uTime)*exp(-below*.012);
  vec3 c=uScatter*(.55+.45*Ld)+uSunCol*rays*.06;
  float a=.5+.35*(1.-exp(-below*.02));
  float men=smoothstep(2.,0.,below);c+=uFoam*men*.6;
  gl_FragColor=vec4(fogIt(c,dMe),a+men*.3);return;
#else
  vec2 suv=gl_FragCoord.xy/uRes;float zMe=lin(gl_FragCoord.z),zS=lin(texture2D(tDepth,suv).r);
  if(zS<zMe-.3)discard;
  float t=uTime;
  // gentle shimmer everywhere, stronger right under the moving surface
  float near=exp(-below*.08);
  vec2 off=(vec2(vnoise(vW.xy*.045+vec2(t*.35,0.)),vnoise(vW.yx*.05-vec2(0.,t*.3)))-.5)*(.004+.01*near);
  off.x+=(rip(vec2(vW.x,vW.z-6.))-rip(vec2(vW.x-6.,vW.z-6.)))*.02*near;
  vec2 ruv=suv+off;float zR=lin(texture2D(tDepth,ruv).r);if(zR<zMe){ruv=suv;zR=zS;}
  vec3 bg=texture2D(tScene,ruv).rgb;
  vec3 dir=normalize(vW-cameraPosition);float cosA=max(.2,dot(dir,uCamFwd));
  float thick=max(0.,zR-zMe)/cosA;
  vec3 Tr=exp(-uAbsorb*thick);
  vec3 c=bg*Tr*mix(vec3(1.),Ld,.7)+uScatter*Ld*(1.-exp(-thick*uScatK));
  // ray-marched shafts and silt: fixed depth slices behind the glass, so motes keep their place and parallax
  float acc=0.,silt=0.,dz=max(.25,-dir.z);
  for(int i=0;i<SHAFT_STEPS;i++){
    float L=(float(i)+1.)*(260./float(SHAFT_STEPS))/dz;   // path length to slice i
    if(L>thick)break;
    vec3 p=vW+dir*L;float bl=max(0.,vTop-p.y);
    float att=exp(-uAbsorb.g*(L+bl)*1.1);
    acc+=shaft(p.xy,t)*exp(-bl*.018)*att;
    vec2 g=p.xy*.12+vec2(t*.06,t*.035)+float(i)*7.31;vec2 cell=floor(g),fr=fract(g)-.5;
    float h=hash(cell);vec2 at=vec2(h-.5,fract(h*13.)-.5)*.6+vec2(sin(t*.7+h*20.),cos(t*.5+h*9.))*.08;
    silt+=step(.86,h)*smoothstep(.11,.02,length(fr-at))*(.25+.75*fract(h*71.3))*att*exp(-bl*.008);
  }
  c+=uSunCol*vec3(.32,.78,.72)*acc*(1.5/float(SHAFT_STEPS))+uFoam*silt*.75;
  // the waterline: a bright meniscus, then a silvery band of total internal reflection just under it
  float men=smoothstep(1.6,0.,below);float tir=smoothstep(0.,2.,below)*smoothstep(9.,3.,below);
  c=mix(c,uSkyHor*.9+uFoam*.15,tir*.35)+uFoam*men*.7;
  gl_FragColor=vec4(fogIt(c,dMe),1.);
#endif
}`;

// ---------------------------------------------------------------- build
export function buildWater(level, theme, tileAt, zFar, quality, T, zFront) {
  const cols = level.cols, rows = level.rows, group = new THREE.Group();
  const zGlass = zFront + 1.5;
  const surfaceRow = (tx, ty) => { while (ty > 0 && tileAt(tx, ty - 1) === WATER) ty--; return ty; };
  const surfaceY = (ty) => -ty * T - 3;
  const vaults = theme.key === 'vaults';
  const sun = new THREE.Vector3(...theme.sun.dir).normalize();
  const ripples = createRipples(zGlass);
  const U = {
    uTime: { value: 0 }, uNear: { value: 8 }, uFar: { value: 14000 }, uLite: { value: 0 }, uWave: { value: vaults ? 0.55 : 0.9 },
    tScene: { value: null }, tDepth: { value: null }, tRip: { value: ripples.tex },
    uRes: { value: new THREE.Vector2(1, 1) }, uRipO: { value: new THREE.Vector2(0, ripples.z0) }, uRipS: { value: new THREE.Vector2(ripples.width, ripples.depth) },
    // per unit absorption (1 unit ~ 6 cm): red goes first, then green; a little green silt scatters back
    uAbsorb: { value: vaults ? new THREE.Vector3(0.026, 0.0068, 0.0082) : new THREE.Vector3(0.022, 0.0055, 0.0035) },
    uScatter: { value: new THREE.Color(vaults ? '#0d5b5a' : '#1d5f86').multiplyScalar(vaults ? 0.55 : 0.7) },
    uScatK: { value: 0.016 },
    uSkyTop: { value: new THREE.Color(vaults ? '#0a1c22' : theme.sky.zenith) }, uSkyHor: { value: new THREE.Color(vaults ? '#2a6a6c' : theme.sky.horizon) },
    uSunDir: { value: sun }, uSunCol: { value: new THREE.Color(theme.sun.color).multiplyScalar(vaults ? 1.6 : 2.4) },
    uFoam: { value: new THREE.Color(vaults ? '#bff4ec' : '#eef8ff') },
    uFogColor: { value: new THREE.Color(theme.fog.color) }, uFogNear: { value: theme.fog.near }, uFogFar: { value: theme.fog.far },
    uCamFwd: { value: new THREE.Vector3(0, 0, -1) }, uProj: { value: new THREE.Matrix4() },
  };
  const defines = { SSR_STEPS: quality === 'low' ? 10 : 22, SHAFT_STEPS: quality === 'low' ? 3 : quality === 'high' ? 5 : 7 };
  const mk = (vs, fs) => new THREE.ShaderMaterial({ uniforms: U, defines: { ...defines }, vertexShader: vs, fragmentShader: fs, side: THREE.DoubleSide });
  const surf = mk(SURF_VS, SURF_FS), front = mk(FRONT_VS, FRONT_FS);
  front.side = THREE.FrontSide;

  // geometry: a horizontal sheet per run of surface tiles, a vertical "glass" per run of water tiles
  const surfGeos = [], frontGeos = [], surfaces = [];
  const zs = [zGlass, 24, 20, 15, 9, 2, -6, -16, -30, -48, -72, -105, -150, -210, -280].filter(z => z > zFar);
  zs.push(zFar);
  for (let ty = 0; ty < rows; ty++) {
    let tx = 0;
    while (tx < cols) {
      if (tileAt(tx, ty) !== WATER) { tx++; continue; }
      let e = tx; while (e < cols && tileAt(e, ty) === WATER) e++;
      // glass: subdivided along x so the top edge can ride the waves
      const x0 = tx * T, x1 = e * T, nseg = Math.max(1, Math.round((x1 - x0) / 4));
      const pos = [], surfA = [], topA = [], idx = [];
      const isTopRow = (x) => tileAt(Math.min(e - 1, Math.max(tx, Math.floor((x - 0.01) / T))), ty - 1) !== WATER;
      for (let i = 0; i <= nseg; i++) {
        const x = x0 + (x1 - x0) * i / nseg, col = Math.min(e - 1, Math.max(tx, Math.floor((x - 0.01) / T)));
        const top = surfaceY(surfaceRow(col, ty)), atSurf = isTopRow(x);
        const yTop = atSurf ? surfaceY(ty) : -ty * T, yBot = -(ty + 1) * T;
        pos.push(x, yTop, zGlass, x, yBot, zGlass); surfA.push(atSurf ? 1 : 0, 0); topA.push(top, top);
        if (i < nseg) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 2, k + 1, k + 3); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('aSurf', new THREE.Float32BufferAttribute(surfA, 1)); g.setAttribute('aTop', new THREE.Float32BufferAttribute(topA, 1));
      g.setIndex(idx); frontGeos.push(g);
      // surface sheets where the tile above is open
      let sx = tx;
      while (sx < e) {
        if (tileAt(sx, ty - 1) === WATER) { sx++; continue; }
        let se = sx; while (se < e && tileAt(se, ty - 1) !== WATER) se++;
        const ys = surfaceY(ty), w0 = sx * T, w1 = se * T, nx = Math.max(1, Math.round((w1 - w0) / (quality === 'low' ? 8 : 5)));
        const p = [], ix = [];
        for (let j = 0; j < zs.length; j++) for (let i = 0; i <= nx; i++) p.push(w0 + (w1 - w0) * i / nx, ys, zs[j]);
        for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + nx + 1; ix.push(a, b, a + 1, a + 1, b, b + 1); }
        const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); sg.setIndex(ix); surfGeos.push(sg);
        surfaces.push({ x0: w0, x1: w1, y: ys });
        sx = se;
      }
      tx = e;
    }
  }
  if (!surfGeos.length && !frontGeos.length) { ripples.dispose(); surf.dispose(); front.dispose(); return null; }
  const meshes = [];
  if (frontGeos.length) { const m = new THREE.Mesh(mergeGeometries(frontGeos), front); m.renderOrder = 3; meshes.push(m); }
  if (surfGeos.length) { const m = new THREE.Mesh(mergeGeometries(surfGeos), surf); m.renderOrder = 2; meshes.push(m); }
  frontGeos.concat(surfGeos).forEach(g => g.dispose());
  for (const m of meshes) { m.layers.set(1); m.frustumCulled = false; group.add(m); }

  // where is open water at this x? (the surface sheet, if any)
  const surfaceAt = (x) => { for (const s of surfaces) if (x >= s.x0 && x <= s.x1) return s; return null; };
  const prevY = new WeakMap();
  let dripT = 0.5, swimT = 0, lite = false;
  const api = {
    group, uniforms: U, ripples, surfaces, surfaceAt, onEvent: null,
    // something hit the water at game coords (x, y: down positive)
    splash(x, y, strength = 1) { const s = surfaceAt(x); if (!s || Math.abs(-y - s.y) > 40) return false; ripples.drop(x, 0, 2.2 * strength, 9 + 7 * strength); ripples.drop(x, -10, 1.2 * strength, 12 * strength); return true; },
    update(t, dt, s, camera, viewX, Wv) {
      U.uTime.value = t;
      U.uNear.value = camera.near; U.uFar.value = camera.far; U.uProj.value.copy(camera.projectionMatrix);
      camera.getWorldDirection(U.uCamFwd.value);
      ripples.follow(viewX + Wv / 2); U.uRipO.value.set(ripples.x0, ripples.z0);
      if (dt > 0 && s) {
        const p = s.player, fire = (k, x, y, a) => api.onEvent && api.onEvent(k, x, y, a);
        // the trooper paddling along the top leaves a wake; diving or surfacing is handled by the splash event
        const cx = p.x + p.w / 2, sf = surfaceAt(cx);
        if (sf && p.inWater && !p.dead && Math.abs(-(p.y) - sf.y) < 16) {
          swimT -= dt;
          const sp = Math.abs(p.vx) + Math.abs(p.vy) * .5;
          if (swimT <= 0 && sp > 25) { ripples.drop(cx - Math.sign(p.vx) * 6, 0, .55, 7); swimT = .11; if (Math.random() < .35) fire('stroke', cx, -sf.y, .5); }
        }
        // shots and swimmers crossing the surface
        const cross = (o, x, y, a, k) => { const py = prevY.get(o); prevY.set(o, y); if (py == null) return; const sfc = surfaceAt(x); if (!sfc) return;
          const yy = -sfc.y; if ((py - yy) * (y - yy) < 0) { ripples.drop(x, 0, a, 6 + a * 4); fire(k, x, yy, a); } };
        for (const q of s.pshots) cross(q, q.x, q.y, .7, 'plip');
        for (const q of s.eshots) cross(q, q.x, q.y, .6, 'plip');
        for (const e of s.enemies) if (e.alive) cross(e, e.x + e.w / 2, e.y + e.h / 2, 1.1, 'splash');
        // drips from the cave roof onto the open water in view
        if (vaults) {
          dripT -= dt;
          if (dripT <= 0) {
            dripT = .35 + Math.random() * 1.2;
            const vis = surfaces.filter(q => q.x1 > viewX && q.x0 < viewX + Wv);
            if (vis.length) { const q = vis[(Math.random() * vis.length) | 0], x = Math.max(q.x0, Math.min(q.x1, viewX + Math.random() * Wv)), z = -10 - Math.random() * 150;
              if (x >= q.x0 && x <= q.x1) { ripples.drop(x, z, .9, 5); if (z > -60) fire('drip', x, -q.y, .4 + (z + 60) / 120); } }
          }
        }
      }
      ripples.step(dt);
    },
    setSize(w, h) { U.uRes.value.set(w, h); },
    setLite(on) {
      if (on === lite) return; lite = on;
      for (const m of [surf, front]) { if (on) m.defines.LITE = 1; else delete m.defines.LITE; m.transparent = on; m.depthWrite = !on; m.needsUpdate = true; }
    },
    dispose() { surf.dispose(); front.dispose(); ripples.dispose(); },
  };
  return api;
}

// ---------------------------------------------------------------- waterfalls
// A ribbon of falling water: stretched flow noise in two speeds, a ragged lip, mist where it lands.
export function waterfall(d, theme, T) {
  const x = d.tx * T + T / 2, top = -d.topTy * T + 6, bot = -(d.botTy + 1) * T - 90, h = top - bot;
  const uniforms = { uTime: { value: 0 }, uColor: { value: new THREE.Color(theme.key === 'mesa' ? '#cfeeff' : '#aff') }, uH: { value: h } };
  const mat = new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.x+=sin(uv.y*9.+uTime*3.)*.6*(1.-uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uTime,uH;uniform vec3 uColor;
      float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
      void main(){float fall=1.-vUv.y;float sp=uH/60.;
        vec2 p1=vec2(vUv.x*9.,vUv.y*sp*.9+uTime*3.2),p2=vec2(vUv.x*17.+3.,vUv.y*sp*1.6+uTime*5.1);
        float streak=n(p1)*.55+n(p2)*.45;streak=smoothstep(.35,.95,streak);
        float edge=smoothstep(0.,.18+.1*n(vec2(vUv.y*sp*3.+uTime*4.,1.)),vUv.x)*smoothstep(1.,.82-.1*n(vec2(vUv.y*sp*3.+uTime*4.,7.)),vUv.x);
        float sheet=.28+.35*(1.-fall)+streak*.9;
        float lip=smoothstep(.93,1.,vUv.y)*.8;float foam=smoothstep(.16,0.,vUv.y)*(.7+.5*n(vec2(vUv.x*12.,uTime*6.)));
        float a=edge*(sheet*.42+foam*.6+lip*.4);
        gl_FragColor=vec4(uColor*(sheet+foam*1.4+lip),1.)*a;}`});
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(28, h, 6, 24), mat); mesh.position.set(x, bot + h / 2, -40);
  return { mesh, mat, x, top, bot };
}

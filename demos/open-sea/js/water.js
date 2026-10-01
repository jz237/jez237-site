// Ocean surface: camera-centred geometry clipmap displaced by the FFT cascades, shaded per pixel.
import { gl, Program, defineChunk } from './gl.js';
import { WHIRLPOOL_GLSL, VORTEX_PATCH } from './whirlpool.js';
import { HULL_WATER_GLSL } from './hull-water.js';
import './fx.js';
import './glsl.js';
defineChunk('whirlpool',WHIRLPOOL_GLSL);
defineChunk('hull-water',HULL_WATER_GLSL);

export const CLIP_M = 48;          // half-extent in cells per level
export const CLIP_LEVELS = 14;
export const CLIP_S0 = 0.2;        // finest cell size (m)

const WATER_VS = `
#include <common>
#include <wake>
#include <water.uv>
#include <whirlpool>
#include <hull-water>
#include <deck-wash>
layout(location = 0) in vec2 aGrid;
uniform mat4 uVP;
uniform vec2 uCenterRel;   // level centre relative to the camera (xz)
uniform float uSpacing, uCamY;
uniform sampler2DArray uDisp;
uniform float uGridN;      // texture size N
uniform vec4 uWake;        // reserved
uniform vec4 uWhaleRings[2]; // camera-relative centre, radius, bounded strength
uniform float uVortexPatch;
uniform vec2 uCameraXZ;
out vec3 vRel;
out vec2 vG;
out float vJ;
out vec2 vD;
out float vHullRunup;
vec4 waveDisplacement(vec2 g,float spacing,float morph){
  vec4 D=vec4(0.0);
  for(int i=0;i<5;i++){
    if(i>=uCascades)break;
    float lod=max(log2(spacing*(1.0+morph)*1.2/(uCasc[i].w/uGridN)),0.0);
    vec4 d=textureLod(uDisp,vec3(cascUV(i,g),float(i)),lod);
    vec2 dw=toWorld(d.xz,i);D+=vec4(dw.x,d.y,dw.y,d.w);
  }
  return D;
}
vec3 clipVertex(vec2 grid,float spacing,vec2 center){
  float k=smoothstep(.72,1.0,max(abs(grid.x),abs(grid.y))/${CLIP_M.toFixed(1)});
  return vec3(center+(grid+mod(grid,2.0)*k)*spacing,k);
}
float cross2(vec2 a,vec2 b){return a.x*b.y-a.y*b.x;}
vec3 bary(vec2 p,vec2 a,vec2 b,vec2 c){
  float area=cross2(b-a,c-a);if(abs(area)<.000001)return vec3(-2.0);
  return vec3(cross2(b-p,c-p),cross2(c-p,a-p),cross2(a-p,b-p))/area;
}
vec4 surroundingClipmap(vec2 p){
  float spacing=.2;vec2 center=vec2(0.0);
  for(int l=0;l<14;l++){
    center=floor(uCameraXZ/(2.0*spacing)+.5)*(2.0*spacing)-uCameraXZ;
    if(max(abs(p.x-center.x),abs(p.y-center.y))<=${CLIP_M.toFixed(1)}*spacing)break;
    spacing*=2.0;
  }
  vec2 grid=floor((p-center)/spacing);
  for(int it=0;it<2;it++){
    vec3 a=clipVertex(grid,spacing,center);
    if(p.x<a.x)grid.x-=1.0;if(p.y<a.y)grid.y-=1.0;
  }
  vec3 a=clipVertex(grid,spacing,center),b=clipVertex(grid+vec2(1,0),spacing,center);
  vec3 c=clipVertex(grid+vec2(0,1),spacing,center),d=clipVertex(grid+vec2(1,1),spacing,center);
  vec3 weights=bary(p,a.xy,c.xy,b.xy);
  vec4 A=waveDisplacement(a.xy-uCenterRel,spacing,a.z),B=waveDisplacement(b.xy-uCenterRel,spacing,b.z);
  vec4 C=waveDisplacement(c.xy-uCenterRel,spacing,c.z),D=waveDisplacement(d.xy-uCenterRel,spacing,d.z);
  if(min(min(weights.x,weights.y),weights.z)>=-.0001)return A*weights.x+C*weights.y+B*weights.z;
  weights=bary(p,b.xy,c.xy,d.xy);
  if(weights.x<=-1.99&&weights.y<=-1.99&&weights.z<=-1.99)return waveDisplacement(p-uCenterRel,spacing,1.0);
  return B*weights.x+C*weights.y+D*weights.z;
}
void main() {
  // geo-morph: odd lattice vertices slide onto the coarser lattice near the level's outer edge
  vec2 gi = aGrid;
  float e = max(abs(gi.x), abs(gi.y)) / ${CLIP_M.toFixed(1)};
  float k = smoothstep(0.72, 1.0, e);
  if(uVortexPatch>.5)k=0.0;
  vec2 odd = mod(gi, 2.0);          // 0 or 1 (aGrid may be negative; mod keeps [0,2))
  gi += odd * k;
  vec2 g = gi * uSpacing;
  vec3 D = vec3(0.0);
  float J = 0.0;
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    float texel = uCasc[i].w / uGridN;
    float lod = max(log2(uSpacing * (1.0 + k) * 1.2 / texel), 0.0);
    vec4 d = textureLod(uDisp, vec3(cascUV(i, g), float(i)), lod);
    vec2 dw = toWorld(d.xz, i);
    D += vec3(dw.x, d.y, dw.y);
    J += d.w;
  }
  if(uVortexPatch>.5){
    float seam=smoothstep(470.0,580.0,length(g));
    if(seam>0.0){
      vec4 matched=surroundingClipmap(uCenterRel+g);
      D=mix(D,matched.xyz,seam);J=mix(J,matched.w,seam);
    }
  }
  vec3 rel = vec3(uCenterRel.x + g.x + D.x, D.y - uCamY, uCenterRel.y + g.y + D.z);
  // ship wake (long components only; the fragment stage adds the finer ripples)
  // same term count on every level (a per-level count made the rings disagree, leaving cracks at their seams); fades with distance
  float wfade = 1.0 - smoothstep(120.0, 300.0, length(rel.xz));
  if (wfade > 0.0) rel.y += kelvinWake(rel.xz, 16).x * wfade;
  for(int i=0;i<2;i++){
    if(uWhaleRings[i].w<=.001)continue;
    float r=length(rel.xz-uWhaleRings[i].xy),d=r-uWhaleRings[i].z;
    rel.y+=sin(d*2.1)*exp(-d*d*.08)*uWhaleRings[i].w*.065;
  }
  rel.y+=whirlSurface(rel.xz).x;
  vHullRunup=hullRunup(rel);rel.y+=vHullRunup;
  float r2 = dot(rel.xz, rel.xz);
  rel.y -= r2 / (2.0 * 6371000.0);
  vRel = rel; vG = g; vJ = J; vD = D.xz;
  gl_Position = uVP * vec4(rel, 1.0);
}`;

defineChunk('water.uv', `
uniform int uCascades;
uniform vec2 uCen[5];
uniform vec4 uCasc[5];
uniform vec2 uNoiseOrg;    // level centre in the cascade-1 frame (metres, unwrapped)
vec2 cascUV(int i, vec2 g) {
  vec4 c = uCasc[i];
  vec2 uv = uCen[i] + vec2(c.y * g.x + c.z * g.y, -c.z * g.x + c.y * g.y) * c.x;
  if (i >= 2) {
    // smooth low-frequency warp of the finest cascades breaks up the visible repetition of their tiles
    vec4 c1 = uCasc[1];
    vec2 a = uNoiseOrg + vec2(c1.y * g.x + c1.z * g.y, -c1.z * g.x + c1.y * g.y);
    float sc = i == 2 ? 330.0 : (i == 3 ? 130.0 : 60.0), amp = i == 2 ? 16.0 : (i == 3 ? 20.0 : 9.0);
    vec2 w = vec2(vnoise(a / sc), vnoise(a / sc + 17.3)) * 2.0 - 1.0;
    uv += w * amp * c.x;
  }
  return uv;
}
vec2 toWorld(vec2 v, int i) { vec4 c = uCasc[i]; return vec2(c.y * v.x - c.z * v.y, c.z * v.x + c.y * v.y); }
`);

defineChunk('foam', `
vec2 worley2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 r = o + hash22(i + o) - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(vec2(d1, d2));
}
// Filament network of bubble-cell walls; fades to its mean when a cell is smaller than a pixel.
float lace(vec2 p, float pxCells) {
  vec2 w = worley2(p);
  float e = w.y - w.x;
  float f = 1.0 - smoothstep(0.0, 0.20 + pxCells * 0.8, e);
  return mix(f, 0.42, smoothstep(0.25, 0.8, pxCells));
}
`);

const WATER_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <underwater>
#include <wake>
#include <water.uv>
#include <foam>
#include <whirlpool>
#include <hull-water>
#include <deck-wash>
in vec3 vRel;
in vec2 vG;
in float vJ;
in vec2 vD;
in float vHullRunup;
uniform sampler2DArray uSlope;
uniform sampler2DArray uDisp;
uniform vec2 uCenterRel;
uniform sampler2D uHullWet;
uniform float uHullWetOn;
uniform float uDeckWashOn;
uniform sampler2DArray uFoam;
uniform float uMssRes, uMeanSlope, uTime, uHs, uGlowE;
uniform vec3 uRw, uSSS;    // water body colour and the colour of light transmitted through thin crests
uniform vec2 uWind;        // wind direction (unit)
uniform float uWindSpeed;
uniform vec4 uWhaleRings[2];
uniform vec4 uWhaleContacts[2];
uniform float uVortexPatch;
uniform float uUnder;
uniform int uDbg;
uniform sampler2D uTrail, uRipple, uScene, uSceneDepth, uReflTex;
uniform float uReflOn;
uniform float uCamY;
uniform vec3 uRippleInfo;   // camera x, z modulo tile, tile size
uniform vec2 uRes;
uniform vec3 uFwdV;
uniform float uNear, uFar, uRippleAmt, uRippleTexel, uHasScene, uCamDepth;
uniform vec3 uTrailInfo;   // origin x, origin z (camera position modulo map), map size
uniform mat4 uVP,uInvVP;
layout(location = 0) out vec4 o;

vec3 Rw_foamUnder(vec3 Ed0) { return vec3(0.35, 0.55, 0.65) * Ed0 * 0.6; }
float sceneSubDepth(vec3 scene){
  if(uHullWetOn>.5&&length(scene-uHullCenter.xyz)<33.0){
    vec3 p=hullLocal(scene);
    if(abs(p.x)<24.0&&abs(p.z)<5.0){float h=textureLod(uHullWet,p.xz/vec2(48,10)+.5,0.0).r;return (h-p.y)*max(.25,uHullUp.y-dot(whirlSurface(scene.xz).yz,uHullUp.xz));}
  }
  vec2 gp=scene.xz-uCenterRel,dd=vec2(0);float h=0.0;
  for(int it=0;it<4;it++){
    vec2 g=gp-dd;h=0.0;dd=vec2(0);
    for(int i=0;i<5;i++){if(i>=uCascades)break;vec4 d=textureLod(uDisp,vec3(cascUV(i,g),float(i)),0.0);dd+=toWorld(d.xz,i);h+=d.y;}
  }
  h+=whirlSurface(scene.xz).x+kelvinWake(scene.xz,16).x;
  h+=hullRunup(vec3(scene.x,h-uCamY,scene.z));
  return h-uCamY-scene.y;
}
float fresnelRough(float nv, float sigma2) {
  float s = sqrt(max(sigma2, 0.0));
  float F0 = 0.02;
  float k = pow(1.0 - clamp(nv, 0.0, 1.0), 5.0 * exp(-2.69 * s)) / (1.0 + 22.7 * pow(s, 1.5));
  return F0 + (1.0 - F0) * clamp(k, 0.0, 1.0);
}

// Gaussian-slope (Beckmann) sun/moon glitter
vec3 glitter(vec3 n, vec3 V, vec3 Ld, vec3 E, float alpha2) {
  vec3 H = normalize(V + Ld);
  float nh = clamp(dot(n, H), 1e-4, 1.0), nl = clamp(dot(n, Ld), -1.0, 1.0), nv = clamp(dot(n, V), 1e-3, 1.0);
  if (nl <= 0.0 || Ld.y <= -0.02) return vec3(0.0);
  float a2 = max(alpha2, 4.4e-5);
  vec3 tangent=cross(n,H);
  float t2 = dot(tangent,tangent) / (nh * nh);
  float D = exp(-t2 / a2) / (PI * a2 * nh * nh * nh * nh);
  float vh = clamp(dot(V, H), 0.0, 1.0);
  float F = 0.02 + 0.98 * pow(1.0 - vh, 5.0);
  float G = 1.0 / (1.0 + 0.5 * (sqrt(1.0 + a2 * (1.0 / (nv * nv) - 1.0)) - 1.0) + 0.5 * (sqrt(1.0 + a2 * (1.0 / (nl * nl) - 1.0)) - 1.0));
  return E * (D * F * G / (4.0 * nv)) * step(0.0, Ld.y + 0.02);
}

void main() {
  vec3 rel = vRel;
  bool hullNearby=uHullCenter.w>.5&&length(rel-uHullCenter.xyz)<31.0;
  vec3 boatPoint=hullNearby?hullLocal(rel):vec3(1000.0);
  float hullGap=hullNearby?hullSolidGap3(boatPoint):1000.0;
  bool hullClip=hullNearby&&hullGap<-.015;
  // Overtopping water becomes a shallow layer that drains on the deck. A
  // genuinely submerged deck still uses the ocean surface above that layer.
  bool deckClip=uDeckWashOn>.5&&hullNearby&&deckFootprint(boatPoint.xz)
    &&boatPoint.y>=deckFloor(boatPoint.xz)-.015&&boatPoint.y<deckFloor(boatPoint.xz)+.8;
  hullClip=hullClip||deckClip;
  // The polar patch resolves the funnel independently of camera distance.
  // A 40 m depth-tested overlap covers projection differences between the
  // two triangulations. Matching sampled values alone cannot close a seam.
  float vortexR=length(rel.xz-uWhirlpool.xy);
  bool vortexClip=uWhirlpool.w>.001&&((uVortexPatch<.5&&vortexR<${(VORTEX_PATCH-20).toFixed(1)})||(uVortexPatch>.5&&vortexR>=${(VORTEX_PATCH+20).toFixed(1)}));
  float dist = length(rel);
  vec3 V = -rel / dist;
  vec2 S = vec2(0.0);
  float varSum = 0.0;
  // wind comes in gusts: the short waves are much stronger in patches (cat's paws) and weak in slicks, most obviously in light air
  vec2 gx = uNoiseOrg + vec2(uCasc[1].y * vG.x + uCasc[1].z * vG.y, -uCasc[1].z * vG.x + uCasc[1].y * vG.y);
  float gn = vnoise(gx / 380.0) * 0.6 + vnoise(gx / 130.0 + 5.0) * 0.4;
  float gk = mix(0.10, 1.9, smoothstep(0.32, 0.68, gn));
  gk = mix(1.0, gk, 0.12 + 0.88 * exp(-uWindSpeed / 5.5));
  for (int i = 0; i < 5; i++) {
    if (i >= uCascades) break;
    if (uDbg == i + 1) continue;
    // At grazing angles the footprint is long in only one direction. Isotropic
    // texture derivatives otherwise preserve unresolved cross-wave detail as
    // black/white screen-door noise. LEAN moments keep its energy in roughness.
    vec2 suv = cascUV(i, vG);
    float footprint = max(length(dFdx(suv)), length(dFdy(suv))) * float(textureSize(uSlope, 0).x);
    float slopeLod = max(0.0, log2(max(footprint, 1.0)) + 1.15);
    vec4 s = textureLod(uSlope, vec3(suv, float(i)), slopeLod);
    float w = i >= 2 ? gk : 1.0;
    S += toWorld(s.xy, i) * w;
    varSum += (max(s.z - s.x * s.x, 0.0) + max(s.w - s.y * s.y, 0.0)) * w * w;
  }
  float comp = max(1.0 + vJ, 0.45);
  S /= comp;
  vec3 wk = kelvinWake(rel.xz, NW);
  S += wk.yz;
  if (uRippleAmt > 0.0) {
    float rm = smoothstep(15.5, 9.0, length(rel.xz)) * uRippleAmt;
    if (rm > 0.0) {
      vec2 ruv = fract((uRippleInfo.xy + rel.xz) / uRippleInfo.z);
      float e = uRippleTexel;
      float hl = texture(uRipple, ruv - vec2(e, 0.0)).r, hr = texture(uRipple, ruv + vec2(e, 0.0)).r;
      float hd = texture(uRipple, ruv - vec2(0.0, e)).r, hu = texture(uRipple, ruv + vec2(0.0, e)).r;
      S += vec2(hr - hl, hu - hd) / (2.0 * e * uRippleInfo.z) * rm;
      varSum += 0.0;
    }
  }
  float trail = 0.0;
  {
    vec2 dy = rel.xz - uWakeA.xy;
    float m = smoothstep(58.0, 46.0, length(dy)) * uWakeB.z;
    if (m > 0.0) trail = texture(uTrail, fract((uTrailInfo.xy + rel.xz) / uTrailInfo.z)).r * m;
  }
  float sigma2 = 0.5 * varSum + 0.5 * uMssRes * mix(gk, 1.0, 0.5);
  S *= 1.0 - 0.94 * smoothstep(450.0, 4200.0, dist);
  vec3 vortexSurface=whirlSurface(rel.xz);
  S*=mix(1.0,.48,smoothstep(.2,1.2,length(vortexSurface.yz)));
  S+=vortexSurface.yz;
  vec3 n = normalize(vec3(-S.x, 1.0, -S.y));
  vec3 geometricNormal=cross(dFdx(rel),dFdy(rel));
  geometricNormal=normalize(geometricNormal*(geometricNormal.y<0.0?-1.0:1.0)+vec3(0,.000001,0));
  if(vHullRunup>.000001)n=normalize(mix(n,geometricNormal,smoothstep(.01,.12,vHullRunup)*.8));
  if (uUnder > 0.5) n = -n;
  if (uUnder > 0.5) {
    // seen from below: Snell's window onto the sky, total internal reflection outside it
    vec3 Nd = n;                                   // already flipped: points down towards the viewer
    vec3 I = -V;
    vec3 sunWv, beamV, Ed0;
    underwaterLight(sunWv, beamV, Ed0);
    vec3 Lunder = RRS * Ed0 * exp(-KD * max(uCamDepth, 0.2));   // medium radiance at the camera's depth: no seam at the horizon
    float cosI = max(dot(-I, Nd), 1e-3);
    vec3 rf = refract(I, Nd, 1.333);
    vec3 rfd = normalize(vec3(rf.x, max(rf.y, 0.004), rf.z));
    float refractedFootprint = length(fwidth(rfd));
    vec3 colU = Lunder;
    if (dot(rf, rf) > 0.0) {
      float cosT = max(dot(rf, -Nd), 1e-3);
      float rs = (1.333 * cosI - cosT) / (1.333 * cosI + cosT), rp = (cosI - 1.333 * cosT) / (cosI + 1.333 * cosT);
      float Fr = 0.5 * (rs * rs + rp * rp);
      float shd = cloudShadowAt(rel.xz);
      vec3 Lw = envRadiance(rfd, clamp(log2(1.0 + sqrt(sigma2) * 30.0), 0.0, 5.0));
      // the sun seen through the wavy surface
      const float SR = 0.004675;
      float radius = 2.0 * sin(SR * 0.5);
      float discWidth = max(1e-6, 1.5 * refractedFootprint);
      float disc = 1.0 - smoothstep(radius - discWidth, radius + discWidth, length(rfd - uSunDir));
      Lw += min(lightSun() * shd / (PI * SR * SR), vec3(60000.0)) * disc * step(0.0, uSunDir.y);
      // near the critical angle the window edge is softened by the surface roughness
      float sinT = 1.333 * sqrt(max(1.0 - cosI * cosI, 0.0));
      Fr = max(Fr, smoothstep(0.90 - sqrt(sigma2), 1.0 + sqrt(sigma2), sinT));
      colU = Lw * (1.0 - Fr) + Lunder * Fr;
    }
    // foam and bubbles seen from underneath
    float Db = 0.0;
    for (int i = 1; i < 4; i++) { if (i >= uCascades) break; Db = max(Db, texture(uFoam, vec3(cascUV(i, vG), float(i))).x); }
    colU = mix(colU, colU + Rw_foamUnder(Ed0) , smoothstep(0.35, 0.9, Db) * 0.6);
    if(vortexClip||hullClip)discard;
    o = uDbg==99?vec4(1.0):uDbg==98?vec4(boatPoint,1.0):vec4(colU, 1.0);
    return;
  }
  float nv = clamp(dot(n, V), 0.02, 1.0);
  // The apparent horizon contains many wave faces per pixel. Blend its
  // Fresnel/reflection evaluation toward the integrated horizontal surface.
  vec3 macroNormal=normalize(vec3(-vortexSurface.y,1.0,-vortexSurface.z));
  float macroNV=dot(V,macroNormal);
  float grazingFilter = smoothstep(0.18, 0.035, macroNV) * smoothstep(25.0, 150.0, dist);
  n = normalize(mix(n,macroNormal,grazingFilter));
  sigma2 = mix(sigma2, 0.5 * (uMeanSlope + uMssRes), grazingFilter);
  nv = clamp(dot(n, V), 0.02, 1.0);
  vec3 R = reflect(-V, n);
  float below = mix(smoothstep(-0.30, 0.0, R.y), 1.0, smoothstep(600.0, 3500.0, dist));
  R.y = max(R.y, 0.005); R = normalize(R);

  float shadow = cloudShadowAt(rel.xz);
  float yachtSun=yachtShadowWorld(rel,n,true),yachtMoon=yachtShadowWorld(rel,n,false);
  vec3 sunE=lightSun()*shadow*yachtSun,moonE=lightMoon()*shadow*yachtMoon;
  vec3 skyE = lightSky();
  float lodR = clamp(log2(1.0 + sqrt(sigma2) * 40.0) * 1.2, 0.0, 6.0);
  vec3 Lsky = envRadiance(R, lodR);
  float F = fresnelRough(nv, sigma2);
  // Integrate reflected radiance as well as slopes: the reflected horizon is a
  // nonlinear boundary, so averaging the normal alone preserves aliasing.
  float reflectionFootprint = max(length(dFdx(gx)), length(dFdy(gx)));
  float integrate = smoothstep(0.04, 0.28, reflectionFootprint) * smoothstep(0.3, 0.06, macroNV);
  float meanSigma = 0.5 * (uMeanSlope + uMssRes);
  vec3 meanR=reflect(-V,macroNormal);meanR.y=max(meanR.y,.045);meanR=normalize(meanR);
  float meanLod = clamp(log2(1.0 + sqrt(meanSigma) * 40.0) * 1.2 + 1.0, 0.0, 6.0);
  Lsky = mix(Lsky, envRadiance(meanR, meanLod), integrate);
  F = mix(F, fresnelRough(max(macroNV, 0.02), meanSigma), integrate);
  below = mix(below, 1.0, integrate);
  F = mix(F, 1.0, 0.4 * (1.0 - smoothstep(0.03, 0.22, nv)));   // shadowing/multiple bounces keep even rough water reflective at grazing
  vec3 refl = F * Lsky * mix(0.35, 1.0, below);
  if (uReflOn > 0.5) {
    // mirror image of the yacht, distorted by the local wave slope and blurred by the roughness
    vec3 rgt = normalize(cross(uFwdV, vec3(0.0, 1.0, 0.0)));
    vec2 fH = normalize(uFwdV.xz + 1e-5);
    vec2 ruv = gl_FragCoord.xy / uRes + vec2(dot(S, rgt.xz), dot(S, fH)) * 0.045;
    float lodM = clamp(log2(1.0 + sqrt(sigma2) * 70.0), 0.0, 4.0);
    vec4 rc = textureLod(uReflTex, ruv, lodM);
    float mirrorWeight=1.0-smoothstep(.03,.18,length(vortexSurface.yz));
    refl = mix(refl,F * (Lsky * mix(0.35, 1.0, below) * (1.0 - rc.a) + rc.rgb),mirrorWeight);
  }
  float alpha2 = 2.0 * sigma2;
  // The slope variance below the mesh/texture resolution is drawn as individual facets: each footprint-sized cell of
  // water gets its own random tilt, so the mean lobe is unchanged but a still frame shows discrete sparkles.
  float jv = 0.5 * uMssRes * mix(gk, 1.0, 0.5) * 0.85;
  float fpm = max(length(dFdx(gx)), length(dFdy(gx)));             // ground footprint of a pixel (m)
  float jk = 1.0 - smoothstep(0.12, 0.9, fpm);                     // far away a pixel holds thousands of facets: use the smooth statistical lobe
  jv *= jk;
  // World-anchored continuous subpixel ripples, never a pixel-sized random
  // normal. The statistical lobe integrates unresolved facets at distance.
  vec2 gj = vec2(vnoise(gx * 18.0 + uWind * uTime * 0.8), vnoise(gx * 19.3 + 17.0 - uWind * uTime * 0.6)) * 3.0 - 1.5;
  vec2 glitterSlope = (S-vortexSurface.yz)*(1.0-grazingFilter)+vortexSurface.yz;
  vec3 nj = normalize(vec3(-(glitterSlope.x + gj.x * sqrt(jv)), 1.0, -(glitterSlope.y + gj.y * sqrt(jv))));
  float alphaJ = max(2.0 * (sigma2 - jv), 4.4e-5);
  // Integrate normal variation over the rendered pixel, particularly after
  // adaptive resolution reduces the phone's backing buffer.
  vec3 ndx=dFdx(nj),ndy=dFdy(nj);
  alphaJ+=.25*(dot(ndx,ndx)+dot(ndy,ndy));
  // a glint needs the sun disc itself: thin cloud gives diffuse light, not a mirror image
  float discVis = smoothstep(0.55, 0.92, shadow);
  vec3 spec = glitter(nj, V, uSunDir, sunE * discVis, alphaJ) + glitter(nj, V, uMoonDir, moonE * discVis, alphaJ);

  // ---- water body: light scattered up out of the sea --------------------------------------
  float worldY = rel.y+uCamY-vortexSurface.x;
  float crest = clamp(worldY / max(uHs * 0.9, 0.15) * 0.5 + 0.35, 0.0, 1.0);
  float ndl = max(dot(n, uSunDir), 0.0), ndm = max(dot(n, uMoonDir), 0.0);
  vec3 Ed = sunE * (0.25 * max(uSunDir.y, 0.0) + 0.75 * ndl) + moonE * (0.25 * max(uMoonDir.y, 0.0) + 0.75 * ndm) + skyE * (0.55 + 0.45 * n.y) + flashE(n);
  vec3 body = uRw * Ed / PI * (1.0 - F);
  // light transmitted through thin crests towards the viewer
  vec3 Lt = normalize(uSunDir + n * 0.35);
  float sss = pow(sat(dot(V, -Lt)), 3.0) * crest * crest * sat(uSunDir.y * 2.0);
  body += uSSS * sunE * sss * 0.09;
  body *= mix(0.72, 1.0, crest);
  if (uHasScene > 0.5) {
    vec2 suv = gl_FragCoord.xy / uRes;
    float zw = dot(rel, uFwdV);
    float d0 = texture(uSceneDepth, suv).r;
    if (d0 < 0.99999) {
      float zs = 2.0 * uNear * uFar / (uFar + uNear - (2.0 * d0 - 1.0) * (uFar - uNear));
      float thick = (zs - zw) / max(dot(-V, uFwdV), 0.1);
      if (thick > 0.0 && thick < 40.0) {
        // Trace a short refracted segment. A shifted sample is usable only
        // when it still hits submerged geometry beyond this water surface.
        vec3 transmitted=refract(-V,n,1.0/1.333);
        vec4 projected=uVP*vec4(rel+transmitted*min(thick,6.0),1.0);
        vec2 ruv=mix(suv,projected.xy/max(projected.w,.001)*.5+.5,smoothstep(.02,.35,thick));
        bool valid=all(greaterThanEqual(ruv,vec2(0)))&&all(lessThanEqual(ruv,vec2(1)));
        float d1=valid?texture(uSceneDepth,ruv).r:1.0;
        float z1=2.0*uNear*uFar/(uFar+uNear-(2.0*d1-1.0)*(uFar-uNear));
        vec4 ray4=uInvVP*vec4(ruv*2.0-1.0,1.0,1.0);vec3 ray=normalize(ray4.xyz);
        vec3 scenePoint=ray*(z1/max(dot(ray,uFwdV),.01));
        float subDepth=valid&&d1<.99999&&z1>zw+.005?sceneSubDepth(scenePoint):-1.0;
        valid=valid&&d1<.99999&&z1>zw+.005&&subDepth>.02;
        if(!valid){
          ruv=suv;scenePoint=-V*(zs/max(dot(-V,uFwdV),.01));subDepth=sceneSubDepth(scenePoint);valid=subDepth>.02;
        }
        if(valid){
          thick=clamp(length(scenePoint-rel),0.0,40.0);
          vec3 sc=texture(uScene,ruv).rgb,Tw=exp(-CATT*thick);
          vec3 transmission=body*(1.0-Tw)+sc*Tw*(1.0-F);
          body=mix(body,transmission,smoothstep(.02,.12,subDepth));
        }
      }
    }
  }

  // ---- foam -------------------------------------------------------------------------------
  float D = 0.0, fresh = 0.0;
  for (int i = 1; i < 4; i++) {
    if (i >= uCascades) break;
    vec2 foam = texture(uFoam, vec3(cascUV(i, vG), float(i))).xy;
    float f = foam.x; fresh = max(fresh, foam.y);
    D = max(D, i == 3 ? f * 0.85 : f);
  }
  float wnd = smoothstep(3.0, 18.0, uWindSpeed);
  D = max(D, min(trail, 1.2) * 0.86 * (1.0 - 0.35 * wnd));
  // Narrow, broken contact foam follows the full moving hull, including
  // pitch, heel and the curved section at this actual water height.
  float contactFoam=0.0;
  if(hullNearby){
    float edge=smoothstep(-.025,.035,hullGap)*smoothstep(.62,.06,hullGap);
    float motion=clamp(uHullSpeed*.095+length(S)*.18,0.0,1.0);
    float broken=smoothstep(.26,.72,vnoise(boatPoint.xz*vec2(2.2,4.0)+vec2(-uTime*.7,0)));
    contactFoam=edge*motion*(.4+.6*smoothstep(-15.0,19.0,boatPoint.x))*broken;
    D=max(D,contactFoam*.95);fresh=max(fresh,contactFoam);
  }
  // Foam has a finite lifetime. Two staggered generations fade at birth and
  // death, so differential rotation cannot wind old foam into endless rings.
  float vr=max(vortexR,1.0),funnelFoam=0.0;
  if(uWhirlpool.w>.001){
    vec2 vq=rel.xz-uWhirlpool.xy;float va=vortexR>.001?atan(vq.y,vq.x):0.0;
    float omega=uVortex.y/(vr*vr+uWhirlpool.z*uWhirlpool.z);
    for(int generation=0;generation<2;generation++){
      float clock=uVortex.w+float(generation)*9.0;
      float cycle=floor(clock/18.0),age=mod(clock,18.0);
      float fade=sin(PI*age/18.0),weight=fade*fade;
      float adv=va-omega*age+cycle*2.399963;
      vec2 flowing=vec2(cos(adv),sin(adv))*vr;
      float warp=(vnoise(flowing*.018)-.5)*5.0+(vnoise(flowing*.065+7.0)-.5)*2.0;
      float spiral=adv*4.0+log(1.0+vr/uWhirlpool.z)*11.0+warp;
      float spiralWidth=fwidth(spiral);
      float filament=(1.0-smoothstep(.035,.15+spiralWidth,abs(sin(spiral))))/(1.0+spiralWidth);
      float broken=smoothstep(.55,.85,vnoise(flowing*.075)+.20*vnoise(flowing*.3));
      float foamPatch=smoothstep(.61,.84,vnoise(flowing*.13)+.15*vnoise(flowing*.46));
      funnelFoam+=weight*((.10+.65*filament)*broken*smoothstep(570.0,140.0,vr)
        +.58*foamPatch*smoothstep(95.0,18.0,vr))*uWhirlpool.w;
    }
  }
  D=max(D,funnelFoam);fresh=max(fresh,funnelFoam*.8);
  // Broken, thin surface lace left by a dive. Its bounded analytic clock is
  // independent of the rain/hull ripple solver and cannot inject large impulses.
  for(int i=0;i<2;i++){
    vec2 q=rel.xz-uWhaleRings[i].xy;
    if(uWhaleRings[i].w>.001){
      float d=length(q)-uWhaleRings[i].z;
      float ragged=.35+.65*vnoise(q*.45+float(i)*17.0);
      D=max(D,exp(-d*d*.28)*uWhaleRings[i].w*ragged);
    }
    if(uWhaleContacts[i].w<=.001)continue;
    vec2 qc=rel.xz-uWhaleContacts[i].xy;
    float a=uWhaleContacts[i].z;
    vec2 local=vec2(dot(qc,vec2(cos(a),sin(a))),dot(qc,vec2(-sin(a),cos(a))));
    float edge=length(local/vec2(6.6,1.6));
    float contactDistance=(edge-1.0)*4.0;
    float contact=exp(-contactDistance*contactDistance);
    D=max(D,contact*uWhaleContacts[i].w*.48*(.35+.65*vnoise(qc*.8)));
  }
  vec3 col = refl + body;
  // Footprints must be evaluated by every fragment, including water without foam.
  vec4 c1 = uCasc[1];
  vec2 gF = vG + 0.15 * vD;   // part of the choppy displacement: the pattern rides with the water without being squeezed to hair on steep fronts
  vec2 x0 = uNoiseOrg + vec2(c1.y * gF.x + c1.z * gF.y, -c1.z * gF.x + c1.y * gF.y);   // absolute lagrangian metres, cascade-1 frame
  vec2 wl = vec2(c1.y * uWind.x + c1.z * uWind.y, -c1.z * uWind.x + c1.y * uWind.y);
  // foam is dragged into streaks along the wind; wake foam streams along the wake
  vec2 foamWakeDir = vec2(c1.y * uWakeA.z + c1.z * uWakeA.w, -c1.z * uWakeA.z + c1.y * uWakeA.w);
  float tw = clamp(trail / max(D, 0.02), 0.0, 1.0);
  float vortexFoam=clamp(funnelFoam/max(D,.02),0.0,1.0);
  vec2 dir = normalize(mix(wl, foamWakeDir, tw * tw) + 1e-4);
  if(vortexFoam>.001){
    vec2 flow=whirlFlow(rel.xz);
    vec2 flowLocal=vec2(c1.y*flow.x+c1.z*flow.y,-c1.z*flow.x+c1.y*flow.y);
    dir=normalize(mix(dir,normalize(flowLocal+vec2(.0001)),vortexFoam*.9)+vec2(.0001));
  }
  vec2 perp = vec2(-dir.y, dir.x);
  float stretch = 1.3 + 0.8 * wnd + 1.4 * tw;
  vec2 base = vec2(dot(x0, dir) / stretch, dot(x0, perp));
  vec2 pxm = vec2(length(dFdx(base)), length(dFdy(base)));
  float pm = max(pxm.x, pxm.y);                                    // metres of foam-space per pixel
  if (D > 0.012) {
    vec2 warp = vec2(vnoise(base * 0.55 + 3.0), vnoise(base * 0.55 + 9.0)) - 0.5;
    vec2 q = base + warp * 0.65;
    // fractal patchiness: every octave that is coarser than a pixel is kept, finer ones fade to their mean
    float nz = (vnoise(q * 0.30 + 13.0) - 0.5) * 1.00 * (1.0 - smoothstep(0.30, 0.9, pm * 0.30))
             + (vnoise(q * 0.85 + 5.0) - 0.5) * 0.85 * (1.0 - smoothstep(0.30, 0.9, pm * 0.85))
             + (vnoise(q * 2.4 + 29.0) - 0.5) * 0.65 * (1.0 - smoothstep(0.30, 0.9, pm * 2.4))
             + (vnoise(q * 6.5 + 3.0) - 0.5) * 0.50 * (1.0 - smoothstep(0.30, 0.9, pm * 6.5));
    float nfine = (vnoise(q * 17.0 + 11.0) - 0.5) * (1.0 - smoothstep(0.30, 0.9, pm * 17.0))
                + (vnoise(q * 44.0 + 7.0) - 0.5) * 0.7 * (1.0 - smoothstep(0.30, 0.9, pm * 44.0));
    float t = (D - 0.32) * 1.2 + nz * 0.50 + nfine * 0.28;
    // thin foam is a net of bubble walls with the dark water showing through the holes; dense foam has only a few
    float lz = lace(q * 7.0 + 3.0, pm * 7.0);
    float netK = 1.0 - smoothstep(0.10, 0.80, t);
    t -= (1.0 - lz) * 0.30 * netK;
    float cov = smoothstep(-0.04, 0.15 + 0.13 * smoothstep(0.15, 1.2, pm), t);
    float thick = smoothstep(0.0, 1.15, t);
    // far away, patches are smaller than a pixel: keep their average whiteness as a soft haze instead of speckle
    float farK = smoothstep(0.9, 4.5, pm);
    cov = mix(cov, clamp(D * 0.9 * (0.55 + 0.9 * vnoise(q * 0.13 + 3.0)), 0.0, 1.0), farK);
    thick = mix(thick, D, farK);
    vec3 Efoam = sunE * (0.25 * max(uSunDir.y, 0.0) + 0.75 * ndl) + moonE * (0.25 * max(uMoonDir.y, 0.0) + 0.75 * ndm) + skyE * (0.6 + 0.4 * n.y);
    Efoam = mix(vec3(luma(Efoam)), Efoam, 0.6) * 1.18;   // foam scatters light many times: whiter than the light that reaches it
    float bubble = clamp(0.86 + 0.55 * nfine, 0.6, 1.0);
    // bubbles are always white; what changes with thickness is how much of the water still shows through
    vec3 foamCol = vec3(0.94, 0.94, 0.93) * bubble * (Efoam + flashE(n)) / PI * clamp(0.92 + 0.35 * nz, 0.7, 1.15);
    // bright bubble highlights facing the sun
    foamCol += sunE * max(nfine, 0.0) * 0.10 * pow(sat(dot(n, uSunDir)), 2.0) * thick;
    cov *= mix(mix(0.10, 0.78, pow(thick, 0.55)), 0.48, farK);
    cov *= mix(0.34, 1.0, max(smoothstep(0.08, 0.7, fresh), tw * 0.8));
    col = mix(col, foamCol, cov);
  }
  col += spec * (1.0 - clamp(D * 1.6, 0.0, 0.9));
  if (uGlowE > 0.0) {
    // night glow: bioluminescent plankton lit up by breaking water and by the hull's wake
    float steep = smoothstep(0.10, 0.50, length(S));
    float pat = 1.4 * D + 0.8 * min(trail, 1.2) + 0.10 * steep * (0.5 + 0.5 * vnoise(gx * 0.7 + uTime * 0.35));
    col += vec3(0.05, 0.40, 0.60) * uGlowE * pat;
  }

  // aerial perspective toward the horizon colour in this azimuth
  vec3 hd = normalize(vec3(-V.x, 0.0, -V.z));
  vec3 Lh = horizonColor(hd);
  vec3 ext = (RAY_S + (MIE_S + MIE_A) * uHaze) * 0.001; // per metre at sea level
  vec3 T = exp(-ext * dist * (1.0 + 2.2 * smoothstep(1200.0, 6000.0, dist)));   // the last kilometres melt into the horizon glow
  // Sky visibility falls down the deep funnel, as it does in a narrow valley.
  col*=1.0-.52*uWhirlpool.w*smoothstep(135.0,10.0,vr);
  col = col * T + Lh * (1.0 - T);
  if(vortexClip||hullClip)discard;
  o = uDbg==99?vec4(1.0):uDbg==98?vec4(boatPoint,1.0):uDbg==97?vec4(vec3(contactFoam),1.0):uDbg==96?vec4(vec3(min(yachtSun,yachtMoon)),1.0):vec4(col, 1.0);
}`;

export class Water {
  constructor() {
    this.prog = new Program('water', WATER_VS, WATER_FS);
    const M = CLIP_M, side = 2 * M + 1;
    const verts = new Float32Array(side * side * 2);
    for (let j = 0; j < side; j++) for (let i = 0; i < side; i++) { verts[(j * side + i) * 2] = i - M; verts[(j * side + i) * 2 + 1] = j - M; }
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // index buffers: [0] full grid, then 9 ring variants keyed by hole offset
    this.ib = new Map();
    const build = (ox, oz, ring) => {
      const idx = [];
      for (let j = 0; j < 2 * M; j++) for (let i = 0; i < 2 * M; i++) {
        const ci = i - M, cj = j - M; // cell min corner in grid coords
        if (ring) {
          const inHole = ci >= -M / 2 + ox && ci < M / 2 + ox && cj >= -M / 2 + oz && cj < M / 2 + oz;
          if (inHole) continue;
        }
        const a = j * side + i, b = a + 1, c = a + side, d = c + 1;
        // CCW when viewed from +Y (grid x -> +x, grid y -> +z means looking down flips handedness)
        idx.push(a, c, b, b, c, d);
      }
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      return { buf, count: idx.length };
    };
    this.ib.set('full', build(0, 0, false));
    for (let ox = -1; ox <= 1; ox++) for (let oz = -1; oz <= 1; oz++) this.ib.set(`${ox},${oz}`, build(ox, oz, true));
    this.vortexMesh=null;
  }

  buildVortexMesh(){
    const nr=180,na=288,vertices=[],indices=[];
    // 700 m includes an 80 m guard band for displaced triangles at the cut.
    for(let j=0;j<=nr;j++)for(let i=0;i<=na;i++){
      const r=700*Math.pow(j/nr,1.6),a=i/na*Math.PI*2;
      vertices.push(Math.cos(a)*r,Math.sin(a)*r);
    }
    for(let j=0;j<nr;j++)for(let i=0;i<na;i++){
      const a=j*(na+1)+i,b=a+1,c=a+na+1,d=c+1;indices.push(a,c,b,b,c,d);
    }
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    this.vortexMesh={vao,count:indices.length};
  }

  // Draw all levels. `cam` = {x,y,z}; `sim` = OceanSim; `u` = extra uniform setter.
  draw(cam, sim, vp, setExtra, whirlpool) {
    const p = this.prog.use();
    gl.bindVertexArray(this.vao);
    p.m4('uVP', vp).f('uCamY', cam.y).v2('uCameraXZ',cam.x,cam.z).i('uCascades', sim.count).f('uGridN', sim.N);
    p.t('uDisp', 8, sim.disp).t('uSlope', 9, sim.slope).t('uFoam', 10, sim.foamTex);
    p.f('uHs', sim.cur.hs).f('uMeanSlope', sim.mss).f('uMssRes', Math.max(0.0006, (0.003 + 0.00512 * sim.cur.U) * Math.min(1, Math.max(0, (sim.cur.U - 0.2) / 2.8)) - sim.mss * 0.85));
    if (setExtra) setExtra(p);
    p.f('uVortexPatch',0);
    let prev = null;
    for (let l = 0; l < CLIP_LEVELS; l++) {
      const s = CLIP_S0 * Math.pow(2, l), snap = 2 * s;
      const cx = Math.round(cam.x / snap) * snap, cz = Math.round(cam.z / snap) * snap;
      const { scale, off } = sim.cascadeUniforms(cx, cz);
      p.v4v('uCasc', scale).v2v('uCen', off).f('uSpacing', s).v2('uCenterRel', cx - cam.x, cz - cam.z);
      if (sim.count > 1) { const cs = scale[5], sn = scale[6]; p.v2('uNoiseOrg', cs * cx + sn * cz, -sn * cx + cs * cz); }
      let key = 'full';
      if (l > 0) {
        // hole offset = fine level centre relative to this level's centre, in this level's cells
        const ox = Math.round((prev.cx - cx) / s), oz = Math.round((prev.cz - cz) / s);
        key = `${Math.max(-1, Math.min(1, ox))},${Math.max(-1, Math.min(1, oz))}`;
      }
      const ib = this.ib.get(key);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib.buf);
      gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);
      prev = { cx, cz };
    }
    if(whirlpool?.amount>.001){
      if(!this.vortexMesh)this.buildVortexMesh();
      gl.bindVertexArray(this.vortexMesh.vao);
      const cx=whirlpool.x,cz=whirlpool.z,{scale,off}=sim.cascadeUniforms(cx,cz);
      p.v4v('uCasc',scale).v2v('uCen',off).f('uSpacing',1).f('uVortexPatch',1).v2('uCenterRel',cx-cam.x,cz-cam.z);
      if(sim.count>1)p.v2('uNoiseOrg',scale[5]*cx+scale[6]*cz,-scale[6]*cx+scale[5]*cz);
      gl.drawElements(gl.TRIANGLES,this.vortexMesh.count,gl.UNSIGNED_SHORT,0);
    }
  }
}

// All GLSL. The visual identity lives here: every entity is an SDF organism
// with fbm-displaced edges — no raw primitives reach the screen.
// Blending contract: entity/effect shaders output PREMULTIPLIED rgb;
// alpha = coverage (alpha 0 + rgb>0 → pure additive glow).

export const COMMON = `#version 300 es
precision highp float;
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<4;i++){ v += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; }
  return v;
}
float fbm3(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<3;i++){ v += a*vnoise(p); p = p*2.03 + 17.1; a *= 0.5; }
  return v;
}
float sdCircle(vec2 p, float r){ return length(p) - r; }
float sdSeg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p-a, ba = b-a;
  float h = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
  return length(pa - ba*h);
}
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}
vec3 hueShift(vec3 c, float h){
  const vec3 k = vec3(0.57735);
  float ca = cos(h), sa = sin(h);
  return c*ca + cross(k,c)*sa + k*dot(k,c)*(1.0-ca);
}
// three-point palette: m 0..2 → a(dusk) b(deep night) c(pre-dawn)
vec3 tri(vec3 a, vec3 b, vec3 c, float m){ return m < 1.0 ? mix(a,b,m) : mix(b,c,m-1.0); }
`;

// ---------------------------------------------------------------- vertices
export const VS_FULL = `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }
`;

// world-space instanced quads
export const VS_INST = `#version 300 es
layout(location=0) in vec2 aCorner;
layout(location=1) in vec4 iA; // x y sx sy
layout(location=2) in vec4 iB; // rot phase hue aux
layout(location=3) in vec4 iC; // r g b extra
uniform vec2 uCam; uniform float uZoom; uniform vec2 uRes;
out vec2 vUv; out vec4 vB; out vec4 vC; out float vDepth; out vec2 vWorld;
void main(){
  vUv = aCorner;
  vB = iB; vC = iC;
  float cr = cos(iB.x), sr = sin(iB.x);
  vec2 local = vec2(aCorner.x*iA.z, aCorner.y*iA.w);
  vec2 rot = vec2(local.x*cr - local.y*sr, local.x*sr + local.y*cr);
  vec2 world = iA.xy + rot;
  vWorld = world;
  vDepth = clamp(iA.y / uRes.y, 0.0, 1.0);
  vec2 ndc = (world - uCam) * uZoom / (uRes*0.5);
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}
`;

// path ribbon mesh: aPos world, aUv = (along 0..1, across -1..1)
export const VS_RIBBON = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aUv;
uniform vec2 uCam; uniform float uZoom; uniform vec2 uRes;
out vec2 vUv; out float vDepth; out vec2 vWorld;
void main(){
  vUv = aUv;
  vWorld = aPos;
  vDepth = clamp(aPos.y / uRes.y, 0.0, 1.0);
  vec2 ndc = (aPos - uCam) * uZoom / (uRes*0.5);
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}
`;

// ---------------------------------------------------------------- background
export const FS_BG = COMMON + `
uniform float uT; uniform vec2 uReso; uniform float uHorizon; uniform vec2 uPar;
uniform float uMood; // 0 dusk → 1 deep night → 2 violet pre-dawn
uniform vec3 uMapTint;
in vec2 vUv; out vec4 frag;
// sky gradient, aurora-nebula, far ridgelines, spore-stars
void main(){
  vec2 uv = vUv; // 0..1, y up from bottom
  float horizon = uHorizon; // fraction of screen height that is sky
  float horizonLine = 1.0 - horizon;
  float skyY = clamp((uv.y - horizonLine) / max(horizon,1e-3), 0.0, 1.0); // 0 horizon → 1 top
  // deep indigo → darker zenith, palette breathing across the run
  vec3 horizCol = tri(vec3(0.30,0.17,0.46), vec3(0.10,0.13,0.34), vec3(0.42,0.16,0.38), uMood);
  vec3 zenCol   = tri(vec3(0.07,0.05,0.16), vec3(0.015,0.02,0.06), vec3(0.10,0.05,0.16), uMood);
  vec3 sky = mix(horizCol, zenCol, pow(skyY,0.75));
  // nebula: two fbm layers drifting at different rates (parallax offset uPar)
  vec2 np = vec2(uv.x*2.6 + uPar.x*0.00012, uv.y*6.0);
  float n1 = fbm(np*2.0 + vec2(uT*0.008, uT*0.004));
  float n2 = fbm(np*4.5 - vec2(uT*0.013, 0.0) + 31.7);
  float neb = smoothstep(0.45, 0.85, n1) * (0.5 + 0.5*n2);
  vec3 nebA = tri(vec3(0.55,0.16,0.95), vec3(0.10,0.25,0.70), vec3(0.95,0.30,0.55), uMood);
  vec3 nebB = tri(vec3(0.12,0.55,0.85), vec3(0.05,0.20,0.45), vec3(0.80,0.45,0.20), uMood);
  vec3 nebCol = mix(nebA, nebB, n2);
  sky += nebCol * neb * (0.55 - 0.15*clamp(uMood,0.0,1.0)*(2.0-uMood));
  // grand slow structures in the upper sky so the top of frame isn't flat
  float n3 = fbm(np*0.9 + 71.0 - vec2(uT*0.005, 0.0));
  sky += nebA * smoothstep(0.48,0.85,n3) * smoothstep(0.30,0.85,skyY) * 0.40;
  sky += nebB * smoothstep(0.62,0.95,fbm(np*1.6+13.0)) * smoothstep(0.5,1.0,skyY) * 0.30;
  // spore-stars, twinkling
  vec2 sp = uv*uReso*0.5 + vec2(uPar.x*0.03,0.0);
  vec2 cell = floor(sp/22.0);
  float starGate = 0.976 - 0.012*clamp(uMood,0.0,1.0); // deep night = more stars
  float star = step(starGate, hash12(cell));
  vec2 cuv = fract(sp/22.0)-0.5;
  float sd = length(cuv - (vec2(hash12(cell+7.3),hash12(cell+3.1))-0.5)*0.6);
  float tw = 0.55+0.45*sin(uT*(0.6+hash12(cell+1.7)*2.0)+hash12(cell)*40.0);
  vec3 starCol = mix(vec3(0.5,0.9,1.0), vec3(1.0,0.7,0.9), hash12(cell+9.9));
  sky += starCol * star * smoothstep(0.09,0.0,sd) * tw * 1.1 * smoothstep(0.02,0.3,skyY);
  // thin ridgeline silhouettes hugging the horizon, glow rising behind them
  for(int i=0;i<2;i++){
    float fi = float(i);
    float px = uv.x + uPar.x*(0.00035 + fi*0.00025);
    float rn = fbm(vec2(px*(3.4-fi*1.3)+fi*13.7, fi*7.1));
    float ridge = horizonLine + (0.010+0.016*fi) + 0.055*(rn-0.30)*(1.0+fi*0.8);
    float m = smoothstep(ridge+0.006, ridge-0.010, uv.y);
    vec3 ridgeCol = mix(vec3(0.055,0.038,0.115), vec3(0.085,0.06,0.16), fi);
    sky = mix(sky, ridgeCol, m*(0.9-0.25*fi));
    float rim = smoothstep(0.010,0.0,abs(uv.y-ridge));
    sky += vec3(0.10,0.42,0.44) * rim * (0.5+0.3*sin(uT*0.4+px*9.0)) * (1.0-fi*0.55);
  }
  // bioluminescent haze rising off the world — drawn over ridge bases
  float hg = exp(-max(0.0, uv.y-horizonLine)*26.0);
  vec3 hgCol = tri(vec3(0.10,0.46,0.50), vec3(0.06,0.22,0.46), vec3(0.55,0.18,0.42), uMood) * uMapTint;
  sky += hgCol * hg * (0.8 + 0.2*sin(uT*0.23));
  // god-ray shafts rising out of the glow, slowly wandering
  float shaftN = pow(0.5+0.5*sin(uv.x*34.0 + fbm(vec2(uv.x*6.0, uT*0.02))*11.0 + uT*0.05), 3.5);
  sky += hgCol * shaftN * exp(-max(0.0, uv.y-horizonLine)*9.0) * 0.4;
  // below the horizon, converge on the ground's far-haze colour
  vec3 hazeCol = tri(vec3(0.10,0.28,0.34), vec3(0.05,0.14,0.26), vec3(0.30,0.14,0.28), uMood) * uMapTint;
  float below = smoothstep(0.0, 0.012, horizonLine - uv.y);
  sky = mix(sky, hazeCol, below);
  frag = vec4(sky, 1.0);
}
`;

// ---------------------------------------------------------------- ground
export const FS_GROUND = COMMON + `
uniform float uT; uniform float uHorizon; uniform vec2 uReso; uniform float uMood;
uniform vec3 uMapTint;
uniform sampler2D uStain; uniform vec2 uWorldSize;
in vec2 vUv; in vec2 vWorld; out vec4 frag;
// vUv here: x across screen, y 0 at horizon → 1 at bottom (near)
void main(){
  float near = vUv.y;
  float persp = mix(3.4, 1.0, near); // features shrink toward horizon
  vec2 p = vec2(vUv.x*7.0*persp, near*6.5 + 2.0);
  float rock = fbm(p);
  float rock2 = fbm(p*3.1 + 40.0);
  vec3 base = mix(vec3(0.052,0.036,0.105), vec3(0.115,0.078,0.185), rock);
  base *= 0.72 + 0.55*rock2;
  // organic mottling — dark pools and pale lichen veils
  base *= 1.0 - 0.42*smoothstep(0.55,0.75,fbm(p*0.6+9.0));
  base += vec3(0.030,0.055,0.060) * smoothstep(0.60,0.85,fbm(p*1.7+23.0));
  // sedimentary strata — banded ridges warped by the terrain noise
  float strata = 0.5+0.5*sin(p.y*9.0 + fbm(p*1.4)*7.0 + p.x*0.5);
  base *= 0.88 + 0.24*smoothstep(0.35,0.95,strata);
  // deep cracks, glowing faintly from below
  float crackN = fbm(p*2.4+77.0);
  float crack = smoothstep(0.70,0.92,crackN);
  base = mix(base, vec3(0.015,0.030,0.036), crack*0.65);
  base += vec3(0.04,0.22,0.20) * mix(vec3(1.0), uMapTint*1.4, 0.6) * smoothstep(0.86,0.98,crackN) * (0.55+0.45*sin(uT*0.6+p.x*4.0)) * near;
  // faint teal ambient sheen so the plane never reads as void
  base += vec3(0.012,0.030,0.034);
  // the run's history: chemistry and deaths bloom into the ground itself
  vec3 stain = texture(uStain, vWorld / uWorldSize).rgb;
  stain = stain / (1.0 + stain*0.55); // soft-knee — a tended grove never clips
  base += stain * (0.7 + 0.9*rock) * (0.5 + 0.5*near);
  // bioluminescent micro-life: sparse cyan/green dots that breathe
  vec2 cell = floor(p*9.0);
  float d = hash12(cell);
  if(d > 0.955){
    vec2 cuv = fract(p*9.0)-0.5;
    float r = length(cuv - (vec2(hash12(cell+3.0),hash12(cell+5.0))-0.5)*0.5);
    float breathe = 0.5+0.5*sin(uT*(0.5+d)+d*50.0);
    vec3 mc = mix(vec3(0.1,0.7,0.55), vec3(0.5,0.8,0.2), step(0.978,d));
    base += mc * smoothstep(0.12,0.0,r) * breathe * 0.5 * near;
  }
  // mood tint on the plane itself, then the map's own colour identity
  base *= tri(vec3(1.0), vec3(0.55,0.7,1.05), vec3(1.05,0.75,0.95), uMood);
  base *= uMapTint;
  // atmospheric haze toward horizon — far edge must equal the bg's
  // below-horizon colour or a seam appears
  vec3 haze = tri(vec3(0.10,0.28,0.34), vec3(0.05,0.14,0.26), vec3(0.30,0.14,0.28), uMood) * uMapTint;
  base = mix(haze, base, smoothstep(0.0, 0.42, near));
  // continuation of the bg horizon glow onto the far ground (same colour +
  // time modulation as FS_BG's hg term, decay matched across the seam)
  vec3 hgCol = tri(vec3(0.10,0.46,0.50), vec3(0.06,0.22,0.46), vec3(0.55,0.18,0.42), uMood) * uMapTint;
  base += hgCol * (0.8 + 0.2*sin(uT*0.23)) * exp(-near*22.0);
  frag = vec4(base, 1.0);
}
`;

// ---------------------------------------------------------------- path ribbon
export const FS_PATH = COMMON + `
uniform float uT; uniform vec3 uMapTint;
uniform sampler2D uStain; uniform vec2 uWorldSize;
in vec2 vUv; in float vDepth; in vec2 vWorld; out vec4 frag;
// vUv.x = along path (0 spawn → 1 heart), vUv.y = across (-1..1)
void main(){
  float across = vUv.y;
  float along = vUv.x;
  float edge = 1.0 - abs(across);
  // organic edge erosion
  float er = fbm(vec2(along*46.0, across*3.0)) * 0.55;
  float mask = smoothstep(0.0, 0.42, edge - er*0.35);
  if(mask <= 0.001){ frag = vec4(0.0); return; }
  // the path is a riverbed of dark silt with glowing veins
  vec3 bed = vec3(0.030,0.020,0.055) * (0.7 + 0.6*fbm(vec2(along*60.0, across*4.0)+3.0));
  // veins: branching filaments flowing toward the heart
  float vein = 0.0;
  for(int i=0;i<3;i++){
    float fi = float(i);
    float lane = sin(along*(30.0+fi*17.0) + fi*2.1)*0.5 + sin(along*(90.0+fi*31.0)+fi)*0.16;
    float w = 0.10 - fi*0.02;
    vein += smoothstep(w, 0.0, abs(across*0.85 - lane*0.55)) * (0.55-0.13*fi);
  }
  // energy pulses travelling along the veins toward the heart
  float pulse = pow(0.5+0.5*sin(along*44.0 - uT*2.6), 6.0);
  float pulse2 = pow(0.5+0.5*sin(along*23.0 - uT*1.7 + 2.0), 8.0);
  vec3 veinCol = vec3(0.05,0.55,0.60) * vein * (0.55 + 0.8*pulse);
  veinCol += vec3(0.35,0.18,0.60) * vein * pulse2 * 0.8;
  // faint center channel glow — boosted so the river never dies mid-frame
  veinCol += vec3(0.05,0.38,0.42) * smoothstep(0.5,0.0,abs(across)) * 0.55;
  // rim lichen: bright organic edge where path meets ground
  float rim = smoothstep(0.30,0.06,abs(edge - er*0.35 - 0.10));
  veinCol += vec3(0.10,0.45,0.40) * rim * (0.4+0.25*sin(uT*0.9 + along*80.0));
  vec3 col = bed + veinCol * mix(vec3(1.0), uMapTint, 0.5);
  // battle stains soak into the riverbed too
  vec3 stain = texture(uStain, vWorld / uWorldSize).rgb;
  col += (stain / (1.0 + stain*0.55)) * 0.75;
  // haze with depth
  col = mix(col, vec3(0.10,0.28,0.34)*0.6, (1.0-vDepth)*0.35);
  frag = vec4(col*mask, mask);
}
`;

// ---------------------------------------------------------------- ground light
export const FS_LIGHT = COMMON + `
in vec2 vUv; in vec4 vB; in vec4 vC; in float vDepth; in vec2 vWorld; out vec4 frag;
// radial ground illumination; aux = intensity; extra = ring? (0 disc, 1 ring with aux radius)
void main(){
  float r = length(vUv);
  if(vC.a < 0.5){
    float fall = pow(max(0.0, 1.0 - r), 2.2);
    // light SCULPTS the terrain: sample the same fbm family the ground uses,
    // so pools of light reveal rock texture instead of flattening it
    float tex = fbm3(vWorld*0.016);
    float tex2 = fbm3(vWorld*0.05 + 31.0);
    fall *= 0.55 + 0.7*tex + 0.35*tex2;
    // faint forward shadowing — light falls off faster up-screen, as if
    // the ground tilts away from the source
    fall *= 1.0 - 0.25*clamp(-vUv.y, 0.0, 1.0);
    frag = vec4(vC.rgb * fall * vB.w, 0.0);
  } else {
    // organic ripple: eroded, width-varying, direction-modulated ring
    float ang = atan(vUv.y, vUv.x);
    float er = fbm3(vec2(ang*1.6, vB.y*0.7)) - 0.5;
    float w = 0.06 + 0.08*fbm3(vec2(ang*2.3+7.0, vB.y));
    float ring = smoothstep(w, 0.0, abs(r - vB.w - er*0.10));
    ring *= 0.55 + 0.6*fbm3(vUv*5.0 + vB.y);
    frag = vec4(vC.rgb * ring * (1.0-vB.w*0.7), 0.0);
  }
}
`;

// ---------------------------------------------------------------- entity übershader
// uKind selects the organism. Premultiplied output.
export const FS_ENTITY = COMMON + `
uniform float uT; uniform int uKind; uniform float uHorizon;
in vec2 vUv; in vec4 vB; in vec4 vC; in float vDepth; out vec4 frag;

// vB: rot phase kind aux | vC: r g b seed
// uKind >= 0 forces a kind for a whole pass; -1 reads per-instance vB.z,
// letting one y-sorted draw call carry towers + enemies + heart together.
void main(){
  vec2 p = vUv;
  float phase = vB.y;
  float aux = vB.w;
  vec3 tint = vC.rgb;
  float seed = vC.a;
  vec3 col = vec3(0.0);
  float cov = 0.0;
  int kind = uKind >= 0 ? uKind : int(vB.z + 0.5);

  if(kind == 0){ // MITE — swarm grub: teardrop + cilia
    float wob = fbm3(p*2.6 + phase*0.7 + seed*7.0)*0.16;
    vec2 q = p; q.x *= 0.82;
    float body = sdCircle(q + vec2(0.10,0.0), 0.46+wob);
    float tail = sdSeg(q, vec2(0.1,0.0), vec2(0.72,0.0)) - (0.16 - 0.14*smoothstep(0.1,0.72,q.x));
    float d = smin(body, tail, 0.18);
    float ang = atan(p.y,p.x);
    d -= 0.035*pow(0.5+0.5*sin(ang*9.0 + phase*5.0),3.0); // cilia shimmer
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float core = smoothstep(0.30,0.0,length(q+vec2(0.12,0.0)));
    float innards = smoothstep(0.42,0.05,length(q+vec2(0.05,0.0))) * (0.5+0.5*fbm3(q*5.0+phase));
    float rim = smoothstep(0.0,0.14,-d)*smoothstep(-0.30,-0.10,d) * smoothstep(0.15,0.55,vDepth);
    vec3 membrane = tint*0.32 + vec3(0.01,0.01,0.03);
    col = membrane + tint*innards*0.75 + tint*core*(1.8+0.7*sin(phase*3.1)) + tint*rim*0.55;
    cov = m*0.92;
  }
  else if(kind == 1){ // GRUB — armoured segmented crawler
    float wob = fbm3(p*2.2 + phase*0.5 + seed*3.0)*0.10;
    float d = 1e9;
    for(int i=0;i<4;i++){
      float fi = float(i);
      float x = -0.56 + fi*0.375;
      float r = 0.30 + 0.10*sin(fi*1.9+1.2) + wob*0.5;
      float squish = 1.0 + 0.05*sin(phase*4.0 - fi*1.3);
      d = smin(d, sdCircle(vec2((p.x-x)/squish, p.y*1.12), r), 0.12);
    }
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    // chitin top shell (dark), belly glow seams between segments
    float shell = smoothstep(-0.05,-0.4,p.y);
    float seam = 0.0;
    for(int i=0;i<3;i++){
      float x = -0.37 + float(i)*0.375;
      seam += smoothstep(0.09,0.0,abs(p.x-x)) ;
    }
    seam *= smoothstep(-0.1,0.25,p.y);
    float pulse = 0.6+0.5*sin(phase*4.0 - p.x*4.0);
    float belly = smoothstep(0.1,0.45,p.y) * (0.5+0.5*fbm3(p*4.0+phase*0.5));
    vec3 shellCol = mix(tint*0.27, vec3(0.03,0.02,0.055), shell*0.75);
    col = shellCol + tint*belly*0.55 + tint*seam*pulse*2.1;
    float rim = smoothstep(0.0,0.10,-d)*smoothstep(-0.22,-0.08,d) * smoothstep(0.15,0.55,vDepth);
    col += tint*rim*0.35;
    // eyes
    col += vec3(1.0,0.9,0.7)*smoothstep(0.05,0.0,length(p-vec2(-0.72,-0.06)))*1.4;
    cov = m*0.96;
  }
  else if(kind == 2){ // WISP — ghostly floater with veil
    float veil = fbm(p*3.0 + vec2(phase*0.9, seed*5.0));
    float d = sdCircle(p*vec2(1.0,1.15), 0.42 + veil*0.14);
    float body = smoothstep(0.25,-0.2,d);
    float tail = smoothstep(0.4,0.0,abs(p.y+p.x*0.3*sin(phase)))*smoothstep(0.9,0.2,p.x)*step(0.0,p.x)*veil;
    float core = smoothstep(0.24,0.0,length(p));
    col = tint*body*0.65 + tint*core*2.0 + tint*tail*0.5;
    cov = clamp(body*0.55 + core*0.4, 0.0, 1.0);
  }
  else if(kind == 3){ // CORAL CANNON — branching coral, tips charge with aux
    float breathe = 1.0 + 0.035*sin(phase);
    vec2 q = p / breathe;
    q.y = -q.y; // build upward
    float wob = fbm3(q*3.0 + seed*11.0)*0.09;
    float d = sdCircle(q + vec2(0.0,0.62), 0.34+wob); // base bulb
    int branches = 3 + int(min(2.0, floor(vC.a*0.34+seed*0.0))); // level via extra later
    float tipGlow = 0.0;
    for(int i=0;i<5;i++){
      if(i >= branches) break;
      float fi = float(i);
      float bx = (fi - float(branches-1)*0.5) * 0.34;
      float sway = sin(phase*0.7 + fi*1.7)*0.05;
      vec2 root = vec2(bx*0.5, -0.35);
      vec2 mid  = vec2(bx*0.8 + sway, 0.05 + 0.06*sin(fi*2.2));
      vec2 tip  = vec2(bx + sway*1.8, 0.42 + 0.16*hash12(vec2(seed,fi)));
      float b1 = sdSeg(q, root, mid) - (0.13 - 0.05*smoothstep(-0.35,0.1,q.y));
      float b2 = sdSeg(q, mid, tip) - (0.09 - 0.045*smoothstep(0.0,0.45,q.y));
      d = smin(d, smin(b1,b2,0.08), 0.10);
      float tg = smoothstep(0.24,0.0,length(q-tip));
      tipGlow += tg;
    }
    d += wob*0.4;
    float m = smoothstep(0.025,-0.025,d);
    if(m<=0.0 && tipGlow<=0.01){ frag=vec4(0.0); return; }
    // deep body with subsurface gradient toward tips
    float up = smoothstep(-0.7,0.6,q.y);
    vec3 body = mix(vec3(0.05,0.035,0.11), tint*0.55, up*0.85);
    body *= 0.85 + 0.3*fbm3(q*6.0+seed*3.0);
    float rim = smoothstep(0.0,0.09,-d)*smoothstep(-0.2,-0.07,d);
    col = body + tint*rim*(0.55+0.5*aux);
    col += tint * tipGlow * (1.1 + 3.0*aux*aux) * (0.75+0.25*sin(phase*2.0));
    cov = clamp(m*0.97 + tipGlow*0.35, 0.0, 1.0);
  }
  else if(kind == 4){ // TESLA ANEMONE — swaying tendrils, hot core
    float d = 1e9;
    float tipGlow = 0.0;
    for(int i=0;i<10;i++){
      float fi = float(i);
      float a = fi/10.0*6.2832 + sin(phase*0.9 + fi*1.3)*0.16;
      float len = 0.62 + 0.16*hash12(vec2(seed,fi));
      vec2 dir = vec2(cos(a), sin(a)*0.8);
      vec2 tip = dir*len + vec2(0.0,-0.06);
      float t1 = sdSeg(p, dir*0.12, tip) - (0.075 - 0.055*smoothstep(0.1,len,length(p)));
      d = min(d, t1);
      tipGlow += smoothstep(0.13,0.0,length(p-tip)) * (0.5+0.5*sin(phase*3.0+fi*2.0));
    }
    float core = sdCircle(p*vec2(1.0,1.15), 0.30 + fbm3(p*4.0+phase*0.4)*0.05);
    d = smin(d, core, 0.09);
    float m = smoothstep(0.02,-0.02,d);
    float coreGlow = smoothstep(0.34,0.0,length(p));
    if(m<=0.0 && tipGlow<=0.01 && coreGlow<=0.01){ frag=vec4(0.0); return; }
    vec3 body = mix(vec3(0.05,0.02,0.08), tint*0.35, smoothstep(0.5,0.0,length(p)));
    float rim = smoothstep(0.0,0.07,-d)*smoothstep(-0.16,-0.05,d);
    col = body*m + tint*rim*0.5*m;
    col += tint*coreGlow*(1.1 + 2.4*aux*aux);
    col += mix(tint, vec3(1.0), 0.5) * tipGlow * (0.35 + 1.9*aux);
    cov = clamp(m*0.95 + coreGlow*0.3, 0.0, 1.0);
  }
  else if(kind == 5){ // FLORA — glow-tipped blades, aux = excitement
    float glow = 0.0; float d = 1e9;
    for(int i=0;i<3;i++){
      float fi = float(i);
      float bx = (fi-1.0)*0.30 + (hash12(vec2(seed,fi))-0.5)*0.2;
      float sway = sin(phase*0.6 + fi*2.1 + seed*9.0)*(0.09+aux*0.12);
      vec2 root = vec2(bx, 0.75);
      vec2 tip = vec2(bx + sway*2.2, -0.55 - 0.3*hash12(vec2(fi,seed)));
      vec2 mid = mix(root,tip,0.5) + vec2(sway, 0.0);
      float b = min(sdSeg(p, root, mid), sdSeg(p, mid, tip)) - 0.045;
      d = min(d, b);
      glow += smoothstep(0.16,0.0,length(p-tip));
    }
    float m = smoothstep(0.015,-0.015,d);
    vec3 blade = mix(vec3(0.015,0.02,0.05), tint*0.35, 0.4+aux*0.6);
    col = blade*m + tint*glow*(0.4+2.8*aux);
    cov = clamp(m*0.85 + glow*0.3, 0.0, 1.0);
  }
  else if(kind == 17){ // SLATE HUSK — armoured beetle, cracks glow as it breaks
    float wob = fbm3(p*2.5 + seed*4.0)*0.07;
    vec2 q = vec2(p.x*0.9, p.y*1.15);
    float d = sdCircle(q, 0.52+wob);
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    // three shell plates
    float plates = 0.0;
    for(int i=0;i<3;i++){
      float px = -0.34 + float(i)*0.34;
      plates += smoothstep(0.05,0.0,abs(q.x-px+q.y*0.15)) ;
    }
    vec3 shell = mix(tint*0.16, vec3(0.05,0.07,0.12), smoothstep(-0.4,0.3,q.y));
    shell *= 0.85 + 0.3*fbm3(q*6.0+seed*8.0);
    // damage cracks: amber light leaks as hp (aux) falls; a whisper shows even intact
    float crackAmt = 0.18 + 0.82*(1.0-aux);
    float crack = smoothstep(0.62,1.0,fbm(q*5.5+seed*13.0)) * crackAmt;
    vec3 col2 = shell + vec3(1.0,0.55,0.15)*crack*1.8 + tint*plates*0.35;
    float rim = smoothstep(0.0,0.08,-d)*smoothstep(-0.2,-0.07,d);
    col = col2 + tint*rim*0.5;
    col += vec3(1.0,0.9,0.7)*smoothstep(0.05,0.0,length(p-vec2(-0.62,0.0)))*1.2;
    cov = m*0.97;
  }
  else if(kind == 18){ // BROOD CARRIER — egg sac, children glowing inside
    float wob = fbm3(p*3.0 + phase*0.4 + seed*6.0)*0.12;
    float d = sdCircle(p*vec2(0.85,1.05), 0.5+wob);
    float m = smoothstep(0.04,-0.04,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    vec3 body = tint*0.27 + vec3(0.02,0.03,0.02);
    // eggs
    float eggs = 0.0;
    for(int i=0;i<4;i++){
      float fi = float(i);
      vec2 c = vec2(sin(fi*2.4+seed*9.0)*0.22, cos(fi*1.7+seed*5.0)*0.24);
      float beat = 0.5+0.5*sin(phase*2.0+fi*1.9);
      eggs += smoothstep(0.14,0.0,length(p-c)) * (0.5+0.5*beat);
    }
    float rim = smoothstep(0.0,0.10,-d)*smoothstep(-0.26,-0.09,d);
    col = body + tint*eggs*1.5 + tint*rim*0.7;
    cov = m*0.9;
  }
  else if(kind == 19){ // SHELLBACK — dome walker inside a shield bubble (aux = shield frac)
    vec2 q = p*vec2(0.95,1.15);
    float wob = fbm3(q*3.0+seed*3.0)*0.06;
    float dome = sdCircle(q+vec2(0.0,0.1), 0.42+wob);
    float m = smoothstep(0.03,-0.03,dome);
    vec3 body = mix(tint*0.20, vec3(0.03,0.05,0.08), smoothstep(-0.2,0.35,q.y));
    float ridges = pow(0.5+0.5*sin(atan(q.y+0.1,q.x)*7.0+seed*9.0),2.0);
    body += tint*ridges*0.22;
    // inner organs pulse beneath the dome
    body += tint * smoothstep(0.20,0.0,length(q-vec2(-0.10,0.16))) * (0.6+0.4*sin(phase*2.6)) * 0.8;
    body += tint * smoothstep(0.16,0.0,length(q-vec2(0.14,0.10))) * (0.6+0.4*sin(phase*2.6+2.0)) * 0.7;
    float rim = smoothstep(0.0,0.07,-dome)*smoothstep(-0.18,-0.06,dome);
    col = (body + tint*rim*0.8)*m;
    cov = m*0.95;
    // shield bubble
    if(aux > 0.001){
      float br = 0.86 + 0.03*sin(phase*3.0);
      float bub = abs(length(p) - br);
      float fresnel = smoothstep(0.10,0.0,bub) * (0.5+0.5*sin(atan(p.y,p.x)*6.0 - phase*2.0)*0.3);
      vec3 bcol = vec3(0.45,0.9,1.0) * fresnel * (0.22 + aux*0.85);
      col += bcol;
      cov = clamp(cov + fresnel*0.25*aux, 0.0, 1.0);
    }
  }
  else if(kind == 20){ // DARTFIN — speed incarnate
    vec2 q = p*vec2(0.62,1.5); // stretched along travel axis
    float wob = fbm3(q*3.0+phase)*0.05;
    float bodyD = sdCircle(q+vec2(0.12,0.0), 0.4+wob);
    // fin blades
    float fins = min(
      sdSeg(p, vec2(0.1,0.0), vec2(0.55,-0.5)) - 0.05,
      sdSeg(p, vec2(0.1,0.0), vec2(0.55, 0.5)) - 0.05);
    float d = smin(bodyD, fins, 0.08);
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float core = smoothstep(0.3,0.0,length(q+vec2(0.18,0.0)));
    // speed streaks behind
    float streak = smoothstep(0.12,0.0,abs(p.y*0.7 - 0.04*sin(p.x*9.0+phase*7.0))) * smoothstep(0.9,0.2,p.x) * step(0.0,p.x);
    vec3 body = tint*0.36;
    col = body*m + mix(tint,vec3(1.0),0.6)*core*2.2 + tint*streak*0.8;
    cov = m*0.9;
  }
  else if(kind == 21){ // BULWARK — living siege wall
    float wob = fbm3(p*2.0 + seed*2.0)*0.08;
    vec2 q = vec2(p.x*0.8, p.y*1.25);
    float d = sdCircle(q+vec2(0.0,0.05), 0.55+wob);
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    // heavy plates + lava seams
    float seg = pow(0.5+0.5*sin(q.x*9.0+seed*7.0),3.0);
    float seams = smoothstep(0.75,1.0,fbm(q*4.0+seed*11.0));
    vec3 body = mix(vec3(0.06,0.03,0.05), tint*0.18, smoothstep(0.4,-0.4,q.y));
    body *= 0.8+0.35*fbm3(q*5.0);
    float pulse2 = 0.6+0.4*sin(phase*1.6 + q.x*3.0);
    col = body + tint*seams*pulse2*1.3 + tint*seg*0.12;
    float rim = smoothstep(0.0,0.09,-d)*smoothstep(-0.2,-0.07,d);
    col += tint*rim*0.6;
    col += vec3(1.0,0.85,0.6)*smoothstep(0.06,0.0,length(p-vec2(-0.68,-0.05)))*1.1;
    cov = m*0.98;
  }
  else if(kind == 22){ // SPECTRE — hollow-eyed veil (aux = presence: 0.3 when phased out)
    float veil = fbm(p*2.8 + vec2(phase*0.7, seed*4.0));
    float d = sdCircle(p*vec2(1.0,1.2), 0.45 + veil*0.16);
    float body = smoothstep(0.3,-0.25,d);
    float core = smoothstep(0.4,0.0,length(p*vec2(1.0,1.3)+vec2(0.0,0.05)));
    // hollow eye voids
    float eyes = smoothstep(0.10,0.02,length(p-vec2(-0.13,-0.12))) + smoothstep(0.10,0.02,length(p-vec2(0.13,-0.12)));
    vec3 c2 = tint*body*0.4 + tint*core*1.6;
    c2 *= (1.0 - eyes*0.9);
    col = c2 * aux;
    cov = clamp(body*0.5+core*0.3,0.0,1.0) * aux;
  }
  else if(kind == 23){ // MENDLING — soft healer, light-vein cross pulsing
    float wob = fbm3(p*2.6 + phase*0.3 + seed*3.0)*0.10;
    float d = sdCircle(p, 0.46+wob);
    float m = smoothstep(0.04,-0.04,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float crossV = smoothstep(0.10,0.0,abs(p.x)) + smoothstep(0.10,0.0,abs(p.y));
    float beat = pow(0.5+0.5*sin(phase*2.4),2.0);
    vec3 body = tint*0.30 + vec3(0.02,0.02,0.03);
    col = body + tint*crossV*(0.5+beat*1.0);
    float rim = smoothstep(0.0,0.08,-d)*smoothstep(-0.2,-0.07,d);
    col += mix(tint,vec3(1.0,0.6,0.8),0.4)*rim*0.7;
    cov = m*0.9;
  }
  else if(kind == 24){ // BROODMOTHER — mountain of egg sacs
    float wob = fbm3(p*2.2 + phase*0.2 + seed)*0.10;
    float d = sdCircle(p*vec2(0.8,1.05), 0.55+wob);
    d = smin(d, sdCircle((p+vec2(0.3,0.25))*vec2(0.9,1.2), 0.35), 0.15);
    d = smin(d, sdCircle((p-vec2(0.32,-0.22))*vec2(0.9,1.2), 0.33), 0.15);
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    vec3 body = tint*0.12 + vec3(0.03,0.03,0.01);
    float eggs = 0.0;
    for(int i=0;i<7;i++){
      float fi = float(i);
      vec2 c = vec2(sin(fi*2.3+seed*7.0)*0.38, cos(fi*1.8+seed*3.0)*0.34);
      float beat = 0.5+0.5*sin(phase*1.7+fi*2.3);
      eggs += smoothstep(0.11,0.0,length(p-c)) * beat;
    }
    // crown spikes
    float ang = atan(p.y,p.x);
    float spikes = smoothstep(0.02,-0.02, length(p)-0.62-0.14*pow(abs(sin(ang*5.0+seed*6.0)),8.0));
    col = body + tint*eggs*1.6 + tint*spikes*0.25;
    float rim = smoothstep(0.0,0.10,-d)*smoothstep(-0.25,-0.08,d);
    col += tint*rim*0.8;
    cov = m*0.97;
  }
  else if(kind == 25){ // THE UNLIT — a hole in the light (aux = phase-2 crack glow)
    float wob = fbm(p*1.8 + vec2(phase*0.15, seed*2.0))*0.10;
    vec2 q = p*vec2(0.85,1.1);
    float d = sdCircle(q, 0.46+wob);
    // trailing void tendrils — kept inside the quad or they clip hard
    for(int i=0;i<3;i++){
      float fi = float(i);
      float a = 2.4 + fi*0.5 + sin(phase*0.4+fi)*0.2;
      vec2 dir = vec2(cos(a), sin(a));
      d = smin(d, sdSeg(q, dir*0.24, dir*(0.62+0.10*sin(phase*0.6+fi*2.0))) - 0.09, 0.12);
    }
    float m = smoothstep(0.04,-0.04,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    // the body EATS light: near-black with a searing, breathing rim
    vec3 body = vec3(0.012,0.006,0.02);
    body += vec3(0.03,0.01,0.05) * fbm(q*3.0 - phase*0.1); // faint void currents
    float rim = smoothstep(0.0,0.05,-d)*smoothstep(-0.11,-0.04,d);
    rim *= 0.55 + 0.8*fbm(vec2(atan(q.y,q.x)*2.2, phase*0.2)+seed*5.0);
    col = body + tint*rim*1.7;
    // phase-2: molten cracks tear open
    if(aux > 0.01){
      float crack = smoothstep(0.55,0.95,fbm(q*4.0+seed*9.0+phase*0.05));
      col += tint * crack * aux * 3.0;
      float coreGlow = smoothstep(0.34,0.0,length(q))*aux;
      col += mix(tint,vec3(1.0),0.5)*coreGlow*1.8;
    }
    cov = m*0.995; // nearly opaque — it occludes the glow behind it
  }
  else if(kind == 27){ // CRYSTAL CLUSTER — grounded mineral spears, lit from within
    vec2 q = p; q.y = -q.y;
    float d = 1e9;
    float coreGlow = 0.0;
    for(int i=0;i<4;i++){
      float fi = float(i);
      float bx = (fi-1.5)*0.26 + (hash12(vec2(seed,fi))-0.5)*0.14;
      float h = 0.55 + 0.75*hash12(vec2(seed*7.0,fi));
      float lean = (hash12(vec2(fi,seed*3.0))-0.5)*0.55;
      vec2 root = vec2(bx, -0.72);
      vec2 tip  = vec2(bx + lean*h*0.5, -0.72 + h*1.5);
      tip.y = min(tip.y, 0.80); // never reach the quad edge
      float sd = sdSeg(q, root, tip) - (0.14 - 0.11*clamp((q.y-root.y)/(tip.y-root.y+1e-3),0.0,1.0));
      d = min(d, sd);
      coreGlow += smoothstep(0.30,0.0,sdSeg(q, mix(root,tip,0.15), mix(root,tip,0.7))) * (0.4+0.6*hash12(vec2(fi,seed)));
    }
    // rubble mound at the base grounds the formation
    d = smin(d, sdCircle(q+vec2(0.0,0.68), 0.26+fbm3(q*4.0+seed*9.0)*0.07), 0.14);
    float m = smoothstep(0.02,-0.02,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float facet = 0.5+0.5*sin((q.x+q.y*0.6)*24.0+seed*30.0);
    float breathe2 = 0.6+0.4*sin(phase*0.5+seed*9.0);
    // solid mineral body: dark glass with banded facets
    vec3 body = mix(vec3(0.05,0.06,0.13), tint*0.42, 0.25+0.38*facet);
    body += tint * coreGlow * 0.6 * breathe2 * aux;   // inner light
    body *= 0.9 + 0.2*fbm3(q*6.0+seed);
    float rim = smoothstep(0.0,0.045,-d)*smoothstep(-0.11,-0.035,d);
    col = body + mix(tint,vec3(1.0),0.3)*rim*(0.45+0.4*breathe2)*aux;
    // contact shadow where it meets the ground
    col *= 1.0 - 0.5*smoothstep(-0.45,-0.80,q.y);
    cov = m*0.985;
  }
  else if(kind == 28){ // ROCKFORM — lobed strata outcrop, heavily eroded silhouette
    vec2 q = p; q.y = -q.y;
    float wob = fbm(q*1.3+seed*8.0)*0.26;
    float d = sdCircle(q*vec2(0.72,1.30)+vec2(0.08,0.30), 0.40+wob);
    d = smin(d, sdCircle(q*vec2(0.85,1.45)+vec2(-0.28,0.42), 0.28+wob*0.7), 0.18);
    d = smin(d, sdCircle(q*vec2(0.95,1.6)+vec2(0.34,0.55), 0.20+wob*0.5), 0.16);
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float strat = 0.5+0.5*sin(q.y*13.0 + fbm(q*2.2+seed)*8.0 + q.x*1.5);
    vec3 body = mix(vec3(0.020,0.016,0.040), vec3(0.065,0.055,0.115), smoothstep(0.25,0.85,strat));
    body *= 0.75+0.4*fbm3(q*4.0+seed*4.0);
    // biolum dust settled in the crevices
    float dust = smoothstep(0.74,0.93,fbm(q*4.5+seed*13.0));
    body += vec3(0.06,0.26,0.23) * dust * (0.5+0.5*sin(phase*0.4+seed*20.0));
    // sky rim light along the upper silhouette
    float rim = smoothstep(0.0,0.06,-d)*smoothstep(-0.14,-0.05,d)*smoothstep(-0.15,0.55,q.y);
    col = body + vec3(0.12,0.34,0.38)*rim*0.9;
    // sleeping reef: a crest of tiny polyp lights along the upper surface
    float nearEdge = smoothstep(0.0,-0.06,d)*smoothstep(-0.26,-0.10,d)*smoothstep(-0.1,0.35,q.y);
    vec2 pc = floor(q*9.0+seed*31.0);
    float pd = hash12(pc);
    if(pd > 0.72 && nearEdge > 0.05){
      vec2 cuv = fract(q*9.0+seed*31.0)-0.5;
      float pr = length(cuv - (vec2(hash12(pc+3.0),hash12(pc+5.0))-0.5)*0.5);
      float breathe3 = 0.5+0.5*sin(phase*(0.6+pd)+pd*40.0);
      vec3 pcol = mix(vec3(0.10,0.55,0.50), vec3(0.55,0.25,0.65), step(0.88,pd));
      col += pcol * smoothstep(0.16,0.0,pr) * breathe3 * nearEdge * 1.6;
    }
    col *= 1.0 - 0.45*smoothstep(-0.35,-0.75,q.y); // contact shadow
    cov = m*0.99;
  }
  else if(kind == 26){ // SHADOW — dark aura disc (premultiplied darkness)
    float r = length(p);
    float fall = pow(max(0.0,1.0-r),2.6) * (0.7+0.3*fbm3(p*2.2+phase*0.3));
    col = vec3(0.010,0.004,0.02) * fall;
    cov = fall * vB.w * 0.8; // aux = darkness strength
  }
  else if(kind == 30){ // THE TIDECALLER — crescent tide-serpent, cold light
    vec2 q = p*vec2(0.95,1.05);
    q.y += 0.04*sin(phase*0.8);
    float body = sdCircle(q, 0.52+fbm(q*2.0+phase*0.1)*0.08);
    float carve = sdCircle(q-vec2(0.16,-0.10), 0.44);
    float d = max(body, -carve);
    float mane = 1e9;
    for(int i=0;i<6;i++){
      float fi=float(i);
      float a = -0.5 - fi*0.28;
      vec2 root = vec2(cos(a),sin(a))*0.48;
      vec2 tip = root + vec2(cos(a-0.9), sin(a-0.9)) * (0.30+0.12*sin(phase*1.3+fi));
      mane = min(mane, sdSeg(q, root, tip) - (0.05 - 0.028*fi/6.0));
    }
    d = smin(d, mane, 0.08);
    float m = smoothstep(0.03,-0.03,d);
    float coreG = smoothstep(0.35,0.0,length(q-vec2(-0.15,0.05)));
    if(m<=0.0 && coreG<=0.01 && aux<=0.001){ frag=vec4(0.0); return; }
    float p2 = step(0.5, vB.x); // rot slot carries the phase-2 flag
    vec3 body3 = mix(vec3(0.03,0.07,0.10), tint*0.4, smoothstep(0.6,-0.2,length(q)));
    body3 += tint*coreG*(1.2+p2*1.4);
    float rim = smoothstep(0.0,0.06,-d)*smoothstep(-0.14,-0.05,d);
    col = body3*m + mix(tint,vec3(1.0),0.5)*rim*(0.8+0.5*p2)*m;
    cov = m*0.96;
    if(aux > 0.001){ // the tide-shield
      float br = 0.9 + 0.03*sin(phase*2.2);
      float bub = abs(length(p) - br);
      float fresnel = smoothstep(0.12,0.0,bub) * (0.6+0.4*sin(atan(p.y,p.x)*8.0 - phase*3.0)*0.4);
      col += vec3(0.5,0.9,1.0) * fresnel * (0.35 + aux*1.1);
      cov = clamp(cov + fresnel*0.3*aux, 0.0, 1.0);
    }
  }
  else if(kind == 31){ // THE MYCELIAL / sporeling — fungal mass, gilled cap
    vec2 q = p; q.y = -q.y;
    float child = step(0.5, aux); // sporelings are simpler, brighter
    float wob = fbm(q*2.2 + seed*5.0 + phase*0.06)*0.10;
    // cap dome
    float cap = sdCircle(q*vec2(0.82,1.15)-vec2(0.0,0.12), 0.5+wob);
    cap = max(cap, -(q.y+0.62)); // flat under-line
    // base hyphae mound
    float d = smin(cap, sdCircle(q*vec2(0.9,1.5)+vec2(0.0,0.72), 0.34+wob*0.6), 0.16);
    // spore bulbs clustered on the crown
    float bulbs = 0.0;
    for(int i=0;i<5;i++){
      float fi=float(i);
      vec2 c = vec2((fi-2.0)*0.19 + sin(seed*9.0+fi)*0.05, 0.42 + 0.10*hash12(vec2(seed,fi)));
      float beat = 0.5+0.5*sin(phase*1.4+fi*1.9);
      float bd = sdCircle(q-c, 0.09+0.03*beat);
      d = smin(d, bd, 0.07);
      bulbs += smoothstep(0.10,0.0,length(q-c)) * beat;
    }
    float m = smoothstep(0.03,-0.03,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    float p2 = step(0.5, vB.x);
    // gill lines radiating under the cap
    float ang = atan(q.y-0.05, q.x);
    float gills = pow(0.5+0.5*sin(ang*22.0 + seed*10.0), 4.0) * smoothstep(0.1,-0.35,q.y) * smoothstep(-0.65,-0.3,q.y);
    vec3 body = mix(vec3(0.05,0.06,0.03), tint*(0.30+0.15*child), smoothstep(0.7,0.0,length(q)));
    body *= 0.8 + 0.35*fbm3(q*5.0+seed*3.0);
    col = body + tint*gills*(0.5+0.4*p2) + tint*bulbs*(0.9+0.9*p2+0.4*child);
    float rim = smoothstep(0.0,0.07,-d)*smoothstep(-0.16,-0.06,d);
    col += tint*rim*0.6;
    cov = m*0.96;
  }
  else if(kind == 29){ // FROND — foreground kelp silhouette, haze-rimmed
    vec2 q = p; q.y = -q.y;
    float d = 1e9;
    for(int i=0;i<5;i++){
      float fi = float(i);
      float bx = (fi-2.0)*0.28 + (hash12(vec2(seed,fi))-0.5)*0.2;
      float h = 0.50 + 0.44*hash12(vec2(seed*3.0,fi));
      float sway = sin(phase*0.4 + fi*1.7 + seed*9.0)*0.12;
      vec2 a = vec2(bx, -1.0);
      vec2 b = vec2(bx + sway*0.5, -1.0 + h*0.9);
      vec2 c = vec2(bx + sway*1.6, min(0.62, -1.0 + h*1.7));
      float w = 0.06*(1.0 - 0.45*smoothstep(-1.0, 0.7, q.y));
      float sd = min(sdSeg(q,a,b), sdSeg(q,b,c)) - w;
      for(int j=0;j<3;j++){
        float fj = float(j);
        vec2 fp = mix(b, c, fj/3.0);
        float fa = (hash12(vec2(fi*7.0+fj, seed*5.0))-0.5)*2.4;
        vec2 ftip = fp + vec2(cos(fa), abs(sin(fa))*0.7)*0.20*(0.6+0.4*hash12(vec2(fj,fi)));
        sd = min(sd, sdSeg(q, fp, ftip) - 0.032);
      }
      d = min(d, sd);
    }
    float m = smoothstep(0.015,-0.015,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    vec3 body = vec3(0.012,0.018,0.032); // near-black against the glow
    float rim = smoothstep(0.0,0.03,-d)*smoothstep(-0.07,-0.025,d);
    col = body + vec3(0.06,0.20,0.22)*rim*aux;
    cov = m*0.995;
  }
  else if(kind == 12){ // CHILL SPIRE — faceted crystal polyp
    vec2 q = p; q.y = -q.y; // grow upward
    float wob = fbm3(q*2.5 + seed*7.0)*0.05;
    // main crystal: blade tapering to a point, rounded root
    float apex = 0.78;
    float half1 = mix(0.26, 0.0, smoothstep(-0.45, apex, q.y)) + 0.02;
    float d = abs(q.x) - half1 - wob;
    d = max(d, q.y - apex);
    d = max(d, -0.60 - q.y); // bound the blade below — else it runs off the quad
    d = smin(d, sdCircle(q + vec2(0.0, 0.52), 0.26 + wob), 0.14);
    // two side shards
    for(int i=0;i<2;i++){
      float sgn = i==0 ? -1.0 : 1.0;
      vec2 r = q - vec2(sgn*0.34, -0.28);
      float a = sgn*0.5;
      vec2 rr = vec2(r.x*cos(a)-r.y*sin(a), r.x*sin(a)+r.y*cos(a));
      float halfW = 0.13 - 0.16*smoothstep(-0.3,0.5,rr.y);
      float d2 = max(abs(rr.x)-halfW-wob, abs(rr.y)-0.38);
      d = min(d, d2);
    }
    float m = smoothstep(0.02,-0.02,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    // faceted interior: banded light + inner frost glow
    float facet = 0.6 + 0.4*sin(q.x*14.0 + q.y*9.0 + seed*20.0);
    float inner = smoothstep(0.5,0.0,length(q*vec2(1.6,0.9)+vec2(0.0,0.15)));
    vec3 body = mix(vec3(0.06,0.10,0.16), tint*0.55, 0.35 + 0.4*facet);
    body += tint * inner * (0.5 + 1.2*aux);
    float tip = smoothstep(0.22,0.0,length(q-vec2(0.0,0.66)));
    body += mix(tint,vec3(1.0),0.5) * tip * (0.8 + 2.2*aux*aux);
    float rim = smoothstep(0.0,0.05,-d)*smoothstep(-0.13,-0.04,d);
    body += tint*rim*0.7;
    col = body;
    cov = m*0.96;
  }
  else if(kind == 13){ // LANCE URCHIN — spined focus organism
    float ang = atan(p.y,p.x);
    float r = length(p);
    float d = 1e9;
    float tipGlow = 0.0;
    for(int i=0;i<14;i++){
      float fi = float(i);
      float a = fi/14.0*6.2832 + sin(phase*0.5+fi)*0.03;
      float len = 0.55 + 0.34*hash12(vec2(seed,fi)) + 0.06*sin(phase*1.5+fi*2.2);
      vec2 dir = vec2(cos(a), sin(a)*0.85);
      float sp = sdSeg(p, dir*0.14, dir*len) - (0.045 - 0.035*smoothstep(0.1,len,r));
      d = min(d, sp);
      tipGlow += smoothstep(0.07,0.0,length(p-dir*len));
    }
    float core = sdCircle(p*vec2(1.0,1.1), 0.26 + fbm3(p*5.0+phase*0.3)*0.04);
    d = smin(d, core, 0.06);
    float m = smoothstep(0.015,-0.015,d);
    float eye = smoothstep(0.15,0.0,length(p*vec2(1.0,1.1)));
    if(m<=0.0 && eye<=0.01){ frag=vec4(0.0); return; }
    vec3 body = mix(vec3(0.07,0.02,0.10), tint*0.40, smoothstep(0.6,0.05,r));
    float rim = smoothstep(0.0,0.05,-d)*smoothstep(-0.10,-0.03,d);
    col = body*m + tint*rim*0.55*m;
    col += mix(tint,vec3(1.0),0.65) * eye * (0.9 + 2.6*aux*aux);
    col += tint * tipGlow * (0.3 + 1.5*aux);
    cov = clamp(m*0.95 + eye*0.4, 0.0, 1.0);
  }
  else if(kind == 14){ // EMBER BLOOM — mortar flower, petals cup an amber throat
    vec2 q = p; q.y = -q.y;
    float d = 1e9;
    for(int i=0;i<5;i++){
      float fi = float(i);
      float a = (fi-2.0)*0.42 + sin(phase*0.6+fi*1.9)*0.05;
      vec2 c = vec2(sin(a)*0.42, 0.10 + cos(a)*0.16);
      vec2 r = q - c;
      vec2 rr = vec2(r.x*cos(-a)-r.y*sin(-a), r.x*sin(-a)+r.y*cos(-a));
      float petal = length(rr*vec2(1.6,1.0) + vec2(0.0,-0.14)) - (0.30 + fbm3(q*4.0+fi+seed*9.0)*0.06);
      d = min(d, petal);
    }
    // base bulb
    d = smin(d, sdCircle(q+vec2(0.0,0.42), 0.30), 0.12);
    float m = smoothstep(0.02,-0.02,d);
    float throat = smoothstep(0.34,0.0,length(q-vec2(0.0,0.16)));
    if(m<=0.0 && throat<=0.01){ frag=vec4(0.0); return; }
    float veins = 0.5+0.5*sin(atan(q.y-0.1,q.x)*10.0+phase*0.4);
    vec3 body = mix(vec3(0.09,0.04,0.08), tint*0.38, smoothstep(-0.5,0.4,q.y));
    body *= 0.8 + 0.3*veins*smoothstep(0.2,0.6,length(q-vec2(0.0,0.16)));
    col = body*m;
    col += mix(tint,vec3(1.0,0.9,0.6),0.4) * throat * (0.9 + 2.8*aux*aux) * m;
    float rim = smoothstep(0.0,0.06,-d)*smoothstep(-0.14,-0.05,d);
    col += tint*rim*0.5*m;
    cov = m*0.96;
  }
  else if(kind == 15){ // ACID BRAMBLE — thorn mound with sap-droplet tips
    vec2 q = p; q.y = -q.y;
    float d = sdCircle(q+vec2(0.0,0.45), 0.42 + fbm3(q*3.0+seed*5.0)*0.10); // mound
    float dropGlow = 0.0;
    for(int i=0;i<6;i++){
      float fi = float(i);
      float a = (fi/6.0-0.5)*2.4 + sin(phase*0.5+fi*2.0)*0.06;
      float len = 0.55 + 0.25*hash12(vec2(seed*3.0,fi));
      vec2 root = vec2(sin(a)*0.30, -0.30);
      vec2 tip = root + vec2(sin(a+0.3*sin(fi))*len*0.7, len*0.8);
      float thorn = sdSeg(q, root, tip) - (0.085 - 0.065*smoothstep(0.0,1.0,distance(q,root)/len));
      d = smin(d, thorn, 0.06);
      dropGlow += smoothstep(0.10,0.0,length(q-tip)) * (0.6+0.4*sin(phase*2.0+fi*2.6));
    }
    float m = smoothstep(0.02,-0.02,d);
    if(m<=0.0 && dropGlow<=0.01){ frag=vec4(0.0); return; }
    vec3 body = mix(vec3(0.05,0.06,0.03), tint*0.22, smoothstep(-0.6,0.5,q.y)*0.7);
    body *= 0.8 + 0.35*fbm3(q*7.0+seed);
    float rim = smoothstep(0.0,0.05,-d)*smoothstep(-0.12,-0.04,d);
    col = body*m + tint*rim*(0.4+0.3*aux)*m;
    col += mix(tint,vec3(1.0),0.3) * dropGlow * (0.5 + 1.8*aux);
    cov = clamp(m*0.95 + dropGlow*0.25, 0.0, 1.0);
  }
  else if(kind == 16){ // RESONANT BULB — singing orb on a stalk
    vec2 q = p; q.y = -q.y;
    float stalk = sdSeg(q, vec2(0.0,-0.75), vec2(0.03*sin(phase*0.8),-0.18)) - 0.07;
    float orbR = 0.42 + 0.02*sin(phase*1.6) + fbm3(vec2(atan(q.y-0.18,q.x)*1.3, phase*0.15)+seed*4.0)*0.07;
    float orb = sdCircle(q-vec2(0.0,0.18), orbR);
    float d = smin(stalk, orb, 0.10);
    float m = smoothstep(0.02,-0.02,d);
    if(m<=0.0){ frag=vec4(0.0); return; }
    vec2 oq = (q-vec2(0.0,0.18))/orbR;
    float rr = length(oq);
    // concentric singing membranes
    float memb = pow(0.5+0.5*sin(rr*14.0 - phase*2.2), 3.0) * smoothstep(1.0,0.3,rr);
    float core = smoothstep(0.30,0.0,rr);
    vec3 body = mix(vec3(0.08,0.05,0.13), tint*0.30, 0.5);
    col = body*m;
    col += tint * memb * (0.5+0.9*aux) * m;
    col += mix(tint,vec3(1.0),0.6) * core * (1.0+1.4*aux) * m;
    float rim = smoothstep(0.0,0.04,-d)*smoothstep(-0.09,-0.03,d);
    col += tint*rim*0.8*m;
    cov = m*0.92;
  }
  else if(kind == 6){ // HEART — the luminous organism the whole grove serves
    float integ = aux; // 1 healthy → 0 dying
    vec3 hcol = mix(vec3(1.0,0.25,0.18), tint, integ);
    vec2 hq = p*vec2(1.0,1.08);
    float r = length(hq);
    float ang = atan(hq.y,hq.x);
    float beat = pow(0.5+0.5*sin(uT*(1.6+(1.0-integ)*2.4)), 3.0);
    // radiant light-tendrils drifting off the core
    float tend = 0.0;
    for(int i=0;i<7;i++){
      float fi = float(i);
      float ta = fi/7.0*6.2832 + uT*0.12 + sin(uT*0.35+fi*1.9)*0.22;
      float dAng = abs(mod(ang - ta + 3.14159, 6.2832) - 3.14159);
      float reach = 0.55 + 0.35*sin(uT*0.5+fi*2.4);
      tend += smoothstep(0.34,0.0,dAng) * smoothstep(0.95,0.35,r) * smoothstep(0.10,0.30,r) * reach;
    }
    // layered membranes, wobbling
    float wob = fbm(hq*2.4 + uT*0.15)*0.09;
    float memb1 = smoothstep(0.030,0.0,abs(r-0.80-wob)) * (0.6+0.4*sin(uT*1.3));
    float memb2 = smoothstep(0.026,0.0,abs(r-0.58+wob*0.7)) * (0.5+0.5*sin(uT*1.1+2.0));
    // inner galaxy: swirling motes
    float swirl = fbm(vec2(ang*1.5 + uT*0.25, r*4.0 - uT*0.18));
    float veil = smoothstep(0.75,0.10,r) * swirl * 0.8;
    float nucleus = smoothstep(0.34+beat*0.07,0.0,r);
    float flicker = 1.0 - (1.0-integ)*0.4*step(0.7, hash12(vec2(floor(uT*14.0), seed)));
    col = hcol*veil*0.7 + hcol*tend*0.55*(0.7+0.3*beat)
        + hcol*memb1*1.3 + mix(hcol,vec3(1.0),0.3)*memb2*0.8
        + mix(hcol,vec3(1.0,0.97,0.9),0.65)*nucleus*(1.6+beat*2.0);
    col *= flicker;
    cov = clamp(veil*0.5 + tend*0.3 + memb1*0.5 + nucleus*0.85, 0.0, 1.0);
  }
  else if(kind == 7){ // GLOW PARTICLE / SPORE
    float r = length(p);
    float fall = pow(max(0.0,1.0-r),2.0);
    col = tint * fall * (0.8+0.2*sin(phase));
    cov = 0.0; // pure additive
  }
  else if(kind == 8){ // PROJECTILE SEED
    vec2 q = p*vec2(0.7,1.5);
    float r = length(q);
    float core = smoothstep(0.35,0.0,r);
    float halo = pow(max(0.0,1.0-length(p)),1.6);
    col = mix(tint, vec3(1.0), core*0.75) * (core*2.6) + tint*halo*0.8;
    cov = 0.0;
  }
  else if(kind == 9){ // PORTAL — torn glowing gate
    vec2 q = p*vec2(1.25,0.9);
    float r = length(q);
    float tear = fbm(vec2(atan(q.y,q.x)*1.2 + uT*0.3, r*3.0)+seed);
    float ringM = smoothstep(0.10,0.0,abs(r-0.66-tear*0.12));
    float inner = smoothstep(0.6,0.0,r)*0.5;
    vec3 icol = mix(tint, vec3(0.6,0.2,0.9), 0.4);
    col = icol*ringM*(1.2+0.5*sin(uT*2.0+seed*10.0)) + icol*inner*fbm(q*4.0-uT*0.25);
    cov = clamp(ringM*0.6+inner*0.4,0.0,1.0)*0.85;
  }
  else if(kind == 10){ // MOTE — death ember
    float r = length(p);
    float flick = 0.7+0.5*sin(phase*7.0+seed*20.0);
    float fall = pow(max(0.0,1.0-r),2.4);
    col = tint * fall * flick;
    cov = 0.0;
  }
  else if(kind == 11){ // SEG — lightning/beam segment (quad along seg axis)
    float across = abs(p.y);
    float along = smoothstep(1.0,0.85,abs(p.x));
    float core = smoothstep(0.35,0.0,across)*along;
    float halo = smoothstep(1.0,0.1,across)*along;
    col = mix(tint,vec3(1.0),0.6)*core*2.2 + tint*halo*0.55;
    cov = 0.0;
  }

  // atmospheric haze: entities near the horizon fade toward haze colour
  float hazeAmt = smoothstep(0.45, 0.05, vDepth) * 0.45;
  col = mix(col, vec3(0.10,0.28,0.34)*cov, hazeAmt*step(0.001,cov));
  frag = vec4(col, cov);
}
`;

// ---------------------------------------------------------------- trails
export const FS_TRAIL_DECAY = COMMON + `
uniform sampler2D uPrev; uniform float uDecayR; uniform float uDecayG; uniform float uDecayB;
in vec2 vUv; out vec4 frag;
void main(){
  vec3 c = texture(uPrev, vUv).rgb;
  c *= vec3(uDecayR,uDecayG,uDecayB);
  c = max(c - 0.0008, 0.0); // kill lingering ghosts
  frag = vec4(c, 1.0);
}
`;

// ---------------------------------------------------------------- post stack
export const FS_BRIGHT = COMMON + `
uniform sampler2D uScene; uniform sampler2D uTrail; uniform float uThresh; uniform float uKnee;
in vec2 vUv; out vec4 frag;
void main(){
  vec3 c = texture(uScene, vUv).rgb + texture(uTrail, vUv).rgb;
  float l = dot(c, vec3(0.2126,0.7152,0.0722));
  float k = max(0.0, l - uThresh);
  k = k*k / (k + uKnee + 1e-4);
  frag = vec4(c * (k / max(l,1e-4)), 1.0);
}
`;

export const FS_BLUR = COMMON + `
uniform sampler2D uTex; uniform vec2 uDir; uniform vec2 uTexel;
in vec2 vUv; out vec4 frag;
void main(){
  vec2 off = uDir * uTexel;
  vec3 c = texture(uTex, vUv).rgb * 0.2270270270;
  c += texture(uTex, vUv + off*1.3846153846).rgb * 0.3162162162;
  c += texture(uTex, vUv - off*1.3846153846).rgb * 0.3162162162;
  c += texture(uTex, vUv + off*3.2307692308).rgb * 0.0702702703;
  c += texture(uTex, vUv - off*3.2307692308).rgb * 0.0702702703;
  frag = vec4(c,1.0);
}
`;

export const FS_POST = COMMON + `
uniform sampler2D uScene; uniform sampler2D uTrail;
uniform sampler2D uB1; uniform sampler2D uB2; uniform sampler2D uB3;
uniform float uT; uniform float uAberr; uniform float uBloomAmt;
in vec2 vUv; out vec4 frag;
// per-channel filmic (Uncharted2) with white point ~5 — keeps saturated
// neon hues from washing to white the way luminance tonemaps do
vec3 filmicCurve(vec3 x){
  const float A=0.15,B=0.50,C=0.10,D=0.20,E=0.02,F=0.30;
  return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}
vec3 filmic(vec3 x){
  return clamp(filmicCurve(x) / filmicCurve(vec3(5.0)), 0.0, 1.0);
}
vec3 fetch(vec2 uv){
  return texture(uScene, uv).rgb + texture(uTrail, uv).rgb;
}
void main(){
  vec2 uv = vUv;
  vec2 fromC = uv - 0.5;
  // chromatic aberration on heavy impacts (uAberr decays in JS)
  vec3 col;
  if(uAberr > 0.0005){
    vec2 o = fromC * uAberr;
    col = vec3(fetch(uv+o).r, fetch(uv).g, fetch(uv-o).b);
  } else {
    col = fetch(uv);
  }
  // two-tier bloom: tight hot core + wide soft atmosphere
  vec3 bloom = texture(uB1,uv).rgb*0.95 + texture(uB2,uv).rgb*0.55 + texture(uB3,uv).rgb*1.25;
  col += bloom * uBloomAmt;
  // grade: lift shadows toward indigo, gentle teal-orange split
  col = filmic(col*1.85);
  col = pow(col, vec3(0.92,0.96,1.0));
  col += vec3(0.009,0.006,0.024) * (1.0-col);
  // vignette
  vec2 vC2 = fromC*vec2(1.0,1.22);
  float vig = 1.0 - dot(vC2,vC2)*1.0;
  col *= clamp(vig,0.0,1.0);
  // fine grain
  float g = (hash12(uv*vec2(1920.0,1080.0)+fract(uT)*7.0)-0.5) * 0.015;
  col += g;
  frag = vec4(col, 1.0);
}
`;

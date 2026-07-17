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
out vec2 vUv; out vec4 vB; out vec4 vC; out float vDepth;
void main(){
  vUv = aCorner;
  vB = iB; vC = iC;
  float cr = cos(iB.x), sr = sin(iB.x);
  vec2 local = vec2(aCorner.x*iA.z, aCorner.y*iA.w);
  vec2 rot = vec2(local.x*cr - local.y*sr, local.x*sr + local.y*cr);
  vec2 world = iA.xy + rot;
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
out vec2 vUv; out float vDepth;
void main(){
  vUv = aUv;
  vDepth = clamp(aPos.y / uRes.y, 0.0, 1.0);
  vec2 ndc = (aPos - uCam) * uZoom / (uRes*0.5);
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
}
`;

// ---------------------------------------------------------------- background
export const FS_BG = COMMON + `
uniform float uT; uniform vec2 uReso; uniform float uHorizon; uniform vec2 uPar;
in vec2 vUv; out vec4 frag;
// sky gradient, aurora-nebula, far ridgelines, spore-stars
void main(){
  vec2 uv = vUv; // 0..1, y up from bottom
  float horizon = uHorizon; // fraction of screen height that is sky
  float horizonLine = 1.0 - horizon;
  float skyY = clamp((uv.y - horizonLine) / max(horizon,1e-3), 0.0, 1.0); // 0 horizon → 1 top
  // deep indigo → darker zenith (values sit above the filmic toe)
  vec3 sky = mix(vec3(0.30,0.17,0.46), vec3(0.07,0.05,0.16), pow(skyY,0.75));
  // nebula: two fbm layers drifting at different rates (parallax offset uPar)
  vec2 np = vec2(uv.x*2.6 + uPar.x*0.00012, uv.y*6.0);
  float n1 = fbm(np*2.0 + vec2(uT*0.008, uT*0.004));
  float n2 = fbm(np*4.5 - vec2(uT*0.013, 0.0) + 31.7);
  float neb = smoothstep(0.45, 0.85, n1) * (0.5 + 0.5*n2);
  vec3 nebCol = mix(vec3(0.55,0.16,0.95), vec3(0.12,0.55,0.85), n2);
  sky += nebCol * neb * 0.55;
  // spore-stars, twinkling
  vec2 sp = uv*uReso*0.5 + vec2(uPar.x*0.03,0.0);
  vec2 cell = floor(sp/22.0);
  float star = step(0.976, hash12(cell));
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
  // teal bioluminescent haze rising off the world — drawn over ridge bases
  float hg = exp(-max(0.0, uv.y-horizonLine)*26.0);
  sky += vec3(0.10,0.46,0.50) * hg * (0.8 + 0.2*sin(uT*0.23));
  // below the horizon, converge on the ground's far-haze colour
  float below = smoothstep(0.0, 0.012, horizonLine - uv.y);
  sky = mix(sky, vec3(0.10,0.28,0.34), below);
  frag = vec4(sky, 1.0);
}
`;

// ---------------------------------------------------------------- ground
export const FS_GROUND = COMMON + `
uniform float uT; uniform float uHorizon; uniform vec2 uReso;
in vec2 vUv; out vec4 frag;
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
  // faint teal ambient sheen so the plane never reads as void
  base += vec3(0.012,0.030,0.034);
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
  // atmospheric haze toward horizon — far edge must equal the bg's
  // below-horizon colour vec3(0.10,0.28,0.34) or a seam appears
  vec3 haze = vec3(0.10,0.28,0.34);
  base = mix(haze, base, smoothstep(0.0, 0.42, near));
  // continuation of the bg horizon glow onto the far ground (same colour +
  // time modulation as FS_BG's hg term, decay matched across the seam)
  base += vec3(0.10,0.46,0.50) * (0.8 + 0.2*sin(uT*0.23)) * exp(-near*22.0);
  frag = vec4(base, 1.0);
}
`;

// ---------------------------------------------------------------- path ribbon
export const FS_PATH = COMMON + `
uniform float uT;
in vec2 vUv; in float vDepth; out vec4 frag;
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
  // faint center channel glow
  veinCol += vec3(0.04,0.30,0.34) * smoothstep(0.5,0.0,abs(across)) * 0.35;
  // rim lichen: bright organic edge where path meets ground
  float rim = smoothstep(0.30,0.06,abs(edge - er*0.35 - 0.10));
  veinCol += vec3(0.10,0.45,0.40) * rim * (0.4+0.25*sin(uT*0.9 + along*80.0));
  vec3 col = bed + veinCol;
  // haze with depth
  col = mix(col, vec3(0.10,0.28,0.34)*0.6, (1.0-vDepth)*0.35);
  frag = vec4(col*mask, mask);
}
`;

// ---------------------------------------------------------------- ground light
export const FS_LIGHT = COMMON + `
in vec2 vUv; in vec4 vB; in vec4 vC; out vec4 frag;
// radial ground illumination; aux = intensity; extra = ring? (0 disc, 1 ring with aux radius)
void main(){
  float r = length(vUv);
  if(vC.a < 0.5){
    float fall = pow(max(0.0, 1.0 - r), 2.2);
    // subtle noise breakup so pools of light look organic on the ground
    fall *= 0.8 + 0.35*fbm3(vUv*3.0 + vB.y);
    frag = vec4(vC.rgb * fall * vB.w, 0.0);
  } else {
    float ring = smoothstep(0.10, 0.0, abs(r - vB.w));
    ring *= 0.75 + 0.4*fbm3(vUv*6.0 + vB.y);
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
    float rim = smoothstep(0.0,0.14,-d)*smoothstep(-0.30,-0.10,d);
    vec3 membrane = tint*0.16 + vec3(0.01,0.01,0.03);
    col = membrane + tint*core*(1.6+0.7*sin(phase*3.1)) + tint*rim*0.9;
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
    vec3 shellCol = mix(tint*0.13, vec3(0.02,0.015,0.045), shell*0.8);
    col = shellCol + tint*seam*pulse*1.5;
    float rim = smoothstep(0.0,0.10,-d)*smoothstep(-0.22,-0.08,d);
    col += tint*rim*0.5;
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
    col = tint*body*0.35 + tint*core*2.0 + tint*tail*0.5;
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
    vec3 blade = mix(vec3(0.015,0.02,0.05), tint*0.30, 0.4+aux*0.5);
    col = blade*m + tint*glow*(0.5+1.6*aux);
    cov = clamp(m*0.85 + glow*0.3, 0.0, 1.0);
  }
  else if(kind == 6){ // HEART — the thing we defend
    float integ = aux; // 1 healthy → 0 dying
    vec3 hcol = mix(vec3(1.0,0.25,0.18), tint, integ);
    float r = length(p*vec2(1.0,1.12));
    float wob = fbm(p*2.4 + uT*0.15)*0.10;
    float membrane = smoothstep(0.035,0.0,abs(r-0.82-wob)) * (0.6+0.4*sin(uT*1.3));
    float veil = smoothstep(0.8,0.15,r) * fbm(p*3.5 - uT*0.1) * 0.5;
    float beat = pow(0.5+0.5*sin(uT*(1.6+ (1.0-integ)*2.4)), 3.0);
    float nucleus = smoothstep(0.40+beat*0.06,0.0,r);
    float flicker = 1.0 - (1.0-integ)*0.4*step(0.7, hash12(vec2(floor(uT*14.0), seed)));
    col = hcol*veil*0.5 + hcol*membrane*1.2 + mix(hcol,vec3(1.0,0.95,0.85),0.6)*nucleus*(1.3+beat*1.6);
    col *= flicker;
    cov = clamp(veil*0.6 + membrane*0.5 + nucleus*0.8, 0.0, 1.0);
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
  vec3 bloom = texture(uB1,uv).rgb*0.5 + texture(uB2,uv).rgb*0.75 + texture(uB3,uv).rgb*1.0;
  col += bloom * uBloomAmt;
  // grade: lift shadows toward indigo, gentle teal-orange split
  col = filmic(col*1.75);
  col = pow(col, vec3(0.92,0.96,1.0));
  col += vec3(0.012,0.008,0.030) * (1.0-col);
  // vignette
  float vig = 1.0 - dot(fromC,fromC)*0.85;
  col *= clamp(vig,0.0,1.0);
  // fine grain
  float g = (hash12(uv*vec2(1920.0,1080.0)+fract(uT)*7.0)-0.5) * 0.015;
  col += g;
  frag = vec4(col, 1.0);
}
`;

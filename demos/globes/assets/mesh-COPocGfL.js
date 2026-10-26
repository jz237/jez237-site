var e=-.6,t=.99125;Math.sqrt(t*t-e*e);var n=.95,r={BARK:1,WOOD_END:2,ROCK:3,LEAF_BIG:4,LEAF_SMALL:5,STEM:6,ROOT:7,HEATER:8,HEATER_LAMP:9,SPONGE:10,TUBE:11,SUCTION:12};function i(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}var a=(()=>{let e=i(77),t=Array.from({length:256},(e,t)=>t);for(let n=255;n>0;n--){let r=Math.floor(e()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return Uint8Array.from([...t,...t])})(),o=e=>e*e*e*(e*(e*6-15)+10),s=(e,t,n,r)=>{let i=e<8?t:n,a=e<4?n:e===12||e===14?t:r;return(e&1?-i:i)+(e&2?-a:a)};function c(e,t,n){let r=Math.floor(e)&255,i=Math.floor(t)&255,c=Math.floor(n)&255;e-=Math.floor(e),t-=Math.floor(t),n-=Math.floor(n);let l=o(e),u=o(t),d=o(n),f=a[r]+i,p=a[f]+c,m=a[f+1]+c,h=a[r+1]+i,g=a[h]+c,_=a[h+1]+c,v=(e,t,n)=>e+(t-e)*n;return v(v(v(s(a[p]&15,e,t,n),s(a[g]&15,e-1,t,n),l),v(s(a[m]&15,e,t-1,n),s(a[_]&15,e-1,t-1,n),l),u),v(v(s(a[p+1]&15,e,t,n-1),s(a[g+1]&15,e-1,t,n-1),l),v(s(a[m+1]&15,e,t-1,n-1),s(a[_+1]&15,e-1,t-1,n-1),l),u),d)}function l(e,t,n,r=4,i=.5){let a=0,o=1,s=0;for(let l=0;l<r;l++)a+=o*c(e,t,n),s+=o,o*=i,e=e*2.03+17.1,t=t*2.03+3.7,n=n*2.03+9.3;return a/s}var u=class{constructor(e){this.name=e,this.p=[],this.n=[],this.a=[],this.i=[],this.m=[]}get vertexCount(){return this.p.length/3}vertex(e,t=[0,0,0,1],n=null){return this.p.push(e[0],e[1],e[2]),n?this.n.push(n[0],n[1],n[2]):this.n.push(null,null,null),this.a.push(t[0],t[1],t[2],t[3]),this.vertexCount-1}tri(e,t,n,r){this.i.push(e,t,n),this.m.push(r)}quad(e,t,n,r,i){this.tri(e,t,n,i),this.tri(e,n,r,i)}finish(){let e=this.vertexCount,t=new Float32Array(e*3),n=new Uint8Array(e);for(let r=0;r<e;r++)this.n[r*3]===null?n[r]=1:t.set([this.n[r*3],this.n[r*3+1],this.n[r*3+2]],r*3);for(let e=0;e<this.i.length;e+=3){let[r,i,a]=[this.i[e],this.i[e+1],this.i[e+2]],o=this.p,s=[o[i*3]-o[r*3],o[i*3+1]-o[r*3+1],o[i*3+2]-o[r*3+2]],c=[o[a*3]-o[r*3],o[a*3+1]-o[r*3+1],o[a*3+2]-o[r*3+2]],l=[s[1]*c[2]-s[2]*c[1],s[2]*c[0]-s[0]*c[2],s[0]*c[1]-s[1]*c[0]];for(let e of[r,i,a])if(n[e])for(let n=0;n<3;n++)t[e*3+n]+=l[n]}for(let n=0;n<e;n++){let e=Math.hypot(t[n*3],t[n*3+1],t[n*3+2])||1;for(let r=0;r<3;r++)t[n*3+r]/=e}return{name:this.name,positions:Float32Array.from(this.p),normals:t,attrs:Float32Array.from(this.a),indices:Uint32Array.from(this.i),materials:Uint8Array.from(this.m)}}},d=`
struct ScapeMat {
  // Linear reflectance (0..1); the shading normal (the bowl's frame, the side the input n is on,
  // fine relief added); specular roughness (0 mirror .. 1 matte) and strength (Fresnel at normal
  // incidence: ~0.02 dry, ~0.04 wet or waxy); light a thin blade lets through (linear, 0 opaque);
  // ambient occlusion (1 open .. 0 closed); the light it gives off itself (linear, 0 for all but a
  // lamp).
  albedo: vec3f,
  n: vec3f,
  rough: f32,
  spec: f32,
  trans: vec3f,
  ao: f32,
  glow: vec3f,
}

fn scape_hash3i(c: vec3i) -> vec3f {
  var v = bitcast<vec3u>(c) * 1664525u + vec3u(1013904223u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> vec3u(16u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3f(v) * (1.0 / 4294967296.0);
}

// 0, set by the shader these run in from a uniform (the bowl's: shaders.ts globes_shade), so a
// GPU's compiler cannot unroll a loop that starts at it: a function called in one is compiled
// once, not once for each turn (see globesZero there).
var<private> scapeZero: i32 = 0;

fn scape_grad(c: vec3i, f: vec3f) -> f32 {
  return dot(scape_hash3i(c) * 2.0 - vec3f(1.0), f);
}

// Gradient noise, about -1..1, smooth. (The corners a pair at a time, along x, each pair's blend
// shifted in: y then z.)
fn scape_noise3(p: vec3f) -> f32 {
  let fl = floor(p);
  let i = vec3i(fl);
  let f = p - fl;
  let u = f * f * f * (f * (f * 6.0 - vec3f(15.0)) + vec3f(10.0));
  var zs = vec2f(0.0);
  for (var k = scapeZero; k < 2; k++) {
    var ys = vec2f(0.0);
    for (var j = scapeZero; j < 2; j++) {
      let c = vec3i(0, j, k);
      let g0 = scape_grad(i + c, f - vec3f(c));
      let g1 = scape_grad(i + c + vec3i(1, 0, 0), f - vec3f(c + vec3i(1, 0, 0)));
      ys = vec2f(ys.y, mix(g0, g1, u.x));
    }
    zs = vec2f(zs.y, mix(ys.x, ys.y, u.y));
  }
  return 1.15 * mix(zs.x, zs.y, u.z);
}

// Fractal noise: octaves of scape_noise3, each twice as fine and half as strong (about -1..1).
fn scape_fbm3(p: vec3f, octaves: i32) -> f32 {
  var sum = 0.0;
  var amp = 1.0;
  var norm = 0.0;
  var q = p;
  for (var o = 0; o < octaves; o++) {
    sum += amp * scape_noise3(q);
    norm += amp;
    amp *= 0.5;
    q = q * 2.03 + vec3f(17.1, 3.7, 9.3);
  }
  return sum / norm;
}

// Cells (Worley): the distances to the nearest and the second nearest of one random point a unit
// cell, and the nearest's random id (0..1).
fn scape_cells3(p: vec3f) -> vec3f {
  let fl = floor(p);
  let i = vec3i(fl);
  let f = p - fl;
  var d1 = 9.0;
  var d2 = 9.0;
  var id = 0.0;
  for (var z = -1; z <= 1; z++) {
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        let c = vec3i(x, y, z);
        let h = scape_hash3i(i + c);
        let d = length(vec3f(c) + h - f);
        if (d < d1) {
          d2 = d1;
          d1 = d;
          id = h.x;
        } else if (d < d2) {
          d2 = d;
        }
      }
    }
  }
  return vec3f(d1, d2, id);
}

// sRGB colour (0..1) to linear.
fn scape_linear(c: vec3f) -> vec3f {
  return select(c / 12.92, pow((c + vec3f(0.055)) / 1.055, vec3f(2.4)), c > vec3f(0.04045));
}
`;export{u as a,c,r as i,i as l,n,d as o,t as r,l as s,e as t};
import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c}from"./index-ClJ2ygDd.js";var l=1024,u=8192,d=4096,f=1e-5,p=[.18,.3,.06],m=2e-4,h=1e-6,g=4,_=1,v=2,y=2e-6,b=new Float32Array(1),x=new Uint32Array(b.buffer);function S(e){let t=Math.fround(e);if(t<=e)return t;if(b[0]=t,t>0)x[0]--;else if(t===0)return-1401298464324817e-60;else x[0]++;return b[0]}function C(e){return-S(-e)}function w(e){let t=0;for(;e>g;)e=Math.ceil(e/2),t++;return t}function T(e,t,n,r,i,a){let o=new Uint32Array(n);for(let e=0;e<n;e++)o[e]=e;let s=Math.max(1,2*n),c=new Float64Array(s*3),l=new Float64Array(s*3),u=new Int32Array(s).fill(-1),d=new Int32Array(s).fill(-1),f=new Int32Array(s),p=new Int32Array(s),m=new Int32Array(s),h=1,_=0,v=0,y=0,b=Math.max(i,a),x=new Int32Array(3*b),S=new Float64Array(3*b*6),C=new Float64Array(b),T=new Int32Array(b),E=[[0,0,n,0]];for(;E.length;){let[n,s,b,D]=E.pop();m[n]=D,D>_&&(_=D);let O=1/0,k=1/0,A=1/0,j=-1/0,ee=-1/0,M=-1/0,N=1/0,P=1/0,F=1/0,I=-1/0,L=-1/0,R=-1/0;for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3;e[i]<O&&(O=e[i]),e[i+1]<k&&(k=e[i+1]),e[i+2]<A&&(A=e[i+2]),e[i+3]>j&&(j=e[i+3]),e[i+4]>ee&&(ee=e[i+4]),e[i+5]>M&&(M=e[i+5]);let s=t[a],c=t[a+1],l=t[a+2];s<N&&(N=s),s>I&&(I=s),c<P&&(P=c),c>L&&(L=c),l<F&&(F=l),l>R&&(R=l)}c[n*3]=O,c[n*3+1]=k,c[n*3+2]=A,l[n*3]=j,l[n*3+1]=ee,l[n*3+2]=M;let z=b-s;if(z<=g){f[n]=s,p[n]=z,v++;continue}let B=z>4096?i:a,V=[I-N,L-P,R-F],te=[N,P,F],H=V.map(e=>e>1e-12?B/e:0);x.fill(0,0,3*B);for(let e=0;e<3*B;e++){let t=e*6;S[t]=S[t+1]=S[t+2]=1/0,S[t+3]=S[t+4]=S[t+5]=-1/0}let ne=H[0],U=H[1],W=H[2];for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3,s=e[i],c=e[i+1],l=e[i+2],u=e[i+3],d=e[i+4],f=e[i+5];for(let e=0;e<3;e++){let n=e===0?ne:e===1?U:W;if(n===0)continue;let r=(t[a+e]-te[e])*n|0;r>=B&&(r=B-1),r+=e*B,x[r]++;let i=r*6;s<S[i]&&(S[i]=s),c<S[i+1]&&(S[i+1]=c),l<S[i+2]&&(S[i+2]=l),u>S[i+3]&&(S[i+3]=u),d>S[i+4]&&(S[i+4]=d),f>S[i+5]&&(S[i+5]=f)}}let re=-1,ie=-1,ae=1/0,oe=0;for(let e=0;e<3;e++){if(H[e]===0)continue;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=0;for(let c=B-1;c>0;c--){let l=(e*B+c)*6;s+=x[e*B+c],S[l]<t&&(t=S[l]),S[l+1]<n&&(n=S[l+1]),S[l+2]<r&&(r=S[l+2]),S[l+3]>i&&(i=S[l+3]),S[l+4]>a&&(a=S[l+4]),S[l+5]>o&&(o=S[l+5]),T[c]=s;let u=i-t,d=a-n,f=o-r;C[c]=s?u*d+d*f+f*u:0}t=n=r=1/0,i=a=o=-1/0,s=0;for(let c=0;c<B-1;c++){let l=(e*B+c)*6;if(s+=x[e*B+c],S[l]<t&&(t=S[l]),S[l+1]<n&&(n=S[l+1]),S[l+2]<r&&(r=S[l+2]),S[l+3]>i&&(i=S[l+3]),S[l+4]>a&&(a=S[l+4]),S[l+5]>o&&(o=S[l+5]),s===0||T[c+1]===0)continue;let u=i-t,d=a-n,f=o-r,p=s*(u*d+d*f+f*u)+T[c+1]*C[c+1];p<ae&&(ae=p,re=e,ie=c,oe=s)}}let se;if(re>=0&&D+1+w(Math.max(oe,z-oe))<=r){let e=re,n=H[e],r=te[e],i=s,a=b-1;for(;i<=a;){let s=o[i],c=(t[s*3+e]-r)*n|0;c>=B&&(c=B-1),c<=ie?i++:(o[i]=o[a],o[a]=s,a--)}se=i}else{re>=0&&y++;let e=V[0]>=V[1]&&V[0]>=V[2]?0:V[1]>=V[2]?1:2,n=Array.from(o.subarray(s,b));n.sort((n,r)=>t[n*3+e]-t[r*3+e]),o.set(n,s),se=s+(z>>1)}let ce=h++,G=h++;u[n]=ce,d[n]=G,E.push([G,se,b,D+1],[ce,s,se,D+1])}return{idx:o,lo:c,hi:l,left:u,right:d,start:f,count:p,depthOf:m,nodes:h,depth:_,leaves:v,forced:y}}function E(e,t={}){let n=performance.now(),r=t.layout===`stackless`?_:v,i=t.maxDepth??32;if(!Number.isInteger(i)||i<0)throw Error(`packScape: maxDepth ${i} (a whole number, 0 or more)`);let a=Math.min(i,32),o=t.bins??32,s=Math.min(o,16),c=0,d=0;for(let t of e)c+=t.positions.length/3,d+=t.indices.length/3;if(c>=1<<21)throw Error(`packScape: ${c} vertices (at most ${(1<<21)-1})`);if(w(d)>a)throw Error(`packScape: ${d} triangles need a tree ${w(d)} deep at least (leaves of ${g}); maxDepth is ${a}`);let f=new Float32Array(c*3),p=new Float32Array(c*3),m=new Float32Array(c*4),h=new Uint32Array(d*3),b=new Uint8Array(d),x=0,E=0;for(let t of e){let e=t.positions.length/3,n=t.indices.length/3,r=t.name??`(mesh)`;if(!Number.isInteger(e)||!Number.isInteger(n))throw Error(`packScape: ${r}: ragged positions or indices`);if(t.normals.length!==e*3||t.attrs.length!==e*4||t.materials.length!==n)throw Error(`packScape: ${r}: normals/attrs/materials of the wrong length`);f.set(t.positions,x*3),p.set(t.normals,x*3),m.set(t.attrs,x*4);for(let i=0;i<n*3;i++){let n=t.indices[i];if(!(n>=0&&n<e))throw Error(`packScape: ${r}: index ${n} out of range`);h[E*3+i]=n+x}for(let e=0;e<n;e++){let n=t.materials[e];if(!(n>=0&&n<=7))throw Error(`packScape: ${r}: material ${n} (0..7)`);b[E+e]=n}x+=e,E+=n}for(let e=0;e<f.length;e++)if(!Number.isFinite(f[e]))throw Error(`packScape: a position is not finite`);let D=new Float64Array(d*6),O=new Float64Array(d*3);for(let e=0;e<d;e++){let t=h[e*3]*3,n=h[e*3+1]*3,r=h[e*3+2]*3;for(let i=0;i<3;i++){let a=Math.min(f[t+i],f[n+i],f[r+i]),o=Math.max(f[t+i],f[n+i],f[r+i]);D[e*6+i]=a,D[e*6+3+i]=o,O[e*3+i]=.5*(a+o)}}let k=T(D,O,d,a,o,s),A=performance.now()-n,j=[],ee=[0];for(;ee.length;){let e=ee.pop();(r===_||k.left[e]>=0)&&j.push(e),k.left[e]>=0&&ee.push(k.right[e],k.left[e])}let M=new Int32Array(k.nodes).fill(-1);j.forEach((e,t)=>M[e]=t);let N=j.length,P=4+N*(r===v?4:2),F=P+d*3,I=F+c*2,L=l,R=Math.max(1,Math.ceil(I/L));if(R>8192)throw Error(`packScape: ${R} rows (at most ${u})`);let z=new Float32Array(L*R*4),B=e=>k.left[e]>=0?M[e]:-(k.start[e]*4+k.count[e]-1)-1,V=(e,t)=>{for(let n=0;n<3;n++)z[e*4+n]=S(k.lo[t*3+n]-y),z[(e+1)*4+n]=C(k.hi[t*3+n]+y)},te=[0,0,0],H=[0,0,0];if(d>0){V(1,0);for(let e=0;e<3;e++)te[e]=z[4+e],H[e]=z[8+e]}else for(let e=0;e<3;e++)te[e]=z[4+e]=1e6,H[e]=z[8+e]=1e6;if(z.set([N,P,d,r===v&&d>0?B(0):0],0),z[7]=F,z[11]=c,z.set([r,k.depth,k.leaves,0],12),r===v)for(let e of j){let t=4+M[e]*4,n=k.left[e],r=k.right[e];V(t,n),V(t+2,r),z[t*4+3]=B(n),z[(t+1)*4+3]=B(r)}else{let e=new Int32Array(k.nodes).fill(N);for(let t of j)k.left[t]>=0&&(e[k.left[t]]=M[k.right[t]],e[k.right[t]]=e[t]);for(let t of j){let n=4+M[t]*2;V(n,t),z[n*4+3]=e[t],z[(n+1)*4+3]=k.left[t]>=0?0:k.start[t]*4+k.count[t]-1+1}}for(let e=0;e<d;e++){let t=k.idx[e],n=(P+e*3)*4;for(let e=0;e<3;e++){let r=h[t*3+e];z[n+e*4]=f[r*3],z[n+e*4+1]=f[r*3+1],z[n+e*4+2]=f[r*3+2],z[n+e*4+3]=e===0?r*8+b[t]:r}}for(let e=0;e<c;e++){let t=(F+e*2)*4;z[t]=p[e*3],z[t+1]=p[e*3+1],z[t+2]=p[e*3+2],z[t+3]=m[e*4],z[t+4]=m[e*4+1],z[t+5]=m[e*4+2],z[t+6]=m[e*4+3]}return{data:z,width:L,height:R,triangles:d,vertices:c,nodes:k.nodes,internal:k.nodes-k.leaves,leaves:k.leaves,depth:k.depth,lo:te,hi:H,order:k.idx,layout:r===v?`stack`:`stackless`,forcedSplits:k.forced,buildMs:A,packMs:performance.now()-n-A}}var D=Math.fround;D(h),D(f);var O=[[`BARK`,`bark`,`vec3f(0.16, 0.09, 0.045)`,`0.75`,`0.02`,`vec3f(0.0)`],[`WOOD_END`,`woodEnd`,`vec3f(0.30, 0.20, 0.11)`,`0.8`,`0.02`,`vec3f(0.0)`],[`ROCK`,`rock`,`vec3f(0.05, 0.05, 0.055)`,`0.5`,`0.04`,`vec3f(0.0)`],[`LEAF_BIG`,`leafBig`,`vec3f(0.02, 0.06, 0.015)`,`0.35`,`0.04`,`vec3f(0.05, 0.12, 0.02)`],[`LEAF_SMALL`,`leafSmall`,`vec3f(0.03, 0.09, 0.02)`,`0.4`,`0.04`,`vec3f(0.06, 0.14, 0.03)`],[`STEM`,`stem`,`vec3f(0.04, 0.09, 0.025)`,`0.5`,`0.03`,`vec3f(0.0)`],[`ROOT`,`root`,`vec3f(0.06, 0.045, 0.03)`,`0.7`,`0.02`,`vec3f(0.0)`]],k=e=>{let t=String(e);return/[.eE]/.test(t)?t:`${t}.0`};function A(e){let t=``,n=0;for(let r=0;r<e.length;r++){let i=e[r],a=e[r+1];if(i===`/`&&a===`*`)n++,r++,t+=`  `;else if(n>0&&i===`*`&&a===`/`)n--,r++,t+=`  `;else if(n>0)t+=i===`
`?`
`:` `;else if(i===`/`&&a===`/`){for(;r<e.length&&e[r]!==`
`;)t+=` `,r++;r<e.length&&(t+=`
`)}else t+=i}return t}function j(t=[]){let n=t.filter(e=>typeof e==`string`&&e.length),r=A(n.join(`
`)),i=[];for(let[,e,t,n,a,o]of O){let s=r.match(RegExp(`\\bfn\\s+scape_mat_${e}\\s*\\(`,`g`));if(s&&s.length>1)throw Error(`scapeMeshWGSL: scape_mat_${e} is defined ${s.length} times`);s||i.push(`fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  return ScapeMat(${t}, n, ${n}, ${a}, ${o}, clamp(attrs.w, 0.0, 1.0));
}`)}let a=Object.entries(o).map(([e,t])=>`const SCAPE_MAT_${e}: u32 = ${t}u;`).join(`
`),s=O.map(([e,t])=>`    case ${o[e]}u: { m = scape_mat_${t}(s.attrs, p, s.n, foot, front); }`).join(`
`),c=(e,t,n)=>`
  let h0 = scape_meshTexel(tex, 0u);
  let triCount = u32(h0.z);
  if (triCount == 0u) { return OUT; }
  let nodeCount = min(u32(h0.x), 4194304u);
  let triBase = u32(h0.y);
  var stack: array<u32, 32>;
  var sp = 0u;
  var cur = scape_meshChild(h0.w);
  // (Each node and leaf is taken at most once, and a finite ray takes a few hundred steps at most:
  // the bound guards against a bad texture or a ray scape_meshBad let by.)
  let steps = min(nodeCount * 2u + 2u, SCAPE_MESH_STEPS);
  for (var it = 0u; it < steps; it++) {
    if (cur >= 0x80000000u) {
      let start = (cur & 0x7fffffffu) >> 2u;
      let count = (cur & 3u) + 1u;
      for (var j = 0u; j < count; j++) {
        let k = start + j;
        if (k >= triCount) { break; }
        let at = triBase + k * 3u;
        let a = scape_meshTexel(tex, at);
        let x = scape_meshTri(r, a.xyz, scape_meshTexel(tex, at + 1u).xyz, scape_meshTexel(tex, at + 2u).xyz, ${n});
        if (x.x > SCAPE_MESH_TMIN && x.x < ${t}) {
${e}
        }
      }
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
      continue;
    }
    if (cur >= nodeCount) { break; }
    let at = 4u + cur * 4u;
    let n0 = scape_meshTexel(tex, at);
    let n1 = scape_meshTexel(tex, at + 1u);
    let t0 = scape_meshBox(r, n0.xyz, n1.xyz, ${t});
    let t1 = scape_meshBox(r, scape_meshTexel(tex, at + 2u).xyz, scape_meshTexel(tex, at + 3u).xyz, ${t});
    let c0 = scape_meshChild(n0.w);
    let c1 = scape_meshChild(n1.w);
    if (t0 < SCAPE_MESH_FAR && t1 < SCAPE_MESH_FAR) {
      let swap = t1 < t0;
      if (sp < SCAPE_MESH_STACK) {
        stack[sp] = select(c1, c0, swap);
        sp += 1u;
      }
      cur = select(c0, c1, swap);
    } else if (t0 < SCAPE_MESH_FAR) {
      cur = c0;
    } else if (t1 < SCAPE_MESH_FAR) {
      cur = c1;
    } else {
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
    }
  }`,l=`
// ---- the furnishings' triangles (src/render/scape/scapeBVH.mjs) ------------------------------
${a}
const SCAPE_MESH_NONE: u32 = 0xffffffffu;
const SCAPE_MESH_STACK: u32 = 32u;
const SCAPE_MESH_STEPS: u32 = ${d}u;
const SCAPE_MESH_TMIN: f32 = ${k(f)};
const SCAPE_MESH_EDGE: f32 = ${k(h)};
const SCAPE_MESH_FAR: f32 = 3.0e38;
const SCAPE_LEAF_PASS: vec3f = vec3f(${p.map(k).join(`, `)});
const SCAPE_SHADOW_CUTOFF: f32 = ${k(m)};

struct ScapeMeshHit {
  t: f32,
  tri: u32,
  bary: vec2f,
}

struct ScapeSurface {
  n: vec3f,
  ng: vec3f,
  attrs: vec4f,
  material: u32,
}

// A ray set up for the walk: its origin, 1/d for the slabs (tiny components kept off zero), and
// the watertight test's frame: kz, d's largest axis; s, the shear (d.kx / d.kz, d.ky / d.kz) and
// 1 / d.kz.
struct ScapeRay {
  o: vec3f,
  inv: vec3f,
  s: vec3f,
  kz: u32,
}

fn scape_meshTexel(tex: texture_2d<f32>, i: u32) -> vec4f {
  return textureLoad(tex, vec2i(i32(i & 1023u), i32(i >> 10u)), 0);
}

// (v.kx, v.ky, v.kz): kz 0 -> yzx, 1 -> zxy, 2 -> xyz.
fn scape_meshPerm(v: vec3f, kz: u32) -> vec3f {
  return select(select(v.zxy, v.yzx, kz == 0u), v, kz == 2u);
}

// A ray the walk must not take: o or d not finite (NaN or infinite), d zero (no part of it a
// normal f32), or tEnd NaN. Tested on the bits: a compiler may take floats as never NaN and drop
// x != x, and the GPU's min and max drop a NaN operand, so the slab test would let such a ray into
// every box.
fn scape_meshBad(o: vec3f, d: vec3f, tEnd: f32) -> bool {
  let m = vec3u(0x7fffffffu);
  let inf = vec3u(0x7f800000u);
  let ad = bitcast<vec3u>(d) & m;
  return any((bitcast<vec3u>(o) & m) >= inf) || any(ad >= inf) || all(ad < vec3u(0x00800000u))
      || (bitcast<u32>(tEnd) & 0x7fffffffu) > 0x7f800000u;
}

fn scape_meshRay(o: vec3f, d: vec3f) -> ScapeRay {
  let ad = abs(d);
  var kz = 2u;
  if (ad.x >= ad.y && ad.x >= ad.z) {
    kz = 0u;
  } else if (ad.y >= ad.z) {
    kz = 1u;
  }
  let pd = scape_meshPerm(d, kz);
  let rz = 1.0 / pd.z;
  let inv = 1.0 / select(d, vec3f(1e-8), ad < vec3f(1e-8));
  return ScapeRay(o, inv, vec3f(pd.x * rz, pd.y * rz, rz), kz);
}

// Where the ray enters the box before tMax, or SCAPE_MESH_FAR if it misses it.
fn scape_meshBox(r: ScapeRay, lo: vec3f, hi: vec3f, tMax: f32) -> f32 {
  let a = (lo - r.o) * r.inv;
  let b = (hi - r.o) * r.inv;
  let tn = max(max(min(a.x, b.x), min(a.y, b.y)), max(min(a.z, b.z), 0.0));
  let tf = min(min(max(a.x, b.x), max(a.y, b.y)), min(max(a.z, b.z), tMax));
  return select(SCAPE_MESH_FAR, tn, tn <= tf);
}

// Whether a triangle owns its edge p -> q (sheared corners, in the triangle's order; neg: its det
// < 0) when the ray runs exactly through it: when the triangle lies on the side of the edge its
// normal points to, the normal turned to x > 0 (or x = 0, y > 0). A neighbour gets the same normal
// from the same corners (q - p exactly negated if it runs the edge the other way) and lies on the
// other side, so just one of them owns it (and at a corner, just one of those round it: the rule
// is that of the point nudged along +x, then +y).
fn scape_meshOwns(p: vec2f, q: vec2f, neg: bool) -> bool {
  let e = q - p;
  return neg != (e.y > 0.0 || (e.y == 0.0 && e.x < 0.0));
}

// The ray against a triangle, either face (Woop, Benthin & Wald's watertight test: each corner is
// sheared into the ray's frame on its own, so triangles sharing an edge compute that edge's
// function from the same numbers and no ray slips between them). exact false (a trace): the edge
// functions get a slack of SCAPE_MESH_EDGE of the triangle's scale, so no crack opens even where
// the GPU fuses a multiply and an add. exact true (a shadow): no slack, and an edge or corner the
// ray runs exactly through (an edge function exactly 0) is taken by one of the triangles round it
// only (scape_meshOwns), so a leaf is never darkened twice there. (t, b, c): the distance and the
// second and third corners' weights; t = SCAPE_MESH_FAR when the line misses it.
fn scape_meshTri(r: ScapeRay, a: vec3f, b: vec3f, c: vec3f, exact: bool) -> vec3f {
  let A = scape_meshPerm(a - r.o, r.kz);
  let B = scape_meshPerm(b - r.o, r.kz);
  let C = scape_meshPerm(c - r.o, r.kz);
  let a2 = A.xy - r.s.xy * A.z;
  let b2 = B.xy - r.s.xy * B.z;
  let c2 = C.xy - r.s.xy * C.z;
  let u = c2.x * b2.y - c2.y * b2.x;
  let v = a2.x * c2.y - a2.y * c2.x;
  let w = b2.x * a2.y - b2.y * a2.x;
  let det = u + v + w;
  let tol = select(SCAPE_MESH_EDGE * abs(det), 0.0, exact);
  let lo = min(u, min(v, w));
  let hi = max(u, max(v, w));
  if (det == 0.0 || (lo < -tol && hi > tol)) {
    return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
  }
  if (exact) {
    let neg = det < 0.0;
    if ((u == 0.0 && !scape_meshOwns(b2, c2, neg)) || (v == 0.0 && !scape_meshOwns(c2, a2, neg)) || (w == 0.0 && !scape_meshOwns(a2, b2, neg))) {
      return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
    }
  }
  let rd = 1.0 / det;
  let t = (u * A.z + v * B.z + w * C.z) * r.s.z * rd;
  return vec3f(t, v * rd, w * rd);
}

// A child word from the texture: an internal node's index, or 0x80000000 | (start * 4 + count - 1)
// for a leaf.
fn scape_meshChild(w: f32) -> u32 {
  if (w < 0.0) {
    return 0x80000000u | u32(-w - 1.0);
  }
  return u32(w);
}

// The nearest triangle along the ray in (SCAPE_MESH_TMIN, tEnd); o, d in the bowl's frame, d of
// unit length. t = tEnd and tri = SCAPE_MESH_NONE when there is none (or the ray is bad: see
// scape_meshBad).
fn scape_meshHit(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> ScapeMeshHit {
  var hit = ScapeMeshHit(tEnd, SCAPE_MESH_NONE, vec2f(0.0));
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return hit; }
  let r = scape_meshRay(o, d);
  // (Most segments miss the furnishings altogether: their box first.)
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return hit; }
${c(`          hit = ScapeMeshHit(x.x, k, x.yz);`,`hit.t`,`false`).replaceAll(`OUT`,`hit`)}
  return hit;
}

// The light let through along the segment (o, d up to tEnd): none at any opaque triangle, a green
// share at each leaf blade crossed (all of it for a bad ray: see scape_meshBad).
fn scape_meshShadow(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> vec3f {
  var T = vec3f(1.0);
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return T; }
  let r = scape_meshRay(o, d);
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return T; }
${c(`          let m = u32(a.w) & 7u;
          if (m != SCAPE_MAT_LEAF_BIG && m != SCAPE_MAT_LEAF_SMALL) { return vec3f(0.0); }
          T *= SCAPE_LEAF_PASS;
          if (max(T.x, max(T.y, T.z)) < SCAPE_SHADOW_CUTOFF) { return vec3f(0.0); }`,`tEnd`,`true`).replaceAll(`OUT`,`T`)}
  return T;
}

// What the hit triangle is at the hit: its smooth normal (the corners' normals interpolated and
// renormalised; the geometric one where they cancel), its geometric normal (the side its corners
// run counter-clockwise round), the corners' attributes interpolated, its material.
fn scape_meshSurface(tex: texture_2d<f32>, h: ScapeMeshHit) -> ScapeSurface {
  let h0 = scape_meshTexel(tex, 0u);
  if (h.tri >= u32(h0.z)) {
    return ScapeSurface(vec3f(0.0, 1.0, 0.0), vec3f(0.0, 1.0, 0.0), vec4f(0.0, 0.0, 0.0, 1.0), 0u);
  }
  let vb = u32(scape_meshTexel(tex, 1u).w);
  let at = u32(h0.y) + h.tri * 3u;
  let a = scape_meshTexel(tex, at);
  let b = scape_meshTexel(tex, at + 1u);
  let c = scape_meshTexel(tex, at + 2u);
  let wa = u32(a.w);
  let ia = vb + (wa >> 3u) * 2u;
  let ib = vb + u32(b.w) * 2u;
  let ic = vb + u32(c.w) * 2u;
  let a0 = scape_meshTexel(tex, ia);
  let a1 = scape_meshTexel(tex, ia + 1u);
  let b0 = scape_meshTexel(tex, ib);
  let b1 = scape_meshTexel(tex, ib + 1u);
  let c0 = scape_meshTexel(tex, ic);
  let c1 = scape_meshTexel(tex, ic + 1u);
  let wb = h.bary.x;
  let wc = h.bary.y;
  let w0 = 1.0 - wb - wc;
  let g = cross(b.xyz - a.xyz, c.xyz - a.xyz);
  let gl = length(g);
  let ng = select(vec3f(0.0, 1.0, 0.0), g / max(gl, 1e-30), gl > 1e-20);
  let ni = a0.xyz * w0 + b0.xyz * wb + c0.xyz * wc;
  let nl = length(ni);
  let n = select(ng, ni / max(nl, 1e-30), nl > 1e-6);
  let attrs = vec4f(a0.w, a1.xyz) * w0 + vec4f(b0.w, b1.xyz) * wb + vec4f(c0.w, c1.xyz) * wc;
  return ScapeSurface(n, ng, attrs, wa & 7u);
}

// The surface's material at p (foot: a pixel's size there; front: the ray meets the side s.n
// points to).
fn scape_meshMaterial(s: ScapeSurface, p: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m = ScapeMat(vec3f(0.18), s.n, 0.8, 0.02, vec3f(0.0), clamp(s.attrs.w, 0.0, 1.0));
  switch (s.material) {
${s}
    default: {}
  }
  return m;
}
`;return[e,...n,i.length?`// (Stand-ins for the materials no piece defines yet.)\n${i.join(`

`)}`:``,l].filter(Boolean).join(`
`)}var ee=r({WGSL:()=>Ne,build:()=>Se}),M=Math.PI*2,N=e=>e<0?0:e>1?1:e,P=(e,t,n)=>{let r=N((n-e)/(t-e));return r*r*(3-2*r)},F=e=>e-M*Math.round(e/M);function I(e,t,n){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,739982445);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}var L={e:0,nu:0,nv:0,pair:0,cell:0};function R(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=1e9,s=1e9,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0;for(let g=-1;g<=1;g++)for(let _=-1;_<=1;_++){let v=i+_,y=a+g,b=(v%n+n)%n,x=v+.06+.88*I(b,y,r),S=y+.06+.88*I(b,y,r+1013),C=x-e,w=S-t,T=C*C+w*w,E=b*7919+(y+4096)*131;T<o?(s=o,u=c,d=l,p=f,o=T,c=x,l=S,f=E,m=b,h=y):T<s&&(s=T,u=x,d=S,p=E)}let g=u-c,_=d-l,v=Math.hypot(g,_)||1;g/=v,_/=v,L.e=((c+u)*.5-e)*g+((l+d)*.5-t)*_,L.nu=g,L.nv=_,L.pair=I(Math.min(f,p),Math.max(f,p),r+77),L.cell=I(m,h,r+5)}var z={depth:0,shoulder:0,e:0,cell:0},B=new Float64Array(25),V=new Float64Array(25),te=new Int32Array(25);function H(e,t,n,r,i,a,o,s){let c=Math.floor(e),l=Math.floor(t),u=1e9,d=12;for(let i=-2,a=0;i<=2;i++)for(let o=-2;o<=2;o++,a++){let s=c+o,f=l+i,p=(s%n+n)%n,m=I(p,f,r),h=m*65536%1;if(B[a]=s+.06+.88*m,V[a]=f+.06+.88*h,te[a]=p*7919+(f+4096)*131,Math.abs(o)<2&&Math.abs(i)<2){let n=B[a]-e,r=V[a]-t,i=n*n+r*r;i<u&&([u,d]=[i,a])}}let f=B[d],p=V[d],m=te[d],h=0,g=0,_=1e9;for(let n=0;n<25;n++){if(n===d)continue;let c=B[n]-f,l=V[n]-p,u=Math.sqrt(c*c+l*l);c/=u,l/=u;let v=((f+B[n])*.5-e)*c+((p+V[n])*.5-t)*l,y=c/i,b=l/a,x=Math.sqrt(y*y+b*b),S=v/x;if(S<_&&(_=S),S>o*3.6)continue;let C=I(Math.min(m,te[n]),Math.max(m,te[n]),r+77),w=P(.35,.8,Math.abs(b)/x),T=(.5+.7*C)*(1-(1-s)*w),E=o*(.7+.6*(C*977%1))*(1-.15*w),D=S/E;D<1&&(h=Math.max(h,T*(1-P(0,1,D))**1.6)),g=Math.max(g,T*(1-P(E,E*3.2,S)))}return z.depth=h,z.shoulder=g,z.e=_,z.cell=I(m,5,r+5),z}function ne(e,n,r,i,a){let o=e.length,c=(e,t)=>[2*t[0]-e[0],2*t[1]-e[1],2*t[2]-e[2]],l=[c(e[1],e[0]),...e,c(e[o-2],e[o-1])],u=[],d=(e,t)=>Math.sqrt(Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]))||1e-6;for(let e=0;e<o-1;e++){let[t,n,r,i]=[l[e],l[e+1],l[e+2],l[e+3]],a=d(t,n),o=a+d(n,r),s=o+d(r,i);for(let e=0;e<64;e++){let c=a+(o-a)*e/64,l=[0,0,0];for(let e=0;e<3;e++){let u=(a-c)/a*t[e]+c/a*n[e],d=(o-c)/(o-a)*n[e]+(c-a)/(o-a)*r[e],f=(s-c)/(s-o)*r[e]+(c-o)/(s-o)*i[e],p=(o-c)/o*u+c/o*d,m=(s-c)/(s-a)*d+(c-a)/(s-a)*f;l[e]=(o-c)/(o-a)*p+(c-a)/(o-a)*m}u.push(l)}}u.push(e[o-1]);let f=[0],p=()=>{for(let e=1;e<u.length;e++){let[t,n]=[u[e-1],u[e]];f[e]=f[e-1]+Math.hypot(n[0]-t[0],n[1]-t[1],n[2]-t[2])}};p();let m=f[u.length-1];for(let e=0;e<u.length;e++){let t=a*P(0,.12,f[e])*P(m,m-.12,f[e]);for(let n=0;n<3;n++)u[e][n]+=t*s(f[e]*2.7,i*.53,n*3.7)}p();let h=f[f.length-1],g=Math.max(3,Math.round(h/n)+1),_=h/(g-1),v=new Float64Array(g*3),y=new Float64Array(g*3),b=new Float64Array(g*3),x=new Float64Array(g*3),S=new Float64Array(g),C=0;for(let e=0;e<g;e++){let t=e*_;for(;C<u.length-2&&f[C+1]<t;)C++;let n=(t-f[C])/(f[C+1]-f[C]||1);for(let t=0;t<3;t++)v[e*3+t]=u[C][t]+(u[C+1][t]-u[C][t])*n}for(let e=0;e<g;e++){let t=Math.max(0,e-1),n=Math.min(g-1,e+1),r=[v[n*3]-v[t*3],v[n*3+1]-v[t*3+1],v[n*3+2]-v[t*3+2]],i=Math.hypot(r[0],r[1],r[2]);for(let t=0;t<3;t++)y[e*3+t]=r[t]/i}{let e=Math.abs(y[1])<.9?[0,1,0]:[1,0,0],t=e[0]*y[0]+e[1]*y[1]+e[2]*y[2],n=[e[0]-t*y[0],e[1]-t*y[1],e[2]-t*y[2]],r=Math.hypot(n[0],n[1],n[2]);for(let e=0;e<3;e++)b[e]=n[e]/r}for(let e=0;e<g-1;e++){let t=[v[e*3+3]-v[e*3],v[e*3+4]-v[e*3+1],v[e*3+5]-v[e*3+2]],n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=[b[e*3],b[e*3+1],b[e*3+2]],i=[y[e*3],y[e*3+1],y[e*3+2]],a=2/n*(t[0]*r[0]+t[1]*r[1]+t[2]*r[2]),o=2/n*(t[0]*i[0]+t[1]*i[1]+t[2]*i[2]),s=[r[0]-a*t[0],r[1]-a*t[1],r[2]-a*t[2]],c=[i[0]-o*t[0],i[1]-o*t[1],i[2]-o*t[2]],l=[y[e*3+3]-c[0],y[e*3+4]-c[1],y[e*3+5]-c[2]],u=2/(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]||1e-12)*(l[0]*s[0]+l[1]*s[1]+l[2]*s[2]);for(let t=0;t<3;t++)b[e*3+3+t]=s[t]-u*l[t]}for(let e=0;e<g;e++){let[t,n,r]=[y[e*3],y[e*3+1],y[e*3+2]],[i,a,o]=[b[e*3],b[e*3+1],b[e*3+2]];x[e*3]=n*o-r*a,x[e*3+1]=r*i-t*o,x[e*3+2]=t*a-n*i}S[0]=t(i)()*M;for(let e=1;e<g;e++)S[e]=S[e-1]+_*r*(1+.7*s(e*_*1.7,i*.37,.3));return{count:g,step:_,L:h,c:v,t:y,r:b,b:x,tau:S}}var U={cx:0,cy:0,cz:0,rx:0,ry:0,rz:0,bx:0,by:0,bz:0,tx:0,ty:0,tz:0,tau:0};function W(e,t){let n=t/e.step,r=Math.floor(n);r<0&&(r=0),r>e.count-2&&(r=e.count-2),n-=r;let i=r+1,a=1-n;return U.cx=e.c[r*3]*a+e.c[i*3]*n,U.cy=e.c[r*3+1]*a+e.c[i*3+1]*n,U.cz=e.c[r*3+2]*a+e.c[i*3+2]*n,U.rx=e.r[r*3]*a+e.r[i*3]*n,U.ry=e.r[r*3+1]*a+e.r[i*3+1]*n,U.rz=e.r[r*3+2]*a+e.r[i*3+2]*n,U.bx=e.b[r*3]*a+e.b[i*3]*n,U.by=e.b[r*3+1]*a+e.b[i*3+1]*n,U.bz=e.b[r*3+2]*a+e.b[i*3+2]*n,U.tx=e.t[r*3]*a+e.t[i*3]*n,U.ty=e.t[r*3+1]*a+e.t[i*3+1]*n,U.tz=e.t[r*3+2]*a+e.t[i*3+2]*n,U.tau=e.tau[r]*a+e.tau[i]*n,U}function re(e,t){let n=Math.min(Math.max(t/e.step,0),e.count-1.001),r=Math.floor(n);return e.c[r*3+1]+(e.c[r*3+4]-e.c[r*3+1])*(n-r)}function ie(e,t){let n=1e9,r=0;for(let i=0;i<e.count;i++){let a=(e.c[i*3]-t[0])**2+(e.c[i*3+1]-t[1])**2+(e.c[i*3+2]-t[2])**2;a<n&&([n,r]=[a,i])}return r*e.step}var ae=[{name:`arch`,pts:[[-.522,-.7,-.04],[-.514,-.632,-.048],[-.486,-.528,-.058],[-.425,-.443,-.07],[-.318,-.386,-.05],[-.178,-.344,-.122],[-.038,-.296,-.146],[.083,-.268,-.16],[.198,-.277,-.162],[.307,-.331,-.19],[.398,-.414,-.148],[.462,-.522,-.141],[.494,-.633,-.136],[.501,-.7,-.134]],radius:[[0,.092],[.07,.094],[.18,.08],[.3,.064],[.42,.07],[.56,.084],[.64,.088],[.74,.07],[.85,.08],[.93,.096],[1,.094]],around:176,ds:.0039,wiggle:.022,twist:1.7,flat:.28,lobe:.11,flute:.26,gnarl:.26,plates:17,plateLength:.26,depth:.19,width:.0055,knuckles:[[[-.36,-.396,-.085],.16,.08],[[.33,-.342,-.15],.18,.09],[[-.08,-.316,-.14],.1,.06],[[.05,-.286,-.15],-.08,.05]],knots:[[[-.27,-.333,-.03],.014,.04,.02,`pit`],[[0,-.222,-.12],.011,.032,.014,`boss`],[[.33,-.316,-.08],0,.06,.03,`burl`],[[.45,-.466,-.06],.01,.03,.012,`boss`],[[-.47,-.501,.03],.012,.035,.016,`pit`],[[.12,-.299,-.24],.012,.04,.016,`pit`],[[-.12,-.29,-.1],0,.06,.02,`burl`],[[-.36,-.366,-.05],0,.055,.026,`burl`],[[0,-.325,-.07],0,.05,.022,`burl`],[[.43,-.389,-.12],0,.06,.028,`burl`],[[.27,-.29,-.22],0,.045,.02,`burl`]],seed:11,caps:[`buried`,`buried`]},{name:`broken`,parent:0,pts:[[.115,-.268,-.163],[.143,-.2,-.232],[.183,-.12,-.268],[.232,-.042,-.284],[.27,.015,-.293]],radius:[[0,.058],[.3,.052],[.7,.045],[1,.04]],around:144,ds:.0035,wiggle:.006,twist:2.6,flat:.16,lobe:.08,flute:.2,gnarl:.17,plates:12,plateLength:.2,depth:.19,width:.00495,knuckles:[],knots:[[[.232,-.11,-.262],.009,.026,.01,`boss`]],fillet:.06,reach:[.12,.2],seed:23,caps:[`inside`,`broken`],breakAt:.04},{name:`left`,parent:0,pts:[[-.31,-.385,-.05],[-.305,-.457,-.02],[-.288,-.54,.055],[-.298,-.63,.11],[-.292,-.7,.13]],radius:[[0,.056],[.35,.049],[.75,.042],[1,.04]],around:144,ds:.0037,wiggle:.012,twist:-2.1,flat:.22,lobe:.09,flute:.22,gnarl:.2,plates:12,plateLength:.22,depth:.19,width:.00495,knuckles:[[[-.29,-.56,.07],.1,.05]],knots:[[[-.34,-.501,.1],.01,.03,.012,`pit`]],fillet:.07,reach:[.12,.22],seed:37,caps:[`inside`,`buried`]}];function oe(){let e=[];for(let[n,r]of ae.entries()){let i={...r,index:n,pts:r.pts.map(e=>e.slice())};if(i.parent!==void 0){let t=e[i.parent].spine,n=ie(t,i.pts[0]),r=W(t,n);i.pts[0]=[r.cx,r.cy,r.cz],i.junction=n,i.shrink=e=>.6+.4*P(0,.0525,e)}let a=i.spine=ne(i.pts,i.ds,i.twist,i.seed,i.wiggle);i.knuckleS=i.knuckles.map(([e,t,n])=>[ie(a,e),t,n]),i.knotS=i.knots.map(([e,t,n,r,o],s)=>{let c=ie(a,e),l=W(a,c),u=[e[0]-l.cx,e[1]-l.cy,e[2]-l.cz];return{s:c,phi:((Math.atan2(u[0]*l.bx+u[1]*l.by+u[2]*l.bz,u[0]*l.rx+u[1]*l.ry+u[2]*l.rz)-l.tau)%M+M)%M,eye:t,spread:n,height:r,kind:o,brk:o===`boss`?xe(i.seed*31+s):null}});let o=t(i.seed+101);i.flutes=Array.from({length:5},(e,t)=>({phi:t/5*M+o()*1,drift:(o()-.5)*1.5,width:.22+.3*o(),depth:i.flute*(.5+.8*o()),freq:1.5+2*o(),seed:i.seed+t*7.7})),e.push(i)}return e}var se={L:null,s:NaN,r:0};function ce(e,t,n){if(se.L===e&&se.s===n)return se.r;let r=n/t.L,i=e.radius,o=i[i.length-1][1];for(let e=0;e<i.length-1;e++)if(r<=i[e+1][0]){o=i[e][1]+(i[e+1][1]-i[e][1])*P(i[e][0],i[e+1][0],r);break}o*=1+.2*a(n*4+e.seed,.31,.77,2);for(let[t,r,i]of e.knuckleS)o*=1+r*Math.exp(-(((n-t)/i)**2));return Object.assign(se,{L:e,s:n,r:o}),o}var G={L:null,s:NaN,e:0,al:0,a3:0,b3:0,a4:0,b4:0,a5:0,b5:0,foot:1,fc:[0],fd:[0]};function le(e,t,n){if(G.s!==t||G.L!==e){let n=e.seed*1.37;G.s=t,G.L=e,G.e=e.flat*(.55+.45*s(t*2.3,n,.5)),G.al=e.seed+1.4*s(t*1.2,n+3.1,1.7),G.a3=e.lobe*(.6+.6*s(t*3.1,n,4.4)),G.b3=2.2*s(t*1.6,n,5.5),G.a4=e.lobe*.7*(.5+.7*s(t*3.7,n,6.6)),G.b4=2.2*s(t*1.9,n,7.7),G.a5=e.lobe*.5*(.4+.8*s(t*4.3,n,8.8)),G.b5=2.2*s(t*2.2,n,9.9),G.foot=1+.9*Math.exp(-(((re(e.spine,t)-c)/.07)**2)),G.fc=e.flutes.map(e=>e.phi+e.drift*t+.5*s(t*2.6,e.seed,.2)),G.fd=e.flutes.map(e=>e.depth*P(-.25,.35,s(t*e.freq,e.seed,3.3)))}let r=1+G.e*Math.cos(2*(n-G.al));r+=(G.a3*Math.cos(3*n+G.b3)+G.a4*Math.cos(4*n+G.b4)+G.a5*Math.cos(5*n+G.b5))*G.foot;for(let t=0;t<e.flutes.length;t++){let i=F(n-G.fc[t]);r-=G.fd[t]*Math.exp(-((i/e.flutes[t].width)**2))}let i=Math.max(.16-Math.abs(r-.6),0)/.16;return Math.max(r,.6)+i*i*.04}var ue={d:0,z:0};function de(e,t,n,r,i,a,o){let c=e.plates,l=e.plateLength,u=Math.min(Math.max(o,.6*a),1.3*a),d=M*u/c,f=e.seed*.71,p=n/M*c+.55*s(r*1.1+f,i*1.1,t*1.5)+.2*s(r*2.7,i*2.7+f,t*5.3),m=t/l+.4*s(r*1.3+9.1,i*1.3,t*1.9+f),h=0,g=0;for(let r of e.knotS){let e=(t-r.s)/(r.kind===`burl`?1.4:2.6);if(Math.abs(e)>5*r.spread)continue;let i=F(n-r.phi)*a,o=i*i+e*e,c=Math.sqrt(o);if(c>5*r.spread)continue;let l=r.height*Math.exp(-((c/r.spread)**2))*(1+.2*s(i*55,e*55,r.s*9));if(r.kind===`burl`){h+=l,p+=.25*i*Math.exp(-((c/r.spread)**2))/d;continue}let u=(r.eye*1.6)**2,f=Math.exp(-((c/(2.6*r.spread))**2)),m=o>u?i*(1-u/o):0;p+=(m-i)*f/d;let _=Math.atan2(e,i);c*=1+.3*s(Math.cos(_)*2,Math.sin(_)*2,r.s*5),g=Math.max(g,1-P(r.eye*.9,r.eye*1.7,c));let v=.45*r.height*Math.exp(-(((c-r.eye)/(.35*r.eye))**2)),y;y=r.kind===`pit`?-.45*r.height*(1-P(0,r.eye*.8,c)):P(0,1,(r.eye-c)/(.3*r.eye))*(.8*r.height+r.brk.height(Math.min(c/(.7*r.eye),1),_)*(r.eye/.05)),h+=l+v+y}let _=P(.36,.66,s(r*.8+f,i*.8+2.2,t*2.2+4.1)),v=e.depth*u,y=.6+.4*s(r*2.1,i*2.1+f,t*7.3);H(p,m,c,e.seed,d,l,e.width,.2);let b=y*z.depth,x=.25*y*z.shoulder,S=(.26*z.cell+.1*s(p*1.7,m*2.3,f))*P(0,e.width*3,z.e),C=P(-.35,.2,s(r*1.6+5,i*1.6,t*3.1+f));C>0&&(H(p*2.27+.5,m*1.9+.3,Math.round(c*2.27),e.seed+3,d/2.27,l/1.9,e.width*.8,.25),b=Math.max(b,.55*C*z.depth));let w=p*1.7+.35*s(r*3.1,i*3.1+f,t*6.1),T=.2*(.5+.5*Math.cos(M*w))**3*y,E=.1*s(r*16+f,i*16,t*22),D=(1-.5*_)*(1-g),O=(b+(x+S+T+E)*(1-.6*_))*D;return ue.z=N(O/.85),ue.d=O*v-h,ue}var fe={cx:0,cy:0,cz:0,dx:0,dy:0,dz:0,r0:0,rb:0};function pe(e,t,n,r){let i=W(t,n),o=M*r/e.around,c=o+i.tau,l=Math.cos(c),u=Math.sin(c),d=l*i.rx+u*i.bx,f=l*i.ry+u*i.by,p=l*i.rz+u*i.bz,m=Math.sqrt(d*d+f*f+p*p);d/=m,f/=m,p/=m;let h=ce(e,t,n);e.shrink&&(h*=e.shrink(n));let g=h*le(e,n,o),_=i.cx+d*g,v=i.cy+f*g,y=i.cz+p*g;return g*=1+e.gnarl*(.6*a(_*3.4+1.7,v*3.4,y*3.4,2)+.45*s(Math.cos(o)*1.3+e.seed,Math.sin(o)*1.3,n*6.5)),fe.cx=i.cx,fe.cy=i.cy,fe.cz=i.cz,fe.dx=d,fe.dy=f,fe.dz=p,fe.r0=h,fe.rb=g,fe}function me(e,t,n){let r=e.around,i=e.rings??t.count,a=i*r,o={L:e,sp:t,N:r,rings:i,px:new Float64Array(a),py:new Float64Array(a),pz:new Float64Array(a),dx:new Float64Array(a),dy:new Float64Array(a),dz:new Float64Array(a),cx:new Float64Array(a),cy:new Float64Array(a),cz:new Float64Array(a),base:new Float64Array(a),rad:new Float64Array(a),s:new Float64Array(a),z:new Float64Array(a),ao:new Float64Array(a).fill(1),inside:new Uint8Array(a),nx:new Float64Array(a),ny:new Float64Array(a),nz:new Float64Array(a),b0:new Float64Array(a)},s=new Float64Array(r),c=new Float64Array(r);for(let e=0;e<r;e++)s[e]=Math.cos(M*e/r),c[e]=Math.sin(M*e/r);for(let a=0;a<i;a++)for(let i=0;i<r;i++){let l=a*r+i,u=n(a,i),d=pe(e,t,u,i),f=de(e,u,M*i/r,s[i],c[i],d.r0,d.rb),p=d.rb-f.d;o.px[l]=d.cx+d.dx*p,o.py[l]=d.cy+d.dy*p,o.pz[l]=d.cz+d.dz*p,o.dx[l]=d.dx,o.dy[l]=d.dy,o.dz[l]=d.dz,o.cx[l]=d.cx,o.cy[l]=d.cy,o.cz[l]=d.cz,o.base[l]=d.rb,o.rad[l]=p,o.s[l]=u,o.z[l]=f.z,o.b0[l]=u===a*t.step?d.rb:pe(e,t,a*t.step,i).rb}let l=2.5;for(let e=0;e<2;e++)for(let e=0;e<i;e++)for(let n=0;n<r;n++){let a=e*r+n,s=l*M*o.base[a]/r,c=l*t.step,u=o.base[a]-o.rad[a],d=u;for(let[t,l]of[[e*r+(n+1)%r,s],[e*r+(n+r-1)%r,s],[e>0?a-r:a,c],[e<i-1?a+r:a,c]])d=Math.min(d,o.base[t]-o.rad[t]+l);d<u&&u>0&&(o.z[a]*=Math.max(d,0)/u),o.rad[a]=o.base[a]-d}let u=new Float64Array(a),d=new Float64Array(a),f=new Float64Array(a);for(let e=0;e<a;e++)u[e]=o.cx[e]+o.dx[e]*o.base[e],d[e]=o.cy[e]+o.dy[e]*o.base[e],f[e]=o.cz[e]+o.dz[e]*o.base[e];o.bnx=new Float64Array(a),o.bny=new Float64Array(a),o.bnz=new Float64Array(a),we(o,u,d,f,o.bnx,o.bny,o.bnz);for(let t=0;t<a;t++){let n=e.sBreak===void 0?0:P(e.sBreak-.045,e.sBreak-.02,o.s[t]),r=o.bnx[t]+(o.dx[t]-o.bnx[t])*n,i=o.bny[t]+(o.dy[t]-o.bny[t])*n,a=o.bnz[t]+(o.dz[t]-o.bnz[t])*n,s=Math.sqrt(r*r+i*i+a*a)||1;o.bnx[t]=r/=s,o.bny[t]=i/=s,o.bnz[t]=a/=s;let c=o.base[t]-o.rad[t];o.px[t]=u[t]-r*c,o.py[t]=d[t]-i*c,o.pz[t]=f[t]-a*c}return o.bs=o.base.slice(),o.r0=o.rad.slice(),o}var he={i:0,jf:0};function ge(e,t,n,r,i,a){let{sp:o,N:s}=e,c=Math.max(1,Math.floor((a-i)/20)),l=1e9,u=i;for(let e=i;e<=a;e+=c){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}for(let e=Math.max(i,u-c),s=Math.min(a,u+c);e<=s;e++){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}let d=(t-o.c[u*3])*o.t[u*3]+(n-o.c[u*3+1])*o.t[u*3+1]+(r-o.c[u*3+2])*o.t[u*3+2],f=u+d/o.step,p=Math.min(Math.max(f,i),a),m=Math.min(Math.floor(p),a-1),h=p-m,g=m+1,_=1-h,v=e=>o.c[m*3+e]*_+o.c[g*3+e]*h,y=t-v(0),b=n-v(1),x=r-v(2),S=y*(o.r[m*3]*_+o.r[g*3]*h)+b*(o.r[m*3+1]*_+o.r[g*3+1]*h)+x*(o.r[m*3+2]*_+o.r[g*3+2]*h),C=y*(o.b[m*3]*_+o.b[g*3]*h)+b*(o.b[m*3+1]*_+o.b[g*3+1]*h)+x*(o.b[m*3+2]*_+o.b[g*3+2]*h),w=(Math.atan2(C,S)-(o.tau[m]*_+o.tau[g]*h))/M*s;w=(w%s+s)%s;let T=Math.floor(w),E=w-T,D=(T+1)%s;he.i=h<.5?m:g,he.jf=w;let O=(e.b0[m*s+T]*(1-E)+e.b0[m*s+D]*E)*_+(e.b0[g*s+T]*(1-E)+e.b0[g*s+D]*E)*h,k=Math.sqrt(S*S+C*C)-O,A=Math.max(i-f,f-a)*o.step;return A<=0?k:k>0?Math.sqrt(k*k+A*A):A}var _e=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},ve=[0,0,0];function ye(e,t,n,r,i){let a=e.sp,o=n-a.c[t*3],s=r-a.c[t*3+1],c=i-a.c[t*3+2],l=o*a.t[t*3]+s*a.t[t*3+1]+c*a.t[t*3+2];o-=l*a.t[t*3],s-=l*a.t[t*3+1],c-=l*a.t[t*3+2];let u=Math.sqrt(o*o+s*s+c*c)||1;return ve[0]=o/u,ve[1]=s/u,ve[2]=c/u,ve}function be(e,t,n,r,i,a,o,c,l){let{N:u,rings:d}=e,f=e=>n*(1-P(l[0],l[1],e));for(let n=0;n<d*u;n++){if(!a(n))continue;let l=e.bs[n],p=e.cx[n]+e.dx[n]*l,m=e.cy[n]+e.dy[n]*l,h=e.cz[n]+e.dz[n]*l,g=ge(t,p,m,h,r,i),_=he.i,v=f(e===c?e.s[n]:_*t.sp.step);if(v<1e-4||g>=v)continue;let y=ye(t,_,p,m,h),b=1-P(0,v,g),x=e.dx[n]+y[0]*b,S=e.dy[n]+y[1]*b,C=e.dz[n]+y[2]*b,w=Math.sqrt(x*x+S*S+C*C)||1;x/=w,S/=w,C/=w;let T=Math.floor(n/u),E=Math.max(0,T-50),D=Math.min(d-1,T+50),O={a:0,b:0,k:v,ia:0,ib:0},k=n=>{let a=p+x*n,o=m+S*n,s=h+C*n;return O.a=ge(e,a,o,s,E,D),O.ia=he.i,O.b=ge(t,a,o,s,r,i),O.ib=he.i,O.k=Math.max(f(e===c?O.ia*e.sp.step:O.ib*t.sp.step),1e-4),_e(O.a,O.b,O.k)},A=0,j=2*v,ee=k(j)<0,N=1;if(!ee){for(let e=0;e<14;e++){let e=(A+j)*.5;k(e)<0?A=e:j=e}k((A+j)*.5),N=(O.a-O.b)/O.k,N>.97&&(ee=!0)}if(ee){e.inside[n]=1;let t=e.r0[n]-1.5*o;e.px[n]=e.cx[n]+e.dx[n]*t,e.py[n]=e.cy[n]+e.dy[n]*t,e.pz[n]=e.cz[n]+e.dz[n]*t,e.rad[n]=t;continue}let F=(A+j)*.5,I=p+x*F,L=m+S*F,R=h+C*F,z=Math.max(O.k-Math.abs(O.a-O.b),0)/O.k,B=O.a<O.b?1-z/2:z/2,V=[e.bnx[n],e.bny[n],e.bnz[n]],te=ye(t,O.ib,I,L,R),H=B*V[0]+(1-B)*te[0],ne=B*V[1]+(1-B)*te[1],U=B*V[2]+(1-B)*te[2],W=Math.sqrt(H*H+ne*ne+U*U)||1;H/=W,ne/=W,U/=W;let re=.55+.45*P(.02,.2,Math.abs(N)),ie=e===c?0:.002*Math.cos(M*2*N)*(1-Math.abs(N))*(.7+.6*s(I*60,L*60,R*60)),ae=(l-e.r0[n])*re-ie+o*P(-.05,.3,N);e.z[n]*=re,e.px[n]=I-H*ae,e.py[n]=L-ne*ae,e.pz[n]=R-U*ae;let oe=(I-e.cx[n])*e.dx[n]+(L-e.cy[n])*e.dy[n]+(R-e.cz[n])*e.dz[n];e.base[n]=oe,e.rad[n]=oe-ae}}function xe(e){let n=t(e),r=Array.from({length:5},(e,t)=>({phi:t/5*M+(n()-.5)*.9,w:.22+.45*n(),h:.008+.03*n()*n()+(t===1?.018:0),t:.55+.3*n()})),i=n()*M,a=t=>{let n=.008*Math.cos(t-i)+.003*s(Math.cos(t)*3,Math.sin(t)*3,e);for(let e of r){let r=Math.abs(F(t-e.phi))/e.w;r<1&&(n=Math.max(n,e.h*(1-r)**1.4+.008*Math.cos(t-i)))}return n+.0025*Math.abs(s(Math.cos(t)*11,Math.sin(t)*11,e+3))};return{rim:a,height:(t,n)=>{let o=Math.cos(n),c=Math.sin(n);R(t*4.5+.3*s(o*2,c*2,e),n/M*16,1e6,e+7);let l=(L.cell-.5)*.011*P(0,.4,L.e+.08)*P(.08,.35,t),u=.004*Math.cos(n-i)*t-.003+l+.002*s(o*t*20,c*t*20,e+1),d=P(.86,1,t);for(let e of r)Math.abs(F(n-e.phi))<e.w&&(d=Math.max(d,P(e.t,e.t+.12,t)));return u+(a(n)-u)*d}}}function Se(){let e=oe(),t=[];for(let n of e){let e=n.spine,r=t=>t*e.step;if(n.caps[1]===`broken`){n.brk=xe(n.seed+5);let t=e.L-n.breakAt,i=t-.025,a=Math.floor(i/e.step),o=Math.round(t/e.step);n.rings=o+1,n.sBreak=t,r=(r,i)=>{if(r<=a)return r*e.step;let s=(r-a)/(o-a),c=a*e.step;return c+s*(t+n.brk.rim(M*i/n.around)-c)}}t.push(me(n,e,r))}for(let[n,r]of e.entries()){if(r.parent===void 0)continue;let e=t[r.parent],i=t[n],a=r.junction,o=Math.max(0,Math.floor((a-.3)/e.sp.step)),s=Math.min(e.rings-1,Math.ceil((a+.3)/e.sp.step)),c=Math.min(i.rings-1,Math.ceil(.35/i.sp.step)),[l,u,d]=[i.sp.c[0],i.sp.c[1],i.sp.c[2]],f=.026;be(i,e,r.fillet,o,s,e=>i.s[e]<=r.reach[1],f,i,r.reach),be(e,i,r.fillet,0,c,t=>(e.px[t]-l)**2+(e.py[t]-u)**2+(e.pz[t]-d)**2<.26*.26,f,i,r.reach)}for(let e of t)Ce(e);Te(t);let r=new n(`driftwood`);for(let e of t)De(r,e);let i=[];for(let e of t)ke(e,i);return{meshes:[r.finish()],obstacles:i}}function Ce(e){we(e,e.px,e.py,e.pz,e.nx,e.ny,e.nz)}function we(e,t,n,r,i,a,o){let{N:s,rings:c}=e;for(let l=0;l<c;l++)for(let u=0;u<s;u++){let d=l*s+u,f=l*s+(u+1)%s,p=l*s+(u-1+s)%s,m=Math.min(c-1,l+1)*s+u,h=Math.max(0,l-1)*s+u,g=t[f]-t[p],_=n[f]-n[p],v=r[f]-r[p],y=t[m]-t[h],b=n[m]-n[h],x=r[m]-r[h],S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w);T>1e-12||([S,C,w,T]=[e.dx[d],e.dy[d],e.dz[d],1]),i[d]=S/T,a[d]=C/T,o[d]=w/T}}function Te(e){let t=.012,n=e.map(e=>{let n=[],r=e.s[(e.rings-1)*e.N];for(let i=0;i<=r;i+=t){let t=W(e.sp,i);n.push([t.cx,t.cy,t.cz,ce(e.L,e.sp,i)*(e.L.shrink?e.L.shrink(i):1)])}return n}),r=n.map(e=>{let t=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let[n,r,i,a]of e)for(let[e,o]of[n,r,i].entries())t[e]=Math.min(t[e],o-6*a),t[e+3]=Math.max(t[e+3],o+6*a);return t}),i=n.map(e=>Float64Array.from(e.flat()));for(let[a,o]of e.entries()){let{N:e,rings:s,L:l}=o,u=Ee(o.rad,s,e,2,4),d=Ee(o.base,s,e,9,14);for(let f=0;f<s*e;f++){let e=o.base[f]||.07,s=Math.max(0,u[f]-o.rad[f])/(l.depth*.6*e),p=Math.max(0,d[f]-o.base[f])/(.1*e),m=(1-.55*N(s))*(1-.35*N(p))*(1-.25*o.z[f]),h=o.px[f],g=o.py[f],_=o.pz[f],v=o.nx[f],y=o.ny[f],b=o.nz[f],x=g-c;m*=.35+.65*P(-.01,.07,x),m*=1-.45*Math.max(0,-y)*Math.exp(-Math.max(x,0)/.12);let S=0;for(let e=0;e<n.length;e++){let n=r[e],o=i[e];if(!(e===a||h<n[0]||g<n[1]||_<n[2]||h>n[3]||g>n[4]||_>n[5]))for(let e=0;e<o.length;e+=4){let n=o[e+3],r=o[e]-h,i=o[e+1]-g,a=o[e+2]-_,s=r*r+i*i+a*a;if(s>36*n*n)continue;let c=Math.sqrt(s),l=(r*v+i*y+a*b)/c;l<=0||(S+=n*n/Math.max(s,n*n)*l*(t/(2*n)))}}m*=1-Math.min(.6,.75*S),o.inside[f]&&(m*=.3),o.ao[f]=Math.min(1,Math.max(.03,m))}}}function Ee(e,t,n,r,i){let a=new Float64Array(t*n),o=new Float64Array(t*n);for(let r=0;r<t;r++){let t=0;for(let a=-i;a<=i;a++)t+=e[r*n+(a+n)%n];for(let o=0;o<n;o++)a[r*n+o]=t/(2*i+1),t+=e[r*n+(o+i+1)%n]-e[r*n+(o-i+n)%n]}for(let e=0;e<n;e++)for(let i=0;i<t;i++){let s=0,c=0;for(let o=Math.max(0,i-r);o<=Math.min(t-1,i+r);o++)s+=a[o*n+e],c++;o[i*n+e]=s/c}return o}function De(e,t){let{N:n,rings:r,L:i}=t,a=e.vertexCount,s=2*M*i.index,c=(e,t)=>e*n+(t%n+n)%n;for(let a=0;a<r;a++)for(let r=0;r<=n;r++){let o=c(a,r),l=t.s[o]+(i.junction??0);e.vertex([t.px[o],t.py[o],t.pz[o]],[l,M*r/n+s,t.z[o],t.ao[o]],[t.nx[o],t.ny[o],t.nz[o]])}let l=n+1,u=(e,n)=>{let i=c(Math.min(Math.max(e,0),r-1),n);return t.rad[i]-t.base[i]};for(let t=0;t<r-1;t++)for(let r=0;r<n;r++){let n=a+t*l+r;Math.abs(u(t-1,r-1)-2*u(t,r)+u(t+1,r+1))+Math.abs(u(t,r)-2*u(t+1,r+1)+u(t+2,r+2))<=Math.abs(u(t-1,r+2)-2*u(t,r+1)+u(t+1,r))+Math.abs(u(t,r+1)-2*u(t+1,r)+u(t+2,r-1))?e.quad(n,n+1,n+l+1,n+l,o.BARK):e.quad(n+1,n+l+1,n+l,n,o.BARK)}for(let[c,u]of i.caps.entries()){if(u===`inside`)continue;let d=c?r-1:0;if(u===`buried`){let r=t.sp,u=t.s[d*n],f=W(r,u),p=c?1:-1,m=t.base[d*n],h=e.vertex([f.cx+p*f.tx*m*.4,f.cy+p*f.ty*m*.4,f.cz+p*f.tz*m*.4],[u+(i.junction??0),s,0,.1],[p*f.tx,p*f.ty,p*f.tz]);for(let t=0;t<n;t++){let n=a+d*l+t,r=n+1;c?e.tri(n,r,h,o.BARK):e.tri(r,n,h,o.BARK)}}else Oe(e,t)}}function Oe(e,t){let{N:n,rings:r,L:i,sp:a}=t,s=r-1,c=0;for(let e=0;e<n;e++)c+=t.rad[s*n+e];c/=n;let l=[];for(let r=0;r<=22;r++){let o=1-r/22,u=[];for(let l=0;l<n;l++){let d=s*n+l,f=M*l/n,p;if(r===0)p=[t.px[d],t.py[d],t.pz[d]];else{let e=W(a,i.sBreak+i.brk.height(o,f)),n=f+e.tau,s=Math.cos(n),c=Math.sin(n),l=t.rad[d]*o*(r===1?.985:1);p=[e.cx+(s*e.rx+c*e.bx)*l,e.cy+(s*e.ry+c*e.by)*l,e.cz+(s*e.rz+c*e.bz)*l]}let m=(.55+.45*P(0,.6,1-o))*(r===0?.8:1);if(u.push(e.vertex(p,[Math.cos(f)*o*c,Math.sin(f)*o*c,0,m])),r===22)break}l.push(u)}for(let t=0;t<22;t++)for(let r=0;r<n;r++){let i=l[t][r],a=l[t][(r+1)%n];t===21?e.tri(i,a,l[22][0],o.WOOD_END):e.quad(i,a,l[t+1][(r+1)%n],l[t+1][r],o.WOOD_END)}}function ke(e,t){let{sp:n,N:r,rings:i}=e,a=e.s[(i-1)*r],o=Math.max(1,Math.round(a/.1));for(let s=0;s<o;s++){let c=s/o*a,l=(s+1)/o*a,u=W(n,c),d=[u.cx,u.cy,u.cz],f=W(n,l),p=[f.cx,f.cy,f.cz];if(Math.max(d[1],p[1])<-.6||e.L.parent!==void 0&&l<.05)continue;let m=0;for(let t=Math.floor(c/n.step);t<=Math.min(i-1,Math.ceil(l/n.step));t++)for(let n=0;n<r;n+=4)m=Math.max(m,e.bs[t*r+n]);let h=Math.round(m*.9*1e3)/1e3;t.push({a:d.map(e=>Math.round(e*1e3)/1e3),b:p.map(e=>Math.round(e*1e3)/1e3),r:Math.round((h+.05)*1e3)/1e3,solid:h})}}function Ae(e){let t=e=>Math.abs(e)<5e-6?`0.0`:e.toFixed(5),n=e=>`vec3f(${t(e[0])}, ${t(e[1])}, ${t(e[2])})`,r=``;for(let[i,a]of e.entries()){let e=a.spine,o=a.junction??0,s=Math.max(2,Math.ceil(e.L/.06)),c=[];for(let t=0;t<=s;t++){let n=W(e,t/s*e.L),r=Math.hypot(n.tx,n.ty,n.tz);c.push([o+t/s*e.L,[n.cx,n.cy,n.cz],[n.tx/r,n.ty/r,n.tz/r]])}r+=`fn scape_wood_axis${i}(s: f32) -> ScapeWoodAxis {\n`;for(let e=0;e<s;e++){let[i,o,l]=c[e],[u,d,f]=c[e+1],p=`scape_wood_lerp(${n(o)}, ${n(l)}, ${n(d)}, ${n(f)}, ${t(a.twist)}, clamp((s - ${t(i)}) * ${t(1/(u-i))}, 0.0, 1.0))`;r+=e<s-1?`  if (s < ${t(u)}) {\n    return ${p};\n  }\n`:`  return ${p};\n`}r+=`}

`}r+=`fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {
`;for(let t=1;t<e.length;t++)r+=`  if (limb == ${t}) {\n    return scape_wood_axis${t}(along);\n  }\n`;return r+`  return scape_wood_axis0(along);
}
`}function je(e){let t=e.find(e=>e.caps[1]===`broken`).spine,n=W(t,t.L),r=Math.hypot(n.tx,n.ty,n.tz);return`vec3f(${(n.tx/r).toFixed(5)}, ${(n.ty/r).toFixed(5)}, ${(n.tz/r).toFixed(5)})`}var Me=oe(),Ne=`
struct ScapeWoodAxis {
  c: vec3f,
  t: vec3f,
  twist: f32,
}

fn scape_wood_lerp(c0: vec3f, t0: vec3f, c1: vec3f, t1: vec3f, twist: f32, f: f32) -> ScapeWoodAxis {
  var a: ScapeWoodAxis;
  a.c = mix(c0, c1, f);
  a.t = normalize(mix(t0, t1, f));
  a.twist = twist;
  return a;
}

${Ae(Me)}
// The bark's fine fibres, a height (about -1..1) at a distance along the limb and an angle round
// it: drawn out along the grain, thin round it.
fn scape_wood_fibres(along: f32, ang: f32) -> f32 {
  // (The fibres wander a little round as they go.)
  let a = ang + 0.05 * scape_noise3(vec3f(cos(ang) * 4.0, sin(ang) * 4.0, along * 9.0));
  let q = vec3f(cos(a) * 34.0, sin(a) * 34.0, along * 38.0);
  let r = 1.0 - abs(scape_noise3(q));
  return r * r * 1.4 - 0.7 + 0.5 * scape_noise3(q * vec3f(2.1, 2.1, 1.3) + vec3f(3.1, 7.7, 1.3));
}

// Coarser grooves and swellings along the grain (a height, about -1..1).
fn scape_wood_streaks(along: f32, ang: f32) -> f32 {
  return scape_noise3(vec3f(cos(ang) * 11.0, sin(ang) * 11.0, along * 7.0));
}

fn scape_mat_bark(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let along = attrs.x;
  let ang = attrs.y;
  let deep = clamp(attrs.z, 0.0, 1.0);
  let ao = clamp(attrs.w, 0.0, 1.0);
  // (Which limb: the angle's whole pairs of turns.)
  let limb = i32(floor(ang * (1.0 / 12.566371) + 0.25));

  // The grain's direction on the surface (along the limb, turned by its twist) and round it.
  let ax = scape_wood_axis(along, limb);
  let rv = p - ax.c - dot(p - ax.c, ax.t) * ax.t;
  let r = max(length(rv), 0.02);
  let roundDir = normalize(cross(ax.t, n) + vec3f(1.0e-5, 0.0, 0.0));
  let grain = normalize(ax.t - dot(ax.t, n) * n + roundDir * (ax.twist * r));

  // Fine relief on top of the geometry's: fibres (~2 mm) and streaks (~1 cm), each faded to its
  // mean where a pixel grows past it; slopes from differences along the grain and round it.
  let fineFade = (1.0 - smoothstep(0.0003, 0.0008, foot)) * (0.45 + 0.55 * smoothstep(-0.4, 0.4, scape_noise3(p * 23.0)));
  let midFade = 1.0 - smoothstep(0.001, 0.003, foot);
  var dAlong = 0.0;
  var dRound = 0.0;
  var fib = 0.0;
  if (fineFade > 0.0) {
    fib = scape_wood_fibres(along, ang);
    dAlong += fineFade * 0.00028 * (scape_wood_fibres(along + 0.002, ang) - fib) / 0.002;
    dRound += fineFade * 0.00028 * (scape_wood_fibres(along, ang + 0.0035) - fib) / (0.0035 * r);
  }
  var st = 0.0;
  if (midFade > 0.0) {
    st = scape_wood_streaks(along, ang);
    dAlong += midFade * 0.001 * (scape_wood_streaks(along + 0.01, ang) - st) / 0.01;
    dRound += midFade * 0.001 * (scape_wood_streaks(along, ang + 0.012) - st) / (0.012 * r);
  }
  // (Less of it deep in the fissures, where the shading is dark anyway; never tipped too far.)
  var tilt = (1.0 - 0.5 * deep) * (dAlong * grain + dRound * roundDir);
  tilt *= min(1.0, 0.6 / max(length(tilt), 1.0e-6));
  m.n = normalize(n - tilt);

  // Colour: warm wet mid brown, lighter on the worn crests, dark deep in the fissures; streaks
  // along the grain (paler, bleached ones and reddish ones) and a broad mottle.
  let gx = cos(ang);
  let gy = sin(ang);
  let streakA = scape_noise3(vec3f(gx * 3.2 + 4.1, gy * 3.2 + 1.7, along * 2.2));
  let streakB = scape_noise3(vec3f(gx * 6.5 + 9.3, gy * 6.5 + 2.2, along * 3.1 + 5.0));
  let mottle = scape_fbm3(p * 9.0 + vec3f(1.3, 4.1, 2.7), 3);
  var col = vec3f(0.48, 0.29, 0.15);
  col = mix(col, vec3f(0.57, 0.41, 0.26), smoothstep(0.1, 0.7, streakA) * 0.6);
  col = mix(col, vec3f(0.49, 0.24, 0.11), smoothstep(0.2, 0.75, streakB) * 0.5);
  col = col * (0.97 + 0.24 * mottle);
  // The crests, worn by the water: lighter and greyer (more so out in the open); the fissures
  // dark.
  let crest = (1.0 - smoothstep(0.0, 0.35, deep)) * smoothstep(0.35, 0.9, ao);
  col = mix(col, col * 1.15 + vec3f(0.09, 0.06, 0.03), crest * 0.65);
  col = mix(col, vec3f(0.13, 0.075, 0.04), smoothstep(0.25, 0.95, deep));
  // Fibres and streaks show a little in the colour too (their mean where they fade).
  col *= 1.0 + 0.12 * fineFade * fib + 0.1 * midFade * st;
  // A faint film of algae on the faces turned up to the light.
  let up = smoothstep(0.35, 0.95, n.y) * (1.0 - deep);
  let film = up * smoothstep(-0.2, 0.5, scape_noise3(p * 14.0 + vec3f(7.0, 1.0, 3.0)));
  col = mix(col, vec3f(0.27, 0.29, 0.13), film * 0.12);
  m.albedo = scape_linear(clamp(col, vec3f(0.0), vec3f(1.0)));

  // Wet wood: a faint sheen, rougher on the worn crests, smoother where water lies in the cracks.
  m.rough = clamp(0.62 + 0.07 * crest - 0.08 * deep + 0.04 * mottle, 0.5, 0.75);
  m.spec = 0.036;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}

// Bare wood where the limb broke off: pale, with growth rings round its middle, fine rays, and the
// torn fibres streaked along the limb.
fn scape_mat_woodEnd(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m: ScapeMat;
  let xy = attrs.xy;
  let ao = clamp(attrs.w, 0.0, 1.0);
  let axis = ${je(Me)};
  let side = normalize(cross(axis, vec3f(0.0, 0.0, 1.0)));
  let side2 = cross(axis, side);
  // Rings a little off centre and wavy, ~0.4 mm apart (faded to their mean where a pixel spans
  // several), fine rays out from the middle.
  let rr = length(xy - vec2f(0.004, -0.003) * (1.0 - smoothstep(0.0, 0.05, length(xy)))) + 0.0018 * scape_noise3(vec3f(xy * 90.0, 1.7));
  let ringFade = 1.0 - smoothstep(0.0008, 0.0017, foot);
  let ph = fract(rr / 0.0034);
  let late = smoothstep(0.62, 0.86, ph) * (1.0 - smoothstep(0.9, 1.0, ph));
  let rays = smoothstep(0.55, 0.95, scape_noise3(vec3f(atan2(xy.y, xy.x) * 40.0, rr * 60.0, 3.3)));
  // The torn fibres: streaks along the limb.
  let fq = vec3f(dot(p, axis) * 30.0, dot(p, side) * 900.0, dot(p, side2) * 900.0);
  let fibre = scape_noise3(fq);
  let fineFade = 1.0 - smoothstep(0.0002, 0.0005, foot);
  // (Weathered, not fresh.)
  var col = vec3f(0.5, 0.38, 0.25);
  col = mix(col, vec3f(0.37, 0.25, 0.15), late * 0.7 * ringFade + 0.25 * (1.0 - ringFade));
  col = mix(col, vec3f(0.6, 0.48, 0.34), rays * 0.25 * ringFade);
  col *= 0.9 + 0.18 * fibre * fineFade;
  // The pith, dark; the rim and the hollows weathered towards the bark's brown.
  col = mix(col, vec3f(0.25, 0.15, 0.08), 1.0 - smoothstep(0.002, 0.005, length(xy)));
  col = mix(col, vec3f(0.36, 0.25, 0.15), (1.0 - smoothstep(0.55, 0.95, ao)) * 0.6);
  m.albedo = scape_linear(col);
  // The fibres' ridges in the normal, across the grain.
  let e = 0.0012;
  let g = (scape_noise3(fq + vec3f(0.0, e * 900.0, 0.0)) - fibre) / e * side + (scape_noise3(fq + vec3f(0.0, 0.0, e * 900.0)) - fibre) / e * side2;
  m.n = normalize(n - fineFade * 0.00012 * (g - dot(g, n) * n));
  m.rough = 0.74;
  m.spec = 0.03;
  m.trans = vec3f(0.0);
  m.ao = ao;
  return m;
}
`,Pe=r({WGSL:()=>lt,build:()=>at}),Fe=[{at:[-.4,.32],size:[.24,.15,.19],sink:.35,yaw:.3,lean:[.04,-.06],freq:52,seed:11,exp:[2.1,2.3],taper:.04,ends:[[1.12,.88],[.55,1.45],[1.05,.95]],lumps:.06,planes:[[.25,1,.45,.66,.06],[.95,.2,-.1,.72,.06],[-.3,.5,-.8,.78,.07]],facets:2,dents:[[-.6,.35,.7,.35,.04],[.1,.9,-.4,.3,.025]],cracks:[[.25,.8,.5,.3,.28,.6],{from:0,at:-.25,turn:2.4,length:.2,depth:.6}],pits:.22,bedding:.7,layers:[.3,.9,-.2]},{at:[.17,.24],size:[.17,.085,.14],sink:.3,yaw:-.5,lean:[-.05,.05],freq:36,seed:23,exp:[2.2,2.4],taper:.05,ends:[[1.1,.9],[.42,1.58],[.92,1.08]],lumps:.05,planes:[[-.35,1,.3,.62,.06],[-.9,.2,.35,.78,.06]],facets:2,dents:[[.6,.5,.6,.4,.035]],cracks:[[.1,.8,.55,1,.55,.6]],pits:.5,bedding:.3,layers:[.9,.3,.2]},{at:[.408,.041],size:[.15,.075,.12],sink:.36,yaw:.9,lean:[.08,0],freq:32,seed:37,exp:[2.2,2.4],taper:0,ends:[[1,.88],[.4,1.6],[.95,1.05]],lumps:.04,planes:[[.35,1,.45,.62,.06],[.2,.3,.95,.75,.08]],facets:2,dents:[[-.5,.6,.6,.35,.04]],cracks:[[.5,.55,.65,1.3,.3,.8],{from:0,at:.2,turn:.7,length:.12,depth:.5}],pits:.9,bedding:0,layers:[0,1,0]},{at:[.62,.12],size:[.09,.05,.08],sink:.36,yaw:-.3,lean:[.02,.04],freq:20,seed:41,exp:[2,2.1],taper:0,ends:[[1,.95],[.46,1.54],[1,1]],lumps:.05,planes:[[.3,1,-.3,.66,.07]],facets:1,dents:[[.5,.7,.4,.4,.03]],cracks:[[.2,.7,.7,2.4,.35,.5]],pits:.3,bedding:.6,layers:[.2,.95,.3]}],Ie={a:[.482,-.64,-.139],b:[.432,-.45,-.14],r:.09},Le=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Re=e=>Math.hypot(e[0],e[1],e[2]),K=e=>{let t=Re(e)||1;return[e[0]/t,e[1]/t,e[2]/t]},ze=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Be=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},Ve=e=>Math.min(Math.max(e,0),1);function He({a:e,b:t,r:n},r,i,a){let o=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],s=Ve(((r-e[0])*o[0]+(i-e[1])*o[1]+(a-e[2])*o[2])/Le(o,o));return Math.hypot(r-e[0]-o[0]*s,i-e[1]-o[1]*s,a-e[2]-o[2]*s)-n}function Ue(e,t,n,r){let i=Math.imul(e,668265261)^Math.imul(t,374761393)^Math.imul(n,2654435761)^Math.imul(r,2246822519);return i=Math.imul(i^i>>>15,2246822507),i=Math.imul(i^i>>>13,3266489909),((i^i>>>16)>>>0)/4294967296}function We(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=9,s=9,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=r+f,m=i+d,h=a+u,g=p+Ue(p,m,h,1)-e,_=m+Ue(p,m,h,2)-t,v=h+Ue(p,m,h,3)-n,y=g*g+_*_+v*v;y<o?(s=o,o=y,c=Ue(p,m,h,4),l=Ue(p,m,h,5)):y<s&&(s=y)}return[Math.sqrt(o),Math.sqrt(s),c,l]}function Ge(e){let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(K),r=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=n.slice(),a=(e,t,n)=>K([e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]),o=new Map,s=(t,r,s)=>{let c=Math.min(t,r)*12+Math.max(t,r),l=o.get(c);if(!l){l=[];let[s,u]=t<r?[t,r]:[r,t];for(let t=1;t<e;t++)l.push(i.push(a(n[s],n[u],t/e))-1);o.set(c,l)}return t<r?l[s-1]:l[e-s-1]},c=[];for(let[t,a,o]of r){Le(ze([n[a][0]-n[t][0],n[a][1]-n[t][1],n[a][2]-n[t][2]],[n[o][0]-n[t][0],n[o][1]-n[t][1],n[o][2]-n[t][2]]),n[t])<0&&([a,o]=[o,a]);let r=new Map,l=(c,l)=>{if(c===0&&l===0)return t;if(c===e)return a;if(l===e)return o;if(l===0)return s(t,a,c);if(c===0)return s(t,o,l);if(c+l===e)return s(a,o,l);let u=c*(e+1)+l,d=r.get(u);if(d===void 0){let s=n[t],f=n[a],p=n[o],m=(e-c-l)/e,h=c/e,g=l/e;d=i.push(K([s[0]*m+f[0]*h+p[0]*g,s[1]*m+f[1]*h+p[1]*g,s[2]*m+f[2]*h+p[2]*g]))-1,r.set(u,d)}return d};for(let t=0;t<e;t++)for(let n=0;n<e-t;n++)c.push(l(t,n),l(t+1,n),l(t,n+1)),t+n<e-1&&c.push(l(t+1,n),l(t+1,n+1),l(t,n+1))}return{dirs:i,tris:c}}function Ke(e,t){let n=Array.from({length:e},()=>new Set);for(let e=0;e<t.length;e+=3){let[r,i,a]=[t[e],t[e+1],t[e+2]];n[r].add(i).add(a),n[i].add(r).add(a),n[a].add(r).add(i)}let r=new Uint32Array(e+1);for(let t=0;t<e;t++)r[t+1]=r[t]+n[t].size;let i=new Uint32Array(r[e]);for(let t=0;t<e;t++)i.set([...n[t]],r[t]);return{start:r,list:i}}function qe(e,t,n){let r=Float64Array.from(e),i=new Float64Array(e.length);for(let e=0;e<n;e++){for(let e=0;e<r.length;e++){let n=0;for(let i=t.start[e];i<t.start[e+1];i++)n+=r[t.list[i]];i[e]=.5*r[e]+.5*n/(t.start[e+1]-t.start[e])}[r,i]=[i,r]}return r}function Je(e,t){let n=new Float64Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=ze([e[a]-e[i],e[a+1]-e[i+1],e[a+2]-e[i+2]],[e[o]-e[i],e[o+1]-e[i+1],e[o+2]-e[i+2]]);for(let e of[i,a,o])for(let t=0;t<3;t++)n[e+t]+=s[t]}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2])||1;n[e]/=t,n[e+1]/=t,n[e+2]/=t}return n}function Ye(e,t){let{half:n,exp:r,ends:i,lumps:o,planes:c,off:l,taper:u}=e,d=1-u*t[1],f=n[0]*i[0][t[0]<0?0:1]*d,p=n[1]*i[1][t[1]<0?0:1],m=n[2]*i[2][t[2]<0?0:1]*d,[h,g]=r,_=1/(((Math.abs(t[0])/f)**h+(Math.abs(t[2])/m)**h)**(g/h)+(Math.abs(t[1])/p)**g)**(1/g);_*=1+o*a(t[0]*1.2+l[0],t[1]*1.2+l[1],t[2]*1.2+l[2],3)+.15*o*s(t[0]*3+l[1],t[1]*3+l[2],t[2]*3+l[0]);for(let n of e.dents){let e=Le(t,n.dir);e>0&&(_*=1-n.depth*Math.exp(-(1-e)/n.size))}let v=0;for(let e of c){let n=Le(t,e.n);if(n<.001)continue;let r=e.h/n,i=e.soft,a=Math.max(i-Math.abs(_-r),0)/i;v=Math.max(v,Ve(.5+.5*(_-r)/i)),_=Math.min(_,r)-a*a*i*.25}return[_,v]}function Xe(e,t){let n=e.scale,r=[t[0]/n[0],t[1]/n[1],t[2]/n[2]],i=Re(r),[a,o]=Ye(e,[r[0]/i,r[1]/i,r[2]/i]);return[a/i,o]}var Ze=(e,t)=>e.wob.reduce((e,[n,r,i,a,o])=>e+o*Math.sin(n*t[0]+r*t[1]+i*t[2]+a),0),Qe=(e,t)=>e.branch?Be(-.1*e.length,.05*e.length,t)*(1-Be(.2*e.length,e.length,t)):1-Be(.15*e.length,e.length,Math.abs(t)),$e=(e,t)=>.4+.6*Be(-.35,.15,.6*Math.sin(t*e.open[0]+e.open[1])+.4*Math.sin(t*e.open[2]+e.open[3])),et=(e,t)=>.6+.6*Be(-.5,.5,.7*Math.sin(t*e.wide[0]+e.wide[1])+.3*Math.sin(t*e.wide[2]+e.wide[3]));function tt(e){let n={...e},r=t(n.seed*7919+13),[i,a,o]=n.size,s=a/(1-n.sink);n.half=[i/2,s/2,o/2],n.mean=(i/2+s/2+o/2)/3,n.off=[r()*50-25,r()*50-25,r()*50-25],n.layers=K(n.layers),n.dents=n.dents.map(([e,t,n,r,i])=>({dir:K([e,t,n]),size:1-Math.cos(r),depth:i}));let l=Array.from({length:n.facets},()=>{let e=r()*2*Math.PI,t=.35+.55*r(),n=Math.sqrt(1-t*t);return[n*Math.cos(e),t,n*Math.sin(e),.8+.06*r(),.1+.05*r()]});n.planes=[...n.planes,...l].map(([e,t,r,i,a])=>{let o=K([e,t,r]);return{n:o,h:i*Math.hypot(...[0,1,2].map(e=>n.half[e]*n.ends[e][o[e]<0?0:1]*o[e])),soft:a*n.mean}});let u=Ge(16).dirs;n.scale=[1,1,1];let d=[1/0,1/0,1/0],f=[-1/0,-1/0,-1/0];for(let e of u){let[t]=Xe(n,e);for(let n=0;n<3;n++)d[n]=Math.min(d[n],e[n]*t),f[n]=Math.max(f[n],e[n]*t)}n.scale=[i/(f[0]-d[0]),s/(f[1]-d[1]),o/(f[2]-d[2])];let[p,m]=n.lean,h=e=>{let[t,r,i]=e;return[t,r]=[t*Math.cos(m)-r*Math.sin(m),t*Math.sin(m)+r*Math.cos(m)],[r,i]=[r*Math.cos(p)-i*Math.sin(p),r*Math.sin(p)+i*Math.cos(p)],[t,i]=[t*Math.cos(n.yaw)+i*Math.sin(n.yaw),-t*Math.sin(n.yaw)+i*Math.cos(n.yaw)],[t,r,i]};n.turn=[h([1,0,0]),h([0,1,0]),h([0,0,1])];let g=-1/0;for(let e of u){let[t]=Xe(n,e);g=Math.max(g,h([e[0]*t,e[1]*t,e[2]*t])[1])}n.shift=[n.at[0],c+a-g,n.at[1]],n.crackList=[];for(let e of n.cracks){let t,i,a=!1,o,s;if(Array.isArray(e)){t=K(e.slice(0,3));let n=K(ze(t,Math.abs(t[1])<.9?[0,1,0]:[1,0,0])),r=ze(t,n);i=n.map((t,n)=>t*Math.cos(e[3])+r[n]*Math.sin(e[3])),[o,s]=e.slice(4)}else{let r=n.crackList[e.from];t=K(r.at.map((t,n)=>t+r.along[n]*e.at*r.length));let c=K(r.along.map((e,n)=>e-t[n]*Le(r.along,t))),l=ze(t,c);i=c.map((t,n)=>t*Math.cos(e.turn)+l[n]*Math.sin(e.turn)),a=!0,{length:o,depth:s}=e}let[c]=Xe(n,t),l=K(ze(t,i)),u=K(i),d=(e,r)=>{let i=K(t.map((t,n)=>t+r*e[n])),[a]=Xe(n,i);return i.map(e=>e*a)},[f,p,m,h]=[d(l,.01),d(l,-.01),d(u,.01),d(u,-.01)],g=K(ze(f.map((e,t)=>e-p[t]),m.map((e,t)=>e-h[t])));Le(g,t)<0&&(g=g.map(e=>-e)),i=K(i.map((e,t)=>e-g[t]*Le(i,g)));let _=[[12,.008],[80,.0012],[210,4e-4]].map(([e,t])=>{let n=K([r()*2-1,r()*2-1,r()*2-1]);return[n[0]*e,n[1]*e,n[2]*e,r()*2*Math.PI,t]});n.crackList.push({at:t.map(e=>e*c),out:t,along:i,n:K(ze(i,g)),branch:a,length:o*2*n.mean,depth:s,wob:_,open:[35,r()*6.3,90,r()*6.3],wide:[60,r()*6.3,150,r()*6.3],k:r()*40})}return n}function nt(e,t,n){let[r,i,o]=e.off,c=t[0]+r,l=t[1]+i,u=t[2]+o,d=e.spacing,f=.0065*(1-.8*n)*a(c*16,l*16,u*16,3),[p]=We(c/.04,l/.04,u/.04);f+=.0035*(1-.8*n)*(p*p-.35);let[m]=We(c/.012+4.4,l/.012,u/.012);f+=.0012*(1-n)*(m*m-.3),n>0&&(f+=.0012*n*a(c*70+1.7,l*70,u*70,2));let h=1-Math.abs(s(c*24+5.1,l*24,u*24)+.2*s(c*70,l*70,u*70+2.3));if(f-=.001*(1-.6*n)*Be(.05,.55,s(c*5,l*5+7.7,u*5))*h**6,e.bedding>0){let n=Le(t,e.layers)*52+1.6*a(c*6,l*6,u*6,2);f-=7e-4*e.bedding*(1-Math.abs(Math.sin(Math.PI*n)))**3*(.5+.5*s(c*11,l*11,u*11+4))}let g=Be(-.35,.45,s(c*8+3.1,l*8,u*8));for(let[t,n,r,i,a,o]of[[Math.max(.01,6*d),e.pits*(.2+.7*g),.25,.45,.3,0],[.032,.04*e.pits,.16,.3,.2,.35]]){let[e,,d,p]=We(c/t+9.1,l/t,u/t),m=(r+(i-r)*p)*(1+o*s(c*180,l*180+2.2,u*180));if(d<n&&e<m){let n=1-e/m*(e/m);f-=a*m*t*n*n}}let _=3.2*d,[v,y]=We(c/_,l/_+3.3,u/_),b=(.08+.05*n)*d*Be(0,.3,y-v);b+=(.09+.05*n)*d*a(c/(3.5*d),l/(3.5*d),u/(3.5*d),2);let x=0;for(let n of e.crackList){let r=[t[0]-n.at[0],t[1]-n.at[1],t[2]-n.at[2]],i=Le(r,n.along),a=Qe(n,i)*Be(-.5*e.mean,-.25*e.mean,Le(r,n.out));if(a<=0)continue;let o=Le(r,n.n)+Ze(n,t),f=2.6*d*(.5+.5*a)*et(n,i);if(Math.abs(o)>10*f)continue;let p=o/f,m=.9*d*n.depth*a*$e(n,i);x+=m*((.75+.25*s(c*30,l*30+n.k,u*30))*Math.exp(-2*p*p)+.2*Math.exp(-p*p/12))}return[f+b-x,x,f-x]}function rt(e,t,n){let{nb:r}=n,i=n.dirs.length,a=e.size[1],o=new Float64Array(i*3),s=new Float64Array(i),l=(t,n)=>{let[r,i]=Xe(e,n);o[t*3]=n[0]*r,o[t*3+1]=n[1]*r,o[t*3+2]=n[2]*r,s[t]=i};n.dirs.forEach((e,t)=>l(t,e));let u=new Float64Array(i*3);for(let e=0;e<8;e++){for(let e=0;e<i;e++){let t=0,n=0,i=0,a=r.start[e+1]-r.start[e];for(let a=r.start[e];a<r.start[e+1];a++){let e=r.list[a]*3;t+=o[e],n+=o[e+1],i+=o[e+2]}u[e*3]=.5*o[e*3]+.5*t/a,u[e*3+1]=.5*o[e*3+1]+.5*n/a,u[e*3+2]=.5*o[e*3+2]+.5*i/a}for(let e=0;e<i;e++)l(e,K([u[e*3],u[e*3+1],u[e*3+2]]))}let d=0;for(let e=0;e<i;e++)for(let t=r.start[e];t<r.start[e+1];t++){let n=r.list[t]*3;d+=Math.hypot(o[n]-o[e*3],o[n+1]-o[e*3+1],o[n+2]-o[e*3+2])}e.spacing=d/r.list.length;let f=Je(o,n.tris),p=new Float64Array(i),m=new Float64Array(i),h=new Float64Array(i),g=new Float64Array(i*3),[_,v,y]=e.turn;for(let t=0;t<i;t++){let[n,r,i]=nt(e,[o[t*3],o[t*3+1],o[t*3+2]],s[t]);p[t]=n,m[t]=r,h[t]=i;let a=o[t*3]+f[t*3]*n,c=o[t*3+1]+f[t*3+1]*n,l=o[t*3+2]+f[t*3+2]*n;for(let n=0;n<3;n++)g[t*3+n]=_[n]*a+v[n]*c+y[n]*l+e.shift[n]}let b=Je(g,n.tris),x=qe(h,r,2),S=qe(h,r,12),C=qe(Array.from(h,(e,t)=>x[t]-e),r,1),w=new Float64Array(i*4);for(let n=0;n<i;n++){let r=Ve(Math.max(C[n]/(.25*e.spacing)*.25+(S[n]-h[n])/.004*.6,m[n]/(2*e.spacing))),i=g[n*3+1]-c,o=b[n*3+1],s=.45+.55*Be(-.01,.45*a,i),l=1-.55*Math.max(-o,0)*(1-Be(0,.7*a,i)),u=.82+.18*(.5+.5*o),d=He(Ie,g[n*3],g[n*3+1],g[n*3+2]),f=1-.45*Math.exp(-Math.max(d,0)/.015);w.set([t,r,0,Ve((1-.65*r)*s*l*u*f)],n*4)}let T=[Math.cos(e.yaw),0,-Math.sin(e.yaw)],E=[Math.sin(e.yaw),0,Math.cos(e.yaw)],D=0,O=0;for(let t=0;t<i;t++){if(g[t*3+1]<-.6)continue;let n=g[t*3]-e.at[0],r=g[t*3+2]-e.at[1];D=Math.max(D,Math.abs(n*T[0]+r*T[2])),O=Math.max(O,Math.abs(n*E[0]+r*E[2]))}let k=Math.max(O,.5*a),A=c+Math.max(a-k,0),j=Math.max(D-k,0);return{world:g,attrs:w,obstacle:{a:[e.at[0]-T[0]*j,A,e.at[1]-T[2]*j],b:[e.at[0]+T[0]*j,A,e.at[1]+T[2]*j],r:k+.05,solid:k}}}var it=Fe.map(tt);function at(){let e=new n(`rocks`),t=[],r=new Map;return it.forEach((n,i)=>{let a=r.get(n.freq);if(!a){let e=Ge(n.freq);a={...e,nb:Ke(e.dirs.length,e.tris)},r.set(n.freq,a)}let{world:s,attrs:c,obstacle:l}=rt({...n},i,a),u=e.vertexCount;for(let t=0;t<a.dirs.length;t++)e.vertex([s[t*3],s[t*3+1],s[t*3+2]],[c[t*4],c[t*4+1],c[t*4+2],c[t*4+3]]);for(let t=0;t<a.tris.length;t+=3)e.tri(u+a.tris[t],u+a.tris[t+1],u+a.tris[t+2],o.ROCK);t.push(l)}),{meshes:[e.finish()],obstacles:t}}var q=e=>e.toFixed(5),ot=e=>`vec3f(${e.map(q).join(`, `)})`;function st(){let e=Fe[0],n=t(e.seed*7919+4099);n();let r=[e.at[0],c+.45*e.size[1],e.at[1]],i=n()*2*Math.PI,a=(n()*2-1)*.6,o=[Math.sqrt(1-a*a)*Math.cos(i),a,Math.sqrt(1-a*a)*Math.sin(i)],s=Le(o,r)+(n()-.5)*.5*Math.min(e.size[0],e.size[2]);return[s,s+(n()<.5?-1:1)*(.015+.015*n())].map((e,t)=>`    let vein${`AB`[t]} = vec4f(${o.map(q).join(`, `)}, ${q(e)});`).join(`
`)}function ct(){let e=[];return it.forEach((t,n)=>{let[r,i,a]=t.turn;e.push(`  ${n?`} else `:``}if (id == ${n}u) {`,`    let back = transpose(mat3x3f(${ot(r)}, ${ot(i)}, ${ot(a)}));`,`    let ql = back * (p - ${ot(t.shift)});`,`    let nl = back * n;`);for(let n of t.crackList){let r=n.length,i=n.branch?`smoothstep(${q(-.1*r)}, ${q(.05*r)}, along) * (1.0 - smoothstep(${q(.2*r)}, ${q(r)}, along))`:`1.0 - smoothstep(${q(.15*r)}, ${q(r)}, abs(along))`,a=n.wob.map(([e,t,n,r,i])=>`${q(i)} * sin(dot(ql, ${ot([e,t,n])}) + ${q(r)})`).join(` + `);e.push(`    {`,`      let d = ql - ${ot(n.at)};`,`      let along = dot(d, ${ot(n.along)});`,`      let mask = (${i}) * smoothstep(${q(-.5*t.mean)}, ${q(-.25*t.mean)}, dot(d, ${ot(n.out)}));`,`      let cn = ${ot(n.n)};`,`      let off = dot(d, cn) + ${a};`,`      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${q(n.open[0])} + ${q(n.open[1])}) + 0.4 * sin(along * ${q(n.open[2])} + ${q(n.open[3])}));`,`      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${q(n.wide[0])} + ${q(n.wide[1])}) + 0.3 * sin(along * ${q(n.wide[2])} + ${q(n.wide[3])}));`,`      let hw = ${q(5e-4*Math.sqrt(n.depth))} * wide * (0.4 + 0.6 * mask);`,`      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);`,`      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);`,`      crackLine = max(crackLine, core * mask * open);`,`    }`)}}),e.push(`  }`),e.join(`
`)}var lt=`
fn scape_mat_rock(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let id = u32(attrs.x + 0.5);
  let cav = clamp(attrs.y, 0.0, 1.0);
  let fid = f32(id);
  // Each stone its own grey (sRGB) and tint: neutral slate, a warmer grey, a darker basalt, a
  // greenish grey.
  var base = vec3f(0.245, 0.245, 0.247);
  var tint = vec3f(0.99, 1.0, 1.02);
  if (id == 1u) {
    base = vec3f(0.255, 0.247, 0.236);
    tint = vec3f(1.03, 1.0, 0.96);
  } else if (id == 2u) {
    base = vec3f(0.205, 0.208, 0.215);
    tint = vec3f(1.0, 1.0, 1.03);
  } else if (id >= 3u) {
    base = vec3f(0.228, 0.233, 0.218);
    tint = vec3f(0.98, 1.03, 0.95);
  }
  let q = p + vec3f(fid * 7.31, fid * 3.17, fid * 5.53);
  let aa = max(foot, 1e-6);
  // Soft mottling: broad cloudy patches, paler clouds, a finer speckle; the tint drifting patch to
  // patch, and a faint rusty stain here and there, where iron in it weathered.
  let m1 = scape_fbm3(q * 9.0, 3);
  let m2 = scape_fbm3(q * 36.0 + vec3f(2.7), 2) * (1.0 - smoothstep(0.007, 0.014, aa));
  let cloud = smoothstep(0.15, 0.65, scape_noise3(q * 4.0 + vec3f(9.0)));
  var c = base * (1.0 + 0.36 * m1 + 0.14 * m2 + 0.18 * cloud);
  c *= mix(vec3f(1.0), tint, 0.5 + 0.5 * scape_noise3(q * 5.0 + vec3f(4.0)));
  c *= mix(vec3f(1.0), vec3f(1.07, 1.0, 0.9), smoothstep(0.35, 0.75, scape_noise3(q * 3.0 + vec3f(21.0))));
  // Mineral flecks: a share of small cells lit pale (a few dark), more of them in some drifts than
  // in others, most of them small and a few bigger, each its own tone, flattened along the
  // stone's grain (so most show as short laths), their rims ragged up close.
  let drift = smoothstep(-0.4, 0.5, scape_noise3(q * 18.0 + vec3f(1.3)));
  let paleShare = 0.2 + 0.2 * drift;
  let grainSeen = 1.0 - smoothstep(0.003, 0.006, aa);
  var pale = 0.0;
  var dark = 0.0;
  var tone = 0.42;
  if (aa < 0.006) {
    let lath = normalize(vec3f(sin(fid * 2.4 + 0.5), 0.35, cos(fid * 2.4 + 0.5)));
    let gq = q * 140.0;
    let cl = scape_cells3(gq + lath * dot(gq, lath) * 0.7);
    let u = fract(cl.z * 7.3);
    var rad = 0.12 + 0.28 * u * u;
    if (aa < 0.0016) {
      rad *= 1.0 + 0.35 * (1.0 - smoothstep(0.0008, 0.0016, aa)) * scape_noise3(q * 900.0);
    }
    // (Edges blurred over a pixel, in cell units; a little brighter at the heart.)
    let edge = max(70.0 * aa, 0.03);
    let fleck = (1.0 - smoothstep(rad - edge, rad + edge, cl.x)) * (0.8 + 0.2 * clamp(1.0 - cl.x / rad, 0.0, 1.0));
    pale = select(0.0, fleck, cl.z > 1.0 - paleShare);
    dark = select(0.0, fleck, cl.z < 0.03);
    tone = 0.34 + 0.14 * fract(cl.z * 17.0);
  }
  // (Faded out, the flecks' mean cover: about a twentieth of the share of cells lit, measured.)
  c = mix(c, vec3f(tone, 0.99 * tone, 0.94 * tone), 0.5 * mix(0.052 * paleShare, pale, grainSeen));
  c *= 1.0 - 0.4 * mix(0.0015, dark, grainSeen);
  // Pinprick pits, finer than the mesh's: a few small cells, dark and rougher.
  var pit = 0.0;
  if (aa < 0.0032) {
    let pc = scape_cells3(q * 160.0 + vec3f(5.0));
    let pitR = 0.1 + 0.12 * fract(pc.z * 11.0);
    let pitEdge = max(80.0 * aa, 0.35 * pitR);
    pit = select(0.0, 1.0 - smoothstep(pitR - pitEdge, pitR + pitEdge, pc.x), pc.z > 0.965 - 0.04 * drift) * (1.0 - smoothstep(0.0016, 0.0032, aa));
  }
  c *= 1.0 - 0.3 * pit;
  // A faint quartz vein through the biggest stone and a finer one beside it: each a thin pale band
  // where its plane (bent gently, the two alike) meets the surface, with a fainter halo, its width
  // wavering, pinching out in stretches.
  var vein = 0.0;
  if (id == 0u) {
${st()}
    let bend = 0.015 * scape_fbm3(q * 6.0, 2);
    for (var k = 0; k < 2; k++) {
      let pl = select(veinA, veinB, k == 1);
      let fk = f32(k);
      let warp = bend + 0.0012 * scape_noise3(q * 60.0 + vec3f(fk * 2.0));
      let across = max(length(pl.xyz - n * dot(pl.xyz, n)), 0.25);
      let dist = abs(dot(p, pl.xyz) - pl.w + warp) / across;
      let run = smoothstep(-0.4, 0.05, scape_noise3(q * 6.0 + vec3f(fk * 3.1, 5.0, 0.0))) * (1.0 - 0.45 * fk);
      let w = 0.0009 * (0.25 + 1.1 * smoothstep(-0.6, 0.6, scape_fbm3(q * 30.0 + vec3f(fk), 2))) * (1.0 - 0.4 * fk);
      let core = clamp((w - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * w / aa, 1.0);
      let halo = 1.0 - smoothstep(0.5 * w, 5.0 * w + aa, dist);
      vein = max(vein, run * max(core, 0.1 * halo));
    }
  }
  c = mix(c, vec3f(0.4, 0.395, 0.375), 0.35 * vein);
  // Hairline cracks: each crack's centre line, sharp at any scale, down the middle of its groove.
  var crackLine = 0.0;
${ct()}
  c *= 1.0 - 0.8 * crackLine;
  // Darker in its cavities, cracks and pits (the occlusion darkens them too).
  c *= mix(1.0, 0.6, cav);
  let albedo = scape_linear(clamp(c, vec3f(0.0), vec3f(1.0)));
  // Fine roughness in the normal: two octaves of bumps, each faded once a pixel outgrows it, the
  // matte it gave left in the roughness instead, so the stone is no glossier from afar.
  var grad = vec3f(0.0);
  var matte = 0.0;
  for (var o = 0; o < 2; o++) {
    let f = select(140.0, 420.0, o == 1);
    let s = select(0.06, 0.05, o == 1);
    let seen = 1.0 - smoothstep(0.25 / f, 0.5 / f, aa);
    matte += 0.08 * (1.0 - seen);
    if (seen <= 0.0) { continue; }
    let b = q * f + vec3f(f32(o) * 13.0);
    let b0 = scape_noise3(b);
    let gb = vec3f(scape_noise3(b + vec3f(0.25, 0.0, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.25, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.0, 0.25)) - b0) * 4.0;
    grad += gb * s * seen;
  }
  let sn = normalize(n - (grad - n * dot(grad, n)));
  // A soft wet sheen: glossier on the quartz and the flecks, rougher in the hollows and pits.
  let rough = clamp(0.56 + matte + 0.06 * m1 + 0.12 * cav + 0.1 * pit - 0.08 * vein - 0.1 * pale * grainSeen, 0.3, 0.85);
  return ScapeMat(albedo, sn, rough, 0.04, vec3f(0.0), clamp(attrs.w, 0.0, 1.0));
}
`,ut=r({WGSL:()=>nn,build:()=>en}),J=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],Y=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],X=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],dt=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],ft=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Z=e=>Math.hypot(e[0],e[1],e[2]),Q=e=>X(e,1/(Z(e)||1)),pt=(e,t,n)=>J(e,X(Y(t,e),n)),mt=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return J(J(X(e,r),X(ft(t,e),i)),X(t,dt(t,e)*(1-r)))},$=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},ht=[0,1,0],gt=(e,t)=>Q(Y(e,X(t,dt(e,t)))),_t=e=>e-Math.floor(e);function vt(e,t){let n=_t(e*.618034+.17),r=_t(e*.754877+.31),i=_t(e*.56984+.53);return{widest:.3+.12*n,base:2+r,tip:1.45+.5*i,drawn:t?.06+.14*n:.18+.2*n}}function yt(e,t){if(e<=t.widest)return Math.sqrt(Math.max(1-((t.widest-e)/t.widest)**t.base,0));let n=(e-t.widest)/(1-t.widest);return Math.max(1-n**t.tip,0)**1.05*(1-t.drawn*$(.62,1,n))}var bt=.3,xt=(e,t,n,r,i)=>{let a=Math.abs(t),o=+(t<0);return n*(e-bt*a**1.2*yt(e,i))+.5*o+.2*Math.sin(9*e+2.3*r+1.7*o)*Math.min(2*a,1)};function St(e){let t=e.length,n=.5*e.ratio*t,r=Q(ft(e.face,e.dir)),i=[[0,0,0]],a=[];for(let n=0;n<=120;n++){let o=n/120,s=e.arch*o**1.6+e.droop*$(.7,1,o),c=e.side*o**1.3,l=mt(e.dir,r,s),u=mt(e.face,r,s),d=mt(r,u,c);l=mt(l,u,c),d=mt(d,l,e.twist*o),u=mt(u,l,e.twist*o),a.push({T:l,N:u,X:d}),n&&i.push(J(i[n-1],X(J(l,a[n-1].T),.5*t/120)))}let o=t=>{let n=Math.min(Math.max(t,0),1)*120,r=Math.min(Math.floor(n),119),o=n-r;return{c:J(e.base,pt(i[r],i[r+1],o)),T:Q(pt(a[r].T,a[r+1].T,o)),N:Q(pt(a[r].N,a[r+1].N,o)),X:Q(pt(a[r].X,a[r+1].X,o))}},c=vt(e.id,!!e.small),l=(t,r)=>yt(t,c)*n*(r?1+e.asym:1-e.asym);return{b:e,L:t,H:n,at:(n,r)=>{let{c:i,N:a,X:u}=o(n),d=l(n,r>=0),f=Math.max(-1.2,Math.min(1.2,r/Math.max(d,1e-7))),p=Math.abs(f),m=Math.sin(Math.PI*Math.min(n*1.15,1)),h=e.cup*(.3+.7*m)*d*f*f;h+=e.fold*d*(Math.sqrt(f*f+.004)-.0632);let g=t*(.013-.007*n);h-=t*.0065*(1-.8*n)*Math.exp(-((r/g)**2)),h+=t*e.quilt*(.5-.5*Math.cos(2*Math.PI*xt(n,f,e.veins,e.id,c)))*$(.05,.2,p)*(1-$(.75,1,p))*$(.03,.12,n)*(1-$(.85,.98,n));let _=r>=0?e.phase:e.phase+2.3;if(h+=e.wave*d*(Math.sin(2*Math.PI*e.waves*n+_)+.6*s(n*6,f*1.3,e.id*3.7+.5))*$(.4,1,p)**2*m,!e.furl)return J(J(i,X(u,r)),X(a,h));let v=d/(e.furl*(r>=0?4.6:4)),y=r/Math.max(v,1e-7);return J(J(i,X(u,v*Math.sin(y))),X(a,v*(1-Math.cos(y))))},frame:o,half:l}}function Ct(e,t,n,r,i){let{b:a,L:o,at:s,frame:c,half:l}=t,u=(e,t)=>{let n=2e-4,r=ft(Y(s(Math.min(e+n,1),t),s(Math.max(e-n,0),t)),Y(s(e,t+n*o),s(e,t-n*o)));return Z(r)>1e-14?Q(r):c(e).N},d=[];for(let e=0;e<=r;e++){let t=-1+2*e/r;d.push(Math.sign(t)*Math.abs(t)**1.3)}let f=e.vertex(s(0,0),[0,0,a.id,1],c(0).N),p=[];for(let t=1;t<n;t++){let r=t/n,i=.6*r+.4*(.5-.5*Math.cos(Math.PI*r));p.push(d.map(t=>{let n=t*l(i,t>=0);return e.vertex(s(i,n),[i,t,a.id,1],u(i,n))}))}let m=e.vertex(s(1,0),[1,0,a.id,1],c(1).N);for(let t=0;t<r;t++){e.tri(f,p[0][t],p[0][t+1],i);for(let n=0;n+1<p.length;n++)e.quad(p[n][t],p[n+1][t],p[n+1][t+1],p[n][t+1],i);e.tri(p[p.length-1][t],m,p[p.length-1][t+1],i)}}function wt(e,t){let n=e.length,r=e.map((t,r)=>Q(Y(e[Math.min(r+1,n-1)],e[Math.max(r-1,0)]))),i=[gt(t,r[0])];for(let e=1;e<n;e++){let t=ft(r[e-1],r[e]),n=Z(t),a=n>1e-9?mt(i[e-1],X(t,1/n),Math.atan2(n,dt(r[e-1],r[e]))):i[e-1];i.push(gt(a,r[e]))}return{T:r,U:i}}function Tt(e,t,n,r,i,a,o,s=null){let c=t.length,{T:l,U:u}=wt(t,o),d=[],f=0;for(let i=0;i<c;i++){let o=u[i];if(i&&(f+=Z(Y(t[i],t[i-1]))),n[i]<=0){d.push(e.vertex(t[i],[f,0,a,1],i?l[i]:X(l[i],-1)));continue}let p=ft(l[i],o),m=Math.max(i-1,0),h=Math.min(i+1,c-1),g=Math.max(Z(Y(t[h],t[m])),1e-9),_=[];for(let c=0;c<=r;c++){let u=2*Math.PI*c/r,d=J(X(o,Math.cos(u)),X(p,Math.sin(u)));if(!s){let r=(n[h]-n[m])/g;_.push(e.vertex(J(t[i],X(d,n[i])),[f,u,a,1],Q(Y(d,X(l[i],Math.max(-3,Math.min(3,r)))))));continue}let v=s(i,u),y=(s(i,u+.001)-s(i,u-.001))/.002,b=Q(Y(X(d,v),X(J(X(o,-Math.sin(u)),X(p,Math.cos(u))),y))),x=(n[h]*s(h,u)-n[m]*s(m,u))/g*dt(d,b);_.push(e.vertex(J(t[i],X(d,n[i]*v)),[f,u,a,1],Q(Y(b,X(l[i],Math.max(-3,Math.min(3,x)))))))}d.push(_)}for(let t=0;t+1<c;t++){let n=d[t],a=d[t+1];for(let t=0;t<r;t++)typeof n==`number`?e.tri(n,a[t+1],a[t],i):typeof a==`number`?e.tri(n[t],n[t+1],a,i):e.quad(n[t],n[t+1],a[t+1],a[t],i)}}function Et(e,t,n,r,i,a=1.35){let o=[];for(let s=0;s<=i;s++){let c=1-(1-s/i)**a,l=1-c;o.push(J(J(X(e,l*l*l),X(t,3*l*l*c)),J(X(n,3*l*c*c),X(r,c*c*c))))}return o}function Dt(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function Ot(e,t,n,r,i){let a=e.frame(0),o=J(e.at(0,0),X(a.N,-.8*i)),s=Z(Y(o,t));return Et(t,J(t,X(n,.45*s)),Y(o,X(a.T,Math.min(.08,.3*s))),o,r)}function kt(e,t,n,r,i,a){let c=i.rTop*1.12,l=Ot(t,n,r,i.segs,c),u=Z(Y(l[l.length-1],n)),d=[];l.forEach((e,t)=>{let n=t/i.segs;if(t&&t<i.segs){let r=.003*Math.sin(Math.PI*n)*(u/.4);l[t]=J(e,[r*s(n*2.2,a*1.7,.3),r*s(n*2.2,a*1.7,5.1),r*s(n*2.2,a*1.7,9.7)])}let r=i.rBase+(i.rTop-i.rBase)*n**.7;d.push(r*(1+i.sheath*(1-$(0,i.sheathLen/u,n))**2)*(1+.14*$(.88,1,n)))});let f=i.midribSegs;for(let e=1;e<=f;e++){let n=e/f*i.midrib,r=e===f?0:c*(1-e/f)**.75;l.push(J(t.at(n,0),X(t.frame(n).N,-.8*r))),d.push(r)}let p=t.frame(0).N,{T:m,U:h}=wt(l,p),g=Math.atan2(dt(p,ft(m[i.segs],h[i.segs])),dt(p,h[i.segs]));return Tt(e,l,d,i.sides,o.STEM,a,p,(e,t)=>1-i.groove*(1-$(i.segs-3,i.segs,e))*Math.max(0,Math.cos(t-g))**3),l}function At(e,t=i-.01){if(Z(e)<=t)return e;let n=Math.hypot(e[0],e[2]),r=Math.sqrt(Math.max(t*t-e[1]*e[1],0));return[e[0]*r/n,e[1],e[2]*r/n]}function jt(e,t,n,r,i,a,l,u){let d=c-.9*a,f=Q(ft(n,ht)),p=.3*(u()-.5),m=(e,r,i=0)=>[t[0]+n[0]*e+f[0]*i,r,t[2]+n[2]*e+f[2]*i],h=Dt([t,m(.9*r,d+.7*a),m(r+.5*i,d,p*i),m(r+i,d,1.6*p*i),m(r+i+.012,d-.03,2*p*i),m(r+i+.018,d-.07,2.2*p*i)],5).map((e,t)=>{let n=t>6?.0025:0;return At(J(e,[n*s(t*.35,l,1.1),.4*n*s(t*.35,l,4.2),n*s(t*.35,l,7.3)]))});Tt(e,h,h.map((e,t)=>t===h.length-1?0:a*(1.1-.65*(t/h.length))),6,o.ROOT,l,ht)}var Mt=[{r:.1,pts:[[-.52,-.65,-.045],[-.5,-.55,-.055],[-.45,-.474,-.064],[-.38,-.418,-.076],[-.3,-.381,-.086],[-.21,-.358,-.113],[-.125,-.325,-.133],[-.034,-.29,-.144],[.06,-.273,-.152],[.16,-.273,-.159],[.25,-.299,-.164],[.33,-.342,-.158],[.39,-.403,-.147],[.44,-.47,-.136],[.48,-.55,-.131],[.5,-.65,-.138]]},{r:.085,pts:[[.15,-.27,-.165],[.2,-.13,-.245],[.228,-.04,-.254]]},{r:.095,pts:[[-.42,-.441,-.073],[-.4,-.501,-.004],[-.37,-.56,.058],[-.35,-.64,.108]]}],Nt=[{c:[-.4,.32],w:.24,h:.15,d:.19},{c:[.17,.24],w:.17,h:.1,d:.14},{c:[.4,.1],w:.15,h:.09,d:.12},{c:[.62,.12],w:.09,h:.05,d:.08}],Pt={lo:[-.35,-.15,-.2],hi:[.35,.6,.6]},Ft=(e,t,n)=>{let r=n[0]-t[0],i=n[1]-t[1],a=n[2]-t[2],o=e[0]-t[0],s=e[1]-t[1],c=e[2]-t[2],l=Math.min(Math.max((o*r+s*i+c*a)/(r*r+i*i+a*a),0),1);return Math.hypot(o-r*l,s-i*l,c-a*l)};function It(e,t){let n=0;for(let r of Mt)for(let i=0;i+1<r.pts.length;i++)n=Math.max(n,r.r+t-Ft(e,r.pts[i],r.pts[i+1]));for(let r of Nt){let i=r.h/.65,a=Z([(e[0]-r.c[0])/(.5*r.w+t),(e[1]-(c+r.h-.5*i))/(.5*i+t),(e[2]-r.c[1])/(.5*r.d+t)]);a<1&&(n=Math.max(n,(1-a)*.5*r.h))}let r=Math.min(...[0,1,2].map(t=>Math.min(e[t]-Pt.lo[t],Pt.hi[t]-e[t])));return Math.max(n,r-.015)}function Lt(e,t,n){let r=0;for(let a=0;a<=12;a++){let o=a/12;for(let a of[-1,-.5,0,.5,1]){let s=e.at(o,a*e.half(o,a>=0));if(s[1]>-.62&&(r=Math.max(r,Z(s)-(i-.012))),r=Math.max(r,It(s,t)),n)for(let e=0;e<3;e++)r=Math.max(r,n.lo[e]-s[e],s[e]-n.hi[e])}}return r}var Rt=class{constructor(e){this.cell=e,this.map=new Map}key(e,t,n){return((e+512)*1024+(t+512))*1024+(n+512)}add(e,t){let n=this.cell,r=this.key(Math.floor(e[0]/n),Math.floor(e[1]/n),Math.floor(e[2]/n));this.map.has(r)||this.map.set(r,[]),this.map.get(r).push({p:e,blade:t})}near(e,t,n){let r=this.cell,i=Math.floor(e[0]/r),a=Math.floor(e[1]/r),o=Math.floor(e[2]/r),s=0;for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++)for(let u of this.map.get(this.key(i+r,a+c,o+l))??[]){let r=u.blade?t:n,i=u.p[0]-e[0],a=u.p[1]-e[1],o=u.p[2]-e[2];i*i+a*a+o*o<(r-s)*(r-s)&&r>s&&(s=r-Math.sqrt(i*i+a*a+o*o))}return s}};function zt(e,t,n){let r=[];for(let i=0;i<=t;i++){let a=(i/t)**1.25;for(let t=0;t<=n;t++){let i=-1+2*t/n;r.push(e.at(a,i*e.half(a,i>=0)))}}return r}function Bt(e,t,n){let r=e=>{let t=St(e.b),r=Lt(t,n.margin,n.bounds),i=Ot(t,e.from,e.rise,12,0);for(let e of i.slice(4))r=Math.max(r,It(e,.01));if(n.crowd){for(let e of zt(t,n.samples[0],n.samples[1]))r=Math.max(r,n.crowd.near(e,n.gap,n.stalkGap));for(let e of i.slice(3))r=Math.max(r,n.crowd.near(e,n.stalkGap,0))}return{shape:t,w:r}},i=t[0].slice(1).map(()=>0),a={leaf:e(i),q:i};a.s=r(a.leaf);let o=a;for(let n=0,i=0;n<24&&o.s.w>0&&i<4;n++){let n=null;for(let i of t){let t=a.q.map((e,t)=>e+i[t]),o=e(t),s=r(o),c=s.w+i[i.length-1];(!n||c<n.cost)&&(n={cost:c,q:t,leaf:o,s})}a=n,a.s.w<o.s.w-1e-5?(o=a,i=0):i++}if(o.s.w>0&&n.wide){let t=null;for(let i of n.wide){let n=o.q.map((e,t)=>e+i[t]),a=e(n),s=r(a),c=s.w+i[i.length-1];s.w<o.s.w&&(!t||c<t.cost)&&(t={cost:c,q:n,leaf:a,s})}t&&(o=t)}return{leaf:o.leaf,shape:o.s.shape}}function Vt(e,t,n,r){for(let n of zt(t,r[0],r[1]))e.add(n,!0);for(let t of n)e.add(t,!1)}function Ht(e,t,n,r,i){let a=new Float64Array(n.length*8);n.forEach((e,t)=>a.set([...e.c,...e.n??[0,0,0],e.a,e.owner],t*8));for(let n=0;n<e.vertexCount;n++){let o=e.p[n*3],s=e.p[n*3+1],l=e.p[n*3+2],u=t[n],d=0;for(let e=0;e<a.length;e+=8){if(a[e+7]===u)continue;let t=a[e]-o,n=a[e+1]-s,r=a[e+2]-l,i=t*t+n*n+r*r;if(i<25e-6)continue;let c=Math.sqrt(i),f=n/c;if(f<=-.1)continue;let p=a[e+3]||a[e+4]||a[e+5]?Math.abs(a[e+3]*t+a[e+4]*n+a[e+5]*r)/c:.5;d+=a[e+6]*(f+.1)*p*$(.005,.015,c)/(Math.PI*i+a[e+6])}let f=$(-.01,r,s-c);e.a[n*4+3]=Math.max(Math.exp(-i*d),.35)*(.75+.25*f)}}function Ut(e,t,n){for(let r=0;r<8;r++)for(let i=0;i<4;i++){let a=(r+.5)/8,o=-1+(2*i+1)/4,s=e.half(a,o>=0);n.push({c:e.at(a,o*s),n:e.frame(a).N,a:e.L/8*(2*s/4),owner:t})}}function Wt(e,t,n,r){for(let i=3;i<e.length;i+=3)r.push({c:e[i],n:null,a:2*t*Z(Y(e[i],e[i-3])),owner:n})}var Gt=(e,t,n,r)=>{for(let i=n;i<e.vertexCount;i++)t[i]=r},Kt=[.5,c,-.32],qt={lo:[.06,-.7,-.64],hi:[.92,.2,.24]},Jt=[{top:[.42,-.06,-.46],dir:[-.66,.6,.25],length:.44,ratio:.5,arch:.85,at:.24,toward:1},{top:[.64,-.1,-.3],dir:[.4,.75,.3],length:.41,ratio:.48,arch:.8,at:.74,toward:.8},{top:[.47,-.2,-.15],dir:[-.75,.1,.65],length:.36,ratio:.5,arch:.6,at:.47,toward:.9},{top:[.36,-.14,-.5],dir:[-.6,.7,-.1],length:.34,ratio:.47,arch:.7,at:.06,toward:.9},{top:[.56,-.17,-.22],dir:[.55,.55,.6],length:.31,ratio:.5,arch:.75,at:.53,toward:.9},{top:[.67,-.26,-.43],dir:[.1,.8,-.4],length:.32,ratio:.48,arch:.6,at:.82,toward:.6},{top:[.64,-.32,-.13],dir:[.75,.3,.55],length:.29,ratio:.51,arch:.6,at:.66,toward:.9},{top:[.4,-.2,-.43],dir:[-.85,.35,-.05],length:.28,ratio:.49,arch:.6,at:.15,toward:1},{top:[.72,-.4,-.26],dir:[.45,.75,.4],length:.24,ratio:.5,arch:.6,at:.92,toward:.5},{top:[.575,-.38,-.345],dir:[.05,.97,.1],length:.16,ratio:.42,arch:.15,at:.58,furl:.6,toward:.5},{top:[.47,-.48,-.3],dir:[-.1,.95,.12],length:.1,ratio:.4,arch:.08,at:.37,furl:.8,toward:.5}];function Yt(e,t,n){let r=mt(e,ht,t),i=ft(r,ht);return Z(i)<.001?r:Q(mt(r,Q(i),Math.min(n,Math.acos(Math.min(r[1],1))-.05)))}function Xt(e,t){let r=new n(`plantTall`),i=[],a=[],l=[],u=[.4,c+.004,-.285],d=[.6,c+.004,-.36],f=.024,p=.016,m=e=>J(pt(u,d,e),[0,.006*Math.sin(Math.PI*e),.008*Math.sin(2*Math.PI*e)]);{let e=[0];for(let t=1;t<=400;t++)e.push(e[t-1]+Z(Y(m(t/400),m((t-1)/400))));let t=e[400],n=t=>{let n=1;for(;n<400&&e[n]<t;)n++;return(n-1+(t-e[n-1])/(e[n]-e[n-1]))/400},c=[];for(let e=0;e<8;e++)c.push(f*(1-Math.cos(e/8*.5*Math.PI)));for(let e=8;e*p/5<t-f-.001;e++)c.push(e*p/5);for(let e=8;e>=0;e--)c.push(t-f*(1-Math.cos(e/8*.5*Math.PI)));let l=[],u=[];c.forEach((e,r)=>{let i=Math.min(e,t-e),a=i<f?Math.sqrt(Math.max(1-((f-i)/f)**2,0)):1;l.push(m(n(e))),u.push(r===0||r===c.length-1?0:f*a*(1+.08*s(e*40,1.3,2.9)))});let d=(e,t)=>{let n=c[e],r=Math.round(n/p)%2?1:-1;return 1-.16*(.5+.5*Math.cos(2*Math.PI*n/p))**10*(.3+.7*(.5+.5*Math.cos(t-r*1.1))**1.5)};Tt(r,l,u,18,o.ROOT,0,ht,(e,t)=>d(e,t)*(1+.04*s(c[e]*14,.7*Math.cos(t)+2.3,.7*Math.sin(t)+7.1))),Gt(r,i,0,900),Wt(l,f,900,a)}let h=Q(Y(d,u)),g=Q(ft(ht,h));for(let e=0;e<4;e++){let n=r.vertexCount,a=.1+.8*e/3+.05*(t()-.5),o=Q(J(X(g,.6+.4*t()),X(h,1.2*(t()-.5)+(e===0?-1:+(e===3)))));jt(r,m(a),o,f,.015+.02*t(),.0045+.0015*t(),2+e,t),Gt(r,i,n,901+e)}let _=new Rt(.03),v=[18,7],y=[[.1,0,0,0],[-.1,0,0,0],[.3,0,0,.004],[-.3,0,0,.004],[0,.07,0,4e-4],[0,-.07,0,4e-4],[0,0,.05,.003]];return Jt.forEach((t,n)=>{let s=!!t.furl,c=Q([t.top[0]-Kt[0],0,t.top[2]-Kt[2]]),u=m(t.at),d=Q(J(ht,X(Q([t.top[0]-u[0],0,t.top[2]-u[2]]),.4+.7*e()))),f=Array.from({length:12},e),{leaf:p,shape:h}=Bt(([e,r,i])=>{let a=Yt(Q(t.dir),e,r),o=mt(gt(J(J(ht,[0,0,t.toward]),X(c,.3)),a),a,.4*(f[0]-.5));return{from:u,rise:d,b:{base:t.top,dir:a,face:o,length:t.length*Math.exp(-i),ratio:t.ratio,arch:t.arch*(.9+.2*f[1]),droop:s?0:.15+.15*f[2],side:.12*(f[3]-.5),twist:.35*(f[4]-.5),cup:s?.05:.14+.1*f[5],fold:.06+.04*f[6],quilt:s?0:6e-4+3e-4*f[7],wave:s?.02:.05+.04*f[8],waves:2.5+1.5*f[9],phase:6.28*f[10],asym:.08*(f[11]-.5),furl:t.furl??0,veins:13,id:n}}},y,{margin:.02,bounds:qt,crowd:_,gap:.02,stalkGap:.015,samples:v}),g=r.vertexCount;Ct(r,h,s?36:90,s?20:22,o.LEAF_BIG),Gt(r,i,g,n),Ut(h,n,a);let b=r.vertexCount,x=Math.max(14,Math.round(Z(Y(t.top,u))/.012)),S=kt(r,h,p.from,d,{rBase:s?.0072:.0085,rTop:s?.0055:.0062,sides:8,segs:x,midrib:s?.4:.6,midribSegs:s?10:20,sheath:.6,sheathLen:.045,groove:.2},n);if(Gt(r,i,b,1e3+n),Wt(S.slice(0,x+1),.007,1e3+n,a),Vt(_,h,S,v),s)l.push({a:S[Math.round(x*.3)],b:h.at(1,0),r:.03,solid:.015});else{let e=S[Math.round(x*.6)];l.push({a:S[Math.round(x*.25)],b:e,r:.035,solid:.02},{a:e,b:t.top,r:.035,solid:.02}),l.push({a:h.at(.12,0),b:h.at(.8,0),r:.85*h.H+.02,solid:0})}}),l.push({a:Kt,b:J(Kt,[0,.14,0]),r:.07,solid:.03}),Ht(r,i,a,.2,1.6),{mesh:r.finish(),obstacles:l}}var Zt=[-.6,c,.06],Qt={lo:[-.88,c+.012,-.22],hi:[-.3,-.2,.4]};function $t(e){let t=new n(`plantSmall`),r=[],i=[],a=[];{let e=[],n=[];for(let t=0;t<=20;t++){let r=t/20;e.push(J(Zt,[.002*Math.sin(3*r),-.03+.062*r,0]));let i=$(.72,1,r);n.push(t===20?0:.0145*(1-.25*r)*Math.sqrt(Math.max(1-i*i,0))*(1+.06*s(r*5,3.3,1)))}Tt(t,e,n,16,o.ROOT,1,[1,0,0]),Gt(t,r,0,900)}for(let n=0;n<3;n++){let i=t.vertexCount,a=1.6+n/2*2.4+.3*(e()-.5);jt(t,J(Zt,[0,.004,0]),[Math.cos(a),0,Math.sin(a)],.012,.015+.035*e(),.0024+8e-4*e(),10+n,e),Gt(t,r,i,901+n)}let c=[],l=Math.PI/180,u=new Rt(.012),d=[18,7],f=[[.12,0,0,0,0],[-.12,0,0,0,0],[.3,0,0,0,.001],[-.3,0,0,0,.001],[0,.06,0,0,5e-4],[0,-.06,0,0,5e-4],[0,0,.05,0,.002],[0,0,0,.25,5e-4],[0,0,0,-.25,5e-4]],p=[];for(let e=-3;e<=3;e++)for(let t of[-.15,0,.15])for(let n of[-.4,0,.4])p.push([.15*e,t,0,n,.004*Math.abs(.15*e)+.006*Math.abs(t)+.003*Math.abs(n)]);for(let n=0;n<20;n++){let a=19-n,s=1-a/19,m=2.6+2.6*(a*.618034%1-.5)*(1.4-.6*s)+.25*(e()-.5),h=(84-34*s+6*(e()-.5))*l,g=h-(4+18*s*(.6+.4*e()))*l,_=Math.min(.14,(.063+.077*(1-s))*(.85+.3*e())),v=Math.min(.27,(.17+.085*s)*(.9+.2*e())),y=Array.from({length:12},e),{leaf:b,shape:x}=Bt(([e,t,n,r])=>{let i=Math.min(Math.max(m+e,1.25-.6*(1-s)),4.3+.4*(1-s)),o=Math.min(h+t,1.48),c=Math.min(g+1.3*t,1.4),l=[Math.cos(i),0,Math.sin(i)],u=J(Zt,J(X(l,.008+.007*s),[0,.006+.022*(1-s),0])),d=J(u,X(J(X(l,Math.cos(o)),[0,Math.sin(o),0]),_*Math.exp(-n))),f=Q(J(X(l,Math.cos(c)),[0,Math.sin(c),0]));return{az:i,from:J(u,J(X(l,-.008),[0,-.012,0])),rise:Q(J(ht,X(l,.2+.8*s))),b:{base:d,dir:f,face:mt(gt(J(J(ht,X(l,-.15)),[0,0,.3]),f),f,.5*(y[0]-.5)+r),length:v*Math.exp(-n),ratio:.33+.12*s+.1*y[1],arch:.35+.4*s+.15*y[2],droop:.1+.15*y[3],side:.2*(y[4]-.5),twist:.5*(y[5]-.5),cup:.12+.12*y[6],fold:.05+.05*y[7],quilt:8e-4,wave:.07+.07*y[8],waves:2+2*y[9],phase:6.28*y[10],asym:.1*(y[11]-.5),furl:0,veins:9,id:a,small:!0}}},f,{margin:.012,bounds:Qt,crowd:u,gap:.009,stalkGap:.007,samples:d,wide:p}),S=t.vertexCount;Ct(t,x,24,12,o.LEAF_SMALL),Gt(t,r,S,a),Ut(x,a,i);let C=t.vertexCount,w=Math.max(8,Math.round(Z(Y(b.b.base,b.from))/.008)),T=kt(t,x,b.from,b.rise,{rBase:.0026+9e-4*s,rTop:.0021+6e-4*s,sides:8,segs:w,midrib:.5,midribSegs:8,sheath:.3,sheathLen:.02,groove:.2},11+a);Gt(t,r,C,1e3+a),Wt(T.slice(0,w+1),.003,1e3+a,i),Vt(u,x,T,d),c.push({tip:x.at(.85,0),pts:zt(x,6,2)})}a.push({a:Zt,b:J(Zt,[0,.07,0]),r:.08,solid:.02});let m=J(Zt,[0,.035,0]);for(let e=0;e<4;e++){let t=c.filter(t=>Math.floor((Math.atan2(t.tip[2]-m[2],t.tip[0]-m[0])+Math.PI)/(Math.PI/2))%4===e);if(!t.length)continue;let n=pt(m,X(t.reduce((e,t)=>J(e,t.tip),[0,0,0]),1/t.length),.85),r=t.flatMap(e=>e.pts.map(e=>Ft(e,m,n))).sort((e,t)=>e-t);a.push({a:m,b:n,r:Math.min(Math.max(r[Math.floor(.9*(r.length-1))],.03),.12),solid:0})}return Ht(t,r,i,.12,.9),{mesh:t.finish(),obstacles:a}}function en(){let e=Xt(t(1511863939),t(4127)),n=$t(t(5227));return{meshes:[e.mesh,n.mesh],obstacles:[...e.obstacles,...n.obstacles]}}var tn=(e,t)=>`
fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let u = clamp(attrs.x, 0.0, 1.0);
  let v = clamp(attrs.y, -1.0, 1.0);
  let av = abs(v);
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, ${t.salt}, 11));
  let px = ${t.length.toFixed(3)} / max(foot, 1e-6);
  // The outline's half-width here (as the mesh's, outlineOf and outline), so the veins keep their
  // true widths.
  let fid = round(attrs.z);
  let h1 = fract(fid * 0.618034 + 0.17);
  let h2 = fract(fid * 0.754877 + 0.31);
  let h3 = fract(fid * 0.56984 + 0.53);
  let wd = 0.3 + 0.12 * h1;
  var hw = sqrt(max(1.0 - pow(max(wd - u, 0.0) / wd, 2.0 + h2), 0.0));
  if (u > wd) {
    let t = (u - wd) / (1.0 - wd);
    hw = pow(max(1.0 - pow(t, 1.45 + 0.5 * h3), 0.0), 1.05) * (1.0 - (${t.small?`0.06 + 0.14 * h1`:`0.18 + 0.2 * h1`}) * smoothstep(0.62, 1.0, t));
  }
  // Across from the midrib in the blade's own length (its length 1).
  let x = av * hw * ${(t.ratio/2).toFixed(3)};
  // The midrib: drawn no narrower than about a pixel, fainter by as much, so it stays on the midrib.
  let midW = 0.005 + 0.009 * (1.0 - u);
  let midPx = max(midW, 0.9 / px);
  let midrib = (midW / midPx) * (1.0 - smoothstep(0.45 * midPx, midPx, x));
  // Lateral veins, out from the midrib and forwards along the margin (where the mesh is quilted).
  let left = select(0.0, 1.0, v < 0.0);
  let ph = ${t.veins.toFixed(1)} * (u - ${bt} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
  let dv = abs(fract(ph + 0.5) - 0.5);
  var lateral = (1.0 - smoothstep(0.025, 0.08, dv)) * smoothstep(0.03, 0.14, av) * (1.0 - smoothstep(0.8, 0.97, av)) * smoothstep(0.02, 0.1, u);
  lateral = mix(0.08, lateral, smoothstep(1.0, 2.5, 0.1 * px / ${t.veins.toFixed(1)}));
  // The fine net of veinlets between them (its cells warped, so the areoles are irregular).
  let q = p * ${t.net.toFixed(1)};
  let cell = scape_cells3(q + 0.6 * vec3f(scape_noise3(q * 0.35), scape_noise3(q * 0.35 + vec3f(7.1)), scape_noise3(q * 0.35 + vec3f(13.7))));
  var net = 1.0 - smoothstep(0.015, 0.07, cell.y - cell.x);
  net = mix(0.15, net, smoothstep(8.0, 20.0, ${(1/t.net).toFixed(4)} / max(foot, 1e-6)));
  let vein = max(0.85 * midrib, 0.38 * lateral);

  let lit = scape_linear(vec3f(${t.tint}));
  let deep = scape_linear(vec3f(0.16, 0.36, 0.05));
  let pale = scape_linear(vec3f(0.6, 0.8, 0.28));
  var c = lit * (0.85 + 0.3 * rnd.x);
  c = mix(c, c * vec3f(1.1, 1.0, 0.75), rnd.y * 0.5);
  // Darker towards the base and the margins; a living leaf's faint mottling.
  c = mix(c, deep, 0.3 * (1.0 - smoothstep(0.0, 0.3, u)));
  c = mix(c, deep, 0.2 * smoothstep(0.7, 1.0, av));
  c *= 0.9 + 0.2 * scape_fbm3(p * 35.0 + rnd * 10.0, 2);
  c = mix(c, pale, 0.7 * vein);
  c = mix(c, pale, 0.15 * net * (1.0 - vein));
  let young = id >= ${t.young};
  if (young) { c = mix(c, scape_linear(vec3f(0.58, 0.76, 0.2)), 0.55); }
  var rough = ${t.rough.toFixed(2)} + 0.06 * scape_noise3(p * 20.0);
  var spec = 0.04;
  if (!front) {
    // Beneath: paler, matte, its veins standing out.
    c = mix(c, scape_linear(vec3f(0.52, 0.7, 0.32)), 0.45);
    rough = 0.6;
    spec = 0.025;
  }
  // Light through the blade: bright yellow-green, less through the veins and the thicker base.
  var trans = scape_linear(vec3f(0.45, 0.65, 0.12)) * (1.0 - 0.55 * vein) * (0.55 + 0.45 * smoothstep(0.0, 0.25, u)) * (1.0 - 0.15 * net);
  if (young) { trans *= 1.25; }
  // Fine relief: the blade's cells, faded below a few pixels.
  let k = ${t.bump.toFixed(1)};
  let e = 0.35 / k;
  let b0 = scape_noise3(p * k);
  let g = vec3f(scape_noise3((p + vec3f(e, 0.0, 0.0)) * k) - b0, scape_noise3((p + vec3f(0.0, e, 0.0)) * k) - b0,
    scape_noise3((p + vec3f(0.0, 0.0, e)) * k) - b0) / (e * k);
  let relief = 0.04 * smoothstep(2.0, 6.0, 1.0 / (k * max(foot, 1e-6)));
  let nn = normalize(n - (g - n * dot(n, g)) * relief);
  let ao = attrs.w * (1.0 - select(0.0, 0.2 * midrib, front));
  return ScapeMat(c, nn, rough, spec, trans, ao);
}
`,nn=[tn(`leafBig`,{salt:3,length:.34,ratio:.46,veins:13,young:9,tint:`0.35, 0.62, 0.12`,net:280,bump:110,rough:.36}),tn(`leafSmall`,{salt:5,length:.19,ratio:.44,veins:9,young:99,tint:`0.38, 0.66, 0.13`,net:420,bump:180,rough:.4,small:!0}),`
fn scape_mat_stem(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, 7, 3));
  var c = scape_linear(vec3f(0.5, 0.7, 0.27)) * (0.9 + 0.2 * rnd.y);
  // Its sheathing foot: browner, darker (a short way up the small plant's short stems, ids 11 on).
  c = mix(scape_linear(vec3f(0.36, 0.38, 0.17)), c, smoothstep(0.0, select(0.05, 0.015, id >= 11), s));
  // Fine ridges along it (faded below a few pixels), and faint flecks.
  var stria = 0.5 + 0.5 * sin(attrs.y * 9.0 + 3.0 * scape_noise3(p * 40.0));
  stria = mix(0.5, stria, smoothstep(1.0, 3.0, 0.004 / max(foot, 1e-6)));
  c *= (0.93 + 0.12 * stria) * (0.94 + 0.12 * scape_noise3(vec3f(s * 60.0, f32(id) * 3.1, 0.5)));
  let trans = scape_linear(vec3f(0.4, 0.6, 0.15)) * 0.4;
  return ScapeMat(c, n, 0.4, 0.035, trans, attrs.w);
}

fn scape_mat_root(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = attrs.z;
  var c = scape_linear(vec3f(0.55, 0.42, 0.26)) * (0.85 + 0.25 * scape_noise3(p * 90.0));
  if (id < 1.5) {
    // A crown: olive brown, ringed with the scars of old leaves.
    c = scape_linear(vec3f(0.38, 0.34, 0.18)) * (0.85 + 0.25 * scape_fbm3(p * 70.0, 3));
    var ring = smoothstep(0.8, 0.95, abs(fract(s / 0.016 + 0.3 * scape_noise3(p * 30.0)) * 2.0 - 1.0));
    ring = mix(0.2, ring, smoothstep(1.0, 3.0, 0.003 / max(foot, 1e-6)));
    c = mix(c, scape_linear(vec3f(0.2, 0.16, 0.08)), 0.6 * ring);
  }
  return ScapeMat(c, n, 0.7, 0.02, vec3f(0.0), attrs.w);
}
`].join(``),rn=[[`wood`,ee],[`rocks`,Pe],[`plants`,ut]];function an(){return rn.map(([e,t])=>({name:e,...t.build()}))}function on(){let e=an();return{meshes:e.flatMap(e=>e.meshes),obstacles:e.flatMap(e=>e.obstacles)}}var sn=rn.map(([,e])=>e.WGSL);export{j as i,on as n,E as r,sn as t};
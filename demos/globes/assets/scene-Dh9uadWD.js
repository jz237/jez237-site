import{a as e,c as t,i as n,l as r,n as i,o as a,r as o,s,t as c}from"./index-DEQItJdM.js";import{i as l,n as u,t as d}from"./plantMotion-Bg7zlTEk.js";var f=1024,p=8192,m=4096,h=1e-5,g=[.18,.3,.06],_=2e-4,v=1e-6,y=4,b=1,x=2,S=2e-6,C=new Float32Array(1),w=new Uint32Array(C.buffer);function T(e){let t=Math.fround(e);if(t<=e)return t;if(C[0]=t,t>0)w[0]--;else if(t===0)return-1401298464324817e-60;else w[0]++;return C[0]}function E(e){return-T(-e)}function D(e){let t=0;for(;e>y;)e=Math.ceil(e/2),t++;return t}function O(e,t,n,r,i,a){let o=new Uint32Array(n);for(let e=0;e<n;e++)o[e]=e;let s=Math.max(1,2*n),c=new Float64Array(s*3),l=new Float64Array(s*3),u=new Int32Array(s).fill(-1),d=new Int32Array(s).fill(-1),f=new Int32Array(s),p=new Int32Array(s),m=new Int32Array(s),h=1,g=0,_=0,v=0,b=Math.max(i,a),x=new Int32Array(3*b),S=new Float64Array(3*b*6),C=new Float64Array(b),w=new Int32Array(b),T=[[0,0,n,0]];for(;T.length;){let[n,s,b,E]=T.pop();m[n]=E,E>g&&(g=E);let O=1/0,k=1/0,A=1/0,j=-1/0,M=-1/0,N=-1/0,P=1/0,ee=1/0,F=1/0,te=-1/0,I=-1/0,L=-1/0;for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3;e[i]<O&&(O=e[i]),e[i+1]<k&&(k=e[i+1]),e[i+2]<A&&(A=e[i+2]),e[i+3]>j&&(j=e[i+3]),e[i+4]>M&&(M=e[i+4]),e[i+5]>N&&(N=e[i+5]);let s=t[a],c=t[a+1],l=t[a+2];s<P&&(P=s),s>te&&(te=s),c<ee&&(ee=c),c>I&&(I=c),l<F&&(F=l),l>L&&(L=l)}c[n*3]=O,c[n*3+1]=k,c[n*3+2]=A,l[n*3]=j,l[n*3+1]=M,l[n*3+2]=N;let R=b-s;if(R<=y){f[n]=s,p[n]=R,_++;continue}let z=R>4096?i:a,B=[te-P,I-ee,L-F],V=[P,ee,F],H=B.map(e=>e>1e-12?z/e:0);x.fill(0,0,3*z);for(let e=0;e<3*z;e++){let t=e*6;S[t]=S[t+1]=S[t+2]=1/0,S[t+3]=S[t+4]=S[t+5]=-1/0}let ne=H[0],re=H[1],ie=H[2];for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3,s=e[i],c=e[i+1],l=e[i+2],u=e[i+3],d=e[i+4],f=e[i+5];for(let e=0;e<3;e++){let n=e===0?ne:e===1?re:ie;if(n===0)continue;let r=(t[a+e]-V[e])*n|0;r>=z&&(r=z-1),r+=e*z,x[r]++;let i=r*6;s<S[i]&&(S[i]=s),c<S[i+1]&&(S[i+1]=c),l<S[i+2]&&(S[i+2]=l),u>S[i+3]&&(S[i+3]=u),d>S[i+4]&&(S[i+4]=d),f>S[i+5]&&(S[i+5]=f)}}let ae=-1,U=-1,W=1/0,oe=0;for(let e=0;e<3;e++){if(H[e]===0)continue;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=0;for(let c=z-1;c>0;c--){let l=(e*z+c)*6;s+=x[e*z+c],S[l]<t&&(t=S[l]),S[l+1]<n&&(n=S[l+1]),S[l+2]<r&&(r=S[l+2]),S[l+3]>i&&(i=S[l+3]),S[l+4]>a&&(a=S[l+4]),S[l+5]>o&&(o=S[l+5]),w[c]=s;let u=i-t,d=a-n,f=o-r;C[c]=s?u*d+d*f+f*u:0}t=n=r=1/0,i=a=o=-1/0,s=0;for(let c=0;c<z-1;c++){let l=(e*z+c)*6;if(s+=x[e*z+c],S[l]<t&&(t=S[l]),S[l+1]<n&&(n=S[l+1]),S[l+2]<r&&(r=S[l+2]),S[l+3]>i&&(i=S[l+3]),S[l+4]>a&&(a=S[l+4]),S[l+5]>o&&(o=S[l+5]),s===0||w[c+1]===0)continue;let u=i-t,d=a-n,f=o-r,p=s*(u*d+d*f+f*u)+w[c+1]*C[c+1];p<W&&(W=p,ae=e,U=c,oe=s)}}let se;if(ae>=0&&E+1+D(Math.max(oe,R-oe))<=r){let e=ae,n=H[e],r=V[e],i=s,a=b-1;for(;i<=a;){let s=o[i],c=(t[s*3+e]-r)*n|0;c>=z&&(c=z-1),c<=U?i++:(o[i]=o[a],o[a]=s,a--)}se=i}else{ae>=0&&v++;let e=B[0]>=B[1]&&B[0]>=B[2]?0:B[1]>=B[2]?1:2,n=Array.from(o.subarray(s,b));n.sort((n,r)=>t[n*3+e]-t[r*3+e]),o.set(n,s),se=s+(R>>1)}let ce=h++,le=h++;u[n]=ce,d[n]=le,T.push([le,se,b,E+1],[ce,s,se,E+1])}return{idx:o,lo:c,hi:l,left:u,right:d,start:f,count:p,depthOf:m,nodes:h,depth:g,leaves:_,forced:v}}function k(e,t={}){let n=performance.now(),r=t.layout===`stackless`?b:x,i=t.maxDepth??32;if(!Number.isInteger(i)||i<0)throw Error(`packScape: maxDepth ${i} (a whole number, 0 or more)`);let a=Math.min(i,32),o=t.bins??32,s=Math.min(o,16),c=0,l=0;for(let t of e)c+=t.positions.length/3,l+=t.indices.length/3;if(c>=1<<21)throw Error(`packScape: ${c} vertices (at most ${(1<<21)-1})`);if(D(l)>a)throw Error(`packScape: ${l} triangles need a tree ${D(l)} deep at least (leaves of ${y}); maxDepth is ${a}`);let u=new Float32Array(c*3),d=new Float32Array(c*3),m=new Float32Array(c*4),h=new Uint32Array(l*3),g=new Uint8Array(l),_=0,v=0;for(let t of e){let e=t.positions.length/3,n=t.indices.length/3,r=t.name??`(mesh)`;if(!Number.isInteger(e)||!Number.isInteger(n))throw Error(`packScape: ${r}: ragged positions or indices`);if(t.normals.length!==e*3||t.attrs.length!==e*4||t.materials.length!==n)throw Error(`packScape: ${r}: normals/attrs/materials of the wrong length`);u.set(t.positions,_*3),d.set(t.normals,_*3),m.set(t.attrs,_*4);for(let i=0;i<n*3;i++){let n=t.indices[i];if(!(n>=0&&n<e))throw Error(`packScape: ${r}: index ${n} out of range`);h[v*3+i]=n+_}for(let e=0;e<n;e++){let n=t.materials[e];if(!(n>=0&&n<=7))throw Error(`packScape: ${r}: material ${n} (0..7)`);g[v+e]=n}_+=e,v+=n}for(let e=0;e<u.length;e++)if(!Number.isFinite(u[e]))throw Error(`packScape: a position is not finite`);let C=new Float64Array(l*6),w=new Float64Array(l*3);for(let e=0;e<l;e++){let t=h[e*3]*3,n=h[e*3+1]*3,r=h[e*3+2]*3;for(let i=0;i<3;i++){let a=Math.min(u[t+i],u[n+i],u[r+i]),o=Math.max(u[t+i],u[n+i],u[r+i]);C[e*6+i]=a,C[e*6+3+i]=o,w[e*3+i]=.5*(a+o)}}let k=O(C,w,l,a,o,s),A=performance.now()-n,j=[],M=[0];for(;M.length;){let e=M.pop();(r===b||k.left[e]>=0)&&j.push(e),k.left[e]>=0&&M.push(k.right[e],k.left[e])}let N=new Int32Array(k.nodes).fill(-1);j.forEach((e,t)=>N[e]=t);let P=j.length,ee=4+P*(r===x?4:2),F=ee+l*3,te=F+c*2,I=f,L=Math.max(1,Math.ceil(te/I));if(L>8192)throw Error(`packScape: ${L} rows (at most ${p})`);let R=new Float32Array(I*L*4),z=e=>k.left[e]>=0?N[e]:-(k.start[e]*4+k.count[e]-1)-1,B=(e,t)=>{for(let n=0;n<3;n++)R[e*4+n]=T(k.lo[t*3+n]-S),R[(e+1)*4+n]=E(k.hi[t*3+n]+S)},V=[0,0,0],H=[0,0,0];if(l>0){B(1,0);for(let e=0;e<3;e++)V[e]=R[4+e],H[e]=R[8+e]}else for(let e=0;e<3;e++)V[e]=R[4+e]=1e6,H[e]=R[8+e]=1e6;if(R.set([P,ee,l,r===x&&l>0?z(0):0],0),R[7]=F,R[11]=c,R.set([r,k.depth,k.leaves,0],12),r===x)for(let e of j){let t=4+N[e]*4,n=k.left[e],r=k.right[e];B(t,n),B(t+2,r),R[t*4+3]=z(n),R[(t+1)*4+3]=z(r)}else{let e=new Int32Array(k.nodes).fill(P);for(let t of j)k.left[t]>=0&&(e[k.left[t]]=N[k.right[t]],e[k.right[t]]=e[t]);for(let t of j){let n=4+N[t]*2;B(n,t),R[n*4+3]=e[t],R[(n+1)*4+3]=k.left[t]>=0?0:k.start[t]*4+k.count[t]-1+1}}for(let e=0;e<l;e++){let t=k.idx[e],n=(ee+e*3)*4;for(let e=0;e<3;e++){let r=h[t*3+e];R[n+e*4]=u[r*3],R[n+e*4+1]=u[r*3+1],R[n+e*4+2]=u[r*3+2],R[n+e*4+3]=e===0?r*8+g[t]:r}}for(let e=0;e<c;e++){let t=(F+e*2)*4;R[t]=d[e*3],R[t+1]=d[e*3+1],R[t+2]=d[e*3+2],R[t+3]=m[e*4],R[t+4]=m[e*4+1],R[t+5]=m[e*4+2],R[t+6]=m[e*4+3]}return{data:R,width:I,height:L,triangles:l,vertices:c,nodes:k.nodes,internal:k.nodes-k.leaves,leaves:k.leaves,depth:k.depth,lo:V,hi:H,order:k.idx,layout:r===x?`stack`:`stackless`,forcedSplits:k.forced,buildMs:A,packMs:performance.now()-n-A}}var A=Math.fround;A(v),A(h);var j=[[`BARK`,`bark`,`vec3f(0.16, 0.09, 0.045)`,`0.75`,`0.02`,`vec3f(0.0)`],[`WOOD_END`,`woodEnd`,`vec3f(0.30, 0.20, 0.11)`,`0.8`,`0.02`,`vec3f(0.0)`],[`ROCK`,`rock`,`vec3f(0.05, 0.05, 0.055)`,`0.5`,`0.04`,`vec3f(0.0)`],[`LEAF_BIG`,`leafBig`,`vec3f(0.02, 0.06, 0.015)`,`0.35`,`0.04`,`vec3f(0.05, 0.12, 0.02)`],[`LEAF_SMALL`,`leafSmall`,`vec3f(0.03, 0.09, 0.02)`,`0.4`,`0.04`,`vec3f(0.06, 0.14, 0.03)`],[`STEM`,`stem`,`vec3f(0.04, 0.09, 0.025)`,`0.5`,`0.03`,`vec3f(0.0)`],[`ROOT`,`root`,`vec3f(0.06, 0.045, 0.03)`,`0.7`,`0.02`,`vec3f(0.0)`]],M=e=>{let t=String(e);return/[.eE]/.test(t)?t:`${t}.0`};function N(e){let t=``,n=0;for(let r=0;r<e.length;r++){let i=e[r],a=e[r+1];if(i===`/`&&a===`*`)n++,r++,t+=`  `;else if(n>0&&i===`*`&&a===`/`)n--,r++,t+=`  `;else if(n>0)t+=i===`
`?`
`:` `;else if(i===`/`&&a===`/`){for(;r<e.length&&e[r]!==`
`;)t+=` `,r++;r<e.length&&(t+=`
`)}else t+=i}return t}function P(t=[]){let n=t.filter(e=>typeof e==`string`&&e.length),r=N(n.join(`
`)),i=[];for(let[,e,t,n,a,o]of j){let s=r.match(RegExp(`\\bfn\\s+scape_mat_${e}\\s*\\(`,`g`));if(s&&s.length>1)throw Error(`scapeMeshWGSL: scape_mat_${e} is defined ${s.length} times`);s||i.push(`fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  return ScapeMat(${t}, n, ${n}, ${a}, ${o}, clamp(attrs.w, 0.0, 1.0));
}`)}let a=Object.entries(o).map(([e,t])=>`const SCAPE_MAT_${e}: u32 = ${t}u;`).join(`
`),s=j.map(([e,t])=>`    case ${o[e]}u: { m = scape_mat_${t}(s.attrs, p, s.n, foot, front); }`).join(`
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
const SCAPE_MESH_STEPS: u32 = ${m}u;
const SCAPE_MESH_TMIN: f32 = ${M(h)};
const SCAPE_MESH_EDGE: f32 = ${M(v)};
const SCAPE_MESH_FAR: f32 = 3.0e38;
const SCAPE_LEAF_PASS: vec3f = vec3f(${g.map(M).join(`, `)});
const SCAPE_SHADOW_CUTOFF: f32 = ${M(_)};

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
`)}var ee=r({WGSL:()=>ze,build:()=>De}),F=Math.PI*2,te=e=>e<0?0:e>1?1:e,I=(e,t,n)=>{let r=te((n-e)/(t-e));return r*r*(3-2*r)},L=e=>e-F*Math.round(e/F);function R(e,t,n){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,739982445);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}var z={e:0,nu:0,nv:0,pair:0,cell:0};function B(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=1e9,s=1e9,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0;for(let g=-1;g<=1;g++)for(let _=-1;_<=1;_++){let v=i+_,y=a+g,b=(v%n+n)%n,x=v+.06+.88*R(b,y,r),S=y+.06+.88*R(b,y,r+1013),C=x-e,w=S-t,T=C*C+w*w,E=b*7919+(y+4096)*131;T<o?(s=o,u=c,d=l,p=f,o=T,c=x,l=S,f=E,m=b,h=y):T<s&&(s=T,u=x,d=S,p=E)}let g=u-c,_=d-l,v=Math.hypot(g,_)||1;g/=v,_/=v,z.e=((c+u)*.5-e)*g+((l+d)*.5-t)*_,z.nu=g,z.nv=_,z.pair=R(Math.min(f,p),Math.max(f,p),r+77),z.cell=R(m,h,r+5)}var V={depth:0,shoulder:0,e:0,cell:0},H=new Float64Array(25),ne=new Float64Array(25),re=new Int32Array(25);function ie(e,t,n,r,i,a,o,s,c=1){let l=Math.floor(e),u=Math.floor(t),d=1e9,f=12;for(let i=-2,a=0;i<=2;i++)for(let o=-2;o<=2;o++,a++){let s=l+o,c=u+i,p=(s%n+n)%n,m=R(p,c,r),h=m*65536%1;if(H[a]=s+.06+.88*m,ne[a]=c+.06+.88*h,re[a]=p*7919+(c+4096)*131,Math.abs(o)<2&&Math.abs(i)<2){let n=H[a]-e,r=ne[a]-t,i=n*n+r*r;i<d&&([d,f]=[i,a])}}let p=H[f],m=ne[f],h=re[f],g=0,_=0,v=1e9;for(let n=0;n<25;n++){if(n===f)continue;let l=H[n]-p,u=ne[n]-m,d=Math.sqrt(l*l+u*u);l/=d,u/=d;let y=((p+H[n])*.5-e)*l+((m+ne[n])*.5-t)*u,b=l/i,x=u/a,S=Math.sqrt(b*b+x*x),C=y/S;if(C<v&&(v=C),C>o*3.6*c)continue;let w=R(Math.min(h,re[n]),Math.max(h,re[n]),r+77),T=I(.35,.8,Math.abs(x)/S),E=(.5+.7*w)*(1-(1-s)*T),D=o*(.7+.6*(w*977%1))*(1-.15*T)*(1+(c-1)*T),O=C/D;O<1&&(g=Math.max(g,E*(1-I(0,1,O))**1.6)),_=Math.max(_,E*(1-I(D,D*3.2,C)))}return V.depth=g,V.shoulder=_,V.e=v,V.cell=R(h,5,r+5),V}function ae(e,n,r,i,a){let o=e.length,c=(e,t)=>[2*t[0]-e[0],2*t[1]-e[1],2*t[2]-e[2]],l=[c(e[1],e[0]),...e,c(e[o-2],e[o-1])],u=[],d=(e,t)=>Math.sqrt(Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]))||1e-6;for(let e=0;e<o-1;e++){let[t,n,r,i]=[l[e],l[e+1],l[e+2],l[e+3]],a=d(t,n),o=a+d(n,r),s=o+d(r,i);for(let e=0;e<64;e++){let c=a+(o-a)*e/64,l=[0,0,0];for(let e=0;e<3;e++){let u=(a-c)/a*t[e]+c/a*n[e],d=(o-c)/(o-a)*n[e]+(c-a)/(o-a)*r[e],f=(s-c)/(s-o)*r[e]+(c-o)/(s-o)*i[e],p=(o-c)/o*u+c/o*d,m=(s-c)/(s-a)*d+(c-a)/(s-a)*f;l[e]=(o-c)/(o-a)*p+(c-a)/(o-a)*m}u.push(l)}}u.push(e[o-1]);let f=[0],p=()=>{for(let e=1;e<u.length;e++){let[t,n]=[u[e-1],u[e]];f[e]=f[e-1]+Math.hypot(n[0]-t[0],n[1]-t[1],n[2]-t[2])}};p();let m=f[u.length-1];for(let e=0;e<u.length;e++){let t=a*I(0,.12,f[e])*I(m,m-.12,f[e]);for(let n=0;n<3;n++)u[e][n]+=t*s(f[e]*2.7,i*.53,n*3.7)}p();let h=f[f.length-1],g=Math.max(3,Math.round(h/n)+1),_=h/(g-1),v=new Float64Array(g*3),y=new Float64Array(g*3),b=new Float64Array(g*3),x=new Float64Array(g*3),S=new Float64Array(g),C=0;for(let e=0;e<g;e++){let t=e*_;for(;C<u.length-2&&f[C+1]<t;)C++;let n=(t-f[C])/(f[C+1]-f[C]||1);for(let t=0;t<3;t++)v[e*3+t]=u[C][t]+(u[C+1][t]-u[C][t])*n}for(let e=0;e<g;e++){let t=Math.max(0,e-1),n=Math.min(g-1,e+1),r=[v[n*3]-v[t*3],v[n*3+1]-v[t*3+1],v[n*3+2]-v[t*3+2]],i=Math.hypot(r[0],r[1],r[2]);for(let t=0;t<3;t++)y[e*3+t]=r[t]/i}{let e=Math.abs(y[1])<.9?[0,1,0]:[1,0,0],t=e[0]*y[0]+e[1]*y[1]+e[2]*y[2],n=[e[0]-t*y[0],e[1]-t*y[1],e[2]-t*y[2]],r=Math.hypot(n[0],n[1],n[2]);for(let e=0;e<3;e++)b[e]=n[e]/r}for(let e=0;e<g-1;e++){let t=[v[e*3+3]-v[e*3],v[e*3+4]-v[e*3+1],v[e*3+5]-v[e*3+2]],n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=[b[e*3],b[e*3+1],b[e*3+2]],i=[y[e*3],y[e*3+1],y[e*3+2]],a=2/n*(t[0]*r[0]+t[1]*r[1]+t[2]*r[2]),o=2/n*(t[0]*i[0]+t[1]*i[1]+t[2]*i[2]),s=[r[0]-a*t[0],r[1]-a*t[1],r[2]-a*t[2]],c=[i[0]-o*t[0],i[1]-o*t[1],i[2]-o*t[2]],l=[y[e*3+3]-c[0],y[e*3+4]-c[1],y[e*3+5]-c[2]],u=2/(l[0]*l[0]+l[1]*l[1]+l[2]*l[2]||1e-12)*(l[0]*s[0]+l[1]*s[1]+l[2]*s[2]);for(let t=0;t<3;t++)b[e*3+3+t]=s[t]-u*l[t]}for(let e=0;e<g;e++){let[t,n,r]=[y[e*3],y[e*3+1],y[e*3+2]],[i,a,o]=[b[e*3],b[e*3+1],b[e*3+2]];x[e*3]=n*o-r*a,x[e*3+1]=r*i-t*o,x[e*3+2]=t*a-n*i}S[0]=t(i)()*F;for(let e=1;e<g;e++)S[e]=S[e-1]+_*r*(1+.7*s(e*_*1.7,i*.37,.3));return{count:g,step:_,L:h,c:v,t:y,r:b,b:x,tau:S}}var U={cx:0,cy:0,cz:0,rx:0,ry:0,rz:0,bx:0,by:0,bz:0,tx:0,ty:0,tz:0,tau:0};function W(e,t){let n=t/e.step,r=Math.floor(n);r<0&&(r=0),r>e.count-2&&(r=e.count-2),n-=r;let i=r+1,a=1-n;return U.cx=e.c[r*3]*a+e.c[i*3]*n,U.cy=e.c[r*3+1]*a+e.c[i*3+1]*n,U.cz=e.c[r*3+2]*a+e.c[i*3+2]*n,U.rx=e.r[r*3]*a+e.r[i*3]*n,U.ry=e.r[r*3+1]*a+e.r[i*3+1]*n,U.rz=e.r[r*3+2]*a+e.r[i*3+2]*n,U.bx=e.b[r*3]*a+e.b[i*3]*n,U.by=e.b[r*3+1]*a+e.b[i*3+1]*n,U.bz=e.b[r*3+2]*a+e.b[i*3+2]*n,U.tx=e.t[r*3]*a+e.t[i*3]*n,U.ty=e.t[r*3+1]*a+e.t[i*3+1]*n,U.tz=e.t[r*3+2]*a+e.t[i*3+2]*n,U.tau=e.tau[r]*a+e.tau[i]*n,U}function oe(e,t){let n=Math.max(3,Math.round(e.L/t)+1),r=e.L/(n-1),i=new Float64Array(n*3),a=new Float64Array(n*3),o=new Float64Array(n*3),s=new Float64Array(n*3),c=new Float64Array(n);for(let t=0;t<n;t++){let n=W(e,t*r),l=Math.hypot(n.tx,n.ty,n.tz),u=n.tx/l,d=n.ty/l,f=n.tz/l,p=n.rx*u+n.ry*d+n.rz*f,m=n.rx-p*u,h=n.ry-p*d,g=n.rz-p*f,_=Math.hypot(m,h,g);m/=_,h/=_,g/=_,i.set([n.cx,n.cy,n.cz],t*3),a.set([u,d,f],t*3),o.set([m,h,g],t*3),s.set([d*g-f*h,f*m-u*g,u*h-d*m],t*3),c[t]=n.tau}return{count:n,step:r,L:e.L,c:i,t:a,r:o,b:s,tau:c}}function se(e,t,n){if(e.caps[1]!==`broken`)return{rings:t.count,sOf:e=>e*t.step};let r=e.sBreak,i=r-.025,a=Math.floor(i/t.step),o=Math.round(r/t.step);return{rings:o+1,sOf:(i,s)=>{if(i<=a)return i*t.step;let c=(i-a)/(o-a),l=a*t.step;return l+c*(r+e.brk.rim(F*s/n)-l)}}}function ce(e,t){let n=Math.min(Math.max(t/e.step,0),e.count-1.001),r=Math.floor(n);return e.c[r*3+1]+(e.c[r*3+4]-e.c[r*3+1])*(n-r)}function le(e,t){let n=1e9,r=0;for(let i=0;i<e.count;i++){let a=(e.c[i*3]-t[0])**2+(e.c[i*3+1]-t[1])**2+(e.c[i*3+2]-t[2])**2;a<n&&([n,r]=[a,i])}return r*e.step}var ue=[{name:`arch`,pts:[[-.522,-.7,-.04],[-.514,-.632,-.048],[-.486,-.528,-.058],[-.425,-.443,-.07],[-.318,-.386,-.05],[-.178,-.344,-.122],[-.038,-.296,-.146],[.083,-.268,-.16],[.198,-.277,-.162],[.307,-.331,-.19],[.398,-.414,-.148],[.462,-.522,-.141],[.494,-.633,-.136],[.501,-.7,-.134]],radius:[[0,.092],[.07,.094],[.18,.08],[.3,.064],[.42,.07],[.56,.084],[.64,.088],[.74,.07],[.85,.08],[.93,.096],[1,.094]],around:176,ds:.0039,wiggle:.022,twist:1.7,flat:.28,lobe:.11,flute:.26,gnarl:.26,plates:17,plateLength:.26,depth:.19,width:.0055,knuckles:[[[-.36,-.396,-.085],.16,.08],[[.33,-.342,-.15],.18,.09],[[-.08,-.316,-.14],.1,.06],[[.05,-.286,-.15],-.08,.05]],knots:[[[-.27,-.333,-.03],.014,.04,.02,`pit`],[[0,-.222,-.12],.011,.032,.014,`boss`],[[.33,-.316,-.08],0,.06,.03,`burl`],[[.45,-.466,-.06],.01,.03,.012,`boss`],[[-.47,-.501,.03],.012,.035,.016,`pit`],[[.12,-.299,-.24],.012,.04,.016,`pit`],[[-.12,-.29,-.1],0,.06,.02,`burl`],[[-.36,-.366,-.05],0,.055,.026,`burl`],[[0,-.325,-.07],0,.05,.022,`burl`],[[.43,-.389,-.12],0,.06,.028,`burl`],[[.27,-.29,-.22],0,.045,.02,`burl`]],seed:11,caps:[`buried`,`buried`]},{name:`broken`,parent:0,pts:[[.115,-.268,-.163],[.143,-.2,-.232],[.183,-.12,-.268],[.232,-.042,-.284],[.27,.015,-.293]],radius:[[0,.058],[.3,.052],[.7,.045],[1,.04]],around:144,ds:.0035,wiggle:.006,twist:2.6,flat:.16,lobe:.08,flute:.2,gnarl:.17,plates:12,plateLength:.2,depth:.19,width:.00495,knuckles:[],knots:[[[.232,-.11,-.262],.009,.026,.01,`boss`]],fillet:.06,reach:[.12,.2],seed:23,caps:[`inside`,`broken`],breakAt:.04},{name:`left`,parent:0,pts:[[-.31,-.385,-.05],[-.305,-.457,-.02],[-.288,-.54,.055],[-.298,-.63,.11],[-.292,-.7,.13]],radius:[[0,.056],[.35,.049],[.75,.042],[1,.04]],around:144,ds:.0037,wiggle:.012,twist:-2.1,flat:.22,lobe:.09,flute:.22,gnarl:.2,plates:12,plateLength:.22,depth:.19,width:.00495,knuckles:[[[-.29,-.56,.07],.1,.05]],knots:[[[-.34,-.501,.1],.01,.03,.012,`pit`]],fillet:.07,reach:[.12,.22],seed:37,caps:[`inside`,`buried`]}];function de(e=1){let n=[];for(let[r,i]of ue.entries()){let a={...i,index:r,pts:i.pts.map(e=>e.slice())};if(a.parent!==void 0){let e=n[a.parent].ref,t=le(e,a.pts[0]),r=W(e,t);a.pts[0]=[r.cx,r.cy,r.cz],a.junction=t,a.shrink=e=>.6+.4*I(0,.0525,e)}let o=a.ref=ae(a.pts,a.ds,a.twist,a.seed,a.wiggle);a.roundScale=e**.75,a.alongScale=e**1.25,a.coarse=Math.max(1,1/a.roundScale),a.coarseAlong=Math.max(1,1/a.alongScale),a.refAround=i.around,a.around=e===1?i.around:Math.max(16,Math.round(i.around*a.roundScale)),a.spine=e===1?o:oe(o,i.ds/a.alongScale),a.caps[1]===`broken`&&(a.brk=Ee(a.seed+5),a.sBreak=o.L-a.breakAt),a.knuckleS=a.knuckles.map(([e,t,n])=>[le(o,e),t,n]),a.knotS=a.knots.map(([e,t,n,r,i],s)=>{let c=le(o,e),l=W(o,c),u=[e[0]-l.cx,e[1]-l.cy,e[2]-l.cz];return{s:c,phi:((Math.atan2(u[0]*l.bx+u[1]*l.by+u[2]*l.bz,u[0]*l.rx+u[1]*l.ry+u[2]*l.rz)-l.tau)%F+F)%F,eye:t,spread:n,height:r,kind:i,brk:i===`boss`?Ee(a.seed*31+s):null}});let s=t(a.seed+101);a.flutes=Array.from({length:5},(e,t)=>({phi:t/5*F+s()*1,drift:(s()-.5)*1.5,width:.22+.3*s(),depth:a.flute*(.5+.8*s()),freq:1.5+2*s(),seed:a.seed+t*7.7})),n.push(a)}return n}var fe={L:null,s:NaN,r:0};function pe(e,t,n){if(fe.L===e&&fe.s===n)return fe.r;let r=n/t.L,i=e.radius,o=i[i.length-1][1];for(let e=0;e<i.length-1;e++)if(r<=i[e+1][0]){o=i[e][1]+(i[e+1][1]-i[e][1])*I(i[e][0],i[e+1][0],r);break}o*=1+.2*a(n*4+e.seed,.31,.77,2);for(let[t,r,i]of e.knuckleS)o*=1+r*Math.exp(-(((n-t)/i)**2));return Object.assign(fe,{L:e,s:n,r:o}),o}var G={L:null,s:NaN,e:0,al:0,a3:0,b3:0,a4:0,b4:0,a5:0,b5:0,foot:1,fc:[0],fd:[0]};function me(e,t,n){if(G.s!==t||G.L!==e){let n=e.seed*1.37;G.s=t,G.L=e,G.e=e.flat*(.55+.45*s(t*2.3,n,.5)),G.al=e.seed+1.4*s(t*1.2,n+3.1,1.7),G.a3=e.lobe*(.6+.6*s(t*3.1,n,4.4)),G.b3=2.2*s(t*1.6,n,5.5),G.a4=e.lobe*.7*(.5+.7*s(t*3.7,n,6.6)),G.b4=2.2*s(t*1.9,n,7.7),G.a5=e.lobe*.5*(.4+.8*s(t*4.3,n,8.8)),G.b5=2.2*s(t*2.2,n,9.9),G.foot=1+.9*Math.exp(-(((ce(e.ref,t)-c)/.07)**2)),G.fc=e.flutes.map(e=>e.phi+e.drift*t+.5*s(t*2.6,e.seed,.2)),G.fd=e.flutes.map(e=>e.depth*I(-.25,.35,s(t*e.freq,e.seed,3.3)))}let r=1+G.e*Math.cos(2*(n-G.al));r+=(G.a3*Math.cos(3*n+G.b3)+G.a4*Math.cos(4*n+G.b4)+G.a5*Math.cos(5*n+G.b5))*G.foot;for(let t=0;t<e.flutes.length;t++){let i=L(n-G.fc[t]);r-=G.fd[t]*Math.exp(-((i/e.flutes[t].width)**2))}let i=Math.max(.16-Math.abs(r-.6),0)/.16;return Math.max(r,.6)+i*i*.04}var he={d:0,z:0};function ge(e,t,n,r,i,a,o){let c=e.plates,l=e.plateLength,u=Math.sqrt(e.coarse),d=Math.sqrt(e.coarseAlong),f=te(2-e.coarse),p=e.width*u,m=d/u,h=Math.min(Math.max(o,.6*a),1.3*a),g=F*h/c,_=e.seed*.71,v=n/F*c+.55*s(r*1.1+_,i*1.1,t*1.5)+.2*s(r*2.7,i*2.7+_,t*5.3),y=t/l+.4*s(r*1.3+9.1,i*1.3,t*1.9+_),b=0,x=0;for(let r of e.knotS){let e=(t-r.s)/(r.kind===`burl`?1.4:2.6);if(Math.abs(e)>5*r.spread)continue;let i=L(n-r.phi)*a,o=i*i+e*e,c=Math.sqrt(o);if(c>5*r.spread)continue;let l=r.height*Math.exp(-((c/r.spread)**2))*(1+.2*s(i*55,e*55,r.s*9));if(r.kind===`burl`){b+=l,v+=.25*i*Math.exp(-((c/r.spread)**2))/g;continue}let d=(r.eye*1.6)**2,f=Math.exp(-((c/(2.6*r.spread))**2)),p=o>d?i*(1-d/o):0;v+=(p-i)*f/g;let m=Math.atan2(e,i);c*=1+.3*s(Math.cos(m)*2,Math.sin(m)*2,r.s*5),x=Math.max(x,1-I(r.eye*.9,r.eye*1.7,c));let h=.45*r.height*Math.exp(-(((c-r.eye)/(.35*r.eye*u))**2)),_;_=r.kind===`pit`?-.45*r.height*(1-I(0,r.eye*.8,c)):I(0,1,(r.eye-c)/(.3*r.eye))*(.8*r.height+r.brk.height(Math.min(c/(.7*r.eye),1),m)*(r.eye/.05)),b+=l+h+_}let S=I(.36,.66,s(r*.8+_,i*.8+2.2,t*2.2+4.1)),C=e.depth*h,w=.6+.4*s(r*2.1,i*2.1+_,t*7.3);ie(v,y,c,e.seed,g,l,p,.2,m);let T=w*V.depth,E=.25*w*V.shoulder,D=(.26*V.cell+.1*s(v*1.7,y*2.3,_))*I(0,p*3,V.e),O=I(-.35,.2,s(r*1.6+5,i*1.6,t*3.1+_));if(O>0){let t=2.27/u,n=1.9/d;ie(v*t+.5,y*n+.3,Math.round(c*t),e.seed+3,g/t,l/n,p*.8,.25,m),T=Math.max(T,.55*O*V.depth)}let k=v*1.7+.35*s(r*3.1,i*3.1+_,t*6.1),A=.2*(.5+.5*Math.cos(F*k))**(3/e.coarse)*w,j=f>0?.1*s(r*16+_,i*16,t*22)*f:0,M=(1-.5*S)*(1-x),N=(T+(E+D+A+j)*(1-.6*S))*M,P=te(N/(.85*e.coarse**.075));return he.z=e.coarse>1?P**e.coarse**.13:P,he.d=N*C-b,he}var _e={cx:0,cy:0,cz:0,dx:0,dy:0,dz:0,r0:0,rb:0};function ve(e,t,n,r){let i=W(t,n),o=r+i.tau,c=Math.cos(o),l=Math.sin(o),u=c*i.rx+l*i.bx,d=c*i.ry+l*i.by,f=c*i.rz+l*i.bz,p=Math.sqrt(u*u+d*d+f*f);u/=p,d/=p,f/=p;let m=pe(e,t,n);e.shrink&&(m*=e.shrink(n));let h=m*me(e,n,r),g=i.cx+u*h,_=i.cy+d*h,v=i.cz+f*h;return h*=1+e.gnarl*(.6*a(g*3.4+1.7,_*3.4,v*3.4,2)+.45*s(Math.cos(r)*1.3+e.seed,Math.sin(r)*1.3,n*6.5)),_e.cx=i.cx,_e.cy=i.cy,_e.cz=i.cz,_e.dx=u,_e.dy=d,_e.dz=f,_e.r0=m,_e.rb=h,_e}function ye(e,t,n){let r=e.around,i=e.rings,a=i*r,o={L:e,sp:t,N:r,rings:i,px:new Float64Array(a),py:new Float64Array(a),pz:new Float64Array(a),dx:new Float64Array(a),dy:new Float64Array(a),dz:new Float64Array(a),cx:new Float64Array(a),cy:new Float64Array(a),cz:new Float64Array(a),base:new Float64Array(a),rad:new Float64Array(a),s:new Float64Array(a),z:new Float64Array(a),ao:new Float64Array(a).fill(1),inside:new Uint8Array(a),nx:new Float64Array(a),ny:new Float64Array(a),nz:new Float64Array(a),b0:new Float64Array(a)},s=new Float64Array(r),c=new Float64Array(r);for(let e=0;e<r;e++)s[e]=Math.cos(F*e/r),c[e]=Math.sin(F*e/r);for(let a=0;a<i;a++)for(let i=0;i<r;i++){let l=a*r+i,u=n(a,i),d=F*i/r,f=ve(e,t,u,d),p=ge(e,u,d,s[i],c[i],f.r0,f.rb),m=f.rb-p.d;o.px[l]=f.cx+f.dx*m,o.py[l]=f.cy+f.dy*m,o.pz[l]=f.cz+f.dz*m,o.dx[l]=f.dx,o.dy[l]=f.dy,o.dz[l]=f.dz,o.cx[l]=f.cx,o.cy[l]=f.cy,o.cz[l]=f.cz,o.base[l]=f.rb,o.rad[l]=m,o.s[l]=u,o.z[l]=p.z,o.b0[l]=u===a*t.step?f.rb:ve(e,t,a*t.step,d).rb}let l=2.5;for(let e=0;e<2;e++)for(let e=0;e<i;e++)for(let n=0;n<r;n++){let a=e*r+n,s=l*F*o.base[a]/r,c=l*t.step,u=o.base[a]-o.rad[a],d=u;for(let[t,l]of[[e*r+(n+1)%r,s],[e*r+(n+r-1)%r,s],[e>0?a-r:a,c],[e<i-1?a+r:a,c]])d=Math.min(d,o.base[t]-o.rad[t]+l);d<u&&u>0&&(o.z[a]*=Math.max(d,0)/u),o.rad[a]=o.base[a]-d}let u=new Float64Array(a),d=new Float64Array(a),f=new Float64Array(a);for(let e=0;e<a;e++)u[e]=o.cx[e]+o.dx[e]*o.base[e],d[e]=o.cy[e]+o.dy[e]*o.base[e],f[e]=o.cz[e]+o.dz[e]*o.base[e];o.bnx=new Float64Array(a),o.bny=new Float64Array(a),o.bnz=new Float64Array(a),Ae(o,u,d,f,o.bnx,o.bny,o.bnz);for(let t=0;t<a;t++){let n=e.sBreak===void 0?0:I(e.sBreak-.045,e.sBreak-.02,o.s[t]),r=o.bnx[t]+(o.dx[t]-o.bnx[t])*n,i=o.bny[t]+(o.dy[t]-o.bny[t])*n,a=o.bnz[t]+(o.dz[t]-o.bnz[t])*n,s=Math.sqrt(r*r+i*i+a*a)||1;o.bnx[t]=r/=s,o.bny[t]=i/=s,o.bnz[t]=a/=s;let c=o.base[t]-o.rad[t];o.px[t]=u[t]-r*c,o.py[t]=d[t]-i*c,o.pz[t]=f[t]-a*c}return o.bs=o.base.slice(),o.r0=o.rad.slice(),o}var be={i:0,jf:0};function xe(e,t,n,r,i,a){let{sp:o,N:s}=e,c=Math.max(1,Math.floor((a-i)/20)),l=1e9,u=i;for(let e=i;e<=a;e+=c){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}for(let e=Math.max(i,u-c),s=Math.min(a,u+c);e<=s;e++){let i=(t-o.c[e*3])**2+(n-o.c[e*3+1])**2+(r-o.c[e*3+2])**2;i<l&&([l,u]=[i,e])}let d=(t-o.c[u*3])*o.t[u*3]+(n-o.c[u*3+1])*o.t[u*3+1]+(r-o.c[u*3+2])*o.t[u*3+2],f=u+d/o.step,p=Math.min(Math.max(f,i),a),m=Math.min(Math.floor(p),a-1),h=p-m,g=m+1,_=1-h,v=e=>o.c[m*3+e]*_+o.c[g*3+e]*h,y=t-v(0),b=n-v(1),x=r-v(2),S=y*(o.r[m*3]*_+o.r[g*3]*h)+b*(o.r[m*3+1]*_+o.r[g*3+1]*h)+x*(o.r[m*3+2]*_+o.r[g*3+2]*h),C=y*(o.b[m*3]*_+o.b[g*3]*h)+b*(o.b[m*3+1]*_+o.b[g*3+1]*h)+x*(o.b[m*3+2]*_+o.b[g*3+2]*h),w=(Math.atan2(C,S)-(o.tau[m]*_+o.tau[g]*h))/F*s;w=(w%s+s)%s;let T=Math.floor(w),E=w-T,D=(T+1)%s;be.i=h<.5?m:g,be.jf=w;let O=(e.b0[m*s+T]*(1-E)+e.b0[m*s+D]*E)*_+(e.b0[g*s+T]*(1-E)+e.b0[g*s+D]*E)*h,k=Math.sqrt(S*S+C*C)-O,A=Math.max(i-f,f-a)*o.step;return A<=0?k:k>0?Math.sqrt(k*k+A*A):A}var Se=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25},Ce=[0,0,0];function we(e,t,n,r,i){let a=e.sp,o=n-a.c[t*3],s=r-a.c[t*3+1],c=i-a.c[t*3+2],l=o*a.t[t*3]+s*a.t[t*3+1]+c*a.t[t*3+2];o-=l*a.t[t*3],s-=l*a.t[t*3+1],c-=l*a.t[t*3+2];let u=Math.sqrt(o*o+s*s+c*c)||1;return Ce[0]=o/u,Ce[1]=s/u,Ce[2]=c/u,Ce}function Te(e,t,n,r,i,a,o,c,l){let{N:u,rings:d}=e,f=e=>n*(1-I(l[0],l[1],e));for(let n=0;n<d*u;n++){if(!a(n))continue;let l=e.bs[n],p=e.cx[n]+e.dx[n]*l,m=e.cy[n]+e.dy[n]*l,h=e.cz[n]+e.dz[n]*l,g=xe(t,p,m,h,r,i),_=be.i,v=f(e===c?e.s[n]:_*t.sp.step);if(v<1e-4||g>=v)continue;let y=we(t,_,p,m,h),b=1-I(0,v,g),x=e.dx[n]+y[0]*b,S=e.dy[n]+y[1]*b,C=e.dz[n]+y[2]*b,w=Math.sqrt(x*x+S*S+C*C)||1;x/=w,S/=w,C/=w;let T=Math.floor(n/u),E=Math.max(10,Math.round(50*e.L.alongScale)),D=Math.max(0,T-E),O=Math.min(d-1,T+E),k={a:0,b:0,k:v,ia:0,ib:0},A=n=>{let a=p+x*n,o=m+S*n,s=h+C*n;return k.a=xe(e,a,o,s,D,O),k.ia=be.i,k.b=xe(t,a,o,s,r,i),k.ib=be.i,k.k=Math.max(f(e===c?k.ia*e.sp.step:k.ib*t.sp.step),1e-4),Se(k.a,k.b,k.k)},j=0,M=2*v,N=A(M)<0,P=1;if(!N){for(let e=0;e<14;e++){let e=(j+M)*.5;A(e)<0?j=e:M=e}A((j+M)*.5),P=(k.a-k.b)/k.k,P>.97&&(N=!0)}if(N){e.inside[n]=1;let t=e.r0[n]-1.5*o;e.px[n]=e.cx[n]+e.dx[n]*t,e.py[n]=e.cy[n]+e.dy[n]*t,e.pz[n]=e.cz[n]+e.dz[n]*t,e.rad[n]=t;continue}let ee=(j+M)*.5,te=p+x*ee,L=m+S*ee,R=h+C*ee,z=Math.max(k.k-Math.abs(k.a-k.b),0)/k.k,B=k.a<k.b?1-z/2:z/2,V=[e.bnx[n],e.bny[n],e.bnz[n]],H=we(t,k.ib,te,L,R),ne=B*V[0]+(1-B)*H[0],re=B*V[1]+(1-B)*H[1],ie=B*V[2]+(1-B)*H[2],ae=Math.sqrt(ne*ne+re*re+ie*ie)||1;ne/=ae,re/=ae,ie/=ae;let U=.55+.45*I(.02,.2,Math.abs(P)),W=e===c?0:.002*Math.cos(F*2*P)*(1-Math.abs(P))*(.7+.6*s(te*60,L*60,R*60)),oe=(l-e.r0[n])*U-W+o*I(-.05,.3,P);e.z[n]*=U,e.px[n]=te-ne*oe,e.py[n]=L-re*oe,e.pz[n]=R-ie*oe;let se=(te-e.cx[n])*e.dx[n]+(L-e.cy[n])*e.dy[n]+(R-e.cz[n])*e.dz[n];e.base[n]=se,e.rad[n]=se-oe}}function Ee(e){let n=t(e),r=Array.from({length:5},(e,t)=>({phi:t/5*F+(n()-.5)*.9,w:.22+.45*n(),h:.008+.03*n()*n()+(t===1?.018:0),t:.55+.3*n()})),i=n()*F,a=t=>{let n=.008*Math.cos(t-i)+.003*s(Math.cos(t)*3,Math.sin(t)*3,e);for(let e of r){let r=Math.abs(L(t-e.phi))/e.w;r<1&&(n=Math.max(n,e.h*(1-r)**1.4+.008*Math.cos(t-i)))}return n+.0025*Math.abs(s(Math.cos(t)*11,Math.sin(t)*11,e+3))};return{rim:a,height:(t,n)=>{let o=Math.cos(n),c=Math.sin(n);B(t*4.5+.3*s(o*2,c*2,e),n/F*16,1e6,e+7);let l=(z.cell-.5)*.011*I(0,.4,z.e+.08)*I(.08,.35,t),u=.004*Math.cos(n-i)*t-.003+l+.002*s(o*t*20,c*t*20,e+1),d=I(.86,1,t);for(let e of r)Math.abs(L(n-e.phi))<e.w&&(d=Math.max(d,I(e.t,e.t+.12,t)));return u+(a(n)-u)*d}}}function De(e={detail:1}){let t=de(Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1),r=[];for(let e of t){let{rings:t,sOf:n}=se(e,e.spine,e.around);e.rings=t,r.push(ye(e,e.spine,n))}for(let[e,n]of t.entries()){if(n.parent===void 0)continue;let t=r[n.parent],i=r[e],a=n.junction,o=Math.max(0,Math.floor((a-.3)/t.sp.step)),s=Math.min(t.rings-1,Math.ceil((a+.3)/t.sp.step)),c=Math.min(i.rings-1,Math.ceil(.35/i.sp.step)),[l,u,d]=[i.sp.c[0],i.sp.c[1],i.sp.c[2]],f=.026;Te(i,t,n.fillet,o,s,e=>i.s[e]<=n.reach[1],f,i,n.reach),Te(t,i,n.fillet,0,c,e=>(t.px[e]-l)**2+(t.py[e]-u)**2+(t.pz[e]-d)**2<.26*.26,f,i,n.reach)}for(let e of r)ke(e);je(r);let i=new n(`driftwood`);for(let e of r)Ne(i,e);let a=[];for(let e of r)Fe(e,a);return{meshes:[i.finish()],obstacles:a}}function Oe(e){let t=e.L;if(t.spine===t.ref)return(t,n)=>e.bs[t*e.N+n];let n=t.refAround,{sOf:r}=se(t,t.ref,n);return(e,i)=>ve(t,t.ref,r(e,i),F*i/n).rb}function ke(e){Ae(e,e.px,e.py,e.pz,e.nx,e.ny,e.nz)}function Ae(e,t,n,r,i,a,o){let{N:s,rings:c}=e;for(let l=0;l<c;l++)for(let u=0;u<s;u++){let d=l*s+u,f=l*s+(u+1)%s,p=l*s+(u-1+s)%s,m=Math.min(c-1,l+1)*s+u,h=Math.max(0,l-1)*s+u,g=t[f]-t[p],_=n[f]-n[p],v=r[f]-r[p],y=t[m]-t[h],b=n[m]-n[h],x=r[m]-r[h],S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w);T>1e-12||([S,C,w,T]=[e.dx[d],e.dy[d],e.dz[d],1]),i[d]=S/T,a[d]=C/T,o[d]=w/T}}function je(e){let t=.012,n=e.map(e=>{let n=[],r=e.s[(e.rings-1)*e.N];for(let i=0;i<=r;i+=t){let t=W(e.sp,i);n.push([t.cx,t.cy,t.cz,pe(e.L,e.sp,i)*(e.L.shrink?e.L.shrink(i):1)])}return n}),r=n.map(e=>{let t=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(let[n,r,i,a]of e)for(let[e,o]of[n,r,i].entries())t[e]=Math.min(t[e],o-6*a),t[e+3]=Math.max(t[e+3],o+6*a);return t}),i=n.map(e=>Float64Array.from(e.flat()));for(let[a,o]of e.entries()){let{N:e,rings:s,L:l}=o,u=e=>Math.max(1,Math.round(e*l.alongScale)),d=e=>Math.max(1,Math.round(e*l.roundScale)),f=Me(o.rad,s,e,u(2),d(4)),p=Me(o.base,s,e,u(9),d(14));for(let u=0;u<s*e;u++){let e=o.base[u]||.07,s=Math.max(0,f[u]-o.rad[u])/(l.depth*.6*e),d=Math.max(0,p[u]-o.base[u])/(.1*e),m=(1-.55*te(s))*(1-.35*te(d))*(1-.25*o.z[u]),h=o.px[u],g=o.py[u],_=o.pz[u],v=o.nx[u],y=o.ny[u],b=o.nz[u],x=g-c;m*=.35+.65*I(-.01,.07,x),m*=1-.45*Math.max(0,-y)*Math.exp(-Math.max(x,0)/.12);let S=0;for(let e=0;e<n.length;e++){let n=r[e],o=i[e];if(!(e===a||h<n[0]||g<n[1]||_<n[2]||h>n[3]||g>n[4]||_>n[5]))for(let e=0;e<o.length;e+=4){let n=o[e+3],r=o[e]-h,i=o[e+1]-g,a=o[e+2]-_,s=r*r+i*i+a*a;if(s>36*n*n)continue;let c=Math.sqrt(s),l=(r*v+i*y+a*b)/c;l<=0||(S+=n*n/Math.max(s,n*n)*l*(t/(2*n)))}}m*=1-Math.min(.6,.75*S),o.inside[u]&&(m*=.3),o.ao[u]=Math.min(1,Math.max(.03,m))}}}function Me(e,t,n,r,i){let a=new Float64Array(t*n),o=new Float64Array(t*n);for(let r=0;r<t;r++){let t=0;for(let a=-i;a<=i;a++)t+=e[r*n+(a+n)%n];for(let o=0;o<n;o++)a[r*n+o]=t/(2*i+1),t+=e[r*n+(o+i+1)%n]-e[r*n+(o-i+n)%n]}for(let e=0;e<n;e++)for(let i=0;i<t;i++){let s=0,c=0;for(let o=Math.max(0,i-r);o<=Math.min(t-1,i+r);o++)s+=a[o*n+e],c++;o[i*n+e]=s/c}return o}function Ne(e,t){let{N:n,rings:r,L:i}=t,a=e.vertexCount,s=2*F*i.index,c=(e,t)=>e*n+(t%n+n)%n;for(let a=0;a<r;a++)for(let r=0;r<=n;r++){let o=c(a,r),l=t.s[o]+(i.junction??0);e.vertex([t.px[o],t.py[o],t.pz[o]],[l,F*r/n+s,t.z[o],t.ao[o]],[t.nx[o],t.ny[o],t.nz[o]])}let l=n+1,u=(e,n)=>{let i=c(Math.min(Math.max(e,0),r-1),n);return t.rad[i]-t.base[i]};for(let t=0;t<r-1;t++)for(let r=0;r<n;r++){let n=a+t*l+r;Math.abs(u(t-1,r-1)-2*u(t,r)+u(t+1,r+1))+Math.abs(u(t,r)-2*u(t+1,r+1)+u(t+2,r+2))<=Math.abs(u(t-1,r+2)-2*u(t,r+1)+u(t+1,r))+Math.abs(u(t,r+1)-2*u(t+1,r)+u(t+2,r-1))?e.quad(n,n+1,n+l+1,n+l,o.BARK):e.quad(n+1,n+l+1,n+l,n,o.BARK)}for(let[c,u]of i.caps.entries()){if(u===`inside`)continue;let d=c?r-1:0;if(u===`buried`){let r=t.sp,u=t.s[d*n],f=W(r,u),p=c?1:-1,m=t.base[d*n],h=e.vertex([f.cx+p*f.tx*m*.4,f.cy+p*f.ty*m*.4,f.cz+p*f.tz*m*.4],[u+(i.junction??0),s,0,.1],[p*f.tx,p*f.ty,p*f.tz]);for(let t=0;t<n;t++){let n=a+d*l+t,r=n+1;c?e.tri(n,r,h,o.BARK):e.tri(r,n,h,o.BARK)}}else Pe(e,t)}}function Pe(e,t){let{N:n,rings:r,L:i,sp:a}=t,s=Math.max(6,Math.round(22*i.roundScale)),c=r-1,l=0;for(let e=0;e<n;e++)l+=t.rad[c*n+e];l/=n;let u=[];for(let r=0;r<=s;r++){let o=1-r/s,d=[];for(let u=0;u<n;u++){let f=c*n+u,p=F*u/n,m;if(r===0)m=[t.px[f],t.py[f],t.pz[f]];else{let e=W(a,i.sBreak+i.brk.height(o,p)),n=p+e.tau,s=Math.cos(n),c=Math.sin(n),l=t.rad[f]*o*(r===1?.985:1);m=[e.cx+(s*e.rx+c*e.bx)*l,e.cy+(s*e.ry+c*e.by)*l,e.cz+(s*e.rz+c*e.bz)*l]}let h=(.55+.45*I(0,.6,1-o))*(r===0?.8:1);if(d.push(e.vertex(m,[Math.cos(p)*o*l,Math.sin(p)*o*l,0,h])),r===s)break}u.push(d)}for(let t=0;t<s;t++)for(let r=0;r<n;r++){let i=u[t][r],a=u[t][(r+1)%n];t===s-1?e.tri(i,a,u[s][0],o.WOOD_END):e.quad(i,a,u[t+1][(r+1)%n],u[t+1][r],o.WOOD_END)}}function Fe(e,t){let n=e.L.ref,r=e.L.refAround,{rings:i,sOf:a}=se(e.L,n,r),o=Oe(e),s=a(i-1,0),c=Math.max(1,Math.round(s/.1));for(let a=0;a<c;a++){let l=a/c*s,u=(a+1)/c*s,d=W(n,l),f=[d.cx,d.cy,d.cz],p=W(n,u),m=[p.cx,p.cy,p.cz];if(Math.max(f[1],m[1])<-.6||e.L.parent!==void 0&&u<.05)continue;let h=0;for(let e=Math.floor(l/n.step);e<=Math.min(i-1,Math.ceil(u/n.step));e++)for(let t=0;t<r;t+=4)h=Math.max(h,o(e,t));let g=Math.round(h*.9*1e3)/1e3;t.push({a:f.map(e=>Math.round(e*1e3)/1e3),b:m.map(e=>Math.round(e*1e3)/1e3),r:Math.round((g+.05)*1e3)/1e3,solid:g})}}function Ie(e){let t=e=>Math.abs(e)<5e-6?`0.0`:e.toFixed(5),n=e=>`vec3f(${t(e[0])}, ${t(e[1])}, ${t(e[2])})`,r=``;for(let[i,a]of e.entries()){let e=a.spine,o=a.junction??0,s=Math.max(2,Math.ceil(e.L/.06)),c=[];for(let t=0;t<=s;t++){let n=W(e,t/s*e.L),r=Math.hypot(n.tx,n.ty,n.tz);c.push([o+t/s*e.L,[n.cx,n.cy,n.cz],[n.tx/r,n.ty/r,n.tz/r]])}r+=`fn scape_wood_axis${i}(s: f32) -> ScapeWoodAxis {\n`;for(let e=0;e<s;e++){let[i,o,l]=c[e],[u,d,f]=c[e+1],p=`scape_wood_lerp(${n(o)}, ${n(l)}, ${n(d)}, ${n(f)}, ${t(a.twist)}, clamp((s - ${t(i)}) * ${t(1/(u-i))}, 0.0, 1.0))`;r+=e<s-1?`  if (s < ${t(u)}) {\n    return ${p};\n  }\n`:`  return ${p};\n`}r+=`}

`}r+=`fn scape_wood_axis(along: f32, limb: i32) -> ScapeWoodAxis {
`;for(let t=1;t<e.length;t++)r+=`  if (limb == ${t}) {\n    return scape_wood_axis${t}(along);\n  }\n`;return r+`  return scape_wood_axis0(along);
}
`}function Le(e){let t=e.find(e=>e.caps[1]===`broken`).spine,n=W(t,t.L),r=Math.hypot(n.tx,n.ty,n.tz);return`vec3f(${(n.tx/r).toFixed(5)}, ${(n.ty/r).toFixed(5)}, ${(n.tz/r).toFixed(5)})`}var Re=de(),ze=`
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

${Ie(Re)}
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
  let axis = ${Le(Re)};
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
`,Be=r({WGSL:()=>ht,build:()=>dt}),Ve=[{at:[-.4,.32],size:[.24,.15,.19],sink:.35,yaw:.3,lean:[.04,-.06],freq:52,seed:11,exp:[2.1,2.3],taper:.04,ends:[[1.12,.88],[.55,1.45],[1.05,.95]],lumps:.06,planes:[[.25,1,.45,.66,.06],[.95,.2,-.1,.72,.06],[-.3,.5,-.8,.78,.07]],facets:2,dents:[[-.6,.35,.7,.35,.04],[.1,.9,-.4,.3,.025]],cracks:[[.25,.8,.5,.3,.28,.6],{from:0,at:-.25,turn:2.4,length:.2,depth:.6}],pits:.22,bedding:.7,layers:[.3,.9,-.2]},{at:[.17,.24],size:[.17,.085,.14],sink:.3,yaw:-.5,lean:[-.05,.05],freq:36,seed:23,exp:[2.2,2.4],taper:.05,ends:[[1.1,.9],[.42,1.58],[.92,1.08]],lumps:.05,planes:[[-.35,1,.3,.62,.06],[-.9,.2,.35,.78,.06]],facets:2,dents:[[.6,.5,.6,.4,.035]],cracks:[[.1,.8,.55,1,.55,.6]],pits:.5,bedding:.3,layers:[.9,.3,.2]},{at:[.408,.041],size:[.15,.075,.12],sink:.36,yaw:.9,lean:[.08,0],freq:32,seed:37,exp:[2.2,2.4],taper:0,ends:[[1,.88],[.4,1.6],[.95,1.05]],lumps:.04,planes:[[.35,1,.45,.62,.06],[.2,.3,.95,.75,.08]],facets:2,dents:[[-.5,.6,.6,.35,.04]],cracks:[[.5,.55,.65,1.3,.3,.8],{from:0,at:.2,turn:.7,length:.12,depth:.5}],pits:.9,bedding:0,layers:[0,1,0]},{at:[.62,.12],size:[.09,.05,.08],sink:.36,yaw:-.3,lean:[.02,.04],freq:20,seed:41,exp:[2,2.1],taper:0,ends:[[1,.95],[.46,1.54],[1,1]],lumps:.05,planes:[[.3,1,-.3,.66,.07]],facets:1,dents:[[.5,.7,.4,.4,.03]],cracks:[[.2,.7,.7,2.4,.35,.5]],pits:.3,bedding:.6,layers:[.2,.95,.3]}],He={a:[.482,-.64,-.139],b:[.432,-.45,-.14],r:.09},Ue=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],We=e=>Math.hypot(e[0],e[1],e[2]),K=e=>{let t=We(e)||1;return[e[0]/t,e[1]/t,e[2]/t]},Ge=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Ke=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},qe=e=>Math.min(Math.max(e,0),1);function Je({a:e,b:t,r:n},r,i,a){let o=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],s=qe(((r-e[0])*o[0]+(i-e[1])*o[1]+(a-e[2])*o[2])/Ue(o,o));return Math.hypot(r-e[0]-o[0]*s,i-e[1]-o[1]*s,a-e[2]-o[2]*s)-n}function Ye(e,t,n,r){let i=Math.imul(e,668265261)^Math.imul(t,374761393)^Math.imul(n,2654435761)^Math.imul(r,2246822519);return i=Math.imul(i^i>>>15,2246822507),i=Math.imul(i^i>>>13,3266489909),((i^i>>>16)>>>0)/4294967296}function Xe(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=9,s=9,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=r+f,m=i+d,h=a+u,g=p+Ye(p,m,h,1)-e,_=m+Ye(p,m,h,2)-t,v=h+Ye(p,m,h,3)-n,y=g*g+_*_+v*v;y<o?(s=o,o=y,c=Ye(p,m,h,4),l=Ye(p,m,h,5)):y<s&&(s=y)}return[Math.sqrt(o),Math.sqrt(s),c,l]}function Ze(e){let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(K),r=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],i=n.slice(),a=(e,t,n)=>K([e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]),o=new Map,s=(t,r,s)=>{let c=Math.min(t,r)*12+Math.max(t,r),l=o.get(c);if(!l){l=[];let[s,u]=t<r?[t,r]:[r,t];for(let t=1;t<e;t++)l.push(i.push(a(n[s],n[u],t/e))-1);o.set(c,l)}return t<r?l[s-1]:l[e-s-1]},c=[];for(let[t,a,o]of r){Ue(Ge([n[a][0]-n[t][0],n[a][1]-n[t][1],n[a][2]-n[t][2]],[n[o][0]-n[t][0],n[o][1]-n[t][1],n[o][2]-n[t][2]]),n[t])<0&&([a,o]=[o,a]);let r=new Map,l=(c,l)=>{if(c===0&&l===0)return t;if(c===e)return a;if(l===e)return o;if(l===0)return s(t,a,c);if(c===0)return s(t,o,l);if(c+l===e)return s(a,o,l);let u=c*(e+1)+l,d=r.get(u);if(d===void 0){let s=n[t],f=n[a],p=n[o],m=(e-c-l)/e,h=c/e,g=l/e;d=i.push(K([s[0]*m+f[0]*h+p[0]*g,s[1]*m+f[1]*h+p[1]*g,s[2]*m+f[2]*h+p[2]*g]))-1,r.set(u,d)}return d};for(let t=0;t<e;t++)for(let n=0;n<e-t;n++)c.push(l(t,n),l(t+1,n),l(t,n+1)),t+n<e-1&&c.push(l(t+1,n),l(t+1,n+1),l(t,n+1))}return{dirs:i,tris:c}}function Qe(e,t){let n=Array.from({length:e},()=>new Set);for(let e=0;e<t.length;e+=3){let[r,i,a]=[t[e],t[e+1],t[e+2]];n[r].add(i).add(a),n[i].add(r).add(a),n[a].add(r).add(i)}let r=new Uint32Array(e+1);for(let t=0;t<e;t++)r[t+1]=r[t]+n[t].size;let i=new Uint32Array(r[e]);for(let t=0;t<e;t++)i.set([...n[t]],r[t]);return{start:r,list:i}}function $e(e,t,n){let r=Float64Array.from(e),i=new Float64Array(e.length);for(let e=0;e<n;e++){for(let e=0;e<r.length;e++){let n=0;for(let i=t.start[e];i<t.start[e+1];i++)n+=r[t.list[i]];i[e]=.5*r[e]+.5*n/(t.start[e+1]-t.start[e])}[r,i]=[i,r]}return r}function et(e,t){let n=new Float64Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=Ge([e[a]-e[i],e[a+1]-e[i+1],e[a+2]-e[i+2]],[e[o]-e[i],e[o+1]-e[i+1],e[o+2]-e[i+2]]);for(let e of[i,a,o])for(let t=0;t<3;t++)n[e+t]+=s[t]}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2])||1;n[e]/=t,n[e+1]/=t,n[e+2]/=t}return n}function tt(e,t){let{half:n,exp:r,ends:i,lumps:o,planes:c,off:l,taper:u}=e,d=1-u*t[1],f=n[0]*i[0][t[0]<0?0:1]*d,p=n[1]*i[1][t[1]<0?0:1],m=n[2]*i[2][t[2]<0?0:1]*d,[h,g]=r,_=1/(((Math.abs(t[0])/f)**h+(Math.abs(t[2])/m)**h)**(g/h)+(Math.abs(t[1])/p)**g)**(1/g);_*=1+o*a(t[0]*1.2+l[0],t[1]*1.2+l[1],t[2]*1.2+l[2],3)+.15*o*s(t[0]*3+l[1],t[1]*3+l[2],t[2]*3+l[0]);for(let n of e.dents){let e=Ue(t,n.dir);e>0&&(_*=1-n.depth*Math.exp(-(1-e)/n.size))}let v=0;for(let e of c){let n=Ue(t,e.n);if(n<.001)continue;let r=e.h/n,i=e.soft,a=Math.max(i-Math.abs(_-r),0)/i;v=Math.max(v,qe(.5+.5*(_-r)/i)),_=Math.min(_,r)-a*a*i*.25}return[_,v]}function nt(e,t){let n=e.scale,r=[t[0]/n[0],t[1]/n[1],t[2]/n[2]],i=We(r),[a,o]=tt(e,[r[0]/i,r[1]/i,r[2]/i]);return[a/i,o]}var rt=(e,t)=>e.wob.reduce((e,[n,r,i,a,o])=>e+o*Math.sin(n*t[0]+r*t[1]+i*t[2]+a),0),it=(e,t)=>e.branch?Ke(-.1*e.length,.05*e.length,t)*(1-Ke(.2*e.length,e.length,t)):1-Ke(.15*e.length,e.length,Math.abs(t)),at=(e,t)=>.4+.6*Ke(-.35,.15,.6*Math.sin(t*e.open[0]+e.open[1])+.4*Math.sin(t*e.open[2]+e.open[3])),ot=(e,t)=>.6+.6*Ke(-.5,.5,.7*Math.sin(t*e.wide[0]+e.wide[1])+.3*Math.sin(t*e.wide[2]+e.wide[3]));function st(e){let n={...e},r=t(n.seed*7919+13),[i,a,o]=n.size,s=a/(1-n.sink);n.half=[i/2,s/2,o/2],n.mean=(i/2+s/2+o/2)/3,n.off=[r()*50-25,r()*50-25,r()*50-25],n.layers=K(n.layers),n.dents=n.dents.map(([e,t,n,r,i])=>({dir:K([e,t,n]),size:1-Math.cos(r),depth:i}));let l=Array.from({length:n.facets},()=>{let e=r()*2*Math.PI,t=.35+.55*r(),n=Math.sqrt(1-t*t);return[n*Math.cos(e),t,n*Math.sin(e),.8+.06*r(),.1+.05*r()]});n.planes=[...n.planes,...l].map(([e,t,r,i,a])=>{let o=K([e,t,r]);return{n:o,h:i*Math.hypot(...[0,1,2].map(e=>n.half[e]*n.ends[e][o[e]<0?0:1]*o[e])),soft:a*n.mean}});let u=Ze(16).dirs;n.scale=[1,1,1];let d=[1/0,1/0,1/0],f=[-1/0,-1/0,-1/0];for(let e of u){let[t]=nt(n,e);for(let n=0;n<3;n++)d[n]=Math.min(d[n],e[n]*t),f[n]=Math.max(f[n],e[n]*t)}n.scale=[i/(f[0]-d[0]),s/(f[1]-d[1]),o/(f[2]-d[2])];let[p,m]=n.lean,h=e=>{let[t,r,i]=e;return[t,r]=[t*Math.cos(m)-r*Math.sin(m),t*Math.sin(m)+r*Math.cos(m)],[r,i]=[r*Math.cos(p)-i*Math.sin(p),r*Math.sin(p)+i*Math.cos(p)],[t,i]=[t*Math.cos(n.yaw)+i*Math.sin(n.yaw),-t*Math.sin(n.yaw)+i*Math.cos(n.yaw)],[t,r,i]};n.turn=[h([1,0,0]),h([0,1,0]),h([0,0,1])];let g=-1/0;for(let e of u){let[t]=nt(n,e);g=Math.max(g,h([e[0]*t,e[1]*t,e[2]*t])[1])}n.shift=[n.at[0],c+a-g,n.at[1]];let _=[Math.cos(n.yaw),0,-Math.sin(n.yaw)],v=[Math.sin(n.yaw),0,Math.cos(n.yaw)],y=0,b=0;for(let e of u){let[t]=nt(n,e),[r,i,a]=h([e[0]*t,e[1]*t,e[2]*t]);i+n.shift[1]<-.6||(y=Math.max(y,Math.abs(r*_[0]+a*_[2])),b=Math.max(b,Math.abs(r*v[0]+a*v[2])))}let x=Math.max(b,.5*a),S=c+Math.max(a-x,0),C=Math.max(y-x,0);n.obstacle={a:[n.at[0]-_[0]*C,S,n.at[1]-_[2]*C],b:[n.at[0]+_[0]*C,S,n.at[1]+_[2]*C],r:x+.05,solid:x},n.crackList=[];for(let e of n.cracks){let t,i,a=!1,o,s;if(Array.isArray(e)){t=K(e.slice(0,3));let n=K(Ge(t,Math.abs(t[1])<.9?[0,1,0]:[1,0,0])),r=Ge(t,n);i=n.map((t,n)=>t*Math.cos(e[3])+r[n]*Math.sin(e[3])),[o,s]=e.slice(4)}else{let r=n.crackList[e.from];t=K(r.at.map((t,n)=>t+r.along[n]*e.at*r.length));let c=K(r.along.map((e,n)=>e-t[n]*Ue(r.along,t))),l=Ge(t,c);i=c.map((t,n)=>t*Math.cos(e.turn)+l[n]*Math.sin(e.turn)),a=!0,{length:o,depth:s}=e}let[c]=nt(n,t),l=K(Ge(t,i)),u=K(i),d=(e,r)=>{let i=K(t.map((t,n)=>t+r*e[n])),[a]=nt(n,i);return i.map(e=>e*a)},[f,p,m,h]=[d(l,.01),d(l,-.01),d(u,.01),d(u,-.01)],g=K(Ge(f.map((e,t)=>e-p[t]),m.map((e,t)=>e-h[t])));Ue(g,t)<0&&(g=g.map(e=>-e)),i=K(i.map((e,t)=>e-g[t]*Ue(i,g)));let _=[[12,.008],[80,.0012],[210,4e-4]].map(([e,t])=>{let n=K([r()*2-1,r()*2-1,r()*2-1]);return[n[0]*e,n[1]*e,n[2]*e,r()*2*Math.PI,t]});n.crackList.push({at:t.map(e=>e*c),out:t,along:i,n:K(Ge(i,g)),branch:a,length:o*2*n.mean,depth:s,wob:_,open:[35,r()*6.3,90,r()*6.3],wide:[60,r()*6.3,150,r()*6.3],k:r()*40})}return n}function ct(e,t,n){let[r,i,o]=e.off,c=t[0]+r,l=t[1]+i,u=t[2]+o,d=e.spacing,f=e.coarse,p=Math.sqrt(f),m=.0065*(1-.8*n)*a(c*16,l*16,u*16,3),[h]=Xe(c/.04,l/.04,u/.04);m+=.0035*(1-.8*n)*(h*h-.35);let g=.012*p,[_]=Xe(c/g+4.4,l/g,u/g);m+=.0012*p*(1-n)*(_*_-.3),n>0&&(m+=.0012*p*n*a(c*70/p+1.7,l*70/p,u*70/p,2));let v=1-Math.abs(s(c*24+5.1,l*24,u*24)+.2*s(c*70,l*70,u*70+2.3));if(m-=.001*(1-.6*n)*Ke(.05,.55,s(c*5,l*5+7.7,u*5))*v**(6/f),e.bedding>0){let n=Ue(t,e.layers)*52+1.6*a(c*6,l*6,u*6,2);m-=7e-4*e.bedding*(1-Math.abs(Math.sin(Math.PI*n)))**(3/f)*(.5+.5*s(c*11,l*11,u*11+4))}let y=Ke(-.35,.45,s(c*8+3.1,l*8,u*8));for(let[t,n,r,i,a,o]of[[Math.max(.01,6*d),e.pits*(.2+.7*y),.25,.45,.3,0],[.032*p,.04*e.pits,.16,.3,.2,.35*qe(2-f)]]){let[e,,d,f]=Xe(c/t+9.1,l/t,u/t),p=(r+(i-r)*f)*(1+o*s(c*180,l*180+2.2,u*180));if(d<n&&e<p){let n=1-e/p*(e/p);m-=a*p*t*n*n}}let b=3.2*d,[x,S]=Xe(c/b,l/b+3.3,u/b),C=(.08+.05*n)*d*Ke(0,.3,S-x);C+=(.09+.05*n)*d*a(c/(3.5*d),l/(3.5*d),u/(3.5*d),2);let w=0;for(let n of e.crackList){let r=[t[0]-n.at[0],t[1]-n.at[1],t[2]-n.at[2]],i=Ue(r,n.along),a=it(n,i)*Ke(-.5*e.mean,-.25*e.mean,Ue(r,n.out));if(a<=0)continue;let o=Ue(r,n.n)+rt(n,t),f=2.6*d*(.5+.5*a)*ot(n,i);if(Math.abs(o)>10*f)continue;let p=o/f,m=.9*d*n.depth*a*at(n,i);w+=m*((.75+.25*s(c*30,l*30+n.k,u*30))*Math.exp(-2*p*p)+.2*Math.exp(-p*p/12))}return[m+C-w,w,m-w]}function lt(e,t,n){let{nb:r}=n;e.coarse=Math.max(1,1/e.density);let i=n.dirs.length,a=e.size[1],o=new Float64Array(i*3),s=new Float64Array(i),l=(t,n)=>{let[r,i]=nt(e,n);o[t*3]=n[0]*r,o[t*3+1]=n[1]*r,o[t*3+2]=n[2]*r,s[t]=i};n.dirs.forEach((e,t)=>l(t,e));let u=new Float64Array(i*3);for(let e=0;e<8;e++){for(let e=0;e<i;e++){let t=0,n=0,i=0,a=r.start[e+1]-r.start[e];for(let a=r.start[e];a<r.start[e+1];a++){let e=r.list[a]*3;t+=o[e],n+=o[e+1],i+=o[e+2]}u[e*3]=.5*o[e*3]+.5*t/a,u[e*3+1]=.5*o[e*3+1]+.5*n/a,u[e*3+2]=.5*o[e*3+2]+.5*i/a}for(let e=0;e<i;e++)l(e,K([u[e*3],u[e*3+1],u[e*3+2]]))}let d=0;for(let e=0;e<i;e++)for(let t=r.start[e];t<r.start[e+1];t++){let n=r.list[t]*3;d+=Math.hypot(o[n]-o[e*3],o[n+1]-o[e*3+1],o[n+2]-o[e*3+2])}e.spacing=d/r.list.length;let f=et(o,n.tris),p=new Float64Array(i),m=new Float64Array(i),h=new Float64Array(i),g=new Float64Array(i*3),[_,v,y]=e.turn;for(let t=0;t<i;t++){let[n,r,i]=ct(e,[o[t*3],o[t*3+1],o[t*3+2]],s[t]);p[t]=n,m[t]=r,h[t]=i;let a=o[t*3]+f[t*3]*n,c=o[t*3+1]+f[t*3+1]*n,l=o[t*3+2]+f[t*3+2]*n;for(let n=0;n<3;n++)g[t*3+n]=_[n]*a+v[n]*c+y[n]*l+e.shift[n]}let b=et(g,n.tris),x=$e(h,r,2),S=$e(h,r,Math.max(2,Math.round(12*e.density*e.density))),C=$e(Array.from(h,(e,t)=>x[t]-e),r,1),w=new Float64Array(i*4);for(let n=0;n<i;n++){let r=qe(Math.max(C[n]/(.25*e.spacing)*.25+(S[n]-h[n])/.004*.6,m[n]/(2*e.spacing*e.coarse))),i=g[n*3+1]-c,o=b[n*3+1],s=.45+.55*Ke(-.01,.45*a,i),l=1-.55*Math.max(-o,0)*(1-Ke(0,.7*a,i)),u=.82+.18*(.5+.5*o),d=Je(He,g[n*3],g[n*3+1],g[n*3+2]),f=1-.45*Math.exp(-Math.max(d,0)/.015);w.set([t,r,0,qe((1-.65*r)*s*l*u*f)],n*4)}return{world:g,attrs:w}}var ut=Ve.map(st);function dt(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,r=new n(`rocks`),i=[],a=new Map;return ut.forEach((e,n)=>{let s=t===1?e.freq:Math.max(6,Math.round(e.freq*t)),c=a.get(s);if(!c){let e=Ze(s);c={...e,nb:Qe(e.dirs.length,e.tris)},a.set(s,c)}let{world:l,attrs:u}=lt({...e,density:s/e.freq},n,c),d=r.vertexCount;for(let e=0;e<c.dirs.length;e++)r.vertex([l[e*3],l[e*3+1],l[e*3+2]],[u[e*4],u[e*4+1],u[e*4+2],u[e*4+3]]);for(let e=0;e<c.tris.length;e+=3)r.tri(d+c.tris[e],d+c.tris[e+1],d+c.tris[e+2],o.ROCK);let f=e.obstacle;i.push({a:f.a.slice(),b:f.b.slice(),r:f.r,solid:f.solid})}),{meshes:[r.finish()],obstacles:i}}var q=e=>e.toFixed(5),ft=e=>`vec3f(${e.map(q).join(`, `)})`;function pt(){let e=Ve[0],n=t(e.seed*7919+4099);n();let r=[e.at[0],c+.45*e.size[1],e.at[1]],i=n()*2*Math.PI,a=(n()*2-1)*.6,o=[Math.sqrt(1-a*a)*Math.cos(i),a,Math.sqrt(1-a*a)*Math.sin(i)],s=Ue(o,r)+(n()-.5)*.5*Math.min(e.size[0],e.size[2]);return[s,s+(n()<.5?-1:1)*(.015+.015*n())].map((e,t)=>`    let vein${`AB`[t]} = vec4f(${o.map(q).join(`, `)}, ${q(e)});`).join(`
`)}function mt(){let e=[];return ut.forEach((t,n)=>{let[r,i,a]=t.turn;e.push(`  ${n?`} else `:``}if (id == ${n}u) {`,`    let back = transpose(mat3x3f(${ft(r)}, ${ft(i)}, ${ft(a)}));`,`    let ql = back * (p - ${ft(t.shift)});`,`    let nl = back * n;`);for(let n of t.crackList){let r=n.length,i=n.branch?`smoothstep(${q(-.1*r)}, ${q(.05*r)}, along) * (1.0 - smoothstep(${q(.2*r)}, ${q(r)}, along))`:`1.0 - smoothstep(${q(.15*r)}, ${q(r)}, abs(along))`,a=n.wob.map(([e,t,n,r,i])=>`${q(i)} * sin(dot(ql, ${ft([e,t,n])}) + ${q(r)})`).join(` + `);e.push(`    {`,`      let d = ql - ${ft(n.at)};`,`      let along = dot(d, ${ft(n.along)});`,`      let mask = (${i}) * smoothstep(${q(-.5*t.mean)}, ${q(-.25*t.mean)}, dot(d, ${ft(n.out)}));`,`      let cn = ${ft(n.n)};`,`      let off = dot(d, cn) + ${a};`,`      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${q(n.open[0])} + ${q(n.open[1])}) + 0.4 * sin(along * ${q(n.open[2])} + ${q(n.open[3])}));`,`      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${q(n.wide[0])} + ${q(n.wide[1])}) + 0.3 * sin(along * ${q(n.wide[2])} + ${q(n.wide[3])}));`,`      let hw = ${q(5e-4*Math.sqrt(n.depth))} * wide * (0.4 + 0.6 * mask);`,`      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);`,`      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);`,`      crackLine = max(crackLine, core * mask * open);`,`    }`)}}),e.push(`  }`),e.join(`
`)}var ht=`
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
${pt()}
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
${mt()}
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
`,gt=r({WGSL:()=>vn,build:()=>gn}),J=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],Y=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],X=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],_t=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],vt=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Z=e=>Math.hypot(e[0],e[1],e[2]),Q=e=>X(e,1/(Z(e)||1)),yt=(e,t,n)=>J(e,X(Y(t,e),n)),bt=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return J(J(X(e,r),X(vt(t,e),i)),X(t,_t(t,e)*(1-r)))},xt=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},St=[0,1,0],Ct=(e,t)=>Q(Y(e,X(t,_t(e,t)))),wt=e=>e-Math.floor(e);function Tt(e,t){let n=wt(e*.618034+.17),r=wt(e*.754877+.31),i=wt(e*.56984+.53);return{widest:.3+.12*n,base:2+r,tip:1.45+.5*i,drawn:t?.06+.14*n:.18+.2*n}}function Et(e,t){if(e<=t.widest)return Math.sqrt(Math.max(1-((t.widest-e)/t.widest)**t.base,0));let n=(e-t.widest)/(1-t.widest);return Math.max(1-n**t.tip,0)**1.05*(1-t.drawn*xt(.62,1,n))}var Dt=.3,Ot=(e,t,n,r,i)=>{let a=Math.abs(t),o=+(t<0);return n*(e-Dt*a**1.2*Et(e,i))+.5*o+.2*Math.sin(9*e+2.3*r+1.7*o)*Math.min(2*a,1)};function kt(e){let t=e.length,n=.5*e.ratio*t,r=Q(vt(e.face,e.dir)),i=[[0,0,0]],a=[];for(let n=0;n<=120;n++){let o=n/120,s=e.arch*o**1.6+e.droop*xt(.7,1,o),c=e.side*o**1.3,l=bt(e.dir,r,s),u=bt(e.face,r,s),d=bt(r,u,c);l=bt(l,u,c),d=bt(d,l,e.twist*o),u=bt(u,l,e.twist*o),a.push({T:l,N:u,X:d}),n&&i.push(J(i[n-1],X(J(l,a[n-1].T),.5*t/120)))}let o=t=>{let n=Math.min(Math.max(t,0),1)*120,r=Math.min(Math.floor(n),119),o=n-r;return{c:J(e.base,yt(i[r],i[r+1],o)),T:Q(yt(a[r].T,a[r+1].T,o)),N:Q(yt(a[r].N,a[r+1].N,o)),X:Q(yt(a[r].X,a[r+1].X,o))}},c=Tt(e.id,!!e.small),l=(t,r)=>Et(t,c)*n*(r?1+e.asym:1-e.asym);return{b:e,L:t,H:n,at:(n,r)=>{let{c:i,N:a,X:u}=o(n),d=l(n,r>=0),f=Math.max(-1.2,Math.min(1.2,r/Math.max(d,1e-7))),p=Math.abs(f),m=Math.sin(Math.PI*Math.min(n*1.15,1)),h=e.cup*(.3+.7*m)*d*f*f;h+=e.fold*d*(Math.sqrt(f*f+.004)-.0632);let g=t*(.013-.007*n);h-=t*.0065*(1-.8*n)*Math.exp(-((r/g)**2)),h+=t*e.quilt*(.5-.5*Math.cos(2*Math.PI*Ot(n,f,e.veins,e.id,c)))*xt(.05,.2,p)*(1-xt(.75,1,p))*xt(.03,.12,n)*(1-xt(.85,.98,n));let _=r>=0?e.phase:e.phase+2.3;if(h+=e.wave*d*(Math.sin(2*Math.PI*e.waves*n+_)+.6*s(n*6,f*1.3,e.id*3.7+.5))*xt(.4,1,p)**2*m,!e.furl)return J(J(i,X(u,r)),X(a,h));let v=d/(e.furl*(r>=0?4.6:4)),y=r/Math.max(v,1e-7);return J(J(i,X(u,v*Math.sin(y))),X(a,v*(1-Math.cos(y))))},frame:o,half:l}}function At(e,t,n,r,i){let{b:a,L:o,at:s,frame:c,half:l}=t,u=(e,t)=>{let n=2e-4,r=vt(Y(s(Math.min(e+n,1),t),s(Math.max(e-n,0),t)),Y(s(e,t+n*o),s(e,t-n*o)));return Z(r)>1e-14?Q(r):c(e).N},d=[];for(let e=0;e<=r;e++){let t=-1+2*e/r;d.push(Math.sign(t)*Math.abs(t)**1.3)}let f=[],p=e.vertex(s(0,0),[0,0,a.id,1],c(0).N);f.push([p,0,0]);let m=[];for(let t=1;t<n;t++){let r=t/n,i=.6*r+.4*(.5-.5*Math.cos(Math.PI*r));m.push(d.map(t=>{let n=t*l(i,t>=0),r=e.vertex(s(i,n),[i,t,a.id,1],u(i,n));return f.push([r,i,n]),r}))}let h=e.vertex(s(1,0),[1,0,a.id,1],c(1).N);f.push([h,1,0]);for(let t=0;t<r;t++){e.tri(p,m[0][t],m[0][t+1],i);for(let n=0;n+1<m.length;n++)e.quad(m[n][t],m[n+1][t],m[n+1][t+1],m[n][t+1],i);e.tri(m[m.length-1][t],h,m[m.length-1][t+1],i)}return f}function jt(e,t){let n=e.length,r=e.map((t,r)=>Q(Y(e[Math.min(r+1,n-1)],e[Math.max(r-1,0)]))),i=[Ct(t,r[0])];for(let e=1;e<n;e++){let t=vt(r[e-1],r[e]),n=Z(t),a=n>1e-9?bt(i[e-1],X(t,1/n),Math.atan2(n,_t(r[e-1],r[e]))):i[e-1];i.push(Ct(a,r[e]))}return{T:r,U:i}}function Mt(e,t,n,r,i,a,o,s=null){let c=t.length,{T:l,U:u}=jt(t,o),d=[],f=0;for(let i=0;i<c;i++){let o=u[i];if(i&&(f+=Z(Y(t[i],t[i-1]))),n[i]<=0){d.push(e.vertex(t[i],[f,0,a,1],i?l[i]:X(l[i],-1)));continue}let p=vt(l[i],o),m=Math.max(i-1,0),h=Math.min(i+1,c-1),g=Math.max(Z(Y(t[h],t[m])),1e-9),_=[];for(let c=0;c<=r;c++){let u=2*Math.PI*c/r,d=J(X(o,Math.cos(u)),X(p,Math.sin(u)));if(!s){let r=(n[h]-n[m])/g;_.push(e.vertex(J(t[i],X(d,n[i])),[f,u,a,1],Q(Y(d,X(l[i],Math.max(-3,Math.min(3,r)))))));continue}let v=s(i,u),y=(s(i,u+.001)-s(i,u-.001))/.002,b=Q(Y(X(d,v),X(J(X(o,-Math.sin(u)),X(p,Math.cos(u))),y))),x=(n[h]*s(h,u)-n[m]*s(m,u))/g*_t(d,b);_.push(e.vertex(J(t[i],X(d,n[i]*v)),[f,u,a,1],Q(Y(b,X(l[i],Math.max(-3,Math.min(3,x)))))))}d.push(_)}for(let t=0;t+1<c;t++){let n=d[t],a=d[t+1];for(let t=0;t<r;t++)typeof n==`number`?e.tri(n,a[t+1],a[t],i):typeof a==`number`?e.tri(n[t],n[t+1],a,i):e.quad(n[t],n[t+1],a[t+1],a[t],i)}return{rings:d,T:l,U:u}}function Nt(e,t,n,r,i,a=1.35){let o=[];for(let s=0;s<=i;s++){let c=1-(1-s/i)**a,l=1-c;o.push(J(J(X(e,l*l*l),X(t,3*l*l*c)),J(X(n,3*l*c*c),X(r,c*c*c))))}return o}function Pt(e,t){let n=[],r=e.length-1;for(let i=0;i<r;i++){let a=e[Math.max(i-1,0)],o=e[i],s=e[i+1],c=e[Math.min(i+2,r)];for(let e=0;e<t||i===r-1&&e===t;e++){let r=e/t,i=e=>.5*(2*o[e]+(-a[e]+s[e])*r+(2*a[e]-5*o[e]+4*s[e]-c[e])*r*r+(-a[e]+3*o[e]-3*s[e]+c[e])*r*r*r);n.push([i(0),i(1),i(2)])}}return n}function Ft(e,t,n,r,i){let a=e.frame(0),o=J(e.at(0,0),X(a.N,-.8*i)),s=Z(Y(o,t));return Nt(t,J(t,X(n,.45*s)),Y(o,X(a.T,Math.min(.08,.3*s))),o,r)}function It(e,t,n,r,i){let a=r.rTop*1.12,o=Ft(e,t,n,r.segs,a),c=Z(Y(o[o.length-1],t)),l=[];o.forEach((e,t)=>{let n=t/r.segs;if(t&&t<r.segs){let r=.003*Math.sin(Math.PI*n)*(c/.4);o[t]=J(e,[r*s(n*2.2,i*1.7,.3),r*s(n*2.2,i*1.7,5.1),r*s(n*2.2,i*1.7,9.7)])}let a=r.rBase+(r.rTop-r.rBase)*n**.7;l.push(a*(1+r.sheath*(1-xt(0,r.sheathLen/c,n))**2)*(1+.14*xt(.88,1,n)))});let u=r.midribSegs;for(let t=1;t<=u;t++){let n=t/u*r.midrib,i=t===u?0:a*(1-t/u)**.75;o.push(J(e.at(n,0),X(e.frame(n).N,-.8*i))),l.push(i)}return{pts:o,rad:l,segs:r.segs,n:u,midrib:r.midrib}}function Lt(e,t,n,r,i,a){let{pts:s,rad:c,segs:l}=n,u=t.frame(0).N,{T:d,U:f}=jt(s,u),p=Math.atan2(_t(u,vt(d[l],f[l])),_t(u,f[l]));return Mt(e,s,c,r.sides,o.STEM,i,u,(e,t)=>1-r.groove*(1-xt(1-a,1,e/l))*Math.max(0,Math.cos(t-p))**3)}var Rt=(e,t,n)=>{let r=(n-e)/(t-e);return r<=0||r>=1?0:6*r*(1-r)/(t-e)};function zt(e){let t=t=>1.6*e.arch*Math.max(t,0)**.6+e.droop*Rt(.7,1,t),n=new Float64Array(513),r=new Float64Array(513);for(let e=1;e<=512;e++){let i=(e-.5)/512,a=i*i*(2-i)*t(i)/512;n[e]=n[e-1]+Math.cos(d*i)*a,r[e]=r[e-1]+Math.sin(d*i)*a}let i=(e,t)=>{let n=Math.min(Math.max(t,0),1)*512,r=Math.min(Math.floor(n),511);return e[r]+(e[r+1]-e[r])*(n-r)};return{turn:t,Kc:e=>i(n,e),Ks:e=>i(r,e)}}function Bt(e,t){let n=e.frame(t),r=Q(n.T),i=Ct(n.N,r);return[r,vt(i,r),i]}function Vt(e,t,n,r,i,a,o,s,c,d){let f=c.segs,p=0;for(let e=1;e<=f;e++)p+=Z(Y(c.pts[e],c.pts[e-1]));let m=Q(Y(c.pts[f],c.pts[f-1])),h=i.frame(0).N,g=i.L,_=Ct(h,m),v=vt(m,_),y=[0];for(let e=1;e<=f;e++)y.push(y[e-1]+Z(Y(c.pts[e],c.pts[e-1])));let b=e=>{let t=Q(Y(c.pts[Math.min(e+1,f)],c.pts[Math.max(e-1,0)])),n=y[e]/y[f],r=n*(4-3*n);return[X(t,_t(t,_)*r),X(t,_t(t,v)*r)]},x=[[0,0,0]],S=[[0,0,0]];for(let e=1;e<=f;e++){let[t,n]=b(e-1),[r,i]=b(e),a=.5*(y[e]-y[e-1])/y[f];x.push(J(x[e-1],X(J(t,r),a))),S.push(J(S[e-1],X(J(n,i),a)))}let C=e=>{let t=1;for(;t<f&&y[t]/y[f]<e;)t++;let n=Math.min(Math.max((e*y[f]-y[t-1])/(y[t]-y[t-1]),0),1);return[...yt(x[t-1],x[t],n),0,...yt(S[t-1],S[t],n),0]};if(l(n,r*40,{...d,foot:c.pts[0],base:c.pts[f],S:m,P:_,Ls:p,Lb:g,tip:i.at(1,0),dir:i.b.dir,jP:x[f],jQ:S[f]}),d.with!==void 0)for(let e of[16,17])n[r*40+e]=n[d.with*40+e];let w=p/(p+g),T=zt(i.b),E=(n,a)=>{let[o,s,c]=Bt(i,a),l=Y([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],i.frame(a).c);t[n]=[r,w+(1-w)*a,a,_t(l,s),...u(o,s,c),T.turn(a)/g,T.Kc(a),T.Ks(a),_t(l,c),0,0,0,0,0,0,0,0]};for(let[e,t]of a)E(e,t);let D=[0];for(let e=1;e<=o.segs;e++)D.push(D[e-1]+Z(Y(o.pts[e],o.pts[e-1])));s.rings.forEach((n,i)=>{let a=typeof n==`number`?[n]:n;if(i<=o.segs){let n=s.T[i],c=Ct(s.U[i],n),l=u(n,c,vt(n,c)),d=o.pts[i],f=C(D[i]/D[o.segs]);for(let n of a)t[n]=[r,D[i]/D[o.segs]*w,-1,0,...l,...Y([e.p[n*3],e.p[n*3+1],e.p[n*3+2]],d),0,...f];return}let c=(i-o.segs)/o.n*o.midrib;for(let e of a)E(e,c)})}function Ht(e,t,n){let r=new Float32Array(e*20);for(let n=0;n<e;n++)t[n]?r.set(t[n],n*20):(r[n*20]=-1,r[n*20+7]=1);return{vertex:r,leaves:n}}var $=(e,t,n)=>Math.max(n,Math.round(e*t)),Ut=(e,t,n)=>Math.max(n,2*Math.round(e*t/2));function Wt(e,t=i-.01){if(Z(e)<=t)return e;let n=Math.hypot(e[0],e[2]),r=Math.sqrt(Math.max(t*t-e[1]*e[1],0));return[e[0]*r/n,e[1],e[2]*r/n]}function Gt(e,t,n,r,i,a,l,u,d){let f=c-.9*a,p=Q(vt(n,St)),m=.3*(u()-.5),h=(e,r,i=0)=>[t[0]+n[0]*e+p[0]*i,r,t[2]+n[2]*e+p[2]*i],g=[t,h(.9*r,f+.7*a),h(r+.5*i,f,m*i),h(r+i,f,1.6*m*i),h(r+i+.012,f-.03,2*m*i),h(r+i+.018,f-.07,2.2*m*i)],_=$(5,d,2),v=Pt(g,_).map((e,t)=>{let n=t*5/_,r=n>6?.0025:0;return Wt(J(e,[r*s(n*.35,l,1.1),.4*r*s(n*.35,l,4.2),r*s(n*.35,l,7.3)]))});Mt(e,v,v.map((e,t)=>t===v.length-1?0:a*(1.1-.65*(t/v.length))),$(6,d,4),o.ROOT,l,St)}var Kt=[{r:.1,pts:[[-.52,-.65,-.045],[-.5,-.55,-.055],[-.45,-.474,-.064],[-.38,-.418,-.076],[-.3,-.381,-.086],[-.21,-.358,-.113],[-.125,-.325,-.133],[-.034,-.29,-.144],[.06,-.273,-.152],[.16,-.273,-.159],[.25,-.299,-.164],[.33,-.342,-.158],[.39,-.403,-.147],[.44,-.47,-.136],[.48,-.55,-.131],[.5,-.65,-.138]]},{r:.085,pts:[[.15,-.27,-.165],[.2,-.13,-.245],[.228,-.04,-.254]]},{r:.095,pts:[[-.42,-.441,-.073],[-.4,-.501,-.004],[-.37,-.56,.058],[-.35,-.64,.108]]}],qt=[{c:[-.4,.32],w:.24,h:.15,d:.19},{c:[.17,.24],w:.17,h:.1,d:.14},{c:[.4,.1],w:.15,h:.09,d:.12},{c:[.62,.12],w:.09,h:.05,d:.08}],Jt={lo:[-.35,-.15,-.2],hi:[.35,.6,.6]},Yt=(e,t,n)=>{let r=n[0]-t[0],i=n[1]-t[1],a=n[2]-t[2],o=e[0]-t[0],s=e[1]-t[1],c=e[2]-t[2],l=Math.min(Math.max((o*r+s*i+c*a)/(r*r+i*i+a*a),0),1);return Math.hypot(o-r*l,s-i*l,c-a*l)};function Xt(e,t){let n=0;for(let r of Kt)for(let i=0;i+1<r.pts.length;i++)n=Math.max(n,r.r+t-Yt(e,r.pts[i],r.pts[i+1]));for(let r of qt){let i=r.h/.65,a=Z([(e[0]-r.c[0])/(.5*r.w+t),(e[1]-(c+r.h-.5*i))/(.5*i+t),(e[2]-r.c[1])/(.5*r.d+t)]);a<1&&(n=Math.max(n,(1-a)*.5*r.h))}let r=Math.min(...[0,1,2].map(t=>Math.min(e[t]-Jt.lo[t],Jt.hi[t]-e[t])));return Math.max(n,r-.015)}function Zt(e,t,n){let r=0;for(let a=0;a<=12;a++){let o=a/12;for(let a of[-1,-.5,0,.5,1]){let s=e.at(o,a*e.half(o,a>=0));if(s[1]>-.62&&(r=Math.max(r,Z(s)-(i-.012))),r=Math.max(r,Xt(s,t)),n)for(let e=0;e<3;e++)r=Math.max(r,n.lo[e]-s[e],s[e]-n.hi[e])}}return r}var Qt=class{constructor(e){this.cell=e,this.map=new Map}key(e,t,n){return((e+512)*1024+(t+512))*1024+(n+512)}add(e,t){let n=this.cell,r=this.key(Math.floor(e[0]/n),Math.floor(e[1]/n),Math.floor(e[2]/n));this.map.has(r)||this.map.set(r,[]),this.map.get(r).push({p:e,blade:t})}near(e,t,n){let r=this.cell,i=Math.floor(e[0]/r),a=Math.floor(e[1]/r),o=Math.floor(e[2]/r),s=0;for(let r=-1;r<=1;r++)for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++)for(let u of this.map.get(this.key(i+r,a+c,o+l))??[]){let r=u.blade?t:n,i=u.p[0]-e[0],a=u.p[1]-e[1],o=u.p[2]-e[2];i*i+a*a+o*o<(r-s)*(r-s)&&r>s&&(s=r-Math.sqrt(i*i+a*a+o*o))}return s}};function $t(e,t,n){let r=[];for(let i=0;i<=t;i++){let a=(i/t)**1.25;for(let t=0;t<=n;t++){let i=-1+2*t/n;r.push(e.at(a,i*e.half(a,i>=0)))}}return r}function en(e,t,n){let r=e=>{let t=kt(e.b),r=Zt(t,n.margin,n.bounds),i=Ft(t,e.from,e.rise,12,0);for(let e of i.slice(4))r=Math.max(r,Xt(e,.01));if(n.crowd){for(let e of $t(t,n.samples[0],n.samples[1]))r=Math.max(r,n.crowd.near(e,n.gap,n.stalkGap));for(let e of i.slice(3))r=Math.max(r,n.crowd.near(e,n.stalkGap,0))}return{shape:t,w:r}},i=t[0].slice(1).map(()=>0),a={leaf:e(i),q:i};a.s=r(a.leaf);let o=a;for(let n=0,i=0;n<24&&o.s.w>0&&i<4;n++){let n=null;for(let i of t){let t=a.q.map((e,t)=>e+i[t]),o=e(t),s=r(o),c=s.w+i[i.length-1];(!n||c<n.cost)&&(n={cost:c,q:t,leaf:o,s})}a=n,a.s.w<o.s.w-1e-5?(o=a,i=0):i++}if(o.s.w>0&&n.wide){let t=null;for(let i of n.wide){let n=o.q.map((e,t)=>e+i[t]),a=e(n),s=r(a),c=s.w+i[i.length-1];s.w<o.s.w&&(!t||c<t.cost)&&(t={cost:c,q:n,leaf:a,s})}t&&(o=t)}if(o.s.w>0&&n.wider){let t=o,i=null;for(let a of n.wider){let n=t.q.map((e,t)=>e+a[t]),o=e(n),s=r(o),c=3*s.w+a[a.length-1];if(s.w<t.s.w&&(!i||c<i.cost)&&(i={cost:c,q:n,leaf:o,s}),s.w<=0)break}i&&(o=i)}return{leaf:o.leaf,shape:o.s.shape}}function tn(e,t,n,r){for(let n of $t(t,r[0],r[1]))e.add(n,!0);for(let t of n)e.add(t,!1)}function nn(e,t,n,r,i){let a=new Float64Array(n.length*8);n.forEach((e,t)=>a.set([...e.c,...e.n??[0,0,0],e.a,e.owner],t*8));for(let n=0;n<e.vertexCount;n++){let o=e.p[n*3],s=e.p[n*3+1],l=e.p[n*3+2],u=t[n],d=0;for(let e=0;e<a.length;e+=8){if(a[e+7]===u)continue;let t=a[e]-o,n=a[e+1]-s,r=a[e+2]-l,i=t*t+n*n+r*r;if(i<25e-6)continue;let c=Math.sqrt(i),f=n/c;if(f<=-.1)continue;let p=a[e+3]||a[e+4]||a[e+5]?Math.abs(a[e+3]*t+a[e+4]*n+a[e+5]*r)/c:.5;d+=a[e+6]*(f+.1)*p*xt(.005,.015,c)/(Math.PI*i+a[e+6])}let f=xt(-.01,r,s-c);e.a[n*4+3]=Math.max(Math.exp(-i*d),.35)*(.75+.25*f)}}function rn(e,t,n){for(let r=0;r<8;r++)for(let i=0;i<4;i++){let a=(r+.5)/8,o=-1+(2*i+1)/4,s=e.half(a,o>=0);n.push({c:e.at(a,o*s),n:e.frame(a).N,a:e.L/8*(2*s/4),owner:t})}}function an(e,t,n,r){for(let i=3;i<e.length;i+=3)r.push({c:e[i],n:null,a:2*t*Z(Y(e[i],e[i-3])),owner:n})}var on=(e,t,n,r)=>{for(let i=n;i<e.vertexCount;i++)t[i]=r},sn=[.5,c,-.32],cn={lo:[.06,-.7,-.64],hi:[.92,.2,.24]},ln=[{top:[.42,-.06,-.46],dir:[-.66,.6,.25],length:.44,ratio:.5,arch:.85,at:.24,toward:1},{top:[.64,-.1,-.3],dir:[.4,.75,.3],length:.41,ratio:.48,arch:.8,at:.74,toward:.8},{top:[.47,-.2,-.15],dir:[-.75,.1,.65],length:.36,ratio:.5,arch:.6,at:.47,toward:.9},{top:[.36,-.14,-.5],dir:[-.6,.7,-.1],length:.34,ratio:.47,arch:.7,at:.06,toward:.9},{top:[.56,-.17,-.22],dir:[.55,.55,.6],length:.31,ratio:.5,arch:.75,at:.53,toward:.9},{top:[.67,-.26,-.43],dir:[.1,.8,-.4],length:.32,ratio:.48,arch:.6,at:.82,toward:.6},{top:[.64,-.32,-.13],dir:[.75,.3,.55],length:.29,ratio:.51,arch:.6,at:.66,toward:.9},{top:[.4,-.2,-.43],dir:[-.85,.35,-.05],length:.28,ratio:.49,arch:.6,at:.15,toward:1,with:3},{top:[.72,-.4,-.26],dir:[.45,.75,.4],length:.24,ratio:.5,arch:.6,at:.92,toward:.5},{top:[.575,-.38,-.345],dir:[.05,.97,.1],length:.16,ratio:.42,arch:.15,at:.58,furl:.6,toward:.5},{top:[.47,-.48,-.3],dir:[-.1,.95,.12],length:.1,ratio:.4,arch:.08,at:.37,furl:.8,toward:.5}];function un(e,t,n){let r=bt(e,St,t),i=vt(r,St);return Z(i)<.001?r:Q(bt(r,Q(i),Math.min(n,Math.acos(Math.min(r[1],1))-.05)))}function dn(e,t,r){let i=new n(`plantTall`),a=[],l=[],u=[],d=[],f=new Float32Array(ln.length*40),p=[.4,c+.004,-.285],m=[.6,c+.004,-.36],h=.024,g=.016,_=e=>J(yt(p,m,e),[0,.006*Math.sin(Math.PI*e),.008*Math.sin(2*Math.PI*e)]);{let e=[0];for(let t=1;t<=400;t++)e.push(e[t-1]+Z(Y(_(t/400),_((t-1)/400))));let t=e[400],n=t=>{let n=1;for(;n<400&&e[n]<t;)n++;return(n-1+(t-e[n-1])/(e[n]-e[n-1]))/400},c=(e,n)=>{let r=[];for(let e=0;e<n;e++)r.push(h*(1-Math.cos(e/n*.5*Math.PI)));for(let n=Math.ceil(h/(g/e));n*g/e<t-h-.001;n++)r.push(n*g/e);for(let e=n;e>=0;e--)r.push(t-h*(1-Math.cos(e/n*.5*Math.PI)));return r},u=c($(5,r,2),$(8,r,3)),d=[],f=[];u.forEach((e,r)=>{let i=Math.min(e,t-e),a=i<h?Math.sqrt(Math.max(1-((h-i)/h)**2,0)):1;d.push(_(n(e))),f.push(r===0||r===u.length-1?0:h*a*(1+.08*s(e*40,1.3,2.9)))});let p=(e,t)=>{let n=u[e],r=Math.round(n/g)%2?1:-1;return 1-.16*(.5+.5*Math.cos(2*Math.PI*n/g))**10*(.3+.7*(.5+.5*Math.cos(t-r*1.1))**1.5)};Mt(i,d,f,$(18,r,8),o.ROOT,0,St,(e,t)=>p(e,t)*(1+.04*s(u[e]*14,.7*Math.cos(t)+2.3,.7*Math.sin(t)+7.1))),on(i,a,0,900),an(c(5,8).map(e=>_(n(e))),h,900,l)}let v=Q(Y(m,p)),y=Q(vt(St,v));for(let e=0;e<4;e++){let n=i.vertexCount,o=.1+.8*e/3+.05*(t()-.5),s=Q(J(X(y,.6+.4*t()),X(v,1.2*(t()-.5)+(e===0?-1:+(e===3)))));Gt(i,_(o),s,h,.015+.02*t(),.0045+.0015*t(),2+e,t,r),on(i,a,n,901+e)}let b=new Qt(.03),x=[18,7],S=[[.1,0,0,0],[-.1,0,0,0],[.3,0,0,.004],[-.3,0,0,.004],[0,.07,0,4e-4],[0,-.07,0,4e-4],[0,0,.05,.003]];ln.forEach((t,n)=>{let s=!!t.furl,c=Q([t.top[0]-sn[0],0,t.top[2]-sn[2]]),p=_(t.at),m=Q(J(St,X(Q([t.top[0]-p[0],0,t.top[2]-p[2]]),.4+.7*e()))),h=Array.from({length:12},e),{leaf:g,shape:v}=en(([e,r,i])=>{let a=un(Q(t.dir),e,r),o=bt(Ct(J(J(St,[0,0,t.toward]),X(c,.3)),a),a,.4*(h[0]-.5));return{from:p,rise:m,b:{base:t.top,dir:a,face:o,length:t.length*Math.exp(-i),ratio:t.ratio,arch:t.arch*(.9+.2*h[1]),droop:s?0:.15+.15*h[2],side:.12*(h[3]-.5),twist:.35*(h[4]-.5),cup:s?.05:.14+.1*h[5],fold:.06+.04*h[6],quilt:s?0:6e-4+3e-4*h[7],wave:s?.02:.05+.04*h[8],waves:2.5+1.5*h[9],phase:6.28*h[10],asym:.08*(h[11]-.5),furl:t.furl??0,veins:13,id:n}}},S,{margin:.02,bounds:cn,crowd:b,gap:.02,stalkGap:.015,samples:x}),y=i.vertexCount,C=At(i,v,$(s?36:90,r,8),Ut(s?20:22,r,6),o.LEAF_BIG);on(i,a,y,n),rn(v,n,l);let w=i.vertexCount,T=Math.max(14,Math.round(Z(Y(t.top,p))/.012)),E={rBase:s?.0072:.0085,rTop:s?.0055:.0062,segs:T,midrib:s?.4:.6,midribSegs:s?10:20,sheath:.6,sheathLen:.045},D=It(v,g.from,m,E,n),O=r===1?D:It(v,g.from,m,{...E,segs:$(T,r,4),midribSegs:$(E.midribSegs,r,3)},n),k=Lt(i,v,O,{sides:$(8,r,4),groove:.2},n,3/T);on(i,a,w,1e3+n),Vt(i,d,f,n,v,C,O,k,D,{crown:sn,plant:`tall`,young:s,with:t.with});let A=D.pts;if(an(A.slice(0,T+1),.007,1e3+n,l),tn(b,v,A,x),s)u.push({a:A[Math.round(T*.3)],b:v.at(1,0),r:.03,solid:.015});else{let e=A[Math.round(T*.6)];u.push({a:A[Math.round(T*.25)],b:e,r:.035,solid:.02},{a:e,b:t.top,r:.035,solid:.02}),u.push({a:v.at(.12,0),b:v.at(.8,0),r:.85*v.H+.02,solid:0})}}),u.push({a:sn,b:J(sn,[0,.14,0]),r:.07,solid:.03}),nn(i,a,l,.2,1.6);let C=i.finish();return C.motion=Ht(i.vertexCount,d,f),{mesh:C,obstacles:u}}var fn=[-.6,c,.06],pn={5:3,10:9,11:8,12:9,14:9,18:16},mn={lo:[-.88,c+.012,-.22],hi:[-.3,-.2,.4]};function hn(e,t){let r=new n(`plantSmall`),i=[],a=[],c=[],l=[],u=new Float32Array(800);{let e=[],n=[],a=$(20,t,6);for(let t=0;t<=a;t++){let r=t/a;e.push(J(fn,[.002*Math.sin(3*r),-.03+.062*r,0]));let i=xt(.72,1,r);n.push(t===a?0:.0145*(1-.25*r)*Math.sqrt(Math.max(1-i*i,0))*(1+.06*s(r*5,3.3,1)))}Mt(r,e,n,$(16,t,8),o.ROOT,1,[1,0,0]),on(r,i,0,900)}for(let n=0;n<3;n++){let a=r.vertexCount,o=1.6+n/2*2.4+.3*(e()-.5);Gt(r,J(fn,[0,.004,0]),[Math.cos(o),0,Math.sin(o)],.012,.015+.035*e(),.0024+8e-4*e(),10+n,e,t),on(r,i,a,901+n)}let d=[],f=Math.PI/180,p=new Qt(.012),m=[18,7],h=[[.12,0,0,0,0],[-.12,0,0,0,0],[.3,0,0,0,.001],[-.3,0,0,0,.001],[0,.06,0,0,5e-4],[0,-.06,0,0,5e-4],[0,0,.05,0,.002],[0,0,0,.25,5e-4],[0,0,0,-.25,5e-4]],g=[],_=[];for(let e=-3;e<=3;e++)for(let t of[-.15,0,.15])for(let n of[-.4,0,.4])g.push([.15*e,t,0,n,.004*Math.abs(.15*e)+.006*Math.abs(t)+.003*Math.abs(n)]);for(let e=-4;e<=4;e++)for(let t of[-.45,-.15,.15])for(let n of[-.4,0,.4])for(let r of[0,.15,.3])_.push([.3*e,t,r,n,.004*Math.abs(.3*e)+.006*Math.abs(t)+.003*Math.abs(n)+.003*r]);_.sort((e,t)=>e[4]-t[4]);for(let n=0;n<20;n++){let s=19-n,c=1-s/19,v=2.6+2.6*(s*.618034%1-.5)*(1.4-.6*c)+.25*(e()-.5),y=(84-34*c+6*(e()-.5))*f,b=y-(4+18*c*(.6+.4*e()))*f,x=Math.min(.14,(.063+.077*(1-c))*(.85+.3*e())),S=Math.min(.27,(.17+.085*c)*(.9+.2*e())),C=Array.from({length:12},e),{leaf:w,shape:T}=en(([e,t,n,r])=>{let i=Math.min(Math.max(v+e,1.25-.6*(1-c)),4.3+.4*(1-c)),a=Math.min(y+t,1.48),o=Math.min(b+1.3*t,1.4),l=[Math.cos(i),0,Math.sin(i)],u=J(fn,J(X(l,.008+.007*c),[0,.006+.022*(1-c),0])),d=J(u,X(J(X(l,Math.cos(a)),[0,Math.sin(a),0]),x*Math.exp(-n))),f=Q(J(X(l,Math.cos(o)),[0,Math.sin(o),0]));return{az:i,from:J(u,J(X(l,-.008),[0,-.012,0])),rise:Q(J(St,X(l,.2+.8*c))),b:{base:d,dir:f,face:bt(Ct(J(J(St,X(l,-.15)),[0,0,.3]),f),f,.5*(C[0]-.5)+r),length:S*Math.exp(-n),ratio:.33+.12*c+.1*C[1],arch:.35+.4*c+.15*C[2],droop:.1+.15*C[3],side:.2*(C[4]-.5),twist:.5*(C[5]-.5),cup:.12+.12*C[6],fold:.05+.05*C[7],quilt:8e-4,wave:.07+.07*C[8],waves:2+2*C[9],phase:6.28*C[10],asym:.1*(C[11]-.5),furl:0,veins:9,id:s,small:!0}}},h,{margin:.012,bounds:mn,crowd:p,gap:.009,stalkGap:.007,samples:m,wide:g,wider:c>.9?_:null}),E=r.vertexCount,D=At(r,T,$(24,Math.sqrt(t),12),Ut(12,t,6),o.LEAF_SMALL);on(r,i,E,s),rn(T,s,a);let O=r.vertexCount,k=Math.max(8,Math.round(Z(Y(w.b.base,w.from))/.008)),A={rBase:.0026+9e-4*c,rTop:.0021+6e-4*c,segs:k,midrib:.5,midribSegs:8,sheath:.3,sheathLen:.02},j=It(T,w.from,w.rise,A,11+s),M=t===1?j:It(T,w.from,w.rise,{...A,segs:$(k,t,4),midribSegs:$(8,t,3)},11+s),N=Lt(r,T,M,{sides:$(8,t,4),groove:.2},11+s,3/k);on(r,i,O,1e3+s),Vt(r,l,u,n,T,D,M,N,j,{crown:fn,plant:`small`,young:!1,with:pn[n]}),an(j.pts.slice(0,k+1),.003,1e3+s,a),tn(p,T,j.pts,m),d.push({tip:T.at(.85,0),pts:$t(T,6,2)})}c.push({a:fn,b:J(fn,[0,.07,0]),r:.08,solid:.02});let v=J(fn,[0,.035,0]);for(let e=0;e<4;e++){let t=d.filter(t=>Math.floor((Math.atan2(t.tip[2]-v[2],t.tip[0]-v[0])+Math.PI)/(Math.PI/2))%4===e);if(!t.length)continue;let n=yt(v,X(t.reduce((e,t)=>J(e,t.tip),[0,0,0]),1/t.length),.85),r=t.flatMap(e=>e.pts.map(e=>Yt(e,v,n))).sort((e,t)=>e-t);c.push({a:v,b:n,r:Math.min(Math.max(r[Math.floor(.9*(r.length-1))],.03),.12),solid:0})}nn(r,i,a,.12,.9);let y=r.finish();return y.motion=Ht(r.vertexCount,l,u),{mesh:y,obstacles:c}}function gn(e={detail:1}){let n=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1,r=dn(t(1511863939),t(4127),n),i=hn(t(5227),n);return{meshes:[r.mesh,i.mesh],obstacles:[...r.obstacles,...i.obstacles]}}var _n=(e,t)=>`${t.lengths?`
fn scape_${e}_length(id: i32) -> f32 {
  var l = array<f32, ${t.lengths.length}>(${t.lengths.map(e=>e.toFixed(3)).join(`, `)});
  return l[clamp(id, 0i, ${t.lengths.length-1}i)];
}
`:``}
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
  // Where on the blade (world units along and across it, and a plane of its own).
  let len = ${t.lengths?`scape_${e}_length(id)`:t.length.toFixed(3)};
  let ch = vec3f(u * len, v * hw * ${(t.ratio/2).toFixed(3)} * len, f32(id) * 0.37 + ${(t.salt*5.1).toFixed(1)});
  // The midrib: drawn no narrower than about a pixel, fainter by as much, so it stays on the midrib.
  let midW = 0.005 + 0.009 * (1.0 - u);
  let midPx = max(midW, 0.9 / px);
  let midrib = (midW / midPx) * (1.0 - smoothstep(0.45 * midPx, midPx, x));
  // Lateral veins, out from the midrib and forwards along the margin (where the mesh is quilted).
  let left = select(0.0, 1.0, v < 0.0);
  let ph = ${t.veins.toFixed(1)} * (u - ${Dt} * pow(av, 1.2) * hw) + 0.5 * left + 0.2 * sin(9.0 * u + 2.3 * attrs.z + 1.7 * left) * min(2.0 * av, 1.0);
  let dv = abs(fract(ph + 0.5) - 0.5);
  var lateral = (1.0 - smoothstep(0.025, 0.08, dv)) * smoothstep(0.03, 0.14, av) * (1.0 - smoothstep(0.8, 0.97, av)) * smoothstep(0.02, 0.1, u);
  lateral = mix(0.08, lateral, smoothstep(1.0, 2.5, 0.1 * px / ${t.veins.toFixed(1)}));
  // The fine net of veinlets between them (its cells warped, so the areoles are irregular).
  let q = ch * ${t.net.toFixed(1)};
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
  c *= 0.9 + 0.2 * scape_fbm3(ch * 35.0 + rnd * 10.0, 2);
  c = mix(c, pale, 0.7 * vein);
  c = mix(c, pale, 0.15 * net * (1.0 - vein));
  let young = id >= ${t.young};
  if (young) { c = mix(c, scape_linear(vec3f(0.58, 0.76, 0.2)), 0.55); }
  var rough = ${t.rough.toFixed(2)} + 0.06 * scape_noise3(ch * 20.0);
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
  // Fine relief: the blade's cells, faded below a few pixels (their slopes taken in its chart and
  // laid square to the normal).
  let k = ${t.bump.toFixed(1)};
  let e = 0.35 / k;
  let b0 = scape_noise3(ch * k);
  let g = vec3f(scape_noise3((ch + vec3f(e, 0.0, 0.0)) * k) - b0, scape_noise3((ch + vec3f(0.0, e, 0.0)) * k) - b0,
    scape_noise3((ch + vec3f(0.0, 0.0, e)) * k) - b0) / (e * k);
  let relief = 0.04 * smoothstep(2.0, 6.0, 1.0 / (k * max(foot, 1e-6)));
  let nn = normalize(n - (g - n * dot(n, g)) * relief);
  let ao = attrs.w * (1.0 - select(0.0, 0.2 * midrib, front));
  return ScapeMat(c, nn, rough, spec, trans, ao);
}
`,vn=[_n(`leafBig`,{salt:3,length:.34,lengths:ln.map(e=>e.length),ratio:.46,veins:13,young:9,tint:`0.35, 0.62, 0.12`,net:280,bump:110,rough:.36}),_n(`leafSmall`,{salt:5,length:.19,ratio:.44,veins:9,young:99,tint:`0.38, 0.66, 0.13`,net:420,bump:180,rough:.4,small:!0}),`
fn scape_mat_stem(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let s = attrs.x;
  let id = i32(round(attrs.z));
  let rnd = scape_hash3i(vec3i(id, 7, 3));
  var c = scape_linear(vec3f(0.5, 0.7, 0.27)) * (0.9 + 0.2 * rnd.y);
  // Its sheathing foot: browner, darker (a short way up the small plant's short stems, ids 11 on).
  c = mix(scape_linear(vec3f(0.36, 0.38, 0.17)), c, smoothstep(0.0, select(0.05, 0.015, id >= 11), s));
  // Fine ridges along it (faded below a few pixels), and faint flecks: on its own chart (along it,
  // and round it), so they stay on it as it moves.
  let ch = vec3f(s + f32(id) * 1.37, 0.006 * cos(attrs.y), 0.006 * sin(attrs.y));
  var stria = 0.5 + 0.5 * sin(attrs.y * 9.0 + 3.0 * scape_noise3(ch * 40.0));
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
`].join(``),yn=[[`wood`,ee],[`rocks`,Be],[`plants`,gt]];function bn(e={detail:1}){let t=Number.isFinite(e?.detail)?Math.min(Math.max(e.detail,.25),2):1;return yn.map(([e,n])=>({name:e,...n.build({detail:t})}))}var xn=yn.map(([,e])=>e.WGSL);export{P as i,bn as n,k as r,xn as t};
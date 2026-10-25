import{r as e,t}from"./index-krQ4Is6v.js";import{a as n,c as r,r as i,s as a}from"./plantMotion-i-CLnyuy.js";import{n as o,r as s}from"./scene-CyuCVlrR.js";var c=.014,l=.06,u=.005;function d(n,r,i,a){let o=new Float32Array(r*r).fill(a),s=new Float32Array(r*r).fill(a),d=new Float32Array(r*r).fill(1/0),f=2*i/r,p=e=>(e+i)/f-.5,m=(e,t,n,i,a)=>{let o=p(e[t]),s=p(e[t+2]),c=p(e[n]),l=p(e[n+2]),u=p(e[i]),d=p(e[i+2]),f=(l-d)*(o-u)+(u-c)*(s-d);if(Math.abs(f)<1e-12){for(let[f,p,m]of[[o,s,e[t+1]],[c,l,e[n+1]],[u,d,e[i+1]]]){let e=Math.round(f),t=Math.round(p);e>=0&&t>=0&&e<r&&t<r&&a(e+r*t,m)}return}let m=Math.max(0,Math.ceil(Math.min(o,c,u))),h=Math.min(r-1,Math.floor(Math.max(o,c,u))),g=Math.max(0,Math.ceil(Math.min(s,l,d))),_=Math.min(r-1,Math.floor(Math.max(s,l,d)));for(let p=g;p<=_;p++)for(let g=m;g<=h;g++){let m=((l-d)*(g-u)+(u-c)*(p-d))/f,h=((d-s)*(g-u)+(o-u)*(p-d))/f,_=1-m-h;m<-1e-6||h<-1e-6||_<-1e-6||a(g+r*p,m*e[t+1]+h*e[n+1]+_*e[i+1])}};for(let r of n){let n=r.positions,i=r.indices;for(let a=0;a<i.length/3;a++){let u=r.materials[a],f=i[a*3]*3,p=i[a*3+1]*3,h=i[a*3+2]*3;if(u===e.ROCK)m(n,f,p,h,(e,t)=>{t-c>o[e]&&(o[e]=t-c)});else if(u===e.BARK||u===e.WOOD_END){let e=Math.max(n[f+1],n[p+1],n[h+1])<=t+l;m(n,f,p,h,(t,n)=>{n<d[t]&&(d[t]=n),e&&n-c>s[t]&&(s[t]=n-c)})}}}let h=o;for(let e=0;e<r*r;e++)d[e]<=-.6+u&&s[e]>h[e]&&(h[e]=s[e]);return h}var f=28,p=Math.fround,m=new Float32Array(1),h=new Uint32Array(m.buffer),g=e=>(m[0]=e,h[0]);function _(e,t,n=e=>!!e.motion,i={}){let o=e.data;if(o[12]!==2)throw Error(`refitPlan: the BVH is not in the shader's layout (packScape layout "stack")`);let s=o[0],c=o[1],l=o[2],u=o[7],d=o[11],p=o[3];if(l===0||p<0||s===0)throw Error(`refitPlan: the tree has no internal node to refit`);let m=new Float32Array(d*4),h=new Int32Array(d).fill(-1),_=[],v=0,y=0,b=0;if(t.forEach((e,t)=>{let r=e.positions.length/3;for(let t=0;t<r;t++)m.set([e.positions[t*3],e.positions[t*3+1],e.positions[t*3+2],0],(v+t)*4);if(n(e,t)&&e.motion){let n=e.motion.leaves.length/40;_.push({mesh:t,first:y,count:n,vo:v});for(let t=0;t<r;t++)e.motion.vertex[t*20]>=0&&(h[v+t]=b++);y+=n}v+=r}),v!==d)throw Error(`refitPlan: the meshes have ${v} vertices, the BVH ${d}`);let x=new Float32Array(b*f),S=new Uint32Array(b),C=new Float32Array(b*3),w=new Float32Array(y*40),T=new Float32Array(y*4),E=Array(y).fill(1);_.forEach(({mesh:e,first:n,vo:r})=>{let i=t[e];for(let e=0;e<i.positions.length/3;e++){let t=h[r+e];if(t<0)continue;let a=i.motion.vertex.subarray(e*20,(e+1)*20),o=t*f,s=[i.positions[e*3],i.positions[e*3+1],i.positions[e*3+2]];x.set([...s,r+e],o),x.set([i.normals[e*3],i.normals[e*3+1],i.normals[e*3+2],i.attrs[e*4]],o+4),x.set(a,o+8),x[o+8]=a[0]+n,S[t]=r+e,C.set(s,t*3),a[2]===1&&T.set([...s,i.motion.leaves[a[0]*40+11]],(n+a[0])*4)}});let D=a(i.obstacles??[],C);_.forEach(({mesh:e,first:n})=>{let a=t[e],o=a.motion.leaves;if(i.obstacles){let e=r(a,i.obstacles,{...i,solids:D});o=e.leaves,e.scales.forEach((e,t)=>E[n+t]=e)}w.set(o,n*40)});let O=(e,t)=>o[(c+e*3+t)*4+3],k=new Uint8Array(l),A=0;for(let e=0;e<l;e++){let t=Math.floor(O(e,0)/8),n=O(e,1),r=O(e,2);(h[t]>=0||h[n]>=0||h[r]>=0)&&(k[e]=1,A++)}let j=e=>[o[(4+e*4)*4+3],o[(5+e*4)*4+3]],M=e=>{let t=-e-1;return[Math.floor(t/4),t%4+1]},N=e=>{let[t,n]=M(e);for(let e=t;e<t+n&&e<l;e++)if(k[e])return!0;return!1},P=new Int32Array(s).fill(-1);P[p]=0;for(let e=0;e<s;e++)if(!(P[e]<0))for(let t of j(e))t>=0&&(P[t]=P[e]+1);let F=new Uint8Array(s);for(let e=s-1;e>=0;e--)P[e]<0||(F[e]=+!!j(e).some(e=>e<0?N(e):F[e]===1));let I=[];for(let e=0;e<s;e++)F[e]&&I.push(e);I.sort((e,t)=>P[t]-P[e]||e-t);let L=new Int32Array(s).fill(-1);I.forEach((e,t)=>L[e]=t);let R=new Uint32Array(I.length*12),z=[],B=[];I.forEach((e,t)=>{let n=j(e);R.set([e,g(n[0]),g(n[1]),0],t*12),n.forEach((n,r)=>{let i=t*12+4+r*4;if(n<0&&N(n)){let[e,t]=M(n);R.set([2,z.length/4,t,0],i);for(let n=e;n<e+t;n++)z.push(n,Math.round(O(n,0)),O(n,1),O(n,2))}else if(n>=0&&F[n])R.set([1,L[n],0,0],i);else{let t=(4+e*4+r*2)*4,n=t+4;R.set([0,B.length/8,0,0],i),B.push(o[t],o[t+1],o[t+2],0,o[n],o[n+1],o[n+2],0)}})});let V=[];return I.forEach((e,t)=>{let n=P[e];(!V.length||V[V.length-1].depth!==n)&&V.push({depth:n,first:t,count:0}),V[V.length-1].count++}),B.length||B.push(0,0,0,0,0,0,0,0),{moving:b,verts:x,ids:S,rest:C,solids:D,leaves:w,leafCount:y,leafTips:T,scales:E,meshLeaves:_.map(({mesh:e,first:t,count:n})=>({mesh:e,first:t,count:n})),slots:Uint32Array.from(z),slotCount:z.length/4,touched:A,nodes:R,nodeCount:I.length,statics:Float32Array.from(B),levels:V,dPos:m,triBase:c,vertBase:u,vertexCount:d}}function v(e){let t=new ArrayBuffer(16);new Uint32Array(t).set([e.moving,e.vertBase,0,0]);let n=new ArrayBuffer(16);new Uint32Array(n).set([e.slotCount,e.triBase,0,0]);let r=new ArrayBuffer(Math.max(1,e.levels.length)*256);return e.levels.forEach((t,n)=>new Uint32Array(r,n*256,4).set([t.first,t.count,e.vertBase,e.vertexCount])),{skin:t,tris:n,levels:r}}function y(e,t=0){let n=v(e),r=(e,t,n=e.byteLength)=>({data:e,size:Math.max(32,Math.ceil(n/16)*16),usage:t});return{plantSkinParams:r(new Uint8Array(n.skin),`uniform`),plantTrisParams:r(new Uint8Array(n.tris),`uniform`),plantLevel:r(new Uint8Array(n.levels),`uniform`),plantVerts:r(e.verts,`storage`),plantLeaves:r(e.leaves,`storage`),plantLean:r(null,`storage`,e.leafCount*16),plantPhase:r(i(e.leaves,t),`storage`),plantSlots:r(e.slots,`storage`),plantNodes:r(e.nodes,`storage`),plantStatic:r(e.statics,`storage`),dPos:r(e.dPos,`storage`),nodeBox:r(null,`storage`,e.nodeCount*32)}}p(2e-6),p(1e-6);function b(e){let t=`
fn plant_texel(i: u32) -> vec2i {
  return vec2i(i32(i & 1023u), i32(i >> 10u));
}
`;return{skin:`
// ---- the plants' vertices moved (src/render/scape/scapeRefit.mjs) ------------------------------
struct PlantSkinParams {
  count: u32,
  vertBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantSkinParams: PlantSkinParams;
@group(0) @binding(1) var<storage, read> plantVerts: array<vec4f>;
@group(0) @binding(2) var<storage, read> plantLeaves: array<vec4f>;
@group(0) @binding(3) var<storage, read> plantLean: array<vec4f>;
@group(0) @binding(4) var<storage, read> plantPhase: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> dPos: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${e}
${t}
// One moving vertex: displaced, kept out of the solids, its normal to its texel.
@compute @workgroup_size(64)
fn plantSkin(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantSkinParams.count) { return; }
  let o = i * 7u;
  let r = plantVerts[o];
  let n = plantVerts[o + 1u];
  let m = plant_move(r.xyz, n.xyz, PlantMV(plantVerts[o + 2u], plantVerts[o + 3u], plantVerts[o + 4u], plantVerts[o + 5u], plantVerts[o + 6u]));
  let id = u32(r.w);
  dPos[id] = vec4f(plant_collide(m.p), 0.0);
  textureStore(scapeTex, plant_texel(plantSkinParams.vertBase + id * 2u), vec4f(m.n, n.w));
}
`,tris:`
// ---- the plants' triangles rewritten (src/render/scape/scapeRefit.mjs) -------------------------
struct PlantTrisParams {
  count: u32,
  triBase: u32,
  pad0: u32,
  pad1: u32,
}

@group(0) @binding(0) var<uniform> plantTrisParams: PlantTrisParams;
@group(0) @binding(1) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(2) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(3) var scapeTex: texture_storage_2d<rgba32float, write>;
${t}
// One triangle: its corners from dPos (so corners it shares are bit for bit its neighbours'), their
// words as packed (va * 8 + material, vb, vc).
@compute @workgroup_size(64)
fn plantTris(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantTrisParams.count) { return; }
  let e = plantSlots[i];
  let at = plantTrisParams.triBase + e.x * 3u;
  textureStore(scapeTex, plant_texel(at), vec4f(dPos[e.y >> 3u].xyz, f32(e.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(dPos[e.z].xyz, f32(e.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(dPos[e.w].xyz, f32(e.w)));
}
`,refit:`
// ---- the boxes over the plants refitted, one level of the tree (src/render/scape/scapeRefit.mjs) --
struct PlantLevel {
  first: u32,
  count: u32,
  vertBase: u32,
  vertCount: u32,
}

struct PlantBox {
  lo: vec3f,
  hi: vec3f,
}

@group(0) @binding(0) var<uniform> plantLevel: PlantLevel;
@group(0) @binding(1) var<storage, read> plantNodes: array<vec4u>;
@group(0) @binding(2) var<storage, read> plantSlots: array<vec4u>;
@group(0) @binding(3) var<storage, read> plantStatic: array<vec4f>;
@group(0) @binding(4) var<storage, read> dPos: array<vec4f>;
@group(0) @binding(5) var<storage, read_write> nodeBox: array<vec4f>;
@group(0) @binding(6) var scapeTex: texture_storage_2d<rgba32float, write>;
${t}
// A child's box: a node's refitted a level below, a leaf's from its triangles' corners (padded
// outward a little, as packScape's), or one that does not move, as packed.
fn plant_childBox(c: vec4u) -> PlantBox {
  if (c.x == 1u) {
    return PlantBox(nodeBox[c.y * 2u].xyz, nodeBox[c.y * 2u + 1u].xyz);
  }
  if (c.x == 2u) {
    var lo = vec3f(3.0e38);
    var hi = vec3f(-3.0e38);
    for (var j = 0u; j < c.z; j++) {
      let e = plantSlots[c.y + j];
      let a = dPos[e.y >> 3u].xyz;
      let b = dPos[e.z].xyz;
      let d = dPos[e.w].xyz;
      lo = min(lo, min(a, min(b, d)));
      hi = max(hi, max(a, max(b, d)));
    }
    return PlantBox(lo - (vec3f(2e-6) + 1e-6 * abs(lo)), hi + (vec3f(2e-6) + 1e-6 * abs(hi)));
  }
  return PlantBox(plantStatic[c.y * 2u].xyz, plantStatic[c.y * 2u + 1u].xyz);
}

// One node of the level: its children's boxes into its texels, its own into nodeBox (and the
// header's at the root).
@compute @workgroup_size(64)
fn plantRefit(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x >= plantLevel.count) { return; }
  let r = plantLevel.first + gid.x;
  let h = plantNodes[r * 3u];
  let b0 = plant_childBox(plantNodes[r * 3u + 1u]);
  let b1 = plant_childBox(plantNodes[r * 3u + 2u]);
  let at = 4u + h.x * 4u;
  textureStore(scapeTex, plant_texel(at), vec4f(b0.lo, bitcast<f32>(h.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(b0.hi, bitcast<f32>(h.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(b1.lo, 0.0));
  textureStore(scapeTex, plant_texel(at + 3u), vec4f(b1.hi, 0.0));
  let lo = min(b0.lo, b1.lo);
  let hi = max(b0.hi, b1.hi);
  nodeBox[r * 2u] = vec4f(lo, 0.0);
  nodeBox[r * 2u + 1u] = vec4f(hi, 0.0);
  if (h.x == 0u) {
    textureStore(scapeTex, vec2i(1i, 0i), vec4f(lo, f32(plantLevel.vertBase)));
    textureStore(scapeTex, vec2i(2i, 0i), vec4f(hi, f32(plantLevel.vertCount)));
  }
}
`}}function x(e,t,r,i=1){let a=o({detail:i}),c=a.flatMap(e=>e.meshes),l=a.filter(e=>e.name!==`plants`).flatMap(e=>e.obstacles),u=s(c),f=_(u,c,void 0,{obstacles:l});return{data:u.data,width:u.width,height:u.height,map:d(c,e,t,r),obstacles:a.flatMap(e=>e.obstacles),motion:{wgsl:b(n(l,f.rest)),buffers:y(f),moving:f.moving,slotCount:f.slotCount,levels:f.levels,leafCount:f.leafCount,leaves:f.leaves,leafTips:f.leafTips}}}export{x as buildFurnishings};
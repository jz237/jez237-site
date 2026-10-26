import{a as e,c as t,r as n,s as r}from"./plantMotion-C0EHG4-v.js";import{i,t as a}from"./index-oNZZClff.js";import{t as o}from"./scapeBVH-CDe4UJx9.js";import{n as s}from"./scene-DBUSIYjH.js";var c=.014,l=.06,u=.005,d=.04;function f(e,t,n,r){let o=new Float32Array(t*t).fill(r),s=new Float32Array(t*t).fill(r),f=new Float32Array(t*t).fill(1/0),p=2*n/t,m=e=>(e+n)/p-.5,h=(e,n,r,i,a)=>{let o=m(e[n]),s=m(e[n+2]),c=m(e[r]),l=m(e[r+2]),u=m(e[i]),d=m(e[i+2]),f=(l-d)*(o-u)+(u-c)*(s-d);if(Math.abs(f)<1e-12){for(let[f,p,m]of[[o,s,e[n+1]],[c,l,e[r+1]],[u,d,e[i+1]]]){let e=Math.round(f),n=Math.round(p);e>=0&&n>=0&&e<t&&n<t&&a(e+t*n,m)}return}let p=Math.max(0,Math.ceil(Math.min(o,c,u))),h=Math.min(t-1,Math.floor(Math.max(o,c,u))),g=Math.max(0,Math.ceil(Math.min(s,l,d))),_=Math.min(t-1,Math.floor(Math.max(s,l,d)));for(let m=g;m<=_;m++)for(let g=p;g<=h;g++){let p=((l-d)*(g-u)+(u-c)*(m-d))/f,h=((d-s)*(g-u)+(o-u)*(m-d))/f,_=1-p-h;p<-1e-6||h<-1e-6||_<-1e-6||a(g+t*m,p*e[n+1]+h*e[r+1]+_*e[i+1])}};for(let t of e){let e=t.positions,n=t.indices;for(let r=0;r<n.length/3;r++){let u=t.materials[r],p=n[r*3]*3,m=n[r*3+1]*3,g=n[r*3+2]*3;if(u===i.ROCK||u===i.TUBE&&Math.max(e[p+1],e[m+1],e[g+1])<=-.6+d)h(e,p,m,g,(e,t)=>{t-c>o[e]&&(o[e]=t-c)});else if(u===i.BARK||u===i.WOOD_END){let t=Math.max(e[p+1],e[m+1],e[g+1])<=a+l;h(e,p,m,g,(e,n)=>{n<f[e]&&(f[e]=n),t&&n-c>s[e]&&(s[e]=n-c)})}}}let g=o;for(let e=0;e<t*t;e++)f[e]<=-.6+u&&s[e]>g[e]&&(g[e]=s[e]);return g}var p=28;function m(e){let t=[];return e.forEach((e,n)=>{let r=t.at(-1);e.count>256?t.push({first:n,count:1,wide:!0,groups:Math.ceil(e.count/256)}):r&&!r.wide&&r.count<15?r.count++:t.push({first:n,count:1,wide:!1,groups:1})}),t}var h=Math.fround,g=new Float32Array(1),_=new Uint32Array(g.buffer),v=e=>(g[0]=e,_[0]);function y(e,n,i=e=>!!e.motion,a={}){let o=e.data;if(o[12]!==2)throw Error(`refitPlan: the BVH is not in the shader's layout (packScape layout "stack")`);let s=o[0],c=o[1],l=o[2],u=o[7],d=o[11],f=o[3];if(l===0||f<0||s===0)throw Error(`refitPlan: the tree has no internal node to refit`);let h=new Float32Array(d*4),g=new Int32Array(d).fill(-1),_=[],y=0,b=0,x=0;if(n.forEach((e,t)=>{let n=e.positions.length/3;for(let t=0;t<n;t++)h.set([e.positions[t*3],e.positions[t*3+1],e.positions[t*3+2],0],(y+t)*4);if(i(e,t)&&e.motion){let r=e.motion.leaves.length/40;_.push({mesh:t,first:b,count:r,vo:y});for(let t=0;t<n;t++)e.motion.vertex[t*20]>=0&&(g[y+t]=x++);b+=r}y+=n}),y!==d)throw Error(`refitPlan: the meshes have ${y} vertices, the BVH ${d}`);let S=new Float32Array(x*p),C=new Uint32Array(x),w=new Float32Array(x*3),T=new Float32Array(b*40),E=new Float32Array(b*4),D=Array(b).fill(1);_.forEach(({mesh:e,first:t,vo:r})=>{let i=n[e];for(let e=0;e<i.positions.length/3;e++){let n=g[r+e];if(n<0)continue;let a=i.motion.vertex.subarray(e*20,(e+1)*20),o=n*p,s=[i.positions[e*3],i.positions[e*3+1],i.positions[e*3+2]];S.set([...s,r+e],o),S.set([i.normals[e*3],i.normals[e*3+1],i.normals[e*3+2],i.attrs[e*4]],o+4),S.set(a,o+8),S[o+8]=a[0]+t,C[n]=r+e,w.set(s,n*3),a[2]===1&&E.set([...s,i.motion.leaves[a[0]*40+11]],(t+a[0])*4)}});let O=r(a.obstacles??[],w);_.forEach(({mesh:e,first:r})=>{let i=n[e],o=i.motion.leaves;if(a.obstacles){let e=t(i,a.obstacles,{...a,solids:O});o=e.leaves,e.scales.forEach((e,t)=>D[r+t]=e)}T.set(o,r*40)});let k=(e,t)=>o[(c+e*3+t)*4+3],A=new Uint8Array(l),j=0;for(let e=0;e<l;e++){let t=k(e,0)>>>4,n=k(e,1),r=k(e,2);(g[t]>=0||g[n]>=0||g[r]>=0)&&(A[e]=1,j++)}let M=e=>[o[(4+e*4)*4+3],o[(5+e*4)*4+3]],N=e=>{let t=-e-1;return[Math.floor(t/4),t%4+1]},P=e=>{let[t,n]=N(e);for(let e=t;e<t+n&&e<l;e++)if(A[e])return!0;return!1},F=new Int32Array(s).fill(-1);F[f]=0;for(let e=0;e<s;e++)if(!(F[e]<0))for(let t of M(e))t>=0&&(F[t]=F[e]+1);let I=new Uint8Array(s);for(let e=s-1;e>=0;e--)F[e]<0||(I[e]=+!!M(e).some(e=>e<0?P(e):I[e]===1));let L=[];for(let e=0;e<s;e++)I[e]&&L.push(e);L.sort((e,t)=>F[t]-F[e]||e-t);let R=new Int32Array(s).fill(-1);L.forEach((e,t)=>R[e]=t);let z=new Uint32Array(L.length*12),B=[],V=[];L.forEach((e,t)=>{let n=M(e);z.set([e,v(n[0]),v(n[1]),0],t*12),n.forEach((n,r)=>{let i=t*12+4+r*4;if(n<0&&P(n)){let[e,t]=N(n);z.set([2,B.length/4,t,0],i);for(let n=e;n<e+t;n++)B.push(n,Math.round(k(n,0)),k(n,1),k(n,2))}else if(n>=0&&I[n])z.set([1,R[n],0,0],i);else{let t=(4+e*4+r*2)*4,n=t+4;z.set([0,V.length/8,0,0],i),V.push(o[t],o[t+1],o[t+2],0,o[n],o[n+1],o[n+2],0)}})});let H=[];return L.forEach((e,t)=>{let n=F[e];(!H.length||H[H.length-1].depth!==n)&&H.push({depth:n,first:t,count:0}),H[H.length-1].count++}),V.length||V.push(0,0,0,0,0,0,0,0),{moving:x,verts:S,ids:C,rest:w,solids:O,leaves:T,leafCount:b,leafTips:E,scales:D,meshLeaves:_.map(({mesh:e,first:t,count:n})=>({mesh:e,first:t,count:n})),slots:Uint32Array.from(B),slotCount:B.length/4,touched:j,nodes:z,nodeCount:L.length,statics:Float32Array.from(V),levels:H,passes:m(H),dPos:h,triBase:c,vertBase:u,vertexCount:d}}function b(e){let t=new ArrayBuffer(16);new Uint32Array(t).set([e.moving,e.vertBase,0,0]);let n=new ArrayBuffer(16);new Uint32Array(n).set([e.slotCount,e.triBase,0,0]);let r=new ArrayBuffer(Math.max(1,e.passes.length)*256);return e.passes.forEach((t,n)=>{let i=new Uint32Array(r,n*256,64);i.set([e.vertBase,e.vertexCount,t.count,+!!t.wide]);for(let n=0;n<t.count;n++)i.set([e.levels[t.first+n].first,e.levels[t.first+n].count],4+n*4)}),{skin:t,tris:n,levels:r}}function x(e,t=0){let r=b(e),i=(e,t,n=e.byteLength)=>({data:e,size:Math.max(32,Math.ceil(n/16)*16),usage:t});return{plantSkinParams:i(new Uint8Array(r.skin),`uniform`),plantTrisParams:i(new Uint8Array(r.tris),`uniform`),plantLevel:i(new Uint8Array(r.levels),`uniform`),plantVerts:i(e.verts,`storage`),plantLeaves:i(e.leaves,`storage`),plantLean:i(null,`storage`,e.leafCount*16),plantPhase:i(n(e.leaves,t),`storage`),plantSlots:i(e.slots,`storage`),plantNodes:i(e.nodes,`storage`),plantStatic:i(e.statics,`storage`),dPos:i(e.dPos,`storage`),nodeBox:i(null,`storage`,e.nodeCount*32)}}h(2e-6),h(1e-6);function S(e){let t=`
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
// words as packed (va * 16 + material, vb, vc).
@compute @workgroup_size(64)
fn plantTris(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= plantTrisParams.count) { return; }
  let e = plantSlots[i];
  let at = plantTrisParams.triBase + e.x * 3u;
  textureStore(scapeTex, plant_texel(at), vec4f(dPos[e.y >> 4u].xyz, f32(e.y)));
  textureStore(scapeTex, plant_texel(at + 1u), vec4f(dPos[e.z].xyz, f32(e.z)));
  textureStore(scapeTex, plant_texel(at + 2u), vec4f(dPos[e.w].xyz, f32(e.w)));
}
`,refit:`
// ---- the boxes over the plants refitted, a pass of the tree's levels (src/render/scape/scapeRefit.mjs)
struct PlantPass {
  vertBase: u32,
  vertCount: u32,
  levels: u32,
  wide: u32,
  level: array<vec4u, 15u>,
}

struct PlantBox {
  lo: vec3f,
  hi: vec3f,
}

@group(0) @binding(0) var<uniform> plantLevel: PlantPass;
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
      let a = dPos[e.y >> 4u].xyz;
      let b = dPos[e.z].xyz;
      let d = dPos[e.w].xyz;
      lo = min(lo, min(a, min(b, d)));
      hi = max(hi, max(a, max(b, d)));
    }
    return PlantBox(lo - (vec3f(2e-6) + 1e-6 * abs(lo)), hi + (vec3f(2e-6) + 1e-6 * abs(hi)));
  }
  return PlantBox(plantStatic[c.y * 2u].xyz, plantStatic[c.y * 2u + 1u].xyz);
}

// Record r: its children's boxes into its node's texels, its own into nodeBox (and the header's at
// the root).
fn plant_refitNode(r: u32) {
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

// A pass: a wide level, a node a thread; or a run of narrow ones, this one workgroup's, a level at
// a time, each waiting at the barrier for the last's boxes.
@compute @workgroup_size(256)
fn plantRefit(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32) {
  if (plantLevel.wide == 1u) {
    let l = plantLevel.level[0];
    if (gid.x < l.y) { plant_refitNode(l.x + gid.x); }
    return;
  }
  for (var k = 0u; k < plantLevel.levels; k++) {
    let l = plantLevel.level[k];
    for (var i = li; i < l.y; i += 256u) { plant_refitNode(l.x + i); }
    storageBarrier();
  }
}
`}}function C(e,t,n,r=1){return w(s({detail:r}),e,t,n)}function w(t,n,r,i){let a=t.flatMap(e=>e.meshes),s=t.filter(e=>e.name!==`plants`).flatMap(e=>e.obstacles),c=o(a,{rows:new Float32Array(680)}),l=y(c,a,void 0,{obstacles:s});return{data:c.data,width:c.width,height:c.height,map:f(a,n,r,i),obstacles:t.flatMap(e=>e.obstacles),bubbles:t.find(e=>e.bubbles)?.bubbles??null,parts:a.map(e=>[e.name,e.positions.length/3]),motion:{wgsl:S(e(s,l.rest)),buffers:x(l),moving:l.moving,slotCount:l.slotCount,passes:l.passes,leafCount:l.leafCount,leaves:l.leaves,leafTips:l.leafTips}}}export{C as buildFurnishings,w as furnishingsOf};
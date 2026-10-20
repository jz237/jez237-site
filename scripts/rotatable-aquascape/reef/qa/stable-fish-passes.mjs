import assert from 'node:assert/strict';
import * as T from 'three';
import {stabilizeFishPasses} from '../StableFishPasses.ts';
const scene=new T.Group(),clock={value:3.5};
const source=new T.MeshPhysicalMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,opacity:.57});
source.onBeforeCompile=shader=>{shader.uniforms.clock=clock;};
source.customProgramCacheKey=()=> 'independent-fish-wave';
// A rippled membrane, so some triangles face each side from any viewpoint.
const geometry=new T.PlaneGeometry(2,2,8,8),wave=geometry.getAttribute('position');
for(let i=0;i<wave.count;i++)wave.setZ(i,.45*Math.sin(wave.getX(i)*4.2));geometry.computeVertexNormals();
const a=new T.Mesh(geometry,source),b=new T.Mesh(geometry,source);a.name=b.name='fin';b.position.x=3;scene.add(a,b);scene.updateMatrixWorld(true);
const triangles=geometry.index.count/3,count=wave.count;
const rays=[];
for(const side of [-1,1])for(const x of [-.67,0,.28,3.16])rays.push(new T.Raycaster(new T.Vector3(x,.33,side*2),new T.Vector3(0,0,-side)));
// Reversed winding only reorders barycentric sums: compare to 1e-12.
const round=v=>v.toArray().map(x=>Math.round(x*1e12)/1e12+0);
const hits=(fold=false)=>rays.map(r=>r.intersectObjects([a,b]).map(h=>({point:round(h.point),uv:round(h.uv),face:fold?h.faceIndex%triangles:h.faceIndex,object:h.object.id})));
const expected=hits();
const stats=stabilizeFishPasses(scene);assert.deepEqual(stats,{meshes:2,materials:1,geometries:1});
assert.equal(a.geometry,b.geometry,'animals of one species share the folded buffers');assert.notEqual(a.geometry,geometry);
assert.equal(a.material,b.material);assert.equal(a.material.side,T.FrontSide);assert.equal(a.geometry.groups.length,0,'one draw per fin');
assert.equal(a.material.opacity,.57);assert.equal(a.material.depthWrite,false);assert.equal(a.material.transparent,true);assert.equal(a.material.customProgramCacheKey(),'independent-fish-wave');
{const shader={uniforms:{}};a.material.onBeforeCompile(shader);assert.equal(shader.uniforms.clock,clock);}
// The copy carries every attribute unchanged except its normals, which turn over.
for(const key of Object.keys(geometry.attributes)){const from=geometry.getAttribute(key),to=a.geometry.getAttribute(key);assert.equal(to.count,count*2);
 for(let i=0;i<count;i++)for(let c=0;c<from.itemSize;c++){const value=from.getComponent(i,c);assert.equal(to.getComponent(i+count,c),value);assert.equal(to.getComponent(i,c),key==='normal'?-value:value);}}
assert.deepEqual(a.geometry.boundingSphere,geometry.boundingSphere,'transparent depth sorting is unchanged');
// Under front-face culling, from either side, the one draw rasterizes exactly the
// former BackSide pass and then the former FrontSide pass, each in source order.
const facing=(index,positions,t,eye)=>{const [p,q,r]=[0,1,2].map(k=>new T.Vector3().fromBufferAttribute(positions,index.getX(t*3+k)));return new T.Vector3().crossVectors(q.clone().sub(p),r.clone().sub(p)).dot(eye.clone().sub(p))>0;};
let mixed=0;
for(const eye of [new T.Vector3(.3,.2,3),new T.Vector3(-.4,.1,-3),new T.Vector3(2.5,.4,.6),new T.Vector3(-2.2,-.3,-.9)]){
 const front=[...Array(triangles).keys()].filter(t=>facing(geometry.index,wave,t,eye)),back=[...Array(triangles).keys()].filter(t=>!facing(geometry.index,wave,t,eye));
 if(front.length&&back.length)mixed++;
 const drawn=[...Array(triangles*2).keys()].filter(t=>facing(a.geometry.index,a.geometry.getAttribute('position'),t,eye)).map(t=>t%triangles);
 assert.deepEqual(drawn,[...back,...front]);
}
assert.ok(mixed>=2,'viewpoints that see both faces of the ripple');
assert.deepEqual(hits(true),expected,'both sides retain exact picking results without duplicate hits');
assert.equal(stabilizeFishPasses(scene).meshes,0,'idempotent');
for(const tweak of [m=>m.depthWrite=true,m=>m.transmission=.3,m=>m.forceSinglePass=true,m=>m.transparent=false]){const material=source.clone();tweak(material);const mesh=new T.Mesh(geometry,material);mesh.name='fin';assert.equal(stabilizeFishPasses(mesh).meshes,0);assert.equal(mesh.geometry,geometry);}
console.log('Stable fish passes draw each membrane once with its back-then-front order, shared buffers, shader uniforms, transparency and two-sided identification.');

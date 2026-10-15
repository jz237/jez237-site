import test from 'node:test';
import assert from 'node:assert/strict';
import {clippedVolume,clippedVolumes,volumeContact,constrainClippedVolumes} from '../clipped-volumes.js';
import {southernFixedVolumes,southernRampVolumes} from '../source-southern-boxes.js';
import {createHydro} from '../hydrodynamics.js';

const close=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const cube=()=>clippedVolume({id:'cube',origin:[1,1,1],axes:[[1,0,0],[0,1,0],[0,0,1]],spans:[2,2,2]});
test('finite projection intervals select the closest of six faces',()=>{
 const v=cube(),a=volumeContact(v,{x:.9,y:0,z:0});close(a.penetration,.1);assert.deepEqual(a.normal,{x:1,y:0,z:0});
 const b=volumeContact(v,[-.9,0,0]);close(b.penetration,.1);assert.deepEqual(b.normal,{x:-1,y:0,z:0});
 assert.equal(volumeContact(v,[1.01,0,0]),null);assert.equal(volumeContact(v,[-1,0,0]),null);
 assert.equal(volumeContact(v,[0,1.01,0]),null,'passing above has no infinite XZ blocker');
 close(volumeContact(v,[0,.95,0]).penetration,.05);
});
test('source upper-point exclusions apply to side/downward contacts only',()=>{
 const v=cube();
 for(const i of [1,8,11]){
  assert.equal(volumeContact(v,[.9,0,0],i),null);assert.equal(volumeContact(v,[0,-.9,0],i),null);
  assert.ok(volumeContact(v,[0,.9,0],i));
 }
 assert.ok(volumeContact(v,[.9,0,0],4),'the fourth upper point retains the source side-contact rule');
});
test('slightly skew source ramp axes use dual coordinates for all eight corners',()=>{
 const ramp={id:150,x:0,y:0,z:0,tx:0,tz:1},v=southernRampVolumes(ramp)[1];
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 assert.ok(Math.abs(dot(v.axes[0],v.axes[2]))>1e-4,'fixture actually exercises nonorthogonal axes');
 for(let bits=0;bits<8;bits++)for(let axis=0;axis<3;axis++)
  close(dot(v.axes[axis],v.origin.map((x,k)=>x-v.vertices[bits][k])),((bits>>axis)&1)*v.spans[axis]);
 assert.equal(v.triangles.length,12);
});
test('the seventeen fixed solids include the submerged boat deck and pier clearances',()=>{
 const v=southernFixedVolumes();assert.equal(v.length,17);assert.equal(new Set(v.map(q=>q.id)).size,17);
 const deck=v[13];assert.equal(deck.kind,'ship');assert.deepEqual(deck.bounds.min,[3.125,-17.5,-128.75]);assert.deepEqual(deck.bounds.max,[11.25,-1.25,-113.75]);
 assert.equal(volumeContact(deck,[7.95,1.5,-124.15]),null,'source ring3 is above the submerged deck');
 assert.ok(volumeContact(deck,[7.95,-1.3,-124.15]));
 const pier=v[14];assert.deepEqual(pier.bounds.min,[-15.75,-.625,123.75]);assert.deepEqual(pier.bounds.max,[37.5,1.25,126.25]);
 assert.ok(volumeContact(pier,[0,0,125]));assert.equal(volumeContact(pier,[0,-1,125]),null,'low tide opens the underside');
});
test('placed ramp volumes preserve raw ascent heading without floating with water',()=>{
 const tx=Math.SQRT1_2,tz=Math.SQRT1_2,ramp={id:150,x:-16.025,y:0,z:93.325,tx,tz};
 const a=southernRampVolumes(ramp),face=a[1];
 assert.ok(face.axes[0][0]<0&&face.axes[0][2]<0,'upward surface normal leans opposite the raw45 ascent');
 assert.ok(face.vertices.flat().every(Number.isFinite));
 const high=face.vertices.filter((_,i)=>(i&1)===0).sort((a,b)=>a[1]-b[1]);
 assert.ok(high.at(-1)[1]-high[0][1]>3.6);
 assert.ok((high.at(-1)[0]-high[0][0])*tx+(high.at(-1)[2]-high[0][2])*tz>9);
});
test('live rigid contact is finite and retains tangential velocity',()=>{
 const r={x:.9,z:0,heading:0,vx:-3,vz:2,yawVelocity:0,hydro:{...createHydro(),y:0,vy:0}},solids=clippedVolumes([clippedVolume({origin:[1,10,10],axes:[[1,0,0],[0,1,0],[0,0,1]],spans:[2,20,20]})]);
 const q=constrainClippedVolumes(solids,r);assert.ok(q&&q.impact>0);assert.ok(r.x>.9);close(r.vz,2);
 assert.ok([r.x,r.z,r.vx,r.vz,r.hydro.y,r.hydro.pitch,r.hydro.roll].every(Number.isFinite));
 const flyer={...r,hydro:{...createHydro(),y:15,vy:0}};assert.equal(constrainClippedVolumes(solids,flyer),null);
});
test('invalid or collapsed solids are rejected',()=>{
 assert.throws(()=>clippedVolume({origin:[0,0,0],axes:[[1,0,0],[1,0,0],[0,0,1]],spans:[1,1,1]}),TypeError);
 assert.throws(()=>clippedVolume({origin:[NaN,0,0],axes:[[1,0,0],[0,1,0],[0,0,1]],spans:[1,1,1]}),TypeError);
});
test('source soft-volume flag scales impact reporting while retaining identical physical response',()=>{
 const run=flag=>{
  const volume=clippedVolume({origin:[1,10,10],axes:[[1,0,0],[0,1,0],[0,0,1]],spans:[2,20,20],flag});
  const r={x:.9,z:0,heading:0,vx:-3,vz:2,yawVelocity:0,hydro:{...createHydro(),y:0,vy:0}};
  return {result:constrainClippedVolumes(clippedVolumes([volume]),r),r};
 };
 const hard=run(0),soft=run(1);assert.deepEqual(soft.r,hard.r);close(soft.result.impact,hard.result.impact*.4);
});

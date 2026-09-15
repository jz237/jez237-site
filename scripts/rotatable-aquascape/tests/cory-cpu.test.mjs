import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {CoryFloorRoutes} from '../lib/CoryFloorRoutes.ts';
import {CoryFloorRoutes as ReferenceRoutes} from './cory-route-reference.ts';
import {Corydoras,coryBody,coryForward} from '../lib/Corydoras.ts';
import {bodiesOverlap,fishBody,grazerBody} from '../lib/GrazerCollision.ts';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);

test('route memoization preserves every waypoint with fresh traffic and floor data',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../lib/CoryFloorRoutes.json',import.meta.url)));
 let oldCalls=0,newCalls=0,offset=0;
 const height=(x,z)=>.3+.07*Math.sin(x+z)+offset;
 const old=new ReferenceRoutes((x,z)=>{oldCalls++;return height(x,z)},()=>true),nav=new CoryFloorRoutes((x,z)=>{newCalls++;return height(x,z)},()=>true);
 old.load(data);nav.load(data);
 for(let i=0;i<80;i++){
  offset=(i%3)*.05;
  const start=nav.nodes[i*13%nav.nodes.length].point.clone(),visits=new Map([['0,0',30],['-2,1',19]]),occupied=[V(Math.sin(i)*3,.5,Math.cos(i)*2),V(Math.cos(i*.3)*4,.6,Math.sin(i*.7))];
  const args=[start,visits,i*3,237+i*79,i*.13,occupied];
  assert.deepEqual(nav.route(...args).map(p=>p.toArray()),old.route(...args).map(p=>p.toArray()),`route ${i}`);
 }
 assert.ok(newCalls<oldCalls*.35,`floor evaluations ${oldCalls} -> ${newCalls}`);
});

test('cached companion volumes invalidate on every position, heading, pitch and size change',()=>{
 const life=Object.create(Corydoras.prototype);life.bodyCache=new WeakMap();
 const a={position:V(1,.4,2),yaw:.7,pitch:-.2,size:.568};
 let previous=life.currentBody(a);assert.equal(life.currentBody(a),previous);
 for(const change of [()=>a.position.x+=.02,()=>a.position.y+=.03,()=>a.position.z-=.04,()=>a.yaw+=.1,()=>a.pitch-=.05,()=>a.size*=.8]){
  change();const actual=life.currentBody(a);assert.notEqual(actual,previous);assert.deepEqual(actual,coryBody(a.position,coryForward(a),a.size,a.pitch));previous=actual;
 }
});

test('broad rejection keeps every exact cory contact, including fins and pitched bodies',()=>{
 const life=Object.create(Corydoras.prototype);life.visitorBounds=new WeakMap();
 let seed=237;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 let contacts=0,rejections=0;
 for(let i=0;i<6000;i++){
  const position=V(random()*4-2,random(),random()*2-1),yaw=random()*Math.PI*2,pitch=random()*.8-.4,size=.42+random()*.25,forward=V(Math.cos(yaw),0,-Math.sin(yaw));
  const p=position.clone().add(V(random()*2-1,random()-.5,random()*2-1)),f=V(Math.cos(i),0,Math.sin(i));
  const other=i%3===0?fishBody({position:p,forward:f,size:.7}):i%3===1?grazerBody(p,V(0,1,0),f,false,.9):coryBody(p,f,.55,-.3);
  const hit=bodiesOverlap(coryBody(position,forward,size,pitch),other,.004),may=life.visitorMayReach(position,size,other);
  if(hit)contacts++;if(!may)rejections++;assert.equal(may&&hit,hit);
  for(const s of coryBody(position,forward,size,pitch))assert.ok(s.center.distanceTo(position)+s.radius<.75*size,'whole-body bound contains all collision spheres');
 }
 assert.ok(contacts>100&&rejections>1000);
});

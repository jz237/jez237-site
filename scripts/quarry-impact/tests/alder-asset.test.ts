import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {buildAlderAsset} from '../src/alder-asset';
import {encodeVehicleGlb} from '../tools/vehicle-glb';
test('estate shell has bounded finite geometry, four door windows, cargo compartment and road wheel clearance',()=>{
 const root=buildAlderAsset(),bounds=new T.Box3().setFromObject(root);let vertices=0;const opaque:T.Mesh[]=[];
 root.traverse(o=>{if(!(o instanceof T.Mesh))return;const p=o.geometry.attributes.position;vertices+=p.count;for(const x of p.array)assert.ok(Number.isFinite(x));if(!(o.material as T.Material).transparent&&!o.name.startsWith('wheel_'))opaque.push(o);});
 assert.ok(vertices<115000);assert.ok(bounds.min.y>=0&&bounds.max.y<1.75);assert.ok(bounds.min.z>-2.5&&bounds.max.z<2.5);assert.ok(bounds.min.x>-1.1&&bounds.max.x<1.1);
 for(const side of ['L','R'])for(const name of ['BodyDoor','BodyDoorRear','Cargo'])assert.ok(root.getObjectByName('glass_'+name+side+'Alder'));
 for(const name of ['glass_FrontAlder','glass_TailgateAlder','panel_TailgateAlderWiper','Interior Alder CargoFloor','Structure Alder longitudinal inline four','panel_AlderHeadlight-1','panel_AlderHeadlight1','panel_AlderRearLamp-1','panel_AlderRearLamp1'])assert.ok(root.getObjectByName(name),name);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=root.getObjectByName('wheel_'+name)!;assert.equal(wheel.position.x,(i%2?1:-1)*.77);assert.equal(wheel.position.z,(i<2?1:-1)*1.36);const b=new T.Box3().setFromObject(wheel);assert.ok(b.min.y>=0);assert.ok(b.max.y<.80);}
 const ray=new T.Raycaster(new T.Vector3(-.4,1.31,-.12),new T.Vector3(0,-.035,1).normalize(),.035,4);assert.deepEqual(ray.intersectObjects(opaque,false).map(h=>h.object.name),[],'dashboard sightline');
});
test('estate exports a self-contained GLB with a repeatable byte representation',()=>{
 const encode=()=>encodeVehicleGlb(buildAlderAsset(),()=>{throw Error('Unexpected external texture')},{generator:'Alder test'});
 const a=encode(),b=encode();assert.deepEqual(a,b);const data=new DataView(a.buffer,a.byteOffset,a.byteLength);assert.equal(data.getUint32(0,true),0x46546c67);assert.equal(data.getUint32(4,true),2);assert.equal(data.getUint32(8,true),a.length);
 const json=JSON.parse(new TextDecoder().decode(a.subarray(20,20+data.getUint32(12,true))));assert.equal(json.buffers.length,1);assert.equal(json.buffers[0].uri,undefined);assert.ok(json.nodes.some((n:any)=>n.name==='Alder230'));assert.ok(a.length<4_000_000);
});

import {CHALLENGES} from '../src/challenges';import {CAREER_GROUPS} from '../src/career';import {COURSE_NAMES} from '../src/course-id';
test('estate career offers three valid venues including a reverse race',()=>{
 const group=CAREER_GROUPS.find(g=>g.id==='estate-escapades')!;assert.equal(group.events.length,3);
 const events=group.events.map(id=>CHALLENGES.find(c=>c.id===id)!);assert.ok(events.every(c=>c&&c.car==='alder'&&c.mode==='race'&&c.course&&Object.hasOwn(COURSE_NAMES,c.course)));assert.equal(new Set(events.map(c=>c.course)).size,3);assert.ok(events.some(c=>c.direction==='reverse'));
});

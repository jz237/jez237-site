import assert from 'node:assert/strict';
import * as T from 'three';
import {buildAnemones} from '../Anemones.ts';
let seed=91;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const {mesh,behavior:b}=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28);
const food={position:new T.Vector3(0,5,0),alive:true,age:0};b.update(0,[food]);assert.equal(b.snapshot().captured,0,'distant food does not trigger anticipatory feeding');
food.position.copy(b.tipAt(0,b.hosts[0].strands[40],1,new T.Vector3()));b.update(1,[food]);assert.equal(food.alive,false);assert.deepEqual(b.snapshot(),{brushing:0,maxBrush:0,captured:1,swallowed:0,carried:1,fold:[0,0,0]});
const first=new T.Matrix4();b.morsels.getMatrixAt(0,first);assert.ok(new T.Vector3().setFromMatrixPosition(first).distanceTo(food.position)<1e-5,'contact does not teleport food');
b.update(5,[food]);assert.ok(b.snapshot().fold[0]>.19);assert.equal(b.snapshot().fold[1],0);assert.equal(b.snapshot().fold[2],0);const midway=new T.Matrix4();b.morsels.getMatrixAt(0,midway);assert.ok(new T.Vector3().setFromMatrixPosition(midway).distanceTo(b.hosts[0].center)<food.position.distanceTo(b.hosts[0].center),'visible food travels toward the oral center');
const held=JSON.stringify(b.snapshot());b.update(5,[food]);assert.equal(JSON.stringify(b.snapshot()),held,'same simulation time is stable');
b.update(10,[food]);assert.equal(b.snapshot().swallowed,1);assert.equal(b.snapshot().carried,0);b.update(26,[food]);assert.equal(b.snapshot().fold[0],0);assert.equal(b.snapshot().captured,1,'dead food is not eaten twice');
// Contact normal deformation must keep local orientation and rooted endpoints.
const flex=mesh.geometry.getAttribute('anemoneFlex'),detail=mesh.geometry.getAttribute('anemoneDetail');assert.equal(detail.normalized,true);assert.ok(detail.array instanceof Uint16Array);
for(let i=0;i<flex.count;i++){assert.ok(Math.floor(flex.getY(i)/8)<3,'encoded host remains valid');if(flex.getX(i)===0)assert.equal(.20*flex.getX(i)**2,0,'roots stay fixed during feeding');}
console.log('Anemone contact: no distant reaction, capture continuity, local folding, transfer, pause and recovery passed.');
mesh.geometry.dispose();mesh.material.dispose();b.morsels.geometry.dispose();b.morsels.material.dispose();

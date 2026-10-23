import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {LID,BOOT_AIR,CARGO,lidKind,lidTorque,lidRest,lidBase,cargoSpills} from '../src/door-swing';
import {assemblyMass} from '../src/shed-weight';
import {buildTordalAsset} from '../src/tordal-asset';
import {buildCompactAsset} from '../src/compact-asset';
import {prepareWreckGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
test('a sprung boot lid stays down standing and at derby pace, and flaps open into the airflow at speed',()=>{
 assert.equal(lidKind('boot'),'boot');assert.equal(lidKind('hood'),null);
 const base=lidBase('boot',.4);
 assert.ok(lidTorque('boot',base,1,0,0,9.81)<0,'gravity holds it down');
 assert.equal(lidRest('boot',base,1,0,0,9.81,0),0);assert.equal(lidRest('boot',base,1,0,0,9.81,18),0,'65 km/h: still down');
 const fast=lidRest('boot',base,1,0,0,9.81,30);assert.ok(fast>.3&&fast<=LID.boot.max-base,`108 km/h: open ${fast}`);
 assert.ok(lidRest('boot',base,1,0,0,9.81,40)>fast,'faster, higher');
 assert.ok(lidTorque('boot',.8,1,-20,0,9.81)>0,'hard braking lifts a raised lid');
 assert.ok(BOOT_AIR.lift>BOOT_AIR.push);
});
test('the other lids are untouched by the new speed argument',()=>{
 for(const kind of ['cargo','tailgate','drop'] as const)for(const angle of [.1,.7,1.2])
  assert.equal(lidTorque(kind,angle,-1,3,-4,9.81,35),lidTorque(kind,angle,-1,3,-4,9.81));
});
test('an open boot spills luggage and a torn-off lid weighs something',()=>{
 assert.ok(cargoSpills('boot',CARGO.boot.open));assert.ok(!cargoSpills('boot',CARGO.boot.open-.1));
 assert.ok(CARGO.boot.load>0);assert.equal(assemblyMass('boot'),14);
});
test('saloon boot panels hinge as one lid along their front edge',()=>{
 for(const build of [buildTordalAsset,buildCompactAsset]){
  const car=build();prepareWreckGeometry(car);
  const wheels=['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!);
  const parts=new WreckAttachments(car,wheels,.9);
  const boot=parts.assemblies.find(a=>a.name==='boot');assert.ok(boot,'a boot assembly');
  assert.ok(boot!.members.every(m=>/^panel_(?:bodytrunk|boot|trunkmorrow)/i.test(m.mesh.name)));
  assert.ok(boot!.bounds.max.z<0,'at the back');
  // Opened, the rear edge lifts and the front edge stays put.
  const mesh=boot!.members[0].mesh;car.updateMatrixWorld(true);const shut=new T.Box3().setFromObject(mesh);
  boot!.loose=1;boot!.swing=.6;parts.pose(0,0);car.updateMatrixWorld(true);const open=new T.Box3().setFromObject(mesh);
  assert.ok(open.max.y>shut.max.y+.2,'the lid rises');assert.ok(Math.abs(open.max.z-shut.max.z)<.25,'about its front edge');
 }
});

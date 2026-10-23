import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {buildTordalAsset} from '../src/tordal-asset';
import {buildCompactAsset} from '../src/compact-asset';
import {prepareWreckGeometry} from '../src/wreck-geometry';
import {WreckAttachments} from '../src/wreck-attachments';
import {WING_OFF,DETACH} from '../src/vehicle';
test('front wing panels tear off as a left and a right wing, and never hang on hinges',()=>{
 for(const build of [buildTordalAsset,buildCompactAsset]){
  const car=build();prepareWreckGeometry(car);
  const wings:Record<string,T.Mesh[]>={};car.traverse(o=>{const a=o.userData.detachAssembly as string|undefined;if(o instanceof T.Mesh&&a?.startsWith('wing-'))(wings[a]??=[]).push(o);});
  assert.deepEqual(Object.keys(wings).sort(),['wing-left','wing-right']);
  for(const [name,panels] of Object.entries(wings))for(const p of panels){
   assert.match(p.name.toLowerCase(),/^panel_(?:front_fender|frontfender|frontwing)/);
   const x=new T.Box3().setFromObject(p).getCenter(new T.Vector3()).x;assert.ok(name==='wing-left'?x<0:x>0,`${p.name} on the ${name} side`);
  }
  const wheels=['FL','FR','RL','RR'].map(n=>car.getObjectByName('wheel_'+n)!);
  assert.ok(!new WreckAttachments(car,wheels,.9).assemblies.some(a=>a.name.startsWith('wing-')),'no hinged wing assembly');
 }
});
test('a wing takes more crushing than a bumper before it goes',()=>{
 assert.ok(WING_OFF.threshold>32&&WING_OFF.threshold<48*1.5);assert.ok(WING_OFF.threshold*DETACH.threshold>10);
});

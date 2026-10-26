import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BRAKE_BULB,deadBrakeSide} from '../src/dead-brake';
import {attachCarLights,TAIL_GLOW} from '../src/car-lights';
const car=(tails:[number,number][])=>{const root=new T.Group();for(const [x,w] of tails){const lamp=new T.Mesh(new T.BoxGeometry(w,.1,.05),new T.MeshStandardMaterial({name:'Brakelight'}));lamp.position.set(x,.8,-2.1);root.add(lamp);}return root;};
test('past its age, some old rivals have lost a brake bulb on one side, each car its own',()=>{
  const picks=Array.from({length:300},(_,id)=>deadBrakeSide(id,1));assert.ok(picks.every(s=>s===-1||s===0||s===1));
  const share=picks.filter(Boolean).length/picks.length;assert.ok(Math.abs(share-BRAKE_BULB.share)<.08,`share ${share}`);assert.ok(picks.includes(-1)&&picks.includes(1),'either side');
  assert.ok(Array.from({length:100},(_,id)=>deadBrakeSide(id,BRAKE_BULB.age-.01)).every(s=>s===0),'not on younger cars');assert.equal(deadBrakeSide(5,.9),deadBrakeSide(5,.9));assert.equal(deadBrakeSide(2,NaN),0);
});
test('braking, the dead side’s lamp stays at its running glow (dark by day) while the other side brightens',()=>{
  const root=car([[-.7,.3],[.7,.3]]),lights=attachCarLights(root,2.2),left=lights.lamp('tail',0)!.material as T.MeshStandardMaterial,right=lights.lamp('tail',1)!.material as T.MeshStandardMaterial;
  lights.deadBrake(-1);
  lights.set(true,true);assert.equal(left.emissiveIntensity,TAIL_GLOW.running);assert.equal(right.emissiveIntensity,TAIL_GLOW.braking);
  lights.set(false,true);assert.equal(left.emissiveIntensity,0);assert.equal(right.emissiveIntensity,TAIL_GLOW.daylightBraking);
  lights.set(true,false);assert.equal(left.emissiveIntensity,TAIL_GLOW.running,'still a tail lamp');
});
test('a light bar across the back is one bulb: no side of it goes dead',()=>{
  const root=car([[0,1.6]]),lights=attachCarLights(root,2.2),bar=lights.lamp('tail',0)!.material as T.MeshStandardMaterial;
  lights.deadBrake(1);lights.deadBrake(-1);lights.set(false,true);assert.equal(bar.emissiveIntensity,TAIL_GLOW.daylightBraking);
});
test('main gives old rivals their dead brake bulbs, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const side=deadBrakeSide(car.id,startingRust(car.id));if(side&&carLights.get(car)){carLights.get(car)!.deadBrake(side);deadBrakes.set(car,side);}}'));
  assert.ok(main.includes('brakeBulb: (id = 0, side?: number) =>'));
});

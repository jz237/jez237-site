import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {ELECTRICS,deadBulb,flickerOff,shakesWiring} from '../src/tired-electrics';
import {attachCarLights} from '../src/car-lights';
test('past its age, some old cars have a dead headlamp bulb, each car its own',()=>{
  const picks=Array.from({length:200},(_,id)=>deadBulb(id,1));assert.ok(picks.every(k=>k===-1||k===0||k===1));
  const share=picks.filter(k=>k>=0).length/picks.length;assert.ok(Math.abs(share-ELECTRICS.dead)<.1,`share ${share}`);
  assert.ok(picks.includes(0)&&picks.includes(1),'left or right');assert.ok(Array.from({length:200},(_,id)=>deadBulb(id,ELECTRICS.deadAge-.01)).every(k=>k===-1),'not on younger cars');
  assert.equal(deadBulb(7,.9),deadBulb(7,.9));assert.equal(deadBulb(3,NaN),-1);
});
test('a hard knock on an old car sets its lamps flickering for a moment, by turns, then lit again',()=>{
  assert.ok(shakesWiring(ELECTRICS.age,ELECTRICS.knock));assert.ok(!shakesWiring(ELECTRICS.age-.01,30),'a sound car');assert.ok(!shakesWiring(1,ELECTRICS.knock-1),'a tap');
  let off=0,on=0,turns=0;for(let id=0;id<30;id++){let was:boolean|undefined;for(let b=0;b<ELECTRICS.flicker*ELECTRICS.rate;b++){const now=flickerOff((b+.5)/ELECTRICS.rate,id);now?off++:on++;if(was!==undefined&&now!==was)turns++;was=now;}}
  assert.ok(off>(off+on)*.35&&on>0&&turns>(off+on)/3,'dark and lit by turns');assert.ok(Array.from({length:30},(_,id)=>flickerOff(.5/ELECTRICS.rate,id)).filter(Boolean).length>20,'it starts dark');
  assert.equal(flickerOff(ELECTRICS.flicker,1),false,'over');assert.equal(flickerOff(-1,1),false,'before');assert.equal(flickerOff(NaN,1),false);
});
test('a dead bulb leaves its lamp dark when the lights are on, and the other lit',()=>{
  const root=new T.Group();for(const x of [-.6,.6]){const lamp=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Headlight'}));lamp.position.set(x,.7,2);root.add(lamp);}
  const lights=attachCarLights(root,2.2);lights.set(true);lights.kill(1);lights.set(true);
  const a=lights.lamp('head',0)!.material as T.MeshStandardMaterial,b=lights.lamp('head',1)!.material as T.MeshStandardMaterial;assert.ok(a.emissiveIntensity>0&&b.emissiveIntensity===0,'one-eyed');
  lights.kill(9);lights.kill(-1);lights.set(false);lights.set(true);assert.ok(a.emissiveIntensity>0,'no such lamp: nothing');
});
test('a flicker darkens every lamp, the brake lamps too, until it passes',()=>{
  const root=new T.Group(),head=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Headlight'})),tail=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Brakelight'}));
  head.position.set(.6,.7,2);tail.position.set(.6,.7,-2);root.add(head,tail);const lights=attachCarLights(root,2.2),h=head.material as T.MeshStandardMaterial,t=tail.material as T.MeshStandardMaterial;
  lights.set(true,true);assert.ok(h.emissiveIntensity>0&&t.emissiveIntensity>0);
  lights.flick(true);lights.set(true,true);assert.ok(h.emissiveIntensity===0&&t.emissiveIntensity===0,'all dark');
  lights.flick(false);lights.set(true,true);assert.ok(h.emissiveIntensity>0&&t.emissiveIntensity>0,'lit again');
});
test('main fits the dead bulbs and the flicker to old offline rivals, every lamp, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("const k=deadBulb(car.id,startingRust(car.id));if(k>=0&&carLights.get(car)?.lamp('head',k)){carLights.get(car)!.kill(k);deadBulbs.set(car,k);}"));
  assert.ok(main.includes('const knock=car.onHardKnock;car.onHardKnock=damage=>{knock?.(damage);if(shakesWiring(car.surfaceFinish.rustAge,damage)){wiringAt.set(car,clock);flickers++;}};'),'on top of the body dust');
  const flick=main.indexOf('for(const c of cars)carLights.get(c)?.flick(flickerOff(clock-(wiringAt.get(c)??-9),c.id));'),set=main.indexOf('for(const c of cars)carLights.get(c)?.set((dusk');
  assert.ok(flick>0&&set>flick&&set-flick<200,'flickered just before the lamps are set each frame');
  assert.ok(main.includes('carLights.get(c)?.set((dusk||wet&&c.extendedDamage)&&c.health>0&&!c.electricalCut&&!c.batteryOut&&'),'the switch as before');
  assert.ok(main.includes('electrics: (id = 0, kill?: number) =>'));
});

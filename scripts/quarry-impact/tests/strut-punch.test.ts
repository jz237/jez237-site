import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {STRUT,strutPunches,strutAssembly,StrutPunch} from '../src/strut-punch';
test('only a wrecked front corner punches its strut through',()=>{
  assert.equal(strutPunches(STRUT.punch,STRUT.front),true);assert.equal(strutPunches(STRUT.punch-.01,1),false,'the wheel not wrecked enough');
  assert.equal(strutPunches(1,STRUT.front-.01),false,'the front not crushed enough');assert.equal(strutPunches(NaN,1),false);
});
test('a strut is a damper, a chromed rod, a coil spring and a top mount, its length tall',()=>{
  const s=strutAssembly(.8,0xd22a1e);assert.ok(['strut_body','strut_rod','strut_spring','strut_mount'].every(n=>!!s.getObjectByName(n)),'all its parts');
  const box=new T.Box3().setFromObject(s);assert.ok(Math.abs(box.max.y-.8-.0125)<.01&&box.min.y>-.01,'from its foot to its mount');
  assert.ok(box.max.x<=STRUT.spring+STRUT.coil+.01,'slim');
});
// A car: a bonnet slab 0.5 m above the hubs, front wheels at ±0.8 m, left on no layer as the draw batches leave the panels.
const car=()=>{const root=new T.Group(),bonnet=new T.Mesh(new T.BoxGeometry(1.8,.05,1.6),new T.MeshBasicMaterial());bonnet.position.set(0,.8,1.3);bonnet.layers.mask=0;root.add(bonnet);
  const wheels=[.8,-.8].map(x=>{const w=new T.Object3D();w.position.set(x,.3,1.3);root.add(w);return w;});root.position.set(2,0,4);root.rotation.y=.5;return {root,bonnet,wheels};};
test('a wrecked corner punches up through the panel over its wheel, leaning in, and goes back in when mended',()=>{
  const {root,bonnet,wheels}=car(),punched:T.Vector3[]=[],struts=new StrutPunch(root,wheels,[bonnet],1,at=>punched.push(at));
  struts.update([.9,.2],.2);assert.equal(struts.punched,0,'the front not crushed: nothing');
  struts.update([.9,.2],.5);assert.ok(struts.punched===1&&!!struts.struts[0]&&!struts.struts[1],'only the wrecked corner');
  const s=struts.struts[0]!;s.updateMatrixWorld(true);const box=new T.Box3().setFromObject(s).applyMatrix4(root.matrixWorld.clone().invert());
  assert.ok(Math.abs(box.max.y-(.825+STRUT.proud))<.03,'sticking up out of the skin');assert.ok(Math.abs(s.position.y-(.3+STRUT.below))<1e-6,'from just over the hub');
  assert.ok(s.rotation.z>0,'leaning in toward the middle');assert.equal(punched.length,1);assert.ok(punched[0].distanceTo(new T.Vector3(.8,.825,1.3).applyMatrix4(root.matrixWorld))<.02,'snapping out where it came through');
  struts.update([.9,.2],.6);assert.equal(struts.punched,1,'once');
  struts.update([.1,.2],.6);assert.ok(!struts.struts[0]&&!root.children.includes(s),'mended');
  struts.update([.9,.9],.6);assert.equal(struts.punched,3);struts.dispose();assert.ok(struts.struts.every(x=>!x));
});
test('main punches the struts of offline cars through as their front corners are wrecked',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage)strutPunches.set(car,new StrutPunch(car.root,car.wheels,car.panels,car.id,at=>{sound.clip('spring-snap',at,.85,.8);fx.emit(at,14,1,1.4);}));"),'offline, with a snap and sparks');
  assert.ok(main.includes('strutPunches.get(c)?.update(c.wreckParts.wheelDamage,c.structuralDamage?.[0]??0);')&&main.includes('strutPunches.get(c)?.dispose();strutPunches.delete(c);'),'watched, cleared');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {DOOR_SWING} from '../src/door-swing';
import {CHAIN,chainDoor,chainGeometry,chainSnaps,chainsDoors,frontDoors} from '../src/door-chains';
test('about CHAIN.share of the rivals chain their doors, each its own way',()=>{
  const share=Array.from({length:400},(_,id)=>chainsDoors(id)).filter(Boolean).length/400;
  assert.ok(Math.abs(share-CHAIN.share)<.08,`share ${share}`);assert.equal(chainsDoors(7),chainsDoors(7));assert.doesNotThrow(()=>chainsDoors(NaN));
});
test('a chain holds through the knocks that spring a latch, and snaps on a big hit, a torn hinge or a door gone',()=>{
  assert.ok(CHAIN.snap>DOOR_SWING.latchDamage,'stronger than the latch');
  assert.ok(!chainSnaps(DOOR_SWING.latchDamage+1,0,true),'a latch-springing knock');assert.ok(chainSnaps(CHAIN.snap,0,true),'a big hit');
  assert.ok(chainSnaps(0,CHAIN.loose,true),'hinges torn');assert.ok(chainSnaps(0,0,false),'the door is off');assert.ok(!chainSnaps(NaN,NaN,true));
});
test('only the front doors are chained',()=>{
  assert.deepEqual(frontDoors(['door-left','door-rear-left','door-right','boot','door-rear-right','hood','cargo-left']),['door-left','door-right']);
});
test('a chain is a flat loop of links, and goes round the back edge of the door at the sill, inside the skin',()=>{
  const g=chainGeometry();g.computeBoundingBox();const s=g.boundingBox!.getSize(new T.Vector3());
  assert.ok(Math.abs(s.x-2*CHAIN.across)<CHAIN.link*1.2&&Math.abs(s.z-2*CHAIN.along)<CHAIN.link*1.2&&s.y<CHAIN.link*1.6,'flat: no taller than a link on edge');
  const root=new T.Group(),bounds=new T.Box3(new T.Vector3(-1,.2,-.8),new T.Vector3(-.7,1.2,.9));
  const left=chainDoor(root,bounds,-1),right=chainDoor(root,new T.Box3(new T.Vector3(.7,.2,-.8),new T.Vector3(1,1.2,.9)),1);
  assert.ok(root.children.includes(left)&&left.name==='door_chain');
  assert.ok(Math.abs(left.position.x-(-1+CHAIN.across*.8))<1e-9&&Math.abs(right.position.x-(1-CHAIN.across*.8))<1e-9,'tucked in from the skin');
  assert.ok(Math.abs(left.position.y-(.2+CHAIN.sill))<1e-9&&left.position.z===-.8,'at the sill, on the back edge');
});
test('a chained door stays out of the swing until its chain goes; main chains rivals’ doors and snaps them, with a QA hook',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes("||!a.members.some(m=>m.mesh.visible)||this.chainedDoors.has(a.name))continue;")&&vehicle.includes('readonly chainedDoors=new Set<string>();'));
  assert.ok(main.includes("if(car.extendedDamage&&i!==0&&chainsDoors(car.id)){const chains:{door:string;mesh:T.Mesh}[]=[];for(const name of frontDoors(car.wreckParts.assemblies.map(a=>a.name))){"));
  assert.ok(main.includes('if(!chainSnaps(a?.damage??0,a?.loose??0,!!a&&a.members.some(m=>m.mesh.visible)))continue;'));
  assert.ok(main.includes("c.chainedDoors.delete(door);chains.splice(k,1);")&&main.includes("fx.detach(mesh,c.velocity.clone().multiplyScalar(.6));mesh.removeFromParent();mesh.geometry.dispose();chainsSnapped++;sound.breakage('chain',at);"));
  assert.ok(main.includes('chains: (id = 0) =>'));
});

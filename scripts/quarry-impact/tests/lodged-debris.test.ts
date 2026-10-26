import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {LODGE,debrisChunk,lodgeChunk,lodges,shakesLoose} from '../src/lodged-debris';
test('only a hard blow on the striker’s nose lodges a piece, about half the time, fixed per crash',()=>{
  const share=Array.from({length:400},(_,k)=>lodges(LODGE.damage,LODGE.front,k)).filter(Boolean).length/400;assert.ok(Math.abs(share-LODGE.chance)<.08,`share ${share}`);
  assert.ok(Array.from({length:100},(_,k)=>lodges(LODGE.damage-.1,1,k)).every(l=>!l),'not a lighter knock');
  assert.ok(Array.from({length:100},(_,k)=>lodges(30,LODGE.front-.05,k)).every(l=>!l),'not on its flank or tail');
  assert.equal(lodges(20,.9,7),lodges(20,.9,7));assert.equal(lodges(NaN,.9,7),false);
  assert.ok(Array.from({length:100},(_,k)=>shakesLoose(LODGE.loosen-.1,k)).every(l=>!l),'only a big knock shakes one loose');assert.ok(Array.from({length:200},(_,k)=>shakesLoose(30,k)).some(Boolean));
});
test('a chunk is a crumpled piece of the other car, in its paint, each its own shape',()=>{
  const a=debrisChunk(new T.Color(0x9a2a22),3),b=debrisChunk(new T.Color(0x9a2a22),4);a.geometry.computeBoundingBox();const s=a.geometry.boundingBox!.getSize(new T.Vector3());
  assert.ok(Math.max(s.x,s.y,s.z)<LODGE.size[1]*1.4&&Math.max(s.x,s.y,s.z)>LODGE.size[0]*.6,'its size');assert.equal((a.material as T.MeshStandardMaterial).color.getHex(),0x9a2a22,'the other car’s paint');
  assert.notDeepEqual(Array.from(a.geometry.attributes.position.array.slice(0,12)),Array.from(b.geometry.attributes.position.array.slice(0,12)),'its own shape');
  const root=new T.Group();root.position.set(5,0,2);root.rotation.y=.7;root.updateMatrixWorld(true);const at=new T.Vector3(5.4,.6,3.1),c=lodgeChunk(root,at,new T.Color(0xffffff),9);
  assert.ok(c.parent===root,'carried by the striker');c.updateMatrixWorld(true);assert.ok(c.getWorldPosition(new T.Vector3()).distanceTo(at)<1e-6,'where it struck');
});
test('main lodges pieces in offline strikers’ fronts, sheds them on big knocks, clears them with the car, with a QA count',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(!online?.active&&a&&b&&a.extendedDamage&&b.extendedDamage)for(const [s,o,p] of [[a,b,point1],[b,a,point2]] as const){'),'each car by its own contact point');
  assert.ok(main.includes('if(stuck.length<LODGE.max&&lodges(damage,alongCar(p,s.current,s.forward,DEFINITIONS[s.kind].halfLength),seed)){stuck.push(lodgeChunk(s.root,p,o.paintColor,seed));'),'the other car’s paint, at the nose');
  assert.ok(main.includes('if(stuck.length&&shakesLoose(damage,seed)){const chunk=stuck.shift()!;')&&main.includes('fx.detach(chunk,s.velocity.clone().multiplyScalar(.6));'),'shaken loose as debris');
  assert.ok(main.includes('wheelBlurs.delete(c);lodged.delete(c);danglers.get(c)?.dispose();')&&main.includes('lodged: (id?: number) =>'));
});

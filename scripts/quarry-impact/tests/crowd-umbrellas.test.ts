import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {UMBRELLAS,createVenueCrowd} from '../src/venue-crowd';
const places=Array.from({length:30},(_,i)=>({x:i*1.2,y:2,z:-5,yaw:i%2?.4:-.3,seated:i%7!==0}));
test('in the rain every third spectator puts up an umbrella over their head; dry, they come down',()=>{
  const crowd=createVenueCrowd(places),set=crowd.root.userData.umbrellas as (on:boolean)=>void;
  assert.equal(crowd.root.children.length,4,'no umbrellas until it rains');
  set(true);const canopy=crowd.root.getObjectByName('crowd_umbrella') as T.InstancedMesh,shaft=crowd.root.getObjectByName('crowd_umbrella_shaft') as T.InstancedMesh;
  const held=places.filter((_,i)=>i%UMBRELLAS.every===UMBRELLAS.offset);
  assert.ok(crowd.root.children.length===6&&canopy.visible&&shaft.visible&&canopy.count===held.length&&shaft.count===held.length);
  const m=new T.Matrix4(),at=new T.Vector3(),colour=new T.Color(),colours=new Set<number>();let over=true;
  held.forEach((p,k)=>{canopy.getMatrixAt(k,m);at.setFromMatrixPosition(m);const hip=p.seated!==false?.48:.88;over&&=Math.abs(at.y-(p.y+hip+UMBRELLAS.above))<1e-6&&Math.hypot(at.x-p.x,at.z-p.z)<.1;canopy.getColorAt(k,colour);colours.add(colour.getHex());});
  assert.ok(over,'each canopy just above its holder');assert.ok(colours.size>=4,'mixed colours');
  set(false);assert.ok(!canopy.visible&&!shaft.visible&&crowd.root.children.length===6,'down, kept for the next shower');
  set(true);assert.ok(canopy.visible&&crowd.root.children.length===6,'up again without rebuilding');
  crowd.dispose();set(true);
  const none=createVenueCrowd([]),bare=none.root.children.length;(none.root.userData.umbrellas as (on:boolean)=>void)(true);assert.equal(none.root.children.length,bare,"an empty stand stays empty");none.dispose();
});
test('main raises the umbrellas in an offline rain event, once per change of weather or venue',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("{const up=eventLighting==='rain'&&!online?.active;if(up!==umbrellasUp||activeVenue.root!==umbrellaRoot){umbrellaRoot?.traverse(o=>o.userData.umbrellas?.(false));umbrellaRoot=activeVenue.root;umbrellasUp=up;umbrellaRoot?.traverse(o=>o.userData.umbrellas?.(up));}}"));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {UMBRELLAS,createVenueCrowd} from '../src/venue-crowd';
const places=Array.from({length:300},(_,i)=>({x:(i%30)*1.1,y:1,z:Math.floor(i/30)*1.2,yaw:i%2?Math.PI/2:0,seated:true}));
const ups=(canopy:T.InstancedMesh)=>{const m=new T.Matrix4(),q=new T.Quaternion(),s=new T.Vector3(),p=new T.Vector3(),out:{up:T.Vector3;flipped:boolean}[]=[];
  for(let k=0;k<canopy.count;k++){canopy.getMatrixAt(k,m);m.decompose(p,q,s);out.push({up:new T.Vector3(0,1,0).applyQuaternion(q),flipped:m.determinant()<0});}return out;};
test('in a breeze every umbrella is angled into it, whichever way its holder faces; in a gale a few blow inside out',()=>{
  const crowd=createVenueCrowd(places),set=crowd.root.userData.umbrellas as (on:boolean,wind?:{x:number;z:number})=>void;
  set(true);const canopy=crowd.root.getObjectByName('crowd_umbrella') as T.InstancedMesh,still=ups(canopy);
  set(true,{x:2,z:0});const breezy=ups(canopy);
  assert.ok(breezy.every((b,k)=>b.up.x<still[k].up.x-.1&&!b.flipped),'tipped toward the breeze (upwind is −x), none inside out');
  set(true,{x:0,z:-2});assert.ok(ups(canopy).every((b,k)=>b.up.z>still[k].up.z+.1),'and the other way for a breeze along −z');
  set(true,{x:UMBRELLAS.gale+.6,z:0});const gale=ups(canopy),inside=gale.filter(g=>g.flipped).length;
  assert.ok(inside>0&&inside<canopy.count*UMBRELLAS.inside*3&&canopy.userData.inside===inside,'a few inside out');
  const galeLean=Math.min(UMBRELLAS.lean,(UMBRELLAS.gale+.6)*UMBRELLAS.leanPer);assert.ok(gale.filter(g=>!g.flipped).every(g=>g.up.x< -Math.sin(galeLean*.7)),'the rest leant hard into it');
  set(true);const calm=ups(canopy),off=Math.max(...calm.map((c,k)=>c.up.distanceTo(still[k].up)));assert.ok(off<1e-6&&calm.every(c=>!c.flipped),'still air: as they were '+off);
  crowd.dispose();
});
test('main raises the umbrellas into the event breeze',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("umbrellaRoot?.traverse(o=>o.userData.umbrellas?.(up,windy?breezeBase:undefined));}}"));
});

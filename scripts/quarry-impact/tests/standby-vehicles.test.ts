import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {STANDBY,standbyPosts,beaconHalf,createStandby} from '../src/standby-vehicles';
import {HARROW_ARENA} from '../src/harrow-arena';
test('a recovery truck and a fire tender park between the wall and the fence, north and south, along the ring',()=>{
  const posts=standbyPosts(HARROW_ARENA,()=>.3),r=HARROW_ARENA.radius+(HARROW_ARENA.fenceRadius-HARROW_ARENA.radius)*STANDBY.ring;
  assert.deepEqual(posts.map(p=>p.name),['recovery','fire']);
  for(const p of posts){assert.ok(Math.abs(Math.hypot(p.x,p.z)-r)<1e-9&&p.y===.3,'half way across the gap, on the ground');
    const fx=Math.sin(p.yaw),fz=Math.cos(p.yaw);assert.ok(Math.abs(fx*p.x+fz*p.z)<1e-6,'parked along the ring, not across it');}
  assert.ok(posts[0].z>0&&posts[1].z<0,'north and south, clear of the marshals on the diagonals');
  assert.deepEqual(standbyPosts({...HARROW_ARENA,outline:[{x:0,z:0},{x:1,z:0},{x:0,z:1}]},()=>0),[],'not round an outline arena');
  assert.deepEqual(standbyPosts({...HARROW_ARENA,fenceRadius:HARROW_ARENA.radius+STANDBY.gap-.1},()=>0),[],'no room');
  assert.equal(standbyPosts(HARROW_ARENA,()=>NaN)[0].y,0);
});
test('they stand taller than the wall: a boom and a light mast, light bars and beacons flashing in turn',()=>{
  assert.ok(beaconHalf(0)===0&&beaconHalf(STANDBY.flash+.01)===1&&beaconHalf(2*STANDBY.flash+.01)===0&&beaconHalf(NaN)===0);
  const scene=new T.Scene(),model=()=>{const g=new T.Group();g.add(new T.Mesh(new T.BoxGeometry(2,1.8,4.5).translate(0,.9,0)));return g;};
  const s=createStandby(scene,standbyPosts(HARROW_ARENA,()=>0),model,new T.Vector3());
  assert.ok(s.count===2&&s.group.parent===scene&&s.group.children.map(o=>o.name).join()==='standby_recovery,standby_fire');
  const recovery=s.group.children[0],fire=s.group.children[1],boom=recovery.getObjectByName('tow_boom')!,mast=fire.getObjectByName('light_mast')!;
  assert.ok(boom&&mast&&recovery.getObjectByName('light_bar')&&fire.getObjectByName('light_bar'));
  scene.updateMatrixWorld(true);const height=(o:T.Object3D)=>new T.Box3().setFromObject(o).max.y;
  assert.ok(height(boom)>1.8+1,'the boom rises well above the cab');assert.ok(height(mast)>1.8+STANDBY.mast.height-.01,'the mast stands up off the roof');
  const beacons:T.MeshStandardMaterial[]=[];s.group.traverse(o=>{const m=(o as T.Mesh).material as T.MeshStandardMaterial;if(m?.name==='Beacon')beacons.push(m);});
  s.update(0);const first=beacons.map(m=>m.emissiveIntensity);s.update(STANDBY.flash+.01);const second=beacons.map(m=>m.emissiveIntensity);
  assert.ok(first.some(v=>v===STANDBY.glow)&&second.some(v=>v===STANDBY.glow)&&first.some((v,i)=>v!==second[i]),'flashing in turn');
  s.dispose();assert.equal(s.group.parent,null);
});
test('main stands them by for an offline derby and clears them with the marshals',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(!attract&&mode==='derby'&&!online?.active&&!demo){standby?.dispose();{const arena=activeVenue.arena??DERBY_ARENA;standby=createStandby(scene,standbyPosts(arena,activeVenue.course.height)"));
  assert.ok(main.includes('marshals=[];standby?.dispose();standby=null;}')&&main.includes('  standby?.update(clock);\n'));
});

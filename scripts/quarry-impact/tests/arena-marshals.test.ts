import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {MARSHALS,marshalPosts,marshalFigure,poseMarshal,marshalFlag} from '../src/arena-marshals';
const arena={x:4,z:-2,radius:48,segments:96,spawnRadius:34,fenceRadius:53};
test('marshals stand between the barrier and the fence, up on their posts, facing the arena',()=>{
  const posts=marshalPosts(arena,(x,z)=>.3+x*.01);assert.equal(posts.length,MARSHALS.posts);
  let ok=true;for(const p of posts){const r=Math.hypot(p.x-arena.x,p.z-arena.z),toward=Math.atan2(arena.x-p.x,arena.z-p.z);
    ok&&=r>arena.radius&&r<arena.fenceRadius&&Math.abs(p.y-(.3+p.x*.01+MARSHALS.stand))<1e-9&&Math.abs(Math.sin(p.yaw-toward))<1e-9&&Math.cos(p.yaw-toward)>0;}
  assert.ok(ok,'outside the barrier, inside the fence, platform top, facing in');
  assert.ok(marshalPosts(arena,()=>NaN).every(p=>p.y===MARSHALS.stand),'no ground: from zero');
  assert.equal(marshalPosts({...arena,outline:[{x:0,z:0},{x:1,z:0},{x:0,z:1}]},()=>0).length,0,'a yard with an outline has none');
});
test('green as the heat starts, yellow for a wreck or a rolled car near the post, otherwise down',()=>{
  const post=marshalPosts(arena,()=>0)[0],near={x:post.x+5,z:post.z},far={x:post.x+MARSHALS.reach+5,z:post.z};
  const car=(at:{x:number;z:number},health:number,inverted=0)=>({current:at,health,inverted});
  assert.equal(marshalFlag(post,0,[car(near,0)]),'green');assert.equal(marshalFlag(post,MARSHALS.green-.01,[]),'green');
  assert.equal(marshalFlag(post,MARSHALS.green,[car(near,0)]),'yellow');assert.equal(marshalFlag(post,10,[car(near,50,1)]),'yellow','rolled');
  assert.equal(marshalFlag(post,10,[car(far,0)]),'down','too far to matter');assert.equal(marshalFlag(post,10,[car(near,80)]),'down','running cars');
  assert.equal(marshalFlag(post,NaN,[]),'down');
});
test('a marshal raises and waves the flag in its colour, or holds it down at the side',()=>{
  const m=marshalFigure(),arm=m.getObjectByName('marshal_arm')!,cloth=m.getObjectByName('marshal_flag') as T.Mesh,colour=()=>(cloth.material as T.MeshStandardMaterial).color.getHex();
  poseMarshal(m,'down',0);assert.ok(arm.rotation.z<.2&&m.userData.flag==='down');
  poseMarshal(m,'green',0);assert.ok(arm.rotation.z>2&&colour()===0x1fa84a);const a=arm.rotation.z;poseMarshal(m,'green',.2);assert.ok(arm.rotation.z!==a,'waving');
  poseMarshal(m,'yellow',1);assert.ok(arm.rotation.z>2&&colour()===0xf2c21b&&m.userData.flag==='yellow');
  poseMarshal(new T.Group(),'yellow',0);
  const platform=m.children.find(o=>o instanceof T.Mesh&&(o.geometry as T.BoxGeometry).parameters?.height===MARSHALS.stand);assert.ok(platform,'on a post platform');
});
test('main posts marshals once the event venue is active, offline derbies only, and flags them every frame',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  const activated=main.indexOf('activateVenue(targetVenue);'),posted=main.indexOf("marshals=marshalPosts(activeVenue.arena??DERBY_ARENA,activeVenue.course.height)");
  assert.ok(activated>0&&posted>activated,'after the venue switch');assert.ok(main.includes("if(!attract&&mode==='derby'&&!online?.active&&!demo)marshals=marshalPosts("));
  assert.ok(main.includes("for(const m of marshals)poseMarshal(m.figure,marshalFlag(m.post,elapsed,cars),clock);"));
  assert.ok(main.includes('  clearMarshals();\n'),'cleared with the cars');
});

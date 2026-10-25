import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {FLINCH,MARSHALS,marshalPosts,marshalFigure,poseMarshal,flinchesAt} from '../src/arena-marshals';
test('a heavy hit close to a post makes its marshal flinch; light or distant knocks do not',()=>{
  const post=marshalPosts({x:0,z:0,radius:48,segments:96,spawnRadius:34,fenceRadius:53},()=>0)[2];
  assert.ok(flinchesAt(post,post.x+5,post.z,FLINCH.damage));assert.ok(!flinchesAt(post,post.x+5,post.z,FLINCH.damage-.1),'a light knock');
  assert.ok(!flinchesAt(post,post.x+FLINCH.near+1,post.z,40),'too far');assert.ok(!flinchesAt(post,post.x,post.z,NaN));
});
test('flinching, the marshal crouches and leans back from the arena, off the platform\'s footing; then stands again',()=>{
  const m=marshalFigure(),body=m.getObjectByName('marshal_body')!,platform=m.children.find(o=>o instanceof T.Mesh)!,arm=m.getObjectByName('marshal_arm')!;
  const head=()=>{m.updateMatrixWorld(true);return body.children[3].getWorldPosition(new T.Vector3());};
  poseMarshal(m,'yellow',0,0);const stand=head(),plat=platform.position.clone();
  poseMarshal(m,'yellow',0,1);const duck=head();
  assert.ok(duck.y<stand.y-FLINCH.crouch*.8&&duck.z<stand.z-.1,'down and back (local +z faces the arena)');
  assert.ok(platform.position.equals(plat)&&m.userData.flinch===1,'the platform stays put');assert.ok(arm.rotation.z>2,'still flagging');
  poseMarshal(m,'yellow',0,0);assert.ok(head().distanceTo(stand)<1e-9,'standing again');poseMarshal(m,'down',0,NaN);assert.equal(m.userData.flinch,0);
  assert.ok(MARSHALS.stand>0);
});
test('main flinches marshals at heavy hits near their posts and eases them in and out',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('for(const m of marshals)if(flinchesAt(m.post,c.current.x,c.current.z,c.lastDamage))m.flinchFor=FLINCH.hold;}'),'on each new hit');
  assert.ok(main.includes('m.flinch+=((m.flinchFor>0?1:0)-m.flinch)*Math.min(1,dt*FLINCH.rate);'),'eased');
});

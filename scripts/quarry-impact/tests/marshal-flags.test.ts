import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {MARSHALS,marshalPosts,marshalFigure,poseMarshal,marshalFlag} from '../src/arena-marshals';
const arena={x:0,z:0,radius:48,segments:96,spawnRadius:34,fenceRadius:53};
test('red for a fire near the post, over yellow; chequered once the heat is won, over everything',()=>{
  const post=marshalPosts(arena,()=>0)[1],near={x:post.x-4,z:post.z};
  const car=(health:number,onFire=false,inverted=0)=>({current:near,health,inverted,onFire});
  assert.equal(marshalFlag(post,10,[car(0),car(40,true)]),'red','a fire beats a wreck');assert.equal(marshalFlag(post,10,[car(0)]),'yellow');
  assert.equal(marshalFlag(post,10,[{...car(60,true),current:{x:post.x+MARSHALS.reach+3,z:post.z}}]),'down','a fire too far off');
  assert.equal(marshalFlag(post,1,[car(40,true)],true),'chequered');assert.equal(marshalFlag(post,1,[]),'green');assert.equal(marshalFlag(post,10,[car(40,true)],false),'red');
});
test('the chequered flag is black and white squares, the others plain, and they all wave',()=>{
  const m=marshalFigure(),cloth=m.getObjectByName('marshal_flag') as T.Mesh,mat=cloth.material as T.MeshStandardMaterial,arm=m.getObjectByName('marshal_arm')!;
  poseMarshal(m,'chequered',0);assert.ok(mat.map instanceof T.DataTexture&&mat.color.getHex()===0xffffff&&arm.rotation.z>2,'squares, waved');
  const img=(mat.map as T.DataTexture).image as {data:Uint8Array;width:number};assert.ok(img.data[0]!==img.data[4],'alternating squares');
  poseMarshal(m,'red',0);assert.ok(mat.map===null&&mat.color.getHex()===0xd8261d&&arm.rotation.z>2,'plain red, waved');
  poseMarshal(m,'down',0);assert.ok(mat.map===null&&arm.rotation.z<.2);
});

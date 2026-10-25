import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {RAIN_PUDDLES,layRainPuddles,seeded,RainPuddles} from '../src/rain-puddles';
import {puddleDepth} from '../src/puddle-splashes';
import {HARROW_ARENA} from '../src/harrow-arena';
const flat=()=>.4;
test('an offline rain event lays its puddles across the arena floor, apart from each other and clear of the walls',()=>{
  const laid=layRainPuddles(HARROW_ARENA,flat,7);assert.equal(laid.length,RAIN_PUDDLES.count);
  for(const {puddle:p,variations} of laid){
    const d=Math.hypot(p.x-HARROW_ARENA.x,p.z-HARROW_ARENA.z);
    assert.ok(d+p.radius<=HARROW_ARENA.radius-2+1e-9&&d>=HARROW_ARENA.radius*RAIN_PUDDLES.inner[0]-1e-9,'on the floor inside the wall');
    assert.ok(p.radius>=RAIN_PUDDLES.radius[0]&&p.radius<=RAIN_PUDDLES.radius[1]&&p.aspect>=RAIN_PUDDLES.aspect[0]&&p.aspect<=RAIN_PUDDLES.aspect[1]);
    assert.ok(Math.abs(p.level-(.4+RAIN_PUDDLES.level))<1e-9&&p.id>=1000&&variations.length===33&&p.phases[1]===variations[7]);
  }
  for(let i=0;i<laid.length;i++)for(let j=i+1;j<laid.length;j++){const a=laid[i].puddle,b=laid[j].puddle;assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>=a.radius+b.radius+RAIN_PUDDLES.gap-1e-9,'apart');}
  assert.deepEqual(layRainPuddles(HARROW_ARENA,flat,7).map(l=>l.puddle),laid.map(l=>l.puddle),'the same for a seed');
  assert.notDeepEqual(layRainPuddles(HARROW_ARENA,flat,8).map(l=>l.puddle.x),laid.map(l=>l.puddle.x),'another event, another layout');
  const s=seeded(3),t=seeded(3);for(let i=0;i<5;i++){const v=s();assert.ok(v>=0&&v<1&&v===t());}
});
test('puddles stay off an island, inside an outline arena\'s walls, and off ground that cannot be read',()=>{
  const island=layRainPuddles({...HARROW_ARENA,island:12},flat,5);assert.ok(island.length>0&&island.every(({puddle:p})=>Math.hypot(p.x,p.z)>=12+p.radius+2-1e-9));
  const square=[{x:-20,z:-20},{x:20,z:-20},{x:20,z:20},{x:-20,z:20}],boxed=layRainPuddles({...HARROW_ARENA,radius:28,outline:square},flat,9);
  assert.ok(boxed.length>0&&boxed.every(({puddle:p})=>Math.abs(p.x)+p.radius<20&&Math.abs(p.z)+p.radius<20),'inside the walls');
  assert.equal(layRainPuddles(HARROW_ARENA,()=>NaN,1).length,0);
});
test('the puddles fill out while it rains, and wheels find them where the water is drawn',()=>{
  const scene=new T.Scene(),geometry=(r:number)=>new T.CircleGeometry(r,8),rain=new RainPuddles(scene,geometry,new T.MeshBasicMaterial(),new T.MeshBasicMaterial());
  const laid=layRainPuddles(HARROW_ARENA,flat,11);rain.lay(laid);const p=rain.list[0],full=laid[0].puddle.radius/RAIN_PUDDLES.start;
  assert.ok(rain.group.parent===scene&&rain.group.children.length===laid.length*2,'water and a damp margin for each');
  assert.ok(Math.abs(rain.fill-RAIN_PUDDLES.start)<1e-9&&Math.abs(p.radius-full*RAIN_PUDDLES.start)<1e-9,'part filled already');
  const water=rain.group.children[1] as T.Mesh;assert.ok(Math.abs(water.scale.x-RAIN_PUDDLES.start)<1e-9&&Math.abs(water.scale.y-p.aspect*RAIN_PUDDLES.start)<1e-9&&Math.abs(water.position.y-(p.level+.004))<1e-9);
  rain.update(10,false);assert.equal(rain.fill,RAIN_PUDDLES.start,'not without rain');
  for(let i=0;i<RAIN_PUDDLES.fill*20;i++)rain.update(.05,true);assert.ok(rain.fill===1&&Math.abs(p.radius-full)<1e-9,'full');
  assert.ok(puddleDepth(p,p.x,p.level,p.z)===1&&puddleDepth(p,p.x+p.radius*1.3,p.level,p.z)===0,'a wheel in the middle is in it, one beyond its edge is not');
  rain.clear();assert.ok(rain.list.length===0&&rain.group.children.length===0);rain.dispose();assert.equal(rain.group.parent,null);
});
test('main lays the puddles for an offline rain event on an arena, joins them to the venue\'s puddles and clears them after',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("  if(!lay||eventLighting!=='rain'||online?.active||!activeVenue.arena)return;")&&main.includes('activeVenue.puddles.push(...rainPuddles.list);puddleVenue=activeVenue;'));
  assert.ok(main.includes('if(mine.has(puddleVenue.puddles[i]))puddleVenue.puddles.splice(i,1);'),'taken back out for the next event');
  assert.ok(main.includes('  layEventPuddles(!attract);\n')&&main.indexOf('  layEventPuddles(!attract);')>main.indexOf("marshals=marshalPosts(activeVenue.arena??DERBY_ARENA"),'after the venue is active');
  assert.ok(main.includes("  rainPuddles?.update(dt*shower,eventLighting==='rain'&&state==='playing');"),'filling as hard as it rains');
});

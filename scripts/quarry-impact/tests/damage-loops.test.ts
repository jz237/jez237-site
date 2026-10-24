import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rubLoopLevel,groanLevel} from '../src/audio';
import {RUB,RUB_FIRE} from '../src/damage-handling';
test('a rubbing tyre is heard with the rub and the road speed, louder once it smokes',()=>{
 assert.equal(rubLoopLevel([0,RUB.warn-.01,0,0],20,0),0,'a light rub is silent');
 assert.equal(rubLoopLevel([0,.9,0,0],1,0),0,'at a crawl it is silent');
 assert.ok(Math.abs(rubLoopLevel([0,.5,0,0],5,0)-.25)<1e-9,'half speed, half the rub');
 assert.ok(rubLoopLevel([0,.6,0,0],12,RUB_FIRE.warn)>rubLoopLevel([0,.6,0,0],12,0),'smoking is louder');
 assert.ok(rubLoopLevel([1,1,1,1],40,99)<=1);
 assert.equal(groanLevel(0),0);assert.ok(Math.abs(groanLevel(.001)-.55)<.01);assert.equal(groanLevel(5),1);assert.equal(groanLevel(Number.NaN),0);
});
test('the rub and groan loops run per car on demand, offline, and glass and debris rotate takes too',()=>{
 const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(audio.includes("this.driveLoops(this.rubs,'tyre-rub',cars,listener,now,car=>rubLoopLevel(car.rubDrag,car.speed,Math.max(...car.rubHeat))"));
 assert.ok(audio.includes("this.driveLoops(this.groans,'metal-groan',cars,listener,now,car=>groanLevel(car.pinTime)"));
 assert.ok(audio.includes('if(!car.extendedDamage||car.health<=0||car.current.distanceTo(listener)>RATTLE.hearing)continue;const v=level(car);if(!(v>0))continue;'),'offline, in earshot, only when heard');
 assert.ok(audio.includes('if(now-q>LOOP_HOLD||!cars.some(c=>c.id===cid)){l.source.stop(now+.3);map.delete(cid);this.quietSince.delete(l);}'),'quiet loops are held then stopped');
 assert.ok(main.includes('sound.damageLoops(effectsActive&&!online?.active?cars:[],camera.position);'));
 assert.ok(audio.includes('const TAKES=/^(impact-(light|medium|heavy)|glass|debris)$/;'));
 const manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')) as {id:string;params:{loop:boolean};processing:string}[];
 for(const id of ['tyre-rub','metal-groan','glass-2','glass-3','debris-2','debris-3'])assert.ok(manifest.some(e=>e.id===id),id);
 assert.ok(manifest.find(e=>e.id==='metal-groan')!.processing.startsWith('first 0.7s cut'),'the early dropout is cut so the loop does not dip');
});

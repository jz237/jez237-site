import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {CRUNCH,crunchVolume} from '../src/litter-crunch';
import {LITTER,CrashLitter} from '../src/crash-litter';
test('a wheel crunches over enough chips at rolling speed, louder for more chips and more speed',()=>{
 assert.equal(crunchVolume(CRUNCH.min-1,10),0,'a stray chip is silent');assert.equal(crunchVolume(20,CRUNCH.speed-.1),0,'creeping is silent');
 assert.ok(crunchVolume(4,4)>0&&crunchVolume(4,4)<crunchVolume(8,8),'more chips, more speed, louder');assert.equal(crunchVolume(50,30),CRUNCH.volume,'capped');
 assert.equal(crunchVolume(8,-8),CRUNCH.volume,'reversing over it crunches too');assert.equal(crunchVolume(NaN,NaN),0);
});
test('the litter knows what lies under a wheel, and forgets chips as they are recycled',()=>{
 const litter=new CrashLitter(new T.Scene()),flat=()=>0;litter.scatter(new T.Vector3(10,1,-4),'glass',3,flat);
 const all=litter.under(10,-4,LITTER.glass.spread+.01);assert.equal(all,LITTER.glass.count,'every chip of the break is found around it');
 assert.ok(litter.under(10,-4,.3)>0&&litter.under(10,-4,.3)<all,'a wheel-sized patch finds some');assert.equal(litter.under(30,30,1),0,'nothing far away');assert.equal(litter.under(10,-4,0),0);
 for(let i=0;i<LITTER.capacity/LITTER.head.count+2;i++)litter.scatter(new T.Vector3(-50,1,-50),'head',i,flat);
 assert.equal(litter.under(10,-4,LITTER.glass.spread+.01),0,'recycled chips leave the floor index');litter.reset();assert.equal(litter.under(-50,-50,2),0);
});
test('offline cars crunch the recorded takes in turn when a wheel rolls over litter, and the clips are bundled',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')) as {id:string;file:string}[];
 assert.ok(main.includes("const v=crunchVolume(fx.litter.under(crunchAt.x,crunchAt.z,CRUNCH.radius),c.speed);if(v>0){sound.clip(crunchTake++%2?'glass-crunch-2':'glass-crunch',crunchAt,v,CRUNCH.duration);crunchClock.set(c,clock);break;}"));
 assert.ok(main.includes("if(!c.extendedDamage||clock-(crunchClock.get(c)??-9)<CRUNCH.gap)continue;"),'offline cars, no more often than CRUNCH.gap');
 for(const id of ['glass-crunch','glass-crunch-2']){const e=manifest.find(x=>x.id===id);assert.ok(e,id);assert.equal(readFileSync(new URL('../public/audio/'+e!.file,import.meta.url)).subarray(0,4).toString(),'OggS');}
});

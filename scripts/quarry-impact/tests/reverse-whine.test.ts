import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REVERSE_WHINE,TYRE_FLAP,STEAM_HISS} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('running-gear loops: reverse gears whine, blown tyres flap and burst radiators hiss, offline, recorded only',()=>{
 const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{loop:boolean}}[];
 for(const k of [REVERSE_WHINE,TYRE_FLAP,STEAM_HISS])assert.ok(k.level>0&&k.level<.5,'quiet beside the impacts');
 assert.ok(REVERSE_WHINE.full>REVERSE_WHINE.from&&TYRE_FLAP.full>TYRE_FLAP.from&&STEAM_HISS.hold>0);
 for(const id of ['reverse-whine','tyre-flap','steam-hiss']){const e=manifest.find(x=>x.id===id);assert.ok(e&&e.provider==='ElevenLabs'&&e.params.loop,id+' is a recorded loop');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS',id);}
 assert.ok(audio.includes("this.driveLoops(this.whines,'reverse-whine',cars,listener,now,car=>{const back=-car.speed;return back>=REVERSE_WHINE.from&&Math.abs(car.input?.throttle??0)>=REVERSE_WHINE.throttle?"),'backing up under power');
 assert.ok(audio.includes("car.blownOut.some((b,i)=>(b||car.tyreShred[i]>0)&&!car.wreckParts.wheelLost[i])?Math.min(1,v/TYRE_FLAP.full):0;"),'a blown or shredding tyre still on the car, at speed');
 assert.ok(audio.includes("this.driveLoops(this.hisses,'steam-hiss',cars,listener,now,car=>now-(this.steamSeen.get(car.id)?.at??-99)<STEAM_HISS.hold?1:0,()=>1,STEAM_HISS.level);"),'while the radiator is steaming');
 assert.ok(main.includes("    sound.runningLoops(effectsActive&&!online?.active?cars:[],camera.position);")&&main.includes("  if(studio)sound.runningLoops([],camera.position);"),'every frame offline, silenced in the garage');
});

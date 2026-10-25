import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REVERSE_WHINE,TYRE_FLAP,STEAM_HISS,TYRE_HISS,BRAKE_SQUEAL,BODY_CREAK} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('running-gear loops: reverse gears whine, blown tyres flap, burst radiators and punctured tyres hiss, offline, recorded only',()=>{
 const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{loop:boolean}}[];
 for(const k of [REVERSE_WHINE,TYRE_FLAP,STEAM_HISS])assert.ok(k.level>0&&k.level<.5,'quiet beside the impacts');
 assert.ok(REVERSE_WHINE.full>REVERSE_WHINE.from&&TYRE_FLAP.full>TYRE_FLAP.from&&STEAM_HISS.hold>0);
 for(const id of ['reverse-whine','tyre-flap','steam-hiss']){const e=manifest.find(x=>x.id===id);assert.ok(e&&e.provider==='ElevenLabs'&&e.params.loop,id+' is a recorded loop');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS',id);}
 assert.ok(audio.includes("this.driveLoops(this.whines,'reverse-whine',cars,listener,now,car=>{const back=-car.speed;return back>=REVERSE_WHINE.from&&Math.abs(car.input?.throttle??0)>=REVERSE_WHINE.throttle?"),'backing up under power');
 assert.ok(audio.includes("car.blownOut.some((b,i)=>(b||car.tyreShred[i]>0)&&!car.wreckParts.wheelLost[i])?Math.min(1,v/TYRE_FLAP.full):0;"),'a blown or shredding tyre still on the car, at speed');
 assert.ok(audio.includes("this.driveLoops(this.hisses,'steam-hiss',cars,listener,now,car=>now-(this.steamSeen.get(car.id)?.at??-99)<STEAM_HISS.hold?1:0,()=>1,STEAM_HISS.level);"),'while the radiator is steaming');
 assert.ok(TYRE_HISS.rate>1&&TYRE_HISS.level<STEAM_HISS.level,'a punctured tyre hisses higher and quieter than a radiator');
 assert.ok(audio.includes("this.driveLoops(this.leaks,'steam-hiss',cars,listener,now,car=>car.tyreDamage?.some((d,i)=>d>=TYRE_LEAK.onset&&d<TYRE_LEAK.flat&&!car.blownOut[i]&&!car.wreckParts.wheelLost[i])?1:0,()=>TYRE_HISS.rate,TYRE_HISS.level);"),'while a tyre still on the car goes down');
 assert.ok(main.includes("c.tyreDamage[wheel] = Math.max(c.tyreDamage[wheel], TYRE_LEAK_RANGE.onset + .05); return true;"),'__quarry.puncture for QA');
 assert.ok(BRAKE_SQUEAL.to>BRAKE_SQUEAL.from&&BRAKE_SQUEAL.level<.2);const sq=manifest.find(x=>x.id==='brake-squeal');assert.ok(sq&&sq.params.loop,'brake squeal is a recorded loop');
 assert.ok(audio.includes("return (car.input?.brake??0)>=BRAKE_SQUEAL.brake&&v>=BRAKE_SQUEAL.from&&v<=BRAKE_SQUEAL.to?Math.min(1,(BRAKE_SQUEAL.to-v)/(BRAKE_SQUEAL.to-BRAKE_SQUEAL.from)*1.4):0;},car=>.92+(car.id%5)*.04,BRAKE_SQUEAL.level);"),'hard braking at low speed, louder as it slows, each car its own pitch');
 assert.ok(BODY_CREAK.full>BODY_CREAK.pull&&BODY_CREAK.bent>0&&BODY_CREAK.rate>1,'a bent body creaks: the groan pitched up, only through real turns');
 assert.ok(audio.includes("this.driveLoops(this.creaks,'metal-groan',cars,listener,now,car=>{const bent=Math.max(0,...(car.structuralDamage??[0])),pull=Math.abs(car.body.angvel().y*car.speed);return bent>=BODY_CREAK.bent&&pull>=BODY_CREAK.pull?"),'bent past BODY_CREAK.bent and cornering past BODY_CREAK.pull');
 assert.ok(main.includes("    sound.runningLoops(effectsActive&&!online?.active?cars:[],camera.position);")&&main.includes("  if(studio)sound.runningLoops([],camera.position);"),'every frame offline, silenced in the garage');
});

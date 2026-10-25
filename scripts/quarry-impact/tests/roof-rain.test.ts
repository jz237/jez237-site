import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROOF_RAIN} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('rain drums on the roof heard from an in-car camera; an open cabin loses most of it; a recorded loop',()=>{
  const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{loop:boolean}}[];
  const e=manifest.find(x=>x.id==='roof-rain');assert.ok(e&&e.provider==='ElevenLabs'&&e.params.loop,'a recorded loop');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS');
  assert.ok(ROOF_RAIN.level>0&&ROOF_RAIN.level<.6&&ROOF_RAIN.open>0&&ROOF_RAIN.open<1);
  assert.ok(audio.includes("this.roofRain??=this.loop('roof-rain',this.fxBus!);")&&audio.includes("l.gain.gain.setTargetAtTime(ROOF_RAIN.level*Math.min(1,level),now,.25);"),'inside the cabin (not muffled by it), at its level');
  assert.ok(audio.includes("if(!(level>.01)){if(this.roofRain){this.roofRain.gain.gain.setTargetAtTime(0,now,.3);this.roofRain.source.stop(now+1.2);this.roofRain=undefined;}return;}"),'fades out and lets go when it stops');
  assert.ok(main.includes("sound.cabinRain(p&&effectsActive&&!online?.active&&!demo&&eventLighting==='rain'&&drivingCamera!=='chase'?1-ROOF_RAIN.open*Math.min(1,p.openness):0,p?.current??camera.position);"),'offline, raining, from inside the car');
  assert.ok(main.includes('sound.cabinWind(0,camera.position,0);sound.cabinRain(0,camera.position);sound.cabin(false,0);}'),'silent in the garage');
  assert.ok(read('tools/destruction-audio.py').toString().includes(" ('roof-rain', 'Heavy rain drumming on the metal roof and windscreen of a car, heard from inside the car cabin:"));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WET_TYRES} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('in the rain tyres swish over the wet road, brighter with speed, and barely squeal; a recorded loop',()=>{
  const audio=read('src/audio.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{loop:boolean;duration_seconds:number}}[];
  const e=manifest.find(x=>x.id==='wet-tyres');assert.ok(e&&e.provider==='ElevenLabs'&&e.params.loop,'a recorded loop');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS');
  assert.ok(WET_TYRES.full>WET_TYRES.from&&WET_TYRES.level>0&&WET_TYRES.level<.4&&WET_TYRES.squeal>0&&WET_TYRES.squeal<1&&WET_TYRES.rate[1]>WET_TYRES.rate[0]);
  assert.ok(audio.includes("this.driveLoops(this.swishes,'wet-tyres',cars,listener,now,car=>{const v=Math.abs(car.speed);return this.raining&&v>=WET_TYRES.from&&[0,1,2,3].some(i=>car.controller.wheelIsInContact(i))?"),'raining, rolling, on the ground');
  assert.ok(audio.includes('  rain(on:boolean){\n    this.raining=on;\n'),'the event rain sets it, before the audio is even ready');
  assert.ok(audio.includes("if (grounded && car.slip > 3 && prior.slip <= 3 && !(this.raining && car.extendedDamage))\n          this.shot('skid', car.current, 0.16);"),'no skid shot on a wet road');
  assert.ok(audio.includes("(car.surface === 'asphalt' ? 1 : 0.3) * (this.raining && car.extendedDamage ? WET_TYRES.squeal : 1);"),'the squeal loop down to a fraction');
  assert.ok(read('src/main.ts').toString().includes("  sound.rain(eventLighting==='rain'&&state!=='menu');\n"),'the rain is kept on every frame: applyEventLighting runs while still in the menu');
  assert.ok(read('tools/destruction-audio.py').toString().includes(" ('wet-tyres', 'Constant road noise of car tyres on a flooded wet asphalt road at speed,"),'prompt kept with the tool');
});

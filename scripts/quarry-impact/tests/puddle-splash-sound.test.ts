import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPLASH_SOUND,splashVolume} from '../src/puddle-splash-sound';
test('a tyre ploughing into a puddle at speed splashes, louder the deeper and faster; creeping in does not',()=>{
  assert.equal(splashVolume(1,SPLASH_SOUND.speed-.1),0,'too slow');assert.equal(splashVolume(0,20),0,'no water');
  assert.ok(splashVolume(.2,10)>0&&splashVolume(.2,10)<splashVolume(1,20),'harder, louder');
  assert.equal(splashVolume(5,30),SPLASH_SOUND.volume,'never louder than full');assert.equal(splashVolume(1,-20),splashVolume(1,20),'reversing too');
  assert.equal(splashVolume(NaN,20),0);assert.equal(splashVolume(1,NaN),0);
  assert.ok(SPLASH_SOUND.gap<.15,'short enough that the back wheels splash after the front at speed');
});
test('the two recorded takes are in the audio and main plays them in turn where the tyre hits the water',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')),ids=(Array.isArray(manifest)?manifest.map((m:{id:string})=>m.id):Object.keys(manifest)) as string[];
  for(const id of SPLASH_SOUND.clips)assert.ok(ids.includes(id),id);
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('const wet=c.waterDrag[i]>0,hit=wet&&!before[i];before[i]=wet;if(!hit||clock-(splashClock.get(c)??-9)<SPLASH_SOUND.gap)continue;'),'on entering the water');
  assert.ok(main.includes('sound.clip(SPLASH_SOUND.clips[splashTake++%2],splashAt,v,SPLASH_SOUND.duration)'),'the takes in turn, at the wheel');
  assert.ok(main.includes("  if(state==='playing')for(const c of cars){if(!c.extendedDamage)continue;const before=wheelsWet.get(c)"),'offline play');
});

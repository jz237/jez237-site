import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CROWD_CHEER} from '../src/audio';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)).toString();
test('recorded loops stand in for the synthesized ones at the same level, the synths kept as fallbacks',()=>{
 const manifest=JSON.parse(read('public/audio/manifest.json')) as {id:string;params:{loop:boolean};processing:string}[];
 for(const [id,rms] of [['horn-stuck','-13.2'],['starter','-13.5'],['gear-grind','-14.3'],['squeal','-17.4'],['growl','-29.1']]){
  const e=manifest.find(x=>x.id===id);assert.ok(e,id);assert.equal(e!.params.loop,true,id);assert.ok(e!.processing.includes(`RMS matched to ${rms} dBFS`),id);}
 const audio=read('src/audio.ts');
 assert.ok(audio.includes("if(!this.buffers.has('starter')){")&&audio.includes("if(!this.buffers.has('gear-grind')){"),'synthesized only when the recording is missing');
 assert.ok(audio.includes("if(!this.buffers.has('squeal')){")&&audio.includes("if(!this.buffers.has('growl')){"));
 assert.ok(audio.includes("if(hornId==='horn'&&!this.buffers.has('horn')){"));
});
test('the recorded crowd roar plays at full level for its intensity, level with the synthesized roar',()=>{
 assert.equal(CROWD_CHEER.level,1);
 assert.ok(read('src/audio.ts').includes('gain.gain.value=Math.min(1,CROWD_CHEER.level*intensity);'));
});

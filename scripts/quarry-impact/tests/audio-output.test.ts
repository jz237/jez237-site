import test from 'node:test';import assert from 'node:assert/strict';
import {Sound} from '../src/audio';import {readAudioOutput} from '../src/audio-output';
import {exportSave,readSave} from '../src/save-backup';
test('legacy and invalid preferences default to the existing speaker mix',()=>{
 for(const value of [undefined,null,'surround','constructor',{},5])assert.equal(readAudioOutput(value),'speakers');
 for(const value of ['speakers','headphones','mono'])assert.equal(readAudioOutput(value),value);
});
test('output switches existing voices and mono master without resetting volume or mute',()=>{
 const sound=new Sound(),pan={panningModel:'equalpower'};sound.master={gain:{value:.42}}as any;sound.loops.set(0,new Map([['idle',{pan} as any]]));sound.ambient={pan:{panningModel:'equalpower'}}as any;
 sound.setOutput('headphones');assert.equal(pan.panningModel,'HRTF');assert.equal(sound.ambient!.pan.panningModel,'HRTF');assert.equal(sound.master!.channelCount,2);
 sound.mute();sound.setOutput('mono');assert.equal(sound.master!.channelCount,1);assert.equal(sound.master!.channelCountMode,'explicit');assert.equal(sound.master!.channelInterpretation,'speakers');assert.equal(sound.master!.gain.value,0);assert.equal(sound.muted,true);assert.equal(pan.panningModel,'equalpower');
 sound.setOutput('speakers');assert.equal(sound.master!.channelCount,2);assert.equal(sound.master!.gain.value,0);
});
test('new loops and in-flight one-shots follow the selected output',()=>{
 const sound=new Sound();sound.ready=true;sound.buffers.set('clip',{duration:2}as any);
 const sources:any[]=[],panners:any[]=[];const chain=()=>({connect(node:any){return node;},disconnect(){}});
 sound.ctx={currentTime:0,createBufferSource(){const source={...chain(),playbackRate:{value:1},start(){},stop(){}};sources.push(source);return source;},createGain:()=>({...chain(),gain:{value:0}}),createPanner(){const pan={...chain(),positionX:{value:0},positionY:{value:0},positionZ:{value:0}};panners.push(pan);return pan;}}as any;sound.fxBus=chain()as any;
 sound.setOutput('headphones');const loop=sound.loop('clip',sound.fxBus!);assert.equal(loop!.pan.panningModel,'HRTF');
 sound.shot('clip',{x:0,y:0,z:0}as any,.2);assert.equal(panners[1].panningModel,'HRTF');sound.setOutput('mono');assert.equal(panners[1].panningModel,'equalpower');sources[1].onended();sound.setOutput('headphones');assert.equal(panners[1].panningModel,'equalpower','ended voice removed from live registry');assert.equal(sound.activeVoices,0);
});
test('signed backups preserve output choice and retain older settings without adding fields',async()=>{
 const values=new Map<string,string>(),storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key)};
 for(const output of [undefined,'speakers','headphones','mono']){
  values.set('quarry-impact-v1',JSON.stringify({engine:.6,...output?{audioOutput:output}:{}}));
  const saved=await exportSave(storage);const parsed=await readSave(saved);assert.equal(JSON.parse(parsed.entries['quarry-impact-v1']!).audioOutput,output);
 }
 values.set('quarry-impact-v1',JSON.stringify({audioOutput:'surround'}));await assert.rejects(()=>exportSave(storage),/audio output/);
});

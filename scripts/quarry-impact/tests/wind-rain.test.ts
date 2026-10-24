import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)).toString();
test('the cabin wind and the rain are recorded loops, level-matched, with the synthesized ones as fallbacks',()=>{
 const manifest=JSON.parse(read('public/audio/manifest.json')) as {id:string;params:{loop:boolean};processing:string}[];
 for(const [id,rms] of [['wind','-20.3'],['rain','-17.7']]){const e=manifest.find(x=>x.id===id);assert.ok(e,id);assert.equal(e!.params.loop,true);assert.ok(e!.processing.includes(`RMS matched to ${rms} dBFS`),id);}
 const audio=read('src/audio.ts');
 assert.ok(audio.includes("if(!this.buffers.has('wind')){"),'wind is synthesized only when the recording is missing');
 assert.ok(audio.includes("const recorded=this.buffers.get('rain');")&&audio.includes('if(recorded){const source=c.createBufferSource();source.buffer=recorded;source.loop=true;'),'the recorded rain first');
 assert.ok(audio.includes('const length=c.sampleRate*3,buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);let b=0;'),'the synthesized hiss stays as the fallback');
});

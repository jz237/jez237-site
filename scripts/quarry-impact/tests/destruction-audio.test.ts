import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root));
const ids=['backfire','tyre-blowout','rod-bang','engine-seize','extinguisher','bump-start','spring-snap','shaft-snap','mirror-snap','battery-rip','crowd-cheer','horn-stuck'];
test('the twelve ElevenLabs destruction clips are bundled, recorded and hash-checked',()=>{
 const manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;runtimeSha256?:string;params:{text:string;loop:boolean}}[];
 assert.equal(manifest.length,62);
 for(const id of ids){const e=manifest.find(x=>x.id===id);assert.ok(e,id);assert.equal(e!.provider,'ElevenLabs');assert.ok(/no music/i.test(e!.params.text)&&/speech/i.test(e!.params.text),'prompt rules out music and speech: '+id);
  const ogg=read('public/audio/'+e!.file);assert.equal(ogg.subarray(0,4).toString(),'OggS',id);assert.equal(createHash('sha256').update(ogg).digest('hex'),e!.runtimeSha256,id);}
 assert.equal(manifest.find(x=>x.id==='horn-stuck')!.params.loop,true,'the horn loops');
 assert.ok(existsSync(new URL('tools/destruction-audio.py',root)));
});
test('each event plays its own clip, with the old sound kept as the fallback',()=>{
 const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString();
 for(const [what,id] of [['spring','spring-snap'],['shaft','shaft-snap'],['rod','rod-bang'],['battery','battery-rip']])assert.ok(new RegExp(`${what}:\\{id:'${id}'`).test(audio),what);
 assert.ok(audio.includes("if(clip&&this.buffers.has(clip.id)){this.shot(clip.id,p,clip.volume,{rate:clip.rate,delay:0,duration:clip.duration});return;}"),'falls back when a clip is missing');
 assert.ok(audio.includes("if(this.buffers.has('backfire'))this.shot('backfire',")&&audio.includes("if(this.buffers.has('tyre-blowout'))this.shot('tyre-blowout',"));
 assert.ok(audio.includes("const hornId=this.buffers.has('horn-stuck')?'horn-stuck':'horn';")&&audio.includes('l=this.loop(hornId,this.fxBus);'));
 assert.ok(audio.includes("const cheer=this.buffers.get('crowd-cheer')")&&audio.includes('now-this.cheerAt>=CROWD_CHEER.gap'),'the recorded roar, no more than every few seconds');
 assert.ok(main.includes('sound.breakage(what,car.current);'));
 assert.ok(main.includes("if(!sound.clip('engine-seize',p,.8,1.6))")&&main.includes("if(!sound.clip('extinguisher',p.current,.75,1.3))")&&main.includes("sound.clip('bump-start',car.current,.7,1.8);")&&main.includes("if(!sound.clip('mirror-snap',at,.8,.6))"));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARENA_HORN} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('the arena air horn sounds over the PA as each offline derby heat goes green, the two recorded takes in turn',()=>{
 const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{text:string}}[];
 assert.ok(ARENA_HORN.level>0&&ARENA_HORN.level<=.6,'loud, not deafening');
 for(const id of ARENA_HORN.ids){const e=manifest.find(x=>x.id===id);assert.ok(e&&e.provider==='ElevenLabs'&&/no speech/i.test(e.params.text),id);assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS',id);}
 assert.ok(audio.includes("source.buffer=this.buffers.get(ids[Math.abs(Math.floor(Number.isFinite(heat)?heat:0))%ids.length])!;")&&audio.includes("source.connect(gain).connect(this.ambientBus);source.start();return true;"),'one take per heat, on the ambience bus (not placed in the world)');
 assert.ok(audio.includes("const ids=ARENA_HORN.ids.filter(id=>this.buffers.has(id));if(!ids.length)return false;"),'silent when the clips are missing');
 const start=main.indexOf("toast(mode === 'derby' ? 'MAKE AN IMPACT' : 'GREEN LIGHT', 2);");assert.ok(start>0&&main.indexOf("if(mode==='derby'&&!demo){if(sound.arenaHorn(hornHeats))hornHeats++;}")>start,'at the green, not in demos');
});

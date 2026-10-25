import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CROWD_GASP} from '../src/audio';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
test('the crowd gasps when a car rolls over or blows up: two recorded takes in turn, not too often, offline',()=>{
 const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;params:{text:string}}[];
 assert.ok(CROWD_GASP.gap>=3&&CROWD_GASP.level>0&&CROWD_GASP.level<=1);
 for(const id of CROWD_GASP.ids){const e=manifest.find(x=>x.id===id);assert.ok(e&&e.provider==='ElevenLabs'&&/wordless/i.test(e.params.text)&&/no individual words or speech/i.test(e.params.text),id+': a wordless crowd');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS');}
 assert.ok(audio.includes("if(!ids.length||now-this.gaspAt<CROWD_GASP.gap)return false;this.gaspAt=now;")&&audio.includes("source.buffer=this.buffers.get(ids[this.gaspTake++%ids.length])!;"),'takes in turn, no more often than the gap');
 assert.ok(main.includes("if((c.rolls>seen.rolls||c.blownUp&&!seen.blown)&&sound.crowdGasp())gasps++;"),'on a new roll or a blow-up');
});

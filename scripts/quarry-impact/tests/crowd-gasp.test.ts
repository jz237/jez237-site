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
test('the crowd boos the player for a real hit on a car that is already out (bad form at a derby), offline',async()=>{
 const {CROWD_BOO}=await import('../src/audio');const audio=read('src/audio.ts').toString(),main=read('src/main.ts').toString(),manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;params:{text:string}}[];
 const e=manifest.find(x=>x.id===CROWD_BOO.id);assert.ok(e&&/wordless/i.test(e.params.text),'a recorded wordless boo');assert.equal(read('public/audio/'+e!.file).subarray(0,4).toString(),'OggS');
 assert.ok(CROWD_BOO.closing>=3&&CROWD_BOO.gap>=5,'a real hit, not a nudge, and not every touch');
 assert.ok(audio.includes("const now=this.ctx.currentTime;if(now-this.booAt<CROWD_BOO.gap)return false;this.booAt=now;"));
 assert.ok(main.includes("      if(b?.id===0&&before<=0)hitTheWreck(closing);")&&main.includes("      if(a?.id===0&&before<=0)hitTheWreck(closing);"),'either side of a contact: the player hitting a car whose health was already gone');
 assert.ok(main.includes("function hitTheWreck(closing:number){if(online?.active||demo||closing<CROWD_BOO.closing)return;if(sound.crowdBoo()){boos++;toast('THE CROWD BOOS · THAT CAR WAS OUT',1.4);}}"));
});
test('the player can sound their horn with H: a short honk of the recorded horn, once per press, only while playing',()=>{
 const main=read('src/main.ts').toString();
 assert.ok(main.includes("if(e.code==='KeyH'&&!demo&&state==='playing'&&!e.repeat&&cars[0]){if(sound.clip('horn-stuck',cars[0].current,HONK.volume,HONK.length))honks++;}"),'a press, not a held repeat; not in demos (where H hides the HUD)');
 assert.ok(main.includes("const HONK={length:.45,volume:.7} as const;"));
});

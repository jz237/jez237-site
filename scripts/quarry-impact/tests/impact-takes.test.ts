import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root));
test('each impact clip has two more recorded takes, bundled and hash-checked',()=>{
 const manifest=JSON.parse(read('public/audio/manifest.json').toString()) as {id:string;file:string;provider:string;runtimeSha256?:string;params:{duration_seconds:number}}[];
 for(const base of ['impact-light','impact-medium','impact-heavy']){const original=manifest.find(x=>x.id===base)!;
  for(const take of [base+'-2',base+'-3']){const e=manifest.find(x=>x.id===take);assert.ok(e,take);assert.equal(e!.provider,'ElevenLabs');
   assert.equal(e!.params.duration_seconds,original.params.duration_seconds,'same length as the original: '+take);
   assert.equal(createHash('sha256').update(read('public/audio/'+e!.file)).digest('hex'),e!.runtimeSha256,take);}}
});
test('every use of an impact clip rotates through its takes and never plays one take twice running',()=>{
 const audio=read('src/audio.ts').toString();
 assert.ok(audio.includes('const IMPACT_TAKES=/^impact-(light|medium|heavy)$/;'));
 assert.ok(audio.includes('if (IMPACT_TAKES.test(id)) id = this.impactTake(id);'),'in shot(), so direct uses rotate too');
 assert.ok(audio.includes('const key = group + Math.round(p.x / 5) + Math.round(p.z / 5);'),'takes of one hit share the repeat guard');
 assert.ok(audio.includes("const takes=[id,id+'-2',id+'-3'].filter(t=>this.buffers.has(t));if(takes.length<2)return id;"));
 assert.ok(audio.includes('let i=Math.floor(Math.random()*(last<0?takes.length:takes.length-1));if(last>=0&&i>=last)i++;'),'skips the take just played');
});

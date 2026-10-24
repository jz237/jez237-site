import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RATTLE} from '../src/damage-rattle';
const root=new URL('../',import.meta.url),read=(p:string)=>readFileSync(new URL(p,root)).toString();
test('every rattle variant and the thump are recorded, short and level-matched, so none falls silent',()=>{
 const manifest=JSON.parse(read('public/audio/manifest.json')) as {id:string;processing:string}[];
 const ids=[...Array.from({length:RATTLE.variants},(_,k)=>'rattle-'+k),'thump'];
 for(const id of ids){const e=manifest.find(x=>x.id===id);assert.ok(e,id);assert.ok(/s kept, /.test(e!.processing)&&e!.processing.includes('RMS matched'),id);}
 // audio.damageBuffers() synthesizes nothing once 'thump' has loaded, so a recorded thump needs every recorded variant.
 assert.ok(read('src/audio.ts').includes("if(this.buffers.has('thump'))return true;"));
 assert.equal(manifest.filter(e=>/^rattle-\d$/.test(e.id)).length,RATTLE.variants);
});

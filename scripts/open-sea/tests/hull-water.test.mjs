import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import zlib from 'node:zlib';
import {hullSolidGap,hullSection} from '../../../demos/open-sea/js/hull-water.js';
test('solid envelope contains the exported Blender hull, including its folded rake',()=>{
 const root=new URL('../../../demos/open-sea/assets/',import.meta.url),meta=JSON.parse(fs.readFileSync(new URL('schooner.json',root))),bin=zlib.gunzipSync(fs.readFileSync(new URL('schooner.bin.gz',root))),g=meta.groups.hull;
 let count=0,maxError=0,inside=0,outside=0;const errors=[];
 for(let i=0;i<g.vertexCount;i++){
  const off=g.vertexOffset+i*44;if(bin.readFloatLE(off+32)!==0)continue;
  const p=[0,1,2].map(k=>bin.readFloatLE(off+k*4)),n=[0,1,2].map(k=>bin.readFloatLE(off+(k+3)*4));
  const gap=hullSolidGap(p);maxError=Math.max(maxError,gap);count++;
  if(gap>.015)errors.push({p,gap,section:hullSection(p[0],p[1])});
  if(hullSolidGap(p.map((v,k)=>v-n[k]*.08))<0)inside++;
  if(hullSolidGap(p.map((v,k)=>v+n[k]*.08))>0)outside++;
 }
 if(errors.length)console.log(JSON.stringify({count,inside,outside,worst:errors.sort((a,b)=>b.gap-a.gap).slice(0,4)}));
 assert.ok(count>10000);assert.ok(maxError<.015,`Mesh boundary error ${maxError}`);assert.ok(inside/count>.98,`Inside ${inside}/${count}`);assert.ok(outside/count>.98,`Outside ${outside}/${count}`);
 console.log({hullSamples:count,maxError,inside,outside});
});
test('closed volume excludes immersion but preserves water that overtops the deck',()=>{
 for(const x of [-22,-18,-3,7,17,22]){
  const section=hullSection(x,0);assert.ok(hullSolidGap([x,0,section.width*.5])<0);
  assert.ok(hullSolidGap([x,section.top+.2,0])>0);
  assert.ok(hullSolidGap([x,0,section.width+.2])>0);
 }
 for(const p of [[-25,0,0],[24,0,0],[21,-4,0],[0,-4,0]])assert.ok(hullSolidGap(p)>0);
 for(const p of [[-10.8,4,0],[2.7,3.3,0],[12,3.3,0]])assert.ok(hullSolidGap(p)<0,'Closed deckhouses exclude interior water');
});

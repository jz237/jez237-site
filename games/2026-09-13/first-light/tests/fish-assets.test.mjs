import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {ROSTER} from '../species.js';
const dir=path.join(path.dirname(fileURLToPath(import.meta.url)),'..','assets','fish');
test('every roster species ships a photo profile, a dorsal texture where the reference allowed one, and stays under the deploy caps',()=>{
 let total=0,withTop=0;
 for(const id of ROSTER){
  const p=JSON.parse(fs.readFileSync(path.join(dir,id,'profile.json'),'utf8'));
  assert.equal(p.stations.length,64,id+' stations');assert.equal(typeof p.hasTop,'boolean',id+' hasTop');
  for(let i=1;i<64;i++)assert.ok(p.stations[i].s>p.stations[i-1].s,id+' stations ascend');
  for(const st of p.stations.slice(16,48)){
   assert.ok(st.top>st.bottom&&st.halfWidth>0&&st.texTop<st.texBottom,id+' body station '+st.s);
   if(p.hasTop)assert.ok(st.topHalf>0&&st.topMid-st.topHalf>=0&&st.topMid+st.topHalf<=1,id+' dorsal rows inside the top image at '+st.s);
  }
  for(const f of ['flank.webp','fins.webp'])assert.ok(fs.existsSync(path.join(dir,id,f)),id+' '+f);
  assert.equal(fs.existsSync(path.join(dir,id,'top.webp')),p.hasTop,id+' top.webp matches hasTop');
  if(p.hasTop){withTop++;assert.equal(p.topTint.length,3,id+' tint');for(const v of p.topTint)assert.ok(v>=.35&&v<=3,id+' tint '+v);}
  for(const f of fs.readdirSync(path.join(dir,id))){const sz=fs.statSync(path.join(dir,id,f)).size;assert.ok(sz<25*1024*1024,id+' '+f+' under the 25 MiB deploy cap');total+=sz;}
 }
 assert.ok(withTop>=10,'ten of twelve have a usable dorsal photo, got '+withTop);
 assert.ok(total<45*1024*1024,'fish assets under 45 MB, got '+total);
});

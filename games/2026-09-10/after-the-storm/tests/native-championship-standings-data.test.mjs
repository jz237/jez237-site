import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNativeChampionshipStandingsMenuWords as createWords,nativeChampionshipStandingsSourceViews as views,NATIVE_CHAMPIONSHIP_STANDINGS_DATA as data} from '../native-championship-standings-data.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-data.json',import.meta.url)));
function saved(){const b=new DataView(new ArrayBuffer(136));for(let a=0;a<8;a++){
 for(const[i,c]of [...`NAME ${a}`].entries())b.setUint8(24+a*14+i,c.charCodeAt(0));
 for(let i=11;i<14;i++)b.setUint8(24+a*14+i,255);
}return {saveWordsB280:Array.from({length:34},(_,i)=>b.getUint32(i*4))};}
test('fresh semantic standings storage and metadata match original loaded numeric data',()=>{
 const a=createWords(),b=createWords();assert.deepEqual(a.slice(0,14),source.loadedNumericWords);
 assert.deepEqual(data.digitWidths6d70,source.digitWidths6d70);assert.deepEqual(data.requiredPointsAbbc,source.requiredPointsAbbc);
 a[0]=0;a[67]=17;assert.equal(b[0],320<<16);assert.equal(b[67],0);assert.equal(b.length,68);
 assert.ok(Object.isFrozen(data.requiredPointsAbbc[0]));
});
test('names come from retained base-avatar save records without tuning or alternate-name bytes',()=>{
 const s=saved(),before=structuredClone(s),a=[3,1,0,2],q=views(s,a);
 assert.deepEqual(q.riderNamesB298,['NAME 0','NAME 1','NAME 2','NAME 3']);assert.deepEqual(q.avatarsA9b0,a);
 a[0]=0;assert.equal(q.avatarsA9b0[0],3);assert.deepEqual(s,before);assert.ok(Object.isFrozen(q.riderNamesB298));
 const bytes=new DataView(new ArrayBuffer(136));s.saveWordsB280.forEach((v,i)=>bytes.setUint32(i*4,v));
 for(let i=0;i<11;i++)bytes.setUint8(24+i,65);s.saveWordsB280=Array.from({length:34},(_,i)=>bytes.getUint32(i*4));
 assert.throws(()=>views(s,[0,1,2,3]),/terminator/);assert.throws(()=>views(before,[0,0,2,3]),/four selected avatars/);
});

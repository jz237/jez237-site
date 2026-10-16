import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeResultsRecordView as view} from '../native-results-record-view.js';
const ri=a=>(a-0x1f94)/4;
function fixture(){const state={raceWords1f94:Array(1693).fill(0),profileWordsB330:[0,0,2],scene:{courseIndex:2,reverseDab68:0,primaryHumanIndex:1,metadataCb32c:1}};
 const write=(a,values)=>values.forEach((v,i)=>state.raceWords1f94[ri(a)+i]=v);
 for(let i=0;i<3;i++)write(0x1ff0+2*60+i*20,[65000+i*100,3-i,i%2,i,0x41420000+i*0x10000]);
 write(0x22c0+2*20,[21000,2,0,1,0x4c415000]);write(0x23b0+2*20,[78000,1,1,2,0x52455600]);
 write(0x2ad4+888,[82000]);return {state,write};}
test('ordinary course rows use20-byte records and60-byte course stride with alternate offsets',()=>{
 const {state,write}=fixture();write(0x2650,[2]);write(0x2654,[1]);const before=structuredClone(state),q=view(state);
 assert.deepEqual(q.rows.map(r=>r.timeMs),[65000,65100,65200,21000]);assert.deepEqual(q.rows.map(r=>r.initials),['AB','AC','AD','LAP']);
 assert.deepEqual(q.rows.map(r=>r.offset),['xA','xB','xA','xB']);assert.deepEqual(q.rows.map(r=>r.highlight),['none','current','none','record']);
 assert.deepEqual(q.rows.map(r=>r.rider),[3,2,1,2]);assert.deepEqual(q.rows.map(r=>r.tuned),[false,true,false,false]);assert.deepEqual(state,before);
});
test('unranked current row reads the actual primary slot clock and pushes best lap to opposite side',()=>{
 const {state}=fixture(),q=view(state,{ridersBySlot:[0,3]});
 assert.equal(q.rows.length,5);assert.deepEqual(q.rows[3],{kind:'current',offset:'xB',highlight:'current',timeMs:82000,rider:3,tuned:true,difficulty:2,initials:''});
 assert.equal(q.rows[4].offset,'xA');assert.throws(()=>view(state),/current results rider/);
});
test('reverse reads one row and emits placeholders without reading ordinary record metadata',()=>{
 const {state,write}=fixture();state.scene.reverseDab68=65535;write(0x2650,[3]);const q=view(state);
 assert.equal(q.rows[0].timeMs,78000);assert.equal(q.rows[0].initials,'REV');assert.equal(q.rows[0].highlight,'record');
 assert.deepEqual(q.rows.slice(1).map(r=>r.placeholder),[true,true,true]);assert.equal(q.rows[3].highlight,'none');
});
test('first place is highlighted as a record and reading is bounded to the selected course',()=>{
 const {state,write}=fixture();write(0x2650,[1]);assert.equal(view(state).rows[0].highlight,'record');
 state.scene.courseIndex=12;assert.throws(()=>view(state),RangeError);
});

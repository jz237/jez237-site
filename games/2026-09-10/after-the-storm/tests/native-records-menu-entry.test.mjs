import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const neutral={heldButtons:0,rawXNative:0,rawYNative:0};

test('the menu enters the original records browser through EC304 then EC500 and Back returns to menu60',()=>{
 const L=createRace({mode:'time',physics:'native',course:getCourse('greyhaven',0),rider:1}).nativeLaunch;
 assert.equal(L.recordsBrowserView().active,false);
 const entry=L.enterRecordsBrowser(),g=L.snapshot().scene;
 assert.deepEqual([g.gameStateAb24,g.main638,g.previousGameState634,g.initLatch63c],[66,12,60,1]);
 assert.deepEqual(entry.effects.map(e=>e.consumer),['800c21f4','80096960']);
 let q=L.advanceRecordsBrowser(neutral);assert.equal(q.draw.kind,'black');
 q=L.advanceRecordsBrowser(neutral);assert.equal(q.draw.kind,'records');
 assert.equal(L.recordsBrowserView().postRace,false);assert.equal(L.recordsBrowserView().course,10,'free browsing opens on the overview');
 // Select the time category, choose a course and open its records.
 const press=(mask,frames=15)=>{q=L.advanceRecordsBrowser({...neutral,heldButtons:mask});for(let i=0;i<frames&&!q.handoff;i++)q=L.advanceRecordsBrowser(neutral);};
 press(0x8000);press(0x400);press(0x8000);
 assert.equal(L.recordsBrowserView().recordType,1);assert.ok(q.draw.records.commands.some(c=>c.kind==='riderPreview'));
 for(let i=0;i<6&&!q.handoff;i++)press(0x4000);
 assert.equal(q.handoff?.destination,'menu60');assert.equal(L.snapshot().scene.gameStateAb24,60);
 assert.throws(()=>L.advanceRecordsBrowser(neutral),/No records browser/);
});

test('a championship launch does not open free browsing',()=>{
 const L=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven',0),difficulty:0,rider:0}).nativeLaunch;
 assert.throws(()=>L.enterRecordsBrowser(),/Championship records/);
});

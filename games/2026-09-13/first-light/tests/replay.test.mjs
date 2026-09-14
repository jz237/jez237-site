import test from 'node:test';import assert from 'node:assert/strict';
import {REPLAY,createRecorder,record,freeze,frameAt,shotFor,replayCamera,replayLine} from '../replay-model.js';
const sample=(i)=>({x:i*.5,y:-1+i*.01,z:0,heading:.1*i,state:i<20?'STRIKE':'RUN',lure:{x:i*.5+.2,y:-1,z:0},tension:.5});
test('the recorder keeps ten samples a second for forty seconds, and the freeze rebases time to the first one',()=>{
 const rec=createRecorder();let kept=0;for(let i=0;i<1000;i++){if(record(rec,100+i*.05,sample(i)))kept++;} // fifty seconds
 assert.ok(kept>=499&&kept<=501,'throttled to 10 Hz: '+kept);assert.ok(rec.samples[0].t>=100+10-.2,'older than forty seconds dropped');
 const r=freeze(rec,{species:'largemouth'});assert.equal(r.samples[0].t,0);assert.ok(Math.abs(r.duration-REPLAY.keepSeconds)<.3);assert.equal(rec.samples.length,0,'the recorder is empty again');assert.equal(freeze(rec),null,'nothing to freeze twice');
});
test('playback interpolates between samples, clamps at the ends, and the director cuts from below to the surface',()=>{
 const rec=createRecorder();for(let i=0;i<50;i++)record(rec,i*.1,sample(i));const r=freeze(rec);
 const mid=frameAt(r,.05);assert.ok(Math.abs(mid.x-.25)<1e-9&&Math.abs(mid.lure.x-.45)<1e-9,'halfway between the first two samples');
 assert.equal(frameAt(r,-5).x,0);assert.equal(frameAt(r,99).x,49*.5);
 assert.equal(shotFor(r,0),'under');assert.equal(shotFor(r,r.duration*.9),'surface');
 const under=replayCamera(r,.5,(x,z)=>-4);assert.equal(under.shot,'under');assert.ok(under.pos.y<=-.25&&under.pos.y>=-3.65,'under the surface, above the bed');assert.ok(under.pos.x<under.look.x,'behind the fish along its travel');
 const chase=replayCamera(r,r.duration*.8,(x,z)=>-4);assert.equal(chase.shot,'chase','a deep fish is chased from under the surface');assert.ok(chase.pos.y<=-.3&&chase.pos.y>=-3.65);
 const rec2=createRecorder();for(let i=0;i<50;i++)record(rec2,i*.1,{...sample(i),y:i<40?-1.5:-.2});const r2=freeze(rec2);const surf=replayCamera(r2,r2.duration*.95);assert.equal(surf.shot,'surface','a fish at the surface is filmed from the water line');assert.equal(surf.pos.y,.45);assert.ok(surf.look.y>=-.1);
 assert.match(replayLine(r,1,'Largemouth bass'),/CATCH REPLAY · Largemouth bass · the take, from below · 1 \/ 5 s · slow/);
});

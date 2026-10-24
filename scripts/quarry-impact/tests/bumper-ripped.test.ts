import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DESTRUCTION_POINTS} from '../src/derby-moments';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('a hooked bumper torn off by the caught car driving away is credited to that driver, like a door catch',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),step=src.slice(src.indexOf('function stepLocks('),src.indexOf('function stepLocks(')+3200);
 assert.ok(step.includes('if(caughtPulls&&!hookerPulls&&caught.health>0){eventAwards.stripped(caught.id,hooker.id,0,1,elapsed);'),'only when the caught car alone was pulling');
 assert.ok(step.includes("derbyFeed.note(caught.id,displayedDriver(caught),'ripped',elapsed)")&&step.includes('scoreStunt(caught.id,DESTRUCTION_POINTS.ripped)'));
 const f=new DerbyEventFeed();f.note(1,'TERN 1400 #2','ripped',3);assert.ok(derbyFeedMarkup(f.visible(3),0).includes('BUMPER RIPPED'));
 assert.equal(DESTRUCTION_POINTS.ripped,DESTRUCTION_POINTS.door,'worth a door');
});

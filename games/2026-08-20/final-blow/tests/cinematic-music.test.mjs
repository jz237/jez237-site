import test from 'node:test';
import assert from 'node:assert/strict';
import {cinematicMusicGain,CINEMATIC_KO_LANDING_TICK,CINEMATIC_KO_VICTORY_SECONDS} from '../engine/cinematic-scenes.mjs';

test('cinematic bed clears contact and landing, returning for victory',()=>{
 assert.equal(cinematicMusicGain(-1),1);
 assert.equal(cinematicMusicGain(0),.08);
 assert.equal(cinematicMusicGain(CINEMATIC_KO_LANDING_TICK/60),.08);
 assert.equal(cinematicMusicGain(CINEMATIC_KO_VICTORY_SECONDS),1);
 let previous=1;
 for(let t=-1;t<=-.35;t+=1/120){const gain=cinematicMusicGain(t);assert.ok(gain<=previous);previous=gain;}
 previous=.08;
 for(let t=1;t<=2;t+=1/120){const gain=cinematicMusicGain(t);assert.ok(gain>=previous&&gain<=1);previous=gain;}
});
test('sampling a held or replayed scene does not advance its music envelope',()=>{
 const times=[-.7,0,.6,1.3,1.7];
 const gains=times.map(cinematicMusicGain);
 for(let i=0;i<1000;i++)assert.deepEqual(times.map(cinematicMusicGain),gains);
 for(const t of [-.9,-.35,1,1.65])assert.ok(Math.abs(cinematicMusicGain(t-1e-6)-cinematicMusicGain(t+1e-6))<1e-5);
});

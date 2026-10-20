import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {importSave,exportSave,initialSave} from '../race-records.js';
import {ghostKey,ghostMetadata} from '../time-trial-ghost.js';
import {trialSetupKey} from '../ghost-library.js';

test('the original water option sets calm, rough and random amplitudes for Original Time trial and two-player races',()=>{
 const amplitude=(options)=>createRace({physics:'native',...options}).raceWater.baseAmplitudeNative;
 assert.equal(amplitude({mode:'time',course:getCourse('port',0)}),30,'venue water');
 assert.equal(amplitude({mode:'time',course:getCourse('port',0),waterChoice:1}),10);
 assert.equal(amplitude({mode:'time',course:getCourse('port',0),waterChoice:2}),40);
 assert.equal(amplitude({mode:'versus',course:getCourse('amber',0),waterChoice:1}),10);
 for(let i=0;i<3;i++){const a=amplitude({mode:'time',course:getCourse('greyhaven',i),difficulty:i,waterChoice:3});assert.ok(a>=10&&a<=40,String(a));}
 // The random draw is the original RNG's next value, so a race is reproducible.
 assert.equal(amplitude({mode:'time',course:getCourse('port',0),waterChoice:3}),amplitude({mode:'time',course:getCourse('port',0),waterChoice:3}));
 assert.equal(createRace({physics:'native',mode:'time',course:getCourse('port',0),waterChoice:2}).waterChoice,2);
});

test('Championship, Stunt, Reverse and Modern physics keep the venue water',()=>{
 for(const options of [{physics:'native',mode:'stunt',course:getCourse('port',0)},{physics:'native',mode:'championship',course:getCourse('greyhaven',0)},
  {physics:'modern',mode:'time',course:getCourse('port',0)},{physics:'native',mode:'time',course:getCourse('greyhaven',3),difficulty:3}])
  assert.throws(()=>createRace({...options,waterChoice:1}),/original water option/);
 assert.throws(()=>createRace({physics:'native',mode:'time',course:getCourse('port',0),waterChoice:4}),/original water option/);
});

test('the water preference saves, and only a chosen water joins the ghost key',()=>{
 const save=initialSave();assert.equal(save.preferences.water,0);
 save.preferences.water=2;assert.equal(importSave(exportSave(save)).preferences.water,2);
 const bad=JSON.parse(exportSave(save));bad.data.preferences.water=7;assert.throws(()=>importSave(JSON.stringify(bad)));
 const venue=createRace({physics:'native',mode:'time',course:getCourse('port',0)}),calm=createRace({physics:'native',mode:'time',course:getCourse('port',0),waterChoice:1});
 const a=ghostMetadata(venue),b=ghostMetadata(calm);
 assert.equal(a.water,undefined);assert.equal(b.water,1);assert.notEqual(ghostKey(a),ghostKey(b));
 // Ghosts saved before the option keep their keys.
 assert.equal(trialSetupKey({...a,tune:{}}),JSON.stringify([a.course,a.layoutRevision,a.difficulty,a.laps,a.seaState,a.rider,0,0,0,a.waterRevision??0]));
 assert.notEqual(trialSetupKey({...a,tune:{}}),trialSetupKey({...b,tune:{}}));
});

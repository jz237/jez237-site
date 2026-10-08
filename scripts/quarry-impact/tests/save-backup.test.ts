import test from 'node:test';import assert from 'node:assert/strict';
import {SAVE_KEYS,BACKUP_JOURNAL,captureSave,exportSave,readSave,restoreSave,recoverSaveImport,backupSummary} from '../src/save-backup';
import {PROFILE_KEY,readProfile,settleRun} from '../src/progression';
import {unlockCareerGroup} from '../src/career';
import {GARAGE_KEY,readGarage} from '../src/garage';
import {CLUB_CUP_KEY,createClubCup,beginClubRound,readClubCup} from '../src/club-cup';
import {TIME_TRIAL_KEY,readTimeTrialRecords} from '../src/time-trial';
import {CONTROLS_KEY,defaultControls} from '../src/driving-controls';
import {TRIAL_GHOST_KEY,TrialGhostRecorder,readGhostLibrary} from '../src/trial-ghost';
import {CHALLENGES} from '../src/challenges';
import {readFileSync} from 'node:fs';
class Memory {
 data=new Map<string,string>();failAt=Infinity;writes=0;denied=false;
 getItem(k:string){return this.data.get(k)??null;}
 setItem(k:string,v:string){if(this.denied||++this.writes===this.failAt)throw Error('quota');this.data.set(k,v);}
 removeItem(k:string){if(this.denied)throw Error('denied');this.data.delete(k);}
}
function populated(){
 const s=new Memory();let p=readProfile();const c=CHALLENGES.find(c=>c.id==='first-lap')!;
 settleRun(p,'earned-lap',{seconds:40,distance:620,damage:0,knockouts:0,drift:0,airtime:0,maxSpeed:25,checkpoints:24,health:100,rank:1,finished:true,completed:true,recovered:false,won:true},c);
 p=unlockCareerGroup(p,'heavy-duty')!;assert.ok(p);
 s.setItem(PROFILE_KEY,JSON.stringify(p));const garage=readGarage();garage.cars.buggy.setup.engine=2;garage.cars.buggy.presets.push({name:'Rally',setup:garage.cars.buggy.setup});s.setItem(GARAGE_KEY,JSON.stringify(garage));
 const controls=defaultControls();controls.keys.throttle=['KeyE'];s.setItem(CONTROLS_KEY,JSON.stringify(controls));s.setItem(TIME_TRIAL_KEY,JSON.stringify({version:1,bests:{'quarry-v1:coupe:forward':40}}));s.setItem(CLUB_CUP_KEY,JSON.stringify(beginClubRound(createClubCup('coupe','12345678-1234-4234-8234-123456789abc',1000))));
 const recorder=new TrialGhostRecorder({kind:'coupe',course:'quarry-v1',direction:'forward'}),pose={x:0,y:1,z:0},rotation={x:0,y:0,z:0,w:1};for(let i=0;i<=240;i++){recorder.sample(i/10,pose,rotation);if(i&&i%10===0)recorder.gate(i/10,i/10);}const ghost=recorder.finish(24,pose,rotation);assert.ok(ghost);s.setItem(TRIAL_GHOST_KEY,JSON.stringify({version:1,enabled:false,ghosts:[ghost]}));
 s.setItem('quarry-impact-v1',JSON.stringify({quality:'medium',engine:.6,best:{'race:forward:3:8':72}}));s.setItem('unrelated-site-data','untouched');return s;
}
test('earned career progress, all save sections, tuning, controls, PBs and an interrupted cup transfer between stores',async()=>{
 const source=populated(),text=await exportSave(source),backup=await readSave(text),target=new Memory();target.setItem('unrelated-site-data','target');target.setItem('quarry-driver','old');await restoreSave(target,backup);
 assert.deepEqual(captureSave(target),backup.entries);assert.equal(target.getItem('unrelated-site-data'),'target');assert.equal(target.getItem('quarry-driver'),null);assert.equal(target.getItem(BACKUP_JOURNAL),null);
 assert.deepEqual(readProfile(target.getItem(PROFILE_KEY)).career,{unlocked:['heavy-duty']});assert.equal(readGarage(target.getItem(GARAGE_KEY)).cars.buggy.setup.engine,2);assert.equal(readClubCup(target.getItem(CLUB_CUP_KEY))?.phase,'running');assert.equal(Object.values(readTimeTrialRecords(target.getItem(TIME_TRIAL_KEY)).bests)[0],40);
 assert.deepEqual(backupSummary(backup.entries),{events:1,medals:1,unlocks:1,presets:1,bests:1,ghosts:1,cup:'0 rounds completed'});
 assert.equal(readGhostLibrary(target.getItem(TRIAL_GHOST_KEY)).ghosts.length,1);assert.equal(readGhostLibrary(target.getItem(TRIAL_GHOST_KEY)).enabled,false);
 const second=await readSave(await exportSave(target,backup.created));assert.deepEqual(second,backup);
});
test('invalid, truncated, wrong-version, oversize and altered files never mutate the destination',async()=>{
 const source=populated(),text=await exportSave(source),before=captureSave(source);
 for(const bad of ['','{',JSON.stringify({...JSON.parse(text),version:2}),JSON.stringify({...JSON.parse(text),entries:{}}),' '.repeat(6_000_001),text.replace('heavy-duty','flight-school')])await assert.rejects(()=>readSave(bad));
 const mutable=await readSave(text);mutable.entries[PROFILE_KEY]='{"version":1}';await assert.rejects(()=>restoreSave(source,mutable));assert.deepEqual(captureSave(source),before);
});
test('restore rolls back after every individual write failure, preserving previous bytes and unrelated data',async()=>{
 const backup=await readSave(await exportSave(populated()));const writes=1+SAVE_KEYS.filter(k=>backup.entries[k]!==null).length;
 for(let i=1;i<=writes;i++){const target=populated();target.setItem('quarry-driver','Previous');const before=captureSave(target);target.writes=0;target.failAt=i;await assert.rejects(()=>restoreSave(target,backup));assert.deepEqual(captureSave(target),before,`write ${i}`);assert.equal(target.getItem(BACKUP_JOURNAL),null);assert.equal(target.getItem('unrelated-site-data'),'untouched');}
});
test('startup recovery restores a partially written save after interruption and safely retries failures',()=>{
 const s=populated(),before=captureSave(s);s.setItem(BACKUP_JOURNAL,JSON.stringify({version:1,entries:before}));for(const k of SAVE_KEYS)s.removeItem(k);s.setItem(PROFILE_KEY,JSON.stringify(readProfile()));
 s.denied=true;assert.throws(()=>recoverSaveImport(s));assert.ok(s.getItem(BACKUP_JOURNAL));s.denied=false;assert.equal(recoverSaveImport(s),true);assert.deepEqual(captureSave(s),before);assert.equal(recoverSaveImport(s),false);
 s.setItem(BACKUP_JOURNAL,'corrupt');assert.throws(()=>recoverSaveImport(s));assert.deepEqual(captureSave(s),before);
});
test('backup export rejects unsupported data instead of turning it into a new empty save',async()=>{
 for(const [key,value]of [[PROFILE_KEY,'{"version":9}'],[CLUB_CUP_KEY,'{"version":1}'],['quarry-impact-v1','{"quality":"extreme"}']] as const){const s=populated();s.setItem(key,value);await assert.rejects(()=>exportSave(s));}
});
test('main recovers before reading saves and exposes restore only from main-menu settings, with controller confirmation',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.indexOf('recoverSaveImport(recoveryStorage)')<main.indexOf("saved = JSON.parse"));assert.match(main,/resumeState==='menu'&&!online\?\.active\)mountSaveBackup/);assert.match(main,/screen\('save-confirm','#save-confirm','#save-cancel',click\('#save-cancel'\)\)/);assert.match(main,/function resume\(\) \{\s+if\(ui\.querySelector\('\.save-backup\[aria-busy="true"\]'\)\)return/);
});

test('a persistent write failure leaves a recoverable journal and a later launch restores the old save',async()=>{
 const s=populated(),before=captureSave(s),backup=await readSave(await exportSave(s)),set=s.setItem.bind(s);let journalWritten=false;
 s.setItem=(k,v)=>{if(journalWritten)throw Error('persistent storage failure');set(k,v);if(k===BACKUP_JOURNAL)journalWritten=true;};
 await assert.rejects(()=>restoreSave(s,backup),/RESTORE_RECOVERY_REQUIRED/);assert.ok(s.getItem(BACKUP_JOURNAL));s.setItem=set;assert.equal(recoverSaveImport(s),true);assert.deepEqual(captureSave(s),before);
});

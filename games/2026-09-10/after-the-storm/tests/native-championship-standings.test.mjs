import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeChampionshipStandingsInitialization as init,prepareNativeChampionshipStandingsInput as input,prepareNativeChampionshipStandingsExit as exit} from '../native-championship-standings.js';
import {prepareNativeChampionshipScoreUpdate as score,prepareNativeChampionshipStandingsInitializationUpdate as update,
 prepareNativeChampionshipStandingsInputUpdate as inputUpdate} from '../native-race-state.js';
const ref=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-init.json',import.meta.url)));
const controls=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-input.json',import.meta.url)));
function state(c){
 const p=Array(52).fill(0),r=Array(1693).fill(0),menu=Array.from({length:68},(_,i)=>0x12000000+i),save=Array(34).fill(0x12345678);
 p[1]=c.round;p[2]=c.difficulty;p[4+c.primary]=c.points>>>0;
 r[(0x2c70-0x1f94)/4+c.primary*222]=c.rank>>>0;menu.splice(11,3,...ref.lastRound7a2c);
 save[0]=((c.flags<<24)|0x345678)>>>0;
 return {profileWordsB330:p,raceWords1f94:r,hudWords7788:Array(1442).fill(0),championshipMenuWords7a00:menu,saveWordsB280:save,
  scene:{primaryHumanIndex:c.primary,participantCount60e:4},roundOrderE718:[0,0,0,0],racerOrderA9dc:[0,0,0,0]};
}
function inputState(c){
 const s=state({difficulty:0,round:1,primary:0,points:7,rank:0,flags:0});
 s.scene={...s.scene,field640:c.phase,field644:c.counter,gameStateAb24:c.game};
 s.championshipMenuWords7a00[0]=(((c.x&65535)<<16)|0x1234)>>>0;
 s.championshipMenuWords7a00[64]=c.outcome>>>0;s.championshipMenuWords7a00[66]=c.destination>>>0;s.championshipMenuWords7a00[67]=c.menuCounter>>>0;
 s.menuWordsE658=Array(21).fill(0);s.menuWordsE658[0]=c.pressed;
 s.hudWords7788[(0x8a14-0x7788)/4]=(0x12340000|(c.fade&65535))>>>0;
 return s;
}
test('input slides, confirmation thresholds, wrapping and exits match700 original executions',()=>{
 for(const c of controls.cases){const s=inputState(c.input),before=structuredClone(s);
  const q=c.scope==='input'?input(s):exit(s,c.input.destination);
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(s,before);
 }
});
test('canonical slide writes preserve neighboring halfword and expanded exits initialize fades atomically',()=>{
 const source=controls.cases.find(c=>c.scope==='input'&&c.input.phase===1),s=inputState(source.input),moved=inputUpdate(s);
 assert.equal(moved.state.championshipMenuWords7a00[0]&65535,0x1234);
 const frames=controls.cases.filter(c=>c.scope==='input'&&c.input.phase===6&&c.input.counter===29&&[30,102].includes(c.input.destination));
 for(const c of frames){
  const s=inputState(c.input),before=structuredClone(s);
  assert.throws(()=>inputUpdate(s,{}, {expandExit:true}),/fadeTemplate/);assert.deepEqual(s,before);
  const q=inputUpdate(s,{fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]},{expandExit:true});
  assert.equal(q.state.scene.gameStateAb24,53);assert.equal(q.state.scene.field640,6);
  assert.equal(q.state.scene.initLatch63c,1);assert.equal(q.state.scene.returnState630,c.input.destination);
  assert.equal(q.operations.some(o=>o.consumer==='802c6f84'||o.consumer==='801e6fb0'),false);
  assert.deepEqual(q.effects,[{kind:'externalCall',consumer:'800c1f60',arguments:[c.input.destination===30?2:11]}]);
 }
});
test('standings outcome and unlock writes match537 complete original initializer executions',()=>{
 for(const c of ref.cases){
  const s=state(c),before=structuredClone(s),q=init(s),out=update(s);
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(s,before);
  assert.deepEqual(out.state.profileWordsB330,s.profileWordsB330);assert.deepEqual(out.state.raceWords1f94,s.raceWords1f94);
  const writes=q.operations.filter(o=>o.kind==='saveByteWrite');
  assert.equal(out.state.saveWordsB280[0]>>>24,writes.at(-1)?.value??c.flags);
  assert.equal(out.state.saveWordsB280[0]&0xffffff,0x345678);assert.deepEqual(out.state.saveWordsB280.slice(1),s.saveWordsB280.slice(1));
  assert.equal(out.state.championshipMenuWords7a00[64],q.diagnostic.outcome);
  assert.equal(out.state.championshipMenuWords7a00[66],q.diagnostic.destination);
  for(let i=0;i<68;i++)if(i!==64&&i!==66)assert.equal(out.state.championshipMenuWords7a00[i],s.championshipMenuWords7a00[i]);
  assert.deepEqual(out.effects,[q.operations.at(-1)]);
 }
});
test('freshly awarded totals and ranks select qualification and Expert winner unlocks',()=>{
 const c={difficulty:2,round:7,primary:2,points:30,rank:99,flags:0x80};
 const s=state(c),base=(0x2938-0x1f94)/4;
 s.profileWordsB330.splice(4,4,33,0,30,0);
 [1,2,0,3].forEach((place,slot)=>s.raceWords1f94[base+slot*222+1]=place);
 const awarded=score(s),out=update(awarded.state);
 assert.deepEqual(awarded.state.profileWordsB330.slice(4,8),[37,2,37,1]);
 assert.equal(awarded.state.racerOrderA9dc[0],2,'current-race winner breaks cup point tie');
 assert.equal(out.state.saveWordsB280[0]>>>24,0x8c);assert.equal(out.diagnostic.destination,102);
 assert.equal(out.state.profileWordsB330[1],7,'initializer does not advance the round');
 const failed=state({...c,points:36}),next=state({...c,round:6,points:30});
 assert.equal(init(failed).diagnostic.destination,90);assert.equal(init(next).diagnostic.destination,30);
});
test('unconsumed save and race fields are lazy; late invalid data never partly commits unlocks',()=>{
 const c={difficulty:2,round:7,primary:0,points:37,rank:0,flags:0};
 const s=state(c);s.raceWords1f94[(0x2c70-0x1f94)/4]=undefined;const before=structuredClone(s);
 assert.throws(()=>init(s),/raceWords/);assert.deepEqual(s,before);
 const failed=state({...c,points:0});delete failed.saveWordsB280;delete failed.raceWords1f94;
 assert.equal(init(failed).diagnostic.outcome,0);
 const normal=state({...c,difficulty:0,round:6});delete normal.raceWords1f94;assert.equal(init(normal).diagnostic.outcome,2);
 const loaded=state({...c,difficulty:0,round:6});loaded.championshipMenuWords7a00[11]=7;
 assert.equal(init(loaded).diagnostic.outcome,1,'use retained loaded last-round value');
});

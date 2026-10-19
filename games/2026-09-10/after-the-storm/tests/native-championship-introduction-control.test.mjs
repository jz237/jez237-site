import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeChampionshipIntroductionPanel as panel,prepareNativeChampionshipIntroductionDisplayEntry as entry,
 prepareNativeChampionshipIntroductionPostDisplay as control,prepareNativeChampionshipIntroductionDisplayTail as tail,
 prepareNativeChampionshipIntroductionExit as exit} from '../native-championship-introduction-control.js';
import {prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-championship-introduction-control.json',import.meta.url)));
const idx=a=>(a-0x6f84)/4;
function base(){return {raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),menuWordsE658:Array(21).fill(0),
 profileWordsB330:Array(52).fill(0),championshipIntroPanelWords6f64:[...fixture.basePanel],championshipSelectionWords6f84:[...fixture.baseMenu],scene:{}};}
test('780 whole original panel executions have identical numeric writes and final owners',()=>{
 for(const [i,c]of fixture.panels.entries()){
  const s=base(),p=s.championshipIntroPanelWords6f64,m=s.championshipSelectionWords6f84;
  p[0]=c.phase>>>0;p[1]=c.ticks>>>0;p[4]=c.second>>>0;m[idx(0x7028)]=c.stage;m[idx(0x6f8c)]=c.reverse;
  const before=structuredClone(s),q=panel(s),out=apply(s,q.operations);
  assert.deepEqual(q.operations,c.operations,'original panel operations '+i);
  assert.deepEqual(out.state.championshipIntroPanelWords6f64,c.finalPanel);
  assert.deepEqual(out.state.championshipSelectionWords6f84,c.finalMenu);
  assert.deepEqual(s,before);assert.deepEqual(out.state.profileWordsB330,s.profileWordsB330);
 }
});
function displayState(c){
 const s=base();Object.assign(s.scene,{initLatch63c:c.latch,gameStateAb24:c.game,field3938:c.ready,field644:c.ticks,main638:c.main,fieldAb2c:19,courseIndex:1});
 for(const [a,v]of [[0x7028,c.stage],[0x6f84,c.skip],[0x6f88,c.restart],[0x702c,c.limit]])s.championshipSelectionWords6f84[idx(a)]=v>>>0;
 s.menuWordsE658[14]=c.pressed;s.hudWords7788[(0x8a14-0x7788)/4]=c.fade&65535;s.profileWordsB330[0]=4;
 return s;
}
test('600 complete original display callers match first-black, skip, timeout, sound and callback ordering',()=>{
 for(const [i,c]of fixture.display.entries()){
  let s=displayState(c.input);const before=structuredClone(s),prefix=entry(s),ops=[...prefix.operations];
  s=apply(s,prefix.operations).state;
  if(prefix.drawKind!=='black'){
   // These two original panel bodies are independently verified above. The
   // caller fixture intercepts them with a prepared GPU cursor, no state writes.
   if(prefix.panelStage!==null)ops.push({kind:'externalCall',consumer:prefix.panelStage===0?'802c5d54':'802c6344',arguments:[]});
   const q=control(s);ops.push(...q.operations);s=apply(s,q.operations).state;
   for(const op of q.operations)if(op.kind==='externalCall'&&['801eb91c','802c6e9c','8009345c'].includes(op.consumer))
    s={...s,scene:{...s.scene,main638:c.input.targetMain,gameStateAb24:c.input.targetGame,field644:c.input.targetTicks}};
   ops.push(...tail(s).operations);
  }
  assert.deepEqual(ops,c.operations,'display caller '+i);assert.deepEqual(displayState(c.input),before);
 }
});
test('all original exit stores and fade/audio arguments match without clearing championship points',()=>{
 for(const c of fixture.exits){const s=base();s.scene.gameStateAb24=c.game;const q=exit(s),out=apply(s,q.operations);
  assert.deepEqual(q.operations,c.operations);assert.equal(out.state.scene.field644,20);assert.equal(out.state.scene.gameStateAb24,31);
  assert.deepEqual(out.state.profileWordsB330,s.profileWordsB330);assert.deepEqual(out.state.raceWords1f94,s.raceWords1f94);
 }
});
test('skip reads the combined third menu slot and cannot fall through to timeout while blocked',()=>{
 const s=displayState({latch:0,game:30,ready:1,ticks:999,main:8,stage:1,skip:0,restart:0,limit:180,pressed:0x8000,fade:0});
 assert.deepEqual(control(s).operations.map(o=>o.consumer),['80047e50']);
 s.menuWordsE658[14]=0;s.menuWordsE658[0]=0x8000;
 assert.deepEqual(control(s).operations.map(o=>o.consumer),['802c6e9c','80047e50']);
 s.championshipSelectionWords6f84[idx(0x6f88)]=1;
 assert.deepEqual(control(s).operations.filter(o=>o.consumer).map(o=>o.consumer),['801eb91c']);
});
test('numeric panel ownership is detached and late invalid writes cannot partially commit',()=>{
 const s=base();s.championshipSelectionWords6f84[idx(0x7028)]=1;s.championshipIntroPanelWords6f64[0]=1;s.championshipIntroPanelWords6f64[1]=19;
 const before=structuredClone(s),q=panel(s);assert.equal(q.operations.at(-1).byteOffset,0);
 assert.throws(()=>apply(s,[...q.operations,{kind:'championshipIntroPanelWrite',byteOffset:32,width:4,value:0}]),/offset/);
 assert.deepEqual(s,before);
 const out=apply(s,q.operations);assert.equal(out.state.championshipSelectionWords6f84[0],1);assert.equal(out.state.championshipIntroPanelWords6f64[0],2);
});

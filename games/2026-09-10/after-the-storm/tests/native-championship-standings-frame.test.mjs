import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeChampionshipStandingsUpdate as update,prepareNativeChampionshipStandingsOffsets as offsets,
 prepareNativeChampionshipStandingsDisplayEntry as entry,prepareNativeChampionshipStandingsPostDisplay as post,
 prepareNativeChampionshipStandingsSaveCheck as save} from '../native-championship-standings.js';
import {prepareNativeRaceStateOperations as apply} from '../native-race-state.js';
const ref=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-frame.json',import.meta.url)));
function state(c){
 const s={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),profileWordsB330:Array(52).fill(0),saveWordsB280:Array(34).fill(0),
  championshipMenuWords7a00:Array(68).fill(0),scene:{gameStateAb24:c.game,initLatch63c:c.latch,main638:c.main,fieldAb2c:37,returnState630:c.destination,reverseDab68:c.reverse}};
 s.profileWordsB330[1]=c.round>>>0;s.profileWordsB330[2]=c.difficulty;s.saveWordsB280.splice(2,4,...Array(4).fill(c.best>>>0));
 s.championshipMenuWords7a00[0]=((c.x&65535)<<16)>>>0;s.hudWords7788[(0x8a14-0x7788)/4]=c.fade&65535;return s;
}
test('numeric update/display sequence matches264 original caller executions with explicit graphics boundaries',()=>{
 for(const c of ref.cases){
  let s=state(c.input);const before=structuredClone(s),operations=[];
  if(c.scope==='update')operations.push(...update(s).operations);
  else if(c.scope==='offset')operations.push(...offsets(s).operations);
  else{
   const prefix=entry(s);operations.push(...prefix.operations);s=apply(s,prefix.operations).state;
   if(prefix.drawKind!=='black'){
    const suffix=post(s);operations.push(...suffix.operations);s=apply(s,suffix.operations).state;
    // The original audit intercepts its callees and supplies their resulting
    // main selector. Full initializer expansion is tested in the runtime.
    if(suffix.operations.some(o=>o.kind==='externalCall'))s=apply(s,[{kind:'sourceWordWrite',field:'main638',value:c.input.afterMain}]).state;
    operations.push(...save(s).operations);
   }
  }
  assert.deepEqual(operations,c.operations.filter(o=>o.kind!=='graphicsBoundary'));
  assert.deepEqual(state(c.input),before);
 }
});

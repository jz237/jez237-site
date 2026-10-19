import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeChampionshipStandingsPresentation as prepare} from '../native-championship-standings-presentation.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-championship-standings-presentation.json',import.meta.url)));
function state(c){
 const s={scene:{field640:c.phase,primaryHumanIndex:c.primary,field704:c.requiredPlace},championshipMenuWords7a00:Array(68).fill(0),
  profileWordsB330:Array(50).fill(0),raceWords1f94:Array(1693).fill(0),roundOrderE718:[...c.roundOrderE718],racerOrderA9dc:[...c.racerOrderA9dc]};
 const m=s.championshipMenuWords7a00,p=s.profileWordsB330,r=s.raceWords1f94;
 m[0]=(c.xA<<16)>>>0;m[65]=(c.xB<<16)>>>0;m[64]=c.outcome;m.splice(6,5,...c.requiredPlaceTokens);
 p[1]=c.round;p[2]=c.difficulty;p.splice(4,4,...c.totals.map(v=>v>>>0));p.splice(8,32,...c.history.flat().map(v=>v>>>0));
 for(let i=0;i<4;i++){r[(0x2c24-0x1f94)/4+i*222]=c.dq[i];r[(0x2ad4-0x1f94)/4+i*222]=c.times[i];}r[(0x2650-0x1f94)/4]=c.record;return s;
}
test('280 whole original standings layouts match every ordered semantic draw call',()=>{
 for(const c of reference.cases){const s=state(c.input),before=structuredClone(s),p=prepare(s,c.input);assert.deepEqual(p.commands,c.commands);assert.deepEqual(s,before);assert.ok(Object.isFrozen(p.commands));}
});
test('round retirement offset persists, total ties use competition ranks, portraits follow avatars',()=>{
 const c=structuredClone(reference.cases[0].input);c.phase=0;c.dq=[0,0,1,0];const q=prepare(state(c),c);
 const ranks=q.commands.filter(x=>x.kind==='text'&&x.font===0).filter((_,i)=>i%2===0);
 assert.deepEqual(ranks.map(x=>x.text),['R','2','3','4']);assert.deepEqual(ranks.map(x=>x.x),[39,39,39,39]);
 c.phase=6;const p=prepare(state(c),c),texts=p.commands.filter(x=>x.kind==='text'&&x.font===0);
 assert.deepEqual(texts.filter((_,i)=>i%2===0).map(x=>x.text),['1','1','3','4']);
 assert.deepEqual(p.commands.filter(x=>x.kind==='riderPreview').map(x=>x.avatarIndex),[2,3,1,0]);
});
test('canonical orders override extraneous view copies; malformed late data leaves owners unchanged',()=>{
 const c=reference.cases[0].input,s=state(c),before=structuredClone(s);
 assert.deepEqual(prepare(s,{...c,roundOrderE718:[0,1,2,3]}),prepare(s,c));
 const bad={...c,riderNamesB298:[...c.riderNamesB298]};delete bad.riderNamesB298[2];
 assert.throws(()=>prepare(s,bad),/riderNames/);assert.deepEqual(s,before);
 s.scene.field640=6;s.profileWordsB330[5]=(-10)>>>0;
 assert.throws(()=>prepare(s,c),/points tens glyph/);
});

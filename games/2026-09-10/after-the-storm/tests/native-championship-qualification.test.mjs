import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nativeChampionshipQualificationView as view} from '../native-championship-qualification.js';
import {NATIVE_CHAMPIONSHIP_SETUP_DATA} from '../native-championship-setup.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-championship-qualification.json',import.meta.url)));
function fixture(c){
 const p=Array(52).fill(0xdeadbeef);p[0]=c.course;p[1]=c.round;p[2]=c.difficulty;
 c.points.forEach((v,i)=>p[4+i]=v>>>0);
 return {profileWordsB330:p,scene:{primaryHumanIndex:c.primary}};
}

test('qualification views match116 original i3 runs including signed overflow and all primary slots',()=>{
 for(const c of reference.cases){const q=fixture(c),before=structuredClone(q);assert.deepEqual(view(q),c.expected);assert.deepEqual(q,before);}
 assert.deepEqual(NATIVE_CHAMPIONSHIP_SETUP_DATA.courseOrderAc14,reference.courseOrderAc14);
 assert.deepEqual(NATIVE_CHAMPIONSHIP_SETUP_DATA.lastRound9514,reference.lastRound9514);
});

test('warmup bypasses round/points reads while racing rejects missing or invalid qualification owners',()=>{
 const q=fixture({course:0,round:99,difficulty:99,primary:2,points:[0,0,0,0]});q.profileWordsB330[4]=undefined;
 assert.deepEqual(view(q),{requiredPlaceBySlot:[4,4,4,4],primaryRequiredPlace:4});
 q.profileWordsB330[0]=1;assert.throws(()=>view(q),/round/);
 q.profileWordsB330[1]=1;q.profileWordsB330[2]=0;assert.throws(()=>view(q),/profile word/);
 assert.throws(()=>view({...q,scene:{primaryHumanIndex:4}}),/primary slot/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {ACHIEVEMENTS,bankAchievements,normalizeBadges,normalizeJourney} from '../src/achievements';
import {readProfile,settleRun} from '../src/progression';
const all={kinds:3,courses:2,arenas:1};
const run=(over:any={})=>({seconds:80,distance:1500,damage:20,knockouts:0,drift:0,airtime:0,maxSpeed:30,checkpoints:24,health:60,rank:2,finished:true,completed:true,recovered:false,...over});
test('races, derbies and journeys unlock badges once, in list order, and roster goals are relative',()=>{
 const p=readProfile();
 let fresh=bankAchievements(p,{run:run({rank:1,won:true}),kind:'coupe',mode:'race',course:'ashcombe-lanes-v1',takedowns:1},all);
 assert.deepEqual(fresh.map(a=>a.id),['chequered','top-step','first-takedown']);
 assert.deepEqual(p.journey,{kinds:['coupe'],courses:['ashcombe-lanes-v1'],arenas:[],takedowns:1});
 assert.deepEqual(bankAchievements(p,{run:run({rank:1,won:true}),kind:'coupe',mode:'race',course:'ashcombe-lanes-v1'},all),[],'no repeats');
 assert.deepEqual(bankAchievements(p,{run:run(),kind:'pipit',mode:'race',course:'thornby-hill-v1'},all).map(a=>a.id),['every-road'],'second of two circuits');
 fresh=bankAchievements(p,{run:run({won:true,health:8,finished:false}),kind:'ravenhill',mode:'derby',arena:'kestrel-ring-v1'},all);
 assert.deepEqual(fresh.map(a=>a.id),['last-standing','held-together','full-garage','arena-regular']);
 assert.equal(p.badges![0],'chequered');assert.deepEqual(p.badges,ACHIEVEMENTS.map(a=>a.id).filter(id=>p.badges!.includes(id)),'stored in list order');
 assert.deepEqual(bankAchievements(readProfile(),{run:run({completed:false,distance:2,finished:false}),kind:'tern',mode:'race',course:'quarry-v1'},all).map(a=>a.id),[],'an idle aborted run records nothing');
});
test('profile totals, challenge golds, daily streaks and career podiums unlock their badges',()=>{
 const p=readProfile();p.knockouts=50;p.distance=500000;p.career={unlocked:[],podiums:{club:1}};
 for(let i=0;i<10;i++)p.challenges['c'+i]={medal:3,best:1,attempts:1};
 const today=new Date(),key=(d:number)=>{const x=new Date(today);x.setDate(x.getDate()-d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;};
 p.daily={[key(0)]:{medal:1,best:1,attempts:1},[key(1)]:{medal:2,best:1,attempts:1},[key(2)]:{medal:3,best:1,attempts:1}};
 const ids=bankAchievements(p,null,all).map(a=>a.id);
 for(const id of ['scrap-merchant','breakers-yard','daily-driver','habit-forming','goldsmith','long-haul','silverware'])assert.ok(ids.includes(id),id);
 assert.ok(!ids.includes('chequered'),'no run, no run badges');
});
test('badges and journey are sanitised and survive a profile reload; old saves stay unchanged',()=>{
 assert.deepEqual(normalizeBadges(['chequered','bogus','chequered',7]),['chequered']);assert.equal(normalizeBadges([]),undefined);
 assert.deepEqual(normalizeJourney({kinds:['a','a',3],courses:'x',arenas:['k'],takedowns:-4}),{kinds:['a'],courses:[],arenas:['k'],takedowns:0});
 const p=readProfile();settleRun(p,'r1',run() as any);bankAchievements(p,{run:run() as any,kind:'kite',mode:'race',course:'westmere-club-v1',takedowns:2},all);
 const back=readProfile(JSON.stringify(p));assert.deepEqual(back.badges,p.badges);assert.deepEqual(back.journey,p.journey);
 const old=readProfile(JSON.stringify({version:1}));assert.ok(!Object.hasOwn(old,'badges')&&!Object.hasOwn(old,'journey'));
});
test('feature badges: elimination win, dusk win and an ice-cream-van wreck',()=>{
 const p=readProfile();
 const ids=(c:any)=>bankAchievements(p,c,all).map(a=>a.id);
 assert.ok(ids({run:run({won:true,rank:1}),kind:'tern',mode:'race',course:'a',elimination:true}).includes('last-car-running'));
 assert.ok(ids({run:run({won:true}),kind:'tern',mode:'derby',arena:'k',lighting:'dusk'}).includes('night-owl'));
 assert.ok(!ids({run:run(),kind:'cornet',mode:'race',course:'b'}).includes('ice-cream-scream'),'driving it is not enough');
 assert.ok(ids({run:run(),kind:'cornet',mode:'derby',arena:'k',wrecks:1}).includes('ice-cream-scream'));
});
test('destruction goals: wheels and parts tallied across events, and winning a banger race',()=>{
 const p:any={events:0,wins:0,distance:0,knockouts:0,challenges:{}};
 const ctx=(over:any)=>({run:{finished:true,completed:true,won:false,rank:3,distance:500,health:60,knockouts:0},kind:'coupe',mode:'derby',...over});
 bankAchievements(p,ctx({wheels:3,parts:20}),{kinds:99,courses:99,arenas:99});assert.equal(p.journey.wheels,3);assert.equal(p.journey.parts,20);assert.ok(!(p.badges??[]).includes('wheel-snatcher'));
 const fresh=bankAchievements(p,ctx({wheels:2,parts:31}),{kinds:99,courses:99,arenas:99});assert.deepEqual(fresh.map(a=>a.id).filter(id=>id==='wheel-snatcher'||id==='scrapyard'),['wheel-snatcher','scrapyard']);
 const win=bankAchievements(p,ctx({mode:'race',banger:true,run:{finished:true,completed:true,won:true,rank:1,distance:900,health:40,knockouts:0}}),{kinds:99,courses:99,arenas:99});assert.ok(win.some(a=>a.id==='banger-king'));
 const plain:any={events:0,wins:0,distance:0,knockouts:0,challenges:{}};bankAchievements(plain,ctx({}),{kinds:99,courses:99,arenas:99});assert.ok(!('wheels' in plain.journey)&&!('parts' in plain.journey),'saves without stripping keep their old shape');
 assert.deepEqual(normalizeJourney({kinds:[],courses:[],arenas:[],takedowns:1,wheels:-3,parts:'x'}),{kinds:[],courses:[],arenas:[],takedowns:1,wheels:0,parts:0});
});

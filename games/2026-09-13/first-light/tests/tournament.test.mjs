import test from 'node:test';import assert from 'node:assert/strict';
import {createTournament,bestFive,totalInches,recordPlayerCatch,stepRivals,tick,close,standings,summary,boardScore,ordinal,LIMIT,TOURNEY_SECONDS} from '../tournament.js';
const spots=[{type:'laydown',x:10,z:10,r:8},{type:'dock',x:60,z:-20,r:9},{type:'weedbed',x:-40,z:30,r:70},{type:'riprap',x:120,z:-80,r:35}];
test('best five by length, bass only, and the standings order by total inches',()=>{
 const t=createTournament({seed:3,spots});
 for(const L of [14.2,17.5,12.1,19.8,13.3,15.0,11.0])recordPlayerCatch(t,{species:'largemouth',lengthIn:L});
 assert.equal(recordPlayerCatch(t,{species:'walleye',lengthIn:24}),false,'a walleye does not count');
 assert.equal(bestFive(t.player.fish).length,LIMIT);assert.equal(totalInches(t.player.fish),+(19.8+17.5+15.0+14.2+13.3).toFixed(1));assert.equal(boardScore(t),798);
 t.rivals[0].fish.push({species:'largemouth',lengthIn:22},{species:'smallmouth',lengthIn:18});
 const st=standings(t);assert.equal(st[0].name,'You');assert.equal(st[1].name,'Kim');assert.equal(st[1].total,40);assert.equal(st[1].place,2);
 assert.match(summary(t),/79\.8 in · 5 bass · 1st of 4/);assert.equal(ordinal(3),'3rd');assert.equal(ordinal(4),'4th');
});
test('rivals fish at a believable rate on the planner\'s own numbers, and the horn ends it',()=>{
 let totals=[];for(let seed=1;seed<=6;seed++){const t=createTournament({seed,spots});let catches=0,moves=0;
  for(let i=0;i<TOURNEY_SECONDS;i++){for(const e of stepRivals(t,1,{hour:6.8,lowLight:true}))if(e.type==='catch')catches++;else if(e.type==='move')moves++;tick(t,1);}
  assert.ok(t.over);assert.ok(moves>=3,'rivals moved');totals.push(catches);
  for(const r of t.rivals)for(const f of r.fish){assert.ok(f.lengthIn>=8&&f.lengthIn<=25,'plausible length '+f.lengthIn);assert.ok(f.species==='largemouth'||f.species==='smallmouth');}}
 const mean=totals.reduce((a,b)=>a+b,0)/totals.length;
 assert.ok(mean>=6&&mean<=24,'three rivals land a limit or so between them in twenty minutes: '+totals.join(','));
 const t=createTournament({seed:9,spots});tick(t,TOURNEY_SECONDS);close(t);assert.equal(recordPlayerCatch(t,{species:'largemouth',lengthIn:20}),false);assert.deepEqual(stepRivals(t,1,{}),[]);
});

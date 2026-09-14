import test from 'node:test';import assert from 'node:assert/strict';
import {REALISM,realismOf,realismForMode} from '../realism.js';
import {createSonar,tickSonar,pushColumn,sonarSummary,SONAR} from '../sonar.js';
import {createFight,stepFight} from '../fight.js';
import {SPECIES} from '../species.js';
import {isSonarUnlocked,nextUnlock,SONAR_UNLOCK} from '../unlocks.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function run(ft,controller,seconds=90){const geom={distToAngler:18,lineOut:20,depth:1};let t=0;while(t<seconds&&!ft.lost&&!ft.landed){const out=stepFight(ft,1/60,controller(ft,geom),geom);geom.distToAngler=Math.max(1,Math.min(geom.lineOut,geom.distToAngler+(out.state==='RUN'?out.speed*(Math.cos(out.heading)>.55?-1:1):-out.speed*.4)*(1/60)));t+=1/60;}return {t,geom};}
test('the realism dial orders the three presets and shared modes always run Standard',()=>{
 assert.ok(REALISM.sim.activity<REALISM.standard.activity&&REALISM.standard.activity<REALISM.relaxed.activity);
 assert.ok(REALISM.sim.reaction<1&&REALISM.relaxed.reaction>1&&REALISM.sim.slack<1&&REALISM.relaxed.slack>1);
 assert.equal(realismOf('nonsense').id,'standard');assert.equal(realismForMode({setting:'relaxed',shared:true}).id,'standard');assert.equal(realismForMode({setting:'relaxed'}).id,'relaxed');
});
test('relaxed gives more time on an overload and forgives more slack than sim',()=>{
 const rig=(r)=>({dragKg:2.2,weakestKg:3.6,rodPower:.35,lineStretch:.12,retrieveMs:1.05,reaction:r.reaction,slack:r.slack});
 const timeToBreak=(r)=>{let n=0;const ft=createFight({fish:{length:.58,species:SPECIES.largemouth},rig:{...rig(r),weakestKg:2.4},random:rng(4)});run(ft,()=>{n++;return {reeling:1,sidePressure:0,rodUp:.8};},120);return ft.lost==='broke off'?n/60:Infinity;};
 const sim=timeToBreak(REALISM.sim),std=timeToBreak(REALISM.standard),rel=timeToBreak(REALISM.relaxed);
 assert.ok(sim<std&&std<rel,'break times sim<standard<relaxed: '+sim.toFixed(2)+' '+std.toFixed(2)+' '+rel.toFixed(2));
 const slackLoss=(r)=>{let n=0;const ft=createFight({fish:{length:.45,species:SPECIES.largemouth},rig:rig(r),random:rng(5)});run(ft,()=>{n++;return {reeling:0,sidePressure:0,rodUp:0};},120);return ft.lost==='threw the hook'?n/60:Infinity;};
 const s1=slackLoss(REALISM.sim),s3=slackLoss(REALISM.relaxed);assert.ok(s1<s3,'slack forgiveness sim<relaxed: '+s1.toFixed(2)+' vs '+s3.toFixed(2));
});
test('the fish finder scrolls the bottom, arches fish in the cone, and unlocks late',()=>{
 const s=createSonar();let pushed=0;
 for(let i=0;i<120;i++){if(tickSonar(s,1/10,{depth:3+Math.sin(i/10),tempF:72,fish:[{x:1,z:1,depth:1.5},{x:9,z:0,depth:1},{x:0,z:0,depth:.1}],kayak:{x:0,z:0}}))pushed++;}
 assert.ok(pushed>=20&&pushed<=24,'pushed '+pushed);assert.equal(s.cols.length,pushed);assert.deepEqual(s.cols[0].fish,[1.5],'only the fish inside the cone and below the surface arches');
 for(let i=0;i<200;i++)pushColumn(s,2,[]);assert.equal(s.cols.length,SONAR.columns);assert.equal(sonarSummary(s).columns,SONAR.columns);
 assert.equal(isSonarUnlocked({catches:Array.from({length:SONAR_UNLOCK.count-1},()=>({}))}),false);assert.equal(isSonarUnlocked({catches:Array.from({length:SONAR_UNLOCK.count},()=>({}))}),true);
 const all={catches:[...Array.from({length:6},()=>({sizeClass:'common'})),{sizeClass:'trophy'}]};assert.match(nextUnlock(all),/Fish finder unlocks after twelve fish \(5 more\)/);
});

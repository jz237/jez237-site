import test from 'node:test';import assert from 'node:assert/strict';
import {createFight,stepFight} from '../fight.js';
import {SPECIES} from '../species.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const rig=(over={})=>({dragKg:2.2,weakestKg:3.6,rodPower:.35,lineStretch:.12,retrieveMs:1.05,...over});
function run(ft,controller,seconds=90){const geom={distToAngler:18,lineOut:20,depth:1};let t=0;while(t<seconds&&!ft.lost&&!ft.landed){const out=stepFight(ft,1/60,controller(ft,geom),geom);geom.distToAngler=Math.max(1,Math.min(geom.lineOut,geom.distToAngler+(out.state==='RUN'?out.speed*(Math.cos(out.heading)>.55?-1:1):-out.speed*.4)*(1/60)));t+=1/60;}return {t,geom};}
test('a competent angler lands a 2 lb bass on the finesse rig without breaking off',()=>{
 let landed=0,lost=[];for(let seed=1;seed<=10;seed++){const ft=createFight({fish:{length:.40,species:SPECIES.largemouth},rig:rig(),random:rng(seed)});
  run(ft,(ft,g)=>({reeling:ft.state==='RUN'?.15:ft.state==='JUMP'?.9:.9,sidePressure:ft.state==='RUN'?1:0,rodUp:ft.state==='JUMP'?0:.8}),140);
  if(ft.landed)landed++;else lost.push(ft.lost||'timeout');}
 assert.ok(landed>=8,'landed '+landed+' lost '+lost.join(','));
});
test('locking down against a big fish on light line breaks off',()=>{
 let broke=0;for(let seed=1;seed<=8;seed++){const ft=createFight({fish:{length:.58,species:SPECIES.largemouth},rig:rig({dragKg:6,weakestKg:2.7}),random:rng(seed)});run(ft,()=>({reeling:1,sidePressure:0,rodUp:.8}),60);if(ft.lost==='broke off')broke++;}
 assert.ok(broke>=6,'broke '+broke);
});
test('giving slack through head-shakes and jumps throws the hook',()=>{
 let thrown=0;for(let seed=1;seed<=8;seed++){const ft=createFight({fish:{length:.45,species:SPECIES.largemouth},rig:rig(),random:rng(seed)});run(ft,ft=>({reeling:0,sidePressure:0,rodUp:1}),120);if(ft.lost==='threw the hook')thrown++;}
 assert.ok(thrown>=5,'thrown '+thrown);
});
test('a musky saws through anything but a wire leader',()=>{
 const heavy={dragKg:7,weakestKg:7,rodPower:.9,lineStretch:.03,retrieveMs:1.5};const ctl=(ft,g)=>({reeling:ft.state==='RUN'?.2:.9,sidePressure:ft.state==='RUN'?1:0,rodUp:ft.state==='JUMP'?0:.8});
 let bitten=0,bittenWire=0;for(let seed=1;seed<=10;seed++){
  const a=createFight({fish:{length:.95,species:SPECIES.musky},rig:rig(heavy),random:rng(seed)});run(a,ctl,240);if(a.lost==='bitten off')bitten++;
  const b=createFight({fish:{length:.95,species:SPECIES.musky},rig:rig({...heavy,wire:true}),random:rng(seed)});run(b,ctl,240);if(b.lost==='bitten off')bittenWire++;}
 assert.ok(bitten>=7,'bitten off without wire '+bitten+'/10');assert.equal(bittenWire,0);
});
test('stamina only falls while the line is loaded and the fight is bounded',()=>{
 const ft=createFight({fish:{length:.42,species:SPECIES.largemouth},rig:rig(),random:rng(9)});let prev=1;const geom={distToAngler:15,lineOut:16,depth:1};
 for(let i=0;i<600;i++){stepFight(ft,1/60,{reeling:.6,sidePressure:.5,rodUp:.7},geom);assert.ok(ft.stamina<=prev+.01);prev=ft.stamina;assert.ok(Number.isFinite(ft.tension));}
 assert.ok(ft.stamina<.8);
});

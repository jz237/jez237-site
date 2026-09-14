import test from 'node:test';import assert from 'node:assert/strict';
import {ambienceMix,LAYERS} from '../ambience-model.js';
import {HERON,createHeron,stepHeron,GEESE,createGeese,stepGeese,skeinOffsets,swallowDensity,swallowPos,insectDensity,riseDue} from '../wildlife-model.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('the sound bed follows the light and the wind: chorus around sunrise, peepers at night, water with the boat',()=>{
 const dawn=ambienceMix({elevation:3,hour:6.7}),noon=ambienceMix({elevation:50,hour:12}),night=ambienceMix({elevation:-20,hour:23}),dusk=ambienceMix({elevation:3,hour:19});
 assert.ok(dawn.chorus>.6&&noon.chorus===0&&night.chorus===0,'chorus peaks at sunrise');assert.ok(dusk.chorus<dawn.chorus&&dusk.chorus>0,'a quieter evening chorus');
 assert.ok(night.peepers>.5&&noon.peepers===0,'peepers after dark');
 assert.ok(ambienceMix({wind:.8}).wind>ambienceMix({wind:0}).wind&&ambienceMix({speed:2}).water>ambienceMix({speed:0}).water);
 const off=ambienceMix({elevation:3,hour:6.7,master:0});for(const k of LAYERS)assert.equal(off[k],0,'master off silences '+k);
});
test('the heron stands, turns its head, lifts off when the kayak comes close, and comes back later',()=>{
 const h=createHeron({x:0,y:.3,z:0,heading:1});const r=rng(2);let ev=[];
 for(let i=0;i<60*10;i++)ev=ev.concat(stepHeron(h,1/60,{kayak:{x:80,z:0},t:i/60,random:r}));
 assert.equal(h.state,'standing');assert.ok(ev.length===0);assert.notEqual(h.headTurn,0,'it turned its head');
 let t=10;for(let i=0;i<60*3;i++){t+=1/60;ev=ev.concat(stepHeron(h,1/60,{kayak:{x:10,z:0},t,random:r}));}
 assert.ok(ev.includes('takeoff'));assert.ok(h.state==='flying'||h.state==='gone');assert.ok(Math.hypot(h.x,h.z)>5&&h.y>.3,'flew away and up');assert.ok(h.x<0,'away from the kayak');
 for(let i=0;i<60*30;i++){t+=1/60;stepHeron(h,1/60,{kayak:{x:10,z:0},t,random:r});}assert.equal(h.state,'gone');
 for(let i=0;i<60*250;i++){t+=1/60;ev=ev.concat(stepHeron(h,1/60,{kayak:{x:120,z:0},t,random:r}));}
 assert.equal(h.state,'standing');assert.ok(ev.includes('returned'));assert.equal(h.x,0);
});
test('geese cross the cove in the low light on a schedule, and the V has a lead bird',()=>{
 const g=createGeese();const r=rng(9);let ev=[];let t=0;
 for(let i=0;i<60*100;i++){t+=1/60;ev=ev.concat(stepGeese(g,1/60,{t,elevation:40,cove:{x:0,z:0},random:r}));}assert.equal(g.active,false,'no skein at midday');
 for(let i=0;i<60*100;i++){t+=1/60;ev=ev.concat(stepGeese(g,1/60,{t,elevation:4,cove:{x:0,z:0},random:r}));}
 assert.ok(ev.includes('geese'),'a skein at dawn');const startD=Math.hypot(g.x,g.z);assert.ok(g.y>25,'high up');
 for(let i=0;i<60*60;i++){t+=1/60;stepGeese(g,1/60,{t,elevation:4,cove:{x:0,z:0},random:r});}
 assert.equal(g.active,false,'gone after crossing');assert.ok(g.nextAt>t+GEESE.every[0]-70,'next one later');
 const v=skeinOffsets(7);assert.equal(v[0].back,0);assert.ok(v[1].side>0&&v[2].side<0&&v[6].back>v[2].back);
});
test('swallows and insects belong to the low light and calm air; rises come at dusk',()=>{
 assert.ok(swallowDensity(2,0)>.8&&swallowDensity(40,0)===0&&swallowDensity(2,1)<swallowDensity(2,0));
 assert.ok(insectDensity(1,0)>.7&&insectDensity(30,0)===0&&insectDensity(-20,0)===0&&insectDensity(1,1)<.3);
 const c={x:5,z:-3};for(let i=0;i<8;i++)for(let t=0;t<30;t+=.5){const p=swallowPos(i,t,c);assert.ok(Math.hypot(p.x-c.x,p.z-c.z)<35&&p.y>=.35&&p.y<=.751);}
 const st={nextAt:0};const r=rng(3);let n=0;for(let t=0;t<120;t+=.5)if(riseDue(st,t,1,r))n++;assert.ok(n>=6&&n<=25,'rises every 6-16 s at dusk: '+n);
 assert.equal(riseDue({nextAt:0},10,40,r),false,'none at noon');
});

import test from 'node:test';import assert from 'node:assert/strict';
import {DRIFT,createDrift,planShot,stepDrift,driftCaption} from '../drift.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const fish=[{id:'a',species:'largemouth',x:0,y:-1,z:0,length:.5,state:'HOLD'},{id:'b',species:'musky',x:6,y:-1.5,z:2,length:.9,state:'CRUISE'},{id:'c',species:'bluegill',x:-3,y:-.8,z:4,length:.18,state:'HOLD'},{id:'h',species:'carp',x:1,y:-1,z:1,length:.7,state:'HOOKED'}];
const schools=[{id:0,x:10,y:-.6,z:-4}];
test('the planner mixes fish, shiners and the window, never a hooked fish, and moves on from a fish it just visited',()=>{
 const d=createDrift(rng(3));const kinds={};let same=0,n=0;
 for(let i=0;i<300;i++){const prev=d.shot;const s=planShot(d,{fish,schools,t:i*12});kinds[s.kind]=(kinds[s.kind]||0)+1;assert.notEqual(s.id,'h');if(prev&&prev.kind==='fish'&&s.kind==='fish'){n++;if(prev.id===s.id)same++;}}
 assert.ok(kinds.fish>0&&kinds.school>0&&kinds.window>0,JSON.stringify(kinds));
 assert.ok(same/n<.2,'rarely the same fish twice in a row: '+same+'/'+n);
 assert.equal(planShot(createDrift(rng(1)),{fish:[],schools:[],t:0}).kind,'window','nothing to watch: the window');
});
test('the camera slides to an orbit point at walking pace, arrives, holds, and the window shot sits just under the surface',()=>{
 const d=createDrift(rng(5));const s=planShot(d,{fish:[fish[1]],schools:[],t:0});assert.equal(s.kind,'fish');assert.equal(s.id,'b');
 let r=stepDrift(d,1/60,0,{x:6,y:-1.5,z:2});assert.ok(Math.abs(Math.hypot(r.pos.x-6,r.pos.z-2)-s.dist)<.05,'first frame snaps to the orbit point');
 // teleport the subject far away: the camera must not jump
 let t=0,maxStep=0,last={...r.pos};for(let i=0;i<60*40;i++){t+=1/60;r=stepDrift(d,1/60,t,{x:26,y:-1.5,z:2});maxStep=Math.max(maxStep,Math.hypot(r.pos.x-last.x,r.pos.y-last.y,r.pos.z-last.z));last={...r.pos};}
 assert.ok(maxStep<(DRIFT.speed+2)/60,'no jumps: '+maxStep);assert.ok(Math.abs(Math.hypot(r.pos.x-26,r.pos.z-2)-s.dist)<.3,'arrived on the orbit');assert.equal(r.done,true,'held long enough');
 const w=createDrift(rng(9));w.shots=1;let ws=null;for(let i=0;i<50&&(!ws||ws.kind!=='window');i++)ws=planShot(w,{fish:[],schools:[],t:0});assert.equal(ws.kind,'window');const wr=stepDrift(w,1/60,0,null);assert.ok(Math.abs(wr.pos.y+.35)<1e-6&&wr.look.y>1,'up through the window');
 assert.match(driftCaption(s,{name:'Muskellunge',lengthIn:36,state:'CRUISE'}),/Muskellunge · 36 in · on the move/);assert.equal(driftCaption(ws,null),'The surface from below');
});

import test from 'node:test';import assert from 'node:assert/strict';
import {chooseHomes,schoolDepth,createForage,stepForage,baitAt,forageInfo,rng} from '../forage.js';
const features=[{type:'weedbed',x:-60,z:20,r:30},{type:'pads',x:-40,z:60,r:12},{type:'dock',x:70,z:-10,r:9},{type:'riprap',x:110,z:-70,r:30},{type:'laydown',x:20,z:30,r:8},{type:'stump',x:10,z:-40,r:10}];
const bed=()=>-4;
test('bait rides the wind to the downwind bank and comes up in low light',()=>{
 const east=chooseHomes(features,0,6,rng(1),3).map(f=>f.x);const west=chooseHomes(features,Math.PI,6,rng(1),3).map(f=>f.x);
 assert.ok(east.reduce((a,b)=>a+b)/3>west.reduce((a,b)=>a+b)/3,'wind toward +x picks eastern cover: '+east+' vs '+west);
 assert.ok(schoolDepth(6.7)<.5,'dawn shallow');assert.ok(schoolDepth(13)>1.2,'noon deep');assert.ok(schoolDepth(13)>schoolDepth(19.2));
});
test('a school holds together around its home, sinks by day, and never leaves the water',()=>{
 const st=createForage({features,random:rng(5),count:3,perSchool:20});let t=0;const r1=rng(11);
 for(let i=0;i<60*120;i++){t+=1/60;stepForage(st,1/60,{t,hour:7,bed,random:r1});}
 for(const s of st.schools){assert.ok(Math.hypot(s.x-s.home.x,s.z-s.home.z)<s.r*1.6+3,'school near home');assert.ok(s.y<0&&s.y>-4,'school depth '+s.y);
  for(const f of s.fish){assert.ok(Number.isFinite(f.x+f.y+f.z),'finite');assert.ok(Math.hypot(f.x-s.x,f.z-s.z)<6,'fish within the cloud');assert.ok(f.y<=-.05&&f.y>=-3.85,'in the water column '+f.y);}}
 const dawnY=st.schools[0].y;for(let i=0;i<60*60;i++){t+=1/60;stepForage(st,1/60,{t,hour:13,bed,random:r1});}
 assert.ok(st.schools[0].y<dawnY-.5,'deeper at midday: '+dawnY+' -> '+st.schools[0].y);
 assert.ok(forageInfo(st).length===3&&forageInfo(st)[0].n===20);
});
test('a school beside a bank stays in the water',()=>{
 const shore=(x,z)=>x>4?.5:-3;const st=createForage({features:[{type:'weedbed',x:0,z:0,r:16}],random:rng(3),count:1,perSchool:12});const s=st.schools[0];let t=0;const r=rng(8);
 let maxY=-9,maxX=-9;for(let i=0;i<60*240;i++){t+=1/60;stepForage(st,1/60,{t,hour:13,bed:shore,random:r});maxY=Math.max(maxY,s.y,...s.fish.map(f=>f.y));maxX=Math.max(maxX,s.x);}
 assert.ok(maxY<=-.05,'never above the surface: '+maxY);assert.ok(maxX<6,'centre never beached: '+maxX);
});
test('a predator through the school scatters it with a boil, and bait is read by proximity',()=>{
 const st=createForage({features,random:rng(9),count:1,perSchool:16});const s=st.schools[0];let t=0;const r2=rng(21);
 for(let i=0;i<60*20;i++){t+=1/60;stepForage(st,1/60,{t,hour:6.8,bed,random:r2});}
 const x0=s.x,z0=s.z;let boils=0,dimples=0;
 for(let i=0;i<60*4;i++){t+=1/60;const signs=stepForage(st,1/60,{t,hour:6.8,bed,threats:[{x:x0+.5,z:z0}],random:r2});for(const g of signs){if(g.kind==='boil')boils++;if(g.kind==='dimple')dimples++;}}
 assert.ok(boils>=1,'a boil was raised');assert.ok(Math.hypot(s.x-x0,s.z-z0)>1.5,'the school moved off: '+Math.hypot(s.x-x0,s.z-z0).toFixed(2)+' m');
 let calm=0;for(let i=0;i<60*30;i++){t+=1/60;calm+=stepForage(st,1/60,{t,hour:6.8,bed,random:r2}).filter(g=>g.kind==='dimple').length;}
 assert.ok(calm>=8,'a shallow school dimples the surface: '+calm);
 assert.equal(baitAt(st,s.x,s.z),1);assert.equal(baitAt(st,s.x+40,s.z),0);assert.ok(baitAt(st,s.x+4,s.z)>.4&&baitAt(st,s.x+4,s.z)<.6);
});

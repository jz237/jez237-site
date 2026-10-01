import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import zlib from 'node:zlib';
globalThis.location={search:'?ship=imperial'};
const {vessel,VESSELS,halfBeam,deckHeight}=await import('../../../demos/open-sea/js/vessels.js');
const {shipHydrostatics,fitWavePlane,Spring}=await import('../../../demos/open-sea/js/ship-physics.js');
const {Yacht}=await import('../../../demos/open-sea/js/yacht.js');
const {Whirlpool,HullCurrent}=await import('../../../demos/open-sea/js/whirlpool.js');
const {hullSolidGap}=await import('../../../demos/open-sea/js/hull-water.js');
const {DeckNavigator}=await import('../../../demos/open-sea/js/deck.js');
const root=new URL('../../../demos/open-sea/assets/',import.meta.url),meta=JSON.parse(fs.readFileSync(new URL('imperial-star.json',root))),hydro=shipHydrostatics(vessel,meta.hydro);
function boat(heights=Array(14).fill(0),old=Array(5).fill(0)){
 const y=Object.create(Yacht.prototype);
 Object.assign(y,{x:0,z:0,y:0,psi:0,yaw:0,pitch:0,roll:0,t:0,acc:0,speed:0,profile:vessel,hydro,current:new HullCurrent(),heave:new Spring(hydro.heave,.82),pitchS:new Spring(hydro.pitch,.8),rollS:new Spring(hydro.roll,.68),yawS:new Spring(.9,.7),probeH:old,extraWave:heights,flutter:0,flutterRate:0,flutterPhases:new Float64Array(48),sailAng:0,tack:1,_updateSheets(){},_sail(){Object.assign(this,{psiTarget:0,speedTarget:0,sailAngTarget:0,flutterTarget:0,flutterRateTarget:0,heelTarget:0});}});
 y._matrix();return y;
}
test('exported hull floats at the stated mass and responds more slowly than the schooner',()=>{
 assert.equal(vessel.id,'imperial');assert.equal(meta.masts,5);assert.equal(meta.sails.length,24);
 assert.ok(Math.abs(hydro.displacedVolume*1025-vessel.mass)<.1);
 const small=shipHydrostatics(VESSELS.schooner);assert.ok(hydro.heave<small.heave);assert.ok(hydro.pitchInertia>small.pitchInertia*50);assert.ok(hydro.addedMass>small.addedMass*5);
});
test('weighted plane separates uniform sea elevation from pitch and roll',()=>{
 const stations=boat().extraStations(),w=x=>halfBeam(x)*.91;
 const flat=fitWavePlane(stations,stations.map(()=>2),w);assert.equal(flat.mean,2);assert.ok(Math.abs(flat.pitchSlope)<1e-12);assert.ok(Math.abs(flat.rollSlope)<1e-12);
 const plane=fitWavePlane(stations,stations.map(([x,z])=>2+.03*x+.02*z),w);assert.ok(Math.abs(plane.pitchSlope-.03)<1e-12);assert.ok(Math.abs(plane.rollSlope-.02)<1e-12);
});
test('real yacht update filters distributed waves without bypass from the five old probes',()=>{
 const w=new Whirlpool(),a=boat(Array(14).fill(2)),b=boat(Array(14).fill(2),Array(5).fill(50));
 a.update(.1,{whirlpool:w});b.update(.1,{whirlpool:w});assert.ok(a.y<.1,'No direct two-metre heave jump');assert.ok(Math.abs(a.y-b.y)<1e-12);assert.ok(Math.abs(a.pitch)<1e-12);
 for(let i=0;i<2400;i++)a.update(1/60,{whirlpool:w});assert.ok(Math.abs(a.y-(2+hydro.trim))<1e-6);
 const c=boat(a.extraStations().map(([x,z])=>2+.03*x+.02*z));for(let i=0;i<3600;i++)c.update(1/60,{whirlpool:w});assert.ok(Math.abs(c.pitch-Math.atan(.03)*.7)<1e-6);assert.ok(Math.abs(c.roll+Math.atan(.02)*.23)<1e-6);
});
test('heavy pose stays finite and identical with uneven bounded frame timing',()=>{
 const w=new Whirlpool(),a=boat(Array(14).fill(1)),b=boat(Array(14).fill(1));
 for(let i=0;i<600;i++){for(let j=0;j<6;j++)a.update(1/60,{whirlpool:w});for(const dt of [.01,.023,.05,.017])b.update(dt,{whirlpool:w});}
 assert.ok(Math.abs(a.y-b.y)<1e-8);assert.ok(Math.abs(a.pitch-b.pitch)<1e-8);
 w.setEnabled(true,b);for(let i=0;i<180;i++)b.update(.1,{whirlpool:w});
 for(const dt of [2,.002,.1,5,.033]){w.update(dt);b.update(dt,{whirlpool:w});assert.ok([...b.M,b.speed,b.current.omega].every(Number.isFinite));}
});
test('raised quarterdeck and exported hull exclude interior water while allowing overtopping',()=>{
 for(const x of [-49,-43,-40,-36,-32]){const h=deckHeight(x,0);assert.ok(hullSolidGap([x,h-.25,0])<0);assert.ok(hullSolidGap([x,h+.25,0])>0);}
 const bin=zlib.gunzipSync(fs.readFileSync(new URL('imperial-star.bin.gz',root))),g=meta.groups.hull;let count=0,max=0;
 for(let i=0;i<g.vertexCount;i++){const off=g.vertexOffset+i*44;if(bin.readFloatLE(off+32)!==0)continue;const p=[0,1,2].map(k=>bin.readFloatLE(off+k*4));count++;max=Math.max(max,hullSolidGap(p));}
 assert.ok(count>20000);assert.ok(max<.02,`Hull envelope differs from mesh by ${max}`);
});
test('guns and pin rails block walkers; a continuous route joins stern and bow',()=>{
 const nav=new DeckNavigator(meta);for(const o of nav.obstacles.filter(o=>['Gun carriage','Belaying pin rail'].includes(o.name)))assert.equal(nav.canStand(o.x,o.z),false,o.name);
 const step=.5,queue=[[-49,3.5]],seen=new Set(),key=(x,z)=>`${x},${z}`;let arrived=false;
 for(let i=0;i<queue.length;i++){const [x,z]=queue[i];if(x>=43){arrived=true;break;}for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const a=x+dx,b=z+dz,k=key(a,b);if(!seen.has(k)&&nav.canStand(a,b)){seen.add(k);queue.push([a,b]);}}}
 assert.ok(arrived,'Deck is traversable from the raised stern to the bow');
});

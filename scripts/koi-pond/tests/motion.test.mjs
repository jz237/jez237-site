import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {spineOffset,spineSlope,advanceNeeds,depthTarget,limitAttitude} from '../src/KoiKinematics.js';
const engine=readFileSync(new URL('../src/GardenEngine.js',import.meta.url),'utf8');
const three=readFileSync(new URL('../public/vendor/three.min.js',import.meta.url),'utf8');
function simulator(){
 const c=vm.createContext({console:{warn(){}},spineOffset,advanceNeeds,depthTarget,limitAttitude});
 vm.runInContext(three,c);
 const between=(a,b)=>engine.slice(engine.indexOf(a),engine.indexOf(b,engine.indexOf(a)));
 const init=engine.slice(engine.indexOf('  for (let i = 0; i < KOI_N; i++) {',engine.indexOf('function buildKoi()')),engine.indexOf('// Locomotion:'));
 vm.runInContext(between('function mulberry32','/* ------------------------------------------------------------------ 2.')+
 between('const POND_CTRL','function groundHeight')+
 between('const KOI_ROSTER_DEF','function koiPatternAtlas')+`
 const P={fishCount:20}, WATER_Y=0, KOI_MAX=20;
 const mesh=()=>({count:20,instanceMatrix:{needsUpdate:false},setMatrixAt(){}});
 const attr=()=>({setXYZW(){},needsUpdate:false});
 const KOI={fish:[],body:mesh(),fins:mesh(),eyes:mesh(),a1:attr(),a2:attr(),a3:attr()};
 const SH={uIce:{value:0},uKoiA:{value:Array.from({length:20},()=>new THREE.Vector4())},uKoiB:{value:Array.from({length:20},()=>new THREE.Vector4())}};
 const WORLD={obstacles:[]},STATE={under:false},TURTLE={},STROKE={active:false},FEED={active:false};
 const camera={position:new THREE.Vector3(0,3,4)};
 function addDrop(){} function bubbleBurst(){} function spawnSplash(){}
 function nearestFood(){return FEED.active?{x:0,y:0,z:1}:null;}
 buildSDF();
 function initFish(){`+init+`
 initFish();
 `+between('const _m4 =','/* ------------------------------------------------------------------ 12.')+`
 globalThis.sim={KOI,FEED,updateFish,sdf,pondDepth};`,c);
 return c.sim;
}
test('body flex holds the head still, grows toward the tail, and travels',()=>{
 const tail=[],middle=[];
 for(let i=0;i<120;i++){
  const phase=i/120*Math.PI*2;
  for(const s of [0,.1,.2]){assert.equal(Math.abs(spineOffset(s,phase,.1,.14)),0);assert.equal(Math.abs(spineSlope(s,phase,.1,.14)),0);}
  tail.push(spineOffset(.9,phase,.1,0));middle.push(spineOffset(.6,phase,.1,0));
  for(const s of [.21,.5,.9]){
   const derivative=(spineOffset(s+1e-5,phase,.1,.14)-spineOffset(s-1e-5,phase,.1,.14))/2e-5;
   assert.ok(Math.abs(derivative-spineSlope(s,phase,.1,.14))<1e-7,'normals follow the deformed skin');
  }
 }
 const range=v=>Math.max(...v)-Math.min(...v);
 assert.ok(range(tail)>.15);assert.ok(range(middle)>.045);assert.ok(range(tail)>range(middle)*2);
 assert.ok(Math.abs(tail.indexOf(Math.max(...tail))-middle.indexOf(Math.max(...middle)))>20);
});
test('actual scene locomotion explores depth, varies speed, and stays upright inside its basin',()=>{
 const s=simulator(),range=s.KOI.fish.map(()=>({x:[Infinity,-Infinity],y:[Infinity,-Infinity],z:[Infinity,-Infinity],speed:[Infinity,-Infinity]}));
 for(let i=0;i<9000;i++){
  s.updateFish(1/60,i/60);
  for(const [j,f]of s.KOI.fish.entries()){
   assert.ok([f.p.x,f.p.y,f.p.z,f.speed,f.pitch,f.roll].every(Number.isFinite));
   assert.ok(s.sdf(f.p.x,f.p.z)<0,'fish centers stay inside the pond');
   assert.ok(f.p.y<-.02,'fish remain submerged');
   assert.ok(f.p.y>=-s.pondDepth(f.p.x,f.p.z,-s.sdf(f.p.x,f.p.z))+f.size*.16,'body clears the floor');
   assert.ok(Math.abs(f.pitch)<=.161);assert.ok(Math.abs(f.roll)<=.101);
   for(const [key,value]of [['x',f.p.x],['y',f.p.y],['z',f.p.z],['speed',f.speed]]){range[j][key][0]=Math.min(range[j][key][0],value);range[j][key][1]=Math.max(range[j][key][1],value);}
  }
 }
 for(const r of range){assert.ok(r.y[1]-r.y[0]>.2,'every koi changes depth');assert.ok(r.z[1]-r.z[0]>1,'every koi explores front to back');assert.ok(r.speed[1]-r.speed[0]>.06,'burst-and-glide speed varies');}
 assert.equal(new Set(s.KOI.fish.map(f=>f.phase.toFixed(3))).size,20);
});
test('pause freezes fish physiology and position; feeding retains gradual upright turns',()=>{
 const s=simulator();s.updateFish(.016,0);
 const before=JSON.stringify(s.KOI.fish);
 for(let i=0;i<30;i++)s.updateFish(0,0);
 assert.equal(JSON.stringify(s.KOI.fish),before);
 s.FEED.active=true;
 for(let i=0;i<2400;i++){
  s.updateFish(1/60,i/60);
  for(const f of s.KOI.fish){assert.ok(Math.abs(f.pitch)<=.161);assert.ok(Math.abs(f.turnRate)<=1.351);assert.ok(f.speed<.55);}
 }
 assert.ok(s.KOI.fish.some(f=>f.memory),'fish remember a found feeding place');
});

test('every koi resumes position, body wave and independent fin motion after pausing',()=>{
 const s=simulator();s.updateFish(1/60,0);
 const before=s.KOI.fish.map(f=>({p:f.p.clone(),phase:f.phase,pecL:f.pecL,pecR:f.pecR}));
 for(let i=0;i<300;i++)s.updateFish(0,0);
 for(const [i,f]of s.KOI.fish.entries()){assert.equal(f.p.distanceTo(before[i].p),0);assert.equal(f.phase,before[i].phase);}
 for(let i=0;i<600;i++)s.updateFish(1/60,i/60);
 for(const [i,f]of s.KOI.fish.entries()){
  assert.ok(f.p.distanceTo(before[i].p)>.02,'each koi swims again');
  assert.ok(f.phase>before[i].phase,'body wave resumes');
  assert.ok(f.pecL>before[i].pecL&&f.pecR>before[i].pecR,'both side fins resume');
 }
});

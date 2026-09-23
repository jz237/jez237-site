import * as T from 'three';import assert from 'node:assert/strict';import ts from 'typescript';import fs from 'node:fs';
let source=fs.readFileSync(new URL('../ReefFish.ts',import.meta.url),'utf8');
source=source.replace("import metadata from './assets/fish/model-info.json';",'const metadata='+fs.readFileSync(new URL('../assets/fish/model-info.json',import.meta.url),'utf8')+';').replace("'./MarineFinFlex.ts'",JSON.stringify(new URL('../MarineFinFlex.ts',import.meta.url).href)).replace("'three'",JSON.stringify(import.meta.resolve('three')));
const {ReefFish}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));

const models=new Map();for(const s of ['tang','yellow','clown','anthias','chromis','gramma']){const g=new T.Group(),mouth=new T.Group(),eyes=new T.Group();mouth.name='mouth';mouth.position.x=.43;eyes.name='eyes';g.add(mouth,eyes);models.set(s,g);}
const obstacles=[];for(const x of [-1.5,1.5])for(const y of [1,2,3])obstacles.push({center:new T.Vector3(x,y,0),radius:.65});
for(const x of [-.75,0,.75])obstacles.push({center:new T.Vector3(x,1,-1.05),radius:.52});
for(const seedValue of [913,411,729]){
const originalRandom=Math.random;let seed=seedValue;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
try{
const world=new ReefFish(new T.Scene(),obstacles,[new T.Vector3(3,1,1),new T.Vector3(-3,1,1)],models);
world.fish.splice(1);const f=world.fish[0];f.position.set(0,1,.4);f.group.position.copy(f.position);f.progressPosition.copy(f.position);f.goal.set(0,1,-1.7);f.until=20;f.yaw=Math.PI/2;
const samples=[];for(let i=0;i<7200;i++){world.update(1/60,false);if(i%60===0){const s=world.snapshot();assert.equal(s.obstacleOverlaps,0);assert.equal(s.fishOverlaps,0);samples.push(s.positions[0]);}}
let minRange=Infinity;for(let i=10;i<samples.length;i++){const w=samples.slice(i-10,i+1),range=Math.hypot(...['x','y','z'].map(k=>Math.max(...w.map(p=>p[k]))-Math.min(...w.map(p=>p[k]))));minRange=Math.min(minRange,range);}
console.log({minRange,start:samples[0],end:samples.at(-1)});assert.ok(minRange>.25,'blue tang escapes a blocked goal and does not stay quivering');

}finally{Math.random=originalRandom;}
}

// A valid food segment does not guarantee an uncrowded lane. Recovery must
// temporarily take priority over food, then restore normal feeding eligibility.
{
 const world=new ReefFish(new T.Scene(),[],[new T.Vector3(3,1,1)],models);world.fish.splice(1);const f=world.fish[0];
 f.position.set(0,2,0);f.group.position.copy(f.position);f.progressPosition.copy(f.position);f.goal.set(-1,2,0);f.yaw=Math.PI;f.until=2;f.recoverUntil=2;
 world.foods.push({position:new T.Vector3(1,2,0),alive:true,age:0});
 for(let i=0;i<30;i++){world.update(1/60,false);assert.equal(f.goal.x,-1,'food cannot overwrite the committed escape waypoint');assert.equal(f.mode,'exploring');}
 assert.ok(f.position.x<-.04,'fish makes actual escape progress while food is present');
 f.recoverUntil=0;world.update(1/60,false);assert.equal(f.mode,'feeding','food becomes eligible after recovery');
 // The displacement watchdog must also work while a pellet remains selected.
 f.position.set(0,2,0);f.progressPosition.copy(f.position);f.progressAt=-10;f.recoverUntil=0;world.update(1/60,false);
 assert.ok(f.recoverUntil>world.clock,'feeding does not disable the progress watchdog');assert.equal(f.mode,'exploring');
console.log('Feeding recovery: committed escape, actual progress, food reacquisition and feeding watchdog passed.');
}

// Host-centered swimming must include returns, excursions, pauses and speed
// changes rather than a pair tracing the same orbit forever.
{
 const originalRandom=Math.random;let seed=98237;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 try{
  const host=new T.Vector3(3,1,.6),world=new ReefFish(new T.Scene(),[],[host],models);
  world.fish.splice(0,world.fish.length,...world.fish.filter(f=>f.species==='clown'));
  const stats=world.fish.map(()=>({modes:new Set(),min:Infinity,max:0,near:0,far:0}));
  for(let i=0;i<6000;i++){
   world.update(1/60,false);const snap=world.snapshot();assert.equal(snap.fishOverlaps,0);
   world.fish.forEach((f,j)=>{const s=stats[j];s.modes.add(f.mode);s.min=Math.min(s.min,f.velocity.length());s.max=Math.max(s.max,f.velocity.length());const radius=Math.hypot(f.position.x-host.x,f.position.z-host.z);if(radius<.55)s.near++;if(radius>.82)s.far++;});
  }
  for(const [j,s] of stats.entries()){
   assert.ok(s.near>50&&s.far>50,'leave canopy and return among tentacles');
   assert.ok(s.max>.65&&s.min<.12,'visible darts and deceleration');
   assert.ok(s.modes.has('sheltering')&&s.modes.has('darting from anemone')&&s.modes.has('returning to anemone'));
   assert.ok(world.fish[j].hostVisits>3,'repeated completed host visits');
  }
  assert.notDeepEqual(world.fish[0].position,world.fish[1].position,'independent pair with spacing');
  console.log('Clownfish host visits:',stats.map((s,i)=>({...s,modes:[...s.modes],visits:world.fish[i].hostVisits})));
 }finally{Math.random=originalRandom;}
}

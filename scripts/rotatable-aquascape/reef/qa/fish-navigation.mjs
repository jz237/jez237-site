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

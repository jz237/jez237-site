import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,next){try{return next(s,c)}catch(e){if(s.startsWith('.'))return next(s+'.ts',c);throw e}},load(url,c,next){if(url.endsWith('/LeafSurface.ts'))return {format:'module',shortCircuit:true,source:'export function leafSurfaceMaps(){return {color:null,bump:null,roughness:null}}'};return next(url,c)}});
const T=await import('three'),{height,addFernFixture,hardscapeObstacles}=await import('../tests/cory-habitat-fixture.mjs'),{buildBotanicalPlants}=await import('../lib/BotanicalPlants.ts'),{calmSwordLeaves}=await import('../lib/SwordCurrent.ts'),{buildAquariumPlumbing}=await import('../lib/AquariumPlumbing.ts'),{GrazerPlants}=await import('../lib/GrazerPlants.ts'),{Angelfish}=await import('../lib/Angelfish.ts');
test('angelfish leave blocked turns, keep moving and remain clear in the planted habitat',async()=>{
const scene=new T.Scene();buildBotanicalPlants(scene,height,{value:0});addFernFixture(scene);buildAquariumPlumbing(scene);calmSwordLeaves(scene);scene.updateMatrixWorld();const plants=new GrazerPlants(scene),life=new Angelfish(await hardscapeObstacles(),height,plants,new T.Group());
const report=life.states.map(s=>({min:s.position.toArray(),max:s.position.toArray(),distance:0,blocked:0,invalid:0}));let ms=0,peak=0;
for(let i=0;i<9000;i++){
 const headings=life.states.map(s=>s.yaw),before=life.states.map(s=>s.position.clone()),start=performance.now();life.update(1/30,i/30,1,[],[],()=>{});const elapsed=performance.now()-start;ms+=elapsed;peak=Math.max(peak,elapsed);
 for(const s of life.states){assert.ok(Math.abs(s.yaw-headings[s.id])<.65/30+.00001,'no turn snapping');const r=report[s.id];r.distance+=s.position.distanceTo(before[s.id]);s.position.toArray().forEach((v,j)=>{r.min[j]=Math.min(r.min[j],v);r.max[j]=Math.max(r.max[j],v)});r.blocked+=s.behavior.includes('obstacle')?1:0;if(!life.clear(s.position,s.yaw,s.pitch,s.size,s.id))r.invalid++;}
}
for(const r of report){assert.equal(r.invalid,0);assert.ok(r.distance>6,'does not remain trapped');assert.ok(r.max[1]-r.min[1]>.5);assert.ok(r.max[2]-r.min[2]>.5);}
assert.ok(report[0].min[2]<-.5,'uses open water behind the planting');
assert.ok(report[1].min[2]<.2,'companion also explores tank depth');
assert.ok(life.states[0].position.distanceTo(life.states[1].position)<3,'companions regroup');
});


test('nearby surfaces trigger a deliberate pelvic-fin reach which relaxes on leaving',()=>{
 let near=true;
 const plants={clearBody:(_p,body)=>body.length>1||!near};
 const life=new Angelfish([],()=>0,plants,new T.Group());
 for(let i=0;i<45;i++)life.update(1/30,i/30,1,[],[],()=>{});
 assert.ok(life.states.some(s=>s.reach>.7),'reaches toward a sensed surface');
 near=false;
 for(let i=45;i<120;i++)life.update(1/30,i/30,1,[],[],()=>{});
 assert.ok(life.states.every(s=>s.reach<.05),'relaxes after leaving');
});

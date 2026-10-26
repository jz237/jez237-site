import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {RUST,fitRust,rusts,startingRust} from '../src/age-rust';
import {VehicleSurface} from '../src/vehicle-surface';
/** A painted panel holding these rest points (model frame). */
const panel=(name:string,points:number[][])=>{const g=new T.BufferGeometry(),a=new T.BufferAttribute(new Float32Array(points.flat()),3);g.setAttribute('position',a.clone());g.setAttribute('wreckPosition',a);
  const m=new T.Mesh(g,new T.MeshPhysicalMaterial({name}));m.name='panel_test';return m;};
/** A body .9 m half wide: flanks from .3 m up, arch edges .42 m about hubs .35 m up at ±1.3 m, a stray point inside a tyre,
 * and a plastic skirt lower down. */
function car(scale=1){
  const model=new T.Group();model.scale.setScalar(scale);const flank:number[][]=[];
  for(const x of [-.9,.9])for(let z=-2;z<=2.001;z+=.25)for(let y=.3;y<=1.001;y+=.1)if(Math.min(Math.hypot(z-1.3,y-.35),Math.hypot(z+1.3,y-.35))>.42)flank.push([x,y,z]);
  for(const x of [-.88,.88])for(const axle of [1.3,-1.3])for(let a=.3;a<=Math.PI-.3;a+=.2)flank.push([x,.35+Math.sin(a)*.42,axle+Math.cos(a)*.42]);
  flank.push([.85,.6,1.3]);
  const panels=[panel('paint_Paint 1 Test',flank),panel('paint_Paint 2 Test',[[.9,.1,0],[-.9,.1,.2],[.9,.1,-.2]])];
  const wheels=[[.8,1.3],[-.8,1.3],[.8,-1.3],[-.8,-1.3]].map(([x,z])=>{const w=new T.Object3D();w.position.set(x,.35,z);model.add(w);return w;});
  model.add(...panels);model.updateMatrixWorld(true);return{model,panels,wheels};
}
test('each rival is its own amount rusty',()=>{
  const all=Array.from({length:10},(_,id)=>startingRust(id));assert.ok(all.every(a=>a>=RUST.age[0]&&a<=RUST.age[1]),'in range');
  assert.ok(new Set(all.map(a=>a.toFixed(3))).size>7,'not all alike');assert.equal(startingRust(4),startingRust(4));assert.ok(Number.isFinite(startingRust(NaN)));
});
test('painted steel rusts; the plastic trim, hoses and cabin do not',()=>{
  assert.ok(rusts('paint_Paint 1 Carmine')&&rusts('paint Estate Body')&&rusts('paint_Paint 1 Carmine.001'));
  assert.ok(!rusts('paint_Paint 2 Carmine')&&!rusts('paint Interior Trim')&&!rusts('Chrome')&&!rusts('Structure hoses'));
});
test('a car is fitted where it rots: the foot of its steel flanks, its width, its axles and the edges of its arches',()=>{
  const {model,panels,wheels}=car(),fit=fitRust(model,panels,wheels,.33)!;
  assert.ok(Math.abs(fit.bottom-.3)<1e-6,'the steel sill, not the plastic skirt below');assert.ok(Math.abs(fit.halfWidth-.9)<1e-6);
  assert.ok(Math.abs(fit.front-1.3)<1e-6&&Math.abs(fit.rear+1.3)<1e-6&&Math.abs(fit.hub-.35)<1e-6,'axles and hubs');
  assert.ok(Math.abs(fit.frontArch-.42)<.01&&Math.abs(fit.rearArch-.42)<.01,'the arch edges, past the stray point inside the tyre');
  const half=car(.5),scaled=fitRust(half.model,half.panels,half.wheels,.165)!;assert.ok(Math.abs(scaled.frontArch-.42)<.01,'the tyre measured in the model frame');
  assert.equal(fitRust(model,[panels[1]],wheels,.33),null,'no steel, no rust');assert.equal(fitRust(model,panels,[undefined,undefined,undefined,undefined],.33),null,'no wheels');
});
test('the steel paint rusts where it is fitted, dull and bare of lacquer; plastic trim gets its own program without it',()=>{
  const root=new T.Group(),steel=panel('paint_Paint 1 Test',[[0,0,0],[1,0,0],[0,1,0]]),trim=panel('paint_Paint 2 Test',[[0,0,0],[1,0,0],[0,1,0]]);
  for(const p of [steel,trim])p.userData.wreckRest=p.geometry.attributes.wreckPosition;root.add(steel,trim);
  const surface=new VehicleSurface(root,2);surface.rustAge=.5;assert.equal(surface.rustAge,0,'not fitted: none');
  surface.placeRust({bottom:.3,halfWidth:.9,front:1.3,rear:-1.3,hub:.35,frontArch:.42,rearArch:.44},.7);
  assert.deepEqual(surface.rust.value.toArray(),[.7,.3,.9,.42]);assert.deepEqual(surface.arches.value.toArray(),[1.3,-1.3,.35,.44]);
  surface.rustAge=3;assert.equal(surface.rustAge,1);surface.rustAge=NaN;assert.equal(surface.rustAge,0);
  const compile=(m:T.Material)=>{const s={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(s as any,undefined as any);return s;};
  const a=compile(steel.material as T.Material),b=compile(trim.material as T.Material);
  assert.ok(a.uniforms.carRust===surface.rust&&a.uniforms.carArches===surface.arches,'live');
  assert.ok(a.fragmentShader.includes('ageRust=smoothstep(rustEdge-.06,rustEdge+.06,rustField);')&&a.fragmentShader.includes(`vec3(${RUST.orange})`),'orange-brown rot');
  assert.ok(a.fragmentShader.includes('roughnessFactor=mix(roughnessFactor,.95,ageRust);')&&a.fragmentShader.includes('*(1.-max(ageRust,rustStain*.6));'),'dull, no lacquer');
  assert.ok(!b.fragmentShader.includes('rustField')&&b.fragmentShader.includes('float ageRust=0.,rustStain=0.;'),'the trim never rusts');
  const keys=[steel,trim].map(p=>(p.material as T.Material).customProgramCacheKey());assert.ok(keys[0].endsWith('-rust')&&keys[0]!==keys[1],'never sharing a program');
});
test('main fits every offline car but the buggy, rusting the rivals each their own amount and leaving the player as painted',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(car.extendedDamage&&type!=='buggy'){const fit=fitRust(car.model,car.panels,car.wheels,vehicleWheelRadius(type));if(fit)car.surfaceFinish.placeRust(fit,i===0?0:startingRust(car.id));}"));
  assert.ok(main.includes('rust: (id = 0, age?: number) =>'),'QA hook');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BRAKE_DUST,brakeDustStep,dirtyRims,startingBrakeDust} from '../src/brake-dust';
const run=(level:number,seconds:number,brake:number,speed:number,rain:number)=>{for(let i=0;i<seconds*60;i++)level=brakeDustStep(level,1/60,brake,speed,rain);return level;};
test('hard braking at speed cakes the wheels in dust, toward the most they hold, and only braking does',()=>{
  const stop=run(.1,2,1,20,0);assert.ok(stop>.16&&stop<.2,'a hard stop from 20 m/s adds a good share');
  assert.ok(run(.1,2,.3,20,0)<stop&&run(.1,2,1,8,0)<stop,'gentler or slower, less');assert.ok(run(0,600,1,30,0)>BRAKE_DUST.max*.99,'toward the most');
  assert.equal(run(.2,10,0,25,0),.2,'coasting adds none');assert.equal(run(.2,10,1,0,0),.2,'nor standing on the pedal');
});
test('only a downpour rinses it, slowly; bad input changes nothing',()=>{
  const wet=run(.5,30,0,0,1);assert.ok(wet<.5&&wet>.35,'a slow rinse');assert.ok(run(.5,30,0,0,.3)>wet,'less rain, less rinse');
  assert.equal(brakeDustStep(.3,NaN,1,20,0),.3);assert.equal(brakeDustStep(NaN,1/60,0,0,0),0);assert.equal(brakeDustStep(9,0,0,0,0),BRAKE_DUST.max,'capped');
});
test('every car starts with its own share of old dust',()=>{
  const all=[0,1,2,3,4,5,6,7].map(startingBrakeDust);assert.ok(all.every(d=>d>=BRAKE_DUST.start[0]&&d<=BRAKE_DUST.start[1]));
  assert.ok(new Set(all.map(d=>d.toFixed(3))).size>5,'not all alike');assert.equal(startingBrakeDust(3),startingBrakeDust(3));assert.ok(Number.isFinite(startingBrakeDust(NaN)));
});
test('a car gets its own rim materials that keep their shader work, darken, dull and lose their shine with the dust',()=>{
  const rim=new T.MeshPhysicalMaterial({name:'rim alloy',metalness:1,clearcoat:1});let wrapped=0;
  rim.onBeforeCompile=()=>{wrapped++;};rim.customProgramCacheKey=()=>'quarry-rim';
  const wheel=new T.Group(),spokes=new T.Mesh(new T.BoxGeometry(),rim),nut=new T.Mesh(new T.BoxGeometry(),rim),tyre=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({name:'tyre rubber'}));
  const disc=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({name:'brake disc'})),fitted=new T.Mesh(new T.BoxGeometry(),new T.MeshStandardMaterial({name:'trim'}));fitted.name='hubcap_fitted';
  wheel.add(spokes,nut,tyre,disc,fitted);const tyreMat=tyre.material,discMat=disc.material,fittedMat=fitted.material,dust={value:.4};
  assert.equal(dirtyRims([wheel,undefined],dust),1,'one copy for the shared rim');
  assert.ok(spokes.material!==rim&&spokes.material===nut.material,'its own copy, shared on the car');
  assert.ok(tyre.material===tyreMat&&disc.material===discMat&&fitted.material===fittedMat,'tyres, discs and the shared fitted hubcaps left alone');
  const m=spokes.material as T.MeshPhysicalMaterial,shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};
  m.onBeforeCompile(shader as any,undefined as any);assert.equal(wrapped,1,'the old shader work still runs');assert.ok(shader.uniforms.rimDust===dust,'live');
  assert.ok(shader.vertexShader.includes('vRimPos=position;'));
  assert.ok(shader.fragmentShader.includes(`diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${BRAKE_DUST.tint}),clamp(rimDust*${BRAKE_DUST.mix}*(.7+.3*rimSpeck),0.,1.));`),'caked dark');
  assert.ok(shader.fragmentShader.includes('roughnessFactor=mix(roughnessFactor,.6,rimDust*.5);'),'duller');assert.ok(shader.fragmentShader.includes('material.clearcoat*=1.-rimDust;'),'no lacquer shine');
  assert.ok(shader.fragmentShader.includes('reflectedLight.indirectSpecular*=1.-rimDust*.8;reflectedLight.directSpecular*=1.-rimDust*.6;'),'darker reflections');
  assert.equal(m.customProgramCacheKey(),'quarry-rim-brake-dust-v4');assert.equal(m.metalness,1,'still metal');
  const other=new T.Group(),o=new T.Mesh(new T.BoxGeometry(),rim);other.add(o);dirtyRims([other],{value:0});assert.ok(o.material!==m,'each car its own');
});
test('main dusts the rims of offline cars as they brake, rinsed in the rain, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage){const dust={value:startingBrakeDust(car.id)};if(dirtyRims(car.wheels,dust))rimDust.set(car,dust);}'),'offline only, own start');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){const d=rimDust.get(c);if(d)d.value=brakeDustStep(d.value,dt,c.input?.brake??0,c.speed,eventLighting==='rain'?shower:0);}"),'braking, rain');
  assert.ok(main.includes('brakeDust: (id = 0, level?: number) =>'));
});

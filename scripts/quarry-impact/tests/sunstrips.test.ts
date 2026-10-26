import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {SUNSTRIP,fitSunstrip,stripBounds,sunstripFor} from '../src/sunstrips';
test('most rivals run a sunstrip with a name of their own, in matching colours',()=>{
  const all=Array.from({length:300},(_,id)=>sunstripFor(id)),share=all.filter(Boolean).length/all.length;assert.ok(Math.abs(share-SUNSTRIP.share)<.08,`share ${share}`);
  for(const s of all)if(s){assert.ok((SUNSTRIP.names as readonly string[]).includes(s.name));const k=SUNSTRIP.bands.indexOf(s.band as never);assert.ok(k>=0&&SUNSTRIP.inks[k]===s.ink,'band and ink go together');}
  assert.ok(new Set(all.filter(Boolean).map(s=>s!.name)).size>8,'plenty of names');assert.deepEqual(sunstripFor(9),sunstripFor(9));assert.doesNotThrow(()=>sunstripFor(NaN));
});
test('the band runs across the windscreen’s width over the top of its height, read from in front',()=>{
  const rest=new T.BufferAttribute(new Float32Array([-.7,.8,1,.7,.8,1,-.6,1.3,.6,.6,1.3,.6]),3),b=stripBounds(rest);
  const near=(a:number,b:number)=>Math.abs(a-b)<1e-6;assert.ok(near(b.left,-.7)&&near(b.right,.7)&&near(b.top,1.3),'its −x side on the left as you face it');assert.ok(near(b.band,Math.max(SUNSTRIP.least,.5*SUNSTRIP.band)));
  const low=stripBounds(new T.BufferAttribute(new Float32Array([-.7,1,1,.7,1.1,1]),3));assert.equal(low.band,SUNSTRIP.least,'never a sliver');
});
test('the strip is part of the glass: its child, on its own geometry, only over the band',()=>{
  const g=new T.PlaneGeometry(1.4,.5),screen=new T.Mesh(g,new T.MeshPhysicalMaterial({name:'Glass'}));g.setAttribute('wreckPosition',g.attributes.position.clone());
  const strip=fitSunstrip(screen,{name:'BAZZA',band:0x0c0c0c,ink:0xf2c21a})!;assert.ok(strip&&strip.parent===screen&&strip.geometry===g,'rides with the glass, dents and all');
  const m=strip.material as T.ShaderMaterial;assert.ok(m.transparent&&!m.depthWrite&&m.polygonOffset,'laid over the glass');
  assert.ok(m.fragmentShader.includes('discard')&&m.vertexShader.includes('attribute vec3 wreckPosition;'),'only the band, by the rest shape');
  screen.visible=false;assert.equal(strip.parent?.visible,false,'gone when the windscreen goes');
  assert.equal(fitSunstrip(new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial()),{name:'TEL',band:0,ink:0xffffff}),null,'no rest shape, no strip');
});
test('main lays a strip on offline rivals’ windscreens (not the player’s), with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const strip=sunstripFor(car.id),screen=windscreen(car.glass,car.root);if(strip&&screen&&fitSunstrip(screen,strip))sunstrips.set(car,strip.name);}'));
  assert.ok(main.includes('sunstrip: (id = 0) =>'));
});

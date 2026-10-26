import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {WASH,fitWashMe,rearWindow,washWords} from '../src/wash-me';
test('about half the grubby old rivals have something written on the rear window, each its own',()=>{
  const all=Array.from({length:300},(_,id)=>washWords(id,1)),share=all.filter(Boolean).length/all.length;assert.ok(Math.abs(share-WASH.share)<.08,`share ${share}`);
  assert.ok(all.every(w=>w===null||(WASH.words as readonly string[]).includes(w)));assert.ok(new Set(all.filter(Boolean)).size>=4,'several sayings');
  assert.ok(Array.from({length:300},(_,id)=>washWords(id,WASH.age-.01)).every(w=>w===null),'not on cleaner cars');assert.equal(washWords(3,.9),washWords(3,.9));assert.equal(washWords(3,NaN),null);
});
test('the rear window is the most rearward pane across the middle of the car',()=>{
  const root=new T.Group(),pane=(x:number,z:number)=>{const m=new T.Mesh(new T.PlaneGeometry(.5,.3),new T.MeshBasicMaterial());m.position.set(x,1,z);root.add(m);return m;};
  const front=pane(0,1),side=pane(.8,-1.6),rear=pane(.05,-1.2);pane(-.8,0);assert.equal(rearWindow([front,side,rear],root),rear,'not a side window, however far back');
  assert.equal(rearWindow([],root),undefined);
});
test('the film is part of the glass: its child, on its own geometry, a pale dust with the words wiped through',()=>{
  const g=new T.PlaneGeometry(1.2,.4),pane=new T.Mesh(g,new T.MeshPhysicalMaterial({name:'Glass'}));g.setAttribute('wreckPosition',g.attributes.position.clone());
  const film=fitWashMe(pane,'WASH ME')!;assert.ok(film&&film.parent===pane&&film.geometry===g,'rides with the glass');
  const m=film.material as T.ShaderMaterial;assert.ok(m.transparent&&!m.depthWrite&&m.polygonOffset);assert.equal(m.uniforms.film.value,WASH.film);
  assert.ok([WASH.dust>>16,(WASH.dust>>8)&255,WASH.dust&255].every(c=>c>=0xb0),'pale enough (sRGB) to read over dark glass');
  assert.equal(fitWashMe(new T.Mesh(new T.PlaneGeometry(),new T.MeshBasicMaterial()),'CLEAN ME'),null,'no rest shape, no film');
});
test('main writes on offline rivals’ rear windows (never the windscreen or the player’s car), with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage&&i!==0){const words=washWords(car.id,startingRust(car.id)),pane=rearWindow(car.glass,car.root);if(words&&pane&&pane!==windscreen(car.glass,car.root)&&fitWashMe(pane,words))washed.set(car,words);}'));
  assert.ok(main.includes('washMe: (id = 0) =>'));
});

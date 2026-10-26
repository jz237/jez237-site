import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {LETTERS,letterTyres,letteringFor} from '../src/tyre-lettering';
test('each car’s tyres carry their own made-up make, a line and a size; the muscle car’s are raised white, most are moulded',()=>{
  const all=Array.from({length:200},(_,id)=>letteringFor(id,'coupe'));
  for(const l of all){assert.ok(LETTERS.makes.some(m=>l.text.startsWith(m))&&LETTERS.sizes.some(s=>l.text.endsWith(s)));assert.equal(l.white,false);}
  assert.ok(new Set(all.map(l=>l.text)).size>20);assert.ok(Array.from({length:50},(_,id)=>letteringFor(id,'muscle')).every(l=>l.white));
  const classics=Array.from({length:400},(_,id)=>letteringFor(id,'wagon').white).filter(Boolean).length/400;assert.ok(Math.abs(classics-LETTERS.white)<.07,`${classics}`);
  assert.deepEqual(letteringFor(3,'utility'),letteringFor(3,'utility'));assert.doesNotThrow(()=>letteringFor(NaN,'x'));
});
test('the lettering is laid into each tyre’s own shader — on the outer sidewall, no new mesh — once',()=>{
  const ctx=new Proxy({},{get:()=>()=>{},set:()=>true});(globalThis as any).document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
  try{
    const root=new T.Group(),wheels=[-1,1].map(side=>{const wheel=new T.Group();wheel.position.set(side*.8,0,1.3);const g=new T.CylinderGeometry(.35,.35,.2,24).rotateZ(Math.PI/2);
      const tyre=new T.Mesh(g,new T.MeshStandardMaterial({name:'Classic Tire'})),hub=new T.Mesh(new T.CylinderGeometry(.2,.2,.21,12).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name:'Rim'}));wheel.add(tyre,hub);root.add(wheel);return wheel;});
    assert.equal(letterTyres(wheels,'muscle',3,root),2,'the tyres, not the rims');assert.equal(letterTyres(wheels,'muscle',3,root),0,'once');
    const left=(wheels[0].children[0] as T.Mesh).material as T.MeshStandardMaterial;assert.ok(left.customProgramCacheKey().endsWith('-lettered-v2'));
    const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:'#include <common>\n#include <beginnormal_vertex>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>'};
    left.onBeforeCompile(shader as never,{} as never);
    assert.ok(shader.vertexShader.includes('vLetter=(letterToWheel*vec4(position,1.)).xyz;')&&shader.fragmentShader.includes('texture2D(letterMap,vec2(lu,lv))'));
    assert.equal(shader.uniforms.letterOut.value,-1,'the left tyre’s outer face looks left');assert.equal(((wheels[0].children[1] as T.Mesh).material as T.Material).customProgramCacheKey(),new T.MeshStandardMaterial().customProgramCacheKey(),'rim untouched');
  }finally{delete (globalThis as any).document;}
  assert.equal(letterTyres([new T.Group()],'coupe',1,new T.Group()),0,'no document, no lettering');
});
test('main letters offline cars’ tyres, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage){const n=letterTyres(car.wheels,type,car.id,car.root,car.tread);if(n)letteredTyres.set(car,n);}')&&main.includes('tyreLetters: (id = 0) =>'));
});

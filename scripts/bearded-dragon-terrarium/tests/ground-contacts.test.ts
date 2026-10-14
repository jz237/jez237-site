import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {groundHeight,MAX_GROUND_HEIGHT} from '../lib/Ground';
import {TailContacts} from '../lib/TailContacts';
import {hardscape} from './locomotion-fixture';

test('bounded ground queries retain the exact contact result across sand, dunes and water',()=>{
  const exact=new TailContacts([],groundHeight),fast=new TailContacts([],groundHeight,MAX_GROUND_HEIGHT);
  for(let x=-.78;x<=.78;x+=.025)for(let z=-.44;z<=.44;z+=.025){
    assert.ok(groundHeight(x,z)<=MAX_GROUND_HEIGHT);
    for(const y of [.07,.085,.09,.15]){
      const p=new THREE.Vector3(x,y,z),a=p.clone(),b=p.clone(),na=new THREE.Vector3(),nb=new THREE.Vector3();
      assert.equal(fast.projectPoint(p,a,.008,na),exact.projectPoint(p,b,.008,nb));
      assert.deepEqual(a.toArray(),b.toArray());assert.deepEqual(na.toArray(),nb.toArray());
    }
  }
});

test('elevated samples skip the procedural floor while low samples still resolve contact',()=>{
  let queries=0;const contacts=new TailContacts([],()=>{queries++;return .08;},.09);
  const p=new THREE.Vector3(0,.2,0),n=new THREE.Vector3();
  assert.equal(contacts.projectPoint(p,p.clone(),.01,n),false);assert.equal(queries,0);
  const low=new THREE.Vector3(0,.075,0);
  assert.equal(contacts.projectPoint(low,low,.01,n),true);assert.equal(queries,1);
  assert.ok(Math.abs(low.y-.0905)<1e-12);
});

test('cached free cells and nearby faces preserve exact swept contacts across the real hardscape',()=>{
  const {hard}=hardscape(),exact=new TailContacts(hard.map(h=>h.mesh),groundHeight,MAX_GROUND_HEIGHT);
  const fast=new TailContacts(hard.map(h=>h.mesh),groundHeight,MAX_GROUND_HEIGHT);
  let seed=98765;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const p=new THREE.Vector3(),previous=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),na=new THREE.Vector3(),nb=new THREE.Vector3();
  for(let cell=0;cell<500;cell++){
    const centre=new THREE.Vector3((random()-.5)*1.5,.065+random()*.3,(random()-.5)*.8);
    // Revisit neighbouring points with different radii and swept paths, not
    // merely an identical memoized query at a single resting location.
    for(let sample=0;sample<20;sample++){
      p.copy(centre).add(new THREE.Vector3(random()-.5,random()-.5,random()-.5).multiplyScalar(.01));
      previous.copy(p).add(new THREE.Vector3(random()-.5,random()-.5,random()-.5).multiplyScalar(.006));
      const radius=random()*.02;
      for(const solid of (exact as any).solids)solid.nearby.clear();
      const x=exact.projectPoint(previous,a.copy(p),radius,na.set(0,0,0)),y=fast.projectPoint(previous,b.copy(p),radius,nb.set(0,0,0));
      assert.equal(x,y,JSON.stringify({cell,sample,p:p.toArray(),previous:previous.toArray(),radius,a:a.toArray(),b:b.toArray()}));assert.ok(a.distanceTo(b)<1e-8,`projection differs by ${a.distanceTo(b)}`);
      assert.ok(na.distanceTo(nb)<1e-7,`normal differs by ${na.distanceTo(nb)}`);
    }
  }
});

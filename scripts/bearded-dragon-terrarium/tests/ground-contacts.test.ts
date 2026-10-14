import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {groundHeight,MAX_GROUND_HEIGHT} from '../lib/Ground';
import {TailContacts} from '../lib/TailContacts';

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

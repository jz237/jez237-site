import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from '../vendor/three.module.min.js';
import {createProjection} from '../src/geo.js';
import {createStore} from '../src/state.js';
import {createCityFeatures} from '../src/city-features.js';
import {BRIDGE_DEMOS,UNDERGROUND_ROUTES,UNDERGROUND_BOUNDS,openingPose,openingCycle}
  from '../src/city-features-data.js';
const projection=createProjection(JSON.parse(readFileSync(new URL('../data/terrain.json',import.meta.url))));

test('bridge mechanisms remain bounded and the demonstration completes without looping',()=>{
  assert.equal(openingPose('bascule',-1).angle,0);
  assert.equal(openingPose('bascule',2).angle,Math.PI*.43);
  assert.equal(openingPose('bascule',.5).lift,0);
  assert.equal(openingPose('lift',1,22.56).lift,22.56);
  assert.equal(openingPose('lift',1).angle,0);
  assert.equal(openingPose('lift',NaN).fraction,0);
  assert.equal(openingCycle(0),0);assert.equal(openingCycle(7),1);
  assert.equal(openingCycle(10),1);assert.equal(openingCycle(17),0);assert.equal(openingCycle(200),0);
  for(let t=0;t<=17;t+=.01)assert.ok(openingCycle(t)>=0&&openingCycle(t)<=1);
});

test('curated corridors fit the region and explicitly separate display depths from source geometry',()=>{
  const b=UNDERGROUND_BOUNDS;
  for(const route of UNDERGROUND_ROUTES){
    assert.ok(route.source.startsWith('https://'));assert.ok(route.level<0&&route.level> -200);
    for(const [lon,lat] of route.path){
      assert.ok(lon>b.west&&lon<b.east&&lat>b.south&&lat<b.north);
      assert.ok(projection.contains(lon,lat));
    }
  }
  for(const bridge of Object.values(BRIDGE_DEMOS)){
    assert.ok(bridge.span>70&&bridge.span<200);
    bridge.ends.forEach(([lon,lat])=>assert.ok(projection.contains(lon,lat)));
  }
});

class Element extends EventTarget {
  constructor(tag='div'){super();this.tagName=tag;this.children=[];this.style={setProperty(){}};
    this.classList={add(){},remove(){},contains(){return true;}};this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(){}
  remove(){}
  querySelector(){return null;}
}
test('optional models release GPU assets, restore shaders, and preserve map settings after repeated use',()=>{
  const oldDocument=globalThis.document;
  const nodes=new Map();const doc=new Element();doc.body=new Element();
  doc.createElement=tag=>new Element(tag);doc.querySelector=()=>null;
  doc.getElementById=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  globalThis.document=doc;
  const scene=new THREE.Scene(),sky=new THREE.Mesh();scene.add(sky);
  const material=new THREE.MeshBasicMaterial(),mesh=new THREE.Mesh(new THREE.BoxGeometry(),material);
  mesh.name='structures-bridges';scene.add(mesh);
  const before=material.onBeforeCompile,cache=material.customProgramCacheKey;
  const store=createStore(),initial=store.get();
  const motion={stop(){},flyTo(){}};
  const feature=createCityFeatures(THREE,{scene,sky,projection,sampleElevation:()=>10,
    store,motion,stopOtherModes(){},invalidate(){}});
  const camera=new THREE.PerspectiveCamera();camera.position.set(0,1000,0);
  let disposed=0,expectedDisposals=0;
  try {
    assert.equal(feature.stats().resources,0);
    for(let round=0;round<3;round++){
      feature.open('bridge');assert.equal(feature.active,true);assert.equal(store.value('photoMode'),'relief');
      const root=scene.getObjectByName('City discovery models');let meshes=0;
      root.traverse(n=>{if(n.isMesh)meshes++;});assert.ok(meshes<=10);
      assert.notEqual(material.onBeforeCompile,before);
      const controls=nodes.get('cityFeatureControls');
      const play=controls.children.find(n=>n.textContent==='Play one opening');play.onclick();
      for(let i=0;i<180;i++)feature.update(camera,.1,1366,768);
      assert.equal(feature.animating,false);assert.equal(feature.stats().opening,0);
      feature.open('underground');assert.equal(feature.stats().mode,'underground');
      const resources=new Set();root.traverse(n=>{
        if(n.geometry)resources.add(n.geometry);if(n.material)resources.add(n.material);
      });
      assert.ok(resources.size>0);
      expectedDisposals+=resources.size;
      resources.forEach(r=>r.addEventListener('dispose',()=>disposed++));
      const compare=nodes.get('cityFeatureControls').children.find(n=>n.textContent==='Show city surface');
      compare.onclick();assert.equal(root.visible,false);compare.onclick();assert.equal(root.visible,true);
      feature.close();assert.equal(root.children.length,0);assert.equal(feature.stats().resources,0);
      assert.equal(material.onBeforeCompile,before);assert.equal(material.customProgramCacheKey,cache);
      assert.equal(store.value('photoMode'),initial.photoMode);
      assert.equal(store.value('exaggeration'),initial.exaggeration);
      assert.equal(store.value('diorama'),initial.diorama);
    }
    assert.equal(disposed,expectedDisposals);
  } finally {feature.dispose();material.dispose();mesh.geometry.dispose();globalThis.document=oldDocument;}
});

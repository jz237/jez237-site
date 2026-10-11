import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import { createCityLighting } from '../src/city-lighting.js';

function fixture(){
  const renders=[];
  let target=null;
  const renderer={getRenderTarget:()=>target,setRenderTarget:value=>{target=value;},
    getClearAlpha:()=>1,getClearColor:color=>color.set(0),setClearColor(){},clear(){},
    render:(scene,camera)=>renders.push({scene,camera})};
  const lighting=createCityLighting(THREE,renderer),group=new THREE.Group();
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(9),3));
  geometry.setAttribute('aGround',new THREE.BufferAttribute(new Float32Array(3),1));
  const material=new THREE.ShaderMaterial({uniforms:{uGrow:{value:1},uExag:{value:1},
    uHScale:{value:1},uLocalClip:{value:0},uLocalBounds:{value:new THREE.Vector4()},
    uEraYear:{value:9999},uStudyBounds:{value:new THREE.Vector4()}}});
  const mesh=new THREE.Mesh(geometry,material);group.add(mesh);
  const params={group,focusX:0,focusZ:0,ground:10,exaggeration:1,
    sunDir:new THREE.Vector3(.3,.8,.4).normalize(),distance:900,
    state:{cityShadows:true,lightweight:false,era:'present',compareMode:'off',cloudCoverage:.4},
    quality:'balanced',dt:.11,time:0,miniature:0};
  return {lighting,group,mesh,params,renders,update:()=>lighting.update(params)};
}

test('stationary buildings reuse shadow depth while cloud animation keeps advancing',()=>{
  const f=fixture();
  try{
    f.update();
    for(let i=1;i<=200;i++){f.params.time=i*.11;f.update();}
    assert.equal(f.renders.length,1);
    assert.equal(f.lighting.uniforms.uCityTime.value,22);
    f.params.state.cityShadows=false;f.update();
    assert.equal(f.lighting.uniforms.uCityShadowOn.value,0);
    f.params.state.cityShadows=true;f.params.dt=.001;f.update();
    assert.equal(f.renders.length,2,'re-enabling refreshes immediately');
  }finally{f.lighting.dispose();}
});

test('restoring a graphics context refreshes cached shadow depth before reusing it',()=>{
  const f=fixture();
  try{
    f.update();f.update();assert.equal(f.renders.length,1);
    f.lighting.invalidate();f.params.dt=.001;f.update();
    assert.equal(f.renders.length,2,'empty restored depth targets are rebuilt immediately');
    f.update();assert.equal(f.renders.length,2);
  }finally{f.lighting.dispose();}
});

test('shadow depth refreshes for geometry, growth, clipping, transforms and lighting changes',()=>{
  const f=fixture();
  try{
    f.update();
    const changes=[
      ()=>{f.mesh.material.uniforms.uGrow.value=.8;},
      ()=>{f.mesh.material.uniforms.uHScale.value=2;},
      ()=>{f.mesh.material.uniforms.uExag.value=2;},
      ()=>{f.mesh.geometry.attributes.position.needsUpdate=true;},
      ()=>{f.mesh.geometry.setDrawRange(0,3);},
      ()=>{f.mesh.material.uniforms.uLocalClip.value=1;},
      ()=>{f.mesh.material.uniforms.uLocalBounds.value.x=12;},
      ()=>{f.mesh.material.uniforms.uEraYear.value=1900;},
      ()=>{f.mesh.material.defines.ARCHITECTURAL_STUDY=1;},
      ()=>{f.mesh.material.uniforms.uStudyBounds.value.z=50;},
      ()=>{f.mesh.position.x=2;},
      ()=>{f.params.focusX=80;},
      ()=>{f.params.sunDir.x+=.1;},
      ()=>{f.params.distance=1800;},
      ()=>{f.params.quality='performance';},
      ()=>{f.mesh.visible=false;},
      ()=>{f.group.remove(f.mesh);},
      ()=>{f.group.add(f.mesh);},
    ];
    for(const change of changes){
      const before=f.renders.length;change();f.update();
      assert.equal(f.renders.length,before+1,change.toString());
      f.update();assert.equal(f.renders.length,before+1,'unchanged depth is cached again');
    }
  }finally{f.lighting.dispose();}
});

test('hidden parent buildings do not cast shadows and transformed buildings keep their placement',()=>{
  const f=fixture();
  try{
    const parent=new THREE.Group();parent.position.set(12,8,4);
    f.group.add(parent);parent.add(f.mesh);f.update();
    const shadow=f.renders.at(-1).scene.children[0];
    assert.deepEqual(shadow.matrix.elements,f.mesh.matrixWorld.elements);
    parent.visible=false;f.update();assert.equal(shadow.visible,false);
    parent.visible=true;f.update();assert.equal(shadow.visible,true);
    assert.equal(f.renders.length,3);
  }finally{f.lighting.dispose();}
});

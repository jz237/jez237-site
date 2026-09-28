import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import { DAYLIGHT_DIRECTION, fitStaticShadowCamera, staticCasterScene, StaticQuarryShadows } from '../src/static-shadows';
import { quarryArenaSurface } from '../src/scenery-arena-material';

const caster = (name:string, material:T.Material|T.Material[] = new T.MeshStandardMaterial()) => {
  const mesh = new T.Mesh(new T.BoxGeometry(2, 3, 4), material);
  mesh.name = name; mesh.castShadow = true; return mesh;
};
const meshList = (root:T.Object3D) => {
  const meshes:T.Mesh[] = []; root.traverse(o => { if(o instanceof T.Mesh)meshes.push(o); }); return meshes;
};
const materialsOf = (mesh:T.Mesh) => Array.isArray(mesh.material) ? mesh.material : [mesh.material];
const sourceState = (root:T.Object3D) => {
  const state:unknown[] = []; root.updateMatrixWorld(true);
  root.traverse(o => state.push({id:o.uuid,parent:o.parent?.uuid,visible:o.visible,matrix:o.matrix.toArray(),world:o.matrixWorld.toArray(),
    cast:o.castShadow,receive:o.receiveShadow,geometry:o instanceof T.Mesh?o.geometry.uuid:null,
    materials:o instanceof T.Mesh?materialsOf(o).map(m=>m.uuid):null}));
  return state;
};
const closeVector = (a:T.Vector3,b:T.Vector3,tolerance=1e-9) => assert.ok(a.distanceTo(b)<tolerance,`${a.toArray()} differs from ${b.toArray()}`);
const shader = () => ({vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader,uniforms:{} as Record<string,T.IUniform>});
const compile = (material:T.Material) => {
  const result=shader(); material.onBeforeCompile(result as any,{} as T.WebGLRenderer); return result;
};

class CaptureRenderer {
  target:T.WebGLRenderTarget|null = new T.WebGLRenderTarget(13,17);
  face=3; mip=2; color=new T.Color(0x123456); alpha=.27; scissor=true; autoClear=false;
  shadowMap={enabled:true,autoUpdate:false,needsUpdate:true};
  info={render:{calls:13,triangles:37}};
  calls:{scene:T.Scene;camera:T.Camera;target:T.WebGLRenderTarget|null}[]=[];
  throwOnRender=false;
  getRenderTarget(){return this.target;}
  getActiveCubeFace(){return this.face;}
  getActiveMipmapLevel(){return this.mip;}
  getClearColor(to:T.Color){return to.copy(this.color);}
  getClearAlpha(){return this.alpha;}
  getScissorTest(){return this.scissor;}
  setScissorTest(value:boolean){this.scissor=value;}
  setClearColor(value:T.ColorRepresentation,alpha:number){this.color.set(value);this.alpha=alpha;}
  setRenderTarget(target:T.WebGLRenderTarget|null,face=0,mip=0){this.target=target;this.face=face;this.mip=mip;}
  render(scene:T.Scene,camera:T.Camera){
    assert.equal(this.shadowMap.enabled,false,'depth capture must not start the regular sun shadow pass');
    assert.equal(this.autoClear,true);assert.equal(this.scissor,false);
    assert.equal(this.color.getHex(),0xffffff);assert.equal(this.alpha,1);
    assert.ok(this.target);assert.notEqual(this.target.width,13);
    this.calls.push({scene,camera,target:this.target});
    if(this.throwOnRender)throw new Error('deliberate renderer failure');
    this.info.render.calls+=7;this.info.render.triangles+=123;
  }
  get renderer(){return this as unknown as T.WebGLRenderer;}
  state(){return {target:this.target,face:this.face,mip:this.mip,color:this.color.toArray(),alpha:this.alpha,
    scissor:this.scissor,autoClear:this.autoClear,shadowMap:{...this.shadowMap}};}
}

test('static depth selects the hidden highest LOD, excludes dynamic/transparent objects and preserves source ownership',()=>{
  const source=new T.Scene(),parent=new T.Group();parent.position.set(7,2,-4);parent.rotation.y=.4;parent.scale.set(2,1,1.5);source.add(parent);
  const ordinary=caster('ordinary');parent.add(ordinary);
  const lod=new T.LOD(),near=new T.Group(),far=new T.Group();
  near.add(caster('fixed-near'));far.add(caster('displayed-far'));
  lod.addLevel(near,0);lod.addLevel(far,50);near.visible=false;far.visible=true;parent.add(lod);
  const dynamic=new T.Group();dynamic.add(caster('dynamic-car'));source.add(dynamic);
  const prop=caster('loose-barrel');source.add(prop);
  const hidden=new T.Group();hidden.visible=false;hidden.add(caster('hidden-decoration'));source.add(hidden);
  const noncaster=caster('no-shadow');noncaster.castShadow=false;source.add(noncaster);
  const transparent=caster('transparent',new T.MeshPhysicalMaterial({transparent:true,opacity:.3}));transparent.position.x=10_000;source.add(transparent);
  const before=sourceState(source),result=staticCasterScene(source,new Set([dynamic,prop]));
  assert.deepEqual(meshList(result.scene).map(m=>m.name).sort(),['fixed-near','ordinary']);
  for(const clone of meshList(result.scene)){
    const original=source.getObjectByName(clone.name) as T.Mesh;
    assert.equal(clone.geometry,original.geometry,'geometry is shared, not copied or edited');
    assert.notEqual(clone.material,original.material);
    assert.deepEqual(clone.matrixWorld.toArray(),original.matrixWorld.toArray());
    assert.equal(clone.matrixAutoUpdate,false);assert.equal(clone.castShadow,false);assert.equal(clone.receiveShadow,false);
  }
  assert.ok(new T.Box3().setFromObject(result.scene).max.x<100,'non-rendering transparent casters cannot inflate the camera fit');
  assert.deepEqual(sourceState(source),before,'LOD selection, visibility, transforms and scene parents are untouched');
  result.materials.forEach(m=>m.dispose());
});

test('static depth retains instance transforms and alpha-cutout silhouettes with independent owned depth materials',()=>{
  const source=new T.Scene(),parent=new T.Group();parent.position.set(-3,4,5);parent.rotation.set(.1,.3,-.2);source.add(parent);
  const map=new T.Texture(),alphaMap=new T.Texture();
  const leaves=new T.MeshStandardMaterial({map,alphaMap,alphaTest:.45,transparent:true,side:T.DoubleSide});
  const instances=new T.InstancedMesh(new T.BoxGeometry(),leaves,2);instances.name='branches';instances.castShadow=true;
  instances.setMatrixAt(0,new T.Matrix4().makeTranslation(8,1,-3));
  instances.setMatrixAt(1,new T.Matrix4().compose(new T.Vector3(-4,2,6),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),.5),new T.Vector3(2,3,4)));
  instances.setColorAt(0,new T.Color(.4,.5,.3));parent.add(instances);
  const invisible=new T.MeshStandardMaterial({visible:false}),opaque=new T.MeshStandardMaterial({side:T.FrontSide});
  const mixed=caster('mixed',[opaque,invisible]);source.add(mixed);
  const copy=caster('shared-material',leaves);source.add(copy);
  const before=sourceState(source),result=staticCasterScene(source,new Set());
  const clone=result.scene.getObjectByName('branches') as T.InstancedMesh;
  assert.ok(clone instanceof T.InstancedMesh);assert.equal(clone.count,2);assert.equal(clone.geometry,instances.geometry);
  assert.deepEqual(clone.instanceMatrix.array,instances.instanceMatrix.array);assert.notEqual(clone.instanceMatrix.array,instances.instanceMatrix.array);
  assert.deepEqual(clone.instanceColor!.array,instances.instanceColor!.array);
  const depth=clone.material as T.MeshDepthMaterial;
  assert.equal(depth.depthPacking,T.RGBADepthPacking);assert.equal(depth.map,map);assert.equal(depth.alphaMap,alphaMap);
  assert.equal(depth.alphaTest,.45);assert.equal(depth.visible,true);assert.equal(depth.side,T.DoubleSide);
  assert.equal((result.scene.getObjectByName('shared-material') as T.Mesh).material,depth,'one owned depth material per shared live material');
  const mixedDepth=(result.scene.getObjectByName('mixed') as T.Mesh).material as T.MeshDepthMaterial[];
  assert.equal(mixedDepth[0].side,T.BackSide);assert.equal(mixedDepth[1].visible,false);
  const bounds=new T.Box3().setFromObject(result.scene),camera=fitStaticShadowCamera(bounds),instance=new T.Matrix4();
  const vertices=instances.geometry.getAttribute('position');
  for(let i=0;i<instances.count;i++){
    instances.getMatrixAt(i,instance);
    for(let j=0;j<vertices.count;j++){
      const p=new T.Vector3().fromBufferAttribute(vertices,j).applyMatrix4(instance).applyMatrix4(instances.matrixWorld);
      assert.ok(bounds.clone().expandByScalar(1e-9).containsPoint(p),'fixed bounds include transformed instances, not only the uninstanced base geometry');
      p.project(camera);assert.ok(Math.max(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z))<1);
    }
  }
  assert.deepEqual(sourceState(source),before);result.materials.forEach(m=>m.dispose());
});

test('fixed static camera covers every real wrapped-headwall vertex missed by the published arena sun',()=>{
  const headwall=JSON.parse(readFileSync(new URL('../src/quarry-headwall-collision.json',import.meta.url),'utf8')) as {positions:number[];indices:number[]};
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(headwall.positions,3));geometry.setIndex(headwall.indices);
  const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial());mesh.castShadow=true;
  const source=new T.Scene();source.add(mesh);const original=Array.from(geometry.getAttribute('position').array);
  const shadows=new StaticQuarryShadows(source,new Set());
  // Reproduce the published pre-change light direction, independently of the
  // new HDR-aligned direction used by the fixed camera under test.
  const near=new T.DirectionalLight();near.position.set(-70,66,25);near.target.position.set(0,1,-20);
  Object.assign(near.shadow.camera,{left:-75,right:75,bottom:-75,top:75,near:1,far:250});
  near.shadow.camera.updateProjectionMatrix();near.updateMatrixWorld();near.target.updateMatrixWorld();near.shadow.updateMatrices(near);
  let nearInside=0;const p=new T.Vector3();
  for(let i=0;i<headwall.positions.length;i+=3){
    p.fromArray(headwall.positions,i);const local=p.clone().project(near.shadow.camera);
    if(Math.max(Math.abs(local.x),Math.abs(local.y),Math.abs(local.z))<=1)nearInside++;
    p.project(shadows.camera);assert.ok(Math.max(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z))<1,`headwall vertex${i/3} is outside fixed depth coverage`);
  }
  assert.equal(nearInside,0,'fixture reproduces the published missing far-shadow coverage');
  assert.ok(shadows.camera.near>0&&shadows.camera.far>shadows.camera.near);
  closeVector(shadows.camera.getWorldDirection(new T.Vector3()),DAYLIGHT_DIRECTION.clone().negate());
  const fit=fitStaticShadowCamera(shadows.bounds);assert.deepEqual(fit.projectionMatrix.toArray(),shadows.camera.projectionMatrix.toArray());
  assert.deepEqual(Array.from(geometry.getAttribute('position').array),original);
  assert.equal(source.children.length,1);assert.ok(!shadows.casterScene.children.some(o=>o instanceof T.Light));
  shadows.dispose();geometry.dispose();
});

test('receiver hooks preserve the real arena shader and merge static visibility into one sun without altering global chunks',()=>{
  const originalLoad=T.TextureLoader.prototype.load;
  T.TextureLoader.prototype.load=function(file:string){const texture=new T.Texture();texture.name=file;return texture;};
  let material:T.MeshStandardMaterial;
  try{material=quarryArenaSurface();}finally{T.TextureLoader.prototype.load=originalLoad;}
  const before=compile(material),key=material.customProgramCacheKey(),version=material.version;
  const source=new T.Scene();source.add(caster('wall'));const shadows=new StaticQuarryShadows(source,new Set());
  const receiver=new T.Mesh(new T.PlaneGeometry(),material);receiver.receiveShadow=true;source.add(receiver);
  const globalChunk=T.ShaderChunk.lights_fragment_begin;
  shadows.bindReceivers(receiver);const after=compile(material);
  assert.equal(material.version,version+1);assert.ok(material.customProgramCacheKey().startsWith(key+'|'));
  for(const segment of before.vertexShader.split('#include <shadowmap_vertex>'))assert.ok(after.vertexShader.includes(segment),'existing vertex shader operations survive on both sides of the injected coordinate');
  for(const segment of before.fragmentShader.split(/#include <(?:shadowmap_pars_fragment|lights_fragment_begin)>/))assert.ok(after.fragmentShader.includes(segment),'existing photographic color/roughness/normal operations survive unchanged');
  assert.ok(after.vertexShader.includes('vMapUv=vQuarryPosition.xz/9.0'));
  assert.ok(after.fragmentShader.includes('arenaPhoto('));assert.ok(after.fragmentShader.includes('arenaCoverage='));
  for(const [name,uniform] of Object.entries(before.uniforms))assert.equal(after.uniforms[name].value,uniform.value,'existing photographic/mask uniform values survive');
  assert.ok(after.fragmentShader.includes('min(getShadow( directionalShadowMap[ i ]'));
  assert.ok(after.fragmentShader.includes('UNROLLED_LOOP_INDEX == 0 ? quarryStaticVisibility() : 1.0'));
  assert.ok(!after.fragmentShader.includes('* quarryStaticVisibility()'),'filtered near and far shadow values must not be multiplied');
  assert.ok(after.vertexShader.includes('worldPosition + vec4(shadowWorldNormal * quarryStaticNormalBias, 0.0)'));
  assert.ok(T.ShaderChunk.shadowmap_vertex.includes('shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix )'));
  assert.ok(after.vertexShader.indexOf('#include <shadowmap_vertex>')<after.vertexShader.indexOf('vQuarryStaticCoord ='));
  assert.ok(after.vertexShader.includes('#if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0'),'Medium/no-shadow variants have no unguarded shadow symbols');
  assert.equal(T.ShaderChunk.lights_fragment_begin,globalChunk,'no global shader mutation');
  shadows.bindReceivers(receiver);const other=new T.Mesh(receiver.geometry,material);shadows.bindReceivers(other);
  assert.equal(material.version,version+1,'same root/shared material cannot acquire stacked hooks');
  assert.equal(compile(material).fragmentShader,after.fragmentShader);
  let lights=0;source.traverse(o=>{if(o instanceof T.Light)lights++;});assert.equal(lights,0,'the controller adds no second illumination source');
  shadows.dispose();material.dispose();receiver.geometry.dispose();
});

test('static preparation renders once, retains pending near-shadow work and restores all renderer capture state',()=>{
  const source=new T.Scene();source.add(caster('wall'));const shadows=new StaticQuarryShadows(source,new Set());
  const renderer=new CaptureRenderer(),before=renderer.state();
  const receiver=caster('receiver');shadows.bindReceivers(receiver);const bound=compile(receiver.material as T.Material);
  assert.equal(bound.uniforms.quarryStaticEnabled.value,0);
  shadows.prepare(renderer.renderer);
  assert.deepEqual(renderer.state(),before);assert.equal(renderer.calls.length,1);
  assert.equal(renderer.calls[0].scene,shadows.casterScene);assert.equal(renderer.calls[0].camera,shadows.camera);
  assert.equal(shadows.captures,1);assert.equal(shadows.stats.ready,true);assert.equal(shadows.lastCaptureDraws,7);assert.equal(shadows.lastCaptureTriangles,123);
  assert.equal(bound.uniforms.quarryStaticEnabled.value,1);assert.equal(bound.uniforms.quarryStaticMap.value,renderer.calls[0].target!.texture);
  for(let i=0;i<12;i++)shadows.prepare(renderer.renderer);
  assert.equal(renderer.calls.length,1,'static capture is not repeated each main/reflection frame');
  shadows.enabled=false;shadows.prepare(renderer.renderer);assert.equal(bound.uniforms.quarryStaticEnabled.value,0);
  shadows.enabled=true;shadows.prepare(renderer.renderer);assert.equal(bound.uniforms.quarryStaticEnabled.value,1);assert.equal(renderer.calls.length,1);
  assert.deepEqual(renderer.state(),before);shadows.dispose();
});

test('failed static capture restores renderer state and remains dirty for a clean retry',()=>{
  const source=new T.Scene();source.add(caster('wall'));const shadows=new StaticQuarryShadows(source,new Set());
  const renderer=new CaptureRenderer();renderer.shadowMap={enabled:false,autoUpdate:true,needsUpdate:false};renderer.autoClear=true;renderer.scissor=false;
  const before=renderer.state();renderer.throwOnRender=true;
  assert.throws(()=>shadows.prepare(renderer.renderer),/deliberate renderer failure/);
  assert.deepEqual(renderer.state(),before);assert.equal(shadows.captures,0);assert.equal(shadows.stats.ready,false);
  renderer.throwOnRender=false;shadows.prepare(renderer.renderer);
  assert.equal(shadows.captures,1);assert.equal(shadows.stats.ready,true);assert.deepEqual(renderer.state(),before);shadows.dispose();
});

test('context invalidation disables stale depth and coalesces into one capture without reallocating the map',()=>{
  const source=new T.Scene(),wall=caster('wall');source.add(wall);
  const shadows=new StaticQuarryShadows(source,new Set()),renderer=new CaptureRenderer();
  shadows.bindReceivers(wall);const bound=compile(wall.material as T.Material);
  shadows.prepare(renderer.renderer);const target=renderer.calls[0].target!;
  let disposed=0;target.addEventListener('dispose',()=>disposed++);
  const matrix=bound.uniforms.quarryStaticMatrix.value.clone();
  shadows.invalidate();shadows.invalidate();
  assert.equal(shadows.stats.ready,false);assert.equal(bound.uniforms.quarryStaticEnabled.value,0);
  shadows.enabled=false;shadows.prepare(renderer.renderer);assert.equal(renderer.calls.length,1,'disabled quality/diagnostic state cannot consume pending invalidation');
  shadows.enabled=true;shadows.prepare(renderer.renderer);shadows.prepare(renderer.renderer);
  assert.equal(renderer.calls.length,2);assert.equal(renderer.calls[1].target,target);assert.equal(disposed,0);
  assert.equal(shadows.stats.ready,true);assert.equal(bound.uniforms.quarryStaticEnabled.value,1);
  assert.deepEqual(bound.uniforms.quarryStaticMatrix.value.toArray(),matrix.toArray(),'fixed camera cannot swim on restoration');
  shadows.dispose();assert.equal(disposed,1);
});

test('quality transitions preserve cached targets when unchanged, dispose resized maps and rebuild after Medium',()=>{
  const source=new T.Scene();source.add(caster('wall'));const shadows=new StaticQuarryShadows(source,new Set()),renderer=new CaptureRenderer();
  const disposed=new Map<T.WebGLRenderTarget,number>();
  const track=()=>{const target=renderer.calls.at(-1)!.target!;disposed.set(target,0);target.addEventListener('dispose',()=>disposed.set(target,disposed.get(target)!+1));return target;};
  shadows.prepare(renderer.renderer);const ultra=track();assert.equal(ultra.width,4096);assert.equal(ultra.height,4096);
  shadows.setQuality('ultra');shadows.prepare(renderer.renderer);assert.equal(renderer.calls.length,1);assert.equal(disposed.get(ultra),0);
  shadows.setQuality('high');assert.equal(disposed.get(ultra),1);assert.equal(shadows.stats.ready,false);
  shadows.prepare(renderer.renderer);const high=track();assert.equal(high.width,2048);assert.notEqual(high,ultra);
  shadows.setQuality('high');shadows.prepare(renderer.renderer);assert.equal(renderer.calls.length,2);assert.equal(disposed.get(high),0);
  shadows.setQuality('medium');assert.equal(disposed.get(high),1);assert.equal(shadows.stats.mapAllocated,false);
  shadows.prepare(renderer.renderer);shadows.setQuality('medium');shadows.prepare(renderer.renderer);assert.equal(renderer.calls.length,2);
  shadows.setQuality('ultra');shadows.prepare(renderer.renderer);const restored=track();assert.equal(restored.width,4096);assert.equal(shadows.captures,3);
  shadows.dispose();assert.equal(disposed.get(restored),1);assert.equal(shadows.stats.mapAllocated,false);
});

test('disposing owned shadow resources leaves shared geometry, texture and live material intact',()=>{
  const source=new T.Scene(),map=new T.Texture(),material=new T.MeshStandardMaterial({map,alphaTest:.4}),mesh=caster('wall',material);source.add(mesh);
  const instances=new T.InstancedMesh(mesh.geometry,material,2);instances.name='owned-instance-copy';instances.castShadow=true;
  instances.setMatrixAt(0,new T.Matrix4().makeTranslation(5,0,0));instances.setMatrixAt(1,new T.Matrix4().makeTranslation(-5,0,0));source.add(instances);
  const shadows=new StaticQuarryShadows(source,new Set()),renderer=new CaptureRenderer();
  let geometryDisposed=0,liveDisposed=0,mapDisposed=0,depthDisposed=0,sourceInstanceDisposed=0,ownedInstanceDisposed=0;
  mesh.geometry.addEventListener('dispose',()=>geometryDisposed++);material.addEventListener('dispose',()=>liveDisposed++);map.addEventListener('dispose',()=>mapDisposed++);
  (meshList(shadows.casterScene)[0].material as T.Material).addEventListener('dispose',()=>depthDisposed++);
  instances.addEventListener('dispose',()=>sourceInstanceDisposed++);
  const ownedInstance=shadows.casterScene.getObjectByName(instances.name) as T.InstancedMesh;
  ownedInstance.addEventListener('dispose',()=>ownedInstanceDisposed++);
  shadows.prepare(renderer.renderer);shadows.dispose();
  assert.equal(depthDisposed,1);assert.equal(geometryDisposed,0);assert.equal(liveDisposed,0);assert.equal(mapDisposed,0);
  assert.equal(ownedInstanceDisposed,1,'the cloned instance buffers need their Three.js disposal event');assert.equal(sourceInstanceDisposed,0);
  assert.equal(mesh.parent,source);assert.equal(shadows.casterScene.children.length,0);
  shadows.prepare(renderer.renderer);assert.equal(renderer.calls.length,1);
});

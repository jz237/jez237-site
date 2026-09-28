import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {generateNorthBackdrop} from '../tools/generate-north-backdrop';
import {forestHash,readForestFile,currentNorthForestPhysics,captureNorthForest,decodeForestGLB} from '../tools/north-forest-edge-audit';
import {auditNorthTreeSeating} from '../tools/tree-stem-audit';
import {quarryColliderLayout,createQuarryPhysics,terrainGeometry} from '../src/quarry-layout';
import {createSurfaceSampler} from '../src/quarry-surface-sampler';
import {Simulation} from '../multiplayer/simulation';
import {assertNorthBackdropEvolution,northBackdropBefore as before,northBackdropData,stripNorthBackdropLayout,restoreNorthBackdropCards,assertNorthBackdropShadowSource} from './north-backdrop-invariants';
import {staticCasterScene,StaticQuarryShadows} from '../src/static-shadows';
import {createNorthImpostorMaterial,backdropGeometryMaterial} from '../src/scenery-north-impostor';
import atlas from '../src/quarry-north-backdrop-atlas.json';
const accepted=JSON.parse(readForestFile('src/quarry-north-forest.json').toString());

test('northern replacement reuses exactly the52 accepted card roots/heights and deterministic independent variation',()=>{
  const data=northBackdropData();assert.deepEqual(data,generateNorthBackdrop());
  assert.equal(forestHash(readForestFile(data.sourceFixture.file)),data.sourceFixture.sha256);
  assert.equal(data.trees.length,52);assert.equal(new Set(data.trees.map((t:any)=>t.sourceCardIndex)).size,52);
  const original=new Map(before.localCards.map((p:any)=>[p.index,p]));
  for(const tree of data.trees){
    const old:any=original.get(tree.sourceCardIndex);assert.ok(old);
    assert.deepEqual([tree.x,tree.z,tree.height,tree.sourceCardKind],[old.x,old.z,old.height,old.kind]);
    for(const key of ['x','y','z','height','width','yaw','trunkRadius','trunkHeight'])assert.ok(Number.isFinite(tree[key]));
    assert.ok(tree.width>=.95&&tree.width<=1.1);assert.ok(tree.yaw>=0&&tree.yaw<Math.PI*2);
    assert.ok(data.stands.some((stand:any)=>stand.id===tree.stand));
  }
  for(const source of data.sourceModels)assert.equal(forestHash(readForestFile(source.file)),source.sha256,'accepted photographed tree models cannot change');
  assert.equal(forestHash(readForestFile('src/quarry-north-forest.json')),before.workerInputs.find((p:any)=>p.file==='src/quarry-north-forest.json').sha256,'all84 established solid tree placements remain frozen');
});

test('shared52 stems/root bands are strictly additive to every1919 accepted collider and all prior Worker inputs',()=>{
  assert.equal(assertNorthBackdropEvolution(quarryColliderLayout()).length,1919); // East Bay evolution is independently checked before restoring the older woodland state.
  stripNorthBackdropLayout(readForestFile('src/quarry-layout.ts'));
  assert.deepEqual(currentNorthForestPhysics().terrain,before.physics.terrain);
  for(const input of before.workerInputs)if(input.file!=='src/quarry-layout.ts'&&!input.file.includes('/.generated/'))assert.equal(forestHash(readForestFile(input.file)),input.sha256,input.file+' remains unchanged');
});

test('replacement roots seat on actual terrain using actual decoded low-Trunk support vertices',async()=>{
  const data=northBackdropData(),audit=await auditNorthTreeSeating({trees:data.trees,rootSeating:accepted.rootSeating});
  assert.equal(audit.trees.length,52);
  for(const source of audit.assets){assert.ok(source.maximumSourcePointError<1e-7);assert.ok(source.maximumSupportExtentError<1e-7);}
  assert.ok(audit.maximumSeatingError<2e-5);assert.ok(audit.maximumSupportExposure<=-.0249);
  for(const tree of audit.trees){assert.ok(tree.burialHeight>=0);assert.ok(tree.burialHeight<.6,'no extreme burial may conceal an incorrectly fitted stem');}
});

test('every new distant replacement stem is an actual Rapier contact obstacle on the playground terrain',async()=>{
  await R.init();const world=new R.World({x:0,y:0,z:0}),physics=createQuarryPhysics(R,world,false);
  try{
    for(const tree of northBackdropData().trees){
      const trunk=physics.statics.get('tree-'+tree.id)!;assert.ok(trunk);
      const y=tree.seating.centerGroundY+1.3,start={x:tree.x-tree.trunkRadius-.8,y,z:tree.z};
      const hit=trunk.castRay(new R.Ray(start,{x:1,y:0,z:0}),2,false);assert.ok(hit!==null&&Math.abs(hit-.8)<4e-5);
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,y,start.z).setLinvel(8,0,0).setCcdEnabled(true).setCanSleep(false));
      const ball=world.createCollider(R.ColliderDesc.ball(.12).setMass(100),body);let contacts=0;
      for(let i=0;i<35;i++){world.step();world.contactPair(ball,trunk,m=>{contacts+=m.numSolverContacts();});}
      assert.ok(contacts>0,tree.id+' stops the incoming physical body');assert.ok(body.translation().x<tree.x-tree.trunkRadius+.02);
      world.removeRigidBody(body);
    }
  }finally{world.free();}
});

test('exposed compact replacement roots produce solver contacts while buried bands remain below the unchanged terrain',async()=>{
  await R.init();const world=new R.World({x:0,y:0,z:0}),physics=createQuarryPhysics(R,world,false),surface=createSurfaceSampler(terrainGeometry());let exposed=0;
  try{
    for(const tree of northBackdropData().trees){
      const roots=accepted.rootHulls.find((h:any)=>h.variant===tree.variant).parts.map((_:any,i:number)=>physics.statics.get('tree-'+tree.id+'-root-'+i)!);
      assert.equal(roots.length,6);for(const root of roots){assert.ok(root);assert.ok([...root.vertices()].every(Number.isFinite));}
      let best:{ray:R.Ray;hit:number;root:R.Collider}|undefined;
      for(const y of [tree.y+.3,tree.y+.6,tree.y+.9])for(let i=0;i<32;i++)for(const root of roots){
        const a=i*Math.PI/16,dx=Math.cos(a),dz=Math.sin(a),ray=new R.Ray({x:tree.x-2*dx,y,z:tree.z-2*dz},{x:dx,y:0,z:dz});
        const hit=root.castRay(ray,4,false);if(hit===null||hit<0)continue;const p=ray.pointAt(hit);
        const approachClear=[0,.25,.5,.75,1].every(t=>{const q=ray.pointAt(Math.max(0,hit-.3)+.3*t);return y-(surface.height(q.x,q.z)??Infinity)>.08;});
        if(approachClear&&y-(surface.height(p.x,p.z)??Infinity)>.075&&2-hit>tree.trunkRadius+.025&&(!best||hit<best.hit))best={ray,hit,root};
      }
      if(!best)continue;
      const p=best.ray.pointAt(Math.max(0,best.hit-.25)),d=best.ray.dir;
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(p.x,p.y,p.z).setLinvel(d.x*4,0,d.z*4).setCcdEnabled(true).setCanSleep(false));
      const ball=world.createCollider(R.ColliderDesc.ball(.05).setMass(20),body);let contacts=0;
      // A finite ball can meet either neighboring height band first; the six
      // bands together are the physical root, rather than six isolated targets.
      for(let i=0;i<24;i++){world.step();for(const root of roots)world.contactPair(ball,root,m=>{contacts+=m.numSolverContacts();});}
      assert.ok(contacts>0,tree.id+' exposed root band needs real solver contact');exposed++;world.removeRigidBody(body);
    }
    assert.ok(exposed>0,'the scene includes exposed root bands, not only fully buried shapes');
  }finally{world.free();}
});

test('actual playground recovery beyond255m retains position and cannot be treated as an inaccessible boundary',async()=>{
  await R.init();const simulation=new Simulation(R,'playground');
  try{
    simulation.phase='playing';simulation.elapsed=10;const car=simulation.cars[0],tree=northBackdropData().trees[0];
    car.body.setTranslation({x:tree.x+8,y:tree.seating.centerGroundY+4,z:tree.z},true);
    car.state.p={...car.body.translation()};assert.ok(Math.hypot(car.state.p.x,car.state.p.z)>255);
    const before={...car.state.p};assert.equal(simulation.recover(0),true);
    assert.equal(car.state.p.x,before.x);assert.equal(car.state.p.z,before.z);
    car.body.setLinvel({x:0,y:0,z:12},true);simulation.step(new Set([0,1,2,3,4,5,6,7]));
    assert.ok(car.body.translation().z>before.z+.1,'the recovery cooldown permits normal continued movement here');
  }finally{simulation.dispose();}
});

test('actual renderer replaces only52 photo identities and registers the same52 real trees and atlas roots',async()=>{
  const data=northBackdropData(),counts={near:0,far:0,atlas:0},found=new Set<string>();
  const snapshot=await captureNorthForest(parent=>{
    const local=new T.Matrix4(),world=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();
    parent.traverse(object=>{
      if(!(object instanceof T.InstancedMesh)||!object.name.startsWith('north-ridge-'))return;
      const match=/^north-ridge-(stand-\d+)-(near|far|atlas)-(\d+)(?:-(Trunk|Wood|Needles))?$/.exec(object.name);assert.ok(match,object.name);
      const [_,stand,level,v,part]=match;
      assert.equal(object.castShadow,level==='near','only real close geometry duplicates the complete cached static-shadow coverage');assert.equal(object.receiveShadow,true);
      if(level!=='atlas'&&part!=='Trunk')return;
      const trees=data.trees.filter((t:any)=>t.stand===stand&&t.variant===Number(v));assert.equal(object.count,trees.length);
      trees.forEach((tree:any,i:number)=>{
        object.getMatrixAt(i,local);world.multiplyMatrices(object.matrixWorld,local);world.decompose(p,q,scale);
        assert.ok(p.distanceTo(new T.Vector3(tree.x,tree.y,tree.z))<5e-5,'visual roots and physical roots coincide');
        assert.ok(scale.distanceTo(new T.Vector3(tree.height*tree.width,tree.height,tree.height*tree.width))<5e-5);
        assert.ok(1-Math.abs(q.dot(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),tree.yaw)))<1e-7);
        counts[level as keyof typeof counts]++;found.add(tree.id);
      });
    });
    const shadow=staticCasterScene(parent,new Set());
    try{
      const casters:T.InstancedMesh[]=[];shadow.scene.traverse(o=>{if(o instanceof T.InstancedMesh&&o.name.startsWith('north-ridge-'))casters.push(o);});
      assert.ok(casters.length>0);assert.ok(casters.every(o=>o.name.includes('-near-')),'fixed shadows use real highest-detail geometry, never camera-facing atlas planes');
      assert.equal(casters.filter(o=>o.name.endsWith('-Trunk')).reduce((n,o)=>n+o.count,0),52);
    }finally{shadow.materials.forEach(m=>m.dispose());shadow.scene.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});}
  });
  assert.deepEqual(counts,{near:52,far:52,atlas:52});assert.equal(found.size,52);
  restoreNorthBackdropCards(snapshot.cards);assert.deepEqual(snapshot.random,before.forest.random);
  const isPhoto=(m:any)=>m.materials.some((s:any)=>/(pine|spruce|hemlock|maple)\.webp$/.test(s.maps.map?.name??''));
  for(const old of before.forest.meshes.filter((m:any)=>!isPhoto(m)))assert.ok(snapshot.meshes.some(m=>JSON.stringify(m)===JSON.stringify(old)),'every accepted near woodland and grass draw remains exact');
  for(const old of before.forest.lods)assert.ok(snapshot.lods.some(l=>JSON.stringify(l)===JSON.stringify(old)),'all48 existing LOD cells remain exact');
});

test('uploaded atlas files have verified provenance and every accepted near-model vertex fits all48 orthonormal capture frames',async()=>{
  const manifest=JSON.parse(readForestFile('source/models/quarry-north-backdrop-manifest.json').toString());
  assert.equal(forestHash(readForestFile(manifest.runtimeMetadata)),manifest.runtimeMetadataSha256);
  assert.equal(manifest.runtimeFiles.length,6);assert.equal(atlas.variants.length,3);assert.equal(atlas.flipY,false);
  let totalBytes=0,frames=0;
  for(const file of manifest.runtimeFiles){
    const bytes=readForestFile('public/'+file.file);assert.equal(bytes.length,file.bytes);assert.equal(forestHash(bytes),file.sha256);totalBytes+=bytes.length;
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.subarray(12,16).toString(),'IHDR');
    assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[1024,2048]);assert.equal(bytes[24],8);assert.equal(bytes[25],6,'RGBA preserves fractional needle coverage and linear depth');
  }
  assert.ok(totalBytes<12*1024*1024);assert.equal(atlas.gutter,8);assert.equal(atlas.maxSafeMip,3);
  for(const entry of atlas.variants){
    const source=northBackdropData().sourceModels.find((s:any)=>s.variant===entry.variant),bytes=readForestFile(source.file);assert.equal(forestHash(bytes),source.sha256);
    const decoded=await decodeForestGLB(bytes),loader=new GLTFLoader().register(()=>({name:'ATLAS_CPU_IMAGES',loadTexture:async()=>new T.Texture()}));
    const gltf=await loader.parseAsync(decoded.buffer,'');gltf.scene.updateMatrixWorld(true);
    try{
      const near=gltf.scene.getObjectByName(`NorthFir_${entry.variant}_near`);assert.ok(near);const meshes:T.Mesh[]=[];near.traverse(o=>{if(o instanceof T.Mesh)meshes.push(o);});assert.equal(meshes.length,3);
      assert.equal(entry.views.length,16);
      for(const view of entry.views){
        const right=new T.Vector3().fromArray(view.right),up=new T.Vector3().fromArray(view.up),direction=new T.Vector3().fromArray(view.direction),center=new T.Vector3().fromArray(atlas.center);
        for(const v of [right,up,direction])assert.ok(Math.abs(v.length()-1)<1e-10);
        assert.ok(Math.abs(right.dot(up))<1e-10&&Math.abs(up.dot(direction))<1e-10&&Math.abs(right.dot(direction))<1e-10);
        assert.ok(new T.Vector3().crossVectors(right,up).dot(direction)>.999999);
        const [u,v,w,h]=view.rect;assert.ok(u>0&&v>0&&u+w<1&&v+h<1);assert.equal(w*1024,240);assert.equal(h*2048,496);
        let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minDepth=Infinity,maxDepth=-Infinity;const point=new T.Vector3();
        for(const mesh of meshes){const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++){
          point.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld).sub(center);const x=point.dot(right),y=point.dot(up),depth=point.dot(direction);
          minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);minDepth=Math.min(minDepth,depth);maxDepth=Math.max(maxDepth,depth);
        }}
        assert.ok(Math.max(Math.abs(minX),Math.abs(maxX))<atlas.frameSize[0]/2,'no accepted branches may clip the horizontal frame');
        assert.ok(Math.max(Math.abs(minY),Math.abs(maxY))<atlas.frameSize[1]/2,'no accepted branches may clip the vertical frame');
        assert.ok(minDepth>=view.depthRange[0]-1e-6&&maxDepth<=view.depthRange[1]+1e-6,'reprojected depth range encloses the actual uploaded source');frames++;
      }
    }finally{gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
  }
  assert.equal(frames,48);
});

test('actual atlas hook uses object-space normals and per-render projection while its opt-in shadow receiver preserves ordinary surfaces',async()=>{
  assertNorthBackdropShadowSource();
  const load=T.TextureLoader.prototype.load;T.TextureLoader.prototype.load=function(file:string,onLoad?:(t:T.Texture)=>void){const t=new T.Texture();t.name=file;if(onLoad)queueMicrotask(()=>onLoad(t));return t;};
  let result:Awaited<ReturnType<typeof createNorthImpostorMaterial>>|undefined,shadows:StaticQuarryShadows|undefined;
  const ordinary=new T.MeshStandardMaterial(),source=new T.MeshStandardMaterial();let calls=0;
  source.onBeforeCompile=shader=>{calls++;shader.fragmentShader='// preserved source hook\n'+shader.fragmentShader;};source.customProgramCacheKey=()=> 'protected-original';
  const faded=backdropGeometryMaterial(source);
  try{
    result=await createNorthImpostorMaterial({...atlas,...atlas.variants[0]});
    assert.equal(source.alphaTest,0,'dither wrapper cannot mutate accepted source materials');assert.equal(faded.alphaTest,.001);
    for(const texture of result.textures){assert.equal(texture.flipY,false);assert.equal(texture.minFilter,T.LinearMipmapLinearFilter);}
    assert.equal(result.textures[0].colorSpace,T.SRGBColorSpace);assert.equal(result.textures[1].colorSpace,T.NoColorSpace);
    const group=new T.Group(),caster=new T.Mesh(new T.BoxGeometry(2,2,2),ordinary);caster.castShadow=true;group.add(caster);
    const image=new T.Mesh(new T.PlaneGeometry(),result.material),real=new T.Mesh(new T.BoxGeometry(),faded);group.add(image,real);
    shadows=new StaticQuarryShadows(group,new Set());shadows.bindReceivers(group);
    const compile=(material:T.Material)=>{const shader={vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader,uniforms:{} as any};material.onBeforeCompile(shader as any,{} as T.WebGLRenderer);return shader;};
    const imageShader=compile(result.material),geometry=compile(faded),normal=compile(ordinary);
    assert.match(imageShader.vertexShader,/cameraPosition - vNorthOrigin/);assert.match(imageShader.fragmentShader,/normal = transformDirection\(quarryStaticSurfaceNormal, viewMatrix\)/);
    assert.match(imageShader.fragmentShader,/quarryStaticSurfacePosition \+ quarryStaticSurfaceNormal \* quarryStaticNormalBias/);
    assert.match(imageShader.fragmentShader,/UNROLLED_LOOP_INDEX == 0 \? quarryStaticVisibility\(\) : getShadow/);
    assert.doesNotMatch(imageShader.fragmentShader,/min\(getShadow\( directionalShadowMap/);
    assert.match(normal.fragmentShader,/min\(getShadow\( directionalShadowMap/,'ordinary surfaces retain the near/static minimum merge');
    assert.match(geometry.fragmentShader,/preserved source hook/);assert.equal(calls,1);assert.ok(faded.customProgramCacheKey().startsWith('protected-original|'));
    const eye=new T.PerspectiveCamera(62,1.4,.15,450);result.beforeRender({} as T.WebGLRenderer,new T.Scene(),eye);
    assert.deepEqual(imageShader.uniforms.northProjection.value.elements,eye.projectionMatrix.elements);
    const face=new T.PerspectiveCamera(90,1,.15,450);result.beforeRender({} as T.WebGLRenderer,new T.Scene(),face);
    assert.deepEqual(imageShader.uniforms.northProjection.value.elements,face.projectionMatrix.elements,'reflection cube faces receive their own projection matrix');
    group.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});
  }finally{T.TextureLoader.prototype.load=load;shadows?.dispose();result?.textures.forEach(t=>t.dispose());result?.material.dispose();ordinary.dispose();source.dispose();faded.dispose();}
});

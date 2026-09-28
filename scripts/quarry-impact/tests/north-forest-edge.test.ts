import test from 'node:test';
import {historicGripBytes} from './circuit-grip-invariants';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { captureNorthForest, currentNorthForestPhysics, forestHash, forestAngle, inNorthForest, readForestFile } from '../tools/north-forest-edge-audit';
import { assertNorthForestEvolution, assertNorthForestLayoutSource, northForestBaseline as before, northForestData, northTreeId, northRootId, northMediumId } from './north-forest-invariants';
import { createQuarryPhysics, quarryColliderLayout, terrainGeometry, quarryRim } from '../src/quarry-layout';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { trackPoint } from '../src/rules';
import { staticCasterScene, fitStaticShadowCamera } from '../src/static-shadows';
import { updateForestView } from '../src/scenery-vegetation';
import { auditNorthTreeSeating, auditNorthTreeStems } from '../tools/tree-stem-audit';
import {restoreNorthBackdropCards,assertNorthBackdropShadowSource} from './north-backdrop-invariants';

let captured:ReturnType<typeof captureNorthForest>|undefined;
const current=()=>captured??=captureNorthForest();
const isCard=(mesh:any)=>mesh.materials.some((m:any)=>/(pine|spruce|hemlock|maple)\.webp$/.test(m.maps.map?.name??''));

test('northern woodland keeps all old solids, terrain, car bytes and original shared physics source',()=>{
  const physics=currentNorthForestPhysics();assertNorthForestLayoutSource();assertNorthForestEvolution(quarryColliderLayout());
  assert.deepEqual(physics.terrain,before.physics.terrain);assert.deepEqual(physics.nearTrees,before.physics.nearTrees);assert.deepEqual(physics.saplings,before.physics.saplings);
  for(const [file,expected] of Object.entries(before.files))if(file.startsWith('public/models/')||['src/rules.ts','src/vehicle.ts','src/assets.ts','src/car-materials.ts','src/scenery-north-backdrop.ts','src/scenery-backdrop.ts','src/scenery-flora-placement.ts','src/static-shadows.ts'].includes(file))
    if(file==='src/static-shadows.ts')assertNorthBackdropShadowSource();
    else assert.equal(forestHash(historicGripBytes(file,readForestFile(file))),expected,`${file} is not part of northern tree authoring, except the separately validated later grip correction`);
  for(const entry of before.workerInputs)if(entry.file!=='src/quarry-layout.ts'&&!entry.file.startsWith('multiplayer/.generated/'))
    assert.equal(forestHash(historicGripBytes(entry.file,readForestFile(entry.file))),entry.expected,`${entry.file} remains frozen outside the later grip correction`);
});

test('actual renderer changes only52 authorized photo-card transforms, retaining all old GLBs, materials, grass and RNG',async()=>{
  const actual=await current(),after={...actual,cards:restoreNorthBackdropCards(actual.cards)};assert.equal(after.cards.length,384);assert.equal(after.cards.length,before.forest.cards.length);
  assert.deepEqual(after.random,before.forest.random,'added flora must not consume or reorder the existing random stream');
  let local=0;for(let i=0;i<after.cards.length;i++){
    const old=before.forest.cards[i],next=after.cards[i];assert.equal(next.kind,old.kind);assert.deepEqual(next.color,old.color);
    if(inNorthForest(old.matrix[12],old.matrix[14])){local++;assert.ok(inNorthForest(next.matrix[12],next.matrix[14]),'northern card must stay inside its approved sector');}
    else assert.deepEqual(next,old,`off-sector photo card${i} stays bitwise exact`);
  }
  assert.equal(local,52);
  const oldCards=before.forest.meshes.filter(isCard),newCards=after.meshes.filter(isCard);assert.equal(newCards.length,4);
  for(let i=0;i<4;i++){const {instances:_a,...old}=oldCards[i],{instances:_b,...next}=newCards[i];assert.deepEqual(next,old,'card material, mesh geometry and shadow flags stay fixed');}
  const oldMeshes=before.forest.meshes.filter((m:any)=>!isCard(m)),remaining=new Map<string,number>();
  for(const mesh of after.meshes.filter(m=>!isCard(m))){const key=JSON.stringify(mesh);remaining.set(key,(remaining.get(key)??0)+1);}
  for(const mesh of oldMeshes){const key=JSON.stringify(mesh),count=remaining.get(key)??0;assert.ok(count>0,'every original scanned-tree/grass batch must remain exact');remaining.set(key,count-1);}
  assert.ok(after.meshes.length>before.forest.meshes.length,'new front trees must actually enter the renderer');
  for(const lod of before.forest.lods)assert.ok(after.lods.some(next=>JSON.stringify(next)===JSON.stringify(lod)),'original LOD transforms, thresholds and initial visibility remain exact');
});

test('new solid roots follow exact terrain triangles and leave the racing corridor and original crest untouched',()=>{
  const data=northForestData(),surface=createSurfaceSampler(terrainGeometry()),track=Array.from({length:1440},(_,i)=>trackPoint(i/1440));
  assert.deepEqual(data.sector,{startDegrees:350,endDegrees:45});assert.ok(data.trees.length>=18);assert.equal(data.stands.length,6);
  for(const plants of [data.trees,data.mediumTrees,data.understory])assert.equal(new Set(plants.map((p:any)=>p.id)).size,plants.length,'IDs are unique within each solid-tree/soft-understory collection');
  for(const p of [...data.trees,...data.mediumTrees,...data.understory]){
    for(const k of ['x','y','z','height','width','yaw'])assert.ok(Number.isFinite(p[k]),`${p.id}.${k} must be finite`);
    assert.ok(p.height>0&&p.width>0);assert.ok(inNorthForest(p.x,p.z));
    const ground=surface.height(p.x,p.z);assert.notEqual(ground,undefined);
    if(p.seating){assert.ok(p.seating.burialHeight>=0);assert.ok(Math.abs(p.seating.centerGroundY-ground!)<2e-5);assert.ok(Math.abs(p.seating.centerBaseline-(ground!-.025))<2e-5);assert.ok(Math.abs(p.y-(ground!-.025-p.seating.burialHeight))<2e-5,'only explicit footprint-derived burial may move a mature root below its center baseline');}
    else assert.ok(Math.abs(p.y-(ground!-.025))<2e-5,`${p.id} roots must be seated against actual Float32 triangles`);
    const angle=forestAngle(p.x,p.z),depth=Math.hypot(p.x/1.08,p.z)-quarryRim(angle*Math.PI/180).r;
    assert.ok(depth>=7.99&&depth<=50.01,`${p.id} must remain behind the preserved rim`);
    assert.ok(Math.min(...track.map(q=>Math.hypot(p.x-q.x,p.z-q.z)))>(p.trunkRadius??0)+10,'whole trunk clears the road and shoulder');
  }
  for(const p of [...data.trees,...data.mediumTrees]){assert.ok(p.trunkHeight>0&&p.trunkHeight<=p.height);assert.ok(p.trunkRadius>.03&&p.trunkRadius<1.5);}
});

test('mature root burial comes from actual final Trunk support vertices and seats the outer scan-plate supports on unchanged terrain',async()=>{
  const data=northForestData(),audit=await auditNorthTreeSeating();assert.equal(data.rootSeating.burialMetres,.025);
  for(const footprint of data.rootSeating.footprints){assert.equal(footprint.maxNormalizedY,.012);assert.equal(footprint.supportDirections,48);}
  for(const asset of audit.assets){assert.ok(asset.maximumSourcePointError<1e-7,'supports must be real near-Trunk vertices, not canopy points');assert.ok(asset.maximumSupportExtentError<1e-7,'the manifest covers every independently extracted outer support');}
  assert.equal(audit.trees.length,data.trees.length);assert.ok(audit.maximumSeatingError<2e-5,'root Y must equal the independently recomputed terrain minimum');
  for(const tree of audit.trees){assert.ok(Math.abs(tree.declared.burialHeight-tree.burialHeight)<2e-5);assert.ok(tree.maximumSupportExposure<=-.025+2e-5,`${tree.id} outer photographed ground-plate supports must be buried in the actual terrain`);}
});

test('shipped compressed tree assets decode to finite complete near/far geometry with bounded static-file size',async()=>{
  const audit=await auditNorthTreeStems();assert.equal(audit.assets.length,3);
  for(const asset of audit.assets){
    assert.equal(asset.compression,'draco','audit must decode the uploaded compressed model, not an unpublished intermediate');
    assert.ok(asset.bytes<25*1024*1024,'each model remains publishable as one static file');
    assert.equal(asset.embeddedImages,0);assert.equal(asset.textureDefinitions,0);assert.equal(asset.levels.length,2);
    for(const level of asset.levels){
      assert.equal(level.meshes.length,3);assert.equal(level.stemMeshes.length,1);
      for(const part of ['Wood','Needles','Trunk'])assert.equal(level.meshes.filter((m:any)=>m.name.endsWith('_'+part)).length,1);
      for(const mesh of level.meshes){assert.ok(mesh.finite);assert.ok(mesh.vertices>0&&mesh.triangles>0&&Number.isInteger(mesh.triangles));assert.ok(mesh.maxIndex<mesh.vertices,'every decoded index references a real decoded vertex');}
      assert.ok(Math.abs(level.stemBounds.min[1])<1e-4,'normalized visible stem root remains at the authored origin after quantization');
      assert.ok(level.bounds.max[1]>.95&&level.bounds.max[1]<1.05,'world height scaling refers to the decoded one-metre asset');
    }
  }
  const manifest=JSON.parse(readForestFile('source/models/quarry-north-firs-manifest.json').toString());
  for(const entry of manifest.runtimeFiles){const bytes=readForestFile('public/'+entry.file);assert.equal(bytes.length,entry.bytes);assert.equal(forestHash(bytes),entry.sha256);}
});

test('all new manifest trunks are actual Rapier obstacles, not visual-only stems',async()=>{
  await R.init();const world=new R.World({x:0,y:0,z:0}),physics=createQuarryPhysics(R,world,false);
  try{
    const data=northForestData();
    for(const [trees,id]of [[data.trees,northTreeId],[data.mediumTrees,northMediumId]] as const)for(const tree of trees){
      const trunk=physics.statics.get(id(tree.id));assert.ok(trunk);
      const y=tree.y+Math.min(Math.max(1.3+(tree.seating?.burialHeight??0),tree.height*.05+.2),tree.trunkHeight*.5),start={x:tree.x-tree.trunkRadius-.8,y,z:tree.z};
      const ray=trunk.castRay(new R.Ray(start,{x:1,y:0,z:0}),2,false);assert.ok(ray!==null&&Math.abs(ray-.8)<3e-5,'actual ray silhouette must match the declared radius');
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,y,start.z).setLinvel(8,0,0).setCanSleep(false).setCcdEnabled(true));
      const ball=world.createCollider(R.ColliderDesc.ball(.12).setMass(100).setRestitution(0),body);let contacts=0;
      for(let i=0;i<35;i++){world.step();world.contactPair(ball,trunk,m=>{contacts+=m.numContacts();});}
      assert.ok(contacts>0,`${tree.id} must produce real solver contacts`);assert.ok(body.translation().x<tree.x-tree.trunkRadius+.02,'the incoming body remains outside the trunk');
      assert.ok(body.linvel().x<.2,'the trunk stops the incoming body');world.removeRigidBody(body);
    }
  }finally{world.free();}
});

test('compact physical root flares produce solver contacts outside the central stem',async()=>{
  await R.init();const world=new R.World({x:0,y:0,z:0}),physics=createQuarryPhysics(R,world,false);
  const surface=createSurfaceSampler(terrainGeometry());let exposedContacts=0;
  try{
    for(const tree of northForestData().trees){
      const parts=northForestData().rootHulls.find((h:any)=>h.variant===tree.variant).parts;
      const roots=parts.map((_:any,i:number)=>physics.statics.get(northRootId(tree.id,i))!);assert.ok(roots.every(Boolean));
      const points=roots.flatMap((root:R.Collider)=>Array.from(root.vertices()));assert.ok(points.length>=12);for(const value of points)assert.ok(Number.isFinite(value));
      const maxY=Math.max(...points.filter((_:number,i:number)=>i%3===1));assert.ok(maxY>0&&maxY<tree.height*.061,'root flares stay below the accessible main stem');
      let best:{ray:R.Ray;hit:number;radius:number;root:R.Collider}|undefined;
      for(const height of [.3,.6,.9])for(const root of roots)for(let i=0;i<32;i++){
        const y=tree.y+height;
        const a=i*Math.PI/16,dx=Math.cos(a),dz=Math.sin(a),ray=new R.Ray({x:tree.x-dx*2,y,z:tree.z-dz*2},{x:dx,y:0,z:dz}),hit=root.castRay(ray,4,false);
        if(hit===null||hit<0)continue;const p=ray.pointAt(hit);
        if(y-(surface.height(p.x,p.z)??Infinity)>.075&&2-hit>tree.trunkRadius+.025&&(!best||2-hit>best.radius))best={ray,hit,radius:2-hit,root};
      }
      if(!best)continue; // Fully buried scan roots correctly leave terrain as the contact surface.
      const start=best.ray.pointAt(Math.max(0,best.hit-.25)),d=best.ray.dir;
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.y,start.z).setLinvel(d.x*4,0,d.z*4).setCanSleep(false).setCcdEnabled(true));
      const ball=world.createCollider(R.ColliderDesc.ball(.05).setMass(20).setRestitution(0),body);let contacts=0;
      for(let i=0;i<24;i++){world.step();world.contactPair(ball,best.root,m=>{contacts+=m.numContacts();});}
      assert.ok(contacts>0,tree.id+' exposed root flare must stop an incoming body using actual Rapier contacts');exposedContacts++;world.removeRigidBody(body);
    }
    assert.ok(exposedContacts>0,'the actual scene exercises exposed compact root contacts as well as buried roots');
  }finally{world.free();}
});

test('actual mature stem instances align their visible origins and scale with shared collision placements',async()=>{
  const data=northForestData();let checked=0;
  await captureNorthForest(parent=>{
    const local=new T.Matrix4(),world=new T.Matrix4(),position=new T.Vector3(),scale=new T.Vector3(),rotation=new T.Quaternion();
    parent.traverse(object=>{
      if(!(object instanceof T.InstancedMesh)||!object.name.startsWith('north-forest-'))return;
      const match=/-(near|far)-(\d+)-Trunk$/.exec(object.name);if(!match)return;
      const lod=object.parent!.parent as T.LOD,standId=lod.name.slice('north-forest-'.length),trees=data.trees.filter((p:any)=>p.stand===standId&&p.variant===Number(match[2]));
      assert.equal(object.count,trees.length);
      for(let i=0;i<object.count;i++){
        object.getMatrixAt(i,local);world.multiplyMatrices(object.matrixWorld,local);world.decompose(position,rotation,scale);const tree=trees[i];
        assert.ok(position.distanceTo(new T.Vector3(tree.x,tree.y,tree.z))<4e-5,'visible stem baseline matches the collider root');
        assert.ok(scale.distanceTo(new T.Vector3(tree.height*tree.width,tree.height,tree.height*tree.width))<4e-5,'visual roots and hulls share the same anisotropic scale');
        assert.ok(1-Math.abs(rotation.dot(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),tree.yaw)))<1e-7,'yaw agrees with the physical root proxy');checked++;
      }
    });
  });
  assert.equal(checked,data.trees.length*2,'both visible LODs contain every authored solid stem');
});

test('actual new tree LODs remain fixed highest-detail shadow casters when the visible LOD changes',async()=>{
  await captureNorthForest(parent=>{
    const lods:T.LOD[]=[];parent.traverse(o=>{if(o instanceof T.LOD&&o.name.startsWith('north-forest-stand-'))lods.push(o);});
    assert.equal(lods.length,6,'one spatial LOD cell per authored stand');
    const expected=new Set<T.BufferGeometry>(),visibleBefore:any[]=[];
    for(const lod of lods){
      assert.equal(lod.autoUpdate,false);assert.equal(lod.levels.length,2);assert.equal(lod.levels[1].distance,55);assert.equal(lod.levels[1].hysteresis,.15);
      const camera=new T.PerspectiveCamera();camera.position.copy(lod.getWorldPosition(new T.Vector3()));camera.updateMatrixWorld(true);updateForestView(camera);
      assert.equal(lod.levels[0].object.visible,true,'the real frame updater must select new nearby cells');assert.equal(lod.levels[1].object.visible,false);
      camera.position.x+=150;camera.updateMatrixWorld(true);updateForestView(camera);
      assert.equal(lod.levels[0].object.visible,false,'the real frame updater must select new distant cells');assert.equal(lod.levels[1].object.visible,true);
      lod.levels[0].object.traverse(o=>{if(o instanceof T.Mesh){assert.equal(o.castShadow,true,'fixed front foliage must cast before the initial static capture');expected.add(o.geometry);}});
    }
    for(const lod of lods){lod.levels[0].object.visible=false;lod.levels[1].object.visible=true;visibleBefore.push(lod.levels.map(l=>l.object.visible));}
    const capture=staticCasterScene(parent,new Set());
    try{
      const actual=new Set<T.BufferGeometry>();capture.scene.traverse(o=>{if(o instanceof T.Mesh)actual.add(o.geometry);});
      for(const geometry of expected)assert.ok(actual.has(geometry),'the fixed shadow scene must contain each hidden near LOD mesh');
      const bounds=new T.Box3().setFromObject(capture.scene),tolerantBounds=bounds.clone().expandByScalar(1e-5),camera=fitStaticShadowCamera(bounds),view=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),instance=new T.Matrix4(),world=new T.Matrix4(),point=new T.Vector3();
      capture.scene.traverse(o=>{
        if(!(o instanceof T.InstancedMesh)||!o.name.startsWith('north-forest-'))return;
        o.geometry.computeBoundingBox();const box=o.geometry.boundingBox!;
        for(let i=0;i<o.count;i++){
          o.getMatrixAt(i,instance);world.multiplyMatrices(o.matrixWorld,instance);
          for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
            point.set(x,y,z).applyMatrix4(world);assert.ok(tolerantBounds.containsPoint(point),'fixed caster bounds include every actual instanced crown');
            point.applyMatrix4(view);assert.ok(Math.max(Math.abs(point.x),Math.abs(point.y),Math.abs(point.z))<=1+1e-7,'the fixed camera covers all new canopy bounds at any visible LOD');
          }
        }
      });
      assert.deepEqual(lods.map(l=>l.levels.map(v=>v.object.visible)),visibleBefore,'building fixed casters cannot mutate visible LOD state');
    }finally{capture.materials.forEach(m=>m.dispose());capture.scene.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});}
  });
});

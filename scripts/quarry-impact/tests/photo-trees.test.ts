import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {PHOTO_TREES,createPhotoTrees,photoTreeMaterial,type PhotoTree} from '../src/photo-trees';
const read=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
const anchors='#include <project_vertex>\n',fragment='#include <map_fragment>\n#include <normal_fragment_begin>\n#include <lights_fragment_end>\n';
test('a tree card faces the camera and is lit as a rounded crown, toned to a sunlit canopy',()=>{
  const m=photoTreeMaterial('spruce'),shader={uniforms:{},vertexShader:anchors,fragmentShader:fragment} as unknown as T.WebGLProgramParametersWithUniforms;
  m.onBeforeCompile(shader,{} as T.WebGLRenderer);
  assert.ok(shader.vertexShader.includes('vec3 right=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));')&&shader.vertexShader.includes(`vCrown=vec2(position.x/${(PHOTO_TREES.aspect.spruce/2).toFixed(4)},`));
  assert.ok(shader.fragmentShader.includes('normal=normalize(vec3(vCrown.x*.9,0.0,')&&shader.fragmentShader.includes('nonPerturbedNormal=normal;'),'the crown leans its normal out, up and down');
  assert.ok(shader.fragmentShader.includes(`reflectedLight.directDiffuse*=${PHOTO_TREES.crown.lit.toFixed(2)};`)&&shader.fragmentShader.includes(`mix(${PHOTO_TREES.crown.under.toFixed(2)},1.0,smoothstep(-.9,.6,vCrown.y))`),'shaded underneath');
  assert.ok(shader.fragmentShader.includes(`*${PHOTO_TREES.crown.value.toFixed(2)};`)&&PHOTO_TREES.crown.saturation<1&&PHOTO_TREES.crown.value<1,'the spring photographs are toned down');
  assert.notEqual(photoTreeMaterial('maple').customProgramCacheKey(),m.customProgramCacheKey(),'each kind has its own card width');
  assert.equal(m.alphaTest,PHOTO_TREES.alphaTest);assert.equal(m.side,T.DoubleSide);
});
test('one instanced card mesh per kind, each tree as tall as asked and standing where asked; dispose releases it all once',()=>{
  const trees:PhotoTree[]=[{kind:'spruce',x:1,y:2,z:3,height:10},{kind:'maple',x:-4,y:0,z:5,height:12,tint:.9},{kind:'spruce',x:7,y:0,z:-1,height:8}];
  const f=createPhotoTrees(trees,'test_trees'),meshes=f.root.children as T.InstancedMesh[];
  assert.deepEqual(meshes.map(m=>m.name).sort(),['test_trees_maple','test_trees_spruce']);
  const spruce=meshes.find(m=>m.name.endsWith('spruce'))!,matrix=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();
  assert.equal(spruce.count,2);spruce.getMatrixAt(0,matrix);matrix.decompose(p,q,s);assert.ok(p.equals(new T.Vector3(1,2,3))&&Math.abs(s.y-10)<1e-9);
  let events=0;const parent=new T.Group();parent.add(f.root);for(const m of meshes){m.addEventListener('dispose',()=>events++);m.geometry.addEventListener('dispose',()=>events++);(m.material as T.Material).addEventListener('dispose',()=>events++);}
  f.dispose();f.dispose();assert.equal(events,6);assert.equal(parent.children.length,0);
});
test('the cone trees are gone: the venues and every circuit and the quarry rim draw photographed trees',()=>{
  const kestrel=read('kestrel-ring-world.ts'),moorfield=read('moorfield-speedbowl-world.ts'),millhaven=read('millhaven-world.ts'),cinderbank=read('cinderbank-surroundings.ts');
  assert.ok(!kestrel.includes('crownGeometry')&&kestrel.includes("createPhotoTrees(belt,'kestrel_ring_trees')"));
  assert.ok(!moorfield.includes("put(coneGeometry,'tree'")&&moorfield.includes("createPhotoTrees(belt,'moorfield_trees')"));
  assert.ok(!millhaven.includes('crown=new T.ConeGeometry')&&millhaven.includes("createPhotoTrees(belt,id+'_trees')"));
  assert.ok(!cinderbank.includes('tree:new T.ConeGeometry')&&cinderbank.includes("createPhotoTrees(belt,'cinderbank_trees')"));
  for(const f of [kestrel,moorfield,millhaven,cinderbank])assert.ok(f.includes('forest.dispose();'),'released with the venue');
  assert.ok(read('course-scenery.ts').includes('const material=photoTreeMaterial(kind,photo);')&&read('scenery-vegetation.ts').includes('const material = photoTreeMaterial(kind as PhotoTreeKind, photo);'));
});
test('loose chips no longer lie on the larger derby floor, and are the floor gravel\'s grey-brown',()=>{
  const world=read('world.ts');
  assert.ok(world.includes('const onFloor=Math.hypot(x-DERBY_ARENA.x,z-DERBY_ARENA.z)<DERBY_ARENA.radius-1;')&&world.includes('this.floorChips.visible=!expanded;'));
  assert.ok(world.includes('export const AGGREGATE_TINT=[.6,.57,.52] as const;'));
});

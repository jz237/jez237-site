// Real trees on the near bank, for the Ultra tier only. The skyline and shore cards already shrink
// away within sixty metres of the eye (a flat cut-out cannot survive that range), so these fill
// exactly the hole they leave: Blender-built pines, spruces, oaks and maples with branch geometry
// and needle or leaf sprays on crossed cards, instanced and re-pointed at the nearest shore trees as
// the kayak moves. Capacity is fixed, so the cost does not grow with the size of the wood.
import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/jsm/loaders/GLTFLoader.js';
import {barkMaterial} from './land-materials.js';
import {windSway} from './botany.js';
import {TREES_3D,CAPACITY,pickNearest,treeScale} from './trees3d-model.js';

export {TREES_3D,CAPACITY,REACH,TARGET_HEIGHT,pickNearest,treeScale,CARD_FADE} from './trees3d-model.js';
export function makeTrees3D(scene,{base='./assets/trees/',points={pine:[],broad:[]}}={}){
 const root=new T.Group();root.visible=false;scene.add(root);
 const loader=new GLTFLoader(),texLoader=new T.TextureLoader();
 const bark=barkMaterial();windSway(bark,0);
 const sprayMat=spray=>{const m=new T.MeshStandardMaterial({color:0xffffff,roughness:.88,metalness:0,side:T.DoubleSide,alphaTest:.34,transparent:false});
  m.color.setScalar(spray==='needle'?.66:.74);windSway(m,.09,.22);
  texLoader.load(base+spray+'.webp',t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;m.map=t;m.needsUpdate=true;},undefined,()=>{});return m;};
 const mats={needle:sprayMat('needle'),leaf:sprayMat('leaf')};
 const kinds=[];let loaded=0;
 for(const spec of TREES_3D){
  loader.load(base+spec.id+'.glb',gltf=>{
   let trunk=null,leaves=null;
   gltf.scene.traverse(o=>{if(!o.isMesh)return;const n=(o.material&&o.material.name)||'';if(n.includes('bark')||o.name.includes('trunk'))trunk=o;else leaves=o;});
   if(!trunk&&!leaves)return;
   const entry={...spec,meshes:[],slots:[]};
   for(const [src,mat] of [[trunk,bark],[leaves,mats[spec.spray]]]){
    if(!src)continue;
    const geo=src.geometry.clone();geo.applyMatrix4(src.matrixWorld);
    const mesh=new T.InstancedMesh(geo,mat,CAPACITY);mesh.count=0;mesh.frustumCulled=false;
    mesh.instanceColor=new T.InstancedBufferAttribute(new Float32Array(CAPACITY*3).fill(1),3);
    mesh.castShadow=true;mesh.receiveShadow=false;mesh.userData.skipReflection=false;
    root.add(mesh);entry.meshes.push(mesh);
   }
   kinds.push(entry);loaded++;
  },undefined,()=>{});
 }
 const d=new T.Object3D(),colour=new T.Color();let clock=0,active=0;
 function refresh(camx,camz){
  active=0;
  // each kind (pine or broadleaf) has its own species list; a point's species is fixed by its index,
  // so a tree keeps its shape as the boat moves and a stand stays mixed
  for(const kind of ['pine','broad']){
   const list=kinds.filter(k=>k.kind===kind);if(!list.length)continue;
   const pts=points[kind]||[];
   const pick=pickNearest(pts,camx,camz);
   const per=list.map(()=>0);
   for(const idx of pick){
    const p=pts[idx];const s=idx%list.length;const entry=list[s];
    if(per[s]>=CAPACITY)continue;
    // every species is scaled to the same target height before the point's own size, so a maple
    // does not tower over a pine merely because its model is taller
    const h=treeScale(entry.height,p);
    d.position.set(p.x,p.y,p.z);d.rotation.set(0,p.angle||0,0);d.scale.setScalar(h);d.updateMatrix();
    // a tint per tree, steady per point, so neighbours differ in depth and warmth
    const tint=p.tint??.5;colour.setRGB(.6+tint*.72,.68+tint*.6,.55+tint*.7);
    for(const m of entry.meshes){m.setMatrixAt(per[s],d.matrix);m.setColorAt(per[s],colour);}
    per[s]++;
   }
   list.forEach((entry,s)=>{for(const m of entry.meshes){m.count=per[s];m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere&&m.computeBoundingSphere();}active+=per[s];});
  }
 }
 return {root,
  ready:()=>loaded,
  active:()=>active,
  setEnabled(on){root.visible=!!on;},
  // re-point the instances a few times a second; the picking is a short sort over the near band
  update(dt,camera,quality){
   const on=quality==='ultra'&&loaded>0;root.visible=on;if(!on)return;
   clock+=dt;if(clock<.4&&active)return;clock=0;refresh(camera.x,camera.z);
  },
  refreshNow(camera){refresh(camera.x,camera.z);}};
}

// The banks: a dense wooded fringe along the waterline (detailed pines and oaks), a cheaper backdrop
// forest behind it, grass down to the water and cattails in the shallows. Instanced in 64 m bins so
// off-screen groves are culled; wind-swayed, distance-faded, and part of the planar reflection.
import * as T from './vendor/three.module.js';
import {tree,cattail,grassTuft,rng,windSway} from './botany.js';
import {barkMaterial} from './land-materials.js';
import {noise} from './lake-shape.js';
export function makeShoreScenery(scene,bathy){
 const random=rng(4471),root=new T.Group();scene.add(root);const meshes=[];
 const wood=barkMaterial();windSway(wood,0);
 const foliage=(color,flex)=>{const m=new T.MeshStandardMaterial({color,roughness:.86,side:T.DoubleSide,vertexColors:true});windSway(m,flex);return m;};
 const pineMat=foliage(0x3a5531,.12),broadMat=foliage(0x5f8236,.2),farPine=foliage(0x33492c,.06),farBroad=foliage(0x4f6e2f,.08),grassMat=foliage(0x86984c,1.1),reedMat=foliage(0x7d9a4a,.9),headMat=new T.MeshStandardMaterial({color:0x5a3a22,roughness:.9});
 // Spatial bins of 64 m give Three a bounding sphere per bin, so off-screen groves are frustum-culled;
 // bins that cast no shadow are also dropped from the reflection pass on lower tiers.
 function instances(g,m,points,shadow=true){if(!points.length)return null;if(!points[0].batched){const bins=new Map();for(const p of points){const key=Math.floor(p.x/64)+','+Math.floor(p.z/64);if(!bins.has(key))bins.set(key,[]);bins.get(key).push({...p,batched:true});}const group=new T.Group();root.add(group);for(const bin of bins.values())group.add(instances(g,m,bin,shadow));return group;}
  const mesh=new T.InstancedMesh(g,m,points.length),d=new T.Object3D();
  points.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(p.rx??0,p.angle,p.rz??0);d.scale.set(p.scale,p.scale*(p.stretch??1),p.scale);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);if(m.vertexColors)mesh.setColorAt(i,new T.Color().setScalar(.78+(p.tint??.5)*.3));});
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=shadow;mesh.receiveShadow=true;mesh.userData.skipReflection=!shadow;meshes.push(mesh);return mesh;}
 const span=bathy.span,near={pine:[],broad:[]},far={pine:[],broad:[]},grass=[],reeds=[];
 const budget={near:520,far:1100,grass:1600,reeds:900};
 for(let i=0;i<26000;i++){
  const x=(random()-.5)*span*.98,z=(random()-.5)*span*.98,y=bathy.height(x,z);
  if(y<-.8)continue;const shore=bathy.shoreDistance(x,z);if(shore>170&&y>0)continue;
  const slope=Math.hypot(bathy.height(x+1,z)-bathy.height(x-1,z),bathy.height(x,z+1)-bathy.height(x,z-1))/2;
  const north=z<-(x*.75)-15;const cluster=noise(x*.02+7,z*.02)*.7+noise(x*.07,z*.07+3)*.3;
  const common={x,y:y-.12,z,angle:random()*6.283,scale:.55+random()*.9,tint:random()};
  if(y>.9&&y<38&&slope<.6){
   const pineChance=north?.62:.35;
   if(shore<70&&cluster>(north?.30:.40)&&near.pine.length+near.broad.length<budget.near)(random()<pineChance?near.pine:near.broad).push({...common,stretch:.85+random()*.35});
   else if(shore>=45&&cluster>.26&&far.pine.length+far.broad.length<budget.far)(random()<pineChance?far.pine:far.broad).push({...common,scale:.7+random()*.9,stretch:.9+random()*.4});
  }
  if(y>.15&&y<9&&shore<45&&slope<.75&&cluster>.22&&grass.length<budget.grass)grass.push({...common,y,scale:.6+random()*1.1});
  if(y<.12&&y>-.7&&reeds.length<budget.reeds&&noise(x*.05+2,z*.05)>.5)reeds.push({...common,y:y-.02,scale:.75+random()*.6});
 }
 const pineNear=tree('pine',473,.75),broadNear=tree('broad',811,.75),pineFar=tree('pine',921,.32),broadFar=tree('broad',553,.32);
 instances(pineNear.wood,wood,near.pine);instances(pineNear.leaf,pineMat,near.pine);
 instances(broadNear.wood,wood,near.broad);instances(broadNear.leaf,broadMat,near.broad);
 instances(pineFar.wood,wood,far.pine,false);instances(pineFar.leaf,farPine,far.pine,false);
 instances(broadFar.wood,wood,far.broad,false);instances(broadFar.leaf,farBroad,far.broad,false);
 const grassGroup=instances(grassTuft(19),grassMat,grass,false);
 const reed=cattail(77);instances(reed.plant,reedMat,reeds,false);instances(reed.head,headMat,reeds,false);
 root.userData.counts={nearPine:near.pine.length,nearBroad:near.broad.length,farPine:far.pine.length,farBroad:far.broad.length,grass:grass.length,reeds:reeds.length};
 return {root,counts:root.userData.counts,update(t,wind,quality,camera){windSway.time.value=t;windSway.strength.value=wind;windSway.distance.value=quality==='high'?460:quality==='medium'?330:230;
  for(const m of meshes){const c=m.boundingSphere.center,r=m.boundingSphere.radius;m.visible=Math.hypot(camera.x-c.x,camera.z-c.z)<windSway.distance.value+r+45;}
  if(grassGroup)grassGroup.visible=quality!=='low'&&quality!=='saver';}};
}

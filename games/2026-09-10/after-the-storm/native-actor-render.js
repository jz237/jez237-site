import * as T from './vendor/three.module.js';

function matrix(values,name,affine=false){
 if(!Array.isArray(values)||values.length!==16||values.some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v))))throw new RangeError(`Invalid actor ${name}`);
 if(affine&&(values[3]!==0||values[7]!==0||values[11]!==0||values[15]!==1))throw new RangeError(`Actor ${name} must be affine`);
 return new T.Matrix4().fromArray(values);
}

/** Bind prepared original transforms to caller-owned high-resolution parts.
 * getPart is a read-only resource resolver. It selects geometry and material
 * for the complete draw, including its surface, lighting and fog. localMatrix
 * explicitly maps the authored model's local units/rest pose into native part
 * coordinates; worldScale has already been applied by the presentation step.
 * Geometry, textures and materials are never simplified, cloned or disposed.
 */
export function prepareNativeActorMeshes(presentation,getPart){
 if(!Array.isArray(presentation?.draws)||presentation.draws.length>192)throw new RangeError('Supply bounded prepared actor draws');
 if(typeof getPart!=='function')throw new TypeError('Supply high-resolution actor part resolver');
 return presentation.draws.map(draw=>{
  for(const [key,min,max]of [['actorIndex',0,29],['bufferIndex',0,1],['resourceIndex',0,32767],['partOffset',8,40]])if(!Number.isInteger(draw?.[key])||draw[key]<min||draw[key]>max)throw new RangeError('Invalid actor draw '+key);
  if(draw.partOffset%4)throw new RangeError('Unaligned actor draw part');
  const transform=matrix(draw.matrixWorld,'world matrix'),part=getPart(draw);
  if(!part?.geometry?.isBufferGeometry||!part.geometry.getAttribute('position')||part.geometry.getAttribute('position').itemSize!==3||(part.geometry.getAttribute('position').count<3&&part.geometry.drawRange.count!==0))throw new TypeError('Supply high-resolution actor geometry');
  const materials=Array.isArray(part.material)?part.material:[part.material];
  if(!materials.length||materials.some(m=>!m?.isMaterial))throw new TypeError('Supply high-resolution actor material');
  transform.multiply(matrix(part.localMatrix,'part conversion',true));
  if(transform.elements.some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v))))throw new RangeError('Actor composed matrix exceeds renderer range');
  return {draw,geometry:part.geometry,material:part.material,matrixWorld:transform};
 });
}

export function makeNativeActorRenderer(root,{getPart,renderOrder=10}={}){
 if(!root?.isObject3D)throw new TypeError('Supply actor scene root');
 if(typeof getPart!=='function')throw new TypeError('Supply high-resolution actor part resolver');
 if(!Number.isFinite(renderOrder))throw new RangeError('Invalid actor render order');
 const group=new T.Group();group.name='native-retained-actors';group.renderOrder=renderOrder;root.add(group);
 const meshes=[];let disposed=false;
 return {
  update(presentation){
   if(disposed)throw new Error('Native actor renderer is disposed');
   // Complete resource/matrix validation before changing any visible draw.
   const prepared=prepareNativeActorMeshes(presentation,getPart);
   group.updateWorldMatrix(true,false);
   const determinant=group.matrixWorld.determinant();
   if(!Number.isFinite(determinant)||determinant===0)throw new RangeError('Actor scene root must be invertible');
   const inverse=new T.Matrix4().copy(group.matrixWorld).invert(),locals=prepared.map(p=>new T.Matrix4().multiplyMatrices(inverse,p.matrixWorld));
   if(locals.some(m=>m.elements.some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v)))))throw new RangeError('Actor local matrix exceeds renderer range');
   for(let i=0;i<prepared.length;i++){
    const p=prepared[i];let mesh=meshes[i];
    // Original actor visibility is already resolved. Retained partial matrices
    // can be projective; Three's affine bounding-sphere cull is invalid there.
    if(!mesh){mesh=new T.Mesh(p.geometry,p.material);mesh.name='native-actor-part-'+i;mesh.matrixAutoUpdate=false;mesh.frustumCulled=false;mesh.userData.dynamic=true;mesh.renderOrder=i;group.add(mesh);meshes.push(mesh);}
    mesh.geometry=p.geometry;mesh.material=p.material;mesh.matrix.copy(locals[i]);mesh.matrixWorldNeedsUpdate=true;mesh.visible=true;mesh.userData.nativeActor=p.draw;
   }
   for(let i=prepared.length;i<meshes.length;i++)meshes[i].visible=false;
   return {parts:prepared.length,actors:new Set(prepared.map(p=>p.draw.actorIndex)).size};
  },
  dispose(){if(disposed)return;disposed=true;group.removeFromParent();group.clear();meshes.length=0;}
 };
}

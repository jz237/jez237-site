import * as T from 'three';
import type {Tetra3D} from './Tetra3D.ts';

/** Identical eyes share draw calls; each keeps its complete mesh and world transform. */
export class SchoolEyes{
 readonly batches:T.InstancedMesh[]=[];
 private bindings:{source:T.Mesh;batch:T.InstancedMesh;index:number}[]=[];
 constructor(scene:T.Scene,fish:readonly Tetra3D[]){
  if(!fish.length)return;
  for(let kind=0;kind<2;kind++){
   const prototype=fish[0].eyeMeshes[kind];
   const batch=new T.InstancedMesh(prototype.geometry.clone(),(prototype.material as T.Material).clone(),fish.length*2);
   batch.instanceMatrix.setUsage(T.DynamicDrawUsage);batch.castShadow=true;batch.receiveShadow=true;
   // The school explores the whole aquarium: compute its bounds each animation frame.
   for(let f=0;f<fish.length;f++)for(let side=0;side<2;side++){
    const source=fish[f].eyeMeshes[kind+side*2];source.visible=false;
    this.bindings.push({source,batch,index:f*2+side});
   }
   scene.add(batch);this.batches.push(batch);
  }
 }
 update(){
  for(const {source,batch,index} of this.bindings)batch.setMatrixAt(index,source.matrixWorld);
  for(const batch of this.batches){batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();}
 }
}

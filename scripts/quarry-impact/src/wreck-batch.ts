import type {Mesh} from 'three';

type Finish=(mesh:Mesh)=>void;
let depth=0;
const pending=new Map<Mesh,Finish>();

/** Deformation, wear and bounds remain immediate. Only derived lighting normals
 * may be coalesced until this synchronous scope returns, before rendering. */
export function withWreckBatch<T>(run:()=>T):T{
 depth++;
 try{return run();}
 finally{
  depth--;
  if(depth===0)for(const mesh of pending.keys())flushWreckNormals(mesh);
 }
}
export function queueWreckNormals(mesh:Mesh,finish:Finish){
 if(depth)pending.set(mesh,finish);else finish(mesh);
}
/** A debris clone must receive the exact normals of the hit that released it. */
export function flushWreckNormals(mesh:Mesh){
 const finish=pending.get(mesh);if(!finish)return;
 pending.delete(mesh);finish(mesh);
}
/** Repair restores authored normals; disposed meshes must not survive a batch. */
export function cancelWreckNormals(mesh:Mesh){pending.delete(mesh);}

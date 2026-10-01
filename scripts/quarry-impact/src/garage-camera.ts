import * as T from 'three';
import type {LiveryFace} from './livery';
/** Offset the projection, not the aim point, so overhead views retain their orientation. */
export function frameGarage(camera:T.PerspectiveCamera,position:T.Vector3,rotation:T.Quaternion,face:LiveryFace,width:number,height:number){
 const angle={right:Math.PI/2,left:-Math.PI/2,front:0,rear:Math.PI,top:0}[face],target=position.clone().add(new T.Vector3(0,.1,0));
 const offset=face==='top'?new T.Vector3(0,8,.01):new T.Vector3(Math.sin(angle)*7.7,1.8,Math.cos(angle)*7.7);
 camera.up.copy(face==='top'?new T.Vector3(0,0,-1):new T.Vector3(0,1,0)).applyQuaternion(rotation);camera.position.copy(target).add(offset.applyQuaternion(rotation));camera.lookAt(target);
 const pane=width>850?Math.min(570,width*.58):0;
 camera.setViewOffset(width,height,pane/2,0,width,height);camera.updateMatrixWorld();
}

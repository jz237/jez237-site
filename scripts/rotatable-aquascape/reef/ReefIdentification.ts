import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export type ReefNote={title:string;description:string};
type Range={start:number;end:number;note:ReefNote};
export const polypNotes:Record<string,ReefNote>={
 zoanthid:{title:'Zoanthid polyps',description:'Small colonial animals with colorful oral discs, central mouths and fringes of tentacles. These gardens grow across the live rock; their soft fringes move with the water.'},
 stony:{title:'Encrusting stony coral polyps',description:'Small coral cups form a living crust over the rock. Each cup houses a polyp within a hard skeleton. The colors and colony forms here are artistic approximations.'}
};
export const foodNote:ReefNote={title:'Food morsel',description:'A sinking piece of food. Fish approach and bite it; anemone tentacles can catch nearby morsels and carry them toward the mouth.'};
export function identifyGeometry(geometry:T.BufferGeometry,note:ReefNote){geometry.userData.identification=[{start:0,end:geometry.getAttribute('position').count,note}];return geometry;}
// Vertex ranges survive triangle reordering without extra GPU attributes or draws.
export function mergeIdentified(parts:T.BufferGeometry[]){
 const geometry=mergeGeometries(parts,false),ranges:Range[]=[];let offset=0;
 for(const part of parts){for(const r of (part.userData.identification||[]) as Range[])ranges.push({...r,start:r.start+offset,end:r.end+offset});offset+=part.getAttribute('position').count;}
 geometry.userData.identification=ranges;return geometry;
}
export function noteForHit(hit:T.Intersection):ReefNote|undefined{
 for(let o:T.Object3D|null=hit.object;o;o=o.parent)if(!o.visible)return;
 if(hit.face&&hit.object instanceof T.Mesh){const ranges=(hit.object.geometry.userData.identification||[]) as Range[],vertex=hit.face.a;const range=ranges.find(r=>vertex>=r.start&&vertex<r.end);if(range)return range.note;}
 for(let o:T.Object3D|null=hit.object;o;o=o.parent)if(o.userData.note)return o.userData.note;
}
export function pickNote(ray:T.Raycaster,solid:T.Object3D[],transparent:T.Object3D[]){
 // Transparent panes frame the contents instead of intercepting every animal.
 for(const targets of [solid,transparent]){
  // Food instances appear and move after the initial scene; refresh their bounds on demand.
  for(const target of targets)if(target instanceof T.InstancedMesh&&target.userData.note===foodNote)target.computeBoundingSphere();
  for(const hit of ray.intersectObjects(targets,true)){const note=noteForHit(hit);if(note)return note;}
 }
}

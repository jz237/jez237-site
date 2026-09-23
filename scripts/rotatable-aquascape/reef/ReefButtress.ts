import * as T from 'three';
import {erodedRock} from './ReefRock.ts';
import {encrustRock} from './ReefMaterials.ts';
import {sandHeight} from './ReefOptics.ts';
import {topSurfaceSampler} from './RockSurface.ts';
import {surfaceColony} from './SurfaceColony.ts';
import {encrustingGarden} from './EncrustingPolyps.ts';

/** Late, independently seeded edge growth preserves all established reef sites. */
export function reefButtresses(random:()=>number){
 const sites=[[-4.10,.43,-.90,.55,.30,.54],[-3.96,.83,-.87,.40,.42,.40],
  [3.98,.43,-1.11,.55,.30,.48],[4.02,.94,-1.13,.45,.51,.43],[4.09,.37,-1.59,.38,.20,.39],
  [-2.93,.34,1.38,.43,.19,.40],[-3.62,.30,1.87,.35,.18,.27],
  [2.84,.34,1.48,.42,.20,.42],[3.35,.30,1.85,.32,.16,.25]];
 const rocks:T.BufferGeometry[]=[],corals:T.BufferGeometry[]=[],gardens:T.BufferGeometry[]=[];
 const obstacles:{center:T.Vector3;radius:number}[]=[],groundGaps:number[]=[];
 const stats={rocks:0,rockTriangles:0,colonies:0,coralTriangles:0,polyps:0,tentacles:0,maxAttachmentError:0};
 for(let index=0;index<sites.length;index++){
  const [x,y,z,sx,sy,sz]=sites[index],g=erodedRock(x,y,z,sx,sy,sz,random);
  // Only the two upper shoulder stones stack above the bed. All other pieces
  // settle against local terrain, not the height at their nominal center.
  if(index!==1&&index!==3){
   const p=g.getAttribute('position');let clearance=Infinity;
   for(let i=0;i<p.count;i++)clearance=Math.min(clearance,p.getY(i)-sandHeight(p.getX(i),p.getZ(i)));
   const shift=-.035-clearance;g.translate(0,shift,0);groundGaps.push(clearance+shift);
  }
  encrustRock(g);g.computeBoundingSphere();rocks.push(g);stats.rocks++;stats.rockTriangles+=g.index!.count/3;
  // Exact enclosing spheres include every new stone vertex, regardless of erosion.
  obstacles.push({center:g.boundingSphere!.center.clone(),radius:g.boundingSphere!.radius+.005});
 }
 const material=new T.MeshBasicMaterial(),meshes=rocks.map(g=>new T.Mesh(g,material)),ray=new T.Raycaster();
 // Small outward growth on shoulders softens the otherwise bare side view.
 for(const [index,size,hue] of [[1,.32,.81],[3,.36,.14],[4,.26,.035],[5,.25,.23]]){
  const site=sites[index];ray.set(new T.Vector3(site[0],site[1]+1,site[2]),new T.Vector3(0,-1,0));ray.far=2;
  const hit=ray.intersectObject(meshes[index],false)[0];if(!hit?.face)continue;
  const colony=surfaceColony(meshes[index],hit.point,hit.face.normal,size,hue,random);
  corals.push(...colony.geometries);obstacles.push(colony.obstacle);stats.colonies++;stats.coralTriangles+=colony.triangles;
 }
 const sample=topSurfaceSampler(rocks);
 for(const [index,radius,kind] of [[5,.24,'stony'],[6,.24,'zoanthid'],[7,.31,'zoanthid'],[8,.21,'stony']] as const){
  const site=sites[index],garden=encrustingGarden(site[0],site[2],radius,kind,(x,z)=>sample(x,site[1]+.8,z),random);
  gardens.push(garden.geometry);stats.polyps+=garden.polypCount;stats.tentacles+=garden.tentacleCount;stats.maxAttachmentError=Math.max(stats.maxAttachmentError,garden.attachmentError);
 }
 material.dispose();return {rocks,corals,gardens,obstacles,stats,groundGaps};
}

import * as T from 'three';
import {leafContact,type GrazerPlants,type PlantLeaf} from './GrazerPlants.ts';
export type CoryForageSite={kind:'gravel'|'leaf';point:T.Vector3;leaf?:PlantLeaf;u?:number;v?:number};
/** Choose food at the mouth's reach, never an arbitrary point in open water. */
export function findCoryForageSite(position:T.Vector3,forward:T.Vector3,size:number,height:(x:number,z:number)=>number,plants:GrazerPlants|undefined,time:number,preferLeaf:boolean):CoryForageSite|undefined{
 const mouth=position.clone().addScaledVector(forward,.26*size).add(new T.Vector3(0,-.025*size,0));
 const gravel=mouth.clone();gravel.y=height(gravel.x,gravel.z);
 let leafSite:CoryForageSite|undefined,best=.12*.12;
 if(plants)for(const leaf of plants.nearby(mouth,.24)){
  if(leaf.box.distanceToPoint(mouth)>.14)continue;
  for(const u of [.12,.5,.88])for(const v of [.25,.55,.85]){const point=new T.Vector3(),normal=new T.Vector3();leafContact(leaf,u,v,time,point,normal);if(normal.y<.25||point.y-height(point.x,point.z)>.40||point.y>position.y+.035)continue;const d=point.distanceToSquared(mouth);if(d<best){best=d;leafSite={kind:'leaf',point,leaf,u,v};}}
 }
 const bottom=position.y-height(position.x,position.z)<.14&&Math.abs(mouth.y-gravel.y)<.11;
 if(leafSite&&(preferLeaf||!bottom))return leafSite;
 return bottom?{kind:'gravel',point:gravel}:leafSite;
}

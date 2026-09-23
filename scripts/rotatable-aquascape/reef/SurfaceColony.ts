import * as T from 'three';
import {branchingColony} from './CoralMorphology.ts';
import {coralCrust} from './CoralCrust.ts';

/** A small colony anchored to a sloping rock face. Its skeleton grows partly
 * toward open water and partly upward, with each primary root resampled locally. */
export function surfaceColony(support:T.Mesh,point:T.Vector3,normal:T.Vector3,size:number,hue:number,random:()=>number){
 const direction=normal.clone().multiplyScalar(.62).add(new T.Vector3(0,.78,0)).normalize();
 const rotation=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),direction);
 const origin=point.clone().addScaledVector(normal,-.008*size);
 const transform=new T.Matrix4().compose(origin,rotation,new T.Vector3(1,1,1)),inverse=transform.clone().invert();
 const ray=new T.Raycaster(),castDirection=direction.clone().negate();
 const sample=(x:number,z:number)=>{
  ray.set(new T.Vector3(x,.28*size,z).applyMatrix4(transform),castDirection);ray.far=.58*size;
  const hit=ray.intersectObject(support,false)[0];return hit?hit.point.clone().applyMatrix4(inverse).y:null;
 };
 const foot=coralCrust(support.geometry,point,normal,.23*size,hue,hue*17+size,{color:new T.Color().setHSL(hue,.52,.29),thickness:.006*size});
 foot.applyMatrix4(inverse);
 const geometries=branchingColony(new T.Vector3(),size,hue,random,sample,hue>.7?'canopy':'bushy',foot);
 const bounds=new T.Box3();let triangles=0;
 for(const geometry of geometries){geometry.applyMatrix4(transform);geometry.computeBoundingBox();bounds.union(geometry.boundingBox!);triangles+=geometry.index!.count/3;}
 const center=bounds.getCenter(new T.Vector3());let radiusSquared=0;
 for(const geometry of geometries){const p=geometry.getAttribute('position');for(let i=0;i<p.count;i++)radiusSquared=Math.max(radiusSquared,(p.getX(i)-center.x)**2+(p.getY(i)-center.y)**2+(p.getZ(i)-center.z)**2);}
 return {geometries,obstacle:{center,radius:Math.sqrt(radiusSquared)+.012},triangles,transform};
}

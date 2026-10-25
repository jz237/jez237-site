import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** A derby roll cage (offline derby cars): a main hoop just behind the driver's seat and an X of door bars on each side, as real
 * derby cars carry. It is placed from the driver's seat (the helmet centre, car frame) and the car's half width: bars run inset of
 * the half width, the hoop's posts rise to the helmet centre and lean in by lean towards a top bar top above it, the door bars
 * span back..front about the seat between low and belt below the helmet. tube is the tube radius (metres). One merged mesh.
 * Nothing runs behind the hoop: pickups and estates have open beds and load bays there. */
export const CAGE={tube:.022,inset:.84,lean:.6,top:.16,back:.32,front:.62,low:.6,belt:.3} as const;
/** The tube runs (pairs of car-frame points) for a seat at helmet centre (x, y, z) in a car of half width halfWidth. */
export function cageRuns(seat:{x:number;y:number;z:number},halfWidth:number):[T.Vector3,T.Vector3][]{
  const w=halfWidth*CAGE.inset,hoop=seat.z-CAGE.back,front=seat.z+CAGE.front,low=seat.y-CAGE.low,belt=seat.y-CAGE.belt,top=seat.y+CAGE.top,v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),runs:[T.Vector3,T.Vector3][]=[];
  for(const s of [-1,1]){
    runs.push([v(s*w,low,hoop),v(s*w,seat.y,hoop)],[v(s*w,seat.y,hoop),v(s*w*CAGE.lean,top,hoop)]);// hoop post, leaning in under the roof
    runs.push([v(s*w,low,hoop),v(s*w,belt,front)],[v(s*w,belt,hoop),v(s*w,low,front)],[v(s*w,belt,hoop),v(s*w,belt,front)]);// door X and its top rail
  }
  runs.push([v(-w*CAGE.lean,top,hoop),v(w*CAGE.lean,top,hoop)],[v(-w,low,hoop),v(w,low,hoop)]);// hoop top and floor bar
  return runs;
}
/** The cage as one mesh named 'roll_cage' (dark painted tube). */
export function rollCage(seat:{x:number;y:number;z:number},halfWidth:number){
  const up=new T.Vector3(0,1,0),parts=cageRuns(seat,halfWidth).map(([a,b])=>{
    const length=a.distanceTo(b),g=new T.CylinderGeometry(CAGE.tube,CAGE.tube,length+CAGE.tube*2,8,1,true);
    g.applyQuaternion(new T.Quaternion().setFromUnitVectors(up,b.clone().sub(a).normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);return g;});
  const geometry=mergeGeometries(parts)!;for(const p of parts)p.dispose();
  const cage=new T.Mesh(geometry,new T.MeshStandardMaterial({color:0x2b2f33,roughness:.55,metalness:.5,side:T.DoubleSide}));
  cage.name='roll_cage';cage.castShadow=false;cage.receiveShadow=true;return cage;
}
/** A crushed roof bends the hoop down with it: the cage squashes towards its floor bar by drop metres (the driver's slump). */
export function bendCage(cage:T.Object3D,seat:{y:number},drop:number){
  const height=CAGE.low+CAGE.top,floor=seat.y-CAGE.low,d=Math.max(0,Math.min(height*.6,Number.isFinite(drop)?drop:0)),s=1-d/height;
  cage.scale.y=s;cage.position.y=floor*(1-s);
}
export function disposeRollCage(cage:T.Object3D){if(cage instanceof T.Mesh){cage.geometry.dispose();(cage.material as T.Material).dispose();}cage.removeFromParent();}

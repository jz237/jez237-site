import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Door chains (offline rivals): derby prep — on CHAIN.share of the rivals both front doors are chained shut, a loop of
 * CHAIN.links steel links through the window and round the pillar behind the door, at CHAIN.sill of the door's height. A
 * chained door stays shut whatever happens to its latch, until a hit leaves it past CHAIN.snap damage (or CHAIN.loose on its
 * hinges, or off the car): the chain snaps and its links fly, and from then on the door is a door like any other. */
export const CHAIN={share:.55,links:16,sill:.64,snap:12,loose:.8,link:.036,wire:.0085,across:.1,along:.085,colour:0x6a6c70} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*17.23+salt*61.07)*43758.5453)%1;
/** Does rival `id` chain its doors? */
export const chainsDoors=(id:number)=>hash(Number.isFinite(id)?id:0,1)<CHAIN.share;
/** Does the chain on this door snap, at this damage and looseness, still on the car or not? */
export const chainSnaps=(damage:number,loose:number,attached:boolean)=>!attached||(Number.isFinite(damage)&&damage>=CHAIN.snap)||(Number.isFinite(loose)&&loose>=CHAIN.loose);
/** The front doors among a car's assemblies (not the rear doors, lids or tailgates). */
export const frontDoors=(names:readonly string[])=>names.filter(n=>/^door-(left|right)$/.test(n));
/** A chain's geometry: CHAIN.links links round a flat loop (CHAIN.across × CHAIN.along m) about the origin, each turned a
 * quarter to the last, as links are. */
export function chainGeometry(){
  const parts:T.BufferGeometry[]=[];
  for(let i=0;i<CHAIN.links;i++){
    const a=i/CHAIN.links*Math.PI*2,x=Math.cos(a)*CHAIN.across,z=Math.sin(a)*CHAIN.along,tangent=Math.atan2(Math.cos(a)*CHAIN.along,-Math.sin(a)*CHAIN.across);
    const link=new T.TorusGeometry(CHAIN.link/2,CHAIN.wire,6,10).scale(1,1.45,1);
    // Lying along the loop, alternately flat and on edge.
    link.rotateZ(Math.PI/2).rotateX(i%2?Math.PI/2:0).rotateY(tangent).translate(x,0,z);
    link.deleteAttribute('uv');parts.push(link);
  }
  return mergeGeometries(parts)!;
}
const material=new T.MeshStandardMaterial({name:'Door chain',color:CHAIN.colour,metalness:.85,roughness:.45});
/** Chains a front door shut: the loop round the door's back edge (`bounds` in the root's frame, `side` −1 left, +1 right),
 * through the window at the sill. Returns the chain (a child of the root). */
export function chainDoor(root:T.Object3D,bounds:T.Box3,side:number){
  const outer=side>0?bounds.max.x:bounds.min.x,chain=new T.Mesh(chainGeometry(),material);
  chain.name='door_chain';chain.position.set(outer-side*CHAIN.across*.8,bounds.min.y+(bounds.max.y-bounds.min.y)*CHAIN.sill,bounds.min.z);
  chain.castShadow=false;chain.receiveShadow=true;root.add(chain);return chain;
}

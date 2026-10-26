import * as T from 'three';
import {rusts} from './age-rust';

/** Donor panels (offline rivals): an old banger has been patched up from the scrapyard — a door, a wing or the bonnet off
 * another car, in grey or red-oxide primer (matte, no lacquer) or in that car's own colour. The older the car, the likelier:
 * one panel at DONOR.chance of its age, a second once it is past DONOR.second; which, and in what, is each car's own. Only the
 * painted steel of the panel changes (its trim stays), and the rival's livery is still painted over it. */
export const DONOR={chance:.85,second:.7,near:.12,
  parts:['door-left','door-right','door-rear-left','door-rear-right','hood','wing-left','wing-right','boot','trunk','tailgate','engine-lid'],
  paints:[{colour:0x6e7275,primer:true},{colour:0x7c3a2a,primer:true},{colour:0xd8d0b8,primer:false},{colour:0x2f4f7a,primer:false},
    {colour:0x3d5a3a,primer:false},{colour:0x9a2a22,primer:false},{colour:0xc4c6c8,primer:false},{colour:0x6e7275,primer:true}]} as const;
export type DonorPaint=typeof DONOR.paints[number];
type Assembly={name:string;members:readonly {mesh:T.Mesh}[]};
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*12.9898+salt*78.233)*43758.5453)%1;
/** Which of these panels (assembly names) come off donor cars, and in what paint, for a car of this id and age (0–1) whose
 * own colour is this — no donor in the car's own colour (within DONOR.near). */
export function pickDonors(names:readonly string[],id:number,age:number,own:T.Color):{name:string;paint:DonorPaint}[]{
  const n=Number.isFinite(id)?id:0,a=Number.isFinite(age)?Math.max(0,Math.min(1,age)):0,open=names.filter(x=>(DONOR.parts as readonly string[]).includes(x));
  const count=(hash(n,1)<a*DONOR.chance?1:0)+(a>DONOR.second&&hash(n,2)<.5?1:0),picked:{name:string;paint:DonorPaint}[]=[];
  const paints=DONOR.paints.filter(p=>{const c=new T.Color(p.colour);return Math.abs(c.r-own.r)+Math.abs(c.g-own.g)+Math.abs(c.b-own.b)>DONOR.near*3;});
  for(let k=0;k<count&&open.length&&paints.length;k++){const name=open.splice(Math.floor(hash(n,3+k)*open.length),1)[0];picked.push({name,paint:paints[Math.floor(hash(n,7+k)*paints.length)]});}
  return picked;
}
/** Refits these assemblies' painted steel in their donor paint: each its own copy of the material (shader work kept). */
export function fitDonors(assemblies:readonly Assembly[],donors:readonly {name:string;paint:DonorPaint}[]){
  let fitted=0;
  for(const d of donors){const a=assemblies.find(x=>x.name===d.name);if(!a)continue;const copies=new Map<T.Material,T.Material>();
    for(const {mesh} of a.members){const old=mesh.material as T.MeshPhysicalMaterial;if(Array.isArray(old)||!rusts(old.name))continue;
      let m=copies.get(old) as T.MeshPhysicalMaterial|undefined;
      if(!m){m=old.clone();m.onBeforeCompile=old.onBeforeCompile;m.customProgramCacheKey=old.customProgramCacheKey;m.color.setHex(d.paint.colour);
        if(d.paint.primer){m.roughness=.78;m.metalness=.04;m.clearcoat=0;}copies.set(old,m);}
      mesh.material=m;fitted++;}
  }
  return fitted;
}

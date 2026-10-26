import * as T from 'three';
import {dentGeometry} from './wreck-geometry';
import {bodyworkDentDamage} from './bodywork-response';

/** Battle scars (offline rivals): an old banger turns up still wearing the dents of its last meetings — SCARS.count of them,
 * more the older (none under SCARS.age), knocked into its ends (SCARS.ends of the time, where derby cars meet) and its flanks,
 * each as from a blow of SCARS.blow damage: dented, scraped, and smeared with some other car's paint (SCARS.paints). Only the
 * bodywork's shape and finish: the car's health, structure and panels are as sound as ever, and a repair beats them out. */
export const SCARS={age:.3,count:[1,4],ends:.65,blow:[7,12],paints:[0xc8c8c8,0x2f4f7a,0x9a2a22,0xd8b23a,0x3d5a3a,0x111111,0xe8e4da]} as const;
export type Scar={at:T.Vector3;direction:T.Vector3;blow:number;paint:T.Color};
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*17.317+salt*91.731)*43758.5453)%1;
/** The painted bodywork's points in the model frame (its rest shape), for placing scars on. */
export function bodyPoints(panels:readonly T.Mesh[]){
  const points:number[]=[];
  for(const p of panels){const m=p.material as T.Material,rest=p.geometry.attributes.wreckPosition;if(Array.isArray(m)||!m.name.startsWith('paint')||!rest)continue;
    for(let i=0;i<rest.count;i++)points.push(rest.getX(i),rest.getY(i),rest.getZ(i));}
  return points;
}
/** Where an old car of this id and age (0–1) was knocked about before, on bodywork made of these points (x,y,z in turn). */
export function planScars(points:ArrayLike<number>,id:number,age:number):Scar[]{
  const n=Number.isFinite(id)?id:0,a=Number.isFinite(age)?Math.max(0,Math.min(1,age)):0;if(a<SCARS.age||points.length<9)return [];
  const lo=new T.Vector3(Infinity,Infinity,Infinity),hi=new T.Vector3(-Infinity,-Infinity,-Infinity),v=new T.Vector3();
  for(let i=0;i<points.length;i+=3){v.set(points[i],points[i+1],points[i+2]);lo.min(v);hi.max(v);}
  const count=Math.round(SCARS.count[0]+(SCARS.count[1]-SCARS.count[0])*(a-SCARS.age)/(1-SCARS.age)),scars:Scar[]=[],target=new T.Vector3();
  for(let k=0;k<count;k++){
    const end=hash(n,k*5+1)<SCARS.ends,sign=hash(n,k*5+2)<.5?-1:1,u=hash(n,k*5+3),h=lo.y+(hi.y-lo.y)*(.15+.4*hash(n,k*5+4));
    target.set(end?(lo.x+(hi.x-lo.x)*(.15+.7*u)):sign>0?hi.x:lo.x,h,end?(sign>0?hi.z:lo.z):lo.z+(hi.z-lo.z)*(.2+.6*u));
    // On the bodywork itself: its point nearest the spot.
    let best=Infinity,at=new T.Vector3();for(let i=0;i<points.length;i+=3){v.set(points[i],points[i+1],points[i+2]);const d=v.distanceToSquared(target);if(d<best){best=d;at=v.clone();}}
    const direction=end?new T.Vector3((u-.5)*.6,0,-sign).normalize():new T.Vector3(-sign,0,(u-.5)*.4).normalize();
    scars.push({at,direction,blow:SCARS.blow[0]+(SCARS.blow[1]-SCARS.blow[0])*hash(n,k*5+5),paint:new T.Color(SCARS.paints[Math.floor(hash(n,k*5+6)*SCARS.paints.length)])});
  }
  return scars;
}
/** Knocks the scars into these panels — shape and finish only — and smears each with its paint (`transfer`, as a hit does).
 * Returns how many panels took a dent. */
export function applyScars(panels:readonly T.Mesh[],scars:readonly Scar[],transfer:(panel:T.Mesh,at:T.Vector3,blow:number,paint:T.Color)=>void){
  const dented=new Set<T.Mesh>();
  for(const s of scars){const dent=bodyworkDentDamage(s.blow);
    for(const panel of panels){if(!panel.visible)continue;if(dentGeometry(panel,s.at,s.direction,dent)>0){dented.add(panel);transfer(panel,s.at,s.blow,s.paint);}}}
  return dented.size;
}

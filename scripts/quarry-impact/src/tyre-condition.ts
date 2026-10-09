import {classicWheelAnchors,isClassicKind,vehicleWheelRadius} from './classic-vehicle-specs';
import anchors from './vehicle-damage-anchors.json';
import {CAR_KINDS,type CarKind} from './rules';
import type {DamageVector} from './component-damage';

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const smooth=(n:number)=>n*n*(3-2*n);
const wheelAnchors=Object.fromEntries(CAR_KINDS.map(kind=>{
 const model=isClassicKind(kind)?classicWheelAnchors(kind):anchors[kind];
 return[kind,model.wheels.map(w=>({x:w.x,y:w.y-model.modelOffset,z:w.z}))];
})) as Record<CarKind,DamageVector[]>;

/** Absent state belongs to the legacy wheel model; subthreshold tyres stay intact. */
export function tyreFailure(damage?:number){
 return smooth(clamp(((Number.isFinite(damage)?damage!:0)-.72)/.20,0,1));
}

// Measured metal bounds exclude rubber ribs and wheel-view blockers. The sphere
// contains every actual metal vertex, so its clearance also covers camber/spin.
const metalRadius:Record<CarKind,number>={trail:.249375,regent:.225625,shuttle:.2553125,coupe:.31640545,sedan:.34432976,hatch:.34882476,muscle:.24835855,wagon:.24835855,utility:.24835855,compact:.19000000,van:.22265625,tern:.19000000,marten:.19000000,buggy:.20800001};
const metalSphere:Record<CarKind,number>={trail:.271092,regent:.2452734,shuttle:.2775462,coupe:.343084,sedan:.366979,hatch:.369064,muscle:.271376,wagon:.271376,utility:.271376,compact:.206546,van:.242046,tern:.206546,marten:.206546,buggy:.234413};
export const vehicleFlatTyreRadius=(kind:CarKind)=>Math.max(metalRadius[kind]+.015,metalSphere[kind]+.005,vehicleWheelRadius(kind)*.70);

function lowerWishboneWeight(point:DamageVector,corner:number){
 const side=corner%2?1:-1,z=corner<2?1.2:-1.2;let weight=0;
 // Authored Ravine lower links (buggy-suspension.ts) intersect the lower rail:
 // model (.30,.345,z+/-.21) -> (.79,.375,z). Their combined tube radii bridge
 // the .037m vertical separation at rail x=.59. Only this connected lower
 // assembly transfers crush into the same tyre; the centre rail/cage do not.
 for(const fore of [-1,1]){
  const a={x:side*.30,y:.345-.96,z:z+fore*.21},b={x:side*.79,y:.375-.96,z};
  const x=b.x-a.x,y=b.y-a.y,dz=b.z-a.z,t=clamp(((point.x-a.x)*x+(point.y-a.y)*y+(point.z-a.z)*dz)/(x*x+y*y+dz*dz),0,1);
  const distance=Math.hypot(point.x-a.x-t*x,point.y-a.y-t*y,point.z-a.z-t*dz);
  weight=Math.max(weight,1-smooth(clamp((distance-.075)/.045,0,1)));
 }
 return weight;
}

/**
 * Local tyre trauma, separate from broad suspension/body-corner deformation.
 * Points are body-local; damage has already passed armor scaling. Old saves
 * must not acquire this state by inferring punctures from their wheelDamage.
 */
export function accumulateTyreDamage(state:{[index:number]:number},kind:CarKind,point:DamageVector,structuralDamage:number):void{
 if(!Number.isFinite(structuralDamage)||structuralDamage<=1.8||![point.x,point.y,point.z].every(Number.isFinite))return;
 const radius=vehicleWheelRadius(kind),lateralLimit=radius*.6+.11,radialLimit=radius+.12;
 for(let i=0;i<4;i++){
  const wheel=wheelAnchors[kind][i],lateral=Math.abs(point.x-wheel.x),radial=Math.hypot(point.y-wheel.y,point.z-wheel.z);
  const sideWeight=1-smooth(clamp((lateral-.12)/(lateralLimit-.12),0,1));
  const treadWeight=1-smooth(clamp((radial-radius*.55)/(radialLimit-radius*.55),0,1));
  const weight=Math.max(sideWeight*treadWeight,kind==='buggy'?lowerWishboneWeight(point,i):0);
  if(weight>0)state[i]=clamp((Number.isFinite(state[i])?state[i]:0)+(structuralDamage-1.8)/50*weight,0,1);
 }
}

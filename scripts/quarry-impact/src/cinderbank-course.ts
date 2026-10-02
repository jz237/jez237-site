import type R from '@dimforge/rapier3d-compat';

const HALF_STRAIGHT=60,RADIUS=58,TAU=Math.PI*2;
const length=4*HALF_STRAIGHT+TAU*RADIUS;
type Point={x:number;z:number};
export type CinderbankSolid={id:string;x:number;y:number;z:number;half:readonly[number,number,number];yaw:number;material:'concrete'|'stripe'|'steel';collision:boolean};
const wrap=(value:number,period:number)=>((value%period)+period)%period;
/** Analytic arc-length stadium: tangent joins have no kink or elevation change.
 * The start lies midway along the south straight, clear in both directions. */
function point(t:number):Point{
 let s=wrap(t*length+HALF_STRAIGHT,length);
 if(s<2*HALF_STRAIGHT)return{x:-HALF_STRAIGHT+s,z:-RADIUS};
 s-=2*HALF_STRAIGHT;
 if(s<Math.PI*RADIUS){const a=s/RADIUS-Math.PI/2;return{x:HALF_STRAIGHT+RADIUS*Math.cos(a),z:RADIUS*Math.sin(a)};}
 s-=Math.PI*RADIUS;
 if(s<2*HALF_STRAIGHT)return{x:HALF_STRAIGHT-s,z:RADIUS};
 const a=(s-2*HALF_STRAIGHT)/RADIUS+Math.PI/2;return{x:-HALF_STRAIGHT+RADIUS*Math.cos(a),z:RADIUS*Math.sin(a)};
}
const distance=(x:number,z:number)=>Math.abs(Math.hypot(Math.max(0,Math.abs(x)-HALF_STRAIGHT),z)-RADIUS);
/** Offset loops share tangent stations. Short overlapping OBBs close every joint
 * without extending a sharp concrete corner into the24m racing corridor. */
export const CINDERBANK_BARRIERS=(()=>{
 const result:{x:number;z:number;yaw:number;length:number;side:number}[]=[];
 for(const side of [-1,1]){
  const radius=RADIUS+side*15,points:Point[]=[];
  for(let i=0;i<24;i++)points.push({x:-HALF_STRAIGHT+i*5,z:-radius});
  for(let i=0;i<56;i++){const a=-Math.PI/2+i*Math.PI/56;points.push({x:HALF_STRAIGHT+radius*Math.cos(a),z:radius*Math.sin(a)});}
  for(let i=0;i<24;i++)points.push({x:HALF_STRAIGHT-i*5,z:radius});
  for(let i=0;i<56;i++){const a=Math.PI/2+i*Math.PI/56;points.push({x:-HALF_STRAIGHT+radius*Math.cos(a),z:radius*Math.sin(a)});}
  points.forEach((a,i)=>{const b=points[(i+1)%points.length];result.push({x:(a.x+b.x)/2,z:(a.z+b.z)/2,yaw:Math.atan2(b.x-a.x,b.z-a.z),length:Math.hypot(b.x-a.x,b.z-a.z)+.10,side});});
 }
 return result;
})();
/** Each reachable solid is rendered from this same record, including the gantry. */
export const CINDERBANK_SOLIDS:readonly CinderbankSolid[]=[
 ...CINDERBANK_BARRIERS.map((b,i):CinderbankSolid=>({id:'oval_barrier_'+i,x:b.x,y:.65,z:b.z,half:[.35,.65,b.length/2],yaw:b.yaw,material:i%8<4?'concrete':'stripe',collision:true})),
 ...[-1,1].map((side):CinderbankSolid=>({id:'finish_pillar_'+side,x:0,y:3.6,z:-RADIUS+side*18,half:[.24,3.6,.24],yaw:0,material:'steel',collision:true})),
 {id:'finish_bridge',x:0,y:7.45,z:-RADIUS,half:[.32,.3,18.24],yaw:0,material:'steel',collision:true},
];
export const CINDERBANK={
 id:'cinderbank-oval-v1' as const,name:'Cinderbank Speedway',length,halfWidth:12,checkpointRadius:16,
 point,distance,samples:Array.from({length:384},(_,i)=>point(i/384)),checkpoints:Array.from({length:24},(_,i)=>point(i/24)),
 height:(_x:number,_z:number)=>0,
 surface:(x:number,z:number):'asphalt'|'gravel'=>Math.abs(x)<=HALF_STRAIGHT&&distance(x,z)<=12?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>160||Math.abs(z)>105||y< -8,
 /** Owned fixed bodies allow an independent world to be freed or construction
  * to roll back without touching the caller's cars or other venue resources. */
 buildPhysics(api:typeof R,world:R.World):number[]{
  const owned:number[]=[];
  try{
   const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);
   world.createCollider(api.ColliderDesc.cuboid(165,.5,110).setTranslation(0,-.5,0).setFriction(.85),floor);
   for(const solid of CINDERBANK_SOLIDS){
    if(!solid.collision)continue;
    const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(solid.x,solid.y,solid.z).setRotation({x:0,y:Math.sin(solid.yaw/2),z:0,w:Math.cos(solid.yaw/2)}));owned.push(body.handle);
    world.createCollider(api.ColliderDesc.cuboid(...solid.half).setFriction(.35),body);
   }
   return owned;
  }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
 },
};

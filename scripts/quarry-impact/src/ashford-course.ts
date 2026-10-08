import type R from '@dimforge/rapier3d-compat';
type Point={x:number;z:number};
const controls=[[-90,-80],[0,-80],[90,-80],[114,-48],[114,12],[92,75],[48,100],[4,79],[-8,28],[-58,35],[-88,70],[-118,38],[-118,-35]];
const wrap=(n:number,p:number)=>((n%p)+p)%p;
function curve(t:number):Point{
 const u=wrap(t,1)*controls.length,i=Math.floor(u),f=u-i;
 const p=[-1,0,1,2].map(k=>controls[wrap(i+k,controls.length)]);
 const axis=(a:number)=>.5*((2*p[1][a])+(-p[0][a]+p[2][a])*f+(2*p[0][a]-5*p[1][a]+4*p[2][a]-p[3][a])*f*f+(-p[0][a]+3*p[1][a]-3*p[2][a]+p[3][a])*f*f*f);
 return{x:axis(0),z:axis(1)};
}
const path=Array.from({length:1025},(_,i)=>curve(i/1024)),distances=[0];
for(let i=1;i<path.length;i++)distances.push(distances[i-1]+Math.hypot(path[i].x-path[i-1].x,path[i].z-path[i-1].z));
const length=distances.at(-1)!;
// Start at the centre of the long straight. The 24-car grid has room in either direction.
const start=(()=>{let best=Infinity,at=0;path.forEach((p,i)=>{const d=Math.hypot(p.x,p.z+80);if(d<best){best=d;at=distances[i];}});return at;})();
function point(t:number):Point{
 const distance=wrap(start+t*length,length);let lo=0,hi=distances.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(distances[mid]<=distance)lo=mid;else hi=mid;}
 const mix=(distance-distances[lo])/(distances[hi]-distances[lo]),a=path[lo],b=path[hi];return{x:a.x+(b.x-a.x)*mix,z:a.z+(b.z-a.z)*mix};
}
const samples=Array.from({length:256},(_,i)=>point(i/256));
function distance(x:number,z:number){
 let nearest=Infinity;
 for(let i=0;i<samples.length;i++){const a=samples[i],b=samples[(i+1)%samples.length],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));nearest=Math.min(nearest,(x-a.x-dx*t)**2+(z-a.z-dz*t)**2);}
 return Math.sqrt(nearest);
}
export type AshfordSolid={id:string;x:number;y:number;z:number;half:readonly[number,number,number];yaw:number;material:'concrete'|'stripe'|'steel';collision:boolean};
export const ASHFORD_SOLIDS:readonly AshfordSolid[]=(()=>{
 const solids:AshfordSolid[]=[];
 for(const side of [-1,1]){
  const edge=Array.from({length:256},(_,i)=>{const p=point(i/256),a=point(i/256-.0001),b=point(i/256+.0001),yaw=Math.atan2(b.x-a.x,b.z-a.z);return{x:p.x+Math.cos(yaw)*side*16,z:p.z-Math.sin(yaw)*side*16};});
  edge.forEach((a,i)=>{const b=edge[(i+1)%edge.length];solids.push({id:`barrier_${side}_${i}`,x:(a.x+b.x)/2,y:.65,z:(a.z+b.z)/2,half:[.3,.65,Math.hypot(b.x-a.x,b.z-a.z)/2+.05],yaw:Math.atan2(b.x-a.x,b.z-a.z),material:i%12<6?'concrete':'stripe',collision:true});});
 }
 const p=point(0);
 for(const side of [-1,1])solids.push({id:'start_post_'+side,x:p.x,y:4,z:p.z+side*18,half:[.25,4,.25],yaw:0,material:'steel',collision:true});
 solids.push({id:'start_gantry',x:p.x,y:8.2,z:p.z,half:[.3,.2,18.25],yaw:0,material:'steel',collision:true});
 return solids;
})();
export const ASHFORD={
 id:'ashford-autodrome-v1' as const,name:'Ashford Autodrome',length,halfWidth:12,checkpointRadius:15,
 point,distance,samples,checkpoints:Array.from({length:24},(_,i)=>point(i/24)),
 height:(_x:number,_z:number)=>0,
 surface:(x:number,z:number):'asphalt'|'gravel'=>distance(x,z)<=12?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>160||Math.abs(z)>140||y< -8,
 buildPhysics(api:typeof R,world:R.World):number[]{
  const owned:number[]=[];
  try{
   const floor=world.createRigidBody(api.RigidBodyDesc.fixed());owned.push(floor.handle);world.createCollider(api.ColliderDesc.cuboid(170,.5,150).setTranslation(0,-.5,0).setFriction(.85),floor);
   for(const s of ASHFORD_SOLIDS){if(!s.collision)continue;const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(...s.half).setFriction(.35),body);}
   return owned;
  }catch(error){for(const handle of owned){const body=world.getRigidBody(handle);if(body)world.removeRigidBody(body);}throw error;}
 },
};

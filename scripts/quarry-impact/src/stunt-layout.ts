import type R from '@dimforge/rapier3d-compat';
export const STUNT_LOOP={x:-65,z:25,radius:16,shift:16,halfWidth:4,segments:360}as const;
export function stuntLoopPoint(t:number){const a=t*Math.PI*2,l=STUNT_LOOP;return{x:l.x+l.shift*t,y:l.radius*(1-Math.cos(a)),z:l.z+l.radius*Math.sin(a)};}
/** A helical ribbon keeps entry and exit lanes apart at ground level. */
export function stuntLoopMesh(){
 const positions:number[]=[],indices:number[]=[],uv:number[]=[];
 for(let i=0;i<=STUNT_LOOP.segments;i++){const p=stuntLoopPoint(i/STUNT_LOOP.segments);for(const side of [-1,1]){positions.push(p.x+side*STUNT_LOOP.halfWidth,p.y,p.z);uv.push((side+1)/2,i/12);}}
 for(let i=0;i<STUNT_LOOP.segments;i++){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
 return{positions:Float32Array.from(positions),indices:Uint32Array.from(indices),uv:Float32Array.from(uv)};
}
export const STUNT_RAMPS=[
 {id:'gap_launch',x:65,z0:-45,z1:-20,y0:0,y1:4,halfWidth:8},
 {id:'gap_landing',x:65,z0:0,z1:65,y0:4,y1:0,halfWidth:10},
 {id:'training_up',x:125,z0:-20,z1:0,y0:0,y1:1.8,halfWidth:7},
 {id:'training_down',x:125,z0:0,z1:20,y0:1.8,y1:0,halfWidth:7},
]as const;
export function stuntRampMesh(r:typeof STUNT_RAMPS[number]){
 const x0=r.x-r.halfWidth,x1=r.x+r.halfWidth;
 return{positions:Float32Array.from([x0,r.y0,r.z0,x1,r.y0,r.z0,x0,r.y1,r.z1,x1,r.y1,r.z1,x0,-.1,r.z0,x1,-.1,r.z0,x0,-.1,r.z1,x1,-.1,r.z1]),indices:Uint32Array.from([0,2,1,1,2,3,4,0,5,5,0,1,2,6,3,3,6,7,4,6,0,0,6,2,1,3,5,5,3,7])};
}
export function stuntHeight(x:number,z:number){
 let y=0;for(const r of STUNT_RAMPS)if(Math.abs(x-r.x)<=r.halfWidth&&z>=r.z0&&z<=r.z1)y=Math.max(y,r.y0+(r.y1-r.y0)*(z-r.z0)/(r.z1-r.z0));return y;
}
export const STUNT_BARRIERS=Array.from({length:160},(_,i)=>{const side=Math.floor(i/40),offset=-1+(i%40+.5)/20,vertical=side%2===0;return{x:vertical?(side===0?-215:215):offset*215,z:vertical?offset*185:(side===1?-185:185),y:1,yaw:vertical?0:Math.PI/2,half:[.45,1,vertical?4.68:5.43]as const};});
export const STUNT_SUPPORTS=[{x:-76,y:16.5,z:25,half:[.4,16.5,.4]as const},{x:-38,y:16.5,z:25,half:[.4,16.5,.4]as const},{x:-57,y:33.4,z:25,half:[19.4,.4,.4]as const}];
export function buildStuntPhysics(api:typeof R,world:R.World){
 const owned:number[]=[];
 try{
  const ground=world.createRigidBody(api.RigidBodyDesc.fixed());ground.userData={courseSurface:'alderwick-stunt-v1'};owned.push(ground.handle);
  world.createCollider(api.ColliderDesc.cuboid(240,.5,210).setTranslation(0,-.5,0).setFriction(.85),ground);
  const loop=stuntLoopMesh();world.createCollider(api.ColliderDesc.trimesh(loop.positions,loop.indices).setFriction(1),ground);
  for(const r of STUNT_RAMPS){const mesh=stuntRampMesh(r);world.createCollider(api.ColliderDesc.trimesh(mesh.positions,mesh.indices).setFriction(.85),ground);}
  for(const s of [...STUNT_BARRIERS,...STUNT_SUPPORTS.map(s=>({...s,yaw:0}))]){const body=world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(s.x,s.y,s.z).setRotation({x:0,y:Math.sin(s.yaw/2),z:0,w:Math.cos(s.yaw/2)}));owned.push(body.handle);world.createCollider(api.ColliderDesc.cuboid(s.half[0],s.half[1],s.half[2]).setFriction(.5),body);}
  return owned;
 }catch(error){for(const h of owned){const body=world.getRigidBody(h);if(body)world.removeRigidBody(body);}throw error;}
}

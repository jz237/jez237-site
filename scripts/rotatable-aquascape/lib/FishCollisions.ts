export type CollisionBody={id:number;x:number;y:number;z:number;radius:number};
/** Conservative body envelopes in a shared coordinate system (z spans 180 scene units). */
export function separateFish(bodies:CollisionBody[],depthBounds:[number,number]=[.03,.97]){
 for(let pass=0;pass<24;pass++){
  let penetration=0;
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
   const a=bodies[i],b=bodies[j];let dx=b.x-a.x,dy=b.y-a.y,dz=(b.z-a.z)*180;
   let distance=Math.hypot(dx,dy,dz);const clearance=a.radius+b.radius;
   if(distance>=clearance)continue;
   if(distance<1e-8){dx=0;dy=0;dz=a.id<b.id?1:-1;distance=1;}
   const overlap=clearance-distance;penetration=Math.max(penetration,overlap);
   const push=(overlap+.001)*.5/distance;
   a.x-=dx*push;a.y-=dy*push;a.z-=dz*push/180;
   b.x+=dx*push;b.y+=dy*push;b.z+=dz*push/180;
  }
  for(const b of bodies){b.x=Math.max(620+b.radius,Math.min(1260-b.radius,b.x));b.y=Math.max(220+b.radius,Math.min(550-b.radius,b.y));b.z=Math.max(depthBounds[0]+b.radius/180,Math.min(depthBounds[1]-b.radius/180,b.z));}
  if(penetration<.002)break;
 }
}

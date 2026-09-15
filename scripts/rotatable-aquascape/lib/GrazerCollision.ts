import * as T from 'three';
export type BodySphere={center:T.Vector3;radius:number};
export type FishContactBody={id:number;position:T.Vector3;previous?:T.Vector3;forward:T.Vector3;size:number};
export function grazerBody(position:T.Vector3,normal:T.Vector3,forward:T.Vector3,snail=false,scale=.84):BodySphere[]{
 const profile=snail?[[-.04,.20,.185],[.14,.06,.075]]:[[-.29,.10,.045],[-.20,.12,.055],[-.10,.12,.065],[0,.12,.068],[.105,.13,.054],[.18,.133,.026]];
 return profile.map(([x,y,r])=>({center:position.clone().addScaledVector(forward,x*scale).addScaledVector(normal,y*scale),radius:r*scale}));
}
export function bodiesOverlap(a:BodySphere[],b:BodySphere[],margin=.004){return a.some(x=>b.some(y=>x.center.distanceToSquared(y.center)<(x.radius+y.radius+margin)**2));}
export function fishBody(fish:FishContactBody,position=fish.position):BodySphere[]{return [-.24,-.10,.05,.20,.34,.445].map((x,i)=>({center:position.clone().addScaledVector(fish.forward,x*fish.size).add(new T.Vector3(0,-.035*fish.size,0)),radius:[.047,.085,.115,.115,.095,.040][i]*fish.size}));}
/** Broad rejection encloses the entire translated six-sphere fish, including
 * a fast sweep and the body offset. A possible hit always uses the original
 * narrow phase; this never substitutes a point test for the animal's body. */
export function fishSweepMayReach(fish:FishContactBody,body:BodySphere[],margin=.006){
 const from=fish.previous??fish.position,to=fish.position,f=fish.forward,size=Math.abs(fish.size);
 const ex=(Math.abs(f.x)*.445+.115)*size+margin+1e-10;
 const ey=(Math.abs(f.y)*.445+.115)*size+margin+1e-10;
 const ez=(Math.abs(f.z)*.445+.115)*size+margin+1e-10;
 const x0=Math.min(from.x,to.x)-ex,x1=Math.max(from.x,to.x)+ex;
 const y0=Math.min(from.y,to.y)-.035*fish.size-ey,y1=Math.max(from.y,to.y)-.035*fish.size+ey;
 const z0=Math.min(from.z,to.z)-ez,z1=Math.max(from.z,to.z)+ez;
 for(const {center:p,radius:r} of body)if(p.x+r>=x0&&p.x-r<=x1&&p.y+r>=y0&&p.y-r<=y1&&p.z+r>=z0&&p.z-r<=z1)return true;
 return false;
}
/** Check every traversed interval; a fast fish cannot skip over a small shrimp. */
export function fishTouch(fish:FishContactBody,body:BodySphere[]){
 if(!fishSweepMayReach(fish,body))return null;
 const from=fish.previous??fish.position,steps=Math.max(1,Math.ceil(from.distanceTo(fish.position)/.025)),p=new T.Vector3(),safe=from.clone();
 for(let i=0;i<=steps;i++){p.copy(from).lerp(fish.position,i/steps);if(bodiesOverlap(fishBody(fish,p),body,.006)){
   if(i===0){const away=p.clone().sub(body[2]?.center??body[0].center);if(away.lengthSq()<1e-8)away.set(0,1,0);away.normalize();for(let j=0;j<50&&bodiesOverlap(fishBody(fish,safe),body);j++)safe.addScaledVector(away,.02);}
   return safe;
  }safe.copy(p);
 }
 return null;
}
export function sweptPose(from:T.Vector3,to:T.Vector3,oldNormal:T.Vector3,normal:T.Vector3,oldForward:T.Vector3,forward:T.Vector3,clear:(p:T.Vector3,n:T.Vector3,f:T.Vector3)=>boolean){
 const angle=Math.max(oldNormal.angleTo(normal),oldForward.angleTo(forward)),steps=Math.max(1,Math.ceil(from.distanceTo(to)/.02),Math.ceil(angle/.12)),p=new T.Vector3(),n=new T.Vector3(),f=new T.Vector3();
 for(let i=1;i<=steps;i++){const t=i/steps;p.copy(from).lerp(to,t);n.copy(oldNormal).lerp(normal,t).normalize();f.copy(oldForward).lerp(forward,t).projectOnPlane(n);if(f.lengthSq()<1e-8)f.copy(oldForward);f.normalize();if(!clear(p,n,f))return false;}
 return true;
}
/** Embedded hip sockets: every walking leg begins inside the thoracic shell. */
export function shrimpHip(k:number,side:number){return new T.Vector3(.105-k*.034,.106,side*.021);}

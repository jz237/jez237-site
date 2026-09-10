// Metres and seconds. Shared by collision, scenery and the wave datum.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function tideLevel(course,time){
 if(course.id!=='tempest')return 0;
 // An intentionally compressed ebb over one race, continuous at lap crossings.
 const u=clamp((time-20)/140,0,1);
 return .35-1.4*u*u*(3-2*u);
}
export function obstaclePosition(obstacle,time){
 if(obstacle.type!=='ice')return {x:obstacle.x,z:obstacle.z};
 const phase=obstacle.x*.031+obstacle.z*.017;
 return {x:obstacle.x+Math.sin(time*.023+phase)*2.4,z:obstacle.z+Math.sin(time*.017+phase*1.3)*1.8};
}
export function floatingPose(x,z,time,surface,radius=.6,heading=0){
 const fx=Math.sin(heading)*radius,fz=Math.cos(heading)*radius,rx=Math.cos(heading)*radius,rz=-Math.sin(heading)*radius;
 const fore=surface(x+fx,z+fz,time),aft=surface(x-fx,z-fz,time),port=surface(x-rx,z-rz,time),starboard=surface(x+rx,z+rz,time);
 return {y:(fore+aft+port+starboard)/4,pitch:-Math.atan2(fore-aft,2*radius),roll:Math.atan2(starboard-port,2*radius)};
}

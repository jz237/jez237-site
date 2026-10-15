import {collideSourceFixedSpheres} from './source-boundary-spheres.js';
import {HULL_PROBES,hullProbeOffset} from './hull-probes.js';

// Interim rigid-hull bridge. Source candidate order, cached probes, complete
// penetration, and separating contact are retained. Live race-core still owns
// a rigid craft: the three-point kick is represented by its mean velocity.
// The native adapter can instead call collideSourceFixedSpheres directly and
// retain every point velocity/constraint. This bridge makes no such claim.
export function constrainSourceSphereRace(grid,r){
 const h=r.hydro,pose={heading:r.heading,pitch:h.pitch,roll:h.roll};
 const center={x:r.x,y:h.y,z:r.z},velocity={x:r.vx,y:h.vy,z:r.vz};
 const points=HULL_PROBES.map(p=>{const q=hullProbeOffset(p,pose);return {position:{x:center.x+q.x,y:center.y+q.y,z:center.z+q.z},velocity:{...velocity}};});
 const start={...points[0].position};
 const hull={scale:grid.scale,center,frame:{up:hullProbeOffset({x:0,y:1,z:0},pose),forward:hullProbeOffset({x:0,y:0,z:1},pose)},points};
 const hit=collideSourceFixedSpheres(grid,hull);
 r.sourceSphereContacts=hit.contacts.map(q=>({id:q.id,probeIndex:q.probeIndex,penetration:q.penetration,normalSpeed:q.normalSpeed}));
 if(!hit.contacts.length)return {impact:0,contacts:0};
 r.x+=points[0].position.x-start.x;r.z+=points[0].position.z-start.z;h.y+=points[0].position.y-start.y;
 r.vx=points.reduce((sum,p)=>sum+p.velocity.x,0)/12;
 r.vz=points.reduce((sum,p)=>sum+p.velocity.z,0)/12;
 h.vy=points.reduce((sum,p)=>sum+p.velocity.y,0)/12;r.speed=Math.hypot(r.vx,r.vz);
 return {impact:hit.impactState.maximum,contacts:hit.contacts.length};
}

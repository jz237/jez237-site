import {SUNSET_NATIVE_GEOMETRY} from './source-sunset-course.js';

// Authored helm corridors around the recovered geometry. Five-metre passing
// offsets (seven at the Normal northbound buoy) and lead distances are browser
// navigation policy, not source AI.
// These points neither award buoy progress nor alter collision geometry.
const direction=h=>{const a=(Math.trunc(h*4096/360)&4095)*Math.PI*2/4096;return [Math.sin(a),Math.cos(a)];};
const routes=SUNSET_NATIVE_GEOMETRY.visibleBuoysByClass.map((rows,difficulty)=>{
 const anchors=[],roles=[],reverse=difficulty===3,finish=[5,22.5],forward=reverse?1:-1;
 const add=(p,role=null)=>{anchors.push(p);roles.push(role);};
 add([finish[0],finish[1]+forward*3]);
 rows.forEach(([x,z,type,heading],i)=>{
  const [tx,tz]=direction(heading),side=[0,6].includes(type)?1:-1;
  const clearance=difficulty===0&&i===6?7:5;
  const center=[x*.025-tz*side*clearance,z*.025+tx*side*clearance];
  if(!reverse&&i===2)for(const p of [[-35,-128],[-46,-132],[-58,-130]])add(p);
  if(!reverse&&i===7)for(const p of [[-66,83],[-64,101],[-57,111]])add(p);
  if(!reverse&&x===3920)for(const p of [[91,116],[102,107],[105,96],[101,85]])add(p);
  if(reverse&&i===3)for(const p of [[93,76],[102,88],[105,100],[100,111],[88,119]])add(p);
  if(reverse&&i===7)for(const p of [[-51,119],[-62,112],[-67,100],[-70,77]])add(p);
  if(reverse&&i===9)for(const p of [[-96,-13],[-97,-35],[-89,-47],[-82,-80]])add(p);
  if(reverse&&i===10)for(const p of [[-73,-118],[-63,-130],[-49,-133],[-35,-129]])add(p);
  for(const lead of [-3,0,3])add([center[0]+tx*lead,center[1]+tz*lead],`buoy-${i}`);
 });
 add([finish[0],finish[1]-forward*3],'finish');add(finish,'finish');
 return {anchors,roles};
});
export const sunsetAnchors=routes.map(q=>q.anchors);
export const sunsetPilotAnchors=routes.map(q=>q.roles);
export const sunsetNavigation={
 boundary:[[-115,-160],[125,-160],[125,150],[-115,150]],
 status:'solo-class-corridors-checked-admission-pending',validated:false,
 validation:{rider:0,seed:17,hz:60,mode:'time',laps:3,classes:[0,1,2,3],misses:0,
  finishSeconds:[223.2,227.6,301.2,293.8],scope:'Prepared source geometry and modern hull only; Stunt and visual admission remain pending.'},
 policy:{passingDistanceWorld:5,leadWorld:3,envelope:'Authored browser envelope, not a recovered source course-out rule.'}
};
const ring=i=>{const [x,y,z,,,heading]=SUNSET_NATIVE_GEOMETRY.rings[i],[tx,tz]=direction(heading);
 return {kind:'ring',ringIndex:i,x:x*.025,y:y*.025,z:z*.025,tx,tz,speed:i<6?18:25,
  ...(i===1?{navX:-5.8}:i===3?{navX:-34.5}:{})};};
const checkpoint=i=>{const [x,z,,heading]=SUNSET_NATIVE_GEOMETRY.stuntRoute[[4,5,7,0][i]],[tx,tz]=direction(heading);
 return {kind:'checkpoint',checkpointIndex:i,x:x*.025,z:z*.025,tx,tz,speed:25};};
const waypoint=(x,z,speed=28)=>({kind:'waypoint',x,z,speed,radius:2,dampen:true});
// Separate timed route under validation; actual ring/checkpoint volumes own
// completion. The driver never changes scores, time limits or hull positions.
export const sunsetStuntNavigation={
 anchors:[[3,16],[0,-40],[-20,-83],[-40,-125],[-65,-130],[-72,-110],[-73,75],[-65,108],[-44,124],[70,124],[102,100],[94,77],[46,66],[15,48]],
 validation:{status:'incomplete',seed:17,hz:60,rings:6,checkpoints:3,remaining:'Rings1/6/8 and the final timed section need route validation.'},
 verificationOnePass:true,pilotControl:{steeringGain:3.2,yawDamping:.5},
 verificationTargets:[ring(0),ring(1),ring(2),ring(3),waypoint(-43,-120),waypoint(-57,-130,18),waypoint(-71,-122,18),checkpoint(0),
  waypoint(-73,-70,18),ring(4),ring(5),checkpoint(1),waypoint(-69,99),waypoint(-58,117),waypoint(-40,127),waypoint(5,127),checkpoint(2),
  waypoint(85,118),waypoint(96,106,24),waypoint(96,94,24),waypoint(85,84),waypoint(60,88),ring(6),ring(7),ring(8),checkpoint(3)]
};

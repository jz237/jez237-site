import {SUNSET_NATIVE_GEOMETRY} from './source-sunset-course.js?v=abdbcabcfe7a';

// Authored helm corridors around the recovered geometry. Five-metre passing
// offsets (seven at Normal's northbound buoy, nine at Expert's northern turn) and lead distances are browser
// navigation policy, not source AI.
// These points neither award buoy progress nor alter collision geometry.
const direction=h=>{const a=(Math.trunc(h*4096/360)&4095)*Math.PI*2/4096;return [Math.sin(a),Math.cos(a)];};
const routes=SUNSET_NATIVE_GEOMETRY.visibleBuoysByClass.map((rows,difficulty)=>{
 const anchors=[],roles=[],reverse=difficulty===3,finish=[5,22.5],forward=reverse?1:-1;
 const add=(p,role=null)=>{anchors.push(p);roles.push(role);};
 add([finish[0],finish[1]+forward*3]);
 rows.forEach(([x,z,type,heading],i)=>{
  const [tx,tz]=direction(heading),side=[0,6].includes(type)?1:-1;
  // Expert's closely spaced northbound-to-eastbound pair needs an earlier
  // inside approach so slower-turning craft can reach the next red's side.
  const clearance=difficulty===2&&i===7?9:difficulty===0&&i===6?7:5;
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
// Inspection helm only: the native hull needs to begin Hard's northern bend
// earlier than the modern craft. These targets never alter source buoy rows,
// contact geometry or judging. Expert/Reverse guidance remains under review.
export const sunsetNativeDrivingAnchors=routes.map((q,difficulty)=>q.anchors.map(([x,z])=>
 difficulty===1&&x===-66&&z===83?[-72,80]:
 difficulty===1&&x===-64&&z===101?[-68,94]:
 difficulty===1&&x===-57&&z===111?[-58,103]:[x,z]));
export const sunsetNavigation={
 boundary:[[-115,-160],[125,-160],[125,150],[-115,150]],
 status:'modern-class-corridors-checked',validated:false,
 validation:{rider:0,seed:17,hz:60,mode:'time',laps:3,classes:[0,1,2,3],misses:0,
  scope:'Source geometry with the modern hull, seed17/60Hz default rider. The public registration records admission; this factory does not prove native AI or handling parity.'},
 policy:{passingDistanceWorld:5,leadWorld:3,envelope:'Authored browser envelope, not a recovered source course-out rule.'}
};
const ring=i=>{const [x,y,z,,,heading]=SUNSET_NATIVE_GEOMETRY.rings[i],[tx,tz]=direction(heading);
 return {kind:'ring',ringIndex:i,x:x*.025,y:y*.025,z:z*.025,tx,tz,speed:i===1?14:i<6?18:i===8?23:25,
  ...(i===1?{navX:-12}:i===3?{navX:-34.5}:i===7?{passingHeading:225}:i===8?{passingHeading:230}:{})};};
const checkpoint=i=>{const [x,z,,heading]=SUNSET_NATIVE_GEOMETRY.stuntRoute[[4,5,7,0][i]],[tx,tz]=direction(heading);
 return {kind:'checkpoint',checkpointIndex:i,x:x*.025,z:z*.025,tx,tz,speed:25,...(i===2?{navZ:110}:{})};};
const waypoint=(x,z,speed=28)=>({kind:'waypoint',x,z,speed,radius:2,dampen:true});
// Separate timed route under validation; actual ring/checkpoint volumes own
// completion. The driver never changes scores, time limits or hull positions.
export const sunsetStuntNavigation={
 anchors:[[3,16],[0,-40],[-20,-83],[-40,-125],[-65,-130],[-72,-110],[-73,75],[-65,108],[-44,124],[70,124],[102,100],[94,77],[46,66],[15,48]],
 validation:{status:'default-rider-stunt-checked-admission-pending',rider:0,seed:17,hz:60,classes:[0,1,2,3],rings:9,checkpoints:4,ramps:2,piers:2,cleanFlip:true,finishSeconds:43.283333,
  finalCheckpointCoastSeconds:.6,remaining:'Other riders and wave seeds need guide tuning; complete source-host and public-course admission remain pending. This is authored guidance for the modern hull.'},
 verificationOnePass:true,pilotControl:{steeringGain:5,yawDamping:.8,bendLead:15,airTrick:'flip'},
 verificationTargets:[ring(0),ring(1),ring(2),ring(3),waypoint(-43,-120),waypoint(-57,-130,18),waypoint(-71,-122,18),checkpoint(0),
  waypoint(-73,-70,18),ring(4),ring(5),checkpoint(1),waypoint(-69,99),waypoint(-58,117),waypoint(-40,127),waypoint(5,127),checkpoint(2),
  waypoint(85,110),waypoint(93,100),waypoint(80,88),waypoint(60,84),ring(6),ring(7),ring(8),checkpoint(3)]
};

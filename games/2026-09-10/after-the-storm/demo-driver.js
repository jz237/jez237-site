import {createRace,aiInput} from './race-core.js';
import {getCourse} from './courses.js';
import {verificationInput} from './race-verification.js';

export const DEMO_SCENES=[
 ['greyhaven','race'],['amber','race'],['reed','race'],['citadel','race'],
 ['citadel','stunt'],['port','race'],['port','stunt'],['neon','race'],
 ['glacier','race'],['tempest','race'],['practice','race']
];
export function createDemoScene(index=0){
 const [course,mode]=DEMO_SCENES[((index%DEMO_SCENES.length)+DEMO_SCENES.length)%DEMO_SCENES.length];
 const s=createRace({course:getCourse(course,0),mode,rider:0,difficulty:0,laps:3});
 s.demoRun=true;
 return s;
}
export function demoSceneDone(s){return s.phase==='results'||s.time>=115||(s.mode!=='stunt'&&s.racers[0].lap>1);}
export function demoInput(s){
 const r=s.racers[0];
 if(s.phase!=='running'||demoSceneDone(s))return {brake:true,dampen:true};
 const pilot=s.demoPilot??={x:r.x,z:r.z,progress:r.passed,at:s.time,rescueAt:-100,rescues:0,label:'Following the racing line'};
 if(Math.hypot(r.x-pilot.x,r.z-pilot.z)>8||r.passed!==pilot.progress){pilot.x=r.x;pilot.z=r.z;pilot.progress=r.passed;pilot.at=s.time;}
 if(s.time-pilot.at>10&&s.time-pilot.rescueAt>6){
  pilot.rescueAt=s.time;pilot.at=s.time;pilot.rescues++;pilot.label='Recovering to open water';
  return {rescue:true,dampen:true};
 }
 const input=s.mode==='stunt'?verificationInput(s,r):aiInput(s,r);
 if(r.wipeout){input.throttle=Math.floor(s.time*8)%2;pilot.label='Remounting after a wipeout';}
 else if(s.time-pilot.rescueAt<2)pilot.label='Recovering to open water';
 else if(r.hydro.airborne)pilot.label='Balancing for the landing';
 else if(input.dive)pilot.label='Diving beneath the surface';
 else if(input.brake)pilot.label='Slowing for the next turn';
 else if(s.mode==='stunt')pilot.label='Lining up the next ramp or ring';
 else pilot.label='Following buoys and avoiding obstacles';
 return input;
}

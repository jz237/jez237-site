import {createRace,stepRace} from './race-core.js';
import {getCourse} from './courses.js';
import {demoInput,demoSceneDone} from './demo-driver.js';

// An exhibition owns its own race state. It never enters the records, replay,
// unlock, or online submission lifecycle used by a player pressing Start.
export function createTitleScene(){
 const state=createRace({course:getCourse('greyhaven',0),mode:'race',seaState:'calm',waveSeed:17,laps:3,rider:0});
 state.demoRun=true;state.titleScene=true;state.phase='running';state.countdown=0;
 for(const rider of state.racers)rider.power=5;
 for(let i=0;i<240;i++)stepRace(state,demoInput(state),1/60);
 return state;
}
export function advanceTitleScene(state,seconds,memory){
 memory.remainder=(memory.remainder??0)+Math.min(seconds,.1);
 while(memory.remainder>=1/60){stepRace(state,demoInput(state),1/60);memory.remainder-=1/60;}
 return demoSceneDone(state)||state.time>85||!!state.racers[0].dq;
}
export function titleCameraFrame(memory,rider,time,dt,aspect){
 const heading=memory.heading??rider.heading;
 memory.heading=heading+Math.atan2(Math.sin(rider.heading-heading),Math.cos(rider.heading-heading))*(1-Math.exp(-dt*1.8));
 const angle=memory.heading+1.95+Math.sin(time*.065)*.36;
 const distance=13.5+Math.sin(time*.09)*2;
 const offset=aspect>1.25?4.8:0;
 const y=rider.hydro.y||0;
 return {position:{x:rider.x+Math.sin(angle)*distance,y:y+4.5+Math.sin(time*.11)*.65,z:rider.z+Math.cos(angle)*distance},target:{x:rider.x-Math.cos(angle)*offset,y:y+(aspect>1.25?1.1:-4.5),z:rider.z+Math.sin(angle)*offset}};
}

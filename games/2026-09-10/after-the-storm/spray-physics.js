import {gustAt} from './wind-gusts.js';
// Integrate droplets ballistically; only descending impacts lose vertical momentum.
export function advanceSpray(p,positions,index,dt,storm,surface,time=0){
 positions[index]+=p.vx*dt;positions[index+1]+=p.vy*dt;positions[index+2]+=p.vz*dt;
 const wind=gustAt(positions[index],positions[index+2],time,storm);
 if(p.mist){p.atomize=Math.max(0,(p.atomize||0)-dt);const aerosol=p.atomize<=0;const drag=1-Math.exp(-dt*(aerosol?2.8:.12));p.vx+=(wind.x-p.vx)*drag;p.vz+=(wind.z-p.vz)*drag;p.vy-=(aerosol?2.4:9.81)*dt;p.size+=dt*(aerosol?.12:.015);}else{p.vy-=9.81*dt;p.vx+=wind.x*.055*dt;p.vz+=wind.z*.055*dt;}
 const h=surface(positions[index],positions[index+2]);
 if(positions[index+1]<h){positions[index+1]=h;if(p.vy<0){p.vy=0;p.vx*=Math.exp(-dt*1.5);p.vz*=Math.exp(-dt*1.5);p.size+=dt*.055;}}
}

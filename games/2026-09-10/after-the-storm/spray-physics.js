// Integrate droplets ballistically; only descending impacts lose vertical momentum.
export function advanceSpray(p,positions,index,dt,storm,surface){
 positions[index]+=p.vx*dt;positions[index+1]+=p.vy*dt;positions[index+2]+=p.vz*dt;
 p.vy-=9.81*dt;p.vx+=storm*.5*dt;p.vz-=storm*.35*dt;
 const h=surface(positions[index],positions[index+2]);
 if(positions[index+1]<h){positions[index+1]=h;if(p.vy<0){p.vy=0;p.vx*=Math.exp(-dt*1.5);p.vz*=Math.exp(-dt*1.5);p.size+=dt*.055;}}
}

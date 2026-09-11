// Integrate droplets ballistically; only descending impacts lose vertical momentum.
export function advanceSpray(p,positions,index,dt,storm,surface){
 positions[index]+=p.vx*dt;positions[index+1]+=p.vy*dt;positions[index+2]+=p.vz*dt;
 if(p.mist){const drag=1-Math.exp(-dt*2.8);p.vx+=(storm*5-p.vx)*drag;p.vz+=(-storm*3.5-p.vz)*drag;p.vy-=2.4*dt;p.size+=dt*.1;}else{p.vy-=9.81*dt;p.vx+=storm*.5*dt;p.vz-=storm*.35*dt;}
 const h=surface(positions[index],positions[index+2]);
 if(positions[index+1]<h){positions[index+1]=h;if(p.vy<0){p.vy=0;p.vx*=Math.exp(-dt*1.5);p.vz*=Math.exp(-dt*1.5);p.size+=dt*.055;}}
}

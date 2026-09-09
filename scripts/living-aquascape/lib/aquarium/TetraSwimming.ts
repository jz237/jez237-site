export type TetraSwim={x:number;y:number;vx:number;vy:number;yaw:number;pitch:number;speed:number;direction:1|-1;sinceTurn:number;elapsed:number};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function createTetraSwim():TetraSwim{return {x:1110,y:330,vx:16,vy:0,yaw:0,pitch:0,speed:16,direction:1,sinceTurn:10,elapsed:0};}
/** Committed horizontal passes and upright yaw turns, independent of sprite steering. */
export function advanceTetraSwim(s:TetraSwim,seconds:number,feeding=false,lowOxygen=false){
 const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.1);if(!dt)return;
 s.elapsed+=dt;s.sinceTurn+=dt;
 const left=feeding?890:650,right=feeding?1130:1220;
 if(s.sinceTurn>6&&((s.direction===1&&s.x>right)||(s.direction===-1&&s.x<left))){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}
 const desired=s.direction===1?0:Math.PI;
 s.yaw+=clamp(desired-s.yaw,-dt*.9,dt*.9);
 const turning=Math.abs(desired-s.yaw)>.05;
 const pace=(lowOxygen?11:feeding?20:16)*(turning?.65:1);
 s.speed+=(pace-s.speed)*(1-Math.exp(-dt*1.5));
 const lane=feeding?258:350+Math.sin(s.elapsed*.08)*24;
 // Rise and sink gently. During yaw turns keep the back level.
 const wantedVy=turning?0:clamp((lane-s.y)*.12,-1.7,1.7);
 s.vy+=(wantedVy-s.vy)*(1-Math.exp(-dt*2));
 s.vx=s.speed*Math.cos(s.yaw);
 s.x+=s.vx*dt;s.y+=s.vy*dt;
 const wantedPitch=turning?0:clamp(Math.atan2(-s.vy,Math.max(10,s.speed)),-.12,.12);
 s.pitch+=(wantedPitch-s.pitch)*(1-Math.exp(-dt*2));
}

import {sprayLaunch} from './hull-spray.js';
const clamp=v=>Math.max(0,Math.min(1,v));
export function createSprayField(){return {packets:Array.from({length:96},()=>({life:0})),cursor:0,elapsed:0};}
export function sprayAt(field,point,exclude=null){let density=0;for(const p of field.packets){if(p.life<=0||p.owner===exclude)continue;const age=p.max-p.life,radius=.55+age*2.5,dy=(point.y-p.y)/(radius*.8),dx=(point.x-p.x)/radius,dz=(point.z-p.z)/radius,q=dx*dx+dy*dy+dz*dz;if(q<1)density+=(1-q)*p.life/p.max*p.power;}return clamp(density);}
export function stepSprayField(field,racers,dt,storm=0){if(dt<=0)return;field.elapsed+=dt;
 for(const p of field.packets)if(p.life>0){p.life=Math.max(0,p.life-dt);p.vx+=dt*storm*.8;p.vy-=dt*5.5;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
 if(field.elapsed>=.06){field.elapsed%=.06;for(const r of racers){if(r.speed<7||r.hydro.wet<.1||r.mount==='dolphin')continue;const q=sprayLaunch(r,'jet',1,()=>.5),p=field.packets[field.cursor++%96];Object.assign(p,q,{life:1.25,max:1.25,owner:r.id,power:clamp(r.speed/20)*r.hydro.wet});}}
 for(const r of racers){const hit=sprayAt(field,{x:r.x,y:r.hydro.y+.9,z:r.z},r.id);r.sprayExposure=(r.sprayExposure||0)+(hit-(r.sprayExposure||0))*(1-Math.exp(-dt*(hit>(r.sprayExposure||0)?16:3)));}
}

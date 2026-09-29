import {CHECKPOINTS, clamp, trackPoint, wrap, type Mode} from './rules';
import type {Input} from './vehicle';

type Point = {x:number;y:number;z:number};
export type DriverCar = {id:number;current:Point;velocity:Point;forward:Point;right:Point;speed:number;health:number;finished:boolean;nextCheckpoint:number;surface:string};
export type Clearance = {front:number;left:number;right:number;rear:number};
type Memory = {target:number;commit:number;stalled:number;reverse:number;escape:number;escapeSteer:number;attempts:number;steer:number;lane:number;phase:string;scan:number;clear:Clearance};
const stop:Input={throttle:0,steer:0,brake:1,handbrake:false};
const route=Array.from({length:128},(_,i)=>trackPoint(i/128));
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);

/** Solo driving decisions. Vehicle simulation and the online authority stay separate. */
export class DrivingBrain {
  readonly memory=new Map<number,Memory>();
  reset(){this.memory.clear();}
  update(car:DriverCar,cars:DriverCar[],mode:Mode,dt:number,probe?:()=>Clearance):Input {
    if(car.health<=0||car.finished)return {...stop};
    let m=this.memory.get(car.id);
    if(!m){m={target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:(car.id%3-1)*1.7,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}};this.memory.set(car.id,m);}
    m.commit-=dt;m.scan-=dt;
    if(m.scan<=0){m.clear=probe?.()??m.clear;m.scan=.16+(car.id%3)*.025;}
    const yaw=Math.atan2(car.forward.x,car.forward.z);
    let tx=0,tz=0,desiredSpeed=18,attack:DriverCar|undefined;
    if(mode==='derby'){
      attack=cars.find(c=>c.id===m!.target&&c.health>0);
      if(!attack||m.commit<=0){
        let best=-Infinity;
        for(const other of cars){
          if(other===car||other.health<=0)continue;
          const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z,d=Math.hypot(dx,dz);
          const heading=Math.abs(wrap(Math.atan2(dx,dz)-yaw));
          const flank=Math.abs((dx*other.right.x+dz*other.right.z)/Math.max(1,d));
          const score=32-d*.58-heading*9+flank*7+(100-other.health)*.045+(other.id===m.target?5:0);
          if(score>best){best=score;attack=other;}
        }
        m.target=attack?.id??-1;m.commit=2.2+(car.id%4)*.35;
      }
      if(!attack)return {...stop};
      const d=distance(car.current,attack.current),lead=clamp(d/(Math.abs(car.speed)+12),.12,.85);
      tx=attack.current.x+attack.velocity.x*lead;tz=attack.current.z+attack.velocity.z*lead;
      const radius=Math.hypot(tx,tz);if(radius>38){tx*=38/radius;tz*=38/radius;}
      m.phase='intercept';
      // Re-enter before the wall, rather than steering along it at full throttle.
      if(Math.hypot(car.current.x,car.current.z)>39){tx=0;tz=0;desiredSpeed=11;m.phase='re-enter';}
    }else{
      let prev:{x:number;z:number},next:{x:number;z:number},after:{x:number;z:number};
      if(mode==='race'){
        prev=CHECKPOINTS[(car.nextCheckpoint+23)%24];next=CHECKPOINTS[car.nextCheckpoint];after=CHECKPOINTS[(car.nextCheckpoint+1)%24];
      }else{
        let best=Infinity,index=0;
        route.forEach((p,i)=>{const d=Math.hypot(p.x-car.current.x,p.z-car.current.z);if(d<best){best=d;index=i;}});
        prev=route[index];next=route[(index+3)%128];after=route[(index+6)%128];
      }
      const sx=next.x-prev.x,sz=next.z-prev.z,len=Math.hypot(sx,sz),ux=sx/len,uz=sz/len;
      const along=clamp((car.current.x-prev.x)*ux+(car.current.z-prev.z)*uz,0,len);
      const look=6+Math.abs(car.speed)*.65,advance=Math.min(len,along+look);
      tx=prev.x+ux*advance+uz*m.lane;tz=prev.z+uz*advance-ux*m.lane;
      const turn=Math.abs(wrap(Math.atan2(after.x-next.x,after.z-next.z)-Math.atan2(sx,sz)));
      const near=Math.hypot(next.x-car.current.x,next.z-car.current.z);
      if(near<15){const blend=clamp((15-near)/15,0,.55);tx+=(after.x-next.x)*blend;tz+=(after.z-next.z)*blend;}
      desiredSpeed=clamp(24-turn*(near<35?12:5),9,24)*(car.surface==='gravel'?.87:1);
      m.phase='racing';
    }
    let angle=wrap(Math.atan2(tx-car.current.x,tz-car.current.z)-yaw);
    let steer=clamp(angle*1.75,-1,1);
    desiredSpeed=Math.min(desiredSpeed,clamp(23-Math.abs(angle)*12,4.5,23));
    let avoidance=0;
    for(const other of cars){
      if(other===car||other===attack)continue;
      const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
      const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
      if(ahead<0||ahead>5+Math.abs(car.speed)*.8||Math.abs(side)>3.4)continue;
      const strength=(1-ahead/(6+Math.abs(car.speed)*.8))*(1-Math.abs(side)/4);
      avoidance+=(side===0?(car.id%2?1:-1):-Math.sign(side))*strength;
      if(mode!=='derby'&&ahead<7&&Math.abs(side)<2)desiredSpeed=Math.min(desiredSpeed,Math.max(3,Math.abs(other.speed)-1));
      m.phase=other.health<=0?'avoid wreck':'overtake';
    }
    steer=clamp(steer+avoidance*1.2,-1,1);
    // Rays ignore cars (handled above), so committing to an attack isn't canceled.
    if(m.clear.front<Math.max(5,Math.abs(car.speed)*.8)){
      const side=m.clear.left>m.clear.right?-1:1;
      steer=clamp(steer+side*.85,-1,1);desiredSpeed=Math.min(desiredSpeed,Math.max(2,m.clear.front*.8));m.phase='avoid barrier';
    }
    const stalled=Math.abs(car.speed)<.9||(mode==='derby'&&attack!==undefined&&distance(car.current,attack.current)<6&&Math.abs(car.speed)<3.2);
    m.stalled=stalled?m.stalled+dt:Math.max(0,m.stalled-dt*2);
    if(m.reverse<=0&&m.escape<=0&&(m.stalled>1.65||(mode==='derby'&&Math.abs(angle)>2.25&&stalled&&m.stalled>.55))){
      m.reverse=1.15+(m.attempts%3)*.35;m.attempts++;m.stalled=0;m.commit=0;
    }
    if(m.reverse>0){
      m.reverse-=dt;m.phase='reverse escape';
      const direction=m.clear.left===m.clear.right?(m.attempts%2?1:-1):(m.clear.left>m.clear.right?1:-1);
      if(m.clear.rear<2.2||m.reverse<=0){m.reverse=0;m.escape=.8;m.escapeSteer=-direction*.8;}
      else {m.steer=direction*.8;return {throttle:-.75,steer:m.steer,brake:0,handbrake:false};}
    }
    if(m.escape>0){m.escape-=dt;steer=m.escapeSteer;desiredSpeed=8;m.phase='drive clear';}
    m.steer+=clamp(steer-m.steer,-dt*4.5,dt*4.5);
    return {throttle:clamp((desiredSpeed-car.speed)*.4,0,1),steer:m.steer,brake:clamp((car.speed-desiredSpeed)/5,0,1),handbrake:false};
  }
}

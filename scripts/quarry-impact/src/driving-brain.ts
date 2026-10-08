import {AI_DIFFICULTIES,type AIDifficulty} from './ai-difficulty';
import {driveDerby,type DerbyManeuver} from './derby-driving';
import {CHECKPOINTS, DEFINITIONS, clamp, trackPoint, wrap, type Mode, type CarKind} from './rules';
import type {Input} from './vehicle';
import {LEGACY_ARENA,type ArenaLayout} from './derby-arena';

type Point = {x:number;y:number;z:number};
export type DriverCar = {id:number;kind?:CarKind;current:Point;velocity:Point;forward:Point;right:Point;speed:number;health:number;finished:boolean;nextCheckpoint:number;surface:string};
export type Clearance = {front:number;left:number;right:number;rear:number};
export type DriverMemory = {escapeTurn?:number;pass?:{target:number;side:number};derby?:DerbyManeuver;target:number;commit:number;stalled:number;reverse:number;escape:number;escapeSteer:number;attempts:number;steer:number;lane:number;phase:string;scan:number;clear:Clearance};
const stop:Input={throttle:0,steer:0,brake:1,handbrake:false};
const route=Array.from({length:128},(_,i)=>trackPoint(i/128));

type Encounter={car:DriverCar;ahead:number;side:number;closing:number;gap:number;projectedSide:number;width:number;time:number};
function oncomingEncounter(car:DriverCar,other:DriverCar):Encounter|null{
  if(other.id===car.id||other.health<=0||car.forward.x*other.forward.x+car.forward.z*other.forward.z>-.5)return null;
  const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
  const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
  if(ahead< -6||ahead>50||Math.abs(side)>8)return null;
  const vx=other.velocity.x-car.velocity.x,vz=other.velocity.z-car.velocity.z;
  const closing=-(vx*car.forward.x+vz*car.forward.z),lateral=vx*car.right.x+vz*car.right.z;
  const self=car.kind?DEFINITIONS[car.kind]:{halfLength:2.5,halfWidth:1},body=other.kind?DEFINITIONS[other.kind]:{halfLength:2.5,halfWidth:1};
  const length=self.halfLength+Math.abs(other.forward.x*car.forward.x+other.forward.z*car.forward.z)*body.halfLength+Math.abs(other.right.x*car.forward.x+other.right.z*car.forward.z)*body.halfWidth+.3;
  const width=self.halfWidth+Math.abs(other.forward.x*car.right.x+other.forward.z*car.right.z)*body.halfLength+Math.abs(other.right.x*car.right.x+other.right.z*car.right.z)*body.halfWidth+.6;
  const gap=ahead-length,time=gap/Math.max(1,closing);
  return{car:other,ahead,side,closing,gap,time,projectedSide:side+lateral*clamp(time,0,2),width};
}


/** Solo driving decisions. Vehicle simulation and the online authority stay separate. */
export class DrivingBrain {
  constructor(private arena:ArenaLayout=LEGACY_ARENA,public difficulty:AIDifficulty='amateur'){}
  readonly memory=new Map<number,DriverMemory>();
  reset(){this.memory.clear();}
  update(car:DriverCar,cars:DriverCar[],mode:Mode,dt:number,probe?:()=>Clearance,checkpoints:readonly {x:number;z:number}[]=CHECKPOINTS):Input {
    if(car.health<=0||(car.finished&&mode!=='race'))return {...stop};
    let m=this.memory.get(car.id);
    if(!m){m={target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:(car.id%3-1)*1.7,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}};this.memory.set(car.id,m);}
    m.commit-=dt;m.scan-=dt;
    if(m.scan<=0){m.clear=probe?.()??m.clear;m.scan=.16+(car.id%3)*.025;}
    const yaw=Math.atan2(car.forward.x,car.forward.z);
    let tx=0,tz=0,desiredSpeed=18;
    if(mode==='derby'){
      return driveDerby(car,cars,m,this.arena,dt,AI_DIFFICULTIES[this.difficulty]);
    }else{
      let prev:{x:number;z:number},next:{x:number;z:number},after:{x:number;z:number};
      if(mode==='race'){
        prev=checkpoints[(car.nextCheckpoint+checkpoints.length-1)%checkpoints.length];next=checkpoints[car.nextCheckpoint];after=checkpoints[(car.nextCheckpoint+1)%checkpoints.length];
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
      desiredSpeed=clamp(24-turn*(near<35?12:5),9,24)*(car.surface==='gravel'?.87:1)*AI_DIFFICULTIES[this.difficulty].racePace;
      m.phase='racing';
    }
    let angle=wrap(Math.atan2(tx-car.current.x,tz-car.current.z)-yaw);
    let steer=clamp(angle*1.75,-1,1);
    desiredSpeed=Math.min(desiredSpeed,clamp(23*AI_DIFFICULTIES[this.difficulty].racePace-Math.abs(angle)*12,4.5,23*AI_DIFFICULTIES[this.difficulty].racePace));
    let avoidance=0,oncomingAvoidance=0;
    const encounters=mode==='race'?cars.map(other=>oncomingEncounter(car,other)).filter((value):value is Encounter=>value!==null):[];
    let target=encounters.find(e=>e.car.id===m.pass?.target&&e.ahead> -5&&Math.abs(e.side)<6);
    // Hold a side through the encounter, but let a clear opponent yield to a new threat.
    if(!target||(Math.abs(target.side)>=target.width+.15&&Math.abs(target.projectedSide)>=target.width+.15))target=encounters.filter(e=>e.ahead>0&&e.closing>2&&e.time<2&&Math.abs(e.projectedSide)<e.width+.15).sort((a,b)=>a.time-b.time||a.car.id-b.car.id)[0]??target;
    if(target){
      if(!m.pass||m.pass.target!==target.car.id){
        // Swapping drivers negates both vectors, preserving the same local passing side.
        const x=car.forward.x-target.car.forward.x,z=car.forward.z-target.car.forward.z;
        const side=((target.car.current.x-car.current.x)*z-(target.car.current.z-car.current.z)*x)/Math.max(.01,Math.hypot(x,z));
        m.pass={target:target.car.id,side:Math.abs(side)>.4?-Math.sign(side):1};
      }
      m.pass.target=target.car.id;
    }else m.pass=undefined;
    for(const other of cars){
      if(other===car)continue;
      const encounter=encounters.find(e=>e.car.id===other.id);
      if(encounter&&(m.pass||encounter.closing>2)&&encounter.ahead> -5){
        if(encounter.ahead>0&&Math.abs(encounter.projectedSide)<encounter.width){
          const range=Math.min(50,6+Math.max(0,encounter.closing)*2);
          const strength=clamp(1-encounter.ahead/range,0,1)*clamp(1-Math.abs(encounter.side)/encounter.width,0,1);
          oncomingAvoidance=Math.max(oncomingAvoidance,strength);
          // Crawling keeps tyre steering effective once both opponents have slowed.
          if(encounter.closing>0&&encounter.time<.7)desiredSpeed=Math.min(desiredSpeed,Math.max(3,encounter.gap/.7));
          m.phase='pass oncoming';
        }
        continue;
      }
      const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
      const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
      if(ahead<0||ahead>5+Math.abs(car.speed)*.8||Math.abs(side)>3.4)continue;
      const strength=(1-ahead/(6+Math.abs(car.speed)*.8))*(1-Math.abs(side)/4);
      avoidance+=(side===0?(car.id%2?1:-1):-Math.sign(side))*strength;
      if(ahead<7&&Math.abs(side)<2)desiredSpeed=Math.min(desiredSpeed,Math.max(3,Math.abs(other.speed)-1));
      m.phase=other.health<=0?'avoid wreck':'overtake';
    }
    avoidance+=(m.pass?.side??1)*oncomingAvoidance;
    steer=clamp(steer+avoidance*1.2,-1,1);
    // Rays ignore cars (handled above), so committing to an attack isn't canceled.
    if(m.clear.front<Math.max(5,Math.abs(car.speed)*.8)){
      const side=m.clear.left>m.clear.right?-1:1;
      steer=clamp(steer+side*.85,-1,1);desiredSpeed=Math.min(desiredSpeed,Math.max(2,m.clear.front*.8));m.phase='avoid barrier';
    }
    // Intentional reverse/escape travel is not a fresh blocked-forward episode.
    const stalled=Math.abs(car.speed)<.9||(m.pass!==undefined&&car.speed<.9&&m.reverse<=0&&m.escape<=0);
    m.stalled=stalled?m.stalled+dt:Math.max(0,m.stalled-dt*2);
    if(m.reverse<=0&&m.escape<=0&&(m.stalled>1.65)){
      m.reverse=1.15+(m.attempts%3)*.35;m.attempts++;m.stalled=0;m.commit=0;
      // When cars overlap, distant scenery must not steer the nose into the other body.
      const contact=encounters.filter(e=>e.ahead>0&&e.gap<1&&Math.abs(e.side)<e.width).sort((a,b)=>Math.hypot(a.ahead,a.side)-Math.hypot(b.ahead,b.side)||a.car.id-b.car.id)[0];
      m.escapeTurn=contact&&m.clear.left>2.2&&m.clear.right>2.2?(Math.abs(contact.side)>.4?Math.sign(contact.side):-(m.pass?.side??1)):undefined;
    }
    if(m.reverse>0){
      m.reverse-=dt;m.phase='reverse escape';
      const direction=m.escapeTurn??(m.clear.left===m.clear.right?(m.attempts%2?1:-1):(m.clear.left>m.clear.right?1:-1));
      if(m.clear.rear<2.2||m.reverse<=0){m.reverse=0;m.escape=.8;m.escapeSteer=-direction*.8;}
      else {m.steer=direction*.8;return {throttle:-.75,steer:m.steer,brake:0,handbrake:false};}
    }
    if(m.escape>0){m.escape-=dt;steer=m.escapeSteer;desiredSpeed=8;m.phase='drive clear';if(m.escape<=0)m.escapeTurn=undefined;}
    m.steer+=clamp(steer-m.steer,-dt*4.5,dt*4.5);
    return {throttle:clamp((desiredSpeed-car.speed)*.4,0,1),steer:m.steer,brake:clamp((car.speed-desiredSpeed)/5,0,1),handbrake:false};
  }
}

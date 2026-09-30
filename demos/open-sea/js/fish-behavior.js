// Local ocean ecology. Fish retain position, direction, energy and food memory;
// no position is evaluated from an orbit or a shared animation clock.
import {mulberry32, clamp} from './math.js';
const norm = v => {const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const dist2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
export class FishBehavior {
  constructor(fish, seed=20260930) {
    this.fish=fish; this.rng=mulberry32(seed); this.lastTime=0; this.anchor=null;
    const r=this.rng;
    for(const f of fish) {
      const spread=f.sp===0?5:f.sp===1?13:22;
      f.p=[(r()-.5)*spread,-3-r()*(f.sp===2?13:7),(r()-.5)*spread];
      f.heading=norm([1,0.08*(r()-.5),0.25*(r()-.5)]);
      f.speed=(f.sp===0?.75:f.sp===1?1.3:2.5)*(0.8+r()*.4);
      f.energy=.55+r()*.4;f.hunger=r();f.state='cruise';f.stateTime=1+r()*7;
      f.phase=r()*Math.PI*2;f.finPhase=r()*Math.PI*2;
      f.target=[...f.p];f.memoryAge=0;f.turnRate=.6+r()*.4;f.cruise=f.speed;
    }
  }
  chooseTarget(f,c) {
    const r=this.rng,range=f.sp===0?8:f.sp===1?18:32;
    f.target=[c[0]+(r()-.5)*range,-2.5-r()*(f.sp===0?7:f.sp===1?11:18),c[2]+(r()-.5)*range];
    f.targetDatum=this.field?.sample(f.target[0],f.target[2]).height||0;f.target[1]+=f.targetDatum;
    f.memoryAge=0;
  }
  advance(dt,t,c) {
    const fs=this.fish,r=this.rng;
    if(this.field)for(const f of fs){
      const field=this.field,flow=field.sample(f.p[0],f.p[2]);
      const previous=f.waterDatum??0;
      // The fluid carries the fish; swimming still has its own upright body
      // wave, effort cycles and gentle steering in this moving habitat.
      f.p[0]+=flow.vx*dt;f.p[2]+=flow.vz*dt;
      f.waterDatum=field.sample(f.p[0],f.p[2]).height;f.p[1]+=f.waterDatum-previous;
      const memoryFlow=field.sample(f.target[0],f.target[2]);
      f.target[0]+=memoryFlow.vx*dt;f.target[2]+=memoryFlow.vz*dt;
      const datum=field.sample(f.target[0],f.target[2]).height;
      f.target[1]+=datum-(f.targetDatum??0);f.targetDatum=datum;
    }
    // Snapshot perception before any fish moves: avoids update-order bias.
    const cells=new Map(),cell=3.5;
    const key=(x,y,z)=>`${x},${y},${z}`;
    for(const f of fs){f.oldP=[...f.p];f.oldH=[...f.heading];const k=key(...f.p.map(v=>Math.floor(v/cell)));if(!cells.has(k))cells.set(k,[]);cells.get(k).push(f);}
    for(const f of fs) {
      f.stateTime-=dt;f.memoryAge+=dt;
      f.hunger=clamp(f.hunger+dt*.013,0,1);
      f.energy=clamp(f.energy+dt*(f.state==='glide'||f.state==='inspect'?.08:-.012-(f.state==='burst'?.07:0)),0,1);
      if(f.stateTime<=0){
        f.state=f.energy<.42?'glide':r()<.12?'inspect':f.hunger>.7&&r()<.6?'burst':r()<.2?'glide':'cruise';
        f.stateTime=f.state==='burst'?.6+r():f.state==='inspect'?.9+r()*1.7:2+r()*5;
        if(f.memoryAge>5||dist2(f.p,f.target)<1)this.chooseTarget(f,c);
      }
      if(f.memoryAge>13||dist2(f.p,c)>70*70)this.chooseTarget(f,c);
      if(dist2(f.p,f.target)<.7&&f.hunger>.4){f.hunger*=.38;f.state='inspect';f.stateTime=.7+r();}
      const steer=norm(f.target.map((x,k)=>x-f.oldP[k]));
      const align=[0,0,0],cohere=[0,0,0],sep=[0,0,0];let count=0;
      const [cx,cy,cz]=f.p.map(v=>Math.floor(v/cell));
      const range=f.sp===0?2.8:4,spacing=f.len*(f.sp===0?2.4:2.0);
      for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const g of cells.get(key(cx+x,cy+y,cz+z))||[]){
        if(g===f||g.sp!==f.sp)continue;
        const d2=dist2(f.oldP,g.oldP);if(d2>range*range)continue;
        count++;
        for(let k=0;k<3;k++){align[k]+=g.oldH[k];cohere[k]+=g.oldP[k]-f.oldP[k];if(d2<spacing*spacing)sep[k]+=(f.oldP[k]-g.oldP[k])/Math.max(d2,.002);}
      }
      if(count&&f.sp<2)for(let k=0;k<3;k++)steer[k]+=align[k]/count*1.8+cohere[k]/count*.32+sep[k]*.9;
      // Individual perception: tuna cause sardines to accelerate away.
      if(f.sp===0)for(const g of fs){if(g.sp!==2)continue;const d2=dist2(f.oldP,g.oldP);if(d2<16){for(let k=0;k<3;k++)steer[k]+=(f.oldP[k]-g.oldP[k])*1.5/(d2+.2);if(f.energy>.4){f.state='burst';f.stateTime=Math.max(f.stateTime,.6);}}}
      // Surface and deep-water avoidance are gentle, with no steep dives.
      const surface=this.field?.sample(f.p[0],f.p[2]).height||0;
      if(f.p[1]>surface-2.0)steer[1]-=(f.p[1]-(surface-2))*2;
      if(f.p[1]<surface-24)steer[1]+=(surface-24-f.p[1]);
      const desired=norm(steer);desired[1]=clamp(desired[1],-.18,.18);
      let yaw=Math.atan2(f.heading[2],f.heading[0]),targetYaw=Math.atan2(desired[2],desired[0]);
      const delta=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw));
      yaw+=clamp(delta,-f.turnRate*dt,f.turnRate*dt);
      const pitch=f.heading[1]+(desired[1]-f.heading[1])*(1-Math.exp(-dt*1.4));
      f.heading=[Math.cos(yaw)*Math.sqrt(1-pitch*pitch),pitch,Math.sin(yaw)*Math.sqrt(1-pitch*pitch)];
      const pace={cruise:1,burst:2.2,glide:.52,inspect:.10}[f.state];
      const targetSpeed=f.cruise*pace*(.88+.12*Math.sin(t*.37+f.seed));
      f.speed+=(targetSpeed-f.speed)*(1-Math.exp(-dt*(f.state==='burst'?4:1.6)));
      for(let k=0;k<3;k++)f.p[k]+=f.heading[k]*f.speed*dt;
      if(this.field){
        const datum=this.field.sample(f.p[0],f.p[2]).height;
        f.p[1]+=datum-f.waterDatum;f.waterDatum=datum;
      }
      const beat=f.state==='glide'?1.2:f.state==='inspect'?1.5:2.8+f.speed/f.len*.52;
      f.phase=(f.phase+dt*beat*Math.PI*2)%(Math.PI*2);
      f.finPhase=(f.finPhase+dt*(1.8+f.r*1.6+f.speed*.45)*Math.PI*2)%(Math.PI*2);
    }
  }
  update(t,c,recenter=false,field=null) {
    this.field=field;
    // Populate the passing habitat while viewed from above. Once submerged,
    // positions stay in world space: swimming and parallax remain continuous.
    if(!this.anchor || (recenter && dist2(this.anchor,c)>12*12)) {
      const old=this.anchor||[0,0,0],dx=c[0]-old[0],dz=c[2]-old[2];
      for(const f of this.fish){f.p[0]+=dx;f.p[2]+=dz;f.target[0]+=dx;f.target[2]+=dz;}
      this.anchor=[...c];
    }
    let remaining=clamp(t-this.lastTime,0,.25);this.lastTime=t;
    while(remaining>1e-7){const dt=Math.min(1/30,remaining);this.advance(dt,t-remaining,c);remaining-=dt;}
  }
}

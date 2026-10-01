// Independent wildlife clocks. A long frame advances a bounded amount of time;
// encounters and spray use analytic ages, never a frame-dependent impulse.
import { clamp, lerp, smoothstep, mulberry32 } from './math.js';
const TAU=Math.PI*2;
export class WildlifeMotion {
  constructor(){
    const rand=mulberry32(71327);this.t=0;this.ready=false;
    this.gulls=Array.from({length:12},(_,i)=>({
      phase:rand()*TAU,rate:3.1+rand()*1.8,cycle:17+rand()*13,
      offset:rand()*24,orbit:rand()*TAU,radius:48+rand()*95,
      altitude:8+rand()*29,speed:.055+rand()*.065,size:.86+rand()*.25,
      x:0,y:0,z:0,yaw:0,bank:0,flap:0,fold:0,index:i,
    }));
    this.whales=[0,1].map(i=>({x:0,z:0,y:0,yaw:0,pitch:0,roll:0,phase:0,
      age:i===0?-8:-31,period:i===0?88:113,surface:0,waterY:0,blow:0,
      ring:0,strength:0,size:i===0?1:.83,anchor:null,events:0,tail:0,phase:rand()*TAU,rate:.62+rand()*.19,impact:18}));
  }
  update(dt,yacht,env){
    dt=clamp(Number.isFinite(dt)?dt:0,0,.1);this.t+=dt;
    const c=Math.cos(yacht.psi),s=Math.sin(yacht.psi),world=(x,z)=>[yacht.x+c*x-s*z,yacht.z+s*x+c*z];
    for(const g of this.gulls){
      const a=g.orbit+this.t*g.speed;
      // Broad elliptical circuits with unequal periods, not a rotating flock.
      let ox=Math.cos(a)*g.radius+Math.sin(a*.67+g.offset)*18;
      let oz=Math.sin(a)*g.radius*.8+Math.cos(a*.81+g.offset)*17;
      const clearance=40*(yacht.profile?.cameraScale||1);
      const clear=Math.max(1,clearance/Math.max(Math.hypot(ox,oz),.01));ox*=clear;oz*=clear;
      const p=world(ox,oz),h=g.altitude+Math.sin(this.t*.17+g.offset)*3.2;
      const vx=-Math.sin(a)*g.radius*g.speed+Math.cos(a*.67+g.offset)*18*g.speed*.67;
      const vz=Math.cos(a)*g.radius*.8*g.speed-Math.sin(a*.81+g.offset)*17*g.speed*.81;
      if(!this.ready){g.x=p[0];g.z=p[1];g.y=h;g.yaw=yacht.psi+Math.atan2(vz,vx);}
      const nx=lerp(g.x,p[0],1-Math.exp(-dt/.35)),nz=lerp(g.z,p[1],1-Math.exp(-dt/.35));
      // Heading follows actual world travel, including the ship's translation
      // and gradual turns, so a gull never slides backwards through the air.
      const targetYaw=Math.hypot(nx-g.x,nz-g.z)>1e-6?Math.atan2(nz-g.z,nx-g.x):g.yaw;
      const d=Math.atan2(Math.sin(targetYaw-g.yaw),Math.cos(targetYaw-g.yaw));
      const k=1-Math.exp(-dt/.22);g.yaw+=d*k;g.bank=lerp(g.bank,clamp(-d*1.4,-.48,.48),1-Math.exp(-dt/.65));
      g.x=nx;g.z=nz;g.y=lerp(g.y,h,1-Math.exp(-dt/.65));
      // Keep flights clear of the masts; the closest circuit remains outside
      // the ship's swept hull/rig envelope even when the vessel turns.
      g.phase=(g.phase+dt*g.rate*TAU)%TAU;
      const f=((this.t+g.offset)%g.cycle)/g.cycle;
      const effort=smoothstep(.03,.12,f)*(1-smoothstep(.35,.46,f));
      g.flap=lerp(-.07,Math.sin(g.phase)*.58,effort);
      g.fold=effort*Math.max(0,Math.sin(g.phase))*.30;
    }
    for(const [i,w] of this.whales.entries()){
      if(!w.anchor){
        const p=world(i===0?-220:88,i===0?245:335);
        w.anchor=p;w.yaw=yacht.psi+(i===0?.28:-.62);
      }
      const oldAge=w.age;w.age+=dt;
      // Place the first encounter after the opening course change has settled,
      // while the animal is still deep. It then swims in fixed world space.
      if(w.events===0&&oldAge<2&&w.age>=2){
        w.anchor=world(i===0?-220:88,i===0?245:335);w.yaw=yacht.psi+(i===0?.28:-.62);
      }
      if(w.age>=w.period){
        w.age%=w.period;w.events++;
        // Only relocate while deeply submerged between encounters.
        const side=i===0?1:-1,p=world(-110+75*Math.sin(w.events*1.7+i),side*(235+45*Math.cos(w.events*.9)));
        w.anchor=p;w.yaw=yacht.psi+side*.3;
      }
      const a=w.age;
      w.x=w.anchor[0]+Math.cos(w.yaw)*a*.7;w.z=w.anchor[1]+Math.sin(w.yaw)*a*.7;
      // A slow back, dorsal fin, then tail flukes. Every third encounter has
      // a restrained half breach rather than endlessly jumping animals.
      const breach=w.events%3===2;
      const rise=smoothstep(2,7,a),fall=smoothstep(breach?12.2:19,breach?16.2:26,a);
      w.surface=rise*(1-fall);w.y=w.waterY+lerp(-28,-1.15,w.surface);
      w.pitch=lerp(.05,-.05,smoothstep(8,14,a));w.roll=.035*Math.sin(a*.22+i);
      if(breach){
        const lift=Math.sin(Math.PI*clamp((a-9)/3.2,0,1));
        w.y+=lift*4.6;w.pitch+=lift*.76;w.roll+=lift*.28;
      }else{
        const dive=smoothstep(14,20,a)*(1-smoothstep(24,28,a));
        w.pitch-=dive*.42;w.y-=dive*.5;
      }
      w.blow=smoothstep(6,6.45,a)*(1-smoothstep(7.2,10.5,a));
      const impact=breach?12.2:18,ringAge=Math.max(0,a-impact);w.impact=impact;
      if(oldAge<impact&&a>=impact)w.ringOrigin=[w.x,w.z];
      w.ring=4+ringAge*1.2;w.strength=a>=impact?(breach?.85:.28)*Math.exp(-ringAge/5.5):0;
      w.phase=(w.phase+dt*w.rate)%TAU;w.tail=.12*Math.sin(w.phase);
      if(oldAge>w.age)w.waterY=0;
    }
    this.ready=true;
  }
  feed(probe){if(probe.fresh)for(let i=0;i<2;i++){const h=probe.get(6+i)[0];if(Number.isFinite(h))this.whales[i].waterY=clamp(h,-14,14);}}
  probePoints(){return this.whales.map(w=>[w.x,w.z]);}
  rings(cam){return new Float32Array(this.whales.flatMap(w=>[(w.ringOrigin?.[0]??w.x)-cam.x,(w.ringOrigin?.[1]??w.z)-cam.z,w.ring,w.strength]));}
  contacts(cam){return new Float32Array(this.whales.flatMap(w=>[w.x-cam.x,w.z-cam.z,w.yaw,w.surface*(1-smoothstep(.5,2.0,w.y-w.waterY))]));}
}

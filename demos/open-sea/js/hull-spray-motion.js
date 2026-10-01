import {SX,SY,SZ,imperial} from './vessels.js';
// Sparse impact droplets, with world-space inertia, air drag and gravity.
// They never inject energy into the ocean/rain ripple solver.
import {hullSection} from './hull-water.js';
export class HullSprayMotion{
 constructor(){this.particles=[];this.carry=Array(8).fill(0);this.previous=Array(8).fill(null);this.seed=28173;this.emitted=0;}
 rand(){this.seed=(Math.imul(this.seed,1664525)+1013904223)|0;return(this.seed>>>0)/4294967296;}
 points(yacht){return [22,18,6,-10].flatMap(q=>[-1,1].map(side=>{const x=q*SX;return yacht.toWorld([x,0,side*hullSection(x,0).width]).filter((_,i)=>i!==1);}));}
 noteProbe(yacht,time){this.snapshot={time,center:[yacht.x,yacht.y,yacht.z],axes:Object.fromEntries(Object.entries(yacht.axes).map(([k,v])=>[k,[...v]]))};}
 feed(probe,yacht,time,field){
  if(!this.snapshot)return;const snap=this.snapshot;
  for(let i=0;i<8;i++){
   const [wx,wz]=probe.points[i+8],wy=probe.get(i+8)[0];
   const d=[wx-snap.center[0],wy-snap.center[1],wz-snap.center[2]],dot=a=>a.reduce((s,v,k)=>s+v*d[k],0);
   const local=[dot(snap.axes.bow),dot(snap.axes.up),dot(snap.axes.sb)],prev=this.previous[i],elapsed=prev?snap.time-prev.time:0;
   this.previous[i]={height:local[1],time:snap.time};
   if(!prev||elapsed<=0||elapsed>.25){this.carry[i]=0;continue;}
   const rise=Math.max(0,Math.min(6,(local[1]-prev.height)/elapsed));
   const bow=Math.max(0,Math.min(1,(local[0]/SX-8)/14)),energy=Math.min(3.5,rise*.65+bow*yacht.speed*yacht.speed*.035);
   if(local[1]<-.65||local[1]>5.5*SY||energy<.18){this.carry[i]=0;continue;}
   this.carry[i]+=Math.min(elapsed,.1)*energy*16;
   const count=Math.min(8,Math.floor(this.carry[i]));this.carry[i]-=count;
   const side=i%2?1:-1,section=hullSection(local[0],local[1]);
   for(let j=0;j<count&&this.particles.length<512;j++){
    const point=yacht.toWorld([local[0]+(this.rand()-.5)*.32,local[1]+.035,side*(section.width+.04)]);
    const outward=.4+energy*(.35+this.rand()*.35),velocity=[yacht.current.vx,0,yacht.current.vz].map((v,k)=>v+yacht.axes.bow[k]*yacht.speed*.8+yacht.axes.sb[k]*side*outward);
    velocity[1]+=1.0+energy*(.7+this.rand()*.45);
    this.particles.push({p:point,v:velocity,age:0,life:.65+this.rand()*.60,size:.010+this.rand()*.025,sea:wy,macro:field.sample(point[0],point[2]).height});this.emitted++;
   }
  }
 }
 update(dt,wind,field){
  dt=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.1));const drag=1.1,e=Math.exp(-drag*dt),integral=(1-e)/drag,terminal=[wind[0]*.16,-9.81/drag,wind[1]*.16];
  for(const p of this.particles){p.age+=dt;for(let k=0;k<3;k++){const v=p.v[k]-terminal[k];p.p[k]+=terminal[k]*dt+v*integral;p.v[k]=terminal[k]+v*e;}}
  this.particles=this.particles.filter(p=>p.age<p.life&&p.p[1]>p.sea-p.macro+field.sample(p.p[0],p.p[2]).height-.65);
 }
}

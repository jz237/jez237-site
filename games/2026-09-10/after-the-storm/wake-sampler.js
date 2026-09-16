import {wakeTrail} from './wake-field.js';
// Broad phase for a batch of exact queries at one time. Each bin retains packet
// order and the original radius/edge tests and arithmetic; no wave is resampled.
export function createWakeSampler(packets=wakeTrail){
 const bins=new Map(),pool=[],rows=packets.map(()=>({})),cell=16;
 function prepare(time,storm=0){
  for(const bin of bins.values()){bin.length=0;pool.push(bin);}bins.clear();
  for(let i=0;i<packets.length;i++){
   const w=packets[i],age=time-w.time;if(w.power<=0||age<0||age>18)continue;
   const r=rows[i]??=( {} ),radius=4+age*.7;
   r.x=w.x;r.z=w.z;r.driftX=.16*storm*age;r.driftZ=.11*storm*age;
   r.radius2=radius**2;r.sin=Math.sin(w.heading);r.cos=Math.cos(w.heading);
   r.edge=.55+age*.65;r.along=4+age*.12;r.denominator=2+age*.3;r.power=w.power;
   const energy=Math.max(0,Math.min(1,(w.power-1.05)/.35));
   r.frequency=3.8-1.4*energy;r.spread=1.1-.4*energy;r.decay=age*(.17-.03*energy);r.amplitude=.12+.2*energy;
   // Padding keeps floating-point rounding at bin boundaries conservative.
   const x=w.x+r.driftX,z=w.z-r.driftZ;
   for(let bz=Math.floor((z-radius-1e-9)/cell);bz<=Math.floor((z+radius+1e-9)/cell);bz++)
    for(let bx=Math.floor((x-radius-1e-9)/cell);bx<=Math.floor((x+radius+1e-9)/cell);bx++){
     const key=bx+','+bz;let bin=bins.get(key);if(!bin){bin=pool.pop()||[];bins.set(key,bin);}bin.push(r);
    }
  }
 }
 function height(x,z){
  let y=0;const bin=bins.get(Math.floor(x/cell)+','+Math.floor(z/cell));if(!bin)return y;
  for(const r of bin){const dx=x-r.x-r.driftX,dz=z-r.z+r.driftZ;if(dx*dx+dz*dz>r.radius2)continue;
   const along=dx*r.sin+dz*r.cos,across=dx*r.cos-dz*r.sin,edge=Math.abs(across)-r.edge;
   if(Math.abs(along)>r.along||Math.abs(edge)>3)continue;
   y+=Math.cos(edge*r.frequency)*Math.exp(-edge*edge*r.spread-along*along/r.denominator-r.decay)*r.power*r.amplitude;
  }return y;
 }
 return {prepare,height};
}

import {disturbLocalWater,sampleLocalWater} from './local-water.js';
// Incident wave motion drives reflected surge at solid boundaries. The local
// solver supplies both visible displacement and hull forces; no feedback gain.
export function obstacleSurge(field,obstacles,time,dt,surface){
 if(!Number.isFinite(field.x)||dt<=0)return;
 field.surgeClock=(field.surgeClock||0)+dt;if(field.surgeClock<.1)return;field.surgeClock%=.1;
 const previous=field.surgeSamples??=new Map();let active=0;
 for(let i=0;i<obstacles.length;i++){
  const o=obstacles[i],cx=field.x+field.size*field.cell/2,cz=field.z+field.size*field.cell/2;
  if(Math.hypot(o.x-cx,o.z-cz)>field.size*field.cell*.38){previous.delete(i);continue;}
  if(active++>=24)break;
  const radius=o.r+.95,x=o.x-radius*.6,z=o.z-radius*.8;
  const incoming=surface(x,z,time)-sampleLocalWater(field,x,z),old=previous.get(i);previous.set(i,incoming);
  if(old===undefined)continue;
  const impulse=Math.max(-.32,Math.min(.32,(incoming-old)*1.2));
  for(const side of [-1,1])disturbLocalWater(field,o.x+radius*(-.6+side*.64),o.z+radius*(-.8-side*.48),impulse,Math.min(1.5,.65+o.r*.16));
 }
}

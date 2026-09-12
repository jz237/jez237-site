// Deterministic habitat placement and local schooling, independent of rendering.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function seededRandom(seed=19){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function habitatSites(course){
 const random=seededRandom([...course.id].reduce((s,c)=>s+c.charCodeAt(0),71)),ground=course.renderGround||course.ground,sites=[];
 for(const gate of course.gates){for(let j=0;j<16;j++){
  const side=j%2?1:-1,d=5+random()*28,x=gate.x+gate.tz*d*side+(random()-.5)*14,z=gate.z-gate.tx*d*side+(random()-.5)*14,y=ground(x,z);
  if(y> -2.7||y< -9||sites.some(p=>Math.hypot(x-p.x,z-p.z)<24))continue;
  if([0,1,2,3,4,5,6,7].some(k=>ground(x+Math.cos(k*Math.PI/4)*6,z+Math.sin(k*Math.PI/4)*6)>-2))continue;
  sites.push({x,y,z});break;
 }if(sites.length>=12)break;}
 return sites;
}
export function createSchool(site,seed,count=18){const random=seededRandom(seed);return Array.from({length:count},(_,i)=>({x:site.x+(random()-.5)*5,y:site.y+1+random(),z:site.z+(random()-.5)*5,heading:random()*6.28,speed:.5+random()*.6,phase:random()*6.28,energy:.5+random()*.5,fear:0,home:site,size:i===0?1.05:.42+random()*.24,pitch:0}));}
export function stepSchool(fish,dt,time,craft,ground,surface){
 dt=Math.min(dt,.05);const before=fish.map(f=>({...f}));
 fish.forEach((f,i)=>{const old=before[i];let ax=0,az=0,cx=0,cz=0,sx=0,sz=0,n=0;
  for(let j=0;j<before.length;j++){if(i===j)continue;const q=before[j],dx=old.x-q.x,dz=old.z-q.z,d=Math.hypot(dx,dz);if(d<7){ax+=Math.sin(q.heading);az+=Math.cos(q.heading);cx+=q.x;cz+=q.z;n++;if(d<1.15){sx+=dx/Math.max(.06,d*d);sz+=dz/Math.max(.06,d*d);}}}
  let vx=(f.home.x-f.x)*.09+sx*1.8,vz=(f.home.z-f.z)*.09+sz*1.8;
  if(n){vx+=ax/n*.8+(cx/n-f.x)*.15;vz+=az/n*.8+(cz/n-f.z)*.15;}
  let danger=0;for(const r of craft){const dx=f.x-r.x,dz=f.z-r.z,d=Math.hypot(dx,dz);if(d<13&&r.speed>2){const threat=(1-d/13)*clamp(r.speed/12,0,1);danger=Math.max(danger,threat);vx+=dx/Math.max(d,1)*threat*9;vz+=dz/Math.max(d,1)*threat*9;}}
  f.fear=Math.max(danger,f.fear-dt*.16);f.energy=clamp(f.energy+dt*(f.speed>1.4?-.04:.022),.1,1);
  const inspect=Math.sin(time*.19+f.phase)>.92&&f.fear<.05;
  vx+=Math.sin(time*.23+f.phase)*.23;vz+=Math.cos(time*.17+f.phase)*.23;
  const target=Math.atan2(vx,vz),delta=Math.atan2(Math.sin(target-f.heading),Math.cos(target-f.heading));
  f.heading+=clamp(delta,-dt*(.65+f.fear*1.8),dt*(.65+f.fear*1.8));
  const burst=Math.max(0,Math.sin(time*.62+f.phase))**6;
  const desired=inspect?.12:.65+f.energy*.35+burst*.7+f.fear*3;
  f.speed+=(desired-f.speed)*(1-Math.exp(-dt*2));
  const nx=f.x+Math.sin(f.heading)*f.speed*dt,nz=f.z+Math.cos(f.heading)*f.speed*dt;
  const bottom=ground(nx,nz),top=surface(nx,nz)-.65;
  if(bottom+.5<top){f.x=nx;f.z=nz;const targetY=clamp(f.home.y+1.45+Math.sin(time*.32+f.phase)*.65-f.fear*.5,bottom+.4,top);const dy=clamp(targetY-f.y,-dt*.55,dt*.55);f.y=clamp(f.y+dy,bottom+.3,top);f.pitch+=(clamp(-dy/Math.max(.01,dt*f.speed),-.18,.18)-f.pitch)*dt*3;}
  else f.heading+=dt*1.5;
 });
}
export function sedimentStrength(r,bottom,sea){const depth=sea-bottom;return depth>.3&&depth<3.8?clamp((r.speed-4)/18+(r.hydro?.impact??0)*.1,0,1)*(1-depth/4)*((r.hydro?.wet??1)>.1?1:0):0;}

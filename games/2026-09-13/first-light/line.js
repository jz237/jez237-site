// The fishing line as a Verlet chain from the rod tip to the lure, metres and seconds. Air nodes
// fall and damp lightly; submerged nodes drag hard and rise or sink with the line type; the lure
// node carries the lure's own buoyancy (float to the surface, sink at its rate, or dive under
// retrieve). Constraints hold each segment at lineOut/(n-1). Tension is the taut-ness of the
// chain: how close the straight tip-to-lure distance comes to the line paid out.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createLine(n=24){const z=()=>new Float32Array(n);return {n,x:z(),y:z(),z:z(),px:z(),py:z(),pz:z(),lineOut:1.2,tension:0,lureDepth:0,lureOnBottom:false,lureSpeed:0};}
export function resetLine(line,x,y,z){for(let i=0;i<line.n;i++){line.x[i]=line.px[i]=x;line.y[i]=line.py[i]=y;line.z[i]=line.pz[i]=z;}line.lineOut=1.2;line.tension=0;}
export function setLure(line,x,y,z){const i=line.n-1;line.x[i]=line.px[i]=x;line.y[i]=line.py[i]=y;line.z[i]=line.pz[i]=z;}
// Lay the chain straight between the tip and the lure (after a cast lands, or to seed a test).
export function layLine(line,tip,lure){const n=line.n;for(let i=0;i<n;i++){const t=i/(n-1);line.x[i]=line.px[i]=tip.x+(lure.x-tip.x)*t;line.y[i]=line.py[i]=tip.y+(lure.y-tip.y)*t;line.z[i]=line.pz[i]=tip.z+(lure.z-tip.z)*t;}line.lineOut=Math.max(line.lineOut,Math.hypot(lure.x-tip.x,lure.y-tip.y,lure.z-tip.z)*1.02);}
export function lurePosition(line){const i=line.n-1;return {x:line.x[i],y:line.y[i],z:line.z[i]};}
export function lureVelocity(line,dt){const i=line.n-1;return {x:(line.x[i]-line.px[i])/dt,y:(line.y[i]-line.py[i])/dt,z:(line.z[i]-line.pz[i])/dt};}
// env: {tip:{x,y,z}, surface(x,z)->y, bed(x,z)->y, lineBuoy (-1..1), lure:{buoyancy,sinkRate,diveDepth,drag}, reeling (0..1), lureForce:{x,y,z}, wind:{x,z}}
export function stepLine(line,dt,env){
 const n=line.n,g=9.81,last=n-1;dt=clamp(dt,.001,.05);
 const surfY=(i)=>env.surface(line.x[i],line.z[i]);
 for(let i=1;i<n;i++){
  const vx=line.x[i]-line.px[i],vy=line.y[i]-line.py[i],vz=line.z[i]-line.pz[i];
  const sy=surfY(i),under=line.y[i]<sy;
  let ax=0,ay=-g,az=0,damp;
  if(i===last){
   const L=env.lure;
   if(under){
    damp=Math.exp(-dt*(4+L.drag*3));
    const depth=sy-line.y[i];
    if(L.buoyancy==='float'){ay=depth>.015?18+depth*30:0;}
    else if(L.buoyancy==='sink'){ay=-g*.35;}
    else if(L.buoyancy==='crank'){const target=env.diveTarget||0;ay=Math.max(-25,Math.min(25,-10*(target-depth)));}
    else ay=0;
   }else{damp=Math.exp(-dt*.4);ay=-g;if(env.wind){ax+=env.wind.x*.6;az+=env.wind.z*.6;}}
   if(env.lureForce){ax+=env.lureForce.x||0;az+=env.lureForce.z||0;if(under&&L.buoyancy==='sink')ay+=env.lureForce.y||0;}
  }else{
   if(under){damp=Math.exp(-dt*6);ay=-g*.08+(env.lineBuoy||0)*1.6;}else{damp=Math.exp(-dt*.9);ay=-g*.6;}
  }
  line.px[i]=line.x[i];line.py[i]=line.y[i];line.pz[i]=line.z[i];
  line.x[i]+=vx*damp+ax*dt*dt;line.y[i]+=vy*damp+ay*dt*dt;line.z[i]+=vz*damp+az*dt*dt;
  // a sinking lure falls no faster than its sink rate through the water
  if(i===last&&under&&env.lure.buoyancy==='sink'){const vyNow=(line.y[i]-line.py[i])/dt;if(vyNow<-env.lure.sinkRate)line.y[i]=line.py[i]-env.lure.sinkRate*dt;}
  // a float holds the bait at its set depth: the bait node cannot hang deeper than the float allows
  if(i===last&&env.lure.floatDepth){const top=env.surface(line.x[i],line.z[i])-env.lure.floatDepth;if(line.y[i]<top)line.y[i]=top;}
 }
 // pin the first node to the rod tip
 line.x[0]=env.tip.x;line.y[0]=env.tip.y;line.z[0]=env.tip.z;
 const seg=Math.max(.02,line.lineOut/(n-1));
 for(let iter=0;iter<6;iter++){
  for(let i=0;i<n-1;i++){
   const j=i+1;let dx=line.x[j]-line.x[i],dy=line.y[j]-line.y[i],dz=line.z[j]-line.z[i];const d=Math.hypot(dx,dy,dz)||1e-6;
   if(d<=seg)continue; // slack line does not push
   const diff=(d-seg)/d;const wi=i===0?0:(i===last?.15:.5),wj=j===last?.85:(i===0?1:.5);
   const sx=dx*diff,sy=dy*diff,sz=dz*diff;
   line.x[i]+=sx*wi;line.y[i]+=sy*wi;line.z[i]+=sz*wi;line.x[j]-=sx*wj;line.y[j]-=sy*wj;line.z[j]-=sz*wj;
  }
  for(let i=1;i<n;i++){const bed=env.bed(line.x[i],line.z[i])+.04;if(line.y[i]<bed){line.y[i]=bed;if(i===last)line.lureOnBottom=true;}else if(i===last)line.lureOnBottom=false;}
 }
 const dx=line.x[last]-line.x[0],dy=line.y[last]-line.y[0],dz=line.z[last]-line.z[0];const straight=Math.hypot(dx,dy,dz);
 line.tension=clamp((straight/Math.max(.1,line.lineOut)-.9)/.1,0,1);
 line.lureDepth=Math.max(0,surfY(last)-line.y[last]);
 const v=lureVelocity(line,dt);line.lureSpeed=Math.hypot(v.x,v.y,v.z);
 return line;
}

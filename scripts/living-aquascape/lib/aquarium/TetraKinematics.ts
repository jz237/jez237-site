export type FinKind='body'|'tail'|'dorsal'|'anal'|'pectoral';
export function swimPhase(previous:number,dt:number,activity:number){
 return previous+Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0))*(7+Math.max(0,Math.min(1.5,activity))*7);
}
export function bendTetra(x:number,y:number,z:number,phase:number,activity:number,kind:FinKind,side:number=1):[number,number,number]{
 const effort=Math.max(0,Math.min(1.5,activity));
 const bodyBend=(px:number)=>Math.sin(phase-px*5)*Math.pow(Math.max(0,(.32-px)/.82),2)*(.055+effort*.035);
 if(kind==='tail'){
  const pivot=-.30,dx=x-pivot,angle=Math.sin(phase+1.5)*(.38+effort*.24);
  return [pivot+dx*Math.cos(angle),y+Math.sin(phase+.6)*Math.abs(dx)*.05,z-dx*Math.sin(angle)+bodyBend(pivot)];
 }
 if(kind==='pectoral'){
  // Each fin fans about its own shoulder instead of following the tail wave.
  const px=.25,py=-.055,pz=side*.049,dx=x-px,dy=y-py,dz=z-pz;
  const beat=phase*1.65+side*.7,sweep=Math.sin(beat)*.65,fan=(.45+Math.sin(beat-.5)*.40)*side;
  const sx=dx*Math.cos(sweep)-dy*Math.sin(sweep),sy=dx*Math.sin(sweep)+dy*Math.cos(sweep);
  return [px+sx,py+sy*Math.cos(fan)-dz*Math.sin(fan),pz+sy*Math.sin(fan)+dz*Math.cos(fan)+bodyBend(x)];
 }
 let flex=0;
 if(kind==='dorsal')flex=Math.max(0,y-.07);
 if(kind==='anal')flex=Math.max(0,-y-.12);
 return [x+Math.sin(phase*.7+x*11)*flex*.10,y+Math.sin(phase*.85+x*8)*flex*.08,z+bodyBend(x)+Math.sin(phase*.9+x*13)*flex*.38];
}

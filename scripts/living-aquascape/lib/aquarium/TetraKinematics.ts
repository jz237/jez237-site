export type FinKind='body'|'tail'|'dorsal'|'anal'|'pectoral';
export function swimPhase(previous:number,dt:number,activity:number){
 return previous+Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0))*(.8+Math.max(0,Math.min(1.5,activity))*11);
}
/** A head-anchored travelling wave with a smoothly increasing posterior envelope. */
export function tetraSpine(x:number,phase:number,activity:number){
 const effort=Math.max(0,Math.min(1.5,activity));
 const u=Math.max(0,Math.min(1.3,(.33-x)/.65));
 const amplitude=.002+effort*.155,travel=phase-u*3.3;
 const envelope=Math.pow(u,1.4);
 const z=amplitude*envelope*Math.sin(travel);
 const slope=u>0?-amplitude/.65*(1.4*Math.pow(u,.4)*Math.sin(travel)-3.3*envelope*Math.cos(travel)):0;
 return {x,z,angle:Math.atan(slope)};
}
function alongSpine(x:number,y:number,z:number,phase:number,effort:number):[number,number,number]{
 const spine=tetraSpine(x,phase,effort);
 // Rotate each section with the local spine tangent, preserving its thickness.
 return [spine.x-z*Math.sin(spine.angle),y,spine.z+z*Math.cos(spine.angle)];
}
export function bendTetra(x:number,y:number,z:number,phase:number,activity:number,kind:FinKind,side:number=1,pectoralPhase=phase*1.65,pectoralEffort=1):[number,number,number]{
 const effort=Math.max(0,Math.min(1.5,activity));
 if(kind==='tail'){
  const pivot=-.30,dx=x-pivot,root=tetraSpine(pivot,phase,effort);
  const angle=root.angle+Math.sin(phase-3.7)*(.025+effort*.22);
  return [root.x+dx*Math.cos(angle)-z*Math.sin(angle),y,root.z+dx*Math.sin(angle)+z*Math.cos(angle)];
 }
 if(kind==='pectoral'){
  const px=.25,py=-.055,pz=side*.049,dx=x-px,dy=y-py,dz=z-pz;
  const beat=pectoralPhase+side*.7,fanStrength=.35+pectoralEffort*.65,sweep=Math.sin(beat)*.65*fanStrength,fan=(.45+Math.sin(beat-.5)*.40)*side*fanStrength;
  const sx=dx*Math.cos(sweep)-dy*Math.sin(sweep),sy=dx*Math.sin(sweep)+dy*Math.cos(sweep);
  return alongSpine(px+sx,py+sy*Math.cos(fan)-dz*Math.sin(fan),pz+sy*Math.sin(fan)+dz*Math.cos(fan),phase,effort);
 }
 let flex=0;
 if(kind==='dorsal')flex=Math.max(0,y-.07);
 if(kind==='anal')flex=Math.max(0,-y-.12);
 return alongSpine(x+Math.sin(phase*.7+x*11)*flex*.10,y+Math.sin(phase*.85+x*8)*flex*.08,z+Math.sin(phase*.9+x*13)*flex*.38,phase,effort);
}

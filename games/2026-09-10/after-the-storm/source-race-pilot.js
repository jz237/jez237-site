// Helm-only guidance along authored source-geometry corridors. Checkpoints,
// misses, collisions and laps remain exclusively in the race simulation.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function sourceRaceInput(state,r){
 const profile=state.course.navigation?.controlBySeaState?.[state.seaState]??{},straightSpeed=profile.straightSpeed??20,gateSpeed=profile.gateSpeed??12;
 const anchors=state.course.anchors,v=r.sourceRaceDriver??={index:0,lap:1,start:[r.x,r.z]};
 const roles=state.course.pilotAnchorsByClass?.[state.course.difficulty];
 let q=anchors[v.index],previous=v.index?anchors[v.index-1]:v.lap===1?v.start:anchors.at(-1);
 const advance=()=>{
  const dx=q[0]-previous[0],dz=q[1]-previous[1],length=Math.hypot(dx,dz)||1;
  const along=((r.x-q[0])*dx+(r.z-q[1])*dz)/length,cross=((r.x-q[0])*dz-(r.z-q[1])*dx)/length;
  // Returning to a slightly overshot regular bend creates a loop toward the
  // adjoining shallows. Gate corridors keep their tighter capture allowance.
  return Math.hypot(r.x-q[0],r.z-q[1])<1.2||along>0&&Math.abs(cross)<(roles?.[v.index]?1.7:4);
 };
 for(let i=0;i<6&&advance();i++){
  previous=q;v.index++;if(v.index===anchors.length){v.index=0;v.lap++;}q=anchors[v.index];
 }
 const next=anchors[(v.index+1)%anchors.length],dx=q[0]-previous[0],dz=q[1]-previous[1],length=Math.hypot(dx,dz)||1,ux=dx/length,uz=dz/length;
 const along=(r.x-previous[0])*ux+(r.z-previous[1])*uz,cross=(r.x-previous[0])*uz-(r.z-previous[1])*ux,lateral=r.vx*uz-r.vz*ux;
 const nx=next[0]-q[0],nz=next[1]-q[1],nl=Math.hypot(nx,nz)||1,remaining=length-along;
 const gateAnchor=roles?.[v.index];
 const bend=Math.abs(angle(Math.atan2(nx,nz)-Math.atan2(dx,dz))),blend=gateAnchor?0:clamp(1-remaining/3,0,1);
 const forward=Math.max(7,r.speed),correction=clamp(-cross*2.5-lateral*1.2,-forward*.8,forward*.8);
 let heading=Math.atan2((ux*(1-blend)+nx/nl*blend)*forward+uz*correction,(uz*(1-blend)+nz/nl*blend)*forward-ux*correction);
 const recovering=remaining< -1.5&&Math.abs(cross)>(gateAnchor?1.7:4);
 if(recovering)heading=Math.atan2(q[0]-r.x-r.vx*.12,q[1]-r.z-r.vz*.12);
 const error=angle(heading-r.heading),corner=remaining<Math.max(10,r.speed*.7)?bend:0;
 let desired=recovering?7:Math.min(gateAnchor?gateSpeed:straightSpeed,clamp(straightSpeed/(1+corner*1.7),7,straightSpeed));
 // At low tide the narrow buoy corridor can sit over the fixed reef. Settle
 // into it before intermittent floor contact removes lateral water grip.
 let shallowGate=false;
 if(gateAnchor&&remaining<15&&state.course.sourceFloor){
  const floor=state.course.sourceFloor(q[0],q[1]);
  if(Number.isFinite(floor)&&state.weather.seaLevel-floor<1.5){desired=Math.min(desired,7);shallowGate=true;}
 }
 return {throttle:clamp(.53+(desired-r.speed)*.16,0,1),steer:clamp(error*4.5-(r.yawVelocity||0)*.7,-1,1),brake:Math.abs(error)>1.1||r.speed>desired+1.5,lean:shallowGate&&Math.abs(error)>.12?-.7:0,dampen:true};
}

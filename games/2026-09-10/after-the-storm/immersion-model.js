const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function spatialEngine(listener,racer){
 const dx=racer.x-listener.x,dz=racer.z-listener.z,d=Math.hypot(dx,dz),nx=dx/Math.max(1,d),nz=dz/Math.max(1,d);
 const radial=((racer.vx||0)-(listener.vx||0))*nx+((racer.vz||0)-(listener.vz||0))*nz;
 return {distance:d,pan:clamp((dx*Math.cos(listener.heading)-dz*Math.sin(listener.heading))/Math.max(5,d),-1,1),gain:1/(1+(d/13)**2),doppler:clamp(343/(343+radial),.85,1.18),cutoff:1800+11000*Math.exp(-d/65)};
}
export function helmCorrection(turn,rollRate,speed,wet){return clamp(-rollRate*.018,-.035,.035)*clamp(speed/14)*wet*(1-Math.abs(turn)*.6);}
export function crestEmission(center,forward,back,left,right,dt){const curvature=Math.max(center*2-forward-back,center*2-left-right),slope=Math.hypot((forward-back)*.5,(right-left)*.5);return clamp((curvature-.02)*4)*clamp((center-.22)*1.3)*clamp((slope-.08)*3.5)*Math.max(0,dt);}

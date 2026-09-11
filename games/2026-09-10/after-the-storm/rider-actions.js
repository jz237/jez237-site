const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// The original quick turn combines steering with a rearward weight shift.
// It redirects existing momentum through hull grip; it never rotates velocity instantly.
export function quickTurn(input,speed,wet){return clamp(-(input.lean||0),0,1)*clamp(Math.abs(input.steer||0)*1.5,0,1)*clamp((speed-2)/5,0,1)*clamp(wet,0,1);}
export function rocketStart(r,throttle,time){
 const down=throttle>.5,edge=down&&!r.startThrottle;r.startThrottle=down;
 if(edge&&time>=-.12&&time<=.18&&!r.rocketStarted){r.rocketStarted=true;r.power=5;return true;}return false;
}
export function beginWipeout(r,time,impact=12){
 if(r.wipeout||time<(r.remountProtectedUntil||0))return false;
 const side=Math.sign(r.turn||r.hydro.roll||1);
 r.wipeout={elapsed:0,duration:2.6,side,impact:Math.min(24,impact),x:r.x,z:r.z,heading:r.heading,throttle:false};
 r.recover=2.6;r.stunt.trick=null;r.stunt.pose=null;r.wipeoutId=(r.wipeoutId||0)+1;return true;
}
export function stepWipeout(r,input,dt,time){
 const w=r.wipeout;if(!w)return false;
 const down=(input.throttle||0)>.5;if(down&&!w.throttle&&w.elapsed>.35)w.duration=Math.min(w.duration,Math.max(w.elapsed+.35,w.duration-.2));w.throttle=down;w.elapsed+=dt;
 r.recover=Math.max(0,w.duration-w.elapsed);
 if(w.elapsed>=w.duration){r.wipeout=null;r.remountProtectedUntil=time+1;r.recover=0;return true;}return false;
}
// Rider motion is relative to the hull, with continuous ejection, float and remount phases.
export function wipeoutPose(w){if(!w)return {x:0,y:0,z:0,roll:0,pitch:0};
 const t=w.elapsed,remount=clamp((t-(w.duration-.65))/.65,0,1),blend=1-remount*remount*(3-2*remount),eject=1-Math.exp(-t*9);
 return {x:w.side*1.65*eject*blend,y:(Math.sin(Math.min(1,t/.65)*Math.PI)*.65-.78*eject)*blend,z:-.65*eject*blend,roll:-w.side*.95*eject*blend,pitch:-.2*eject*blend};
}
export function collideRiders(a,b){
 const dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz);if(d>=1.8||Math.abs(a.hydro.y-b.hydro.y)>=.8)return 0;
 const nx=d>.001?dx/d:Math.cos(a.heading),nz=d>.001?dz/d:-Math.sin(a.heading),push=(1.8-d)*.5;
 a.x+=nx*push;a.z+=nz*push;b.x-=nx*push;b.z-=nz*push;
 const closing=(a.vx-b.vx)*nx+(a.vz-b.vz)*nz;if(closing>=0)return 0;
 const massA=240+a.stats.stability*22,massB=240+b.stats.stability*22,impulse=-(1.18*closing)/(1/massA+1/massB);
 a.vx+=impulse*nx/massA;a.vz+=impulse*nz/massA;b.vx-=impulse*nx/massB;b.vz-=impulse*nz/massB;
 a.speed=Math.hypot(a.vx,a.vz);b.speed=Math.hypot(b.vx,b.vz);return -closing;
}

// An idealised, finite-core draining vortex. SI units throughout. The free
// surface follows centrifugal pressure balance, dh/dr = v_thetaÂ²/(g*r).
// This is a reduced fluid model, not a Navierâ€“Stokes solver for a whole sea.
const G=9.81,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const VORTEX_CORE=62,VORTEX_DEPTH=150,VORTEX_PATCH=620;
const taper=r=>{const t=clamp((r-520)/480,0,1);return [1-t*t*(3-2*t),t>0&&t<1?-6*t*(1-t)/480:0];};

export class Whirlpool {
  constructor(){this.enabled=false;this.amount=0;this.x=0;this.z=0;this.time=0;this.core=VORTEX_CORE;this.depth=VORTEX_DEPTH;this.circulation=Math.sqrt(2*G*this.depth)*this.core;this.inflow=12;}
  setEnabled(on,yacht){
    on=!!on;
    if(on&&!this.enabled&&this.amount<.01){
      const c=Math.cos(yacht.psi),s=Math.sin(yacht.psi);
      this.x=yacht.x+c*120-s*180;this.z=yacht.z+s*120+c*180;
      this.time=0;
    }
    this.enabled=on;
  }
  update(dt){
    dt=clamp(Number.isFinite(dt)?dt:0,0,.1);const old=this.amount;
    // Rate-limited formation and collapse: no instantaneous water-level jump.
    this.amount=clamp(this.amount+(this.enabled?dt/12:-dt/14),0,1);
    // Integrate circulation through formation/collapse. Multiplying a new
    // strength by total age would whip old foam backwards on switch-off.
    this.time+=dt*(old+this.amount)*.5;
  }
  sample(x,z){
    if(this.amount===0)return {height:0,sx:0,sz:0,vx:0,vz:0,influence:0};
    const qx=x-this.x,qz=z-this.z,r=Math.hypot(qx,qz),a2=this.core*this.core,d=r*r+a2;
    const [f,df]=taper(r),s=this.amount;
    if(f===0)return {height:0,sx:0,sz:0,vx:0,vz:0,influence:0};
    const base=-this.depth*a2*s*s/d;
    const height=base*f,dh=-2*r/d*base*f+base*df;
    const k=f*s/d,radial=2*this.core*this.inflow;
    return {height,sx:dh*qx/Math.max(r,.001),sz:dh*qz/Math.max(r,.001),
      vx:(-this.circulation*qz-radial*qx)*k,vz:(this.circulation*qx-radial*qz)*k,
      influence:s*f*clamp(3*this.core/Math.max(r,this.core),0,1)};
  }
  bind(p,cam){p.v4('uWhirlpool',this.x-cam.x,this.z-cam.z,this.core,this.amount).v4('uVortex',this.depth,this.circulation,this.inflow,this.time);}
}

// Distributed hydrodynamic drag at the centre, bow, stern and both quarters.
// Translation and yaw retain momentum after the vortex is switched off. The
// sailing polar already accounts for through-water drag; these forces act on
// velocity relative to that existing sailing solution.
export class HullCurrent {
  constructor(){this.vx=0;this.vz=0;this.omega=0;this.heel=0;this.acceleration=0;}
  step(dt,boat,field){
    const P=boat.profile||{mass:320000,hullLength:47,beam:9.3,scale:[1,1,1]},mass=P.mass,inertia=mass*(P.hullLength**2+(.88*P.beam)**2)/12;
    const [sx,sy,sz]=P.scale,dragScale=P.hullLength/47*sy;
    const c=Math.cos(boat.psi),s=Math.sin(boat.psi);
    let fx=0,fz=0,torque=0,lateral=0;
    for(const [lx,lz] of [[0,0],[18.8,0],[-18.8,0],[0,4.1],[0,-4.1]]){
      const rx=c*lx*sx-s*lz*sz,rz=s*lx*sx+c*lz*sz;
      const u=field.sample(boat.x+rx,boat.z+rz);
      const dx=u.vx-this.vx+this.omega*rz,dz=u.vz-this.vz-this.omega*rx;
      const along=dx*c+dz*s,across=-dx*s+dz*c;
      const fa=dragScale*(600+210*Math.abs(along))*along,fs=dragScale*(1800+1300*Math.abs(across))*across;
      const x=c*fa-s*fs,z=s*fa+c*fs;
      fx+=x;fz+=z;torque+=rx*z-rz*x;lateral+=fs;
    }
    // Gravity projected onto the constrained sloping surface supplies inward
    // acceleration even when the hull has caught up with the moving fluid.
    // Omitting it produces an artificial outer orbit instead of descent.
    const surface=field.sample(boat.x,boat.z),metric=1+surface.sx*surface.sx+surface.sz*surface.sz;
    fx-=mass*G*surface.sx/metric;fz-=mass*G*surface.sz/metric;
    this.vx+=fx/mass*dt;this.vz+=fz/mass*dt;
    this.omega+=torque/inertia*dt;
    this.acceleration=Math.hypot(fx,fz)/mass;
    // Righting moment of a ballasted hull opposes current-induced heel.
    const target=clamp(-Math.atan2(lateral/mass*2.8,G)*.72,-.32,.32);
    this.heel+=(target-this.heel)*(1-Math.exp(-dt/2));
  }
}

export const WHIRLPOOL_GLSL=`
uniform vec4 uWhirlpool; // camera-relative x/z, finite core radius, formation
uniform vec4 uVortex;    // depth, circulation, peak radial inflow, time
vec2 whirlTaper(float r){
  float t=clamp((r-520.0)/480.0,0.0,1.0);
  return vec2(1.0-t*t*(3.0-2.0*t),t>0.0&&t<1.0?-6.0*t*(1.0-t)/480.0:0.0);
}
vec3 whirlSurface(vec2 rel){
  if(uWhirlpool.w<=0.0)return vec3(0.0);
  vec2 q=rel-uWhirlpool.xy;float r=length(q),a2=uWhirlpool.z*uWhirlpool.z,d=r*r+a2;
  vec2 f=whirlTaper(r);float h=-uVortex.x*a2*uWhirlpool.w*uWhirlpool.w/d;
  float dh=-2.0*r/d*h*f.x+h*f.y;
  return vec3(h*f.x,q/max(r,.001)*dh);
}
vec2 whirlFlow(vec2 rel){
  if(uWhirlpool.w<=0.0)return vec2(0.0);
  vec2 q=rel-uWhirlpool.xy;float d=dot(q,q)+uWhirlpool.z*uWhirlpool.z;
  return (uVortex.y*vec2(-q.y,q.x)-2.0*uWhirlpool.z*uVortex.z*q)*whirlTaper(length(q)).x*uWhirlpool.w/d;
}
`;

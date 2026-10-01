// Linear restoring coefficients come from waterplane geometry and displacement.
// Added mass and damping are estimates. See MIT 2.019 Hydrostatics lecture:
// https://ocw.mit.edu/courses/2-019-design-of-ocean-systems-spring-2011/f0cc4e483a7d4b78760f9b0908f51c44_MIT2_019S11_HydStr1.pdf
import {canonicalBeam,canonicalSheer} from './vessels.js';
const RHO=1025,G=9.81;
// A centred weighted plane separates vertical tide/heave from wave slopes.
export function fitWavePlane(stations,heights,widthAt){
  let w=0,sx=0,sz=0,sh=0;const weights=stations.map(([x])=>Math.max(.001,widthAt(x)));
  stations.forEach(([x,z],i)=>{const a=weights[i];w+=a;sx+=a*x;sz+=a*z;sh+=a*heights[i];});
  const cx=sx/w,cz=sz/w,mean=sh/w;let xx=0,zz=0,xz=0,xh=0,zh=0;
  stations.forEach(([x,z],i)=>{const a=weights[i];x-=cx;z-=cz;const h=heights[i]-mean;xx+=a*x*x;zz+=a*z*z;xz+=a*x*z;xh+=a*x*h;zh+=a*z*h;});
  const det=xx*zz-xz*xz;
  return{mean,pitchSlope:Math.abs(det)>1e-12?(xh*zz-zh*xz)/det:0,rollSlope:Math.abs(det)>1e-12?(zh*xx-xh*xz)/det:0};
}
export class Spring{
  constructor(w,z){this.w=w;this.z=z;this.x=0;this.v=0;}
  step(target,dt){const a=-this.w*this.w*(this.x-target)-2*this.z*this.w*this.v;this.v+=a*dt;this.x+=this.v*dt;return this.x;}
}
export function shipHydrostatics(profile,actual){
  const [sx,sy,sz]=profile.scale,dx=47*sx/160;
  const section=(x,y)=>{const b=-3.15*sy*Math.sqrt(Math.max(.05,1-(x/(25.5*sx))**2)),top=canonicalSheer(x/sx)*sy,c=Math.max(0,Math.min(1,1-(y-b)/(top-b)));return canonicalBeam(x/sx)*sz*Math.pow(Math.sqrt(Math.max(0,1-c*c)),.78);};
  const volume=water=>{
    if(actual?.volumeCurve){const curve=actual.volumeCurve;let i=0;while(i<curve.length-2&&curve[i+1][0]<water)i++;const[a,b]=[curve[i],curve[i+1]],t=Math.max(0,Math.min(1,(water-a[0])/(b[0]-a[0])));return a[1]+t*(b[1]-a[1]);}
    let sum=0;for(let i=0;i<160;i++){const x=(-23.5+(i+.5)*47/160)*sx,b=-3.15*sy*Math.sqrt(Math.max(.05,1-(x/(25.5*sx))**2)),dz=(water-b)/48;if(dz<=0)continue;for(let j=0;j<48;j++)sum+=2*section(x,b+(j+.5)*dz)*dx*dz;}return sum;
  };
  let lo=-3*sy,hi=2*sy;for(let i=0;i<32;i++){const m=(lo+hi)/2;if(RHO*volume(m)<profile.mass)lo=m;else hi=m;}const water=(lo+hi)/2;
  let area=0,ix=0;for(let i=0;i<160;i++){const x=(-23.5+(i+.5)*47/160)*sx,w=2*section(x,water);area+=w*dx;ix+=w*dx*x*x;}
  const added=.4*profile.beam/Math.max(profile.draft,.5);
  const pitchInertia=profile.mass*(profile.hullLength**2+profile.draft**2)/12;
  const rollInertia=profile.mass*(.38*profile.beam)**2;
  return{mass:profile.mass,displacedVolume:volume(water),trim:-water,area,heave:Math.sqrt(RHO*G*area/(profile.mass*(1+added))),pitch:Math.sqrt(RHO*G*ix/(pitchInertia*(1+added*1.6))),roll:Math.sqrt(profile.mass*G*profile.gm/(rollInertia*1.3)),pitchInertia,rollInertia,addedMass:profile.mass*added};
}

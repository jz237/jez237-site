import {landingPlume} from './landing-response.js';
import {carveLoad} from './contact-cues.js';
// World-space launch conditions. Water shed by the chine retains part of the
// hull's momentum; the nozzle stream travels aft relative to the moving ski.
export function sprayLaunch(r,kind,side,random=Math.random){
 const h=r.hydro,fx=Math.sin(r.heading),fz=Math.cos(r.heading),rx=fz,rz=-fx;
 const speed=Math.hypot(r.vx,r.vz),power=Math.min(1,speed/18),slip=r.vx*rx+r.vz*rz;
 const jet=kind==='jet',impact=kind==='impact'||kind==='landingMist',mist=kind==='mist'||kind==='landingMist';
 const plume=landingPlume(h);
 const atomize=mist?.15+random()*.35:0;
 const contact=side>0?(h.starboardWet??h.wet):(h.portWet??h.wet);
 const catchSpray=Math.min(1,r.gripCatch||0)*Math.max(0,Math.sign(slip)*side);
 const carve=carveLoad(r,side);
 const out=impact?(plume.lateral*(.4+random()*.6)):(.8+power*5.8+Math.max(0,slip*side)*.65+catchSpray*3)*contact+carve*4.2;
 const back=jet?5+Math.sqrt(Math.max(0,r.throttle))*15+(h.reengagement||0)*6:impact?-plume.forward:1.8;
 const carry=jet?1:impact?plume.carry:.48+carve*.14;
 const aft=jet?-1.85:impact?(plume.style==='bow-first'?1.2:plume.style==='stern-first'?-1.2:0):1.0-random()*1.6;
 return {x:r.x+fx*aft+rx*(jet?0:side*.61),y:h.y-(h.pitch||0)*aft+(h.roll||0)*(jet?0:side*.61)+(jet?-.10:.035),z:r.z+fz*aft+rz*(jet?0:side*.61),
  vx:r.vx*carry-fx*back+rx*side*(jet?random()*.45:out),
  vy:(jet?1.6+power*2.8:impact?.7+random()*h.impact*.55*plume.rise:.7+power*2.0+carve*1.5+Math.max(0,h.waterVelocity)*.12)+Math.max(0,h.vy-(h.pitchVelocity||0)*aft+(h.rollVelocity||0)*(jet?0:side*.61))*.25,
  vz:r.vz*carry-fz*back+rz*side*(jet?random()*.45:out),
  size:mist?.08+random()*.13:jet?.04+random()*.07:impact?.045+random()*.13:.035+random()*.09,atomize,life:mist?2.0+random()*1.2:impact?plume.life*(.7+random()*.6):.45+random()*.6,mist};
}

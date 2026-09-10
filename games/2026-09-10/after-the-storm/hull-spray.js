// World-space launch conditions. Water shed by the chine retains part of the
// hull's momentum; the nozzle stream travels aft relative to the moving ski.
export function sprayLaunch(r,kind,side,random=Math.random){
 const h=r.hydro,fx=Math.sin(r.heading),fz=Math.cos(r.heading),rx=fz,rz=-fx;
 const speed=Math.hypot(r.vx,r.vz),power=Math.min(1,speed/18),slip=r.vx*rx+r.vz*rz;
 const jet=kind==='jet',impact=kind==='impact';
 const contact=side>0?(h.starboardWet??h.wet):(h.portWet??h.wet);
 const out=impact?(1+random()*h.impact*.7):(.5+power*2.7+Math.max(0,slip*side)*.35)*contact;
 const back=jet?5+Math.sqrt(Math.max(0,r.throttle))*15:impact?1:1.8;
 const carry=jet?1:impact?.28:.48;
 const aft=jet?-1.85:impact?.7:1.0-random()*1.6;
 return {x:r.x+fx*aft+rx*(jet?0:side*.61),y:h.y+.035,z:r.z+fz*aft+rz*(jet?0:side*.61),
  vx:r.vx*carry-fx*back+rx*side*(jet?random()*.45:out),
  vy:(jet?1.3+power*1.9:impact?.7+random()*h.impact*.55:.45+power*.9+Math.max(0,h.waterVelocity)*.12)+Math.max(0,h.vy)*.25,
  vz:r.vz*carry-fz*back+rz*side*(jet?random()*.45:out),
  size:jet?.025+random()*.045:.02+random()*.07,life:.45+random()*.6};
}

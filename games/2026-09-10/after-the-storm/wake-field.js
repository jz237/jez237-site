export const WAKE_COUNT=64;
export const wakeTrail=Array.from({length:WAKE_COUNT},()=>({x:10000,z:10000,time:-100,heading:0,power:0}));let cursor=0;
export function clearWakeTrail(){cursor=0;for(const w of wakeTrail){w.power=0;w.time=-100;w.owner=null;}}
export function recordWake(x,z,time,heading,power,owner=null){Object.assign(wakeTrail[cursor++%WAKE_COUNT],{x,z,time,heading,power,owner});}
// World-space wake packets persist after the source moves away. Foam and wave
// displacement use the same spreading speed, drift, orientation and decay.
export function wakeHeight(x,z,time,storm=0){let y=0;for(const w of wakeTrail){const age=time-w.time;if(w.power<=0||age<0||age>18)continue;const dx=x-w.x-.16*storm*age,dz=z-w.z+.11*storm*age;if(dx*dx+dz*dz>(4+age*.7)**2)continue;
 const along=dx*Math.sin(w.heading)+dz*Math.cos(w.heading),across=dx*Math.cos(w.heading)-dz*Math.sin(w.heading),edge=Math.abs(across)-(.55+age*.65);
 if(Math.abs(along)>4+age*.12||Math.abs(edge)>3)continue;
 const energy=Math.max(0,Math.min(1,(w.power-1.05)/.35)),frequency=3.8-1.4*energy,spread=1.1-.4*energy,decay=.17-.03*energy;
 y+=Math.cos(edge*frequency)*Math.exp(-edge*edge*spread-along*along/(2+age*.3)-age*decay)*w.power*(.12+.2*energy);
 }return y;}
export const wakeGLSL=`uniform vec4 wake[64];uniform float wakeHeading[64];
vec3 wakeSurface(vec2 p){vec3 result=vec3(0.);for(int i=0;i<64;i++){vec4 w=wake[i];float age=time-w.z;if(w.w<=0.||age<0.||age>18.)continue;vec2 d=p-w.xy-vec2(.16,-.11)*storm*age;if(dot(d,d)>(4.+age*.7)*(4.+age*.7))continue;vec2 forward=vec2(sin(wakeHeading[i]),cos(wakeHeading[i])),right=vec2(forward.y,-forward.x);float a=dot(d,forward),b=dot(d,right),e=abs(b)-(.55+age*.65);if(abs(a)>4.+age*.12||abs(e)>3.)continue;float energy=clamp((w.w-1.05)/.35,0.,1.),frequency=3.8-1.4*energy,spread=1.1-.4*energy,decay=.17-.03*energy,D=2.+age*.3,E=exp(-e*e*spread-a*a/D-age*decay)*w.w*(.12+.2*energy),h=cos(e*frequency)*E;result.x+=h;result.yz+=forward*(-2.*a/D*h)+right*sign(b)*E*(-frequency*sin(e*frequency)-2.*spread*e*cos(e*frequency));}return result;}
float wakeHeight(vec2 p){return wakeSurface(p).x;}`;

// Pressure slope of the same packets used for buoyancy and rendering. Crossing
// angle is projected by the hull, so a parallel wake does not kick sideways.
export function wakeGradient(x,z,time,storm=0,exclude=null,minPower=0){
 let gx=0,gz=0;
 for(const w of wakeTrail){const age=time-w.time;if(w.power<=minPower||exclude&&w.owner===exclude||age<.35||age>18)continue;
  const dx=x-w.x-.16*storm*age,dz=z-w.z+.11*storm*age;if(dx*dx+dz*dz>(4+age*.7)**2)continue;
  const fx=Math.sin(w.heading),fz=Math.cos(w.heading),a=dx*fx+dz*fz,b=dx*fz-dz*fx,e=Math.abs(b)-(.55+age*.65);if(Math.abs(a)>4+age*.12||Math.abs(e)>3)continue;
  const energy=Math.max(0,Math.min(1,(w.power-1.05)/.35)),f=3.8-1.4*energy,k=1.1-.4*energy,D=2+age*.3,E=Math.exp(-e*e*k-a*a/D-age*(.17-.03*energy))*w.power*(.12+.2*energy);
  const along=-2*a/D*Math.cos(e*f)*E,across=Math.sign(b)*E*(-f*Math.sin(e*f)-2*k*e*Math.cos(e*f));const crossing=exclude&&Number.isFinite(exclude.heading)?Math.abs(Math.sin(w.heading-exclude.heading)):1;gx+=(fx*along+fz*across)*crossing;gz+=(fz*along-fx*across)*crossing;
 }return {x:gx,z:gz};
}
export function wakeContact(gradient,heading,speed,wet){
 const rightX=Math.cos(heading),rightZ=-Math.sin(heading),side=gradient.x*rightX+gradient.z*rightZ;
 const load=Math.max(0,Math.min(1,(speed-5)/20))*Math.max(0,Math.min(1,wet));
 const acceleration=Math.max(-.9,Math.min(.9,-side*1.8))*load;
 return {x:acceleration*rightX,z:acceleration*rightZ,roll:Math.max(-.65,Math.min(.65,-side*1.3))*load};
}

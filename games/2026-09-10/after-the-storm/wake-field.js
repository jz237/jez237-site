export const WAKE_COUNT=64;
export const wakeTrail=Array.from({length:WAKE_COUNT},()=>({x:10000,z:10000,time:-100,heading:0,power:0}));let cursor=0;
export function clearWakeTrail(){cursor=0;for(const w of wakeTrail){w.power=0;w.time=-100;}}
export function recordWake(x,z,time,heading,power){Object.assign(wakeTrail[cursor++%WAKE_COUNT],{x,z,time,heading,power});}
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

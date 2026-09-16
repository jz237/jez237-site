// Cached coastal exposure: identical bilinear coefficients for hulls and GPU.
// Land upwind shelters the swell; shallow shelves steepen the remaining waves.
export const CHARACTER_SIZE=65,CHARACTER_SPAN=640;
export const characterField={data:new Float32Array(65*65*4),version:0,active:false};
let current;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export function setWaterCharacter(course){
 if(current===course)return;current=course;characterField.active=!!course;characterField.version++;
 if(!course)return;
 const ground=course.ground,n=CHARACTER_SIZE;
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const x=(i/(n-1)-.5)*CHARACTER_SPAN,z=(j/(n-1)-.5)*CHARACTER_SPAN,bed=ground(x,z);
  let cover=0;
  for(const d of [16,36,65])for(const side of [-.35,0,.35]){
   const dx=.6+side*.8,dz=.8-side*.6;
   cover+=clamp((ground(x-dx*d,z-dz*d)-.2)/2)/9;
  }
  const exposure=1-cover*.76,shallow=clamp((5+bed)/4)*clamp((-bed-.15)/.65);
  characterField.data.set([exposure*(1+shallow*.22),exposure,shallow,bed],(j*n+i)*4);
 }
}
export function characterAt(x,z,out=[]){
 if(!characterField.active){out[0]=1;out[1]=1;out[2]=0;out[3]=-20;return out;}
 const n=CHARACTER_SIZE,u=clamp(x/CHARACTER_SPAN+.5)*(n-1),v=clamp(z/CHARACTER_SPAN+.5)*(n-1),i=Math.min(n-2,Math.floor(u)),j=Math.min(n-2,Math.floor(v)),a=u-i,b=v-j,d=characterField.data;
 for(let k=0;k<4;k++)out[k]=(d[(j*n+i)*4+k]*(1-a)+d[(j*n+i+1)*4+k]*a)*(1-b)+(d[((j+1)*n+i)*4+k]*(1-a)+d[((j+1)*n+i+1)*4+k]*a)*b;return out;
}
const heightCharacter=[];
export function characterHeight(x,z,t,c=null){if(!characterField.active)return 0;c??=characterAt(x,z,heightCharacter);return c[2]*c[1]*.085*Math.sin(x*.83+z*.47-t*3.6)+Math.max(0,c[1]-.65)*.075*Math.sin(x*1.2-z*.72-t*4.2);}
export const characterGLSL=`uniform sampler2D characterMap;uniform float characterActive;
vec4 characterAt(vec2 p){if(characterActive<.5)return vec4(1.,1.,0.,-20.);vec2 q=clamp(p/640.+.5,0.,1.)*64.,i=min(floor(q),vec2(63.)),f=q-i;vec2 uv=(i+.5)/65.;return mix(mix(texture2D(characterMap,uv),texture2D(characterMap,uv+vec2(1./65.,0.)),f.x),mix(texture2D(characterMap,uv+vec2(0.,1./65.)),texture2D(characterMap,uv+vec2(1./65.,1./65.)),f.x),f.y);}
float characterHeight(vec2 p){if(characterActive<.5)return 0.;vec4 c=characterAt(p);return surfStrength*storm*(c.z*c.y*.085*sin(p.x*.83+p.y*.47-time*3.6)+max(0.,c.y-.65)*.075*sin(p.x*1.2-p.y*.72-time*4.2));}
vec3 coastalSurface(vec2 p,vec3 s){vec4 c=characterAt(p);c.x=mix(1.,c.x,surfStrength);float e=.25;vec2 cg=vec2(characterAt(p+vec2(e,0.)).x-characterAt(p-vec2(e,0.)).x,characterAt(p+vec2(0.,e)).x-characterAt(p-vec2(0.,e)).x)/(2.*e)*surfStrength;vec2 hg=vec2(characterHeight(p+vec2(e,0.))-characterHeight(p-vec2(e,0.)),characterHeight(p+vec2(0.,e))-characterHeight(p-vec2(0.,e)))/(2.*e);return vec3(s.x*c.x+characterHeight(p),s.yz*c.x+s.x*cg+hg);}`;

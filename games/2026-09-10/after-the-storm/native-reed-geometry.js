// Independently authored three-dimensional replacement for Drake's flat reed
// sprites. Preserve their90x60 native-unit envelope at scale.025: the base is
// .5m below the source center and the tallest tips are1m above it. No source
// texture, billboard mesh or display-list payload is embedded here.
export function nativeReedGeometry(sourceIndex){
 if(!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>63)throw new RangeError('Expected loaded reed source index');
 let seed=sourceIndex+713;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const positions=[],colors=[],indices=[];
 for(let blade=0;blade<24;blade++){
  const angle=blade*2.399963+random()*.3,dx=Math.sin(angle),dz=Math.cos(angle),height=.85+random()*.65;
  const reach=.22+random()*.67,base=(random()-.5)*.25,width=.035+random()*.025,shade=.78+random()*.3;
  const point=(t,side)=>{const w=width*Math.sin(Math.PI*t)*side,bend=base+reach*t*t;
   return [dx*bend+dz*w,-.5+height*t+(side===0?.012*Math.sin(Math.PI*t):0),dz*bend-dx*w];};
  const vertex=(t,side)=>{positions.push(...point(t,side));const light=shade*(.7+.3*t)*(side===0?1.12:1);colors.push(.28*light,.42*light,.11*light);};
  const first=positions.length/3;
  for(let segment=0;segment<=12;segment++)for(const side of [-1,0,1])vertex(segment/12,side);
  // Shared vertices give continuous blade normals; both halves wind in the
  // same direction across the central ridge. Tessellation remains12 segments.
  for(let segment=0;segment<12;segment++)for(let half=0;half<2;half++){
   const a=first+segment*3+half,b=a+3;
   indices.push(a,a+1,b+1,a,b+1,b);
  }
 }
 return {positions:new Float32Array(positions),colors:new Float32Array(colors),indices};
}

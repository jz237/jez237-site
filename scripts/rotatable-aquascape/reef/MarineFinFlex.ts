type Profile={upper:number[][];lower:number[][]};
const smooth=(t:number)=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Match the Hermite trunk outline used by the Blender authoring script. A
 * linear outline can incorrectly classify a rooted fin vertex as free tissue. */
export function bodyEdge(points:number[][],x:number){
 for(let i=1;i<points.length;i++)if(x<=points[i][0]){
  const [a,ya]=points[i-1],[b,yb]=points[i],left=points[Math.max(0,i-2)],right=points[Math.min(points.length-1,i+1)];
  const t=Math.max(0,Math.min(1,(x-a)/(b-a))),m0=(yb-left[1])/(b-left[0]),m1=(right[1]-ya)/(right[0]-a);
  return (2*t**3-3*t*t+1)*ya+(t**3-2*t*t+t)*m0*(b-a)+(-2*t**3+3*t*t)*yb+(t**3-t*t)*m1*(b-a);
 }return points.at(-1)![1];
}
export function finFreedom(profile:Profile,x:number,y:number,z:number,pectoral=false){
 if(pectoral)return smooth(Math.hypot(x,y,z)/.24);
 // The body ends at x=-.5. Tail roots inside that endpoint must remain pinned.
 const tail=smooth((-.5-x)/.28),margin=smooth(Math.max(y-bodyEdge(profile.upper,x),bodyEdge(profile.lower,x)-y)/.12);
 return Math.max(tail,margin);
}
export function finField(profile:Profile,x:number,y:number,z:number,pectoral=false){
 const h=.0001,f=finFreedom(profile,x,y,z,pectoral);
 return [f,(finFreedom(profile,x+h,y,z,pectoral)-finFreedom(profile,x-h,y,z,pectoral))/(2*h),(finFreedom(profile,x,y+h,z,pectoral)-finFreedom(profile,x,y-h,z,pectoral))/(2*h),(finFreedom(profile,x,y,z+h,pectoral)-finFreedom(profile,x,y,z-h,pectoral))/(2*h)];
}
export function bodyBend(x:number,time:number,effort:number,gain=1,turn=0){const rear=Math.max(0,Math.min(1,(.3-x)/.9));return rear*rear*(Math.sin(time*7.5-x*7)*(.018+effort*.075)*gain+turn);}

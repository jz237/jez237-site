// USA Rev1 local contact-point observations, scaled consistently with the
// reconstructed course. These collision probes are independent of the modern
// rendered craft and distributed water-pressure patches.
export const HULL_PROBES=Object.freeze([
 [-12,-7,-36],[0,14,-36],[12,-7,-36],[-12,-7,36],[0,14,36],[12,-7,36],
 [-12,-7,12],[12,-7,12],[0,14,12],[-12,-7,-12],[12,-7,-12],[0,14,-12]
].map(([x,y,z])=>Object.freeze({x:x*.025,y:y*.025,z:z*.025})));

// Fixed spherical objects use two derived body-axis probes, each radius12.
// Static collision planes use the twelve hull points above.
export const SPHERE_PROBES=Object.freeze([27,-9].map(z=>Object.freeze({x:0,y:2*.025,z:z*.025})));

export function hullProbeOffset(probe,pose){
 const sr=Math.sin(pose.roll||0),cr=Math.cos(pose.roll||0),sp=Math.sin(pose.pitch||0),cp=Math.cos(pose.pitch||0);
 const x=cr*probe.x-sr*probe.y,y=sr*probe.x+cr*probe.y;
 const vertical=cp*y-sp*probe.z,forward=sp*y+cp*probe.z;
 const sh=Math.sin(pose.heading||0),ch=Math.cos(pose.heading||0);
 return {x:sh*forward+ch*x,y:vertical,z:ch*forward-sh*x};
}

export function wetHullProbes(r,surface){
 const pose={heading:r.heading,pitch:r.hydro.pitch,roll:r.hydro.roll};let count=0;
 for(const probe of HULL_PROBES){const p=hullProbeOffset(probe,pose);if(r.hydro.y+p.y<surface(r.x+p.x,r.z+p.z))count++;}
 return count;
}

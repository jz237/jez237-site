import {Vector3} from 'three';
export const SPINE_SEGMENTS=16, HEAD_PIN=.24, SPINE_LENGTH=.86;
/** Connected, fixed-length spine segments. The visible mesh uses these exact
 * centers and tangents, so stronger body flex cannot stretch the fish. */
export function createSpine(){return Array.from({length:SPINE_SEGMENTS+1},()=>new Vector3());}
export function updateSpine(points,phase,effort,turn){
 let x=HEAD_PIN,z=0;points[0].set(x,z,0);
 const step=SPINE_LENGTH/SPINE_SEGMENTS,amplitude=.24+.49*effort;
 for(let i=1;i<=SPINE_SEGMENTS;i++){
  const u=(i-.5)/SPINE_SEGMENTS;
  const angle=amplitude*Math.pow(u,1.05)*Math.sin(phase-u*5.4)+turn*.58*u;
  x-=Math.cos(angle)*step;z+=Math.sin(angle)*step;points[i].set(x,z,angle);
 }
 return points;
}
export function sampleSpine(points,x){const u=Math.max(0,Math.min(SPINE_SEGMENTS,(HEAD_PIN-x)/SPINE_LENGTH*SPINE_SEGMENTS)),i=Math.min(SPINE_SEGMENTS-1,Math.floor(u));return points[i].clone().lerp(points[i+1],u-i);}
export const spineShader=`uniform vec3 koiSpine[17];
 vec3 spineAt(float x){float u=clamp((.24-x)/.86*16.,0.,16.);int a=min(15,int(floor(u)));return mix(koiSpine[a],koiSpine[a+1],u-float(a));}
 vec3 skinPoint(vec3 p){if(p.x>=.24)return p;vec3 q=spineAt(p.x);return vec3(q.x+p.z*sin(q.z),p.y,q.y+p.z*cos(q.z));}
 vec3 skinNormal(vec3 n,float x){if(x>=.24)return n;float a=spineAt(x).z;return vec3(n.x*cos(a)+n.z*sin(a),n.y,-n.x*sin(a)+n.z*cos(a));}`;

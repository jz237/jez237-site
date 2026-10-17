import {TERRAIN_SEGMENTS,TERRAIN_SPAN,sampleTerrainHeights} from './terrain-data.js';

// Custom seas used to put deep-water troughs below the shallow course floor.
// Use a conservative envelope of the terrain for hull queries and GPU vertices.
// Original venue water keeps its own datum and original wave solver.
export const DEPTH_SIZE=TERRAIN_SEGMENTS+1;
export const coastalDepth={active:false,version:0,data:new Float32Array(DEPTH_SIZE*DEPTH_SIZE)};
let current=null;
const cache=new WeakMap();
export function setCoastalDepth(course=null){
 if(current===course)return;current=course;coastalDepth.active=!!course;coastalDepth.version++;
 if(!course)return;
 const ground=course.renderGround||course.ground;
 let data=cache.get(ground);if(!data){
  const heights=sampleTerrainHeights(ground);data=new Float32Array(heights.length);
  // The water and terrain grids do not share vertices. A one-cell upper
  // envelope keeps their interpolated triangles from cutting through each
  // other at a bank or the edge of a finite original contact plane.
  for(let j=0;j<DEPTH_SIZE;j++)for(let i=0;i<DEPTH_SIZE;i++){
   let bed=-Infinity;
   for(let z=Math.max(0,j-1);z<=Math.min(DEPTH_SIZE-1,j+1);z++)for(let x=Math.max(0,i-1);x<=Math.min(DEPTH_SIZE-1,i+1);x++)bed=Math.max(bed,heights[z*DEPTH_SIZE+x]);
   data[j*DEPTH_SIZE+i]=bed;
  }
  cache.set(ground,data);
 }
 coastalDepth.data.set(data);
}
export function coastalBed(x,z){
 const n=TERRAIN_SEGMENTS,u=Math.max(0,Math.min(n,(x/TERRAIN_SPAN+.5)*n)),v=Math.max(0,Math.min(n,(z/TERRAIN_SPAN+.5)*n));
 const i=Math.min(n-1,Math.floor(u)),j=Math.min(n-1,Math.floor(v)),a=u-i,b=v-j,k=j*DEPTH_SIZE+i,d=coastalDepth.data;
 // PlaneGeometry splits each cell along its upper-right/lower-left diagonal.
 return a+b<=1?d[k]+a*(d[k+1]-d[k])+b*(d[k+DEPTH_SIZE]-d[k]):d[k+DEPTH_SIZE+1]+(1-a)*(d[k+DEPTH_SIZE]-d[k+DEPTH_SIZE+1])+(1-b)*(d[k+1]-d[k+DEPTH_SIZE+1]);
}
export function depthLimitedHeight(height,bed,level){
 const depth=Math.max(.01,level-bed),h=height-level;
 if(h>=-.4*depth)return height;
 // C1 transition into a trough that retains at least 20% of resting depth.
 // Positive crests and waves in sufficiently deep water are unchanged.
 return level-.8*depth+.4*depth*Math.exp((h+.4*depth)/(.4*depth));
}
export function coastalHeight(x,z,height,level){
 return coastalDepth.active?depthLimitedHeight(height,coastalBed(x,z),level):height;
}
export const coastalDepthGLSL=`
uniform sampler2D coastalDepthMap;uniform float coastalDepthActive;
vec3 coastalBed(vec2 p){
 vec2 q=clamp(p/${TERRAIN_SPAN.toFixed(1)}+.5,0.,1.)*${TERRAIN_SEGMENTS.toFixed(1)},i=min(floor(q),vec2(${(TERRAIN_SEGMENTS-1).toFixed(1)})),f=q-i;
 vec2 uv=(i+.5)/${DEPTH_SIZE.toFixed(1)},stepUV=vec2(1./${DEPTH_SIZE.toFixed(1)},0.);
 float a=texture2D(coastalDepthMap,uv).r,b=texture2D(coastalDepthMap,uv+stepUV).r,c=texture2D(coastalDepthMap,uv+stepUV.yx).r,d=texture2D(coastalDepthMap,uv+stepUV.xx).r;
 vec3 bed=f.x+f.y<=1.?vec3(a+f.x*(b-a)+f.y*(c-a),b-a,c-a):vec3(d+(1.-f.x)*(c-d)+(1.-f.y)*(b-d),d-c,d-b);
 bed.yz*=${(TERRAIN_SEGMENTS/TERRAIN_SPAN).toFixed(12)};return bed;
}
vec3 coastalDepthSurface(vec2 p,vec3 s){
 if(coastalDepthActive<.5)return s;
 vec3 bed=coastalBed(p);float depth=max(.01,seaLevel-bed.x);
 if(s.x>=-.4*depth)return s;
 float e=exp((s.x+.4*depth)/(.4*depth)),dd=-.8+e*(.4-s.x/depth);
 return vec3(-.8*depth+.4*depth*e,s.yz*e-(seaLevel-bed.x>.01?bed.yz:vec2(0.))*dd);
}`;

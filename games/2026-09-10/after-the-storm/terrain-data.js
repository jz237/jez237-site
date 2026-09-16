export const TERRAIN_SEGMENTS=360,TERRAIN_MAP_SIZE=512,TERRAIN_SPAN=920;
export function terrainIdentity(course){
 // Timed authored stunts can use the forward Normal passage in every class.
 return {id:course.id,difficulty:course.stunt&&course.stuntLayout?.forwardPassage?0:course.difficulty??0};
}
export const terrainKey=course=>{const c=terrainIdentity(course);return c.id+':'+c.difficulty;};
export function sampleTerrain(heightFn){
 const segments=TERRAIN_SEGMENTS,side=segments+1,heights=new Float32Array(side*side),step=TERRAIN_SPAN/segments;
 // PlaneGeometry stores X/Z as float32 before calling the height function.
 for(let z=0;z<side;z++)for(let x=0;x<side;x++)heights[z*side+x]=heightFn(Math.fround(x*step-460),Math.fround(z*step-460));
 const n=TERRAIN_MAP_SIZE,depth=new Uint8Array(n*n*4);
 for(let z=0;z<n;z++)for(let x=0;x<n;x++){
  const h=heightFn((x/(n-1)-.5)*920,(z/(n-1)-.5)*920),v=Math.round(Math.max(0,Math.min(1,(h+16)/100))*65535),i=(z*n+x)*4;
  depth[i]=v>>8;depth[i+1]=v&255;depth[i+3]=255;
 }
 return {heights,depth};
}

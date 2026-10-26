import * as T from 'three';

/** How far beyond a mark a triangle's corners may lie and the triangle still cover it: the coarsest body skin grid. */
export const GRID=.3;
/** A decal's own geometry over part of a panel: the panel's own vertex buffers (shared, so it dents and moves with the panel and
 * costs no new vertex data), indexed to just the triangles `keep` picks by their three vertex numbers. A small mark then draws a
 * few triangles instead of re-drawing the whole panel. Null when none is kept. */
export function decalGeometry(source:T.BufferGeometry,keep:(a:number,b:number,c:number)=>boolean,attributes:readonly string[]=['position','normal','wreckPosition']){
  const index=source.index,vertices=source.attributes.position.count,count=index?index.count:vertices,out:number[]=[];
  for(let i=0;i+2<count;i+=3){const a=index?index.getX(i):i,b=index?index.getX(i+1):i+1,c=index?index.getX(i+2):i+2;if(keep(a,b,c))out.push(a,b,c);}
  if(!out.length)return null;
  const g=new T.BufferGeometry();for(const name of attributes){const at=source.getAttribute(name);if(at)g.setAttribute(name,at);}
  g.setIndex(new T.BufferAttribute(vertices>65535?new Uint32Array(out):new Uint16Array(out),1));return g;
}
/** The panel's rest positions in another frame (`toFrame` from the panel's own), for picking triangles by place. */
export function restIn(source:T.BufferGeometry,toFrame:T.Matrix4){
  const rest=(source.attributes.wreckPosition??source.attributes.position) as T.BufferAttribute,out=new Float32Array(rest.count*3),v=new T.Vector3();
  for(let i=0;i<rest.count;i++){v.fromBufferAttribute(rest,i).applyMatrix4(toFrame);out[i*3]=v.x;out[i*3+1]=v.y;out[i*3+2]=v.z;}
  return out;
}

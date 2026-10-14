import * as THREE from 'three';
import {groundHeight} from './Ground';

/** A closed, worn sandstone incline joining the existing ledge to the sand. */
export function climbingStoneGeometry(){
  const along=64,across=20,positions:number[]=[],indices:number[]=[];
  const start=new THREE.Vector2(-.40,.055),end=new THREE.Vector2(.075,.23),axis=end.clone().sub(start),right=new THREE.Vector2(-axis.y,axis.x).normalize();
  for(let layer=0;layer<2;layer++)for(let i=0;i<=along;i++)for(let j=0;j<=across;j++){
    const u=i/along,v=j/across*2-1,width=(.119-.021*u)*(1+.035*Math.sin(u*27)+.018*Math.sin(u*63));
    const x=start.x+axis.x*u+right.x*v*width,z=start.y+axis.y*u+right.y*v*width;
    const floor=groundHeight(x,z),blend=u*u*(3-2*u),top=.273*(1-blend)+(floor-.002)*blend;
    const edge=Math.max(0,(Math.abs(v)-.82)/.18),wear=.00065*Math.sin(u*91+v*9)*Math.sin(u*35-v*7)*Math.sin(Math.PI*u);
    const surface=top+wear-edge*edge*Math.min(.008,(top-floor)*.35);
    positions.push(x,layer ? Math.max(.062,surface-.027) : surface,z);
  }
  const row=across+1,layerSize=(along+1)*row;
  for(let i=0;i<along;i++)for(let j=0;j<across;j++){
    const a=i*row+j,b=a+row,c=b+1,d=a+1;
    indices.push(a,d,b,b,d,c,a+layerSize,b+layerSize,d+layerSize,b+layerSize,c+layerSize,d+layerSize);
  }
  const edge:number[]=[];
  for(let i=0;i<=along;i++)edge.push(i*row);
  for(let j=1;j<=across;j++)edge.push(along*row+j);
  for(let i=along-1;i>=0;i--)edge.push(i*row+across);
  for(let j=across-1;j>0;j--)edge.push(j);
  for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length];indices.push(a,b,a+layerSize,b,b+layerSize,a+layerSize);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}

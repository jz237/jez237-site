import * as T from 'three';
/** Three angled layers of tapered fronds form a volumetric evergreen spray.
 * Local bounds stay inside the unit crown used by existing tree placements. */
export function createConiferSpray(){
 const positions:number[]=[],colors:number[]=[];
 for(const tilt of [-Math.PI/3,0,Math.PI/3])for(let row=0;row<6;row++)for(const side of [-1,1]){
  const x=-.82+row*.29,width=.82-row*.105,y=.12*Math.sin(row*2.1),lift=side*(row%2?.28:-.22);
  const points=[[x-.16,y,0],[x+.08,y+lift,side*width],[x+.32,y+.04,side*width*.64],[x+.14,y-.03,0]];
  for(const index of [0,1,2,0,2,3]){const [px,py,pz]=points[index];positions.push(px,py*Math.cos(tilt)-pz*Math.sin(tilt),py*Math.sin(tilt)+pz*Math.cos(tilt));const shade=.79+row*.035+(side>0?.07:0);colors.push(shade,shade,.88*shade);}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}

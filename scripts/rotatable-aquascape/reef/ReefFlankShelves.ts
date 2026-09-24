import * as T from 'three';

/** Attached, asymmetric juvenile plate fans. Solid upper/lower surfaces and a
 * closed growing edge share the existing plate material and normal maps. */
export function flankShelf(point:T.Vector3,normal:T.Vector3,radius:number,seed:number,hue:number){
 const sides=80,rings=22,stride=sides+1,layerSize=(rings+1)*stride;
 const forward=new T.Vector3(normal.x*.65,-.06+normal.y*.06,normal.z+.25).normalize();
 const right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),forward).normalize();
 const up=new T.Vector3().crossVectors(forward,right).normalize();
 const origin=point.clone().addScaledVector(normal,-.016);
 const positions:number[]=[],colors:number[]=[],uv:number[]=[],tissue:number[]=[],underside:number[]=[],indices:number[]=[];
 const body=new T.Color().setHSL(hue,.35,.53).convertSRGBToLinear(),edge=new T.Color().setHSL(hue,.27,.64).convertSRGBToLinear();
 const p=new T.Vector3(),color=new T.Color();
 for(let layer=0;layer<2;layer++)for(let j=0;j<=rings;j++)for(let i=0;i<=sides;i++){
  const a=-1.22+i/sides*2.44,t=j/rings;
  const outline=1+.11*Math.sin(a*3.2+seed)+.075*Math.sin(a*7.1-seed*.3);
  const rr=radius*(.025+t*.975)*outline;
  const fold=radius*(.11*Math.sin(a*3+seed)*t*t+.06*Math.sin(a*8.4-seed)*t**3+.016*Math.sin(a*29+t*13)*t**4);
  const raised=radius*(.09*t*t+.06*Math.sin(t*7+a*2+seed)*t*t)+fold;
  const thickness=radius*(.012+.05*(1-t)**2);
  p.copy(origin).addScaledVector(right,Math.sin(a)*rr).addScaledVector(forward,Math.cos(a)*rr).addScaledVector(up,raised-(layer?thickness:0));
  positions.push(p.x,p.y,p.z);uv.push(Math.sin(a)*rr/.26,Math.cos(a)*rr/.26);
  const margin=T.MathUtils.smoothstep(t,.94+.014*Math.sin(a*11+seed),1);
  color.copy(body).lerp(edge,margin).multiplyScalar((layer?.82:1)*(.94+.055*Math.sin(a*17+t*21+seed)));
  colors.push(color.r,color.g,color.b);tissue.push(Math.round(255*(layer?.12:1-margin)));underside.push(layer?255:0);
  if(j<rings&&i<sides){const n=layer*layerSize+j*stride+i;const top=[n,n+stride,n+1,n+1,n+stride,n+stride+1];for(let k=0;k<6;k+=3)indices.push(top[k],top[k+(layer?2:1)],top[k+(layer?1:2)]);}
 }
 // Close all four perimeter edges, including the tissue embedded in its stone.
 const perimeter:number[]=[];
 for(let i=0;i<=sides;i++)perimeter.push(i);
 for(let j=1;j<=rings;j++)perimeter.push(j*stride+sides);
 for(let i=sides-1;i>=0;i--)perimeter.push(rings*stride+i);
 for(let j=rings-1;j>0;j--)perimeter.push(j*stride);
 for(let i=0;i<perimeter.length;i++){const a=perimeter[i],b=perimeter[(i+1)%perimeter.length];indices.push(a,b,a+layerSize,b,b+layerSize,a+layerSize);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setAttribute('plateTissue',new T.Uint8BufferAttribute(tissue,1,true));geometry.setAttribute('plateUnderside',new T.Uint8BufferAttribute(underside,1,true));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();
 return {geometry,obstacle:{center:geometry.boundingSphere!.center.clone(),radius:geometry.boundingSphere!.radius+.012},root:origin};
}

export function reefFlankShelves(supports:T.Mesh[]){
 const ray=new T.Raycaster(),geometries:T.BufferGeometry[]=[],obstacles:{center:T.Vector3;radius:number}[]=[],attachments:number[][]=[];
 // Deliberately small, staggered fans on bare shoulders; the major shelves,
 // caves and soft anemone hosts retain their original clear silhouette.
 const sites=[[-3.92,1.68,.30,.09],[-3.77,1.55,.23,.10],[-2.18,1.29,.28,.24],[-2.29,1.14,.22,.25],[-3.07,2.76,.27,.80],[-2.94,2.63,.21,.78],
 [1.04,1.82,.28,.08],[1.14,1.65,.24,.09],[2.08,3.18,.30,.21],[2.23,3.02,.24,.23],[3.49,1.61,.29,.79],[3.61,1.46,.23,.80]];
 for(let i=0;i<sites.length;i++){
  const [x,y,size,hue]=sites[i];ray.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));ray.far=5.2;
  const hit=ray.intersectObjects(supports,false)[0];if(!hit?.face||hit.face.normal.z<.12)continue;
  const shelf=flankShelf(hit.point,hit.face.normal,size*1.4,i*2.73+23,hue);
  geometries.push(shelf.geometry);obstacles.push(shelf.obstacle);attachments.push([i,hit.point.x,hit.point.y,hit.point.z,shelf.root.distanceTo(hit.point)]);
 }
 return {geometries,obstacles,stats:{colonies:geometries.length,triangles:geometries.reduce((sum,g)=>sum+g.index!.count/3,0),attachments}};
}

import * as T from 'three';
/** A closed stamped panel: curved upper skin, shallow underside and rolled edges. */
export function stampedPanel(width:number,length:number,thickness:number,crown:number,frontSlope=0){
 const xSteps=12,zSteps=24,positions:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let face=0;face<2;face++)for(let z=0;z<=zSteps;z++)for(let x=0;x<=xSteps;x++){
  const u=x/xSteps*2-1,v=z/zSteps*2-1;
  positions.push(u*width/2,crown*(1-u*u)*(1-.25*v*v)+frontSlope*v-(face?thickness:0),v*length/2);uv.push(x/xSteps,z/zSteps);
 }
 const count=(xSteps+1)*(zSteps+1),quad=(a:number,b:number,c:number,d:number,reverse=false)=>indices.push(...(reverse?[a,c,b,a,d,c]:[a,b,c,a,c,d]));
 for(let z=0;z<zSteps;z++)for(let x=0;x<xSteps;x++){const a=z*(xSteps+1)+x;quad(a,a+xSteps+1,a+xSteps+2,a+1);quad(a+count,a+xSteps+1+count,a+xSteps+2+count,a+1+count,true);}
 for(let x=0;x<xSteps;x++){quad(x,x+1,x+1+count,x+count);const a=zSteps*(xSteps+1)+x;quad(a,a+count,a+1+count,a+1);}
 for(let z=0;z<zSteps;z++){const a=z*(xSteps+1),b=a+xSteps;quad(a,a+count,a+xSteps+1+count,a+xSteps+1);quad(b,b+xSteps+1,b+xSteps+1+count,b+count);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}

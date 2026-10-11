// Small original, illustrative roof shapes; no claim of surveyed HVAC placement.
export function insideRoof(x,z,poly){
  let inside=false;
  for(let i=0,j=poly.length-2;i<poly.length;j=i,i+=2){
    const ax=poly[i],az=poly[i+1],bx=poly[j],bz=poly[j+1];
    if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;
  }
  return inside;
}
function rectangleFitsRoof(corners,poly){
  if(![0,2,4,6].every(i=>insideRoof(corners[i],corners[i+1],poly)))return false;
  // Four supported corners alone can bridge a narrow courtyard or concave notch.
  // Reject any roof boundary crossing the equipment rectangle as well.
  for(let i=0;i<8;i+=2){
    const next=(i+2)%8,ax=corners[i],az=corners[i+1];
    const dx=corners[next]-ax,dz=corners[next+1]-az;
    for(let j=0;j<poly.length;j+=2){
      const k=(j+2)%poly.length,bx=poly[j],bz=poly[j+1];
      const ux=poly[k]-bx,uz=poly[k+1]-bz,cross=dx*uz-dz*ux;
      if(Math.abs(cross)<1e-9)continue;
      const t=((bx-ax)*uz-(bz-az)*ux)/cross,u=((bx-ax)*dz-(bz-az)*dx)/cross;
      if(t>=0&&t<=1&&u>=0&&u<=1)return false;
    }
  }
  return true;
}
export function roofDetails(buildings,limit=700){
  const parts=[],ends=[];
  for(const b of buildings.slice(0,limit)){
    const p=b.poly,base=b.height+(b.minHeight||0);
    if(b.height>=9&&p.length<=80){
      let cx=0,cz=0,minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
      for(let i=0;i<p.length;i+=2){cx+=p[i];cz+=p[i+1];
        minX=Math.min(minX,p[i]);maxX=Math.max(maxX,p[i]);
        minZ=Math.min(minZ,p[i+1]);maxZ=Math.max(maxZ,p[i+1]);}
      cx/=p.length/2;cz/=p.length/2;
      const groundAnchor=[cx,cz];
      const add=(poly,height,offset=0)=>parts.push({poly:new Float32Array(poly),height,
        minHeight:base+offset,year:b.year||0,groundAnchor});
      // Parapets follow every footprint edge rather than a bounding rectangle.
      for(let i=0;i<p.length;i+=2){const j=(i+2)%p.length;
        const dx=p[j]-p[i],dz=p[j+1]-p[i+1],len=Math.hypot(dx,dz);
        if(len<2)continue;const nx=-dz/len*.18,nz=dx/len*.18;
        add([p[i]+nx,p[i+1]+nz,p[j]+nx,p[j+1]+nz,
          p[j]-nx,p[j+1]-nz,p[i]-nx,p[i+1]-nz],.65);
      }
      const w=Math.min(3.8,(maxX-minX)*.15),d=Math.min(5,(maxZ-minZ)*.15);
      const corners=[cx-w,cz-d,cx+w,cz-d,cx+w,cz+d,cx-w,cz+d];
      if(w>1.2&&d>1.2&&rectangleFitsRoof(corners,p)){
        add(corners,1.35);
        add([cx-w*.7,cz-d*.6,cx+w*.7,cz-d*.6,cx+w*.7,cz+d*.6,cx-w*.7,cz+d*.6],.25,1.35);
      }
    }
    ends.push(parts.length);
  }
  return {parts,ends};
}

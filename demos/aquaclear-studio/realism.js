import * as T from './vendor/three.module.js';

const seeded=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);

// Open-cell foam: irregular cavities separated by narrow polymer struts. The
// height map is linear data, independent of the color map's sRGB conversion.
export function cellularFoam(blue=true){
  const width=512,cells=25,rand=seeded(blue?582:993),points=[];
  for(let y=0;y<cells;y++)for(let x=0;x<cells;x++)points.push([x+.15+rand()*.7,y+.15+rand()*.7]);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=width;
  const context=canvas.getContext('2d'),pixels=context.createImageData(width,width);
  const height=canvas.cloneNode(),heightContext=height.getContext('2d'),heights=heightContext.createImageData(width,width);
  for(let y=0;y<width;y++)for(let x=0;x<width;x++){
    const px=x/width*cells,py=y/width*cells,cx=Math.floor(px),cy=Math.floor(py);let first=9,second=9;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const ix=cx+dx,iy=cy+dy,p=points[((iy+cells)%cells)*cells+(ix+cells)%cells];
      const sx=p[0]+Math.floor(ix/cells)*cells,sy=p[1]+Math.floor(iy/cells)*cells,d=Math.hypot(px-sx,py-sy);
      if(d<first){second=first;first=d;}else if(d<second)second=d;
    }
    const wall=Math.exp(-Math.pow((second-first)/.105,2)),lip=Math.exp(-Math.pow((second-first)/.22,2));
    const grain=(rand()-.5)*.045,shade=.42+.29*wall+.19*lip+grain,i=(y*width+x)*4;
    const color=blue?[45,133,163]:[48,53,55];
    pixels.data.set([...color.map(v=>Math.round(v*shade)),255],i);
    const h=Math.round((.10+.84*wall)*255);heights.data.set([h,h,h,255],i);
  }
  context.putImageData(pixels,0,0);heightContext.putImageData(heights,0,0);
  const map=new T.CanvasTexture(canvas),bump=new T.CanvasTexture(height);map.colorSpace=T.SRGBColorSpace;
  for(const tex of [map,bump]){tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=8;}
  return new T.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.028,roughness:.93});
}

export function ceramicGeometry(){
  // Rounded, open-ended ceramic tube with a slightly irregular fired surface.
  const profile=[[.050,-.068],[.045,-.057],[.045,.057],[.050,.068],[.079,.074],[.091,.066],[.095,.055],[.095,-.055],[.091,-.066],[.079,-.074],[.050,-.068]];
  const g=new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),28),a=g.attributes.position,colors=[];
  for(let i=0;i<a.count;i++){
    const x=a.getX(i),y=a.getY(i),z=a.getZ(i),angle=Math.atan2(z,x),r=Math.hypot(x,z);
    const variation=1+Math.sin(angle*5+y*47)*.012+Math.cos(angle*9-y*35)*.009;
    a.setXYZ(i,x*variation,y+Math.sin(angle*7)*.0012,z*variation);
    const cavity=r<.057?.55:r<.079?.86:1;colors.push(cavity,cavity,cavity);
  }
  g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
}

export function ceramicPile(material,count=288){
  const rand=seeded(761),placed=[],dummy=new T.Object3D(),mesh=new T.InstancedMesh(ceramicGeometry(),material,count);
  mesh.name='loose-ceramic-media';
  // Deterministic conservative sphere packing approximates a poured pile.
  // This prevents interpenetration; it does not claim rigid-body simulation.
  for(let i=0;i<count;i++){
    const scale=.86+rand()*.23,r=.121*scale;let best=null;
    for(let trial=0;trial<38;trial++){
      const x=-.72+r+rand()*(2.54-2*r),z=.10+r+rand()*(.87-2*r);let y=1.57+r;
      for(const p of placed){const d2=(x-p.x)**2+(z-p.z)**2,rr=r+p.r;if(d2<rr*rr)y=Math.max(y,p.y+Math.sqrt(rr*rr-d2));}
      if(!best||y<best.y)best={x,y,z,r};
    }
    if(best.y+r>2.98){mesh.count=i;break;}
    placed.push(best);dummy.position.set(best.x,best.y,best.z);dummy.rotation.set(rand()*Math.PI*2,rand()*Math.PI*2,rand()*Math.PI*2);dummy.scale.setScalar(scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    const value=.79+rand()*.20;mesh.setColorAt(i,new T.Color().setRGB(value,value*.98,value*.92));
  }
  mesh.castShadow=mesh.receiveShadow=true;mesh.userData.packedCount=mesh.count;return mesh;
}

export function bagPoint(x,y,z){
  // Rounded corners and shallow wrinkles, with a pinched sewn top/bottom.
  const nx=x/1.28,ny=y/.745,nz=z/.455,pinch=Math.pow(Math.abs(ny),8);
  const bulge=(1-pinch)*(.016*Math.sin(nx*12+ny*3)+.009*Math.sin(ny*15-nx*5));
  const corner=Math.min(1,(1-Math.pow(Math.abs(nx),10))*.055+.945);
  return new T.Vector3(x*(1-.018*pinch),y-.025*(1-nx*nx)*(1-nz*nz),z*corner*(1-.055*pinch)+Math.sign(z)*bulge);
}

export function studioEnvironment(renderer){
  const scene=new T.Scene();scene.background=new T.Color('#12181d');
  const panels=[[-5,6,3,4,7,5,'#fff1dc'],[5,4,-3,2,6,7,'#dceafa'],[1,8,1,5,3,3,'#ffffff'],[-1,2,7,4,2,1.1,'#edf3ef']];
  for(const [x,y,z,w,h,intensity,color] of panels){
    const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity),side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,2,0);scene.add(panel);
  }
  const generator=new T.PMREMGenerator(renderer),target=generator.fromScene(scene,.035);
  scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});generator.dispose();return target;
}

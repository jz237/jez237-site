import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Original authored forms and deterministic materials; no purchased assets.
export function shellGeometry(w,h,d,style=0){
  const rings=style===1?[[0,.2],[.08,.65],[.3,1],[.65,.92],[.87,.66],[1,.12]]:
    [[0,.48],[.08,.66],[.34,.83],[.68,1],[.86,.88],[1,.52]];
  const vertices=[],uv=[],indices=[],segments=16;
  for(let j=0;j<rings.length;j++)for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2,[t,r]=rings[j],c=Math.cos(a),s=Math.sin(a);
    // Flatten the centre of the armour, roll its corners into the flanks.
    vertices.push(Math.sign(c)*Math.pow(Math.abs(c),.64)*w*.5*r,(t-.5)*h,
      Math.sign(s)*Math.pow(Math.abs(s),.72)*d*.5*(.8+r*.2));uv.push(i/segments,t);
    if(j<rings.length-1&&i<segments){let k=j*(segments+1)+i;indices.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}

let finish;
export function armorFinish(){
  if(finish)return finish;const n=256,data=new Uint8Array(n*n*4);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const hash=Math.sin(x*127.1+y*311.7)*43758.5453,grain=hash-Math.floor(hash);
    const seam=x%64<2||y%96<2,scratch=grain>.993||((x+y*3)%197===0&&y%29<15);
    const v=seam?75:scratch?160:220+grain*30,i=(y*n+x)*4;
    data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
  }
  finish=new THREE.DataTexture(data,n,n);finish.wrapS=finish.wrapT=THREE.RepeatWrapping;finish.needsUpdate=true;finish.generateMipmaps=true;finish.minFilter=THREE.LinearMipmapLinearFilter;return finish;
}

export function tube(points,radius,material){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve,16,radius,6,false),material);
}

// Merge authored static detail by material, keeping animation joints independent.
export function pack(group){
  group.updateMatrixWorld(true);const batches=new Map();
  for(const m of [...group.children])if(m.isMesh&&!m.userData.dynamic){const g=m.geometry.clone().applyMatrix4(m.matrix);if(g.index)g.setIndex(g.index.clone());const key=m.material; if(!batches.has(key))batches.set(key,[]);batches.get(key).push(g.index?g.toNonIndexed():g);group.remove(m);}
  for(const [material,geometries] of batches){const g=mergeGeometries(geometries,false);if(!g)continue;const m=new THREE.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;group.add(m);geometries.forEach(g=>g.dispose());}
  return group;
}

export function reliefGeometry(level,xStart=0,xEnd=level.cols){
  const pos=[],colors=[],uv=[],idx=[],stride=4,T=20;
  const solid=(x,y)=>x>=0&&y>=0&&x<level.cols&&y<level.rows&&level.tiles[y*level.cols+x]===1;
  for(let ty=0;ty<level.rows;ty++)for(let tx=xStart;tx<Math.min(xEnd,level.cols);tx++)if(solid(tx,ty)){
    const start=pos.length/3;
    for(let j=0;j<=stride;j++)for(let i=0;i<=stride;i++){
      const x=tx*T+i*T/stride,y=-ty*T-j*T/stride;
      let edge=1;
      if(!solid(tx-1,ty))edge=Math.min(edge,i/stride);if(!solid(tx+1,ty))edge=Math.min(edge,1-i/stride);
      if(!solid(tx,ty-1))edge=Math.min(edge,j/stride);if(!solid(tx,ty+1))edge=Math.min(edge,1-j/stride);
      const layer=Math.sin(y*.145+x*.013+Math.sin(x*.023)*.7),mass=Math.sin(x*.046+y*.025)*Math.cos(y*.053-x*.008);
      const z=-1+Math.min(1,edge*3)*(3+mass*2+layer*1.6);
      pos.push(x,y,z);uv.push(x/100,y/100);
      // Baked cavity shading follows the strata and exposed shelf edges.
      const shade=.58+Math.max(0,layer)*.19+edge*.15;colors.push(shade,shade*.99,shade*.94);
      if(i<stride&&j<stride){const k=start+j*(stride+1)+i;idx.push(k,k+stride+1,k+1,k+1,k+stride+1,k+stride+2);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(idx);g.computeVertexNormals();return g;
}

export function rockFace(w,h,d,seed){
  const g=new THREE.SphereGeometry(1,22,18),p=g.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i),z=p.getZ(i),strata=Math.sin(y*22+x*2+seed)*.035;
    const r=1+.13*Math.sin(x*7+y*3+seed)+.09*Math.cos(z*9+y*6)+strata;
    p.setXYZ(i,x*w*r,y*h,z*d*r);const a=.6+.25*(y+1)/2+.1*Math.sin(y*22+x*2+seed);colors.push(a,a*.98,a*.93);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
}

export function smokeTexture(){
  const n=64,d=new Uint8Array(n*n*4);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const dx=(x-n/2)/(n/2),dy=(y-n/2)/(n/2),r=Math.hypot(dx,dy),i=(y*n+x)*4;
    d[i]=d[i+1]=d[i+2]=255;d[i+3]=Math.max(0,1-r)**2*200*(.7+.3*Math.sin(x*.4+y*.3)**2);}
  const t=new THREE.DataTexture(d,n,n);t.needsUpdate=true;return t;
}

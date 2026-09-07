import * as THREE from 'three';
import {reliefGeometry,rockFace,pack,tube} from './artisan.mjs';
import {part,mat,silver,dark,cyan,amber} from './models.mjs';

// The physics map stays untouched. Only its exposed perimeter becomes artwork.
export function contours(level){
  const {cols,rows,tiles}=level,T=level.tile||20,edges=[];
  const solid=(x,y)=>x>=0&&y>=0&&x<cols&&y<rows&&tiles[y*cols+x]===1;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(solid(x,y)){
    if(!solid(x,y-1))edges.push([[x*T,-y*T],[(x+1)*T,-y*T]]);
    if(!solid(x+1,y))edges.push([[(x+1)*T,-y*T],[(x+1)*T,-(y+1)*T]]);
    if(!solid(x,y+1))edges.push([[(x+1)*T,-(y+1)*T],[x*T,-(y+1)*T]]);
    if(!solid(x-1,y))edges.push([[x*T,-(y+1)*T],[x*T,-y*T]]);
  }
  const outgoing=new Map(),key=p=>p.join(',');
  edges.forEach((e,i)=>{const k=key(e[0]);if(!outgoing.has(k))outgoing.set(k,[]);outgoing.get(k).push(i);});
  const used=new Set(),loops=[];
  for(let i=0;i<edges.length;i++){
    if(used.has(i))continue;const loop=[];let n=i;
    while(!used.has(n)){used.add(n);const [a,b]=edges[n];loop.push(a);const next=(outgoing.get(key(b))||[]).filter(k=>!used.has(k));if(!next.length)break;
      // At a diagonal contact, keep the boundary on the same solid island.
      const dx=b[0]-a[0],dy=b[1]-a[1];next.sort((j,k)=>{const turn=id=>{const c=edges[id][1];return Math.atan2(dx*(c[1]-b[1])-dy*(c[0]-b[0]),dx*(c[0]-b[0])+dy*(c[1]-b[1]));};return turn(j)-turn(k);});n=next[0];
    }
    if(loop.length>=4){const simple=loop.filter((p,i)=>{const a=loop[(i+loop.length-1)%loop.length],b=loop[(i+1)%loop.length];return (p[0]-a[0])*(b[1]-p[1])!==(p[1]-a[1])*(b[0]-p[0]);});loops.push(simple);}
  }
  return loops;
}
export const area=points=>points.reduce((sum,a,i)=>{const b=points[(i+1)%points.length];return sum+a[0]*b[1]-b[0]*a[1];},0)/2;
function inside(p,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
function shapedPath(points,isShape,industrial=false){
  const path=isShape?new THREE.Shape():new THREE.Path(),count=points.length;
  const entry=[],exit=[];
  for(let i=0;i<count;i++){const a=points[(i+count-1)%count],p=points[i],b=points[(i+1)%count];
    const d1=Math.hypot(a[0]-p[0],a[1]-p[1]),d2=Math.hypot(b[0]-p[0],b[1]-p[1]),r=Math.min(industrial?3:6,d1*.22,d2*.22);
    entry.push([p[0]+(a[0]-p[0])*r/d1,p[1]+(a[1]-p[1])*r/d1]);exit.push([p[0]+(b[0]-p[0])*r/d2,p[1]+(b[1]-p[1])*r/d2]);
  }
  path.moveTo(...exit[count-1]);
  for(let i=0;i<count;i++){
    const a=exit[(i+count-1)%count],b=entry[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(1,Math.ceil(len/9));
    for(let k=1;k<=steps;k++){const t=k/steps,x=THREE.MathUtils.lerp(a[0],b[0],t),y=THREE.MathUtils.lerp(a[1],b[1],t);
      // Small surface irregularity preserves jump distances and readable hazards.
      const top=Math.abs(a[1]-b[1])<.01&&b[0]>a[0],edge=industrial?0:Math.sin(Math.PI*t)*(Math.sin(x*.067+y*.035)*.8+Math.sin(x*.23-y*.11)*.35);
      path.lineTo(x+(top?0:edge),y+(top?edge*.45:0));}
    path.quadraticCurveTo(...points[i],...exit[i]);
  }
  path.closePath();return path;
}
export function cliffGeometry(level){
  const loops=contours(level),outer=loops.filter(l=>area(l)<0),holes=loops.filter(l=>area(l)>0),industrial=[3,4].includes(level.world);
  const shapes=outer.map(l=>{const shape=shapedPath(l,true,industrial);for(const hole of holes)if(inside(hole[0],l))shape.holes.push(shapedPath(hole,false,industrial));return shape;});
  const geometry=new THREE.ExtrudeGeometry(shapes,{depth:25,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:1.2,bevelThickness:2,curveSegments:5});
  geometry.translate(0,0,-27);geometry.computeVertexNormals();
  // World-space UVs keep detail continuous across shelves and separate islands.
  const uv=geometry.attributes.uv,pos=geometry.attributes.position;
  for(let i=0;i<uv.count;i++)uv.setXY(i,pos.getX(i)/140,pos.getY(i)/140);uv.needsUpdate=true;
  geometry.userData={contourCount:loops.length,outerCount:outer.length,holeCount:holes.length};return geometry;
}
export function stoneMaterial(color,texture,industrial=false){
  const material=new THREE.MeshStandardMaterial({color,map:texture,bumpMap:texture,bumpScale:industrial?.35:1.8,roughness:industrial?.52:.86,metalness:industrial?.5:.08});
  material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 cliffPosition;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncliffPosition=position;');
    shader.fragmentShader=`varying vec3 cliffPosition;
      float rockHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float rockNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(rockHash(i),rockHash(i+vec2(1.,0.)),f.x),mix(rockHash(i+vec2(0.,1.)),rockHash(i+vec2(1.,1.)),f.x),f.y);}
      float strata(vec2 p){return rockNoise(p)*.58+rockNoise(p*2.13)*.27+rockNoise(p*4.4)*.15;}
      `+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 rp=cliffPosition.xy;float layer=strata(rp*vec2(.012,.04));
      float seams=abs(sin(rp.y*.32+strata(rp*vec2(.012,.045))*1.6+rp.x*.025));
      float fracture=abs(sin(rp.x*.19+rp.y*.025+strata(rp*.065)*2.));
      float cracks=smoothstep(.01,.05,seams)*mix(.9,1.,smoothstep(.005,.04,fracture));
      diffuseColor.rgb*=(${industrial?'0.9+layer*.22':'0.54+layer*.75'})*mix(.76,1.,cracks);
      diffuseColor.rgb*=.91+rockNoise(rp*1.8)*.18;
      diffuseColor.rgb+=vec3(.025,.022,.014)*pow(max(0.,1.-abs(seams-.17)*9.),5.);
    `);
  };
  material.customProgramCacheKey=()=>industrial?'cliff-industrial-v1':'cliff-rock-v1';return material;
}
export function sculptRock(width,height,depth,seed=1){
  const g=new THREE.SphereGeometry(1,18,14),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=1+.11*Math.sin(x*5+y*4+seed)+.06*Math.sin(z*9-y*5+seed*2)+.04*Math.cos(x*13+z*8);p.setXYZ(i,x*width*n,y*height*n,z*depth*n);}
  g.computeVertexNormals();return g;
}
export function dressCliffs(parent,level,material){
  const T=level.tile||20,industrial=[3,4].includes(level.world),wet=level.world===2;
  let rubble=0,moss=0,pipes=0,rims=0;
  for(const loop of contours(level))for(let i=0;i<loop.length;i++){
    const a=loop[i],b=loop[(i+1)%loop.length],dx=b[0]-a[0];
    if(Math.abs(a[1]-b[1])>.01||dx<10)continue;
    // Continuous, thin lip; no individual tile caps.
    const points=[];for(let x=a[0]+3;x<b[0]-2;x+=6)points.push(new THREE.Vector3(x,a[1]+.4*Math.sin(x*.067),.5));
    if(points.length>1){const curve=new THREE.CatmullRomCurve3(points);const rim=new THREE.Mesh(new THREE.TubeGeometry(curve,points.length*2,.42,5,false),mat(industrial?'#adb7ad':'#849f9b',.2,.7,.05));parent.add(rim);rims++;}
    for(let x=a[0]+16;x<b[0]-12;x+=31){
      const n=Math.abs(Math.sin(x*13+a[1]*7));if(n>.63)continue;
      const g=sculptRock(3+n*5,1.3+n*1.2,3,x*.1);const stone=new THREE.Mesh(g,material);stone.position.set(x,a[1]+.6,-4);stone.rotation.y=x;stone.castShadow=true;stone.receiveShadow=true;parent.add(stone);rubble++;
      if(wet&&n<.4){const tuft=new THREE.Group();for(let k=0;k<5;k++){const leaf=part(tuft,'cone',[.65,3+k*.7,5],mat('#4d8161',.05,.95),[k*.8,1.2,-1],[0,0,(k-2)*.3]);}tuft.position.set(x+5,a[1],1);parent.add(tuft);moss++;}
      if(!industrial&&n<.11){const c=new THREE.Group();for(let k=0;k<3;k++)part(c,'cone',[1.2,4+k,5],mat('#429ca9',.3,.3,.3),[k*1.3,k*.5,-2],[0,0,(k-1)*.2]);c.position.set(x-6,a[1]+1,-1);parent.add(c);}
      if(industrial&&n<.2){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x-12,a[1]-12,2),new THREE.Vector3(x,a[1]-12,2),new THREE.Vector3(x+6,a[1]-19,2),new THREE.Vector3(x+6,a[1]-35,2)]);const pipe=new THREE.Mesh(new THREE.TubeGeometry(curve,14,1.4,8,false),silver);pipe.castShadow=true;parent.add(pipe);pipes++;}
    }
    // Protruding shelves below the walking edge create an undercut shadow.
    if(!industrial&&dx>60){for(let x=a[0]+30;x<b[0]-20;x+=75){const rock=new THREE.Mesh(sculptRock(13,5,6,x),material);rock.position.set(x,a[1]-9,-1);rock.castShadow=true;rock.receiveShadow=true;parent.add(rock);}}
  }
  parent.userData.details={rubble,moss,pipes,rims};
}
export function rockPlatform(parent,pl,material,industrial){
  const x=pl.x*20,y=-pl.y*20,w=pl.w*20;
  if(industrial){part(parent,'box',[w,5,22],material,[x+w/2,y-2,-5]);part(parent,'box',[w-4,.7,1],cyan,[x+w/2,y+.1,7]);return;}
  const shape=new THREE.Shape();shape.moveTo(x+2,y);shape.lineTo(x+w-2,y);shape.quadraticCurveTo(x+w+2,y-5,x+w-7,y-9);shape.lineTo(x+w*.7,y-13);shape.lineTo(x+w*.4,y-19);shape.lineTo(x+7,y-10);shape.quadraticCurveTo(x-2,y-5,x+2,y);
  const g=new THREE.ExtrudeGeometry(shape,{depth:18,bevelEnabled:true,bevelSize:1,bevelThickness:1,bevelSegments:2,curveSegments:5});g.translate(0,0,-19);
  const m=new THREE.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);part(parent,'box',[w-6,.55,1],mat('#87a9a4',.1,.7,.1),[x+w/2,y+.15,1]);
}

// Detailed relief retains the collision map, with layered geometry and baked cavity tones.
export function landscapeRelief(parent,level,surface){
  const natural=![3,4].includes(level.world),rockMat=surface.clone();rockMat.onBeforeCompile=surface.onBeforeCompile;rockMat.customProgramCacheKey=surface.customProgramCacheKey;rockMat.vertexColors=true;
  if(natural)for(let x=0;x<level.cols;x+=12){const g=reliefGeometry(level,x,x+12);if(!g.attributes.position.count){g.dispose();continue;}const mesh=new THREE.Mesh(g,rockMat);mesh.receiveShadow=true;parent.add(mesh);}
  const set=new THREE.Group();parent.add(set);let count=0;
  for(const loop of contours(level))for(let k=0;k<loop.length;k++){
    const a=loop[k],b=loop[(k+1)%loop.length],length=b[0]-a[0];if(a[1]!==b[1]||length<35)continue;
    for(let x=a[0]+20;x<b[0]-18;x+=54){const n=(Math.sin(x*7.37)+1)*.5;
      if(natural){
        for(let j=0;j<3;j++){const rock=new THREE.Mesh(rockFace(16+n*12,3+j*1.5,5+n*5,x+j),rockMat);rock.position.set(x+j*7,a[1]-5-j*7,1);rock.rotation.z=-.06+n*.12;rock.castShadow=true;rock.receiveShadow=true;set.add(rock);count++;}
        if(level.world===2||level.world===5){for(let i=0;i<4;i++){const leaf=tube([[x+i*2,a[1],-3],[x+i*2+2,a[1]+5,-3],[x+i*2-1,a[1]+10+n*12,-3]],.45,mat(level.world===2?'#4a8170':'#897849',.1,.8));set.add(leaf);}}
      }else{
        part(set,'box',[32,3,6],dark,[x,a[1]-5,3]);for(let i=0;i<4;i++)part(set,'box',[2,2,1],i%2?amber:silver,[x-12+i*7,a[1]-5,7]);
        part(set,'box',[1.3,15,2],silver,[x,a[1]-16,3]);count++;
      }
    }
  }
  // Batch each local section, preserving frustum culling across the long level.
  const chunks=new Map();for(const child of [...set.children]){const key=Math.floor(child.position.x/240);if(!chunks.has(key)){const g=new THREE.Group();chunks.set(key,g);set.add(g);}chunks.get(key).add(child);}for(const group of chunks.values())pack(group);
  parent.userData.relief={sculptedLayers:count,bakedCavities:natural};
}

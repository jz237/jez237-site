import {rockMaterial} from './land-materials.js';
import {islandElevation,geologyNoise} from './coast-geology.js';
import {canopyKinds,canopyGeometry,canopyMaterial} from './canopy-cards.js';
import * as T from './vendor/three.module.js';

export function makeDistantCoast(root,course){
 const group=new T.Group();group.userData.dynamic=true;root.add(group);
 const geometries=[],materials=[],foliage=[],boulders=[];
 let seed=[...course.id].reduce((n,c)=>n+c.charCodeAt(0),17);const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const cold=course.theme==='ice',urban=['city','port'].includes(course.theme);
 for(let layer=0;layer<3;layer++){
  const positions=[],colours=[],indices=[],radius=640+layer*235,offset=random()*6.28;
  for(let island=0;island<3;island++){
   const a=offset+island*2.09,cx=Math.sin(a)*radius,cz=Math.cos(a)*radius,width=150+random()*110,depth=95+random()*65,height=island===1?62+random()*28:85+random()*42,rockSeed=random()*1000;
   const elevation=(u,v)=>islandElevation(u,v,rockSeed,height);
   const point=(u,v)=>[cx+u*width*Math.cos(a)-v*depth*Math.sin(a),elevation(u,v),cz+u*width*Math.sin(a)+v*depth*Math.cos(a)];
   const slope=(u,v)=>Math.hypot((elevation(u+.012,v)-elevation(u-.012,v))/(width*.024),(elevation(u,v+.012)-elevation(u,v-.012))/(depth*.024));
   const resolution=layer===0?80:layer===1?48:32,base=positions.length/3;
   for(let z=0;z<=resolution;z++)for(let x=0;x<=resolution;x++){
    const u=x/resolution*2-1,v=z/resolution*2-1,q=point(u,v);positions.push(...q);
    const crag=slope(u,v),green=cold?0:T.MathUtils.smoothstep(1.25-crag,.05,.7)*T.MathUtils.smoothstep(q[1],2,14);
    const c=new T.Color(cold?0xd5e3e7:0xffffff).lerp(new T.Color(0x7d9861),green*.58);
    const shade=.85+geologyNoise(u*9,v*9,rockSeed)*.15;colours.push(c.r*shade,c.g*shade,c.b*shade);
   }
   for(let z=0;z<resolution;z++)for(let x=0;x<resolution;x++){const i=base+z*(resolution+1)+x;indices.push(i,i+resolution+1,i+1,i+1,i+resolution+1,i+resolution+2);}
   if(layer<2&&!cold&&!urban)for(let j=0;j<(layer===0?480:150);j++){
    const u=(random()-.5)*1.8,v=(random()-.5)*1.8,p=point(u,v);
    if(p[1]<5||slope(u,v)>1.7||geologyNoise(u*5,v*5,rockSeed)<.37)continue;
    p[1]-=.4;foliage.push({p,height:6+random()*11,angle:random()*6.28,kind:j%2});
   }
   if(layer===0)for(let j=0;j<65;j++){
    const angle=random()*6.28,r=.68+random()*.3,u=Math.cos(angle)*r,v=Math.sin(angle)*r,p=point(u,v);
    if(p[1]<-2||p[1]>42)continue;
    boulders.push({p,scale:2+random()*4,angle:random()*6.28});
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setIndex(indices);g.computeVertexNormals();
  const m=rockMaterial({scale:.033,vegetation:cold?0:.8});m.vertexColors=true;m.color.setHex(cold?0xdde8ea:0xffffff);
  const before=m.onBeforeCompile;m.onBeforeCompile=shader=>{before.call(m,shader);shader.fragmentShader=shader.fragmentShader.replace('cliffWorld.y*17.', 'cliffWorld.y*.38').replace('#include <fog_fragment>',`#ifdef USE_FOG
   float aerial=1.-exp(-vFogDepth*vFogDepth*.0000008);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,aerial);
   #endif`);};m.customProgramCacheKey=()=> 'eroded-distant-granite-v2';
  group.add(new T.Mesh(g,m));geometries.push(g);materials.push(m);
 }
 const dummy=new T.Object3D();
 for(let k=0;k<canopyKinds.length;k++){
  const rows=foliage.filter(p=>p.kind===k),kind=canopyKinds[k];if(!rows.length)continue;
  const g=canopyGeometry(kind.aspect),m=canopyMaterial(kind),mesh=new T.InstancedMesh(g,m,rows.length);
  const previousCompile=m.onBeforeCompile;m.onBeforeCompile=s=>{previousCompile(s);s.fragmentShader=s.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
   float aerial=1.-exp(-vFogDepth*vFogDepth*.0000008);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,aerial);
   #endif`);};m.customProgramCacheKey=()=> 'distant-canopy-light-v2';
  rows.forEach((p,i)=>{dummy.position.fromArray(p.p);dummy.rotation.set(0,p.angle,0);dummy.scale.setScalar(p.height);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color().setScalar(.75+random()*.35));});
  mesh.computeBoundingSphere();group.add(mesh);geometries.push(g);materials.push(m);
 }
 if(boulders.length){const g=new T.IcosahedronGeometry(1,2),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=.78+geologyNoise(x*3+z,y*4,41)*.38;p.setXYZ(i,x*r,y*r,z*r);}g.computeVertexNormals();
  const m=rockMaterial({scale:.22}),mesh=new T.InstancedMesh(g,m,boulders.length);
  const prior=m.onBeforeCompile;m.onBeforeCompile=s=>{prior(s);s.fragmentShader=s.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
   float aerial=1.-exp(-vFogDepth*vFogDepth*.0000008);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,aerial);
   #endif`);};m.customProgramCacheKey=()=> 'distant-boulders-v2';
  boulders.forEach((b,i)=>{dummy.position.set(b.p[0],b.p[1]+b.scale*.18,b.p[2]);dummy.rotation.set(.2,b.angle,.15);dummy.scale.set(b.scale,b.scale*.8,b.scale*.7);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.computeBoundingSphere();group.add(mesh);geometries.push(g);materials.push(m);
 }
 root.userData.distantLand={trees:foliage.length,boulders:boulders.length,triangles:geometries.reduce((n,g)=>n+(g.index?.count||g.attributes.position.count)/3,0)};
 return {dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}

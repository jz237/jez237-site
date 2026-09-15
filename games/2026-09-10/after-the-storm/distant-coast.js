import {rockMaterial} from './land-materials.js';
import * as T from './vendor/three.module.js';
// Low polygon landforms sit beyond the playable terrain. Their sloped surfaces
// receive the same light and atmospheric fog as the nearer coast.
export function makeDistantCoast(root,course){
 const group=new T.Group();group.userData.dynamic=true;root.add(group);const geometries=[],materials=[];
 let seed=[...course.id].reduce((n,c)=>n+c.charCodeAt(0),17);const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let layer=0;layer<3;layer++){
  const positions=[],colours=[],indices=[],radius=600+layer*220,offset=random()*6.28,crowns=[];
  const colour=course.theme==='ice'?0x829fa8:course.theme==='city'?0x30424b:[0x657461,0x7a8c83,0x8d9fa5][layer],baseColour=new T.Color(colour);
  for(let island=0;island<3;island++){
   const a=offset+island*2.09,cx=Math.sin(a)*radius,cz=Math.cos(a)*radius,width=130+random()*130,depth=85+random()*65,height=65+random()*100,phase=random()*6.28;
   const peaks=Array.from({length:5},()=>({u:(random()-.5)*1.3,v:(random()-.5)*1.1,r:.26+random()*.35,h:.5+random()*.5}));
   const elevation=(u,v)=>{const d=Math.hypot(u,v);let top=0,sum=0;
    for(const peak of peaks){const q=peak.h*Math.exp(-((u-peak.u)**2+(v-peak.v)**2)/(peak.r**2));top=Math.max(top,q);sum+=q;}
    const erosion=Math.sin(u*29+v*17+phase)*Math.sin(v*23-u*11)*.025;
    return -10+Math.max(0,1-d*d)**.85*height*(.17+top*.68+sum*.12+erosion);
   };
   const point=(u,v)=>[cx+u*width*Math.cos(a)-v*depth*Math.sin(a),elevation(u,v),cz+u*width*Math.sin(a)+v*depth*Math.cos(a)];
   const resolution=48;
   const base=positions.length/3;
   for(let z=0;z<=resolution;z++)for(let x=0;x<=resolution;x++){
    const q=point(x/resolution*2-1,z/resolution*2-1);positions.push(...q);const u=x/resolution*2-1,v=z/resolution*2-1,slope=Math.hypot(elevation(u+.02,v)-elevation(u-.02,v),elevation(u,v+.02)-elevation(u,v-.02));
    const vegetation=course.theme!=='ice'&&q[1]>7&&slope<5.5;
    const c=vegetation?new T.Color(0x89a356):new T.Color(course.theme==='ice'?0xd6e3e4:0xe1ded0);
    const tone=.87+random()*.10+Math.max(0,q[1])/height*.12;colours.push(c.r*tone,c.g*tone,c.b*tone);
   }
   for(let z=0;z<resolution;z++)for(let x=0;x<resolution;x++){const i=base+z*(resolution+1)+x;indices.push(i,i+resolution+1,i+1,i+1,i+resolution+1,i+resolution+2);}
   if(layer===0&&course.theme!=='ice')for(let j=0;j<120;j++){
    const u=(random()-.5)*1.7,v=(random()-.5)*1.7,p=point(u,v);
    if(p[1]<5||Math.sin(u*15+phase)+Math.sin(v*11)<-.3)continue;crowns.push(p);
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colours,3));g.setIndex(indices);g.computeVertexNormals();const m=rockMaterial();m.vertexColors=true;m.color.setHex(0xffffff);
  const before=m.onBeforeCompile;m.onBeforeCompile=shader=>{before.call(m,shader);shader.fragmentShader=shader.fragmentShader.replace('cliffWorld.y*17.', 'cliffWorld.y*.45');shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
   float backgroundFog=1.-exp(-vFogDepth*vFogDepth*.00000085);gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,backgroundFog);
   #endif`);};
  m.customProgramCacheKey=()=> 'distant-rock-atmosphere-v1';group.add(new T.Mesh(g,m));geometries.push(g);materials.push(m);
  if(crowns.length){const tree=new T.IcosahedronGeometry(1,1),tm=new T.MeshLambertMaterial({color:0x455b32}),trees=new T.InstancedMesh(tree,tm,crowns.length),matrix=new T.Matrix4(),q=new T.Quaternion();crowns.forEach((c,i)=>{const h=3+random()*5;matrix.compose(new T.Vector3(c[0],c[1]+h*.55,c[2]),q,new T.Vector3(2+random()*3,h*.7,2+random()*3));trees.setMatrixAt(i,matrix);});group.add(trees);geometries.push(tree);materials.push(tm);}
 }
 return {dispose(){group.removeFromParent();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}

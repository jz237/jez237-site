import * as T from '../aquaclear-studio/vendor/three.module.js';
export function molded(material){
 material.roughness=.47;material.roughnessMap=null;material.metalness=.025;
 material.onBeforeCompile=s=>{s.vertexShader='varying vec3 finishPosition;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfinishPosition=position;');s.fragmentShader='varying vec3 finishPosition;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 float grain=fract(sin(dot(floor(finishPosition*600.),vec3(12.9898,78.233,43.765)))*43758.5453);float fade=1.-smoothstep(.002,.015,length(fwidth(finishPosition)));roughnessFactor=clamp(roughnessFactor+(grain-.5)*.075*fade,.25,.8);`);};material.customProgramCacheKey=()=> 'sand-molded-v2';return material;
}
export function bevelBox(w,h,d,r=.04){
 const shape=new T.Shape(),x=-w/2,z=-d/2;r=Math.min(r,w/3,h/3,d/3);
 shape.moveTo(x+r,z);shape.lineTo(x+w-r,z);shape.quadraticCurveTo(x+w,z,x+w,z+r);shape.lineTo(x+w,z+d-r);shape.quadraticCurveTo(x+w,z+d,x+w-r,z+d);shape.lineTo(x+r,z+d);shape.quadraticCurveTo(x,z+d,x,z+d-r);shape.lineTo(x,z+r);shape.quadraticCurveTo(x,z,x+r,z);
 const g=new T.ExtrudeGeometry(shape,{depth:Math.max(.001,h-r*2),bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r*.45,bevelThickness:r,curveSegments:6});g.rotateX(-Math.PI/2);g.translate(0,-h/2+r,0);g.computeVertexNormals();return g;
}
export function addFinishDetails(groups){
 const root=new T.Group(),steel=new T.MeshStandardMaterial({color:'#8eaaaa',metalness:.78,roughness:.39}),rubber=new T.MeshStandardMaterial({color:'#111b1c',roughness:.92});groups.stand.add(root);
 for(const x of [-2.17,2.36])for(const z of [-1.4,1.4]){const foot=new T.Mesh(new T.CylinderGeometry(.115,.14,.075,24),rubber);foot.position.set(x,.028,z);root.add(foot);const screw=new T.Mesh(new T.CylinderGeometry(.046,.046,.018,6),steel);screw.position.set(x,.212,z);root.add(screw);}
 for(const x of [-1.8,-1.35,2.05])for(let i=0;i<16;i++){const a=i/16*Math.PI*2,y=x===2.05?1.5:1.11;const rib=new T.Mesh(new T.BoxGeometry(.022,.075,.025),rubber);rib.position.set(x+Math.cos(a)*.18,y,Math.sin(a)*.18);rib.rotation.y=-a;groups[x===2.05?'outlet':'pump'].add(rib);}
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#0c1c21';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#819c99';ctx.lineWidth=3;ctx.strokeRect(7,7,498,114);ctx.fillStyle='#d8d6bf';ctx.font='24px Segoe UI';ctx.fillText('SAND ATELIER  /  034',25,47);ctx.font='16px Segoe UI';ctx.fillStyle='#9eb9b4';ctx.fillText('WATER-DRIVEN BIOLOGICAL REACTOR',25,80);ctx.fillText('EDUCATIONAL SECTION MODEL',25,104);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const plate=new T.Mesh(new T.PlaneGeometry(1.65,.4125),new T.MeshStandardMaterial({map:texture,roughness:.55,metalness:.15}));plate.position.set(.1,.217,1.05);plate.rotation.x=-Math.PI/2;groups.stand.add(plate);
}

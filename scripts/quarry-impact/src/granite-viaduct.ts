import * as T from 'three';
/** Original disused mountain railway: scenery only, north of the course. */
export function createGraniteViaduct(){
 const root=new T.Group();root.name='granite-railway-viaduct';
 const materials={stone:new T.MeshStandardMaterial({color:0x8c887a,roughness:1}),trim:new T.MeshStandardMaterial({color:0xb7ad97,roughness:.95}),steel:new T.MeshStandardMaterial({color:0x394244,metalness:.45,roughness:.7}),wood:new T.MeshStandardMaterial({color:0x62503b,roughness:1}),red:new T.MeshStandardMaterial({color:0x9a4e37,roughness:.8}),yellow:new T.MeshStandardMaterial({color:0xc9a34c,roughness:.8}),glass:new T.MeshStandardMaterial({color:0x405e68,roughness:.3}),roof:new T.MeshStandardMaterial({color:0x50564f,roughness:.9})};
 // World-space masonry stays consistent across piers and curved arch extrusions.
 materials.stone.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 viaductWorld;').replace('#include <project_vertex>', '#include <project_vertex>\nvec4 vp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nvp=instanceMatrix*vp;\n#endif\nviaductWorld=(modelMatrix*vp).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 viaductWorld;').replace('#include <color_fragment>', `#include <color_fragment>
   float row=floor(viaductWorld.y/1.5);
   vec2 block=vec2(viaductWorld.x/3.2+mod(row,2.0)*.5,viaductWorld.y/1.5);
   vec2 seam=abs(fract(block)-.5);
   float grout=max(smoothstep(.478,.494,seam.x),smoothstep(.478,.494,seam.y));
   float variation=fract(sin(dot(floor(block),vec2(127.1,311.7)))*43758.5453);
   diffuseColor.rgb*=mix(.9+variation*.18,.66,grout*.55);`);
 };
 materials.stone.customProgramCacheKey=()=> 'granite-viaduct-masonry-v1';
 type Finish=keyof typeof materials;
 const boxGeometry=new T.BoxGeometry(1,1,1),batches=new Map<Finish,T.Matrix4[]>(),bounds:T.Box3[]=[],dummy=new T.Object3D(),extras:T.Mesh[]=[];
 function box(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rz=0){dummy.position.set(x,y,z);dummy.rotation.set(0,0,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const b=batches.get(f)??[];b.push(dummy.matrix.clone());batches.set(f,b);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 const z=220;
 // Each voussoir is a wedge of a load-bearing semicircle, with a solid spandrel above.
 const arch=new T.Shape();arch.moveTo(-12,25);arch.absarc(0,25,12,Math.PI,0,true);arch.lineTo(12,46);arch.lineTo(-12,46);arch.closePath();
 const archGeometry=new T.ExtrudeGeometry(arch,{depth:10,bevelEnabled:false,curveSegments:18});archGeometry.translate(0,0,-5);archGeometry.computeBoundingBox();
 const arches=new T.InstancedMesh(archGeometry,materials.stone,7);
 for(let i=0;i<7;i++){
  const x=(i-3)*28,m=new T.Matrix4().makeTranslation(x,0,z);arches.setMatrixAt(i,m);bounds.push(archGeometry.boundingBox!.clone().applyMatrix4(m));
  // Radial trim blocks emphasize the arch shape from the track below.
  for(const side of [-1,1])for(let j=0;j<19;j++){const a=Math.PI*j/18;box(j%3?'trim':'stone',x+12.65*Math.cos(a),25+12.65*Math.sin(a),z+side*5.08,2,1.3,.35,a-Math.PI/2);}
 }
 arches.castShadow=arches.receiveShadow=true;arches.computeBoundingSphere();root.add(arches);
 for(let i=0;i<8;i++){const x=-98+i*28;box('stone',x,23,z,4,46,10);box('trim',x,1,z,6,2,12);for(const y of [10,20,30,40])box('trim',x,y,z,4.3,.35,10.3);}
 box('stone',0,47,z,204,2,11);box('trim',0,48.1,z,206,.3,11.6);
 // Abutments and stopped rails make the abandoned route terminate deliberately.
 for(const x of [-105,105]){box('stone',x,24,z,10,48,15);box('trim',x,48.2,z,11,.4,16);for(const zz of [-1.6,1.6])box('steel',x,49.1,z+zz,.5,1.5,.5);box('red',x,49.6,z,1,.5,5);}
 for(let x=-100;x<=100;x+=2)box('wood',x,48.45,z,.35,.3,5);
 for(const side of [-1,1]){
  box('steel',0,48.7,z+side*1.65,205,.22,.15);
  for(let x=-108;x<=108;x+=4)box('steel',x,49.1,z+side*5.5,.12,1.7,.12);
  for(const y of [48.9,49.8])box('steel',0,y,z+side*5.5,216,.12,.12);
 }
 // Three stored maintenance wagons with chassis, wheels, ladders and ballast loads.
 for(const x of [-28,-12,4]){
  box('steel',x,49.4,z,13,.6,4.5);box('red',x,51.1,z,12,2.8,4.2);box('stone',x,52.5,z,10.8,.25,3.4);
  for(const side of [-1,1]){for(const xx of [-4.3,4.3])box('steel',x+xx,49,z+side*1.9,1.7,1.1,.5);for(const xx of [-5,-2.5,0,2.5,5])box('yellow',x+xx,51.1,z+side*2.15,.12,2.8,.1);}
  box('steel',x+7.4,49.5,z,2,.3,.5);
 }
 // Signal cabin and a small maintenance crane give scale to the large masonry.
 box('wood',78,50.8,z,8,5,7);box('roof',78,53.6,z,9,.4,8);
 for(const x of [75.5,78,80.5])box('glass',x,51.8,z-3.55,1.8,1.6,.1);
 box('yellow',51,52,z,.5,7,.5);box('yellow',46,55.5,z,11,.5,.5);box('steel',41,52.7,z,.08,5.6,.08);box('steel',41,50,z,.8,.2,.8);
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#c9bd9d';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#38403b';ctx.font='bold 43px sans-serif';ctx.textAlign='center';ctx.fillText('GRANITE EXPRESS — EXPECT DELAYS',512,85);const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(65,8),new T.MeshStandardMaterial({map:tex,roughness:.9}));sign.position.set(0,43,z-5.3);sign.rotation.y=Math.PI;root.add(sign);extras.push(sign);
 }
 for(const[f,ms]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[f],ms.length);ms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.bounds=bounds;root.userData.pieces=bounds.length;let disposed=false;
 return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});boxGeometry.dispose();archGeometry.dispose();Object.values(materials).forEach(m=>m.dispose());for(const mesh of extras){mesh.geometry.dispose();const m=mesh.material as T.MeshStandardMaterial;m.map?.dispose();m.dispose();}root.clear();}};
}

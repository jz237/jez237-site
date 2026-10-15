import * as T from 'three';
import {FAIRGROUND as course} from './county-courses';
/** County-fair marquee and visitor courtyard; no racing or collision mutations. */
export function createMidway(){
 const root=new T.Group();root.name='county-fair-midway';const ox=55,oz=0,ground=Math.max(...[-17,17].flatMap(x=>[-17,17].map(z=>course.height(ox+x,oz+z))))+.08;
 const geometry=new T.BoxGeometry(1,1,1),colors={red:0xa7432e,cream:0xe8d5ad,wood:0x7a6747,steel:0x596363,dark:0x2d3b37,ochre:0xc89332,stone:0xa18e6d};type F=keyof typeof colors;
 const materials=Object.fromEntries(Object.entries(colors).map(([f,color])=>[f,new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide})])) as Record<F,T.MeshStandardMaterial>;
 const batches=new Map<F,T.Matrix4[]>(),extras:T.Mesh[]=[],textures:T.Texture[]=[],bounds:T.Box3[]=[],dummy=new T.Object3D();
 function box(f:F,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(ox+x,ground+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const ms=batches.get(f)??[];ms.push(dummy.matrix.clone());batches.set(f,ms);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 function beam(f:F,a:number[],b:number[],w=.08){const p=new T.Vector3(...a as[number,number,number]),q=new T.Vector3(...b as[number,number,number]),v=q.clone().sub(p);dummy.position.copy(p.add(q).multiplyScalar(.5)).add(new T.Vector3(ox,ground,oz));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(w,v.length(),w);dummy.updateMatrix();const ms=batches.get(f)??[];ms.push(dummy.matrix.clone());batches.set(f,ms);bounds.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 const triangles=new Map<F,number[]>();
 function mesh(vertices:number[],f:F){const list=triangles.get(f)??[];list.push(...vertices);triangles.set(f,list);const bound=new T.Box3();for(let i=0;i<vertices.length;i+=3)bound.expandByPoint(new T.Vector3(ox+vertices[i],ground+vertices[i+1],oz+vertices[i+2]));bounds.push(bound);}
 function sign(title:string,sub:string,x:number,y:number,z:number,w:number,h:number){if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#a4432f';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#e9d7af';ctx.lineWidth=12;ctx.strokeRect(10,10,1004,236);ctx.fillStyle='#f0e2c2';ctx.textAlign='center';ctx.font='bold 66px sans-serif';ctx.fillText(title,512,111,980);ctx.font='bold 31px sans-serif';ctx.fillText(sub,512,187,980);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);const g=new T.PlaneGeometry(w,h);g.rotateY(Math.PI);g.translate(ox+x,ground+y,oz+z);const m=new T.Mesh(g,new T.MeshStandardMaterial({map:t,roughness:1}));root.add(m);extras.push(m);}
 // Segmented canvas roof with gently bowed ribs and alternating red/cream gores.
 const roof=[[],[]] as number[][],walls=[[],[]] as number[][];
 for(let panel=0;panel<32;panel++){
  const a=panel*Math.PI/16,b=(panel+1)*Math.PI/16;
  const point=(angle:number,t:number)=>{const r=14.5*t;return[Math.cos(angle)*r,12-7.2*Math.pow(t,.72),Math.sin(angle)*r];};
  for(let ring=0;ring<8;ring++){const p=point(a,ring/8),q=point(b,ring/8),r=point(a,(ring+1)/8),s=point(b,(ring+1)/8);roof[panel%2].push(...p,...r,...q,...q,...r,...s);}
  const x=Math.cos(a)*14.5,z=Math.sin(a)*14.5;
  if(panel%2===0){beam('steel',[x,0,z],[x,5,z],.12);beam('cream',[x,4.8,z],[Math.cos(a)*18.5,.1,Math.sin(a)*18.5],.045);}
  // Leave a broad open entrance on the south side.
  if(Math.sin((a+b)/2)>-.86){const p=[Math.cos(a)*14.4,.15,Math.sin(a)*14.4],q=[Math.cos(b)*14.4,.15,Math.sin(b)*14.4],r=[p[0],4.8,p[2]],s=[q[0],4.8,q[2]];walls[panel%2].push(...p,...q,...r,...q,...s,...r);}
 }
 mesh(roof[0],'red');mesh(roof[1],'cream');mesh(walls[0],'red');mesh(walls[1],'cream');
 box('wood',0,-.9,0,32,2,32);box('dark',0,.15,0,28,.08,28);box('steel',0,6,0,.18,12,.18);box('steel',0,13,0,.08,3,.08);mesh([0,14.4,0,4,14,0,0,13.3,0],'ochre');
 sign('DENT COUNTY SOCIAL CLUB','REFRESHMENTS / REPAIRS / REGRETS',0,4.5,-15,13,3.25);
 for(let i=0;i<5;i++)box('wood',0,-.2-i*.25,-16.5-i*.6,9,.3,.7);
 // Two food kiosks flank the public entrance, with awnings and serving counters.
 for(const side of [-1,1]){const x=side*23;
  box('stone',x,-1.4,-13,8,2.8,7);box('red',x,.7,-13,7,1.4,5);box('cream',x,3.8,-13,8,.25,6);box('dark',x,2,-10.5,5,2,.12);
  for(const dx of [-3.3,3.3])for(const dz of [-2.3,2.3])box('wood',x+dx,2,-13+dz,.15,4,.15);
  for(let stripe=0;stripe<8;stripe++)box(stripe%2?'cream':'red',x-3.5+stripe,3.4,-16.5,.97,.13,2.5,-.18);
  box('wood',x,1.2,-16,7,.2,1.2);for(const dx of [-2,0,2])box('ochre',x+dx,1.5,-16,.45,.45,.4);
  sign(side<0?'BENT BURGERS':'CRUNCH TIME',side<0?'FLAME GRILLED / RACE TESTED':'HOT CHIPS / COLD COMFORT',x,3.2,-17,7,1.75);
 }
 // Picnic tables and cross-courtyard pennant strings add readable human scale.
 for(const x of [-10,10]){const base=course.height(ox+x,-24)-ground;box('wood',x,base+1,-24,5,.18,1.5);for(const side of [-1,1]){box('wood',x,base+.55,-24+side*1.3,5,.15,.55);for(const dx of [-1.7,1.7])box('steel',x+dx,base+.55,-24+side*.5,.1,1,.1,0,0,side*.4);}}
 const poleBase=course.height(ox-27,-23)-ground;box('wood',-27,(4.8+poleBase)/2,-23,.16,4.8-poleBase,.16);for(let i=0;i<18;i++){const x=-27+i*3,y=4.7-Math.sin(i/18*Math.PI)*1.1;beam('dark',[x,y,-23],[x+3,4.7-Math.sin((i+1)/18*Math.PI)*1.1,-23],.025);mesh([x,y,-23,x+1.5,y-.1,-23,x+.8,y-.95,-23],i%2?'red':'ochre');}
 const rightBase=course.height(ox+27,-23)-ground;box('wood',27,(4.8+rightBase)/2,-23,.16,4.8-rightBase,.16);
 for(const [f,vertices]of triangles){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.computeVertexNormals();g.translate(ox,ground,oz);const m=new T.Mesh(g,materials[f]);m.castShadow=m.receiveShadow=true;root.add(m);extras.push(m);}
 for(const [f,ms]of batches){const m=new T.InstancedMesh(geometry,materials[f],ms.length);ms.forEach((v,i)=>m.setMatrixAt(i,v));m.castShadow=m.receiveShadow=true;m.computeBoundingSphere();root.add(m);}
 root.userData.bounds=bounds;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());for(const m of extras){m.geometry.dispose();if(!Object.values(materials).includes(m.material as T.MeshStandardMaterial))(m.material as T.Material).dispose();}textures.forEach(t=>t.dispose());root.clear();}};
}

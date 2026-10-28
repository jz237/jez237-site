import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
import {createRaceMudTextures} from './race-mud';
import {withBarrierBoardsOf,boardSeed} from './barrier-boards';
import * as T from 'three';
import {createPhotoTrees,type PhotoTree} from './photo-trees';
import {MOORFIELD_SOLIDS} from './moorfield-speedbowl-arena';
import {freezeSceneryTransforms} from './render-work';
/** Moorfield Speedbowl: a raked-dirt stadium oval with grandstands along both straights,
 * floodlight towers, a start gantry and a grass surround. */
export function createMoorfieldWorld(){
 const root=new T.Group();root.name='moorfield_speedbowl';
 const materials=withBarrierBoardsOf({concrete:new T.MeshStandardMaterial({color:0xc2bba8,roughness:.97}),red:new T.MeshStandardMaterial({color:0xa8352c,roughness:.88}),steel:new T.MeshStandardMaterial({color:0x2f3639,roughness:.7,metalness:.35}),seat:new T.MeshStandardMaterial({color:0x2c5a7a,roughness:.85}),roof:new T.MeshStandardMaterial({color:0xd8d2c0,roughness:.8}),lamp:new T.MeshStandardMaterial({color:0xfff2cc,emissive:0xfff2cc,emissiveIntensity:1.3,roughness:.4}),cream:new T.MeshStandardMaterial({color:0xe6dcc0,roughness:.9}),tree:new T.MeshStandardMaterial({color:0x3e5a33,roughness:1})},'red',boardSeed('moorfield-speedbowl-v1'));
 const floorMaterial=new T.MeshStandardMaterial({color:0xffffff,roughness:1}),floorGeometry=new T.PlaneGeometry(160,100),apronGeometry=new T.PlaneGeometry(1600,1600),apronMaterial=new T.MeshStandardMaterial({color:0x5f7442,roughness:1}),boxGeometry=new T.BoxGeometry(),coneGeometry=new T.ConeGeometry(1,1,7),textures:T.Texture[]=[];
 const mud=createRaceMudTextures();textures.push(mud.diffuse,mud.normal,mud.roughness);for(const t of [mud.diffuse,mud.normal,mud.roughness])t.repeat.set(40,25);
 floorMaterial.map=mud.diffuse;floorMaterial.normalMap=mud.normal;floorMaterial.roughnessMap=mud.roughness;floorMaterial.color.set(0xb4a48e);floorMaterial.normalScale.setScalar(.5);
 const floor=new T.Mesh(floorGeometry,floorMaterial);floor.name='moorfield_dirt';floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;root.add(floor);
 const apron=new T.Mesh(apronGeometry,apronMaterial);apron.name='moorfield_grass';apron.rotation.x=-Math.PI/2;apron.position.y=-.03;apron.receiveShadow=true;root.add(apron);
 const batches=new Map<string,{geometry:T.BufferGeometry;list:T.Matrix4[]}>(),matrix=new T.Matrix4(),q=new T.Quaternion(),up=new T.Vector3(0,1,0);
 const put=(geometry:T.BufferGeometry,finish:string,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0)=>{q.setFromAxisAngle(up,yaw);matrix.compose(new T.Vector3(x,y,z),q,new T.Vector3(w,h,d));const key=(geometry===coneGeometry?'cone:':'box:')+finish,b=batches.get(key)??{geometry,list:[]};b.list.push(matrix.clone());batches.set(key,b);};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:string,yaw=0)=>put(boxGeometry,finish,x,y,z,w,h,d,yaw);
 // Walls: red blocks carry the sponsor boards.
 for(const s of MOORFIELD_SOLIDS)box(s.x,s.y,s.z,s.half[0]*2,s.half[1]*2,s.half[2]*2,s.material==='red'?'boards':'concrete',s.yaw);
 // Grandstands along both straights, five rows each, with roofs and a crowd.
 const spectators:SpectatorPlace[]=[];
 for(const side of [-1,1]){
  for(let row=0;row<5;row++){const z=side*(41+row*1.8),y=.6+row*.75;box(0,y/2,z,64,y,1.8,'concrete');box(0,y+.22,z,62,.28,.6,'seat');
   for(let x=-29;x<=29;x+=2.1){if((Math.round(x*10)+row)%5===0)continue;spectators.push({x:x+(row%2)*.7,y,z,yaw:side>0?Math.PI:0,seated:(Math.round(x)+row)%4!==0});}}
  for(const x of [-30,-15,0,15,30])box(x,4.6,side*49.5,.3,9.2,.3,'steel');
  box(0,9.4,side*45.5,66,.3,10,'roof');box(0,7.6,side*50.6,66,3.6,.3,'cream');
 }
 // Floodlight towers around the bowl and a start gantry over turn one.
 for(const [x,z] of [[-62,-38],[62,-38],[-62,38],[62,38],[-78,0],[78,0]]){const yaw=Math.atan2(-x,-z);box(x,11,z,.5,22,.5,'steel');box(x,22.3,z,5,1.6,.5,'steel',yaw);for(const d of [-1.6,0,1.6])box(x+d*Math.cos(yaw),22.3,z-d*Math.sin(yaw),1.2,1.1,.12,'lamp',yaw);}
 for(const z of [-36.5,36.5])box(58,4,z,.4,8,.4,'steel');box(58,8.2,0,.6,.8,74,'steel');
 // Pit hut, tyre heaps and a ring of trees on the skyline.
 box(-90,2,0,8,4,22,'cream');box(-90,4.3,0,9,.4,23,'red');
 let seed=17;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const belt:PhotoTree[]=[];
 for(let i=0;i<80;i++){const a=i/80*Math.PI*2,r=120+rand()*50,h=8+rand()*8;belt.push({kind:i%4===0?'maple':i%2?'spruce':'hemlock',x:Math.sin(a)*r*1.3,y:0,z:Math.cos(a)*r,height:h*1.05,tint:.9+(i%5)*.04});}
 const forest=createPhotoTrees(belt,'moorfield_trees');root.add(forest.root);
 const signGeometry=new T.PlaneGeometry(24,3.4),signMaterial=new T.MeshStandardMaterial({color:0xeee6cc,roughness:.85,side:T.DoubleSide});
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=146;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#7a2a22';ctx.fillRect(0,0,1024,146);ctx.strokeStyle='#f2d9a0';ctx.lineWidth=8;ctx.strokeRect(6,6,1012,134);ctx.fillStyle='#fbefd2';ctx.textAlign='center';ctx.font='bold 72px sans-serif';ctx.fillText('MOORFIELD SPEEDBOWL',512,98);const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;textures.push(t);signMaterial.map=t;}
 }
 const sign=new T.Mesh(signGeometry,signMaterial);sign.name='moorfield_sign';sign.position.set(58,9.4,0);sign.rotation.y=-Math.PI/2;root.add(sign);
 for(const [key,{geometry,list}] of batches){const finish=key.split(':')[1];const mesh=new T.InstancedMesh(geometry,materials[finish as keyof typeof materials],list.length);list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='moorfield_'+key.replace(':','_');mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const crowd=createVenueCrowd(spectators);root.add(crowd.root);
 root.userData.solidRecords=MOORFIELD_SOLIDS;freezeSceneryTransforms(root);
 let disposed=false;return{root,update:crowd.update,dispose(){if(disposed)return;disposed=true;forest.dispose();crowd.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});[floorGeometry,apronGeometry,boxGeometry,coneGeometry,signGeometry].forEach(g=>g.dispose());[floorMaterial,apronMaterial,signMaterial,...Object.values(materials)].forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}

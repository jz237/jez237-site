import * as T from 'three';
import {addClassicPanelBackings} from './classic-panel-backings';
import {addClassicBayClosures,addMuscleEngineBay} from './classic-engine-bay';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';

export const MUSCLE_TEXTURES = {Rim:'Alloy_01',Tyre:'Tyre_Tile',Interior:'Interior',FrontLights:'Headlight',RearLights:'RearLight',Grille:'Grille',Badge:'Badge',License:'License',Underside:'Underside'} as const;
type Vertex={p:T.Vector3;n:T.Vector3;uv:T.Vector2};
const planes:[number,number][]=[[0,-.72],[0,.72],[1,.84],[1,1.23],[2,-1.68],[2,-.82],[2,.72]];

// Clip entire triangles, interpolating all attributes. Classifying only their
// centres leaves long triangles spanning two independently moving assemblies.
function cut(polygon:Vertex[],axis:number,at:number,sign:number):Vertex[]{
  const result:Vertex[]=[];
  for(let i=0;i<polygon.length;i++){
    const a=polygon[i],b=polygon[(i+1)%polygon.length];
    const da=(a.p.getComponent(axis)-at)*sign,db=(b.p.getComponent(axis)-at)*sign;
    if(da>=0)result.push(a);
    if((da<0&&db>0)||(da>0&&db<0)){
      const t=da/(da-db);
      result.push({p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize(),uv:a.uv.clone().lerp(b.uv,t)});
    }
  }
  return result;
}
function panelAt(p:T.Vector3){
  const side=p.x<0?'L':'R';
  if(p.y>1.23)return 'BodyRoof';
  if(p.z>.72)return Math.abs(p.x)<.72?(p.y>.84?'hood':'FrontValance'):'FrontFender'+side;
  if(p.z<-.82)return p.z< -1.68&&Math.abs(p.x)<.72?'BodyTrunk':'RearQuarter'+side;
  return Math.abs(p.x)>.72?'BodyDoor'+side:'BodyCabin';
}
function trimAt(p:T.Vector3,name:string){
  if(name==='Interior'||name==='Underside'||name==='WheelViewBlocker')return 'detail';
  if(p.y<.78&&p.z>2.12)return 'bumper_front';
  if(p.y<.78&&p.z< -2.12)return 'bumper_rear';
  if(Math.abs(p.x)>.7&&p.z>=-.82&&p.z<=.72&&p.y>.55)return 'BodyDoor'+(p.x<0?'L':'R')+'Trim';
  if(Math.abs(p.x)<.72&&p.z>.72&&p.y>.84)return 'hoodTrim';
  return 'detail';
}
function material(name:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>){
  const glass=name==='Glass',paint=name==='Body',chrome=name==='Chrome'||name==='Rim';
  const label=paint?'paint BrightRetro Body':glass?'Classic Glass':name==='Tyre'?'Classic Tire':name==='FrontLights'?'Classic Headlight':name==='RearLights'?'Classic Brakelight':name==='Interior'?'Interior BrightRetro':name;
  return new T.MeshPhysicalMaterial({name:label,color:paint?0xaf542b:glass?0x293b43:['BlackPlastic','WheelViewBlocker'].includes(name)?0x161919:0xffffff,
    map:textures[name as keyof typeof MUSCLE_TEXTURES]??null,metalness:paint?.48:chrome?.9:0,
    roughness:paint?.28:chrome?.22:glass?.08:.8,clearcoat:paint?1:0,
    transparent:glass,opacity:glass?.55:1,depthWrite:!glass,side:glass?T.DoubleSide:T.FrontSide});
}

/** Candidate import for the author-released CC-BY model. Units remain metres;
 * consumers must use its measured wheel centres rather than stretch the body.
 * Production integration is deliberately separate from this asset conversion. */
export function buildMuscleAsset(obj:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={}){
  const source=new OBJLoader().parse(obj.split(/\r?\n/).filter(l=>!l.startsWith('l ')).join('\n'));
  const root=new T.Group();root.name='Bramble V8 asset candidate';
  root.userData.attribution='Muscle Car 3D Model by BrightRetro · CC-BY-3.0';
  const materials=new Map<string,T.Material>();let serial=0;
  source.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    const original=o.geometry,geometry=toCreasedNormals(original,Math.PI/3);
    geometry.rotateY(Math.PI);
    const p=geometry.getAttribute('position') as T.BufferAttribute,n=geometry.getAttribute('normal') as T.BufferAttribute,uv=geometry.getAttribute('uv') as T.BufferAttribute|undefined;
    const ms=Array.isArray(o.material)?o.material:[o.material];
    const wheel=ms.some(m=>m.name==='Tyre');let parent:T.Object3D=root;
    if(wheel){const bounds=new T.Box3().setFromBufferAttribute(p),centre=bounds.getCenter(new T.Vector3());
      const group=new T.Group();group.name='wheel_'+(centre.z>0?'F':'R')+(centre.x<0?'L':'R');group.position.copy(centre);root.add(group);parent=group;
    }
    const batches=new Map<string,{name:string;material:T.Material;position:number[];normal:number[];uv:number[]}>();
    const groups=geometry.groups.length?geometry.groups:[{start:0,count:p.count,materialIndex:0}];
    for(const group of groups){
      const sourceMaterial=ms[group.materialIndex??0],name=sourceMaterial.name;
      if(!materials.has(name))materials.set(name,material(name,textures));
      for(let i=group.start;i<group.start+group.count;i+=3){
        let polygons=[Array.from({length:3},(_,j)=>({p:new T.Vector3().fromBufferAttribute(p,i+j),n:new T.Vector3().fromBufferAttribute(n,i+j),uv:uv?new T.Vector2().fromBufferAttribute(uv,i+j):new T.Vector2()}))];
        if(!wheel&&name!=='Interior'&&name!=='Underside'&&name!=='WheelViewBlocker')for(const [axis,at]of planes)polygons=polygons.flatMap(poly=>{
          const values=poly.map(v=>v.p.getComponent(axis));
          return Math.min(...values)<at&&Math.max(...values)>at?[cut(poly,axis,at,-1),cut(poly,axis,at,1)].filter(q=>q.length>=3):[poly];
        });
        for(const poly of polygons){
          const centre=poly.reduce((v,a)=>v.add(a.p),new T.Vector3()).divideScalar(poly.length);
          const part=wheel?'Wheel':name==='Body'?panelAt(centre):name==='Glass'?(Math.abs(centre.x)>.55?(centre.z>=-.82&&centre.z<=.72?'BodyDoor':'Quarter')+(centre.x<0?'L':'R'):centre.z>0?'Windshield':'Rear'):trimAt(centre,name);
          const key=part+':'+name;
          if(!batches.has(key))batches.set(key,{name:(name==='Glass'?'glass_':name==='Body'||part!=='detail'&&part!=='Wheel'?'panel_':'')+part+'_'+serial++,material:materials.get(name)!,position:[],normal:[],uv:[]});
          const batch=batches.get(key)!;
          for(let j=1;j<poly.length-1;j++){
            const tri=[poly[0],poly[j],poly[j+1]];
            if(tri[1].p.clone().sub(tri[0].p).cross(tri[2].p.clone().sub(tri[0].p)).lengthSq()<1e-18)continue;
            for(const v of tri){batch.position.push(...v.p.clone().sub(parent.position).toArray());batch.normal.push(...v.n.toArray());batch.uv.push(...v.uv.toArray());}
          }
        }
      }
    }
    for(const b of batches.values()){if(!b.position.length)continue;const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(b.position,3));g.setAttribute('normal',new T.Float32BufferAttribute(b.normal,3));g.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));const mesh=new T.Mesh(g,b.material);mesh.name=b.name;mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);}
    geometry.dispose();if(geometry!==original)original.dispose();
  });
  root.updateMatrixWorld(true);
  const wheels=root.children.filter(o=>o.name.startsWith('wheel_'));
  for(const child of [...root.children])if(child instanceof T.Mesh&&(child.material as T.Material).name==='WheelViewBlocker'){
    const centre=new T.Box3().setFromObject(child).getCenter(new T.Vector3());
    const nearest=[...wheels].sort((a,b)=>a.position.distanceToSquared(centre)-b.position.distanceToSquared(centre))[0];
    nearest?.attach(child);
  }
  root.updateMatrixWorld(true);return root;
}

/** Retain the body proportions; fit a 375 mm tire and centre the axle midpoint.
 * Added inner structure is only exposed when the outer panels are damaged. */
export function buildPlayableMuscleAsset(obj:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={}){
  const root=buildMuscleAsset(obj,textures);root.name='BRAMBLE V8';
  for(const child of root.children){
    if(child.name.startsWith('wheel_')){
      child.position.set(child.position.x<0?-.79:.79,.3400195,child.position.z>0?1.41:-1.41);
      child.scale.set(1,.375/.3400195,.375/.3400195);
    }else if(child instanceof T.Mesh)child.geometry.translate(0,0,-.015);
  }
  const steel=new T.MeshStandardMaterial({name:'Classic Chassis Steel',color:0x343a39,roughness:.66,metalness:.65});
  const vinyl=new T.MeshStandardMaterial({name:'Interior Door Vinyl',color:0x292825,roughness:.9});
  const box=(name:string,size:[number,number,number],position:[number,number,number],material:T.Material)=>{
    const g=new T.BoxGeometry(...size).toNonIndexed(),mesh=new T.Mesh(g,material);mesh.name=name;mesh.position.set(...position);root.add(mesh);return mesh;
  };
  addMuscleEngineBay(root,steel);
  addClassicBayClosures(root);
  for(const side of [-1,1])box('panel_BodyDoor'+(side<0?'L':'R')+'Interior',[.035,.31,1.28],[side*.77,.75,-.065],vinyl);
  addClassicPanelBackings(root);
  root.updateMatrixWorld(true);return root;
}

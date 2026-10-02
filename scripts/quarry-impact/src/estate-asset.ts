import * as T from 'three';
import {addClassicPanelBackings} from './classic-panel-backings';
import {addClassicBayClosures} from './classic-engine-bay';
import {buildMuscleAsset,MUSCLE_TEXTURES} from './muscle-asset';
import {partitionSurface,type SurfacePlane} from './surface-partition';
import {classicWindowFrame} from './classic-window-frame';
import {addEstateFront} from './estate-front';
import {addEstateRear} from './estate-rear';
import {stampedPanel} from './classic-panel';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Original long-roof/four-door conversion of BrightRetro's CC-BY 3.0 body.
 * This remains a reviewed asset candidate until its dimensions are integrated. */
export function buildEstateAsset(obj:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={}){
  const donor=buildMuscleAsset(obj,textures),root=new T.Group();root.name='MILLHAVEN ESTATE candidate';
  root.userData.attribution='Body derived from Muscle Car 3D Model by BrightRetro, CC-BY 3.0; original estate conversion for Quarry Impact';
  const paint=new T.MeshPhysicalMaterial({name:'paint Estate Body',color:0x739080,roughness:.28,metalness:.48,clearcoat:1,clearcoatRoughness:.12});
  const rubber=new T.MeshStandardMaterial({name:'Estate Window Seal',color:0x181c1b,roughness:.85});
  const chrome=new T.MeshStandardMaterial({name:'Estate Chrome',color:0xb8beb9,roughness:.25,metalness:.92});
  const vinyl=new T.MeshStandardMaterial({name:'Interior Estate Vinyl',color:0x322d26,roughness:.9});
  const glass=new T.MeshPhysicalMaterial({name:'Classic Glass',color:0x293b43,transparent:true,opacity:.55,roughness:.08,metalness:.15,side:T.DoubleSide,depthWrite:false});
  let serial=0;
  const mesh=(name:string,g:T.BufferGeometry,m:T.Material)=>{const geometry=g.index?g.toNonIndexed():g;if(geometry!==g)g.dispose();const o=new T.Mesh(geometry,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
  const box=(name:string,size:[number,number,number],at:[number,number,number],m:T.Material)=>{const o=mesh(name,new T.BoxGeometry(...size).toNonIndexed(),m);o.position.set(...at);return o;};
  const planes:SurfacePlane[]=[[0,-.80],[0,.80],[0,-.72],[0,-.65],[0,.65],[0,.72],[1,.82],[1,.84],[1,.98],[1,1.03],[1,1.10],[1,1.30],[2,-2.18],[2,-1.40],[2,-.82],[2,-.60],[2,-.38],[2,.72],[2,2.05]];
  for(const child of [...donor.children]){
    if(child.name.startsWith('wheel_')){root.add(child);continue;}
    if(!(child instanceof T.Mesh))continue;
    const mat=child.material as T.Material,body=mat.name.startsWith('paint'),window=child.name.startsWith('glass_');
    if(window||['Grille','Classic Headlight','Classic Brakelight','Badge'].includes(mat.name)||child.name.startsWith('panel_bumper_front')||child.name.startsWith('panel_bumper_rear')||child.name.startsWith('panel_hood')){child.geometry.dispose();continue;}
    const interior=mat.name.startsWith('Interior')||mat.name==='Underside';
    for(const part of partitionSurface(child.geometry,planes,p=>{
      if(!interior&&p.z<.72&&p.y>1.03)return null;
      if(!interior&&p.z>2.05)return null;
      if(!interior&&p.z< -2.18)return null;
      if(body&&p.z>.72&&Math.abs(p.x)<.72&&p.y>.84)return null;
      if(interior&&(p.y>1.30||p.y>1.10&&(Math.abs(p.x)>.65||p.z<-.60)))return null;
      if(['Chrome','BlackPlastic'].includes(mat.name)&&Math.abs(p.x)>.80&&p.y>.82&&p.z>-.82&&p.z<.72)return null;
      if(body&&p.z<-.38&&Math.abs(p.x)<.72&&p.y>.98)return null;
      const side=p.x<0?'L':'R';
      if(!interior&&Math.abs(p.x)>.72&&p.z<.72&&p.z> -1.40){
        return 'panel_BodyDoor'+(p.z<-.38?'Rear':'')+side+(body?'':'Trim');
      }
      if(body)return p.z>.72?(Math.abs(p.x)<.72?(p.y>.84?'panel_hood':'panel_FrontValance'):'panel_FrontFender'+side):'panel_RearQuarter'+side;
      return child.name;
    }))mesh(part.name+'_'+serial++,part.geometry,body?paint:mat);
    child.geometry.dispose();
  }
  addEstateFront(root,paint,chrome,rubber);
  // Fixed inner structure remains visible when the hood or bumper folds away.
  // It sits below the source skin and does not travel with detachable panels.
  const steel=new T.MeshStandardMaterial({name:'Estate Chassis Steel',color:0x292f2e,roughness:.68,metalness:.62});
  const engineMetal=new T.MeshStandardMaterial({name:'Estate Engine Alloy',color:0x696b65,roughness:.43,metalness:.72});
  box('Structure engine block',[.56,.27,.67],[0,.59,1.34],steel);
  for(const side of [-1,1]){
    const cover=mesh('Structure valve cover '+side,new RoundedBoxGeometry(.20,.12,.65,3,.035),engineMetal);cover.position.set(side*.24,.755,1.34);cover.rotation.z=side*.18;
    box('Structure chassis rail '+side,[.11,.12,3.75],[side*.56,.50,-.015],steel);
    box('Structure engine bay side '+side,[.045,.30,1.12],[side*.66,.63,1.36],steel);
    box('Structure rear cargo rail '+side,[.075,.11,.75],[side*.54,.53,-1.93],steel);
  }
  const airCleaner=mesh('Structure air cleaner',new T.CylinderGeometry(.21,.22,.075,24),steel);airCleaner.position.set(0,.815,1.30);
  box('Structure radiator',[1.1,.34,.08],[0,.61,2.025],steel);
  box('Structure firewall',[1.30,.36,.045],[0,.65,.77],steel);
  box('Structure radiator top',[1.22,.05,.15],[0,.82,2.025],engineMetal);
  for(let i=0;i<17;i++)box('Structure radiator fin '+i,[.028,.26,.012],[-.48+i*.06,.61,2.072],engineMetal);
  const cabinPartsStart=root.children.length;
  // A gridded crown retains deformable interior vertices. Map the square
  // corner patches to rounded corners while preserving a closed lower skin.
  const roofGeometry=stampedPanel(1.44,2.38,.032,.045),roofPositions=roofGeometry.getAttribute('position');
  const halfWidth=.72,halfLength=1.19,radius=.16;
  for(let i=0;i<roofPositions.count;i++){
    const x=roofPositions.getX(i),z=roofPositions.getZ(i);
    const dx=Math.max(0,Math.abs(x)-(halfWidth-radius)),dz=Math.max(0,Math.abs(z)-(halfLength-radius));
    if(dx&&dz){
      roofPositions.setX(i,Math.sign(x)*(halfWidth-radius+dx*Math.sqrt(1-.5*(dz/radius)**2)));
      roofPositions.setZ(i,Math.sign(z)*(halfLength-radius+dz*Math.sqrt(1-.5*(dx/radius)**2)));
    }
  }
  roofGeometry.computeVertexNormals();
  const roof=mesh('panel_BodyRoof',roofGeometry,paint);roof.position.set(0,1.49,-.965);
  const pane=(name:string,corners:T.Vector3[],material:T.Material,side=1,bow=.012)=>{
    const positions:number[]=[],uv:number[]=[],indices:number[]=[],n=corners[0].distanceTo(corners[1])>=corners[0].distanceTo(corners[3])?8:1,rows=n===8?1:8;
    const normal=corners[1].clone().sub(corners[0]).cross(corners[3].clone().sub(corners[0])).normalize().multiplyScalar(side);
    for(let y=0;y<=rows;y++)for(let x=0;x<=n;x++){const u=x/n,v=y/rows,p=corners[0].clone().lerp(corners[1],u).lerp(corners[3].clone().lerp(corners[2],u),v).addScaledVector(normal,bow*Math.sin(u*Math.PI)*Math.sin(v*Math.PI));positions.push(...p.toArray());uv.push(u,v);}
    for(let y=0;y<rows;y++)for(let x=0;x<n;x++){const a=y*(n+1)+x;indices.push(...(side>0?[a,a+1,a+n+2,a,a+n+2,a+n+1]:[a,a+n+2,a+1,a,a+n+1,a+n+2]));}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return mesh(name,flat,material);
  };
  const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
  const window=(name:string,corners:T.Vector3[],side=1)=>{
    const parts=classicWindowFrame(corners,side);
    mesh('glass_'+name,parts.glass,glass);mesh('panel_'+name+'WindowFrame',parts.frame,paint);
    mesh('panel_'+name+'WindowSeal',parts.seal,rubber);mesh('panel_'+name+'WindowTrim',parts.trim,chrome);
  };
  window('Windshield',[V(-.78,1.035,.78),V(.78,1.035,.78),V(.69,1.475,.24),V(-.69,1.475,.24)]);
  window('TailgateRear',[V(-.69,1.475,-2.12),V(.69,1.475,-2.12),V(.80,1.025,-2.35),V(-.80,1.025,-2.35)]);
  const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,material:T.Material)=>{const g=new T.CylinderGeometry(r,r,a.distanceTo(b),8).toNonIndexed(),o=mesh(name,g,material);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V(0,1,0),b.clone().sub(a).normalize());return o;};
  for(const side of [-1,1]){
    const suffix=side<0?'L':'R',x=side*.835,upper=side*.72;
    const lower=(z:number)=>side*(.835-.055*T.MathUtils.smoothstep(Math.abs(z),1.40,2.40));
    const pillar=(name:string,bottom:number,top:number,width:number)=>pane(name,[V(lower(bottom),1.01,bottom+width/2),V(upper,1.495,top+width/2),V(upper,1.495,top-width/2),V(lower(bottom),1.01,bottom-width/2)],paint,-side,.004);
    pillar('panel_APillar'+suffix,.79,.25,.06);pillar('panel_BPillar'+suffix,-.38,-.38,.06);pillar('panel_CPillar'+suffix,-1.40,-1.40,.07);pillar('panel_DPillar'+suffix,-2.35,-2.12,.12);
    window('BodyDoor'+suffix,[V(x,1.025,.75),V(upper,1.48,.225),V(upper,1.48,-.35),V(x,1.025,-.35)],-side);
    window('BodyDoorRear'+suffix,[V(x,1.025,-.415),V(upper,1.48,-.415),V(upper,1.48,-1.36),V(x,1.025,-1.36)],-side);
    window('Cargo'+suffix,[V(lower(-1.45),1.025,-1.45),V(upper,1.48,-1.45),V(upper,1.48,-2.055),V(lower(-2.29),1.025,-2.29)],-side);
    bar('panel_RoofGutter'+suffix,V(upper,1.485,.24),V(upper,1.485,-2.12),.009,chrome);
    for(const [name,a,b]of [['BodyDoor',.74,-.35],['BodyDoorRear',-.42,-1.36],['RearQuarter',-1.45,-2.35]]as const){
      pane('panel_'+name+suffix+'Shoulder',[V(lower(a)+side*.025,.965,a),V(lower(a),1.035,a),V(lower(b),1.035,b),V(lower(b)+side*.025,.965,b)],paint,-side,.004);
    }
    const mirror=mesh('panel_BodyDoor'+suffix+'Mirror',new RoundedBoxGeometry(.14,.09,.18,2,.022),paint);mirror.position.set(side*.91,1.10,.61);
    for(const [label,z]of [['BodyDoor',-.25],['BodyDoorRear',-1.25]]as const){box('panel_'+label+suffix+'Handle',[.038,.028,.14],[side*.866,.925,z],chrome);box('panel_'+label+suffix+'Interior',[.035,.31,.77],[side*.74,.80,z+.31],vinyl);}
    for(const z of [-1.83,-.16])box('panel_RackFoot'+suffix+z,[.045,.065,.09],[side*.58,1.565,z],rubber);
    bar('panel_RoofRack'+suffix,V(side*.58,1.61,-1.92),V(side*.58,1.61,-.08),.014,chrome);
  }
  for(const z of [-1.81,-.18])box('panel_RackCrossbar'+z,[1.19,.024,.04],[0,1.61,z],chrome);
  box('Interior Estate cargo floor',[1.57,.06,1.00],[0,.66,-1.71],vinyl);
  box('Interior Estate rear bench',[1.48,.15,.47],[0,.70,-.92],vinyl);
  const seat=box('Interior Estate rear seat back',[1.48,.46,.10],[0,.91,-1.15],vinyl);seat.rotation.x=-.10;
  addEstateRear(root,paint,chrome,rubber);
  // Keep all new cabin details on one swept profile. A raised belt, lower roof
  // and narrower ends give the estate a continuous shoulder-to-roof silhouette.
  // Bake in world coordinates so individual damage assemblies retain their names.
  root.updateMatrixWorld(true);
  for(const child of root.children.slice(cabinPartsStart)){
    if(!(child instanceof T.Mesh))continue;
    const g=child.geometry,p=g.getAttribute('position'),inverse=child.matrixWorld.clone().invert();
    for(let i=0;i<p.count;i++){
      const v=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(child.matrixWorld);
      if(v.y>1.01){
        const height=T.MathUtils.smoothstep(v.y,1.01,1.49);
        const endTaper=.025*T.MathUtils.smoothstep(Math.abs(v.z+.94),.72,1.20);
        v.x*=1-height*(.025+endTaper)/.72;
        if(v.y<=1.49)v.y=1.01+(v.y-1.01)*.865+.034*Math.sin(Math.PI*(v.y-1.01)/.48);
        else v.y-=.065;
      }
      v.applyMatrix4(inverse);p.setXYZ(i,v.x,v.y,v.z);
    }
    g.computeVertexNormals();child.geometry=toCreasedNormals(g,Math.PI/3);
    if(child.geometry!==g)g.dispose();child.geometry.computeBoundingBox();child.geometry.computeBoundingSphere();
  }
  addClassicBayClosures(root);
  addClassicPanelBackings(root);
  root.updateMatrixWorld(true);return root;
}

/** Use the donor's measured axle centres with the production suspension radius. */
export function buildPlayableEstateAsset(obj:string,textures:Partial<Record<keyof typeof MUSCLE_TEXTURES,T.Texture>>={}){
  const root=buildEstateAsset(obj,textures);root.name='MILLHAVEN ESTATE';
  for(const child of root.children){
    if(child.name.startsWith('wheel_')){
      child.position.set(child.position.x<0?-.79:.79,.3400195,child.position.z>0?1.41:-1.41);
      child.scale.set(1,.375/.3400195,.375/.3400195);
    }else child.position.z-=.015;
  }
  root.updateMatrixWorld(true);return root;
}

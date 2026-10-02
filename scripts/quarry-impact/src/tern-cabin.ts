import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
type Profile={w:number;h:number;r:number;depth:number};

/** Closed upholstery and mouldings: rounded contours follow the padding's
 * cross-section, including raised bolsters and the recessed fabric insert. */
function padded(profiles:Profile[],cornerSteps=2){
 const points:number[]=[],uv:number[]=[],indices:number[]=[],n=4*(cornerSteps+1);
 for(const row of profiles)for(let c=0;c<4;c++)for(let i=0;i<=cornerSteps;i++){
  const a=(c*90+i*90/cornerSteps)*Math.PI/180,sx=c===0||c===3?1:-1,sy=c<2?1:-1,r=Math.min(row.r,Math.min(row.w,row.h)*.46);
  const x=sx*(row.w/2-r)+r*Math.cos(a),y=sy*(row.h/2-r)+r*Math.sin(a);
  points.push(x,y,row.depth);uv.push(x/row.w+.5,y/row.h+.5);
 }
 for(let row=0;row<profiles.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n;indices.push(a,b,b+n,a,b+n,a+n);}
 for(const [row,front]of [[0,false],[profiles.length-1,true]] as const){const centre=points.length/3;points.push(0,0,profiles[row].depth);uv.push(.5,.5);for(let i=0;i<n;i++)indices.push(...(front?[row*n+i,row*n+(i+1)%n,centre]:[row*n+(i+1)%n,row*n+i,centre]));}
 if(profiles[0].depth>profiles.at(-1)!.depth)for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return flat;
}
function dashShell(){
 const section=[[.912,.388],[.934,.338],[1.011,.338],[1.039,.381],[1.035,.588],[1.010,.608],[.946,.601],[.912,.548]],xs=[-.687,-.48,.48,.687];
 const points:number[]=[],uv:number[]=[],indices:number[]=[],n=section.length;
 for(const x of xs)for(const [y,z]of section){const end=Math.max(0,(Math.abs(x)-.48)/.207);points.push(x,y-.012*end,z+.022*end);uv.push(x+.687,z);}
 for(let row=0;row<xs.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n;indices.push(a,b,b+n,a,b+n,a+n);}
 // The section is convex; fan caps close both ends of the padded dash.
 for(const [row,reverse]of [[0,true],[xs.length-1,false]] as const)for(let i=1;i<n-1;i++)indices.push(...(reverse?[row*n,row*n+i+1,row*n+i]:[row*n,row*n+i,row*n+i+1]));
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();const flat=g.toNonIndexed();g.dispose();return flat;
}

export function refineTernCabin(root:T.Group,m:{cloth:T.Material;vinyl:T.Material;rubber:T.Material;steel:T.Material;alloy:T.Material}){
 const {cloth,vinyl,rubber,steel,alloy}=m;
 const add=(name:string,g:T.BufferGeometry,material:T.Material,x=0,y=0,z=0)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,material);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,material:T.Material)=>add(name,new T.BoxGeometry(w,h,d),material,x,y,z);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,material:T.Material,segments=6)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),segments),material);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 for(const o of [...root.children])if(/^Interior Tern (seat |headrest |rear bench$|rear backrest$|dashboard$|instrument hood$|steering rim$|steering spoke$)/.test(o.name)){o.removeFromParent();if(o instanceof T.Mesh)o.geometry.dispose();}
 const padding=(w:number,h:number,depth:number):Profile[]=>[{w:w*.94,h:h*.94,r:.038,depth:-depth/2},{w,h,r:.045,depth:depth*.25},{w:w*.90,h:h*.90,r:.049,depth:depth/2}];
 for(const side of [-1,1]){
  const x=side*.343;
  for(const rail of [-.15,.15])box('Structure Tern seat runner '+side+' '+rail,x+rail,.456,-.166,.027,.114,.36,steel);
  const cushion=add('Interior Tern seat cushion '+side,padded([{w:.43,h:.44,r:.055,depth:-.07},{w:.48,h:.49,r:.062,depth:.014},{w:.344,h:.392,r:.055,depth:.035},{w:.30,h:.34,r:.05,depth:0}]),cloth,x,.582,-.166);cushion.rotation.x=-Math.PI/2;
  const back=add('Interior Tern seat back '+side,padded([{w:.43,h:.427,r:.05,depth:-.069},{w:.48,h:.465,r:.063,depth:.020},{w:.348,h:.375,r:.06,depth:.084},{w:.302,h:.335,r:.06,depth:.031}]),cloth,x,.818,-.414);back.rotation.x=-.14;
  const head=add('Interior Tern headrest '+side,padded(padding(.235,.131,.09),1),vinyl,x,1.129,-.463);head.rotation.x=-.14;
  for(const offset of [-.075,.075])bar('Interior Tern headrest post '+side+' '+offset,v(x+offset,1.015,-.454),v(x+offset,1.085,-.466),.006,alloy,4);
  for(const offset of [-.091,0,.091]){
   const pleat=add('Interior Tern seat back seam '+side+' '+offset,new T.PlaneGeometry(.0025,.276),vinyl,x+offset,.816,-.381);pleat.rotation.x=-.14;
   add('Interior Tern seat cushion seam '+side+' '+offset,new T.PlaneGeometry(.0025,.276),vinyl,x+offset,.584,-.166).rotation.x=-Math.PI/2;
  }
  box('Interior Tern seat buckle '+side,side*.079,.609,-.324,.034,.053,.042,rubber);
 }
 const bench=add('Interior Tern rear bench',padded(padding(1.14,.391,.128),1),cloth,0,.574,-.956);bench.rotation.x=-Math.PI/2;
 const rear=add('Interior Tern rear backrest',padded(padding(1.14,.344,.10),1),cloth,0,.813,-1.166);rear.rotation.x=-.12;
 add('Interior Tern dashboard',dashShell(),vinyl);
 add('Interior Tern instrument hood',padded([{w:.36,h:.135,r:.028,depth:.056},{w:.38,h:.143,r:.025,depth:-.037},{w:.336,h:.111,r:.02,depth:-.059}],1),vinyl,-.343,1.047,.429);
 // Driver-facing analogue faces and tick marks sit inside the binnacle lip.
 for(const [i,x]of [-.423,-.261].entries()){
  const dial=add('Interior Tern dial '+i,new T.CircleGeometry(.045,16),rubber,x,1.047,.360);dial.rotation.y=Math.PI;
  const ticks:T.BufferGeometry[]=[];for(let j=0;j<9;j++){const a=(-135+j*270/8)*Math.PI/180,g=new T.PlaneGeometry(.0025,.008);g.rotateY(Math.PI);g.rotateZ(-a);g.translate(x+Math.sin(a)*.035,1.047+Math.cos(a)*.035,.358);ticks.push(g);}
  add('Interior Tern dial marks '+i,mergeGeometries(ticks)!,alloy);ticks.forEach(g=>g.dispose());
  const needle=add('Interior Tern dial needle '+i,new T.PlaneGeometry(.003,.030),alloy,x-.010,1.055,.354);needle.rotation.set(0,Math.PI,-.78);
 }
 const vents:T.BufferGeometry[]=[];for(const x of [-.59,.08,.22,.56]){
  const g=new T.BoxGeometry(.10,.037,.009);g.translate(x,.980,.334);vents.push(g);
 }
 add('Interior Tern dashboard vents',mergeGeometries(vents)!,rubber);vents.forEach(g=>g.dispose());
 box('Interior Tern glovebox seam',.432,.933,.335,.386,.0025,.003,rubber);
 const console=add('Interior Tern centre console',padded([{w:.154,h:.38,r:.035,depth:-.02},{w:.186,h:.43,r:.045,depth:.055},{w:.147,h:.36,r:.03,depth:.070}],1),vinyl,0,.435,.037);console.rotation.x=-Math.PI/2;
 const boot=add('Interior Tern shift boot',new T.CylinderGeometry(.023,.041,.044,8),rubber,0,.529,-.003);boot.rotation.x=.17;
 add('Interior Tern gear knob',padded(padding(.042,.048,.039),1),rubber,0,.660,.020);
 const wheel=add('Interior Tern steering rim',new T.TorusGeometry(.148,.012,5,20),rubber,-.343,1.045,.268);wheel.rotation.x=-.33;
 const hub=add('Interior Tern steering hub',padded(padding(.088,.063,.032),1),vinyl,-.343,1.045,.263);hub.rotation.x=-.33;
 for(const sign of [-1,1])bar('Interior Tern steering spoke '+sign,v(-.343+sign*.036,1.039,.265),v(-.343+sign*.136,1.025,.271),.010,vinyl,4);
 root.updateMatrixWorld(true);
}

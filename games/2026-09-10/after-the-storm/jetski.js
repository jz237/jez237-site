import {installBlenderRider} from './blender-rider.js';
import {installBlenderJetSki} from './blender-jetski.js';
import * as T from './vendor/three.module.js';
const metal=new T.MeshStandardMaterial({color:0x687b7e,metalness:.8,roughness:.28});
const rubber=new T.MeshStandardMaterial({color:0x141e23,roughness:.85});
const shell=new T.MeshPhysicalMaterial({color:0xe6e8dc,metalness:.18,roughness:.27,clearcoat:1,clearcoatRoughness:.17});
const orange=new T.MeshPhysicalMaterial({color:0xd95b24,metalness:.12,roughness:.30,clearcoat:.8});
const dark=new T.MeshPhysicalMaterial({color:0x173944,metalness:.27,roughness:.28,clearcoat:1});
function add(parent,g,m,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ellipsoid(parent,x,y,z,sx,sy,sz,mat){const o=add(parent,new T.SphereGeometry(1,24,16),mat,x,y,z);o.scale.set(sx,sy,sz);return o;}
function rod(parent,a,b,r,mat=metal){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const m=add(parent,new T.CylinderGeometry(r,r,d.length(),12),mat);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
function tube(parent,points,r,mat){return add(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),64,r,8,false),mat);}
function deck(parent,w,h,d,x,y,z,mat){return add(parent,new T.BoxGeometry(w,h,d),mat,x,y,z);}
function graphic(parent,text,x,y,z,w,matColor='#e8eadf'){const c=document.createElement('canvas');c.width=512;c.height=128;const cx=c.getContext('2d');cx.fillStyle=matColor;cx.font='bold 52px Arial';cx.textAlign='center';cx.fillText(text,256,84);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return add(parent,new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}),x,y,z);}
// Lofted closed cross-sections give the hull a continuous double-curved surface.
function loft(parent,rings,mat){const curves=rings.map(([z,w,top,bottom])=>new T.CatmullRomCurve3([new T.Vector3(-w,top,z),new T.Vector3(-w*.94,top-.16,z),new T.Vector3(-w*.55,bottom+.06,z),new T.Vector3(0,bottom,z),new T.Vector3(w*.55,bottom+.06,z),new T.Vector3(w*.94,top-.16,z),new T.Vector3(w,top,z),new T.Vector3(0,top+.045,z)],true));const verts=[],indices=[];const n=80,m=48;for(let i=0;i<=n;i++){const r=i/n*(rings.length-1),a=Math.min(rings.length-2,Math.floor(r)),f=r-a;const smooth=f*f*(3-2*f);for(let j=0;j<=m;j++){const p=curves[a].getPoint(j/m),q=curves[a+1].getPoint(j/m);p.lerp(q,smooth);p.z=T.MathUtils.lerp(rings[a][0],rings[a+1][0],f);verts.push(p.x,p.y,p.z);if(i<n&&j<m){const k=i*(m+1)+j;indices.push(k,k+m+1,k+1,k+1,k+m+1,k+m+2);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();const mesh=add(parent,g,mat);mesh.material.side=T.DoubleSide;return mesh;}
export function makeJetSki(scene,{salvage=true,riderIndex=0}={}){const boat=new T.Group(),body=new T.Group();boat.add(body);scene.add(boat);
loft(body,[[-1.84,.02,.13,-.16],[-1.74,.57,.20,-.27],[-1.25,.68,.24,-.41],[-.5,.74,.27,-.43],[.25,.72,.30,-.40],[1,.57,.38,-.24],[1.65,.30,.40,-.04],[1.98,.015,.37,.32]],dark);
loft(body,[[-1.66,.02,.27,.2],[-1.40,.53,.28,.20],[-.7,.69,.34,.23],[.05,.69,.40,.28],[.8,.53,.55,.32],[1.40,.37,.52,.34],[1.85,.025,.40,.36]],shell);
for(const side of[-1,1]){
 tube(body,[[side*.56,.19,-1.69],[side*.74,.24,-.75],[side*.72,.29,.2],[side*.57,.34,1],[side*.28,.36,1.66],[0,.35,1.99]],.035,rubber);
 tube(body,[[side*.59,.10,-1.45],[side*.70,.16,-.5],[side*.65,.21,.50],[side*.42,.28,1.33]],.07,orange);
 deck(body,.27,.045,1.7,side*.50,.38,-.52,rubber);
 for(let k=0;k<18;k++)deck(body,.245,.009,.016,side*.50,.406,-1.29+k*.089,metal);
 tube(body,[[side*.68,.40,-1.35],[side*.69,.43,-.60],[side*.65,.46,.15]],.029,dark);
 const sponson=deck(body,.10,.16,.81,side*.66,-.02,-1.20,dark);sponson.rotation.x=-.08;
 for(let k=0;k<5;k++){const vent=deck(body,.022,.022,.26,side*(.47-k*.037),.55+k*.018,.82,rubber);vent.rotation.z=side*.35;}
 for(const z of[-1.42,-.68,.1,1.1]){const bolt=add(body,new T.CylinderGeometry(.020,.020,.011,8),metal,side*(z>1?.38:.64),z>1?.47:.35,z);}
 const g=graphic(body,'GREYHAVEN  /  01',side*.739,.17,-.10,1.13);g.rotation.y=side*Math.PI/2;
}
// Sculpted two-person saddle and contoured bow fairing.
ellipsoid(body,0,.52,.52,.38,.26,.73,orange);
ellipsoid(body,0,.59,-.60,.32,.20,.80,rubber);
ellipsoid(body,0,.63,-.15,.29,.19,.44,rubber);
tube(body,[[-.29,.68,-1.1],[-.30,.76,-.65],[-.24,.76,-.1],[0,.76,.2],[.24,.76,-.1],[.30,.76,-.65],[.29,.68,-1.1]],.008,metal);
const handlebars=new T.Group();handlebars.position.set(0,1.08,.66);body.add(handlebars);rod(body,[0,.63,.65],[0,1.08,.66],.10,dark);tube(handlebars,[[-.49,.03,.08],[-.26,.06,0],[0,0,0],[.26,.06,0],[.49,.03,.08]],.037,metal);
for(const side of[-1,1]){rod(handlebars,[side*.32,.035,.035],[side*.51,.03,.10],.048,rubber);const mirror=ellipsoid(handlebars,side*.49,.18,.09,.11,.053,.023,metal);rod(handlebars,[side*.33,.04,.03],[side*.49,.18,.09],.016,dark);for(let k=0;k<7;k++)rod(handlebars,[side*(.33+k*.022),.010,.03],[side*(.33+k*.022),.062,.08],.005,metal);}
const display=deck(handlebars,.26,.028,.19,0,.09,-.005,rubber);display.rotation.x=.42;const screen=deck(handlebars,.205,.007,.12,0,.115,-.012,new T.MeshStandardMaterial({color:0x9ed9bb,emissive:0x639b8c,emissiveIntensity:.32,roughness:.2}));screen.rotation.x=.42;
const dashCanvas=document.createElement('canvas');dashCanvas.width=256;dashCanvas.height=160;const dashCtx=dashCanvas.getContext('2d'),dashTex=new T.CanvasTexture(dashCanvas);dashTex.colorSpace=T.SRGBColorSpace;screen.material=new T.MeshBasicMaterial({map:dashTex});screen.geometry=new T.BoxGeometry(.205,.007,.12);
function updateDash(speed,hull){dashCtx.fillStyle='#122c30';dashCtx.fillRect(0,0,256,160);dashCtx.fillStyle='#91d8bd';dashCtx.font='12px Arial';dashCtx.fillText('GREYHAVEN // RESCUE',16,22);dashCtx.font='bold 60px monospace';dashCtx.fillText((Math.abs(speed)*1.944).toFixed(1),20,92);dashCtx.font='16px Arial';dashCtx.fillText('KNOTS',169,92);dashCtx.fillStyle='#55756b';dashCtx.fillRect(18,115,218,8);dashCtx.fillStyle='#a4d9a4';dashCtx.fillRect(18,115,218*hull/100,8);dashCtx.font='12px Arial';dashCtx.fillText('HULL '+Math.round(hull)+'%     JET DRIVE',18,144);dashTex.needsUpdate=true;}updateDash(0,100);
// Rear boarding step, grab handles, rack, rescue winch and water-jet nozzle.
deck(body,1.0,.06,.45,0,.28,-1.68,rubber);tube(body,[[-.42,.52,-1.17],[-.47,.62,-1.40],[.47,.62,-1.40],[.42,.52,-1.17]],.028,metal);
const rack=new T.Group();rack.position.set(0,.44,-1.51);body.add(rack);for(const x of[-.48,.48])rod(rack,[x,0,-.20],[x,0,.30],.025,metal);for(let k=0;k<5;k++)rod(rack,[-.48,0,-.20+k*.125],[.48,0,-.20+k*.125],.020,metal);
const winch=add(body,new T.CylinderGeometry(.11,.11,.27,16),metal,.42,.56,-1.48);winch.rotation.z=Math.PI/2;const winchArm=tube(body,[[.51,.42,-1.4],[.51,.78,-1.5],[.44,.90,-1.81]],.027,dark);
const prop=new T.Group();prop.position.set(0,-.10,-1.87);body.add(prop);const nozzle=add(prop,new T.CylinderGeometry(.105,.14,.22,24,1,true),metal);nozzle.rotation.x=Math.PI/2;add(prop,new T.CircleGeometry(.104,24),rubber,0,0,-.116).rotation.y=Math.PI;const gate=add(prop,new T.TorusGeometry(.15,.022,8,24,Math.PI),dark,0,.02,-.14);gate.rotation.z=Math.PI;rod(body,[-.17,-.13,-1.48],[.17,-.13,-1.48],.026,metal);
const cargo=new T.Group();body.add(cargo);for(let i=0;i<3;i++){const c=new T.Group();c.position.set((i-1)*.29,.60,-1.52);body.add(c);cargo.add(c);const m=deck(c,.25,.27,.42,0,0,0,dark);for(const z of[-.13,.13])deck(c,.265,.285,.027,0,0,z,rubber);deck(c,.12,.025,.028,0,.15,0,metal);c.visible=false;}
// Seated rider with articulated limbs, a rescue vest, helmet and visor.
const rider=new T.Group();body.add(rider);const suit=new T.MeshStandardMaterial({color:0x263b45,roughness:.90}),vest=new T.MeshStandardMaterial({color:0xb9542d,roughness:.86}),reflective=new T.MeshStandardMaterial({color:0xd6d2aa,roughness:.50});
ellipsoid(rider,0,.98,-.40,.23,.18,.24,suit);const torso=ellipsoid(rider,0,1.38,-.14,.275,.40,.18,suit);torso.rotation.x=.25;const vestBody=ellipsoid(rider,0,1.43,-.17,.30,.31,.205,vest);vestBody.rotation.x=.25;
for(const side of[-1,1]){rod(rider,[side*.13,.99,-.42],[side*.43,.70,.04],.115,suit);ellipsoid(rider,side*.43,.70,.04,.12,.13,.13,rubber);rod(rider,[side*.43,.70,.04],[side*.50,.40,-.35],.082,suit);ellipsoid(rider,side*.5,.42,-.30,.105,.074,.22,rubber);
rod(rider,[side*.26,1.62,-.035],[side*.36,1.30,.32],.086,suit);ellipsoid(rider,side*.36,1.30,.32,.09,.09,.09,suit);rod(rider,[side*.36,1.30,.32],[side*.44,1.13,.73],.068,suit);ellipsoid(rider,side*.44,1.13,.73,.071,.065,.085,rubber);
deck(rider,.057,.34,.027,side*.17,1.47,-.355,reflective);deck(rider,.058,.29,.027,side*.17,1.45,.053,reflective);}
deck(rider,.48,.044,.03,0,1.32,-.355,rubber);deck(rider,.07,.07,.034,0,1.32,-.38,metal);
rod(rider,[0,1.71,.015],[0,1.84,.07],.08,suit);const head=ellipsoid(rider,0,1.99,.13,.19,.225,.216,shell);head.rotation.x=.12;ellipsoid(rider,0,1.96,.276,.16,.105,.093,new T.MeshPhysicalMaterial({color:0x132a34,metalness:.55,roughness:.16,clearcoat:1}));tube(rider,[[-.16,1.92,.10],[-.12,1.80,.24],[.12,1.80,.24],[.16,1.92,.10]],.021,rubber);tube(rider,[[0,2.19,.06],[0,2.20,.16],[0,2.12,.29]],.025,orange);
graphic(rider,'RESCUE',0,1.48,-.388,.37).rotation.y=Math.PI;
const vessel={boat,body,prop,cargo,winch,handlebars,rider,updateDash};
installBlenderJetSki(vessel,{screen,rack,winchArm,salvage});
installBlenderRider(vessel,{riderIndex});
return vessel;
}

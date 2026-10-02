import * as T from 'three';
import {formedVehiclePanel,stampedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {buildCompactAsset} from './compact-asset';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;

/** Original short-nose commercial van. All cargo panels and barn-door skins
 * have closed inner returns; the interior is visible after hinge damage. */
export function buildVanAsset(){
 const root=new T.Group();root.name='RillfordCarrier';
 const material=(name:string,color:number,roughness:number,metalness=0)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=material('paint_Carrier',0xc3b28c,.36,.12);paint.clearcoat=.85;paint.clearcoatRoughness=.18;
 const steel=material('Structure Carrier Steel',0x353d3e,.69,.55),trim=material('Carrier Satin Brightwork',0xa4aaa7,.36,.73),rubber=material('Carrier Rubber',0x202626,.86),vinyl=material('Interior Carrier Vinyl',0x38443c,.9),wood=material('Interior Carrier Cargo Floor',0x62533f,.95),glass=material('Carrier Glass',0x334f56,.07,.1),lamp=material('Carrier Headlight',0xe1dfc9,.22,.18),brake=material('Carrier Brakelight',0x942818,.25,.1),amber=material('Carrier Indicator',0xc98220,.26,.12);glass.transparent=true;glass.opacity=.55;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,l),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nx:number,ny:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,thickness=.018)=>add(name,formedVehiclePanel(panelSamples(Math.max(4,Math.round(nx/2))),panelSamples(Math.max(2,Math.round(ny/2))),map,n,thickness),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const sideX=(y:number)=>.933-.062*((y-.85)/.58)**2+.050*Math.exp(-(((y-.85)/.13)**2));
 const upperX=(y:number)=>mix(.886,.795,T.MathUtils.clamp((y-1.10)/.775,0,1))+.008*Math.sin(T.MathUtils.clamp((y-1.10)/.775,0,1)*Math.PI);
 const bodyX=(y:number)=>(y>1.10?upperX(y):mix(Math.min(.939,sideX(y)),.886,T.MathUtils.smoothstep(y,1.03,1.10)))+.004*Math.exp(-(((y-1.055)/.025)**2));
 const archY=(z:number)=>{const d=Math.min(Math.abs(z-1.35),Math.abs(z+1.35));return d<.414?Math.max(.43,.3400195+Math.sqrt(.414**2-d**2)):.43;};
 // Every high side row stays at one body-line height, even over an arch.
 // A rounded inset is pressed into the cargo wall instead of overlaid on it.
 const bodyRows=[0,.25,.5,.75,1];
 const bodyHeights=[0,.81,.94,1.04,1.10];
 const sideHeight=(z:number,t:number)=>{let i=0;while(i<bodyRows.length-2&&t>bodyRows[i+1])i++;return mix(i===0?archY(z):bodyHeights[i],bodyHeights[i+1],(t-bodyRows[i])/(bodyRows[i+1]-bodyRows[i]));};
 const cargoColumns=[-2.20,-2.03,-1.99,-1.95,-1.91,-1.80,-1.65,-1.50,-1.35,-1.20,-1.05,-.90,-.75,-.64,-.54,-.50,-.46,-.40,-.27].map(z=>(z+2.20)/1.93);
 const screenTop=1.795,screenFront=.705,screenWidth=upperX(screenTop);
 const noseZ=(x:number)=>2.18+.040*(1-(x/.881)**2);
 const rearZ=(x:number)=>-2.20-.022*(1-(x/.891)**2);
 const window=(name:string,corners:T.Vector3[],side:number)=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,trim);add('glass_'+name,f.glass,glass).castShadow=false;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  panel('panel_FrontWingVan'+suffix,26,8,(u,t)=>{const z=mix(1.05,2.18,u),y=mix(archY(z),1.10-.055*u,t),x=side*mix(bodyX(y),.88,T.MathUtils.smoothstep(z,1.99,2.18));return v(x,y,z);},v(side,0,0));
  panel('panel_BodyDoor'+suffix+'VanSkin',24,10,(u,t)=>{const z=mix(-.27,1.05,u),y=mix(archY(z),1.10,t);return v(side*bodyX(y),y,z);},v(side,0,0));
  add('panel_CargoSideVan'+suffix,formedVehiclePanel(cargoColumns,bodyRows,(u,t)=>{const z=mix(-2.20,-.27,u),y=sideHeight(z,t);return v(side*bodyX(y),y,z);},v(side,0,0)),paint);
  add('panel_CargoBlankVan'+suffix,stampedVehiclePanel((u,t)=>{const y=mix(1.10,1.875,t);return v(side*bodyX(y),y,mix(-2.20,-.27,u));},v(side,0,0),1.93,.775,.07,.009),paint);
  for(const z of [-1.35,1.35]){
   const path=Array.from({length:25},(_,i)=>{const a=mix(.16,Math.PI-.16,i/24),y=.3400195+Math.sin(a)*.416,Z=z+Math.cos(a)*.416;return v(side*(bodyX(y)+.004),y,Z);});
   add('panel_ArchLipVan'+suffix+(z>0?'Front':'Rear'),new T.TubeGeometry(new T.CatmullRomCurve3(path),20,.008,5,false),paint);
   panel('Structure wheelhouse Van '+suffix+(z>0?' front':' rear'),26,4,(u,t)=>{const a=u*Math.PI;return v(side*mix(.64,.90,t),.3400195+Math.sin(a)*.412,z+Math.cos(a)*.412);},v(0,1,0),steel,.012);
  }
  panel('panel_SillVan'+suffix,36,3,(u,t)=>{const z=mix(-2.13,2.13,u);return v(side*mix(.887,.848,t),mix(.431,.355,t),z);},v(side,-.2,0));
  panel('panel_HoodShoulderVan'+suffix,24,6,(u,t)=>{const z=mix(1.05,2.18,u),x=side*mix(mix(bodyX(1.10-.055*u),.88,T.MathUtils.smoothstep(z,1.99,2.18)),.795,t);return v(x,1.10-.055*u+.028*Math.sin(t*Math.PI/2),u===1?noseZ(x):z);},v(side,1,0).normalize());
  window('BodyDoor'+suffix+'Van',[v(side*.886,1.10,1.05),v(side*.886,1.10,-.27),v(side*screenWidth,screenTop,-.27),v(side*screenWidth,screenTop,screenFront)],side);
  bar('panel_BodyDoor'+suffix+'VanApost',v(side*.886,1.10,1.05),v(side*screenWidth,screenTop,screenFront),.019,paint);
  panel('panel_BodyDoor'+suffix+'VanHeader',12,4,(u,t)=>{const y=mix(screenTop,1.875,t);return v(side*upperX(y),y,mix(-.27,mix(screenFront,.665,t),u));},v(side,0,0));
  bar('panel_CabRearPostVan'+suffix,v(side*.886,1.10,-.27),v(side*.795,1.875,-.27),.026,paint);
  box('panel_BodyDoor'+suffix+'VanHandle',side*.944,1.012,-.11,.036,.043,.17,trim);
  panel('panel_BodyDoor'+suffix+'VanInnerCard',16,8,(u,t)=>v(side*.869,mix(.52,1.07,t),mix(-.23,1.00,u)),v(-side,0,0),vinyl,.022);
  box('panel_BodyDoor'+suffix+'VanArmrest',side*.833,.858,.07,.08,.055,.34,vinyl);
  bar('panel_BodyDoor'+suffix+'VanMirrorStem',v(side*.89,1.172,.93),v(side*1.032,1.181,.94),.012,steel);
  const mirror=add('panel_BodyDoor'+suffix+'VanMirror',new T.SphereGeometry(.103,12,8),trim);mirror.position.set(side*1.042,1.20,.94);mirror.scale.set(.30,1,.70);
  for(const z of [-1.93,-1.24,-.57]){
   bar('Structure cargo upright Van '+suffix+z,v(side*.851,.47,z),v(side*.759,1.84,z),.022,steel);
   box('Structure cargo wall lower rib Van '+suffix+z,side*.853,.61,z,.030,.09,.09,steel);
  }
 }
 panel('panel_hoodVan',18,20,(u,t)=>{const x=(u*2-1)*.795,z=mix(1.05,noseZ(x),t);return v(x,1.128-.055*t+.027*(1-(x/.795)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 window('FrontVan',[v(-.886,1.10,1.05),v(.886,1.10,1.05),v(screenWidth,screenTop,screenFront),v(-screenWidth,screenTop,screenFront)],1);
 panel('panel_CabHeaderVan',16,4,(u,t)=>{const y=mix(screenTop,1.875,t),x=(u*2-1)*upperX(y);return v(x,y+.009*Math.sin(t*Math.PI)*(1-(u*2-1)**2),mix(screenFront,.665,t));},v(0,.4,1).normalize());
 panel('panel_RoofVan',12,16,(u,t)=>{const x=(u*2-1)*.795,z=mix(-2.20,.665,t);return v(x,1.875+.058*(1-(x/.795)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 for(const side of [-1,1])bar('panel_RoofGutterVan'+side,v(side*.805,1.864,-2.18),v(side*.805,1.864,.65),.010,trim);
 panel('panel_FrontValanceVan',28,10,(u,t)=>{const x=(u*2-1)*.88;const roll=T.MathUtils.clamp((.88-Math.abs(x))/.085,0,1);return v(x,mix(.445,1.045+.028*Math.sin(roll*Math.PI/2),t),noseZ(x));},v(0,0,1));
 panel('panel_hoodVanRolledEdge',20,4,(u,t)=>{const x=(u*2-1)*.795,z=noseZ(x);return v(x,1.075+.002-.027*(1-Math.cos(t*Math.PI/2)),z-.018+.024*Math.sin(t*Math.PI/2));},v(0,.7,1).normalize());
 for(const front of [true,false]){
  const sign=front?1:-1,stem=front?'front':'rear';
  panel('panel_bumper_'+stem+'Van',32,4,(u,t)=>{const x=(u*2-1)*.92;return v(x,mix(.455,.554,t),sign*(2.284-.065*(x/.92)**4+.015*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.045);
  panel('panel_bumper_'+stem+'VanTrim',30,2,(u,t)=>{const x=(u*2-1)*.905;return v(x,mix(.504,.52,t),sign*(2.305-.065*(x/.92)**4));},v(0,0,sign),trim,.010);
  for(const side of [-1,1])box('Structure '+stem+' crash mount Van '+side,side*.57,.49,sign*2.14,.08,.08,.23,steel);
 }
 box('panel_FrontGrilleVan',0,.795,2.225,.75,.29,.022,rubber);
 for(let i=0;i<8;i++)box('panel_FrontGrilleVanSlat'+i,0,.672+i*.035,2.242,.728,.012,.015,trim);
 for(const side of [-1,1]){
  const x=side*.623,corners=[v(x-.168,.748,2.225),v(x+.168,.748,2.225),v(x+.168,.949,2.225),v(x-.168,.949,2.225)],f=classicWindowFrame(corners,1);
  add('panel_HeadlightVanBezel'+side,f.frame,trim);add('panel_HeadlightVanSeal'+side,f.seal,rubber);add('panel_HeadlightVanLens'+side,f.glass,lamp);
  box('panel_IndicatorVan'+side,x,.632,2.225,.255,.071,.021,amber);
  box('panel_RearQuarterVanLampBezel'+side,side*.854,.906,-2.211,.113,.353,.037,trim);
  box('panel_RearQuarterVanIndicator'+side,side*.854,1.002,-2.237,.092,.117,.018,amber);
  box('panel_RearQuarterVanBrake'+side,side*.854,.860,-2.237,.092,.141,.018,brake);
  box('panel_RearQuarterVanReverse'+side,side*.854,.755,-2.237,.092,.047,.018,lamp);
  // Fixed corner returns close the body outside the independently hinged doors.
  panel('panel_RearCornerVan'+side,4,16,(u,t)=>{const y=mix(.43,1.875,t),outer=bodyX(y),x=side*mix(.78,outer,u);return v(x,y,mix(rearZ(x),-2.20,u));},v(side,0,-1).normalize());
 }
 panel('panel_CargoDoorSurroundVanTop',24,3,(u,t)=>{const x=(u*2-1)*.795,y=mix(1.797,1.875,t);return v(x,y,mix(rearZ(x),-2.20,t));},v(0,0,-1));
 panel('panel_CargoDoorSurroundVanBottom',24,3,(u,t)=>{const x=(u*2-1)*.78;return v(x,mix(.43,.486,t),rearZ(x));},v(0,0,-1));
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  add('panel_CargoDoorVan'+suffix+'Stamping',stampedVehiclePanel((u,t)=>{const x=side*mix(.009,.78,u),y=mix(.48,1.80,t),crown=.005*Math.sin(u*Math.PI)*Math.sin(t*Math.PI);return v(x,y,rearZ(x)-crown);},v(0,0,-1),.771,1.32,.065,.008),paint);
  panel('panel_CargoDoorVan'+suffix+'InnerSkin',10,16,(u,t)=>{const x=side*mix(.025,.75,u),y=mix(.51,1.775,t);return v(x,y,rearZ(x)+.038);},v(0,0,1),steel,.012);
  box('panel_CargoDoorVan'+suffix+'Handle',side*.086,1.05,-2.244,.084,.042,.027,trim);
  for(const y of [.682,1.574])bar('panel_CargoDoorVan'+suffix+'Hinge'+y,v(side*.776,y-.049,-2.234),v(side*.776,y+.049,-2.234),.018,trim);
 }
 box('panel_CargoDoorVanRPlateRecess',.426,.704,-2.247,.35,.115,.018,rubber);box('panel_CargoDoorVanRPlate',.426,.704,-2.259,.307,.082,.009,trim);
 for(const side of [-1,1])bar('panel_WiperVan'+side,v(side*.43,1.124,1.040),v(side*.22,1.263,.971),.009,rubber);
 box('Structure floor Van',0,.435,-.075,1.72,.028,3.97,steel);
 for(const side of [-1,1])box('Structure longitudinal rail Van '+side,side*.535,.361,-.05,.075,.100,3.96,steel);
 for(const z of [-1.84,-1.05,-.25,.55,1.35])box('Structure cross beam Van '+z,0,.382,z,1.67,.071,.065,steel);
 // Cargo floor and two seats stay fixed while the separate door assemblies move.
 for(let i=0;i<9;i++)box('Interior Carrier cargo floor plank '+i,-.75+i*.186,.469,-1.15,.181,.026,1.995,wood);
 box('Interior Carrier cab floor',0,.467,.453,1.64,.023,1.065,vinyl);
 box('Structure cab bulkhead Van',0,1.024,-.376,1.69,1.13,.025,steel);
 box('Interior Carrier dash',0,1.062,.974,1.67,.147,.212,vinyl);
 for(const side of [-1,1]){
  box('Interior Carrier seat cushion '+side,side*.405,.659,.374,.55,.137,.475,vinyl);
  const seat=box('Interior Carrier seat back '+side,side*.405,.947,.130,.55,.485,.112,vinyl);seat.rotation.x=-.10;
  for(let i=-2;i<=2;i++)box('Interior Carrier seat pleat '+side+i,side*.405+i*.086,.940,.198,.008,.376,.012,rubber);
  box('Structure seat runner Van '+side,side*.405,.535,.382,.31,.055,.414,steel);
 }
 const steering=add('Interior Carrier steering wheel',new T.TorusGeometry(.177,.012,6,24),rubber);steering.position.set(-.405,1.221,.774);steering.rotation.x=-.30;
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar('Interior Carrier steering spoke '+i,v(-.405,1.221,.774),v(-.405+Math.cos(a)*.159,1.221+Math.sin(a)*.153,.774-Math.sin(a)*.043),.007,trim);}
 bar('Interior Carrier steering column',v(-.405,1.221,.774),v(-.405,.95,1.02),.018,steel);
 bar('Interior Carrier gear lever',v(0,.50,.555),v(0,.856,.67),.012,steel);
 // Longitudinal four-cylinder bay; mechanical batches deform independently.
 box('Structure engine block Van',0,.760,1.585,.35,.30,.445,steel);box('Structure engine sump Van',0,.568,1.585,.37,.075,.39,steel);
 box('Structure engine valve cover Van',0,.941,1.585,.24,.085,.43,trim);
 const air=add('Structure engine air cleaner Van',new T.CylinderGeometry(.16,.16,.047,16),rubber);air.position.set(0,1.010,1.58);
 for(let i=0;i<4;i++)bar('Structure intake runner Van '+i,v(-.18,.856,1.427+i*.104),v(-.279,.928,1.427+i*.104),.027,steel);
 box('Structure radiator Van',0,.78,2.012,.725,.357,.058,steel);for(let i=0;i<16;i++)box('Structure radiator fin Van '+i,-.332+i*.044,.78,2.051,.007,.316,.011,rubber);
 box('Structure battery Van',.439,.79,1.568,.21,.18,.26,rubber);
 for(const side of [-1,1]){const tower=add('Structure suspension tower Van '+side,new T.CylinderGeometry(.103,.109,.16,12),steel);tower.position.set(side*.57,.87,1.35);bar('Structure front spring Van '+side,v(side*.59,.42,1.35),v(side*.57,.91,1.35),.032,steel);}
 bar('Structure exhaust pipe Van',v(-.42,.331,.70),v(-.42,.331,-2.22),.029,steel);
 // Original Rook stamped wheel tooling is shared at the van's actual tyre size.
 const source=buildCompactAsset();for(const [index,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=source.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((index%2?1:-1)*.805,.3400195,(index<2?1:-1)*1.35);wheel.scale.setScalar(.375/.32);root.add(wheel);
 }
 source.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});root.updateMatrixWorld(true);return root;
}

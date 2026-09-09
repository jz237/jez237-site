import * as T from 'three';
import type { Part } from './engine-scene';
export const DRIVE = [{x:0,y:0,r:.45},{x:0,y:1.85,r:.32},{x:-1.35,y:1.1,r:.25}];
// Convex envelope of circular pulleys gives tangent straight runs and wrapped
// arcs. All shafts turn in the same sense on this external three-pulley belt.
export function beltPath() {
  const pts=DRIVE.flatMap(p=>Array.from({length:128},(_,i)=>{const a=i*Math.PI/64;return new T.Vector2(p.x+p.r*Math.cos(a),p.y+p.r*Math.sin(a));}));
  pts.sort((a,b)=>a.x-b.x||a.y-b.y);
  const cross=(a:T.Vector2,b:T.Vector2,c:T.Vector2)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const half=(list:T.Vector2[])=>{const h:T.Vector2[]=[];for(const p of list){while(h.length>1&&cross(h[h.length-2],h[h.length-1],p)<=0)h.pop();h.push(p);}return h;};
  const hull=half(pts).slice(0,-1).concat(half([...pts].reverse()).slice(0,-1));
  const curve=new T.CurvePath<T.Vector3>();
  hull.forEach((p,i)=>{const q=hull[(i+1)%hull.length];curve.add(new T.LineCurve3(new T.Vector3(p.x,p.y,3.55),new T.Vector3(q.x,q.y,3.55)));});
  return curve;
}
export function createAccessories(parent:T.Group,crank:T.Group,register:(mesh:T.Mesh,part:Part)=>void) {
  const root=new T.Group();parent.add(root);
  const steel=new T.MeshStandardMaterial({color:0x9daebc,metalness:.92,roughness:.25});
  const casting=new T.MeshStandardMaterial({color:0x77848c,metalness:.8,roughness:.4});
  const rubber=new T.MeshStandardMaterial({color:0x10171b,metalness:0,roughness:.88});
  const copper=new T.MeshStandardMaterial({color:0xab6234,metalness:.85,roughness:.3});
  const make=(geo:T.BufferGeometry,mat:T.Material,p:T.Object3D,pos:T.Vector3,name:string,description:string)=>{const m=new T.Mesh(geo,mat);m.position.copy(pos);m.castShadow=true;m.receiveShadow=true;p.add(m);register(m,{name,description});return m;};
  const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
  const disc=(r:number,h:number,p:T.Object3D,pos:T.Vector3,mat:T.Material,name:string,desc:string)=>{const g=new T.CylinderGeometry(r,r,h,48);g.rotateX(Math.PI/2);return make(g,mat,p,pos,name,desc);};
  const pulleys=DRIVE.map((p,i)=>{
    const group=new T.Group();(i===0?crank:root).add(group);group.position.set(p.x,p.y,3.55);
    const name=['Crank accessory pulley','Water-pump pulley','Alternator pulley'][i];
    const desc=`The crank drives this external belt at a fixed radius ratio. ${i===0?'Reference shaft.':i===1?'Pump speed is 1.40625 times crank speed.':'Alternator speed is 1.8 times crank speed.'} Pulley diameters are illustrative.`;
    disc(p.r-.03,.12,group,V(),rubber,name,desc);
    for(const z of [-.085,.085])make(new T.TorusGeometry(p.r,.022,8,64),steel,group,V(0,0,z),name,desc);
    disc(p.r*.66,.025,group,V(0,0,.09),steel,name,desc);
    for(let j=0;j<6;j++){const a=j*Math.PI/3;disc(.035,.027,group,V(Math.sin(a)*p.r*.43,Math.cos(a)*p.r*.43,.11),rubber,'Pulley face recess','A recessed feature in the machined pulley face.');}
    disc(.07,.08,group,V(0,0,.14),steel,'Accessory pulley retaining bolt','Secures the pulley to its shaft.');
    disc(.105,.4,root,V(p.x,p.y,3.31),steel,'Accessory drive shaft','Connects the pulley to the housing behind it.');
    return group;
  });
  const alt=DRIVE[2];
  disc(.37,.54,root,V(alt.x,alt.y,3.02),rubber,'Alternator core','The alternator converts shaft power into electrical energy. Electrical output is not simulated.');
  for(const z of [2.77,3.27])disc(.4,.065,root,V(alt.x,alt.y,z),casting,'Alternator end housing','Cast end plates locate the rotor bearings and support the stator.');
  for(let i=0;i<16;i++){const a=i*Math.PI/8;const rib=make(new T.BoxGeometry(.045,.075,.47),casting,root,V(alt.x+.38*Math.sin(a),alt.y+.38*Math.cos(a),3.02),'Alternator ventilation rib','Open spaces between the housing ribs allow cooling air through the alternator.');rib.rotation.z=-a;}
  for(const z of [2.87,3.0,3.13])make(new T.TorusGeometry(.345,.018,8,48),copper,root,V(alt.x,alt.y,z),'Alternator stator winding','Copper windings surround the driven rotor.');
  const mount=make(new T.BoxGeometry(1.0,.12,.2),casting,root,V(-.93,.66,2.89),'Alternator mounting bracket','A rigid bracket supports the alternator on the front of the block.');mount.rotation.z=-.25;
  const curve=beltPath();
  for(const offset of [-.065,0,.065]){const belt=make(new T.TubeGeometry(curve,384,.024,6,false),rubber,root,V(0,0,offset),'Accessory drive belt','A continuous three-rib belt wraps the crank, water pump, and alternator pulleys. Tangent runs connect the circular wraps; no slip is modeled.');belt.castShadow=false;}
  const seam=make(new T.BoxGeometry(.025,.05,.17),casting,root,V(),'Belt travel marker','A light seam makes belt travel visible at slowed playback speed.');
  return {update(angle:number){pulleys.forEach((g,i)=>g.rotation.z=i===0?0:-angle*Math.PI/180*DRIVE[0].r/DRIVE[i].r);const t=(((-angle*Math.PI/180*DRIVE[0].r/curve.getLength())%1)+1)%1;seam.position.copy(curve.getPointAt(t));seam.quaternion.setFromUnitVectors(V(0,1,0),curve.getTangentAt(t));}};
}

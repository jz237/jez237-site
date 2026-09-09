import * as Three from 'three';
import type { Part } from './engine-scene';

// Stationary detail is authored in the owning assembly's local frame. Rotating
// detail is parented to its existing shaft/chain link, never animated separately.
type Materials = 'steel'|'aluminum'|'dark'|'black'|'blockMat'|'headMat'|'coverMat'|'copper';
type DetailContext = Record<Materials, Three.MeshPhysicalMaterial> & {
  T: typeof Three;
  banks: {sign:number;block:Three.Group;head:Three.Group;covers:Three.Object3D[]}[];
  block:Three.Group; crank:Three.Group; pan:Three.Mesh;
  lower:Three.Group; upper:Three.Group; chainLinks:Three.Mesh[];
  mesh:(g:Three.BufferGeometry,m:Three.Material,p:Three.Object3D,v?:Three.Vector3,i?:Part)=>Three.Mesh;
  box:(x:number,y:number,z:number,m:Three.Material,p:Three.Object3D,v?:Three.Vector3,i?:Part)=>Three.Mesh;
  cyl:(r:number,h:number,m:Three.Material,p:Three.Object3D,v?:Three.Vector3,i?:Part,n?:number)=>Three.Mesh;
  axisCylinder:(r:number,h:number,m:Three.Material,p:Three.Object3D,v?:Three.Vector3,i?:Part)=>Three.Mesh;
  ring:(r:number,t:number,m:Three.Material,p:Three.Object3D,v?:Three.Vector3,h?:boolean,i?:Part)=>Three.Mesh;
  bolt:(p:Three.Object3D,v:Three.Vector3)=>void;
  tube:(points:Three.Vector3[],r:number,m:Three.Material,p:Three.Object3D,i:Part)=>Three.Mesh;
  part:(name:string,description:string,cylinder?:number)=>Part;
  markingTexture:(text:string)=>Three.Texture; markingTextures:Three.Texture[];
};
export function addExhibitDetails(c:DetailContext) {
  const {T,banks,block,crank,pan,lower,upper,chainLinks,steel,aluminum,dark,black,blockMat,headMat,coverMat,copper,mesh,box,cyl,axisCylinder,ring,bolt,tube,part}=c;
  const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
  const casting=part('Cast rocker-cover wall','A profiled aluminum shell encloses the rocker mechanism. The cover lifts away in exploded view and is removed in cutaway view.');
  banks.forEach(({sign,head,block:bank,covers})=>{
    // A hollow cover: roof already exists; walls surround, rather than fill, the rockers.
    for(const side of [-1,1]) {
      // Rockers extend 0.72 toward the valley. Allow clearance for their full
      // swept envelope instead of putting the inner cover wall through them.
      const wallX = side * .55 + (side === -sign ? -sign * .32 : 0);
      const outline=new T.Shape();
      outline.moveTo(-2.55,3.07); outline.lineTo(2.55,3.07);
      outline.lineTo(2.55,3.48); outline.lineTo(2.3,3.50);
      outline.lineTo(-2.3,3.50); outline.lineTo(-2.55,3.48); outline.closePath();
      const wall=mesh(new T.ExtrudeGeometry(outline,{depth:.055,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:3}),coverMat,head,V(wallX,0,0),casting);
      wall.rotation.y=Math.PI/2; covers.push(wall);
      covers.push(box(.12,.065,5.25,aluminum,head,V(wallX,3.06,0),part('Machined cover flange','A flat machined rail distributes clamp load evenly along the cover gasket.')));
      covers.push(box(.12,.018,5.24,black,head,V(wallX,3.015,0),part('Rocker-cover gasket','Elastomer sealing strip prevents oil leakage at the cover joint.')));
      for(const z of [-2.35,-1.18,0,1.18,2.35]) {
        covers.push(cyl(.105,.085,coverMat,head,V(wallX+side*.06,3.095,z),casting));
        covers.push(cyl(.06,.075,steel,head,V(wallX+side*.06,3.16,z),part('Cover flange screw','Clamps the rocker cover to its gasket.'),6));
        covers.push(cyl(.025,.003,black,head,V(wallX+side*.06,3.199,z),part('Cover screw socket','Recess for the fastener tool.'),6));
      }
    }
    for(const z of [-2.53,2.53]) covers.push(box(1.4,.43,.065,coverMat,head,V(-sign*.16,3.285,z),casting));
    const texture=c.markingTexture('V8  /  CROSS-PLANE'); c.markingTextures.push(texture);
    const labelMat=new T.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,roughness:.5,metalness:.6});
    const label=mesh(new T.PlaneGeometry(2.1,.43),labelMat,head,V(0,3.723,0),part('V8 cover identification','Eight cylinders in two banks, with a cross-plane crankshaft.'));
    label.rotation.x=-Math.PI/2; label.rotation.z=Math.PI/2; covers.push(label);
    for(let j=0;j<4;j++) {
      const id=j*2+(sign===1?1:2),z=1.95-j*1.3+sign*.14;
      // Layered core plugs and stiffening webs give the casting depth at grazing angles.
      for(const side of [-1,1]) {
        const boss=cyl(.21,.055,blockMat,bank,V(side*.724,1.73,z),part('Core-plug casting boss','Extra casting thickness supports the press-fit core plug.'));
        boss.rotation.z=Math.PI/2;
        const lip=ring(.165,.015,steel,bank,V(side*.765,1.73,z),false,part('Core-plug rim','The rolled edge seats in the machined casting opening.'));
        lip.rotation.y=Math.PI/2;
        for(const y of [1.43,2.16]) {
          const web=box(.075,.075,.84,blockMat,bank,V(side*.735,y,z),part('Cast strengthening web','External webs stiffen the water-jacket wall without filling the cylinder bore.'));
          web.rotation.x=(y>2?1:-1)*.15;
        }
        const face=box(.065,.25,.24,headMat,head,V(side*.725,2.6,z+.49),part('Machined head mounting pad','A flat boss accepts the external port fastener.'));
        const fasteners=new T.Group(); head.add(fasteners);fasteners.position.copy(face.position).add(V(side*.05,0,0));fasteners.rotation.z=-side*Math.PI/2;
        bolt(fasteners,V());
      }
      // Visible circumferential welds follow the actual header centerline tangent.
      const path=new T.CatmullRomCurve3([V(sign*.7,2.61,z),V(sign*1.10,2.66,z),V(sign*1.63,2.25,z-.10),V(sign*1.77,1.54,z-.30),V(sign*1.53,1.10,z-.42)]);
      for(const t of [.17,.53,.88]) {
        const weld=ring(.171,.011,copper,head,path.getPoint(t),false,part(`Header weld · cylinder ${id}`,'A circumferential weld joins the formed stainless primary pipe sections.',id));
        weld.quaternion.setFromUnitVectors(V(0,0,1),path.getTangent(t));
      }
      const outlet=ring(.17,.018,steel,head,path.getPoint(1),false,part(`Header outlet · cylinder ${id}`,'The primary pipe joins the longitudinal exhaust collector at this welded socket.',id));
      outlet.quaternion.setFromUnitVectors(V(0,0,1),path.getTangent(1));
    }
    tube([V(sign*1.53,1.10,2.0),V(sign*1.53,1.10,-1.4),V(sign*1.62,.95,-2.65),V(sign*1.78,.76,-3.0)],.24,dark,head,part('Exhaust collector','The four primary pipes merge into a common outlet. This compact routing is illustrative, not tuned for a particular engine.'));
    for(const z of [-2.5,1.95]) {
      const flange=ring(.25,.035,steel,head,V(sign*1.53,1.10,z),false,part('Exhaust collector collar','Reinforced collar around the common exhaust collector.'));
      if(z < 0) flange.position.set(sign*1.61,.96,-2.6);
    }
  });
  // A perimeter-only front casting leaves both timing sprockets and chain visible.
  const frontInfo=part('Timing-case perimeter','The structural perimeter and mounting face of the front cover. Its inspection opening deliberately exposes the timing chain.');
  const outline=new T.Shape();
  outline.moveTo(-.58,-.48);outline.lineTo(.58,-.48);outline.lineTo(.72,.9);outline.lineTo(.52,1.52);outline.lineTo(-.52,1.52);outline.lineTo(-.72,.9);outline.closePath();
  const hole=new T.Path();hole.moveTo(-.36,-.25);hole.lineTo(-.51,.91);hole.lineTo(-.35,1.3);hole.lineTo(.35,1.3);hole.lineTo(.51,.91);hole.lineTo(.36,-.25);hole.closePath();outline.holes.push(hole);
  mesh(new T.ExtrudeGeometry(outline,{depth:.13,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:3}),blockMat,block,V(0,0,2.64),frontInfo);
  for(const [x,y] of [[-.48,-.32],[.48,-.32],[-.6,.45],[.6,.45],[-.49,1.2],[.49,1.2]]) {
    const screw=new T.Group();block.add(screw);screw.position.set(x,y,2.84);screw.rotation.x=Math.PI/2;bolt(screw,V());
  }
  for(const gear of [lower,upper]) {
    const r=gear===upper?.27:.12;
    for(let n=0;n<6;n++) {
      const a=n*Math.PI/3;
      axisCylinder(r*.22,.007,black,gear,V(Math.sin(a)*r,Math.cos(a)*r,.061),part('Sprocket face recess','Shallow recessed machining on the timing sprocket face.'));
    }
    axisCylinder(.085,.06,steel,gear,V(0,0,.09),part('Sprocket retaining hub','Locates and secures the timing sprocket concentrically on its shaft.'));
  }
  // Shared geometry keeps small chain-pin details inexpensive.
  const pinGeometry=new T.CylinderGeometry(.017,.017,.016,8);pinGeometry.rotateX(Math.PI/2);
  chainLinks.forEach(link=>mesh(pinGeometry,steel,link,V(0,0,.077),part('Timing-chain rivet','A hardened pin joins adjacent articulated chain plates.')));
  const panInfo=part('Sump stiffening rib','Pressed ribs stiffen the oil reservoir and reduce panel vibration.');
  for(let j=0;j<9;j++)box(1.28,.045,.065,dark,pan,V(0,-.215,-2.25+j*.56),panInfo);
  for(const side of [-1,1]) for(let j=0;j<6;j++) {
    box(.065,.2,.085,aluminum,pan,V(side*.74,0,-2.3+j*.92),part('Sump flange reinforcement','Reinforced tabs support the bolted oil-pan flange.'));
  }
  // Pump volute and hose clamps add serviceable hardware without a fictitious drive.
  const pump=part('Water-pump mounting flange','Machined mounting face behind the belt-driven water-pump pulley.');
  axisCylinder(.34,.075,headMat,block,V(0,1.85,2.92),pump);
  ring(.245,.025,steel,block,V(0,1.85,3.2),false,pump);
  for(let n=0;n<4;n++) {
    const a=Math.PI/4+n*Math.PI/2;
    const g=new T.Group();block.add(g);g.position.set(Math.sin(a)*.29,1.85+Math.cos(a)*.29,3.02);g.rotation.x=Math.PI/2;bolt(g,V());
  }
  const hosePath=new T.CatmullRomCurve3([V(0,1.85,3.19),V(.5,2,3.15),V(.85,2,2.72)]);
  for(const t of [.12,.85]) {
    const clamp=ring(.099,.016,steel,block,hosePath.getPoint(t),false,part('Coolant-hose clamp','A stainless band compresses the hose onto its outlet fitting.'));
    clamp.quaternion.setFromUnitVectors(V(0,0,1),hosePath.getTangent(t));
  }
  const pulleyInfo=part('Harmonic-damper face','Concentric machined faces and an elastomer ring help identify the crankshaft vibration damper.');
  // Concentric details remain on the crankshaft's single animated transform.
  for(const r of [.34,.39,.44])ring(r,.013,dark,crank,V(0,0,3.31),false,pulleyInfo);
}

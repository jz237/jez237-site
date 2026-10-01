import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Small fixed returns close the view behind each front wing. They follow the
 * donor's curved upper surface and leave clearance above the 375 mm tire. */
export function addClassicBayClosures(root:T.Group){
  root.updateMatrixWorld(true);
  const paint:T.Mesh[]=[];root.traverse(o=>{if(o instanceof T.Mesh&&o.name.startsWith('panel_FrontFender'))paint.push(o);});
  const steel=new T.MeshStandardMaterial({name:'Classic Wheelhouse Steel',color:0x282e2b,roughness:.8,metalness:.3,side:T.DoubleSide});
  const points:number[]=[],uv:number[]=[];
  const tri=(...vertices:T.Vector3[])=>{points.push(...vertices.flatMap(p=>p.toArray()));uv.push(0,0,1,0,1,1);};
  const quad=(a:T.Vector3,b:T.Vector3,c:T.Vector3,d:T.Vector3)=>{tri(a,b,c);tri(a,c,d);};
  const ray=new T.Raycaster(),down=new T.Vector3(0,-1,0);
  for(const side of [-1,1]){
    const wheel=root.getObjectByName('wheel_F'+(side<0?'L':'R'))!,centre=wheel.position;
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI,b=(i+1)/12*Math.PI;
      const at=(x:number,t:number)=>new T.Vector3(side*x,centre.y+Math.sin(t)*.43,centre.z+Math.cos(t)*.43);
      quad(at(.62,a),at(.82,a),at(.82,b),at(.62,b));
      tri(new T.Vector3(side*.62,centre.y,centre.z),at(.62,b),at(.62,a));
    }
    const rows:T.Vector3[][]=[];
    for(let i=0;i<=12;i++){
      const z=.82+i*1.22/12;ray.set(new T.Vector3(side*.79,2,z),down);const hit=ray.intersectObjects(paint,false)[0];
      if(!hit){rows.push([]);continue;}
      const dz=z-centre.z,arch=Math.abs(dz)<.43?centre.y+Math.sqrt(.43**2-dz**2):.43;
      rows.push([new T.Vector3(side*.65,hit.point.y-.1,z),new T.Vector3(side*.79,hit.point.y-.012,z),new T.Vector3(side*.79,Math.max(.43,arch),z)]);
    }
    for(let i=0;i<12;i++)if(rows[i].length&&rows[i+1].length){quad(rows[i][0],rows[i][1],rows[i+1][1],rows[i+1][0]);quad(rows[i][1],rows[i][2],rows[i+1][2],rows[i+1][1]);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();
  const mesh=new T.Mesh(g,steel);mesh.name='Structure front wheelhouses';mesh.receiveShadow=true;root.add(mesh);
}

/** Mechanical forms remain attached to the chassis when the outer hood lifts. */
export function addMuscleEngineBay(root:T.Group,steel:T.Material){
  const alloy=new T.MeshStandardMaterial({name:'Classic Engine Alloy',color:0x696b65,roughness:.43,metalness:.72});
  const rubber=new T.MeshStandardMaterial({name:'Classic Engine Hoses',color:0x1d211e,roughness:.8});
  const add=(name:string,g:T.BufferGeometry,m:T.Material,p:[number,number,number])=>{const geometry=g.index?g.toNonIndexed():g;if(geometry!==g)g.dispose();const mesh=new T.Mesh(geometry,m);mesh.name=name;mesh.position.set(...p);mesh.receiveShadow=true;root.add(mesh);return mesh;};
  const box=(name:string,s:[number,number,number],p:[number,number,number],m:T.Material=steel)=>add(name,new T.BoxGeometry(...s),m,p);
  box('Structure engine block',[.56,.27,.67],[0,.59,1.34]);
  for(const side of [-1,1]){
    const cover=add('Structure engine valve cover '+side,new RoundedBoxGeometry(.20,.12,.65,3,.035),alloy,[side*.24,.755,1.34]);cover.rotation.z=side*.18;
    box('Structure chassis rail '+side,[.11,.12,3.75],[side*.56,.50,-.015]);
    box('Structure engine bay side '+side,[.045,.30,1.12],[side*.65,.63,1.36]);
    // Six shallow casting ribs remain a single batch per material at runtime.
    for(let i=0;i<6;i++)box('Structure engine casting rib '+side+' '+i,[.11,.012,.018],[side*.235,.818,1.10+i*.085],alloy);
  }
  add('Structure engine air cleaner',new T.CylinderGeometry(.21,.22,.075,24),steel,[0,.825,1.30]);
  add('Structure engine air cleaner lid',new T.CylinderGeometry(.215,.215,.009,24),alloy,[0,.867,1.30]);
  box('Structure radiator',[1.1,.34,.08],[0,.61,2.025]);
  box('Structure firewall',[1.3,.36,.045],[0,.65,.77]);
  box('Structure radiator top',[1.22,.05,.15],[0,.82,2.025],alloy);
  const hose=new T.CatmullRomCurve3([new T.Vector3(.08,.70,1.70),new T.Vector3(.23,.76,1.83),new T.Vector3(.23,.77,2.01)]);
  add('Structure upper radiator hose',new T.TubeGeometry(hose,10,.029,8,false),rubber,[0,0,0]);
  for(let i=0;i<17;i++)box('Structure radiator fin '+i,[.028,.26,.012],[-.48+i*.06,.61,2.072],alloy);
}

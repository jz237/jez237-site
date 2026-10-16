import * as T from 'three';
export type SpectatorPlace={x:number;y:number;z:number;yaw:number;seated?:boolean};
/** Original low-poly spectators, batched by geometry rather than person or outfit.
 * Local +Z faces the event; y is the grandstand tread, not the seat top. */
export function createVenueCrowd(places:readonly SpectatorPlace[]){
 const root=new T.Group();root.name='venue_spectators';
 const geometries={torso:new T.CylinderGeometry(.24,.19,1,6,1),limb:new T.CylinderGeometry(1,1,1,5,1),head:new T.SphereGeometry(1,8,5),box:new T.BoxGeometry()};
 const material=new T.MeshStandardMaterial({roughness:.92});
 type Shape=keyof typeof geometries;const batches=new Map<Shape,{matrix:T.Matrix4;color:T.Color}[]>(),object=new T.Object3D(),base=new T.Matrix4(),up=new T.Vector3(0,1,0);
 const shirts=[0xa44331,0x426f83,0xd2b968,0xd1d0bf,0x3e5744,0x6c4c69,0x34454d,0xa56b39],pants=[0x293742,0x4b5043,0x655747,0x333338],skin=[0xd8ab84,0xbc8c68,0x9b694b,0x754d38,0xe6bc9c];
 function add(shape:Shape,color:number,x:number,y:number,z:number,sx:number,sy:number,sz:number){object.position.set(x,y,z);object.quaternion.identity();object.scale.set(sx,sy,sz);object.updateMatrix();push(shape,color);}
 function push(shape:Shape,color:number){const rows=batches.get(shape)??[];rows.push({matrix:new T.Matrix4().multiplyMatrices(base,object.matrix),color:new T.Color(color)});batches.set(shape,rows);}
 function bone(color:number,a:number[],b:number[],radius:number){const from=new T.Vector3(...a),to=new T.Vector3(...b);object.position.copy(from).add(to).multiplyScalar(.5);object.quaternion.setFromUnitVectors(up,to.clone().sub(from).normalize());object.scale.set(radius,from.distanceTo(to),radius);object.updateMatrix();push('limb',color);}
 places.forEach((p,i)=>{
  base.makeRotationY(p.yaw);base.setPosition(p.x,p.y,p.z);
  const seated=p.seated!==false,hip=seated?.48:.88,shirt=shirts[(i*7+Math.floor(i/5))%shirts.length],trouser=pants[i%pants.length],face=skin[(i*3+Math.floor(i/7))%skin.length],lean=(i%5-2)*.025;
  add('torso',shirt,0,hip+.32,lean,1,.57,.7);add('box',trouser,0,hip-.04,0,.36,.2,.27);
  bone(face,[0,hip+.57,lean],[0,hip+.69,lean],.065);add('head',face,0,hip+.8,lean+.025,.145,.19,.145);
  if(i%3!==0){add('head',i%2?0x33312d:shirt,0,hip+.93,lean,.151,.075,.15);if(i%4===0)add('box',shirt,0,hip+.9,lean+.16,.27,.035,.15);}
  for(const side of [-1,1]){
   const hx=side*.12,knee=seated?[hx,hip-.08,.34]:[hx,.46,.025],foot=seated?[hx,.12,.4]:[hx,.09,.05];
   bone(trouser,[hx,hip,0],knee,.09);bone(trouser,knee,foot,.075);add('box',0x282c2d,foot[0],.075,foot[2]+.06,.17,.13,.29);
   const cheer=i%9===0||i%11===0&&side===1,shoulder=[side*.23,hip+.53,lean],elbow=cheer?[side*.36,hip+.8,.02]:[side*.31,hip+.23,.1],hand=cheer?[side*.28,hip+1.1,.08]:[side*.18,hip+.1,seated?.29:.12];
   bone(shirt,shoulder,elbow,.075);bone(face,elbow,hand,.055);add('head',face,hand[0],hand[1],hand[2],.065,.085,.06);
  }
 });
 let triangles=0;for(const[shape,rows]of batches){const geo=geometries[shape],mesh=new T.InstancedMesh(geo,material,rows.length);mesh.name='crowd_'+shape;rows.forEach((row,i)=>{mesh.setMatrixAt(i,row.matrix);mesh.setColorAt(i,row.color)});mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);triangles+=(geo.index?.count??geo.getAttribute('position').count)/3*rows.length;}
 root.userData.spectatorCount=places.length;root.userData.triangles=triangles;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose()});Object.values(geometries).forEach(g=>g.dispose());material.dispose();root.clear();}};
}

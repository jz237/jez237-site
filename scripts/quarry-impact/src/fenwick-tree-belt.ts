import * as T from 'three';
export type FenwickTreePlace={x:number;y:number;z:number;radius:number;height:number};
/** Crossed cutout cards keep the distant belt visible from every race/replay direction. */
export function createFenwickTreeBelt(places:readonly FenwickTreePlace[],coniferDominant=false){
 const root=new T.Group();root.name='fenwick_tree_belt';const owned:{mesh:T.InstancedMesh;geometry:T.PlaneGeometry;material:T.MeshBasicMaterial;texture:T.Texture}[]=[];
 for(const [kind,aspect]of [['maple',712/1024],['spruce',402/1024]]as const){
  const selected=places.filter((_,i)=>{const spruce=coniferDominant?i%4!==0:i%4===0;return kind==='spruce'?spruce:!spruce;});
  const texture=typeof document==='undefined'?new T.Texture():new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'models/'+kind+'.webp');texture.colorSpace=T.SRGBColorSpace;
  const material=new T.MeshBasicMaterial({map:texture,alphaTest:.45,side:T.DoubleSide,color:0xffffff});
  const geometry=new T.PlaneGeometry(1,1);geometry.translate(0,.5,0);
  const mesh=new T.InstancedMesh(geometry,material,selected.length*2);mesh.name='fenwick_tree_cards_'+kind;const obj=new T.Object3D();
  selected.forEach((p,i)=>{for(let side=0;side<2;side++){
   obj.position.set(p.x,p.y,p.z);obj.rotation.set(0,i*2.399963+side*Math.PI/2,0);obj.scale.set(Math.min(p.height*aspect,p.radius*2.8),p.height,1);obj.updateMatrix();mesh.setMatrixAt(i*2+side,obj.matrix);mesh.setColorAt(i*2+side,new T.Color().setRGB(.86+(i%5)*.025,.9+(i%4)*.025,.83+(i%3)*.04));
  }});
  mesh.computeBoundingSphere();root.add(mesh);owned.push({mesh,geometry,material,texture});
 }
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();for(const o of owned){o.mesh.dispose();o.geometry.dispose();o.material.dispose();o.texture.dispose();}root.clear();}};
}

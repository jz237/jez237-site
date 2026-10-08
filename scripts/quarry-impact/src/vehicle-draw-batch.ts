import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

type Part = {mesh:T.Mesh;start:number;indexStart:number;indices:Uint16Array|Uint32Array;layers:number;visible:boolean;mirrored:boolean;versions:number[];names:string[];attributes:T.BufferAttribute[];matrix:T.Matrix4;parents:T.Object3D[]};
type Batch = {mesh:T.Mesh<T.BufferGeometry,T.Material>;parts:Part[]};

/** Render copies only. Each source panel remains an independent damage target;
 * only changed attributes are copied into a shared draw buffer. */
export class VehicleDrawBatch {
  readonly root=new T.Group();
  readonly batches:Batch[]=[];
  private matrix=new T.Matrix4();
  private normal=new T.Matrix3();
  private vector=new T.Vector3();
  private bounds=new T.Sphere();
  private nodes=new Set<T.Object3D>();
  private disposed=false;
  constructor(readonly source:T.Object3D){
    this.root.name='vehicle_draw_batches';
    const groups=new Map<string,T.Mesh[]>();
    source.traverse(object=>{
      if(!(object instanceof T.Mesh)||!object.name.startsWith('panel_')||object instanceof T.SkinnedMesh||
        Array.isArray(object.material)||object.material.transparent||object.morphTargetInfluences?.length||
        object.geometry.groups.length||object.geometry.drawRange.start!==0||object.geometry.drawRange.count!==Infinity||
        object.customDepthMaterial||object.customDistanceMaterial||object.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return;
      const attributes=(Object.entries(object.geometry.attributes) as [string,T.BufferAttribute][]).sort(([a],[b])=>a.localeCompare(b));
      if(attributes.some(([,a])=>!(a instanceof T.BufferAttribute)))return;
      const key=[object.material.uuid,object.castShadow,object.receiveShadow,object.renderOrder,object.layers.mask,
        ...attributes.map(([name,a])=>`${name}:${a.itemSize}:${a.normalized}:${a.array.constructor.name}`)].join('|');
      const group=groups.get(key)??[];group.push(object);groups.set(key,group);
    });
    for(const members of groups.values()){
      if(members.length<2)continue;
      const copies=members.map(m=>{const g=m.geometry.clone();if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));return g;});
      const geometry=mergeGeometries(copies);copies.forEach(g=>g.dispose());if(!geometry)continue;
      const first=members[0],mesh=new T.Mesh(geometry,first.material as T.Material);
      mesh.name='batched_'+(first.material as T.Material).name;
      mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.renderOrder=first.renderOrder;mesh.layers.mask=first.layers.mask;
      geometry.boundingSphere=new T.Sphere();
      let start=0,indexStart=0;
      const parts=members.map(part=>{
        const count=part.geometry.index?.count??part.geometry.attributes.position.count;
        const indices=(geometry.index!.array as Uint16Array|Uint32Array).slice(indexStart,indexStart+count);
        const attributes=Object.values(part.geometry.attributes) as T.BufferAttribute[],parents:T.Object3D[]=[];
        for(let p:T.Object3D|null=part;p&&p!==source;p=p.parent){parents.unshift(p);this.nodes.add(p);}
        const entry={mesh:part,start,indexStart,indices,layers:part.layers.mask,visible:true,mirrored:false,attributes,names:Object.keys(part.geometry.attributes),versions:attributes.map(()=>-1),matrix:new T.Matrix4(),parents};
        start+=part.geometry.attributes.position.count;indexStart+=count;return entry;
      });
      this.batches.push({mesh,parts});this.root.add(mesh);
    }
    source.add(this.root);this.sync();
    for(const batch of this.batches)for(const part of batch.parts)part.mesh.layers.mask=0;
  }
  sync(){
    if(this.disposed)return;
    for(const node of this.nodes)if(node.matrixAutoUpdate)node.updateMatrix();
    for(const batch of this.batches){
      let boundsChanged=false;
      for(const part of batch.parts){
        let visible=true;this.matrix.identity();
        for(const parent of part.parents){this.matrix.multiply(parent.matrix);visible&&=parent.visible;}
        const moved=!this.matrix.equals(part.matrix);
        if(moved)this.normal.getNormalMatrix(this.matrix);
        for(let i=0;i<part.names.length;i++){
          const name=part.names[i],attribute=part.mesh.geometry.getAttribute(name) as T.BufferAttribute;
          const transform=name==='position'||name==='normal';
          if(attribute===part.attributes[i]&&attribute.version===part.versions[i]&&!(moved&&transform))continue;
          const target=batch.mesh.geometry.getAttribute(name) as T.BufferAttribute;
          if(transform){
            if(name==='normal')this.normal.getNormalMatrix(this.matrix);
            for(let v=0;v<attribute.count;v++){
              this.vector.fromBufferAttribute(attribute,v);
              if(name==='position')this.vector.applyMatrix4(this.matrix);else this.vector.applyNormalMatrix(this.normal);
              target.setXYZ(part.start+v,this.vector.x,this.vector.y,this.vector.z);
            }
            if(name==='position')boundsChanged=true;
          }else target.array.set(attribute.array,part.start*attribute.itemSize);
          target.addUpdateRange(part.start*attribute.itemSize,attribute.array.length);target.needsUpdate=true;
          part.attributes[i]=attribute;part.versions[i]=attribute.version;
        }
        const mirrored=this.matrix.determinant()<0;
        if(visible!==part.visible||mirrored!==part.mirrored){
          const index=batch.mesh.geometry.index!,array=index.array as Uint16Array|Uint32Array;
          if(visible){array.set(part.indices,part.indexStart);if(mirrored)for(let i=0;i<part.indices.length;i+=3){array[part.indexStart+i+1]=part.indices[i+2];array[part.indexStart+i+2]=part.indices[i+1];}}else array.fill(part.start,part.indexStart,part.indexStart+part.indices.length);
          index.addUpdateRange(part.indexStart,part.indices.length);index.needsUpdate=true;part.visible=visible;part.mirrored=mirrored;
        }
        part.matrix.copy(this.matrix);
      }
      if(boundsChanged){
        const sphere=batch.mesh.geometry.boundingSphere!;sphere.makeEmpty();
        for(const part of batch.parts){
          if(!part.mesh.geometry.boundingSphere)part.mesh.geometry.computeBoundingSphere();
          this.bounds.copy(part.mesh.geometry.boundingSphere!).applyMatrix4(part.matrix);sphere.union(this.bounds);
        }
      }
    }
  }
  dispose(){
    if(this.disposed)return;this.disposed=true;
    for(const batch of this.batches){for(const part of batch.parts)part.mesh.layers.mask=part.layers;batch.mesh.geometry.dispose();}
    this.root.removeFromParent();
  }
}

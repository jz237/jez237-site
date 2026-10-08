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
  private transforms=new Map<T.Object3D,T.Matrix4>();
  private orderedNodes:T.Object3D[]=[];
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
    source.traverse(node=>{if(this.nodes.has(node)){this.orderedNodes.push(node);this.transforms.set(node,new T.Matrix4());}});
    source.add(this.root);this.sync();
    for(const batch of this.batches)for(const part of batch.parts)part.mesh.layers.mask=0;
  }
  sync(){
    if(this.disposed)return;
    // Compute each ancestry path once; dozens of panels share the same parents.
    for(const node of this.orderedNodes){
      if(node.matrixAutoUpdate)node.updateMatrix();
      const parent=node.parent&&this.transforms.get(node.parent),matrix=this.transforms.get(node)!;
      if(parent)matrix.multiplyMatrices(parent,node.matrix);else matrix.copy(node.matrix);
    }
    for(const batch of this.batches){
      let boundsChanged=false;
      for(const part of batch.parts){
        let visible=true;this.matrix.copy(this.transforms.get(part.mesh)!);
        for(const parent of part.parents)visible&&=parent.visible;
        const moved=!this.matrix.equals(part.matrix);
        for(let i=0;i<part.names.length;i++){
          const name=part.names[i],attribute=part.mesh.geometry.getAttribute(name) as T.BufferAttribute;
          const transform=name==='position'||name==='normal';
          if(attribute===part.attributes[i]&&attribute.version===part.versions[i]&&!(moved&&transform))continue;
          const target=batch.mesh.geometry.getAttribute(name) as T.BufferAttribute;
          if(transform){
            if(name==='normal')this.normal.getNormalMatrix(this.matrix);
            const input=attribute.array,output=target.array,offset=part.start*3;
            const packed=!attribute.normalized&&!target.normalized&&attribute.itemSize===3&&target.itemSize===3&&
              (input instanceof Float32Array||input instanceof Float64Array)&&(output instanceof Float32Array||output instanceof Float64Array);
            const e=this.matrix.elements;
            if(packed&&name==='position'&&e[3]===0&&e[7]===0&&e[11]===0&&e[15]===1){
              for(let v=0;v<input.length;v+=3){const x=input[v],y=input[v+1],z=input[v+2];
                output[offset+v]=e[0]*x+e[4]*y+e[8]*z+e[12];
                output[offset+v+1]=e[1]*x+e[5]*y+e[9]*z+e[13];
                output[offset+v+2]=e[2]*x+e[6]*y+e[10]*z+e[14];
              }
            }else if(packed&&name==='normal'){
              const n=this.normal.elements;
              for(let v=0;v<input.length;v+=3){const x=input[v],y=input[v+1],z=input[v+2];
                const nx=n[0]*x+n[3]*y+n[6]*z,ny=n[1]*x+n[4]*y+n[7]*z,nz=n[2]*x+n[5]*y+n[8]*z;
                const inverse=1/(Math.sqrt(nx*nx+ny*ny+nz*nz)||1);
                output[offset+v]=nx*inverse;output[offset+v+1]=ny*inverse;output[offset+v+2]=nz*inverse;
              }
            }else for(let v=0;v<attribute.count;v++){
              this.vector.fromBufferAttribute(attribute,v);
              if(name==='position')this.vector.applyMatrix4(this.matrix);else this.vector.applyNormalMatrix(this.normal);
              target.setXYZ(part.start+v,this.vector.x,this.vector.y,this.vector.z);
            }
            if(name==='position')boundsChanged=true;
          }else target.array.set(attribute.array,part.start*attribute.itemSize);
          target.addUpdateRange(part.start*attribute.itemSize,attribute.array.length);target.needsUpdate=true;
          part.attributes[i]=attribute;part.versions[i]=attribute.version;
        }
        const mirrored=moved?this.matrix.determinant()<0:part.mirrored;
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

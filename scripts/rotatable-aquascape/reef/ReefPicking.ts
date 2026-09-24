import * as T from 'three';

/** Broad phase for the existing raycaster. Cache-ordered triangle blocks are
 * spatially compact; their bounds discard distant detail before Three performs
 * its exact face/UV intersection. No proxy mesh or extra vertex/index buffer. */
export function accelerateReefPicking(root:T.Object3D){
 let meshes=0,blocks=0,bytes=0;
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||object instanceof T.InstancedMesh||object instanceof T.SkinnedMesh)return;
  const geometry=object.geometry,index=geometry.index,position=geometry.getAttribute('position');
  if(!index||index.count<3000||geometry.groups.length||geometry.drawRange.start!==0||geometry.drawRange.count!==Infinity)return;
  const blockSize=256*3,count=Math.ceil(index.count/blockSize),bounds=new Float64Array(count*6);
  for(let block=0;block<count;block++){
   let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
   for(let i=block*blockSize,end=Math.min(index.count,i+blockSize);i<end;i++){
    const vertex=index.getX(i),x=position.getX(vertex),y=position.getY(vertex),z=position.getZ(vertex);
    minX=Math.min(minX,x);minY=Math.min(minY,y);minZ=Math.min(minZ,z);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);maxZ=Math.max(maxZ,z);
   }
   bounds.set([minX,minY,minZ,maxX,maxY,maxZ],block*6);
  }
  const native=object.raycast,localRay=new T.Ray(),inverse=new T.Matrix4(),box=new T.Box3();
  const indexVersion=index.version,positionVersion=position.version;
  object.raycast=function(raycaster,hits){
   // Mutable geometries and partial draws retain the normal Three.js path.
   if(this.geometry!==geometry||geometry.index!==index||geometry.getAttribute('position')!==position||index.version!==indexVersion||position.version!==positionVersion||geometry.drawRange.start!==0||geometry.drawRange.count!==Infinity){native.call(this,raycaster,hits);return;}
   localRay.copy(raycaster.ray).applyMatrix4(inverse.copy(this.matrixWorld).invert());
   try{
    for(let block=0;block<count;block++){
     box.min.fromArray(bounds,block*6);box.max.fromArray(bounds,block*6+3);
     if(!localRay.intersectsBox(box))continue;
     geometry.setDrawRange(block*blockSize,Math.min(blockSize,index.count-block*blockSize));
     native.call(this,raycaster,hits);
    }
   }finally{geometry.setDrawRange(0,Infinity);}
  };
  meshes++;blocks+=count;bytes+=bounds.byteLength;
 });
 return {meshes,blocks,bytes};
}

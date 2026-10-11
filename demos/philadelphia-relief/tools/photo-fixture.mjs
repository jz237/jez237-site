// A tiny in-memory GLB tileset exercises the real Cesium renderer without an ion
// account, Google tile requests, or changes to any provider's origin restrictions.
export function fixtureTileset(C,lon,lat){
  const positions=[],normals=[],colors=[],indices=[];
  const faces=[[[1,0,0],[1,0,0],[1,1,0],[1,1,1],[1,0,1]],
    [[-1,0,0],[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[1,1,1],[1,1,0],[0,1,0]],
    [[0,-1,0],[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
    [[0,0,1],[1,0,1],[1,1,1],[0,1,1],[0,0,1]],
    [[0,0,-1],[0,0,0],[0,1,0],[1,1,0],[1,0,0]]];
  function box(x,y,z,w,h,d,color){
    for(const [normal,...corners] of faces){
      const first=positions.length/3;
      for(const p of corners){
        positions.push(x+(p[0]-.5)*w,y+(p[1]-.5)*h,z+(p[2]-.5)*d);
        normals.push(...normal);colors.push(...color,1);
      }
      indices.push(first,first+1,first+2,first,first+2,first+3);
    }
  }
  box(0,17.5,0,50,35,50,[.8,.62,.35]);
  box(0,70,80,65,140,30,[.25,.45,.7]);
  box(0,-1,0,260,2,260,[.35,.43,.38]);
  const arrays=[new Float32Array(positions),new Float32Array(normals),new Float32Array(colors),
    new Uint16Array(indices)],views=[];let length=0;
  for(const a of arrays){views.push({buffer:0,byteOffset:length,byteLength:a.byteLength});length+=a.byteLength;}
  const doc={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],
    meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1,COLOR_0:2},indices:3,material:0}]}],
    materials:[{pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],metallicFactor:0,roughnessFactor:1}}],
    buffers:[{byteLength:length}],bufferViews:views,accessors:[
      {bufferView:0,componentType:5126,count:positions.length/3,type:'VEC3',
        min:[-130,-2,-130],max:[130,140,130]},
      {bufferView:1,componentType:5126,count:normals.length/3,type:'VEC3'},
      {bufferView:2,componentType:5126,count:colors.length/4,type:'VEC4'},
      {bufferView:3,componentType:5123,count:indices.length,type:'SCALAR'}]};
  const json=new TextEncoder().encode(JSON.stringify(doc));
  const jsonLength=Math.ceil(json.length/4)*4,bufferLength=Math.ceil(length/4)*4;
  const glb=new ArrayBuffer(28+jsonLength+bufferLength),view=new DataView(glb),bytes=new Uint8Array(glb);
  view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,glb.byteLength,true);
  view.setUint32(12,jsonLength,true);view.setUint32(16,0x4e4f534a,true);
  bytes.fill(32,20,20+jsonLength);bytes.set(json,20);
  view.setUint32(20+jsonLength,bufferLength,true);view.setUint32(24+jsonLength,0x004e4942,true);
  for(let i=0;i<arrays.length;i++)bytes.set(new Uint8Array(arrays[i].buffer),28+jsonLength+views[i].byteOffset);
  const content=URL.createObjectURL(new Blob([glb],{type:'model/gltf-binary'}));
  const transform=C.Matrix4.toArray(C.Transforms.eastNorthUpToFixedFrame(C.Cartesian3.fromDegrees(lon,lat,4)));
  const tileset={asset:{version:'1.1'},geometricError:500,root:{transform,geometricError:0,refine:'ADD',
    boundingVolume:{box:[0,0,69,130,0,0,0,130,0,0,0,71]},content:{uri:content}}};
  const url=URL.createObjectURL(new Blob([JSON.stringify(tileset)],{type:'application/json'}));
  return {url,dispose(){URL.revokeObjectURL(url);URL.revokeObjectURL(content);}};
}

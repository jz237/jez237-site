import { prepareInBatches } from './background-work.js?v=philly-2026092207';

/** Project once; all raster work thereafter uses metres and preserves holes. */
export function projectWaterPolygons(entries,projection){
  return entries.map(entry=>{
    const rings=[entry.ring,...(entry.holes||[])].map(ring=>ring.map(([lon,lat])=>
      [projection.lonToX(lon),projection.latToZ(lat)]));
    const xs=rings[0].map(p=>p[0]),zs=rings[0].map(p=>p[1]);
    return {rings,bounds:[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)]};
  });
}

/** Scanline coverage at pixel centres. Even/odd rings keep islands dry. */
export function* waterMaskSteps(polygons,bounds,size=2048){
  const data=new Uint8Array(size*size),[west,north,east,south]=bounds;
  const sx=size/(east-west),sy=size/(south-north);
  for(const polygon of polygons){
    const b=polygon.bounds;
    if(b[0]>=east||b[2]<=west||b[1]>=south||b[3]<=north)continue;
    const buckets=new Map();let first=size,last=0;
    for(const ring of polygon.rings)for(let i=0;i<ring.length;i++){
      let a=ring[i],b=ring[(i+1)%ring.length];
      if(a[1]===b[1])continue;if(a[1]>b[1])[a,b]=[b,a];
      const y0=(a[1]-north)*sy,y1=(b[1]-north)*sy;
      const start=Math.max(0,Math.ceil(y0-.5)),end=Math.min(size,Math.ceil(y1-.5));
      if(start>=end)continue;
      const slope=(b[0]-a[0])*sx/((b[1]-a[1])*sy);
      const edge={end,start,x:(a[0]-west)*sx+(start+.5-y0)*slope,slope};
      if(!buckets.has(start))buckets.set(start,[]);buckets.get(start).push(edge);
      first=Math.min(first,start);last=Math.max(last,end);
    }
    let active=[];
    for(let row=first;row<last;row++){
      if((row&15)===0)yield;
      active=active.filter(edge=>edge.end>row);
      active.push(...(buckets.get(row)||[]));
      const crossings=active.map(edge=>edge.x+(row-edge.start)*edge.slope).sort((a,b)=>a-b);
      for(let i=0;i+1<crossings.length;i+=2){
        const from=Math.max(0,Math.ceil(crossings[i]-.5)),to=Math.min(size,Math.ceil(crossings[i+1]-.5));
        if(from<to)data.fill(255,row*size+from,row*size+to);
      }
    }
  }
  return data;
}

export function localWaterCell(x,z,distance){
  if(distance>16000)return null;
  const span=2**Math.ceil(Math.log2(Math.max(4096,distance*6)));
  const step=span/4,cx=Math.round(x/step)*step,cz=Math.round(z/step)*step;
  return {key:`${span}:${cx}:${cz}`,bounds:[cx-span/2,cz-span/2,cx+span/2,cz+span/2]};
}

export function waterMaskUniforms(THREE){
  return {uWaterGlobal:{value:null},uWaterLocal:{value:null},
    uWaterBounds:{value:new THREE.Vector4()},uWaterLocalBounds:{value:new THREE.Vector4()},
    uWaterReady:{value:0},uWaterLocalReady:{value:0},uWaterOpacity:{value:0},
    uWaterTime:{value:0},uWaterDeep:{value:new THREE.Vector3()},
    uWaterShallow:{value:new THREE.Vector3()},uWaterSpec:{value:new THREE.Vector3()},
    uWaterIntensity:{value:0}};
}

/** Two single-channel masks; local coverage adds 2 m shores to the region map. */
export function createWaterMask(THREE,{entries,projection,source,onReady=()=>{},size=2048}){
  const polygons=projectWaterPolygons(entries,projection),uniforms=waterMaskUniforms(THREE);
  for(const [target,key] of Object.entries({uWaterOpacity:'uOpacity',uWaterTime:'uTime',
    uWaterDeep:'uColor',uWaterShallow:'uShallow',uWaterSpec:'uSpecColor',uWaterIntensity:'uIntensity'})){
    uniforms[target]=source[key];
  }
  let disposed=false,localKey='',localJob;
  const controller=new AbortController();
  const texture=data=>{
    const tex=new THREE.DataTexture(data,size,size,THREE.RedFormat,THREE.UnsignedByteType);
    tex.minFilter=tex.magFilter=THREE.LinearFilter;tex.generateMipmaps=false;tex.needsUpdate=true;
    return tex;
  };
  const bounds=[-projection.widthM/2,-projection.heightM/2,projection.widthM/2,projection.heightM/2];
  uniforms.uWaterBounds.value.fromArray(bounds);
  const ready=prepareInBatches(waterMaskSteps(polygons,bounds,size),{signal:controller.signal})
    .then(data=>{if(disposed)return;uniforms.uWaterGlobal.value=texture(data);
      uniforms.uWaterReady.value=1;onReady();})
    .catch(error=>{if(error.name!=='AbortError')console.warn('Water coverage could not be prepared.');});
  return {uniforms,ready,
    update(pose){
      if(disposed||uniforms.uWaterOpacity.value<.001)return;
      const cell=localWaterCell(projection.lonToX(pose.lon),projection.latToZ(pose.lat),pose.dist);
      if(!cell||cell.key===localKey)return;
      localKey=cell.key;localJob?.abort();localJob=new AbortController();const job=localJob;
      void prepareInBatches(waterMaskSteps(polygons,cell.bounds,size),{signal:job.signal})
        .then(data=>{if(disposed||job.signal.aborted)return;
          uniforms.uWaterLocal.value?.dispose();uniforms.uWaterLocal.value=texture(data);
          uniforms.uWaterLocalBounds.value.fromArray(cell.bounds);
          uniforms.uWaterLocalReady.value=1;onReady();})
        .catch(error=>{if(error.name!=='AbortError')console.warn('Water detail could not be prepared.');});
    },
    dispose(){disposed=true;controller.abort();localJob?.abort();
      uniforms.uWaterGlobal.value?.dispose();uniforms.uWaterLocal.value?.dispose();},
  };
}

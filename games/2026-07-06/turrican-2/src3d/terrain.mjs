// Tile map -> sculpted 3D terrain: play-lane blocks, the landscape behind the lane,
// cave ceilings/back walls, crates, hazards, water, platforms, waterfalls, beacons.
import * as THREE from 'three';
import {mergeVertices,mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {fbm3,ridge3,noise3,rng} from './noise.mjs';
import {terrainMaterial,crystalMaterial} from './materials.mjs';

export const TILE=20,Z_FRONT=26,Z_BACK=-72;
const TT={EMPTY:0,SOLID:1,SPIKE:2,PLATFORM:3,DECO:4,WATER:5,CRATE:6};

export function buildTerrain(level,theme,quality){
  const T=TILE,cols=level.cols,rows=level.rows,tiles=level.tiles;
  const hasCeiling=(()=>{let n=0;for(let x=0;x<cols;x++)if(tiles[x]===TT.SOLID)n++;return n>cols*.6;})(),enclosed=!!theme.enclosed;
  const industrial=theme.kind==='industrial';
  const S=quality==='low'?2:4,D=quality==='low'?4:8;
  const tileAt=(tx,ty)=>{tx=Math.max(0,Math.min(cols-1,tx));if(ty>=rows)return TT.SOLID;if(ty<0)ty=hasCeiling?0:-1;if(ty<0)return TT.EMPTY;return tiles[ty*cols+tx];};
  const solid=(tx,ty)=>tileAt(tx,ty)===TT.SOLID;
  const group=new THREE.Group();group.name='terrain';
  const r=rng(level.world*1000+level.stageIndex*17+7);

  // --- water mask texture (shader caustics + underwater tint)
  let waterMask=null;
  if(level.hasWater){const data=new Uint8Array(cols*rows);for(let i=0;i<cols*rows;i++)data[i]=tiles[i]===TT.WATER?255:0;
    waterMask=new THREE.DataTexture(data,cols,rows,THREE.RedFormat,THREE.UnsignedByteType);waterMask.flipY=false;waterMask.magFilter=waterMask.minFilter=THREE.NearestFilter;waterMask.needsUpdate=true;}
  const mat=terrainMaterial(theme,{waterMask,cols,rows});
  const mats=[mat];

  // column surface heights (top of the ground mass touching the bottom) and ceilings
  const ground=new Float32Array(cols),ceil=new Float32Array(cols);
  for(let x=0;x<cols;x++){let y=rows-1;if(!solid(x,y)){ground[x]=-(rows*T+90);}else{while(y>0&&solid(x,y-1))y--;ground[x]=-y*T;}
    let c=0;if(hasCeiling&&solid(x,0)){while(c<rows-1&&solid(x,c+1))c++;ceil[x]=-(c+1)*T;}else ceil[x]=200;}
  const sample=(arr,px)=>{const f=px/T-.5,i=Math.floor(f),t=f-i,a=arr[Math.max(0,Math.min(cols-1,i))],b=arr[Math.max(0,Math.min(cols-1,i+1))];return a+(b-a)*t;};
  const smooth=(arr,px,w)=>{let s=0,n=0;for(let k=-w;k<=w;k+=T/2){s+=sample(arr,px+k);n++;}return s/n;};

  // --- displacement field: a pure function of position keeps shared edges watertight
  const amp=industrial?0:(theme.key==='spire'?7:theme.key==='vaults'?6:5.5);
  const cache=new Map();
  function displace(x,y,z,out){
    if(!amp){out[0]=x;out[1]=y;out[2]=z;out[3]=0;return;}
    const k=((x*4)|0)+','+((y*4)|0)+','+((z*4)|0);let v=cache.get(k);
    if(!v){const f=theme.key==='spire'?.022:.034,sx=x*f,sy=y*f,sz=z*f;
      // limit vertical motion on the walkway band so feet meet the ground
      const lane=z>-40&&z<Z_FRONT-5?.12:1;
      let dz=fbm3(sx,sy+57,sz,3)*amp*1.7;if(theme.rock.strata)dz+=Math.sin(y*.42+fbm3(sx*.5,sy*.5,0,2)*3)*2.6*theme.rock.strata;
      v=[fbm3(sx,sy,sz,3)*amp,fbm3(sx+31,sy,sz,3)*amp*lane,dz];cache.set(k,v);}
    out[0]=x+v[0];out[1]=y+v[1];out[2]=z+v[2];out[3]=v[2]/(amp*2.2);
  }

  // AO: darker with depth below the exposed top of the column, and towards the back
  function ao(x,y,z){const g=sample(ground,x);const below=Math.max(0,(g-y)/T);let a=1-Math.min(.5,below*.07);
    if(z<Z_BACK+12)a*=.86;return a*(.9+.1*noise3(x*.05,y*.05,z*.05));}

  // --- lane blocks, chunked for frustum culling
  const CHUNK=16,pad=26,chunks=[];
  const tmp=[0,0,0,0];
  for(let c0=-pad;c0<cols+pad;c0+=CHUNK){
    const pos=[],col=[];
    const quad=(o,ax,ay,nu,nv)=>{ // o origin, ax/ay edge vectors, nu/nv segments
      for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
        const p=(u,v)=>[o[0]+ax[0]*u+ay[0]*v,o[1]+ax[1]*u+ay[1]*v,o[2]+ax[2]*u+ay[2]*v];
        const a=p(i/nu,j/nv),b=p((i+1)/nu,j/nv),c=p((i+1)/nu,(j+1)/nv),d=p(i/nu,(j+1)/nv);
        for(const q of [a,c,b,a,d,c]){displace(q[0],q[1],q[2],tmp);pos.push(tmp[0],tmp[1],tmp[2]);const s=ao(q[0],q[1],q[2])*(.8+.2*Math.max(-1,Math.min(1,tmp[3]*2)));col.push(s,s,s);}
      }
    };
    for(let tx=c0;tx<c0+CHUNK;tx++)for(let ty=0;ty<rows+3;ty++){
      if(!solid(tx,ty))continue;
      // skip deep interior tiles that are never visible (more than 3 rows under the ground mass and level bottom)
      const x0=tx*T,x1=x0+T,y0=-ty*T,y1=y0-T;
      quad([x0,y0,Z_FRONT],[T,0,0],[0,-T,0],S,S); // front (ccw seen from +z)
      if(!solid(tx,ty-1))quad([x0,y0,Z_BACK],[T,0,0],[0,0,Z_FRONT-Z_BACK],S,D);
      if(!solid(tx,ty+1)&&ty<rows+2)quad([x0,y1,Z_FRONT],[T,0,0],[0,0,Z_BACK-Z_FRONT],S,D);
      if(!solid(tx-1,ty))quad([x0,y0,Z_BACK],[0,0,Z_FRONT-Z_BACK],[0,-T,0],D,S);
      if(!solid(tx+1,ty))quad([x1,y0,Z_FRONT],[0,0,Z_BACK-Z_FRONT],[0,-T,0],D,S);
    }
    if(!pos.length)continue;
    let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    if(!industrial){g=mergeVertices(g,.01);}
    g.computeVertexNormals();g.computeBoundingSphere();
    const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);chunks.push(mesh);
  }

  // --- landscape behind the lane (heightfield), plus ceiling + back wall for enclosed worlds
  const zRows=enclosed?[Z_BACK+10,Z_BACK-6,-95,-120,-150,-190,-240,-300]:[Z_BACK+10,Z_BACK-6,-95,-120,-150,-190,-240,-300,-380,-480,-600,-760,-950];
  const xStep=quality==='low'?20:10,xA=-pad*T,xB=(cols+pad)*T;
  const backY=(x,z,top)=>{ // top=true: floor, false: ceiling
    const depth=Math.max(0,(Z_BACK-z)/(Z_BACK-zRows[zRows.length-1]));
    const exact=sample(top?ground:ceil,x),soft=smooth(top?ground:ceil,x,90);
    let y=exact+(soft-exact)*Math.min(1,depth*3.2);
    const f=.006;let h=ridge3(x*f,z*f,top?3.1:7.7,4)*1.4-0.5;
    if(theme.key==='mesa'){h=Math.floor(h*4.5)/4.5*.8+h*.25;}
    let ampH=(enclosed?110:230)*Math.pow(Math.max(0,depth),1.25)+(depth>0?8:0);if(industrial){ampH=depth>0?3:0;h=Math.round(h*2)/2;}
    if(theme.key==='rift')y+=(top?-1.7:2.4)*(Math.abs(h)+.3)*ampH+fbm3(x*.03,z*.03,1,2)*6*Math.min(1,depth*4);
    else y+=(top?1:-1)*(h*ampH+fbm3(x*.03,z*.03,1,2)*(industrial?0:6)*Math.min(1,depth*4));
    if(top&&exact<-rows*T)y=Math.min(y,exact+ampH*.4); // keep chasms open near the lane
    if(z>Z_BACK-4)y+=top?-4:4; // tuck under the lane surfaces (no z-fighting)
    return y;};
  function strip(top){
    const nx=Math.ceil((xB-xA)/xStep)+1,nz=zRows.length,pos=new Float32Array(nx*nz*3),col=new Float32Array(nx*nz*3),idx=[];
    for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const x=xA+i*xStep,z=zRows[j],y=backY(x,z,top),k=(j*nx+i)*3;
      pos[k]=x+fbm3(x*.02,z*.02,5,2)*4;pos[k+1]=y;pos[k+2]=z;const a=j<2?.82:.9+.1*noise3(x*.01,z*.01,2);col[k]=col[k+1]=col[k+2]=a;}
    for(let j=0;j<nz-1;j++)for(let i=0;i<nx-1;i++){const a=j*nx+i,b=a+1,c=a+nx,d=c+1;if(top)idx.push(a,b,c,b,d,c);else idx.push(a,c,b,b,c,d);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    return g;
  }
  // split long strips into chunks for culling
  function addStrip(g){const parts=splitByX(g,CHUNK*T*2);for(const p of parts){const m=new THREE.Mesh(p,mat);m.receiveShadow=true;m.castShadow=!enclosed;group.add(m);}}
  addStrip(strip(true));
  if(hasCeiling)addStrip(strip(false));
  if(enclosed){
    // back wall closing the cave between floor and ceiling
    const zW=zRows[zRows.length-1],nx=Math.ceil((xB-xA)/xStep)+1,ny=24,pos=new Float32Array(nx*ny*3),col=new Float32Array(nx*ny*3),idx=[];
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=xA+i*xStep,yb=backY(x,zW,true)-30,yt=backY(x,zW,false)+30,t=j/(ny-1),y=yb+(yt-yb)*t,k=(j*nx+i)*3;
      const bulge=fbm3(x*.012,y*.012,3,3)*70+ridge3(x*.03,y*.03,1,2)*25;pos[k]=x;pos[k+1]=y;pos[k+2]=zW-20-bulge*(industrial?.2:1);const a=.72+.28*Math.sin(t*Math.PI);col[k]=col[k+1]=col[k+2]=a;}
    for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=j*nx+i,b=a+1,c=a+nx,d=c+1;idx.push(a,b,c,b,d,c);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    addStrip(g);
  }

  // --- hazards: crystal (or hot metal) spikes
  const spikeTiles=[];for(let ty=0;ty<rows;ty++)for(let tx=0;tx<cols;tx++)if(tiles[ty*cols+tx]===TT.SPIKE)spikeTiles.push([tx,ty]);
  if(spikeTiles.length){
    const shard=shardGeometry();const per=5,n=spikeTiles.length*per;
    const sm=industrial?new THREE.MeshStandardMaterial({color:'#2a2426',metalness:.9,roughness:.35,emissive:new THREE.Color(theme.spike),emissiveIntensity:.0}):crystalMaterial(theme.spike,1.6);
    if(industrial){sm.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vHy;').replace('#include <begin_vertex>','#include <begin_vertex>\nvHy=position.y;');
      sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vHy;').replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance=emissive*smoothstep(.45,1.,vHy)*3.5;');};}
    const inst=new THREE.InstancedMesh(shard,sm,n);const dm=new THREE.Object3D();let k=0;
    for(const [tx,ty] of spikeTiles){for(let i=0;i<per;i++){const s=.75+r()*.5;dm.position.set(tx*T+3+r()*14,-(ty+1)*T+2,-34+i*13+r()*6);
      dm.rotation.set((r()-.5)*.35,r()*6.28,(r()-.5)*.35);dm.scale.set(4*s,(13+r()*7)*s,4*s);dm.updateMatrix();inst.setMatrixAt(k++,dm.matrix);}}
    inst.castShadow=true;group.add(inst);mats.push(sm);
  }

  // --- crates / destructible walls
  const crateList=[];for(let ty=0;ty<rows;ty++)for(let tx=0;tx<cols;tx++)if(tiles[ty*cols+tx]===TT.CRATE)crateList.push(ty*cols+tx);
  let crates=null;const crateIndex=new Map();
  if(crateList.length){
    const g=crateGeometry(level.type==='shmup');const cm=new THREE.MeshStandardMaterial({color:level.type==='shmup'?'#3a3f52':'#6a5a44',metalness:.7,roughness:.42,emissive:new THREE.Color(theme.accent),emissiveIntensity:0,vertexColors:true});
    cm.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance=emissive*step(1.5,vColor.r+vColor.g+vColor.b)*2.5;').replace('#include <color_fragment>','#include <color_fragment>\nif(vColor.r+vColor.g+vColor.b>1.5)diffuseColor.rgb=vec3(.1);');};
    crates=new THREE.InstancedMesh(g,cm,crateList.length);const dm=new THREE.Object3D();
    crateList.forEach((ti,i)=>{const tx=ti%cols,ty=(ti/cols)|0;dm.position.set(tx*T+T/2,-ty*T-T/2,0);dm.rotation.set(0,(r()-.5)*.06,0);dm.scale.set(1,1,1);dm.updateMatrix();crates.setMatrixAt(i,dm.matrix);crateIndex.set(ti,i);});
    crates.castShadow=crates.receiveShadow=true;group.add(crates);mats.push(cm);
  }

  // --- one-way platforms
  const platformMeshes=[];
  if(level.platforms&&level.platforms.length){
    for(const pl of level.platforms){const w=pl.w*T;const g=platformGeometry(w,industrial,r);const m=new THREE.Mesh(g,industrial?metalPlatformMaterial(theme):mat);
      m.position.set(pl.x*T,-pl.y*T,0);m.castShadow=m.receiveShadow=true;group.add(m);platformMeshes.push({mesh:m,pl,w});
      if(!industrial){const glow=new THREE.Mesh(new THREE.OctahedronGeometry(3.2,0),crystalMaterial(theme.crystal,3.2));glow.scale.set(1,2.2,1);glow.position.set(pl.x*T+w/2,-pl.y*T-16,0);group.add(glow);platformMeshes[platformMeshes.length-1].glow=glow;}
      if(pl.belt){const belt=beltMesh(w,pl.belt);belt.position.set(pl.x*T,-pl.y*T,0);group.add(belt);platformMeshes[platformMeshes.length-1].belt=belt;}
    }
  }

  // --- water
  let water=null;
  if(level.hasWater)water=buildWater(level,theme,tileAt,enclosed?-330:-700);
  if(water)group.add(water.group);

  // --- crystal clusters on surfaces (decor), vegetation
  const decor=buildSurfaceDecor(level,theme,ground,ceil,enclosed,r,quality);group.add(decor.group);

  // --- waterfalls
  const falls=[];
  for(const d of level.decors||[])if(d.type==='waterfall'){const f=waterfall(d,theme);group.add(f.mesh);falls.push(f);}

  function update(t,dt,s){
    for(const m of mats)if(m.userData.uniforms)m.userData.uniforms.uTime.value=t;
    if(water)water.update(t);for(const f of falls)f.mat.uniforms.uTime.value=t;decor.update(t);
    for(const p of platformMeshes){if(p.glow)p.glow.rotation.y=t*1.5;if(p.belt)p.belt.material.map.offset.x=-t*p.pl.belt*.9;}
  }
  function removeCrate(ti){const i=crateIndex.get(ti);if(i==null)return null;const m=new THREE.Matrix4();crates.getMatrixAt(i,m);const p=new THREE.Vector3().setFromMatrixPosition(m);
    m.makeScale(0,0,0);crates.setMatrixAt(i,m);crates.instanceMatrix.needsUpdate=true;crateIndex.delete(ti);return p;}
  function dispose(){group.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const m of mats)m.dispose();if(waterMask)waterMask.dispose();if(water)water.dispose();decor.dispose();}
  return {group,update,removeCrate,crateIndex,dispose,fg:decor.fg,falls,ground,ceil,enclosed,hasCeiling,sample:(px)=>sample(ground,px),floorAt:(x,z)=>backY(x,z,true),material:mat};
}

function splitByX(g,width){
  // re-chunk an indexed heightfield along x by triangle centroid
  const pos=g.attributes.position,col=g.attributes.color,idx=g.index.array,buckets=new Map();
  for(let i=0;i<idx.length;i+=3){const cx=(pos.getX(idx[i])+pos.getX(idx[i+1])+pos.getX(idx[i+2]))/3,b=Math.floor(cx/width);if(!buckets.has(b))buckets.set(b,[]);buckets.get(b).push(idx[i],idx[i+1],idx[i+2]);}
  const out=[];for(const list of buckets.values()){const map=new Map(),p=[],c=[],n=[],ix=[];const nor=g.attributes.normal;
    for(const v of list){let k=map.get(v);if(k==null){k=p.length/3;map.set(v,k);p.push(pos.getX(v),pos.getY(v),pos.getZ(v));c.push(col.getX(v),col.getY(v),col.getZ(v));n.push(nor.getX(v),nor.getY(v),nor.getZ(v));}ix.push(k);}
    const s=new THREE.BufferGeometry();s.setAttribute('position',new THREE.Float32BufferAttribute(p,3));s.setAttribute('color',new THREE.Float32BufferAttribute(c,3));s.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));s.setIndex(ix);s.computeBoundingSphere();out.push(s);}
  g.dispose();return out;
}

function tuftGeometry(key){ // several tapered blades fanning out from one root
  const parts=[];const n=key==='vaults'?3:5;
  for(let i=0;i<n;i++){const g=new THREE.PlaneGeometry(key==='vaults'?.5:.32,1,1,4);const p=g.attributes.position;
    for(let k=0;k<p.count;k++){const y=p.getY(k)+.5;p.setXYZ(k,p.getX(k)*(1-y*.9),y,0);}
    g.rotateZ((i/(n-1)-.5)*(key==='vaults'?.4:.9));g.rotateY(i*2.39);parts.push(g);}
  const m=mergeGeometries(parts);parts.forEach(p=>p.dispose());return m;
}
export function shardGeometry(){ // unit hex bipyramid, base at y=0, tip at y=1
  const g=new THREE.CylinderGeometry(.55,1,.72,6,1,false);g.translate(0,.36,0);
  const tip=new THREE.ConeGeometry(.55,.28,6,1);tip.translate(0,.86,0);
  const m=mergeGeometries([g.toNonIndexed(),tip.toNonIndexed()]);m.computeVertexNormals();return m;
}
function crateGeometry(wall){
  const parts=[];const body=new THREE.BoxGeometry(wall?20:18.5,wall?20:18.5,wall?60:22,1,1,1);parts.push(body);
  const trimC=[.05,.05,.05];
  if(wall){for(const y of [-6,6]){const s=new THREE.BoxGeometry(20.4,1.2,60.4);s.translate(0,y,0);parts.push(s);}}
  else{for(const [w,h,d,x,y] of [[19.5,2,23,0,8.5],[19.5,2,23,0,-8.5],[2,19.5,23,8.5,0],[2,19.5,23,-8.5,0]]){const s=new THREE.BoxGeometry(w,h,d);s.translate(x,y,0);parts.push(s);}
    const seam=new THREE.BoxGeometry(14,1.1,23.4);parts.push(seam);}
  const geos=parts.map((p,i)=>{const n=p.toNonIndexed();const c=new Float32Array(n.attributes.position.count*3);
    const glow=(wall&&i>0)||(!wall&&i===parts.length-1);const base=i===0?[.9,.86,.8]:[.5,.5,.52];c.fill(0);for(let k=0;k<c.length;k+=3){const v=glow?[1,1,1]:base;c[k]=v[0];c[k+1]=v[1];c[k+2]=v[2];}
    n.setAttribute('color',new THREE.BufferAttribute(c,3));return n;});
  return mergeGeometries(geos);
}
function platformGeometry(w,industrial,r){
  if(industrial){const g=new THREE.BoxGeometry(w,7,44,Math.max(1,Math.round(w/10)),1,2);g.translate(w/2,-3.5,-6);return g;}
  // floating rock slab: flat top, craggy tapered underside
  const g=new THREE.BoxGeometry(w,14,46,Math.max(2,Math.round(w/6)),4,6);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const under=(7-y)/14;const taper=1-under*.35;
    x*=taper;z*=taper;y-=under*under*fbm3(x*.08,z*.08,1,2)*10+under*4;if(y<6.5){x+=fbm3(x*.1,y*.1,z*.1,2)*2.5;z+=fbm3(x*.1+5,y*.1,z*.1,2)*2.5;}
    p.setXYZ(i,x+w/2,y-7,z-6);}
  g.computeVertexNormals();const c=new Float32Array(p.count*3);for(let i=0;i<p.count;i++){const a=.65+.35*Math.min(1,Math.max(0,(p.getY(i)+14)/14));c[i*3]=c[i*3+1]=c[i*3+2]=a;}
  g.setAttribute('color',new THREE.BufferAttribute(c,3));return g;
}
function metalPlatformMaterial(theme){return new THREE.MeshStandardMaterial({color:'#4a4648',metalness:.85,roughness:.38,emissive:new THREE.Color(theme.accent),emissiveIntensity:.05});}
function beltMesh(w,dir){
  const c=document.createElement('canvas');c.width=64;c.height=16;const g=c.getContext('2d');g.fillStyle='#1b1a1c';g.fillRect(0,0,64,16);
  g.fillStyle='#ff8a3c';for(let i=0;i<4;i++){const x=i*16+(dir>0?2:12);g.beginPath();g.moveTo(x,3);g.lineTo(x+(dir>0?6:-6),8);g.lineTo(x,13);g.lineTo(x+(dir>0?3:-3),8);g.fill();}
  const tex=new THREE.CanvasTexture(c);tex.wrapS=THREE.RepeatWrapping;tex.repeat.set(w/16,1);tex.colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,30),new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:new THREE.Color('#ff7a2a'),emissiveIntensity:1.2,metalness:.3,roughness:.6}));
  m.rotation.x=-Math.PI/2;m.position.set(w/2,.3,-4);const grp=new THREE.Group();grp.add(m);grp.material=m.material;return grp;
}

function buildWater(level,theme,tileAt,zFar){
  const T=TILE,cols=level.cols,rows=level.rows,group=new THREE.Group();
  const deep=new THREE.Color(theme.key==='vaults'?'#021a20':'#0d2a40'),shallow=new THREE.Color(theme.key==='vaults'?'#1a8a84':'#3a8ab0');
  const uniforms={uTime:{value:0},uDeep:{value:deep},uShallow:{value:shallow},uSky:{value:new THREE.Color(theme.sky.glow)}};
  const surf=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,
    vertexShader:`varying vec3 vW;uniform float uTime;void main(){vec3 p=position;vec4 w=modelMatrix*vec4(p,1.);w.y+=sin(w.x*.05+uTime*1.6)*.8+sin(w.z*.09-uTime*1.1)*.6;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`varying vec3 vW;uniform float uTime;uniform vec3 uDeep,uShallow,uSky;
      float h(vec2 p){return sin(p.x*.08+uTime*1.3)*sin(p.y*.11-uTime*.9)+sin((p.x+p.y)*.05+uTime*.7)*.6;}
      void main(){vec2 p=vW.xz;float e=.6;vec3 n=normalize(vec3(h(p+vec2(e,0))-h(p-vec2(e,0)),2.2,h(p+vec2(0,e))-h(p-vec2(0,e))));
      vec3 v=normalize(cameraPosition-vW);float fr=pow(1.-max(dot(n,v),0.),3.);vec3 l=normalize(vec3(-.4,.8,.5));float sp=pow(max(dot(reflect(-l,n),v),0.),60.)*.7;
      vec3 c=mix(uDeep*1.4+uShallow*.25,uSky*.55,fr*.7)+sp;float a=.5+fr*.35;gl_FragColor=vec4(c,a);}`});
  const front=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`varying vec3 vW;uniform float uTime;uniform vec3 uDeep,uShallow;uniform float uTop;
      void main(){float rays=pow(max(0.,sin(vW.x*.03+sin(vW.y*.02+uTime*.4)*2.+uTime*.3)),6.)*.25;
      vec3 c=uDeep*1.1+uShallow*(.08+rays*.6);gl_FragColor=vec4(c,.58);}`});
  // horizontal runs of surface tiles and vertical faces per water tile
  const surfGeos=[],frontGeos=[];
  for(let ty=0;ty<rows;ty++){let tx=0;while(tx<cols){if(tileAt(tx,ty)===5){let e=tx;while(e<cols&&tileAt(e,ty)===5)e++;
      const x0=tx*T,x1=e*T,y0=-ty*T,y1=y0-T;
      const f=new THREE.PlaneGeometry(x1-x0,T);f.translate((x0+x1)/2,(y0+y1)/2,Z_FRONT+1.5);frontGeos.push(f);
      // surface where the tile above is not water
      let sx=tx;while(sx<e){if(tileAt(sx,ty-1)!==5){let se=sx;while(se<e&&tileAt(se,ty-1)!==5)se++;
          const yS=-ty*T-3,g=new THREE.PlaneGeometry((se-sx)*T,Z_FRONT+1.5-zFar,Math.max(1,(se-sx)*2),12);g.rotateX(-Math.PI/2);g.translate((sx+se)*T/2,yS,(Z_FRONT+1.5+zFar)/2);surfGeos.push(g);sx=se;}else sx++;}
      tx=e;}else tx++;}}
  if(!surfGeos.length&&!frontGeos.length)return null;
  if(frontGeos.length){const m=new THREE.Mesh(mergeGeometries(frontGeos),front);m.renderOrder=3;group.add(m);}
  if(surfGeos.length){const m=new THREE.Mesh(mergeGeometries(surfGeos),surf);m.renderOrder=2;group.add(m);}
  return {group,update(t){uniforms.uTime.value=t;},dispose(){surf.dispose();front.dispose();}};
}

function waterfall(d,theme){
  const T=TILE,x=d.tx*T+T/2,top=-d.topTy*T+6,bot=-(d.botTy+1)*T-90,h=top-bot;
  const uniforms={uTime:{value:0},uColor:{value:new THREE.Color(theme.key==='mesa'?'#bfe8ff':'#9ff')}};
  const mat=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor;
      float n(vec2 p){return fract(sin(dot(floor(p),vec2(12.9,78.2)))*43758.5);}
      void main(){vec2 p=vec2(vUv.x*14.,vUv.y*6.+uTime*5.5);float a=n(p)*.6+n(p*vec2(1.,2.3)+3.)*.4;float edge=smoothstep(0.,.25,vUv.x)*smoothstep(1.,.75,vUv.x);
      float s=smoothstep(.3,1.,a)*edge;float foam=smoothstep(.12,0.,vUv.y);gl_FragColor=vec4(uColor*(.35+s*1.2+foam*1.5),1.)*(.5*edge+s*.6+foam*.5);}`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(28,h,1,1),mat);mesh.position.set(x,bot+h/2,-40);
  return {mesh,mat,x,top,bot};
}

function buildSurfaceDecor(level,theme,ground,ceil,enclosed,r,quality){
  const T=TILE,cols=level.cols,group=new THREE.Group();const disposables=[];
  const shard=shardGeometry();disposables.push(shard);
  const cm=crystalMaterial(theme.crystal,1.6);disposables.push(cm);
  const count=Math.round(cols*(quality==='low'?.35:.7));const inst=new THREE.InstancedMesh(shard,cm,count*4);const dm=new THREE.Object3D();let k=0;
  const industrial=theme.kind==='industrial';
  for(let i=0;i<count&&!industrial;i++){
    const x=r()*cols*T,col=Math.floor(x/T),gy=ground[Math.max(0,Math.min(cols-1,col))];if(gy<-level.rows*T)continue;
    const z=-95-r()*260,y=gy+0;const n=2+Math.floor(r()*3),s0=.5+r()*1.2*(1+(-z-80)/220);
    for(let j=0;j<n&&k<count*4;j++){const s=s0*(.5+r()*.7);dm.position.set(x+(r()-.5)*10*s0,y-3,z+(r()-.5)*10*s0);dm.rotation.set((r()-.5)*.9,r()*6.28,(r()-.5)*.9);dm.scale.set(3*s,(10+r()*14)*s,3*s);dm.updateMatrix();inst.setMatrixAt(k++,dm.matrix);}
    if(enclosed&&r()<.45){const cy=ceil[Math.max(0,Math.min(cols-1,col))];if(cy<100){dm.position.set(x+7,cy+2,z+20);dm.rotation.set(Math.PI+(r()-.5)*.6,r()*6.28,0);const s=.8+r()*1.4;dm.scale.set(3*s,(12+r()*16)*s,3*s);dm.updateMatrix();if(k<count*4)inst.setMatrixAt(k++,dm.matrix);}}
  }
  inst.count=k;inst.castShadow=false;if(k)group.add(inst);
  // vegetation / stalactites / pipes
  let sway=null;
  if(theme.key==='mesa'||theme.key==='vaults'||theme.key==='spire'){
    const blade=tuftGeometry(theme.key);disposables.push(blade);
    const vc=theme.key==='mesa'?'#b39a62':theme.key==='vaults'?'#1f8a6a':'#6a2a5a';
    const vm=new THREE.MeshStandardMaterial({color:vc,roughness:.8,side:THREE.DoubleSide,emissive:new THREE.Color(theme.key==='mesa'?'#000':theme.crystal),emissiveIntensity:theme.key==='mesa'?0:.35});
    const u={uTime:{value:0}};vm.onBeforeCompile=sh=>{sh.uniforms.uTime=u.uTime;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <begin_vertex>',`#include <begin_vertex>
      vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float w=sin(uTime*2.+ip.x*.05)*.35+sin(uTime*3.7+ip.x*.11)*.12;transformed.x+=w*position.y*position.y;`);};
    disposables.push(vm);
    const n=Math.round(cols*(quality==='low'?2:6));const grass=new THREE.InstancedMesh(blade,vm,n);let g=0;
    for(let i=0;i<n;i++){const x=r()*cols*T,col=Math.floor(x/T),gy=ground[Math.max(0,Math.min(cols-1,col))];if(gy<-level.rows*T)continue;
      const z=r()<.5?-40-r()*30:-75-r()*90;dm.position.set(x,gy+.5,z);dm.rotation.set(0,r()*6.28,(r()-.5)*.4);const s=.7+r()*1.1;dm.scale.set(s*3,(theme.key==='vaults'?14:6)*s+r()*4,s*3);dm.updateMatrix();grass.setMatrixAt(g++,dm.matrix);}
    grass.count=g;group.add(grass);sway=u;
  }
  if(industrial){
    // pipes and trims along the front faces, glowing edge strips
    const pipe=new THREE.CylinderGeometry(2.2,2.2,1,10);pipe.rotateZ(Math.PI/2);disposables.push(pipe);
    const pm=new THREE.MeshStandardMaterial({color:'#7a6e66',metalness:.9,roughness:.3});disposables.push(pm);
    const strip=new THREE.BoxGeometry(1,1.1,1.4);disposables.push(strip);const sm=new THREE.MeshStandardMaterial({color:'#000',emissive:new THREE.Color(theme.accent),emissiveIntensity:1.5});disposables.push(sm);
    const pipes=new THREE.InstancedMesh(pipe,pm,cols),strips=new THREE.InstancedMesh(strip,sm,cols*2);let a=0,b=0;
    for(let x=0;x<cols;){let e=x;const gy=ground[x];while(e<cols&&ground[e]===gy)e++;if(gy>-level.rows*T){const w=(e-x)*T;
        dm.position.set(x*T+w/2,gy-14,Z_FRONT+2.5);dm.rotation.set(0,0,0);dm.scale.set(w,1,1);dm.updateMatrix();pipes.setMatrixAt(a++,dm.matrix);
        dm.position.set(x*T+w/2,gy-1.5,Z_FRONT+.6);dm.scale.set(w-4,1,1);dm.updateMatrix();strips.setMatrixAt(b++,dm.matrix);}x=e;}
    pipes.count=a;strips.count=b;pipes.castShadow=true;group.add(pipes,strips);
  }
  // pebbles and rubble along the walkway band and behind it
  {const peb=new THREE.IcosahedronGeometry(1,1);const pp=peb.attributes.position;for(let i=0;i<pp.count;i++){const s=1+fbm3(pp.getX(i)*2,pp.getY(i)*2,pp.getZ(i)*2,2)*.35;pp.setXYZ(i,pp.getX(i)*s,pp.getY(i)*s*.6,pp.getZ(i)*s);}peb.computeVertexNormals();
    const pc=new Float32Array(pp.count*3).fill(.85);peb.setAttribute('color',new THREE.BufferAttribute(pc,3));disposables.push(peb);
    const pm=industrial?new THREE.MeshStandardMaterial({color:'#3a3638',metalness:.8,roughness:.45}):terrainMaterial(theme,{bump:1});disposables.push(pm);
    const n=Math.round(cols*(quality==='low'?1.2:3.5));const pebbles=new THREE.InstancedMesh(peb,pm,n);let k2=0;
    for(let i=0;i<n;i++){const x=r()*cols*T,col=Math.floor(x/T),gy=ground[Math.max(0,Math.min(cols-1,col))];if(gy<-level.rows*T)continue;
      const z=r()<.35?Z_FRONT-6-r()*14:-30-r()*120;const s=(z>0?.8:1)*(.8+r()*r()*3.2)*(industrial?.8:1);dm.position.set(x,gy+s*.2,z);dm.rotation.set(r()*.4,r()*6.28,r()*.4);dm.scale.set(s*1.3,s,s);dm.updateMatrix();pebbles.setMatrixAt(k2++,dm.matrix);}
    pebbles.count=k2;pebbles.castShadow=true;pebbles.receiveShadow=true;group.add(pebbles);}
  // foreground silhouettes: crystal clusters / pipes rising from below in front of the cliff face
  const fg=[];
  {const sg=shardGeometry();disposables.push(sg);const fm=industrial?new THREE.MeshStandardMaterial({color:'#1c1a1c',metalness:.8,roughness:.5}):crystalMaterial(theme.crystal,1.1);disposables.push(fm);
    const pipeG=new THREE.CylinderGeometry(1,1,1,12);disposables.push(pipeG);
    for(let x=180;x<cols*T;x+=260+r()*420){const col=Math.floor(x/T),gy=ground[Math.max(0,Math.min(cols-1,col))];if(gy<-level.rows*T)continue;
      const g=new THREE.Group();const z=70+r()*90;
      if(industrial){for(let i=0;i<2;i++){const m=new THREE.Mesh(pipeG,fm);m.scale.set(7+r()*5,200,7+r()*5);m.position.set(i*22,gy-130-r()*30,0);g.add(m);}}
      else for(let i=0;i<3;i++){const m=new THREE.Mesh(sg,fm);const s=.6+r()*.8;m.scale.set(7*s,(34+r()*36)*s,7*s);m.position.set((r()-.5)*34,gy-125+r()*30,(r()-.5)*20);m.rotation.set((r()-.5)*.7,r()*6,(r()-.5)*.7);g.add(m);}
      g.position.set(x,0,z);group.add(g);fg.push(g);}}
  return {group,fg,update(t){if(sway)sway.uTime.value=t;},dispose(){disposables.forEach(d=>d.dispose());}};
}

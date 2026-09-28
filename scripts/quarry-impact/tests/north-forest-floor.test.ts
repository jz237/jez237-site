import test from 'node:test';
import assert from 'node:assert/strict';
import { gunzipSync, gzipSync } from 'node:zlib';
import * as T from 'three';
import { readForestFile, forestHash } from '../tools/north-forest-edge-audit';
import { northForestData } from './north-forest-invariants';
import { trackPoint } from '../src/rules';
import { quarryGround, quarryRock } from '../src/scenery-surfaces';
import { northForestGround } from '../src/scenery-north-floor';
import { northForestRock } from '../src/scenery-north-crest';
import { northMineralGLSL } from '../src/scenery-north-mineral';
import { quarryRim, terrainGeometry } from '../src/quarry-layout';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { NORTH_FLOOR_SIZE, NORTH_FLOOR_BOUNDS, NORTH_FLOOR_PATH, loadNorthForestFloor } from '../src/scenery-north-floor-mask';
import { northBackdropData } from './north-backdrop-invariants';

function sampler(bytes:Uint8Array){
  const [width,height]=NORTH_FLOOR_SIZE,[x0,z0,x1,z1]=NORTH_FLOOR_BOUNDS;
  return (x:number,z:number,c=0)=>{
    const fx=(x-x0)/(x1-x0)*width-.5,fy=(z-z0)/(z1-z0)*height-.5,ix=Math.floor(fx),iy=Math.floor(fy),u=fx-ix,v=fy-iy;
    const pixel=(x:number,y:number)=>bytes[(Math.max(0,Math.min(height-1,y))*width+Math.max(0,Math.min(width-1,x)))*4+c]/255;
    return (pixel(ix,iy)*(1-u)+pixel(ix+1,iy)*u)*(1-v)+(pixel(ix,iy+1)*(1-u)+pixel(ix+1,iy+1)*u)*v;
  };
}

test('bundled woodland weights match their source, cover exact roots and remain neutral on roads, arena and mask borders',()=>{
  const compressed=readForestFile('public/'+NORTH_FLOOR_PATH),bytes=gunzipSync(compressed),manifest=JSON.parse(readForestFile('source/north-forest-floor-manifest.json').toString()),data=northForestData();
  assert.equal(forestHash(compressed),manifest.sha256);assert.equal(forestHash(bytes),manifest.decodedSha256);
  assert.equal(forestHash(readForestFile(manifest.source)),manifest.sourceSha256);assert.equal(forestHash(readForestFile(manifest.placements)),manifest.placementsSha256);
  assert.equal(manifest.backdropPlacements,'src/quarry-north-backdrop.json');assert.equal(forestHash(readForestFile(manifest.backdropPlacements)),manifest.backdropPlacementsSha256);
  assert.equal(forestHash(readForestFile(manifest.crest)),manifest.crestSha256);
  assert.equal(manifest.runtimeFiles.length,4,'the mask and registered photographic material set are all tracked');
  for(const file of manifest.runtimeFiles){const asset=readForestFile('public/'+file.file);assert.equal(asset.length,file.bytes);assert.equal(forestHash(asset),file.sha256);}
  assert.equal(bytes.length,NORTH_FLOOR_SIZE[0]*NORTH_FLOOR_SIZE[1]*4);assert.equal(bytes.length,manifest.decodedBytes);assert.ok(bytes.length<=4*1024*1024);
  assert.deepEqual(manifest.bounds,NORTH_FLOOR_BOUNDS);assert.deepEqual(manifest.channels,['coverage','organicLitter','crestMineral','litterVariation']);
  const sample=sampler(bytes),[width,height]=NORTH_FLOOR_SIZE;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(x===0||y===0||x===width-1||y===height-1)
    assert.deepEqual([...bytes.subarray((y*width+x)*4,(y*width+x)*4+4)],[0,0,0,0],'neutral edge texels must not smear forest outside its world footprint');
  for(const tree of [...data.trees,...data.mediumTrees,...northBackdropData().trees]){
    const organic=sample(tree.x,tree.z,1),mineral=sample(tree.x,tree.z,2);
    assert.ok(sample(tree.x,tree.z)>.9,`coverage is registered to ${tree.id}`);
    assert.ok(organic+mineral>.75,`the authored organic or crest-mineral material reaches ${tree.id} rather than mirroring acrossZ`);
    if(mineral<.1)assert.ok(organic>.6,'roots beyond the approved mineral strip retain organic ground');
  }
  for(let i=0;i<720;i++){
    const p=trackPoint(i/720),q=trackPoint((i+.1)/720),length=Math.hypot(q.x-p.x,q.z-p.z);
    for(const side of [-8,0,8])assert.equal(sample(p.x+(q.z-p.z)/length*side,p.z-(q.x-p.x)/length*side),0,'the road corridor remains unchanged');
  }
  for(let x=-45;x<=45;x+=3)for(let z=-45;z<=45;z+=3)assert.equal(sample(x,z),0,'arena material is outside the woodland footprint');
  for(const [x,z] of [[-320,-320],[320,320],[-180,230],[250,230],[0,325]])assert.equal(sample(x,z),0);
  const centers=data.stands.map((p:any)=>sample(p.x,p.z,1));assert.ok(centers.filter((v:number)=>v>.6).length>=4);
  for(const opening of data.openings){
    const organic=sample(opening.x,opening.z,1);assert.ok(organic<.45,'deliberate openings retain mineral soil instead of a continuous litter carpet');
  }
});

test('ridge litter extends texel-aligned coverage only within the52 declared root and six stand footprints, preserving every old mineral pixel',()=>{
  const frozen=readForestFile('tests/fixtures/north-floor-before-backdrop.rgba.gz');
  assert.equal(forestHash(frozen),'eebc2d609fa6d27b0e231a5d241d3c912bd366a0ce169d643878227e96e8d604');
  const old=gunzipSync(frozen),current=gunzipSync(readForestFile('public/'+NORTH_FLOOR_PATH)),manifest=JSON.parse(readForestFile('source/north-forest-floor-manifest.json').toString()),data=northBackdropData();
  assert.equal(old.length,512*336*4);assert.deepEqual(NORTH_FLOOR_SIZE,[512,384]);assert.deepEqual(NORTH_FLOOR_BOUNDS,[-96,80,224,320]);
  assert.equal((320-80)/384,.625,'old and new rows retain identical texel centres');
  const extension=manifest.extension;assert.equal(extension.addedRoots,52);assert.equal(extension.stands.length,6);assert.equal(extension.allowedFootprints.length,58);
  assert.equal(extension.stands.reduce((n:number,s:any)=>n+s.rootCount,0),52);
  for(const tree of data.trees){
    const p=extension.allowedFootprints.find((p:any)=>p.id==='backdrop-root-'+tree.id);assert.ok(p);
    assert.deepEqual([p.x,p.z,p.yaw],[tree.x,tree.z,0]);assert.equal(p.majorRadius,p.minorRadius);
    assert.ok(p.majorRadius>0&&p.majorRadius<11,'a declared footprint cannot silently permit unrelated whole-scene changes');
  }
  for(const stand of extension.stands){
    const p=extension.allowedFootprints.find((p:any)=>p.id===stand.id);assert.ok(p);
    assert.deepEqual([p.x,p.z,p.yaw],[stand.x,stand.z,stand.yaw]);
    assert.ok(p.majorRadius<40&&p.minorRadius<40);assert.ok(stand.rootCount>0);
  }
  let protectedPixels=0,changedPixels=0;
  for(let y=0;y<336;y++)for(let x=0;x<512;x++){
    const wx=-96+(x+.5)*.625,wz=80+(y+.5)*.625,i=(y*512+x)*4;
    const authorized=extension.allowedFootprints.some((p:any)=>{const c=Math.cos(p.yaw),s=Math.sin(p.yaw),dx=wx-p.x,dz=wz-p.z;return Math.hypot((dx*c+dz*s)/p.majorRadius,(-dx*s+dz*c)/p.minorRadius)<=1;});
    assert.equal(current[i+2],old[i+2],'the original crest-mineral channel stays exactly unchanged everywhere');
    if(!authorized){assert.ok(current.subarray(i,i+4).equals(old.subarray(i,i+4)),`unapproved mask change at ${wx},${wz}`);protectedPixels++;}
    else if(!current.subarray(i,i+4).equals(old.subarray(i,i+4)))changedPixels++;
  }
  assert.ok(protectedPixels>140000);assert.ok(changedPixels>20000,'the extension actually connects litter beneath the new roots');
});

test('actual woodland loader retries missing/malformed assets and shares one correctly oriented linear texture',async()=>{
  const original=globalThis.fetch,compressed=readForestFile('public/'+NORTH_FLOOR_PATH),decoded=gunzipSync(compressed);let calls=0;let texture:T.DataTexture|undefined;
  globalThis.fetch=async input=>{assert.ok(String(input).endsWith(NORTH_FLOOR_PATH));calls++;return calls===1?new Response('missing',{status:404}):new Response(new Uint8Array(calls===2?gzipSync(new Uint8Array(4)):compressed),{status:200});};
  try{
    await assert.rejects(loadNorthForestFloor(),/404/);await assert.rejects(loadNorthForestFloor(),/invalid byte count/);
    const one=loadNorthForestFloor(),two=loadNorthForestFloor();assert.equal(one,two);texture=await one;assert.equal(await loadNorthForestFloor(),texture);assert.equal(calls,3);
    assert.deepEqual([texture.image.width,texture.image.height],NORTH_FLOOR_SIZE);assert.deepEqual(new Uint8Array(texture.image.data.buffer),new Uint8Array(decoded));
    assert.equal(texture.flipY,false);assert.equal(texture.colorSpace,T.NoColorSpace);assert.equal(texture.wrapS,T.ClampToEdgeWrapping);assert.equal(texture.wrapT,T.ClampToEdgeWrapping);
    assert.equal(texture.magFilter,T.LinearFilter);assert.equal(texture.minFilter,T.LinearMipmapLinearFilter);assert.equal(texture.generateMipmaps,true);
  }finally{globalThis.fetch=original;texture?.dispose();}
});

test('mineral transition follows the exact frozen crest polyline and remains local to both sides of its seam',()=>{
  const crest=JSON.parse(readForestFile('source/north-forest-crest.json').toString()),sample=sampler(gunzipSync(readForestFile('public/'+NORTH_FLOOR_PATH)));
  assert.equal(crest.points.length,56);
  crest.points.forEach((p:number[],i:number)=>{
    const a=(350+i)*Math.PI/180,rim=quarryRim(a);assert.deepEqual(p,[Math.sin(a)*rim.r*1.08,rim.y,Math.cos(a)*rim.r]);
  });
  for(let i=1;i<crest.points.length;i++){
    const a=crest.points[i-1],b=crest.points[i],x=(a[0]+b[0])/2,z=(a[2]+b[2])/2,dx=b[0]-a[0],dz=b[2]-a[2],length=Math.hypot(dx,dz);
    assert.ok(sample(x,z,2)>.9&&sample(x,z,0)>.9,'the original wall/terrain seam gets continuous mineral coverage');
    assert.ok(sample(x,z,1)<.1,'organic litter must retreat from the mineral seam');
    const nx=dz/length,nz=-dx/length,outward=nx*x/(1.08*1.08)+nz*z>=0?1:-1;
    assert.ok(sample(x+nx*outward*10,z+nz*outward*10,2)>.9,'outward material reaches the terrain visible beyond the occluding rim');
    for(const distance of [-12,22])assert.equal(sample(x+nx*outward*distance,z+nz*outward*distance,2),0,'the narrow inner strip and outer deposit remain bounded');
  }
  const proof=JSON.parse(readForestFile('tests/fixtures/north-crest-visible-ground.json').toString()),terrain=createSurfaceSampler(terrainGeometry());
  assert.equal(forestHash(readForestFile('public/models/quarry-headwall.glb')),proof.headwallSHA256);
  assert.equal(proof.samples.length,8);
  for(const ray of proof.samples){
    assert.ok(Math.abs(terrain.height(ray.terrain[0],ray.terrain[2])!-ray.terrain[1])<2e-5,'the fixed first-visible points remain on the unchanged actual terrain');
    assert.ok(ray.terrainDistanceFromCrest>5&&ray.terrainDistanceFromCrest<11);
    for(const p of [ray.terrain,ray.wall])assert.ok(sample(p[0],p[2],2)>.95,'both actually visible sides of the inherited height step receive the matching mineral treatment');
  }
});

test('woodland shader preserves the base hook and computes registered photo gradients/tangent frames outside coverage branches',()=>{
  const original=T.TextureLoader.prototype.load;T.TextureLoader.prototype.load=function(file:string){const texture=new T.Texture();texture.name=file;return texture;};
  const compile=(material:T.Material)=>{const shader={vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader,uniforms:{}};material.onBeforeCompile(shader as any,{} as T.WebGLRenderer);return shader as typeof shader&{uniforms:Record<string,T.IUniform>};};
  try{
    const untouched=quarryGround(),prior=compile(untouched),woodland=northForestGround(),actual=compile(woodland),after=compile(quarryGround());
    assert.equal(actual.vertexShader,prior.vertexShader,'base world-space varying and transforms remain exact');assert.equal(after.fragmentShader,prior.fragmentShader,'wrapping terrain must not mutate the shared quarryGround factory');
    for(const [key,value] of Object.entries(prior.uniforms))assert.deepEqual(actual.uniforms[key],value,'all original shader uniforms remain');
    assert.equal(woodland.map,untouched.map);assert.equal(woodland.normalMap,untouched.normalMap);assert.equal(woodland.roughnessMap,untouched.roughnessMap);
    assert.deepEqual(actual.uniforms.northFloorBounds.value.toArray(),[NORTH_FLOOR_BOUNDS[0],NORTH_FLOOR_BOUNDS[1],NORTH_FLOOR_BOUNDS[2]-NORTH_FLOOR_BOUNDS[0],NORTH_FLOOR_BOUNDS[3]-NORTH_FLOOR_BOUNDS[1]]);
    const source=actual.fragmentShader,firstBranch=source.indexOf('if(northCoverage>.001)');assert.ok(firstBranch>0);
    for(const layer of ['Litter','Stone','Soil']){
      assert.ok(source.indexOf(`north${layer}Dx=dFdx(north${layer}UV)`)>=0&&source.indexOf(`north${layer}Dx=dFdx(north${layer}UV)`)<firstBranch,'gradients must be uniform across quads before conditional coverage');
      assert.ok(source.includes(`getTangentFrame(-vViewPosition,nonPerturbedNormal,north${layer}UV)`),'each normal layer uses its own worldUV frame and geometric normal');
    }
    for(const [layer,color]of [['Litter','northLitterColor'],['Stone','quarryGravel']]){
      for(const map of [color,`north${layer}Normal`,`north${layer}Rough`])assert.ok(source.includes(`northPhoto(${map},north${layer}UV,north${layer}Dx,north${layer}Dy,northWeights,northA,northB,northC)`),'reused color plus independent roughness/normals must share stochastic offsets and UV derivatives');
      if(layer==='Stone')assert.equal(actual.uniforms[color].value,prior.uniforms[color].value,'mineral color reuses the existing base texture');
    }
    assert.equal(actual.uniforms.northLitter,undefined);assert.equal(actual.uniforms.northStone,undefined);
    for(const [suffix,file]of [['Color','diff'],['Normal','nor_gl'],['Rough','rough']])assert.match(actual.uniforms['northLitter'+suffix].value.name,new RegExp('north_litter_'+file),'organic photos form one registered diffuse/normal/roughness source set');
    assert.equal(actual.uniforms.quarryForest.value,prior.uniforms.quarryForest.value,'the old base photograph remains exact outside the new floor');
    for(const suffix of ['Normal','Rough'])assert.match(actual.uniforms[`northStone${suffix}`].value.name,/gravel_/,'mineral normals/roughness match the reused photographic gravel color');
    assert.ok(source.includes('textureGrad(photo,uv+a,dx,dy)'));assert.ok(source.includes('normal=normalize(mix(normal,'));
    assert.match(woodland.customProgramCacheKey(),/^north-woodland-floor-v/);assert.notEqual(woodland.customProgramCacheKey(),untouched.customProgramCacheKey());
    woodland.dispose();untouched.dispose();
  }finally{T.TextureLoader.prototype.load=original;}
});

test('crest wrapper preserves the original rock shader and registers identical seam photos, response and normal frame on both surfaces',()=>{
  const original=T.TextureLoader.prototype.load;T.TextureLoader.prototype.load=function(file:string){const texture=new T.Texture();texture.name=file;return texture;};
  const compile=(m:T.Material)=>{const s={vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader,uniforms:{} as Record<string,T.IUniform>};m.onBeforeCompile(s as any,{} as T.WebGLRenderer);return s;};
  try{
    const base=quarryRock(),rock=northForestRock(),floor=northForestGround(),before=compile(base),a=compile(rock),b=compile(floor);
    assert.equal(a.vertexShader,before.vertexShader);for(const [key,value]of Object.entries(before.uniforms))assert.deepEqual(a.uniforms[key],value);
    assert.equal(compile(quarryRock()).fragmentShader,before.fragmentShader,'rock wrapper cannot mutate unrelated factory consumers');
    for(const key of ['northFloorMask','northFloorReady'])assert.equal(a.uniforms[key],b.uniforms[key],'both sides share the same asynchronously loaded weight/ready value');
    assert.equal(a.uniforms.quarryRockDust.value,b.uniforms.quarryGravel.value,'both sides sample the same gravel photograph');
    assert.equal(a.uniforms.northCrestNormal.value,b.uniforms.northStoneNormal.value);assert.equal(a.uniforms.northCrestRough.value,b.uniforms.northStoneRough.value);
    for(const source of [a.fragmentShader,b.fragmentShader]){assert.ok(source.includes(northMineralGLSL));assert.ok(source.includes('northMineralColor('));assert.ok(source.includes('smoothstep(.55,.88,'));}
    const spec=JSON.parse(readForestFile('source/north-forest-floor.json').toString()),scale=spec.textureScaleMetres.mineral.toFixed(1);
    assert.ok(a.fragmentShader.includes(`northCrestUV=vQuarryPosition.xz/${scale}`));assert.ok(b.fragmentShader.includes(`northStoneUV=northWorld/${scale}`));
    const s=a.fragmentShader,branch=s.indexOf('if(northCrestBlend>.001)');assert.ok(s.indexOf('northCrestDx=dFdx(northCrestUV)')<branch);
    assert.ok(s.includes('getTangentFrame(-vViewPosition,nonPerturbedNormal,northCrestUV)'));
    for(const map of ['quarryRockDust','northCrestNormal','northCrestRough'])assert.ok(s.includes(`textureGrad(${map},northCrestUV,northCrestDx,northCrestDy)`),'all rock seam channels use the same physical texture registration');
    assert.match(rock.customProgramCacheKey(),/^north-woodland-crest-geology-v/);for(const m of [base,rock,floor])m.dispose();
  }finally{T.TextureLoader.prototype.load=original;}
});

import test from 'node:test';import assert from 'node:assert/strict';
import * as T from 'three';import R from '@dimforge/rapier3d-compat';import{readFileSync}from'node:fs';import{gunzipSync}from'node:zlib';import{transform}from'esbuild';
import{GLTFLoader}from'three/addons/loaders/GLTFLoader.js';import{loadCarWithoutImages}from'../tools/car-asset-audit';import{loadCars}from'../src/assets';import{Vehicle}from'../src/vehicle';import{stockSetup}from'../src/garage';import{CAR_KINDS}from'../src/rules';import{computeWreckNormals,computeWreckBounds}from'../src/wreck-normals';import{dentGeometry,repairWreckGeometry}from'../src/wreck-geometry';import{markCollision}from'../src/collision-scars';
const old=async(name:string,overrides:Record<string,string>={})=>{const source=gunzipSync(readFileSync(new URL('./fixtures/large-field-performance/src-'+name+'.ts.gz',import.meta.url))).toString();const compiled=await transform(source.replace(/from '([^']+)'/g,(_all,path)=>`from '${overrides[path]??(path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path))}'`),{loader:'ts',format:'esm',target:'es2022'});return'data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64');};
const coupe=await old('coupe-realism'),wreck=await old('wreck-geometry',{'./coupe-realism':coupe}),scars=await old('collision-scars',{'./wreck-geometry':wreck});
const priorWreck=await import(wreck),priorScars=await import(scars);
const bytes=(a:ArrayBufferView)=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);

test('packed normals and bounds exactly match the installed Three algorithms across topology and attribute layouts',()=>{
 for(const indexed of[true,false])for(const shape of[new T.BoxGeometry(1,2,3,6,5,4),new T.SphereGeometry(2,24,16),new T.PlaneGeometry(4,3,17,13)]){
  const g=indexed?shape:shape.toNonIndexed(),p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+Math.sin(i*1.23)*.07,p.getY(i)+Math.cos(i*.94)*.05,p.getZ(i)+Math.sin(i*.61)*.04);
  const reference=g.clone();reference.computeVertexNormals();reference.computeBoundingBox();reference.computeBoundingSphere();
  computeWreckNormals(g);computeWreckBounds(g);assert.deepEqual(bytes(g.attributes.normal.array),bytes(reference.attributes.normal.array));assert.deepEqual(g.boundingBox,reference.boundingBox);assert.deepEqual(g.boundingSphere,reference.boundingSphere);g.dispose();reference.dispose();if(!indexed)shape.dispose();
 }
 const g=new T.BoxGeometry();g.setAttribute('normal',new T.BufferAttribute(new Int16Array(g.attributes.normal.count*3),3,true));const old=g.clone();old.computeVertexNormals();computeWreckNormals(g);assert.deepEqual(bytes(g.attributes.normal.array),bytes(old.attributes.normal.array));g.dispose();old.dispose();
});

test('all eleven real vehicles preserve every dent, welded normal, scrape, paint value and repair against the frozen release',async()=>{
 await R.init();const load=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
 for(const kind of CAR_KINDS){
  const worlds=[new R.World({x:0,y:0,z:0}),new R.World({x:0,y:0,z:0})],setup=stockSetup(kind),cars=worlds.map(w=>new Vehicle(0,kind,setup.paint,new T.Scene(),w,{emit(){},mark(){},detach(){}}as any,setup));
  const compare=()=>{for(let i=0;i<cars[0].panels.length;i++){const a=cars[0].panels[i],b=cars[1].panels[i];for(const name of['position','normal','impactWear','impactAxis','transferPaint'])assert.deepEqual(bytes(a.geometry.attributes[name].array),bytes(b.geometry.attributes[name].array),kind+' '+a.name+' '+name);assert.deepEqual(a.geometry.boundingBox,b.geometry.boundingBox);assert.deepEqual(a.geometry.boundingSphere,b.geometry.boundingSphere);}};
  try{
   for(let strike=0;strike<12;strike++){
    const sign=strike%2?1:-1,point=new T.Vector3(sign*1.5,.5+(strike%3)*.35,((strike*7)%11-5)*.4),direction=new T.Vector3(-sign,strike%4===0?-.35:0,.15).normalize(),paint=new T.Color(0x996644);
    priorScars.markCollision(cars[0].panels,point,direction,cars[0].surfaceFinish,paint);markCollision(cars[1].panels,point,direction,cars[1].surfaceFinish,paint);compare();
    if(strike%3===2){for(let i=0;i<cars[0].panels.length;i++){const a=cars[0].panels[i],b=cars[1].panels[i];assert.equal(priorWreck.dentGeometry(a,point,direction,18),dentGeometry(b,point,direction,18));}compare();}
   }
   for(let i=0;i<cars[0].panels.length;i++){priorWreck.repairWreckGeometry(cars[0].panels[i]);repairWreckGeometry(cars[1].panels[i]);}compare();
  }finally{cars.forEach(c=>c.dispose());worlds.forEach(w=>w.free());}
 }
});

import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {createStuntWorld} from '../src/stunt-world';
import {gzipSync} from 'node:zlib';import {GLTFLoader} from '../src/model-loader';
test('showground details are batched and release every owned resource exactly once',t=>{
 const art=createStuntWorld(),details:T.InstancedMesh[]=[],resources=new Set<T.EventDispatcher<any>>();art.root.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}if(o instanceof T.InstancedMesh){resources.add(o);if(o.name.startsWith('stunt_detail_'))details.push(o);}});
 assert.equal(details.length,11);const count=details.reduce((n,m)=>n+m.count,0);assert.ok(count>2000&&count<4000);assert.ok(details.every(m=>m.boundingSphere&&Number.isFinite(m.boundingSphere.radius)));let disposed=0;for(const r of resources)r.addEventListener('dispose',()=>disposed++);art.dispose();art.dispose();assert.equal(disposed,resources.size);t.diagnostic(`${count} decorative instances in ${details.length} batches`);
});
test('packed loader accepts gzip transport and browser-decoded GLB, and rejects corrupt bytes',async()=>{
 const keys=['window','location','fetch'] as const,previous=keys.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));const bytes=Uint8Array.from([0x67,0x6c,0x54,0x46,2,0,0,0,12,0,0,0]);
 try{
 Object.defineProperty(globalThis,'window',{value:{},configurable:true});Object.defineProperty(globalThis,'location',{value:new URL('https://example.test/game/'),configurable:true});
 const loader=new GLTFLoader();let parsed:Uint8Array|null=null;loader.parseAsync=async data=>{parsed=new Uint8Array(data as ArrayBuffer);return {} as any;};
 for(const payload of [bytes,gzipSync(bytes)]){Object.defineProperty(globalThis,'fetch',{value:async()=>new Response(payload),configurable:true});parsed=null;await loader.loadAsync('models/coupe.glb');assert.deepEqual(parsed,bytes);}
 Object.defineProperty(globalThis,'fetch',{value:async()=>new Response('corrupt model'),configurable:true});await assert.rejects(loader.loadAsync('models/coupe.glb'));
 }finally{keys.forEach((k,i)=>{const descriptor=previous[i];if(descriptor)Object.defineProperty(globalThis,k,descriptor);else Reflect.deleteProperty(globalThis,k);});}
});

test('packed mask responses decode once even when decoded data starts with gzip magic',async()=>{
 const {readPackedResponse}=await import('../src/packed-response');const raw=Uint8Array.from([31,139,22,0,255,0,24,1]);
 assert.deepEqual(new Uint8Array(await readPackedResponse(new Response(raw,{headers:{'Content-Encoding':'gzip'}}))),raw);
 assert.deepEqual(new Uint8Array(await readPackedResponse(new Response(gzipSync(raw)))),raw);
 await assert.rejects(readPackedResponse(new Response(Uint8Array.from([31,139,0]))));
});

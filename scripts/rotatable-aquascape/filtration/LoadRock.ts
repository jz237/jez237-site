import * as T from 'three';
export async function loadRock(){
 const response=await fetch(new URL('./rock-layers.bin.gz',import.meta.url));if(!response.ok)throw Error('The live-rock geometry could not load.');
 const buffer=await new Response(response.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),header=new Uint32Array(buffer,0,16);let offset=64;const result:T.BufferGeometry[]=[];
 for(let i=0;i<header[0];i++){const g=new T.BufferGeometry();for(let a=0;a<5;a++){const count=header[1+i*5+a],bytes=count*[2,2,1,2,4][a];let arr:Float32Array|Uint32Array;if(a===4)arr=new Uint32Array(buffer,offset,count);else{const input=a===0?new Uint16Array(buffer,offset,count):a===2?new Uint8Array(buffer,offset,count):new Int16Array(buffer,offset,count);arr=Float32Array.from(input,v=>a===0?v/16383-2:a===1?v/32767:a===2?v/255:v/2048);}offset+=Math.ceil(bytes/4)*4;if(a===4)g.setIndex(new T.BufferAttribute(arr,1));else g.setAttribute(['position','normal','color','uv'][a],new T.BufferAttribute(arr,a===3?2:3));}result.push(g);}return result;
}

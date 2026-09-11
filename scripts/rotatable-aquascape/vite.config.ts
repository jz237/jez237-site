import {defineConfig} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
export default defineConfig({base:'./',build:{outDir:'dist'},server:{host:'127.0.0.1',port:5187,strictPort:true},plugins:[{
 name:'local-lighting-export',configureServer(server){server.middlewares.use('/__bake_scene',async(req,res)=>{
  if(req.method!=='POST'||req.headers.origin!=='http://127.0.0.1:5187'){res.statusCode=403;res.end();return;}
  try{const chunks:Buffer[]=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>120*1024*1024)throw Error('Geometry export exceeds 120 MB');chunks.push(chunk);}
   const body=Buffer.concat(chunks),data=JSON.parse(body.toString());if(data.version!==1||!Array.isArray(data.meshes))throw Error('Invalid geometry export');
   const folder=resolve('.bake');await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'scene.json'),body);res.end('saved');
  }catch(error){res.statusCode=400;res.end(String(error));}
 });}
}]});

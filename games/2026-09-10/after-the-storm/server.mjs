import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.GAME_ROOT||'.');
http.createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+sep)){res.writeHead(403).end();return;}const f=await readFile(extname(p)?p:resolve(p,'index.html'));res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.bin':'application/octet-stream','.glb':'model/gltf-binary'})[extname(p)]||'text/html');res.end(f);}catch{res.writeHead(404).end('Not found');}}).listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log('After the Storm: http://127.0.0.1:4174'));

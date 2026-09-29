import {cp,readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=import.meta.dirname,repo=path.resolve(root,'../..'),dist=path.join(root,'dist');
const targets=[['demos/hidden-reef-koi',true],['demos/koi-pond-garden',true],['prototypes/hidden-reef/learn/koi-pond',false],['prototypes/hidden-reef-header-preview/learn/koi-pond',false]];
for(const [relative,demo] of targets){
 const destination=path.resolve(repo,relative);
 await mkdir(destination,{recursive:true});
 await cp(dist,destination,{recursive:true});
 let html=await readFile(path.join(dist,'index.html'),'utf8');
 if(!demo)html=html.replace('href="../filtoclear-studio/"','href="../filtoclear/"');
 await writeFile(path.join(destination,'index.html'),html);
 if(demo)await writeFile(path.join(destination,'koi-pond.html'),html);
}
console.log('Synchronized the pond, learning tools and local filter links across all four mounts.');
